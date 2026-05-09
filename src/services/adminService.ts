import api from './api';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type EstadoSolicitud = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
export type EstadoCuenta    = 'ACTIVO' | 'SUSPENDIDO' | 'PENDIENTE';
export type RolUsuario      = 'ADMIN' | 'ORGANIZADOR' | 'COMPRADOR';

export interface SolicitudOrganizador {
  id: number;
  nombreCompleto: string;
  correo: string;
  nit: string;
  nombreEmpresa: string;
  estado: EstadoSolicitud;
  fechaSolicitud: string;
  motivoRechazo?: string;
}

export interface Usuario {
  id: number;
  nombreCompleto: string;
  correo: string;
  perfil: RolUsuario;
  estado: EstadoCuenta;
  fechaRegistro: string;
  numeroDocumento?: string;
  numeroTelefono?: string;
  // Historial según rol
  totalEventos?: number;       // ORGANIZADOR
  totalCompras?: number;       // COMPRADOR
  totalRecaudo?: number;       // ORGANIZADOR
}

export interface KpisAdmin {
  totalUsuarios: number;
  organizadoresActivos: number;
  eventosPublicados: number;
  boletosVendidosHoy: number;
  ingresosHoy: number;
}

export interface PuntoVenta {
  fecha: string;   // 'YYYY-MM-DD'
  ventas: number;
}

export interface CrearUsuarioDTO {
  nombreCompleto: string;
  correo: string;
  contrasenaTemp: string;
  perfil: RolUsuario;
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

export const adminService = {

  // ── HU-033: Solicitudes de organizadores ──────────────────────────────────
  obtenerSolicitudes: async (
    estado?: EstadoSolicitud,
    q?: string
  ): Promise<SolicitudOrganizador[]> => {
    const params = new URLSearchParams();
    if (estado) params.append('estado', estado);
    if (q)      params.append('q', q);
    const query = params.toString() ? `?${params}` : '';
    const { data } = await api.get(`/api/admin/organizers/requests${query}`);
    return data;
  },

  // ── HU-035: Rechazar solicitud ────────────────────────────────────────────
  rechazarSolicitud: async (id: number, motivo: string): Promise<void> => {
    await api.post(`/api/admin/organizers/${id}/reject`, { motivo });
  },

  // Aprobar solicitud
  aprobarSolicitud: async (id: number): Promise<void> => {
    await api.post(`/api/admin/organizers/${id}/approve`);
  },

  // ── HU-036: Suspender / Reactivar organizador ─────────────────────────────
  suspenderOrganizador: async (id: number, motivo: string): Promise<void> => {
    await api.post(`/api/admin/organizers/${id}/suspend`, { motivo });
  },

  reactivarOrganizador: async (id: number): Promise<void> => {
    await api.post(`/api/admin/organizers/${id}/reactivate`);
  },

  // ── HU-037: Crear usuario manual ──────────────────────────────────────────
  crearUsuario: async (dto: CrearUsuarioDTO): Promise<void> => {
    await api.post('/api/admin/users', dto);
  },

  // ── HU-038: Buscar usuarios ───────────────────────────────────────────────
  buscarUsuarios: async (q: string): Promise<Usuario[]> => {
    const { data } = await api.get(`/api/admin/users?q=${encodeURIComponent(q)}`);
    return data;
  },

  obtenerUsuarioPorId: async (id: number): Promise<Usuario> => {
    const { data } = await api.get(`/api/admin/users/${id}`);
    return data;
  },

  // ── HU-039: Dashboard KPIs ────────────────────────────────────────────────
  obtenerKpis: async (): Promise<KpisAdmin> => {
    const { data } = await api.get('/api/admin/dashboard');
    return data;
  },

  obtenerVentasUltimos7Dias: async (): Promise<PuntoVenta[]> => {
    const { data } = await api.get('/api/admin/dashboard/sales-chart');
    return data;
  },
};