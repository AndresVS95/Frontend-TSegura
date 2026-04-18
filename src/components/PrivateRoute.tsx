import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { tokenManager } from "../lib/tokenManager";
import type { UserRole } from "../types/auth.types";

interface Props {
    children: ReactNode;
    allowedRole?: UserRole;
}

/**
 * Componente guardián de rutas protegidas.
 * Verifica que:
 * 1. Exista un token válido (no expirado)
 * 2. El rol del usuario coincida con el requerido
 *
 * Ya NO es necesario repetir esta lógica en cada página.
 */
const PrivateRoute = ({ children, allowedRole }: Props) => {
    const user = tokenManager.getUser();

    // 1. Si no hay token o está expirado, al login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Si se requiere un rol específico y no coincide, al login
    if (allowedRole && user.perfil !== allowedRole) {
        console.warn(`Acceso denegado: Se requiere ${allowedRole}, el usuario tiene ${user.perfil}`);
        return <Navigate to="/login" replace />;
    }

    // 3. Todo bien, adelante
    return <>{children}</>;
};

export default PrivateRoute;