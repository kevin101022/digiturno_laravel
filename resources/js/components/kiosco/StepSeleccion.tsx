import { Icon } from '@iconify/react';
import type { KioscoCategoria } from '@/types/kiosco';
import { CATEGORIA_LABELS } from '@/types/kiosco';

interface CategoriaCard {
    id: KioscoCategoria;
    icon: string;
    colorActivo: string;
    borderActivo: string;
    iconColor: string;
}

const CATEGORIAS: CategoriaCard[] = [
    {
        id: 'victim',
        icon: 'material-symbols:accessibility-new',
        colorActivo: 'bg-[#fff0ee] border-[#c0392b]',
        borderActivo: 'border-[#c0392b]',
        iconColor: 'text-[#630300]',
    },
    {
        id: 'priority',
        icon: 'material-symbols:stars',
        colorActivo: 'bg-[#fff8e1] border-[#7d5700]',
        borderActivo: 'border-[#7d5700]',
        iconColor: 'text-[#7d5700]',
    },
    {
        id: 'business',
        icon: 'material-symbols:domain',
        colorActivo: 'bg-[#e8e7f8] border-[#10069F]',
        borderActivo: 'border-[#10069F]',
        iconColor: 'text-[#10069F]',
    },
    {
        id: 'general',
        icon: 'material-symbols:person',
        colorActivo: 'bg-[#e8e7f8] border-[#10069F]',
        borderActivo: 'border-[#10069F]',
        iconColor: 'text-[#10069F]',
    },
];

interface StepSeleccionProps {
    seleccionada: KioscoCategoria | null;
    onSeleccionar: (cat: KioscoCategoria) => void;
    onContinuar: () => void;
}

/**
 * Pantalla 1 del kiosco: selección de tipo de atención.
 * Grilla 2×2 con tarjetas táctiles de gran tamaño.
 */
export default function StepSeleccion({ seleccionada, onSeleccionar, onContinuar }: StepSeleccionProps) {
    return (
        <div className="kiosco-screen">
            {/* Header */}
            <header className="flex flex-col items-center text-center pt-10 pb-6 px-10">
                <img
                    src="/imagenes/Logo APE 2024 (1).png"
                    alt="Logo SENA APE – Agencia Pública de Empleo"
                    className="h-20 w-auto object-contain mb-8 select-none"
                    draggable={false}
                />
                <h1 className="kiosco-h1 text-[#1b1b23] max-w-4xl">
                    Seleccione su tipo de atención
                </h1>
                <p className="kiosco-body text-[#464554] mt-3 max-w-2xl">
                    Por favor, elija la categoría que mejor describa su perfil para asignarle el turno correspondiente.
                </p>
            </header>

            {/* Grilla de categorías */}
            <section className="flex flex-1 items-center justify-center px-10 py-4">
                <div className="grid grid-cols-2 gap-5 w-full max-w-5xl">
                    {CATEGORIAS.map((cat) => {
                        const activo = seleccionada === cat.id;
                        return (
                            <button
                                key={cat.id}
                                id={`categoria-${cat.id}`}
                                onClick={() => onSeleccionar(cat.id)}
                                className={[
                                    'kiosco-card',
                                    activo
                                        ? `${cat.colorActivo} scale-[0.98] shadow-inner`
                                        : 'bg-white border-[#c7c5d6] hover:bg-[#efecf8]',
                                ].join(' ')}
                            >
                                <Icon
                                    icon={cat.icon}
                                    className={`kiosco-card-icon ${activo ? cat.iconColor : 'text-[#464554]'}`}
                                />
                                <span className={`kiosco-h2 mt-4 ${activo ? 'text-[#1b1b23]' : 'text-[#1b1b23]'}`}>
                                    {CATEGORIA_LABELS[cat.id]}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Footer con botón de acción */}
            <footer className="flex justify-center px-10 pb-10 mt-auto">
                <button
                    id="btn-obtener-ticket"
                    onClick={onContinuar}
                    disabled={!seleccionada}
                    className="kiosco-btn-primary w-full max-w-3xl"
                >
                    <span>Obtener Ticket</span>
                    <Icon icon="material-symbols:arrow-forward-ios" className="text-[2.5rem]" />
                </button>
            </footer>
        </div>
    );
}
