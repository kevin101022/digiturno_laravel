<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Turn;
use App\Models\User;
use App\Models\Attendance;
use App\Models\Pause;
use App\Models\AdvisorDetail;
use App\Models\ModuleAssignment;
use App\Models\DisplayEvent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador para la gestión operativa de los asesores SENA APE.
 */
class AsesorController extends Controller
{
    /** Muestra el panel del asesor. */
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        if (!$user) {
            abort(403, 'Sesión no válida.');
        }
        
        // Estadísticas reales
        $atendidos = Attendance::where('user_id', $user->id)
            ->whereDate('created_at', today())
            ->where('absent', false)
            ->count();
            
        $promedioSegundos = Attendance::where('user_id', $user->id)
            ->whereDate('created_at', today())
            ->where('absent', false)
            ->avg('duration_seconds');
            
        $minutos = floor($promedioSegundos / 60);
        $segundos = $promedioSegundos % 60;
        $tiempoPromedio = sprintf('%02d:%02d', $minutos, $segundos);
        
        $calificacion = \App\Models\Feedback::where('advisor_id', $user->id)
            ->whereDate('session_date', today())
            ->avg('rating');

        $stats = [
            'atendidos_hoy' => $atendidos,
            'tiempo_promedio' => $tiempoPromedio,
            'calificacion' => $calificacion ? number_format($calificacion, 1) : '5.0',
        ];

        return Inertia::render('asesor/index', [
            'stats' => $stats
        ]);
    }

    /**
     * Devuelve la lista de turnos en espera ordenados por prioridad y fecha de creación.
     */
    public function turnosEnEspera(Request $request): JsonResponse
    {
        $user = $request->user();
        $detail = \App\Models\AdvisorDetail::where('user_id', $user->id)->first();
        $isVictimAdvisor = $detail && $detail->advisor_type_id == 1; // 1 = victim_population

        $query = \App\Models\Turn::where('status', 'waiting');

        if ($isVictimAdvisor) {
            // Asesor de víctimas: solo ve víctimas
            $query->where('category', 'victim');
        } else {
            // Asesor general: ve todos menos víctimas
            $query->where('category', '!=', 'victim');
        }

        $turnos = $query->orderByRaw("FIELD(category, 'victim', 'special', 'general', 'business')")
            ->orderBy('created_at', 'asc')
            ->get(['id', 'turn_code', 'category', 'created_at']);

        return response()->json([
            'turnos' => $turnos
        ]);
    }

    /**
     * El asesor acepta manualmente un turno de la lista.
     */
    public function aceptarTurno(Request $request, $turnId)
    {
        $user = $request->user();

        // Obtener el módulo del asesor
        $detail = AdvisorDetail::where('user_id', $user->id)->first();
        $module = $detail ? $detail->module_number : '1';

        $turno = \App\Models\Turn::where('id', $turnId)->where('status', 'waiting')->lockForUpdate()->first();

        if (!$turno) {
            return response()->json(['error' => 'El turno ya fue asignado o no existe.'], 409);
        }

        $turno->update(['status' => 'called']);

        // Registrar el evento para la pantalla pública (TV)
        DisplayEvent::create([
            'turn_id' => $turno->id,
            'advisor_id' => $user->id,
            'module_number' => $module,
            'event_type' => 'called',
        ]);

        // Cambiar estado del asesor a ocupado
        if ($detail) {
            $detail->update(['availability_status' => 'yellow']);
        }

        return response()->json([
            'success' => true,
            'turno' => [
                'id'        => $turno->id,
                'turn_code' => $turno->turn_code,
                'categoria' => $turno->category,
            ],
            'modulo' => $module
        ]);
    }

    /**
     * Actualiza el semáforo de disponibilidad del asesor (green, yellow, red).
     */
    public function actualizarEstado(Request $request)
    {
        $request->validate(['status' => 'required|in:green,yellow,red']);
        
        $detail = AdvisorDetail::firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'availability_status' => 'red',
                'module_number'       => '1', // Por defecto
                'advisor_type_id'     => 2,   // General por defecto
            ]
        );

        $detail->update(['availability_status' => $request->status]);

        return back()->with('message', 'Estado actualizado.');
    }

    /**
     * Inicia formalmente la atención de un turno llamado.
     */
    public function iniciarAtencion(Request $request, int $turnId)
    {
        $user = $request->user();
        $turno = Turn::findOrFail($turnId);

        if ($turno->status !== 'called') {
            return response()->json(['error' => 'El turno debe estar en estado llamado.'], 400);
        }

        DB::transaction(function () use ($turno, $user) {
            $turno->update(['status' => 'attending']);
            
            Attendance::create([
                'turn_id'    => $turno->id,
                'user_id'    => $user->id,
                'started_at' => now(),
            ]);
            
            $detail = AdvisorDetail::where('user_id', $user->id)->first();
            if ($detail) {
                DisplayEvent::create([
                    'turn_id'       => $turno->id,
                    'advisor_id'    => $user->id,
                    'module_number' => $detail->module_number,
                    'event_type'    => 'attending',
                ]);
            }
        });

        return back()->with('message', 'Atención iniciada.');
    }

    /**
     * Finaliza la atención del turno actual.
     */
    public function finalizarAtencion(Request $request, int $turnId)
    {
        $turno = Turn::findOrFail($turnId);
        $attendance = Attendance::where('turn_id', $turnId)->whereNull('ended_at')->first();

        if (!$attendance) {
            return response()->json(['error' => 'No hay una atención activa para este turno.'], 400);
        }

        DB::transaction(function () use ($turno, $attendance, $request) {
            $now = now();
            $duration = $now->diffInSeconds($attendance->started_at);

            $attendance->update([
                'ended_at'         => $now,
                'duration_seconds' => $duration,
            ]);

            $turno->update(['status' => 'completed']);
            
            $detail = AdvisorDetail::firstOrCreate(['user_id' => $request->user()->id]);
            
            DisplayEvent::create([
                'turn_id'       => $turno->id,
                'advisor_id'    => $request->user()->id,
                'module_number' => $detail->module_number,
                'event_type'    => 'completed',
            ]);

            // El asesor queda libre (verde) e intenta recibir el siguiente turno
            $detail->update(['availability_status' => 'green']);
            \App\Services\TurnAssignmentService::asignarSiguienteTurnoAAsesor($detail);
        });

        return back()->with('message', 'Atención finalizada con éxito.');
    }

    /**
     * Marca al ciudadano como ausente si no se presenta tras ser llamado.
     */
    public function marcarAusente(Request $request, int $turnId)
    {
        $turno = Turn::findOrFail($turnId);

        if ($turno->status !== 'called') {
            return response()->json(['error' => 'Solo se pueden marcar como ausentes turnos llamados.'], 400);
        }

        DB::transaction(function () use ($turno, $request) {
            $turno->update(['status' => 'absent']);
            
            $now = now();
            Attendance::create([
                'turn_id'    => $turno->id,
                'user_id'    => $request->user()->id,
                'started_at' => $now,
                'ended_at'   => $now,
                'duration_seconds' => 0,
                'absent'     => 1
            ]);

            $detail = AdvisorDetail::firstOrCreate(['user_id' => $request->user()->id]);
            
            DisplayEvent::create([
                'turn_id'       => $turno->id,
                'advisor_id'    => $request->user()->id,
                'module_number' => $detail->module_number,
                'event_type'    => 'completed', // Pantalla de espera también se limpia para ausentes
            ]);

            // El asesor queda libre (verde) e intenta recibir el siguiente turno
            $detail->update(['availability_status' => 'green']);
            \App\Services\TurnAssignmentService::asignarSiguienteTurnoAAsesor($detail);
        });

        return back()->with('message', 'Turno marcado como ausente.');
    }
    
    /**
     * Vuelve a llamar al turno actual.
     */
    public function reLlamar(Request $request, int $turnId)
    {
        $turno = Turn::findOrFail($turnId);

        if ($turno->status !== 'called') {
            return response()->json(['error' => 'El turno debe estar en estado llamado para poder rellamar.'], 400);
        }
        
        $detail = AdvisorDetail::where('user_id', $request->user()->id)->first();
        if ($detail) {
            DisplayEvent::create([
                'turn_id'       => $turno->id,
                'advisor_id'    => $request->user()->id,
                'module_number' => $detail->module_number,
                'event_type'    => 'recalled',
            ]);
        }

        return back()->with('message', 'Turno llamado nuevamente.');
    }

    /**
     * Inicia o finaliza una pausa para el asesor.
     */
    public function gestionarPausa(Request $request): JsonResponse
    {
        $user = $request->user();
        $pausaActiva = Pause::where('user_id', $user->id)->whereNull('ended_at')->first();
        $detail = AdvisorDetail::where('user_id', $user->id)->first();

        if ($pausaActiva) {
            // Finalizar pausa
            $now = now();
            $pausaActiva->update([
                'ended_at'         => $now,
                'duration_seconds' => $now->diffInSeconds($pausaActiva->started_at),
            ]);
            
            if ($detail) {
                $detail->update(['availability_status' => 'green']);
            }
            
            return response()->json(['message' => 'Pausa finalizada.', 'pausa' => null]);
        }

        // Iniciar pausa
        $request->validate(['reason' => 'required|string|max:100']);
        
        $nuevaPausa = Pause::create([
            'user_id'    => $user->id,
            'reason'     => $request->reason,
            'started_at' => now(),
        ]);
        
        if ($detail) {
            $detail->update(['availability_status' => 'red']);
        }

        return response()->json(['message' => 'Pausa iniciada.', 'pausa' => $nuevaPausa]);
    }

    /**
     * Retorna el historial de atención del asesor en una fecha específica.
     */
    public function historial(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $fecha = $request->query('fecha', today()->toDateString());

        // Estadísticas de ese día
        $atendidos = Attendance::where('user_id', $user->id)
            ->whereDate('created_at', $fecha)
            ->where('absent', false)
            ->count();
            
        $promedioSegundos = Attendance::where('user_id', $user->id)
            ->whereDate('created_at', $fecha)
            ->where('absent', false)
            ->avg('duration_seconds');
            
        $minutos = floor((float)$promedioSegundos / 60);
        $segundos = (int)$promedioSegundos % 60;
        $tiempoPromedio = sprintf('%02d:%02d', $minutos, $segundos);
        
        $calificacion = \App\Models\Feedback::where('advisor_id', $user->id)
            ->whereDate('session_date', $fecha)
            ->avg('rating');

        // Lista de turnos
        $turnos = Attendance::with(['turn', 'turn.user', 'feedback'])
            ->where('user_id', $user->id)
            ->whereDate('created_at', $fecha)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($att) {
                return [
                    'id' => $att->id,
                    'hora' => $att->started_at?->format('H:i:s') ?? '',
                    'codigo_turno' => $att->turn?->turn_code ?? '',
                    'documento' => $att->turn?->user?->document_number ?? '',
                    'categoria' => $att->turn?->category ?? '',
                    'duracion' => sprintf('%02d:%02d', floor((float)$att->duration_seconds / 60), (int)$att->duration_seconds % 60),
                    'estado' => $att->absent ? 'No Presentado' : 'Atendido',
                    'calificacion' => $att->feedback?->rating ?? null,
                ];
            });

        return response()->json([
            'stats' => [
                'atendidos' => $atendidos,
                'tiempo_promedio' => $tiempoPromedio,
                'calificacion' => $calificacion ? number_format((float)$calificacion, 1) : 'N/A',
            ],
            'turnos' => $turnos,
        ]);
    }
}
