import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralInfoForm from '../components/GeneralInfoForm';
// import VenueMap from '../components/VenueMap';
import ZonesPublish from '../components/ZonesPublish';

export default function CrearEvento() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    nombre: '',
    fecha_evento: '',
    descripcion: '',
    recinto_id: 0,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'recinto_id' ? Number(value) : value });
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Función de validación por paso
  const validate = (stepNum: number) => {
    let newErrors: Record<string, string> = {};
    let isValid = true;

    if (stepNum === 1) {
      // Validar Paso 1: Información Básica
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
      // Validar Paso 2: Selección de Recinto
      if (formData.recinto_id === 0) {
        newErrors.recinto_id = 'Debes seleccionar un recinto.';
        isValid = false;
      }
    }
    // Paso 3 no tiene validación obligatoria, es solo confirmación

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validate(step)) {
      setStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
    setErrors({});
  };

  const handleSubmit = async (estadoFinal: 'BORRADOR' | 'PUBLICADO') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Evento ${estadoFinal === 'PUBLICADO' ? 'publicado con éxito 🎉' : 'guardado como borrador 💾'}`);
      navigate('/organizer/panel');
    }, 1500);
  };

  return (
    // 1. Contenedor principal con fondo gris claro (Igual al Dashboard)
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* 2. Barra de navegación superior (Navbar adaptado del Dashboard) */}
      <nav className="bg-white px-8 py-4 shadow-sm border-b border-gray-100 flex justify-between items-center sticky top-0 z-50">
        <h1 
          className="text-2xl font-bold text-[#1E5ADF] flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/organizer/panel')}
        >
          <span className="text-3xl">🎫</span> TSegura (Organizer)
        </h1>
      </nav>

      {/* 3. Contenedor del contenido con márgenes centrados */}
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        
        {/* Cabecera del formulario */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-[#03292e]">Crear Nuevo Evento</h2>
            <p className="text-gray-500 font-medium mt-2">Paso {step} de 3</p>
          </div>
          <button 
            className="border-2 border-red-500 text-red-500 px-6 py-2 rounded-xl font-bold hover:bg-red-50 transition-all" 
            onClick={() => navigate('/organizer/panel')}
          >
            Cancelar
          </button>
        </div>

        {/* 4. Tarjeta blanca donde van los formularios (reemplaza tu 'form-card') */}
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 min-h-[400px]">
          
          {/* Renderizado condicional de componentes */}
          {step === 1 && <GeneralInfoForm formData={formData} handleChange={handleChange} nextStep={nextStep} errors={errors} />}
          
          {/*{step === 2 && <VenueMap formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} errors={errors} />}*/}
          
          {step === 3 && <ZonesPublish submitEvent={handleSubmit} prevStep={prevStep} isLoading={isLoading} />}
          
        </div>
      </main>
    </div>
  );
}