import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from './Input';
import { Button } from './Button';
import { Select } from './Select';
import { useRegisterBuyer } from '../hooks/useRegisterBuyer';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface Props {
    onBack: () => void;
}

export const RegisterBuyer: React.FC<Props> = ({ onBack }) => {
    const [step, setStep] = useState(1);
    const {
        formData,
        errors,
        loading,
        showPassword,
        setShowPassword,
        handleChange,
        handleSubmit
    } = useRegisterBuyer(onBack);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <div className="animate-in slide-in-from-right duration-500 w-full">
            {/* Header / Step Indicator */}
            <div className="flex items-center justify-between mb-8">
                <button
                    type="button"
                    onClick={step === 1 ? onBack : prevStep}
                    className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-[#2748E8] transition-all uppercase tracking-widest group"
                >
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    {step === 1 ? 'Volver al inicio' : 'Paso anterior'}
                </button>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    PASO 0{step}/02
                </span>
            </div>

            {/* Progress Bar Line */}
            <div className="flex gap-2 mb-10">
                <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-[#2748E8]' : 'bg-gray-100'}`} />
                <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-[#2748E8]' : 'bg-gray-100'}`} />
            </div>

            <div className="mb-10">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-4">
                    Datos <span className="text-[#2748E8]">del Comprador.</span>
                </h2>
                <p className="text-pink-500 text-[10px] font-bold uppercase tracking-widest">
                    Los campos marcados con * son obligatorios.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                        <div>
                            <Input
                                label="Nombre completo*"
                                placeholder="Escribe tu nombre y apellidos"
                                value={formData.fullname}
                                onChange={(e) => handleChange('fullname', e.target.value)}
                            />
                            {errors.fullname && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase">{errors.fullname}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Select
                                label="Tipo Doc.*"
                                options={[{ value: 'CC', label: 'C.C.' }]}
                                value={formData.tipoDocumento}
                                onChange={(e) => handleChange('tipoDocumento', e.target.value)}
                            />
                            <Input
                                label="Número de documento*"
                                placeholder="1061722..."
                                value={formData.numeroDocumento}
                                onChange={(e) => handleChange('numeroDocumento', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Input
                                label="Fecha de nacimiento*"
                                type="date"
                                value={formData.fechaNacimiento}
                                onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                            />
                            <Select
                                label="Género*"
                                options={[
                                    { value: 'Masculino', label: 'Masculino' },
                                    { value: 'Femenino', label: 'Femenino' },
                                    { value: 'Otro', label: 'Otro' }
                                ]}
                                value={formData.genero}
                                onChange={(e) => handleChange('genero', e.target.value)}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={nextStep}
                            className="w-full mt-6 bg-[#2748E8] text-white py-5 rounded-[2rem] font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
                        >
                            Continuar <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                        <div>
                            <Input
                                label="Correo electrónico*"
                                type="email"
                                placeholder="tu@correo.com"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase">{errors.email}</p>}
                        </div>

                        <div className="relative">
                            <Input
                                label="Contraseña*"
                                type={showPassword ? "text" : "password"}
                                placeholder="Crea una clave segura"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                rightElement={
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[10px] font-black text-[#2748E8] hover:underline px-2">
                                        {showPassword ? "OCULTAR" : "MOSTRAR"}
                                    </button>
                                }
                            />
                            {errors.password && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase">{errors.password}</p>}
                        </div>

                        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
                            <CheckCircle2 className="text-[#2748E8] shrink-0 mt-1" size={20} />
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                Al registrarte, aceptas nuestros <span className="text-[#2748E8] font-bold underline cursor-pointer">Términos de Servicio</span> y la <span className="text-[#2748E8] font-bold underline cursor-pointer">Privacidad de Datos</span> respaldada por tecnología Blockchain.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-5 text-base font-black bg-[#2748E8] hover:bg-blue-700 text-white rounded-[2rem] shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creando cuenta...</>
                            ) : (
                                "Verificar y Continuar"
                            )}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
};