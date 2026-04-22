import axios from "axios";
import { tokenManager } from "../lib/tokenManager";

/**
 * Cliente HTTP centralizado para toda la aplicación.
 * TODOS los servicios deben usar este módulo en vez de `fetch` directo.
 *
 * - Inyecta el JWT automáticamente en cada request
 * - Maneja redirección a /login en caso de 401
 * - Lee la URL base desde variables de entorno
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor de REQUEST: inyectar token automáticamente
api.interceptors.request.use(
    (config) => {
        const token = tokenManager.get();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de RESPONSE: manejar errores de autenticación globalmente
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            tokenManager.remove();
            // Solo redirigir si no estamos ya en login/register
            const path = window.location.pathname;
            if (path !== "/login" && path !== "/register") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;