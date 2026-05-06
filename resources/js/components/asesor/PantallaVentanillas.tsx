import { Icon } from '@iconify/react';

export default function PantallaVentanillas() {
    const ventanillas = [
        { id: '01', estado: 'activo', asesor: 'María Salas', categoria: 'General' },
        { id: '02', estado: 'activo', asesor: 'Diego Franco', categoria: 'Víctimas' },
        { id: '03', estado: 'espera', asesor: 'Carlos Mendoza', categoria: 'General' },
        { id: '04', estado: 'inactivo', asesor: null, categoria: 'Empresas' },
        { id: '05', estado: 'pausa', asesor: 'Rosa Torres', categoria: 'General' },
    ];

    return (
        <div className="flex flex-col gap-6 animate-in slide-in-from-right-10 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#1b1b23]">Gestión de Ventanillas</h2>
                    <p className="text-[#464554]">Monitoreo de estaciones de trabajo en tiempo real.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ventanillas.map((v) => (
                    <div key={v.id} className={`border rounded-2xl p-6 bg-white shadow-sm transition-all hover:shadow-md ${
                        v.estado === 'activo' ? 'border-l-4 border-l-[#10069f]' : 
                        v.estado === 'pausa' ? 'border-l-4 border-l-[#fdb300]' : ''
                    }`}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                    v.estado === 'activo' ? 'bg-[#e1e0ff] text-[#10069f]' : 'bg-[#efecf8] text-[#464554]'
                                }`}>
                                    {v.id}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#767685] bg-[#efecf8] px-2 py-1 rounded">
                                    {v.categoria}
                                </span>
                            </div>
                            <StatusBadge status={v.estado} />
                        </div>

                        {v.asesor ? (
                            <div className="flex items-center gap-3 p-3 bg-[#fcf8ff] rounded-xl border border-[#efecf8]">
                                <div className="w-8 h-8 rounded-full bg-[#10069f] text-white flex items-center justify-center text-xs font-bold uppercase">
                                    {v.asesor.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#1b1b23]">{v.asesor}</p>
                                    <p className="text-[10px] text-[#464554]">En línea</p>
                                </div>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-[#c7c5d6] rounded-xl p-4 flex flex-col items-center justify-center text-[#767685]">
                                <Icon icon="material-symbols:person-add" className="text-2xl mb-1" />
                                <span className="text-xs font-bold">Sin Asignar</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, any> = {
        activo: { label: 'Atendiendo', color: 'bg-green-100 text-green-700' },
        pausa: { label: 'Pausa', color: 'bg-yellow-100 text-yellow-700' },
        espera: { label: 'En Espera', color: 'bg-blue-100 text-blue-700' },
        inactivo: { label: 'Inactivo', color: 'bg-gray-100 text-gray-500' },
    };
    const { label, color } = config[status] || config.inactivo;
    return <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${color}`}>{label}</span>;
}
