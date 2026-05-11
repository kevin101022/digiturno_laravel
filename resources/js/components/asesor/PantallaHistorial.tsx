import { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';

interface HistorialTurno {
    id: number;
    hora: string;
    codigo_turno: string;
    documento: string;
    categoria: string;
    duracion: string;
    estado: string;
    calificacion: string | null;
}

interface HistorialStats {
    atendidos: number;
    tiempo_promedio: string;
    calificacion: string;
}

export default function PantallaHistorial() {
    const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
    const [turnos, setTurnos] = useState<HistorialTurno[]>([]);
    const [stats, setStats] = useState<HistorialStats | null>(null);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        cargarHistorial();
    }, [fecha]);

    const cargarHistorial = async () => {
        setCargando(true);
        try {
            const res = await axios.get(`/asesor/historial?fecha=${fecha}`);
            setTurnos(res.data.turnos);
            setStats(res.data.stats);
        } catch (error) {
            console.error('Error al cargar historial', error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
            {/* Header y Filtro */}
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 bg-white p-6 rounded-2xl border border-[#c7c5d6] shadow-sm shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-[#1b1b23]">Historial de Atención</h2>
                    <p className="text-[#464554]">Revisa tu resumen diario y los ciudadanos que has atendido.</p>
                </div>
                
                <div className="flex flex-col gap-2 w-full md:w-auto">
                    <label className="text-xs font-bold text-[#767685] uppercase tracking-widest">
                        Filtrar por fecha
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="bg-[#efecf8] text-[#1b1b23] border-[#c7c5d6] rounded-xl px-4 py-2 font-semibold w-full md:w-48 focus:border-[#10069F] focus:ring-2 focus:ring-[#10069F]/20 transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Tarjetas de Resumen */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                    <div className="bg-white border border-[#c7c5d6] rounded-2xl p-6 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-[10px] font-bold text-[#767685] uppercase tracking-widest mb-1">Total Atendidos</p>
                            <p className="text-3xl font-bold text-[#1b1b23]">{stats.atendidos}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#efecf8]">
                            <Icon icon="material-symbols:groups" className="text-2xl text-[#10069f]" />
                        </div>
                    </div>
                    
                    <div className="bg-white border border-[#c7c5d6] rounded-2xl p-6 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-[10px] font-bold text-[#767685] uppercase tracking-widest mb-1">Tiempo Promedio</p>
                            <p className="text-3xl font-bold text-[#1b1b23]">{stats.tiempo_promedio}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#efecf8]">
                            <Icon icon="material-symbols:timer" className="text-2xl text-[#10069f]" />
                        </div>
                    </div>

                    <div className="bg-white border border-[#c7c5d6] rounded-2xl p-6 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-[10px] font-bold text-[#767685] uppercase tracking-widest mb-1">Calificación Promedio</p>
                            <p className="text-3xl font-bold text-[#1b1b23]">{stats.calificacion}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#fff8e6]">
                            <Icon icon="material-symbols:star" className="text-2xl text-[#fdb300]" />
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla Detallada */}
            <div className="bg-white border border-[#c7c5d6] rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-[300px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#fcf8ff] border-b border-[#e4e1ec]">
                                <th className="py-4 px-6 text-xs font-bold text-[#767685] uppercase tracking-wider">Hora</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#767685] uppercase tracking-wider">Turno</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#767685] uppercase tracking-wider">Documento</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#767685] uppercase tracking-wider">Categoría</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#767685] uppercase tracking-wider">Duración</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#767685] uppercase tracking-wider">Estado</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#767685] uppercase tracking-wider text-center">Calif.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargando ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-[#464554]">
                                        <Icon icon="material-symbols:progress-activity" className="text-4xl animate-spin mx-auto mb-2 text-[#10069f]" />
                                        <p>Cargando historial...</p>
                                    </td>
                                </tr>
                            ) : turnos.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-[#464554]">
                                        <Icon icon="material-symbols:history-off" className="text-4xl mx-auto mb-2 opacity-50" />
                                        <p>No hay registros para la fecha seleccionada.</p>
                                    </td>
                                </tr>
                            ) : (
                                turnos.map((turno) => (
                                    <tr key={turno.id} className="border-b border-[#e4e1ec] hover:bg-[#faf9ff] transition-colors">
                                        <td className="py-3 px-6 text-[#464554] font-medium">{turno.hora}</td>
                                        <td className="py-3 px-6 font-bold text-[#10069f]">{turno.codigo_turno}</td>
                                        <td className="py-3 px-6 text-[#1b1b23] font-medium">{turno.documento}</td>
                                        <td className="py-3 px-6">
                                            <span className="bg-[#efecf8] text-[#1b1b23] text-xs font-bold px-2 py-1 rounded">
                                                {turno.categoria}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-[#464554] font-medium">{turno.duracion}</td>
                                        <td className="py-3 px-6">
                                            {turno.estado === 'Atendido' ? (
                                                <span className="text-[#10b981] font-bold flex items-center gap-1">
                                                    <Icon icon="material-symbols:check-circle" /> Atendido
                                                </span>
                                            ) : (
                                                <span className="text-[#ba1a1a] font-bold flex items-center gap-1">
                                                    <Icon icon="material-symbols:cancel" /> No Presentado
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            {turno.calificacion ? (
                                                <span className="inline-flex items-center gap-1 text-[#1b1b23] font-bold">
                                                    <Icon icon="material-symbols:star" className="text-[#fdb300]" />
                                                    {turno.calificacion}
                                                </span>
                                            ) : (
                                                <span className="text-[#c7c5d6]">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
