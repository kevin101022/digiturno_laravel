<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Asignación de asesor a módulo por turno y fecha (CU-12).
 *
 * @property int    $id
 * @property string $module_number
 * @property string $module_type  general|victim
 * @property int    $advisor_id
 * @property string $shift        morning|afternoon
 * @property string $date
 * @property int    $assigned_by
 */
#[Fillable([
    'module_number', 'module_type', 'advisor_id',
    'shift', 'date', 'assigned_by',
])]
class ModuleAssignment extends Model
{
    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function advisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'advisor_id');
    }

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
}
