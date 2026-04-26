// src/components/ModalQR.tsx
import React from 'react';
import api from '../services/api';

interface ModalQRProps {
  isOpen: boolean;
  onClose: () => void;
  boleto: {
    id: string;
    evento: string;
    zona: string;
  } | null;
}

const ModalQR: React.FC<ModalQRProps> = ({ isOpen, onClose, boleto }) => {
  if (!isOpen || !boleto) return null;

  // ✅ Cuando JG entregue GET /tickets/{ticketId}/qr, reemplaza el src por:
  // `${import.meta.env.VITE_API_URL}/api/tickets/${boleto.id}/qr`
  // Por ahora usa api.qrserver.com como mock visual
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${boleto.id}&margin=10`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose} // Cerrar al hacer clic fuera
    >
      <div
        className="bg-white rounded-[2rem] max-w-sm w-full p-8 text-center relative shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Evitar cierre al hacer clic dentro
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-gray-100 rounded-full text-gray-500 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Info del evento */}
        <h3 className="text-2xl font-black text-gray-900 leading-tight mb-1">
          {boleto.evento}
        </h3>
        <p className="text-[#1E5ADF] font-bold text-sm mb-8">Zona {boleto.zona}</p>

        {/* QR con alto contraste para escaneo */}
        <div className="bg-white border-4 border-gray-100 p-3 rounded-3xl mx-auto w-64 h-64 mb-6 shadow-inner flex items-center justify-center">
          <img
            src={qrSrc}
            alt="Código QR de Acceso"
            className="w-full h-full rounded-xl"
          />
        </div>

        {/* ID del boleto */}
        <p className="font-mono text-gray-400 text-xs mb-6 tracking-widest">
          {boleto.id}
        </p>

        {/* Instrucción */}
        <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-xl border border-blue-100">
          Muestra este código al personal de la entrada.{' '}
          <strong>Sube el brillo de tu pantalla</strong> para facilitar la lectura.
        </p>
      </div>
    </div>
  );
};

export default ModalQR;