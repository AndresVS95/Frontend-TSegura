import React from 'react'
 
const EmptyCatalog: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-gray-100 max-w-4xl mx-auto">
      <div className="text-7xl mb-6 animate-bounce">🎟️</div>
      <h2 className="text-3xl font-black text-gray-900 mb-4">¡Oh no! Cartelera vacía</h2>
      <p className="text-gray-500 max-w-md text-lg font-medium leading-relaxed">
        Actualmente no hay eventos publicados. Los organizadores están preparando las mejores experiencias para ti.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-8 text-[#1E5ADF] font-bold hover:underline"
      >
        Actualizar página
      </button>
    </div>
  );
};

export default EmptyCatalog;
