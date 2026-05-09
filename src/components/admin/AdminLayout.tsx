import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { tokenManager } from '../../lib/tokenManager';

interface Props { children: React.ReactNode; }

const NAV_ITEMS = [
  { to: '/admin/dashboard',     icon: '📊', label: 'Dashboard'     },
  { to: '/admin/solicitudes',   icon: '📋', label: 'Solicitudes'   },
  { to: '/admin/usuarios',      icon: '👥', label: 'Usuarios'      },
  { to: '/admin/crear-usuario', icon: '➕', label: 'Crear Usuario' },
];

const AdminLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const user = tokenManager.getUser();

  const handleLogout = () => {
    tokenManager.clearAll();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full z-10">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1E5ADF] rounded-lg flex items-center justify-center text-white font-black text-sm">
              T
            </div>
            <div>
              <p className="text-white font-black text-sm">TSegura</p>
              <p className="text-gray-500 text-xs">Panel Admin</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#1E5ADF] text-white shadow-lg shadow-blue-900/40'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Usuario + logout */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-black text-xs">
              {user?.nombre_completo?.charAt(0)?.toUpperCase() ?? 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-bold truncate">{user?.nombre_completo ?? 'Admin'}</p>
              <p className="text-gray-500 text-[10px]">Administrador</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-900/20 py-2 rounded-lg transition-all"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Contenido principal ── */}
      <main className="flex-1 ml-64 min-h-screen bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;