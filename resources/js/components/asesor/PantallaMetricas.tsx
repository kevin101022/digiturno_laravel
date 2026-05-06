import { Icon } from '@iconify/react';

export default function PantallaMetricas() {
    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-700">
            <div>
                <h2 className="text-2xl font-bold text-[#1b1b23]">Métricas de Saturación</h2>
                <p className="text-[#464554]">Análisis de demanda y rendimiento de la oficina en tiempo real.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard icon="groups" label="Capacidad Total" value="85%" color="#10069f" />
                <MetricCard icon="timer" label="Espera Promedio" value="12m" color="#10069f" />
                <MetricCard icon="warning" label="Alertas Críticas" value="02" color="#ba1a1a" />
            </div>

            <div className="bg-white border border-[#c7c5d6] rounded-2xl p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Icon icon="material-symbols:trending-up" className="text-[15rem]" />
                </div>
                <h3 className="text-lg font-bold text-[#050066] mb-6">Demanda por Categoría</h3>
                <div className="space-y-6">
                    <ProgressBar label="Asesoría General" value={75} color="#10069f" count="12 ciudadanos" />
                    <ProgressBar label="Registro Hoja de Vida" value={45} color="#fdb300" count="5 ciudadanos" />
                    <ProgressBar label="Atención Víctimas" value={20} color="#ba1a1a" count="2 ciudadanos" />
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
    return (
        <div className="bg-white border border-[#c7c5d6] rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div>
                <p className="text-[10px] font-bold text-[#767685] uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-bold text-[#1b1b23]">{value}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center opacity-20" style={{ backgroundColor: color }}>
                <Icon icon={`material-symbols:${icon}`} className="text-2xl" style={{ color: color }} />
            </div>
        </div>
    );
}

function ProgressBar({ label, value, color, count }: { label: string; value: number; color: string; count: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold">
                <span className="text-[#1b1b23]">{label}</span>
                <span className="text-[#464554]">{count}</span>
            </div>
            <div className="h-3 bg-[#efecf8] rounded-full overflow-hidden">
                <div 
                    className="h-full transition-all duration-1000" 
                    style={{ width: `${value}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}
