import React, { useEffect, useState } from 'react';
import OrganizerLayout from '../components/OrganizerLayout';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { eventService } from '../services/eventService';
import type { Evento } from '../types/event.types';

const OrganizerFinances: React.FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const data = await eventService.obtenerMisEventos();
            setEventos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const recaudoTotal = eventos.reduce((acc, ev) => acc + (ev.recaudo ?? 0), 0);

    return (
        <OrganizerLayout>
            <div className="mb-10">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Finanzas y Pagos</h2>
                <p className="text-gray-500 mt-2 font-medium">Controla tus ingresos y el estado de tus liquidaciones.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Saldo Principal */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Saldo Total Recaudado</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-[#2748E8]">${recaudoTotal.toLocaleString()}</span>
                            <span className="text-xl font-bold text-gray-400">USD</span>
                        </div>
                        <p className="text-sm text-green-600 font-bold mt-4 flex items-center gap-1">
                            <CheckCircle2 size={16} /> Todos tus fondos están protegidos por Stripe.
                        </p>
                    </div>
                    <button className="bg-[#2748E8] text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                        Retirar Fondos <ArrowUpRight size={20} />
                    </button>
                </div>

                {/* Estado de Cuenta */}
                <div className="bg-[#03292e] p-8 rounded-[2.5rem] text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-2">Estado Stripe</h3>
                        <div className="flex items-center gap-2 text-[#0ed1e8] font-bold text-sm mb-6">
                            <CheckCircle2 size={16} /> Cuenta Verificada
                        </div>
                        <p className="text-xs opacity-60 leading-relaxed">
                            Tu cuenta está lista para recibir pagos. Los fondos se liquidan 7 días después de finalizado cada evento.
                        </p>
                    </div>
                    <div className="pt-6 border-t border-white/10">
                        <span className="text-[10px] font-bold opacity-40 uppercase">Próxima Liquidación</span>
                        <p className="font-bold">-- --, 2024</p>
                    </div>
                </div>
            </div>

            {/* Historial Simulado */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-10 py-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-xl font-black text-gray-800">Desglose por Evento</h3>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-10 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Evento</th>
                                <th className="px-10 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recaudo Bruto</th>
                                <th className="px-10 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Comisión TSegura</th>
                                <th className="px-10 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Neto Estimado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={4} className="px-10 py-10 text-center animate-pulse font-bold text-gray-400">Calculando finanzas...</td></tr>
                            ) : eventos.map(ev => (
                                <tr key={ev.eventoId} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-6 font-bold text-gray-800">{ev.nombre}</td>
                                    <td className="px-10 py-6 font-bold text-gray-600">${ev.recaudo?.toLocaleString()}</td>
                                    <td className="px-10 py-6 text-red-400 font-medium">-${((ev.recaudo ?? 0) * 0.05).toLocaleString()}</td>
                                    <td className="px-10 py-6 text-right">
                                        <span className="font-black text-green-600">
                                            ${((ev.recaudo ?? 0) * 0.95).toLocaleString()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </OrganizerLayout>
    );
};

export default OrganizerFinances;
