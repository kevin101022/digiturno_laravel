import { ReactNode } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Icon } from '@iconify/react';

interface Props {
    children: ReactNode;
    title?: string;
    onTabChange?: (tab: any) => void;
    activeTab?: string;
}

export default function AsesorLayout({ children, title = 'Panel del Asesor', onTabChange, activeTab = 'llamado' }: Props) {
    return (
        <div className="flex h-screen bg-[#fcf8ff] font-['Plus_Jakarta_Sans'] overflow-hidden">
            <Head title={title} />

            {/* Sidebar Lateral */}
            <aside className="w-64 bg-[#f5f2fd] border-r border-[#e4e1ec] flex flex-col shrink-0">
                <div className="p-6 flex justify-center">
                    <img 
                        src="/imagenes/Logo APE 2024 (1).png" 
                        alt="Logo APE SENA" 
                        className="h-16 w-auto object-contain"
                    />
                </div>

                <nav className="flex-1 px-4 py-2 space-y-2">
                    <NavItem 
                        icon="material-symbols:campaign" 
                        label="Llamado de Turnos" 
                        active={['disponible', 'dashboard', 'atendiendo', 'validando_ruv'].includes(activeTab || '')} 
                        onClick={() => onTabChange?.('disponible')}
                    />
                    <NavItem 
                        icon="material-symbols:analytics" 
                        label="Métricas" 
                        active={activeTab === 'metricas'}
                        onClick={() => onTabChange?.('metricas')}
                    />
                    <NavItem 
                        icon="material-symbols:settings" 
                        label="Configuración" 
                        active={activeTab === 'configuracion'} 
                        onClick={() => onTabChange?.('configuracion')}
                    />
                </nav>

                <div className="p-4 border-t border-[#e4e1ec]">
                    <button className="flex items-center gap-3 w-full px-4 py-3 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors font-bold text-sm">
                        <Icon icon="material-symbols:logout" className="text-xl" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Area Principal */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header Superior */}
                <header className="h-16 bg-white border-b border-[#e4e1ec] flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-6">
                        <h1 className="text-xl font-bold text-[#050066]">APE Turnos SENA</h1>
                        <div className="flex items-center px-4 py-1.5 rounded-full bg-[#eae7f2] shadow-sm">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] mr-2 animate-pulse"></span>
                            <span className="text-xs font-bold text-[#1b1b23] mr-4 uppercase">Disponible</span>
                            <span className="text-[10px] font-bold bg-[#10069f] text-white px-2 py-0.5 rounded">Módulo 4</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <HeaderBtn icon="material-symbols:notifications" />
                            <HeaderBtn icon="material-symbols:settings" />
                            <HeaderBtn icon="material-symbols:help" />
                        </div>
                        <div className="w-10 h-10 rounded-full border border-[#c7c5d6] overflow-hidden bg-gray-100">
                            <img src="https://ui-avatars.com/api/?name=Asesor+Sena&background=050066&color=fff" alt="Perfil" />
                        </div>
                    </div>
                </header>

                {/* Contenido Dinámico */}
                <main className="flex-1 overflow-y-auto bg-[#efecf8] p-8">
                    <div className="max-w-5xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

function NavItem({ icon, label, onClick, active = false }: { icon: string; label: string; onClick?: () => void; active?: boolean }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all active:scale-95 text-sm font-bold ${
                active 
                ? 'bg-[#fdb300] text-[#271900]' 
                : 'text-[#464554] hover:bg-[#eae7f2]'
            }`}
        >
            <Icon icon={icon} className="text-xl" />
            <span>{label}</span>
        </button>
    );
}

function HeaderBtn({ icon }: { icon: string }) {
    return (
        <button className="p-2 text-[#464554] hover:bg-[#efecf8] rounded-full transition-colors">
            <Icon icon={icon} className="text-xl" />
        </button>
    );
}
