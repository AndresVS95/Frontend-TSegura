/**
 * Roles disponibles en el sistema TSegura.
 * Se usa para tipado fuerte en PrivateRoute, Login y validaciones de rol.
 */
export type UserRole = 'ADMIN' | 'COMPRADOR' | 'ORGANIZADOR' | 'VALIDADOR';

/**
 * Estructura del payload del JWT que devuelve el backend de Spring Boot.
 * Antes estaba definida dentro de Login.tsx — ahora vive aquí como fuente única.
 */
export interface DecodedToken {
  nombre_completo: string;
  perfil: UserRole;
  sub: string;
  iat: number;
  exp: number;
}
