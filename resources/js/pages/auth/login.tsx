import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Icon } from '@iconify/react';

// ─── Colores fijos APE (Dark Mode Immune) ───────────────────────────────────
const C = {
    primary:          '#050066',
    primaryContainer: '#10069f',
    onPrimary:        '#ffffff',
    secondary:        '#fdb300', // Amber SENA
    onSecondary:      '#271900',
    background:       '#fcf8ff',
    surface:          '#ffffff',
    surfaceLow:       '#f5f2fd',
    surfaceHigh:      '#eae7f2',
    border:           '#c7c5d6',
    textMain:         '#1b1b23',
    textSub:          '#464554',
    outline:          '#767685',
    error:            '#ba1a1a',
    errorContainer:   '#ffdad6',
};

// ─── Componente Input Personalizado ──────────────────────────────────────────
function CustomInput({
    label, icon, type = 'text', placeholder, value, onChange, error, id, showToggle,
}: {
    label: string;
    icon: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    id: string;
    showToggle?: boolean;
}) {
    const [visible, setVisible] = useState(false);
    const inputType = showToggle ? (visible ? 'text' : 'password') : type;

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-[12px] font-bold uppercase tracking-wider" style={{ color: C.textMain }}>
                {label}
            </label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: C.outline }}>
                    <Icon icon={icon} className="text-xl group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    id={id}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-12 py-3 rounded-lg border outline-none transition-all duration-200 text-sm"
                    style={{
                        backgroundColor: C.surface,
                        borderColor: error ? C.error : C.border,
                        color: C.textMain,
                    }}
                    onFocus={e => {
                        e.currentTarget.style.borderColor = C.primary;
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${C.primary}20`;
                    }}
                    onBlur={e => {
                        e.currentTarget.style.borderColor = error ? C.error : C.border;
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                />
                {showToggle && (
                    <button
                        type="button"
                        onClick={() => setVisible(!visible)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:scale-110"
                        style={{ color: C.outline }}
                    >
                        <Icon icon={visible ? 'material-symbols:visibility-off' : 'material-symbols:visibility'} className="text-xl" />
                    </button>
                )}
            </div>
            {error && <p className="text-[11px] font-medium" style={{ color: C.error }}>{error}</p>}
        </div>
    );
}

// ─── Componente Select Personalizado ──────────────────────────────────────────
function CustomSelect({
    label, icon, value, onChange, options, id, error,
}: {
    label: string;
    icon: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    id: string;
    error?: string;
}) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-[12px] font-bold uppercase tracking-wider" style={{ color: C.textMain }}>
                {label}
            </label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: C.outline }}>
                    <Icon icon={icon} className="text-xl group-focus-within:text-primary transition-colors" />
                </div>
                <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    className="w-full pl-12 pr-10 py-3 rounded-lg border outline-none transition-all duration-200 text-sm appearance-none cursor-pointer"
                    style={{
                        backgroundColor: C.surface,
                        borderColor: error ? C.error : C.border,
                        color: C.textMain,
                    }}
                    onFocus={e => {
                        e.currentTarget.style.borderColor = C.primary;
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${C.primary}20`;
                    }}
                    onBlur={e => {
                        e.currentTarget.style.borderColor = error ? C.error : C.border;
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.outline }}>
                    <Icon icon="material-symbols:expand-more" className="text-xl" />
                </div>
            </div>
            {error && <p className="text-[11px] font-medium" style={{ color: C.error }}>{error}</p>}
        </div>
    );
}

// ─── Pantalla de Login ────────────────────────────────────────────────────────
const TIPOS_DOC = ['Cédula de Ciudadanía', 'Tarjeta de Identidad', 'Cédula Extranjería', 'Pasaporte'];

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        tipo_doc: 'Cédula de Ciudadanía',
        numero_doc: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login'); // Ruta estándar de Fortify/Laravel
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden" style={{ backgroundColor: C.background }}>
            <Head title="Inicio de Sesión — APE" />

            {/* Decoración de fondo (Blurs) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-30" style={{ backgroundColor: '#c0c1ff' }} />
                <div className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-40" style={{ backgroundColor: C.surfaceHigh }} />
            </div>

            {/* Card Principal */}
            <main className="z-10 w-full max-w-[420px] p-4 md:p-0">
                <div 
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border transition-all duration-300"
                    style={{ borderColor: `${C.border}40` }}
                >
                    {/* Acento superior */}
                    <div className="h-2 w-full" style={{ backgroundColor: C.primary }} />

                    <div className="p-8 md:p-10 space-y-8">
                        {/* Logo */}
                        <div className="flex justify-center">
                            <img 
                                src="/imagenes/Logo APE 2024 (1).png" 
                                alt="Logo APE SENA" 
                                className="h-16 w-auto object-contain"
                            />
                        </div>

                        {/* Encabezado */}
                        <div className="text-center space-y-2">
                            <h1 className="text-xl font-bold" style={{ color: C.textMain }}>
                                Inicio de Sesión Administrativo
                            </h1>
                            <p className="text-xs" style={{ color: C.textSub }}>
                                Ingrese sus credenciales para acceder a la plataforma
                            </p>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <CustomSelect
                                id="tipo_doc"
                                label="Tipo de Documento"
                                icon="material-symbols:id-card"
                                options={TIPOS_DOC}
                                value={data.tipo_doc}
                                onChange={e => setData('tipo_doc', e.target.value)}
                                error={errors.tipo_doc}
                            />

                            <CustomInput
                                id="numero_doc"
                                label="Número de Documento"
                                icon="material-symbols:badge"
                                placeholder="Ej: 1020304050"
                                value={data.numero_doc}
                                onChange={e => setData('numero_doc', e.target.value)}
                                error={errors.numero_doc}
                            />

                            <CustomInput
                                id="password"
                                label="Contraseña"
                                icon="material-symbols:lock"
                                type="password"
                                placeholder="••••••••"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                error={errors.password}
                                showToggle
                            />

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                        className="hidden"
                                    />
                                    <div 
                                        className="w-4 h-4 rounded border transition-all flex items-center justify-center"
                                        style={{ 
                                            borderColor: data.remember ? C.primary : C.border,
                                            backgroundColor: data.remember ? C.primary : 'transparent'
                                        }}
                                    >
                                        {data.remember && <Icon icon="material-symbols:check" className="text-white text-[10px]" />}
                                    </div>
                                    <span className="text-xs font-medium" style={{ color: C.textSub }}>Recordarme</span>
                                </label>
                                <a href="#" className="text-xs font-bold hover:underline" style={{ color: C.primary }}>
                                    ¿Olvidó su contraseña?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                                style={{ 
                                    backgroundColor: C.primary,
                                    boxShadow: `0 4px 14px ${C.primary}40`
                                }}
                            >
                                {processing ? (
                                    <Icon icon="line-md:loading-twotone-loop" className="text-xl" />
                                ) : (
                                    <>
                                        <span>Iniciar Sesión</span>
                                        <Icon icon="material-symbols:arrow-forward-rounded" className="text-xl" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer 
                className="mt-8 py-6 w-full flex flex-col items-center justify-center gap-4 text-center px-4"
                style={{ borderTop: `1px solid ${C.border}30` }}
            >
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.textSub }}>
                    © 2026 Servicio Nacional de Aprendizaje SENA — Agencia Pública de Empleo
                </p>
                <div className="flex gap-6">
                    {['Términos y Condiciones', 'Política de Privacidad', 'Soporte'].map(link => (
                        <a key={link} href="#" className="text-[10px] font-medium hover:underline" style={{ color: C.outline }}>
                            {link}
                        </a>
                    ))}
                </div>
            </footer>
        </div>
    );
}

// ─── Desactivar Layout por defecto para esta página ──────────────────────────
Login.layout = (page: any) => page;
