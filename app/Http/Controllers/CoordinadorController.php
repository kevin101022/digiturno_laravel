<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class CoordinadorController extends Controller
{
    /**
     * Muestra el portal principal del coordinador con datos iniciales.
     */
    public function index()
    {
        return Inertia::render('coordinador/index', [
            'kpis' => [
                'turnos_totales_hoy'    => 1248,
                'tiempo_promedio_espera' => 14,
                'ventanillas_activas'    => 24,
                'ventanillas_total'      => 30,
            ],
            'alertas' => [
                [
                    'tipo'    => 'error',
                    'titulo'  => 'Cuello de Botella Detectado',
                    'mensaje' => 'Módulo B (Orientación) tiene 45 usuarios en espera. Tiempo estimado > 25 min.',
                ],
                [
                    'tipo'    => 'warning',
                    'titulo'  => 'Carga de Sistema Elevada',
                    'mensaje' => 'Picos de registro en Kiosko 1 y 3. Considere habilitar apoyo temporal.',
                ],
            ],
            'modulos' => [
                ['nombre' => 'Ventanilla 01', 'asesor' => 'María Rodríguez', 'iniciales' => 'MR', 'estado' => 'atendiendo', 'turno' => 'A-045', 'tiempo' => '05:20'],
                ['nombre' => 'Ventanilla 02', 'asesor' => 'Juan Pérez',       'iniciales' => 'JP', 'estado' => 'disponible',  'turno' => null,    'tiempo' => null],
                ['nombre' => 'Ventanilla 03', 'asesor' => 'Laura Gómez',      'iniciales' => 'LC', 'estado' => 'pausa',       'turno' => null,    'tiempo' => '12:05'],
                ['nombre' => 'Ventanilla 04', 'asesor' => 'Carlos Mora',      'iniciales' => 'CM', 'estado' => 'atendiendo', 'turno' => 'B-102', 'tiempo' => '02:15'],
            ],
            'asesores_disponibles' => [
                ['iniciales' => 'LM', 'nombre' => 'Laura Martínez',   'especialidad' => 'Especialista General',  'activo' => true],
                ['iniciales' => 'CR', 'nombre' => 'Carlos Rodríguez', 'especialidad' => 'Atención Víctimas',     'activo' => true],
                ['iniciales' => 'AP', 'nombre' => 'Ana Pérez',        'especialidad' => 'General / Empresas',    'activo' => true],
                ['iniciales' => 'JG', 'nombre' => 'Jorge Gómez',      'especialidad' => 'En Descanso (10:30)',   'activo' => false],
            ],
            'rendimiento' => [
                'tmo_global'       => '08:45',
                'turnos_atendidos' => 412,
                'meta_diaria_pct'  => 94,
                'tmo_tendencia'    => '+12%',
                'asesores' => [
                    ['iniciales' => 'CM', 'nombre' => 'Carlos Mendoza', 'modulo' => 'Módulo 1', 'turnos' => 45, 'tmo' => '07:20', 'pausas' => '2 (15m)', 'estado' => 'activo'],
                    ['iniciales' => 'LR', 'nombre' => 'Laura Ramírez',  'modulo' => 'Módulo 2', 'turnos' => 38, 'tmo' => '11:15', 'pausas' => '1 (10m)', 'estado' => 'activo'],
                    ['iniciales' => 'JP', 'nombre' => 'Javier Pérez',   'modulo' => 'Módulo 3', 'turnos' => 42, 'tmo' => '08:05', 'pausas' => '4 (45m)', 'estado' => 'pausa'],
                    ['iniciales' => 'SG', 'nombre' => 'Sofía Gómez',   'modulo' => 'Módulo 4', 'turnos' => 51, 'tmo' => '06:45', 'pausas' => '2 (20m)', 'estado' => 'activo'],
                ],
            ],
            'coordinador' => [
                'nombre' => 'Ana Martínez',
                'rol'    => 'Coordinadora APE',
                'avatar' => 'https://ui-avatars.com/api/?name=Ana+Martinez&background=050066&color=fff',
            ],
        ]);
    }
}
