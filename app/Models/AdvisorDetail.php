<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id', 'advisor_type_id', 'module_number',
    'module_type', 'shift', 'availability_status',
])]
class AdvisorDetail extends Model
{
    protected function casts(): array
    {
        return [
            'availability_status' => 'string',
            'module_type'         => 'string',
            'shift'               => 'string',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function advisorType(): BelongsTo
    {
        return $this->belongsTo(AdvisorType::class);
    }
}
