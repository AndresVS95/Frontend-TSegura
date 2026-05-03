// src/components/TicketCard.tsx
import React, { useState } from 'react';
import ModalQR from './ModalQR';
import { ExternalLink, ShieldCheck, Ticket as TicketIcon, QrCode } from 'lucide-react';

interface BoletoProps {
  boleto: {
    id: string;
    evento: string;
    fecha: string;
    lugar: string;
    zona: string;
    mintTxHash?: string | null;
    estadoNft: 'MINTED' | 'PENDING';
  };
}

const TicketCard: React.FC<BoletoProps> = ({ boleto }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-4 transition-all hover:border-blue-100 group/card">
      {/* ── Fila Principal ── */}
      <div 
        onClick={() => setExpandido(!expandido)}
        className="p-6 flex flex-col md:flex-row items-center gap-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
      >
        {/* Miniatura Imagen / Icono */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2748E8] to-blue-400 flex-shrink-0 shadow-lg shadow-blue-100 flex items-center justify-center">
            <TicketIcon className="text-white opacity-40" size={32} />
        </div>

        {/* Info Principal */}
        <div className="flex-grow text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
            <h3 className="text-xl font-black text-gray-900 leading-tight">{boleto.evento}</h3>
            <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 ${
              boleto.estadoNft === 'MINTED' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${boleto.estadoNft === 'MINTED' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
              {boleto.estadoNft === 'MINTED' ? 'Verificado' : 'Procesando'}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 justify-center md:justify-start text-xs text-gray-400 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-gray-500"><TicketIcon size={14} className="text-[#2748E8]" /> {boleto.zona}</span>
            <span>📅 {boleto.fecha}</span>
            <span>📍 {boleto.lugar}</span>
            <span className="text-gray-300 font-mono">ID #{boleto.id}</span>
          </div>
        </div>

        {/* Botones de Acción Rápidos */}
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setModalAbierto(true);
            }}
            className="flex items-center gap-2 bg-white border border-gray-100 hover:border-[#2748E8] hover:text-[#2748E8] text-gray-600 px-6 py-3.5 rounded-2xl font-black text-xs transition-all active:scale-95 shadow-sm"
          >
            <QrCode size={18} />
            VER QR
          </button>
          
          <button
            onClick={(e) => e.stopPropagation()}
            className="bg-[#2748E8] hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-black text-xs shadow-xl shadow-blue-500/10 transition-all active:scale-95"
          >
            VENDER
          </button>
        </div>
      </div>

      {/* ── Despliegue de Detalles & Blockchain ── */}
      {expandido && (
        <div className="px-6 pb-8 pt-2 border-t border-dashed border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-gray-50/50 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-green-500" /> Estado NFT
              </p>
              <p className="text-xs font-black text-gray-700 uppercase">Asegurado por Blockchain</p>
            </div>
            
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Red</p>
              <p className="text-xs font-black text-[#2748E8] uppercase flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#2748E8]" /> Polygon Amoy
              </p>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-center">
              {boleto.mintTxHash ? (
                <a
                  href={`https://amoy.polygonscan.com/tx/${boleto.mintTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-white border border-blue-100 text-[#2748E8] rounded-2xl font-black text-xs hover:bg-[#2748E8] hover:text-white transition-all shadow-sm group/btn"
                >
                  <ExternalLink size={16} className="group-hover/btn:rotate-12 transition-transform" />
                  VERIFICAR EN POLYGON AMOY
                </a>
              ) : (
                <div className="px-6 py-3 bg-amber-50 text-amber-700 rounded-2xl font-bold text-[10px] uppercase text-center border border-amber-100">
                  Transacción procesándose...
                </div>
              )}
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