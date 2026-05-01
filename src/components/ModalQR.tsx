// src/components/ModalQR.tsx
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ticketService } from '../services/ticketService';

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
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!isOpen || !boleto) return;

    const fetchQRToken = async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await ticketService.generarQr(boleto.id);
        setQrToken(data.qrToken);
        setTimeLeft(60); // Reset timer
      } catch (err) {
        console.error('Error fetching QR token', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchQRToken();

    // Regenerate every 55 seconds (slightly before the 60s expiration to be safe)
    const intervalId = setInterval(fetchQRToken, 55000);
    
    // Timer countdown
    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(timerId);
    };
  }, [isOpen, boleto]);

  if (!isOpen || !boleto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] max-w-sm w-full p-8 text-center relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-gray-100 rounded-full text-gray-500 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <h3 className="text-2xl font-black text-gray-900 leading-tight mb-1">
          {boleto.evento}
        </h3>
        <p className="text-[#1E5ADF] font-bold text-sm mb-6">Zona {boleto.zona}</p>

        {/* Contenedor del QR dinámico */}
        <div className="bg-white border-4 border-gray-100 p-4 rounded-3xl mx-auto w-64 h-64 mb-4 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
          {loading && !qrToken ? (
            <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl" />
          ) : error ? (
            <p className="text-red-500 font-bold text-sm">Error al cargar el código.</p>
          ) : qrToken ? (
            <>
              <div className="absolute inset-0 border-t-2 border-[#1E5ADF]/30 animate-[scan_2s_ease-in-out_infinite] pointer-events-none" />
              <QRCodeSVG value={qrToken} size={200} level="H" />
            </>
          ) : null}
        </div>

        <p className="text-xs text-gray-400 font-bold mb-6">
          Se actualiza en <span className="text-[#1E5ADF]">{timeLeft}s</span>
        </p>

        <p className="font-mono text-gray-400 text-xs mb-4 tracking-widest">
          REF: {boleto.id}
        </p>

        <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-xl border border-blue-100">
          Muestra este código al personal de la entrada.{' '}
          <strong>Sube el brillo</strong> para facilitar la lectura.
        </p>
      </div>
    </div>
  );
};

export default ModalQR;