<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int    $id
 * @property int    $turn_id
 * @property int    $user_id
 * @property \Illuminate\Support\Carbon $started_at
 * @property \Illuminate\Support\Carbon|null $ended_at
 * @property int|null $duration_seconds
 * @property bool   $absent
 * @property string|null $observations
 */
#[Fillable([
    'turn_id', 'user_id', 'started_at', 'ended_at',
    'duration_seconds', 'absent', 'observations',
])]
class Attendance extends Model
{
    protected function casts(): array
    {
        return [
            'started_at'       => 'datetime',
            'ended_at'         => 'datetime',
            'absent'           => 'boolean',
            'duration_seconds' => 'integer',
        ];
    }

    public function turn(): BelongsTo
    {
        return $this->belongsTo(Turn::class);
    }

    public function advisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function feedback(): HasOne
    {
        return $this->hasOne(Feedback::class);
    }
}
