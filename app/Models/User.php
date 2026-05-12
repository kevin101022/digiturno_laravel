<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable([
    'role_id',
    'document_type',
    'document_number',
    'first_name',
    'last_name',
    'birth_date',
    'name',
    'email',
    'password',
    'active',
])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, SoftDeletes;

    protected function casts(): array
    {
        return [
            'email_verified_at'      => 'datetime',
            'two_factor_confirmed_at'=> 'datetime',
            'birth_date'             => 'date',
            'password'               => 'hashed',
        ];
    }

    // ── Relaciones ────────────────────────────────────────────────────────

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function turns(): HasMany
    {
        return $this->hasMany(Turn::class);
    }

    public function advisorDetail(): HasOne
    {
        return $this->hasOne(AdvisorDetail::class);
    }

    public function pauses(): HasMany
    {
        return $this->hasMany(Pause::class);
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    public function isCoordinator(): bool
    {
        return $this->role_id === 1;
    }

    public function isAdvisor(): bool
    {
        return $this->role_id === 2;
    }

    public function isClient(): bool
    {
        return $this->role_id === 3;
    }
}
