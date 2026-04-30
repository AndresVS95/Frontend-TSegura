// src/components/ResultadoPago.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResultadoPago: React.FC = () => {
  const { estado, reservaId } = useParams();
  const navigate = useNavigate();
  const esExito = estado === 'exito';

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full rounded-[3rem] shadow-2xl p-12 text-center border border-gray-100">

        {esExito ? (
          <>
            {/* Ícono éxito */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl font-black text-gray-900 mb-4">¡Pago Exitoso!</h2>

            {/* ✅ Corregido: <strong> en lugar de ** markdown ** */}
            <p className="text-gray-500 mb-8 leading-relaxed">
              Tu entrada ha sido asegurada. El{' '}
              <strong className="text-gray-700">NFT coleccionable</strong>{' '}
              ya está en tu billetera digital.
            </p>

            {/* ID de reserva */}
            <div className="bg-blue-50 p-4 rounded-2xl mb-8 text-left border border-blue-100">
              <p className="text-[10px] font-black text-[#1E5ADF] uppercase tracking-widest mb-1">
                ID de Reserva
              </p>
              <p className="font-mono text-sm text-blue-800 break-all">{reservaId}</p>
            </div>

            <button
              onClick={() => navigate('/my-tickets')}
              className="w-full py-4 bg-[#1E5ADF] text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
            >
              Ver mis entradas
            </button>
          </>
        ) : (
          <>
            {/* Ícono error */}
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h2 className="text-3xl font-black text-gray-900 mb-4">Algo salió mal</h2>
            <p className="text-gray-500 mb-10 leading-relaxed">
              No pudimos procesar tu pago. Por favor, verifica los datos de tu tarjeta e intenta de nuevo.
            </p>

            <button
              onClick={() => navigate(`/pago/${reservaId}`)}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all mb-4"
            >
              Reintentar pago
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 font-bold hover:text-gray-600 transition-all text-sm"
            >
              Cancelar y volver al inicio
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultadoPago;