<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Turn;
use App\Models\AdvisorDetail;
use App\Models\DisplayEvent;
use Illuminate\Support\Facades\DB;

/**
 * Servicio encargado de la lógica de asignación automática de turnos (v5).
 */
class TurnAssignmentService
{
    /**
     * Intenta asignar un turno específico a cualquier asesor disponible.
     * Útil cuando se genera un turno en el Kiosco.
     */
    public static function asignarTurnoAAsesorDisponible(Turn $turno): bool
    {
        // Especialidad: 1 (victims) para 'victim', 2 (general_public) para 'general'
        $advisorTypeId = ($turno->queue_type === 'victim') ? 1 : 2;

        return DB::transaction(function () use ($turno, $advisorTypeId) {
            $query = AdvisorDetail::where('availability_status', 'green');

            if ($turno->queue_type === 'victim') {
                // Turnos de víctimas SOLO para asesores de víctimas
                $query->where('advisor_type_id', 1);
            } else {
                // Turnos generales para CUALQUIER asesor, pero priorizamos al general
                $query->orderByRaw("FIELD(advisor_type_id, 2, 1)");
            }

            $advisor = $query->lockForUpdate()->first();

            if ($advisor) {
                self::ejecutarAsignacion($turno, $advisor);
                return true;
            }

            return false;
        });
    }

    /**
     * Intenta asignar cualquier turno en espera a un asesor específico que acaba de quedar libre.
     * Útil cuando un asesor termina una atención o se pone en "verde".
     */
    public static function asignarSiguienteTurnoAAsesor(AdvisorDetail $advisor): bool
    {
        if ($advisor->availability_status !== 'green') {
            return false;
        }

        // Tipo de cola que atiende este asesor
        $queueType = ($advisor->advisor_type_id === 1) ? 'victim' : 'general';

        return DB::transaction(function () use ($advisor) {
            $query = Turn::where('status', 'waiting');

            if ($advisor->advisor_type_id !== 1) {
                // Asesor general: SOLO atiende turnos generales
                $query->where('queue_type', '!=', 'victim');
            } else {
                // Asesor de víctimas: atiende TODO, pero prioriza víctimas
                $query->orderByRaw("FIELD(queue_type, 'victim', 'general')");
            }

            $turno = $query->orderBy('created_at', 'asc')
                ->lockForUpdate()
                ->first();

            if ($turno) {
                self::ejecutarAsignacion($turno, $advisor);
                return true;
            }

            return false;
        });
    }

    /**
     * Ejecuta los cambios físicos en la BD para formalizar la asignación.
     */
    private static function ejecutarAsignacion(Turn $turno, AdvisorDetail $advisor): void
    {
        // 1. Actualizar estado del turno
        $turno->update(['status' => 'called']);

        // 2. Registrar evento de pantalla (TV)
        DisplayEvent::create([
            'turn_id'       => $turno->id,
            'advisor_id'    => $advisor->user_id,
            'module_number' => $advisor->module_number,
            'event_type'    => 'called',
        ]);

        // 3. Cambiar semáforo del asesor a AMARILLO (ocupado/llamando)
        $advisor->update(['availability_status' => 'yellow']);
    }
}
