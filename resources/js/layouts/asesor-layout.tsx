import { ReactNode } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';

interface Props {
    children: ReactNode;
    title?: string;
    onTabChange?: (tab: any) => void;
    activeTab?: string;
}

export default function AsesorLayout({ children, title = 'Panel del Asesor', onTabChange, activeTab = 'llamado' }: Props) {
    const page = usePage();
    const auth = (page.props as any).auth || {};
    const user = auth.user;

    return (
        <div className="flex h-screen bg-[#fcf8ff] font-['Plus_Jakarta_Sans'] overflow-hidden text-[#1b1b23]">
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
                        label="Atención de Turnos" 
                        active={['disponible', 'dashboard', 'atendiendo', 'validando_ruv', 'pausa'].includes(activeTab || '')} 
                        onClick={() => onTabChange?.('disponible')}
                    />
                    <NavItem 
                        icon="material-symbols:history" 
                        label="Historial" 
                        active={activeTab === 'historial'} 
                        onClick={() => onTabChange?.('historial')}
                    />
                </nav>

                <div className="p-4 border-t border-[#e4e1ec]">
                    <button 
                        onClick={() => {
                            import('@inertiajs/react').then(({ router }) => {
                                router.post('/logout');
                            });
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors font-bold text-sm"
                    >
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
                            <div className={`w-2.5 h-2.5 rounded-full mr-2 ${activeTab === 'disponible' ? 'bg-[#10b981] animate-pulse' : 'bg-[#fdb300]'}`}></div>
                            <span className="text-xs font-bold text-[#1b1b23] mr-4 uppercase">
                                {activeTab === 'disponible' ? 'Disponible' : (activeTab === 'pausa' ? 'En Pausa' : 'Ocupado')}
                            </span>
                            <span className="text-[10px] font-bold bg-[#10069f] text-white px-2 py-0.5 rounded uppercase tracking-wider">
                                Módulo {user?.advisor_detail?.module_number || 'S/N'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-[#050066] uppercase tracking-wide">
                                {user?.name || 'Asesor SENA'}
                            </span>
                            <span className="text-[10px] text-[#464554] font-medium">
                                {user?.role_id === 1 ? 'Coordinador Administrativo' : 'Asesor de Atención'}
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-[#c7c5d6] overflow-hidden bg-[#050066] flex items-center justify-center text-white font-bold text-sm">
                            {(user?.name || 'AS').substring(0, 2).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Contenido Dinámico */}
                <main className="flex-1 overflow-y-auto bg-[#efecf8] p-8">
                    <div className="max-w-5xl mx-auto">
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
            type="button"
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
