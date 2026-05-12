import { useState, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import AsesorLayout from '@/layouts/asesor-layout';
import PantallaFilaTurnos from '@/components/asesor/PantallaFilaTurnos';
import PantallaTurnoAsignado from '@/components/asesor/PantallaTurnoAsignado';
import PantallaRuv from '@/components/asesor/PantallaRuv';
import PantallaPausa from '@/components/asesor/PantallaPausa';
import PantallaMetricas from '@/components/asesor/PantallaMetricas';
import PantallaHistorial from '@/components/asesor/PantallaHistorial';
import type { EstadoAsesor, TurnoActual, AsesorStats, TurnoFila } from '@/types/asesor';

interface Props {
    stats: AsesorStats;
    assigned_module: string | null;
}

export default function AsesorIndex({ stats: initialStats, assigned_module: assignedModule }: Props) {
    const [estado, setEstado] = useState<EstadoAsesor>('disponible');
    const [turnoActual, setTurnoActual] = useState<TurnoActual | null>(null);
    const [turnosFila, setTurnosFila] = useState<TurnoFila[]>([]);
    const [stats, setStats] = useState<AsesorStats>(initialStats);
    const [feedback, setFeedback] = useState<{ show: boolean, message: string, icon: string, color: string } | null>(null);

    const showFeedback = (message: string, icon: string, color: string, duration: number = 2000, callback?: () => void) => {
        setFeedback({ show: true, message, icon, color });
        setTimeout(() => {
            setFeedback(null);
            if (callback) callback();
        }, duration);
    };

    // POLLING: Consultar la fila de turnos en espera.
    useEffect(() => {
        // No consultar si no está disponible o si no tiene módulo asignado
        if (estado !== 'disponible' || !assignedModule) return;

        const fetchTurnos = async () => {
            try {
                const response = await axios.get('/asesor/turnos-en-espera');
                setTurnosFila(response.data.turnos);
            } catch (error) {
                console.error('Error consultando fila:', error);
            }
        };

        fetchTurnos(); // Consulta inicial
        const interval = setInterval(fetchTurnos, 3000);

        return () => clearInterval(interval);
    }, [estado, assignedModule]);

    const handleAceptarTurno = useCallback(async (turnId: number) => {
        try {
            const response = await axios.post(`/asesor/aceptar/${turnId}`);
            if (response.data.success) {
                const data = response.data.turno;
                setTurnoActual({
                    id: data.id,
                    codigo: data.turn_code,
                    hora_llamado: new Date().toLocaleTimeString(),
                    ciudadano: {
                        id: 'N/A',
                        nombre: 'Ciudadano asignado',
                        documento: 'Verificar en físico',
                        tipo_documento: 'CC',
                        categoria: data.categoria
                    }
                });
                setEstado('atendiendo');
                showFeedback('Turno Llamado a Ventanilla', 'material-symbols:campaign', '#10069f');
            }
        } catch (error: any) {
            console.error('Error al aceptar turno:', error);
            const msg = error.response?.data?.error || 'El turno ya fue asignado a otro asesor';
            showFeedback(msg, 'material-symbols:error', '#ba1a1a', 4000);
            // Refrescar fila
            if (assignedModule) {
                const res = await axios.get('/asesor/turnos-en-espera');
                setTurnosFila(res.data.turnos);
            }
        }
    }, [assignedModule]);

    const handleIniciarAtencion = useCallback(() => {
        if (!turnoActual) return;
        router.post(`/asesor/iniciar/${turnoActual.id}`, {}, {
            onSuccess: () => {
                if (turnoActual.ciudadano.categoria === 'victim') {
                    setEstado('validando_ruv');
                } else {
                    showFeedback('Atención Iniciada', 'material-symbols:play-circle', '#10069f');
                }
            }
        });
    }, [turnoActual]);

    const handleFinalizarAtencion = useCallback(() => {
        if (!turnoActual) return;
        router.post(`/asesor/finalizar/${turnoActual.id}`, {}, {
            onSuccess: () => {
                showFeedback('Atención Finalizada', 'material-symbols:check-circle', '#22c55e', 3000, () => {
                    setEstado('disponible');
                    setTurnoActual(null);
                    setStats(prev => ({ ...prev, atendidos_hoy: prev.atendidos_hoy + 1 }));
                });
            }
        });
    }, [turnoActual]);

    const handleNoPresentado = useCallback(() => {
        if (!turnoActual) return;
        router.post(`/asesor/ausente/${turnoActual.id}`, {}, {
            onSuccess: () => {
                setEstado('disponible');
                setTurnoActual(null);
            }
        });
    }, [turnoActual]);

    const handleReLlamar = useCallback(() => {
        if (!turnoActual) return;
        router.post(`/asesor/rellamar/${turnoActual.id}`, {}, {
            onSuccess: () => {
                showFeedback('Re-llamando Ciudadano', 'material-symbols:campaign', '#10069f', 2000);
            }
        });
    }, [turnoActual]);

    return (
        <AsesorLayout 
            title="Panel del Asesor - APE"
            onTabChange={setEstado}
            activeTab={estado}
        >
            {/* Modal de Feedback */}
            {feedback?.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1b1b23]/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl border border-[#c7c5d6] flex flex-col items-center gap-4 scale-in-center animate-in zoom-in duration-300 min-w-[300px]">
                        <div 
                            className="w-20 h-20 rounded-full flex items-center justify-center animate-bounce"
                            style={{ backgroundColor: `${feedback.color}20`, color: feedback.color }}
                        >
                            <Icon icon={feedback.icon} className="text-5xl" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1b1b23]">{feedback.message}</h3>
                    </div>
                </div>
            )}

            {estado === 'disponible' && (
                assignedModule ? (
                    <PantallaFilaTurnos 
                        turnos={turnosFila}
                        onAceptarTurno={handleAceptarTurno}
                        onTomarPausa={() => {
                            router.post('/asesor/pausa', { reason: 'Descanso' }, {
                                onSuccess: () => setEstado('pausa')
                            });
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-48 h-48 bg-[#fcf8ff] rounded-full flex items-center justify-center border-8 border-[#f5f2fd] mb-6 shadow-inner">
                            <Icon icon="material-symbols:block" className="text-8xl text-[#ba1a1a]" />
                        </div>
                        <h2 className="text-4xl font-bold text-[#1b1b23] mb-4">Módulo no asignado</h2>
                        <p className="text-xl text-[#464554] max-w-2xl">
                            El coordinador todavía no te ha asignado a un módulo de atención para esta jornada. <br/><br/>
                            Por favor, comunícate con el coordinador para que te asigne un módulo y puedas comenzar a operar.
                        </p>
                    </div>
                )
            )}
            
            {estado === 'atendiendo' && turnoActual && (
                <PantallaTurnoAsignado 
                    turno={turnoActual}
                    onIniciarAtencion={handleIniciarAtencion}
                    onReLlamar={handleReLlamar}
                    onNoPresentado={handleNoPresentado}
                    onFinalizarAtencion={handleFinalizarAtencion}
                />
            )}

            {estado === 'validando_ruv' && (
                <PantallaRuv onFinalizar={handleFinalizarAtencion} />
            )}

            {estado === 'pausa' && (
                <PantallaPausa onTerminarPausa={() => {
                    router.post('/asesor/pausa', {}, {
                        onSuccess: () => setEstado('disponible')
                    });
                }} />
            )}

            {estado === 'historial' && (
                <PantallaHistorial />
            )}
        </AsesorLayout>
    );
}
