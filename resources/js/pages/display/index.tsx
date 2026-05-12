import { useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import TurnoActual from '@/components/display/TurnoActual';
import SidebarUltimosLlamados from '@/components/display/SidebarUltimosLlamados';
import DisplayFooter from '@/components/display/DisplayFooter';

interface Props {
    turnoActual: {
        id: number;
        codigo: string;
        modulo: string;
        ciudadano: string;
    } | null;
    ultimosLlamados: Array<{
        codigo: string;
        modulo: string;
    }>;
    stats: {
        citasHoy: number;
        tiempoPromedioMinutos: number;
    };
}

/**
 * Pantalla principal de visualización (TV) en sala de espera.
 * Combina el diseño institucional del SENA con estado en tiempo real.
 */
export default function DisplayIndex({ turnoActual, ultimosLlamados, stats }: Props) {
    // Usar useRef para llevar cuenta del turno actual y saber si hay uno nuevo
    const lastTurnId = useRef<number | null>(turnoActual?.id ?? null);

    useEffect(() => {
        // Sonido de campana si el ID del turno actual cambia (significa que llamaron a alguien nuevo)
        if (turnoActual?.id && turnoActual.id !== lastTurnId.current) {
            lastTurnId.current = turnoActual.id;
            
            // Intentar reproducir sonido de alerta
            try {
                // Generar un beep usando el AudioContext
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                
                // Un sonido de "campana" o "timbre" suave
                const playTone = (frequency: number, startTime: number, duration: number) => {
                    const oscillator = audioCtx.createOscillator();
                    const gainNode = audioCtx.createGain();
                    
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(frequency, startTime);
                    
                    gainNode.gain.setValueAtTime(0, startTime);
                    gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.1);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    
                    oscillator.start(startTime);
                    oscillator.stop(startTime + duration);
                };
                
                const now = audioCtx.currentTime;
                playTone(523.25, now, 0.8); // Do
                playTone(659.25, now + 0.2, 1.2); // Mi (campana ascendente)
                
            } catch (e) {
                console.error('Error reproduciendo sonido', e);
            }
        }
    }, [turnoActual?.id]);

    useEffect(() => {
        // Configurar Polling (recargar la página solo los props necesarios cada 5 segundos)
        const interval = setInterval(() => {
            router.reload({
                only: ['turnoActual', 'ultimosLlamados', 'stats']
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden flex flex-col bg-[#fcf8ff] text-[#1b1b23]">
            <Head title="APE Turnos - Sala de Espera" />

            {/* Header / Logo Area */}
            <header className="h-20 lg:h-24 bg-white border-b border-[#c7c5d6] flex items-center px-8 lg:px-12 2xl:px-[64px] shrink-0">
                <img 
                    alt="APE Logo" 
                    className="w-auto object-contain h-12 lg:h-16" 
                    src="/imagenes/Logo APE 2024 (1).png"
                />
            </header>

            {/* Main TV Layout Content */}
            <main className="flex-1 flex flex-col md:flex-row w-full overflow-hidden">
                {turnoActual ? (
                    <>
                        <TurnoActual turno={turnoActual} />
                        <SidebarUltimosLlamados turnos={ultimosLlamados} />
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#10069f] text-white">
                        <h1 className="text-[32px] md:text-[48px] font-bold font-['Plus_Jakarta_Sans'] text-center px-4">SENA - Agencia Pública de Empleo</h1>
                        <p className="text-[18px] md:text-[24px] text-[#c0c1ff] mt-4 font-['Plus_Jakarta_Sans']">No hay turnos activos en este momento.</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <DisplayFooter stats={stats} />
        </div>
    );
}
