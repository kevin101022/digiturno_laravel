<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Evento emitido a la pantalla del área de espera (CU-04, CU-13).
 * Registros inmutables — solo INSERT.
 *
 * @property int    $id
 * @property int    $turn_id
 * @property int    $advisor_id
 * @property string $module_number
 * @property string $event_type  called|recalled|attending|completed
 * @property bool   $screen_lost
 * @property \Illuminate\Support\Carbon $created_at
 */
#[Fillable([
    'turn_id', 'advisor_id', 'module_number',
    'event_type', 'screen_lost',
])]
class DisplayEvent extends Model
{
    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'screen_lost' => 'boolean',
            'created_at'  => 'datetime',
        ];
    }

    public function turn(): BelongsTo
    {
        return $this->belongsTo(Turn::class);
    }

    public function advisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'advisor_id');
    }
}
