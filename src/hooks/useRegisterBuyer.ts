import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUsuario } from '../services/authService';
import toast from 'react-hot-toast';

export const useRegisterBuyer = (onBack: () => void) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    pais: 'Colombia',
    telefono: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    fechaNacimiento: '',
    genero: 'Masculino',
    perfil: 'COMPRADOR'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const calcularEdad = (fecha: string) => {
    if (!fecha) return 0;
    const hoy = new Date();
    const cumpleanos = new Date(fecha);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) edad--;
    return edad;
  };

  const validate = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) { newErrors.email = 'El correo es requerido.'; isValid = false; }
    if (!formData.password.trim()) { newErrors.password = 'La contraseña es requerida.'; isValid = false; }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
      isValid = false;
    }
    if (!formData.fullname.trim()) { newErrors.fullname = 'El nombre completo es requerido.'; isValid = false; }
    if (!formData.telefono.trim()) { newErrors.telefono = 'El teléfono es requerido.'; isValid = false; }
    if (!formData.numeroDocumento.trim()) { newErrors.numeroDocumento = 'El documento es requerido.'; isValid = false; }
    if (!formData.fechaNacimiento.trim()) { newErrors.fechaNacimiento = 'La fecha es requerida.'; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const datosParaBackend = {
        nombre: formData.fullname,
        correo: formData.email,
        contrasena: formData.password,
        numeroTelefono: formData.telefono,
        tipoDocumento: formData.tipoDocumento,
        numeroDocumento: formData.numeroDocumento,
        fechaNacimiento: formData.fechaNacimiento,
        genero: formData.genero,
        edad: calcularEdad(formData.fechaNacimiento),
        perfil: { nombre: "COMPRADOR" },
        nombrePerfil: "COMPRADOR",
        direccion: `País: ${formData.pais}`,
        ciudad: "No especificada"
      };

      await registerUsuario(datosParaBackend);
      toast.success("¡Cuenta creada con éxito! 🎉");
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
    onBack
  };
};
