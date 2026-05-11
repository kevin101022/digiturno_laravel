<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Attendance;
use App\Models\DisplayEvent;

class DisplayController extends Controller
{
    /**
     * Muestra la pantalla principal de visualización (TV) de turnos.
     */
    public function index(): Response
    {
        // Obtener los últimos 5 eventos de llamados únicos por turno
        $eventos = DisplayEvent::with('turn.user')
            // Removido whereDate para evitar bugs de zona horaria entre MySQL y Laravel
            ->whereIn('event_type', ['called', 'recalled'])
            ->orderBy('id', 'desc')
            ->get()
            ->unique('turn_id')
            ->take(5)
            ->values();

        $turnoActual = null;
        $ultimosLlamados = [];

        if ($eventos->isNotEmpty()) {
            $primero = $eventos->first();
            
            // Ofuscación del nombre para Habeas Data
            $nombreCompleto = trim(($primero->turn?->user?->first_name ?? '') . ' ' . ($primero->turn?->user?->last_name ?? ''));
            $partes = explode(' ', $nombreCompleto);
            $nombreMostrar = $partes[0];
            if (count($partes) > 1 && !empty($partes[1])) {
                $nombreMostrar .= ' ' . substr($partes[1], 0, 1) . '.';
            }
            if (empty(trim($nombreMostrar))) {
                $nombreMostrar = 'Ciudadano';
            }

            $modNum = !empty($primero->module_number) ? $primero->module_number : '1';

            $turnoActual = [
                'id' => $primero->id, // Usamos el ID del evento para que dispare el sonido si cambia
                'codigo' => $primero->turn?->turn_code ?? '---',
                'modulo' => 'Módulo ' . str_pad((string)$modNum, 2, '0', STR_PAD_LEFT),
                'ciudadano' => $nombreMostrar
            ];

            // Los demás para la barra lateral
            foreach ($eventos->slice(1) as $ev) {
                $mNum = !empty($ev->module_number) ? $ev->module_number : '1';
                $ultimosLlamados[] = [
                    'codigo' => $ev->turn?->turn_code ?? '---',
                    'modulo' => 'Módulo ' . str_pad((string)$mNum, 2, '0', STR_PAD_LEFT),
                ];
            }
        }

        // Estadísticas del día
        $citasHoy = Attendance::whereDate('started_at', today())->where('absent', false)->count();
        $promedioSegundos = Attendance::whereDate('started_at', today())->where('absent', false)->avg('duration_seconds');
        
        $minutos = floor((float)$promedioSegundos / 60);

        return Inertia::render('display/index', [
            'turnoActual' => $turnoActual,
            'ultimosLlamados' => $ultimosLlamados,
            'stats' => [
                'citasHoy' => $citasHoy,
                'tiempoPromedioMinutos' => $minutos > 0 ? (int)$minutos : 1
            ]
        ]);
    }
}
