<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
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
        $this->configureDefaults();

        // Al cerrar sesión, si es asesor, ponerlo en estado inactivo (red) y finalizar pausas pendientes
        \Illuminate\Support\Facades\Event::listen(
            \Illuminate\Auth\Events\Logout::class,
            function (\Illuminate\Auth\Events\Logout $event) {
                if ($event->user && $event->user->role_id == 2) {
                    \App\Models\AdvisorDetail::where('user_id', $event->user->id)
                        ->update(['availability_status' => 'red']);
                        
                    // También cerrar cualquier pausa abierta si la había
                    \App\Models\Pause::where('user_id', $event->user->id)
                        ->whereNull('ended_at')
                        ->update([
                            'ended_at' => now(),
                            'duration_seconds' => \Illuminate\Support\Facades\DB::raw('TIMESTAMPDIFF(SECOND, started_at, NOW())')
                        ]);
                }
            }
        );
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
