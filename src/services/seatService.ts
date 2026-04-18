const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const seatService = {
  // Traer los 100 asientos de una zona específica
  obtenerAsientosPorZona: async (zonaId: number) => {
    const response = await fetch(`${API_URL}/zonas/${zonaId}/asientos`);
    if (!response.ok) throw new Error('Error al cargar los asientos');
    return await response.json();
  },

  // Reservar un asiento temporalmente
  reservarAsiento: async (asientoId: number) => {
    const response = await fetch(`${API_URL}/asientos/${asientoId}/reservar`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('El asiento ya fue tomado por otra persona');
    return await response.json();
  }
};