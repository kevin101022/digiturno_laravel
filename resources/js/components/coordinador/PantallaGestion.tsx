import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import GestionAsesores from '@/components/coordinador/GestionAsesores';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Asesor {
    iniciales: string;
    nombre: string;
    especialidad: string;
    activo: boolean;
}

interface ModuloAsignado {
    numero: number;
    tipo: 'General' | 'Víctimas' | 'Empresas';
    asesorAsignado: Asesor | null;
}

interface Props {
    asesores_disponibles: Asesor[];
}

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
    dim:         '#dbd8e4',
} as const;

const TIPO_COLORS: Record<string, { bg: string; text: string }> = {
    'General':    { bg: '#e4e1ec', text: '#464554' },
    'Víctimas':   { bg: C.amber,   text: C.amberText },
    'Empresas':   { bg: C.primaryBg, text: C.primaryText },
};

const MODULOS_INICIALES: ModuloAsignado[] = [
    { numero: 1, tipo: 'General',  asesorAsignado: { iniciales: 'MS', nombre: 'María Salas',  especialidad: 'Asignada 08:00 AM', activo: true } },
    { numero: 2, tipo: 'Víctimas', asesorAsignado: { iniciales: 'DF', nombre: 'Diego Franco', especialidad: 'Asignado 08:00 AM', activo: true } },
    { numero: 3, tipo: 'General',  asesorAsignado: null },
    { numero: 4, tipo: 'General',  asesorAsignado: null },
    { numero: 5, tipo: 'Empresas', asesorAsignado: { iniciales: 'RT', nombre: 'Rosa Torres', especialidad: 'Asignada 08:00 AM', activo: true } },
];

