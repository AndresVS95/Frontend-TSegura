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
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">
              ✓
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">¡Pago Exitoso!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Tu entrada ha sido asegurada. El **NFT coleccionable** ya está en tu billetera digital.
            </p>
            <div className="bg-blue-50 p-4 rounded-2xl mb-8 text-left border border-blue-100">
              <p className="text-[10px] font-black text-[#1E5ADF] uppercase mb-1">ID de Reserva</p>
              <p className="font-mono text-sm text-blue-800 break-all">{reservaId}</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard-buyer')}
              className="w-full py-4 bg-[#1E5ADF] text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
            >
              Ir a mis entradas
            </button>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl font-light">
              ✕
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