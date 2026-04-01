// src/pages/Register.tsx
import React, { useState } from 'react';
import { RegisterBuyer } from '../components/RegisterBuyer'; // Ruta corregida
import { RegisterOrganizer } from '../components/RegisterOrganizer'; // Ruta corregida

type Role = 'comprador' | 'organizador' | null;

export const Register: React.FC = () => {
  const [role, setRole] = useState<Role>(null);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8F9FA]">
      {/* Mitad Izquierda: El panel azul se queda aquí porque es común a ambos */}
      <div className="hidden md:flex md:w-5/12 bg-[#1E5ADF] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* ... (Contenido del panel azul que ya tienes) ... */}
      </div>

      {/* Mitad Derecha: Contenido Dinámico */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-6 sm:p-12 lg:p-20 overflow-y-auto">
        <div className="w-full max-w-lg">

          {!role ? (
            /* PASO INICIAL: Selección de Rol */
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Crea tu Cuenta!</h2>
              <p className="text-gray-500 mb-8">Dinos cómo usarás TSegura.</p>
              <div className="space-y-4">
                <button onClick={() => setRole('comprador')} className="w-full text-left p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1E5ADF] transition-all">
                  <h3 className="text-lg font-bold uppercase">Comprador</h3>
                  <p className="text-sm text-gray-500">Quiero ir a eventos.</p>
                </button>
                <button onClick={() => setRole('organizador')} className="w-full text-left p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1E5ADF] transition-all">
                  <h3 className="text-lg font-bold uppercase">Organizador</h3>
                  <p className="text-sm text-gray-500">Quiero crear y vender eventos.</p>
                </button>
              </div>
            </div>
          ) : role === 'comprador' ? (
            <RegisterBuyer onBack={() => setRole(null)} />
          ) : (
            <RegisterOrganizer onBack={() => setRole(null)} />
          )}

        </div>
      </div>
    </div>
  );
};