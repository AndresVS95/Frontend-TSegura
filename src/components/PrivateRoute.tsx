// src/components/PrivateRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { tokenManager } from "../lib/tokenManager";
import type { UserRole } from "../types/auth.types";

interface Props {
    children: ReactNode;
    allowedRole?: UserRole;
}

const PrivateRoute = ({ children, allowedRole }: Props) => {
    const location = useLocation();
    const user = tokenManager.getUser();

    // 1. Sin token o expirado → al login, guardando la ruta de origen
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Verificar rol si se requiere uno específico
    if (allowedRole && user.perfil !== allowedRole) {
        console.warn(
            `[PrivateRoute] Acceso denegado a "${location.pathname}".`,
            `\n  Rol requerido : ${allowedRole}`,
            `\n  Rol del token : ${user.perfil ?? '⚠️ undefined — verificar campo en JWT'}`,
            `\n  Token completo:`, user
        );

        // Si el perfil es undefined puede ser que el campo se llame diferente en el JWT.
        // Revisar el console.warn anterior para saber el nombre real del campo.
        // Redirigir según el rol real que tenga (no mandarlo al login si SÍ está autenticado)
        if (user.perfil === 'ORGANIZADOR') {
            return <Navigate to="/dashboard-organizer" replace />;
        }
        if (user.perfil === 'COMPRADOR') {
            return <Navigate to="/dashboard-buyer" replace />;
        }

        // Si perfil es undefined, al catálogo (no al login, ya tiene sesión)
        return <Navigate to="/" replace />;
    }

    // 3. Todo bien
    return <>{children}</>;
};

export default PrivateRoute;