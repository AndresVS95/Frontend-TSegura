import React from 'react';
import OrganizerLayout from '../components/OrganizerLayout';
import { Bell, Lock } from 'lucide-react';

const OrganizerSettings: React.FC = () => {
    return (
        <OrganizerLayout>
            <div className="mb-10">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Ajustes del Panel</h2>
                <p className="text-gray-500 mt-2 font-medium">Configura tu perfil, notificaciones y seguridad.</p>
            </div>

            <div className="max-w-4xl space-y-6">
                {/* Perfil */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-3xl font-black text-[#2748E8]">
                            O
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900">Perfil de Organización</h3>
                            <p className="text-sm text-gray-500 font-medium">Gestiona tu identidad de marca.</p>
                        </div>
                    </div>
                    <button className="text-sm font-bold text-[#2748E8] bg-blue-50 px-6 py-2 rounded-xl hover:bg-blue-100 transition-colors">Editar</button>
                </div>

                {/* Secciones de Configuración */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group">
                        <div className="bg-gray-50 w-12 h-12 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all mb-6">
                            <Lock size={24} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Seguridad</h4>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">Cambio de contraseña y autenticación de dos factores.</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group">
                        <div className="bg-gray-50 w-12 h-12 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all mb-6">
                            <Bell size={24} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Notificaciones</h4>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">Configura qué avisos de ventas quieres recibir por email.</p>
                    </div>
                </div>
            </div>
        </OrganizerLayout>
    );
};

export default OrganizerSettings;
