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
        <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
          <span className="text-white font-black text-xl">≡</span>
        </div>
        <span className="text-2xl font-black text-[#0F172A] tracking-tighter">TSegura<span>.</span></span>
      </div>

      {/* Links Centrales */}
      <div className="hidden md:flex items-center gap-10">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-[#1E5ADF] font-bold text-sm transition-all">Eventos</button>
        <button onClick={() => navigate('/my-tickets')} className="text-gray-400 hover:text-[#1E5ADF] font-bold text-sm transition-all">Mis Tickets</button>
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
            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-black text-xs cursor-pointer shadow-lg shadow-pink-100 transition-transform active:scale-95">
              {getInitials(nombre)}
            </div>
            {/* Mini dropdown de logout */}
            <div className="absolute right-0 top-12 hidden group-hover:block pt-2">
              <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-2 min-w-[150px]">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-500 font-bold text-xs hover:bg-red-50 rounded-xl transition-all"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')} 
            className="bg-[#1E5ADF] text-white px-6 py-2.5 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
