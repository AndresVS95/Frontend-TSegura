import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrganizerLayout from '../components/OrganizerLayout';
import { organizadorService, type RevenueStats } from '../services/organizadorService';
import { usePolling } from '../hooks/usePolling';
import { ArrowLeft, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK: RevenueStats = {
  totalIngresos: 45_600_000,
  desglosePorZona: [
    { nombreZona: 'VIP',     ingresoOnline: 12_000_000, ingresoEfectivo: 3_000_000, totalZona: 15_000_000 },
    { nombreZona: 'PLATA',   ingresoOnline: 14_250_000, ingresoEfectivo: 3_750_000, totalZona: 18_000_000 },
    { nombreZona: 'GENERAL', ingresoOnline: 9_360_000,  ingresoEfectivo: 3_240_000, totalZona: 12_600_000 },
  ],
  desglosePorMetodo: { online: 35_610_000, efectivo: 9_990_000 },
};

const fmt = (v: number) => `$${v.toLocaleString('es-CO')}`;

const PanelIngresos: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [revenue, setRevenue] = useState<RevenueStats | null>(null);
  const [exportando, setExportando] = useState(false);
  const [hora, setHora] = useState('');

  const fetch = useCallback(async () => {
    try {
      // REAL: const data = await organizadorService.obtenerRevenue(id!); setRevenue(data);
      await new Promise(r => setTimeout(r, 200));
      setRevenue(MOCK);
      setHora(new Date().toLocaleTimeString('es-CO'));
    } catch (e) { console.error(e); }
  }, [id]);

  usePolling(fetch, 15_000, !!id);

  const handleExportarCSV = async () => {
    setExportando(true);
    try {
      await organizadorService.exportarRevenueCSV(id!);
      toast.success('CSV exportado correctamente');
    } catch {
      // MOCK: simular descarga
      const csv = [
        'Zona,Ingresos Online,Ingresos Efectivo,Total',
        ...(revenue?.desglosePorZona.map(z =>
          `${z.nombreZona},${z.ingresoOnline},${z.ingresoEfectivo},${z.totalZona}`
        ) ?? []),
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = `ingresos-evento-${id}.csv`;
      a.click(); URL.revokeObjectURL(url);
      toast.success('CSV descargado (mock)');
    } finally {
      setExportando(false);
    }
  };

  const pctOnline = revenue
    ? Math.round((revenue.desglosePorMetodo.online / revenue.totalIngresos) * 100)
    : 0;

  return (
    <OrganizerLayout>
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#2748E8] transition-colors uppercase tracking-widest mb-4">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al evento
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Panel de Ingresos</h2>
            <p className="text-gray-500 mt-1 font-medium">Desglose por zona y método de pago · {hora || 'Sincronizando...'}</p>
          </div>
          <button
            onClick={handleExportarCSV}
            disabled={exportando || !revenue}
            className="flex items-center gap-2 bg-[#2748E8] hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
          >
            <Download size={16} />
            {exportando ? 'Exportando...' : 'Exportar CSV'}
          </button>
        </div>
      </div>

      {!revenue ? (
        <div className="space-y-4">
          {[1,2,3].map(n => <div key={n} className="h-20 bg-gray-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <>
          {/* Total general */}
          <div className="bg-[#2748E8] text-white p-8 rounded-[2rem] shadow-xl shadow-blue-500/20 mb-6">
            <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-2">Total Ingresos Brutos</p>
            <p className="text-5xl font-black">{fmt(revenue.totalIngresos)}</p>
            <p className="text-sm opacity-60 mt-2 font-medium">COP · Incluye todos los canales</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Desglose por método */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">Por Método de Pago</h3>
              <div className="space-y-4">
                {[
                  { label: 'Online (Stripe)',  valor: revenue.desglosePorMetodo.online,   color: 'bg-[#2748E8]', pct: pctOnline },
                  { label: 'Efectivo',         valor: revenue.desglosePorMetodo.efectivo,  color: 'bg-green-500', pct: 100 - pctOnline },
                ].map(({ label, valor, color, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span className="text-gray-700">{label}</span>
                      <span className="text-gray-900">{fmt(valor)} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className={`h-2 rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen zonas */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">Participación por Zona</h3>
              <div className="space-y-3">
                {revenue.desglosePorZona.map(z => {
                  const pct = Math.round((z.totalZona / revenue.totalIngresos) * 100);
                  return (
                    <div key={z.nombreZona} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="font-bold text-gray-700 text-sm">{z.nombreZona}</span>
                      <div className="text-right">
                        <p className="font-black text-gray-900 text-sm">{fmt(z.totalZona)}</p>
                        <p className="text-[10px] text-gray-400">{pct}% del total</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tabla desglose completo */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-black text-gray-800 text-sm">Desglose Completo por Zona</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['Zona', 'Online', 'Efectivo', 'Total Zona'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {revenue.desglosePorZona.map(z => (
                    <tr key={z.nombreZona} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-black text-gray-900">{z.nombreZona}</td>
                      <td className="px-6 py-4 text-[#2748E8] font-bold">{fmt(z.ingresoOnline)}</td>
                      <td className="px-6 py-4 text-green-700 font-bold">{fmt(z.ingresoEfectivo)}</td>
                      <td className="px-6 py-4 font-black text-gray-900">{fmt(z.totalZona)}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-black">
                    <td className="px-6 py-4 text-[#2748E8]">TOTAL</td>
                    <td className="px-6 py-4 text-[#2748E8]">{fmt(revenue.desglosePorMetodo.online)}</td>
                    <td className="px-6 py-4 text-[#2748E8]">{fmt(revenue.desglosePorMetodo.efectivo)}</td>
                    <td className="px-6 py-4 text-[#2748E8]">{fmt(revenue.totalIngresos)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </OrganizerLayout>
  );
};

export default PanelIngresos;