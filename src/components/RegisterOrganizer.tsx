// src/components/RegisterOrganizer.tsx
import React from 'react';
import { Elements, CardElement } from '@stripe/react-stripe-js';
import { Input } from './Input';
import { Button } from './Button';
import { Select } from './Select';
import { useRegisterOrganizer } from '../hooks/useRegisterOrganizer';
import { stripePromise } from '../config/stripe';
import { ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';

interface Props {
  onBack: () => void;
}

// ─── COMPONENTE DE PASOS ───────────────────────────────────────────────────

const StepHeader = ({ step, handleBack, isLoading, title, subtitle }: any) => (
  <div className="animate-in fade-in slide-in-from-right duration-500">
    <div className="flex items-center justify-between mb-8">
        <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-[#2748E8] transition-all uppercase tracking-widest group"
            disabled={isLoading}
        >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {step === 1 ? 'Volver al inicio' : 'Paso anterior'}
        </button>
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
            PASO 0{step}/03
        </span>
    </div>

    {/* Progress Bar */}
    <div className="flex gap-2 mb-10">
        <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-[#2748E8]' : 'bg-gray-100'}`} />
        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-[#2748E8]' : 'bg-gray-100'}`} />
        <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-[#2748E8]' : 'bg-gray-100'}`} />
    </div>

    <div className="mb-10">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
            {title} <span className="text-[#2748E8]">{subtitle}</span>
        </h2>
        <p className="text-pink-500 text-[10px] font-bold uppercase tracking-widest">
            Los campos marcados con * son obligatorios.
        </p>
    </div>
  </div>
);

// ─── VISTAS DE CADA PASO ───────────────────────────────────────────────────

const StepPersonalInfo = ({ formData, handleChange, errors, nextStep }: any) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
    <div>
      <Input label="Nombre completo*" placeholder="Escribe tu nombre y apellidos" value={formData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} />
      {errors.nombre && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase">{errors.nombre}</p>}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Select label="Tipo Doc.*" options={[{ value: 'CC', label: 'C.C.' }]} value={formData.tipoDocumento} onChange={(e) => handleChange('tipoDocumento', e.target.value)} />
      <Input label="Número de documento*" placeholder="1061722..." value={formData.numeroDocumento} onChange={(e) => handleChange('numeroDocumento', e.target.value)} />
    </div>
    {errors.numeroDocumento && <p className="text-red-500 text-[10px] font-bold mt-[-10px] uppercase">{errors.numeroDocumento}</p>}

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Input label="Fecha de nacimiento*" type="date" value={formData.fechaNacimiento} onChange={(e) => handleChange('fechaNacimiento', e.target.value)} />
      <Select label="Género*" options={[{ value: 'Masculino', label: 'Masculino' }, { value: 'Femenino', label: 'Femenino' }, { value: 'Otro', label: 'Otro' }]} value={formData.genero} onChange={(e) => handleChange('genero', e.target.value)} />
    </div>

    <button onClick={nextStep} className="w-full mt-6 bg-[#2748E8] text-white py-5 rounded-[2rem] font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group">
      Continuar <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

const StepCompanyInfo = ({ formData, handleChange, errors, nextStep, showPassword, setShowPassword }: any) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Input label="Razón Social*" placeholder="Ej. Eventos S.A.S" value={formData.razonSocial} onChange={(e) => handleChange('razonSocial', e.target.value)} />
      <Input label="NIT*" placeholder="900.000.000-1" value={formData.nit} onChange={(e) => handleChange('nit', e.target.value)} />
    </div>

    <Input label="Teléfono Corporativo*" placeholder="+57 300 000 0000" value={formData.numeroTelefono} onChange={(e) => handleChange('numeroTelefono', e.target.value)} />

    <div className="pt-4">
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Credenciales de Acceso</h3>
      <div className="space-y-6">
        <Input label="Correo corporativo*" type="email" placeholder="contacto@empresa.com" value={formData.correo} onChange={(e) => handleChange('correo', e.target.value)} />
        <Input
          label="Contraseña*"
          type={showPassword ? "text" : "password"}
          placeholder="Mínimo 8 caracteres"
          value={formData.contrasena}
          onChange={(e) => handleChange('contrasena', e.target.value)}
          rightElement={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[10px] font-black text-[#2748E8] hover:underline px-2">
              {showPassword ? "OCULTAR" : "MOSTRAR"}
            </button>
          }
        />
      </div>
    </div>

    <button onClick={nextStep} className="w-full mt-6 bg-[#2748E8] text-white py-5 rounded-[2rem] font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group">
      Verificar y Continuar <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

const StepPayment = ({ isLoading, stripe, handleSubmit }: any) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
    {/* Membership Card */}
    <div className="bg-white border-2 border-[#2748E8] p-8 rounded-[2.5rem] relative shadow-2xl shadow-blue-500/10 overflow-hidden">
      <div className="absolute top-0 right-0 bg-[#2748E8] text-white px-5 py-2 text-[10px] font-black rounded-bl-3xl tracking-widest">PAGO ÚNICO</div>
      
      <p className="text-sm font-black text-[#2748E8] uppercase tracking-wider mb-4">Membresía Organizador</p>
      
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-6xl font-black text-gray-900 tracking-tighter">$5</span>
        <span className="text-gray-400 font-bold text-xl uppercase">USD</span>
      </div>
      
      <ul className="space-y-3">
        {['Creación ilimitada de eventos y analíticas', 'Smart contract NFT por evento', 'Acceso al panel de control y reventa'].map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
            <CheckCircle2 size={18} className="text-[#2748E8] shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>

    {/* Stripe Input Section */}
    <div className="space-y-6">
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Método de pago (Tarjeta)*</label>
        <div className="p-5 bg-white rounded-2xl border-2 border-gray-100 shadow-sm focus-within:border-[#2748E8] transition-all group flex items-center gap-4">
          <CreditCard size={20} className="text-gray-400" />
          <div className="flex-1">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#111827',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  '::placeholder': { color: '#9ca3af' },
                },
              },
            }} />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modo Demo: Usa</span>
        <span className="font-mono text-sm font-bold text-gray-800 bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm">4242 4242 4242 4242</span>
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={isLoading || !stripe}
        className="w-full bg-[#2748E8] text-white py-6 rounded-[2.5rem] font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group text-lg"
      >
        {isLoading ? (
          <><div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" /> Procesando...</>
        ) : (
          <><ShieldCheck size={24} /> Pagar y Registrarse</>
        )}
      </button>
      
      <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
        <ShieldCheck size={12} /> Pago procesado de forma segura - Stripe
      </p>
    </div>
  </div>
);

// ─── COMPONENTE PRINCIPAL (COORDINADOR) ───────────────────────────────────

const RegisterOrganizerForm: React.FC<Props> = ({ onBack }) => {
  const {
    step, isLoading, serverError, successMsg, showPassword, setShowPassword,
    errors, formData, nextStep, handleBack, handleChange, handleSubmit, stripe
  } = useRegisterOrganizer(onBack);

  const getTitles = () => {
    switch(step) {
      case 1: return { title: 'Datos', subtitle: 'del Representante.' };
      case 2: return { title: 'Datos', subtitle: 'de la Organización.' };
      case 3: return { title: 'Activa', subtitle: 'tu panel de control.' };
      default: return { title: 'Crea', subtitle: 'tu cuenta.' };
    }
  };

  const titles = getTitles();

  return (
    <div className="w-full">
      <StepHeader step={step} handleBack={handleBack} isLoading={isLoading} title={titles.title} subtitle={titles.subtitle} />
      
      {serverError && <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold border border-red-100 rounded-2xl animate-bounce uppercase tracking-tighter">{serverError}</div>}
      {successMsg && <div className="mb-6 p-4 bg-green-50 text-green-700 text-xs font-bold border border-green-100 rounded-2xl animate-bounce uppercase tracking-tighter">{successMsg}</div>}

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