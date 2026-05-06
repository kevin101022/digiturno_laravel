import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface Props {
    onTerminarPausa: () => void;
}

export default function PantallaPausa({ onTerminarPausa }: Props) {
    const [segundos, setSegundos] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSegundos(s => s + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1b1b23]/60 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-white p-10 rounded-[32px] shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 animate-in zoom-in slide-in-from-bottom-8 duration-500 text-center">
                
                {/* Icono de Pausa Estilo Stitch */}
                <div className="w-24 h-24 rounded-full bg-[#fff3cc] flex items-center justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#ffb300]/20">
                        <Icon icon="material-symbols:pause-circle" className="text-5xl text-[#ffb300]" />
                    </div>
                </div>

                <h2 className="text-4xl font-bold text-[#1b1b23] mb-4">En Pausa</h2>
                
                {/* Motivo y Cronómetro */}
                <div className="flex flex-col gap-2 mb-8 w-full">
                    <div className="bg-[#efecf8] px-4 py-2 rounded-full flex items-center justify-center gap-2 mx-auto">
                        <Icon icon="material-symbols:info-outline" className="text-[#10069f]" />
                        <span className="text-sm font-bold text-[#464554]">Motivo: <span className="text-[#10069f]">Descanso</span></span>
                    </div>
                    <div className="text-3xl font-mono font-bold text-[#10069f] tracking-widest mt-2 tabular-nums">
                        {formatTime(segundos)}
                    </div>
                </div>

                {/* Botón Reanudar */}
                <button 
                    onClick={onTerminarPausa}
                    className="w-full bg-[#050066] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#10069f] transition-all active:scale-95 shadow-lg shadow-[#050066]/20"
                >
                    <Icon icon="material-symbols:play-circle-outline" className="text-2xl" />
                    <span className="uppercase tracking-widest text-sm">Reanudar Ventanilla</span>
                </button>

                <p className="mt-6 text-xs text-[#464554] max-w-[200px] leading-relaxed">
                    Su ventanilla no está recibiendo nuevos turnos.
                </p>
            </div>
        </div>
    );
}
