<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Modelo de turno de atención.
 *
 * @property int    $id
 * @property int    $user_id
 * @property string $turn_code
 * @property string $category    victim | general | special
 * @property string $queue_type  victim | general
 * @property string $status      waiting | called | attending | completed | absent
 * @property \Illuminate\Support\Carbon|null $generated_at
 * @property bool   $ticket_printed
 * @property bool   $ticket_print_failed
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
#[Fillable([
    'user_id', 'turn_code', 'category', 'queue_type',
    'status', 'generated_at', 'ticket_printed', 'ticket_print_failed',
])]
class Turn extends Model
{
    protected function casts(): array
    {
        return [
            'generated_at'        => 'datetime',
            'ticket_printed'      => 'boolean',
            'ticket_print_failed' => 'boolean',
        ];
    }

    // ── Relaciones ────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function currentAttendance(): HasOne
    {
        return $this->hasOne(Attendance::class)->latestOfMany();
    }

    public function feedback(): HasOne
    {
        return $this->hasOne(Feedback::class);
    }

    public function displayEvents(): HasMany
    {
        return $this->hasMany(DisplayEvent::class);
    }

    // ── Scopes ────────────────────────────────────────────────────────────

    public function scopeWaiting($query)
    {
        return $query->where('status', 'waiting');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }
}
