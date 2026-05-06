import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Kpis {
    turnos_totales_hoy: number;
    tiempo_promedio_espera: number;
    ventanillas_activas: number;
    ventanillas_total: number;
}

interface Alerta {
    tipo: 'error' | 'warning';
    titulo: string;
    mensaje: string;
}

interface Modulo {
    nombre: string;
    asesor: string;
    iniciales: string;
    estado: 'atendiendo' | 'disponible' | 'pausa';
    turno: string | null;
    tiempo: string | null;
}

interface Props {
    kpis: Kpis;
    alertas: Alerta[];
    modulos: Modulo[];
}

// ─── Colores fijos ────────────────────────────────────────────────────────────
const C = {
    primary:     '#050066',
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
    errorText:   '#93000a',
    warnBg:      '#ffdeab',
    warnText:    '#271900',
    indigo:      '#4a4dce',
} as const;

// ─── Badge de Estado ──────────────────────────────────────────────────────────
function EstadoBadge({ estado }: { estado: Modulo['estado'] }) {
    const config = {
        atendiendo: { bg: '#ffdeab', text: '#271900', dot: '#7d5700', label: 'Atendiendo' },
        disponible:  { bg: '#e1e0ff', text: '#05006c', dot: '#050066', label: 'Disponible'  },
        pausa:       { bg: '#e4e1ec', text: '#464554', dot: '#767685', label: 'Pausa'        },
    }[estado];

    return (
        <span
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: config.bg, color: config.text }}
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.dot }} />
            {config.label}
        </span>
    );
}

// ─── Tarjeta KPI ──────────────────────────────────────────────────────────────
function KpiCard({
    label, value, suffix, icon, accentColor,
}: {
    label: string; value: string | number; suffix?: string; icon: string; accentColor: string;
}) {
    return (
        <div
            className="relative rounded-xl p-5 flex flex-col justify-between overflow-hidden"
            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, minHeight: 120 }}
        >
            <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>{label}</span>
                <Icon icon={icon} className="text-2xl" style={{ color: accentColor }} />
            </div>
            <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-bold" style={{ color: C.textMain }}>{value}</span>
                {suffix && <span className="text-xs font-bold" style={{ color: C.textSub }}>{suffix}</span>}
            </div>
            {/* Barra inferior de color */}
            <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: accentColor }} />
        </div>
    );
}

