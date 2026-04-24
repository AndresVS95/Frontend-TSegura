import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProcesandoPago: React.FC = () => {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("Validando transaccion con Stripe...");

  useEffect(() => {
    // Tarea: FE+INT: Polling estado post-pago
    const verificarEstado = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/payments/${reservaId}/status`);
        const data = await response.json();

        if (data.status === 'COMPLETED') {
          clearInterval(verificarEstado);
          // Si JG y JM terminaron (Pago y NFT), vamos a éxito
          navigate(`/resultado-pago/exito/${reservaId}`);
        } else if (data.status === 'PROCESSING_NFT') {
          setMensaje("¡Pago recibido! Estamos minteando tu NFT en la Blockchain...");
        } else if (data.status === 'FAILED') {
          clearInterval(verificarEstado);
          navigate(`/resultado-pago/error/${reservaId}`);
        }
      } catch (error) {
        console.error("Error en polling:", error);
      }
    }, 2000); // Consulta cada 2 segundos

    return () => clearInterval(verificarEstado);
  }, [reservaId, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
      <div className="w-20 h-20 border-4 border-[#1E5ADF] border-t-transparent rounded-full animate-spin mb-8"></div>
      <h2 className="text-3xl font-black text-gray-900 mb-4">Procesando tu pedido</h2>
      <p className="text-gray-500 text-lg animate-pulse">{mensaje}</p>
      <p className="mt-8 text-xs text-gray-400 uppercase tracking-widest font-bold">No cierres esta ventana</p>
    </div>
  );
};

export default ProcesandoPago;