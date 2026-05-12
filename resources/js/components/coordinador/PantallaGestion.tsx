import { useState, useMemo, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';
import GestionAsesores from '@/components/coordinador/GestionAsesores';
import coordinadorRoutes from '@/routes/coordinador';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Asesor {
    id: number;
    iniciales: string;
    nombre: string;
    especialidad: string;
    activo: boolean;
}

interface ModuloAsignado {
    id: number;
    numero: number;
    tipo: 'General' | 'Víctimas';
    asesorAsignado: Asesor | null;
}

interface Props {
    asesores_disponibles: Asesor[];
    asesores_registrados: any[];
    initialMesas: any[];
    shiftActual: 'morning' | 'afternoon';
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
    success:     '#137333',
    successBg:   '#e6f4ea',
    dim:         '#dbd8e4',
} as const;

const TIPO_COLORS: Record<string, { bg: string; text: string }> = {
    'General':  { bg: '#e4e1ec', text: '#464554' },
    'Víctimas': { bg: C.amber,   text: C.amberText },
};

// ─── Pantalla Gestión Operativa ───────────────────────────────────────────────
export default function PantallaGestion({ asesores_disponibles, asesores_registrados, initialMesas, shiftActual }: Props) {
    const [seccion, setSeccion] = useState<'asignacion' | 'asesores'>('asignacion');
    const [turno, setTurno]     = useState<'morning' | 'afternoon'>(shiftActual);
    const [busqueda, setBusqueda] = useState('');
    const [modulos, setModulos]   = useState<ModuloAsignado[]>(initialMesas);
    const [guardado, setGuardado] = useState(false);
    const [dirty, setDirty]       = useState(false);
    const [dragging, setDragging] = useState<Asesor | null>(null);
    const [overModulo, setOverModulo] = useState<number | null>(null);
    
    // Modales de confirmación personalizados
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingShift, setPendingShift] = useState<'morning' | 'afternoon' | null>(null);
    
    const [showDeleteModal, setShowDeleteModal]   = useState(false);
    const [pendingDeleteId, setPendingDeleteId]   = useState<number | null>(null);

    // Form para nuevo módulo
    const [showAddModulo, setShowAddModulo] = useState(false);
    const [newModulo, setNewModulo] = useState({ numero: '' });

    useEffect(() => {
        setModulos(initialMesas);
        setDirty(false);
    }, [initialMesas]);

    const handleCambiarTurno = (t: 'morning' | 'afternoon') => {
        if (dirty) {
            setPendingShift(t);
            setShowConfirmModal(true);
            return;
        }
        ejecutarCambioTurno(t);
    };

    const ejecutarCambioTurno = (t: 'morning' | 'afternoon') => {
        setTurno(t);
        setShowConfirmModal(false);
        setPendingShift(null);
        router.get(coordinadorRoutes.index().url, { shift: t, tab: 'gestion' });
    };

    const asesoresFiltrados = useMemo(() => {
        // IDs de asesores ya asignados en el esquema actual
        const idsAsignados = modulos
            .map(m => m.asesorAsignado?.id)
            .filter(id => id !== undefined && id !== null);

        return asesores_disponibles.filter(a => {
            const matchesBusqueda = a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                                  a.especialidad.toLowerCase().includes(busqueda.toLowerCase());
            const noEstaAsignado = !idsAsignados.includes(a.id);
            
            return matchesBusqueda && noEstaAsignado;
        });
    }, [asesores_disponibles, busqueda, modulos]);

    const handleLimpiarMesa = () => {
        setModulos(m => m.map(mod => ({ ...mod, asesorAsignado: null })));
        setDirty(true);
    };

    const handleGuardarAsignacion = () => {
        const asignaciones = modulos.map(m => ({
            modulo_num: m.numero,
            user_id: m.asesorAsignado?.id ?? null,
            tipo: m.tipo === 'Víctimas' ? 'victim' : 'general',
        })).filter(a => a.user_id !== null);

        router.post(coordinadorRoutes.asignar().url, { 
            shift: turno,
            asignaciones 
        }, {
            onSuccess: () => {
                setGuardado(true);
                setDirty(false);
                setTimeout(() => setGuardado(false), 3000);
            }
        });
    };

    const handleAddModulo = () => {
        if (!newModulo.numero) return;
        router.post(coordinadorRoutes.modulos.store().url, {
            numero: parseInt(newModulo.numero),
        }, {
            onSuccess: () => {
                setShowAddModulo(false);
                setNewModulo({ numero: '' });
            }
        });
    };

    const handleDeleteModulo = (id: number) => {
        setPendingDeleteId(id);
        setShowDeleteModal(true);
    };

    const ejecutarBorradoModulo = () => {
        if (!pendingDeleteId) return;
        router.delete(coordinadorRoutes.modulos.delete(pendingDeleteId).url, {
            onSuccess: () => setShowDeleteModal(false)
        });
    };

    // ── Drag & Drop ──────────────────────────────────────────────────────────
    const handleDragStart = (a: Asesor) => { setDragging(a); };
    const handleDragOver  = (e: React.DragEvent, num: number) => { e.preventDefault(); setOverModulo(num); };
    const handleDragLeave = () => setOverModulo(null);
    const handleDrop      = (num: number) => {
        if (!dragging) return;
        setModulos(prev => prev.map(m => {
            if (m.numero === num) {
                const esVictima = dragging.especialidad.includes('Víctimas');
                return { 
                    ...m, 
                    asesorAsignado: dragging,
                    tipo: esVictima ? 'Víctimas' : 'General' 
                };
            }
            return m;
        }));
        setDragging(null);
        setOverModulo(null);
        setDirty(true);
    };

    const handleRemoveAsesor = (num: number) => {
        setModulos(prev => prev.map(m => m.numero === num ? { ...m, asesorAsignado: null } : m));
        setDirty(true);
    };

    // ── Stats ─────────────────────────────────────────────────────────────────
    const asignados   = modulos.filter(m => m.asesorAsignado).length;
    const inactivos   = modulos.length - asignados;
    const capacidadPct = modulos.length > 0 ? Math.round((asignados / modulos.length) * 100) : 0;

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* ── Tabs de sección ──────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold" style={{ color: C.primary }}>Gestión Operativa</h2>
                    <p className="text-xs mt-0.5" style={{ color: C.textSub }}>Define la mesa de asignación y administra el personal.</p>
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

            {seccion === 'asesores' ? (
                <GestionAsesores initialAsesores={asesores_registrados} />
            ) : (
            <>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex flex-wrap gap-2">
                    <div className="flex rounded-lg p-1" style={{ backgroundColor: C.surfaceHigh }}>
                        {(['morning', 'afternoon'] as const).map(t => (
                            <button key={t} onClick={() => handleCambiarTurno(t)}
                                className="px-5 py-2 rounded-md text-xs font-bold transition-all"
                                style={{
                                    backgroundColor: turno === t ? C.surface : 'transparent',
                                    color:           turno === t ? C.primary : C.textSub,
                                    boxShadow:       turno === t ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
                                }}>
                                {t === 'morning' ? 'Mañana' : 'Tarde'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowAddModulo(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-colors"
                        style={{ borderColor: C.primary, color: C.primary, backgroundColor: 'transparent' }}>
                        <Icon icon="material-symbols:add-circle" className="text-base" />
                        Añadir Módulo Físico
                    </button>
                    <button onClick={handleGuardarAsignacion}
                        className="px-6 py-2 rounded-lg text-xs font-bold text-white transition-colors"
                        style={{ backgroundColor: C.primary }}>
                        Guardar Turno {turno === 'morning' ? 'Mañana' : 'Tarde'}
                    </button>
                </div>
            </div>

            {showAddModulo && (
                <div className="bg-white p-4 rounded-xl border-2 border-dashed border-blue-200 flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-[10px] font-bold uppercase mb-1">N° Módulo</label>
                        <input type="number" value={newModulo.numero} onChange={e => setNewModulo(p => ({ ...p, numero: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Ej: 6" />
                    </div>
                    <div className="flex gap-2 self-end">
                        <button onClick={() => setShowAddModulo(false)} className="px-4 py-2 text-xs font-bold text-gray-500">Cancelar</button>
                        <button onClick={handleAddModulo} className="px-4 py-2 text-xs font-bold text-white rounded-lg" style={{ backgroundColor: C.primary }}>Añadir</button>
                    </div>
                </div>
            )}

            {dirty && (
                <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg animate-pulse" 
                    style={{ backgroundColor: C.errorBg || '#fdecea', color: C.error, border: `1px solid ${C.error}30` }}>
                    <div className="flex items-center gap-3">
                        <Icon icon="material-symbols:warning-rounded" className="text-xl" />
                        <span className="text-sm font-bold uppercase tracking-tight">Cambios pendientes: Aún no has guardado la configuración de este turno.</span>
                    </div>
                    <button onClick={handleGuardarAsignacion} className="px-3 py-1 rounded-md text-[10px] font-bold text-white uppercase" style={{ backgroundColor: C.error }}>
                        Guardar Ahora
                    </button>
                </div>
            )}

            {guardado && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ backgroundColor: C.successBg, color: C.success, border: '1px solid #ceead6' }}>
                    <Icon icon="material-symbols:check-circle" className="text-xl" />
                    <span className="text-sm font-bold">Asignación de turno {turno === 'morning' ? 'mañana' : 'tarde'} guardada correctamente.</span>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* ── Columna Asesores ─────────────────────────────────── */}
                <div className="xl:col-span-4">
                    <div className="rounded-xl p-5 flex flex-col h-full" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-bold" style={{ color: C.textMain }}>Asesores Disponibles</h3>
                            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: C.primaryBg, color: C.primaryText }}>{asesores_disponibles.length}</span>
                        </div>
                        <div className="relative mb-4">
                            <Icon icon="material-symbols:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-lg" style={{ color: C.textSub }} />
                            <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar asesor..." className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm border outline-none" style={{ backgroundColor: C.surfaceHigh, borderColor: C.border }} />
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 max-h-[500px]">
                            {asesoresFiltrados.map((a, i) => (
                                <div key={i} draggable onDragStart={() => handleDragStart(a)}
                                    className="flex items-center p-3 rounded-lg border cursor-grab active:cursor-grabbing hover:bg-gray-50 transition-all"
                                    style={{ backgroundColor: C.surface, borderColor: C.border }}>
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mr-3 shrink-0" style={{ backgroundColor: C.dim, color: C.primary }}>{a.iniciales}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold truncate" style={{ color: C.textMain }}>{a.nombre}</p>
                                        <p className="text-[11px] truncate" style={{ color: C.textSub }}>{a.especialidad}</p>
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
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-base font-bold" style={{ color: C.textMain }}>Esquema de Módulos (Turno {turno === 'morning' ? 'Mañana' : 'Tarde'})</h3>
                            <button onClick={handleLimpiarMesa} className="px-4 py-2 rounded-lg text-xs font-bold border" style={{ borderColor: C.border, color: C.textSub }}>Limpiar Mesa</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {modulos.map(m => {
                                const tipoColor = TIPO_COLORS[m.tipo];
                                const isOver = overModulo === m.numero;
                                
                                return (
                                    <div key={m.numero} onDragOver={e => handleDragOver(e, m.numero)} onDragLeave={handleDragLeave} onDrop={() => handleDrop(m.numero)}
                                        className="relative rounded-lg p-4 flex flex-col gap-3 transition-all group"
                                        style={{
                                            border: isOver ? `2px dashed ${C.primary}` : `1px solid ${C.border}`,
                                            backgroundColor: isOver ? '#e1e0ff' : (m.asesorAsignado ? C.surface : C.surfaceLow),
                                            minHeight: 140,
                                        }}>
                                        
                                        <button onClick={() => handleDeleteModulo(m.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity">
                                            <Icon icon="material-symbols:delete" className="text-base" />
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: C.surfaceHigh, color: C.textMain }}>{String(m.numero).padStart(2, '0')}</span>
                                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: tipoColor.bg, color: tipoColor.text }}>{m.tipo}</span>
                                        </div>

                                        {m.asesorAsignado ? (
                                            <div className="flex items-center gap-3 p-3 rounded border" style={{ backgroundColor: C.surfaceLow, borderColor: C.border }}>
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: C.primaryBg, color: C.primaryText }}>{m.asesorAsignado.iniciales}</div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold truncate" style={{ color: C.textMain }}>{m.asesorAsignado.nombre}</p>
                                                    <p className="text-[10px]" style={{ color: C.textSub }}>{m.asesorAsignado.especialidad}</p>
                                                </div>
                                                <button onClick={() => handleRemoveAsesor(m.numero)} style={{ color: C.textSub }} className="hover:text-red-500"><Icon icon="material-symbols:close" className="text-base" /></button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center flex-1 gap-1 text-center border-2 border-dashed border-gray-200 rounded-lg">
                                                <Icon icon="material-symbols:person-add" className="text-2xl" style={{ color: C.border }} />
                                                <p className="text-[10px] font-bold" style={{ color: C.textSub }}>Arrastrar aquí</p>
                                            </div>
                                        )}

                                    </div>
                                );
                            })}

                            {modulos.length === 0 && (
                                <div className="col-span-full py-12 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <Icon icon="material-symbols:grid-view" className="text-4xl text-gray-300 mb-2" />
                                    <p className="text-sm font-bold text-gray-400">No hay módulos definidos</p>
                                    <button onClick={() => setShowAddModulo(true)} className="mt-4 text-xs font-bold text-blue-600">Crear primer módulo</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Ocupación Mesa', value: `${capacidadPct}%`, icon: 'material-symbols:groups', color: C.primary },
                            { label: 'Turno Activo',    value: turno === 'morning' ? 'Mañana' : 'Tarde', icon: 'material-symbols:schedule', color: C.amber },
                            { label: 'Módulos Libres',  value: inactivos,       icon: 'material-symbols:check-circle', color: C.textSub },
                        ].map(({ label, value, icon, color }) => (
                            <div key={label} className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200">
                                <div><p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</p><p className="text-xl font-bold mt-1" style={{ color }}>{value}</p></div>
                                <Icon icon={icon} className="text-3xl opacity-20" style={{ color }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </>
            )}
            {/* Modal de Confirmación para Cambios sin Guardar */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                                <Icon icon="material-symbols:warning-rounded" className="text-4xl" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Cambiar de turno sin guardar?</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Tienes cambios en la mesa de asignación que no han sido guardados. Si continúas, perderás estos ajustes.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                                    Cancelar y seguir editando
                                </button>
                                <button onClick={() => pendingShift && ejecutarCambioTurno(pendingShift)}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-colors">
                                    Continuar sin guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal de Confirmación para Eliminar Módulo */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                                <Icon icon="material-symbols:delete-forever" className="text-4xl" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar módulo físico?</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Estás a punto de eliminar este módulo del sistema. Esta acción no se puede deshacer y afectará a las futuras asignaciones.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                                    Cancelar
                                </button>
                                <button onClick={ejecutarBorradoModulo}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-colors">
                                    Eliminar Módulo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
