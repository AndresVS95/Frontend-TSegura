import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrganizerLayout from '../components/OrganizerLayout';
import { organizadorService, type CheckinLog, type CheckinEntry } from '../services/organizadorService';
import { usePolling } from '../hooks/usePolling';
import { ArrowLeft, RefreshCw, Users } from 'lucide-react';

const MOCK_ENTRIES: CheckinEntry[] = [
  { ticketId: 'TKT-001', nombreEnmascarado: 'Car*** P***', zona: 'VIP',     horaIngreso: '19:02:14' },
  { ticketId: 'TKT-008', nombreEnmascarado: 'Ana*** G***', zona: 'VIP',     horaIngreso: '19:05:33' },
  { ticketId: 'TKT-023', nombreEnmascarado: 'Lui*** T***', zona: 'PLATA',   horaIngreso: '19:07:01' },
  { ticketId: 'TKT-041', nombreEnmascarado: 'Mar*** R***', zona: 'GENERAL', horaIngreso: '19:08:45' },
  { ticketId: 'TKT-055', nombreEnmascarado: 'Jor*** M***', zona: 'PLATA',   horaIngreso: '19:10:22' },
  { ticketId: 'TKT-067', nombreEnmascarado: 'Sof*** L***', zona: 'GENERAL', horaIngreso: '19:11:58' },
];

const MOCK_LOG: CheckinLog = { totalIngresados: 6, entradas: MOCK_ENTRIES };

const PanelCheckin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [log, setLog]             = useState<CheckinLog | null>(null);
  const [zonaFiltro, setZonaFiltro] = useState<string>('');
  const [hora, setHora]           = useState('');

  const zonas = log
    ? ['', ...Array.from(new Set(log.entradas.map(e => e.zona)))]
    : [];

  const fetch = useCallback(async () => {
    try {
      // REAL: const data = await organizadorService.obtenerCheckinLog(id!, zonaFiltro || undefined);
      await new Promise(r => setTimeout(r, 200));
      const filtrado = zonaFiltro
        ? { ...MOCK_LOG, entradas: MOCK_LOG.entradas.filter(e => e.zona === zonaFiltro) }
        : MOCK_LOG;
      setLog(filtrado);
      setHora(new Date().toLocaleTimeString('es-CO'));
    } catch (e) { console.error(e); }
  }, [id, zonaFiltro]);

  usePolling(fetch, 15_000, !!id);

  const entradasMostradas = log?.entradas ?? [];

  return (
    <OrganizerLayout>
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#2748E8] transition-colors uppercase tracking-widest mb-4">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al evento
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Check-in en Vivo</h2>
            <p className="text-gray-500 mt-1 font-medium">Lista de ingresos con hora y zona · polling cada 15s</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
            {hora || 'Sincronizando...'}
          </div>
        </div>
      </div>

      {/* Contador + filtro */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Contador total */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
            <Users size={22} className="text-green-700" />
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900">{log?.totalIngresados ?? '--'}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Personas ingresadas</p>
          </div>
        </div>

        {/* Filtro zona */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider whitespace-nowrap">
            Filtrar zona:
          </label>
          <select
            value={zonaFiltro}
            onChange={(e) => setZonaFiltro(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2748E8] outline-none text-sm font-bold text-gray-700 bg-gray-50"
          >
            <option value="">Todas las zonas</option>
            {zonas.filter(Boolean).map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de ingresos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between">
          <h3 className="font-black text-gray-800 text-sm">Registro de Ingresos</h3>
          <span className="text-xs font-bold text-gray-400">
            {entradasMostradas.length} registro{entradasMostradas.length !== 1 ? 's' : ''}
          </span>
        </div>

        {!log ? (
          <div className="p-10 text-center">
            <div className="w-8 h-8 border-4 border-[#2748E8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Sincronizando check-ins...</p>
          </div>
        ) : entradasMostradas.length === 0 ? (
          <div className="p-16 text-center">
            <span className="text-4xl block mb-3">🚪</span>
            <p className="text-gray-400 font-semibold">
              {zonaFiltro ? `No hay ingresos en zona ${zonaFiltro}` : 'Aún no hay ingresos registrados'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {[...entradasMostradas].reverse().map((entry, i) => (
              <div
                key={entry.ticketId}
                className={`flex items-center justify-between px-6 py-4 transition-colors ${i === 0 ? 'bg-green-50' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-4">
                  {/* Indicador de nuevo */}
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-200'}`} />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{entry.nombreEnmascarado}</p>
                    <p className="font-mono text-gray-400 text-xs">{entry.ticketId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-full ${
                    entry.zona === 'VIP' ? 'bg-amber-100 text-amber-700' :
                    entry.zona === 'PLATA' ? 'bg-blue-100 text-[#2748E8]' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {entry.zona}
                  </span>
                  <span className="font-mono text-sm font-bold text-gray-700">
                    {entry.horaIngreso}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </OrganizerLayout>
  );
};

export default PanelCheckin;