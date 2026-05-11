import { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import type { TurnoGenerado } from '@/types/kiosco';
import { CATEGORIA_LABELS } from '@/types/kiosco';

const COUNTDOWN_SECONDS = 10;

interface StepConfirmacionProps {
    turno: TurnoGenerado;
    countdown: number;
    onFinalizar: () => void;
}

/**
 * Pantalla 3 del kiosco: confirmación del turno generado.
 * Muestra el código de turno grande, categoría y un countdown de 10 s
 * para reiniciar automáticamente al paso 1.
 */
export default function StepConfirmacion({ turno, countdown, onFinalizar }: StepConfirmacionProps) {
    const btnRef = useRef<HTMLButtonElement>(null);

    // Anuncio de accesibilidad: foco en el número de turno al montar
    useEffect(() => {
        btnRef.current?.focus();
    }, []);

    const progreso = ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100;

    return (
        <div className="kiosco-screen items-center justify-center bg-[#fcf8ff]">
            {/* Tarjeta central */}
            <main
                className="relative w-full max-w-3xl bg-white rounded-2xl border border-[#c7c5d6] shadow-sm
                           flex flex-col items-center text-center px-12 py-10 gap-6 overflow-hidden mx-4"
            >
                {/* Fondo decorativo sutil */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.04] pointer-events-none select-none"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(45deg, #10069F 0px, #10069F 1px, transparent 1px, transparent 20px)",
                    }}
                />

                {/* Logo */}
                <img
                    src="/imagenes/Logo APE 2024 (1).png"
                    alt="Logo SENA APE"
                    className="h-14 w-auto object-contain relative z-10 select-none"
                    draggable={false}
                />

                {/* Ícono de éxito con anillo */}
                <div className="relative z-10 flex items-center justify-center w-28 h-28 bg-[#e1e0ff] rounded-full">
                    <Icon
                        icon="material-symbols:check-circle"
                        className="text-[#10069F]"
                        style={{ fontSize: '4.5rem' }}
                    />
                </div>

                {/* Título */}
                <div className="relative z-10 space-y-3 max-w-2xl">
                    <h1 className="kiosco-h1 text-[#050066]">¡Turno generado con éxito!</h1>
                    <p className="kiosco-body text-[#464554]">
                        Por favor, tome asiento y preste atención a las pantallas de llamado.
                        Su número de turno es:
                    </p>
                </div>

                {/* Número de turno */}
                <div
                    role="status"
                    aria-label={`Su turno es ${turno.turn_code}`}
                    className="relative z-10 bg-[#efecf8] rounded-xl border border-[#c7c5d6] px-16 py-6 my-2"
                >
                    <span className="kiosco-display text-[#050066] tracking-tight">
                        {turno.turn_code}
                    </span>
                </div>

                {/* Categoría y Datos Ciudadano */}
                <div className="relative z-10 flex flex-col gap-1 items-center">
                    <p className="kiosco-body text-[#464554]">
                        Categoría: <strong className="text-[#1b1b23]">{CATEGORIA_LABELS[turno.categoria]}</strong>
                    </p>
                    <p className="kiosco-caption text-[#767685]">
                        Ciudadano: <span className="font-semibold">{turno.nombre}</span> ({turno.documento})
                    </p>
                </div>

                {/* Botón finalizar */}
                <button
                    ref={btnRef}
                    id="btn-finalizar"
                    onClick={onFinalizar}
                    className="relative z-10 kiosco-btn-primary w-full max-w-md"
                >
                    Finalizar
                </button>

                {/* Countdown */}
                <div className="relative z-10 w-full max-w-md space-y-2">
                    {/* Barra de progreso */}
                    <div className="h-1.5 w-full bg-[#e4e1ec] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#10069F] rounded-full transition-all duration-1000 ease-linear"
                            style={{ width: `${progreso}%` }}
                        />
                    </div>
                    <p className="kiosco-caption text-[#767685] flex items-center justify-center gap-1.5">
                        <Icon icon="material-symbols:timer" style={{ fontSize: '1rem' }} />
                        Esta pantalla se cerrará automáticamente en{' '}
                        <strong className="text-[#1b1b23]">{countdown}</strong> segundos
                    </p>
                </div>
            </main>
        </div>
    );
}
