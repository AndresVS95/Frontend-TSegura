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
  const [nombre, setNombre] = useState('');
  const [eventos, setEventos] = useState<any[]>([]);
  const [isLoadingEventos, setIsLoadingEventos] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    // ✅ Usa tokenManager en lugar de localStorage directo
    const user = tokenManager.getUser();
    if (!user || user.perfil !== 'COMPRADOR') {
      navigate('/login', { replace: true });
      return;
    }
    setNombre(user.nombre_completo);

    // Cargar eventos publicados
    setIsLoadingEventos(true);
    eventService
      .obtenerEventosPublicados()
      .then((data) => setEventos(data))
      .catch((error) => {
        console.error('Error al cargar eventos:', error);
        setEventos([]);
      })
      .finally(() => setIsLoadingEventos(false));
  }, [navigate]);

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
    // ✅ Usa tokenManager en lugar de localStorage directo
    tokenManager.clearAll();
    navigate('/login', { replace: true });
  };

  const handleBuscar = () => {
    // Navega al catálogo público con el término de búsqueda
    if (busqueda.trim()) {
      navigate(`/?q=${encodeURIComponent(busqueda)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Navbar ── */}
      <nav className="bg-white py-4 px-8 flex justify-between items-center border-b border-gray-100">
        <div className="text-[#1E5ADF] font-black text-2xl flex items-center">
          <span className="mr-1">💳</span> TSegura.
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          {/* ✅ Acceso directo a mis boletos */}
          <button
            onClick={() => navigate('/my-tickets')}
            className="text-gray-600 hover:text-[#1E5ADF] font-bold transition-colors"
          >
            🎟️ Mis Entradas
          </button>
          <span className="text-gray-500">
            Hola, <span className="font-bold text-black">{nombre}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-red-500 font-bold hover:underline"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto mt-10">
        {/* ── Hero ── */}
        <div className="bg-[#1E5ADF] rounded-[3rem] p-16 text-white text-center shadow-2xl relative overflow-hidden">
          <h1 className="text-5xl font-black mb-6 leading-tight">
            Encuentra tu próximo<br />evento inolvidable
          </h1>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Explora conciertos, conferencias y festivales con la seguridad que solo TSegura te ofrece.
          </p>

          <div className="bg-white rounded-full p-2 flex items-center max-w-xl mx-auto shadow-lg">
            <input
              type="text"
              placeholder="Buscar eventos, artistas o lugares..."
              className="flex-grow px-6 py-2 text-gray-700 outline-none rounded-full"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
            />
            <button
              onClick={handleBuscar}
              className="bg-[#1E5ADF] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* ── Categorías ── */}
      <div className="flex justify-center gap-3 my-12">
        {['Todos', 'Conciertos', 'Teatro', 'Deportes', 'Festivales'].map((cat, i) => (
          <button
            key={i}
            className={`px-6 py-2 rounded-full border ${
              i === 0
                ? 'bg-white border-gray-300 shadow-sm'
                : 'border-gray-200 text-gray-400'
            } font-bold text-sm hover:border-blue-500 hover:text-blue-500 transition-all`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Grid de eventos ── */}
      <div className="max-w-7xl mx-auto px-8 pb-20">
        <h2 className="text-2xl font-black mb-8 text-gray-900">Eventos Destacados</h2>

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