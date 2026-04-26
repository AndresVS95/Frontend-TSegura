// src/components/ProcesandoPago.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MENSAJES_MOCK = [
  'Validando transacción con Stripe...',
  '¡Pago recibido! Procesando tu orden...',
  'Minteando tu NFT en la Blockchain...',
  '¡Todo listo! Redirigiendo...',
];

const ProcesandoPago: React.FC = () => {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState(MENSAJES_MOCK[0]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    MENSAJES_MOCK.forEach((msg, i) => {
      timers.push(setTimeout(() => setMensaje(msg), i * 1000));
    });

    timers.push(
      setTimeout(() => {
        navigate(`/pago/resultado/exito/${reservaId || 'prueba-123'}`);
      }, MENSAJES_MOCK.length * 1000 + 500)
    );

    return () => timers.forEach(clearTimeout);
  }, [reservaId, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
      <div className="relative w-24 h-24 mb-10">
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-[#1E5ADF] border-t-transparent rounded-full animate-spin" />
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-4">Procesando tu pedido</h2>
      <p className="text-gray-500 text-lg animate-pulse max-w-sm">{mensaje}</p>
      <p className="mt-10 text-xs text-gray-300 uppercase tracking-widest font-bold">No cierres esta ventana</p>
      {reservaId && <p className="mt-4 font-mono text-xs text-gray-300">Ref: {reservaId}</p>}
    </div>
  );
};

export default ProcesandoPago;