import React from 'react';
import { Select } from './Select';
import { Button } from './Button';

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
  errors: Record<string, string>;
}

export default function VenueMap({ formData, handleChange, nextStep, prevStep, errors }: Props) {
  
  // Opciones para tu componente Select
  const recintoOptions = [
    { value: '0', label: 'Seleccione un recinto...' },
    { value: '1', label: 'Estadio El Campín' },
    { value: '2', label: 'Movistar Arena' }
  ];

  return (
    <div className="animate-fade-in w-full">
      
      {/* Cabecera del Paso */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">2. Selección de Recinto</h2>
        <p className="text-xs text-gray-500">
          Elige dónde se llevará a cabo tu evento. El mapa de zonas se cargará automáticamente.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Usamos tu componente Select personalizado */}
        <div>
          <Select 
            label="Selecciona el lugar del evento*"
            name="recinto_id"
            value={String(formData.recinto_id)} 
            onChange={handleChange}
            options={recintoOptions}
          />
          {errors.recinto_id && <p className="text-xs text-red-500 mt-1 font-medium">{errors.recinto_id}</p>}
        </div>

        {/* Simulación visual de un Mapa de Zonas (Migrado 100% a Tailwind) */}
        {Number(formData.recinto_id) > 0 && (
          <div className="mt-4 bg-slate-50 p-6 rounded-2xl text-center border-2 border-dashed border-slate-300 transition-all">
            <p className="text-sm font-bold text-slate-500 mb-4">📍 Mapa del Recinto (Previsualización)</p>
            
            {/* Contenedor del Mapa */}
            <div className="w-full h-48 bg-slate-200 rounded-xl flex flex-col justify-center items-center p-4 shadow-inner">
              
              {/* Escenario */}
              <div className="w-32 h-8 bg-slate-700 text-white text-[10px] tracking-widest font-black rounded flex items-center justify-center mb-6 shadow-md">
                ESCENARIO
              </div>
              
              {/* Zonas */}
              <div className="flex gap-4 w-full justify-center">
                <div className="w-24 h-16 bg-yellow-100 border-2 border-yellow-400 rounded-xl flex items-center justify-center text-yellow-700 font-black shadow-sm transform hover:scale-105 transition-transform cursor-pointer">
                  VIP
                </div>
                <div className="w-24 h-16 bg-blue-100 border-2 border-blue-400 rounded-xl flex items-center justify-center text-blue-700 font-black shadow-sm transform hover:scale-105 transition-transform cursor-pointer">
                  General
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Botones de Navegación */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
          <button 
            onClick={prevStep} 
            className="text-sm font-bold text-gray-500 hover:text-[#1E5ADF] transition-colors"
          >
            ← Paso anterior
          </button>
          
          <Button 
            onClick={nextStep} 
            variant="primary" 
            disabled={Number(formData.recinto_id) === 0 || !!errors.recinto_id}
          >
            Siguiente: Configurar Zonas
          </Button>
        </div>

      </div>
    </div>
  );
}