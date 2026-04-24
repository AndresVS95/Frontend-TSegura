import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';
import NoResults from '../components/NoResults';
import EmptyCatalog from '../components/EmptyCatalog';

const CatalogoEventos: React.FC = () => {
  const navigate = useNavigate();
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

          {/* BARRA DE BÚSQUEDA MEJORADA */}
          <div className="mb-12 max-w-xl">
            <div className="relative flex items-center w-full h-14 rounded-full border-2 border-[#1E5ADF] bg-white overflow-hidden">
              <div className="grid place-items-center h-full w-12 text-[#1E5ADF]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                className="peer h-full w-full outline-none text-gray-700 pr-2 placeholder-gray-500 font-medium"
                type="text"
                id="search"
                placeholder="Buscar evento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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