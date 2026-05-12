import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Kpis {
    turnos_totales_hoy: number;
    tiempo_promedio_espera: number;
    ventanillas_activas: number;
    ventanillas_total: number;
    turnos_en_espera: number;
}

interface Alerta {
    tipo: 'error' | 'warning';
    titulo: string;
    mensaje: string;
}

interface Modulo {
    nombre: string;     // Nombre del asesor
    iniciales: string;
    modulo: string;     // "Módulo 01"
    estado: 'atendiendo' | 'disponible' | 'pausa' | 'desconectado';
    turno: string | null;
    tiempo: string | null;
}

interface Cola {
    general: number;
    victimas: number;
    total: number;
    nivel: 'Baja' | 'Media' | 'Alta';
}

interface Props {
    kpis: Kpis;
    alertas: Alerta[];
    modulos: Modulo[];
    cola: Cola;
}

// ─── Colores fijos ────────────────────────────────────────────────────────────
const C = {
    primary: '#050066',
    amber: '#fdb300',
    amberText: '#271900',
    surface: '#ffffff',
    surfaceLow: '#f5f2fd',
    surfaceHigh: '#eae7f2',
    border: '#c7c5d6',
    textMain: '#1b1b23',
    textSub: '#464554',
    error: '#ba1a1a',
    errorBg: '#ffdad6',
    errorText: '#93000a',
    warnBg: '#ffdeab',
    warnText: '#271900',
    indigo: '#4a4dce',
} as const;

// ─── Badge de Estado ──────────────────────────────────────────────────────────
function EstadoBadge({ estado }: { estado: Modulo['estado'] }) {
    const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
        atendiendo: { bg: '#ffdeab', text: '#271900', dot: '#7d5700', label: 'Atendiendo' },
        disponible: { bg: '#e1e0ff', text: '#05006c', dot: '#050066', label: 'Disponible' },
        pausa: { bg: '#e4e1ec', text: '#464554', dot: '#767685', label: 'Pausa' },
        desconectado: { bg: '#ffdad6', text: '#93000a', dot: '#ba1a1a', label: 'Desconectado' },
    };
    const c = config[estado] ?? config.desconectado;

    return (
        <span
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: c.bg, color: c.text }}
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
            {c.label}
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
            <div className="absolute bottom-0 left-0 h-1 w-full" style={{ backgroundColor: accentColor, opacity: 0.2 }} />
        </div>
    );
}

// ─── Pantalla Dashboard ───────────────────────────────────────────────────────
export default function PantallaDashboard({ kpis, alertas, modulos, cola }: Props) {
    const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setUltimaActualizacion(new Date());
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Sub-header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold" style={{ color: C.primary }}>Monitoreo en Vivo</h2>
                    <p className="text-xs mt-0.5" style={{ color: C.textSub }}>
                        Última actualización: {mounted ? ultimaActualizacion.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
                    </p>
                </div>
            </div>

            {/* ── KPIs ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <KpiCard
                    label="Turnos Totales Hoy"
                    value={kpis.turnos_totales_hoy.toLocaleString('es-CO')}
                    icon="material-symbols:groups"
                    accentColor={C.primary}
                />
                <KpiCard
                    label="Tiempo Prom. Atención"
                    value={kpis.tiempo_promedio_espera}
                    suffix="MIN"
                    icon="material-symbols:timer"
                    accentColor={C.amber}
                />
                <KpiCard
                    label="Asesores Activos"
                    value={kpis.ventanillas_activas}
                    suffix={`/ ${kpis.ventanillas_total}`}
                    icon="material-symbols:door-front"
                    accentColor={C.indigo}
                />
                <KpiCard
                    label="Turnos en Espera"
                    value={kpis.turnos_en_espera}
                    icon="material-symbols:hourglass-empty"
                    accentColor={C.error}
                />
            </div>

            {/* ── Alertas y Cola ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Alertas Críticas */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Icon icon="material-symbols:notifications-active" className="text-xl" style={{ color: C.error }} />
                        <h3 className="text-sm font-bold" style={{ color: C.textMain }}>Alertas de Operación</h3>
                    </div>

                    {/* Guía Persistente de Alertas (Leyenda) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-3 rounded-xl border border-dashed"
                        style={{ backgroundColor: C.surfaceLow, borderColor: C.border }}>
                        {[
                            { icon: 'material-symbols:timer', label: 'TEE', desc: 'Espera excedida', color: C.error },
                            { icon: 'material-symbols:analytics', label: 'Saturación', desc: 'Sala congestionada', color: C.error },
                            { icon: 'material-symbols:person-off', label: 'Ventanillas', desc: 'Sin asesores', color: C.error },
                            { icon: 'material-symbols:coffee', label: 'Pausas', desc: 'Receso excedido', color: C.amber },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                                <Icon icon={item.icon} className="text-lg shrink-0 mt-0.5" style={{ color: item.color }} />
                                <div>
                                    <p className="text-[10px] font-bold uppercase leading-none" style={{ color: C.textMain }}>{item.label}</p>
                                    <p className="text-[9px] mt-0.5" style={{ color: C.textSub }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {alertas.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {alertas.map((a, i) => (
                                <div key={i} className="p-4 rounded-xl flex gap-3 animate-in fade-in slide-in-from-left-4"
                                    style={{
                                        backgroundColor: a.tipo === 'error' ? C.errorBg : C.warnBg,
                                        border: `1px solid ${a.tipo === 'error' ? C.error : C.amber}40`
                                    }}>
                                    <Icon icon={a.tipo === 'error' ? 'material-symbols:error' : 'material-symbols:warning'}
                                        className="text-xl shrink-0" style={{ color: a.tipo === 'error' ? C.errorText : C.warnText }} />
                                    <div>
                                        <p className="text-xs font-bold" style={{ color: a.tipo === 'error' ? C.errorText : C.warnText }}>{a.titulo}</p>
                                        <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: a.tipo === 'error' ? C.errorText : C.warnText }}>{a.mensaje}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 rounded-xl flex flex-col items-center justify-center text-center bg-white border border-dashed border-gray-300">
                            <Icon icon="material-symbols:check-circle" className="text-4xl text-green-500 mb-2 opacity-50" />
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Sin alertas críticas</p>
                            <p className="text-[10px] text-gray-400 mt-1">La operación se encuentra dentro de los umbrales normales.</p>
                        </div>
                    )}
                </div>

                {/* Resumen de Cola */}
                <div className="lg:col-span-4">
                    <div className="rounded-xl p-5 h-full" style={{ backgroundColor: C.primary, color: 'white' }}>
                        <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                            <Icon icon="material-symbols:format-list-numbered" />
                            Resumen de Cola
                        </h3>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-bold uppercase opacity-60">Total en Espera</p>
                                    <p className="text-5xl font-bold">{cola.total}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase opacity-60">Saturación</p>
                                    <p className="text-lg font-bold" style={{
                                        color: cola.nivel === 'Alta' ? C.amber : (cola.nivel === 'Media' ? '#ffdeab' : 'white')
                                    }}>
                                        {cola.nivel}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-white/40" />
                                        <span className="text-xs font-medium">Público General</span>
                                    </div>
                                    <span className="text-sm font-bold">{cola.general}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-white/40" />
                                        <span className="text-xs font-medium">Población Víctima</span>
                                    </div>
                                    <span className="text-sm font-bold" style={{ color: C.amber }}>{cola.victimas}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Estado de Módulos (Ventanillas) ───────────────────────── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon icon="material-symbols:grid-view" className="text-xl" style={{ color: C.primary }} />
                        <h3 className="text-sm font-bold" style={{ color: C.textMain }}>Estado de Ventanillas</h3>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#050066' }} />
                            <span className="text-[10px] font-bold text-gray-500">DISPONIBLES</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#fdb300' }} />
                            <span className="text-[10px] font-bold text-gray-500">ATENDIENDO</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {modulos.map((m, i) => (
                        <div key={i} className="p-4 rounded-xl flex items-center justify-between transition-all hover:shadow-md"
                            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                                    style={{ backgroundColor: C.surfaceHigh, color: C.primary }}>
                                    {m.iniciales}
                                </div>
                                <div>
                                    <p className="text-xs font-bold" style={{ color: C.textMain }}>{m.nombre}</p>
                                    <p className="text-[10px] uppercase font-bold mt-0.5" style={{ color: C.textSub }}>{m.modulo}</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1.5">
                                <EstadoBadge estado={m.estado} />
                                <div className="flex items-center gap-2">
                                    {m.turno && <span className="text-[11px] font-bold" style={{ color: C.primary }}>{m.turno}</span>}
                                    {m.tiempo && (
                                        <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color: C.textSub }}>
                                            <Icon icon="material-symbols:timer-outline" />
                                            {m.tiempo}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
