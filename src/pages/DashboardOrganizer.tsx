import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import type { DecodedToken } from './Login';

const DashboardOrganizer: React.FC = () => {
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

      if (decoded.perfil !== 'ORGANIZADOR') {
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
    sessionStorage.clear();
    navigate('/login', { replace: true });
    window.location.reload();
  };

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white px-8 py-4 shadow-sm border-b border-gray-100 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-[#1E5ADF] flex items-center gap-2">
          <span className="text-3xl">🎫</span> TSegura (Organizer)
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
        <section className="bg-[#1E5ADF] rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden mb-12 shadow-2xl shadow-blue-200">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Bienvenido, Organizador
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Aquí podrás gestionar tus eventos y consultar tus estadísticas.
            </p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all">
              Crear Nuevo Evento
            </button>
          </div>
        </section>

        <h3 className="text-2xl font-black text-[#03292e] mb-8 px-2">Mis Eventos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#1E5ADF] hover:text-[#1E5ADF] transition-all cursor-pointer group">
              <span className="text-4xl mb-2">+</span>
              <span className="font-bold">Agregar Evento</span>
           </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardOrganizer;