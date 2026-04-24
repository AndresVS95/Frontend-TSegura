import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// 1. CAMBIO AQUÍ: Agregamos useParams para obtener el ID de la reserva de la URL
import { useNavigate, useParams } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const FormularioPago = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  // 2. CAMBIO AQUÍ: Extraemos el reservaId de la URL para que no de error
  const { reservaId } = useParams(); 
  
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcesando(true);
    setError(null);

    try {
      // 3. CAMBIO AQUÍ: Le puse un bloque try/catch para que no se rompa si el backend de JG está apagado
      const response = await fetch('http://localhost:8080/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservaId: reservaId }), // Ahora sí existe esta variable
      });

      if (!response.ok) throw new Error("Error conectando con el backend");

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message || "Error en el pago");
        setProcesando(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // 4. CAMBIO AQUÍ: En vez de ir a éxito directo, lo mandamos al Polling
          navigate(`/procesando-pago/${reservaId}`);
        }
      }
    } catch (err) {
      console.warn("Backend falló. Simulando éxito para que puedas probar las pantallas de la HU-009:");
      // MOCK: Si el backend falla en tus pruebas locales, igual te deja avanzar a la pantalla de carga
      setTimeout(() => {
        navigate(`/procesando-pago/${reservaId || 'prueba-123'}`);
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
      <h3 className="text-2xl font-black text-gray-900 mb-6">Detalles de Pago</h3>
      
      <div className="mb-6 p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
          },
        }}/>
      </div>

      {error && <div className="text-red-500 text-sm font-bold mb-4">{error}</div>}

      <button 
        type="submit" 
        disabled={!stripe || procesando}
        className="w-full py-4 bg-[#1E5ADF] text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 shadow-lg shadow-blue-500/30 flex justify-center items-center"
      >
        {procesando ? (
          <span className="animate-pulse">Procesando pago...</span>
        ) : (
          'Pagar $300,000'
        )}
      </button>
      
      <p className="text-center text-xs text-gray-400 mt-4 font-medium flex items-center justify-center">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
        Pagos seguros encriptados por Stripe
      </p>
    </form>
  );
};

export const PagoReserva: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-10 tracking-tight text-gray-900">
          Finaliza tu <span className="text-[#1E5ADF]">Compra</span>
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* COLUMNA IZQUIERDA: RESUMEN DE COMPRA */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-400 uppercase tracking-wider mb-6 text-sm">Resumen del Pedido</h3>
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <div>
                  <p className="font-black text-xl text-gray-900">Concierto de TUSII</p>
                  <p className="text-gray-500">2 Boletas - Zona VIP</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-gray-600 mb-2 font-medium">
                <span>Subtotal</span>
                <span>$300,000</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 mb-6 font-medium">
                <span>Cargos por servicio</span>
                <span>$15,000</span>
              </div>
              <div className="flex justify-between items-center text-2xl font-black text-[#1E5ADF] bg-blue-50 p-4 rounded-xl">
                <span>Total</span>
                <span>$315,000</span>
              </div>
            </div>
          </div>
          {/* COLUMNA DERECHA: FORMULARIO STRIPE */}
          <div>
            <Elements stripe={stripePromise}>
              <FormularioPago />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoReserva;