<?php

namespace App\Http\Controllers;

use App\Models\AdvisorDetail;
use App\Models\AdvisorType;
use App\Models\AlertThreshold;
use App\Models\Attendance;
use App\Models\Module;
use App\Models\ModuleAssignment;
use App\Models\Pause;
use App\Models\Feedback;
use App\Models\Turn;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class CoordinadorController extends Controller
{
    /**
     * Muestra el portal principal del coordinador con datos reales.
     */
    public function index(Request $request): Response
    {
        $coordinador = $request->user();
        $shift = $request->query('shift', 'morning');

        return Inertia::render('coordinador/index', [
            'kpis'                => $this->buildKpis(),
            'modulos'             => $this->buildModulos(),
            'mesas'               => $this->buildMesas($shift),
            'asesores_disponibles'=> $this->buildAsesoresDisponibles(),
            'asesores_registrados'=> $this->buildAsesoresRegistrados(),
            'rendimiento'         => $this->buildRendimiento(),
            'cola'                => $this->buildCola(),
            'config'              => $this->buildConfig(),
            'alertas'             => $this->buildAlertas(),
            'shift_actual'        => $shift,
            'coordinador'         => [
                'nombre' => $coordinador->first_name . ' ' . $coordinador->last_name,
                'rol'    => 'Coordinador APE',
                'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($coordinador->first_name . '+' . $coordinador->last_name) . '&background=050066&color=fff',
            ],
            'reportes'            => $this->buildReportes($request),
        ]);
    }

    /**
     * Endpoint JSON para polling del dashboard.
     */
    public function metricas(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'kpis'    => $this->buildKpis(),
            'modulos' => $this->buildModulos(),
            'cola'    => $this->buildCola(),
            'alertas' => $this->buildAlertas(),
        ]);
    }

    // ─── Gestión de Asesores ──────────────────────────────────────────────────

    public function storeAsesor(Request $request)
    {
        $request->validate([
            'nombre'     => 'required|string|max:255',
            'numero_doc' => 'required|string|unique:users,document_number',
            'password'   => 'required|string|min:6',
            'especialidades' => 'required|array', // ['general', 'victimas']
        ]);

        DB::transaction(function () use ($request) {
            $names = explode(' ', $request->nombre, 2);
            
            $user = User::create([
                'name'            => $request->nombre,
                'first_name'      => $names[0],
                'last_name'       => $names[1] ?? '',
                'document_number' => $request->numero_doc,
                'password'        => Hash::make($request->password),
                'role_id'         => 2, // Asesor
            ]);

            // Determinar tipo basado en especialidades
            $typeName = in_array('victimas', $request->especialidades) ? 'victim_population' : 'general_public';
            $type = AdvisorType::where('name', $typeName)->first();

            AdvisorDetail::create([
                'user_id'             => $user->id,
                'advisor_type_id'     => $type?->id ?? 1,
                'availability_status' => 'red', // Desconectado por defecto
            ]);
        });

        return back()->with('success', 'Asesor registrado correctamente');
    }

    public function updateAsesor(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'nombre'     => 'required|string|max:255',
            'numero_doc' => 'required|string|unique:users,document_number,' . $id,
            'activo'     => 'required|boolean',
            'especialidades' => 'required|array',
        ]);

        DB::transaction(function () use ($request, $user) {
            $names = explode(' ', $request->nombre, 2);
            $user->update([
                'name'            => $request->nombre,
                'first_name'      => $names[0],
                'last_name'       => $names[1] ?? '',
                'document_number' => $request->numero_doc,
                'active'          => $request->activo,
            ]);

            $typeName = in_array('victimas', $request->especialidades) ? 'victim_population' : 'general_public';
            $type = AdvisorType::where('name', $typeName)->first();

            $user->advisorDetail()->update([
                'advisor_type_id' => $type?->id ?? 1,
            ]);
        });

        return back()->with('success', 'Asesor actualizado');
    }

    public function deleteAsesor(string $id)
    {
        $user = User::findOrFail($id);
        if ($user->role_id == 2) {
            $user->delete();
        }
        return back()->with('success', 'Asesor eliminado');
    }

    // ─── Gestión de Módulos ───────────────────────────────────────────────────

    public function storeModulo(Request $request)
    {
        $request->validate([
            'numero' => 'required|integer|unique:modules,number',
        ]);

        Module::create([
            'number' => $request->numero,
            'type'   => 'general',
        ]);

        return back()->with('success', 'Módulo creado');
    }

    public function deleteModulo(string $id)
    {
        $modulo = Module::findOrFail($id);
        $modulo->delete();
        return back()->with('success', 'Módulo eliminado');
    }

    public function asignarModulo(Request $request)
    {
        $request->validate([
            'shift'        => 'required|in:morning,afternoon',
            'asignaciones' => 'array', // Permitimos array vacío para limpiar totalmente el turno
        ]);

        $date = today()->toDateString();
        $assignedBy = Auth::id();

        DB::transaction(function () use ($request, $date, $assignedBy) {
            // Eliminar asignaciones previas del mismo turno/fecha para refrescar
            ModuleAssignment::where('date', $date)
                ->where('shift', $request->shift)
                ->delete();

            foreach ($request->asignaciones as $asig) {
                if ($asig['user_id']) {
                    ModuleAssignment::create([
                        'module_number' => $asig['modulo_num'],
                        'module_type'   => $asig['tipo'],
                        'advisor_id'    => $asig['user_id'],
                        'shift'         => $request->shift,
                        'date'          => $date,
                        'assigned_by'   => $assignedBy,
                    ]);

                    // Actualizar el detalle del asesor para el estado "en vivo" 
                    // (Solo si estamos en el turno actual, pero para simplificar lo actualizamos siempre)
                    $detail = AdvisorDetail::where('user_id', $asig['user_id'])->first();
                    if ($detail) {
                        $detail->update([
                            'module_number' => $asig['modulo_num'],
                        ]);
                    }
                }
            }
        });

        return back()->with('success', 'Asignación guardada para el turno');
    }

    // ─── Gestión de Configuración ─────────────────────────────────────────────

    public function updateConfig(Request $request)
    {
        $request->validate([
            'tee_maximo'      => 'required|numeric|min:1',
            'saturacion_sala' => 'required|numeric|min:1|max:100',
            'ratio_tendencia' => 'required|numeric|min:0.1',
            'duracion_pausas' => 'required|numeric|min:1',
            'daily_goal'      => 'required|numeric|min:1',
        ]);

        $mappings = [
            'tee_maximo'      => 'waiting_time_threshold',
            'saturacion_sala' => 'saturation_threshold',
            'ratio_tendencia' => 'trend_multiplier',
            'duracion_pausas' => 'pause_time_limit',
            'daily_goal'      => 'daily_goal',
        ];

        try {
            DB::transaction(function () use ($request, $mappings) {
                foreach ($request->only(array_keys($mappings)) as $key => $value) {
                    AlertThreshold::updateOrCreate(
                        ['key' => $mappings[$key]],
                        ['value' => $value, 'updated_by' => Auth::id()]
                    );
                }
            });
            return back()->with('success', 'Configuración actualizada correctamente');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al guardar la configuración: ' . $e->getMessage());
        }
    }

    public function resetConfig()
    {
        $defaults = [
            'waiting_time_threshold' => 45,
            'saturation_threshold'   => 85,
            'trend_multiplier'       => 1.5,
            'pause_time_limit'       => 15,
            'daily_goal'             => 100,
        ];

        try {
            DB::transaction(function () use ($defaults) {
                foreach ($defaults as $key => $value) {
                    AlertThreshold::updateOrCreate(
                        ['key' => $key],
                        ['value' => $value, 'updated_by' => Auth::id()]
                    );
                }
            });
            return back()->with('success', 'Configuración restaurada a valores por defecto');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al restaurar configuración');
        }
    }

    // ─── Auxiliares de construcción ───────────────────────────────────────────

    private function buildMesas(string $shift): array
    {
        $modules = Module::orderBy('number')->get();
        $date = today()->toDateString();
        
        $assignments = ModuleAssignment::with('advisor')
            ->where('date', $date)
            ->where('shift', $shift)
            ->get()
            ->keyBy('module_number');

        return $modules->map(function ($m) use ($assignments) {
            $asig = $assignments->get($m->number);
            $asesor = null;
            if ($asig && $asig->advisor) {
                $asesor = [
                    'id'        => $asig->advisor->id,
                    'nombre'    => $asig->advisor->name,
                    'iniciales' => strtoupper(substr($asig->advisor->first_name, 0, 1) . substr($asig->advisor->last_name, 0, 1)),
                    'especialidad' => $asig->module_type === 'victim' ? 'Atención Víctimas' : 'Especialista General',
                ];
            }

            return [
                'id'             => $m->id,
                'numero'         => $m->number,
                'tipo'           => $m->type === 'victim' ? 'Víctimas' : 'General',
                'asesorAsignado' => $asesor,
            ];
        })->toArray();
    }

    private function buildConfig(): array
    {
        $thresholds = AlertThreshold::all();
        $config = $thresholds->pluck('value', 'key');
        $lastUpdate = $thresholds->max('updated_at');

        return [
            'tee_maximo'      => $config->get('waiting_time_threshold', 45),
            'saturacion_sala' => $config->get('saturation_threshold', 85),
            'ratio_tendencia' => $config->get('trend_multiplier', 1.5),
            'duracion_pausas' => $config->get('pause_time_limit', 15),
            'daily_goal'      => $config->get('daily_goal', 100),
            'system_state'    => [
                'ultima_actualizacion' => $lastUpdate ? $lastUpdate->diffForHumans() : 'Nunca',
                'nodos_activos'        => '1 / 1', // Podría ser dinámico si hubiera múltiples servidores
                'version'              => 'v2.5.0',
            ]
        ];
    }

    private function buildKpis(): array
    {
        $turnosTotalesHoy = Turn::whereDate('created_at', today())->count();

        $tiempoPromedioSegundos = Attendance::whereDate('started_at', today())
            ->where('absent', false)
            ->whereNotNull('duration_seconds')
            ->avg('duration_seconds');

        $tiempoPromedioMinutos = $tiempoPromedioSegundos
            ? (int) round($tiempoPromedioSegundos / 60)
            : 0;

        $asesoresActivos = AdvisorDetail::whereIn('availability_status', ['green', 'yellow'])->count();
        $totalAsesores   = AdvisorDetail::count();

        $turnosEnEspera  = Turn::where('status', 'waiting')->whereDate('created_at', today())->count();

        return [
            'turnos_totales_hoy'     => $turnosTotalesHoy,
            'tiempo_promedio_espera' => $tiempoPromedioMinutos,
            'ventanillas_activas'    => $asesoresActivos,
            'ventanillas_total'      => $totalAsesores,
            'turnos_en_espera'       => $turnosEnEspera,
        ];
    }

    private function buildModulos(): array
    {
        $asesores = User::with(['advisorDetail.advisorType'])
            ->where('role_id', 2)
            ->where('active', true)
            ->get();

        return $asesores->map(function (User $asesor) {
            $detail = $asesor->advisorDetail;
            if (!$detail) return null;

            $atencionActiva = Attendance::with('turn')
                ->where('user_id', $asesor->id)
                ->whereNull('ended_at')
                ->where('absent', false)
                ->latest('started_at')
                ->first();

            $tiempoActual = null;
            $turnoCode = null;

            if ($atencionActiva) {
                $segundos = now()->diffInSeconds($atencionActiva->started_at);
                $tiempoActual = sprintf('%02d:%02d', floor($segundos / 60), $segundos % 60);
                $turnoCode = $atencionActiva->turn?->turn_code;
            }

            $pausaActiva = Pause::where('user_id', $asesor->id)
                ->whereNull('ended_at')
                ->latest('started_at')
                ->first();
            if ($pausaActiva) {
                $segPausa = now()->diffInSeconds($pausaActiva->started_at);
                $tiempoActual = sprintf('%02d:%02d', floor($segPausa / 60), $segPausa % 60);
            }

            $estado = match($detail->availability_status) {
                'green'  => 'disponible',
                'yellow' => 'atendiendo',
                'red'    => $pausaActiva ? 'pausa' : 'desconectado',
                default  => 'desconectado',
            };

            if ($estado === 'atendiendo' && !$turnoCode) {
                $calledTurn = Turn::where('status', 'called')
                    ->whereHas('displayEvents', fn($q) => $q->where('advisor_id', $asesor->id)->latest())
                    ->latest()->first();
                if ($calledTurn) {
                    $turnoCode = $calledTurn->turn_code;
                }
            }


            $nombreCompleto = trim($asesor->first_name . ' ' . $asesor->last_name);
            $partes         = explode(' ', $nombreCompleto);
            $iniciales      = strtoupper(substr($partes[0] ?? 'A', 0, 1) . substr($partes[1] ?? 'A', 0, 1));

            return [
                'id'        => $asesor->id,
                'nombre'    => $nombreCompleto ?: $asesor->name,
                'iniciales' => $iniciales,
                'modulo'    => 'Módulo ' . str_pad((string)($detail->module_number ?? '1'), 2, '0', STR_PAD_LEFT),
                'estado'    => $estado,
                'turno'     => $turnoCode,
                'tiempo'    => $tiempoActual,
            ];
        })->filter()->values()->toArray();
    }

    private function buildAsesoresDisponibles(): array
    {
        $asesores = User::with(['advisorDetail.advisorType'])
            ->where('role_id', 2)
            ->where('active', true)
            ->get();

        return $asesores->map(function (User $asesor) {
            $detail = $asesor->advisorDetail;
            if (!$detail) return null;

            $nombreCompleto = trim($asesor->first_name . ' ' . $asesor->last_name);
            $partes         = explode(' ', $nombreCompleto);
            $iniciales      = strtoupper(substr($partes[0] ?? 'A', 0, 1) . substr($partes[1] ?? 'A', 0, 1));

            $tipoBonito = match($detail->advisorType?->name) {
                'victim_population' => 'Atención Víctimas',
                'general_public'    => 'Especialista General',
                default             => 'Asesor',
            };

            return [
                'id'           => $asesor->id,
                'iniciales'    => $iniciales,
                'nombre'       => $nombreCompleto ?: $asesor->name,
                'especialidad' => $tipoBonito,
                'activo'       => true, // Para asignación, mostramos todos los que existen
                'estado'       => $detail->availability_status,
            ];
        })->filter()->values()->toArray();
    }

    private function buildAsesoresRegistrados(): array
    {
        $asesores = User::with(['advisorDetail.advisorType'])
            ->where('role_id', 2)
            ->get();

        return $asesores->map(function (User $asesor) {
            $detail = $asesor->advisorDetail;
            
            $esps = [];
            if ($detail?->advisorType) {
                $esps[] = match($detail->advisorType->name) {
                    'victim_population' => 'victimas',
                    'general_public'    => 'general',
                    default             => 'general',
                };
            } else {
                $esps[] = 'general';
            }

            return [
                'id'             => $asesor->id,
                'nombre'         => $asesor->name,
                'tipo_doc'       => 'Cédula de Ciudadanía',
                'numero_doc'     => $asesor->document_number,
                'especialidades' => $esps,
                'activo'         => (bool) $asesor->active,
            ];
        })->values()->toArray();
    }

    private function buildRendimiento(): array
    {
        $thresholds = AlertThreshold::all()->pluck('value', 'key');
        $metaDiaria = $thresholds->get('daily_goal', 100);
        $trendRatio = $thresholds->get('trend_multiplier', 1.5);

        $tmaSegundos = Attendance::whereDate('started_at', today())
            ->where('absent', false)
            ->whereNotNull('duration_seconds')
            ->avg('duration_seconds') ?? 0;

        $tmaGlobal = sprintf('%02d:%02d', floor($tmaSegundos / 60), (int)$tmaSegundos % 60);

        $turnosAtendidos = Attendance::whereDate('started_at', today())->where('absent', false)->count();

        $porAsesor = User::with('advisorDetail')
            ->where('role_id', 2)
            ->get()
            ->map(function (User $asesor) {
                $detail = $asesor->advisorDetail;

                $atendidos = Attendance::where('user_id', $asesor->id)
                    ->whereDate('started_at', today())
                    ->where('absent', false)
                    ->count();

                $tmaAsesorSeg = Attendance::where('user_id', $asesor->id)
                    ->whereDate('started_at', today())
                    ->where('absent', false)
                    ->whereNotNull('duration_seconds')
                    ->avg('duration_seconds') ?? 0;

                $pausasHoy = Pause::where('user_id', $asesor->id)
                    ->whereDate('started_at', today())
                    ->count();

                $pausasSegHoy = Pause::where('user_id', $asesor->id)
                    ->whereDate('started_at', today())
                    ->whereNotNull('duration_seconds')
                    ->sum('duration_seconds');

                $pausasMin = (int) round($pausasSegHoy / 60);

                $calificacion = Feedback::where('advisor_id', $asesor->id)
                    ->whereDate('session_date', today())
                    ->avg('rating');

                $nombreCompleto = trim($asesor->first_name . ' ' . $asesor->last_name);
                $partes         = explode(' ', $nombreCompleto);
                $iniciales      = strtoupper(substr($partes[0] ?? 'A', 0, 1) . substr($partes[1] ?? 'A', 0, 1));

                return [
                    'iniciales'    => $iniciales,
                    'nombre'       => $nombreCompleto ?: $asesor->name,
                    'modulo'       => 'Módulo ' . str_pad((string)($detail?->module_number ?? '1'), 2, '0', STR_PAD_LEFT),
                    'turnos'       => $atendidos,
                    'tmo'          => sprintf('%02d:%02d', floor($tmaAsesorSeg / 60), (int)$tmaAsesorSeg % 60),
                    'pausas'       => "{$pausasHoy} ({$pausasMin}m)",
                    'calificacion' => $calificacion ? number_format($calificacion, 1) : '5.0',
                    'estado'       => $pausasHoy > 0 && Pause::where('user_id', $asesor->id)->whereNull('ended_at')->exists() 
                        ? 'en pausa' 
                        : (in_array($detail?->availability_status, ['green', 'yellow']) ? 'activo' : 'inactivo'),
                ];
            })
            ->filter()
            ->values()
            ->toArray();

        // Datos del gráfico basados en datos reales + proyección configurada
        $chartData = [];
        $startHour = 8;
        $endHour = 17;
        for ($h = $startHour; $h <= $endHour; $h++) {
            $real = Attendance::whereDate('started_at', today())
                ->where('absent', false)
                ->whereRaw('HOUR(started_at) = ?', [$h])
                ->count();
            
            // Proyección lógica: flujo actual multiplicado por el ratio de tendencia configurado
            $proyectado = (int) round($real * $trendRatio);
            if ($h > now()->hour && $real == 0) {
                // Para horas futuras, proyectar basado en el promedio de las horas pasadas
                $avgPast = Attendance::whereDate('started_at', today())
                    ->where('absent', false)
                    ->whereRaw('HOUR(started_at) < ?', [now()->hour])
                    ->count() / max(1, (now()->hour - $startHour));
                $proyectado = (int) round($avgPast * $trendRatio);
            }

            $chartData[] = [
                'hora' => sprintf('%02d:00', $h),
                'real' => $real,
                'proyectado' => max(0, $proyectado),
            ];
        }

        return [
            'tmo_global'       => $tmaGlobal,
            'turnos_atendidos' => $turnosAtendidos,
            'meta_diaria_pct'  => $metaDiaria > 0 ? min(100, (int)(($turnosAtendidos / $metaDiaria) * 100)) : 0,
            'tmo_tendencia'    => '+0%',
            'asesores'         => $porAsesor,
            'chart_data'       => $chartData,
        ];
    }

    private function buildReportes(Request $request): array
    {
        $fechaInicio = $request->query('fecha_inicio', today()->subDays(30)->toDateString());
        $fechaFin = $request->query('fecha_fin', today()->toDateString());

        $queryAttendances = Attendance::where('absent', false)
            ->whereDate('started_at', '>=', $fechaInicio)
            ->whereDate('started_at', '<=', $fechaFin);

        $queryTurns = Turn::whereDate('created_at', '>=', $fechaInicio)
            ->whereDate('created_at', '<=', $fechaFin);

        $volumenTotal = $queryAttendances->count();
        
        $tiempoPromedioSegundos = (clone $queryAttendances)->whereNotNull('duration_seconds')->avg('duration_seconds');
        $tiempoPromedioMinutos = $tiempoPromedioSegundos ? (int) round($tiempoPromedioSegundos / 60) : 0;
        
        $totalTurnos = $queryTurns->count();
        $turnosAusentes = (clone $queryTurns)->where('status', 'absent')->count();
        $tasaAusentismo = $totalTurnos > 0 ? round(($turnosAusentes / $totalTurnos) * 100, 1) : 0;

        $dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        
        $barrasDiario = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = today()->subDays($i);
            $count = Attendance::whereDate('started_at', $date)->where('absent', false)->count();
            $barrasDiario[] = [
                'label' => $dias[$date->dayOfWeek],
                'value' => $count
            ];
        }

        $barrasSemanal = [];
        for ($i = 3; $i >= 0; $i--) {
            $start = today()->subWeeks($i)->startOfWeek();
            $end = today()->subWeeks($i)->endOfWeek();
            $count = Attendance::whereBetween('started_at', [$start, $end])->where('absent', false)->count();
            $barrasSemanal[] = [
                'label' => 'Sem ' . (4 - $i),
                'value' => $count
            ];
        }

        return [
            'kpis' => [
                'volumen_total' => $volumenTotal,
                'tiempo_promedio' => $tiempoPromedioMinutos,
                'tasa_ausentismo' => $tasaAusentismo,
            ],
            'chart_diario' => $barrasDiario,
            'chart_semanal' => $barrasSemanal,
            'filtros' => [
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin,
            ]
        ];
    }

    private function buildCola(): array
    {
        $general = Turn::where('status', 'waiting')
            ->where('queue_type', 'general')
            ->whereDate('created_at', today())
            ->count();

        $victimas = Turn::where('status', 'waiting')
            ->where('queue_type', 'victim')
            ->whereDate('created_at', today())
            ->count();

        $total = $general + $victimas;
        $activos = AdvisorDetail::whereIn('availability_status', ['green', 'yellow'])->count();

        $nivel = 'Baja';
        if ($activos > 0) {
            $ratio = $total / $activos;
            if ($ratio > 3) $nivel = 'Alta';
            elseif ($ratio > 1.5) $nivel = 'Media';
        } elseif ($total > 0) {
            $nivel = 'Alta';
        }

        return [
            'general' => $general,
            'victimas' => $victimas,
            'total'   => $total,
            'nivel'   => $nivel,
        ];
    }

    private function buildAlertas(): array
    {
        $alertas = [];
        $thresholds = AlertThreshold::all()->pluck('value', 'key');

        $teeMaximo = $thresholds->get('waiting_time_threshold', 45);
        $saturacionThreshold = $thresholds->get('saturation_threshold', 85);
        $pauseLimit = $thresholds->get('pause_time_limit', 15);

        // 1. Alerta de Tiempo de Espera (TEE)
        $turnosLentos = Turn::where('status', 'waiting')
            ->whereDate('created_at', today())
            ->where('created_at', '<=', now()->subMinutes($teeMaximo))
            ->count();

        if ($turnosLentos > 0) {
            $alertas[] = [
                'tipo'   => 'error',
                'titulo' => 'Tiempo de Espera Excedido',
                'mensaje' => "Hay {$turnosLentos} turnos esperando por más de {$teeMaximo} minutos.",
            ];
        }

        // 2. Alerta de Saturación de Sala
        $espera = Turn::where('status', 'waiting')->whereDate('created_at', today())->count();
        $activos = AdvisorDetail::whereIn('availability_status', ['green', 'yellow'])->count();

        if ($activos > 0) {
            $ratio = ($espera / $activos) * 10; // Ejemplo de cálculo de saturación
            if ($ratio >= $saturacionThreshold) {
                $alertas[] = [
                    'tipo'   => 'error',
                    'titulo' => 'Saturación Crítica',
                    'mensaje' => "La relación de turnos vs ventanillas activas supera el {$saturacionThreshold}%.",
                ];
            } elseif ($ratio >= ($saturacionThreshold * 0.7)) {
                $alertas[] = [
                    'tipo'   => 'warning',
                    'titulo' => 'Riesgo de Saturación',
                    'mensaje' => 'La sala está alcanzando niveles altos de congestión.',
                ];
            }
        } elseif ($espera > 0) {
            $alertas[] = [
                'tipo'   => 'error',
                'titulo' => 'Sin Ventanillas Activas',
                'mensaje' => 'Hay ciudadanos esperando y no hay asesores disponibles.',
            ];
        }

        // 3. Alerta de Pausas Excedidas
        $pausasExcedidas = Pause::whereNull('ended_at')
            ->whereDate('started_at', today())
            ->where('started_at', '<=', now()->subMinutes($pauseLimit))
            ->count();

        if ($pausasExcedidas > 0) {
            $alertas[] = [
                'tipo'   => 'warning',
                'titulo' => 'Pausas Prolongadas',
                'mensaje' => "{$pausasExcedidas} asesores han superado el tiempo límite de pausa ({$pauseLimit} min).",
            ];
        }

        return $alertas;
    }
}
