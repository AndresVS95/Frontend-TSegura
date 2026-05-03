import { useNavigate } from 'react-router-dom';
import { tokenManager } from '../lib/tokenManager';

export const OrganizerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    tokenManager.clearAll();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="bg-white px-8 py-4 shadow-sm border-b border-gray-100 flex justify-between items-center sticky top-0 z-50">
      <h1 
        className="text-2xl font-bold text-[#2748E8] flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/dashboard-organizer')}
      >
        <span className="text-3xl">🎫</span> TSegura (Organizer)
      </h1>

      <button 
        onClick={handleLogout}
        className="text-sm font-bold text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
        Cerrar Sesión
      </button>
    </nav>
  );
};
