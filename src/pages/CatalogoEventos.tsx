import React, { useEffect, useState } from 'react';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';
import NoResults from '../components/NoResults'; // Nuevo componente
import EmptyCatalog from '../components/EmptyCatalog';

const CatalogoEventos: React.FC = () => {
  const [eventos, setEventos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  //  LOGICA DE DEBOUNCE
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEventos(searchTerm);
    }, 300); // Espera 300ms antes de disparar la búsqueda

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchEventos = async (query: string) => {
    try {
      setLoading(true);
      const data = await eventService.obtenerEventosPublicados(query);
      setEventos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/*Navbar*/ }

      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-8">
            Próximos <span className="text-[#1E5ADF]">Eventos</span>
          </h2>

          {/* BARRA DE BÚSQUEDA ESTILIZADA */}
          <div className="relative max-w-xl group">
            <span className="absolute inset-y-0 left-5 flex items-center text-gray-400 group-focus-within:text-[#1E5ADF] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text"
              placeholder="¿Qué quieres ver hoy? (Ej: Rock, Teatro...)"
              className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-2 border-transparent bg-white shadow-xl shadow-gray-100 outline-none focus:border-[#1E5ADF] transition-all text-lg font-medium text-gray-800 placeholder:text-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(n => <div key={n} className="h-80 bg-gray-100 animate-pulse rounded-3xl" />)}
          </div>
        ) : eventos.length === 0 ? (
          /* ✅ DECISIÓN DE ESTADO VACÍO */
          searchTerm !== '' ? (
            <NoResults termino={searchTerm} /> 
          ) : (
            <EmptyCatalog />
          )
        ) : (
          /* ✅ LISTADO DE RESULTADOS */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {eventos.map((evento) => (
              <EventCard 
                key={evento.eventoId}
                nombre={evento.nombre}
                fecha={evento.fechaEvento}
                imagen={evento.urlImagen}
                recinto={evento.nombreRecinto || 'Recinto Principal'}
                onClick={() => {}}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CatalogoEventos;