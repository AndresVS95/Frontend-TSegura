import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrganizerLayout from './OrganizerLayout';
import {
  Search, UserPlus, ArrowLeft, Mail, Loader2,
  CheckCircle2, AlertCircle, Users, RefreshCw, IdCard,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { usePolling } from '../hooks/usePolling';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Asistente {
  id: string | number;
  nombreCompleto: string;
  correo: string;
  cedula: string;
  zona: string;
  estadoBoleto: 'ACTIVO' | 'USADO' | 'CANCELADO';
  estadoNft: 'MINTED' | 'PENDING';
  ticketId: string;
}

interface InfoZona {
  nombreZona: string;
  cuposTotales: number;
  cuposOcupados: number;
}

interface FormAsistente {
  correoOCedula: string;  // HU-029: búsqueda por correo o cédula
  zonaId: string;
}

const FORM_INICIAL: FormAsistente = { correoOCedula: '', zonaId: '' };

// ─── Badge estado boleto ──────────────────────────────────────────────────────
const BadgeBoleto: React.FC<{ estado: Asistente['estadoBoleto'] }> = ({ estado }) => {
  const map = {
    ACTIVO:    'bg-green-50 text-green-600',
    USADO:     'bg-gray-100 text-gray-500',
    CANCELADO: 'bg-red-50 text-red-500',
  };
  return (
    <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter ${map[estado]}`}>
      {estado}
    </span>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const PanelAsistentesZona: React.FC = () => {
  const { eventoId, zonaId } = useParams<{ eventoId: string; zonaId: string }>();
  const navigate = useNavigate();

  const [vista, setVista]           = useState<'lista' | 'formulario'>('lista');
  const [asistentes, setAsistentes] = useState<Asistente[]>([]);
  const [infoZona, setInfoZona]     = useState<InfoZona | null>(null);
  const [cargando, setCargando]     = useState(true);
  const [enviando, setEnviando]     = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [busqueda, setBusqueda]     = useState('');
  const [form, setForm]             = useState<FormAsistente>(FORM_INICIAL);
  const [horaActualizacion, setHoraActualizacion] = useState('');

  // ── HU-028: Cargar asistentes ─────────────────────────────────────────────
  const cargarAsistentes = useCallback(async () => {
    if (!eventoId || !zonaId) return;
    try {
      setError(null);

      // ── REAL: descomentar cuando JG tenga el endpoint ─────────────────
      // const { data } = await api.get(`/api/events/${eventoId}/zones/${zonaId}/attendees`);
      // setAsistentes(data.asistentes);
      // setInfoZona(data.infoZona);

      // ── MOCK ──────────────────────────────────────────────────────────
      await new Promise(r => setTimeout(r, 400));
      setAsistentes([
        { id: 1, nombreCompleto: 'Carlos Pérez',   correo: 'carlos@email.com', cedula: '10612345', zona: 'VIP',   estadoBoleto: 'ACTIVO',    estadoNft: 'MINTED', ticketId: 'TKT-001' },
        { id: 2, nombreCompleto: 'Ana Gómez',      correo: 'ana@email.com',    cedula: '20198765', zona: 'VIP',   estadoBoleto: 'USADO',     estadoNft: 'MINTED', ticketId: 'TKT-002' },
        { id: 3, nombreCompleto: 'Luis Torres',    correo: 'luis@email.com',   cedula: '10654321', zona: 'VIP',   estadoBoleto: 'ACTIVO',    estadoNft: 'PENDING', ticketId: 'TKT-003' },
        { id: 4, nombreCompleto: 'María Rodríguez',correo: 'maria@email.com',  cedula: '30111222', zona: 'VIP',   estadoBoleto: 'CANCELADO', estadoNft: 'MINTED', ticketId: 'TKT-004' },
      ]);
      setInfoZona({ nombreZona: 'VIP', cuposTotales: 80, cuposOcupados: 4 });
      setHoraActualizacion(new Date().toLocaleTimeString('es-CO'));
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al cargar asistentes del servidor.');
    } finally {
      setCargando(false);
    }
  }, [eventoId, zonaId]);

  // ── HU-028: Polling cada 10s sin recargar la página ──────────────────────
  usePolling(cargarAsistentes, 10_000, !!eventoId && !!zonaId);

  // ── HU-029: Asignar asistente manual con búsqueda por correo/cédula ──────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      // ── REAL ──────────────────────────────────────────────────────────
      // await api.post(`/api/events/${eventoId}/zones/${zonaId}/assign`, form);

      // ── MOCK ──────────────────────────────────────────────────────────
      await new Promise(r => setTimeout(r, 800));
      toast.success('¡Asistente asignado exitosamente!');
      setForm(FORM_INICIAL);
      setVista('lista');
      cargarAsistentes();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Error al asignar asistente.';
      toast.error(msg);
    } finally {
      setEnviando(false);
    }
  };

  const asistentesFiltrados = asistentes.filter((a) =>
    a.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.cedula.includes(busqueda) ||
    a.ticketId.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Indicadores de cupos
  const cuposLibres = infoZona ? infoZona.cuposTotales - infoZona.cuposOcupados : null;
  const pctOcupacion = infoZona
    ? Math.round((infoZona.cuposOcupados / infoZona.cuposTotales) * 100)
    : 0;

  return (
    <OrganizerLayout>
      <div className="animate-fade-in">

        {/* ── Encabezado ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#2748E8] transition-colors uppercase tracking-widest mb-4"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Volver al Evento
            </button>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Asistentes por Zona</h1>
            <p className="text-gray-500 mt-2 font-medium">
              {infoZona?.nombreZona ?? `Zona #${zonaId}`} · Evento #{eventoId}
            </p>
          </div>

          {/* ── Indicador cupos libres vs llenos (HU-028) ── */}
          <div className="flex gap-4">
            <div className="bg-white px-6 py-4 rounded shadow-sm border border-gray-100 text-center">
              <p className="text-3xl font-black text-gray-900 leading-none">{asistentes.length}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Registrados</p>
            </div>
            {infoZona && (
              <div className="bg-white px-6 py-4 rounded shadow-sm border border-gray-100 text-center min-w-[120px]">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-2xl font-black text-green-600">{cuposLibres}</span>
                  <span className="text-gray-300 font-medium">/ {infoZona.cuposTotales}</span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Cupos libres</p>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
                  <div
                    className={`h-1.5 rounded-full transition-all ${pctOcupacion >= 90 ? 'bg-red-500' : pctOcupacion >= 60 ? 'bg-amber-500' : 'bg-green-500'}`}
                    style={{ width: `${pctOcupacion}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-3 mb-8">
          {(['lista', 'formulario'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setVista(v)}
              className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${
                vista === v
                  ? 'bg-[#2748E8] text-white shadow-xl shadow-blue-500/20'
                  : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {v === 'lista' ? 'Lista de Asistentes' : '+ Asignar Manual'}
            </button>
          ))}

          {/* Indicador de polling */}
          <div className="ml-auto flex items-center gap-2 text-xs text-gray-400 font-medium bg-white px-4 py-2 rounded-xl border border-gray-100 self-center">
            <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
            {horaActualizacion || 'Sincronizando...'}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            VISTA: Lista — HU-028
        ══════════════════════════════════════════════ */}
        {vista === 'lista' && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/30">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, correo, cédula o ticket ID..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-100 font-medium text-gray-700 outline-none transition-all"
                />
              </div>
            </div>

            {cargando ? (
              <div className="py-20 text-center">
                <Loader2 className="w-10 h-10 text-[#2748E8] animate-spin mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                  Sincronizando con el servidor...
                </p>
              </div>
            ) : error ? (
              <div className="py-20 px-10 text-center">
                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                  <AlertCircle size={32} />
                </div>
                <h4 className="text-gray-900 font-bold mb-2">Error de Conexión</h4>
                <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">{error}</p>
                <button
                  onClick={cargarAsistentes}
                  className="text-[#2748E8] font-black text-xs uppercase tracking-wider hover:underline"
                >
                  Reintentar
                </button>
              </div>
            ) : asistentesFiltrados.length === 0 ? (
              <div className="py-20 text-center">
                <div className="bg-gray-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <Users size={40} />
                </div>
                <h4 className="text-gray-900 font-bold mb-1">Sin Asistentes</h4>
                <p className="text-gray-400 text-sm">No se encontraron registros para esta zona.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asistente</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cédula</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Ticket</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Estado Boleto</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">NFT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {asistentesFiltrados.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-black text-[#2748E8] text-sm">
                              {a.nombreCompleto.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-black text-gray-800 text-sm">{a.nombreCompleto}</p>
                              <p className="text-gray-400 text-[10px] font-medium flex items-center gap-1">
                                <Mail size={10} /> {a.correo}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="flex items-center gap-1.5 text-gray-600 text-sm font-mono">
                            <IdCard size={14} className="text-gray-300" />
                            {a.cedula}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="font-mono text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                            {a.ticketId}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <BadgeBoleto estado={a.estadoBoleto} />
                        </td>
                        <td className="px-8 py-5 text-right">
                          {a.estadoNft === 'MINTED' ? (
                            <span className="flex items-center justify-end gap-1.5 text-green-600 text-[10px] font-black">
                              <CheckCircle2 size={12} /> MINTED
                            </span>
                          ) : (
                            <span className="text-amber-500 text-[10px] font-black animate-pulse">
                              PENDING
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════
            VISTA: Formulario asignación manual — HU-029
        ══════════════════════════════════════════════ */}
        {vista === 'formulario' && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-2xl text-[#2748E8]">
                <UserPlus size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Asignación Manual</h2>
                <p className="text-sm text-gray-500 font-medium">
                  Busca al usuario por correo o cédula y asígnalo a una zona disponible.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* HU-029: Búsqueda por correo o cédula */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">
                  Correo electrónico o Cédula *
                </label>
                <input
                  type="text"
                  value={form.correoOCedula}
                  onChange={(e) => setForm({ ...form, correoOCedula: e.target.value })}
                  placeholder="Ej: usuario@email.com  ó  10612345"
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-100 font-medium outline-none transition-all"
                />
                <p className="text-[10px] text-gray-400 font-medium mt-2 px-1">
                  El usuario debe estar registrado en la plataforma.
                </p>
              </div>

              {/* HU-029: Selector de zona disponible */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">
                  Zona a Asignar *
                </label>
                <select
                  value={form.zonaId}
                  onChange={(e) => setForm({ ...form, zonaId: e.target.value })}
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-100 font-bold outline-none transition-all text-gray-700 appearance-none"
                >
                  <option value="">Selecciona una zona...</option>
                  <option value={zonaId ?? ''}>
                    Zona actual {infoZona ? `— ${cuposLibres} cupos disponibles` : ''}
                  </option>
                </select>
                {infoZona && cuposLibres === 0 && (
                  <p className="text-[10px] text-red-500 font-bold mt-2 px-1 flex items-center gap-1">
                    <AlertCircle size={10} /> Esta zona no tiene cupos disponibles
                  </p>
                )}
              </div>

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => { setVista('lista'); setForm(FORM_INICIAL); }}
                  className="flex-1 py-4 rounded-2xl font-black text-gray-400 bg-gray-50 hover:bg-gray-100 transition-all uppercase text-xs tracking-widest"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviando || !form.correoOCedula || !form.zonaId || cuposLibres === 0}
                  className="flex-[2] py-4 rounded-2xl font-black text-white bg-[#2748E8] hover:bg-blue-700 shadow-xl shadow-blue-500/20 disabled:bg-gray-200 disabled:shadow-none transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                >
                  {enviando
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : 'Confirmar Asignación'
                  }
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </OrganizerLayout>
  );
};

export default PanelAsistentesZona;