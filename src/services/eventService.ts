import api from "./api";
import type { Evento, CrearEventoDTO} from "../types/event.types";


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

  obtenerEventosPublicados: async (query: string = '') => {
    const url = query 
      ? `/api/eventos/publicados?q=${encodeURIComponent(query)}` 
      : `/api/eventos/publicados`;

    const response = await api.get(url);
    return response.data;
  },

  obtenerEventoPorId: async (id: string | number): Promise<Evento> => {
    const response = await api.get(`/api/eventos/${id}`);
    return response.data;
  },

  /** Obtener los asientos de una zona (GET /api/zonas/:id/asientos) */
  obtenerSillasDeZona: async (zonaId: string | number) => {
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