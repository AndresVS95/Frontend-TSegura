import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import type { Evento } from '../types/event.types';
import { ManualSaleModal } from '../components/ManualSaleModal';
import toast from 'react-hot-toast';
import OrganizerLayout from '../components/OrganizerLayout';
import { ArrowLeft, Plus, DollarSign, Users, MapPin, QrCode } from 'lucide-react';
import { eventMetrics } from '../utils/eventMetrics';

const DetalleEventoOrg: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cargarEvento = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await eventService.obtenerDatosEvento(id);
      setEvento(data);
    } catch (error: any) {
      toast.error('Error al cargar detalles del evento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEvento();
  }, [id]);

  if (loading) return (
    <OrganizerLayout>
      <div className="flex items-center justify-center h-64 font-bold text-gray-400 animate-pulse">
        Sincronizando datos del evento...
      </div>
    </OrganizerLayout>
  );

  if (!evento) return (
    <OrganizerLayout>
      <div className="text-center p-10 bg-red-50 rounded-3xl border border-red-100 text-red-600 font-bold">
        Error 404: El evento no existe o no tienes permisos.
      </div>
    </OrganizerLayout>
  );

  // MÉTRICAS CALCULADAS USANDO LA UTILIDAD CENTRALIZADA
  const totalVendidos = eventMetrics.calcularTicketsVendidosEvento(evento);
  const totalRecaudo = eventMetrics.calcularRecaudoEvento(evento);

  return (
    <OrganizerLayout>
      <div className="mb-10">
        <button 
          onClick={() => navigate('/organizer-events')} 
          className="group flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#1E5ADF] transition-colors uppercase tracking-widest mb-6"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Volver a Mis Eventos
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className={`px-3 py-1 text-[10px] font-black rounded-lg mb-4 inline-block ${
               evento.estado === 'PUBLICADO' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {String(evento.estado).toUpperCase()}
            </span>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">{evento.nombre}</h2>
            <div className="flex items-center gap-4 mt-3 text-gray-500 font-medium">
              <span className="flex items-center gap-1"><MapPin size={16} /> Ubicación del evento</span>
              <span>•</span>
              <span>{evento.fechaEvento} • {evento.horaEvento}</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1E5ADF] text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Plus size={20} /> Venta Manual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
           <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-[#1E5ADF] mb-6">
              <Users size={24} />
           </div>
           <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Entradas Vendidas</h3>
           <p className="text-3xl font-black text-gray-900">
             {totalVendidos} 
             <span className="text-lg font-medium text-gray-300 ml-2">/ {evento.capacidadTotal ?? 0}</span>
           </p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
           <div className="bg-green-50 w-12 h-12 rounded-2xl flex items-center justify-center text-green-600 mb-6">
              <DollarSign size={24} />
           </div>
           <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Recaudo Bruto Actual</h3>
           <p className="text-3xl font-black text-green-600">
             ${totalRecaudo.toLocaleString()} 
             <span className="text-sm font-medium text-gray-400 ml-2 uppercase">USD</span>
           </p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
           <div className="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
              <QrCode size={24} />
           </div>
           <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Tickets por Validar</h3>
           <p className="text-3xl font-black text-gray-900">--</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-black text-gray-800">Estado de Inventario (Zonas)</h3>
          <span className="text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full">{evento.zonas?.length ?? 0} Zonas</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Zona</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Precio Unitario</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Capacidad / Ocupación</th>
                <th className="px-8 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {evento.zonas?.map((zona, idx) => {
                  const vendidos = eventMetrics.obtenerVendidosPorZona(zona);
                  const porcentaje = Math.round((vendidos / zona.capacidad) * 100);
                  
                  return (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 font-black text-gray-800">{zona.nombreZona}</td>
                      <td className="px-8 py-6 font-bold text-[#1E5ADF]">${zona.precio.toLocaleString()} USD</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[100px]">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-1000" 
                              style={{ width: `${porcentaje}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-600">{vendidos} / {zona.capacidad}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {zona.cuposDisponibles === 0 ? (
                          <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded tracking-tighter">AGOTADO</span>
                        ) : (
                          <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded tracking-tighter">DISPONIBLE</span>
                        )}
                      </td>
                    </tr>
                  );
              })}
              {(!evento.zonas || evento.zonas.length === 0) && (
                <tr><td colSpan={4} className="px-8 py-10 text-center text-gray-400 italic">No hay zonas configuradas para este evento.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ManualSaleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        evento={evento} 
        onSaleSuccess={cargarEvento} 
      />
    </OrganizerLayout>
  );
};

export default DetalleEventoOrg;
