// src/pages/MisBoletos.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketCard from '../components/TicketCard';
import api from '../services/api';

interface Boleto {
  id: string;
  evento: string;
  fecha: string;
  lugar: string;
  zona: string;
  estadoNft: 'MINTED' | 'PENDING';
}

// Mock temporal mientras JG entrega GET /users/me/tickets
const MOCK_BOLETOS: Boleto[] = [
  {
    id: 'TKT-001',
    evento: 'Concierto Épico 2JC',
    fecha: '13/11/2024',
    lugar: 'Recinto Principal, Popayán',
    zona: 'VIP',
    estadoNft: 'MINTED',
  },
  {
    id: 'TKT-002',
    evento: 'Concierto Épico 2JC',
    fecha: '13/11/2024',
    lugar: 'Recinto Principal, Popayán',
    zona: 'VIP',
    estadoNft: 'MINTED',
  },
  {
    id: 'TKT-003',
    evento: 'Festival de Verano',
    fecha: '25/12/2024',
    lugar: 'Plaza de Toros',
    zona: 'General',
    estadoNft: 'PENDING',
  },
];

const MisBoletos: React.FC = () => {
  const navigate = useNavigate();
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarBoletos = async () => {
      try {
        setCargando(true);
        setError(null);

        // ── REAL: activar cuando JG entregue el endpoint ──────────────────
        // const { data } = await api.get('/api/users/me/tickets');
        // setBoletos(data);

        // ── MOCK: usar mientras el backend no esté listo ──────────────────
        await new Promise((res) => setTimeout(res, 800)); // simula latencia
        setBoletos(MOCK_BOLETOS);

      } catch (err: any) {
        console.error('Error al cargar boletos:', err);
        setError('No pudimos cargar tus boletos. Intenta de nuevo más tarde.');
      } finally {
        setCargando(false);
      }
    };

    cargarBoletos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto mt-10">

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Mis Entradas
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Boletos seguros respaldados por blockchain.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-sm font-semibold text-[#1E5ADF] hover:underline"
          >
            ← Explorar más eventos
          </button>
        </div>

        {/* Estado: cargando */}
        {cargando && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        )}

        {/* Estado: error */}
        {!cargando && error && (
          <div className="text-center py-16 bg-white rounded-[2rem] border border-red-100 shadow-sm">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#1E5ADF] text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Estado: sin boletos */}
        {!cargando && !error && boletos.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <span className="text-5xl mb-4 block">🎟️</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Aún no tienes entradas
            </h3>
            <p className="text-gray-500 mb-6">
              Explora los próximos eventos y asegura tu lugar.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#1E5ADF] text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Ver eventos
            </button>
          </div>
        )}

        {/* Lista de boletos */}
        {!cargando && !error && boletos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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