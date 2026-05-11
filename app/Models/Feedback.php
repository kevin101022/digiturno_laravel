<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Calificación registrada en el kiosco de feedback en área de salida (CU-19).
 *
 * @property int    $id
 * @property int    $attendance_id
 * @property int    $turn_id
 * @property int    $advisor_id
 * @property string $document_number
 * @property string $session_date
 * @property int    $rating  (1-5 estrellas)
 * @property \Illuminate\Support\Carbon $rated_at
 */
#[Fillable([
    'attendance_id', 'turn_id', 'advisor_id',
    'document_number', 'session_date', 'rating', 'rated_at',
])]
class Feedback extends Model
{
    protected $table = 'feedbacks';

    protected function casts(): array
    {
        return [
            'session_date' => 'date',
            'rated_at'     => 'datetime',
            'rating'       => 'integer',
        ];
    }

    public function attendance(): BelongsTo
    {
        return $this->belongsTo(Attendance::class);
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
