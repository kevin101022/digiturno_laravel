import { Icon } from '@iconify/react';
import type { TipoDocumento } from '@/types/kiosco';
import { TIPO_DOCUMENTO_LABELS } from '@/types/kiosco';

const TIPOS_DOC: TipoDocumento[] = ['CC', 'CE', 'TI'];

const TECLAS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'backspace', '0', 'clear'] as const;
type Tecla = (typeof TECLAS)[number];

interface StepIdentificacionProps {
    tipoDocumento: TipoDocumento;
    numeroDocumento: string;
    cargando: boolean;
    puedeContinuar: boolean;
    onTipoDocumento: (tipo: TipoDocumento) => void;
    onTecla: (tecla: Tecla) => void;
    onAnterior: () => void;
    onContinuar: () => void;
}

/**
 * Pantalla 2 del kiosco: identificación del ciudadano.
 * Columna izquierda: selección de tipo de documento + display del número.
 * Columna derecha: teclado numérico táctil 3×4.
 */
export default function StepIdentificacion({
    tipoDocumento,
    numeroDocumento,
    cargando,
    puedeContinuar,
    onTipoDocumento,
    onTecla,
    onAnterior,
    onContinuar,
}: StepIdentificacionProps) {
    return (
        <div className="kiosco-screen">
            {/* Header */}
            <header className="flex flex-col items-center text-center pt-8 pb-6 px-10 border-b border-[#e4e1ec] bg-white">
                <img
                    src="/imagenes/Logo APE 2024 (1).png"
                    alt="Logo SENA APE – Agencia Pública de Empleo"
                    className="h-16 w-auto object-contain mb-5 select-none"
                    draggable={false}
                />
                <h1 className="kiosco-h1 text-[#050066]">Identificación del Ciudadano</h1>
                <p className="kiosco-body text-[#464554] mt-2 max-w-2xl">
                    Por favor, ingrese sus datos para continuar con su solicitud (mínimo 10 dígitos).
                </p>
            </header>

            {/* Contenido principal: 2 columnas */}
            <main className="flex flex-1 w-full max-w-5xl mx-auto px-10 py-6 gap-12 items-center overflow-hidden">
                {/* Columna izquierda: tipo de doc + display */}
                <div className="flex flex-col gap-6 flex-1">
                    {/* Tipo de documento */}
                    <div className="flex flex-col gap-3">
                        <label className="kiosco-h2 text-[#1b1b23]">Tipo de Documento</label>
                        <div className="relative">
                            <select
                                id="select-tipo-doc"
                                value={tipoDocumento}
                                onChange={(e) => onTipoDocumento(e.target.value as TipoDocumento)}
                                className="kiosco-doc-btn w-full bg-[#efecf8] text-[#1b1b23] border-[#c7c5d6] appearance-none cursor-pointer pr-12 focus:border-[#10069F] focus:ring-2 focus:ring-[#10069F]/20 transition-all outline-none text-xl font-semibold"
                            >
                                {TIPOS_DOC.map((tipo) => (
                                    <option key={tipo} value={tipo}>
                                        {TIPO_DOCUMENTO_LABELS[tipo]}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Icon icon="material-symbols:expand-more" className="text-[2rem] text-[#464554]" />
                            </div>
                        </div>
                    </div>

                    {/* Display del número */}
                    <div className="flex flex-col gap-3">
                        <label className="kiosco-h2 text-[#1b1b23]">Número de Documento</label>
                        <div className="h-20 w-full bg-white border-2 border-[#c7c5d6] rounded-xl flex items-center px-6 gap-2 overflow-hidden">
                            <span className="text-[2.2rem] font-bold text-[#1b1b23] tracking-[0.1em] flex-1 text-center whitespace-nowrap overflow-hidden">
                                {numeroDocumento}
                            </span>
                            <span className="w-[3px] h-10 bg-[#10069F] animate-pulse rounded-full flex-shrink-0" />
                        </div>
                    </div>
                </div>

                {/* Columna derecha: teclado numérico */}
                <div className="flex flex-col items-center justify-center">
                    <div className="grid grid-cols-3 gap-3 w-[340px]">
                        {TECLAS.map((tecla) => {
                            if (tecla === 'backspace') {
                                return (
                                    <button
                                        key={tecla}
                                        id="tecla-backspace"
                                        onClick={() => onTecla('backspace')}
                                        className="kiosco-key kiosco-key-action"
                                        aria-label="Borrar último dígito"
                                    >
                                        <Icon icon="material-symbols:backspace" className="text-[2rem]" />
                                    </button>
                                );
                            }
                            if (tecla === 'clear') {
                                return (
                                    <button
                                        key={tecla}
                                        id="tecla-borrar"
                                        onClick={() => onTecla('clear')}
                                        className="kiosco-key kiosco-key-action text-[1.1rem] font-semibold"
                                    >
                                        Borrar
                                    </button>
                                );
                            }
                            return (
                                <button
                                    key={tecla}
                                    id={`tecla-${tecla}`}
                                    onClick={() => onTecla(tecla)}
                                    className="kiosco-key"
                                >
                                    {tecla}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="flex justify-between items-center px-10 py-6 border-t border-[#e4e1ec] bg-white">
                <button
                    id="btn-anterior"
                    onClick={onAnterior}
                    className="kiosco-btn-secondary"
                >
                    <Icon icon="material-symbols:arrow-back" className="text-[1.8rem]" />
                    <span>Anterior</span>
                </button>

                <button
                    id="btn-continuar"
                    onClick={onContinuar}
                    disabled={!puedeContinuar || cargando}
                    className="kiosco-btn-primary max-w-[320px]"
                >
                    {cargando ? (
                        <>
                            <Icon icon="material-symbols:progress-activity" className="text-[1.8rem] animate-spin" />
                            <span>Procesando…</span>
                        </>
                    ) : (
                        <>
                            <span>Continuar</span>
                            <Icon icon="material-symbols:arrow-forward" className="text-[1.8rem]" />
                        </>
                    )}
                </button>
            </footer>
        </div>
    );
}
