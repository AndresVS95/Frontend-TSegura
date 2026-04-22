import { jwtDecode } from 'jwt-decode';
import type { DecodedToken } from '../types/auth.types';

const TOKEN_KEY = 'token';

/**
 * Fuente única de verdad para el manejo del JWT token.
 * TODOS los archivos del proyecto deben usar este módulo
 * en vez de acceder a localStorage/sessionStorage directamente.
 */
export const tokenManager = {
  /** Obtener el token almacenado */
  get: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /** Guardar un nuevo token */
  set: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /** Eliminar el token (logout) */
  remove: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  /** Limpiar todo el almacenamiento local (logout completo) */
  clearAll: (): void => {
    localStorage.clear();
  },

  /** Decodificar el token y obtener los datos del usuario */
  getUser: (): DecodedToken | null => {
    const token = tokenManager.get();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      // Verificar si el token está expirado
      if (decoded.exp * 1000 < Date.now()) {
        tokenManager.remove();
        return null;
      }

      return decoded;
    } catch {
      tokenManager.remove();
      return null;
    }
  },

  /** Verificar si el token existe y no está expirado */
  isValid: (): boolean => {
    return tokenManager.getUser() !== null;
  },
};
