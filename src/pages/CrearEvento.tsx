import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralInfoForm from '../components/GeneralInfoForm';
import VenueMap from '../components/VenueMap';
import ZonesPublish from '../components/ZonesPublish';
import { eventService } from '../services/eventService';
import toast from 'react-hot-toast';

export default function CrearEvento() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Formulario inicial con datos base
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_evento: '',
    descripcion: '',
    recinto_id: 1, // Por defecto Teatro Guillermo (basado en el mapa)
    zonas: [
      { nombre_zona: 'VIP', capacidad: 20, precio: 0, asientos_numerados: true },
      { nombre_zona: 'PLATA', capacidad: 20, precio: 0, asientos_numerados: true },
      { nombre_zona: 'General', capacidad: 60, precio: 0, asientos_numerados: true }
    ]
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- LÓGICA DE ENVÍO INTEGRADA CON HU-021 ---
  const handleSubmit = async (estadoFinal: 'BORRADOR' | 'PUBLICADO') => {
    setIsLoading(true);

    try {
      // 1. Procesamiento de fecha y hora para el backend de Java
      const [fecha, hora] = formData.fecha_evento.split('T');

      // 2. Mapeo al DTO esperado por el controlador de JG
      const eventoDTO = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        fechaEvento: fecha, 
        horaEvento: hora.includes(':') ? `${hora}:00` : `${hora}:00:00`, 
        urlImagen: "https://ejemplo.com/imagen.jpg", 
        edadMinima: 18,
        permiteReventa: false,
        precioMaxReventa: 0,
        recintoId: formData.recinto_id,
        tipoEventoId: 1, 
        
        // El campo clave para que aparezca el botón en el dashboard
        estado: estadoFinal, 

        zonas: formData.zonas.map((zona: any) => ({
          nombreZona: zona.nombre_zona,
          capacidad: Number(zona.capacidad),
          precio: Number(zona.precio), 
          asientosNumerados: zona.asientos_numerados,
          cuposDisponibles: Number(zona.capacidad) 
        }))
      };

      // 3. Llamada al servicio centralizado
      await eventService.crearEvento(eventoDTO);
      
      toast.success(`Evento ${estadoFinal === 'PUBLICADO' ? 'publicado con éxito 🎉' : 'guardado como borrador 💾'}`);
      
      // 4. Redirección automática post-login/creación
      navigate('/dashboard-organizer');

    } catch (error: any) {
  console.error("Error al crear el evento:", error);
  
  // Si el backend envía un mensaje de error específico, muéstralo
  const mensajeServidor = error.response?.data?.message || "Hubo un error al guardar.";
  
  if (mensajeServidor.includes("Ya existe un evento")) {
    toast.error("❌ Error: Este recinto ya tiene un evento para esa fecha. Elige otro día.");
  } else {
    toast.error(mensajeServidor);
  }
}
  };

  // Validaciones del Wizard
  const validate = (stepNum: number) => {
    let newErrors: Record<string, string> = {};
    let isValid = true;

    if (stepNum === 1) {
      if (!formData.nombre.trim()) {
        newErrors.nombre = 'El nombre del evento es requerido.';
        isValid = false;
      }
      if (!formData.fecha_evento.trim()) {
        newErrors.fecha_evento = 'La fecha y hora del evento son requeridas.';
        isValid = false;
      }
      if (!formData.descripcion.trim()) {
        newErrors.descripcion = 'La descripción del evento es requerida.';
        isValid = false;
      }
    } else if (stepNum === 2) {
      if (formData.recinto_id === 0) {
        newErrors.recinto_id = 'Debes seleccionar un recinto.';
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
    setStep(prev => prev - 1);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white px-8 py-4 shadow-sm border-b border-gray-100 flex justify-between items-center sticky top-0 z-50">
        <h1 
          className="text-2xl font-bold text-[#1E5ADF] flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/dashboard-organizer')}
        >
          <span className="text-3xl">🎫</span> TSegura (Organizer)
        </h1>

        <button 
          onClick={handleLogout}
          className="text-sm font-bold text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Cerrar Sesión
        </button>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-[#03292e]">Crear Nuevo Evento</h2>
            <p className="text-gray-500 font-medium mt-2">Paso {step} de 3</p>
          </div>
          <button 
            className="border-2 border-red-500 text-red-500 px-6 py-2 rounded-xl font-bold hover:bg-red-50 transition-all" 
            onClick={() => navigate('/dashboard-organizer')}
          >
            Cancelar
          </button>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 min-h-[400px]">
          {step === 1 && (
            <GeneralInfoForm 
              formData={formData} 
              handleChange={handleChange} 
              nextStep={nextStep} 
              errors={errors} 
            />
          )}
          
          {step === 2 && (
            <VenueMap 
              formData={formData} 
              setFormData={setFormData} 
              nextStep={nextStep} 
              prevStep={prevStep} 
              errors={errors} 
            />
          )}
          
          {step === 3 && (
            <ZonesPublish 
              submitEvent={handleSubmit} 
              prevStep={prevStep} 
              isLoading={isLoading} 
              formData={formData}
            
            />
          )}
        </div>
      </main>
    </div>
  );
}