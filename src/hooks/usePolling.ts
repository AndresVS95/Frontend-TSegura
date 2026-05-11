import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook reutilizable para polling.
 * Evita duplicar setInterval en cada componente.
 *
 * @param callback  Función async a ejecutar cada intervalo
 * @param intervalo Milisegundos entre ejecuciones (default 15s)
 * @param activo    Si false, el polling se detiene
 */
export const usePolling = (
  callback: () => Promise<void>,
  intervalo = 15_000,
  activo = true
) => {
  const callbackRef = useRef(callback);

  // Mantener siempre la referencia actualizada sin reiniciar el intervalo
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!activo) return;

    // Ejecución inmediata al montar
    callbackRef.current();

    const id = setInterval(() => {
      callbackRef.current();
    }, intervalo);

    return () => clearInterval(id);
  }, [intervalo, activo]);
};