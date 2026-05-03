// src/components/ProcesandoPago.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const PASOS = [
  { label: 'Pago confirmado', msg: 'Validando transacción con Stripe...' },
  { label: 'Entrada reservada', msg: '¡Pago recibido! Reservando tu entrada...' },
  { label: 'QR generado', msg: 'Generando tu entrada segura...' },
  { label: 'Lista', msg: '¡Todo listo! Tu entrada está asegurada.' },
];

const ProcesandoPago: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { pedido?: any; resultadoVenta?: any } | null;
  const [pasoActual, setPasoActual] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    PASOS.forEach((_, i) => {
      timers.push(setTimeout(() => setPasoActual(i), i * 1500));
    });

    timers.push(
      setTimeout(() => {
        navigate('/pago/resultado/exito/confirmado', {
          state: state,
        });
      }, PASOS.length * 1500 + 500)
    );

    return () => timers.forEach(clearTimeout);
  }, [navigate, state]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-xl mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
        {/* Loader */}
        <div className="relative w-32 h-32 mb-12">
          <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-4 border-gray-50 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#2748E8] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#2748E8] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
        </div>

        <h2 className="premium-title text-4xl mb-10">Preparando <span>tu entrada...</span></h2>

        {/* Barra de progreso de 3 pasos */}
        <div className="w-full max-w-sm mb-8">
          <div className="flex items-center justify-between mb-3">
            {PASOS.slice(0, 3).map((paso, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-500 ${
                    i < pasoActual ? 'bg-green-500 border-green-500 text-white' :
                    i === pasoActual ? 'bg-[#2748E8] border-[#2748E8] text-white' :
                    'bg-white border-gray-200 text-gray-300'
                  }`}>
                    {i < pasoActual ? '✓' : i + 1}
                  </div>
                  <p className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-500 ${
                    i <= pasoActual ? 'text-[#0D0D0D]' : 'text-gray-300'
                  }`}>{paso.label}</p>
                </div>
                {i < 2 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-all duration-700 ${i < pasoActual ? 'bg-green-400' : 'bg-gray-100'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <p className="text-gray-400 font-medium text-base min-h-[1.5rem]">
          {PASOS[pasoActual]?.msg}
        </p>

        <div className="mt-16 space-y-2">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] animate-pulse">
            No cierres esta ventana
          </p>
          <p className="text-[9px] font-bold text-gray-200">
            Pago cifrado · Entrada protegida
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcesandoPago;