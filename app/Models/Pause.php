<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int    $id
 * @property int    $user_id
 * @property string $reason
 * @property \Illuminate\Support\Carbon $started_at
 * @property \Illuminate\Support\Carbon|null $ended_at
 * @property int|null $duration_seconds
 * @property bool   $alert_triggered
 */
#[Fillable([
    'user_id', 'reason', 'started_at', 'ended_at',
    'duration_seconds', 'alert_triggered',
])]
class Pause extends Model
{
    protected function casts(): array
    {
        return [
            'started_at'       => 'datetime',
            'ended_at'         => 'datetime',
            'alert_triggered'  => 'boolean',
            'duration_seconds' => 'integer',
        ];
    }

    protected $appends = ['formatted_duration'];

    public function getFormattedDurationAttribute(): ?string
    {
        if ($this->duration_seconds === null) {
            return null;
        }

        $mins = floor($this->duration_seconds / 60);
        $secs = $this->duration_seconds % 60;

        if ($mins == 0) {
            return "{$secs} segundos";
        } elseif ($secs == 0) {
            return "{$mins} minutos";
        }

        return "{$mins} minutos con {$secs} segundos";
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