// ─── Pantalla Gestión Operativa ───────────────────────────────────────────────
export default function PantallaGestion({ asesores_disponibles }: Props) {
    const [seccion, setSeccion] = useState<'asignacion' | 'asesores'>('asignacion');
    const [turno, setTurno]           = useState<'manana' | 'tarde'>('manana');
    const [busqueda, setBusqueda]     = useState('');
    const [modulos, setModulos]       = useState<ModuloAsignado[]>(MODULOS_INICIALES);
    const [guardado, setGuardado]     = useState(false);
    const [dragging, setDragging]     = useState<Asesor | null>(null);
    const [overModulo, setOverModulo] = useState<number | null>(null);

    const asesoresFiltrados = useMemo(
        () => asesores_disponibles.filter(a =>
            a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            a.especialidad.toLowerCase().includes(busqueda.toLowerCase())
        ),
        [asesores_disponibles, busqueda],
    );

    const handleLimpiarMesa = () => setModulos(m => m.map(mod => ({ ...mod, asesorAsignado: null })));

    const handleGuardar = () => {
        setGuardado(true);
        setTimeout(() => setGuardado(false), 3000);
    };

    // ── Drag & Drop ──────────────────────────────────────────────────────────
    const handleDragStart = (a: Asesor) => { if (a.activo) setDragging(a); };
    const handleDragOver  = (e: React.DragEvent, num: number) => { e.preventDefault(); setOverModulo(num); };
    const handleDragLeave = () => setOverModulo(null);
    const handleDrop      = (num: number) => {
        if (!dragging) return;
        setModulos(prev => prev.map(m => m.numero === num ? { ...m, asesorAsignado: dragging } : m));
        setDragging(null);
        setOverModulo(null);
    };

    const handleRemoveAsesor = (num: number) =>
        setModulos(prev => prev.map(m => m.numero === num ? { ...m, asesorAsignado: null } : m));

    // ── Stats ─────────────────────────────────────────────────────────────────
    const asignados   = modulos.filter(m => m.asesorAsignado).length;
    const inactivos   = modulos.length - asignados;
    const capacidadPct = Math.round((asignados / modulos.length) * 100);

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* ── Tabs de sección ──────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold" style={{ color: C.primary }}>Gestión Operativa</h2>
                    <p className="text-xs mt-0.5" style={{ color: C.textSub }}>Asignación de módulos y administración de asesores.</p>
                </div>
                <div className="flex p-1 rounded-lg" style={{ backgroundColor: C.surfaceHigh }}>
                    {([['asignacion','Asignación','material-symbols:grid-view'],['asesores','Asesores','material-symbols:groups']] as const).map(([key, label, icon]) => (
                        <button key={key} onClick={() => setSeccion(key as any)}
                            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all"
                            style={{
                                backgroundColor: seccion === key ? C.surface : 'transparent',
                                color: seccion === key ? C.primary : C.textSub,
                                boxShadow: seccion === key ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
                            }}>
                            <Icon icon={icon} className="text-base" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Contenido según sección ───────────────────────────────── */}
            {seccion === 'asesores' ? (
                <GestionAsesores />
            ) : (
            <>
            {/* Sub-header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold" style={{ color: C.primary }}>Gestión y Asignación Operativa</h2>
                    <p className="text-xs mt-0.5" style={{ color: C.textSub }}>Asigna asesores a módulos y define la estrategia operativa del día.</p>
                </div>
                {/* Selector turno */}
                <div className="flex rounded-lg p-1" style={{ backgroundColor: C.surfaceHigh }}>
                    {(['manana', 'tarde'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTurno(t)}
                            className="px-5 py-2 rounded-md text-xs font-bold transition-all"
                            style={{
                                backgroundColor: turno === t ? C.surface : 'transparent',
                                color:           turno === t ? C.primary : C.textSub,
                                boxShadow:       turno === t ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
                            }}
                        >
                            {t === 'manana' ? 'Mañana' : 'Tarde'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feedback guardado */}
            {guardado && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ backgroundColor: '#e6f4ea', color: '#137333', border: '1px solid #ceead6' }}>
                    <Icon icon="material-symbols:check-circle" className="text-xl" />
                    <span className="text-sm font-bold">Asignación guardada correctamente.</span>
                </div>
            )}

            {/* Grid principal */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

                {/* ── Columna Asesores ─────────────────────────────────── */}
                <div className="xl:col-span-4">
                    <div className="rounded-xl p-5 flex flex-col h-full" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-bold" style={{ color: C.textMain }}>Asesores Disponibles</h3>
                            <span
                                className="px-3 py-1 rounded-full text-xs font-bold"
                                style={{ backgroundColor: C.primaryBg, color: C.primaryText }}
                            >
                                {asesoresFiltrados.filter(a => a.activo).length} / {asesores_disponibles.length}
                            </span>
                        </div>

                        {/* Buscador */}
                        <div className="relative mb-4">
                            <Icon
                                icon="material-symbols:search"
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-lg"
                                style={{ color: C.textSub }}
                            />
                            <input
                                type="text"
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                                placeholder="Buscar asesor..."
                                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm border outline-none"
                                style={{ backgroundColor: C.surfaceHigh, borderColor: C.border, color: C.textMain }}
                            />
                        </div>

                        {/* Lista */}
                        <div className="flex-1 overflow-y-auto space-y-2 max-h-96">
                            {asesoresFiltrados.map((a, i) => (
                                <div
                                    key={i}
                                    draggable={a.activo}
                                    onDragStart={() => handleDragStart(a)}
                                    className="flex items-center p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all"
                                    style={{
                                        backgroundColor: C.surface,
                                        borderColor: C.border,
                                        opacity: a.activo ? 1 : 0.45,
                                    }}
                                    onMouseEnter={e => a.activo && (e.currentTarget.style.backgroundColor = C.surfaceLow)}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.surface)}
                                >
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mr-3 shrink-0"
                                        style={{ backgroundColor: C.dim, color: C.primary }}
                                    >
                                        {a.iniciales}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold truncate" style={{ color: C.textMain, textDecoration: a.activo ? 'none' : 'line-through' }}>
                                            {a.nombre}
                                        </p>
                                        <p className="text-[11px] truncate" style={{ color: a.activo ? C.textSub : C.error }}>{a.especialidad}</p>
                                    </div>
                                    <Icon icon="material-symbols:drag-indicator" className="text-xl ml-2 shrink-0" style={{ color: C.border }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Columna Mesa de Asignación ───────────────────────── */}
                <div className="xl:col-span-8 space-y-4">
                    <div className="rounded-xl p-5" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-bold" style={{ color: C.textMain }}>Mesa de Asignación</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleLimpiarMesa}
                                    className="px-4 py-2 rounded-lg text-xs font-bold border transition-colors"
                                    style={{ borderColor: C.border, color: C.textSub, backgroundColor: C.surface }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.surfaceHigh)}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.surface)}
                                >
                                    Limpiar Mesa
                                </button>
                                <button
                                    onClick={handleGuardar}
                                    className="px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors"
                                    style={{ backgroundColor: C.primary }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#10069f')}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.primary)}
                                >
                                    Guardar Asignación
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {modulos.map(m => {
                                const tipoColor = TIPO_COLORS[m.tipo];
                                const isOver = overModulo === m.numero;
                                return (
                                    <div
                                        key={m.numero}
                                        onDragOver={e => handleDragOver(e, m.numero)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={() => handleDrop(m.numero)}
                                        className="rounded-lg p-4 flex flex-col gap-3 transition-all"
                                        style={{
                                            border: isOver
                                                ? `2px dashed ${C.primary}`
                                                : m.asesorAsignado
                                                    ? `1px solid ${C.border}`
                                                    : `2px dashed ${C.border}`,
                                            backgroundColor: isOver
                                                ? C.primaryBg + '40'
                                                : m.asesorAsignado ? C.surface : C.surfaceLow,
                                            minHeight: 140,
                                        }}
                                    >
                                        {/* Header módulo */}
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                                style={{ backgroundColor: C.surfaceHigh, color: C.textMain }}
                                            >
                                                {String(m.numero).padStart(2, '0')}
                                            </span>
                                            <span
                                                className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                                                style={{ backgroundColor: tipoColor.bg, color: tipoColor.text }}
                                            >
                                                {m.tipo}
                                            </span>
                                        </div>

                                        {/* Asesor asignado / drop zone */}
                                        {m.asesorAsignado ? (
                                            <div className="flex items-center gap-3 p-3 rounded border" style={{ backgroundColor: C.surfaceLow, borderColor: C.border }}>
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                                    style={{ backgroundColor: C.primaryBg, color: C.primaryText }}
                                                >
                                                    {m.asesorAsignado.iniciales}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold truncate" style={{ color: C.textMain }}>{m.asesorAsignado.nombre}</p>
                                                    <p className="text-[10px]" style={{ color: C.textSub }}>{m.asesorAsignado.especialidad}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveAsesor(m.numero)}
                                                    aria-label={`Quitar asesor de módulo ${m.numero}`}
                                                    style={{ color: C.textSub }}
                                                    onMouseEnter={e => (e.currentTarget.style.color = C.error)}
                                                    onMouseLeave={e => (e.currentTarget.style.color = C.textSub)}
                                                >
                                                    <Icon icon="material-symbols:close" className="text-base" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center flex-1 gap-1 text-center">
                                                <Icon icon="material-symbols:person-add" className="text-3xl mb-1" style={{ color: C.border }} />
                                                <p className="text-[11px] font-bold" style={{ color: C.textSub }}>Arrastrar asesor aquí</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stats rápidas */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Capacidad Total', value: `${capacidadPct}%`, icon: 'material-symbols:groups', color: C.primary },
                            { label: 'Tiempo Promedio', value: '12m',             icon: 'material-symbols:timer',  color: C.primary },
                            { label: 'Módulos Inactivos', value: inactivos,       icon: 'material-symbols:warning', color: C.error },
                        ].map(({ label, value, icon, color }) => (
                            <div
                                key={label}
                                className="flex items-center justify-between p-4 rounded-xl"
                                style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                            >
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>{label}</p>
                                    <p className="text-2xl font-bold mt-1" style={{ color }}>{value}</p>
                                </div>
                                <Icon icon={icon} className="text-4xl opacity-20" style={{ color }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </>
            )}
        </div>
    );
}
