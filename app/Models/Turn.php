<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
#[Fillable(['user_id', 'turn_code', 'category', 'queue_type', 'status', 'generated_at', 'ticket_printed', 'ticket_print_failed'])]
class Turn extends Model
{
    protected function casts(): array
    {
        return [
            'generated_at'       => 'datetime',
            'ticket_printed'     => 'boolean',
            'ticket_print_failed' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
