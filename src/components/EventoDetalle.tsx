// src/pages/EventoDetalle.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { eventService } from '../services/eventService';
import MapaInteractivo from '../components/MapaInteractivo';
import { tokenManager } from '../lib/tokenManager';
import Navbar from '../components/Navbar';

interface Zona {
  zonaId: string | number;
  nombreZona: string;
  precio: number;
  cuposDisponibles: number;
  capacidadTotal: number;
}

interface Evento {
  eventoId: number;
  nombre: string;
  descripcion?: string;
  urlImagen?: string;
  fechaEvento: string;
  horaEvento: string;
  nombreRecinto?: string;
  edadMinima?: number;
  zonas?: Zona[];
}

const normalizarZonaId = (nombre: string): string => nombre.toUpperCase().trim();

const EventoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string | null>(null);
  const [disponibilidad, setDisponibilidad] = useState<Record<string, 'DISPONIBLE' | 'AGOTADO'>>({});
  const [cantidadBoletas, setCantidadBoletas] = useState<number>(1);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await eventService.obtenerEventoPorId(id);
          setEvento(data);
          if (data.zonas) {
            const dispInicial: Record<string, 'DISPONIBLE' | 'AGOTADO'> = {};
            data.zonas.forEach((z: Zona) => {
              dispInicial[normalizarZonaId(z.nombreZona)] = z.cuposDisponibles > 0 ? 'DISPONIBLE' : 'AGOTADO';
            });
            setDisponibilidad(dispInicial);
          }
        }
      } catch (error: any) {
        if (error?.response?.status === 403 || error?.response?.status === 401) {
          tokenManager.remove();
          navigate('/login', { state: { from: location }, replace: true });
          return;
        }
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id, navigate, location]);

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="h-[450px] bg-gray-100 animate-pulse" />
      <div className="max-w-7xl mx-auto px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-8 bg-gray-100 rounded-2xl animate-pulse w-1/3" />
          <div className="h-12 bg-gray-100 rounded-2xl animate-pulse w-2/3" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-4 bg-gray-100 rounded-xl animate-pulse w-5/6" />
            <div className="h-4 bg-gray-100 rounded-xl animate-pulse w-4/6" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[1,2,3,4].map(n => <div key={n} className="h-28 bg-gray-100 rounded-3xl animate-pulse" />)}
          </div>
        </div>
        <div className="h-96 bg-gray-100 rounded-[2.5rem] animate-pulse" />
      </div>
    </div>
  );
  if (!evento) return <div className="text-center py-20">Evento no encontrado.</div>;

  // ── Datos dinámicos seguros ──
  const nombreOrg = (evento as any).organizadorNombre || (evento as any).usuarioNombre || 'Organizador Verificado';

  const zonaActiva: Zona | undefined = evento?.zonas?.find(
    (z) => normalizarZonaId(z.nombreZona) === zonaSeleccionada
  );

  const handleComprar = () => {
    if (!zonaActiva || !evento) return;
    const pedido = {
      eventoId: evento.eventoId,
      eventoNombre: evento.nombre,
      zonaId: zonaActiva.zonaId,
      zonaNombre: zonaActiva.nombreZona,
      cantidad: cantidadBoletas,
      precioUnitario: zonaActiva.precio,
      total: zonaActiva.precio * cantidadBoletas,
    };
    if (!tokenManager.isValid()) {
      localStorage.setItem('carrito_pendiente', JSON.stringify(pedido));
      navigate('/login');
    } else {
      navigate(`/pago/${zonaActiva.zonaId}`, { state: pedido });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Banner Principal ── */}
      <div className="relative h-[450px] overflow-hidden">
        <img 
          src={evento.urlImagen || 'https://via.placeholder.com/1920x600'} 
          className="w-full h-full object-cover" 
          alt={evento.nombre} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-12 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-[#2748E8] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Música</span>
              <span className="bg-[#F5C518] text-[#0D0D0D] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Más vendido</span>
            </div>
            <h1 className="text-7xl font-black leading-none mb-4">
              {evento.nombre} <span className="text-[#F5C518]">2026</span>
            </h1>
            <div className="flex items-center gap-6 text-sm font-bold text-gray-300">
              <span className="flex items-center gap-2">📍 {evento.nombreRecinto || 'Coliseo del Pueblo, Popayán'}</span>
              <span className="flex items-center gap-2">📅 {evento.fechaEvento} · {evento.horaEvento}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Columna Izquierda: Info */}
        <div className="lg:col-span-2 space-y-16">
          
          <section>
            <div className="mb-6">
              <span className="bg-blue-50 text-[#2748E8] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Entrada verificada · No puede falsificarse</span>
            </div>
            <h2 className="premium-title text-4xl mb-6">Sobre <span>el evento</span></h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              {evento.descripcion || 'Una noche para celebrar la riqueza musical del Cauca. Acordeones, cajas y guacharacas se encuentran con artistas invitados nacionales en un show de tres horas.'}
            </p>

            {/* Grid de 4 Cards de Info */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Organizador', value: nombreOrg, sub: 'Verificado - Miembro TSegura' },
                { label: 'Recinto', value: evento.nombreRecinto || 'Coliseo del Pueblo', sub: 'Confirmado' },
                { label: 'Apertura', value: '7:00 PM', sub: `Show ${evento.horaEvento}` },
                { label: 'Capacidad', value: '4.200 personas', sub: 'Disponibilidad en tiempo real' }
              ].map((card, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">{card.label}</p>
                  <p className="text-lg font-black text-[#0D0D0D] mb-1">{card.value}</p>
                  <p className="text-xs text-gray-400">{card.sub}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="premium-title text-3xl mb-8">Cómo <span>funciona</span></h2>
            <div className="space-y-6">
              {[
                'Compra con tu tarjeta y recibe tu entrada al instante.',
                'Presenta el QR en la puerta: el ingreso es en segundos.',
                'Si no puedes ir, ponla en reventa al precio que el organizador definió.'
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[#2748E8] text-xs font-black flex-shrink-0 mt-1">
                    {i + 1}
                  </div>
                  <p className="text-gray-400 font-medium">{step}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Columna Derecha: Sidebar de Zonas (Mockup Style) */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-100 border border-gray-50">
             <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#2748E8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="premium-title text-2xl text-center mb-6">Selecciona <span>una zona</span></h3>
              
              <div className="space-y-4 mb-8">
                {evento.zonas?.map((z) => (
                  <button
                    key={z.zonaId}
                    onClick={() => disponibilidad[normalizarZonaId(z.nombreZona)] !== 'AGOTADO' && setZonaSeleccionada(normalizarZonaId(z.nombreZona))}
                    disabled={disponibilidad[normalizarZonaId(z.nombreZona)] === 'AGOTADO'}
                    className={`w-full flex items-center p-5 rounded-3xl border-2 transition-all text-left ${zonaSeleccionada === normalizarZonaId(z.nombreZona) ? 'border-[#2748E8] bg-blue-50/30 shadow-lg shadow-blue-50' : 'border-gray-50 hover:border-blue-100'}`}
                  >
                    <div className="flex-grow">
                      <p className="font-black text-gray-800 text-sm leading-tight uppercase">{z.nombreZona}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[#2748E8] font-black text-base">${z.precio.toLocaleString('es-CO')}</span>
                    </div>
                  </button>
                ))}
              </div>

              {zonaActiva && (
                <div className="animate-fade-in space-y-6">
                  <div className="flex flex-col gap-4 bg-gray-50 p-6 rounded-3xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Cantidad</p>
                    <div className="flex items-center justify-center space-x-6">
                      <button onClick={() => setCantidadBoletas(Math.max(1, cantidadBoletas - 1))} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-[#2748E8] hover:bg-blue-50 transition-all">−</button>
                      <span className="text-2xl font-black w-6 text-center">{cantidadBoletas}</span>
                      <button onClick={() => setCantidadBoletas(Math.min(zonaActiva.cuposDisponibles, cantidadBoletas + 1))} className="w-10 h-10 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center font-bold text-white hover:bg-blue-700 transition-all">+</button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-2">
                    <span className="text-gray-400 font-bold">Subtotal</span>
                    <span className="text-2xl font-black text-gray-900">${(zonaActiva.precio * cantidadBoletas).toLocaleString('es-CO')} <span className="text-xs text-gray-400">COP</span></span>
                  </div>
                  <div className="flex justify-between items-center px-2 text-xs">
                    <span className="text-gray-300 font-bold">Cargo de servicio (5%)</span>
                    <span className="text-gray-400 font-bold">+${Math.round(zonaActiva.precio * cantidadBoletas * 0.05).toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between items-center px-2 pt-2 border-t border-gray-100">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Total</span>
                    <span className="text-base font-black text-[#0D0D0D]">${Math.round(zonaActiva.precio * cantidadBoletas * 1.05).toLocaleString('es-CO')} <span className="text-[10px] text-gray-400">COP</span></span>
                  </div>

                  <button onClick={handleComprar} className="w-full bg-[#2748E8] hover:bg-blue-700 text-white font-black py-5 rounded-3xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98]">
                    Comprar entrada
                  </button>
                </div>
              )}
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
             <MapaInteractivo modoInteractivo={true} zonaSeleccionada={zonaSeleccionada} onZonaClick={setZonaSeleccionada} disponibilidad={disponibilidad} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventoDetalle;