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

// 1. Separamos la URL base para que sea más fácil manejar distintas rutas (eventos, zonas, etc.)
const BASE_URL = 'http://localhost:8080/api';
const API_URL = `${BASE_URL}/eventos`;

// Función auxiliar para obtener los headers con el token
const getHeaders = () => {
  const token = localStorage.getItem('token'); // Asegúrate de que así se llame tu variable en localStorage
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const eventService = {
  
  crearEvento: async (eventoDTO: any) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(), // ¡Aquí usamos tu función auxiliar para que quede más limpio!
      body: JSON.stringify(eventoDTO)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el evento en el servidor');
    }

    return await response.json();
  },obtenerMisEventos: async () => {
    const response = await fetch(`${API_URL}/mis-eventos`, {
      method: 'GET',
      headers: getHeaders(), 
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Acceso denegado. Posible cuenta en estado SUSPENDIDO.");
      }
      throw new Error('Error al obtener los eventos');
    }

    return await response.json();
  },
  publicarEvento: async (eventoId: number, datosActuales: any) => {
  // Verificación de seguridad antes de hacer el fetch
  if (!eventoId || eventoId.toString() === 'undefined') {
    throw new Error("El ID del evento es inválido o no se recibió correctamente.");
  }

  const response = await fetch(`${API_URL}/${eventoId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      ...datosActuales,
      estado: 'PUBLICADO'
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al intentar publicar el evento');
  }

  return await response.json();
  
},
obtenerEventosPublicados: async (query: string = '') => {
    const url = query 
      ? `http://localhost:8080/api/eventos/publicados?q=${encodeURIComponent(query)}` 
      : `http://localhost:8080/api/eventos/publicados`;

    console.log("Llamando a la URL:", url); 

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) throw new Error('Error al conectar con el servidor');
    return await response.json();
  },

  
  obtenerEventoPorId: async (id: string | number) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Error al cargar los detalles del evento');
  return await response.json();
},

  


  // --- NUEVAS FUNCIONES PARA EL MAPA ---

  obtenerDatosEvento: async (eventoId: string | number) => {
    // 2. Corregido: Ahora será /api/eventos/1 en lugar de /api/eventos/eventos/1
    const response = await fetch(`${API_URL}/${eventoId}`, {
      method: 'GET',
      headers: getHeaders(), 
    });
    if (!response.ok) throw new Error('Error al obtener evento');
    return await response.json();
  },

  obtenerSillasDeZona: async (zonaId: string | number) => {
    // 3. Corregido: Asumiendo que tu endpoint es /api/zonas/1/asientos
    const response = await fetch(`${BASE_URL}/zonas/${zonaId}/asientos`, {
      method: 'GET',
      headers: getHeaders(), 
    });
    if (!response.ok) throw new Error('Error al obtener las sillas');
    return await response.json();
  },

  descargarSvgMapa: async () => {
    // El SVG está en la carpeta public, no necesita ir a la API ni llevar token
    const response = await fetch('/mapa-guillermo.svg');
    if (!response.ok) throw new Error('Error al cargar el archivo SVG');
    return await response.text(); // fetch devuelve texto para el SVG, no JSON
  },
  
  
  obtenerDisponibilidadZonas: async (id: string) => {
    // Este es el endpoint de la tarea de JG de la HU-007
    const response = await fetch(`http://localhost:8080/api/events/${id}/zones/availability`);
    return await response.json();
  },

  crearReserva: async (eventoId: string, zonaId: string, cantidad: number) => {
    const response = await fetch(`http://localhost:8080/api/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventoId: parseInt(eventoId),
        zonaId: zonaId,
        cantidadAsientos: cantidad
      }),
    });

    if (!response.ok) {
      throw new Error('No se pudo completar la reserva. Es posible que los cupos se hayan agotado.');
    }

    return await response.json();
  }

  
};