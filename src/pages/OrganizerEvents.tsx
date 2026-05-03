import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import type { Evento } from '../types/event.types';
import toast from 'react-hot-toast';
import OrganizerLayout from '../components/OrganizerLayout';
import { Plus, Search, Filter } from 'lucide-react';
import { eventMetrics } from '../utils/eventMetrics';

const OrganizerEvents: React.FC = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const data = await eventService.obtenerMisEventos();
      setEventos(data);
    } catch (error: any) {
      toast.error("Error al cargar eventos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handlePublicar = async (evento: Evento) => {
    const idReal = evento.eventoId || (evento as any).id;
    if (!idReal) return;
    try {
      await eventService.publicarEvento(idReal, evento);
      toast.success("¡Evento publicado!");
      await cargarDatos(); 
    } catch (error: any) {
      toast.error("Error al publicar.");
    }
  };

  const eventosFiltrados = eventos.filter(ev => 
    ev.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <OrganizerLayout>
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Mis Eventos</h2>
          <p className="text-gray-500 mt-2 font-medium">Gestiona el ciclo de vida y las ventas de tus eventos.</p>
        </div>
        <button 
          onClick={() => navigate('/crearevento')}
          className="bg-[#2748E8] text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2"
        >
          <Plus size={20} /> Crear Nuevo Evento
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar evento por nombre..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2748E8] outline-none"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
               <Filter size={16} /> Todos
             </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-50">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Evento</th>
                <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ocupación / Ventas</th>
                <th className="px-8 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-bold animate-pulse">Sincronizando eventos...</td></tr>
              ) : eventosFiltrados.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-500 italic">No se encontraron eventos.</td></tr>
              ) : (
                eventosFiltrados.map((evento) => {
                  const idReal = evento.eventoId || (evento as any).id;
                  const esPublicado = String(evento.estado).toUpperCase() === 'PUBLICADO';
                  const esBorrador = String(evento.estado).toUpperCase() === 'BORRADOR';

                  // MÉTRICAS CALCULADAS USANDO LA UTILIDAD
                  const vendidos = eventMetrics.calcularTicketsVendidosEvento(evento);
                  const recaudo = eventMetrics.calcularRecaudoEvento(evento);

                  return (
                    <tr key={idReal} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="text-sm font-black text-gray-800">{evento.nombre}</div>
                        <div className="text-xs text-gray-400 font-medium">{evento.fechaEvento} • {evento.horaEvento}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 text-[10px] font-black rounded-lg ${
                          esPublicado ? 'bg-green-100 text-green-700' : 
                          esBorrador ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {String(evento.estado || 'SIN ESTADO').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-gray-700">{vendidos} / {evento.capacidadTotal ?? 0} tickets</div>
                        <div className="text-[10px] text-green-600 font-black uppercase tracking-tighter">${recaudo.toLocaleString()} Recaudados</div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 items-center">
                          {esBorrador && (
                            <button 
                              onClick={() => handlePublicar(evento)} 
                              className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition-all"
                            >
                              Publicar
                            </button>
                          )}
                          <button 
                            onClick={() => navigate(`/detalles/${idReal}`)} 
                            className="text-[#2748E8] font-black text-xs hover:underline uppercase tracking-widest"
                          >
                            Detalles
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </OrganizerLayout>
  );
};

export default OrganizerEvents;
