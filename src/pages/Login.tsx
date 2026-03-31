import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const Login: React.FC = () => {
    // Estado para mostrar/ocultar la contraseña
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">

            {/* Mitad Izquierda: Panel Azul */}
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
                        Tu acceso seguro a los mejores eventos. Inicia sesión para gestionar tus entradas, descubrir nuevas experiencias y conectar con tu pasión.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">El equipo de TSegura</span>
                        <span className="text-green-400">✓</span>
                    </div>
                </div>
            </div>

            {/* Mitad Derecha: Formulario de Login */}
            <div className="w-full md:w-7/12 flex items-center justify-center p-6 sm:p-12 lg:p-20 overflow-y-auto">
                <div className="w-full max-w-md animate-fade-in">

                    {/* Encabezado */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Inicia sesión en tu cuenta</h2>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={(e) => e.preventDefault()}>
                        <Input
                            label="Correo"
                            id="email"
                            type="email"
                            placeholder="Correo"
                            required
                        />

                        <div className="mt-4 relative">
                            <Input
                                label="Contraseña"
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Contraseña"
                                required
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                }
                            />

                            {/* Enlace de Olvidaste tu contraseña posicionado a la derecha */}
                            <div className="flex justify-end mt-2 mb-6">
                                <Link to="/forgot-password" className="text-sm text-[#1E5ADF] hover:underline font-medium">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                        </div>

                        <div className="mt-2">
                            <Button type="submit" variant="primary">Iniciar sesión</Button>
                        </div>
                    </form>

                    {/* Enlace al Registro usando React Router */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        ¿Nuevo en TSegura?{' '}
                        <Link to="/register" className="text-[#1E5ADF] hover:underline font-bold transition-colors">
                            Crear cuenta
                        </Link>
                    </p>

                </div>
            </div>

        </div>
    );
};