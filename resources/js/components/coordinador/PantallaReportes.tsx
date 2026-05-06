import { useState } from 'react';
import { Icon } from '@iconify/react';

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
export default function PantallaReportes() {
    const [fechaInicio, setFechaInicio] = useState('2024-01-01');
    const [fechaFin,    setFechaFin]    = useState('2024-03-31');
    const [sede,        setSede]        = useState('Todas las Sedes');
    const [granularidad, setGranularidad] = useState<'diario' | 'semanal'>('diario');
    const [exportando,  setExportando]  = useState<string | null>(null);

    const handleExport = (tipo: string) => {
        setExportando(tipo);
        setTimeout(() => setExportando(null), 2500);
    };

    const datos = granularidad === 'diario' ? BARS_DIARIO : BARS_SEMANAL;

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Sub-header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-xl font-bold" style={{ color: C.primary }}>Reportes Históricos</h2>
                    <p className="text-xs mt-1 max-w-xl leading-relaxed" style={{ color: C.textSub }}>
                        Análisis detallado de métricas operacionales. Seleccione el rango de fechas para visualizar y exportar la consolidación.
                    </p>
                </div>
                <div className="flex gap-2 shrink-0">
                    {[
                        { label: 'Exportar PDF',   icon: 'material-symbols:picture-as-pdf', tipo: 'PDF'   },
                        { label: 'Exportar Excel', icon: 'material-symbols:table-view',      tipo: 'Excel' },
                    ].map(btn => (
                        <button
                            key={btn.tipo}
                            onClick={() => handleExport(btn.tipo)}
                            disabled={exportando !== null}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors border"
                            style={{
                                backgroundColor: btn.tipo === 'Excel' ? C.primary : C.surface,
                                color:           btn.tipo === 'Excel' ? '#fff'     : C.primary,
                                borderColor:     btn.tipo === 'Excel' ? C.primary  : C.border,
                                opacity:         exportando !== null ? 0.7 : 1,
                            }}
                        >
                            {exportando === btn.tipo
                                ? <Icon icon="material-symbols:progress-activity" className="text-base animate-spin" />
                                : <Icon icon={btn.icon} className="text-base" />
                            }
                            <span className="hidden sm:inline">{btn.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Feedback exportación */}
            {exportando && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ backgroundColor: C.primaryBg, color: C.primaryText }}>
                    <Icon icon="material-symbols:progress-activity" className="text-lg animate-spin" />
                    <span className="text-sm font-bold">Generando reporte {exportando}…</span>
                </div>
            )}

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
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>Sede / Punto</label>
                        <select
                            value={sede}
                            onChange={e => setSede(e.target.value)}
                            className="px-4 h-11 rounded-lg text-sm border outline-none appearance-none"
                            style={{ backgroundColor: C.surfaceHigh, borderColor: C.border, color: C.textMain }}
                        >
                            {['Todas las Sedes', 'Sede Central', 'Punto Norte'].map(s => (
                                <option key={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        className="h-11 w-11 rounded-lg flex items-center justify-center border transition-colors shrink-0"
                        style={{ backgroundColor: C.surfaceLow, borderColor: C.border, color: C.primary }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.surfaceHigh)}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.surfaceLow)}
                        aria-label="Aplicar filtros"
                    >
                        <Icon icon="material-symbols:filter-list" className="text-xl" />
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    {
                        label: 'Volumen Total', value: '12,450', unit: '',
                        icon: 'material-symbols:groups',
                        trend: '+15%', trendUp: true, trendLabel: 'vs. periodo anterior',
                        accentColor: C.primary,
                    },
                    {
                        label: 'Tiempo Promedio', value: '14', unit: 'min',
                        icon: 'material-symbols:timer',
                        trend: '-2.5 min', trendUp: false, trendLabel: 'Mejora en atención',
                        accentColor: C.amber,
                    },
                    {
                        label: 'Tasa de Ausentismo', value: '8.2', unit: '%',
                        icon: 'material-symbols:person-off',
                        trend: '+1.2%', trendUp: true, trendLabel: 'Requiere atención',
                        accentColor: C.error,
                    },
                ].map(card => (
                    <div
                        key={card.label}
                        className="rounded-xl p-5 relative overflow-hidden group transition-all"
                        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                    >
                        {/* Círculo decorativo hover */}
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
                                    backgroundColor: (card.trendUp && card.accentColor === C.error) || (!card.trendUp)
                                        ? C.successBg : C.errorBg,
                                    color: (card.trendUp && card.accentColor === C.error) || (!card.trendUp)
                                        ? C.success : C.error,
                                }}
                            >
                                <Icon
                                    icon={`material-symbols:trending-${card.trendUp ? 'up' : 'down'}`}
                                    className="text-xs"
                                />
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
            </div>
        </div>
    );
}
