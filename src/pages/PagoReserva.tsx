// src/pages/PagoReserva.tsx
import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import { tokenManager } from '../lib/tokenManager';
import { stripePromise } from '../config/stripe';
import Navbar from '../components/Navbar';

interface PedidoState {
  eventoId: number;
  eventoNombre: string;
  zonaId: number;
  zonaNombre: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  urlImagen?: string;
}

// ─── Formulario Stripe ────────────────────────────────────────────────────────
const FormularioPago: React.FC<{ pedido: PedidoState; total: number }> = ({ pedido, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { reservaId } = useParams();

  const [cedula, setCedula] = useState('');
  const [nombreTitular, setNombreTitular] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !cedula.trim()) return;
    setProcesando(true);
    setError(null);

    try {
      const result = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
        billing_details: { name: nombreTitular }
      });

      if (result.error) {
        setError(result.error.message || 'Error al procesar la tarjeta');
        setProcesando(false);
        return;
      }

      const user = tokenManager.getUser();
      const payload = {
        zonaEventoId: pedido.zonaId,
        cantidad: pedido.cantidad,
        cedulaComprador: cedula,
        nombreComprador: user?.nombre_completo || 'Cliente TSegura',
        paymentMethodId: result.paymentMethod.id
      };

      const { data: resultadoVenta } = await api.post('/api/ventas/automatica', payload);
      navigate('/pago/procesando/nuevo', {
        state: { pedido, resultadoVenta }
      });
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al comunicarse con el servidor.');
      setProcesando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
      <h3 className="text-2xl font-black text-[#0D0D0D] mb-8">Información de Pago</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nombre en la tarjeta</label>
          <input 
            type="text" 
            value={nombreTitular}
            onChange={(e) => setNombreTitular(e.target.value)}
            placeholder="Ej: Juan Pérez"
            required
            className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-[#0D0D0D] outline-none focus:border-blue-200 transition-all placeholder:text-gray-300"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Documento de identidad (Cédula)</label>
          <input 
            type="text" 
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            placeholder="Ej: 1023456789"
            required
            className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-[#0D0D0D] outline-none focus:border-blue-200 transition-all placeholder:text-gray-300"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Detalles de la tarjeta</label>
          <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
            <CardElement options={{
              style: {
                base: { 
                  fontSize: '16px', 
                  color: '#0D0D0D', 
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: '700',
                  '::placeholder': { color: '#cbd5e1' } 
                },
                invalid: { color: '#ef4444' },
              },
            }} />
          </div>
        </div>
      </div>

      {error && <div className="mt-6 text-red-500 text-xs font-bold p-4 bg-red-50 rounded-2xl border border-red-100">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || procesando}
        className="mt-10 w-full py-5 bg-[#2748E8] text-white rounded-[1.5rem] font-black text-sm hover:bg-blue-700 transition-all disabled:bg-gray-200 shadow-xl shadow-blue-100 flex justify-center items-center gap-3 active:scale-[0.98]"
      >
        {procesando ? (
          <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Procesando...</>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Pagar ${total.toLocaleString('es-CO')}
          </>
        )}
      </button>

      <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between opacity-40">
        <div className="flex items-center gap-2">
           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.563 9.384-6.458 11.59L10 19l-1.542-.41C4.563 16.384 2 11.946 2 7c0-.681.057-1.35.166-2.001zM10 4a1 1 0 00-1 1v5a1 1 0 102 0V5a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
           <span className="text-[10px] font-black uppercase tracking-widest">Cifrado AES-256</span>
        </div>
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4 grayscale" alt="Stripe" />
      </div>
    </form>
  );
};

// ─── Página principal ─────────────────────────────────────────────────────────
const PagoReserva: React.FC = () => {
  const location = useLocation();
  const pedido = location.state as PedidoState | null;

  if (!pedido) {
    return <div className="min-h-screen flex items-center justify-center font-bold">Error: Datos del pedido no encontrados.</div>;
  }

  const subtotal = pedido.precioUnitario * pedido.cantidad;
  const cargoServicio = Math.round(subtotal * 0.05);
  const totalFinal = subtotal + cargoServicio;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-12 py-16">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 rounded-full bg-[#2748E8] flex items-center justify-center text-white text-xs font-black">1</div>
          <h2 className="premium-title text-3xl">Pa<span>go</span></h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Columna Izquierda: Formulario */}
          <div className="lg:col-span-3">
            <Elements stripe={stripePromise}>
              <FormularioPago pedido={pedido} total={totalFinal} />
            </Elements>
          </div>

          {/* Columna Derecha: Resumen */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50/50 rounded-[2.5rem] p-10 border border-gray-50">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Resumen de tu orden</h3>
              
              <div className="flex gap-4 mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={pedido.urlImagen || 'https://via.placeholder.com/200'} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h4 className="font-black text-[#0D0D0D] text-lg leading-tight mb-1">{pedido.eventoNombre}</h4>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">Zona {pedido.zonaNombre}</p>
                  <p className="text-[#2748E8] font-black text-sm mt-2">{pedido.cantidad} {pedido.cantidad === 1 ? 'entrada' : 'entradas'}</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold">Subtotal</span>
                  <span className="text-[#0D0D0D] font-black">${subtotal.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold">Cargo de servicio</span>
                  <span className="text-[#0D0D0D] font-black">${cargoServicio.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Total a pagar</span>
                  <span className="text-3xl font-black text-[#0D0D0D]">${totalFinal.toLocaleString('es-CO')}</span>
                </div>
              </div>

              <div className="mt-10 bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Protección al comprador</p>
                  <p className="text-xs text-gray-400 font-medium leading-tight mt-1">Tu dinero está seguro hasta que recibas tu ticket NFT.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoReserva;