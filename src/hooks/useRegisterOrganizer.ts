import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { registerOrganizador } from '../services/organizadorService';
import type { RegisterOrganizadorData } from '../services/organizadorService';

export const useRegisterOrganizer = (onBack: () => void) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    fechaNacimiento: '',
    numeroTelefono: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    genero: 'Masculino',
    razonSocial: '',
    nit: '',
  });

  const calcularEdad = (fecha: string) => {
    if (!fecha) return 0;
    const hoy = new Date();
    const cumpleanos = new Date(fecha);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) edad--;
    return edad;
  };

  const validate = (targetStep: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (targetStep === 1) {
      if (!formData.nombre.trim()) { newErrors.nombre = 'El nombre es requerido.'; isValid = false; }
      if (!formData.numeroDocumento.trim()) { newErrors.numeroDocumento = 'El número de documento es requerido.'; isValid = false; }
      if (!formData.fechaNacimiento.trim()) { newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida.'; isValid = false; }
    } else if (targetStep === 2) {
      if (!formData.razonSocial.trim()) { newErrors.razonSocial = 'La razón social es requerida.'; isValid = false; }
      if (!formData.nit.trim()) { newErrors.nit = 'El NIT es requerido.'; isValid = false; }
      if (!formData.numeroTelefono.trim()) { newErrors.numeroTelefono = 'El teléfono corporativo es requerido.'; isValid = false; }
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
    if (validate(step)) setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setErrors({});
    setStep(prev => prev - 1);
  };

  const handleBack = () => {
    if (step === 1) {
      onBack();
    } else {
      prevStep();
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setServerError('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!validate(2)) {
      setIsLoading(false);
      return;
    }

    if (!stripe || !elements) {
      setServerError('Stripe no está listo. Intenta de nuevo en unos segundos.');
      setIsLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setServerError('No se encontró el campo de tarjeta.');
      setIsLoading(false);
      return;
    }

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (stripeError) {
      setServerError(stripeError.message || 'Error al procesar la tarjeta.');
      setIsLoading(false);
      return;
    }

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
      stripePaymentMethodId: paymentMethod.id,
    };

    try {
      await registerOrganizador(dataToBack);
      setSuccessMsg('¡Organización registrada y pago exitoso! Redirigiendo...');
      setTimeout(() => navigate('/login'), 2500);
    } catch (error: any) {
      setServerError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Ocurrió un error al registrar.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step,
    isLoading,
    serverError,
    successMsg,
    showPassword,
    setShowPassword,
    errors,
    formData,
    nextStep,
    prevStep,
    handleBack,
    handleChange,
    handleSubmit,
    stripe,
  };
};
