import api from "./api";
import type { Evento, CrearEventoDTO, Asiento } from "../types/event.types";

/**
 * Servicio de eventos — migrado de fetch manual a Axios.
 * Ya no necesita getHeaders() ni BASE_URL propios porque
 * api.ts maneja todo centralizadamente.
 */
export const eventService = {

  /** Crear un nuevo evento (POST /api/eventos) */
  crearEvento: async (eventoDTO: CrearEventoDTO): Promise<Evento> => {
    const response = await api.post("/api/eventos", eventoDTO);
    return response.data;
  },

  /** Obtener los eventos del organizador autenticado */
  obtenerMisEventos: async (): Promise<Evento[]> => {
    try {
      const response = await api.get("/api/eventos/mis-eventos");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error("Acceso denegado. Posible cuenta en estado SUSPENDIDO.");
      }
      throw new Error(error.response?.data?.message || "Error al obtener los eventos");
    }
  },

  /** Publicar un evento en estado BORRADOR (PUT /api/eventos/:id) */
  publicarEvento: async (eventoId: number, datosActuales: Evento): Promise<Evento> => {
    if (!eventoId) {
      throw new Error("El ID del evento es inválido o no se recibió correctamente.");
    }

    const response = await api.put(`/api/eventos/${eventoId}`, {
      ...datosActuales,
      estado: "PUBLICADO",
    });
    return response.data;
  },

  /** Registrar Venta Manual (RF-O-10) */
  registrarVentaManual: async (eventoId: number, ventaData: any): Promise<any> => {
    // Si el backend aún no tiene esta ruta lista, podemos comentarla
    // para que la UI funcione visualmente
    const response = await api.post(`/api/eventos/${eventoId}/venta-manual`, ventaData);
    return response.data;
  },

  obtenerEventosPublicados: async (query: string = '') => {
    // Solución temporal: Como el backend no tiene el endpoint /publicados, 
    // traemos todos y filtramos en el frontend para no bloquear el desarrollo.
    const response = await api.get('/api/eventos');
    let publicados = response.data.filter((e: any) => String(e.estado).toUpperCase() === 'PUBLICADO');
    
    if (query) {
      const q = query.toLowerCase();
      publicados = publicados.filter((e: any) => 
        e.nombre.toLowerCase().includes(q) || 
        (e.descripcion && e.descripcion.toLowerCase().includes(q))
      );
    }
    return publicados;
  },

  obtenerEventoPorId: async (id: string | number) => {
    const response = await api.get(`/api/eventos/${id}`);
    return response.data;
  },

  /** Obtener datos de un evento específico (GET /api/eventos/:id) */
  obtenerDatosEvento: async (eventoId: string | number): Promise<Evento> => {
    const response = await api.get(`/api/eventos/${eventoId}`);
    return response.data;
  },

  /** Obtener los asientos de una zona (GET /api/zonas/:id/asientos) */
  obtenerSillasDeZona: async (zonaId: string | number): Promise<Asiento[]> => {
    const response = await api.get(`/api/zonas/${zonaId}/asientos`);
    return response.data;
  },

  /** Descargar el SVG del mapa del recinto (archivo estático en /public) */
  descargarSvgMapa: async (): Promise<string> => {
    const response = await fetch("/mapa-guillermo.svg");
    if (!response.ok) throw new Error("Error al cargar el archivo SVG");
    return await response.text();
  },
};