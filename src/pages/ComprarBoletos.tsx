// src/pages/ComprarBoletos.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import MapaInteractivo from '../components/MapaInteractivo';

// Definición de tipos basada en lo que envía el Backend
interface Zona {
  zonaId: string | number;
  nombreZona: string;
  precio: number;
  cuposDisponibles: number;
  capacidadTotal?: number;
}

interface Evento {
  eventoId: number;
  nombre: string;
  fechaEvento: string;
  urlImagen?: string;
  zonas: Zona[];
}

export const ComprarBoletos: React.FC = () => {
  // Solo necesitamos el ID del evento de la URL (Ej: /evento/5)
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Estados para la HU-007 (Mapa y Panel)
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string | null>(null);
  const [cantidadBoletas, setCantidadBoletas] = useState<number>(1);
  
  // Estado para guardar la disponibilidad en tiempo real (Polling)
  const [disponibilidadZonas, setDisponibilidadZonas] = useState<Zona[]>([]);

  // 1. CARGA INICIAL (HU-006: Ver detalle de evento)
  useEffect(() => {
    const cargarEvento = async () => {
      try {
        if (!id) return;
        const data = await eventService.obtenerEventoPorId(id);
        setEvento(data);
        setDisponibilidadZonas(data.zonas || []); // Iniciamos con los datos base
      } catch (error) {
        console.error("Error al cargar detalles del evento:", error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarEvento();
  }, [id]);

  // 2. POLLING DE DISPONIBILIDAD (HU-007: Polling SVG cada 15s)
  useEffect(() => {
    if (!id) return;

    const intervalId = setInterval(async () => {
      try {
        // Llamamos al nuevo endpoint de JG: GET /events/{id}/zones/availability
        const nuevaDisponibilidad = await eventService.obtenerDisponibilidadZonas(id);
        setDisponibilidadZonas(nuevaDisponibilidad);
        console.log("Disponibilidad actualizada de fondo (Polling)");
      } catch (error) {
        console.error("Error actualizando disponibilidad:", error);
      }
    }, 15000); // Se ejecuta cada 15.000 ms (15 segundos)

    // Función de limpieza: apaga el reloj si el usuario cambia de página
    return () => clearInterval(intervalId);
  }, [id]);

  // Función controladora al hacer clic en el Mapa SVG
  const handleSeleccionarZona = (zonaId: string) => {
    setZonaSeleccionada(zonaId);
    setCantidadBoletas(1); // Reiniciamos el contador a 1 al cambiar de zona
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-xl">Cargando evento...</div>;
  if (!evento) return <div className="min-h-screen flex items-center justify-center font-bold text-xl">Evento no encontrado.</div>;

  // Buscamos los datos exactos de la zona seleccionada para mostrarlos en el panel
  const zonaData = disponibilidadZonas.find(z => z.nombreZona.toUpperCase() === zonaSeleccionada);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Botón Volver */}
      <div className="max-w-7xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className="font-bold text-gray-500 hover:text-[#1E5ADF]">
          ← Volver al catálogo
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* COLUMNA IZQUIERDA: EL MAPA INTERACTIVO */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center">
          <h2 className="text-3xl font-black text-gray-900 mb-2">{evento.nombre}</h2>
          <p className="text-gray-500 mb-8">Selecciona la zona en el mapa para continuar</p>
          
          <div className="w-full max-w-lg">
            <MapaInteractivo 
              modoInteractivo={true}
              zonaSeleccionada={zonaSeleccionada}
              onZonaClick={handleSeleccionarZona}
            />
          </div>
        </div>

        {/* COLUMNA DERECHA: PANEL DE ZONA SELECCIONADA (HU-007) */}
        <div className="flex flex-col justify-center">
          {zonaSeleccionada && zonaData ? (
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border-2 border-[#1E5ADF] animate-fade-in sticky top-10">
              <span className="bg-blue-100 text-[#1E5ADF] px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                Zona Seleccionada
              </span>
              <h3 className="text-4xl font-black text-gray-900 mt-4 mb-2">{zonaData.nombreZona}</h3>
              
              <div className="flex justify-between items-end border-b border-gray-100 pb-6 mb-6">
                <div>
                  <p className="text-gray-500 text-sm">Precio por boleta</p>
                  <p className="text-3xl font-bold text-[#1E5ADF]">${zonaData.precio}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">Disponibilidad</p>
                  <p className={`font-bold ${zonaData.cuposDisponibles > 10 ? 'text-green-500' : 'text-orange-500'}`}>
                    {zonaData.cuposDisponibles} cupos
                  </p>
                </div>
              </div>

              {/* Controles de Cantidad */}
              <div className="mb-8">
                <p className="text-gray-700 font-bold mb-4">Cantidad de boletas:</p>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setCantidadBoletas(Math.max(1, cantidadBoletas - 1))}
                    className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-xl font-bold hover:border-[#1E5ADF] hover:text-[#1E5ADF] transition-colors"
                  >
                    -
                  </button>
                  <span className="text-2xl font-black w-10 text-center">{cantidadBoletas}</span>
                  <button 
                    onClick={() => setCantidadBoletas(Math.min(zonaData.cuposDisponibles, cantidadBoletas + 1))}
                    className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-xl font-bold hover:border-[#1E5ADF] hover:text-[#1E5ADF] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl mb-8 flex justify-between items-center">
                <span className="font-bold text-gray-600">Total a pagar:</span>
                <span className="text-2xl font-black text-gray-900">${zonaData.precio * cantidadBoletas}</span>
              </div>

              <button 
                disabled={zonaData.cuposDisponibles === 0}
                className="w-full py-5 bg-[#0F172A] text-white rounded-2xl font-bold text-lg hover:bg-[#1E5ADF] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20"
              >
                {zonaData.cuposDisponibles === 0 ? 'Zona Agotada' : 'Ir a Pagar'}
              </button>
            </div>
          ) : (
            /* Estado Vacío si no ha tocado nada */
            <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl text-gray-300">👆</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">Aún no hay zona seleccionada</h3>
              <p className="text-gray-400">Toca cualquier sección en el mapa para ver los precios y elegir tus boletas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComprarBoletos;