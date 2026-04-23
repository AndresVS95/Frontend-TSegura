/**
 * Tipos centralizados para el dominio de Eventos.
 * Reemplaza los `any` que estaban en eventService, DashboardOrganizer, CrearEvento, etc.
 */

/** Estado del ciclo de vida de un evento */
export type EstadoEvento = 'BORRADOR' | 'PUBLICADO' | 'CANCELADO' | 'FINALIZADO';

/** Zona dentro de un evento (VIP, General, Plata, etc.) */
export interface Zona {
  zonaId: number;
  nombreZona: string;
  capacidad: number;
  precio: number;
  asientosNumerados: boolean;
  cuposDisponibles?: number;
}

/** Evento tal como lo devuelve el backend (GET /api/eventos) */
export interface Evento {
  eventoId: number;
  nombre: string;
  descripcion: string;
  fechaEvento: string;
  horaEvento: string;
  estado: EstadoEvento;
  urlImagen?: string;
  edadMinima?: number;
  permiteReventa?: boolean;
  precioMaxReventa?: number;
  recintoId?: number;
  tipoEventoId?: number;
  zonas?: Zona[];
  entradasVendidas?: number;
  capacidadTotal?: number;
  recaudo?: number;
}

/** Payload para crear un evento (POST /api/eventos) */
export interface CrearEventoDTO {
  nombre: string;
  descripcion: string;
  fechaEvento: string;
  horaEvento: string;
  urlImagen: string;
  edadMinima: number;
  permiteReventa: boolean;
  precioMaxReventa: number;
  recintoId: number;
  tipoEventoId: number;
  estado: EstadoEvento;
  zonas: {
    nombreZona: string;
    capacidad: number;
    precio: number;
    asientosNumerados: boolean;
    cuposDisponibles: number;
  }[];
}

/** Formulario local del wizard CrearEvento (antes de mapear al DTO) */
export interface CrearEventoForm {
  nombre: string;
  fecha_evento: string;
  descripcion: string;
  recinto_id: number;
  zonas: Zona[];
}

/** Asiento individual en una zona */
export interface Asiento {
  asientoId: number;
  fila: string;
  numero: number;
  estado: 'DISPONIBLE' | 'VENDIDO' | 'RESERVADO';
}
