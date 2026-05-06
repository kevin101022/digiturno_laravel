import { Icon } from '@iconify/react';
import type { AsesorStats } from '@/types/asesor';

interface Props {
    stats: AsesorStats;
    onLlamarTurno: () => void;
}

export default function PantallaDisponible({ stats, onLlamarTurno }: Props) {
    return (
        <div className="h-full flex flex-col justify-center items-center">
            <div className="bg-white rounded-2xl border border-[#c7c5d6] p-12 flex flex-col items-center justify-center shadow-sm max-w-2xl w-full text-center">
                <div className="w-24 h-24 bg-[#e1e0ff] rounded-full flex items-center justify-center mb-8">
                    <Icon icon="material-symbols:support-agent" className="text-[#10069f] text-5xl" />
                </div>
                
                <h2 className="text-4xl font-bold text-[#1b1b23] mb-4">Panel del Asesor</h2>
                <p className="text-lg text-[#464554] mb-12 max-w-lg leading-relaxed">
                    Estás en estado <strong className="text-[#10069f]">Disponible</strong>. <br />
                    Haz clic en el botón de abajo para llamar al siguiente turno en la fila.
                </p>

                <button 
                    onClick={onLlamarTurno}
                    className="bg-[#10069f] text-white text-2xl font-bold py-6 px-16 rounded-full flex items-center gap-4 hover:bg-[#05006c] transition-all shadow-md active:scale-95 group"
                >
                    <Icon icon="material-symbols:arrow-forward-ios" className="text-2xl group-hover:translate-x-1 transition-transform" />
                    <span>Llamar Siguiente Turno</span>
                </button>

                {/* Estadísticas Rápidas */}
                <div className="mt-12 flex gap-12 items-center justify-center w-full border-t border-[#efecf8] pt-10">
                    <StatItem label="Atendidos" value={stats.atendidos_hoy} color="text-[#10069f]" />
                    <div className="w-px h-12 bg-[#e4e1ec]"></div>
                    <StatItem label="Tiempo Promedio" value={stats.tiempo_promedio} color="text-[#10069f]" />
                    <div className="w-px h-12 bg-[#e4e1ec]"></div>
                    <StatItem label="En Espera" value={stats.en_espera} color="text-[#7d5700]" />
                </div>
            </div>
        </div>
    );
}

function StatItem({ label, value, color }: { label: string; value: string | number; color: string }) {
    return (
        <div className="text-center">
            <p className="text-[10px] font-bold text-[#464554] uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
    );
}
