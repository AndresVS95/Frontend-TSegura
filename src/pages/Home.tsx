import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenManager } from '../lib/tokenManager';
import { eventService } from '../services/eventService';
import type { Evento } from '../types/event.types';

/**
 * Dashboard del Comprador.
 */
const DashboardBuyer: React.FC = () => {
  const navigate = useNavigate();
  const user = tokenManager.getUser();
  const nombre = user?.nombre_completo ?? 'Usuario';

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const data = await eventService.obtenerEventosPublicados();
        setEventos(data);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarEventos();
  }, []);

  const handleLogout = () => {
    tokenManager.clearAll();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar Superior para Compradores */}
      <nav className="bg-white px-8 py-4 shadow-sm border-b border-gray-100 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-[#1E5ADF] flex items-center gap-2">
          <span className="text-3xl">🎫</span> TSegura.
        </h1>

        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-gray-600 hidden md:block">
            Hola, <span className="text-gray-900 font-bold">{nombre}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {/* Banner de Bienvenida */}
        <section className="bg-[#1E5ADF] rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden mb-12 shadow-2xl shadow-blue-200">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Encuentra tu próximo evento inolvidable
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Explora conciertos, conferencias y festivales con la seguridad que solo TSegura te ofrece.
            </p>

            {/* Buscador Rápido */}
            <div className="bg-white p-2 rounded-2xl flex items-center shadow-lg">
              <input
                type="text"
                placeholder="Buscar eventos, artistas o lugares..."
                className="flex-1 px-4 py-2 text-gray-800 outline-none"
              />
              <button className="bg-[#1E5ADF] px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all">
                Buscar
              </button>
            </div>
          </div>

          {/* Elemento decorativo */}
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
        </section>

        {/* Categorías Rápidas */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {['Todos', 'Conciertos', 'Teatro', 'Deportes', 'Festivales'].map((cat) => (
            <button key={cat} className="px-6 py-2.5 bg-white rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:border-[#1E5ADF] hover:text-[#1E5ADF] transition-all whitespace-nowrap shadow-sm">
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de Eventos */}
        <h3 className="text-2xl font-black text-[#03292e] mb-8 px-2">Eventos Destacados</h3>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => <div key={n} className="h-72 bg-gray-200 animate-pulse rounded-[2.5rem]" />)}
          </div>
        ) : eventos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
            <span className="text-5xl mb-4 block">📭</span>
            <h4 className="text-xl font-bold text-gray-800 mb-2">No hay eventos publicados aún</h4>
            <p className="text-gray-500">Vuelve más tarde para descubrir nuevas experiencias.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventos.map((evento, index) => {
              const idReal = evento.eventoId || (evento as any).id;
              return (
                <div 
                  key={idReal ?? index} 
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer flex flex-col"
                  onClick={() => navigate(`/detalles/${idReal}`)}
                >
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {evento.urlImagen && evento.urlImagen !== "https://ejemplo.com/imagen.jpg" ? (
                      <img src={evento.urlImagen} alt={evento.nombre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-[#1E5ADF]/20 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                         <span className="text-5xl drop-shadow-md">🎫</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-[#1E5ADF]">
                      Próximamente
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-[#1E5ADF] font-bold text-xs uppercase tracking-widest mb-2">
                      {evento.tipoEventoId === 1 ? 'Concierto' : 'Evento'}
                    </p>
                    <h4 className="text-xl font-bold text-[#03292e] mb-2 group-hover:text-[#1E5ADF] transition-colors truncate">
                      {evento.nombre}
                    </h4>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                      <span>📍 {(evento as any).nombreRecinto || 'Popayán, Cauca'}</span>
                      <span>•</span>
                      <span>📅 {evento.fechaEvento}</span>
                    </div>
                    <div className="mt-auto pt-4">
                      <button className="w-full py-3 bg-gray-50 text-[#03292e] font-bold rounded-2xl group-hover:bg-[#1E5ADF] group-hover:text-white transition-all">
                        Ver Entradas
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardBuyer;