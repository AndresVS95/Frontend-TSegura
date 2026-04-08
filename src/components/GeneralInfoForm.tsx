import React from 'react';
import { Input } from './Input';
import { Button } from './Button';

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  nextStep: () => void;
  errors: Record<string, string>;
}

export default function GeneralInfoForm({ formData, handleChange, nextStep, errors }: Props) {
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="animate-fade-in w-full">
      
      {/* Cabecera idéntica a RegisterOrganizer */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">1. Información Básica</h2>
        <p className="text-xs text-gray-500 mb-6">
          Los campos marcados con <span className="font-bold text-gray-700">*</span> son obligatorios.
        </p>

        {/* Campos del formulario */}
        <div className="grid grid-cols-1 gap-5">
          
          <div>
            <Input 
              label="Nombre del Evento*" 
              type="text" 
              name="nombre"
              placeholder="Ej: Concierto Fin de Año"
              value={formData.nombre} 
              onChange={handleChange} 
            />
            {errors.nombre && <p className="text-xs text-red-500 mt-1 font-medium">{errors.nombre}</p>}
          </div>

          <div>
            <Input 
              label="Fecha y Hora*" 
              type="datetime-local" 
              name="fecha_evento"
              value={formData.fecha_evento} 
              onChange={handleChange} 
            />
            {errors.fecha_evento && <p className="text-xs text-red-500 mt-1 font-medium">{errors.fecha_evento}</p>}
          </div>

          {/* Para la descripción usamos un textarea estilizado para que combine con tus Inputs */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Descripción*</label>
            <textarea 
              name="descripcion"
              placeholder="Describe los detalles principales de tu evento..."
              value={formData.descripcion} 
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border ${errors.descripcion ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-[#1E5ADF]'} focus:ring-2 focus:border-current outline-none transition-all resize-none shadow-sm text-sm`}
            />
            {errors.descripcion && <p className="text-xs text-red-500 mt-1 font-medium">{errors.descripcion}</p>}
          </div>

        </div>

        {/* Botón usando tu prop variant="primary" */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={nextStep} 
            variant="primary" 
            className="mt-4"
            disabled={hasErrors}
          >
            Siguiente: Elegir Recinto
          </Button>
        </div>
        
      </div>
    </div>
  );
}