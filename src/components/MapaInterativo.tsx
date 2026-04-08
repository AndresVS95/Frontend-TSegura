import React, { useEffect, useRef } from 'react';

// Interfaz para conocer la estructura de las sillas
interface Silla {
  asientoId: number;
  fila: string;
  numero: number;
  estado: string;
}

// Props que este componente va a recibir desde la página principal
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
  const mapaRef = useRef<HTMLDivElement>(null);

  // Efecto que inyecta los colores y clics cada vez que cambia una selección
  useEffect(() => {
    if (mapaRef.current && sillas.length > 0) {
      sillas.forEach(silla => {
        const elementoSvg = document.getElementById(`${silla.fila}-${silla.numero}`);
        
        if (elementoSvg) {
          // Cambiar el cursor dependiendo de la disponibilidad
          elementoSvg.style.cursor = silla.estado === 'DISPONIBLE' ? 'pointer' : 'not-allowed';
          
          // Lógica de colores
          if (silla.estado === 'VENDIDO') {
            elementoSvg.style.fill = '#ff4d4d'; // Rojo
          } else if (sillasSeleccionadas.includes(silla.asientoId)) {
            elementoSvg.style.fill = '#4da6ff'; // Azul (Seleccionado)
          } else {
            elementoSvg.style.fill = '#4dff4d'; // Verde (Disponible)
          }

          // Asignar el clic
          elementoSvg.onclick = () => {
            if (silla.estado === 'DISPONIBLE') {
              onToggleSilla(silla.asientoId);
            }
          };
        }
      });
    }
  }, [sillas, sillasSeleccionadas, svgContent, onToggleSilla]);

  if (!svgContent) {
    return <div className="text-gray-500 my-4">Cargando diseño del mapa...</div>;
  }

  return (
    <div 
      ref={mapaRef} 
      dangerouslySetInnerHTML={{ __html: svgContent }} 
      style={{ width: '100%', maxWidth: '600px', margin: '0 auto', border: '1px solid #e5e7eb', borderRadius: '15px', backgroundColor: '#fff' }}
    />
  );
};

export default MapaInteractivo;