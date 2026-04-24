import React, { useState } from 'react';

// Mocks de asistentes
const asistentesMock = [
  { id: 1, nombre: 'Ana María López', documento: '1061234567', estado: 'Ingresó' },
  { id: 2, nombre: 'Carlos Ruiz', documento: '1002987654', estado: 'Pendiente' },
  { id: 3, nombre: 'Laura Gómez', documento: '1088765432', estado: 'Ingresó' },
];

const PanelAsistentesZona: React.FC = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  return (
    <div className="bg-white w-full max-w-md h-[600px] rounded-[2rem] shadow-xl border border-gray-200 flex flex-col overflow-hidden font-sans">
      
      {/* Cabecera del Panel */}
      <div className="bg-[#1E5ADF] p-6 text-white">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-black">Zona VIP</h2>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">45 / 50 Asistentes</span>
        </div>
        <p className="text-blue-100 text-sm">Gestión y control de acceso</p>
      </div>

      {!mostrarFormulario ? (
        /* VISTA 1: Lista de Asistentes */
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          <button 
            onClick={() => setMostrarFormulario(true)}
            className="w-full py-3 mb-4 border-2 border-dashed border-[#1E5ADF] text-[#1E5ADF] rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <span>+</span> Agregar Asistente Manual
          </button>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {asistentesMock.map((asis) => (
              <div key={asis.id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{asis.nombre}</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">CC: {asis.documento}</p>
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                  asis.estado === 'Ingresó' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {asis.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* VISTA 2: Formulario Asistente Manual */
        <div className="flex-1 p-6 flex flex-col">
          <button 
            onClick={() => setMostrarFormulario(false)}
            className="text-gray-400 text-sm font-bold mb-6 hover:text-gray-900 flex items-center gap-1"
          >
            ← Volver a la lista
          </button>

          <h3 className="text-lg font-black text-gray-900 mb-4">Registro Manual</h3>
          <p className="text-sm text-gray-500 mb-6">Añade un asistente directamente a esta zona sin pasar por la pasarela de pago.</p>

          <form className="space-y-4 flex-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo</label>
              <input type="text" className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-[#1E5ADF]" placeholder="Ej. Juan Pérez" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Documento de Identidad</label>
              <input type="text" className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-[#1E5ADF]" placeholder="Número de cédula" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Correo Electrónico</label>
              <input type="email" className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-[#1E5ADF]" placeholder="correo@ejemplo.com" />
            </div>
          </form>

          <button className="w-full py-4 mt-4 bg-[#1E5ADF] text-white rounded-xl font-black shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors">
            Guardar Asistente
          </button>
        </div>
      )}
    </div>
  );
};

export default PanelAsistentesZona;