import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrganizerLayout from '../components/OrganizerLayout';
import { type SalesStats, type VentasPorZonas } from '../services/organizadorService' ;
import { usePolling } from '../hooks/usePolling';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const MOCK: SalesStats = {
  totalVendidos: 312, capacidadTotal: 500, porcentajeGeneral: 62,
  zonas: [
    { zonaId: 1, nombreZona: 'VIP',     vendidosOnLine: 48,  vendidosEfectivo: 12, totalVendidos: 60,  capacidad: 80,  porcentajeOcupacion: 75 },
    { zonaId: 2, nombreZona: 'PLATA',   vendidosOnLine: 95,  vendidosEfectivo: 25, totalVendidos: 120, capacidad: 150, porcentajeOcupacion: 80 },
    { zonaId: 3, nombreZona: 'GENERAL', vendidosOnLine: 110, vendidosEfectivo: 22, totalVendidos: 132, capacidad: 270, porcentajeOcupacion: 49 },
  ],
};

const BarraOcupacion: React.FC<{ pct: number }> = ({ pct }) => (
  <div className="w-full bg-gray-100 rounded-full h-2.5">
    <div
      className={`h-2.5 rounded-full transition-all duration-700 ${pct >= 90 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-500' : 'bg-[#2748E8]'}`}
      style={{ width: `${Math.min(pct, 100)}%` }}
    />
  </div>
);

const ZonaCard: React.FC<{ zona: VentasPorZonas }> = ({ zona }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <h3 className="font-black text-gray-900">{zona.nombreZona}</h3>
      <span className={`text-xs font-black px-2 py-1 rounded-full ${zona.porcentajeOcupacion >= 90 ? 'bg-red-100 text-red-700' : zona.porcentajeOcupacion >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-[#2748E8]'}`}>
        {zona.porcentajeOcupacion}%
      </span>
    </div>
    <BarraOcupacion pct={zona.porcentajeOcupacion} />
    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
      {[
        { val: zona.totalVendidos,     label: 'Total',    cls: 'bg-gray-50 text-gray-900'    },
        { val: zona.vendidosOnLine,    label: 'Online',   cls: 'bg-blue-50 text-[#2748E8]'  },
        { val: zona.vendidosEfectivo,  label: 'Efectivo', cls: 'bg-green-50 text-green-700'  },
      ].map(({ val, label, cls }) => (
        <div key={label} className={`p-3 rounded-xl ${cls}`}>
          <p className="text-lg font-black">{val}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">{label}</p>
        </div>
      ))}
    </div>
    <p className="text-xs text-gray-400 mt-3 text-right font-medium">
      Disponibles: {zona.capacidad - zona.totalVendidos} / {zona.capacidad}
    </p>
  </div>
);

const PanelVentasRealTime: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [hora, setHora] = useState('');

  const fetch = useCallback(async () => {
    try {
      // REAL: const data = await organizadorService.obtenerSalesStats(id!); setStats(data);
      await new Promise(r => setTimeout(r, 200));
      setStats(MOCK);
      setHora(new Date().toLocaleTimeString('es-CO'));
    } catch (e) { console.error(e); }
  }, [id]);

  usePolling(fetch, 15_000, !!id);

  return (
    <OrganizerLayout>
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#2748E8] transition-colors uppercase tracking-widest mb-4">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al evento
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Ventas en Tiempo Real</h2>
            <p className="text-gray-500 mt-1 font-medium">Contadores por zona y canal · actualiza cada 15s</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
            {hora || 'Sincronizando...'}
          </div>
        </div>
      </div>

      {!stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(n => <div key={n} className="h-48 bg-gray-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <>
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Ocupación General</h3>
              <span className="text-2xl font-black text-gray-900">{stats.totalVendidos} <span className="text-gray-300 font-medium text-lg">/ {stats.capacidadTotal}</span></span>
            </div>
            <BarraOcupacion pct={stats.porcentajeGeneral} />
            <p className="text-right text-sm font-bold text-gray-400 mt-2">{stats.porcentajeGeneral}% del aforo</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.zonas.map(z => <ZonaCard key={z.zonaId} zona={z} />)}
          </div>
        </>
      )}
    </OrganizerLayout>
  );
};

export default PanelVentasRealTime;