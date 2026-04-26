// src/components/PanelAsistentesZona.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

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

// Mock temporal mientras JG entrega los endpoints
const MOCK_ASISTENTES: Asistente[] = [
  { id: 1, nombreCompleto: 'Carlos Pérez', correo: 'carlos@email.com', zona: 'VIP', estadoNft: 'MINTED', ticketId: 'TKT-001' },
  { id: 2, nombreCompleto: 'Ana Gómez', correo: 'ana@email.com', zona: 'VIP', estadoNft: 'MINTED', ticketId: 'TKT-002' },
  { id: 3, nombreCompleto: 'Luis Torres', correo: 'luis@email.com', zona: 'VIP', estadoNft: 'PENDING', ticketId: 'TKT-003' },
];

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
  const [exito, setExito] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // ── Cargar asistentes ─────────────────────────────────────────────────────
  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);

        // ── REAL: descomentar cuando JG tenga el endpoint ─────────────────
        // const { data } = await api.get(
        //   `/api/organizer/events/${eventoId}/zones/${zonaId}/attendees`
        // );
        // setAsistentes(data);

        // ── MOCK ──────────────────────────────────────────────────────────
        await new Promise((r) => setTimeout(r, 600));
        setAsistentes(MOCK_ASISTENTES);
      } catch (e) {
        console.error('Error cargando asistentes:', e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [eventoId, zonaId]);

  // ── Registrar asistente manual ────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      // ── REAL: descomentar cuando JG tenga el endpoint ─────────────────
      // await api.post(
      //   `/api/organizer/events/${eventoId}/zones/${zonaId}/attendees`,
      //   form
      // );

      // ── MOCK ──────────────────────────────────────────────────────────
      await new Promise((r) => setTimeout(r, 800));
      const nuevoAsistente: Asistente = {
        id: Date.now(),
        nombreCompleto: form.nombreCompleto,
        correo: form.correo,
        zona: 'Manual',
        estadoNft: 'PENDING',
        ticketId: `TKT-${Date.now()}`,
      };
      setAsistentes((prev) => [nuevoAsistente, ...prev]);

      setExito(true);
      setForm(FORM_INICIAL);
      setTimeout(() => {
        setExito(false);
        setVista('lista');
      }, 2000);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Error al registrar asistente.');
    } finally {
      setEnviando(false);
    }
  };

  const asistentesFiltrados = asistentes.filter(
    (a) =>
      a.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* ── Encabezado ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-400 hover:text-[#1E5ADF] font-semibold mb-2 block"
            >
              ← Volver
            </button>
            <h1 className="text-3xl font-black text-gray-900">Panel de Asistentes</h1>
            <p className="text-gray-500 mt-1">
              Evento #{eventoId} — Zona #{zonaId}
            </p>
          </div>

          {/* Contador */}
          <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-black text-[#1E5ADF]">{asistentes.length}</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Asistentes</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setVista('lista')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              vista === 'lista'
                ? 'bg-[#1E5ADF] text-white shadow-lg shadow-blue-500/20'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-[#1E5ADF]'
            }`}
          >
            📋 Lista de asistentes
          </button>
          <button
            onClick={() => setVista('formulario')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              vista === 'formulario'
                ? 'bg-[#1E5ADF] text-white shadow-lg shadow-blue-500/20'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-[#1E5ADF]'
            }`}
          >
            ➕ Registrar manual
          </button>
        </div>

        {/* ══════════════════════════════════════════════
            VISTA: Lista de asistentes
        ══════════════════════════════════════════════ */}
        {vista === 'lista' && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            {/* Buscador */}
            <div className="p-6 border-b border-gray-100">
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E5ADF] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
              />
            </div>

            {cargando ? (
              <div className="p-10 text-center">
                <div className="w-8 h-8 border-4 border-[#1E5ADF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Cargando asistentes...</p>
              </div>
            ) : asistentesFiltrados.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <span className="text-4xl block mb-3">👥</span>
                <p className="font-semibold">
                  {busqueda ? 'Sin resultados para tu búsqueda' : 'No hay asistentes registrados'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {asistentesFiltrados.map((a) => (
                  <div key={a.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Avatar inicial */}
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-black text-[#1E5ADF]">
                        {a.nombreCompleto.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{a.nombreCompleto}</p>
                        <p className="text-gray-400 text-xs">{a.correo}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 font-mono">{a.ticketId}</span>
                      {a.estadoNft === 'MINTED' ? (
                        <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase">
                          NFT ✓
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black px-2 py-1 rounded-full uppercase animate-pulse">
                          Procesando
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════
            VISTA: Formulario registro manual
        ══════════════════════════════════════════════ */}
        {vista === 'formulario' && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-2">Registro Manual</h2>
            <p className="text-gray-500 text-sm mb-8">
              Registra un asistente directamente sin pasar por la pasarela de pago.
            </p>

            {exito && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 font-bold text-sm text-center">
                ✓ Asistente registrado correctamente
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={form.nombreCompleto}
                  onChange={(e) => setForm({ ...form, nombreCompleto: e.target.value })}
                  placeholder="Ej: Juan García"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E5ADF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  placeholder="Ej: juan@email.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E5ADF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Número de Documento *
                </label>
                <input
                  type="text"
                  value={form.numeroDocumento}
                  onChange={(e) => setForm({ ...form, numeroDocumento: e.target.value })}
                  placeholder="Ej: 1234567890"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E5ADF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setVista('lista'); setForm(FORM_INICIAL); setError(null); }}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={enviando || !form.nombreCompleto || !form.correo || !form.numeroDocumento}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-[#1E5ADF] hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {enviando ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Registrando...</>
                  ) : (
                    'Registrar Asistente'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelAsistentesZona;