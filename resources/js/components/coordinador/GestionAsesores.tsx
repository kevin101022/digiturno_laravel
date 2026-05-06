import { useState } from 'react';
import { Icon } from '@iconify/react';

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
type Especialidad = 'general' | 'victimas' | 'empresas' | 'prioritario';

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
    { value: 'victimas',   label: 'Víctimas',    color: '#fdb300', textColor: '#271900' },
    { value: 'empresas',   label: 'Empresas',    color: '#e1e0ff', textColor: '#05006c' },
    { value: 'prioritario',label: 'Prioritario', color: '#ffdad6', textColor: '#93000a' },
];

const TIPOS_DOC = ['Cédula de Ciudadanía', 'Tarjeta de Identidad', 'Cédula Extranjería', 'Pasaporte'];

const MOCK_ASESORES: Asesor[] = [
    { id: 1, nombre: 'María Rodríguez', tipo_doc: 'Cédula de Ciudadanía', numero_doc: '1020304050', especialidades: ['general', 'victimas'], activo: true },
    { id: 2, nombre: 'Juan Pérez',      tipo_doc: 'Cédula de Ciudadanía', numero_doc: '9988776655', especialidades: ['general'],              activo: true },
    { id: 3, nombre: 'Laura Gómez',     tipo_doc: 'Cédula de Ciudadanía', numero_doc: '5544332211', especialidades: ['empresas'],             activo: true },
    { id: 4, nombre: 'Carlos Mora',     tipo_doc: 'Cédula de Ciudadanía', numero_doc: '3322114455', especialidades: ['general', 'prioritario'],activo: false },
];

// ─── Chip de especialidad ─────────────────────────────────────────────────────
function EspChip({ esp }: { esp: Especialidad }) {
    const e = ESPECIALIDADES.find(x => x.value === esp)!;
    return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
            style={{ backgroundColor: e.color, color: e.textColor }}>
            {e.label}
        </span>
    );
}

