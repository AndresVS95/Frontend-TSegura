import React from 'react';
import { Elements, CardElement } from '@stripe/react-stripe-js';
import { Input } from './Input';
import { Button } from './Button';
import { Select } from './Select';
import { useRegisterOrganizer } from '../hooks/useRegisterOrganizer';
import { stripePromise } from '../config/stripe';

interface Props {
  onBack: () => void;
}

// ─── SUB-COMPONENTES DE APOYO ──────────────────────────────────────────────

const RegistrationHeader = ({ step, handleBack, isLoading }: any) => (
  <div className="flex justify-between items-center mb-8">
    <button
      onClick={handleBack}
      className="text-sm text-gray-500 hover:text-[#1E5ADF] transition-colors"
      disabled={isLoading}
    >
      ← {step === 1 ? 'Volver al inicio' : 'Paso anterior'}
    </button>
    <div className="text-right">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paso 0{step}/03</span>
    </div>
  </div>
);

const Alerts = ({ serverError, successMsg }: any) => (
  <>
    {serverError && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-lg">{serverError}</div>}
    {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm border border-green-200 rounded-lg">{successMsg}</div>}
  </>
);

// ─── PASOS DEL FORMULARIO ──────────────────────────────────────────────────

const StepPersonalInfo = ({ formData, handleChange, errors, nextStep }: any) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Datos del Representante</h2>
    <p className="text-xs text-gray-500 mb-4">Los campos marcados con <span className="font-bold text-gray-700">*</span> son obligatorios.</p>

    <div>
      <Input label="Nombre completo*" value={formData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} />
      {errors.nombre && <p className="text-red-500 text-xs font-medium mt-1">{errors.nombre}</p>}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Select label="Tipo Doc.*" options={[{ value: 'CC', label: 'C.C.' }, { value: 'CE', label: 'C.E.' }]} value={formData.tipoDocumento} onChange={(e) => handleChange('tipoDocumento', e.target.value)} />
      <div className="sm:col-span-2">
        <Input label="Número de documento*" value={formData.numeroDocumento} onChange={(e) => handleChange('numeroDocumento', e.target.value)} />
        {errors.numeroDocumento && <p className="text-red-500 text-xs font-medium mt-1">{errors.numeroDocumento}</p>}
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Input label="Fecha de nacimiento*" type="date" value={formData.fechaNacimiento} onChange={(e) => handleChange('fechaNacimiento', e.target.value)} />
        {errors.fechaNacimiento && <p className="text-red-500 text-xs font-medium mt-1">{errors.fechaNacimiento}</p>}
      </div>
      <Select label="Género*" options={[{ value: 'Masculino', label: 'Masculino' }, { value: 'Femenino', label: 'Femenino' }, { value: 'Otro', label: 'Otro' }]} value={formData.genero} onChange={(e) => handleChange('genero', e.target.value)} />
    </div>

    <Button onClick={nextStep} variant="primary" className="mt-4">Continuar</Button>
  </div>
);

const StepCompanyInfo = ({ formData, handleChange, errors, nextStep, showPassword, setShowPassword }: any) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Datos de la Organización</h2>
    <p className="text-xs text-gray-500 mb-4">Los campos marcados con <span className="font-bold text-gray-700">*</span> son obligatorios.</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Input label="Razón Social*" placeholder="Ej. Eventos S.A.S" value={formData.razonSocial} onChange={(e) => handleChange('razonSocial', e.target.value)} />
        {errors.razonSocial && <p className="text-red-500 text-xs font-medium mt-1">{errors.razonSocial}</p>}
      </div>
      <div>
        <Input label="NIT*" placeholder="900.000.000-1" value={formData.nit} onChange={(e) => handleChange('nit', e.target.value)} />
        {errors.nit && <p className="text-red-500 text-xs font-medium mt-1">{errors.nit}</p>}
      </div>
    </div>

    <div>
      <Input label="Teléfono Corporativo*" placeholder="+57..." value={formData.numeroTelefono} onChange={(e) => handleChange('numeroTelefono', e.target.value)} />
      {errors.numeroTelefono && <p className="text-red-500 text-xs font-medium mt-1">{errors.numeroTelefono}</p>}
    </div>

    <hr className="my-4 border-gray-200" />
    <h3 className="text-sm font-bold text-gray-700">Credenciales de Acceso</h3>

    <div>
      <Input label="Correo corporativo*" type="email" value={formData.correo} onChange={(e) => handleChange('correo', e.target.value)} />
      {errors.correo && <p className="text-red-500 text-xs font-medium mt-1">{errors.correo}</p>}
    </div>
    <div>
      <Input
        label="Contraseña*"
        type={showPassword ? "text" : "password"}
        value={formData.contrasena}
        onChange={(e) => handleChange('contrasena', e.target.value)}
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
);

const StepPayment = ({ isLoading, stripe, handleSubmit }: any) => (
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

    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-700">Método de pago (Tarjeta)*</label>
      <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm focus-within:border-[#1E5ADF] transition-colors">
        <CardElement options={{
          style: {
            base: {
              fontSize: '15px',
              color: '#1f2937',
              fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              '::placeholder': { color: '#9ca3af' },
            },
          },
        }} />
      </div>
    </div>

    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
      <p className="text-xs text-gray-500 mb-3 font-bold text-center">💳 Modo Demo: Usa 4242 4242 4242 4242</p>
    </div>

    <Button onClick={handleSubmit} variant="primary" disabled={isLoading || !stripe}>
      {isLoading ? 'Procesando...' : 'Pagar y Registrarse'}
    </Button>
  </div>
);

// ─── COMPONENTE PRINCIPAL (COORDINADOR) ───────────────────────────────────

const RegisterOrganizerForm: React.FC<Props> = ({ onBack }) => {
  const {
    step, isLoading, serverError, successMsg, showPassword, setShowPassword,
    errors, formData, nextStep, handleBack, handleChange, handleSubmit, stripe
  } = useRegisterOrganizer(onBack);

  return (
    <div className="animate-fade-in w-full">
      <RegistrationHeader step={step} handleBack={handleBack} isLoading={isLoading} />
      <Alerts serverError={serverError} successMsg={successMsg} />

      {step === 1 && <StepPersonalInfo formData={formData} handleChange={handleChange} errors={errors} nextStep={nextStep} />}
      {step === 2 && <StepCompanyInfo formData={formData} handleChange={handleChange} errors={errors} nextStep={nextStep} showPassword={showPassword} setShowPassword={setShowPassword} />}
      {step === 3 && <StepPayment isLoading={isLoading} stripe={stripe} handleSubmit={handleSubmit} />}
    </div>
  );
};

export const RegisterOrganizer: React.FC<Props> = ({ onBack }) => {
  return (
    <Elements stripe={stripePromise}>
      <RegisterOrganizerForm onBack={onBack} />
    </Elements>
  );
};