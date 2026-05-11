import api from "./api";

export type RegisterOrganizadorData = {
    usuario: {
        nombre: string;
        correo: string;
        contrasena: string;
        fechaNacimiento: string;
        numeroTelefono: string;
        tipoDocumento: string;
        numeroDocumento: string;
        edad: number;
        genero: string;
        perfil: {
            nombre: string;
        };
    };
    razonSocial: string;
    nit: string;
    stripePaymentMethodId: string;
};

export interface VentasPorZonas {
    zonaId: number;
    nombreZona: string;
    vendidosOnLine: number;
    vendidosEfectivo: number;
    totalVendidos: number;
    capacidad: number;
    porcentajeOcupacion: number;
}

export interface SalesStats {
    totalVendidos: number;
    capacidadTotal: number;
    porcentajeGeneral: number;
    zonas: VentasPorZonas[];
}

export interface IngresoZona {
  nombreZona: string;
  ingresoOnline: number;
  ingresoEfectivo: number;
  totalZona: number;
}
 
export interface RevenueStats {
  totalIngresos: number;
  desglosePorZona: IngresoZona[];
  desglosePorMetodo: {
    online: number;
    efectivo: number;
  };
}
export interface CheckinEntry {
  ticketId: string;
  nombreEnmascarado: string; // "Car*** P***" — privacidad del asistente
  zona: string;
  horaIngreso: string;       // "HH:mm:ss"
}
 
export interface CheckinLog {
  totalIngresados: number;
  entradas: CheckinEntry[];

}

export type EstadoZonaMapa = 'DISPONIBLE' | 'PARCIAL' | 'AGOTADO';
 
export interface ZonaStatus {
  zonaId: number;
  nombreZona: string;
  estado: EstadoZonaMapa;
  cuposVendidos: number;
  cuposTotales: number;
}

export const registerOrganizador = async (
  data: RegisterOrganizadorData
) => {
  const response = await api.post('/api/organizadores/registro', data);
  return response.data;
};




export const organizadorService = {
 
  // HU-026: Ventas en tiempo real por zona
  obtenerSalesStats: async (eventoId: string | number): Promise<SalesStats> => {
    const { data } = await api.get(`/api/events/${eventoId}/sales-stats`);
    return data;
  },
 

  obtenerRevenue: async (eventoId: string | number): Promise<RevenueStats> => {
    const { data } = await api.get(`/api/events/${eventoId}/revenue`);
    return data;
  },
 

  exportarRevenueCSV: async (eventoId: string | number): Promise<void> => {
    const response = await api.get(`/api/events/${eventoId}/revenue/export`, {
      responseType: 'blob',
    });
    const url  = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href  = url;
    link.setAttribute('download', `ingresos-evento-${eventoId}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
 

  obtenerCheckinLog: async (
    eventoId: string | number,
    zonaId?: string | number
  ): Promise<CheckinLog> => {
    const query = zonaId ? `?zonaId=${zonaId}` : '';
    const { data } = await api.get(`/api/events/${eventoId}/checkin-log${query}`);
    return data;
  },
 
  // HU-032: Estado de zonas en tiempo real
  obtenerZonasStatus: async (eventoId: string | number): Promise<ZonaStatus[]> => {
    const { data } = await api.get(`/api/events/${eventoId}/zones/status`);
    return data;
  },
};

