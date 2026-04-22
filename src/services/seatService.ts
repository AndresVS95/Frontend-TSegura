import api from "./api";
import type { Asiento } from "../types/event.types";

/**
 * Servicio de asientos — migrado de fetch manual a Axios.
 * Ahora hereda el token automáticamente del interceptor en api.ts.
 */
export const seatService = {
  /** Traer los asientos de una zona específica */
  obtenerAsientosPorZona: async (zonaId: number): Promise<Asiento[]> => {
    const response = await api.get(`/api/zonas/${zonaId}/asientos`);
    return response.data;
  },

  /** Reservar un asiento temporalmente */
  reservarAsiento: async (asientoId: number): Promise<Asiento> => {
    const response = await api.post(`/api/asientos/${asientoId}/reservar`);
    return response.data;
  },
};