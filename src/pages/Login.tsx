import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { loginUsuario } from '../services/authService';

export interface DecodedToken {
    nombre_completo: string;
    perfil: string;
    sub: string;
    iat: number;
    exp: number;
}

export const Login: React.FC = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    // Estados para bloqueo de intentos fallidos
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

    // Constantes para bloqueo
    const MAX_ATTEMPTS = 3;
    const BLOCK_TIME_MINUTES = 15;
    const LOCKOUT_KEY = 'login_lockout';

    // Validar si el usuario está bloqueado
    const checkIfBlocked = () => {
        const lockoutData = localStorage.getItem(LOCKOUT_KEY);
        if (lockoutData) {
            const { blockUntil, email } = JSON.parse(lockoutData);
            const now = Date.now();

            if (now < blockUntil && email === correo) {
                const remainingTime = Math.ceil((blockUntil - now) / 1000 / 60);
                setBlockTimeRemaining(remainingTime);
                setIsBlocked(true);
                return true;
            } else if (now >= blockUntil) {
                // El tiempo de bloqueo expiró, limpiar
                localStorage.removeItem(LOCKOUT_KEY);
                setIsBlocked(false);
                setFailedAttempts(0);
            }
        }
        return false;
    };

    // Incrementar intentos fallidos y bloquear si es necesario
    const incrementFailedAttempts = () => {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);

        if (newAttempts >= MAX_ATTEMPTS) {
            const blockUntil = Date.now() + BLOCK_TIME_MINUTES * 60 * 1000;
            localStorage.setItem(
                LOCKOUT_KEY,
                JSON.stringify({ blockUntil, email: correo })
            );
            setIsBlocked(true);
            setBlockTimeRemaining(BLOCK_TIME_MINUTES);
        }
    };

    // Limpiar intentos fallidos
    const clearFailedAttempts = () => {
        setFailedAttempts(0);
        localStorage.removeItem(LOCKOUT_KEY);
        setIsBlocked(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        // Verificar si está bloqueado
        if (checkIfBlocked()) {
            setErrorMsg(
                `Tu cuenta está bloqueada por seguridad. Intenta nuevamente en ${blockTimeRemaining} minuto(s).`
            );
            return;
        }

        setIsLoading(true);

        try {
            const response = await loginUsuario({ correo, contrasena });

            const token = response.token || response;

            if (!token || typeof token !== 'string') {
                throw new Error("No se recibió un token válido del servidor");
            }

            // Login exitoso: limpiar intentos fallidos
            localStorage.setItem('token', token);

            const decoded = jwtDecode<DecodedToken>(token);
            console.log("¡Bienvenido!", decoded.nombre_completo);

            if (decoded.perfil === 'ORGANIZADOR') {
                navigate('/dashboard-organizer', { replace: true });
            } else if (decoded.perfil === 'COMPRADOR') {
                navigate('/dashboard-buyer', { replace: true });
            } else {
                navigate('/', { replace: true });
            }

        } catch (error: any) {
            console.error("Error en el login:", error);

            // Incrementar intentos fallidos
            incrementFailedAttempts();

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Credenciales incorrectas o error de conexión.";

            // Mostrar contador de intentos
            if (failedAttempts + 1 < MAX_ATTEMPTS) {
                setErrorMsg(
                    `${errorMessage} (Intento ${failedAttempts + 1}/${MAX_ATTEMPTS})`
                );
            } else if (failedAttempts + 1 === MAX_ATTEMPTS) {
                setErrorMsg(
                    `${errorMessage} - Tu cuenta ha sido bloqueada por seguridad durante ${BLOCK_TIME_MINUTES} minutos.`
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">

            <div className="hidden md:flex md:w-5/12 bg-[#1E5ADF] text-white p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                </div>

                <div className="relative z-10">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-3xl">🎫</span> TSegura.
                    </h1>
                </div>

                <div className="relative z-10 max-w-md">
                    <span className="text-4xl text-blue-300 font-serif leading-none">"</span>
                    <p className="text-lg leading-relaxed mt-2 mb-6 text-blue-50">
                        Tu acceso seguro a los mejores eventos. Inicia sesión para gestionar tus entradas.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">El equipo de TSegura</span>
                        <span className="text-green-400">✓</span>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-7/12 flex items-center justify-center p-6 sm:p-12 lg:p-20 overflow-y-auto">
                <div className="w-full max-w-md animate-fade-in">

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Inicia sesión en tu cuenta</h2>
                    </div>

                    {isBlocked && errorMsg && (
                        <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 border border-yellow-300 rounded-lg">
                            <p className="font-semibold mb-2"> Cuenta Bloqueada por Seguridad</p>
                            <p className="text-sm mb-4">{errorMsg}</p>
                            <Link 
                                to="/forgot-password" 
                                className="inline-block text-sm bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                            >
                                Recuperar Contraseña
                            </Link>
                        </div>
                    )}

                    {!isBlocked && errorMsg && (
                        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-lg">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Correo"
                            id="email"
                            type="email"
                            placeholder="Correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            disabled={isLoading || isBlocked}
                            required
                        />

                        <div className="mt-4 relative">
                            <Input
                                label="Contraseña"
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Contraseña"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                disabled={isLoading || isBlocked}
                                required
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-600"
                                        disabled={isLoading || isBlocked}
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                }
                            />

                            <div className="flex justify-end mt-2 mb-6">
                                <Link to="/forgot-password" className="text-sm text-[#1E5ADF] hover:underline font-medium">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                        </div>

                        <Button type="submit" variant="primary" disabled={isLoading || isBlocked}>
                            {isBlocked ? `Bloqueado (${blockTimeRemaining}m)` : isLoading ? 'Iniciando...' : 'Iniciar sesión'}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        ¿Nuevo en TSegura?{' '}
                        <Link to="/register" className="text-[#1E5ADF] hover:underline font-bold">
                            Crear cuenta
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};