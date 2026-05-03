// src/components/ResultadoPago.tsx
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const ResultadoPago: React.FC = () => {
  const { estado } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { pedido?: any; resultadoVenta?: any } | null;
  const esExito = estado === 'exito';

  const pedido = state?.pedido;
  const resultado = state?.resultadoVenta;

  const eventoNombre = pedido?.eventoNombre ?? 'Tu evento';
  const zonaNombre = pedido?.zonaNombre ?? '';
  const cantidad = pedido?.cantidad ?? 1;
  const txHash = resultado?.txHash ?? resultado?.mintTxHash ?? null;
  const tokenIds: string[] = resultado?.tokenIds ?? resultado?.boletos?.map((b: any) => b.boletoId) ?? [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-xl mx-auto px-6 py-20 flex flex-col items-center">
        {esExito ? (
          <div className="w-full text-center animate-fade-in">
            {/* Ícono de Éxito Premium */}
            <div className="relative w-32 h-32 mx-auto mb-10">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-32 h-32 bg-green-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h1 className="premium-title text-5xl mb-4 text-center">¡Entrada <span>confirmada!</span></h1>
            <p className="text-gray-400 font-medium text-sm mb-10 text-center">
              {eventoNombre}{zonaNombre ? ` · ${cantidad}x ${zonaNombre}` : ` · ${cantidad} entrada${cantidad !== 1 ? 's' : ''}`}
            </p>

            {/* Certificado de autenticidad */}
            <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-50 mb-10 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Certificado de autenticidad</span>
                <span className="bg-green-50 px-3 py-1.5 rounded-lg text-green-600 font-black uppercase tracking-widest text-[9px]">Verificado</span>
              </div>
              {tokenIds.length > 0 && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-widest">ID de entrada{tokenIds.length > 1 ? 's' : ''}</span>
                  <span className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 font-mono text-gray-500">
                    {tokenIds.slice(0, 3).map(id => `#${id}`).join(' · ')}{tokenIds.length > 3 ? '...' : ''}
                  </span>
                </div>
              )}
              {txHash && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-widest">Hash de verificación</span>
                  <span className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 font-mono text-gray-500">
                    {txHash.slice(0, 6)}...{txHash.slice(-4)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Protección</span>
                <span className="bg-blue-50 px-3 py-1.5 rounded-lg text-[#2748E8] font-black uppercase tracking-widest text-[9px]">Entrada certificada</span>
              </div>
            </div>

            <div className="space-y-4 w-full">
              <button
                onClick={() => navigate('/my-tickets')}
                className="w-full py-5 bg-[#2748E8] text-white rounded-full font-black text-sm shadow-xl shadow-blue-100 flex items-center justify-center gap-2 transition-all hover:bg-blue-700 active:scale-[0.98]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                Ver mi entrada
              </button>
              {txHash && (
                <a
                  href={`https://amoy.polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-white text-gray-400 rounded-full font-bold text-xs border border-gray-100 shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Ver certificado de autenticidad
                </a>
              )}
            </div>

            <div className="mt-8 text-center px-4">
              <p className="text-[10px] text-gray-300 font-medium leading-relaxed">
                Tu entrada está protegida y no puede falsificarse.<br />
                Preséntala en el evento con el código QR.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full text-center animate-fade-in">
            <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-10 border-4 border-white shadow-xl">
              <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h1 className="text-4xl font-black text-[#0D0D0D] mb-4">Algo salió mal</h1>
            <p className="text-gray-400 font-medium text-lg mb-12">
              No pudimos procesar tu pago. Por favor, verifica los fondos de tu tarjeta e intenta de nuevo.
            </p>

            <button
              onClick={() => navigate(-1)}
              className="w-full py-5 bg-[#0D0D0D] text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-gray-200 transition-all active:scale-[0.98]"
            >
              Reintentar pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultadoPago;