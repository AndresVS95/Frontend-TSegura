// src/components/GeneralInfoForm.tsx
import React from 'react';

interface GeneralInfoFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  nextStep: () => void;
  errors: Record<string, string>;
}

const GeneralInfoForm: React.FC<GeneralInfoFormProps> = ({ formData, handleChange, nextStep, errors }) => {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <h3 className="text-2xl font-bold text-[#03292e] mb-4">Paso 1: Información Básica</h3>

      {/* Nombre del Evento */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Evento</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl border ${errors.nombre ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-transparent outline-none transition-all`}
          placeholder="Ej: Gran Concierto de Rock"
        />
        {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
      </div>

      {/* LA MAGIA OCURRE AQUÍ: Input de Fecha y Hora (datetime-local) */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Fecha y Hora</label>
        <input
          type="datetime-local"
          name="fecha_evento"
          value={formData.fecha_evento}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl border ${errors.fecha_evento ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-transparent outline-none transition-all`}
        />
        <p className="text-gray-400 text-xs mt-1">El sistema separará automáticamente la fecha de la hora para el registro.</p>
        {errors.fecha_evento && <p className="text-red-500 text-sm mt-1">{errors.fecha_evento}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-3 rounded-xl border ${errors.descripcion ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-transparent outline-none transition-all`}
          placeholder="Cuéntale al público de qué trata el evento..."
        />
        {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
      </div>

      {/* Botón Siguiente */}
      <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
        <button
          onClick={nextStep}
          className="px-8 py-3 rounded-xl font-bold text-white bg-[#1E5ADF] hover:bg-blue-700 transition-all"
        >
          Siguiente Paso
        </button>
      </div>
    </div>
  );
};

export default GeneralInfoForm;