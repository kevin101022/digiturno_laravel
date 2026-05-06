import { Icon } from '@iconify/react';

export default function PantallaRuv({ onFinalizar }: { onFinalizar: () => void }) {
    return (
        <div className="h-full flex flex-col gap-6 animate-in zoom-in duration-300">
            <div className="bg-white rounded-2xl border border-[#c7c5d6] p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-8 border-b border-[#efecf8] pb-6">
                    <div className="w-12 h-12 bg-[#e1e0ff] rounded-full flex items-center justify-center text-[#10069f]">
                        <Icon icon="material-symbols:fact-check" className="text-2xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[#1b1b23]">Validación RUV</h2>
                        <p className="text-sm text-[#464554]">Registro Único de Víctimas - Consulta Externa</p>
                    </div>
                </div>

                <div className="bg-[#fcf8ff] border border-[#c7c5d6] rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
                    <Icon icon="material-symbols:hourglass-empty" className="text-6xl text-[#10069f] mb-6 animate-pulse" />
                    <h3 className="text-xl font-bold text-[#1b1b23] mb-2">Consultando Plataforma Externa...</h3>
                    <p className="text-[#464554] max-w-sm">Esta acción puede tardar unos segundos. Por favor, espere mientras validamos la condición del ciudadano.</p>
                </div>

                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={onFinalizar}
                        className="bg-[#10069f] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#05006c]"
                    >
                        <span>Confirmar y Continuar</span>
                        <Icon icon="material-symbols:arrow-forward" className="text-xl" />
                    </button>
                </div>
            </div>
        </div>
    );
}
