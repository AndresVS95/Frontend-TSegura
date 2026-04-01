import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "../pages/Login";

interface Props {
    children: ReactNode;
    allowedRole?: string; // Nuevo: Para pedir un rol específico
}

const PrivateRoute = ({ children, allowedRole }: Props) => {
    const token = localStorage.getItem("token");

    // 1. Si no hay nada en el cajón, al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode<DecodedToken>(token);

        // 2. Si pedimos un rol (ej: COMPRADOR) y el token tiene otro, al login
        if (allowedRole && decoded.perfil !== allowedRole) {
            console.warn(`Acceso denegado: Se requiere ${allowedRole}`);
            return <Navigate to="/login" replace />;
        }

        // 3. Todo bien, adelante
        return <>{children}</>;

    } catch (error) {
        // Token corrupto o mal formado
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }
};

export default PrivateRoute;