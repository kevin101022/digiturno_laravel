import { type ReactNode, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { logout } from '@/routes';

// ─── Tipos ────────────────────────────────────────────────────────────────────
export type CoordinadorTab = 'dashboard' | 'gestion' | 'rendimiento' | 'reportes' | 'configuracion';

interface NavItem {
    tab: CoordinadorTab;
    icon: string;
    label: string;
}

interface Props {
    children: ReactNode;
    title?: string;
    activeTab: CoordinadorTab;
    onTabChange: (tab: CoordinadorTab) => void;
    coordinador?: {
        nombre: string;
        rol: string;
        avatar: string;
    };
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
    { tab: 'dashboard',    icon: 'material-symbols:dashboard',             label: 'Dashboard'         },
    { tab: 'gestion',      icon: 'material-symbols:settings-accessibility', label: 'Gestión Operativa' },
    { tab: 'rendimiento',  icon: 'material-symbols:leaderboard',            label: 'Rendimiento'       },
    { tab: 'reportes',     icon: 'material-symbols:analytics',              label: 'Reportes'          },
    { tab: 'configuracion',icon: 'material-symbols:settings',               label: 'Configuración'     },
];

// ─── Estilos fijos — NO dependen de variables CSS del tema ────────────────────
// Se usan valores hardcoded para que el diseño sea idéntico en modo claro u oscuro.
const COLORS = {
    bg:           '#fcf8ff',
    sidebar:      '#f5f2fd',
    border:       '#c7c5d6',
    primary:      '#050066',
    surface:      '#ffffff',
    surfaceHigh:  '#eae7f2',
    amber:        '#fdb300',
    amberText:    '#271900',
    textSecondary:'#464554',
    textMain:     '#1b1b23',
} as const;

// ─── Componente de ítem de navegación ─────────────────────────────────────────
function SideNavItem({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            aria-current={active ? 'page' : undefined}
            className="flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all active:scale-95 text-xs font-bold uppercase tracking-wider"
            style={{
                backgroundColor: active ? COLORS.amber          : 'transparent',
                color:           active ? COLORS.amberText      : COLORS.textSecondary,
            }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = COLORS.surfaceHigh; }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
        >
            <Icon icon={item.icon} className="text-xl shrink-0" />
            <span>{item.label}</span>
        </button>
    );
}

// ─── Layout Principal ─────────────────────────────────────────────────────────
export default function CoordinadorLayout({
    children,
    title = 'Portal del Coordinador — APE',
    activeTab,
    onTabChange,
    coordinador,
}: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div
            className="flex h-screen overflow-hidden antialiased"
            style={{ backgroundColor: COLORS.bg, color: COLORS.textMain, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            <Head title={title} />

            {/* ── Overlay móvil ─────────────────────────────────────────── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <aside
                className={`
                    fixed md:relative z-50 md:z-auto
                    flex flex-col h-full w-72 shrink-0
                    border-r py-4
                    transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
                style={{ backgroundColor: COLORS.sidebar, borderColor: COLORS.border }}
            >
                {/* Logo */}
                <div className="px-6 mb-6 flex flex-col items-start gap-2">
                    <img
                        src="/imagenes/Logo APE 2024 (1).png"
                        alt="Logo APE SENA"
                        className="h-14 w-auto object-contain"
                        width={180}
                        height={56}
                    />
                    <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: COLORS.textSecondary }}>
                        Panel de Coordinación
                    </p>
                </div>

                {/* Navegación */}
                <nav className="flex-1 px-2 space-y-1 overflow-y-auto" aria-label="Navegación del coordinador">
                    {NAV_ITEMS.map(item => (
                        <SideNavItem
                            key={item.tab}
                            item={item}
                            active={activeTab === item.tab}
                            onClick={() => { onTabChange(item.tab); setSidebarOpen(false); }}
                        />
                    ))}
                </nav>

                {/* Perfil / Logout */}
                <div className="px-4 pt-4 border-t" style={{ borderColor: COLORS.border }}>
                    {coordinador && (
                        <div className="flex items-center gap-3 px-2 py-2 rounded-lg mb-2">
                            <img
                                src={coordinador.avatar}
                                alt={`Avatar de ${coordinador.nombre}`}
                                className="w-9 h-9 rounded-full border object-cover shrink-0"
                                style={{ borderColor: COLORS.border }}
                                width={36}
                                height={36}
                            />
                            <div className="min-w-0">
                                <p className="text-xs font-bold truncate" style={{ color: COLORS.textMain }}>{coordinador.nombre}</p>
                                <p className="text-[10px] truncate" style={{ color: COLORS.textSecondary }}>{coordinador.rol}</p>
                            </div>
                        </div>
                    )}
                    <button
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                        style={{ color: '#ba1a1a' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ffdad6')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => router.post(logout().url)}
                    >
                        <Icon icon="material-symbols:logout" className="text-lg" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* ── Área Principal ────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Header */}
                <header
                    className="flex items-center justify-between h-14 px-4 md:px-6 shrink-0 border-b z-30"
                    style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
                >
                    <div className="flex items-center gap-3">
                        {/* Botón hamburger — solo móvil */}
                        <button
                            className="md:hidden p-2 rounded-lg transition-colors"
                            style={{ color: COLORS.textSecondary }}
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Abrir menú de navegación"
                        >
                            <Icon icon="material-symbols:menu" className="text-xl" />
                        </button>
                        <h1 className="text-base font-extrabold hidden sm:block" style={{ color: COLORS.primary }}>
                            Portal de Coordinación
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* El header ahora está limpio de elementos redundantes */}
                    </div>
                </header>

                {/* Contenido dinámico */}
                <main
                    className="flex-1 overflow-y-auto p-4 md:p-6"
                    style={{ backgroundColor: COLORS.bg }}
                    id="main-content"
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
