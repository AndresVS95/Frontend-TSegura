import { useNavigate } from 'react-router-dom';
import GeneralInfoForm from '../components/GeneralInfoForm';
import VenueMap from '../components/VenueMap';
import ZonesPublish from '../components/ZonesPublish';
import { OrganizerNavbar } from '../components/OrganizerNavbar';
import { useEventWizard } from '../hooks/useEventWizard';

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
    <div className="min-h-screen bg-gray-50 font-sans">
      <OrganizerNavbar />

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