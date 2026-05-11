<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name'])]
class AdvisorType extends Model
{
    public function advisorDetails(): HasMany
    {
        return $this->hasMany(AdvisorDetail::class);
    }
}
