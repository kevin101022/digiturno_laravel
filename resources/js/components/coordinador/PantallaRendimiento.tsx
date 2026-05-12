import { useState } from 'react';
import { Icon } from '@iconify/react';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface AsesorRendimiento {
    iniciales: string;
    nombre: string;
    modulo: string;
    turnos: number;
    tmo: string;
    pausas: string;
    calificacion: string;
    estado: 'inactivo' | 'activo' | 'en pausa';
}

interface ChartItem {
    hora: string;
    real: number;
    proyectado: number;
}

interface RendimientoData {
    tmo_global: string;
    turnos_atendidos: number;
    meta_diaria_pct: number;
    tmo_tendencia: string;
    asesores: AsesorRendimiento[];
    chart_data: ChartItem[];
}

interface Props {
    rendimiento: RendimientoData;
}

// ─── Colores fijos ────────────────────────────────────────────────────────────
const C = {
    primary: '#050066',
    primaryBg: '#e1e0ff',
    primaryText: '#05006c',
    amber: '#fdb300',
    amberText: '#271900',
    surface: '#ffffff',
    surfaceLow: '#f5f2fd',
    surfaceHigh: '#eae7f2',
    border: '#c7c5d6',
    textMain: '#1b1b23',
    textSub: '#464554',
    error: '#ba1a1a',
    success: '#137333',
    successBg: '#e6f4ea',
} as const;

// ─── Gráfico de Barras SVG ────────────────────────────────────────────────────
function BarChart({ data }: { data: ChartItem[] }) {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; data: ChartItem } | null>(null);

    if (!data || data.length === 0) return null;

    const MAX_VAL = Math.max(...data.map(d => Math.max(d.real, d.proyectado)), 10) + 20;

    return (
        <div className="relative w-full" style={{ height: 280 }}>
            <svg viewBox="0 0 700 240" className="w-full h-full" aria-label="Gráfico de proyección de demanda vs realidad">
                {/* Grid lines */}
                {[0, Math.floor(MAX_VAL / 3), Math.floor(MAX_VAL * 2 / 3), MAX_VAL].map((v, i) => {
                    const y = 200 - (v / MAX_VAL) * 180;
                    return (
                        <g key={i}>
                            <line x1="40" y1={y} x2="690" y2={y} stroke={C.border} strokeWidth="0.5" strokeOpacity="0.5" />
                            <text x="35" y={y + 4} textAnchor="end" fontSize="10" fill={C.textSub}>{v}</text>
                        </g>
                    );
                })}

                {/* Línea Proyectado */}
                <polyline
                    fill="none"
                    stroke={C.amber}
                    strokeWidth="2.5"
                    strokeDasharray="6 3"
                    points={data.map((d, i) => {
                        const x = 40 + (i / (data.length - 1)) * 650;
                        const y = 200 - (d.proyectado / MAX_VAL) * 180;
                        return `${x},${y}`;
                    }).join(' ')}
                />

                {/* Área bajo línea Real */}
                <defs>
                    <linearGradient id="realGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.primary} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={C.primary} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polygon
                    fill="url(#realGrad)"
                    points={[
                        ...data.map((d, i) => {
                            const x = 40 + (i / (data.length - 1)) * 650;
                            const y = 200 - (d.real / MAX_VAL) * 180;
                            return `${x},${y}`;
                        }),
                        '690,200', '40,200',
                    ].join(' ')}
                />

                {/* Línea Real */}
                <polyline
                    fill="none"
                    stroke={C.primary}
                    strokeWidth="2.5"
                    points={data.map((d, i) => {
                        const x = 40 + (i / (data.length - 1)) * 650;
                        const y = 200 - (d.real / MAX_VAL) * 180;
                        return `${x},${y}`;
                    }).join(' ')}
                />

                {/* Puntos interactivos */}
                {data.map((d, i) => {
                    const x = 40 + (i / (data.length - 1)) * 650;
                    const y = 200 - (d.real / MAX_VAL) * 180;
                    return (
                        <circle
                            key={i}
                            cx={x} cy={y} r="5"
                            fill={C.surface} stroke={C.primary} strokeWidth="2"
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => setTooltip({ x, y, data: d })}
                            onMouseLeave={() => setTooltip(null)}
                        />
                    );
                })}

                {/* Labels eje X */}
                {data.map((d, i) => {
                    const x = 40 + (i / (data.length - 1)) * 650;
                    return (
                        <text key={i} x={x} y="225" textAnchor="middle" fontSize="10" fill={C.textSub}>{d.hora}</text>
                    );
                })}

                {/* Tooltip */}
                {tooltip && (
                    <g>
                        <rect
                            x={tooltip.x - 55} y={tooltip.y - 52} width="110" height="44"
                            rx="6" fill={C.textMain} fillOpacity="0.92"
                        />
                        <text x={tooltip.x} y={tooltip.y - 36} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">
                            {tooltip.data.hora}
                        </text>
                        <text x={tooltip.x} y={tooltip.y - 22} textAnchor="middle" fontSize="10" fill={C.primaryBg}>
                            Real: {tooltip.data.real} · Proy: {tooltip.data.proyectado}
                        </text>
                    </g>
                )}
            </svg>
        </div>
    );
}

