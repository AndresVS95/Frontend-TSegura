// src/components/MapaInteractivo.tsx
import React from 'react';

interface MapaInteractivoProps {
  zonaSeleccionada?: string | null;
  onZonaClick?: (zonaId: string) => void;
  modoInteractivo?: boolean;
  disponibilidad?: Record<string, 'DISPONIBLE' | 'AGOTADO'>;
}

const MapaInteractivo: React.FC<MapaInteractivoProps> = ({
  zonaSeleccionada = null,
  onZonaClick,
  modoInteractivo = false,
  disponibilidad = {},
}) => {
  const handleClick = (zonaId: string) => {
    if (modoInteractivo && onZonaClick) {
      // No permitir clic en zonas agotadas
      if (disponibilidad[zonaId] === 'AGOTADO') return;
      onZonaClick(zonaId);
    }
  };

  const getFillColor = (zonaId: string): string => {
    if (disponibilidad[zonaId] === 'AGOTADO') return '#EF4444'; // rojo = agotado
    if (!modoInteractivo) return '#D1D5DB'; // gris neutro si solo es visual
    if (zonaSeleccionada === zonaId) return '#1E5ADF'; // azul = seleccionada
    return '#6B7280'; // gris oscuro = disponible no seleccionada
  };

  const getStrokeColor = (zonaId: string): string => {
    if (zonaSeleccionada === zonaId) return '#1E3A8A';
    return '#9CA3AF';
  };

  const getCursorStyle = (zonaId: string): string => {
    if (!modoInteractivo) return '';
    if (disponibilidad[zonaId] === 'AGOTADO') return 'cursor-not-allowed opacity-70';
    return 'cursor-pointer hover:opacity-80 transition-opacity';
  };

  const filas: { id: string; zona: string; y: number }[] = [
    { id: 'A', zona: 'VIP', y: 120 },
    { id: 'B', zona: 'VIP', y: 160 },
    { id: 'C', zona: 'PLATA', y: 210 },
    { id: 'D', zona: 'PLATA', y: 250 },
    { id: 'E', zona: 'GENERAL', y: 300 },
    { id: 'F', zona: 'GENERAL', y: 340 },
    { id: 'G', zona: 'GENERAL', y: 380 },
    { id: 'H', zona: 'GENERAL', y: 420 },
    { id: 'I', zona: 'GENERAL', y: 460 },
    { id: 'J', zona: 'GENERAL', y: 500 },
  ];

  // Agrupa filas por zona para hacer un solo <g> por zona
  const zonas = ['VIP', 'PLATA', 'GENERAL'];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 550 580"
      width="100%"
      height="100%"
    >
      <rect width="100%" height="100%" fill="#f8fafc" rx="15" />

      {/* Escenario */}
      <path d="M 60 70 Q 275 110 490 70" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3" />
      <text
        x="275"
        y="52"
        fontFamily="sans-serif"
        fontSize="13"
        fontWeight="bold"
        textAnchor="middle"
        fill="#64748b"
        letterSpacing="3"
      >
        ESCENARIO PRINCIPAL
      </text>

      {/* Leyenda */}
      <g transform="translate(30, 540)">
        <rect x="0" y="0" width="12" height="12" rx="3" fill="#1E5ADF" />
        <text x="16" y="10" fontFamily="sans-serif" fontSize="10" fill="#374151">Seleccionada</text>
        <rect x="95" y="0" width="12" height="12" rx="3" fill="#6B7280" />
        <text x="111" y="10" fontFamily="sans-serif" fontSize="10" fill="#374151">Disponible</text>
        <rect x="188" y="0" width="12" height="12" rx="3" fill="#EF4444" />
        <text x="204" y="10" fontFamily="sans-serif" fontSize="10" fill="#374151">Agotada</text>
      </g>

      {/* Etiquetas de zona a la derecha */}
      {[
        { zonaId: 'VIP', y: 145, label: 'VIP' },
        { zonaId: 'PLATA', y: 235, label: 'PLATA' },
        { zonaId: 'GENERAL', y: 400, label: 'GENERAL' },
      ].map(({ zonaId, y, label }) => (
        <text
          key={zonaId}
          x="510"
          y={y}
          fontFamily="sans-serif"
          fontSize="11"
          fontWeight="bold"
          fill={getFillColor(zonaId)}
          textAnchor="middle"
          transform={`rotate(-90, 510, ${y})`}
          style={{ userSelect: 'none' }}
        >
          {label}
        </text>
      ))}

      {/* Zonas */}
      {zonas.map((zonaId) => (
        <g
          key={zonaId}
          id={zonaId}
          className={getCursorStyle(zonaId)}
          onClick={() => handleClick(zonaId)}
          strokeWidth="1.5"
        >
          {filas
            .filter((f) => f.zona === zonaId)
            .map(({ id, y }) => (
              <g key={id}>
                {/* Letra de fila */}
                <text
                  x="42"
                  y={y + 20}
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  fontSize="13"
                  fill="#6B7280"
                  stroke="none"
                  style={{ userSelect: 'none' }}
                >
                  {id}
                </text>
                {/* Asientos */}
                {Array.from({ length: 10 }, (_, index) => (
                  <rect
                    key={`${id}-${index + 1}`}
                    x={60 + (index > 4 ? index * 40 + 15 : index * 40)}
                    y={y}
                    width="28"
                    height="28"
                    rx="6"
                    fill={getFillColor(zonaId)}
                    stroke={getStrokeColor(zonaId)}
                  />
                ))}
              </g>
            ))}
        </g>
      ))}
    </svg>
  );
};

export default MapaInteractivo;