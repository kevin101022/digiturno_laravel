<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Umbrales de alerta configurables por el coordinador (CU-18).
 *
 * @property int    $id
 * @property string $key
 * @property float  $value
 * @property float  $default_value
 * @property string|null $description
 * @property int|null $updated_by
 */
#[Fillable(['key', 'value', 'default_value', 'description', 'updated_by'])]
class AlertThreshold extends Model
{
    protected function casts(): array
    {
        return [
            'value'         => 'float',
            'default_value' => 'float',
        ];
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
