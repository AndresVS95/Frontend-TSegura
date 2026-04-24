import { useState } from 'react';
import { 
    LayoutDashboard, 
    CalendarDays, 
    Wallet, 
    QrCode, 
    Settings, 
    LogOut, 
    Menu, 
    X, 
    Ticket 
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { tokenManager } from '../lib/tokenManager';

export default function SidebarOrganizer() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        tokenManager.clearAll();
        navigate('/login', { replace: true });
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Inicio', path: '/dashboard-organizer' },
        { icon: CalendarDays, label: 'Mis Eventos', path: '/organizer-events' }, 
        { icon: Wallet, label: 'Finanzas', path: '/organizer-finances' },
        { icon: QrCode, label: 'Validador', path: '/organizer-validator' },
        { icon: Settings, label: 'Ajustes', path: '/organizer-settings' },
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Botón Hamburguesa para Móvil */}
            <button 
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#03292e] text-white rounded-lg shadow-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay para móvil */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Principal */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-40
                w-64 bg-[#03292e] text-white flex flex-col p-6
                transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 transition-transform duration-300 ease-in-out
                border-r border-white/5
            `}>
                <div className="flex items-center gap-3 mb-10">
                    <div className="bg-[#0ed1e8] p-2 rounded-xl">
                        <Ticket size={24} className="text-[#03292e]" />
                    </div>
                    <h1 className="text-xl font-black tracking-tight">TSegura</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`
                                    w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all
                                    ${isActive 
                                        ? 'bg-[#0ed1e8] text-[#03292e] shadow-lg shadow-[#0ed1e8]/20' 
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                                `}
                            >
                                <item.icon size={20} /> 
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-3 text-red-400 p-3 rounded-xl hover:bg-red-400/10 transition mt-auto font-bold"
                >
                    <LogOut size={20} /> Cerrar Sesión
                </button>
            </aside>
        </>
    );
}