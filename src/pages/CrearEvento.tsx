import { useNavigate } from 'react-router-dom';
import GeneralInfoForm from '../components/GeneralInfoForm';
import VenueMap from '../components/VenueMap';
import ZonesPublish from '../components/ZonesPublish';
import { useEventWizard } from '../hooks/useEventWizard';
import OrganizerLayout from '../components/OrganizerLayout';
import { ArrowLeft, X } from 'lucide-react';

export default function CrearEvento() {
  const navigate = useNavigate();
  
  const {
    step,
    isLoading,
    errors,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    nextStep,
    prevStep
  } = useEventWizard();

  return (
    <OrganizerLayout>
      <div className="mb-10">
        <button 
          onClick={() => navigate('/dashboard-organizer')} 
          className="group flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest mb-6"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Cancelar y Volver
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Crear Nuevo Evento</h2>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex gap-1">
                {[1, 2, 3].map((s) => (
                  <div 
                    key={s} 
                    className={`h-1.5 w-8 rounded-full transition-all duration-500 ${s <= step ? 'bg-[#2748E8]' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-tighter">Paso {step} de 3</p>
            </div>
          </div>
          
          <button 
            className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-sm transition-colors" 
            onClick={() => navigate('/dashboard-organizer')}
          >
            <X size={18} /> Salir sin guardar
          </button>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 min-h-[500px]">
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
    </OrganizerLayout>
  );
}