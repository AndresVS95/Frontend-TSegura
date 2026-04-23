import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import type { Evento } from '../types/event.types';
import { ManualSaleModal } from '../components/ManualSaleModal';
import toast from 'react-hot-toast';

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEvento();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Cargando detalles...</div>;
  if (!evento) return <div className="p-10 text-center font-bold text-red-500">Evento no encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white px-8 py-4 shadow-sm border-b border-gray-100 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-[#1E5ADF] cursor-pointer" onClick={() => navigate('/dashboard-organizer')}>
          🎫 TSegura (Organizer)
        </h1>
        <button onClick={() => navigate('/dashboard-organizer')} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
          ← Volver al Panel
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className={`px-3 py-1 text-xs font-bold rounded-full mb-3 inline-block ${
               evento.estado === 'PUBLICADO' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
            }`}>
              {evento.estado}
            </span>
            <h2 className="text-4xl font-black text-[#03292e]">{evento.nombre}</h2>
            <p className="text-gray-500 mt-2 font-medium">{evento.fechaEvento} - {evento.horaEvento}</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#1E5ADF] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-colors flex items-center gap-2"
             >
                <span>➕</span> Registrar Venta Manual
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Entradas Vendidas</h3>
             <p className="text-3xl font-black text-gray-800">{evento.entradasVendidas ?? 0} <span className="text-lg font-medium text-gray-400">/ {evento.capacidadTotal ?? 0}</span></p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Recaudo Bruto / Act</h3>
             <p className="text-3xl font-black text-green-600">${evento.recaudo?.toLocaleString() ?? 0} <span className="text-lg font-medium text-gray-400">USD</span></p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Zonas Configuradas</h3>
             <p className="text-3xl font-black text-blue-600">{evento.zonas?.length ?? 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Estado de las Zonas</h3>
             </div>
             <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                   <tr>
                      <th className="px-6 py-4">Zona</th>
                      <th className="px-6 py-4">Precio</th>
                      <th className="px-6 py-4">Ocupación</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {evento.zonas?.map((zona, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                         <td className="px-6 py-4 font-bold text-gray-800">{zona.nombre_zona}</td>
                         <td className="px-6 py-4 font-medium">${zona.precio}</td>
                         <td className="px-6 py-4 font-medium text-gray-600">
                            -- / {zona.capacidad} 
                         </td>
                      </tr>
                   ))}
                   {!evento.zonas || evento.zonas.length === 0 && (
                       <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">No hay zonas configuradas</td></tr>
                   )}
                </tbody>
             </table>
        </div>

      </main>

      <ManualSaleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        evento={evento} 
        onSaleSuccess={cargarEvento} 
      />
    </div>
  );
};

export default DetalleEventoOrg;
