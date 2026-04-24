import React, { useState, useEffect } from 'react';
import OrganizerLayout from '../components/OrganizerLayout';
import { Search, QrCode, UserCheck, ShieldCheck, AlertTriangle } from 'lucide-react';
import { eventService } from '../services/eventService';
import type { Evento } from '../types/event.types';

const OrganizerValidator: React.FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [selectedEvento, setSelectedEvento] = useState<number | string>('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchEventos = async () => {
            const data = await eventService.obtenerMisEventos();
            setEventos(data.filter(ev => ev.estado === 'PUBLICADO'));
            if (data.length > 0) setSelectedEvento(data[0].eventoId || '');
        };
        fetchEventos();
    }, []);

    return (
        <OrganizerLayout>
            <div className="mb-10">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Validador de Tickets</h2>
                <p className="text-gray-500 mt-2 font-medium">Control de acceso y validación de NFTs en tiempo real.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Panel de Control de Escaneo */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Seleccionar Evento</label>
                        <select 
                            value={selectedEvento}
                            onChange={(e) => setSelectedEvento(e.target.value)}
                            className="w-full bg-gray-50 border-none p-4 rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-[#1E5ADF]"
                        >
                            {eventos.map(ev => (
                                <option key={ev.eventoId} value={ev.eventoId}>{ev.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-[#1E5ADF] p-8 rounded-[2.5rem] text-white flex flex-col items-center text-center shadow-xl shadow-blue-500/30">
                        <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-6 border border-white/30 backdrop-blur-sm">
                            <QrCode size={40} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Modo Escáner</h3>
                        <p className="text-xs opacity-70 mb-8 leading-relaxed">
                            Apunta con la cámara al código QR del NFT para validar la entrada instantáneamente.
                        </p>
                        <button className="w-full bg-white text-[#1E5ADF] py-4 rounded-2xl font-black hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                            Activar Cámara
                        </button>
                    </div>
                </div>

                {/* Buscador Manual y Lista de Ingresos */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-800">Búsqueda Manual</h3>
                            <div className="bg-green-50 text-green-700 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <ShieldCheck size={14} /> Sistema en Línea
                            </div>
                        </div>

                        <div className="relative mb-8">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text"
                                placeholder="Nombre del asistente o Documento de identidad..."
                                className="w-full bg-gray-50 border-none pl-14 pr-6 py-5 rounded-2xl font-medium text-gray-700 focus:ring-2 focus:ring-[#1E5ADF]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Placeholder de resultados */}
                        <div className="border-2 border-dashed border-gray-100 rounded-3xl p-12 text-center">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <UserCheck size={32} />
                            </div>
                            <h4 className="text-gray-900 font-bold mb-2 text-lg">Ingresa un dato para buscar</h4>
                            <p className="text-gray-400 text-sm max-w-xs mx-auto">
                                Podrás ver el estado del ticket y marcar el ingreso del asistente de forma manual.
                            </p>
                        </div>
                    </div>

                    {/* Stats rápidos de la puerta */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="text-blue-600 bg-blue-50 p-3 rounded-xl">
                                <UserCheck size={24} />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">En el Evento</span>
                                <p className="text-xl font-black">-- / --</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="text-orange-600 bg-orange-50 p-3 rounded-xl">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Denegados</span>
                                <p className="text-xl font-black">0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </OrganizerLayout>
    );
};

export default OrganizerValidator;
