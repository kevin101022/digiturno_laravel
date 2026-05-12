import { useState } from 'react';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';

// ─── Colores fijos ────────────────────────────────────────────────────────────
const C = {
    primary:     '#050066',
    primaryBg:   '#e1e0ff',
    primaryText: '#05006c',
    amber:       '#fdb300',
    amberText:   '#271900',
    surface:     '#ffffff',
    surfaceLow:  '#f5f2fd',
    surfaceHigh: '#eae7f2',
    border:      '#c7c5d6',
    textMain:    '#1b1b23',
    textSub:     '#464554',
    error:       '#ba1a1a',
    errorBg:     '#ffdad6',
    success:     '#137333',
    successBg:   '#e6f4ea',
} as const;

// ─── Datos de gráfico ─────────────────────────────────────────────────────────
const BARS_DIARIO = [
    { label: 'Lun', value: 40  },
    { label: 'Mar', value: 60  },
    { label: 'Mié', value: 30  },
    { label: 'Jue', value: 80  },
    { label: 'Vie', value: 70  },
    { label: 'Sáb', value: 95  },
    { label: 'Dom', value: 85  },
];
const BARS_SEMANAL = [
    { label: 'Sem 1', value: 55  },
    { label: 'Sem 2', value: 72  },
    { label: 'Sem 3', value: 48  },
    { label: 'Sem 4', value: 88  },
];
const MAX_BAR = 100;

