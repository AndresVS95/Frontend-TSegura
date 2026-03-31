import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const ForgotPassword: React.FC = () => {
    // Estado para controlar en qué paso estamos (1: Correo, 2: Código, 3: Nueva Contraseña, 4: Éxito)
    const [step, setStep] = useState(1);

    // Estados para guardar los datos de cada paso
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Estado para errores
    const [error, setError] = useState('');

    // --- Manejadores de cada paso ---

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Por favor, ingresa un correo electrónico válido.');
            return;
        }
        setError('');
        // Aquí tu backend enviaría el correo real
        setStep(2);
    };

    const handleCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.trim().length < 4) {
            setError('Por favor ingresa el código completo.');
            return;
        }
        setError('');
        // Aquí tu backend validaría que el código sea correcto
        setStep(3);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        setError('');
        // Aquí tu backend guardaría la nueva contraseña
        setStep(4);
    };

    // Textos dinámicos para el panel azul según el paso
    const sidePanelContent = {
        1: "No te preocupes, a todos nos pasa. Ingresa tu correo y te ayudaremos a recuperar tu acceso.",
        2: "Revisa tu bandeja de entrada. Te hemos enviado una clave temporal para verificar tu identidad.",
        3: "Casi listos. Crea una contraseña fuerte y segura que no olvides esta vez.",
        4: "¡Todo listo! Tu cuenta vuelve a estar segura bajo tu control."
    }[step as 1 | 2 | 3 | 4];

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">

            {/* Mitad Izquierda: Panel Azul (Cambia el texto mágicamente según el paso) */}
            <div className="hidden md:flex md:w-5/12 bg-[#1E5ADF] text-white p-12 flex-col justify-between relative overflow-hidden transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                </div>

                <div className="relative z-10">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-3xl">🎫</span> TSegura.
                    </h1>
                </div>

                <div className="relative z-10 max-w-md animate-fade-in" key={step}>
                    <p className="text-xl leading-relaxed mt-2 mb-6 text-blue-50 font-medium">
                        "{sidePanelContent}"
                    </p>
                    {/* Indicador de pasos visual */}
                    {step < 4 && (
                        <div className="flex gap-2 mt-8">
                            <div className={`h-1.5 w-8 rounded-full ${step >= 1 ? 'bg-white' : 'bg-blue-400 opacity-30'}`}></div>
                            <div className={`h-1.5 w-8 rounded-full ${step >= 2 ? 'bg-white' : 'bg-blue-400 opacity-30'}`}></div>
                            <div className={`h-1.5 w-8 rounded-full ${step >= 3 ? 'bg-white' : 'bg-blue-400 opacity-30'}`}></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mitad Derecha: Formularios Dinámicos */}
            <div className="w-full md:w-7/12 flex items-center justify-center p-6 sm:p-12 lg:p-20 overflow-y-auto">
                <div className="w-full max-w-md animate-fade-in relative">

                    {/* Botón de volver (solo pasos 1, 2 y 3) */}
                    {step === 1 && (
                        <Link to="/login" className="absolute -top-12 left-0 text-sm text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-6 w-fit">
                            <span>←</span> Volver al inicio
                        </Link>
                    )}
                    {step > 1 && step < 4 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="absolute -top-12 left-0 text-sm text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-6 w-fit"
                        >
                            <span>←</span> Atrás
                        </button>
                    )}

                    {/* Renderizado condicional basado en el 'step' */}

                    {/* PASO 1: Ingresar Correo */}
                    {step === 1 && (
                        <form onSubmit={handleEmailSubmit} className="space-y-4 animate-fade-in">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Paso 1: Tu cuenta</h2>
                                <p className="text-gray-500">Ingresa el correo electrónico registrado.</p>
                            </div>
                            <Input
                                label="Correo electrónico*"
                                id="email"
                                type="email"
                                placeholder="Ej. correo@tsegura.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {error && <p className="text-red-500 text-xs">{error}</p>}
                            <div className="pt-4">
                                <Button type="submit" variant="primary">Enviar código</Button>
                            </div>
                        </form>
                    )}

                    {/* PASO 2: Ingresar Código */}
                    {step === 2 && (
                        <form onSubmit={handleCodeSubmit} className="space-y-4 animate-fade-in">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Paso 2: Verificación</h2>
                                <p className="text-gray-500">
                                    Enviamos un código de seguridad a <strong>{email}</strong>.
                                </p>
                            </div>
                            <Input
                                label="Código de seguridad*"
                                id="code"
                                type="text"
                                placeholder="Ej. 123456"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            {error && <p className="text-red-500 text-xs">{error}</p>}
                            <div className="pt-4 space-y-3">
                                <Button type="submit" variant="primary">Verificar código</Button>
                                <p className="text-center text-sm text-gray-500 mt-4">
                                    ¿No recibiste nada? <button type="button" className="text-[#1E5ADF] hover:underline">Reenviar código</button>
                                </p>
                            </div>
                        </form>
                    )}

                    {/* PASO 3: Nueva Contraseña */}
                    {step === 3 && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-fade-in">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Paso 3: Nueva Clave</h2>
                                <p className="text-gray-500">Crea una contraseña de al menos 8 caracteres.</p>
                            </div>
                            <Input
                                label="Nueva contraseña*"
                                id="new-password"
                                type="password"
                                placeholder="Escribe tu nueva contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Input
                                label="Confirma tu contraseña*"
                                id="confirm-password"
                                type="password"
                                placeholder="Repite tu nueva contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {error && <p className="text-red-500 text-xs">{error}</p>}
                            <div className="pt-4">
                                <Button type="submit" variant="primary">Guardar nueva contraseña</Button>
                            </div>
                        </form>
                    )}

                    {/* PASO 4: Éxito */}
                    {step === 4 && (
                        <div className="text-center animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                                ✓
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Contraseña actualizada!</h2>
                            <p className="text-gray-500 mb-8">
                                Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión con tu nueva clave.
                            </p>
                            <Link to="/login">
                                <Button type="button" variant="primary">Ir a Iniciar Sesión</Button>
                            </Link>
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
};