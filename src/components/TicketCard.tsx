// src/components/TicketCard.tsx
import React, { useState } from 'react';
import ModalQR from './ModalQR';

interface BoletoProps {
  boleto: {
    id: string;
    evento: string;
    fecha: string;
    lugar: string;
    zona: string;
    estadoNft: 'MINTED' | 'PENDING';
  };
}

const TicketCard: React.FC<BoletoProps> = ({ boleto }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-4 transition-all">
      {/* ── Fila Principal ── */}
      <div 
        onClick={() => setExpandido(!expandido)}
        className="p-5 flex flex-col md:flex-row items-center gap-6 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        {/* Miniatura Imagen */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 shadow-inner" />

        {/* Info Principal */}
        <div className="flex-grow text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
            <h3 className="text-xl font-black text-gray-900">{boleto.evento}</h3>
            <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
              boleto.estadoNft === 'MINTED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              ● {boleto.estadoNft === 'MINTED' ? 'Válido' : 'Procesando'}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center md:justify-start text-sm text-gray-400 font-bold uppercase tracking-wider">
            <span>🎟️ {boleto.zona}</span>
            <span>📅 {boleto.fecha}</span>
            <span>📍 {boleto.lugar}</span>
            <span className="text-gray-300">Token #{boleto.id}</span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setModalAbierto(true);
            }}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-3 rounded-2xl font-black text-xs transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            VER QR
          </button>
          
          <button
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1E5ADF] hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-black text-xs shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            PONER EN REVENTA
          </button>
        </div>
      </div>

      {/* ── Despliegue de Detalles ── */}
      {expandido && (
        <div className="px-5 pb-6 pt-2 border-t border-dashed border-gray-100 animate-fade-in">
          <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contrato</p>
              <p className="text-xs font-mono text-gray-600 break-all">0x9c8b...41a2</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Red</p>
              <p className="text-xs font-black text-[#1E5ADF] uppercase">Polygon Amoy</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Beneficios</p>
              <p className="text-xs text-gray-600">Acceso preferencial, Barra libre (si aplica).</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal QR */}
      <ModalQR
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        boleto={boleto}
      />
    </div>
  );
};

export default TicketCard;