// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { loginUsuario } from '../services/authService';
import { tokenManager } from '../lib/tokenManager';
import { CheckCircle2, ChevronRight, Lock, Mail } from 'lucide-react';

export type { DecodedToken } from '../types/auth.types';

// ─── COMPONENTE DEL BANNER (Estilo Claude Design) ─────────────────────

const AuthBanner = () => (
    <div className="hidden lg:flex lg:w-[40%] bg-gradient-to-br from-[#2748E8] via-[#2748E8] to-[#1a35c7] text-white p-16 flex-col justify-between relative overflow-hidden h-screen sticky top-0">
        {/* Glow decorativo */}
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-blue-400/20 blur-[120px] rounded-full" />

        <div>
            <div className="flex items-center gap-2 mb-12">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <CheckCircle2 className="text-white" size={18} />
                </div>
                <span className="text-2xl font-black tracking-tighter">TSegura<span className="text-white">.</span></span>
            </div>
        </div>

        <div className="relative z-10">
            <span className="text-4xl font-serif italic mb-6 block opacity-20">"</span>
            <h2 className="text-3xl font-bold leading-tight mb-8">
                Tu acceso seguro a los mejores eventos. Inicia sesión para gestionar tus entradas.
            </h2>
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold opacity-80">El equipo de TSegura</span>
                <CheckCircle2 size={16} className="text-[#F5C518] shadow-sm" />
            </div>
        </div>
    </div>
);

// ─── LÓGICA PRINCIPAL ──────────────────────────────────────────────────

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const desde = location.state?.from?.pathname || '/';

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
                throw new Error('No se recibió un token válido del servidor');
            }

            tokenManager.set(token);
            const user = tokenManager.getUser();

            if (!user) throw new Error("Token inválido o expirado");

            // Redirección inteligente
            if (user.perfil === 'ORGANIZADOR') {
                navigate('/dashboard-organizer', { replace: true });
            } else {
                navigate(desde, { replace: true });
            }

        } catch (error: any) {
            console.error("Error en el login:", error);
            const { status, data } = error.response || {};
            setErrorMsg(data?.message || "Credenciales incorrectas. Por favor, verifica tus datos.");
            tokenManager.remove();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans overflow-hidden">
            <AuthBanner />

            {/* Panel derecho: formulario */}
            <div className="w-full lg:w-[60%] flex items-center justify-center p-8 md:p-16 lg:p-24 overflow-y-auto bg-[#FDFDFF]">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">

                    <div className="mb-12">
                        <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tight">
                            Inicia <span className="text-[#2748E8]">Sesión.</span>
                        </h1>
                        <p className="text-gray-400 font-medium">Ingresa tus credenciales para continuar.</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-8 p-4 bg-red-50 text-red-600 text-xs font-bold border border-red-100 rounded-2xl animate-bounce uppercase tracking-tighter">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Input
                                label="Correo electrónico"
                                id="email"
                                type="email"
                                placeholder="tu@correo.com"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Input
                                label="Contraseña"
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Tu contraseña segura"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                disabled={isLoading}
                                required
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-[10px] font-black text-[#2748E8] hover:underline px-2"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? 'OCULTAR' : 'VER'}
                                    </button>
                                }
                            />

                            <div className="flex justify-end mt-4">
                                <Link
                                    to="/forgot-password"
                                    className="text-xs text-gray-400 hover:text-[#2748E8] font-bold uppercase tracking-widest transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-12 bg-[#2748E8] disabled:bg-blue-300 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>Ingresar <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <p className="mt-12 text-center text-sm text-gray-400 font-medium">
                        ¿Nuevo en TSegura?{' '}
                        <Link
                            to="/register"
                            className="text-[#2748E8] font-black hover:underline"
                        >
                            Crear una cuenta ahora
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};