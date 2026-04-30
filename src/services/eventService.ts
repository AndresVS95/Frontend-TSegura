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

  /** Registrar Venta Manual (RF-O-10) */
  registrarVentaManual: async (ventaData: any): Promise<any> => {
    // El backend espera VentaManualDTO en /api/ventas/manual
    const response = await api.post("/api/ventas/manual", ventaData);
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
   obtenerDisponibilidadZonas: async (
    eventoId: string | number
  ): Promise<Record<string, 'DISPONIBLE' | 'AGOTADO'>> => {
 
    // ── REAL (descomentar cuando JG tenga el endpoint listo) ──────────────
    // const response = await api.get(`/api/eventos/${eventoId}/zonas/disponibilidad`);
    // return response.data;
 
    // ── MOCK ACTIVO: endpoint aún no existe en el backend ─────────────────
    // Todas las zonas disponibles para no bloquear el flujo de compra
    console.info(`[Mock] Disponibilidad para evento ${eventoId}`);
    return new Promise((resolve) =>
      setTimeout(() => resolve({
        VIP:     'DISPONIBLE',
        PLATA:   'DISPONIBLE',
        GENERAL: 'DISPONIBLE',
      }), 300)
    );
  },
};