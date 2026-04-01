import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import SidebarOrganizer from '../components/SidebarOrganizer';

// Reutilizamos la interfaz del token para saber qué datos trae
interface DecodedToken {
    nombre_completo: string;
    perfil: string;
    sub: string;
    iat: number;
    exp: number;
}

export default function DashboardOrganizer() {
    const navigate = useNavigate();
    const [saludo, setSaludo] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('Organizador');

    useEffect(() => {
        // 1. Lógica para el saludo dinámico
        const hora = new Date().getHours();
        if (hora >= 5 && hora < 12) {
            setSaludo('Buenos días');
        } else if (hora >= 12 && hora < 19) {
            setSaludo('Buenas tardes');
        } else {
            setSaludo('Buenas noches');
        }

        // 2. Leer el token REAL y sacar el nombre
        const token = sessionStorage.getItem('token');

        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                // Usamos el nombre que viene directo del backend
                setNombreUsuario(decoded.nombre_completo);
            } catch (error) {
                console.error("Error decodificando el token en el dashboard", error);
                // Si el token es inválido o expiró, lo mandamos al login
                sessionStorage.clear();
                navigate('/login');
            }
        } else {
            // Si no hay token en absoluto, lo mandamos al login por seguridad
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Nuestro componente de menú a la izquierda */}
            <SidebarOrganizer />

            {/* Contenido Principal a la derecha */}
            <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Tarjeta de Bienvenida */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 mb-8 flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 font-medium mb-1">Panel de Control</p>
                            <h2 className="text-3xl font-extrabold text-[#1E5ADF]">
                                ¡{saludo}, <span className="text-gray-900">{nombreUsuario}</span>! 👋
                            </h2>
                            <p className="text-gray-600 mt-2">
                                Bienvenido a tu panel. Aquí puedes gestionar tus eventos y ventas de tickets.
                            </p>
                        </div>
                        <div className="hidden md:block h-24 w-24 bg-blue-50 rounded-full flex items-center justify-center">
                            <span className="text-4xl">🎫</span>
                        </div>
                    </div>

                    {/* Tarjetas de estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1E5ADF]">
                            <h3 className="text-gray-500 text-sm font-bold">Tickets Vendidos Hoy</h3>
                            <p className="text-3xl font-black text-gray-900 mt-2">0</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-gray-900">
                            <h3 className="text-gray-500 text-sm font-bold">Ingresos del Mes</h3>
                            <p className="text-3xl font-black text-gray-900 mt-2">$0</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
                            <h3 className="text-gray-500 text-sm font-bold">Estado de Cuenta</h3>
                            <p className="text-xl font-bold text-green-500 mt-3">Activa y Verificada</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}