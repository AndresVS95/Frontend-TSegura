import api from './api';

export const ticketService = {
  /**
   * Obtiene la lista de boletos del comprador autenticado.
   */
  obtenerMisBoletos: async () => {
    const { data } = await api.get('/api/mis-boletos');
    return data;
  },

  /**
   * Genera el token QR dinámico para un boleto específico.
   */
  generarQr: async (boletoId: string) => {
    const { data } = await api.get(`/api/mis-boletos/${boletoId}/generar-qr`);
    return data;
  },

  /**
   * Valida un token QR en la puerta de entrada (Rol Organizador).
   * Devuelve un texto plano como respuesta.
   */
  validarIngreso: async (tokenQR: string) => {
    const { data } = await api.post('/api/mis-boletos/validar-ingreso', { tokenQR });
    return data;
  }
};
