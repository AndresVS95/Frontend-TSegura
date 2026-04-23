import React from 'react';

// Estas "Props" permiten que el mapa se comporte diferente según dónde se use
interface MapaInteractivoProps {
  zonaSeleccionada?: string | null;
  onZonaClick?: (zonaId: string) => void;
  modoInteractivo?: boolean; // Para saber si estamos comprando o solo mirando
}

const MapaInteractivo: React.FC<MapaInteractivoProps> = ({ 
  zonaSeleccionada = null, 
  onZonaClick, 
  modoInteractivo = false 
}) => {

  // Función para manejar el clic solo si es interactivo
  const handleClick = (zonaId: string) => {
    if (modoInteractivo && onZonaClick) {
      onZonaClick(zonaId);
    }
  };

  // Función para pintar la zona si está seleccionada
  const getFillColor = (zonaId: string) => {
    if (!modoInteractivo) return '#cccccc'; // Gris por defecto si no es interactivo
    return zonaSeleccionada === zonaId ? '#1E5ADF' : '#cccccc'; // Azul si se selecciona
  };

  // Estilo para que el cursor cambie a "manito" si es interactivo
  const cursorStyle = modoInteractivo ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 550" width="100%" height="100%">
      <rect width="100%" height="100%" fill="#f4f7f6" rx="15"/>
      <path d="M 70 60 Q 275 100 480 60" fill="#e9ecef" stroke="#ced4da" strokeWidth="4"/>
      <text x="275" y="45" fontFamily="sans-serif" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#6c757d" letterSpacing="2">
        ESCENARIO PRINCIPAL
      </text>

      {/* --- ZONA VIP --- */}
      <g id="VIP" stroke="#999" strokeWidth="1.5" className={cursorStyle} onClick={() => handleClick('VIP')}>
        <text x="40" y="140" fontFamily="sans-serif" fontWeight="bold" fontSize="14" fill="#495057" stroke="none">A</text>
        {/* Fila A */}
        {[1,2,3,4,5,6,7,8,9,10].map((num, index) => (
          <rect key={`A-${num}`} id={`A-${num}`} x={70 + (index > 4 ? index * 40 + 20 : index * 40)} y="120" width="30" height="30" rx="6" fill={getFillColor('VIP')}/>
        ))}
        
        <text x="40" y="180" fontFamily="sans-serif" fontWeight="bold" fontSize="14" fill="#495057" stroke="none">B</text>
        {/* Fila B */}
        {[1,2,3,4,5,6,7,8,9,10].map((num, index) => (
          <rect key={`B-${num}`} id={`B-${num}`} x={70 + (index > 4 ? index * 40 + 20 : index * 40)} y="160" width="30" height="30" rx="6" fill={getFillColor('VIP')}/>
        ))}
      </g>

      {/* --- ZONA PLATA --- */}
      <g id="PLATA" stroke="#999" strokeWidth="1.5" className={cursorStyle} onClick={() => handleClick('PLATA')}>
        <text x="40" y="220" fontFamily="sans-serif" fontWeight="bold" fontSize="14" fill="#495057" stroke="none">C</text>
        {[1,2,3,4,5,6,7,8,9,10].map((num, index) => (
          <rect key={`C-${num}`} id={`C-${num}`} x={70 + (index > 4 ? index * 40 + 20 : index * 40)} y="200" width="30" height="30" rx="6" fill={getFillColor('PLATA')}/>
        ))}

        <text x="40" y="260" fontFamily="sans-serif" fontWeight="bold" fontSize="14" fill="#495057" stroke="none">D</text>
        {[1,2,3,4,5,6,7,8,9,10].map((num, index) => (
          <rect key={`D-${num}`} id={`D-${num}`} x={70 + (index > 4 ? index * 40 + 20 : index * 40)} y="240" width="30" height="30" rx="6" fill={getFillColor('PLATA')}/>
        ))}
      </g>

      {/* --- ZONA GENERAL --- */}
      <g id="GENERAL" stroke="#999" strokeWidth="1.5" className={cursorStyle} onClick={() => handleClick('GENERAL')}>
        <text x="40" y="300" fontFamily="sans-serif" fontWeight="bold" fontSize="14" fill="#495057" stroke="none">E</text>
        {[1,2,3,4,5,6,7,8,9,10].map((num, index) => <rect key={`E-${num}`} x={70 + (index > 4 ? index * 40 + 20 : index * 40)} y="280" width="30" height="30" rx="6" fill={getFillColor('GENERAL')}/>)}
        
        <text x="40" y="340" fontFamily="sans-serif" fontWeight="bold" fontSize="14" fill="#495057" stroke="none">F</text>
        {[1,2,3,4,5,6,7,8,9,10].map((num, index) => <rect key={`F-${num}`} x={70 + (index > 4 ? index * 40 + 20 : index * 40)} y="320" width="30" height="30" rx="6" fill={getFillColor('GENERAL')}/>)}

        <text x="40" y="380" fontFamily="sans-serif" fontWeight="bold" fontSize="14" fill="#495057" stroke="none">G</text>
        {[1,2,3,4,5,6,7,8,9,10].map((num, index) => <rect key={`G-${num}`} x={70 + (index > 4 ? index * 40 + 20 : index * 40)} y="360" width="30" height="30" rx="6" fill={getFillColor('GENERAL')}/>)}

        <text x="40" y="420" fontFamily="sans-serif" fontWeight="bold" fontSize="14" fill="#495057" stroke="none">H</text>
        {[1,2,3,4,5,6,7,8,9,10].map((num, index) => <rect key={`H-${num}`} x={70 + (index > 4 ? index * 40 + 20 : index * 40)} y="400" width="30" height="30" rx="6" fill={getFillColor('GENERAL')}/>)}

        <text x="40" y="460" fontFamily="sans-serif" fontWeight="bold" fontSize="14" fill="#495057" stroke="none">I</text>
        {[1,2,3,4,5,6,7,8,9,10].map((num, index) => <rect key={`I-${num}`} x={70 + (index > 4 ? index * 40 + 20 : index * 40)} y="440" width="30" height="30" rx="6" fill={getFillColor('GENERAL')}/>)}

        <text x="40" y="500" fontFamily="sans-serif" fontWeight="bold" fontSize="14" fill="#495057" stroke="none">J</text>
        {[1,2,3,4,5,6,7,8,9,10].map((num, index) => <rect key={`J-${num}`} x={70 + (index > 4 ? index * 40 + 20 : index * 40)} y="480" width="30" height="30" rx="6" fill={getFillColor('GENERAL')}/>)}
      </g>
    </svg>
  );
};

export default MapaInteractivo;