import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';
import asesoresRoutes from '@/routes/coordinador/asesores';

// ─── Colores fijos ────────────────────────────────────────────────────────────
const C = {
    primary: '#050066', primaryBg: '#e1e0ff', primaryText: '#05006c',
    amber: '#fdb300', amberText: '#271900',
    surface: '#ffffff', surfaceLow: '#f5f2fd', surfaceHigh: '#eae7f2',
    border: '#c7c5d6', textMain: '#1b1b23', textSub: '#464554',
    error: '#ba1a1a', errorBg: '#ffdad6',
    success: '#137333', successBg: '#e6f4ea',
} as const;

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Especialidad = 'general' | 'victimas';

interface Asesor {
    id: number;
    nombre: string;
    tipo_doc: string;
    numero_doc: string;
    especialidades: Especialidad[];
    activo: boolean;
}

const ESPECIALIDADES: { value: Especialidad; label: string; color: string; textColor: string }[] = [
    { value: 'general',    label: 'General',     color: '#e4e1ec', textColor: '#464554' },
    { value: 'victimas',   label: 'Atención Víctimas',    color: '#fdb300', textColor: '#271900' },
];

const TIPOS_DOC = ['Cédula de Ciudadanía', 'Tarjeta de Identidad', 'Cédula Extranjería', 'Pasaporte'];

// ─── Chip de especialidad ─────────────────────────────────────────────────────
function EspChip({ esp }: { esp: Especialidad }) {
    const e = ESPECIALIDADES.find(x => x.value === esp);
    if (!e) return null;
    return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
            style={{ backgroundColor: e.color, color: e.textColor }}>
            {e.label}
        </span>
    );
}

