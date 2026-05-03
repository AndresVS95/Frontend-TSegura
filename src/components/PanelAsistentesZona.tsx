// src/components/PanelAsistentesZona.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import OrganizerLayout from './OrganizerLayout';
import { Search, UserPlus, ArrowLeft, Mail, Ticket as TicketIcon, Loader2, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Asistente {
  id: string | number;
  nombreCompleto: string;
  correo: string;
  zona: string;
  estadoNft: 'MINTED' | 'PENDING';
  ticketId: string;
}

interface FormAsistente {
  nombreCompleto: string;
  correo: string;
  numeroDocumento: string;
}

const FORM_INICIAL: FormAsistente = {
  nombreCompleto: '',
  correo: '',
  numeroDocumento: '',
};

// ─── Componente principal ─────────────────────────────────────────────────────
const PanelAsistentesZona: React.FC = () => {
  const { eventoId, zonaId } = useParams<{ eventoId: string; zonaId: string }>();
  const navigate = useNavigate();

  const [vista, setVista] = useState<'lista' | 'formulario'>('lista');
  const [asistentes, setAsistentes] = useState<Asistente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [form, setForm] = useState<FormAsistente>(FORM_INICIAL);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');

  // ── Cargar asistentes ─────────────────────────────────────────────────────
  const cargarAsistentes = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // Intentar el endpoint real
      const { data } = await api.get(`/api/eventos/${eventoId}/zonas/${zonaId}/asistentes`);
      setAsistentes(data);
    } catch (e: any) {
      console.error('Error cargando asistentes:', e);
      setError(e.response?.data?.message || 'No se pudieron cargar los asistentes del servidor. Verifica que el endpoint exista.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (eventoId && zonaId) {
      cargarAsistentes();
    }
  }, [eventoId, zonaId]);

  // ── Registrar asistente manual ────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      await api.post(`/api/eventos/${eventoId}/zonas/${zonaId}/asistentes`, form);
      toast.success("¡Asistente registrado exitosamente!");
      setForm(FORM_INICIAL);
      setVista('lista');
      cargarAsistentes(); // Recargar lista
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Error al registrar asistente.';
      setError(msg);
      toast.error(msg);
    } finally {
      setEnviando(false);
    }
  };

  const asistentesFiltrados = asistentes.filter(
    (a) =>
      a.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (a.ticketId && a.ticketId.toLowerCase().includes(busqueda.toLowerCase()))
  );

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
              Gestiona el listado de acceso para la zona seleccionada.
            </p>
          </div>

          <div className="bg-white px-8 py-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#2748E8]">
              <Users size={24} />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 leading-none">{asistentes.length}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Registrados</p>
            </div>
          </div>
        </div>

        {/* ── Tabs de Navegación Local ── */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setVista('lista')}
            className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${
              vista === 'lista'
                ? 'bg-[#2748E8] text-white shadow-xl shadow-blue-500/20'
                : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            Lista de Asistentes
          </button>
          <button
            onClick={() => setVista('formulario')}
            className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${
              vista === 'formulario'
                ? 'bg-[#2748E8] text-white shadow-xl shadow-blue-500/20'
                : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            + Registro Manual
          </button>
        </div>

        {/* ══════════════════════════════════════════════
            VISTA: Lista de asistentes
        ══════════════════════════════════════════════ */}
        {vista === 'lista' && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            {/* Buscador Superior */}
            <div className="p-8 border-b border-gray-50 bg-gray-50/30">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, correo o ID de ticket..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-100 font-medium text-gray-700 outline-none transition-all"
                />
              </div>
            </div>

            {cargando ? (
              <div className="py-20 text-center">
                <Loader2 className="w-10 h-10 text-[#2748E8] animate-spin mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Sincronizando con el servidor...</p>
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
                  Reintentar conexión
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
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Ticket ID</th>
                      <th className="px-8 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {asistentesFiltrados.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50/50 transition-colors group">
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
                        <td className="px-8 py-5 text-center">
                          <span className="font-mono text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                            {a.ticketId}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                             {a.estadoNft === 'MINTED' ? (
                                <span className="flex items-center gap-1.5 bg-green-50 text-green-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">
                                  <CheckCircle2 size={12} /> NFT Minted
                                </span>
                             ) : (
                                <span className="bg-amber-50 text-amber-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter animate-pulse">
                                  Pending
                                </span>
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
        )}

        {/* ══════════════════════════════════════════════
            VISTA: Formulario registro manual
        ══════════════════════════════════════════════ */}
        {vista === 'formulario' && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-2xl text-[#2748E8]">
                <UserPlus size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Registro Manual</h2>
                <p className="text-sm text-gray-500 font-medium">Asigna una entrada directa a esta zona.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">
                    Nombre Completo del Asistente
                  </label>
                  <input
                    type="text"
                    value={form.nombreCompleto}
                    onChange={(e) => setForm({ ...form, nombreCompleto: e.target.value })}
                    placeholder="Ej: Andres Villa"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-100 font-medium outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={form.correo}
                    onChange={(e) => setForm({ ...form, correo: e.target.value })}
                    placeholder="Ej: andres@tsegura.com"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-100 font-medium outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">
                    Documento de Identidad
                  </label>
                  <input
                    type="text"
                    value={form.numeroDocumento}
                    onChange={(e) => setForm({ ...form, numeroDocumento: e.target.value })}
                    placeholder="Ej: 1061722..."
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-100 font-medium outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => { setVista('lista'); setForm(FORM_INICIAL); setError(null); }}
                  className="flex-1 py-4 rounded-2xl font-black text-gray-400 bg-gray-50 hover:bg-gray-100 transition-all uppercase text-xs tracking-widest"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviando || !form.nombreCompleto || !form.correo || !form.numeroDocumento}
                  className="flex-[2] py-4 rounded-2xl font-black text-white bg-[#2748E8] hover:bg-blue-700 shadow-xl shadow-blue-500/20 disabled:bg-gray-200 disabled:shadow-none transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                >
                  {enviando ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Emitir Registro'
                  )}
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