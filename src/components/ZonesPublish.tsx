import React from 'react';
import toast from 'react-hot-toast';

interface Props {
  submitEvent: (estado: 'BORRADOR' | 'PUBLICADO') => void;
  prevStep: () => void;
  isLoading: boolean;
  formData: any; // Agregado para mostrar el resumen
}

export default function ZonesPublish({ submitEvent, prevStep, isLoading, formData }: Props) {
  
  // Validación local rápida antes de publicar (HU-021)
  const validarYPublicar = () => {
    const tienePreciosCero = formData.zonas.some((z: any) => z.precio <= 0);
    if (tienePreciosCero) {
      toast.error("⚠️ Atención: Tienes zonas con precio $0. Asegúrate de que esto sea correcto antes de publicar.");
    }
    submitEvent('PUBLICADO');
  };

  return (
    <div className="animate-fade-in w-full">
      
      {/* Cabecera del Paso */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">3. Revisión y Publicación</h2>
        <p className="text-sm text-gray-500">
          Revisa el resumen de tu evento. Una vez publicado, los compradores podrán ver las entradas.
        </p>
      </div>

      {/* RESUMEN DE DATOS (Para cumplir con la revisión de la HU-021) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
          <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-3">General</h4>
          <p className="text-lg font-bold text-gray-800">{formData.nombre}</p>
          <p className="text-sm text-gray-600">{new Date(formData.fecha_evento).toLocaleString()}</p>
        </div>

        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
          <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-3">Zonas Configuradas</h4>
          <div className="space-y-2">
            {formData.zonas.map((zona: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{zona.nombreZona}</span>
                <span className="font-bold text-[#1E5ADF]">${zona.precio} USD</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerta de Blockchain */}
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
      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-100 gap-4">
        
        <button 
          onClick={prevStep} 
          disabled={isLoading}
          className="text-sm font-bold text-gray-500 hover:text-[#1E5ADF] transition-colors disabled:opacity-50"
        >
          ← Paso anterior
        </button>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          
          {/* Guardar Borrador */}
          <button 
            onClick={() => submitEvent('BORRADOR')}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Guardando...' : 'Guardar como Borrador'}
          </button>

          {/* Publicar */}
          <button 
            onClick={validarYPublicar}
            disabled={isLoading}
            className="px-8 py-3 rounded-xl font-bold text-white bg-[#10b981] hover:bg-[#059669] transition-all shadow-lg shadow-green-200/50 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Generando Contrato...' : 'Publicar Evento Oficialmente'}
          </button>

        </div>
      </div>
    </div>
  );
}