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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            const response = await loginUsuario({ correo, contrasena });

            const token = response.token || response;

            if (!token || typeof token !== 'string') {
                throw new Error("No se recibió un token válido del servidor");
            }

            // 🔥 CAMBIO CLAVE
            localStorage.setItem('token', token);

            const decoded = jwtDecode<DecodedToken>(token);
            console.log("¡Bienvenido!", decoded.nombre_completo);

            // 🔥 CAMBIO CLAVE (replace: true)
            if (decoded.perfil === 'ORGANIZADOR') {
                navigate('/dashboard-organizer', { replace: true });
            } else if (decoded.perfil === 'COMPRADOR') {
                navigate('/dashboard-buyer', { replace: true });
            } else {
                navigate('/', { replace: true });
            }

        } catch (error: any) {
            console.error("Error en el login:", error);
            setErrorMsg(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Credenciales incorrectas o error de conexión."
            );
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

                    {errorMsg && (
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
                            disabled={isLoading}
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
                                disabled={isLoading}
                                required
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-600"
                                        disabled={isLoading}
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

                        <Button type="submit" variant="primary" disabled={isLoading}>
                            {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
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