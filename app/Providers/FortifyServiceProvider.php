<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();

        // Redirigir según el rol tras el login
        $this->app->singleton(
            \Laravel\Fortify\Contracts\LoginResponse::class,
            fn () => new class implements \Laravel\Fortify\Contracts\LoginResponse {
                public function toResponse($request) {
                    $user = $request->user();

                    // role_id 1 = coordinador, role_id 2 = asesor
                    if ($user->role_id === 2) {
                        return redirect('/asesor');
                    }

                    if ($user->role_id === 1) {
                        return redirect('/coordinador');
                    }

                    return redirect('/dashboard');
                }
            }
        );

        // Redirigir al login después de cerrar sesión
        $this->app->singleton(
            \Laravel\Fortify\Http\Responses\LogoutResponse::class,
            fn () => new class implements \Laravel\Fortify\Contracts\LogoutResponse {
                public function toResponse($request) {
                    return redirect('/login');
                }
            }
        );

        // Lógica personalizada de autenticación
        Fortify::authenticateUsing(function (Request $request) {
            $mapping = [
                'Cédula de Ciudadanía' => 'CC',
                'Tarjeta de Identidad' => 'TI',
                'Cédula Extranjería'   => 'CE',
                'Pasaporte'            => 'PA'
            ];

            $documentType = $mapping[$request->tipo_doc] ?? $request->tipo_doc;

            \Illuminate\Support\Facades\Log::info('Login Attempt:', [
                'doc_number' => $request->document_number,
                'original_type' => $request->tipo_doc,
                'mapped_type' => $documentType
            ]);

            $user = \App\Models\User::where('document_number', $request->document_number)
                ->where('document_type', $documentType)
                ->first();

            if ($user && \Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
                return $user;
            }

            return null;
        });
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'canRegister' => Features::enabled(Features::registration()),
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn () => Inertia::render('auth/register'));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }
}
