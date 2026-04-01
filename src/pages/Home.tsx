import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import type { DecodedToken } from './Login';
// import SidebarBuyer from '../components/SidebarBuyer'; // Si tienes uno específico

const DashboardBuyer: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      // IMPORTANTE: Aquí filtramos por el rol de Comprador
      // Verifica si en tu base de datos es 'COMPRADOR', 'CLIENTE' o 'USER'
      if (decoded.perfil !== 'COMPRADOR') {
        navigate('/login', { replace: true });
        return;
      }

      setNombre(decoded.nombre_completo);
      setIsAuthorized(true);

    } catch (error) {
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  if (!isAuthorized) return null;

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

        {/* Grid de Eventos (Placeholder Estético) */}
        <h3 className="text-2xl font-black text-[#03292e] mb-8 px-2">Eventos Destacados</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-[#1E5ADF]">
                  Próximamente
                </div>
              </div>
              <div className="p-6">
                <p className="text-[#1E5ADF] font-bold text-xs uppercase tracking-widest mb-2">Concierto</p>
                <h4 className="text-xl font-bold text-[#03292e] mb-2 group-hover:text-[#1E5ADF] transition-colors">
                  Nombre del Evento {item}
                </h4>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <span>📍 Popayán, Cauca</span>
                  <span>•</span>
                  <span>📅 25 Abr</span>
                </div>
                <button className="w-full py-3 bg-gray-50 text-[#03292e] font-bold rounded-2xl group-hover:bg-[#1E5ADF] group-hover:text-white transition-all">
                  Ver Entradas
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardBuyer;