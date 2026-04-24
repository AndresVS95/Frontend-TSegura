import React from 'react';

interface ModalQRProps {
  isOpen: boolean;
  onClose: () => void;
  boleto: { id: string; evento: string; zona: string } | null;
}

const ModalQR: React.FC<ModalQRProps> = ({ isOpen, onClose, boleto }) => {
  if (!isOpen || !boleto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] max-w-sm w-full p-8 text-center relative shadow-2xl">
        {/* Botón de cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full text-gray-600 font-bold hover:bg-gray-200"
        >
          ✕
        </button>

        <h3 className="text-2xl font-black text-gray-900 leading-tight mb-1">{boleto.evento}</h3>
        <p className="text-[#1E5ADF] font-bold text-sm mb-8">Zona {boleto.zona}</p>

        {/* Contenedor del QR con alto contraste para escáneres */}
        <div className="bg-white border-4 border-gray-100 p-4 rounded-3xl mx-auto w-64 h-64 mb-6 shadow-inner flex items-center justify-center">
          {/* MOCK: Cuando JG tenga el endpoint /tickets/{id}/qr, cambiarás este src por la imagen real */}
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${boleto.id}`} 
            alt="Código QR de Acceso" 
            className="w-full h-full"
          />
        </div>

        <p className="font-mono text-gray-400 text-xs mb-6 tracking-widest">{boleto.id}</p>
        
        <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-xl border border-blue-100">
          Muestra este código al personal de la entrada. <strong>Sube el brillo de tu pantalla</strong> para facilitar la lectura.
        </p>
      </div>
    </div>
  );
};

export default ModalQR;