import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import OrganizerLayout from '../components/OrganizerLayout';
import { Search, QrCode, UserCheck, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ticketService } from '../services/ticketService';
import { eventService } from '../services/eventService';
import type { Evento } from '../types/event.types';

const OrganizerValidator: React.FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [selectedEvento, setSelectedEvento] = useState<number | string>('');
    const [searchQuery, setSearchQuery] = useState('');

    const [scannedToken, setScannedToken] = useState<string | null>(null);
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'VALID' | 'INVALID' | 'USED'>('IDLE');
    const [mensaje, setMensaje] = useState<string>('');
    const [scanActivo, setScanActivo] = useState(false);

    useEffect(() => {
        const fetchEventos = async () => {
            const data = await eventService.obtenerMisEventos();
            setEventos(data.filter(ev => ev.estado === 'PUBLICADO'));
            if (data.length > 0) setSelectedEvento(data[0].eventoId || '');
        };
        fetchEventos();
    }, []);

    useEffect(() => {
        if (!scanActivo) return;

        const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
        
        scanner.render(
            (decodedText) => {
                if (status === 'IDLE') {
                    scanner.pause(true);
                    validarBoleto(decodedText, scanner);
                }
            },
            (error) => { /* ignorar errores de frame */ }
        );

        return () => { 
            scanner.clear().catch(console.error); 
        };
    }, [scanActivo, status]);

    const validarBoleto = async (token: string, scannerInstance: any) => {
        setScannedToken(token);
        setStatus('LOADING');

        try {
            // El backend retorna un texto plano (no JSON)
            const data = await ticketService.validarIngreso(token);
            
            // Evaluamos la respuesta en texto plano
            if (data.includes('ACCESO PERMITIDO')) {
                setStatus('VALID');
                setMensaje(data); // "ACCESO PERMITIDO: Boleto validado correctamente"
            } else if (data.includes('USADO') || data.includes('ya fue')) {
                // Previendo que el back pueda responder distinto para "ya usado" a futuro
                setStatus('USED');
                setMensaje('Boleto ya fue escaneado anteriormente.');
            } else {
                setStatus('INVALID');
                setMensaje(data || 'Boleto falso o no reconocido.');
            }
        } catch (error: any) {
            // Si el backend lanza error 500
            setStatus('INVALID');
            setMensaje(error.response?.data?.message || 'Error del servidor (500) o boleto inválido.');
        }

        setTimeout(() => {
            setStatus('IDLE');
            setScannedToken(null);
            scannerInstance.resume();
        }, 3000);
    };

    const getStatusColor = () => {
        if (status === 'VALID') return 'bg-green-500 text-white';
        if (status === 'USED') return 'bg-yellow-500 text-white';
        if (status === 'INVALID') return 'bg-red-500 text-white';
        return 'bg-blue-50 text-blue-600';
    };

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

                    {/* Cámara / Panel de Estado */}
                    {scanActivo ? (
                        <div className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col">
                            <div className="flex justify-between items-center mb-4 px-4">
                                <h3 className="font-bold text-gray-800">Escáner Activo</h3>
                                <button onClick={() => setScanActivo(false)} className="text-red-500 text-sm font-bold hover:underline">Detener</button>
                            </div>
                            
                            {/* Lector de cámara */}
                            <div id="reader" className="w-full rounded-2xl overflow-hidden mb-4" />

                            {/* Resultado del escaneo */}
                            {status !== 'IDLE' && status !== 'LOADING' && (
                                <div className={`p-4 rounded-2xl shadow-inner text-center animate-bounce ${getStatusColor()}`}>
                                    <h4 className="text-xl font-black uppercase tracking-widest">{status}</h4>
                                    <p className="font-bold opacity-90 mt-1 text-sm">{mensaje}</p>
                                </div>
                            )}

                            {status === 'IDLE' && (
                                <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 text-center">
                                    <p className="font-bold animate-pulse text-sm">Esperando código QR...</p>
                                </div>
                            )}
                            {status === 'LOADING' && (
                                <div className="p-4 rounded-2xl bg-gray-50 text-gray-500 border border-gray-100 text-center flex justify-center items-center gap-2">
                                    <span className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full" />
                                    <p className="font-bold text-sm">Validando servidor...</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-[#1E5ADF] p-8 rounded-[2.5rem] text-white flex flex-col items-center text-center shadow-xl shadow-blue-500/30">
                            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-6 border border-white/30 backdrop-blur-sm">
                                <QrCode size={40} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Modo Escáner</h3>
                            <p className="text-xs opacity-70 mb-8 leading-relaxed">
                                Apunta con la cámara al código QR del NFT para validar la entrada instantáneamente.
                            </p>
                            <button 
                                onClick={() => setScanActivo(true)}
                                className="w-full bg-white text-[#1E5ADF] py-4 rounded-2xl font-black hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                            >
                                Activar Cámara
                            </button>
                        </div>
                    )}
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
