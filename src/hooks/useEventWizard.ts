import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { eventService } from '../services/eventService';

// Lógica pura sin reactividad de react extraída
const buildEventoDTO = (formData: any, estadoFinal: 'BORRADOR' | 'PUBLICADO') => {
  const [fecha = '', hora = ''] = formData.fecha_evento ? formData.fecha_evento.split('T') : [];
  const horaFormat = hora.length === 5 ? `${hora}:00` : (hora || '00:00:00');

  return {
    nombre: formData.nombre,
    descripcion: formData.descripcion,
    fechaEvento: fecha, 
    horaEvento: horaFormat, 
    urlImagen: "https://ejemplo.com/imagen.jpg", 
    edadMinima: 18,
    permiteReventa: false,
    precioMaxReventa: 0,
    recintoId: formData.recinto_id,
    tipoEventoId: 1, 
    estado: estadoFinal, 
    zonas: formData.zonas.map((zona: any) => ({
      nombreZona: zona.nombre_zona,
      capacidad: Number(zona.capacidad) || 0,
      precio: Number(zona.precio) || 0, 
      asientosNumerados: Boolean(zona.asientos_numerados),
      cuposDisponibles: Number(zona.capacidad) || 0
    }))
  };
};

export const useEventWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    nombre: '',
    fecha_evento: '',
    descripcion: '',
    recinto_id: 1, 
    zonas: [
      { nombre_zona: 'VIP', capacidad: 20, precio: 0, asientos_numerados: true },
      { nombre_zona: 'PLATA', capacidad: 20, precio: 0, asientos_numerados: true },
      { nombre_zona: 'General', capacidad: 60, precio: 0, asientos_numerados: true }
    ]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (estadoFinal: 'BORRADOR' | 'PUBLICADO') => {
    setIsLoading(true);
    try {
      const eventoDTO = buildEventoDTO(formData, estadoFinal);
      await eventService.crearEvento(eventoDTO);
      
      toast.success(`Evento ${estadoFinal === 'PUBLICADO' ? 'publicado con éxito 🎉' : 'guardado como borrador 💾'}`);
      navigate('/dashboard-organizer');
    } catch (error: any) {
      console.error("Error al crear el evento:", error);
      const mensajeServidor = error.response?.data?.message || "Hubo un error al guardar.";
      
      if (mensajeServidor.includes("Ya existe un evento")) {
        toast.error("❌ Error: Este recinto ya tiene un evento para esa fecha. Elige otro día.");
      } else {
        toast.error(mensajeServidor);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validate = (stepNum: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (stepNum === 1) {
      if (!formData.nombre.trim()) { newErrors.nombre = 'El nombre es requerido.'; isValid = false; }
      if (!formData.fecha_evento.trim()) { newErrors.fecha_evento = 'Fecha y hora requeridas.'; isValid = false; }
      if (!formData.descripcion.trim()) { newErrors.descripcion = 'La descripción es requerida.'; isValid = false; }
    } else if (stepNum === 2) {
      if (formData.recinto_id === 0) { newErrors.recinto_id = 'Debes seleccionar un recinto.'; isValid = false; }
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

  return {
    step,
    isLoading,
    errors,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    nextStep,
    prevStep
  };
};
