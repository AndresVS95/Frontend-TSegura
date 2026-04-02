import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './Input';
import { Button } from './Button';
import { Select } from './Select';
import { registerOrganizador } from '../services/organizadorService';
import type { RegisterOrganizadorData } from '../services/organizadorService';

interface Props {
  onBack: () => void;
}

export const RegisterOrganizer: React.FC<Props> = ({ onBack }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    // Datos del Usuario
    nombre: '',
    correo: '',
    contrasena: '',
    fechaNacimiento: '',
    numeroTelefono: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    genero: 'Masculino',
    // Datos del Organizador
    razonSocial: '',
    nit: '',
  });

  const validate = (step: number) => {
    let newErrors: Record<string, string> = {};
    let isValid = true;

    if (step === 1) {
      // Validar Paso 1: Datos Personales
      if (!formData.nombre.trim()) {
        newErrors.nombre = 'El nombre es requerido.';
        isValid = false;
      }
      if (!formData.numeroDocumento.trim()) {
        newErrors.numeroDocumento = 'El número de documento es requerido.';
        isValid = false;
      }
      if (!formData.fechaNacimiento.trim()) {
        newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida.';
        isValid = false;
      }
    } else if (step === 2) {
      // Validar Paso 2: Datos de Empresa y Cuenta
      if (!formData.razonSocial.trim()) {
        newErrors.razonSocial = 'La razón social es requerida.';
        isValid = false;
      }
      if (!formData.nit.trim()) {
        newErrors.nit = 'El NIT es requerido.';
        isValid = false;
      }
      if (!formData.numeroTelefono.trim()) {
        newErrors.numeroTelefono = 'El teléfono corporativo es requerido.';
        isValid = false;
      }
      if (!formData.correo.trim()) {
        newErrors.correo = 'El correo corporativo es requerido.';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
        newErrors.correo = 'Formato de correo inválido.';
        isValid = false;
      }
      if (!formData.contrasena.trim()) {
        newErrors.contrasena = 'La contraseña es requerida.';
        isValid = false;
      } else if (formData.contrasena.length < 8) {
        newErrors.contrasena = 'Mínimo 8 caracteres.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validate(step)) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => setStep(step - 1);

  const calcularEdad = (fecha: string) => {
    if (!fecha) return 0;
    const hoy = new Date();
    const cumpleanos = new Date(fecha);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleSubmit = async () => {
    setServerError('');
    setSuccessMsg('');
    setIsLoading(true);

    // Validar paso 2 una última vez antes de enviar
    if (!validate(2)) {
      setIsLoading(false);
      return;
    }

    // ARMAMOS EL JSON EXACTO PARA SPRING BOOT
    const dataToBack: RegisterOrganizadorData = {
      usuario: {
        nombre: formData.nombre,
        correo: formData.correo,
        contrasena: formData.contrasena,
        fechaNacimiento: formData.fechaNacimiento,
        numeroTelefono: formData.numeroTelefono,
        tipoDocumento: formData.tipoDocumento,
        numeroDocumento: formData.numeroDocumento,
        edad: calcularEdad(formData.fechaNacimiento),
        genero: formData.genero,
        perfil: {
          nombre: "ORGANIZADOR" // El rol dentro del objeto perfil
        }
      },
      razonSocial: formData.razonSocial,
      nit: formData.nit,
      stripePaymentMethodId: "pm_card_visa" // Dato simulado por ahora para Stripe
    };

    console.log("Enviando Organizador:", dataToBack);

    try {
      await registerOrganizador(dataToBack);
      setSuccessMsg('¡Organización registrada con éxito! Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (error: any) {
      console.error('Error del backend:', error);
      setServerError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Ocurrió un error al registrar. Revisa los datos o intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={step === 1 ? onBack : prevStep}
          className="text-sm text-gray-500 hover:text-[#1E5ADF] transition-colors"
          disabled={isLoading}
        >
          ← {step === 1 ? 'Volver al inicio' : 'Paso anterior'}
        </button>
        <div className="text-right">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paso 0{step}/03</span>
        </div>
      </div>

      {/* Alertas */}
      {serverError && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-lg">{serverError}</div>}
      {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm border border-green-200 rounded-lg">{successMsg}</div>}

      {/* PASO 1: Datos Personales (Representante) */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Datos del Representante</h2>
          <p className="text-xs text-gray-500 mb-4">Los campos marcados con <span className="font-bold text-gray-700">*</span> son obligatorios.</p>

          <div>
            <Input label="Nombre completo*" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
            {errors.nombre && <p className="text-red-500 text-xs font-medium mt-1">{errors.nombre}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label="Tipo Doc.*" options={[{ value: 'CC', label: 'C.C.' }, { value: 'CE', label: 'C.E.' }]} value={formData.tipoDocumento} onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value })} />
            <div className="sm:col-span-2">
              <Input label="Número de documento*" value={formData.numeroDocumento} onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })} />
              {errors.numeroDocumento && <p className="text-red-500 text-xs font-medium mt-1">{errors.numeroDocumento}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input label="Fecha de nacimiento*" type="date" value={formData.fechaNacimiento} onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })} />
              {errors.fechaNacimiento && <p className="text-red-500 text-xs font-medium mt-1">{errors.fechaNacimiento}</p>}
            </div>
            <Select label="Género*" options={[{ value: 'Masculino', label: 'Masculino' }, { value: 'Femenino', label: 'Femenino' }, { value: 'Otro', label: 'Otro' }]} value={formData.genero} onChange={(e) => setFormData({ ...formData, genero: e.target.value })} />
          </div>

          <Button onClick={nextStep} variant="primary" className="mt-4">Continuar</Button>
        </div>
      )}

      {/* PASO 2: Datos de Empresa y Cuenta */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Datos de la Organización</h2>
          <p className="text-xs text-gray-500 mb-4">Los campos marcados con <span className="font-bold text-gray-700">*</span> son obligatorios.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input label="Razón Social*" placeholder="Ej. Eventos S.A.S" value={formData.razonSocial} onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })} />
              {errors.razonSocial && <p className="text-red-500 text-xs font-medium mt-1">{errors.razonSocial}</p>}
            </div>
            <div>
              <Input label="NIT*" placeholder="900.000.000-1" value={formData.nit} onChange={(e) => setFormData({ ...formData, nit: e.target.value })} />
              {errors.nit && <p className="text-red-500 text-xs font-medium mt-1">{errors.nit}</p>}
            </div>
          </div>

          <div>
            <Input label="Teléfono Corporativo*" placeholder="+57..." value={formData.numeroTelefono} onChange={(e) => setFormData({ ...formData, numeroTelefono: e.target.value })} />
            {errors.numeroTelefono && <p className="text-red-500 text-xs font-medium mt-1">{errors.numeroTelefono}</p>}
          </div>

          <hr className="my-4 border-gray-200" />
          <h3 className="text-sm font-bold text-gray-700">Credenciales de Acceso</h3>

          <div>
            <Input label="Correo corporativo*" type="email" value={formData.correo} onChange={(e) => setFormData({ ...formData, correo: e.target.value })} />
            {errors.correo && <p className="text-red-500 text-xs font-medium mt-1">{errors.correo}</p>}
          </div>
          <div>
            <Input
              label="Contraseña*"
              type={showPassword ? "text" : "password"}
              value={formData.contrasena}
              onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
              rightElement={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs font-bold text-[#1E5ADF]">
                  {showPassword ? "OCULTAR" : "MOSTRAR"}
                </button>
              }
            />
            {errors.contrasena && <p className="text-red-500 text-xs font-medium mt-1">{errors.contrasena}</p>}
          </div>

          <Button onClick={nextStep} variant="primary" className="mt-4">Verificar y Continuar</Button>
        </div>
      )}

      {/* PASO 3: Pago / Finalizar */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Activa tu panel de control</h2>

          <div className="bg-blue-50 border-2 border-[#1E5ADF] p-6 rounded-2xl relative">
            <div className="absolute top-0 right-0 bg-[#1E5ADF] text-white px-3 py-1 text-[10px] font-bold rounded-bl-xl">PAGO ÚNICO</div>
            <p className="text-sm font-semibold text-blue-800">Membresía Organizador</p>
            <div className="flex items-baseline gap-1 my-2">
              <span className="text-4xl font-black text-gray-900">$5</span>
              <span className="text-gray-500 font-bold text-sm">USD</span>
            </div>
            <p className="text-xs text-blue-700 mt-2">✓ Creación ilimitada de eventos y analíticas.</p>
          </div>

          <Button onClick={handleSubmit} variant="primary" disabled={isLoading}>
            {isLoading ? 'Procesando pago y registro...' : 'Pagar y Registrarse'}
          </Button>
        </div>
      )}
    </div>
  );
};