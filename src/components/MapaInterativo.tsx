// src/components/MapaInteractivo.tsx (Actualizado para el Comprador)
import React, { useEffect, useRef, useState } from 'react';

// Interfaz para conocer la estructura de las sillas que vienen de la API
interface Silla {
  asientoId: number;
  fila: string;
  numero: number;
  estado: string; // 'DISPONIBLE', 'VENDIDO', etc.
}

// Props que este componente va a recibir desde la página principal de compra
interface MapaInteractivoProps {
  svgContent: string;
  sillas: Silla[];
  sillasSeleccionadas: number[];
  onToggleSilla: (sillaId: number) => void;
}

const MapaInteractivo: React.FC<MapaInteractivoProps> = ({ 
  svgContent, 
  sillas, 
  sillasSeleccionadas, 
  onToggleSilla 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // LÓGICA DEL COMPRADOR: Aplicar colores por SILLAS individuales (Disponibilidad)
  useEffect(() => {
    // Pequeño retraso para asegurar que React inyectó el SVG
    const timer = setTimeout(() => {
      if (mapContainerRef.current && sillas && sillas.length > 0) {
        sillas.forEach((silla: Silla) => {
          // Buscamos el ID único de la SILLA individual en el SVG.
          // Ej: Si la silla en BD es fila='A', numero=1, buscamos id="A-1"
          const idSillaBuscado = `${silla.fila}-${silla.numero}`;
          const elementoSillaIndividual = document.getElementById(idSillaBuscado);
          
          if (elementoSillaIndividual) {
            // Cambiar el cursor dependiendo de la disponibilidad (Pointer Events)
            elementoSillaIndividual.style.cursor = silla.estado === 'DISPONIBLE' ? 'pointer' : 'not-allowed';
            
            // Lógica de colores por ESTADO (No por zona)
            if (silla.estado === 'VENDIDO') {
              elementoSillaIndividual.style.fill = '#ff4d4d'; // Rojo (Vendido)
            } else if (sillasSeleccionadas.includes(silla.asientoId)) {
              elementoSillaIndividual.style.fill = '#4da6ff'; // Azul (Seleccionado por el usuario)
            } else {
              elementoSillaIndividual.style.fill = '#4dff4d'; // Verde (Disponible para compra)
            }

            // Asignar el clic interactivo solo si está disponible
            elementoSillaIndividual.onclick = () => {
              if (silla.estado === 'DISPONIBLE') {
                onToggleSilla(silla.asientoId);
              }
            };
          } else {
            console.warn(`⚠️ Ojo: No encontré en el archivo SVG ninguna silla individual con el id="${idSillaBuscado}". Revisa el SVG.`);
          }
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [sillas, sillasSeleccionadas, svgContent, onToggleSilla]);

  if (!svgContent) {
    return <div className="text-gray-500 my-4 text-center">Cargando diseño del mapa...</div>;
  }

  return (
    <div 
      ref={mapContainerRef} 
      dangerouslySetInnerHTML={{ __html: svgContent }} 
      style={{ width: '100%', maxWidth: '600px', margin: '0 auto', border: '1px solid #e5e7eb', borderRadius: '15px', backgroundColor: '#fff', padding: '10px' }}
    />
  );
};

export default MapaInteractivo;