// ─── Gráfico de Barras ────────────────────────────────────────────────────────
function BarrasChart({ datos }: { datos: typeof BARS_DIARIO }) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const barWidth = Math.floor(600 / datos.length) - 8;

    return (
        <div className="relative w-full" style={{ height: 240 }}>
            <svg viewBox={`0 0 ${datos.length * (barWidth + 8) + 40} 220`} className="w-full h-full" aria-label="Tendencia de turnos atendidos">
                {/* Grid lines */}
                {[25, 50, 75, 100].map(v => {
                    const y = 180 - (v / MAX_BAR) * 160;
                    return (
                        <g key={v}>
                            <line x1="0" x2="100%" y1={y} y2={y} stroke={C.border} strokeWidth="0.5" strokeOpacity="0.4" />
                        </g>
                    );
                })}

                {/* Barras */}
                {datos.map((d, i) => {
                    const x = i * (barWidth + 8) + 20;
                    const barH = (d.value / MAX_BAR) * 160;
                    const y = 180 - barH;
                    const isHovered = hoveredIdx === i;

                    return (
                        <g key={i}>
                            <rect
                                x={x} y={y} width={barWidth} height={barH}
                                rx="4"
                                fill={C.primary}
                                fillOpacity={isHovered ? 0.9 : 0.25 + (d.value / MAX_BAR) * 0.65}
                                style={{ cursor: 'pointer', transition: 'fill-opacity 0.15s' }}
                                onMouseEnter={() => setHoveredIdx(i)}
                                onMouseLeave={() => setHoveredIdx(null)}
                            />
                            {isHovered && (
                                <g>
                                    <rect x={x + barWidth / 2 - 22} y={y - 28} width="44" height="22" rx="4" fill={C.textMain} fillOpacity="0.9" />
                                    <text x={x + barWidth / 2} y={y - 13} textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">{d.value}</text>
                                </g>
                            )}
                            <text x={x + barWidth / 2} y="200" textAnchor="middle" fontSize="10" fill={C.textSub}>{d.label}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

// ─── Pantalla Reportes ────────────────────────────────────────────────────────
interface Props {
    reportes: {
        kpis: {
            volumen_total: number;
            tiempo_promedio: number;
            tasa_ausentismo: number;
        };
        chart_diario: Array<{ label: string; value: number }>;
        chart_semanal: Array<{ label: string; value: number }>;
        filtros: {
            fecha_inicio: string;
            fecha_fin: string;
        };
    };
}

// ─── Pantalla Reportes ────────────────────────────────────────────────────────
export default function PantallaReportes({ reportes }: Props) {
    const [fechaInicio, setFechaInicio] = useState(reportes.filtros.fecha_inicio);
    const [fechaFin,    setFechaFin]    = useState(reportes.filtros.fecha_fin);
    const [granularidad, setGranularidad] = useState<'diario' | 'semanal'>('diario');

    const handleFiltrar = () => {
        router.get('/coordinador', 
            { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
            { preserveState: true, only: ['reportes'] }
        );
    };

    const datos = granularidad === 'diario' ? reportes.chart_diario : reportes.chart_semanal;

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Sub-header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-xl font-bold" style={{ color: C.primary }}>Reportes Históricos</h2>
                    <p className="text-xs mt-1 max-w-xl leading-relaxed" style={{ color: C.textSub }}>
                        Análisis detallado de métricas operacionales basado en el rango de fechas seleccionado.
                    </p>
                </div>
            </div>

            {/* Filtros */}
            <div
                className="rounded-xl p-5 flex flex-col lg:flex-row gap-4 items-end"
                style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
            >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    {[
                        { label: 'Fecha Inicio', type: 'date', value: fechaInicio, onChange: setFechaInicio, icon: 'material-symbols:calendar-today' },
                        { label: 'Fecha Fin',    type: 'date', value: fechaFin,    onChange: setFechaFin,    icon: 'material-symbols:event'          },
                    ].map(f => (
                        <div key={f.label} className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>{f.label}</label>
                            <div className="relative">
                                <Icon icon={f.icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none" style={{ color: C.textSub }} />
                                <input
                                    type={f.type as 'date'}
                                    value={f.value}
                                    onChange={e => f.onChange(e.target.value)}
                                    className="w-full pl-9 pr-4 h-11 rounded-lg text-sm border outline-none"
                                    style={{ backgroundColor: C.surfaceHigh, borderColor: C.border, color: C.textMain }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 w-full lg:w-auto items-end">
                    <button
                        onClick={handleFiltrar}
                        className="h-11 px-6 rounded-lg flex items-center justify-center gap-2 border transition-all text-white font-bold text-xs"
                        style={{ backgroundColor: C.primary, borderColor: C.primary }}
                    >
                        <Icon icon="material-symbols:filter-list" className="text-base" />
                        Aplicar Filtros
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    {
                        label: 'Volumen Total', value: reportes.kpis.volumen_total.toLocaleString(), unit: '',
                        icon: 'material-symbols:groups',
                        trend: 'Histórico', trendUp: true, trendLabel: 'Periodo seleccionado',
                        accentColor: C.primary,
                    },
                    {
                        label: 'Tiempo Promedio', value: reportes.kpis.tiempo_promedio.toString(), unit: 'min',
                        icon: 'material-symbols:timer',
                        trend: 'TMA', trendUp: false, trendLabel: 'Eficiencia de atención',
                        accentColor: C.amber,
                    },
                    {
                        label: 'Tasa de Ausentismo', value: reportes.kpis.tasa_ausentismo.toString(), unit: '%',
                        icon: 'material-symbols:person-off',
                        trend: 'No presentados', trendUp: true, trendLabel: 'Incidencia de abandono',
                        accentColor: C.error,
                    },
                ].map(card => (
                    <div
                        key={card.label}
                        className="rounded-xl p-5 relative overflow-hidden group transition-all"
                        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                    >
                        <div
                            className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all duration-500"
                            style={{ backgroundColor: card.accentColor }}
                        />
                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>{card.label}</p>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: card.accentColor + '15' }}>
                                <Icon icon={card.icon} className="text-xl" style={{ color: card.accentColor }} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1 relative z-10">
                            <span className="text-4xl font-bold" style={{ color: card.accentColor }}>{card.value}</span>
                            {card.unit && <span className="text-base font-medium" style={{ color: C.textSub }}>{card.unit}</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-3 relative z-10">
                            <span
                                className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold"
                                style={{
                                    backgroundColor: C.primaryBg,
                                    color: C.primaryText,
                                }}
                            >
                                {card.trend}
                            </span>
                            <span className="text-[11px]" style={{ color: C.textSub }}>{card.trendLabel}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Gráfico de Tendencia */}
            <div
                className="rounded-xl p-5"
                style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold" style={{ color: C.textMain }}>Tendencia de Turnos Atendidos</h3>
                    <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: C.surfaceHigh }}>
                        {(['diario', 'semanal'] as const).map(g => (
                            <button
                                key={g}
                                onClick={() => setGranularidad(g)}
                                className="px-3 py-1.5 rounded text-[11px] font-bold capitalize transition-all"
                                style={{
                                    backgroundColor: granularidad === g ? C.surface : 'transparent',
                                    color:           granularidad === g ? C.textMain : C.textSub,
                                }}
                            >
                                {g === 'diario' ? 'Diario' : 'Semanal'}
                            </button>
                        ))}
                    </div>
                </div>

                <BarrasChart datos={datos} />

                {/* Nota Explicativa */}
                <div className="mt-6 p-4 rounded-xl border border-blue-100" style={{ backgroundColor: '#f0f7ff' }}>
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <Icon icon="material-symbols:analytics-outline" className="text-blue-600 text-xl" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xs font-bold text-blue-900 mb-1">Guía de Análisis de Reportes:</h4>
                            <p className="text-[11px] leading-relaxed text-blue-800 opacity-90">
                                Este gráfico visualiza el volumen de atenciones efectivas procesadas por el sistema. 
                                <span className="block mt-1">
                                    • <strong>Vista Diaria:</strong> Ideal para identificar los días de mayor afluencia (picos) y ajustar el personal disponible para la próxima semana.
                                </span>
                                <span className="block mt-0.5">
                                    • <strong>Tasa de Ausentismo:</strong> Un porcentaje alto indica ciudadanos que no esperaron su turno; considere revisar los tiempos de espera si esta métrica sube.
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
