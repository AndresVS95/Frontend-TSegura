import React, { useState, useEffect, useRef } from 'react';
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
    const scanBufferRef = useRef<string>('');

    useEffect(() => {
        const fetchEventos = async () => {
            const data = await eventService.obtenerMisEventos();
            setEventos(data.filter(ev => ev.estado === 'PUBLICADO'));
            if (data.length > 0) setSelectedEvento(data[0].eventoId || '');
        };
        fetchEventos();
    }, []);

        // Dentro de tu useEffect en OrganizerValidator.tsx
    useEffect(() => {
        if (!scanActivo) {
            scanBufferRef.current = '';
            return;
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const token = scanBufferRef.current.trim();
                console.log("TOKEN CAPTURADO:", token); // DEBUG
                
                if (token && token.length > 10) { // Un JWT siempre es largo
                    processToken(token);
                }
                scanBufferRef.current = ''; // Limpiar buffer
            } else if (e.key === 'Escape') {
                scanBufferRef.current = '';
            } else if (e.key.length === 1) {
                // Capturar solo caracteres visibles
                scanBufferRef.current += e.key;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [scanActivo, status]); // Depende de ambos

    const processToken = async (token: string) => {
        //la pistola está en español, el token llegará perfecto.
        const tokenLimpio = token.trim();

        setScannedToken(tokenLimpio);
        setStatus('LOADING');
        try {
            await ticketService.validarIngreso(tokenLimpio);
            setStatus('VALID');
            setMensaje("¡Acceso Autorizado!");

            setTimeout(() => {
                setStatus('IDLE');
                setMensaje('');
                setScannedToken(null);
            }, 5000); // 5 segundos para el mensaje de éxito

        } catch (error: any) {
            setStatus('INVALID');
            const msgError = error.response?.data?.message || "Error al validar";
            setMensaje(msgError);

            setTimeout(() => {
                setStatus('IDLE');
                setMensaje('');
                setScannedToken(null);
            }, 3000);
        }
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

                    {/* Scanner Activo / Panel de Estado */}
                    {scanActivo ? (
                        <div className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col">
                            <div className="flex justify-between items-center mb-4 px-4">
                                <h3 className="font-bold text-gray-800">Scanner Activo</h3>
                                <button onClick={() => setScanActivo(false)} className="text-red-500 text-sm font-bold hover:underline">Detener</button>
                            </div>

                            {/* Mostrar QR escaneado */}
                            {scannedToken && (
                                <div className="mb-4 p-3 rounded-2xl bg-gray-50 border border-gray-200">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Código QR Escaneado:</p>
                                    <p className="font-mono text-sm text-gray-800 break-all">{scannedToken}</p>
                                </div>
                            )}

                            {/* Resultado del escaneo */}
                            {status !== 'IDLE' && status !== 'LOADING' && (
                                <div className={`p-4 rounded-2xl shadow-inner text-center animate-bounce ${getStatusColor()}`}>
                                    <h4 className="text-xl font-black uppercase tracking-widest">{status}</h4>
                                    <p className="font-bold opacity-90 mt-1 text-sm">{mensaje}</p>
                                </div>
                            )}

                            {status === 'IDLE' && (
                                <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 text-center">
                                    <p className="font-bold animate-pulse text-sm">Esperando escaneo de QR...</p>
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
                            <h3 className="text-xl font-bold mb-2">Scanner de Pistola</h3>
                            <p className="text-xs opacity-70 mb-8 leading-relaxed">
                                Escanea el código QR con la pistola lectora para validar la entrada instantáneamente.
                            </p>
                            <button 
                                onClick={() => setScanActivo(true)}
                                className="w-full bg-white text-[#1E5ADF] py-4 rounded-2xl font-black hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                            >
                                Activar Scanner
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
