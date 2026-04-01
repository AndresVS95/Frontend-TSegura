import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './Input';
import { Button } from './Button';
import { registerUsuario } from '../services/authService'; // Importamos el servicio

interface Props {
    onBack: () => void;
}

export const RegisterBuyer: React.FC<Props> = ({ onBack }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // 1. Ampliamos el estado para incluir todos los campos necesarios
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        cedula: '',
        telefono: '',
        perfil: 'COMPRADOR' // Importante para el Backend
    });

    const [errors, setErrors] = useState({ email: '', password: '' });

    const validate = () => {
        let isValid = true;
        const newErrors = { email: '', password: '' };

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Formato de correo inválido.';
            isValid = false;
        }

        if (formData.password.length < 8) {
            newErrors.password = 'Mínimo 8 caracteres.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // 2. Función de envío conectada al servicio
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const datosParaBackend = {
                // Campos que ya tienes en el formulario
                nombre: formData.fullname,
                correo: formData.email,
                contrasena: formData.password,
                numeroTelefono: formData.telefono,
                cedula: formData.cedula,
                perfil: formData.perfil, // Probablemente 'CLIENTE'

                // Campos obligatorios que TS detectó que faltan:
                numeroDocumento: formData.cedula,      // Usamos la cédula aquí también
                tipoDocumento: "CC",                    // Valor por defecto (Cédula de Ciudadanía)
                genero: "No especificado",              // Valor por defecto
                nombrePerfil: formData.perfil,          // Replicamos el perfil aquí

                // Otros campos que TS pidió anteriormente
                fechaNacimiento: "2000-01-01",
                edad: 24,
                direccion: "No especificada",
                ciudad: "No especificada"
            };

            // Ahora TypeScript debería estar feliz porque el objeto tiene TODO
            await registerUsuario(datosParaBackend);

            alert("¡Registro exitoso!");
            navigate('/login');
        } catch (error) {
            console.error("Error en el registro:", error);
            alert("Hubo un problema al crear la cuenta.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <button
                    onClick={onBack}
                    className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-4 transition-colors"
                >
                    <span className="text-lg">‹</span> Volver
                </button>
                <h2 className="text-3xl font-bold text-gray-900">Registro de Comprador</h2>
                <p className="text-gray-500">Únete para descubrir los mejores eventos.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre Completo */}
                <Input
                    label="Nombre completo*"
                    placeholder="Ej. Carlos Mendoza"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    required
                />

                {/* Cédula y Teléfono */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Cédula*"
                        placeholder="Documento"
                        value={formData.cedula}
                        onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                        required
                    />
                    <Input
                        label="Teléfono*"
                        placeholder="+57..."
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        required
                    />
                </div>

                {/* Email */}
                <Input
                    label="Correo electrónico*"
                    type="email"
                    placeholder="tu@correo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email}</p>}

                {/* Contraseña */}
                <Input
                    label="Crear contraseña*"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-xs font-bold text-[#1E5ADF] hover:text-blue-800 transition-colors"
                        >
                            {showPassword ? "OCULTAR" : "MOSTRAR"}
                        </button>
                    }
                    required
                />
                {errors.password && <p className="text-red-500 text-xs font-medium">{errors.password}</p>}

                {/* Checkbox de Términos */}
                <div className="flex items-start mt-6">
                    <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 text-[#1E5ADF] border-gray-300 rounded cursor-pointer"
                        required
                    />
                    <label className="ml-2 text-sm text-gray-600">
                        Acepto los <span className="text-gray-900 font-bold underline cursor-pointer">términos y condiciones</span>.
                    </label>
                </div>

                {/* Botón de envío */}
                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? "Creando cuenta..." : "Crear mi cuenta"}
                    </Button>
                </div>
            </form>
        </div>
    );
};