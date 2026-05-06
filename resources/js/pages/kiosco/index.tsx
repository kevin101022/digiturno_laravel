import { useState, useCallback, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import type { KioscoCategoria, TipoDocumento, TurnoGenerado } from '@/types/kiosco';
import StepSeleccion from '@/components/kiosco/StepSeleccion';
import StepIdentificacion from '@/components/kiosco/StepIdentificacion';
import StepConfirmacion from '@/components/kiosco/StepConfirmacion';

type Paso = 1 | 2 | 3;
const MAX_DIGITOS = 12;
const COUNTDOWN_SEGUNDOS = 10;

/**
 * Página principal del kiosco táctil APE.
 * Orquesta el wizard de 3 pasos sin recargas de página (Inertia SPA).
 *
 * Ruta: GET /kiosco → sin autenticación (atril público).
 */
export default function KioscoIndex() {
    // ── Estado del wizard ──────────────────────────────────────────────────
    const [paso, setPaso] = useState<Paso>(1);
    const [categoria, setCategoria] = useState<KioscoCategoria | null>(null);
    const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>('CC');
    const [numeroDocumento, setNumeroDocumento] = useState('');
    const [cargando, setCargando] = useState(false);
    const [turnoGenerado, setTurnoGenerado] = useState<TurnoGenerado | null>(null);
    const [countdown, setCountdown] = useState(COUNTDOWN_SEGUNDOS);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Limpiar countdown al desmontar ────────────────────────────────────
    useEffect(() => {
        return () => {
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, []);

    // ── Iniciar countdown al llegar al paso 3 ─────────────────────────────
    useEffect(() => {
        if (paso !== 3) return;

        setCountdown(COUNTDOWN_SEGUNDOS);
        countdownRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownRef.current!);
                    resetWizard();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, [paso]);

    // ── Acciones del wizard ───────────────────────────────────────────────
    const resetWizard = useCallback(() => {
        setPaso(1);
        setCategoria(null);
        setTipoDocumento('CC');
        setNumeroDocumento('');
        setCargando(false);
        setTurnoGenerado(null);
        setCountdown(COUNTDOWN_SEGUNDOS);
    }, []);

    const avanzarAIdentificacion = useCallback(() => {
        if (!categoria) return;
        setPaso(2);
    }, [categoria]);

    const retrocederASeleccion = useCallback(() => {
        setPaso(1);
        setNumeroDocumento('');
    }, []);

    const handleTecla = useCallback((tecla: string) => {
        if (tecla === 'backspace') {
            setNumeroDocumento((prev) => prev.slice(0, -1));
        } else if (tecla === 'clear') {
            setNumeroDocumento('');
        } else if (numeroDocumento.length < MAX_DIGITOS) {
            setNumeroDocumento((prev) => prev + tecla);
        }
    }, [numeroDocumento]);

    /** Simula la generación del turno (Puro Frontend) */
    const generarTurno = useCallback(() => {
        if (!categoria || numeroDocumento.length < 10) return;

        setCargando(true);

        // Simulamos un retraso de red de 800ms para que se vea el estado de carga
        setTimeout(() => {
            const prefijos: Record<KioscoCategoria, string> = {
                victim: 'V',
                priority: 'P',
                business: 'E',
                general: 'G',
            };

            const mockTurno: TurnoGenerado = {
                turn_code: `${prefijos[categoria]}-${Math.floor(Math.random() * 900 + 100)}`,
                categoria: categoria,
                queue_type: categoria === 'victim' ? 'victim' : 'general',
            };

            setTurnoGenerado(mockTurno);
            setPaso(3);
            setCargando(false);
        }, 800);
    }, [categoria, numeroDocumento]);

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <>
            {paso === 1 && (
                <StepSeleccion
                    seleccionada={categoria}
                    onSeleccionar={setCategoria}
                    onContinuar={avanzarAIdentificacion}
                />
            )}

            {paso === 2 && (
                <StepIdentificacion
                    tipoDocumento={tipoDocumento}
                    numeroDocumento={numeroDocumento}
                    cargando={cargando}
                    onTipoDocumento={setTipoDocumento}
                    onTecla={handleTecla}
                    onAnterior={retrocederASeleccion}
                    onContinuar={generarTurno}
                    puedeContinuar={numeroDocumento.length >= 10}
                />
            )}

            {paso === 3 && turnoGenerado && (
                <StepConfirmacion
                    turno={turnoGenerado}
                    countdown={countdown}
                    onFinalizar={resetWizard}
                />
            )}
        </>
    );
}
