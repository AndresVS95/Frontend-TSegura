// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenManager } from '../lib/tokenManager';
import { eventService } from '../services/eventService';

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

        {isLoadingEventos ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-gray-100 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : eventos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2rem] border border-gray-100">
            <span className="text-4xl mb-4 block">🎭</span>
            <p className="text-gray-500 font-medium">
              No hay eventos disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {eventos.map((evento) => (
              <div
                key={evento.eventoId}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-xl transition-all duration-300"
              >
                <div className="h-56 bg-gray-100 relative overflow-hidden">
                  {evento.urlImagen && (
                    <img
                      src={evento.urlImagen}
                      alt={evento.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-[#1E5ADF]">
                    PRÓXIMAMENTE
                  </div>
                </div>

                <div className="p-8">
                  <span className="text-[#1E5ADF] text-[10px] font-black tracking-widest uppercase">
                    CONCIERTO
                  </span>
                  <h3 className="text-xl font-black text-gray-900 mt-1 mb-2">
                    {evento.nombre}
                  </h3>
                  <div className="flex items-center text-gray-400 text-xs gap-4 mb-8">
                    <span>📍 {evento.nombreRecinto || 'Recinto Principal'}</span>
                    <span>📅 {evento.fechaEvento}</span>
                  </div>

                  {/* ✅ Ruta corregida: /eventos/:id (con 's') */}
                  <button
                    onClick={() => navigate(`/eventos/${evento.eventoId}`)}
                    className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl font-black hover:bg-[#0f172a] hover:text-white transition-all border border-gray-100"
                  >
                    Ver Entradas
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardBuyer;