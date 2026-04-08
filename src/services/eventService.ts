// src/services/eventService.ts

export interface ZonaDTO {
  nombre_zona: string;
  capacidad: number;
  precio: number;
  asientos_numerados: boolean;
}

export interface EventoPayload {
  evento: any;
  zonas: ZonaDTO[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Función auxiliar para obtener los headers con el token
const getHeaders = () => {
  const token = localStorage.getItem('token'); // Asegúrate de que así se llame tu variable en localStorage
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const eventService = {
  
  crearEvento: async (payload: EventoPayload) => {
    try {
      const response = await fetch(`${API_URL}/eventos`, {
        method: 'POST',
        headers: getHeaders(), // <-- Usamos los headers con token
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Error al guardar el evento en el servidor');
      }

      return await response.json();
    } catch (error) {
      console.error("Error en eventService.crearEvento:", error);
      throw error;
    }
  },

  // --- NUEVAS FUNCIONES PARA EL MAPA ---

  obtenerDatosEvento: async (eventoId: string) => {
    const response = await fetch(`${API_URL}/eventos/${eventoId}`, {
      method: 'GET',
      headers: getHeaders(), // <-- Token incluido
    });
    if (!response.ok) throw new Error('Error al obtener evento');
    return await response.json();
  },

  obtenerSillasDeZona: async (zonaId: string) => {
    const response = await fetch(`${API_URL}/zonas/${zonaId}/asientos`, {
      method: 'GET',
      headers: getHeaders(), // <-- Token incluido
    });
    if (!response.ok) throw new Error('Error al obtener las sillas');
    return await response.json();
  },

  descargarSvgMapa: async () => {
    // El SVG está en la carpeta public, no necesita ir a la API ni llevar token
    const response = await fetch('/mapa-guillermo.svg');
    if (!response.ok) throw new Error('Error al cargar el archivo SVG');
    return await response.text(); // fetch devuelve texto para el SVG, no JSON
  }

};