import type { ReactNode } from 'react';

interface KioscoLayoutProps {
    children: ReactNode;
}

/**
 * Layout exclusivo para el kiosco táctil APE.
 * No incluye nav-shell (sidebar/header) — es una pantalla de atril pública.
 * Ocupa 100dvh para no depender del scroll en kioscos táctiles.
 */
export default function KioscoLayout({ children }: KioscoLayoutProps) {
    return (
        <div className="kiosco-root">
            {children}
        </div>
    );
}
