<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = ['number', 'type', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
