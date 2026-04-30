// src/pages/ComprarBoletos.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import MapaInteractivo from '../components/MapaInteractivo';
import type { Evento, Zona } from '../types/event.types';

export const ComprarBoletos: React.FC = () => {
  // ✅ Nombres correctos — coinciden con la ruta /comprar/:eventoId/zona/:zonaId
  const { eventoId, zonaId: zonaIdParam } = useParams<{ eventoId: string; zonaId: string }>();
  const navigate = useNavigate();

  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ zonaSeleccionada se inicializa con el nombreZona que viene del mapa
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string | null>(null);
  const [cantidadBoletas, setCantidadBoletas] = useState(1);

  // ✅ Disponibilidad como Record — igual que en EventoDetalle
  const [disponibilidad, setDisponibilidad] = useState<Record<string, 'DISPONIBLE' | 'AGOTADO'>>({});

  // ── Carga inicial del evento ──────────────────────────────────────────────
  useEffect(() => {
    const cargarEvento = async () => {
      try {
        if (!eventoId) return;
        const data = await eventService.obtenerEventoPorId(eventoId);
        setEvento(data);

        // Calcular disponibilidad inicial desde los datos del evento
        if (data.zonas) {
          const dispInicial: Record<string, 'DISPONIBLE' | 'AGOTADO'> = {};
          data.zonas.forEach((z: Zona) => {
            const key = (z.nombreZona || '').toUpperCase().trim();
            dispInicial[key] = (z.cuposDisponibles ?? 0) > 0 ? 'DISPONIBLE' : 'AGOTADO';
          });
          setDisponibilidad(dispInicial);

          // ✅ Pre-seleccionar zona si viene de EventoDetalle
          // zonaIdParam es el zonaId numérico — buscamos el nombreZona correspondiente
          if (zonaIdParam) {
            const zonaPreseleccionada = data.zonas.find(
              (z: Zona) => String(z.zonaId) === String(zonaIdParam)
            );
            if (zonaPreseleccionada?.nombreZona) {
              setZonaSeleccionada(zonaPreseleccionada.nombreZona.toUpperCase().trim());
            }
          }
        }
      } catch (error: any) {
        console.error('Error al cargar evento:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarEvento();
  }, [eventoId, zonaIdParam]);

  // ── Polling de disponibilidad cada 15s ───────────────────────────────────
  useEffect(() => {
    if (!eventoId) return;
    const intervalId = setInterval(async () => {
      try {
        const nuevaDisp = await eventService.obtenerDisponibilidadZonas(eventoId);
        setDisponibilidad(nuevaDisp);
      } catch (error) {
        console.warn('Error actualizando disponibilidad:', error);
      }
    }, 15_000);
    return () => clearInterval(intervalId);
  }, [eventoId]);

  const handleSeleccionarZona = (nombreZona: string) => {
    setZonaSeleccionada(nombreZona);
    setCantidadBoletas(1);
  };

  // Zona activa — busca por nombreZona normalizado
  const zonaData: Zona | undefined = evento?.zonas?.find(
    (z) => (z.nombreZona || '').toUpperCase().trim() === zonaSeleccionada
  );

  const totalPagar = (zonaData?.precio ?? 0) * cantidadBoletas;

  // ── Navegación al pago ───────────────────────────────────────────────────
  const handleIrAPagar = () => {
    if (!zonaData || !evento) return;
    // Navega a PagoReserva pasando los datos como state para no depender del backend aún
    navigate(`/pago/${zonaData.zonaId}`, {
      state: {
        eventoNombre: evento.nombre,
        zonaNombre: zonaData.nombreZona,
        cantidad: cantidadBoletas,
        precioUnitario: zonaData.precio,
        total: totalPagar,
      },
    });
  };

  // ── Renders condicionales ─────────────────────────────────────────────────
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#1E5ADF] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Cargando evento...</p>
        </div>
      </div>
    );

  if (!evento)
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-xl font-bold text-gray-700 mb-4">Evento no encontrado.</p>
          <button
            onClick={() => navigate(-1)}
            className="text-[#1E5ADF] font-semibold hover:underline"
          >
            ← Volver
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Botón Volver */}
      <div className="max-w-7xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="font-bold text-gray-500 hover:text-[#1E5ADF] transition-colors"
        >
          ← Volver
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ── Columna izquierda: Mapa ── */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center">
          <h2 className="text-3xl font-black text-gray-900 mb-2">{evento.nombre}</h2>
          <p className="text-gray-500 mb-6 text-sm">
            {evento.fechaEvento} — {evento.nombreRecinto || 'Recinto Principal'}
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Selecciona o cambia la zona en el mapa
          </p>

          <div className="w-full max-w-lg">
            <MapaInteractivo
              modoInteractivo={true}
              zonaSeleccionada={zonaSeleccionada}
              onZonaClick={handleSeleccionarZona}
              disponibilidad={disponibilidad}
            />
          </div>
        </div>

        {/* ── Columna derecha: Panel de compra ── */}
        <div className="flex flex-col justify-center">
          {zonaSeleccionada && zonaData ? (
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border-2 border-[#1E5ADF] sticky top-10">
              <span className="bg-blue-100 text-[#1E5ADF] px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                Zona Seleccionada
              </span>

              <h3 className="text-4xl font-black text-gray-900 mt-4 mb-2">
                {zonaData.nombreZona}
              </h3>

              <div className="flex justify-between items-end border-b border-gray-100 pb-6 mb-6">
                <div>
                  <p className="text-gray-500 text-sm">Precio por boleta</p>
                  <p className="text-3xl font-bold text-[#1E5ADF]">
                    ${zonaData.precio.toLocaleString('es-CO')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">Disponibilidad</p>
                  <p className={`font-bold ${(zonaData.cuposDisponibles ?? 0) > 10 ? 'text-green-500' : 'text-orange-500'}`}>
                    {zonaData.cuposDisponibles ?? 0} cupos
                  </p>
                </div>
              </div>

              {/* Cantidad */}
              <div className="mb-8">
                <p className="text-gray-700 font-bold mb-4">Cantidad de boletas:</p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCantidadBoletas(Math.max(1, cantidadBoletas - 1))}
                    className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-xl font-bold hover:border-[#1E5ADF] hover:text-[#1E5ADF] transition-colors"
                  >
                    −
                  </button>
                  <span className="text-2xl font-black w-10 text-center">{cantidadBoletas}</span>
                  <button
                    onClick={() => setCantidadBoletas(Math.min(zonaData.cuposDisponibles ?? 1, cantidadBoletas + 1))}
                    className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-xl font-bold hover:border-[#1E5ADF] hover:text-[#1E5ADF] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gray-50 p-6 rounded-2xl mb-8 flex justify-between items-center">
                <span className="font-bold text-gray-600">Total a pagar:</span>
                <span className="text-2xl font-black text-gray-900">
                  ${totalPagar.toLocaleString('es-CO')}
                </span>
              </div>

              <button
                onClick={handleIrAPagar}
                disabled={(zonaData.cuposDisponibles ?? 0) === 0}
                className="w-full py-5 bg-[#0F172A] text-white rounded-2xl font-bold text-lg hover:bg-[#1E5ADF] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20"
              >
                {(zonaData.cuposDisponibles ?? 0) === 0 ? 'Zona Agotada' : 'Ir a Pagar →'}
              </button>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl text-gray-300">👆</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">
                Ninguna zona seleccionada
              </h3>
              <p className="text-gray-400">
                Toca cualquier sección en el mapa para ver precios y elegir tus boletas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComprarBoletos;