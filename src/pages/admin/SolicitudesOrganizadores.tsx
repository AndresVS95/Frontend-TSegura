import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../hooks/useAdmin';
import type { EstadoSolicitud, SolicitudOrganizador } from '../../services/adminService';

// ─── Modal reutilizable ───────────────────────────────────────────────────────
interface ModalConfirmProps {
  isOpen: boolean;
  titulo: string;
  descripcion: string;
  conMotivo?: boolean;
  labelBoton: string;
  colorBoton: string;
  onConfirm: (motivo?: string) => void;
  onClose: () => void;
  cargando?: boolean;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  isOpen, titulo, descripcion, conMotivo, labelBoton, colorBoton,
  onConfirm, onClose, cargando,
}) => {
  const [motivo, setMotivo] = useState('');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-black text-gray-900 mb-2">{titulo}</h3>
        <p className="text-gray-500 text-sm mb-6">{descripcion}</p>

        {/* ✅ Campo motivo obligatorio (HU-035 y HU-036) */}
        {conMotivo && (
          <div className="mb-6">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
              Motivo *
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Describe el motivo de esta acción..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm resize-none"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(conMotivo ? motivo : undefined)}
            disabled={cargando || (conMotivo && !motivo.trim())}
            className={`flex-1 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${colorBoton}`}
          >
            {cargando
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Procesando...</>
              : labelBoton
            }
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Badge de estado ──────────────────────────────────────────────────────────
const BadgeEstado: React.FC<{ estado: EstadoSolicitud }> = ({ estado }) => {
  const map: Record<EstadoSolicitud, string> = {
    PENDIENTE: 'bg-amber-100 text-amber-700',
    APROBADO:  'bg-green-100 text-green-700',
    RECHAZADO: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${map[estado]}`}>
      {estado}
    </span>
  );
};

// ─── Página principal ─────────────────────────────────────────────────────────
const SolicitudesOrganizadores: React.FC = () => {
  const {
    solicitudes, cargandoSolicitudes, errorSolicitudes,
    cargarSolicitudes, rechazar, aprobar, suspender, reactivar,
  } = useAdmin();

  const [filtroEstado, setFiltroEstado] = useState<EstadoSolicitud | ''>('');
  const [busqueda, setBusqueda]         = useState('');
  const [modal, setModal] = useState<{
    tipo: 'rechazar' | 'suspender' | 'reactivar' | 'aprobar' | null;
    solicitud: SolicitudOrganizador | null;
  }>({ tipo: null, solicitud: null });
  const [accionando, setAccionando] = useState(false);

  // Cargar con debounce en búsqueda
  useEffect(() => {
    const t = setTimeout(() => {
      cargarSolicitudes(filtroEstado || undefined, busqueda || undefined);
    }, 300);
    return () => clearTimeout(t);
  }, [filtroEstado, busqueda, cargarSolicitudes]);

  const handleConfirm = async (motivo?: string) => {
    if (!modal.solicitud) return;
    setAccionando(true);
    try {
      if (modal.tipo === 'rechazar')   await rechazar(modal.solicitud.id, motivo!);
      if (modal.tipo === 'aprobar')    await aprobar(modal.solicitud.id);
      if (modal.tipo === 'suspender')  await suspender(modal.solicitud.id, motivo!);
      if (modal.tipo === 'reactivar')  await reactivar(modal.solicitud.id);
      setModal({ tipo: null, solicitud: null });
    } finally {
      setAccionando(false);
    }
  };

  const modalConfig = {
    rechazar:  { titulo: 'Rechazar solicitud',      descripcion: 'Esta acción notificará al organizador por correo con el motivo indicado.',     conMotivo: true,  labelBoton: 'Rechazar',   colorBoton: 'bg-red-500 hover:bg-red-600'    },
    suspender: { titulo: 'Suspender organizador',   descripcion: 'La cuenta será suspendida y sus eventos activos despublicados automáticamente.', conMotivo: true,  labelBoton: 'Suspender',  colorBoton: 'bg-orange-500 hover:bg-orange-600' },
    reactivar: { titulo: 'Reactivar organizador',   descripcion: '¿Confirmas que deseas reactivar esta cuenta de organizador?',                    conMotivo: false, labelBoton: 'Reactivar',  colorBoton: 'bg-green-500 hover:bg-green-600' },
    aprobar:   { titulo: 'Aprobar solicitud',       descripcion: '¿Confirmas que deseas aprobar esta solicitud de organizador?',                    conMotivo: false, labelBoton: 'Aprobar',    colorBoton: 'bg-[#1E5ADF] hover:bg-blue-700' },
  };

  const cfg = modal.tipo ? modalConfig[modal.tipo] : null;

  return (
    <AdminLayout>
      <div className="p-8 max-w-6xl">

        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Solicitudes de Organizadores</h1>
          <p className="text-gray-500 mt-1">Gestiona las solicitudes de registro y cuentas activas</p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o NIT..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E5ADF] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
          />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as EstadoSolicitud | '')}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E5ADF] outline-none text-sm font-bold text-gray-700 bg-white"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="APROBADO">Aprobado</option>
            <option value="RECHAZADO">Rechazado</option>
          </select>
        </div>

        {/* Indicador de nuevas sin revisar */}
        {solicitudes.filter((s) => s.estado === 'PENDIENTE').length > 0 && (
          <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            {solicitudes.filter((s) => s.estado === 'PENDIENTE').length} solicitudes pendientes sin revisar
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {cargandoSolicitudes ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 border-4 border-[#1E5ADF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Cargando solicitudes...</p>
            </div>
          ) : errorSolicitudes ? (
            <div className="p-16 text-center text-red-500 font-bold">{errorSolicitudes}</div>
          ) : solicitudes.length === 0 ? (
            <div className="p-16 text-center">
              <span className="text-4xl block mb-3">📋</span>
              <p className="text-gray-400 font-semibold">No hay solicitudes que coincidan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Organizador', 'NIT', 'Empresa', 'Fecha', 'Estado', 'Acciones'].map((h) => (
                      <th key={h} className="text-left px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {solicitudes.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{s.nombreCompleto}</p>
                        <p className="text-gray-400 text-xs">{s.correo}</p>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-600 text-xs">{s.nit}</td>
                      <td className="px-6 py-4 text-gray-600">{s.nombreEmpresa}</td>
                      <td className="px-6 py-4 text-gray-400 text-xs">{s.fechaSolicitud}</td>
                      <td className="px-6 py-4"><BadgeEstado estado={s.estado} /></td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {s.estado === 'PENDIENTE' && (
                            <>
                              <button
                                onClick={() => setModal({ tipo: 'aprobar', solicitud: s })}
                                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                              >
                                Aprobar
                              </button>
                              <button
                                onClick={() => setModal({ tipo: 'rechazar', solicitud: s })}
                                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                              >
                                Rechazar
                              </button>
                            </>
                          )}
                          {s.estado === 'APROBADO' && (
                            <button
                              onClick={() => setModal({ tipo: 'suspender', solicitud: s })}
                              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
                            >
                              Suspender
                            </button>
                          )}
                          {s.estado === 'RECHAZADO' && (
                            <button
                              onClick={() => setModal({ tipo: 'reactivar', solicitud: s })}
                              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-100 text-[#1E5ADF] hover:bg-blue-200 transition-colors"
                            >
                              Reactivar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación */}
      {cfg && (
        <ModalConfirm
          isOpen={!!modal.tipo}
          titulo={cfg.titulo}
          descripcion={cfg.descripcion}
          conMotivo={cfg.conMotivo}
          labelBoton={cfg.labelBoton}
          colorBoton={cfg.colorBoton}
          onConfirm={handleConfirm}
          onClose={() => setModal({ tipo: null, solicitud: null })}
          cargando={accionando}
        />
      )}
    </AdminLayout>
  );
};

export default SolicitudesOrganizadores;