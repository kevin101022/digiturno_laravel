import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';
import coordinadorRoutes from '@/routes/coordinador';

// ─── Colores fijos ────────────────────────────────────────────────────────────
const C = {
    primary:     '#050066',
    primaryBg:   '#e1e0ff',
    primaryText: '#05006c',
    amber:       '#fdb300',
    surface:     '#ffffff',
    surfaceLow:  '#f5f2fd',
    surfaceHigh: '#eae7f2',
    border:      '#c7c5d6',
    textMain:    '#1b1b23',
    textSub:     '#464554',
    outline:     '#767685',
    success:     '#137333',
    successBg:   '#e6f4ea',
} as const;

// ─── Tipos del formulario ─────────────────────────────────────────────────────
interface Config {
    tee_maximo:      number;
    saturacion_sala: number;
    ratio_tendencia: number;
    duracion_pausas: number;
    daily_goal:      number;
    system_state: {
        ultima_actualizacion: string;
        nodos_activos: string;
        version: string;
    };
    [key: string]: any;
}

// ─── Componente Campo de Formulario ──────────────────────────────────────────
function FormField({
    label, helper, value, unit, onChange, step = 1,
}: {
    label: string;
    helper: string;
    value: number;
    unit?: string;
    onChange: (v: number) => void;
    step?: number;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>
                {label}
            </label>
            <div className="relative">
                <input
                    type="number"
                    value={value}
                    step={step}
                    min={0}
                    onChange={e => onChange(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-lg text-base border outline-none transition-colors"
                    style={{
                        backgroundColor: C.surfaceHigh,
                        borderColor: C.border,
                        color: C.textMain,
                        paddingRight: unit ? '3rem' : '1rem',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = C.primary)}
                    onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                />
                {unit && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium pointer-events-none" style={{ color: C.outline }}>
                        {unit}
                    </span>
                )}
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: C.outline }}>{helper}</p>
        </div>
    );
}

