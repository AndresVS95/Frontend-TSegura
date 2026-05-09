import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService, type KpisAdmin, type PuntoVenta } from '../../services/adminService';

// ─── Mock mientras JG entrega el endpoint ────────────────────────────────────
const MOCK_KPIS: KpisAdmin = {
  totalUsuarios: 1284,
  organizadoresActivos: 47,
  eventosPublicados: 23,
  boletosVendidosHoy: 312,
  ingresosHoy: 15_600_000,
};

const MOCK_VENTAS: PuntoVenta[] = [
  { fecha: '2026-05-03', ventas: 820_000  },
  { fecha: '2026-05-04', ventas: 1_200_000 },
  { fecha: '2026-05-05', ventas: 980_000  },
  { fecha: '2026-05-06', ventas: 2_100_000 },
  { fecha: '2026-05-07', ventas: 1_750_000 },
  { fecha: '2026-05-08', ventas: 3_200_000 },
  { fecha: '2026-05-09', ventas: 15_600_000 },
];

// ─── Subcomponente: Tarjeta KPI ───────────────────────────────────────────────
const KpiCard: React.FC<{
  label: string;
  valor: string;
  icono: string;
  color: string;
  onClick?: () => void;
}> = ({ label, valor, icono, color, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md hover:border-[#1E5ADF] transition-all' : ''}`}
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-2xl">{icono}</span>
      <span className={`text-xs font-black px-2 py-1 rounded-full ${color}`}>HOY</span>
    </div>
    <p className="text-2xl font-black text-gray-900">{valor}</p>
    <p className="text-sm text-gray-400 font-medium mt-1">{label}</p>
  </div>
);

// ─── Subcomponente: Gráfico de barras SVG ─────────────────────────────────────
const GraficoVentas: React.FC<{ datos: PuntoVenta[] }> = ({ datos }) => {
  const max = Math.max(...datos.map((d) => d.ventas));
  const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const formatCOP = (v: number) =>
    v >= 1_000_000
      ? `$${(v / 1_000_000).toFixed(1)}M`
      : `$${(v / 1_000).toFixed(0)}K`;

  return (
    <div className="flex items-end gap-3 h-40 w-full">
      {datos.map((punto, i) => {
        const altura = max > 0 ? (punto.ventas / max) * 100 : 0;
        const esHoy  = i === datos.length - 1;
        return (
          <div key={punto.fecha} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-[10px] text-gray-400 font-bold">
              {formatCOP(punto.ventas)}
            </span>
            <div className="w-full relative" style={{ height: '96px' }}>
              <div
                className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-700 ${
                  esHoy ? 'bg-[#1E5ADF]' : 'bg-blue-100'
                }`}
                style={{ height: `${altura}%` }}
              />
            </div>
            <span className={`text-[10px] font-bold ${esHoy ? 'text-[#1E5ADF]' : 'text-gray-400'}`}>
              {dias[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Página principal ─────────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [kpis, setKpis]     = useState<KpisAdmin | null>(null);
  const [ventas, setVentas] = useState<PuntoVenta[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        // ── REAL ──────────────────────────────────────────────────────
        // const [k, v] = await Promise.all([
        //   adminService.obtenerKpis(),
        //   adminService.obtenerVentasUltimos7Dias(),
        // ]);
        // setKpis(k); setVentas(v);

        // ── MOCK ──────────────────────────────────────────────────────
        await new Promise((r) => setTimeout(r, 600));
        setKpis(MOCK_KPIS);
        setVentas(MOCK_VENTAS);
      } catch (e) {
        console.error('Error cargando dashboard:', e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  if (cargando)
    return (
      <AdminLayout>
        <div className="p-10 flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-4 border-[#1E5ADF] border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="p-8 max-w-6xl">

        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Resumen general de la plataforma</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          <KpiCard
            label="Usuarios totales"
            valor={kpis!.totalUsuarios.toLocaleString()}
            icono="👥"
            color="bg-blue-100 text-blue-700"
            onClick={() => navigate('/admin/usuarios')}
          />
          <KpiCard
            label="Organizadores activos"
            valor={kpis!.organizadoresActivos.toString()}
            icono="🏢"
            color="bg-purple-100 text-purple-700"
            onClick={() => navigate('/admin/solicitudes')}
          />
          <KpiCard
            label="Eventos publicados"
            valor={kpis!.eventosPublicados.toString()}
            icono="🎭"
            color="bg-green-100 text-green-700"
          />
          <KpiCard
            label="Boletos vendidos hoy"
            valor={kpis!.boletosVendidosHoy.toLocaleString()}
            icono="🎟️"
            color="bg-amber-100 text-amber-700"
          />
          <KpiCard
            label="Ingresos hoy"
            valor={`$${(kpis!.ingresosHoy / 1_000_000).toFixed(1)}M`}
            icono="💰"
            color="bg-emerald-100 text-emerald-700"
          />
        </div>

        {/* Gráfico + Accesos rápidos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Gráfico ventas */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-black text-gray-900">Ventas últimos 7 días</h2>
                <p className="text-sm text-gray-400">En pesos colombianos (COP)</p>
              </div>
              <span className="text-xs bg-blue-50 text-[#1E5ADF] font-bold px-3 py-1 rounded-full">
                Últimos 7 días
              </span>
            </div>
            <GraficoVentas datos={ventas} />
          </div>

          {/* Accesos rápidos */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4">Accesos rápidos</h2>
            <div className="space-y-3">
              {[
                { label: 'Ver solicitudes pendientes', path: '/admin/solicitudes', badge: 'PENDIENTE', color: 'bg-amber-100 text-amber-700' },
                { label: 'Buscar usuarios',            path: '/admin/usuarios',    badge: null, color: '' },
                { label: 'Crear usuario',              path: '/admin/crear-usuario', badge: null, color: '' },
              ].map(({ label, path, badge, color }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-100 hover:border-[#1E5ADF] transition-all text-left"
                >
                  <span className="text-sm font-bold text-gray-700">{label}</span>
                  {badge && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${color}`}>
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;