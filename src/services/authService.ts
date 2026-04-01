import api from "./api";

export type RegisterData = {
    nombre: string;
    correo: string;
    contrasena: string;
    fechaNacimiento: string;
    numeroTelefono: string;
    edad: number;
    genero: string;
    tipoDocumento: string;
    numeroDocumento: string;
    nombrePerfil: string;
};

export const registerUsuario = async (userData: RegisterData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
};


// 1. Definimos qué enviamos para el Login
export type LoginData = {
    correo: string;
    contrasena: string;
};

// 2. Creamos la función para hacer Login
export const loginUsuario = async (credentials: LoginData) => {
    const response = await api.post("/auth/login", credentials);
    return response.data; // Esto devolverá el token que te da Spring Boot
};


