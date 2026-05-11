<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * Snapshot periódico de saturación por fila — serie de tiempo (CU-15).
 *
 * @property int    $id
 * @property string $queue_type
 * @property float  $saturation_ratio
 * @property int    $waiting_count
 * @property int    $active_advisors
 * @property float|null $arrival_rate
 * @property float|null $departure_rate
 * @property string $level  green|yellow|red
 * @property string|null $suggestion
 * @property \Illuminate\Support\Carbon $logged_at
 */
#[Fillable([
    'queue_type', 'saturation_ratio', 'waiting_count',
    'active_advisors', 'arrival_rate', 'departure_rate',
    'level', 'suggestion', 'logged_at',
])]
class SaturationLog extends Model
{
    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'saturation_ratio' => 'float',
            'arrival_rate'     => 'float',
            'departure_rate'   => 'float',
            'logged_at'        => 'datetime',
        ];
    }
}
