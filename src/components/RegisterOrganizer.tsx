import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Importaciones de Stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Input } from './Input';
import { Button } from './Button';
import { Select } from './Select';
import { registerOrganizador } from '../services/organizadorService';
import type { RegisterOrganizadorData } from '../services/organizadorService';

// 🔑 REEMPLAZA CON TU CLAVE PÚBLICA DE STRIPE (pk_test_...)
const stripePromise = loadStripe('pk_test_51TH9MdLKUrQZ6U0BtOJUb71r2kNLRgMU2L3n0CQICRB5z3RE5xgSJtLjVuF1zJTdJMdho4Gq3TvOapWaeKuDj70W00P8C74S7v');

interface Props {
  onBack: () => void;
}

// --- SUB-COMPONENTE INTERNO PARA USAR LOS HOOKS DE STRIPE ---
// Este componente solo renderiza el campo de la tarjeta y maneja la lógica de cobro.
const StripeCardInput = ({ isActive }: { isActive: boolean, isLoading: boolean, onSubmit: (paymentMethodId: string) => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [stripeError, setStripeError] = useState<string | null>(null);

  // Exponemos la función de pago al padre
  React.useEffect(() => {
    if (isActive && stripe && elements) {
      // Definimos una función global temporal para que el padre la llame
      (window as any).handleStripePayment = async () => {
        setStripeError(null);
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return null;

        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (error) {
          setStripeError(error.message || "Error en la tarjeta");
          return null;
        }
        return paymentMethod.id;
      };
    }
    return () => {
      (window as any).handleStripePayment = null;
    };
  }, [isActive, stripe, elements]);

  return (
    <div className="space-y-3 mt-6 animate-fade-in">
      <label className="block text-sm font-bold text-gray-700">Método de pago (Tarjeta)*</label>

      {/* Contenedor con TUS estilos de bordes redondeados y sombras */}
      <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm focus-within:border-[#1E5ADF] transition-colors">
        <CardElement options={{
          style: {
            base: {
              fontSize: '15px', // Ajustado a tu diseño
              color: '#1f2937',
              fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              '::placeholder': { color: '#9ca3af' },
            },
          },
        }} />
      </div>

      {stripeError && <p className="text-red-500 text-xs font-bold px-1">{stripeError}</p>}

      <p className="text-[10px] text-gray-400 text-center px-4">
        🔒 Pago seguro procesado por Stripe. Usa la tarjeta <span className="font-bold">4242...4242</span> para pruebas.
        Tus datos bancarios no tocan nuestros servidores.
      </p>
    </div>
  );
};

export const RegisterOrganizer: React.FC<Props> = ({ onBack }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Datos del Usuario
    nombre: '', correo: '', contrasena: '', fechaNacimiento: '',
    numeroTelefono: '', tipoDocumento: 'CC', numeroDocumento: '',
    genero: 'Masculino',
    // Datos del Organizador
    razonSocial: '', nit: '',
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const calcularEdad = (fecha: string) => {
    if (!fecha) return 0;
    const hoy = new Date();
    const cumpleanos = new Date(fecha);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) edad--;
    return edad;
  };

  // 2. Modificamos el handleSubmit para integrar Stripe
  const handleSubmit = async () => {
    setServerError('');
    setSuccessMsg('');
    setIsLoading(true);

    // A. Llamamos a la función de Stripe que expusimos en el hijo
    let paymentMethodId = null;
    if ((window as any).handleStripePayment) {
      paymentMethodId = await (window as any).handleStripePayment();
    }

    // B. Si Stripe falló, detenemos el registro
    if (!paymentMethodId) {
      setIsLoading(false);
      return;
    }

    // C. ARMAMOS EL JSON CON EL ID REAL DE STRIPE
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
        perfil: { nombre: "ORGANIZADOR" }
      },
      razonSocial: formData.razonSocial,
      nit: formData.nit,
      stripePaymentMethodId: paymentMethodId // <--- AHORA ES EL ID REAL
    };

    console.log("Enviando Organizador con Pago:", dataToBack);

    try {
      await registerOrganizador(dataToBack);
      setSuccessMsg('¡Organización registrada y pago exitoso! Redirigiendo...');
      setTimeout(() => navigate('/login'), 2500);
    } catch (error: any) {
      console.error('Error del backend:', error);
      setServerError(error.response?.data?.message || 'Error al registrar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 3. Envolvemos TODO el componente con Elements
    <Elements stripe={stripePromise}>
      <div className="animate-fade-in w-full">
        {/* Header - SIN CAMBIOS */}
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

        {/* Alertas - SIN CAMBIOS */}
        {serverError && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-lg">{serverError}</div>}
        {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm border border-green-200 rounded-lg">{successMsg}</div>}

        {/* PASO 1 - SIN CAMBIOS */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Datos del Representante</h2>
            <Input label="Nombre completo*" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select label="Tipo Doc.*" options={[{ value: 'CC', label: 'C.C.' }, { value: 'CE', label: 'C.E.' }]} value={formData.tipoDocumento} onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value })} />
              <div className="sm:col-span-2">
                <Input label="Número de documento*" value={formData.numeroDocumento} onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Fecha de nacimiento*" type="date" value={formData.fechaNacimiento} onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })} required />
              <Select label="Género*" options={[{ value: 'Masculino', label: 'Masculino' }, { value: 'Femenino', label: 'Femenino' }, { value: 'Otro', label: 'Otro' }]} value={formData.genero} onChange={(e) => setFormData({ ...formData, genero: e.target.value })} />
            </div>
            <Button onClick={nextStep} variant="primary" className="mt-4">Continuar</Button>
          </div>
        )}

        {/* PASO 2 - SIN CAMBIOS */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Datos de la Organización</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Razón Social*" placeholder="Ej. Eventos S.A.S" value={formData.razonSocial} onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })} required />
              <Input label="NIT*" placeholder="900.000.000-1" value={formData.nit} onChange={(e) => setFormData({ ...formData, nit: e.target.value })} required />
            </div>
            <Input label="Teléfono Corporativo*" placeholder="+57..." value={formData.numeroTelefono} onChange={(e) => setFormData({ ...formData, numeroTelefono: e.target.value })} required />
            <hr className="my-4 border-gray-200" />
            <h3 className="text-sm font-bold text-gray-700">Credenciales de Acceso</h3>
            <Input label="Correo corporativo*" type="email" value={formData.correo} onChange={(e) => setFormData({ ...formData, correo: e.target.value })} required />
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
              required
            />
            <Button onClick={nextStep} variant="primary" className="mt-4">Verificar y Continuar</Button>
          </div>
        )}

        {/* PASO 3 - INTEGRACIÓN DE STRIPE SIN DAÑAR TU DISEÑO */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Activa tu panel de control</h2>

            {/* Tu bloque de precio original - SIN CAMBIOS */}
            <div className="bg-blue-50 border-2 border-[#1E5ADF] p-6 rounded-[2rem] relative shadow-lg shadow-blue-50">
              <div className="absolute top-0 right-0 bg-[#1E5ADF] text-white px-3 py-1 text-[10px] font-bold rounded-bl-xl tracking-wider">PAGO ÚNICO</div>
              <p className="text-sm font-semibold text-blue-800">Membresía Organizador</p>
              <div className="flex items-baseline gap-1 my-2">
                <span className="text-4xl font-black text-gray-900">$5</span>
                <span className="text-gray-500 font-bold text-sm">USD</span>
              </div>
              <p className="text-xs text-blue-700 mt-2">✓ Creación ilimitada de eventos, analíticas pro y soporte premium.</p>
            </div>

            {/* 4. Inyectamos el componente de Stripe aquí */}
            <StripeCardInput isActive={step === 3} isLoading={isLoading} onSubmit={handleSubmit} />

            {/* Tu botón original de submit - SIN CAMBIOS */}
            <Button onClick={handleSubmit} variant="primary" disabled={isLoading} className="mt-4">
              {isLoading ? 'Procesando pago y registro...' : 'Pagar y Registrarse'}
            </Button>
          </div>
        )}
      </div>
    </Elements>
  );
};