// ─── Modal CRUD ───────────────────────────────────────────────────────────────
function ModalAsesor({ asesor, onClose, onSave, onDelete }: {
    asesor: Asesor;
    onClose: () => void;
    onSave: (a: Asesor) => void;
    onDelete: (id: number) => void;
}) {
    const [form, setForm] = useState<Asesor>({ ...asesor });
    const [confirmarEliminar, setConfirmarEliminar] = useState(false);

    const toggleEsp = (e: Especialidad) => {
        setForm(prev => {
            const tiene = prev.especialidades.includes(e);
            if (tiene && prev.especialidades.length === 1) return prev;
            return { ...prev, especialidades: tiene ? prev.especialidades.filter(x => x !== e) : [...prev.especialidades, e] };
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
                    {/* Nombre */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>
                            Nombre Completo
                        </label>
                        <input type="text" value={form.nombre}
                            onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
                            style={{ backgroundColor: C.surfaceHigh, borderColor: C.border, color: C.textMain }}
                            onFocus={e => (e.currentTarget.style.borderColor = C.primary)}
                            onBlur={e => (e.currentTarget.style.borderColor = C.border)} />
                    </div>

                    {/* Documento */}
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
                                style={{ backgroundColor: C.surfaceHigh, borderColor: C.border, color: C.textMain }}
                                onFocus={e => (e.currentTarget.style.borderColor = C.primary)}
                                onBlur={e => (e.currentTarget.style.borderColor = C.border)} />
                        </div>
                    </div>

                    {/* Especialidades */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>
                            Especialidades
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {ESPECIALIDADES.map(e => {
                                const activo = form.especialidades.includes(e.value);
                                return (
                                    <button key={e.value} type="button" onClick={() => toggleEsp(e.value)}
                                        className="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
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

                    {/* Estado */}
                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: C.surfaceLow }}>
                        <span className="text-xs font-bold" style={{ color: C.textMain }}>Estado del asesor</span>
                        <button onClick={() => setForm(p => ({ ...p, activo: !p.activo }))}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                            style={{
                                backgroundColor: form.activo ? C.successBg : C.errorBg,
                                color: form.activo ? C.success : C.error,
                            }}>
                            <Icon icon={form.activo ? 'material-symbols:check-circle' : 'material-symbols:cancel'} className="text-sm" />
                            {form.activo ? 'Activo' : 'Inactivo'}
                        </button>
                    </div>

                    {/* Acciones */}
                    {confirmarEliminar ? (
                        <div className="p-3 rounded-lg space-y-2" style={{ backgroundColor: C.errorBg }}>
                            <p className="text-xs font-bold text-center" style={{ color: C.error }}>¿Confirmar eliminación?</p>
                            <div className="flex gap-2">
                                <button onClick={() => setConfirmarEliminar(false)}
                                    className="flex-1 py-2 rounded-lg border text-xs font-bold"
                                    style={{ borderColor: C.border, color: C.textSub, backgroundColor: C.surface }}>
                                    Cancelar
                                </button>
                                <button onClick={() => onDelete(form.id)}
                                    className="flex-1 py-2 rounded-lg text-xs font-bold text-white"
                                    style={{ backgroundColor: C.error }}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setConfirmarEliminar(true)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-bold"
                                style={{ borderColor: C.error, color: C.error }}>
                                <Icon icon="material-symbols:delete" className="text-base" />
                                Eliminar
                            </button>
                            <button onClick={() => onSave(form)}
                                className="flex-1 py-2.5 rounded-lg text-white text-xs font-bold"
                                style={{ backgroundColor: C.primary }}>
                                Guardar Cambios
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function GestionAsesores() {
    const [asesores, setAsesores] = useState<Asesor[]>(MOCK_ASESORES);
    const [busqueda, setBusqueda] = useState('');
    const [modalAsesor, setModalAsesor] = useState<Asesor | null>(null);
    const [guardado, setGuardado] = useState(false);

    // Form nuevo asesor
    const [form, setForm] = useState({
        nombre: '', tipo_doc: 'Cédula de Ciudadanía', numero_doc: '',
        password: '', especialidades: ['general'] as Especialidad[],
        mostrarPassword: false,
    });
    const [errores, setErrores] = useState<Record<string, string>>({});

    const toggleEspForm = (e: Especialidad) => {
        setForm(prev => {
            const tiene = prev.especialidades.includes(e);
            if (tiene && prev.especialidades.length === 1) return prev;
            return { ...prev, especialidades: tiene ? prev.especialidades.filter(x => x !== e) : [...prev.especialidades, e] };
        });
    };

    const validar = () => {
        const e: Record<string, string> = {};
        if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
        if (!form.numero_doc.trim()) e.numero_doc = 'El número de documento es requerido';
        if (!form.password || form.password.length < 6) e.password = 'Mínimo 6 caracteres';
        return e;
    };

    const handleCrear = () => {
        const e = validar();
        if (Object.keys(e).length > 0) { setErrores(e); return; }
        setErrores({});
        setAsesores(prev => [...prev, {
            id: Date.now(), nombre: form.nombre, tipo_doc: form.tipo_doc,
            numero_doc: form.numero_doc, especialidades: form.especialidades, activo: true,
        }]);
        setForm({ nombre: '', tipo_doc: 'Cédula de Ciudadanía', numero_doc: '', password: '', especialidades: ['general'], mostrarPassword: false });
        setGuardado(true);
        setTimeout(() => setGuardado(false), 3000);
    };

    const handleSave = (actualizado: Asesor) => {
        setAsesores(prev => prev.map(a => a.id === actualizado.id ? actualizado : a));
        setModalAsesor(null);
    };

    const handleDelete = (id: number) => {
        setAsesores(prev => prev.filter(a => a.id !== id));
        setModalAsesor(null);
    };

    const filtrados = asesores.filter(a =>
        a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        a.numero_doc.includes(busqueda)
    );

    return (
        <>
            {modalAsesor && (
                <ModalAsesor asesor={modalAsesor}
                    onClose={() => setModalAsesor(null)}
                    onSave={handleSave}
                    onDelete={handleDelete} />
            )}

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

                {/* ── Formulario de creación ──────────────────────── */}
                <div className="xl:col-span-2">
                    <div className="rounded-xl p-5 space-y-4"
                        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
                        <div className="flex items-center gap-3 pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
                            <div className="p-2 rounded-lg" style={{ backgroundColor: C.primaryBg }}>
                                <Icon icon="material-symbols:person-add" className="text-xl" style={{ color: C.primary }} />
                            </div>
                            <h3 className="text-sm font-bold" style={{ color: C.textMain }}>Registrar Asesor</h3>
                        </div>

                        {guardado && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold"
                                style={{ backgroundColor: C.successBg, color: C.success }}>
                                <Icon icon="material-symbols:check-circle" className="text-base" />
                                Asesor registrado correctamente.
                            </div>
                        )}

                        {/* Nombre */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>
                                Nombre Completo *
                            </label>
                            <input type="text" placeholder="Ej: Laura Martínez" value={form.nombre}
                                onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
                                style={{ backgroundColor: C.surfaceHigh, borderColor: errores.nombre ? C.error : C.border, color: C.textMain }}
                                onFocus={e => (e.currentTarget.style.borderColor = C.primary)}
                                onBlur={e => (e.currentTarget.style.borderColor = errores.nombre ? C.error : C.border)} />
                            {errores.nombre && <p className="text-[11px]" style={{ color: C.error }}>{errores.nombre}</p>}
                        </div>

                        {/* Tipo + Número doc */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>Tipo Doc.</label>
                                <select value={form.tipo_doc} onChange={e => setForm(p => ({ ...p, tipo_doc: e.target.value }))}
                                    className="w-full px-3 py-2.5 rounded-lg border text-xs outline-none appearance-none"
                                    style={{ backgroundColor: C.surfaceHigh, borderColor: C.border, color: C.textMain }}>
                                    {TIPOS_DOC.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>N° Identificación *</label>
                                <input type="text" placeholder="Ej: 1020304050" value={form.numero_doc}
                                    onChange={e => setForm(p => ({ ...p, numero_doc: e.target.value }))}
                                    className="w-full px-3 py-2.5 rounded-lg border text-xs outline-none"
                                    style={{ backgroundColor: C.surfaceHigh, borderColor: errores.numero_doc ? C.error : C.border, color: C.textMain }}
                                    onFocus={e => (e.currentTarget.style.borderColor = C.primary)}
                                    onBlur={e => (e.currentTarget.style.borderColor = errores.numero_doc ? C.error : C.border)} />
                                {errores.numero_doc && <p className="text-[11px]" style={{ color: C.error }}>{errores.numero_doc}</p>}
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>
                                Contraseña *
                            </label>
                            <div className="relative">
                                <input type={form.mostrarPassword ? 'text' : 'password'}
                                    placeholder="Mínimo 6 caracteres" value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                    className="w-full pl-4 pr-10 py-2.5 rounded-lg border text-sm outline-none"
                                    style={{ backgroundColor: C.surfaceHigh, borderColor: errores.password ? C.error : C.border, color: C.textMain }}
                                    onFocus={e => (e.currentTarget.style.borderColor = C.primary)}
                                    onBlur={e => (e.currentTarget.style.borderColor = errores.password ? C.error : C.border)} />
                                <button type="button" onClick={() => setForm(p => ({ ...p, mostrarPassword: !p.mostrarPassword }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: C.textSub }}>
                                    <Icon icon={form.mostrarPassword ? 'material-symbols:visibility-off' : 'material-symbols:visibility'} className="text-base" />
                                </button>
                            </div>
                            {errores.password && <p className="text-[11px]" style={{ color: C.error }}>{errores.password}</p>}
                        </div>

                        {/* Especialidades */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSub }}>
                                Puede Atender <span className="normal-case font-normal">(opcional, default: General)</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {ESPECIALIDADES.map(e => {
                                    const activo = form.especialidades.includes(e.value);
                                    return (
                                        <button key={e.value} type="button" onClick={() => toggleEspForm(e.value)}
                                            className="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
                                            style={{
                                                backgroundColor: activo ? e.color : 'transparent',
                                                color: activo ? e.textColor : C.textSub,
                                                borderColor: activo ? e.color : C.border,
                                            }}>
                                            {activo && <Icon icon="material-symbols:check-small" className="inline text-xs mr-0.5" />}
                                            {e.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-[11px]" style={{ color: C.textSub }}>
                                El asesor podrá acceder con su número de documento y contraseña.
                            </p>
                        </div>

                        <button onClick={handleCrear}
                            className="w-full py-3 rounded-full text-sm font-bold text-white transition-all"
                            style={{ backgroundColor: C.primary }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#10069f')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.primary)}>
                            Registrar Asesor
                        </button>
                    </div>
                </div>

                {/* ── Lista de Asesores ───────────────────────────── */}
                <div className="xl:col-span-3 flex flex-col gap-4">
                    <div className="rounded-xl overflow-hidden flex flex-col"
                        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>

                        {/* Header lista */}
                        <div className="px-5 py-4 flex items-center justify-between"
                            style={{ backgroundColor: C.surfaceLow, borderBottom: `1px solid ${C.border}` }}>
                            <div className="flex items-center gap-2">
                                <Icon icon="material-symbols:groups" className="text-xl" style={{ color: C.primary }} />
                                <h3 className="text-sm font-bold" style={{ color: C.textMain }}>
                                    Asesores Registrados
                                </h3>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                                    style={{ backgroundColor: C.primaryBg, color: C.primaryText }}>
                                    {asesores.length}
                                </span>
                            </div>
                        </div>

                        {/* Buscador */}
                        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                            <div className="relative">
                                <Icon icon="material-symbols:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-lg"
                                    style={{ color: C.textSub }} />
                                <input type="text" placeholder="Buscar por nombre o documento..."
                                    value={busqueda} onChange={e => setBusqueda(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm outline-none"
                                    style={{ backgroundColor: C.surfaceHigh, borderColor: C.border, color: C.textMain }}
                                    onFocus={e => (e.currentTarget.style.borderColor = C.primary)}
                                    onBlur={e => (e.currentTarget.style.borderColor = C.border)} />
                                {busqueda && (
                                    <button onClick={() => setBusqueda('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: C.textSub }}>
                                        <Icon icon="material-symbols:close" className="text-base" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Lista */}
                        <div className="overflow-y-auto max-h-[480px]">
                            {filtrados.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 py-12 text-center">
                                    <Icon icon="material-symbols:search-off" className="text-4xl" style={{ color: C.border }} />
                                    <p className="text-sm font-bold" style={{ color: C.textSub }}>No se encontraron asesores</p>
                                    <p className="text-xs" style={{ color: C.border }}>Intenta con otro nombre o documento</p>
                                </div>
                            ) : filtrados.map((a, i) => (
                                <button key={a.id} onClick={() => setModalAsesor(a)}
                                    className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors"
                                    style={{ borderBottom: i < filtrados.length - 1 ? `1px solid ${C.border}40` : 'none' }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.surfaceHigh)}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>

                                    {/* Avatar iniciales */}
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                                        style={{ backgroundColor: a.activo ? C.primaryBg : C.surfaceHigh, color: a.activo ? C.primaryText : C.textSub }}>
                                        {a.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold truncate" style={{ color: C.textMain }}>{a.nombre}</p>
                                            {!a.activo && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                                                    style={{ backgroundColor: C.surfaceHigh, color: C.textSub }}>
                                                    Inactivo
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs truncate" style={{ color: C.textSub }}>
                                            {a.tipo_doc}: {a.numero_doc}
                                        </p>
                                        <div className="flex gap-1 mt-1 flex-wrap">
                                            {a.especialidades.map(e => <EspChip key={e} esp={e} />)}
                                        </div>
                                    </div>

                                    {/* Icono editar */}
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
