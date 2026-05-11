import { Icon } from '@iconify/react';

interface TurnoPasado {
    codigo: string;
    modulo: string;
}

interface Props {
    turnos: TurnoPasado[];
}

export default function SidebarUltimosLlamados({ turnos }: Props) {
    return (
        <section className="w-full md:w-1/3 h-full bg-[#eae7f2] border-l border-[#c7c5d6] flex flex-col">
            {/* Header */}
            <div className="p-4 lg:p-6 2xl:p-8 2xl:px-12 border-b border-[#c7c5d6] bg-[#e4e1ec]">
                <div className="flex items-center gap-2 lg:gap-4 text-[#050066]">
                    <Icon icon="material-symbols:history" className="text-3xl lg:text-4xl shrink-0" />
                    <h2 className="text-[16px] lg:text-[20px] 2xl:text-[24px] font-bold tracking-wide font-['Plus_Jakarta_Sans'] leading-tight">ÚLTIMOS LLAMADOS</h2>
                </div>
            </div>

            {/* List */}
            <div className="flex-grow p-6 lg:p-8 2xl:p-12 overflow-hidden flex flex-col gap-4 lg:gap-6">
                {turnos.map((turno, idx) => {
                    // Opacity decreases for older turns
                    const opacityClass = idx === 0 ? 'opacity-100' : idx === 1 ? 'opacity-80' : idx === 2 ? 'opacity-60' : 'opacity-40';
                    const textColor = idx === 0 ? 'text-[#050066]' : 'text-[#1b1b23]';

                    return (
                        <div 
                            key={idx} 
                            className={`bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-[#c7c5d6] flex items-center justify-between ${opacityClass}`}
                        >
                            <div>
                                <p className={`font-['Syne'] text-[32px] lg:text-[40px] 2xl:text-[48px] font-bold leading-none ${textColor}`}>
                                    {turno.codigo}
                                </p>
                                <p className="font-['Plus_Jakarta_Sans'] text-[14px] lg:text-[16px] 2xl:text-[18px] text-[#464554] mt-1 lg:mt-2">
                                    {turno.modulo}
                                </p>
                            </div>
                            {idx === 0 && (
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#efecf8] rounded-full flex items-center justify-center text-[#050066] shrink-0">
                                    <Icon icon="material-symbols:chevron-right" className="text-2xl lg:text-3xl" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
