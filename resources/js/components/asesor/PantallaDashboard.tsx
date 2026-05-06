import { Icon } from '@iconify/react';
import type { AsesorStats } from '@/types/asesor';

interface Props {
    stats: AsesorStats;
    onLlamarTurno: () => void;
    onIniciarAtencion: () => void;
    onFinalizarAtencion: () => void;
}

export default function PantallaDashboard({ stats, onLlamarTurno, onIniciarAtencion, onFinalizarAtencion }: Props) {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Header del Dashboard */}
            <div className="flex items-center justify-between pb-4 border-b border-[#c7c5d6]">
                <div>
                    <h2 className="text-2xl font-bold text-[#1b1b23]">Ventanilla 03</h2>
                    <p className="text-[#464554] text-sm flex items-center gap-2 mt-1">
                        <Icon icon="material-symbols:person" />
                        Asesor: Carlos Mendoza
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-[#e1e0ff] text-[#05006c] rounded-full text-[10px] font-bold flex items-center gap-1 uppercase">
                        <Icon icon="material-symbols:check-circle" /> Activo
                    </span>
                </div>
            </div>

            {/* Layout Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-250px)]">
                {/* Columna Izquierda: Turno Actual y Acciones (8 col) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Tarjeta de Turno Actual */}
                    <div className="bg-[#050066] rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden flex-1 shadow-lg">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4a4dce] opacity-20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <div className="z-10 text-center">
                            <span className="text-[#c0c1ff] text-[10px] font-bold uppercase tracking-widest block mb-2">Turno Actual</span>
                            <div className="font-['Syne'] text-[100px] text-[#fdb300] leading-none tracking-tight mb-4">
                                A-042
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-6 py-3 inline-flex items-center gap-3">
                                <Icon icon="material-symbols:badge" className="text-[#c0c1ff] text-xl" />
                                <span className="text-lg text-white font-medium">CC: 1.023.***.890</span>
                            </div>
                        </div>
                    </div>

                    {/* Acciones Rápidas */}
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={onLlamarTurno}
                            className="col-span-2 bg-[#fdb300] hover:bg-[#7d5700] text-[#271900] hover:text-white h-16 rounded-xl font-bold text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm"
                        >
                            <Icon icon="material-symbols:campaign" className="text-3xl" />
                            Llamar Siguiente
                        </button>
                        <button 
                            onClick={onIniciarAtencion}
                            className="bg-white border-2 border-[#c7c5d6] hover:bg-[#efecf8] text-[#1b1b23] h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                        >
                            <Icon icon="material-symbols:play-arrow" className="text-2xl" />
                            Atender
                        </button>
                        <button 
                            onClick={onFinalizarAtencion}
                            className="bg-[#ffdad6] hover:bg-[#ba1a1a] text-[#ba1a1a] hover:text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                        >
                            <Icon icon="material-symbols:check-circle" className="text-2xl" />
                            Finalizar
                        </button>
                    </div>
                </div>

                {/* Columna Derecha: Cola de Espera (4 col) */}
                <div className="lg:col-span-4 bg-white border border-[#c7c5d6] rounded-2xl flex flex-col overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-[#c7c5d6] bg-[#f5f2fd] flex justify-between items-center">
                        <h3 className="font-bold text-[#050066] text-lg">Cola de Espera</h3>
                        <span className="bg-[#e4e1ec] text-[#464554] px-2 py-1 rounded text-[10px] font-bold">5 en fila</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        <QueueItem code="A-043" service="Asesoría General" wait="12 min" highlight />
                        <QueueItem code="A-044" service="Asesoría General" wait="15 min" />
                        <QueueItem code="B-012" service="Registro Hoja Vida" wait="18 min" />
                        <QueueItem code="A-045" service="Asesoría General" wait="22 min" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function QueueItem({ code, service, wait, highlight = false }: { code: string; service: string; wait: string; highlight?: boolean }) {
    return (
        <div className={`border rounded-xl p-4 flex items-center justify-between transition-all cursor-pointer group ${
            highlight ? 'bg-[#ffdeab] border-[#fdb300]' : 'bg-white border-[#e4e1ec] hover:bg-[#fcf8ff]'
        }`}>
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                    highlight ? 'bg-[#fdb300] text-[#271900]' : 'bg-[#efecf8] text-[#464554]'
                }`}>
                    {code}
                </div>
                <div>
                    <div className="text-sm font-bold text-[#1b1b23]">{service}</div>
                    <div className="text-[10px] font-bold text-[#464554] mt-0.5">Espera: {wait}</div>
                </div>
            </div>
            {highlight && <Icon icon="material-symbols:notifications-active" className="text-[#050066] text-xl animate-bounce" />}
        </div>
    );
}
