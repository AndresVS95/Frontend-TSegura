
import React from 'react'

interface NoResultsProps {
    termino: string;
}

const NoResults: React.FC<NoResultsProps> = ({ termino }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-[3rem] border border-gray-100 shadow-sm animate-fade-in">
      <div className="relative mb-6">
        <span className="text-7xl">🔍</span>
        <span className="absolute -bottom-2 -right-2 text-4xl">🚫</span>
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-2">
        Sin coincidencias para "{termino}"
      </h3>
      <p className="text-gray-500 max-w-sm text-center font-medium">
        Intenta con un nombre más corto o verifica que el evento esté escrito correctamente.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-6 text-[#1E5ADF] font-bold text-sm hover:underline"
      >
        Ver todos los eventos
      </button>
    </div>
  );
};

export default NoResults;