// ─── Pantalla Dashboard ───────────────────────────────────────────────────────
export default function PantallaDashboard({ kpis, alertas, modulos }: Props) {
    const [modulosActivos, setModulosActivos] = useState(modulos);
    const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());

    // Simulación de refresco automático cada 30s
    useEffect(() => {
        const id = setInterval(() => {
            setUltimaActualizacion(new Date());
        }, 30_000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Sub-header con hora de actualización */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold" style={{ color: C.primary }}>Monitoreo en Vivo</h2>
                    <p className="text-xs mt-0.5" style={{ color: C.textSub }}>
                        Última actualización: {ultimaActualizacion.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                </div>
                <button
                    onClick={() => setUltimaActualizacion(new Date())}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors border"
                    style={{ borderColor: C.border, color: C.primary, backgroundColor: C.surface }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.surfaceHigh)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.surface)}
                >
                    <Icon icon="material-symbols:refresh" className="text-lg" />
                    Actualizar
                </button>
            </div>

            {/* ── KPIs ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <KpiCard
                    label="Turnos Totales Hoy"
                    value={kpis.turnos_totales_hoy.toLocaleString('es-CO')}
                    icon="material-symbols:groups"
                    accentColor={C.primary}
                />
                <KpiCard
                    label="Tiempo Prom. Espera"
                    value={kpis.tiempo_promedio_espera}
                    suffix="MIN"
                    icon="material-symbols:timer"
                    accentColor={C.amber}
                />
                <KpiCard
                    label="Ventanillas Activas"
                    value={kpis.ventanillas_activas}
                    suffix={`/ ${kpis.ventanillas_total}`}
                    icon="material-symbols:storefront"
                    accentColor={C.indigo}
                />
            </div>

            {/* ── Bento Grid Principal ───────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Panel de Alertas */}
                <div
                    className="lg:col-span-1 rounded-xl p-5 flex flex-col gap-4"
                    style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                >
                    <div className="flex items-center gap-2 pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
                        <Icon icon="material-symbols:warning" className="text-xl" style={{ color: C.error }} />
                        <h3 className="text-base font-bold" style={{ color: C.textMain }}>Alertas del Sistema</h3>
                    </div>

                    <div className="flex flex-col gap-3">
                        {alertas.map((alerta, i) => (
                            <div
                                key={i}
                                className="rounded-lg p-3 flex gap-3 items-start"
                                style={{
                                    backgroundColor: alerta.tipo === 'error' ? C.errorBg : C.warnBg,
                                    color:           alerta.tipo === 'error' ? C.errorText : C.warnText,
                                }}
                            >
                                <Icon
                                    icon={alerta.tipo === 'error' ? 'material-symbols:error' : 'material-symbols:info'}
                                    className="text-xl shrink-0 mt-0.5"
                                />
                                <div>
                                    <p className="text-[11px] font-bold mb-1">{alerta.titulo}</p>
                                    <p className="text-[11px] leading-relaxed">{alerta.mensaje}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {alertas.length === 0 && (
                        <div className="flex flex-col items-center gap-2 py-6 text-center">
                            <Icon icon="material-symbols:check-circle" className="text-4xl" style={{ color: '#2e7d32' }} />
                            <p className="text-sm font-bold" style={{ color: C.textSub }}>Sin alertas activas</p>
                        </div>
                    )}
                </div>

                {/* Tabla Estado de Módulos */}
                <div
                    className="lg:col-span-2 rounded-xl overflow-hidden flex flex-col"
                    style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                >
                    {/* Header tabla */}
                    <div
                        className="px-5 py-4 flex justify-between items-center"
                        style={{ backgroundColor: C.surfaceLow, borderBottom: `1px solid ${C.border}` }}
                    >
                        <div className="flex items-center gap-2">
                            <Icon icon="material-symbols:view-module" className="text-xl" style={{ color: C.primary }} />
                            <h3 className="text-base font-bold" style={{ color: C.textMain }}>Estado de Módulos</h3>
                        </div>
                        {/* Leyenda */}
                        <div className="flex gap-2 flex-wrap">
                            {[
                                { bg: '#e1e0ff', text: '#05006c', label: 'Disponible' },
                                { bg: '#ffdeab', text: '#271900', label: 'Atendiendo' },
                                { bg: '#e4e1ec', text: '#464554', label: 'Pausa' },
                            ].map(({ bg, text, label }) => (
                                <span
                                    key={label}
                                    className="px-2 py-1 rounded-full text-[10px] font-bold uppercase"
                                    style={{ backgroundColor: bg, color: text }}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                                    {['Módulo', 'Asesor', 'Estado', 'Turno Actual', 'Tiempo'].map(h => (
                                        <th
                                            key={h}
                                            className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider"
                                            style={{ color: C.textSub }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {modulosActivos.map((m, i) => (
                                    <tr
                                        key={i}
                                        className="transition-colors"
                                        style={{ borderBottom: i < modulosActivos.length - 1 ? `1px solid ${C.border}40` : 'none' }}
                                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.surfaceHigh)}
                                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                    >
                                        <td className="py-3 px-4 font-semibold text-sm" style={{ color: C.textMain }}>{m.nombre}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                                                    style={{ backgroundColor: '#e1e0ff', color: '#05006c' }}
                                                >
                                                    {m.iniciales}
                                                </div>
                                                <span className="text-sm" style={{ color: C.textMain }}>{m.asesor}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <EstadoBadge estado={m.estado} />
                                        </td>
                                        <td className="py-3 px-4 font-bold text-sm" style={{ color: m.turno ? C.primary : C.border }}>
                                            {m.turno ?? '—'}
                                        </td>
                                        <td className="py-3 px-4 text-sm" style={{ color: C.textSub }}>
                                            {m.tiempo ?? '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
