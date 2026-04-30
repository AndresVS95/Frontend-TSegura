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
  // ✅ Estado para abrir/cerrar el modal del QR
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <>
      <div className="flex bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">

        {/* Sección izquierda: detalles */}
        <div className="p-6 flex-grow border-r-2 border-dashed border-gray-200 relative">
          {/* Círculos decorativos del corte de ticket */}
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-50 rounded-full border-b border-gray-200" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gray-50 rounded-full border-t border-gray-200" />

          <p className="text-[10px] font-black text-[#1E5ADF] tracking-widest uppercase mb-1">
            Zona {boleto.zona}
          </p>
          <h3 className="text-xl font-black text-gray-900 leading-tight mb-4">
            {boleto.evento}
          </h3>

          <div className="flex flex-col gap-1 text-sm text-gray-500 font-medium">
            <p>📅 {boleto.fecha}</p>
            <p>📍 {boleto.lugar}</p>
            <p>
              🎟️ ID:{' '}
              <span className="font-mono text-xs text-gray-400">{boleto.id}</span>
            </p>
          </div>

          {/* Badge NFT */}
          <div className="mt-4">
            {boleto.estadoNft === 'MINTED' ? (
              <span className="bg-green-100 text-green-700 text-[9px] font-black px-2 py-1 rounded-full uppercase">
                ✓ NFT Activo
              </span>
            ) : (
              <span className="bg-yellow-100 text-yellow-700 text-[9px] font-black px-2 py-1 rounded-full uppercase animate-pulse">
                ⏳ Procesando NFT
              </span>
            )}
          </div>
        </div>

        {/* Sección derecha: QR */}
        <div className="p-4 flex flex-col items-center justify-center w-32 bg-gray-50 text-center gap-3">
          {/* ✅ Al hacer clic en el QR se abre el modal */}
          <button
            onClick={() => setModalAbierto(true)}
            disabled={boleto.estadoNft === 'PENDING'}
            className="w-16 h-16 bg-white border border-gray-200 rounded-lg p-1 hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
            title={boleto.estadoNft === 'PENDING' ? 'QR disponible cuando el NFT sea minteado' : 'Ver QR de entrada'}
          >
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${boleto.id}`}
              alt="QR Code"
              className="w-full h-full"
            />
          </button>

          <p className="text-[9px] text-gray-400 font-medium leading-tight">
            {boleto.estadoNft === 'PENDING' ? 'Disponible pronto' : 'Toca para ampliar'}
          </p>
        </div>
      </div>

      {/* ✅ Modal del QR conectado */}
      <ModalQR
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        boleto={boleto}
      />
    </>
  );
};

export default TicketCard;