import React from 'react';

interface TicketProps {
  boleto: {
    id: string;
    evento: string;
    fecha: string;
    lugar: string;
    zona: string;
    estadoNft: 'MINTED' | 'PENDING';
  };
}

const TicketCard: React.FC<TicketProps> = ({ boleto }) => {
  return (
    <div className="flex bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Sección Izquierda: Detalles del Evento */}
      <div className="p-6 flex-grow border-r-2 border-dashed border-gray-200 relative">
        {/* Círculos para simular el corte del ticket */}
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-50 rounded-full border-b border-gray-200"></div>
        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gray-50 rounded-full border-t border-gray-200"></div>
        
        <p className="text-[10px] font-black text-[#1E5ADF] tracking-widest uppercase mb-1">Entrada General</p>
        <h3 className="text-xl font-black text-gray-900 leading-tight mb-4">{boleto.evento}</h3>
        
        <div className="flex flex-col gap-1 text-sm text-gray-500 font-medium">
          <p>📅 {boleto.fecha}</p>
          <p>📍 {boleto.lugar}</p>
          <p>🎟️ Zona: <span className="font-bold text-gray-900">{boleto.zona}</span></p>
        </div>
      </div>

      {/* Sección Derecha: QR y Estado */}
      <div className="p-6 flex flex-col items-center justify-center w-32 bg-gray-50 text-center">
        <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg p-1 mb-3">
          {/* Aquí iría un QR real después, por ahora un placeholder */}
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${boleto.id}`} alt="QR Code" className="w-full h-full opacity-80" />
        </div>
        
        {boleto.estadoNft === 'MINTED' ? (
          <span className="bg-green-100 text-green-700 text-[9px] font-black px-2 py-1 rounded-full uppercase">NFT Activo</span>
        ) : (
          <span className="bg-yellow-100 text-yellow-700 text-[9px] font-black px-2 py-1 rounded-full uppercase">Procesando</span>
        )}
      </div>
    </div>
  );
};

export default TicketCard;