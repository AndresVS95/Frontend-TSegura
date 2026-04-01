import React, { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';

interface Props {
    onBack: () => void;
}

export const RegisterBuyer: React.FC<Props> = ({ onBack }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: ''
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            console.log('Registro de comprador exitoso', formData);
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-4">
                    <span>‹</span> Volver
                </button>
                <h2 className="text-3xl font-bold text-gray-900">Registro de Comprador</h2>
                <p className="text-gray-500">Únete para descubrir los mejores eventos.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Nombre completo*" placeholder="Ej. Carlos Mendoza" required />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Cédula*" placeholder="Documento" required />
                    <Input label="Teléfono*" placeholder="+57..." required />
                </div>

                <Input
                    label="Correo electrónico*"
                    type="email"
                    placeholder="tu@correo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

                <Input
                    label="Crear contraseña*"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    rightElement={
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs font-bold text-[#1E5ADF]">
                            {showPassword ? "OCULTAR" : "MOSTRAR"}
                        </button>
                    }
                    required
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

                <div className="flex items-start mt-6">
                    <input type="checkbox" className="mt-1 h-4 w-4 text-[#1E5ADF] border-gray-300 rounded" required />
                    <label className="ml-2 text-sm text-gray-600">
                        Acepto los <span className="text-gray-900 font-bold underline cursor-pointer">términos y condiciones</span>.
                    </label>
                </div>

                <Button type="submit" variant="primary">Crear mi cuenta</Button>
            </form>
        </div>
    );
};