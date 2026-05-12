// src/pages/DetalleEventoOrg.tsx  —  HU-023 + paneles Sprint 3
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import type { Evento } from '../types/event.types';
import { ManualSaleModal } from '../components/ManualSaleModal';
import toast from 'react-hot-toast';
import OrganizerLayout from '../components/OrganizerLayout';
import {
  ArrowLeft, Plus, DollarSign, Users, MapPin, QrCode,
  PowerOff, Eye, BarChart2, Activity,
} from 'lucide-react';
import { eventMetrics } from '../utils/eventMetrics';

// ─── Modal de confirmación irreversible (HU-023) ──────────────────────────────
const ModalFinalizarEvento: React.FC<{
  isOpen: boolean;
  nombreEvento: string;
  onConfirm: () => void;
  onClose: () => void;
  cargando: boolean;
}> = ({ isOpen, nombreEvento, onConfirm, onClose, cargando }) => {
  const [confirmText, setConfirmText] = useState('');
  const TEXTO_REQUERIDO = 'FINALIZAR';
  const habilitado = confirmText === TEXTO_REQUERIDO;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl border-2 border-red-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícono de advertencia */}
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <PowerOff size={32} className="text-red-500" />
        </div>

        <h3 className="text-2xl font-black text-gray-900 text-center mb-2">
          Finalizar Evento
        </h3>
        <p className="text-gray-500 text-sm text-center mb-6 leading-relaxed">
          Esta acción es <strong className="text-red-600">irreversible</strong>. El evento
          <strong> "{nombreEvento}"</strong> pasará a estado FINALIZADO, bloqueando nuevas
          ventas y marcando todos los boletos como USADO.
        </p>

        {/* Campo de confirmación manual */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
            Escribe <span className="font-black">FINALIZAR</span> para confirmar
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
            placeholder="FINALIZAR"
            className="w-full px-4 py-3 rounded-xl border border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none font-black tracking-widest text-center text-red-700 bg-white"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={cargando}
            className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={!habilitado || cargando}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {cargando
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Finalizando...</>
              : <><PowerOff size={16} /> Finalizar</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const DetalleEventoOrg: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evento, setEvento]         = useState<Evento | null>(null);
  const [loading, setLoading]       = useState(true);
  const [isModalOpen, setIsModalOpen]           = useState(false);
  const [modalFinalizar, setModalFinalizar]      = useState(false);
  const [finalizando, setFinalizando]            = useState(false);

  const cargarEvento = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await eventService.obtenerEventoPorId(id);
      setEvento(data);
    } catch {
      toast.error('Error al cargar detalles del evento');
    } finally {
      setLoading(false);
    }
  };

  // HU-023: Finalizar evento con modal de confirmación irreversible
  const handleFinalizar = async () => {
    if (!evento) return;
    setFinalizando(true);
    try {
      await eventService.finalizarEvento(evento.eventoId);
      toast.success('Evento finalizado correctamente.');
      setModalFinalizar(false);
      cargarEvento();
    } catch (error: any) {
      toast.error(error.message || 'Error al finalizar el evento.');
    } finally {
      setFinalizando(false);
    }
  };

  useEffect(() => { cargarEvento(); }, [id]);

  if (loading)
    return (
      <OrganizerLayout>
        <div className="flex items-center justify-center h-64 font-bold text-gray-400 animate-pulse">
          Sincronizando datos del evento...
        </div>
      </OrganizerLayout>
    );

  if (!evento)
    return (
      <OrganizerLayout>
        <div className="text-center p-10 bg-red-50 rounded-3xl border border-red-100 text-red-600 font-bold">
          Error 404: El evento no existe o no tienes permisos.
        </div>
      </OrganizerLayout>
    );

  const totalVendidos = eventMetrics.calcularTicketsVendidosEvento(evento);
  const totalRecaudo  = eventMetrics.calcularRecaudoEvento(evento);
  const yaFinalizado  = evento.estado === 'FINALIZADO';

  return (
    <OrganizerLayout>
      {/* ── Encabezado ── */}
      <div className="mb-10">
        <button
          onClick={() => navigate('/organizer-events')}
          className="group flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#2748E8] transition-colors uppercase tracking-widest mb-6"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver a Mis Eventos
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className={`px-3 py-1 text-[10px] font-black rounded-lg mb-4 inline-block ${
              evento.estado === 'PUBLICADO'   ? 'bg-green-100 text-green-700'  :
              evento.estado === 'FINALIZADO'  ? 'bg-gray-100 text-gray-500'   :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {String(evento.estado).toUpperCase()}
            </span>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">{evento.nombre}</h2>
            <div className="flex items-center gap-4 mt-3 text-gray-500 font-medium">
              <span className="flex items-center gap-1"><MapPin size={16} /> Recinto Principal</span>
              <span>•</span>
              <span>{evento.fechaEvento} · {evento.horaEvento}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* ✅ HU-023: Botón Finalizar con modal irreversible */}
            {!yaFinalizado && (
              <button
                onClick={() => setModalFinalizar(true)}
                disabled={loading}
                className="px-6 py-4 rounded-2xl font-black border-2 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all flex items-center gap-2"
                title="Finalizar evento — acción irreversible"
              >
                <PowerOff size={20} />
                <span className="hidden sm:inline">Finalizar Evento</span>
              </button>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={yaFinalizado}
              className="bg-[#2748E8] text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={20} /> Venta Manual
            </button>
          </div>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-[#2748E8] mb-6">
            <Users size={24} />
          </div>
          <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Entradas Vendidas</h3>
          <p className="text-3xl font-black text-gray-900">
            {totalVendidos}
            <span className="text-lg font-medium text-gray-300 ml-2">/ {evento.capacidadTotal ?? 0}</span>
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="bg-green-50 w-12 h-12 rounded-2xl flex items-center justify-center text-green-600 mb-6">
            <DollarSign size={24} />
          </div>
          <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Recaudo Bruto</h3>
          <p className="text-3xl font-black text-green-600">
            ${totalRecaudo.toLocaleString()}
            <span className="text-sm font-medium text-gray-400 ml-2">COP</span>
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
            <QrCode size={24} />
          </div>
          <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Tickets por Validar</h3>
          <p className="text-3xl font-black text-gray-900">--</p>
        </div>
      </div>

      {/* ── Accesos rápidos a paneles Sprint 3 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Ventas en tiempo real', desc: 'Contadores por zona y canal', icon: Activity,   path: 'ventas',   color: 'bg-blue-50 text-[#2748E8]'   },
          { label: 'Panel de Ingresos',     desc: 'Desglose y exportar CSV',     icon: DollarSign, path: 'ingresos', color: 'bg-green-50 text-green-600'   },
          { label: 'Check-in en vivo',      desc: 'Lista de ingresos en tiempo', icon: Users,      path: 'checkin',  color: 'bg-purple-50 text-purple-600' },
          { label: 'Estado de Zonas',       desc: 'Mapa visual con polling',     icon: BarChart2,  path: 'zonas',    color: 'bg-orange-50 text-orange-600' },
        ].map(({ label, desc, icon: Icon, path, color }) => (
          <button
            key={path}
            onClick={() => navigate(`/organizer/eventos/${id}/${path}`)}
            className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all text-left group"
          >
            <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon size={20} />
            </div>
            <p className="font-black text-gray-900 text-sm">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{desc}</p>
          </button>
        ))}
      </div>

      {/* ── Tabla de zonas ── */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-black text-gray-800">Estado de Inventario (Zonas)</h3>
          <span className="text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full">
            {evento.zonas?.length ?? 0} Zonas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                {['Zona', 'Precio Unitario', 'Capacidad / Ocupación', 'Estado'].map((h) => (
                  <th key={h} className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {evento.zonas?.map((zona, idx) => {
                const vendidos   = eventMetrics.obtenerVendidosPorZona(zona);
                const porcentaje = Math.round((vendidos / (zona.capacidadTotal || 1)) * 100);
                return (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6 font-black text-gray-800">{zona.nombreZona}</td>
                    <td className="px-8 py-6 font-bold text-[#2748E8]">
                      ${zona.precio.toLocaleString()} COP
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[100px]">
                          <div
                            className="h-full bg-blue-500 transition-all duration-1000"
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-600">
                          {vendidos} / {zona.capacidad}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 flex items-center justify-end gap-3">
                      <button
                        onClick={() => navigate(`/asistentes/${evento.eventoId}/${zona.zonaId}`)}
                        className="p-2 text-gray-400 hover:text-[#2748E8] transition-colors"
                        title="Ver lista de asistentes"
                      >
                        <Eye size={18} />
                      </button>
                      {zona.cuposDisponibles === 0 ? (
                        <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded tracking-tighter">
                          AGOTADO
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded tracking-tighter">
                          DISPONIBLE
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {(!evento.zonas || evento.zonas.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-gray-400 italic">
                    No hay zonas configuradas para este evento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modales ── */}
      <ManualSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        evento={evento}
        onSaleSuccess={cargarEvento}
      />

      {/* ✅ HU-023: Modal finalizar irreversible */}
      <ModalFinalizarEvento
        isOpen={modalFinalizar}
        nombreEvento={evento.nombre}
        onConfirm={handleFinalizar}
        onClose={() => setModalFinalizar(false)}
        cargando={finalizando}
      />
    </OrganizerLayout>
  );
};

export default DetalleEventoOrg;