// ─── Modal CRUD ───────────────────────────────────────────────────────────────
function ModalAsesor({ asesor, onClose }: {
    asesor: Asesor;
    onClose: () => void;
}) {
    const [form, setForm] = useState<Asesor>({ ...asesor });
    const [confirmarEliminar, setConfirmarEliminar] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleEsp = (e: Especialidad) => {
        setForm(prev => {
            const tiene = prev.especialidades.includes(e);
            // Solo una especialidad permitida por ahora según la lógica simplificada
            return { ...prev, especialidades: [e] };
        });
    };

    const handleSave = () => {
        setLoading(true);
        router.put(asesoresRoutes.update(form.id).url, {
            nombre: form.nombre,
            numero_doc: form.numero_doc,
            activo: form.activo,
            especialidades: form.especialidades,
        }, {
            onSuccess: () => onClose(),
            onFinish: () => setLoading(false),
        });
    };

    const handleDelete = () => {
        setLoading(true);
        router.delete(asesoresRoutes.delete(form.id).url, {
            onSuccess: () => onClose(),
            onFinish: () => setLoading(false),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} onClick={onClose}>
            <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                style={{ backgroundColor: C.surface }} onClick={e => e.stopPropagation()}>

                {/* Header modal */}
                <div className="flex items-center justify-between px-6 py-4"
                    style={{ backgroundColor: C.surfaceLow, borderBottom: `1px solid ${C.border}` }}>
                    <h3 className="text-base font-bold" style={{ color: C.textMain }}>Editar Asesor</h3>
                    <button onClick={onClose} style={{ color: C.textSub }}
                        onMouseEnter={e => (e.currentTarget.style.color = C.error)}
                        onMouseLeave={e => (e.currentTarget.style.color = C.textSub)}>
                        <Icon icon="material-symbols:close" className="text-xl" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>
                            Nombre Completo
                        </label>
                        <input type="text" value={form.nombre}
                            onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
                            style={{ backgroundColor: C.surfaceHigh, borderColor: C.border, color: C.textMain }} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>Tipo Doc.</label>
                            <select value={form.tipo_doc} onChange={e => setForm(p => ({ ...p, tipo_doc: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none appearance-none"
                                style={{ backgroundColor: C.surfaceHigh, borderColor: C.border, color: C.textMain }}>
                                {TIPOS_DOC.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>N° Documento</label>
                            <input type="text" value={form.numero_doc}
                                onChange={e => setForm(p => ({ ...p, numero_doc: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                                style={{ backgroundColor: C.surfaceHigh, borderColor: C.border, color: C.textMain }} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>Especialidad</label>
                        <div className="flex gap-2">
                            {ESPECIALIDADES.map(e => {
                                const activo = form.especialidades.includes(e.value);
                                return (
                                    <button key={e.value} type="button" onClick={() => toggleEsp(e.value)}
                                        className="px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all"
                                        style={{
                                            backgroundColor: activo ? e.color : 'transparent',
                                            color: activo ? e.textColor : C.textSub,
                                            borderColor: activo ? e.color : C.border,
                                        }}>
                                        {e.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: C.surfaceLow }}>
                        <span className="text-xs font-bold" style={{ color: C.textMain }}>Estado del asesor</span>
                        <button onClick={() => setForm(p => ({ ...p, activo: !p.activo }))}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                            style={{ backgroundColor: form.activo ? C.successBg : C.errorBg, color: form.activo ? C.success : C.error }}>
                            <Icon icon={form.activo ? 'material-symbols:check-circle' : 'material-symbols:cancel'} className="text-sm" />
                            {form.activo ? 'Activo' : 'Inactivo'}
                        </button>
                    </div>

                    {confirmarEliminar ? (
                        <div className="p-3 rounded-lg space-y-2" style={{ backgroundColor: C.errorBg }}>
                            <p className="text-xs font-bold text-center" style={{ color: C.error }}>¿Confirmar eliminación?</p>
                            <div className="flex gap-2">
                                <button onClick={() => setConfirmarEliminar(false)}
                                    className="flex-1 py-2 rounded-lg border text-xs font-bold"
                                    style={{ borderColor: C.border, color: C.textSub, backgroundColor: C.surface }}>
                                    Cancelar
                                </button>
                                <button onClick={handleDelete} disabled={loading}
                                    className="flex-1 py-2 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2"
                                    style={{ backgroundColor: C.error }}>
                                    {loading && <Icon icon="line-md:loading-twotone-loop" />} Eliminar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setConfirmarEliminar(true)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-bold"
                                style={{ borderColor: C.error, color: C.error }}>
                                <Icon icon="material-symbols:delete" className="text-base" /> Eliminar
                            </button>
                            <button onClick={handleSave} disabled={loading}
                                className="flex-1 py-2.5 rounded-lg text-white text-xs font-bold flex items-center justify-center gap-2"
                                style={{ backgroundColor: C.primary }}>
                                {loading && <Icon icon="line-md:loading-twotone-loop" />} Guardar Cambios
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function GestionAsesores({ initialAsesores = [] }: { initialAsesores?: any[] }) {
    const [asesores, setAsesores] = useState<Asesor[]>(initialAsesores);
    const [busqueda, setBusqueda] = useState('');
    const [modalAsesor, setModalAsesor] = useState<Asesor | null>(null);
    const [guardado, setGuardado] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        setAsesores(initialAsesores);
    }, [initialAsesores]);

    const [form, setForm] = useState({
        nombre: '', tipo_doc: 'Cédula de Ciudadanía', numero_doc: '',
        password: '', especialidades: ['general'] as Especialidad[],
        mostrarPassword: false,
    });
    const [errores, setErrores] = useState<Record<string, string>>({});

    const toggleEspForm = (e: Especialidad) => {
        setForm(prev => ({ ...prev, especialidades: [e] }));
    };

    const handleCrear = () => {
        if (!form.nombre.trim() || !form.numero_doc.trim() || form.password.length < 6) {
            setErrores({
                nombre: !form.nombre.trim() ? 'Requerido' : '',
                numero_doc: !form.numero_doc.trim() ? 'Requerido' : '',
                password: form.password.length < 6 ? 'Mínimo 6 caracteres' : '',
            });
            return;
        }
        setErrores({});
        setLoading(true);

        router.post(asesoresRoutes.store().url, form, {
            onSuccess: () => {
                setForm({ nombre: '', tipo_doc: 'Cédula de Ciudadanía', numero_doc: '', password: '', especialidades: ['general'], mostrarPassword: false });
                setGuardado(true);
                setTimeout(() => setGuardado(false), 3000);
            },
            onFinish: () => setLoading(false),
        });
    };

    const filtrados = asesores.filter(a =>
        a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        a.numero_doc.includes(busqueda)
    );

    return (
        <>
            {modalAsesor && <ModalAsesor asesor={modalAsesor} onClose={() => setModalAsesor(null)} />}

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                <div className="xl:col-span-2">
                    <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
                        <div className="flex items-center gap-3 pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
                            <div className="p-2 rounded-lg" style={{ backgroundColor: C.primaryBg }}><Icon icon="material-symbols:person-add" className="text-xl" style={{ color: C.primary }} /></div>
                            <h3 className="text-sm font-bold" style={{ color: C.textMain }}>Registrar Asesor</h3>
                        </div>

                        {guardado && <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold" style={{ backgroundColor: C.successBg, color: C.success }}><Icon icon="material-symbols:check-circle" className="text-base" /> Registrado correctamente.</div>}

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>Nombre Completo *</label>
                            <input type="text" placeholder="Ej: Laura Martínez" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none" style={{ backgroundColor: C.surfaceHigh, borderColor: errores.nombre ? C.error : C.border }} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>Tipo Doc.</label>
                                <select value={form.tipo_doc} onChange={e => setForm(p => ({ ...p, tipo_doc: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border text-xs outline-none appearance-none" style={{ backgroundColor: C.surfaceHigh, borderColor: C.border }}>{TIPOS_DOC.map(t => <option key={t}>{t}</option>)}</select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>N° Identificación *</label>
                                <input type="text" placeholder="Ej: 1020304050" value={form.numero_doc} onChange={e => setForm(p => ({ ...p, numero_doc: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border text-xs outline-none" style={{ backgroundColor: C.surfaceHigh, borderColor: errores.numero_doc ? C.error : C.border }} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>Contraseña *</label>
                            <div className="relative">
                                <input type={form.mostrarPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="w-full pl-4 pr-10 py-2.5 rounded-lg border text-sm outline-none" style={{ backgroundColor: C.surfaceHigh, borderColor: errores.password ? C.error : C.border }} />
                                <button type="button" onClick={() => setForm(p => ({ ...p, mostrarPassword: !p.mostrarPassword }))} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: C.textSub }}><Icon icon={form.mostrarPassword ? 'material-symbols:visibility-off' : 'material-symbols:visibility'} /></button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>¿Es para Atención Víctimas?</label>
                            <div className="flex gap-2">
                                {ESPECIALIDADES.map(e => {
                                    const activo = form.especialidades.includes(e.value);
                                    return (
                                        <button key={e.value} type="button" onClick={() => toggleEspForm(e.value)} className="px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all" style={{ backgroundColor: activo ? e.color : 'transparent', color: activo ? e.textColor : C.textSub, borderColor: activo ? e.color : C.border }}>{e.label}</button>
                                    );
                                })}
                            </div>
                        </div>

                        <button onClick={handleCrear} disabled={loading} className="w-full py-3 rounded-full text-sm font-bold text-white transition-all flex items-center justify-center gap-2" style={{ backgroundColor: C.primary }}>{loading && <Icon icon="line-md:loading-twotone-loop" />} Registrar Asesor</button>
                    </div>
                </div>

                <div className="xl:col-span-3 flex flex-col gap-4">
                    <div className="rounded-xl overflow-hidden flex flex-col" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
                        <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: C.surfaceLow, borderBottom: `1px solid ${C.border}` }}>
                            <div className="flex items-center gap-2"><Icon icon="material-symbols:groups" className="text-xl" style={{ color: C.primary }} /><h3 className="text-sm font-bold" style={{ color: C.textMain }}>Asesores Registrados</h3><span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold" style={{ backgroundColor: C.primaryBg, color: C.primaryText }}>{asesores.length}</span></div>
                        </div>
                        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                            <div className="relative"><Icon icon="material-symbols:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-lg" style={{ color: C.textSub }} /><input type="text" placeholder="Buscar..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm outline-none" style={{ backgroundColor: C.surfaceHigh, borderColor: C.border }} /></div>
                        </div>
                        <div className="overflow-y-auto max-h-[480px]">
                            {filtrados.map((a, i) => (
                                <button key={a.id} onClick={() => setModalAsesor(a)} className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors" style={{ borderBottom: i < filtrados.length - 1 ? `1px solid ${C.border}40` : 'none' }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.surfaceHigh)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ backgroundColor: a.activo ? C.primaryBg : C.surfaceHigh, color: a.activo ? C.primaryText : C.textSub }}>{a.nombre ? a.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '??'}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2"><p className="text-sm font-bold truncate" style={{ color: C.textMain }}>{a.nombre}</p>{!a.activo && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0" style={{ backgroundColor: C.surfaceHigh, color: C.textSub }}>Inactivo</span>}</div>
                                        <p className="text-xs truncate" style={{ color: C.textSub }}>{a.numero_doc}</p>
                                        <div className="flex gap-1 mt-1 flex-wrap">{a.especialidades.map(e => <EspChip key={e} esp={e} />)}</div>
                                    </div>
                                    <Icon icon="material-symbols:edit" className="text-lg shrink-0" style={{ color: C.border }} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
