import { Icon } from '@iconify/react';

const FILA_1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const FILA_2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
const FILA_3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
const NUMEROS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

interface Props {
    onTecla: (tecla: string) => void;
}

export default function TecladoAlfanumerico({ onTecla }: Props) {
    return (
        <div className="flex flex-col gap-2 items-center w-full max-w-[600px]">
            {/* Fila de números */}
            <div className="flex justify-center gap-2 w-full">
                {NUMEROS.map(tecla => (
                    <button
                        key={tecla}
                        onClick={() => onTecla(tecla)}
                        className="bg-white border border-[#c7c5d6] text-[#1b1b23] text-xl font-bold h-12 flex-1 rounded-lg hover:bg-[#efecf8] active:bg-[#e1e0ff] active:scale-95 transition-all shadow-sm"
                    >
                        {tecla}
                    </button>
                ))}
            </div>
            
            {/* Fila 1 */}
            <div className="flex justify-center gap-2 w-full px-2">
                {FILA_1.map(tecla => (
                    <button
                        key={tecla}
                        onClick={() => onTecla(tecla)}
                        className="bg-white border border-[#c7c5d6] text-[#1b1b23] text-xl font-bold h-14 flex-1 rounded-lg hover:bg-[#efecf8] active:bg-[#e1e0ff] active:scale-95 transition-all shadow-sm"
                    >
                        {tecla}
                    </button>
                ))}
            </div>

            {/* Fila 2 */}
            <div className="flex justify-center gap-2 w-full px-6">
                {FILA_2.map(tecla => (
                    <button
                        key={tecla}
                        onClick={() => onTecla(tecla)}
                        className="bg-white border border-[#c7c5d6] text-[#1b1b23] text-xl font-bold h-14 flex-1 rounded-lg hover:bg-[#efecf8] active:bg-[#e1e0ff] active:scale-95 transition-all shadow-sm"
                    >
                        {tecla}
                    </button>
                ))}
            </div>

            {/* Fila 3 y controles */}
            <div className="flex justify-center gap-2 w-full">
                <button
                    onClick={() => onTecla('clear')}
                    className="bg-[#ffeaea] border border-[#ffb4ab] text-[#ba1a1a] text-sm font-bold h-14 px-4 rounded-lg hover:bg-[#ffdad6] active:scale-95 transition-all shadow-sm"
                >
                    BORRAR
                </button>
                
                {FILA_3.map(tecla => (
                    <button
                        key={tecla}
                        onClick={() => onTecla(tecla)}
                        className="bg-white border border-[#c7c5d6] text-[#1b1b23] text-xl font-bold h-14 w-[45px] rounded-lg hover:bg-[#efecf8] active:bg-[#e1e0ff] active:scale-95 transition-all shadow-sm"
                    >
                        {tecla}
                    </button>
                ))}

                <button
                    onClick={() => onTecla('backspace')}
                    className="bg-[#efecf8] border border-[#c7c5d6] text-[#1b1b23] text-xl font-bold h-14 px-4 rounded-lg hover:bg-[#e1e0ff] active:scale-95 transition-all shadow-sm flex items-center justify-center"
                >
                    <Icon icon="material-symbols:backspace" />
                </button>
            </div>
        </div>
    );
}
