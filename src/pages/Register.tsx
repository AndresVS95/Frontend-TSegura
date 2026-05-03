// src/pages/Register.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RegisterBuyer } from '../components/RegisterBuyer';
import { RegisterOrganizer } from '../components/RegisterOrganizer';
import { User, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';

type Role = 'comprador' | 'organizador' | null;

export const Register: React.FC = () => {
  const [role, setRole] = useState<Role>(null);
  const [confirmedRole, setConfirmedRole] = useState<Role>(null);

  const handleContinue = () => {
    if (role) setConfirmedRole(role);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* ─── PANEL IZQUIERDO (Común) ─── */}
      <div className="hidden lg:flex lg:w-[40%] bg-gradient-to-br from-[#2748E8] via-[#2748E8] to-[#1a35c7] text-white p-16 flex-col justify-between relative">
        {/* Glow decorativo */}
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-blue-400/20 blur-[120px] rounded-full" />

        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
              <CheckCircle2 className="text-white" size={18} />
            </div>
            <span className="text-2xl font-black tracking-tighter">TSegura<span className="text-white">.</span></span>
          </div>
        </div>

        <div className="relative z-10">
          <span className="text-4xl font-serif italic mb-6 block opacity-20">"</span>
          <h2 className="text-3xl font-bold leading-tight mb-8">
            Tu identidad, tus tickets, tu cuenta — todo respaldado por la blockchain de TSegura.
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold opacity-80">El equipo de TSegura</span>
            <CheckCircle2 size={16} className="text-[#F5C518] shadow-sm" />
          </div>
        </div>
      </div>

      {/* ─── PANEL DERECHO (Contenido Dinámico) ─── */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-8 md:p-16 lg:p-24 overflow-y-auto bg-[#FDFDFF]">
        <div className="w-full max-w-xl">

          {!confirmedRole ? (
            /* SELECCIÓN DE ROL */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tight">
                ¡Crea <span className="text-[#2748E8]">tu Cuenta!</span>
              </h1>
              <p className="text-gray-400 font-medium mb-12">Dinos cómo usarás TSegura.</p>

              <div className="space-y-6">
                {/* Opción Comprador */}
                <div
                  onClick={() => setRole('comprador')}
                  className={`relative group cursor-pointer p-8 rounded-3xl border-2 transition-all duration-300 flex items-center justify-between ${role === 'comprador'
                      ? 'bg-white border-[#2748E8] shadow-2xl shadow-blue-500/10'
                      : 'bg-white border-transparent shadow-sm hover:border-gray-200'
                    }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${role === 'comprador' ? 'bg-blue-50 text-[#2748E8]' : 'bg-gray-50 text-gray-400'
                      }`}>
                      <User size={28} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 uppercase tracking-wider text-sm">Comprador</h3>
                      <p className="text-gray-400 text-sm font-medium">Quiero ir a eventos.</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${role === 'comprador' ? 'border-[#2748E8] bg-[#2748E8]' : 'border-gray-200'
                    }`}>
                    {role === 'comprador' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>

                {/* Opción Organizador */}
                <div
                  onClick={() => setRole('organizador')}
                  className={`relative group cursor-pointer p-8 rounded-3xl border-2 transition-all duration-300 flex items-center justify-between ${role === 'organizador'
                      ? 'bg-white border-[#2748E8] shadow-2xl shadow-blue-500/10'
                      : 'bg-white border-transparent shadow-sm hover:border-gray-200'
                    }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${role === 'organizador' ? 'bg-blue-50 text-[#2748E8]' : 'bg-gray-50 text-gray-400'
                      }`}>
                      <Briefcase size={28} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 uppercase tracking-wider text-sm">Organizador</h3>
                      <p className="text-gray-400 text-sm font-medium">Quiero crear y vender eventos.</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${role === 'organizador' ? 'border-[#2748E8] bg-[#2748E8]' : 'border-gray-200'
                    }`}>
                    {role === 'organizador' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={!role}
                className="w-full mt-12 bg-[#2748E8] disabled:bg-blue-300 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
              >
                Continuar <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center mt-8 text-sm text-gray-400 font-medium">
                ¿Ya tienes una cuenta? <Link to="/login" className="text-[#2748E8] font-bold hover:underline">Ingresa aquí</Link>
              </p>
            </div>
          ) : confirmedRole === 'comprador' ? (
            <RegisterBuyer onBack={() => setConfirmedRole(null)} />
          ) : (
            <RegisterOrganizer onBack={() => setConfirmedRole(null)} />
          )}

        </div>
      </div>
    </div>
  );
};