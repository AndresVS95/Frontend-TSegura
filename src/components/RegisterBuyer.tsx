import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from './Input';
import { Button } from './Button';
import { Select } from './Select';
import { useRegisterBuyer } from '../hooks/useRegisterBuyer';

interface Props {
    onBack: () => void;
}

// ─── SUB-COMPONENTES ───────────────────────────────────────────────────────

const RegistrationHeader = () => (
    <header className="mb-10 text-left">
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">Crear cuenta</h2>
        <p className="text-sm text-gray-600 mt-1">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Ingresa aquí
            </Link>
        </p>
    </header>
);

const LegalSection = () => (
    <div className="mt-8 space-y-5">
        <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 h-5 w-5 text-[#1E5ADF] border-gray-300 rounded cursor-pointer" required />
            <label className="text-xs text-gray-500 leading-tight">
                Acepto la <span className="text-blue-600 font-bold underline cursor-pointer">Política de privacidad</span>, su anexo de privacidad para ciudadanos colombianos y los <span className="text-blue-600 font-bold underline cursor-pointer">Términos y condiciones</span> de TSegura y autorizo el tratamiento de mis datos personales.
            </label>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-[10px] text-gray-400 leading-relaxed text-justify">
                Autorizo a TSegura a realizar el tratamiento de mis datos personales con las finalidades de prestar el servicio y/o bien ofertado, procesar la transacción y establecer una comunicación por sí mismo o mediante terceros con información, encuestas, noticias, ofertas, promociones, publicidad o actividades propias, de nuestros anunciantes o terceros vinculados.
            </p>
        </div>
    </div>
);

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────

export const RegisterBuyer: React.FC<Props> = ({ onBack }) => {
    const {
        formData,
        errors,
        loading,
        showPassword,
        setShowPassword,
        handleChange,
        handleSubmit
    } = useRegisterBuyer(onBack);

    return (
        <div className="animate-fade-in max-w-xl mx-auto px-2">
            <RegistrationHeader />

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* ─── SECCIÓN 1: DATOS PERSONALES ─── */}
                <div className="space-y-5">
                    <Input
                        label="Nombre completo"
                        placeholder="Nombre y Apellidos"
                        value={formData.fullname}
                        onChange={(e) => handleChange('fullname', e.target.value)}
                    />
                    {errors.fullname && <p className="text-red-500 text-xs font-bold mt-[-12px]">{errors.fullname}</p>}

                    <Select
                        label="País de residencia"
                        options={[{ value: 'Colombia', label: 'Colombia' }]}
                        value={formData.pais}
                        onChange={(e) => handleChange('pais', e.target.value)}
                    />

                    <Input
                        label="Teléfono"
                        placeholder="Número de teléfono (Ej: 3001234567)"
                        value={formData.telefono}
                        onChange={(e) => handleChange('telefono', e.target.value)}
                    />
                    {errors.telefono && <p className="text-red-500 text-xs font-bold mt-[-12px]">{errors.telefono}</p>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Select
                            label="Tipo de documento"
                            options={[{ value: 'CC', label: 'Cédula de Ciudadanía' }]}
                            value={formData.tipoDocumento}
                            onChange={(e) => handleChange('tipoDocumento', e.target.value)}
                        />
                        <Input
                            label="Número de Documento"
                            placeholder="Ej: 1234567890"
                            value={formData.numeroDocumento}
                            onChange={(e) => handleChange('numeroDocumento', e.target.value)}
                        />
                    </div>
                    {errors.numeroDocumento && <p className="text-red-500 text-xs font-bold mt-[-12px]">{errors.numeroDocumento}</p>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                            label="Fecha de Nacimiento"
                            type="date"
                            value={formData.fechaNacimiento}
                            onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                        />
                        <Select
                            label="Género"
                            options={[
                                { value: 'Masculino', label: 'Masculino' },
                                { value: 'Femenino', label: 'Femenino' },
                                { value: 'Otro', label: 'Selecciona tu género' }
                            ]}
                            value={formData.genero}
                            onChange={(e) => handleChange('genero', e.target.value)}
                        />
                    </div>
                    {errors.fechaNacimiento && <p className="text-red-500 text-xs font-bold mt-[-12px]">{errors.fechaNacimiento}</p>}
                </div>

                <hr className="border-gray-100 my-8" />

                {/* ─── SECCIÓN 2: CREDENCIALES (AL FINAL) ─── */}
                <div className="space-y-5">
                    <Input
                        label="Correo electrónico"
                        type="email"
                        placeholder="tu@correo.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                    />
                    {errors.email && <p className="text-red-500 text-xs font-bold mt-[-12px]">{errors.email}</p>}

                    <Input
                        label="Contraseña"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        rightElement={
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs font-bold text-[#1E5ADF]">
                                {showPassword ? "OCULTAR" : "MOSTRAR"}
                            </button>
                        }
                    />
                    {errors.password && <p className="text-red-500 text-xs font-bold mt-[-12px]">{errors.password}</p>}

                    <Input
                        label="Confirmar Contraseña"
                        type={showPassword ? "text" : "password"}
                        placeholder="Repite tu contraseña"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs font-bold mt-[-12px]">{errors.confirmPassword}</p>}
                </div>

                <LegalSection />

                <div className="pt-6">
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full py-4 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                        disabled={loading}
                    >
                        {loading ? "Registrando..." : "Registrarme"}
                    </Button>
                </div>
            </form>
        </div>
    );
};