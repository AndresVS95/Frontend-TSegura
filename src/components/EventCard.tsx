import React from 'react'

interface EventCardProps {
  nombre: string;
  fecha: string;
  imagen: string;
  recinto: string;
  onClick: () => void;
}

const EventCard:  React.FC<EventCardProps> = ({ nombre, fecha, imagen, recinto, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 group flex flex-col h-full"
    >
      <div className="relative h-52 overflow-hidden">
        <img 
          src={imagen || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop'} 
          alt={nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#1E5ADF] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
          Disponible
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-[#1E5ADF] text-xs font-bold mb-2 uppercase tracking-tighter">{fecha}</p>
          <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight group-hover:text-[#1E5ADF] transition-colors">
            {nombre}
          </h3>
          <p className="text-gray-500 text-sm flex items-center gap-1 font-medium">
            <span className="text-lg">📍</span> {recinto}
          </p>
        </div>
        
        <button className="w-full mt-6 bg-gray-900 text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#1E5ADF] transition-all transform active:scale-95 shadow-lg shadow-gray-200">
          Comprar Entradas
        </button>
      </div>
    </div>
  );
};

export default EventCard;
