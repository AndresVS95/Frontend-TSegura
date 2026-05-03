import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { eventService } from '../services/eventService';
import type { Evento, Zona } from '../types/event.types';

interface ManualSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  evento: Evento;
  onSaleSuccess: () => void;
}

export const ManualSaleModal: React.FC<ManualSaleModalProps> = ({ isOpen, onClose, evento, onSaleSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombreComprador: '',
    cedulaComprador: '',
    zonaEventoId: '',
    cantidad: 1,
    metodoPago: 'EFECTIVO'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cedulaComprador || !formData.nombreComprador) {
        toast.error("El nombre y la cédula del comprador son obligatorios.");
        return;
    }
    if (!formData.zonaEventoId) {
        toast.error("Debes seleccionar una zona.");
        return;
    }
    
    setLoading(true);

    try {
      // LLamada al backend para asentar la venta manual
      // El backend espera zonaEventoId como Integer
      const payload = {
        ...formData,
        zonaEventoId: Number(formData.zonaEventoId),
        cantidad: Number(formData.cantidad)
      };

      await eventService.registrarVentaManual(payload);
      toast.success("✅ Venta registrada y NFT generado en Blockchain.");
      onSaleSuccess(); // Refrescar el dashboard
      onClose(); // Cerrar modal
    } catch (error: any) {
      console.error("Error en venta manual:", error);
      toast.error(error.response?.data?.message || error.message || "Error al registrar la venta manual.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-8 relative">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#03292e]">Venta Manual</h2>
            <p className="text-sm text-gray-500">Asentar venta Offline (Generará NFT)</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-3xl font-bold transition-colors">
            &times;
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Cédula *</label>
              <input 
                type="text" 
                name="cedulaComprador"
                value={formData.cedulaComprador}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-[#2748E8] focus:ring-0 outline-none transition-colors"
                placeholder="100200300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo *</label>
              <input 
                type="text" 
                name="nombreComprador"
                value={formData.nombreComprador}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-[#2748E8] focus:ring-0 outline-none transition-colors"
                placeholder="Juan Pérez"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Zona</label>
              <select
                name="zonaEventoId"
                value={formData.zonaEventoId}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-[#2748E8] outline-none"
              >
                <option value="">Selecciona Zona...</option>
                {evento.zonas?.map((zona, idx) => (
                    <option key={idx} value={zona.zonaId}>{zona.nombreZona} - ${zona.precio}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Cantidad Boletos</label>
              <input 
                type="number" 
                name="cantidad"
                min="1"
                max="10"
                value={formData.cantidad}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-[#2748E8] outline-none"
              />
            </div>
          </div>

          <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Método de Pago</label>
              <select
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-[#2748E8] outline-none font-medium text-gray-800"
              >
                <option value="EFECTIVO">💵 Efectivo (Dinero físico)</option>
                <option value="TRANSFERENCIA">🏦 Transferencia Bancaria</option>
                <option value="CORTESIA">🎁 Cortesía ($0)</option>
              </select>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={`px-8 py-3 font-bold text-white bg-[#2748E8] hover:bg-blue-700 rounded-xl shadow-lg transition-all flex items-center justify-center ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? 'Registrando...' : 'Emitir Boleto NFT'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
