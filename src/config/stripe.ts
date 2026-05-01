import { loadStripe } from '@stripe/stripe-js';

/**
 * Configuración centralizada de Stripe.
 * Solo usa la Llave Pública (Public Key).
 * La Llave Secreta (Secret Key) NUNCA debe estar en el frontend.
 */
export const STRIPE_PUBLIC_KEY = 
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || 
  'pk_test_51TH9MdLKUrQZ6U0BtOJUb71r2kNLRgMU2L3n0CQICRB5z3RE5xgSJtLjVuF1zJTdJMdho4Gq3TvOapWaeKuDj70W00P8C74S7v';

export const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
