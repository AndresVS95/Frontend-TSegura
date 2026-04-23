import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenManager } from '../lib/tokenManager';
import { eventService } from '../services/eventService';
import type { Evento } from '../types/event.types';
import toast from 'react-hot-toast';

/**
 * Dashboard del Organizador.
 * 
 * NOTA SENIOR: Ya no verificamos auth aquí — PrivateRoute se encarga.
 * Solo nos preocupamos por la lógica de negocio (cargar eventos, publicar, etc.)
 */
const DashboardOrganizer: React.FC = () => {
  const navigate = useNavigate();
  const user = tokenManager.getUser();
  const nombre = user?.nombre_completo ?? 'Organizador';

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [isSuspendido, setIsSuspendido] = useState(false);

  // Función para cargar/refrescar los datos de la tabla
  const cargarDatos = async () => {
    try {
      const data = await eventService.obtenerMisEventos();
      setEventos(data);
      setMensajeError(null);
    } catch (error: any) {
      // Tarea HU-017: Manejar estado SUSPENDIDO si el backend lo devuelve
      if (error.message?.includes("SUSPENDIDO")) {
        setIsSuspendido(true);
      } else {
        setMensajeError(error.message);
      }
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Tarea HU-021: Función para publicar un borrador
  const handlePublicar = async (evento: Evento) => {
    const idReal = evento.eventoId || (evento as any).id;
    
    if (!idReal) {
      toast.error("Error: El evento no tiene un ID válido. Asegúrate de que el Backend esté enviando 'eventoId'.");
      return;
    }

    try {
      await eventService.publicarEvento(idReal, evento);
      setMensajeError(null);
      toast.success("¡Evento publicado con éxito! 🎉 El público ya puede ver las entradas.");
      await cargarDatos(); 
    } catch (error: any) {
      setMensajeError(error.message);
      toast.error("No se pudo publicar: " + error.message);
    }
  };

  const handleLogout = () => {
    tokenManager.clearAll();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Tarea HU-017: Banner de Suspensión */}
      {isSuspendido && (
        <div className="bg-red-600 text-white px-8 py-3 text-center font-bold animate-pulse">
          ⚠️ Tu cuenta se encuentra SUSPENDIDA. Por favor, contacta a soporte@tsegura.com para más información.
        </div>
      )}

      {/* Mostrar mensajes de error de API si existen */}
      {mensajeError && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mx-10 mt-4 shadow-sm">
          <p className="font-bold">Aviso del sistema</p>
          <p>{mensajeError}</p>
        </div>
      )}

      <nav className="bg-white px-8 py-4 shadow-sm border-b border-gray-100 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-[#1E5ADF]">🎫 TSegura (Organizer)</h1>
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium">Hola, <b>{nombre}</b></span>
          <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:underline">Cerrar Sesión</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <section className="bg-[#1E5ADF] rounded-[3rem] p-10 text-white mb-12 shadow-2xl">
          <h2 className="text-4xl font-black mb-4">Panel de Control</h2>
          <p className="mb-6 opacity-90">Gestiona tus eventos, revisa tus ventas y publica nuevos lanzamientos.</p>
          <button 
            onClick={() => navigate('/crearevento')}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
          >
            + Crear Nuevo Evento
          </button>
        </section>

        <h3 className="text-2xl font-black text-[#03292e] mb-6">Mis Eventos</h3>

        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Evento</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ventas / Recaudo</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eventos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">No tienes eventos registrados aún.</td>
                </tr>
              ) : (
                eventos.map((evento, index) => {
                  const idReal = evento.eventoId || (evento as any).id;
                  return (
                  <tr key={idReal ?? index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{evento.nombre}</div>
                      <div className="text-xs text-gray-500">{evento.fechaEvento} - {evento.horaEvento}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        evento.estado === 'PUBLICADO' ? 'bg-green-100 text-green-800' : 
                        evento.estado === 'BORRADOR' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {evento.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{evento.entradasVendidas ?? 0} / {evento.capacidadTotal ?? 0} tickets</div>
                      <div className="text-xs text-green-600 font-bold">${evento.recaudo?.toLocaleString() ?? 0} total</div>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3 items-center">
                      
                      {/* Tarea HU-021: Botón Publicar solo visible en BORRADOR */}
                      {evento.estado === 'BORRADOR' && (
                        <button 
                          onClick={() => handlePublicar(evento)} 
                          className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 shadow-sm transition-all"
                        >
                          Publicar
                        </button>
                      )}

                      <button 
                        onClick={() => navigate(`/detalles/${idReal}`)} 
                        className="text-[#1E5ADF] font-bold text-sm hover:underline"
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DashboardOrganizer;