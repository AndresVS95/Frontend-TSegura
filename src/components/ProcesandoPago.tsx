// src/components/ProcesandoPago.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const MENSAJES_MOCK = [
  'Validando transacción con Stripe...',
  '¡Pago recibido! Procesando tu orden...',
  'Emitiendo tu ticket NFT en la Blockchain...',
  '¡Todo listo! Asegurando tu entrada...',
];

const ProcesandoPago: React.FC = () => {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState(MENSAJES_MOCK[0]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    MENSAJES_MOCK.forEach((msg, i) => {
      timers.push(setTimeout(() => setMensaje(msg), i * 1500));
    });

    timers.push(
      setTimeout(() => {
        navigate(`/pago/resultado/exito/${reservaId || 'exito'}`);
      }, MENSAJES_MOCK.length * 1500 + 500)
    );

    return () => timers.forEach(clearTimeout);
  }, [reservaId, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-xl mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
        {/* Loader Premium */}
        <div className="relative w-32 h-32 mb-12">
          <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-4 border-gray-50 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#1E5ADF] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <img src="https://cryptologos.cc/logos/polygon-matic-logo.png" className="w-8 h-8 opacity-40" alt="Polygon" />
          </div>
        </div>

        <h2 className="premium-title text-4xl mb-6">Procesando <span>tu ticket...</span></h2>
        
        <div className="h-10"> {/* Espacio reservado para el mensaje dinámico */}
          <p className="text-gray-400 font-medium text-lg animate-fade-in key={mensaje}">
            {mensaje}
          </p>
        </div>

        <div className="mt-16 space-y-2">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] animate-pulse">
            No cierres esta ventana
          </p>
          <p className="text-[9px] font-bold text-gray-200">
            Seguridad respaldada por Stripe & Polygon Network
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcesandoPago;