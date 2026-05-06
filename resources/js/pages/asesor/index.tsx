import { useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import AsesorLayout from '@/layouts/asesor-layout';
import PantallaDisponible from '@/components/asesor/PantallaDisponible';
import PantallaTurnoAsignado from '@/components/asesor/PantallaTurnoAsignado';
import PantallaRuv from '@/components/asesor/PantallaRuv';
import PantallaPausa from '@/components/asesor/PantallaPausa';
import PantallaDashboard from '@/components/asesor/PantallaDashboard';
import PantallaVentanillas from '@/components/asesor/PantallaVentanillas';
import PantallaMetricas from '@/components/asesor/PantallaMetricas';
import type { EstadoAsesor, TurnoActual, AsesorStats } from '@/types/asesor';

interface Props {
    stats: AsesorStats;
}

export default function AsesorIndex({ stats: initialStats }: Props) {
    const [estado, setEstado] = useState<EstadoAsesor>('disponible');
    const [turnoActual, setTurnoActual] = useState<TurnoActual | null>(null);
    const [stats, setStats] = useState<AsesorStats>(initialStats);
    const [feedback, setFeedback] = useState<{ show: boolean, message: string, icon: string, color: string } | null>(null);

    // Helper para mostrar feedback temporal
    const showFeedback = (message: string, icon: string, color: string, duration: number = 2000, callback?: () => void) => {
        setFeedback({ show: true, message, icon, color });
        setTimeout(() => {
            setFeedback(null);
            if (callback) callback();
        }, duration);
    };

    // Simulación: Llamar siguiente turno
    const handleLlamarTurno = useCallback(() => {
        const mockTurno: TurnoActual = {
            id: '1',
            codigo: 'G-115',
            hora_llamado: new Date().toLocaleTimeString(),
            ciudadano: {
                id: '123',
                nombre: 'Juan Pérez García',
                documento: '1.234.567.890',
                tipo_documento: 'CC',
                categoria: 'general'
            }
        };
        
        setTurnoActual(mockTurno);
        setEstado('atendiendo');
    }, []);

    const handleIniciarAtencion = useCallback(() => {
        if (turnoActual?.ciudadano.categoria === 'victim') {
            setEstado('validando_ruv');
        } else {
            console.log('Atención iniciada...');
        }
    }, [turnoActual]);

    const handleFinalizarAtencion = useCallback(() => {
        showFeedback('Atención Finalizada', 'material-symbols:check-circle', '#22c55e', 3000, () => {
            setEstado('disponible');
            setTurnoActual(null);
            setStats(prev => ({ ...prev, atendidos_hoy: prev.atendidos_hoy + 1 }));
        });
    }, []);

    const handleNoPresentado = useCallback(() => {
        setEstado('disponible');
        setTurnoActual(null);
    }, []);

    const handleReLlamar = useCallback(() => {
        showFeedback('Re-llamando Ciudadano', 'material-symbols:campaign', '#10069f', 2000);
    }, []);

    return (
        <AsesorLayout 
            title="Panel del Asesor - APE"
            onTabChange={setEstado}
            activeTab={estado}
        >
            {/* Modal de Feedback Temporal */}
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
                        <div className="w-full bg-[#efecf8] h-1.5 rounded-full overflow-hidden mt-2">
                            <div 
                                className="h-full animate-progress"
                                style={{ backgroundColor: feedback.color }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}
            {/* Flujo de Atención (El que te gusta) */}
            {estado === 'disponible' && (
                <PantallaDisponible stats={stats} onLlamarTurno={handleLlamarTurno} />
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
                <PantallaPausa onTerminarPausa={() => setEstado('disponible')} />
            )}

            {/* Secciones Operativas Restantes */}
            {estado === 'metricas' && (
                <PantallaMetricas />
            )}
            {estado === 'configuracion' && (
                <div className="p-10 bg-white rounded-2xl border border-[#c7c5d6] text-center">
                    <Icon icon="material-symbols:settings" className="text-6xl text-[#10069f] mb-4 mx-auto" />
                    <h2 className="text-2xl font-bold">Configuración del Perfil</h2>
                    <p className="text-[#464554]">Ajustes de estación de trabajo y preferencias del asesor.</p>
                </div>
            )}

            {/* Botón flotante para Pausa (Solo en modo disponible) */}
            {estado === 'disponible' && (
                <button 
                    onClick={() => setEstado('pausa')}
                    className="fixed bottom-8 right-8 bg-[#1b1b23] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2 px-6 z-50"
                >
                    <Icon icon="material-symbols:coffee" className="text-xl text-[#fdb300]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Tomar Pausa</span>
                </button>
            )}
        </AsesorLayout>
    );
}
