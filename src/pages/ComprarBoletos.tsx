import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { eventService } from '../services/eventService';
import MapaInteractivo from '../components/MapaInterativo'; 

interface Evento {
  nombre: string;
}

interface Silla {
  asientoId: number;
  fila: string;
  numero: number;
  estado: string;
}

export const ComprarBoletos: React.FC = () => {
  const { eventoId, zonaId } = useParams<{ eventoId: string; zonaId: string }>(); 
  
  const [evento, setEvento] = useState<Evento | null>(null);
  const [sillas, setSillas] = useState<Silla[]>([]);
  const [sillasSeleccionadas, setSillasSeleccionadas] = useState<number[]>([]);
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (!eventoId || !zonaId) return;

        const [datosEvento, datosSillas, mapaSvg] = await Promise.all([
          eventService.obtenerDatosEvento(eventoId),
          eventService.obtenerSillasDeZona(zonaId),
          eventService.descargarSvgMapa()
        ]);

        setEvento(datosEvento);
        setSillas(datosSillas);
        setSvgContent(mapaSvg);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    
    cargarDatos();
  }, [eventoId, zonaId]);

  // Función controladora para agregar o quitar sillas del carrito
  const handleToggleSilla = (sillaId: number) => {
    setSillasSeleccionadas(prev => 
      prev.includes(sillaId) 
        ? prev.filter(id => id !== sillaId) 
        : [...prev, sillaId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 md:p-10 text-center">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
        
        <h2 className="text-3xl font-black text-[#03292e] mb-2">
          {evento ? evento.nombre : 'Cargando Evento...'}
        </h2>
        
        <p className="text-[#1E5ADF] font-bold text-lg mb-6">
          Sillas en tu carrito: {sillasSeleccionadas.length}
        </p>
        
        {/* Usamos el componente aislado para el dibujo del SVG */}
        <MapaInteractivo 
          svgContent={svgContent}
          sillas={sillas}
          sillasSeleccionadas={sillasSeleccionadas}
          onToggleSilla={handleToggleSilla}
        />
        
        <div className="mt-8">
          <button 
            disabled={sillasSeleccionadas.length === 0}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
              sillasSeleccionadas.length === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-[#1E5ADF] text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
            }`}
          >
            Ir a Pagar
          </button>
        </div>

      </div>
    </div>
  );
};