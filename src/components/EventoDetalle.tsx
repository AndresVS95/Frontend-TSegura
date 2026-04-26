// src/pages/EventoDetalle.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { eventService } from '../services/eventService';
import MapaInteractivo from '../components/MapaInteractivo';
import { tokenManager } from '../lib/tokenManager';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Zona {
  zonaId: string | number;
  nombreZona: string;
  precio: number;
  cuposDisponibles: number;
  capacidadTotal: number;
}

interface Evento {
  eventoId: number;       // ✅ corregido: el backend devuelve eventoId, no eventId
  nombre: string;
  descripcion?: string;
  urlImagen?: string;
  fechaEvento: string;
  horaEvento: string;
  nombreRecinto?: string;
  edadMinima?: number;
  zonas?: Zona[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convierte el nombre de zona del backend al ID que usa el mapa SVG */
const normalizarZonaId = (nombre: string): string => nombre.toUpperCase().trim();

/** Calcula el color del badge de disponibilidad */
const getBadgeStyle = (cupos: number): string =>
  cupos === 0
    ? 'bg-red-100 text-red-700'
    : cupos < 20
    ? 'bg-amber-100 text-amber-700'
    : 'bg-green-100 text-green-700';

const getBadgeLabel = (cupos: number): string =>
  cupos === 0 ? 'Agotada' : cupos < 20 ? `¡Solo ${cupos} cupos!` : `${cupos} disponibles`;

// ─── Componente Principal ─────────────────────────────────────────────────────
const EventoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado del mapa y panel lateral
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string | null>(null);
  const [disponibilidad, setDisponibilidad] = useState<Record<string, 'DISPONIBLE' | 'AGOTADO'>>({});

  // ── Carga inicial del evento ──────────────────────────────────────────────
  useEffect(() => {
    const cargarDatos = async () => {
      // ✅ Verificar token ANTES de hacer el request
      // Si no hay token, redirigir al login guardando la ruta actual
      if (!tokenManager.isValid()) {
        navigate('/login', { state: { from: location }, replace: true });
        return;
      }

      try {
        if (id) {
          const data = await eventService.obtenerEventoPorId(id);
          setEvento(data);

          if (data.zonas) {
            const dispInicial: Record<string, 'DISPONIBLE' | 'AGOTADO'> = {};
            data.zonas.forEach((z: Zona) => {
              dispInicial[normalizarZonaId(z.nombreZona)] =
                z.cuposDisponibles > 0 ? 'DISPONIBLE' : 'AGOTADO';
            });
            setDisponibilidad(dispInicial);
          }
        }
      } catch (error: any) {
        // ✅ Si el backend devuelve 403, redirigir al login
        if (error?.response?.status === 403 || error?.response?.status === 401) {
          tokenManager.remove();
          navigate('/login', { state: { from: location }, replace: true });
          return;
        }
        console.error('Error al cargar detalle:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id, navigate, location]);

  // ── Polling de disponibilidad cada 15s (HU-007) ──────────────────────────
  const fetchDisponibilidad = useCallback(async () => {
    if (!id) return;
    try {
      // Endpoint esperado: GET /events/{id}/zones/availability
      // Respuesta esperada: { VIP: 'DISPONIBLE', PLATA: 'AGOTADO', GENERAL: 'DISPONIBLE' }
      const data = await eventService.obtenerDisponibilidadZonas(id);
      setDisponibilidad(data);

      // Actualizar cupos en el estado del evento también
      setEvento((prev) => {
        if (!prev || !prev.zonas) return prev;
        const updatedZonas = prev.zonas.map((z) => {
          const key = normalizarZonaId(z.nombreZona);
          return data[key] === 'AGOTADO' ? { ...z, cuposDisponibles: 0 } : z;
        });
        return { ...prev, zonas: updatedZonas };
      });
    } catch (error) {
      // Silencioso: no interrumpe la UX si falla el polling
      console.warn('Polling disponibilidad falló (se reintentará):', error);
    }
  }, [id]);

  useEffect(() => {
    // No arrancar el polling hasta que el evento haya cargado
    if (!evento) return;

    fetchDisponibilidad(); // llamada inmediata al montar
    const intervalo = setInterval(fetchDisponibilidad, 15_000); // cada 15 segundos
    return () => clearInterval(intervalo); // limpieza al desmontar
  }, [evento, fetchDisponibilidad]);

  // ── Zona activa (la que coincide con zonaSeleccionada) ────────────────────
  const zonaActiva: Zona | undefined = evento?.zonas?.find(
    (z) => normalizarZonaId(z.nombreZona) === zonaSeleccionada
  );

  // ── Manejar botón "Comprar" ───────────────────────────────────────────────
  const handleComprar = () => {
    if (!zonaActiva) return;
    // ✅ Ruta corregida — coincide con App.tsx /comprar/:eventoId/zona/:zonaId
    navigate(`/comprar/${id}/zona/${zonaActiva.zonaId}`);
  };

  // ── Renders condicionales ─────────────────────────────────────────────────
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#1E5ADF] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Cargando detalles del evento…</p>
        </div>
      </div>
    );

  if (!evento)
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-xl">Evento no encontrado.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-[#1E5ADF] font-semibold hover:underline"
        >
          ← Volver al catálogo
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ── Botón Volver ── */}
      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#1E5ADF] font-semibold transition-colors"
        >
          ← Volver al catálogo
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ══════════════════════════════════════════════════════════════
            COLUMNA IZQUIERDA: Imagen e info del evento (2 columnas)
        ══════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-8">
          <img
            src={evento.urlImagen || 'https://via.placeholder.com/800x400'}
            alt={evento.nombre}
            className="w-full h-[380px] object-cover rounded-[2.5rem] shadow-2xl"
          />

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h1 className="text-4xl font-black text-gray-900 mb-4">{evento.nombre}</h1>
            <p className="text-gray-500 leading-relaxed text-lg mb-8">
              {evento.descripcion || 'Sin descripción disponible para este evento.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Fecha y Hora
                </span>
                <p className="text-lg font-bold text-gray-800 mt-1">
                  {evento.fechaEvento} — {evento.horaEvento}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Lugar
                </span>
                <p className="text-lg font-bold text-gray-800 mt-1">
                  {evento.nombreRecinto || 'Recinto Principal'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            COLUMNA DERECHA: Mapa + Panel de zona seleccionada
        ══════════════════════════════════════════════════════════════ */}
        <div className="space-y-6">

          {/* ── Mapa interactivo ── */}
          <div className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">
              Mapa del Recinto
            </h3>
            <div className="aspect-square bg-gray-50 rounded-[1.5rem] overflow-hidden flex items-center justify-center">
              <MapaInteractivo
                modoInteractivo={true}
                zonaSeleccionada={zonaSeleccionada}
                onZonaClick={setZonaSeleccionada}
                disponibilidad={disponibilidad}
              />
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Toca una zona para ver detalles
            </p>
          </div>

          {/* ── Panel de zona seleccionada (HU-007) ── */}
          {zonaActiva ? (
            <div className="bg-white p-7 rounded-[2rem] shadow-xl border-2 border-[#1E5ADF] transition-all animate-fade-in">
              {/* Cabecera */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-gray-900">
                  Zona {zonaActiva.nombreZona}
                </h2>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${getBadgeStyle(
                    zonaActiva.cuposDisponibles
                  )}`}
                >
                  {getBadgeLabel(zonaActiva.cuposDisponibles)}
                </span>
              </div>

              {/* Precio */}
              <div className="mb-5">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Precio por boleto
                </span>
                <p className="text-3xl font-black text-[#1E5ADF] mt-1">
                  ${zonaActiva.precio.toLocaleString('es-CO')}
                  <span className="text-sm font-normal text-gray-400 ml-1">COP</span>
                </p>
              </div>

              {/* Barra de ocupación */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Ocupación</span>
                  <span>
                    {zonaActiva.capacidadTotal - zonaActiva.cuposDisponibles} /{' '}
                    {zonaActiva.capacidadTotal}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-[#1E5ADF] h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${
                        ((zonaActiva.capacidadTotal - zonaActiva.cuposDisponibles) /
                          zonaActiva.capacidadTotal) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Botón comprar */}
              <button
                onClick={handleComprar}
                disabled={zonaActiva.cuposDisponibles === 0}
                className="w-full bg-[#1E5ADF] hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl transition-all"
              >
                {zonaActiva.cuposDisponibles === 0 ? 'Zona Agotada' : 'Comprar Boleto'}
              </button>

              <button
                onClick={() => setZonaSeleccionada(null)}
                className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
              >
                Deseleccionar zona
              </button>
            </div>
          ) : (
            /* ── Estado vacío: instrucción para el usuario ── */
            <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#1E5ADF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-700 mb-2">Selecciona una zona</h3>
              <p className="text-sm text-gray-400">
                Haz clic en cualquier zona del mapa para ver precios y disponibilidad.
              </p>

              {/* Lista compacta de zonas disponibles */}
              <div className="mt-5 space-y-2">
                {evento.zonas?.map((z) => (
                  <button
                    key={z.zonaId}
                    onClick={() =>
                      disponibilidad[normalizarZonaId(z.nombreZona)] !== 'AGOTADO' &&
                      setZonaSeleccionada(normalizarZonaId(z.nombreZona))
                    }
                    disabled={disponibilidad[normalizarZonaId(z.nombreZona)] === 'AGOTADO'}
                    className="w-full flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:border-[#1E5ADF] hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-left"
                  >
                    <span className="font-semibold text-gray-700 text-sm">{z.nombreZona}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#1E5ADF] font-bold text-sm">
                        ${z.precio.toLocaleString('es-CO')}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeStyle(z.cuposDisponibles)}`}>
                        {getBadgeLabel(z.cuposDisponibles)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nota legal */}
          {evento.edadMinima && (
            <p className="text-xs text-gray-400 text-center">
              * Edad mínima requerida: {evento.edadMinima} años
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventoDetalle;