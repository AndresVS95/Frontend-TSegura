// src/pages/MisBoletos.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketCard from '../components/TicketCard';
import { ticketService } from '../services/ticketService';
import Navbar from '../components/Navbar';

interface Boleto {
  id: string;
  evento: string;
  fecha: string;
  lugar: string;
  zona: string;
  estadoNft: 'MINTED' | 'PENDING';
}

const MisBoletos: React.FC = () => {
  const navigate = useNavigate();
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarBoletos = async () => {
      try {
        const data = await ticketService.obtenerMisBoletos();
        const boletosMapeados = data.map((b: any) => ({
          id: b.boletoId || b.id || 'Sin ID',
          evento: b.nombreEvento || 'Evento Desconocido',
          fecha: b.fechaEvento || 'Fecha pendiente',
          lugar: b.lugar || 'Ubicación en el boleto',
          zona: b.nombreZona || 'General',
          estadoNft: (b.estadoBoleto?.toString().trim().toUpperCase() === 'MINTED' || b.mintTxHash) 
            ? 'MINTED' 
            : 'PENDING',
        }));
        setBoletos(boletosMapeados);
      } catch (err: any) {
        setError('Error al cargar boletos. Inténtalo de nuevo.');
      } finally {
        setCargando(false);
      }
    };
    cargarBoletos();
  }, []);

  if (cargando) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <div className="mb-10">
          <h1 className="premium-title text-5xl mb-2">
            Mis <span>Tickets</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
            {boletos.length} tickets · {boletos.filter(b => b.estadoNft === 'MINTED').length} activos · 0 en reventa
          </p>
        </div>

        {boletos.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#1E5ADF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Aún no tienes boletos</h3>
            <p className="text-gray-400 mb-8">Tus entradas compradas aparecerán aquí automáticamente.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#1E5ADF] text-white px-8 py-4 rounded-2xl font-black transition-all hover:bg-blue-700 shadow-lg shadow-blue-100"
            >
              Explorar eventos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {boletos.map((boleto) => (
              <TicketCard key={boleto.id} boleto={boleto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisBoletos;