import { useState, useCallback, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import type { KioscoCategoria, TipoDocumento, TurnoGenerado } from '@/types/kiosco';
import StepSeleccion from '@/components/kiosco/StepSeleccion';
import StepIdentificacion from '@/components/kiosco/StepIdentificacion';
import StepConfirmacion from '@/components/kiosco/StepConfirmacion';

type Paso = 1 | 2 | 3;
const MAX_DIGITOS = 12;
const MIN_DIGITOS = 5;
const COUNTDOWN_SEGUNDOS = 10;

interface KioscoPageProps {
    flash?: {
        turno?: TurnoGenerado;
    };
    errors?: Record<string, string>;
    [key: string]: unknown;
}

/**
 * Página principal del kiosco táctil APE.
 * Orquesta el wizard de 3 pasos conectado al backend real.
 *
 * Ruta: GET /kiosco → sin autenticación (atril público).
 */
export default function KioscoIndex() {
    const { props } = usePage<KioscoPageProps>();

    // ── Estado del wizard ──────────────────────────────────────────────────
    const [paso, setPaso] = useState<Paso>(1);
    const [categoria, setCategoria] = useState<KioscoCategoria | null>(null);
    const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>('CC');
    const [numeroDocumento, setNumeroDocumento] = useState('');
    const [cargando, setCargando] = useState(false);
    const [turnoGenerado, setTurnoGenerado] = useState<TurnoGenerado | null>(null);
    const [countdown, setCountdown] = useState(COUNTDOWN_SEGUNDOS);
    const [errorServidor, setErrorServidor] = useState<string | null>(null);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Leer turno del flash de Inertia al volver del POST ────────────────
    useEffect(() => {
        const t = props.flash?.turno;
        if (t) {
            console.log('Turno recibido en flash:', t);
            setTurnoGenerado(t);
            setPaso(3);
            setCargando(false);
        }
    }, [props.flash]);

    // ── Leer errores de validación del backend ────────────────────────────
    useEffect(() => {
        if (props.errors && Object.keys(props.errors).length > 0) {
            const primerError = Object.values(props.errors)[0];
            setErrorServidor(primerError);
            setCargando(false);
        } else {
            setErrorServidor(null);
        }
    }, [props.errors]);

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
        setErrorServidor(null);
    }, []);

    const avanzarAIdentificacion = useCallback(() => {
        if (!categoria) return;
        setErrorServidor(null);
        setPaso(2);
    }, [categoria]);

    const retrocederASeleccion = useCallback(() => {
        setPaso(1);
        setNumeroDocumento('');
        setErrorServidor(null);
    }, []);

    const getMinLength = (tipo: TipoDocumento) => {
        switch (tipo) {
            case 'CC': return 5;
            case 'TI': return 10;
            case 'CE':
            case 'PPT': return 6;
            case 'PA': return 6;
            default: return 5;
        }
    };

    const getMaxLength = (tipo: TipoDocumento) => {
        switch (tipo) {
            case 'CC': return 10;
            case 'TI': return 11;
            case 'CE':
            case 'PPT': return 8;
            case 'PA': return 16;
            default: return 12;
        }
    };

    const handleTecla = useCallback((tecla: string) => {
        setErrorServidor(null);
        if (tecla === 'backspace') {
            setNumeroDocumento((prev) => prev.slice(0, -1));
        } else if (tecla === 'clear') {
            setNumeroDocumento('');
        } else if (numeroDocumento.length < getMaxLength(tipoDocumento)) {
            setNumeroDocumento((prev) => prev + tecla);
        }
    }, [numeroDocumento, tipoDocumento]);

    /**
     * Envía el formulario al backend real mediante Inertia.
     * El controlador devuelve back()->with('turno', {...}) que Inertia
     * expone como prop de la página y se captura en el useEffect de arriba.
     */
    const generarTurno = useCallback(() => {
        if (!categoria || numeroDocumento.length < getMinLength(tipoDocumento) || cargando) return;

        setCargando(true);
        setErrorServidor(null);
        console.log('Enviando petición de turno:', { categoria, tipoDocumento, numeroDocumento });

        router.post(
            '/kiosco/turno',
            {
                categoria:        categoria,
                tipo_documento:   tipoDocumento,
                numero_documento: numeroDocumento,
            },
            {
                preserveState:  true,
                preserveScroll: true,
                onError: (errors) => {
                    const primerError = Object.values(errors)[0];
                    setErrorServidor(primerError ?? 'Ocurrió un error. Intente nuevamente.');
                    setCargando(false);
                },
                onFinish: () => {
                    setCargando(false);
                },
            },
        );
    }, [categoria, tipoDocumento, numeroDocumento, cargando]);

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
                    error={errorServidor}
                    onTipoDocumento={setTipoDocumento}
                    onTecla={handleTecla}
                    onAnterior={retrocederASeleccion}
                    onContinuar={generarTurno}
                    puedeContinuar={numeroDocumento.length >= getMinLength(tipoDocumento)}
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
