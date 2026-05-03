import React from 'react';
import SidebarOrganizer from './SidebarOrganizer';
import { tokenManager } from '../lib/tokenManager';
import { Bell } from 'lucide-react';

interface Props {
    children: React.ReactNode;
    isSuspendido?: boolean;
}

export default function OrganizerLayout({ children, isSuspendido = false }: Props) {
    const user = tokenManager.getUser();
    const nombre = user?.nombre_completo ?? 'Organizador';

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar con lógica responsive interna */}
            <SidebarOrganizer />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Banner de Suspensión Global */}
                {isSuspendido && (
                    <div className="bg-red-600 text-white px-8 py-3 text-center font-bold animate-pulse z-50">
                        ⚠️ Tu cuenta se encuentra SUSPENDIDA. Contacta a soporte@tsegura.com para más información.
                    </div>
                )}

                {/* Topbar Profesional */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30">
                    <div className="lg:hidden w-10"></div> {/* Espaciador para el botón hamburguesa del sidebar */}
                    
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Panel de Gestión</span>
                        <h2 className="text-sm font-black text-gray-800">Bienvenido, {nombre}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-[#2748E8] transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-[#2748E8] border border-gray-200">
                            {nombre.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Contenido Dinámico */}
                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
