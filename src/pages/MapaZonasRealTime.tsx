import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrganizerLayout from '../components/OrganizerLayout';
import { organizadorService, type ZonaStatus, type EstadoZonaMapa } from '../services/organizadorService';
import { usePolling } from '../hooks/usePolling';
import { ArrowLeft, RefreshCw } from 'lucide-react';

// ─── Mock ────────────────────────────────────────────────────────────────────
const MOCK_ZONAS: ZonaStatus[] = [
  { zonaId: 1, nombreZona: 'VIP',     estado: 'PARCIAL',    cuposVendidos: 60,  cuposTotales: 80  },
  { zonaId: 2, nombreZona: 'PLATA',   estado: 'PARCIAL',    cuposVendidos: 120, cuposTotales: 150 },
  { zonaId: 3, nombreZona: 'GENERAL', estado: 'DISPONIBLE', cuposVendidos: 132, cuposTotales: 270 },
];

// ─── Colores por estado ───────────────────────────────────────────────────────
const COLOR_MAP: Record<EstadoZonaMapa, { fill: string; badge: string; text: string }> = {
  DISPONIBLE: { fill: '#10B981', badge: 'bg-green-100 text-green-700',  text: 'Disponible' },
  PARCIAL:    { fill: '#F59E0B', badge: 'bg-amber-100 text-amber-700',  text: 'Parcial'    },
  AGOTADO:    { fill: '#EF4444', badge: 'bg-red-100 text-red-700',      text: 'Agotado'    },
};

// ─── Mapa SVG con estado visual ───────────────────────────────────────────────
const MapaZonasSVG: React.FC<{
  zonas: ZonaStatus[];
  zonaActiva: ZonaStatus | null;
  onZonaClick: (z: ZonaStatus) => void;
}> = ({ zonas, zonaActiva, onZonaClick }) => {
  const getColor = (nombre: string) => {
    const z = zonas.find(z => z.nombreZona.toUpperCase() === nombre.toUpperCase());
    return z ? COLOR_MAP[z.estado].fill : '#D1D5DB';
  };

  const getZona = (nombre: string) =>
    zonas.find(z => z.nombreZona.toUpperCase() === nombre.toUpperCase());

  const filas: { id: string; zona: string; y: number }[] = [
    { id: 'A', zona: 'VIP',     y: 120 }, { id: 'B', zona: 'VIP',     y: 160 },
    { id: 'C', zona: 'PLATA',   y: 210 }, { id: 'D', zona: 'PLATA',   y: 250 },
    { id: 'E', zona: 'GENERAL', y: 300 }, { id: 'F', zona: 'GENERAL', y: 340 },
    { id: 'G', zona: 'GENERAL', y: 380 }, { id: 'H', zona: 'GENERAL', y: 420 },
    { id: 'I', zona: 'GENERAL', y: 460 }, { id: 'J', zona: 'GENERAL', y: 500 },
  ];

  const grupos = ['VIP', 'PLATA', 'GENERAL'];

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 570" width="100%" height="100%">
      <rect width="100%" height="100%" fill="#f8fafc" rx="15" />
      <path d="M 60 70 Q 275 110 490 70" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3" />
      <text x="275" y="52" fontFamily="sans-serif" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#64748b" letterSpacing="3">
        ESCENARIO PRINCIPAL
      </text>

      {grupos.map(grupoId => {
        const zona = getZona(grupoId);
        const esActiva = zonaActiva?.nombreZona.toUpperCase() === grupoId;
        return (
          <g
            key={grupoId}
            id={grupoId}
            className="cursor-pointer"
            onClick={() => zona && onZonaClick(zona)}
            style={{ filter: esActiva ? 'drop-shadow(0 0 8px rgba(39,72,232,0.5))' : 'none' }}
          >
            {filas.filter(f => f.zona === grupoId).map(({ id, y }) => (
              <g key={id}>
                <text x="42" y={y + 20} fontFamily="sans-serif" fontWeight="bold" fontSize="13" fill="#6B7280" stroke="none">
                  {id}
                </text>
                {Array.from({ length: 10 }, (_, i) => (
                  <rect
                    key={i}
                    x={60 + (i > 4 ? i * 40 + 15 : i * 40)}
                    y={y}
                    width="28"
                    height="28"
                    rx="6"
                    fill={getColor(grupoId)}
                    stroke={esActiva ? '#2748E8' : '#9CA3AF'}
                    strokeWidth={esActiva ? 2 : 1}
                    opacity={0.85}
                  />
                ))}
              </g>
            ))}
          </g>
        );
      })}

      {/* Leyenda */}
      <g transform="translate(30, 540)">
        {Object.entries(COLOR_MAP).map(([estado, { fill, text }], i) => (
          <g key={estado} transform={`translate(${i * 130}, 0)`}>
            <rect x="0" y="0" width="12" height="12" rx="3" fill={fill} />
            <text x="16" y="10" fontFamily="sans-serif" fontSize="10" fill="#374151">{text}</text>
          </g>
        ))}
      </g>
    </svg>
  );
};

// ─── Panel detalle de zona ────────────────────────────────────────────────────
const PanelZona: React.FC<{ zona: ZonaStatus }> = ({ zona }) => {
  const cfg = COLOR_MAP[zona.estado];
  const pct = Math.round((zona.cuposVendidos / zona.cuposTotales) * 100);

  return (
    <div className="bg-white p-6 rounded-2xl border-2 border-[#2748E8] shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black text-gray-900">Zona {zona.nombreZona}</h3>
        <span className={`text-xs font-black px-3 py-1 rounded-full ${cfg.badge}`}>
          {cfg.text}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm font-bold">
          <span className="text-gray-500">Ocupación</span>
          <span className="text-gray-900">{zona.cuposVendidos} / {zona.cuposTotales}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: cfg.fill }}
          />
        </div>
        <p className="text-right text-xs font-bold text-gray-400">{pct}% vendido</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 p-3 rounded-xl text-center">
          <p className="text-xl font-black text-gray-900">{zona.cuposVendidos}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Vendidos</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl text-center">
          <p className="text-xl font-black text-gray-900">{zona.cuposTotales - zona.cuposVendidos}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Disponibles</p>
        </div>
      </div>
    </div>
  );
};

// ─── Página principal ─────────────────────────────────────────────────────────
const MapaZonasRealTime: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [zonas, setZonas]           = useState<ZonaStatus[]>([]);
  const [zonaActiva, setZonaActiva] = useState<ZonaStatus | null>(null);
  const [hora, setHora]             = useState('');

  const fetch = useCallback(async () => {
    try {
      // REAL: const data = await organizadorService.obtenerZonasStatus(id!); setZonas(data);
      await new Promise(r => setTimeout(r, 200));
      setZonas(MOCK_ZONAS);
      // Actualizar zona activa si cambió su estado
      setZonaActiva(prev =>
        prev ? MOCK_ZONAS.find(z => z.zonaId === prev.zonaId) ?? null : null
      );
      setHora(new Date().toLocaleTimeString('es-CO'));
    } catch (e) { console.error(e); }
  }, [id]);

  // ✅ Polling cada 15s
  usePolling(fetch, 15_000, !!id);

  return (
    <OrganizerLayout>
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#2748E8] transition-colors uppercase tracking-widest mb-4">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al evento
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Estado de Zonas</h2>
            <p className="text-gray-500 mt-1 font-medium">Mapa visual en tiempo real · polling cada 15s</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
            {hora || 'Sincronizando...'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mapa */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
            Haz clic en una zona para ver el detalle
          </p>
          {zonas.length === 0 ? (
            <div className="h-96 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#2748E8] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <MapaZonasSVG zonas={zonas} zonaActiva={zonaActiva} onZonaClick={setZonaActiva} />
          )}
        </div>

        {/* Panel derecho */}
        <div className="space-y-4">
          {/* Detalle de zona seleccionada */}
          {zonaActiva ? (
            <PanelZona zona={zonaActiva} />
          ) : (
            <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-200 text-center">
              <p className="text-4xl mb-3">🗺️</p>
              <p className="font-bold text-gray-500">Selecciona una zona del mapa</p>
              <p className="text-sm text-gray-400 mt-1">para ver su estado detallado</p>
            </div>
          )}

          {/* Resumen de todas las zonas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-black text-gray-800 text-sm">Resumen General</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {zonas.map(z => {
                const cfg = COLOR_MAP[z.estado];
                const pct = Math.round((z.cuposVendidos / z.cuposTotales) * 100);
                return (
                  <div
                    key={z.zonaId}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setZonaActiva(z)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.fill }} />
                      <span className="font-bold text-gray-900 text-sm">{z.nombreZona}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 font-medium">{z.cuposVendidos}/{z.cuposTotales}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${cfg.badge}`}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </OrganizerLayout>
  );
};

export default MapaZonasRealTime;