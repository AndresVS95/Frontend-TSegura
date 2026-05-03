import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenManager } from '../lib/tokenManager';
import { eventService } from '../services/eventService';
import type { Evento } from '../types/event.types';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoadingEventos, setIsLoadingEventos] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');

  const CATEGORIAS = ['Todos', 'Música', 'Teatro', 'Comedia', 'Cultura'];

  useEffect(() => {
    const user = tokenManager.getUser();
    if (user) {
      setEstaLogueado(true);
    }
    setIsLoadingEventos(true);
    eventService.obtenerEventosPublicados()
      .then((data) => setEventos(data))
      .catch(() => setEventos([]))
      .finally(() => setIsLoadingEventos(false));
  }, []);

  const handleBuscar = () => {
    setIsLoadingEventos(true);
    eventService.obtenerEventosPublicados(busqueda.trim())
      .then((data) => setEventos(data))
      .catch((error) => {
        console.error('Error al buscar eventos:', error);
        setEventos([]);
      })
      .finally(() => setIsLoadingEventos(false));
  };

  const eventosFiltrados = categoriaActiva === 'Todos'
    ? eventos
    : eventos.filter((e: any) => {
        const tipo = (e.tipoEvento || e.categoria || e.nombreTipo || '').toLowerCase();
        return tipo.includes(categoriaActiva.toLowerCase());
      });

  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar Premium Centralizada ── */}
      <Navbar />

      {/* ── Hero Section ── */}
      <div className="max-w-7xl mx-auto px-12 pt-16">
        <div className="mb-4">
          <span className="bg-pink-50 text-pink-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Popayán · Junio 2026</span>
        </div>
        <h1 className="premium-title text-[72px] leading-[0.9] mb-4">
          Próximos <span>Eventos.</span>
        </h1>
        <p className="text-gray-400 font-medium text-lg mb-12 max-w-2xl">
          Compra tu entrada como NFT en la blockchain de Polygon. Reventa segura y sin falsificaciones.
        </p>

        {/* Búsqueda Estilo Mockup */}
        <div className="flex items-center gap-4 bg-white border border-gray-100 shadow-2xl shadow-gray-100/50 rounded-[2rem] p-3 max-w-3xl mb-20">
          <div className="pl-6 flex-grow flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="¿Qué quieres ver hoy? (Ej: Rock, Teatro...)" 
              className="w-full outline-none text-gray-700 font-bold placeholder:text-gray-300"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
            />
          </div>
          <button 
            onClick={handleBuscar}
            className="bg-[#2748E8] text-white px-10 py-4 rounded-[1.5rem] font-black text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Buscar
          </button>
        </div>

        {/* Categorías */}
        <div className="flex flex-wrap gap-4 mb-16">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-8 py-3 rounded-2xl font-black text-xs transition-all ${cat === categoriaActiva ? 'bg-[#2748E8] text-white shadow-xl shadow-blue-100' : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de Eventos con Estilo Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-32">
          {isLoadingEventos ? (
             [1,2,3].map(n => <div key={n} className="h-[450px] bg-gray-50 rounded-[2.5rem] animate-pulse" />)
          ) : eventosFiltrados.length === 0 ? (
            <div className="col-span-3 py-20 text-center">
              <p className="text-gray-300 font-black text-lg">No hay eventos en esta categoría.</p>
            </div>
          ) : eventosFiltrados.map((evento, i) => {
            const gradients = [
              'from-purple-500 to-pink-500',
              'from-amber-400 to-orange-500',
              'from-blue-500 to-indigo-600',
              'from-emerald-400 to-cyan-500',
              'from-rose-500 to-red-600'
            ];
            const grad = gradients[i % gradients.length];

            return (
              <div 
                key={evento.eventoId} 
                onClick={() => navigate(`/eventos/${evento.eventoId}`)}
                className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-2xl transition-all group cursor-pointer overflow-hidden flex flex-col"
              >
                {/* Imagen con Gradiente de Fondo */}
                <div className={`h-64 bg-gradient-to-br ${grad} relative p-8 flex items-end justify-center`}>
                  <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">NFT Ticket</span>
                  </div>
                  {evento.urlImagen && evento.urlImagen !== "https://ejemplo.com/imagen.jpg" ? (
                     <img src={evento.urlImagen} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="" />
                  ) : null}
                  <span className="text-white font-black text-center text-xs uppercase tracking-[0.2em] opacity-40 mix-blend-overlay">
                    {evento.nombre}
                  </span>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <span className="text-pink-500 font-black text-[10px] uppercase tracking-widest mb-3">Música</span>
                  <h3 className="text-2xl font-black text-[#0D0D0D] mb-4 group-hover:text-[#2748E8] transition-colors">{evento.nombre}</h3>
                  
                  <div className="space-y-2 mb-8">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {(evento as any).nombreRecinto || 'Popayán'}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {evento.fechaEvento} · {evento.horaEvento}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Desde</p>
                      {(() => {
                        const zonas = (evento as any).zonas as Array<{ precio: number }> | undefined;
                        const precioMin = zonas && zonas.length > 0
                          ? Math.min(...zonas.map(z => z.precio))
                          : null;
                        return precioMin !== null
                          ? <p className="text-xl font-black text-[#0D0D0D]">${precioMin.toLocaleString('es-CO')} <span className="text-[10px] text-gray-400">COP</span></p>
                          : <p className="text-sm font-black text-gray-300">Ver precios</p>;
                      })()}
                    </div>
                    <button className="text-[#2748E8] font-black text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ver más <span className="text-lg">→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;