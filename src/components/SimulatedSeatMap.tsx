import React from 'react';

// Interfaces para TypeScript
export interface AsientoSimulado {
  id: string; // Ej: "A-1"
  fila: string;
  numero: number;
  estado: 'DISPONIBLE' | 'OCUPADO' | 'SELECCIONADO';
}

interface Props {
  asientos: AsientoSimulado[];
  onToggleAsiento: (asientoId: string) => void; // Función para seleccionar/deseleccionar
}

export default function SimulatedSeatMap({ asientos, onToggleAsiento }: Props) {
  
  // Configuraciones del dibujo
  const cols = 10;
  const rows = 10;
  const seatSize = 35; // Tamaño del cuadrado de la silla
  const gap = 10; // Espacio entre sillas
  const viewBoxWidth = cols * (seatSize + gap) + 50; // +50 para etiquetas de fila
  const viewBoxHeight = rows * (seatSize + gap) + 50; // +50 para etiquetas de columna

  // Función para obtener el color de la silla según su estado
  const getSeatColor = (estado: AsientoSimulado['estado']) => {
    switch (estado) {
      case 'SELECCIONADO': return '#1E5ADF'; // Azul TSegura
      case 'OCUPADO': return '#ef4444'; // Rojo (Tailwind red-500)
      default: return '#cbd5e1'; // Gris Disponible (Tailwind slate-300)
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-gray-200 shadow-lg relative overflow-hidden">
      
      {/* Leyenda de colores */}
      <div className="flex justify-center gap-6 mb-6 text-xs font-bold text-gray-600 border-b pb-4">
        <div className="flex items-center gap-2"><rect className="w-4 h-4 rounded bg-slate-300" /> Disponible</div>
        <div className="flex items-center gap-2"><rect className="w-4 h-4 rounded bg-[#1E5ADF]" /> Tu Selección</div>
        <div className="flex items-center gap-2"><rect className="w-4 h-4 rounded bg-red-500" /> Ocupado</div>
      </div>

      {/* El lienzo SVG */}
      <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-auto">
        
        {/* ESCENARIO SIMULADO */}
        <rect x="50" y="0" width={viewBoxWidth - 100} height="30" rx="5" fill="#334155" />
        <text x={viewBoxWidth / 2} y="20" fill="white" textAnchor="middle" fontSize="14" fontWeight="bold">ESCENARIO (REFERENCIA)</text>

        {/* Generación de la matriz de sillas */}
        {asientos.map((asiento, index) => {
          const rowIndex = Math.floor(index / cols);
          const colIndex = index % cols;
          
          const x = colIndex * (seatSize + gap) + 50; // +50 desplazamiento para etiquetas
          const y = rowIndex * (seatSize + gap) + 50; // +50 desplazamiento para escenario

          return (
            <g key={asiento.id} className="transition-all duration-200">
              
              {/* Dibujo de la Silla (Cuadrado redondeado) */}
              <rect
                x={x}
                y={y}
                width={seatSize}
                height={seatSize}
                rx="8" // Bordes redondeados
                fill={getSeatColor(asiento.estado)}
                stroke={asiento.estado === 'SELECCIONADO' ? '#1e3a8a' : '#94a3b8'}
                strokeWidth={asiento.estado === 'SELECCIONADO' ? 2 : 1}
                className={`transition-colors ${asiento.estado !== 'OCUPADO' ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'}`}
                onClick={() => asiento.estado !== 'OCUPADO' && onToggleAsiento(asiento.id)}
              />
              
              {/* Número de silla (dentro del cuadrado) */}
              <text 
                x={x + seatSize / 2} 
                y={y + seatSize / 2 + 4} 
                textAnchor="middle" 
                fontSize="10" 
                fontWeight="bold" 
                fill={asiento.estado === 'SELECCIONADO' ? 'white' : '#475569'}
                pointerEvents="none" // Para que no interfiera con el clic
              >
                {asiento.numero}
              </text>

              {/* Etiquetas de Fila (A, B, C...) al principio de cada fila */}
              {colIndex === 0 && (
                <text x="25" y={y + seatSize / 2 + 5} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#94a3b8">
                  {asiento.fila}
                </text>
              )}

              {/* Etiquetas de Columna (1, 2, 3...) arriba de la primera fila */}
              {rowIndex === 0 && (
                <text x={x + seatSize / 2} y="45" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#94a3b8">
                  {asiento.numero}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      <p className="text-center text-gray-400 text-xs mt-4">Mapa simulado de 100 asientos individuales (Matriz 10x10)</p>
    </div>
  );
}