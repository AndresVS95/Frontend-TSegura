import React from 'react';

interface Props {
  submitEvent: (estado: 'BORRADOR' | 'PUBLICADO') => void;
  prevStep: () => void;
  isLoading: boolean;
}

export default function ZonesPublish({ submitEvent, prevStep, isLoading }: Props) {
  return (
    <div className="animate-fade-in w-full">
      
      {/* Cabecera del Paso */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">3. Revisión y Publicación</h2>
        <p className="text-sm text-gray-500">
          Tu evento está casi listo. Revisa que todo esté correcto antes de confirmar.
        </p>
      </div>

      {/* Alerta de Blockchain (Elegante y moderna) */}
      <div className="bg-green-50 border border-green-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm mb-10 transition-all">
        <span className="text-3xl">✅</span>
        <div>
          <h4 className="font-bold text-green-900 mb-1 text-lg">Información Completa</h4>
          <p className="text-sm text-green-700 leading-relaxed">
            Todos los datos son válidos. El contrato inteligente (NFT) está listo para generarse en la blockchain de forma segura al momento de publicar el evento.
          </p>
        </div>
      </div>

      {/* Contenedor de Botones de Acción */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-100 gap-4 sm:gap-0">
        
        {/* Botón Atrás */}
        <button 
          onClick={prevStep} 
          disabled={isLoading}
          className="text-sm font-bold text-gray-500 hover:text-[#1E5ADF] transition-colors w-full sm:w-auto text-center sm:text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Paso anterior
        </button>
        
        {/* Grupo de Guardado/Publicación */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          
          {/* Guardar Borrador (Gris neutral) */}
          <button 
            onClick={() => submitEvent('BORRADOR')}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center gap-2"
          >
            Guardar como Borrador
          </button>

          {/* Publicar (Verde destacado para la acción principal) */}
          <button 
            onClick={() => submitEvent('PUBLICADO')}
            disabled={isLoading}
            className="px-8 py-3 rounded-xl font-bold text-white bg-[#10b981] hover:bg-[#059669] transition-all shadow-lg shadow-green-200/50 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center gap-2"
          >
            {isLoading ? 'Generando Contrato...' : 'Publicar Evento Oficialmente'}
          </button>

        </div>
      </div>
      
    </div>
  );
}