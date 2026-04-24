import React, { useState, useEffect } from 'react';
import TicketCard from '../components/TicketCard'; // Ajusta la ruta si es necesario

const MisBoletos: React.FC = () => {
  const [boletos, setBoletos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Cuando el Backend esté listo (Endpoint GET /users/me/tickets), 
    // reemplazaremos este setTimeout por el fetch real a la API.
    const cargarBoletosFalsos = () => {
      const mockData = [
        { id: 'TKT-001', evento: 'Concierto Épico 2JC', fecha: '13/11/2024', lugar: 'Recinto Principal, Popayán', zona: 'VIP', estadoNft: 'MINTED' },
        { id: 'TKT-002', evento: 'Concierto Épico 2JC', fecha: '13/11/2024', lugar: 'Recinto Principal, Popayán', zona: 'VIP', estadoNft: 'MINTED' },
        { id: 'TKT-003', evento: 'Festival de Verano', fecha: '25/12/2024', lugar: 'Plaza de Toros', zona: 'General', estadoNft: 'PENDING' },
      ];
      
      setTimeout(() => {
        setBoletos(mockData);
        setCargando(false);
      }, 1000); // Simulamos 1 segundo de carga de red
    };

    cargarBoletosFalsos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto mt-10">
        
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mis Entradas</h1>
          <p className="text-gray-500 mt-2 text-lg">Aquí están tus boletos seguros respaldados por blockchain.</p>
        </div>

        {cargando ? (
          <div className="text-center py-20 text-gray-400 font-bold animate-pulse">
            Cargando tus boletos...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {boletos.map((boleto) => (
              <TicketCard key={boleto.id} boleto={boleto} />
            ))}
          </div>
        )}
        
        {!cargando && boletos.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <span className="text-4xl mb-4 block">🎟️</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aún no tienes entradas</h3>
            <p className="text-gray-500">Explora los próximos eventos y asegura tu lugar.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default MisBoletos;