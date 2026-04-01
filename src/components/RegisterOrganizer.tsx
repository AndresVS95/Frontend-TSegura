import React, { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';

interface Props {
  onBack: () => void;
}

export const RegisterOrganizer: React.FC<Props> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Datos de Usuario Normal
    fullName: '',
    email: '',
    password: '',
    // Datos específicos de Organizador (Tu SQL)
    razon_social: '',
    nit: '',
    direccion_fiscal: '',
    telefono_corporativo: ''
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="animate-fade-in w-full">
      {/* Encabezado de Navegación */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={step === 1 ? onBack : prevStep}
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          ← {step === 1 ? 'Volver al inicio' : 'Paso anterior'}
        </button>
        <div className="text-right">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paso 0{step}/03</span>
          <p className="text-xs font-bold text-[#1E5ADF]">
            {step === 1 ? 'DATOS PERSONALES' : step === 2 ? 'DATOS FISCALES' : 'FINALIZAR'}
          </p>
        </div>
      </div>

      {/* PASO 1: Datos de Usuario (Cuenta) */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Crea tu cuenta de acceso</h2>
            <p className="text-sm text-gray-500 mt-1">Estos serán tus datos para iniciar sesión.</p>
          </div>
          <Input
            label="Nombre del representante*"
            placeholder="Ej. Juan Pérez"
            value={formData.fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <Input
            label="Correo corporativo*"
            type="email"
            placeholder="admin@empresa.com"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Contraseña*"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
          />
          <Button onClick={nextStep} variant="primary">Continuar a datos legales</Button>
        </div>
      )}

      {/* PASO 2: Datos del Organizador (Tu SQL) */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Información de la Organización</h2>
            <p className="text-sm text-gray-500 mt-1">Datos requeridos para la emisión legal de boletas.</p>
          </div>
          <Input
            label="Razón Social*"
            placeholder="Ej. Eventos Globales S.A.S"
            value={formData.razon_social}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, razon_social: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="NIT*"
              placeholder="900.000.000-1"
              value={formData.nit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nit: e.target.value })}
            />
            <Input
              label="Teléfono Corporativo*"
              placeholder="+57 601..."
              value={formData.telefono_corporativo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, telefono_corporativo: e.target.value })}
            />
          </div>
          <Input
            label="Dirección Fiscal"
            placeholder="Calle 123 #45-67"
            value={formData.direccion_fiscal}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, direccion_fiscal: e.target.value })}
          />
          <Button onClick={nextStep} variant="primary">Verificar y Continuar</Button>
        </div>
      )}

      {/* PASO 3: Pago y Activación (Último paso) */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Activa tu panel de control</h2>
            <p className="text-sm text-gray-500 mt-1">Estás a un paso de empezar a crear eventos.</p>
          </div>

          <div className="bg-blue-50 border-2 border-[#1E5ADF] p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#1E5ADF] text-white px-3 py-1 text-[10px] font-bold rounded-bl-xl">
              PAGO ÚNICO
            </div>
            <p className="text-sm font-semibold text-blue-800">Membresía Organizador</p>
            <div className="flex items-baseline gap-1 my-2">
              <span className="text-4xl font-black text-gray-900">$5</span>
              <span className="text-gray-500 font-bold text-sm text-uppercase font-sans">USD</span>
            </div>
            <ul className="text-xs text-blue-700 space-y-2 mt-4">
              <li>✓ Creación de eventos ilimitados</li>
              <li>✓ Acceso a TSegura Check-in App</li>
              <li>✓ Panel de analíticas en tiempo real</li>
            </ul>
          </div>

          <p className="text-[11px] text-gray-400 text-center italic">
            Al hacer clic en "Ir al pago", serás redirigido a nuestra pasarela segura para completar el registro.
          </p>

          <Button variant="primary">Ir al pago y registrarse</Button>
        </div>
      )}
    </div>
  );
};