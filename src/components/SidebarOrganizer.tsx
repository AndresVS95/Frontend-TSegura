import { LayoutDashboard, CalendarDays, Ticket, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SidebarOrganizer() {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <div className="w-64 bg-[#03292e] min-h-screen text-white flex flex-col p-6">
            <div className="flex items-center gap-3 mb-10">
                <div className="bg-[#0ed1e8] p-2 rounded-xl">
                    <Ticket size={24} className="text-[#03292e]" />
                </div>
                <h1 className="text-xl font-black">TSegura</h1>
            </div>

            <nav className="flex-1 space-y-4">
                <button className="w-full flex items-center gap-3 bg-white/10 p-3 rounded-xl font-bold">
                    <LayoutDashboard size={20} /> Inicio
                </button>
                <button className="w-full flex items-center gap-3 text-gray-400 p-3 rounded-xl hover:bg-white/5 transition">
                    <CalendarDays size={20} /> Eventos
                </button>
                <button className="w-full flex items-center gap-3 text-gray-400 p-3 rounded-xl hover:bg-white/5 transition">
                    <Settings size={20} /> Ajustes
                </button>
            </nav>

            <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 p-3 rounded-xl hover:bg-red-400/10 transition mt-auto">
                <LogOut size={20} /> Cerrar Sesión
            </button>
        </div>
    );
}