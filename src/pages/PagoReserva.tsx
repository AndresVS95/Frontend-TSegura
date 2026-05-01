// src/pages/PagoReserva.tsx
import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import { tokenManager } from '../lib/tokenManager';
import { stripePromise } from '../config/stripe';

interface PedidoState {
  eventoId: number;
  eventoNombre: string;
  zonaId: number;
  zonaNombre: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

// ─── Formulario Stripe ────────────────────────────────────────────────────────
const FormularioPago: React.FC<{ pedido: PedidoState; total: number }> = ({ pedido, total }) => {
  console.log('🔑 LLAVE PÚBLICA USADA:', import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51TH9MdLKUrQZ6U0BtOJUb71r2kNLRgMU2L3n0CQICRB5z3RE5xgSJtLjVuF1zJTdJMdho4Gq3TvOapWaeKuDj70W00P8C74S7v');
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { reservaId } = useParams();

  const [cedula, setCedula] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !cedula.trim()) return;
    setProcesando(true);
    setError(null);

    try {
      // 1. Crear el PaymentMethod localmente en el Frontend usando Stripe JS
      const result = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (result.error) {
        setError(result.error.message || 'Error al procesar la tarjeta');
        setProcesando(false);
        return;
      }

      // 2. Extraer datos del usuario y armar el DTO esperado por el backend
      const user = tokenManager.getUser();
      const payload = {
        zonaEventoId: pedido.zonaId,
        cantidad: pedido.cantidad,
        cedulaComprador: cedula,
        nombreComprador: user?.nombre_completo || 'Cliente TSegura',
        paymentMethodId: result.paymentMethod.id
      };

      // 3. Enviar el pago y la creación del boleto al backend
      console.log('🚀 ENVIANDO COMPRA AL BACK:', payload);
      await api.post('/api/ventas/automatica', payload);
      
      // 4. Si es exitoso, ir a la pantalla de éxito
      navigate(`/pago/procesando/${reservaId || 'exito'}`);
      
    } catch (err: any) {
      console.error('Error en checkout:', err);
      setError(err.response?.data?.message || 'Error al comunicarse con el servidor.');
      setProcesando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
      <h3 className="text-2xl font-black text-gray-900 mb-6">Detalles de Pago</h3>

      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">Cédula del Comprador</label>
        <input 
          type="text" 
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          placeholder="Ej: 1023456789"
          required
          className="w-full bg-gray-50 border-2 border-gray-200 p-4 rounded-xl font-medium text-gray-800 focus:ring-2 focus:ring-[#1E5ADF] focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">Tarjeta de Crédito</label>
        <div className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
          <CardElement options={{
            style: {
              base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
              invalid: { color: '#9e2146' },
            },
          }} />
        </div>
      </div>

      {error && <div className="text-red-500 text-sm font-bold mb-4 p-3 bg-red-50 rounded-lg">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || procesando}
        className="w-full py-4 bg-[#1E5ADF] text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 flex justify-center items-center gap-2"
      >
        {procesando ? (
          <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Procesando...</>
        ) : (
          `Pagar $${total.toLocaleString('es-CO')}` // ✅ Total real
        )}
      </button>

      <p className="text-center text-xs text-gray-400 mt-4 font-medium flex items-center justify-center gap-1">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Pagos seguros encriptados por Stripe
      </p>
    </form>
  );
};

// ─── Página wrapper ───────────────────────────────────────────────────────────
const PagoReserva: React.FC = () => {
  const location = useLocation();

  // ✅ Lee datos reales enviados por ComprarBoletos via navigate state
  const pedido = location.state as PedidoState | null;

  const eventoNombre   = pedido?.eventoNombre   ?? 'Evento';
  const zonaNombre     = pedido?.zonaNombre     ?? 'Zona';
  const cantidad       = pedido?.cantidad       ?? 1;
  const precioUnitario = pedido?.precioUnitario ?? 0;

  const subtotal      = precioUnitario * cantidad;
  const cargoServicio = Math.round(subtotal * 0.05); // 5%
  const totalFinal    = subtotal + cargoServicio;

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-10 tracking-tight text-gray-900">
          Finaliza tu <span className="text-[#1E5ADF]">Compra</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ── Resumen del pedido ── */}
          <div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
                Resumen del Pedido
              </h3>

              <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                <div>
                  {/* ✅ Datos reales */}
                  <p className="font-black text-xl text-gray-900">{eventoNombre}</p>
                  <p className="text-gray-500">
                    {cantidad} {cantidad === 1 ? 'Boleta' : 'Boletas'} — Zona {zonaNombre}
                  </p>
                </div>
                <p className="text-sm text-gray-400 font-medium">
                  ${precioUnitario.toLocaleString('es-CO')} c/u
                </p>
              </div>

              <div className="flex justify-between items-center text-gray-600 mb-2 font-medium">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('es-CO')}</span>
              </div>

              <div className="flex justify-between items-center text-gray-600 mb-6 font-medium">
                <span>Cargo por servicio (5%)</span>
                <span>${cargoServicio.toLocaleString('es-CO')}</span>
              </div>

              <div className="flex justify-between items-center text-2xl font-black text-[#1E5ADF] bg-blue-50 p-4 rounded-xl">
                <span>Total</span>
                <span>${totalFinal.toLocaleString('es-CO')}</span>
              </div>
            </div>
          </div>

          {/* ── Formulario Stripe ── */}
          <div>
            <Elements stripe={stripePromise}>
              {pedido ? (
                <FormularioPago pedido={pedido} total={totalFinal} />
              ) : (
                <div className="bg-red-50 p-6 rounded-2xl text-red-600 font-bold">
                  Error: No se encontraron los datos del pedido. Vuelve al catálogo.
                </div>
              )}
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoReserva;