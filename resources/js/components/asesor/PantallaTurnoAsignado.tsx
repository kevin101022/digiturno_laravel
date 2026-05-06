import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { TurnoActual } from '@/types/asesor';

interface Props {
    turno: TurnoActual;
    onIniciarAtencion: () => void;
    onReLlamar: () => void;
    onNoPresentado: () => void;
    onFinalizarAtencion: () => void;
}

export default function PantallaTurnoAsignado({ turno, onIniciarAtencion, onReLlamar, onNoPresentado, onFinalizarAtencion }: Props) {
    const [segundos, setSegundos] = useState(0);
    const [atencionIniciada, setAtencionIniciada] = useState(false);

    useEffect(() => {
        let interval: any;
        if (atencionIniciada) {
            interval = setInterval(() => {
                setSegundos(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [atencionIniciada]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        setAtencionIniciada(true);
        setSegundos(0); // Reiniciar cronómetro al empezar atención
        onIniciarAtencion();
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header de la Página con Badge */}
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-[#464554] text-xs font-bold uppercase tracking-widest mb-1">Ventanilla 04</p>
                    <h2 className="text-3xl font-bold text-[#1b1b23]">Gestión de Turno</h2>
                </div>
                <div className={`px-5 py-2 rounded-full flex items-center gap-2 shadow-sm border transition-colors ${
                    atencionIniciada ? 'bg-green-100 text-green-700 border-green-200' : 'bg-[#fdb300] text-[#271900] border-[#e6a200]'
                }`}>
                    <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${atencionIniciada ? 'bg-green-600' : 'bg-[#271900]'}`}></span>
                    <span className="text-xs font-bold uppercase tracking-tight">
                        {atencionIniciada ? 'En Atención' : 'Turno Asignado'}
                    </span>
                </div>
            </div>

            {/* Layout Bento Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Visualización Principal del Turno (8 columnas) */}
                <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-[#c7c5d6] overflow-hidden flex flex-col relative shadow-sm">
                    <div className={`h-1.5 w-full absolute top-0 left-0 transition-colors ${atencionIniciada ? 'bg-green-500' : 'bg-[#10069f]'}`}></div>
                    
                    <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        {/* Número de Turno */}
                        <div className="flex flex-col items-center justify-center flex-1">
                            <span className="text-[#464554] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Turno Actual</span>
                            <div className={`font-['Syne'] text-[100px] font-bold leading-none tracking-tighter transition-colors ${atencionIniciada ? 'text-green-700' : 'text-[#050066]'}`}>
                                {turno.codigo}
                            </div>
                            <div className="mt-6 bg-[#efecf8] px-4 py-2 rounded-lg text-[#1b1b23] text-sm font-bold border border-[#c7c5d6]">
                                Categoría: {turno.ciudadano.categoria === 'victim' ? 'Víctima' : 'General'}
                            </div>
                        </div>

                        {/* Divisor */}
                        <div className="hidden md:block w-px h-40 bg-[#e4e1ec]"></div>

                        {/* Cronómetro de Llamado */}
                        <div className="flex flex-col items-center justify-center flex-1">
                            <span className="text-[#464554] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                                {atencionIniciada ? 'Tiempo de Atención' : 'Tiempo de Llamado'}
                            </span>
                            <div className={`text-5xl font-bold tabular-nums px-8 py-5 rounded-2xl border shadow-inner transition-all ${
                                atencionIniciada ? 'bg-green-50 text-green-700 border-green-200' : 'bg-[#f5f2fd] text-[#1b1b23] border-[#e4e1ec]'
                            }`}>
                                {formatTime(segundos)}
                            </div>
                            <p className="text-[#464554] text-xs mt-6 text-center max-w-[220px] leading-relaxed">
                                {atencionIniciada 
                                    ? 'Atención en progreso. Registre la información en el sistema misional.' 
                                    : 'El usuario ha sido llamado. Esperando confirmación de presencia en ventanilla.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Panel de Acciones (4 columnas) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-white rounded-2xl border border-[#c7c5d6] p-6 flex flex-col gap-4 shadow-sm flex-1 justify-center">
                        <h3 className="text-[10px] font-bold text-[#464554] uppercase tracking-widest mb-2 border-b border-[#efecf8] pb-3">ACCIONES REQUERIDAS</h3>
                        
                        <div className="flex flex-col gap-4">
                            {!atencionIniciada ? (
                                <>
                                    <ActionButton 
                                        icon="material-symbols:play-arrow-outline" 
                                        label="Iniciar Atención" 
                                        onClick={handleStart}
                                        variant="primary" 
                                    />
                                    <ActionButton 
                                        icon="material-symbols:campaign-outline" 
                                        label="Volver a llamar" 
                                        onClick={onReLlamar}
                                        variant="secondary"
                                    />
                                    <ActionButton 
                                        icon="material-symbols:person-off-outline" 
                                        label="No presentado" 
                                        onClick={onNoPresentado}
                                        variant="error" 
                                    />
                                </>
                            ) : (
                                <ActionButton 
                                    icon="material-symbols:check-circle-outline" 
                                    label="Finalizar Atención" 
                                    onClick={onFinalizarAtencion}
                                    variant="primary" 
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Área Auxiliar: Información del Ciudadano */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <InfoCard 
                    icon="material-symbols:person" 
                    title="Datos del Ciudadano"
                    content={`${turno.ciudadano.nombre} - ${turno.ciudadano.documento}`}
                />
                <InfoCard 
                    icon="material-symbols:info" 
                    title="Notas de Prioridad"
                    content={turno.ciudadano.categoria === 'victim' ? 'Requiere validación RUV obligatoria.' : 'Atención estándar.'}
                    variant={turno.ciudadano.categoria === 'victim' ? 'warning' : 'default'}
                />
            </div>
        </div>
    );
}

function ActionButton({ icon, label, onClick, variant = 'secondary' }: { icon: string; label: string; onClick: () => void; variant?: 'primary' | 'secondary' | 'error' }) {
    const styles = {
        primary: 'bg-[#10069f] text-white hover:bg-[#05006c]',
        secondary: 'bg-white text-[#10069f] border-2 border-[#10069f] hover:bg-[#f5f2fd]',
        error: 'bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white',
    };

    return (
        <button 
            onClick={onClick}
            className={`w-full h-14 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${styles[variant]}`}
        >
            <Icon icon={icon} className="text-2xl" />
            <span>{label}</span>
        </button>
    );
}

function InfoCard({ icon, title, content, variant = 'default' }: { icon: string; title: string; content: string; variant?: 'default' | 'warning' }) {
    const isWarning = variant === 'warning';
    return (
        <div className={`p-6 rounded-2xl border flex items-center gap-4 shadow-sm ${
            isWarning ? 'bg-[#fff3cc] border-[#ffb300]' : 'bg-white border-[#c7c5d6]'
        }`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isWarning ? 'bg-[#fdb300] text-[#271900]' : 'bg-[#e1e0ff] text-[#10069f]'
            }`}>
                <Icon icon={icon} className="text-2xl" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-[#464554] uppercase tracking-wider">{title}</p>
                <p className="text-sm font-bold text-[#1b1b23]">{content}</p>
            </div>
        </div>
    );
}
