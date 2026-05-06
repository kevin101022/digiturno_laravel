import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Icon } from '@iconify/react';

// ─── Colores fijos APE (Dark Mode Immune) ───────────────────────────────────
const C = {
    primary:          '#050066',
    primaryContainer: '#10069f',
    onPrimary:        '#ffffff',
    secondary:        '#7d5700',
    amber:            '#fdb300', // Amber SENA
    background:       '#fcf8ff',
    surface:          '#ffffff',
    surfaceLow:       '#f5f2fd',
    surfaceHigh:      '#eae7f2',
    border:           '#c7c5d6',
    textMain:         '#1b1b23',
    textSub:          '#464554',
    outline:          '#767685',
};

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Step = 'bienvenida' | 'identificacion' | 'calificacion' | 'cierre';

const TIPOS_DOC = ['Cédula de Ciudadanía', 'Tarjeta de Identidad', 'Cédula Extranjería', 'Pasaporte'];

// ─── Componentes de Pasos ──────────────────────────────────────────────────────

// 1. BIENVENIDA
function StepBienvenida({ onNext }: { onNext: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center gap-12 text-center animate-in fade-in zoom-in duration-500">
            <h1 className="text-6xl md:text-7xl font-bold leading-tight" style={{ color: C.textMain }}>
                ¿Fue atendido hoy?<br />
                <span style={{ color: C.primaryContainer }}>Califica tu atención</span>
            </h1>
            
            <button 
                onClick={onNext}
                className="group flex items-center justify-center gap-6 px-16 py-8 rounded-full shadow-2xl transition-all active:scale-95"
                style={{ backgroundColor: C.primaryContainer, color: 'white' }}
            >
                <Icon icon="material-symbols:touch-app" className="text-5xl group-hover:scale-110 transition-transform" />
                <span className="text-4xl font-bold">Comenzar Calificación</span>
            </button>

            <div className="flex items-center gap-2 opacity-60 mt-8" style={{ color: C.textSub }}>
                <Icon icon="material-symbols:verified-user" className="text-xl" />
                <span className="text-sm font-bold uppercase tracking-widest">Transacción segura y anónima</span>
            </div>
        </div>
    );
}

// 2. IDENTIFICACIÓN
function StepIdentificacion({ onNext }: { onNext: (doc: string) => void }) {
    const [tipoDoc, setTipoDoc] = useState(TIPOS_DOC[0]);
    const [numero, setNumero] = useState('');

    const addNum = (n: string) => setNumero(prev => (prev.length < 12 ? prev + n : prev));
    const delNum = () => setNumero(prev => prev.slice(0, -1));
    const clearNum = () => setNumero('');

    return (
        <div className="w-full max-w-2xl space-y-10">
            <div className="text-center space-y-4">
                <h2 className="text-5xl font-bold" style={{ color: C.primary }}>Identifica tu atención</h2>
                <p className="text-xl" style={{ color: C.textSub }}>Ingresa tu número de documento para encontrar tu registro.</p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-xl border border-[#c7c5d640] space-y-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest" style={{ color: C.textMain }}>Tipo de Documento</label>
                        <div className="relative">
                            <select 
                                value={tipoDoc} 
                                onChange={e => setTipoDoc(e.target.value)}
                                className="w-full h-16 bg-[#f5f2fd] border border-[#c7c5d6] rounded-xl px-6 text-xl outline-none appearance-none cursor-pointer"
                                style={{ color: C.textMain }}
                            >
                                {TIPOS_DOC.map(t => <option key={t}>{t}</option>)}
                            </select>
                            <Icon icon="material-symbols:keyboard-arrow-down" className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl pointer-events-none" style={{ color: C.textSub }} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest" style={{ color: C.textMain }}>Número de Documento</label>
                        <div 
                            className="w-full h-20 bg-white border-2 rounded-xl flex items-center justify-center text-4xl font-bold tracking-[0.2em]"
                            style={{ borderColor: C.primary, color: C.textMain }}
                        >
                            {numero || <span className="opacity-20">Ej. 1020304050</span>}
                        </div>
                    </div>
                </div>

                {/* Teclado Táctil */}
                <div className="grid grid-cols-3 gap-4 max-w-[400px] mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <button key={n} onClick={() => addNum(n.toString())}
                            className="h-20 bg-[#f5f2fd] active:bg-[#eae7f2] rounded-2xl border border-[#c7c5d6] text-3xl font-bold transition-all active:scale-90"
                            style={{ color: C.textMain }}>{n}</button>
                    ))}
                    <button onClick={clearNum} className="h-20 bg-[#eae7f2] rounded-2xl border border-[#c7c5d6] flex items-center justify-center transition-all active:scale-90">
                        <Icon icon="material-symbols:close" className="text-3xl" />
                    </button>
                    <button onClick={() => addNum('0')} className="h-20 bg-[#f5f2fd] rounded-2xl border border-[#c7c5d6] text-3xl font-bold transition-all active:scale-90" style={{ color: C.textMain }}>0</button>
                    <button onClick={delNum} className="h-20 bg-[#eae7f2] rounded-2xl border border-[#c7c5d6] flex items-center justify-center transition-all active:scale-90">
                        <Icon icon="material-symbols:backspace" className="text-3xl" />
                    </button>
                </div>
            </div>

            <button 
                onClick={() => onNext(numero)}
                disabled={!numero}
                className="w-full h-20 rounded-2xl font-bold text-3xl flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale shadow-lg"
                style={{ backgroundColor: C.primary, color: 'white' }}
            >
                <Icon icon="material-symbols:search" className="text-4xl" />
                Buscar mi atención
            </button>
        </div>
    );
}

// 3. CALIFICACIÓN
function StepCalificacion({ onNext }: { onNext: (rating: number) => void }) {
    const [rating, setRating] = useState(0);

    return (
        <div className="w-full max-w-4xl space-y-12 animate-in fade-in zoom-in duration-500">
            <div className="bg-white rounded-3xl p-12 shadow-xl border border-[#c7c5d640] flex flex-col items-center text-center gap-12">
                {/* Info Asesor (Simulado) */}
                <div className="flex flex-col items-center gap-6 w-full pb-10 border-b border-[#c7c5d640]">
                    <div className="w-40 h-40 rounded-full border-8 border-[#eae7f2] overflow-hidden shadow-inner">
                        <img src="https://ui-avatars.com/api/?name=Maria+Rodriguez&background=050066&color=fff&size=200" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-5xl font-bold" style={{ color: C.textMain }}>María Rodríguez</h2>
                        <div className="flex gap-4 justify-center">
                            <span className="px-6 py-2 bg-[#f5f2fd] rounded-full text-lg font-bold flex items-center gap-2" style={{ color: C.primary }}>
                                <Icon icon="material-symbols:desk" /> Ventanilla 04
                            </span>
                            <span className="px-6 py-2 bg-[#f5f2fd] rounded-full text-lg font-bold flex items-center gap-2" style={{ color: C.primary }}>
                                <Icon icon="material-symbols:schedule" /> 10:30 AM
                            </span>
                        </div>
                    </div>
                </div>

                {/* Pregunta */}
                <div className="space-y-10">
                    <h3 className="text-4xl font-bold" style={{ color: C.textMain }}>¿Cómo calificarías la atención recibida?</h3>
                    <div className="flex gap-4 md:gap-8">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button 
                                key={star}
                                onClick={() => setRating(star)}
                                className="group transition-all active:scale-90"
                            >
                                <Icon 
                                    icon="material-symbols:star" 
                                    className="text-[80px] md:text-[100px] transition-all"
                                    style={{ 
                                        color: rating >= star ? C.amber : '#c7c5d6',
                                        filter: rating >= star ? `drop-shadow(0 0 10px ${C.amber}60)` : 'none'
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={() => onNext(rating)}
                    disabled={rating === 0}
                    className="w-full max-w-md h-20 rounded-full font-bold text-3xl flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
                    style={{ backgroundColor: rating > 0 ? C.primary : '#c7c5d6', color: 'white' }}
                >
                    <span>Enviar Calificación</span>
                    <Icon icon="material-symbols:send" />
                </button>
            </div>
        </div>
    );
}

// 4. CIERRE
function StepCierre({ onReset }: { onReset: () => void }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    onReset();
                    return 100;
                }
                return prev + 1;
            });
        }, 50);
        return () => clearInterval(timer);
    }, [onReset]);

    return (
        <div className="flex flex-col items-center justify-center gap-12 text-center animate-in fade-in zoom-in duration-700">
            <div className="relative w-64 h-64 flex items-center justify-center rounded-full bg-white shadow-2xl border border-[#c7c5d640]">
                <div className="absolute inset-4 rounded-full opacity-10" style={{ backgroundColor: C.amber }} />
                <Icon icon="material-symbols:favorite" className="text-[120px]" style={{ color: C.primary }} />
            </div>

            <div className="space-y-6 max-w-3xl">
                <h1 className="text-6xl font-bold" style={{ color: C.primary }}>
                    ¡Muchas gracias por tu calificación!
                </h1>
                <p className="text-2xl leading-relaxed" style={{ color: C.textSub }}>
                    Tu opinión nos ayuda a mejorar nuestro servicio. Valoramos tu tiempo y tus comentarios para seguir ofreciendo la mejor experiencia posible.
                </p>
            </div>

            <div className="flex flex-col items-center gap-4 mt-8">
                <div className="flex items-center gap-3 opacity-60" style={{ color: C.textSub }}>
                    <Icon icon="material-symbols:refresh" className="text-3xl animate-spin-slow" />
                    <span className="text-xl font-bold uppercase tracking-widest">Reiniciando pantalla...</span>
                </div>
                <div className="w-80 h-3 bg-[#eae7f2] rounded-full overflow-hidden border border-[#c7c5d6]">
                    <div className="h-full transition-all duration-100 ease-linear" style={{ width: `${progress}%`, backgroundColor: C.primary }} />
                </div>
            </div>
        </div>
    );
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function KioscoFeedback() {
    const [step, setStep] = useState<Step>('bienvenida');
    const [doc, setDoc] = useState('');

    const reset = () => {
        setStep('bienvenida');
        setDoc('');
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden font-sans" style={{ backgroundColor: C.background }}>
            <Head title="Califica tu Atención — APE" />

            {/* Marca de agua de fondo */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none p-20">
                <img src="/imagenes/Logo APE 2024 (1).png" alt="Watermark" className="w-full h-full object-contain grayscale" />
            </div>

            {/* Header Logos (Opcional según paso) */}
            {step !== 'cierre' && (
                <header className="absolute top-12 w-full flex justify-center z-10">
                    <img src="/imagenes/Logo APE 2024 (1).png" alt="Logo APE" className="h-20 w-auto object-contain" />
                </header>
            )}

            {/* Contenido Principal */}
            <main className="z-10 w-full flex flex-col items-center justify-center p-12">
                {step === 'bienvenida' && <StepBienvenida onNext={() => setStep('identificacion')} />}
                {step === 'identificacion' && <StepIdentificacion onNext={(d) => { setDoc(d); setStep('calificacion'); }} />}
                {step === 'calificacion' && <StepCalificacion onNext={() => setStep('cierre')} />}
                {step === 'cierre' && <StepCierre onReset={reset} />}
            </main>

            {/* Footer Institucional */}
            {step === 'bienvenida' && (
                <footer className="absolute bottom-12 w-full flex justify-center z-10 opacity-60">
                    <img src="/imagenes/Logo APE 2024 (1).png" alt="Logo APE" className="h-12 w-auto object-contain" />
                </footer>
            )}
        </div>
    );
}

KioscoFeedback.layout = (page: any) => page;
