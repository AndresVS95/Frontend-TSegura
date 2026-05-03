import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenManager } from '../lib/tokenManager';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [estaLogueado, setEstaLogueado] = useState(false);

  useEffect(() => {
    const user = tokenManager.getUser();
    if (user) {
      setEstaLogueado(true);
      setNombre(user.nombre_completo);
    }
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLogout = () => {
    tokenManager.clearAll();
    setEstaLogueado(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 py-4 px-12 flex justify-between items-center border-b border-gray-50">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-8 h-8 bg-[#2748E8] rounded-lg flex items-center justify-center">
          <span className="text-[#F5C518] font-black text-xl">≡</span>
        </div>
        <span className="text-2xl font-black text-[#0D0D0D] tracking-tighter">TSegura<span className="text-[#2748E8]">.</span></span>
      </div>

      {/* Links Centrales */}
      <div className="hidden md:flex items-center gap-10">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-[#2748E8] font-bold text-sm transition-all">Eventos</button>
        <button onClick={() => navigate('/my-tickets')} className="text-gray-400 hover:text-[#2748E8] font-bold text-sm transition-all">Mis Tickets</button>
        <button className="text-gray-400 hover:text-gray-600 font-bold text-sm transition-all">Reventa</button>
        <button className="text-gray-400 hover:text-gray-600 font-bold text-sm transition-all">Ayuda</button>
      </div>

      {/* Usuario / Acciones */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-white"></span>
        </button>

        {estaLogueado ? (
          <div className="group relative">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-black text-xs cursor-pointer shadow-lg shadow-pink-100 transition-all hover:scale-105 active:scale-95 ring-2 ring-white ring-offset-2 ring-offset-gray-50">
              {getInitials(nombre)}
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-[60]">
              <div className="bg-white border border-gray-100 shadow-2xl rounded-[1.5rem] p-3 min-w-[220px] overflow-hidden">

                {/* User Header */}
                <div className="px-4 py-3 mb-2 border-b border-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Usuario</p>
                  <p className="text-sm font-black text-gray-900 truncate">{nombre}</p>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => navigate('/perfil')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 font-bold text-xs hover:bg-blue-50 hover:text-[#2748E8] rounded-xl transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Editar Perfil
                  </button>

                  <button
                    onClick={() => navigate('/my-tickets')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 font-bold text-xs hover:bg-blue-50 hover:text-[#2748E8] rounded-xl transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                    Mis Boletos
                  </button>

                  <button
                    onClick={() => navigate('/configuracion')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 font-bold text-xs hover:bg-blue-50 hover:text-[#2748E8] rounded-xl transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                    Configuración
                  </button>

                  <div className="pt-2 mt-2 border-t border-gray-50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 font-bold text-xs hover:bg-red-50 rounded-xl transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-[#2748E8] text-white px-6 py-2.5 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
