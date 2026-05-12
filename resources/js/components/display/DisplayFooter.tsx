import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface Props {
    stats: {
        citasHoy: number;
        tiempoPromedioMinutos: number;
    };
}

export default function DisplayFooter({ stats }: Props) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 60000); // Update every minute is enough
        return () => clearInterval(timer);
    }, []);

    const formattedTime = time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return (
        <footer className="bg-[#f5f2fd] border-t border-[#c7c5d6] shadow-sm w-full px-8 lg:px-12 2xl:px-[64px] py-4 flex flex-col md:flex-row justify-between items-center z-50 min-h-[80px] shrink-0 gap-4">
            <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8">
                <div className="flex items-center gap-2 lg:gap-3 text-[#1b1b23]">
                    <Icon icon="material-symbols:timer" className="text-[#050066] text-xl lg:text-2xl" />
                    <span className="font-['Plus_Jakarta_Sans'] text-[10px] lg:text-[12px] font-bold uppercase tracking-widest text-center">Tiempo promedio: {stats.tiempoPromedioMinutos} min</span>
                </div>
                
                <div className="hidden md:block h-6 w-px bg-[#c7c5d6]"></div>
                
                <div className="flex items-center gap-2 lg:gap-3 text-[#1b1b23]">
                    <Icon icon="material-symbols:groups" className="text-[#050066] text-xl lg:text-2xl" />
                    <span className="font-['Plus_Jakarta_Sans'] text-[10px] lg:text-[12px] font-bold uppercase tracking-widest text-center">Citas hoy: {stats.citasHoy}</span>
                </div>
                
                <div className="hidden lg:block h-6 w-px bg-[#c7c5d6]"></div>
                
                <span className="font-['Plus_Jakarta_Sans'] text-[9px] md:text-[11px] lg:text-[12px] font-bold text-[#464554] uppercase tracking-widest text-center w-full lg:w-auto mt-1 lg:mt-0">
                    SENA - Agencia Pública de Empleo | 2026
                </span>
            </div>

            <div className="flex items-center gap-3 lg:gap-4 bg-[#efecf8] px-4 lg:px-6 py-2 rounded-lg border border-[#c7c5d6]">
                <Icon icon="material-symbols:schedule" className="text-[#050066] text-xl lg:text-2xl" />
                <span className="font-['Plus_Jakarta_Sans'] text-[18px] lg:text-[24px] text-[#050066] font-bold tracking-widest">
                    {formattedTime}
                </span>
            </div>
        </footer>
    );
}
