// src/components/VenueMap.tsx (Actualizado para el Organizador)
import React, { useEffect, useState, useRef } from 'react'; // IMPORTANTE: useRef agregado aquí
import { eventService } from '../services/eventService';

interface Zona {
  nombreZona: string;
  capacidad: number;
  precio: number;
  asientosNumerados: boolean;
}

// Colores por ZONA para el Organizador (Definir precios)
const ZONE_COLORS: Record<string, string> = {
  'VIP': '#F59E0B',      // Dorado
  'GENERAL': '#10B981',  // Verde
  'PLATA': '#EC4899',   // Rosa
  'PALCO': '#8B5CF6',    // Morado
  'PLATINO': '#3B82F6',  // Azul
};

interface VenueMapProps {
  formData: any;
  setFormData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  errors: Record<string, string>;
}

const VenueMap: React.FC<VenueMapProps> = ({ formData, setFormData, nextStep, prevStep }) => {
  const [mapaSvg, setMapaSvg] = useState<string>('');
  // useRef ahora está correctamente importado arriba
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Cargar el SVG
  useEffect(() => {
    const cargarMapa = async () => {
      try {
        const svg = await eventService.descargarSvgMapa();
        setMapaSvg(svg);
      } catch (error) {
        console.error("Error cargando el mapa:", error);
      }
    };
    cargarMapa();
  }, []);

  // LÓGICA DEL ORGANIZADOR: Aplicar colores por GRUPOS (Zonas)
  useEffect(() => {
    // Le damos un pequeñísimo retraso para asegurar que React ya inyectó el SVG
    const timer = setTimeout(() => {
      if (mapaSvg && formData.zonas && formData.zonas.length > 0) {
        formData.zonas.forEach((zona: Zona) => {
          // Buscamos el color de la leyenda
          const color = ZONE_COLORS[zona.nombreZona.toUpperCase()] || '#D1D5DB';
          
          // Buscamos el ID del GRUPO en el SVG (Ej: id="VIP")
          const idBuscado = zona.nombreZona.toUpperCase(); 
          const elementoGrupoZona = document.getElementById(idBuscado) || document.getElementById(zona.nombreZona.toLowerCase());
          
          if (elementoGrupoZona) {
            // Buscamos todos los elementos dibujables dentro de ese grupo y los pintamos enteros
            const dibujables = elementoGrupoZona.querySelectorAll('path, rect, circle, polygon');
            if (dibujables.length > 0) {
              dibujables.forEach(d => (d as HTMLElement).style.fill = color);
            } else {
              // Si el grupo es un path directo, lo pintamos
              elementoGrupoZona.style.fill = color;
            }
          } else {
            console.warn(`⚠️ Ojo: No encontré en el archivo SVG ningún grupo o elemento con el id="${idBuscado}" o id="${zona.nombre_zona.toLowerCase()}"`);
          }
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [mapaSvg, formData.zonas]);

  // Función blindada para cambiar los precios (mapeando y clonando)
  const handlePrecioChange = (index: number, valorIngresado: string) => {
    const nuevoPrecio = valorIngresado === '' ? 0 : Number(valorIngresado);
    const nuevasZonas = formData.zonas.map((zona: Zona, i: number) => {
      if (i === index) {
        return { ...zona, precio: nuevoPrecio };
      }
      return zona;
    });
    setFormData({ ...formData, zonas: nuevasZonas });
  };

  return (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-bold text-[#03292e] mb-6">Paso 2: Configurar Zonas y Precios</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Lado Izquierdo: Mapa de Referencia con Colores Zonales */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500 mb-4 font-medium">Mapa de referencia por zonas</p>
          {mapaSvg ? (
            <div 
              ref={mapContainerRef} 
              dangerouslySetInnerHTML={{ __html: mapaSvg }} 
              style={{ width: '100%', maxWidth: '400px', pointerEvents: 'none', opacity: 0.9 }} 
            />
          ) : (
            <div className="text-gray-400">Cargando mapa...</div>
          )}
        </div>

        {/* Lado Derecho: Inputs de Precios */}
        <div className="flex flex-col gap-6">
          <p className="text-gray-600">Asigna el precio para cada zona.</p>
          
          {formData.zonas && formData.zonas.map((zona: Zona, index: number) => {
            const color = ZONE_COLORS[zona.nombreZona.toUpperCase()] || '#E5E7EB';
            
            return (
              <div key={index} className="bg-white p-5 rounded-xl border shadow-sm" style={{ borderColor: `${color}60` }}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-bold" style={{ color: color }}>Zona {zona.nombreZona}</h4>
                  <p className="text-sm text-gray-500">Capacidad: {zona.capacidad}</p>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={zona.precio === 0 ? '' : zona.precio} 
                    onChange={(e) => handlePrecioChange(index, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all"
                    placeholder="Ej: 50000"
                  />
                  <span className="text-gray-400 font-bold text-xs uppercase">COP</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
        <button onClick={prevStep} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">Volver</button>
        <button onClick={nextStep} className="px-8 py-3 rounded-xl font-bold text-white bg-[#2748E8] hover:bg-blue-700 transition-all">Siguiente Paso</button>
      </div>
    </div>
  );
};

export default VenueMap;