// ─── Pantalla Configuración ───────────────────────────────────────────────────
export default function PantallaConfiguracion({ initialConfig }: { initialConfig: Config }) {
    const [config, setConfig] = useState<Config>(initialConfig);
    const [guardando, setGuardando] = useState(false);
    const [guardado,  setGuardado]  = useState(false);

    useEffect(() => {
        setConfig(initialConfig);
    }, [initialConfig]);

    const setField = (key: keyof Config) => (v: number) =>
        setConfig(prev => ({ ...prev, [key]: v }));

    const handleGuardar = () => {
        setGuardando(true);
        router.post(coordinadorRoutes.config.update().url, config, {
            onSuccess: () => {
                setGuardado(true);
                setTimeout(() => setGuardado(false), 3000);
            },
            onFinish: () => setGuardando(false),
        });
    };

    const handleRestaurar = () => {
        if (confirm('¿Estás seguro de que deseas restaurar los valores por defecto?')) {
            router.post(coordinadorRoutes.config.reset().url, {}, {
                onSuccess: () => {
                    setGuardado(true);
                    setTimeout(() => setGuardado(false), 3000);
                }
            });
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* Sub-header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold" style={{ color: C.primary }}>Configuración de Parámetros</h2>
                    <p className="text-xs mt-1" style={{ color: C.textSub }}>
                        Ajustes globales para el sistema de turnos y alertas operativas.
                    </p>
                </div>
                <button
                    onClick={handleRestaurar}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border"
                    style={{ color: C.textSub, borderColor: C.border, backgroundColor: C.surface }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.surfaceLow)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.surface)}
                >
                    <Icon icon="material-symbols:restart-alt" className="text-base" />
                    Restaurar por Defecto
                </button>
            </div>

            {/* Feedback guardado */}
            {guardado && (
                <div
                    className="flex items-center gap-3 px-4 py-3 rounded-lg"
                    style={{ backgroundColor: C.successBg, color: C.success, border: '1px solid #ceead6' }}
                >
                    <Icon icon="material-symbols:check-circle" className="text-xl" />
                    <span className="text-sm font-bold">Configuración actualizada. Los cambios se han aplicado exitosamente.</span>
                </div>
            )}

            {/* Grid principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Columna izquierda: Formularios ─────────────────────── */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Umbrales de Alerta */}
                    <section
                        className="rounded-xl p-6"
                        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                    >
                        <div className="flex items-center gap-3 mb-4" style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: '1rem' }}>
                            <div className="p-2 rounded-lg" style={{ backgroundColor: C.primaryBg + '30' }}>
                                <Icon icon="material-symbols:notifications-active" className="text-xl" style={{ color: C.primary }} />
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: C.textMain }}>
                                Umbrales de Alerta en Tiempo Real
                            </h3>
                        </div>

                        {/* Explicación para el coordinador */}
                        <div className="mb-6 p-4 rounded-lg text-[11px] leading-relaxed" style={{ backgroundColor: C.surfaceLow, color: C.textSub, border: `1px dashed ${C.border}` }}>
                            <p className="font-bold mb-1" style={{ color: C.primary }}>Impacto en el Monitoreo</p>
                            Estos valores definen cuándo el sistema enviará notificaciones visuales al Dashboard.
                            <br />• <strong>TEE Máximo:</strong> Si un turno supera este tiempo en espera, aparecerá una alerta roja de "Tiempo Excedido".
                            <br />• <strong>Saturación:</strong> Define el nivel de ocupación de la sala. Si la relación cola/ventanillas supera este %, se activará la alerta de "Saturación Crítica".
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormField
                                label="TEE Máximo (Espera)"
                                helper="Tiempo máximo que un ciudadano debe esperar antes de generar alerta."
                                value={config.tee_maximo}
                                unit="min"
                                onChange={setField('tee_maximo')}
                            />
                            <FormField
                                label="Saturación de Sala"
                                helper="Nivel de ocupación de sala para disparar alertas de congestión."
                                value={config.saturacion_sala}
                                unit="%"
                                onChange={setField('saturacion_sala')}
                            />
                            <FormField
                                label="Meta Diaria (Turnos)"
                                helper="Cantidad de ciudadanos objetivo para atender por jornada."
                                value={config.daily_goal}
                                unit="pax"
                                onChange={setField('daily_goal')}
                            />
                        </div>
                    </section>

                    {/* Límites Operativos */}
                    <section
                        className="rounded-xl p-6"
                        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                    >
                        <div className="flex items-center gap-3 mb-4" style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: '1rem' }}>
                            <div className="p-2 rounded-lg" style={{ backgroundColor: C.primaryBg + '30' }}>
                                <Icon icon="material-symbols:tune" className="text-xl" style={{ color: C.primary }} />
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: C.textMain }}>
                                Límites Operativos y Proyección
                            </h3>
                        </div>

                        {/* Explicación para el coordinador */}
                        <div className="mb-6 p-4 rounded-lg text-[11px] leading-relaxed" style={{ backgroundColor: C.surfaceLow, color: C.textSub, border: `1px dashed ${C.border}` }}>
                            <p className="font-bold mb-1" style={{ color: C.primary }}>¿Qué es el Ratio de Tendencia?</p>
                            Es un multiplicador que utiliza el algoritmo para estimar cuántas personas llegarán en la próxima hora basándose en el flujo actual. 
                            <br />• <strong>Valores bajos (0.5 - 1.0):</strong> Proyección conservadora (pocos ciudadanos nuevos).
                            <br />• <strong>Valores altos (1.5 - 2.5):</strong> Proyección agresiva (prepararse para un aumento súbito de fila).
                            <br />Afecta directamente la gráfica de "Proyección de Demanda" en el panel de rendimiento.
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormField
                                label="Ratio Tendencia Cola"
                                helper="Define la sensibilidad del sistema ante nuevos ingresos de ciudadanos."
                                value={config.ratio_tendencia}
                                step={0.1}
                                onChange={setField('ratio_tendencia')}
                            />
                            <FormField
                                label="Duración Máx. Pausas"
                                helper="Tiempo límite permitido antes de marcar una pausa como 'Excedida'."
                                value={config.duracion_pausas}
                                unit="min"
                                onChange={setField('duracion_pausas')}
                            />
                        </div>
                    </section>
                </div>

                {/* ── Columna derecha: Acciones + Estado ─────────────────── */}
                <div className="space-y-5">

                    {/* Panel de guardado */}
                    <div
                        className="rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4"
                        style={{ backgroundColor: C.surfaceLow, border: `1px solid ${C.border}`, minHeight: 200 }}
                    >
                        <Icon icon="material-symbols:save" className="text-5xl" style={{ color: C.textSub }} />
                        <p className="text-xs leading-relaxed" style={{ color: C.textSub }}>
                            Los cambios afectarán inmediatamente a toda la infraestructura de la oficina.
                        </p>
                        <button
                            onClick={handleGuardar}
                            disabled={guardando}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-xs font-bold text-white transition-all"
                            style={{
                                backgroundColor: guardando ? C.outline : C.primary,
                                cursor: guardando ? 'not-allowed' : 'pointer',
                            }}
                            onMouseEnter={e => { if (!guardando) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#10069f'; }}
                            onMouseLeave={e => { if (!guardando) (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.primary; }}
                        >
                            {guardando
                                ? <><Icon icon="material-symbols:progress-activity" className="text-base animate-spin" /> Guardando…</>
                                : 'Guardar Configuración'
                            }
                        </button>
                    </div>

                    {/* Estado del Sistema */}
                    <div
                        className="rounded-xl p-6"
                        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                    >
                        <h3 className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: C.textMain }}>
                            Estado del Sistema
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Última Actualización', value: config.system_state.ultima_actualizacion, valueColor: C.textMain },
                                { label: 'Versión del Sistema',   value: config.system_state.version,        valueColor: C.textMain },
                                { label: 'Nodos Operativos',         value: config.system_state.nodos_activos,       valueColor: C.success  },
                            ].map((item, i, arr) => (
                                <li
                                    key={item.label}
                                    className="flex justify-between items-center pb-3"
                                    style={{ borderBottom: i < arr.length - 1 ? `1px solid ${C.border}40` : 'none' }}
                                >
                                    <span className="text-xs" style={{ color: C.textSub }}>{item.label}</span>
                                    <span className="text-[11px] font-bold" style={{ color: item.valueColor }}>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
