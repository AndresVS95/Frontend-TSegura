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

// 👇 ESTA ES LA LÍNEA CLAVE QUE VITE ESTÁ BUSCANDO 👇
export const registerOrganizador = async (data: RegisterOrganizadorData) => {
    const response = await api.post("/api/organizadores/registro", data);
    return response.data;
};