// ─── Pantalla Rendimiento ─────────────────────────────────────────────────────
export default function PantallaRendimiento({ rendimiento }: Props) {
    const [periodo, setPeriodo] = useState<'hoy' | 'semana' | 'mes'>('hoy');

    const esTMOAlto = rendimiento.tmo_tendencia.startsWith('+');

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Sub-header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold" style={{ color: C.primary }}>Rendimiento y Proyección</h2>
                    <p className="text-xs mt-0.5" style={{ color: C.textSub }}>Análisis de eficiencia operativa y previsión de demanda.</p>
                </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Gráfico — span 2 */}
                <div
                    className="lg:col-span-2 rounded-xl p-5 flex flex-col"
                    style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-bold" style={{ color: C.textMain }}>Proyección de Demanda vs. Realidad</h3>
                        <button className="p-2 rounded-full transition-colors" style={{ color: C.textSub }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.surfaceHigh)}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                            <Icon icon="material-symbols:more-vert" className="text-xl" />
                        </button>
                    </div>

                    <BarChart data={rendimiento.chart_data} />

                    {/* Leyenda */}
                    <div className="flex items-center justify-center gap-6 mt-4 pt-4" style={{ borderTop: `1px solid ${C.border}40` }}>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: C.primary }} />
                            <span className="text-xs" style={{ color: C.textMain }}>Demanda Real</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: C.amber }} />
                            <span className="text-xs" style={{ color: C.textMain }}>Proyección Histórica</span>
                        </div>
                    </div>

                    {/* Nota Explicativa */}
                    <div className="mt-4 p-3 rounded-lg border border-blue-100" style={{ backgroundColor: '#f0f7ff' }}>
                        <div className="flex gap-2">
                            <Icon icon="material-symbols:info-outline" className="text-blue-600 text-lg shrink-0" />
                            <div className="text-[10px] leading-relaxed text-blue-900">
                                <span className="font-bold block mb-0.5">Guía de Lectura:</span>
                                <p>
                                    La <strong>Demanda Real</strong> muestra el flujo actual de ciudadanos atendidos. La <strong>Proyección</strong> es una estimación calculada multiplicando el tráfico real por el <span className="italic">Factor de Tendencia</span> configurado. Si la línea naranja supera significativamente a la azul en horas futuras, se recomienda habilitar más módulos para prevenir saturación.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="flex flex-col gap-4">
                    {/* TMO Global */}
                    <div
                        className="rounded-xl p-5 flex flex-col justify-between"
                        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>TMO Global</p>
                                <p className="text-4xl font-bold mt-1" style={{ color: C.primary }}>{rendimiento.tmo_global}</p>
                                <p className="text-xs mt-1" style={{ color: C.textSub }}>Minutos por atención</p>
                            </div>
                            <div className="p-3 rounded-lg" style={{ backgroundColor: '#ffdad4' }}>
                                <Icon icon="material-symbols:timer" className="text-xl" style={{ color: '#871f13' }} />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4" style={{ color: esTMOAlto ? C.error : C.success }}>
                            <Icon icon={`material-symbols:trending-${esTMOAlto ? 'up' : 'down'}`} className="text-base" />
                            <span className="text-[11px] font-bold">{rendimiento.tmo_tendencia} vs ayer</span>
                        </div>
                    </div>

                    {/* Turnos Atendidos */}
                    <div
                        className="rounded-xl p-5 flex flex-col justify-between relative overflow-hidden"
                        style={{ backgroundColor: C.primary }}
                    >
                        {/* Decorativo */}
                        <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
                            <Icon icon="material-symbols:groups" style={{ fontSize: 100, color: '#fff' }} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#fff8' }}>Turnos Atendidos</p>
                            <p className="text-4xl font-bold mt-1" style={{ color: '#fff' }}>{rendimiento.turnos_atendidos}</p>
                            <p className="text-xs mt-1" style={{ color: '#fff8' }}>Total en el día</p>
                        </div>
                        <div className="flex items-center gap-1 mt-4 relative z-10" style={{ color: C.amber }}>
                            <Icon icon="material-symbols:check-circle" className="text-base" />
                            <span className="text-[11px] font-bold">{rendimiento.meta_diaria_pct}% Meta Diaria</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla Rendimiento por Asesor */}
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
                <div
                    className="px-5 py-4 flex justify-between items-center"
                    style={{ backgroundColor: C.surfaceLow, borderBottom: `1px solid ${C.border}` }}
                >
                    <h3 className="text-base font-bold" style={{ color: C.textMain }}>Rendimiento por Asesor</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr style={{ backgroundColor: C.surfaceLow, borderBottom: `1px solid ${C.border}` }}>
                                {['Asesor', 'Módulo', 'Turnos', 'TMO', 'Pausas', 'Calificación', 'Estado'].map(h => (
                                    <th key={h} className="py-3 px-5 text-[10px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rendimiento.asesores.map((a, i) => (
                                <tr
                                    key={i}
                                    className="transition-colors"
                                    style={{ borderBottom: i < rendimiento.asesores.length - 1 ? `1px solid ${C.border}40` : 'none' }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.surfaceHigh)}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                >
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                                style={{ backgroundColor: C.primaryBg, color: C.primaryText }}
                                            >
                                                {a.iniciales}
                                            </div>
                                            <span className="font-semibold" style={{ color: C.textMain }}>{a.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5" style={{ color: C.textSub }}>{a.modulo}</td>
                                    <td className="py-4 px-5 font-semibold" style={{ color: C.textMain }}>{a.turnos}</td>
                                    <td className="py-4 px-5 font-medium" style={{ color: parseFloat(a.tmo) > 10 ? C.error : C.textMain }}>
                                        {a.tmo}
                                    </td>
                                    <td className="py-4 px-5" style={{ color: C.textSub }}>{a.pausas}</td>
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-1">
                                            <Icon icon="material-symbols:star" className="text-[#fdb300] text-lg" />
                                            <span className="font-bold" style={{ color: C.textMain }}>{a.calificacion}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        {a.estado === 'activo' ? (
                                            <span
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                                                style={{ backgroundColor: C.successBg, color: C.success, border: `1px solid #ceead6` }}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.success }} />
                                                Activo
                                            </span>
                                        ) : a.estado === 'en pausa' ? (
                                            <span
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                                                style={{ backgroundColor: '#ffdeab', color: '#271900', border: '1px solid #ffba30' }}
                                            >
                                                <Icon icon="material-symbols:coffee" className="text-[10px]" />
                                                En Pausa
                                            </span>
                                        ) : (
                                            <span
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                                                style={{ backgroundColor: '#ffdad6', color: '#93000a', border: '1px solid #ffb4ab' }}
                                            >
                                                <Icon icon="material-symbols:person-off" className="text-[10px]" />
                                                Inactivo
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
