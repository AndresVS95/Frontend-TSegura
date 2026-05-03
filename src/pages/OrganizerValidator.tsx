import React, { useState, useEffect, useRef } from 'react';
import OrganizerLayout from '../components/OrganizerLayout';
import { Search, QrCode, UserCheck, ShieldCheck, AlertTriangle, Loader2, CheckCircle, XCircle, Mail, Ticket as TicketIcon } from 'lucide-react';
import { ticketService } from '../services/ticketService';
import { eventService } from '../services/eventService';
import api from '../services/api';
import toast from 'react-hot-toast';
import type { Evento } from '../types/event.types';

const OrganizerValidator: React.FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [selectedEvento, setSelectedEvento] = useState<number | string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

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

    // ── Lógica de Búsqueda Manual ───────────────────────────────────────────
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length >= 3 && selectedEvento) {
                try {
                    setSearching(true);
                    // Endpoint sugerido para búsqueda global de asistentes en un evento
                    const { data } = await api.get(`/api/eventos/${selectedEvento}/buscar-asistente?query=${searchQuery}`);
                    setSearchResults(data);
                } catch (error) {
                    console.error("Error en búsqueda manual:", error);
                    setSearchResults([]);
                } finally {
                    setSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, selectedEvento]);

    // ── Lógica de Scanner (Pistola) ─────────────────────────────────────────
    useEffect(() => {
        if (!scanActivo) {
            scanBufferRef.current = '';
            return;
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const token = scanBufferRef.current.trim();
                if (token && token.length > 10) {
                    processToken(token);
                }
                scanBufferRef.current = '';
            } else if (e.key === 'Escape') {
                scanBufferRef.current = '';
            } else if (e.key.length === 1) {
                scanBufferRef.current += e.key;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [scanActivo, status]);

    const processToken = async (token: string) => {
        const tokenLimpio = token.trim();
        setScannedToken(tokenLimpio);
        setStatus('LOADING');
        try {
            await ticketService.validarIngreso(tokenLimpio);
            setStatus('VALID');
            setMensaje("¡Acceso Autorizado!");
            setTimeout(() => { setStatus('IDLE'); setMensaje(''); setScannedToken(null); }, 5000);
        } catch (error: any) {
            setStatus('INVALID');
            const msgError = error.response?.data?.message || "Error al validar";
            setMensaje(msgError);
            setTimeout(() => { setStatus('IDLE'); setMensaje(''); setScannedToken(null); }, 3000);
        }
    };

    const handleManualCheckin = async (ticketId: string) => {
        try {
            setStatus('LOADING');
            // Usamos el mismo endpoint de validación pero enviando el ticketId si es manual
            await api.post(`/api/mis-boletos/validar-ingreso-manual`, { ticketId });
            toast.success("Ingreso registrado manualmente");
            // Limpiar búsqueda
            setSearchQuery('');
            setSearchResults([]);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error al registrar ingreso");
        } finally {
            setStatus('IDLE');
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
            <div className="mb-10 animate-fade-in">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Validador de Tickets</h2>
                <p className="text-gray-500 mt-2 font-medium">Control de acceso y validación de NFTs en tiempo real.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Panel de Control de Escaneo */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Seleccionar Evento Activo</label>
                        <select 
                            value={selectedEvento}
                            onChange={(e) => setSelectedEvento(e.target.value)}
                            className="w-full bg-gray-50 border-none p-4 rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-[#2748E8] transition-all"
                        >
                            {eventos.map(ev => (
                                <option key={ev.eventoId} value={ev.eventoId}>{ev.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Scanner Activo / Panel de Estado */}
                    {scanActivo ? (
                        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col animate-in slide-in-from-left duration-300">
                            <div className="flex justify-between items-center mb-6 px-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    <h3 className="font-black text-sm text-gray-800 uppercase tracking-widest">Scanner Activo</h3>
                                </div>
                                <button onClick={() => setScanActivo(false)} className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 px-3 py-1 rounded-full transition-all">Detener</button>
                            </div>

                            {/* Resultado del escaneo */}
                            <div className={`p-8 rounded-3xl shadow-inner text-center transition-all duration-500 ${getStatusColor()} mb-4`}>
                                {status === 'IDLE' && (
                                    <div className="flex flex-col items-center">
                                        <QrCode size={48} className="mb-4 opacity-20" />
                                        <p className="font-bold animate-pulse text-sm">Esperando QR...</p>
                                    </div>
                                )}
                                {status === 'LOADING' && <Loader2 className="w-12 h-12 animate-spin mx-auto" />}
                                {status === 'VALID' && <CheckCircle size={48} className="mx-auto mb-2" />}
                                {status === 'INVALID' && <XCircle size={48} className="mx-auto mb-2" />}
                                
                                {status !== 'IDLE' && status !== 'LOADING' && (
                                    <>
                                        <h4 className="text-2xl font-black uppercase tracking-widest">{status}</h4>
                                        <p className="font-bold opacity-90 mt-1 text-sm">{mensaje}</p>
                                    </>
                                )}
                            </div>

                            {scannedToken && (
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Último Token:</p>
                                    <p className="font-mono text-[10px] text-gray-500 truncate">{scannedToken}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-[#2748E8] p-8 rounded-[2.5rem] text-white flex flex-col items-center text-center shadow-xl shadow-blue-500/30 group">
                            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-6 border border-white/30 backdrop-blur-sm group-hover:scale-110 transition-transform">
                                <QrCode size={40} />
                            </div>
                            <h3 className="text-xl font-black mb-2 tracking-tight">Scanner de Pistola</h3>
                            <p className="text-xs opacity-70 mb-8 leading-relaxed font-medium">
                                Conecta tu lector de códigos y activa el modo de escucha para validar entradas al instante.
                            </p>
                            <button 
                                onClick={() => setScanActivo(true)}
                                className="w-full bg-white text-[#2748E8] py-4 rounded-2xl font-black hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                Activar Modo Escucha
                            </button>
                        </div>
                    )}
                </div>

                {/* Buscador Manual y Lista de Ingresos */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-800 tracking-tight">Búsqueda Manual</h3>
                            <div className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck size={14} /> Sistema en Línea
                            </div>
                        </div>

                        <div className="relative mb-8">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text"
                                placeholder="Nombre completo, correo o ID de boleta..."
                                className="w-full bg-gray-50 border-none pl-16 pr-6 py-5 rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-[#2748E8] transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searching && (
                                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                </div>
                            )}
                        </div>

                        {/* Resultados de Búsqueda */}
                        <div className="min-h-[300px]">
                            {searchQuery.length > 0 && searchQuery.length < 3 ? (
                                <div className="p-12 text-center text-gray-400">
                                    <p className="text-sm font-bold">Escribe al menos 3 caracteres para buscar...</p>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="space-y-4">
                                    {searchResults.map((res) => (
                                        <div key={res.ticketId} className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gray-50 rounded-3xl hover:bg-gray-100 transition-all border border-transparent hover:border-blue-100 group">
                                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2748E8] shadow-sm group-hover:bg-blue-50">
                                                    <UserCheck size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900">{res.nombreCompleto}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            <Mail size={10} /> {res.correo}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            <TicketIcon size={10} /> {res.ticketId}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4">
                                                <div className="text-right mr-4 hidden sm:block">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Zona</p>
                                                    <p className="font-black text-blue-600 text-sm uppercase">{res.zona}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleManualCheckin(res.ticketId)}
                                                    className="bg-[#2748E8] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                                                >
                                                    Validar Ingreso
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : searchQuery.length >= 3 ? (
                                <div className="p-20 text-center text-gray-400">
                                    <div className="bg-gray-50 w-20 h-20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 text-gray-300">
                                        <XCircle size={40} />
                                    </div>
                                    <h4 className="text-gray-900 font-bold mb-1">Sin coincidencias</h4>
                                    <p className="text-sm">No encontramos asistentes con ese criterio.</p>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-100 rounded-[2.5rem] p-20 text-center">
                                    <div className="bg-gray-50 w-20 h-20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-gray-300">
                                        <UserCheck size={40} />
                                    </div>
                                    <h4 className="text-gray-900 font-black mb-2 text-xl tracking-tight">Buscador Inteligente</h4>
                                    <p className="text-gray-400 text-sm max-w-xs mx-auto font-medium">
                                        Ingresa el nombre o ID para encontrar al asistente y autorizar su acceso manualmente.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats rápidos de la puerta */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
                            <div className="text-blue-600 bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner">
                                <UserCheck size={28} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">En Recinto</span>
                                <p className="text-3xl font-black text-gray-900">--</p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
                            <div className="text-orange-600 bg-orange-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner">
                                <AlertTriangle size={28} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alertas</span>
                                <p className="text-3xl font-black text-gray-900">0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </OrganizerLayout>
    );
};

export default OrganizerValidator;
