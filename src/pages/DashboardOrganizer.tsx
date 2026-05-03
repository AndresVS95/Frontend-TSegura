import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import type { Evento } from '../types/event.types';
import OrganizerLayout from '../components/OrganizerLayout';
import { TrendingUp, Users, Calendar, ArrowRight, Wallet, QrCode } from 'lucide-react';
import { eventMetrics } from '../utils/eventMetrics';

const DashboardOrganizer: React.FC = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isSuspendido, setIsSuspendido] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // MÉTRICAS CALCULADAS CON LA NUEVA UTILIDAD SENIOR
  const recaudoTotal = eventMetrics.calcularRecaudoTotal(eventos);
  const ticketsVendidos = eventMetrics.calcularTicketsTotales(eventos);
  const eventosActivos = eventos.filter(ev => ev.estado === 'PUBLICADO').length;

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const data = await eventService.obtenerMisEventos();
      setEventos(data);
    } catch (error: any) {
      if (error.message?.includes("SUSPENDIDO")) setIsSuspendido(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const QuickAction = ({ icon: Icon, title, desc, path, color }: any) => (
    <button 
      onClick={() => navigate(path)}
      className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all text-left group"
    >
      <div className={`${color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <h3 className="font-black text-gray-900 mb-2">{title}</h3>
      <p className="text-xs text-gray-400 font-medium leading-relaxed">{desc}</p>
      <div className="mt-4 flex items-center gap-1 text-[#2748E8] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        Ir ahora <ArrowRight size={12} />
      </div>
    </button>
  );

  return (
    <OrganizerLayout isSuspendido={isSuspendido}>
      <div className="mb-10">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Panel de Control</h2>
        <p className="text-gray-500 mt-2 font-medium">Resumen general del rendimiento de tus eventos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={80} />
          </div>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Recaudo Total</h3>
          <p className="text-4xl font-black text-gray-900">${recaudoTotal.toLocaleString()} <span className="text-sm font-medium text-gray-300">USD</span></p>
          <div className="mt-4 h-1 w-12 bg-green-500 rounded-full"></div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={80} />
          </div>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Tickets Vendidos</h3>
          <p className="text-4xl font-black text-gray-900">{ticketsVendidos.toLocaleString()} <span className="text-sm font-medium text-gray-300">Tickets</span></p>
          <div className="mt-4 h-1 w-12 bg-blue-500 rounded-full"></div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Calendar size={80} />
          </div>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Eventos Activos</h3>
          <p className="text-4xl font-black text-gray-900">{eventosActivos} <span className="text-sm font-medium text-gray-300">Eventos</span></p>
          <div className="mt-4 h-1 w-12 bg-orange-500 rounded-full"></div>
        </div>
      </div>

      <h3 className="text-xl font-black text-gray-800 mb-6">Accesos Rápidos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickAction 
          icon={Calendar} 
          title="Gestión de Eventos" 
          desc="Crea, edita y publica tus próximos eventos."
          path="/organizer-events"
          color="bg-blue-50 text-blue-600"
        />
        <QuickAction 
          icon={Wallet} 
          title="Finanzas" 
          desc="Revisa tus recaudos y estados de pago."
          path="/organizer-finances"
          color="bg-green-50 text-green-600"
        />
        <QuickAction 
          icon={QrCode} 
          title="Validar Tickets" 
          desc="Escanea y controla el acceso en la puerta."
          path="/organizer-validator"
          color="bg-orange-50 text-orange-600"
        />
        <QuickAction 
          icon={TrendingUp} 
          title="Analíticas" 
          desc="Próximamente: Estadísticas avanzadas."
          path="#"
          color="bg-purple-50 text-purple-600"
        />
      </div>
    </OrganizerLayout>
  );
};

export default DashboardOrganizer;