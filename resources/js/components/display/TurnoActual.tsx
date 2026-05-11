import { Icon } from '@iconify/react';

interface Props {
    turno: {
        codigo: string;
        modulo: string;
        ciudadano: string;
    };
}

export default function TurnoActual({ turno }: Props) {
    return (
        <section className="w-full md:w-2/3 h-full bg-[#10069f] text-white relative flex flex-col justify-center items-center p-8 lg:p-12 2xl:p-[64px] overflow-hidden">
            {/* "Ahora Atendiendo" Badge */}
            <div className="bg-[#c0c1ff]/20 px-6 py-3 lg:px-8 lg:py-4 rounded-full mb-8 lg:mb-12 shadow-[0_4px_30px_rgba(5,0,102,0.15)] border border-[#c0c1ff]/30 backdrop-blur-sm relative z-10">
                <h2 className="text-[16px] lg:text-[20px] 2xl:text-[24px] font-semibold text-[#ffdeab] tracking-wider uppercase flex items-center gap-2 lg:gap-4 font-['Plus_Jakarta_Sans']">
                    <Icon icon="material-symbols:volume-up" className="text-2xl lg:text-3xl" />
                    AHORA ATENDIENDO
                </h2>
            </div>

            {/* Main Turn Number */}
            <div className="text-center mb-10 lg:mb-16 relative">
                <div className="absolute -inset-10 bg-[#e1e0ff] opacity-10 blur-3xl rounded-full"></div>
                <h1 className="font-['Syne'] text-[#fdb300] drop-shadow-2xl relative z-10 font-bold text-[120px] lg:text-[160px] 2xl:text-[200px]" style={{ lineHeight: '1' }}>
                    {turno.codigo}
                </h1>
            </div>

            {/* Module & Person Info */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-6 lg:px-16 lg:py-8 shadow-2xl flex items-center gap-6 lg:gap-8 relative z-10">
                <div className="flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-[#fdb300] rounded-full text-[#694900] shrink-0">
                    <Icon icon="material-symbols:desktop-windows" className="text-4xl lg:text-5xl" />
                </div>
                <div>
                    <p className="text-[32px] lg:text-[40px] 2xl:text-[48px] font-bold text-white font-['Plus_Jakarta_Sans'] leading-tight">{turno.modulo}</p>
                    <p className="text-[18px] lg:text-[20px] 2xl:text-[24px] font-semibold text-[#c0c1ff] mt-1 lg:mt-2 font-['Plus_Jakarta_Sans'] truncate">{turno.ciudadano}</p>
                </div>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#050066] rounded-tl-full opacity-50"></div>
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#e1e0ff] opacity-5 rounded-full blur-3xl"></div>
        </section>
    );
}
