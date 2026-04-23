// src/pages/EventoDetalle.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';

const EventoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (id) {
          const data = await eventService.obtenerEventoPorId(id);
          setEvento(data);
        }
      } catch (error) {
        console.error("Error al cargar detalle:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando detalles...</div>;
  if (!evento) return <div className="text-center py-20">Evento no encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Botón Volver */}
      <div className="max-w-6xl mx-auto p-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-[#1E5ADF] font-semibold transition-colors"
        >
          ← Volver al catálogo
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* COLUMNA IZQUIERDA: Imagen e Información Principal */}
        <div className="lg:col-span-2 space-y-8">
          <img 
            src={evento.urlImagen || 'https://via.placeholder.com/800x400'} 
            alt={evento.nombre}
            className="w-full h-[400px] object-cover rounded-[2.5rem] shadow-2xl"
          />
          
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h1 className="text-4xl font-black text-gray-900 mb-4">{evento.nombre}</h1>
            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              {evento.descripcion || 'Sin descripción disponible para este evento.'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Fecha y Hora</span>
                <p className="text-lg font-bold text-gray-800">{evento.fechaEvento} - {evento.horaEvento}</p>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Lugar</span>
                <p className="text-lg font-bold text-gray-800">{evento.nombreRecinto || 'Recinto Principal'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Selección de Boletas (Zonas) */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 sticky top-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Selecciona tu zona</h2>
            
            <div className="space-y-4">
              {evento.zonas?.map((zona: any) => (
                <div 
                  key={zona.zonaId}
                  className="group p-5 rounded-2xl border-2 border-gray-100 hover:border-[#1E5ADF] transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-800">{zona.nombreZona}</span>
                    <span className="text-[#1E5ADF] font-black text-xl">${zona.precio}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Cupos: {zona.cuposDisponibles}</span>
                    <button className="bg-gray-900 text-white text-xs px-4 py-2 rounded-lg group-hover:bg-[#1E5ADF] transition-colors">
                      Seleccionar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                    * Edad mínima requerida: {evento.edadMinima} años
                </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default EventoDetalle;