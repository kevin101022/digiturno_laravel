import { useState } from 'react';
import { Icon } from '@iconify/react';

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
export default function PantallaConfiguracion() {
    const [config, setConfig] = useState<Config>({
        tee_maximo:      45,
        saturacion_sala: 85,
        ratio_tendencia: 1.5,
        duracion_pausas: 15,
    });
    const [guardando, setGuardando] = useState(false);
    const [guardado,  setGuardado]  = useState(false);

    const setField = (key: keyof Config) => (v: number) =>
        setConfig(prev => ({ ...prev, [key]: v }));

    const handleGuardar = () => {
        setGuardando(true);
        setTimeout(() => {
            setGuardando(false);
            setGuardado(true);
            setTimeout(() => setGuardado(false), 3000);
        }, 1200);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* Sub-header */}
            <div>
                <h2 className="text-xl font-bold" style={{ color: C.primary }}>Configuración de Parámetros</h2>
                <p className="text-xs mt-1" style={{ color: C.textSub }}>
                    Ajustes globales para el sistema de turnos y alertas operativas.
                </p>
            </div>

            {/* Feedback guardado */}
            {guardado && (
                <div
                    className="flex items-center gap-3 px-4 py-3 rounded-lg"
                    style={{ backgroundColor: C.successBg, color: C.success, border: '1px solid #ceead6' }}
                >
                    <Icon icon="material-symbols:check-circle" className="text-xl" />
                    <span className="text-sm font-bold">Configuración guardada. Los cambios se aplicarán a todas las sucursales.</span>
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
                        <div className="flex items-center gap-3 mb-6" style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: '1rem' }}>
                            <div className="p-2 rounded-lg" style={{ backgroundColor: C.primaryBg + '30' }}>
                                <Icon icon="material-symbols:warning" className="text-xl" style={{ color: C.primary }} />
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: C.textMain }}>
                                Umbrales de Alerta
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormField
                                label="TEE Máximo (Minutos)"
                                helper="Tiempo de Espera Estimado máximo antes de disparar alerta crítica."
                                value={config.tee_maximo}
                                unit="min"
                                onChange={setField('tee_maximo')}
                            />
                            <FormField
                                label="Saturación de Sala (%)"
                                helper="Porcentaje de capacidad que indica sala saturada."
                                value={config.saturacion_sala}
                                unit="%"
                                onChange={setField('saturacion_sala')}
                            />
                        </div>
                    </section>

                    {/* Límites Operativos */}
                    <section
                        className="rounded-xl p-6"
                        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                    >
                        <div className="flex items-center gap-3 mb-6" style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: '1rem' }}>
                            <div className="p-2 rounded-lg" style={{ backgroundColor: C.primaryBg + '30' }}>
                                <Icon icon="material-symbols:tune" className="text-xl" style={{ color: C.primary }} />
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: C.textMain }}>
                                Límites Operativos
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormField
                                label="Ratio Tendencia Cola"
                                helper="Multiplicador para proyectar el crecimiento de la fila."
                                value={config.ratio_tendencia}
                                step={0.1}
                                onChange={setField('ratio_tendencia')}
                            />
                            <FormField
                                label="Duración Máx. Pausas"
                                helper="Límite de tiempo para pausas activas de asesores."
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
                            Los cambios afectarán inmediatamente a todas las sucursales conectadas.
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
                                { label: 'Última Actualización', value: 'Hoy, 08:30 AM', valueColor: C.textMain },
                                { label: 'Versión Motor Reglas',  value: 'v2.4.1',        valueColor: C.textMain },
                                { label: 'Nodos Activos',         value: '42 / 42',       valueColor: C.success  },
                            ].map((item, i, arr) => (
                                <li
                                    key={item.label}
                                    className="flex justify-between items-center pb-3"
                                    style={{ borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}
                                >
                                    <span className="text-xs" style={{ color: C.textSub }}>{item.label}</span>
                                    <span className="text-[11px] font-bold" style={{ color: item.valueColor }}>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resumen configuración actual */}
                    <div
                        className="rounded-xl p-5"
                        style={{ backgroundColor: C.primaryBg, border: `1px solid ${C.primaryText}20` }}
                    >
                        <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: C.primaryText }}>
                            Configuración Actual
                        </p>
                        <ul className="space-y-2 text-xs" style={{ color: C.primaryText }}>
                            <li className="flex justify-between"><span>TEE Máximo</span><strong>{config.tee_maximo} min</strong></li>
                            <li className="flex justify-between"><span>Saturación Sala</span><strong>{config.saturacion_sala}%</strong></li>
                            <li className="flex justify-between"><span>Ratio Cola</span><strong>×{config.ratio_tendencia}</strong></li>
                            <li className="flex justify-between"><span>Límite Pausa</span><strong>{config.duracion_pausas} min</strong></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
