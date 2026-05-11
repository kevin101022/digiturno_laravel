import { Icon } from '@iconify/react';
import React from 'react';
import type { TurnoFila } from '@/types/asesor';

interface Props {
    turnos: TurnoFila[];
    onAceptarTurno: (id: number) => void;
    onTomarPausa: () => void;
}

export default function PantallaFilaTurnos({ turnos, onAceptarTurno, onTomarPausa }: Props) {
    const getCategoryStyles = (category: string) => {
        switch (category) {
            case 'victim': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'special': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'business': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const getCategoryName = (category: string) => {
        switch (category) {
            case 'victim': return 'Víctima';
            case 'special': return 'Prioritario';
            case 'business': return 'Empresario';
            default: return 'General';
        }
    };

    return (
        <div className="h-full flex flex-col p-8 bg-[#f5f2fd] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-[#1b1b23]">Fila de Turnos</h2>
                    <p className="text-[#464554] mt-1">Selecciona el próximo turno a atender</p>
                </div>
                <button
                    onClick={onTomarPausa}
                    className="flex items-center gap-2 bg-white border border-[#c7c5d0] px-6 py-3 rounded-full text-[#464554] font-semibold hover:bg-slate-50 transition shadow-sm"
                >
                    <Icon icon="material-symbols:coffee" className="text-xl" />
                    Tomar Pausa
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {turnos.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-[#464554]">
                        <Icon icon="material-symbols:inbox" className="text-6xl mb-4 text-[#c7c5d0]" />
                        <p className="text-xl font-medium">No hay turnos en espera</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {turnos.map((turno) => (
                            <div key={turno.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#e1e0eb] flex items-center justify-between hover:shadow-md transition">
                                <div className="flex items-center gap-6">
                                    <div className="bg-[#10069f] text-white font-bold text-4xl w-28 h-24 rounded-xl flex items-center justify-center tracking-wider">
                                        {turno.turn_code}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border w-fit ${getCategoryStyles(turno.category)}`}>
                                            {getCategoryName(turno.category)}
                                        </span>
                                        <div className="flex items-center gap-2 text-[#464554] text-sm mt-1">
                                            <Icon icon="material-symbols:schedule" />
                                            <span>Generado a las {new Date(turno.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onAceptarTurno(turno.id)}
                                    className="bg-[#10069f] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-[#0c047a] transition active:scale-95"
                                >
                                    <Icon icon="material-symbols:call" className="text-2xl" />
                                    Aceptar Turno
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #c7c5d0;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
}
