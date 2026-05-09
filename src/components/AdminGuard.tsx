// src/components/AdminGuard.tsx
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { tokenManager } from '../lib/tokenManager';


interface Props { children: ReactNode; }

/**
 * Guard exclusivo para rutas /admin/*.
 * - Sin token → /admin/login
 * - Token con perfil != ADMIN → /login (no tiene acceso)
 */
const AdminGuard = ({ children }: Props) => {
  const location = useLocation();
  const user = tokenManager.getUser();

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (user.perfil !== "ADMIN") {
    console.warn(`[AdminGuard] Acceso denegado. Perfil: ${user.perfil}`);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;