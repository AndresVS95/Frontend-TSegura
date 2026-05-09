import { useState, useCallback } from 'react';
import {
  adminService,
  type SolicitudOrganizador,
  type Usuario,
  type EstadoSolicitud,
} from '../services/adminService';

/**
 * Custom hook que centraliza la lógica del panel admin.
 * Separa responsabilidades: los componentes solo manejan UI,
 * este hook maneja estado + llamadas a la API.
 */
export const useAdmin = () => {

  // ── Solicitudes ───────────────────────────────────────────────────────────
  const [solicitudes, setSolicitudes]         = useState<SolicitudOrganizador[]>([]);
  const [cargandoSolicitudes, setCargando]    = useState(false);
  const [errorSolicitudes, setError]          = useState<string | null>(null);

  const cargarSolicitudes = useCallback(
    async (estado?: EstadoSolicitud, q?: string) => {
      setCargando(true);
      setError(null);
      try {
        const data = await adminService.obtenerSolicitudes(estado, q);
        setSolicitudes(data);
      } catch {
        setError('Error al cargar solicitudes');
      } finally {
        setCargando(false);
      }
    },
    []
  );

  const rechazar = useCallback(
    async (id: number, motivo: string) => {
      await adminService.rechazarSolicitud(id, motivo);
      setSolicitudes((prev) =>
        prev.map((s) => s.id === id ? { ...s, estado: 'RECHAZADO', motivoRechazo: motivo } : s)
      );
    },
    []
  );

  const aprobar = useCallback(async (id: number) => {
    await adminService.aprobarSolicitud(id);
    setSolicitudes((prev) =>
      prev.map((s) => s.id === id ? { ...s, estado: 'APROBADO' } : s)
    );
  }, []);

  const suspender = useCallback(async (id: number, motivo: string) => {
    await adminService.suspenderOrganizador(id, motivo);
    setSolicitudes((prev) =>
      prev.map((s) => s.id === id ? { ...s, estado: 'RECHAZADO' } : s)
    );
  }, []);

  const reactivar = useCallback(async (id: number) => {
    await adminService.reactivarOrganizador(id);
    setSolicitudes((prev) =>
      prev.map((s) => s.id === id ? { ...s, estado: 'APROBADO' } : s)
    );
  }, []);

  // ── Usuarios ──────────────────────────────────────────────────────────────
  const [usuarios, setUsuarios]           = useState<Usuario[]>([]);
  const [cargandoUsuarios, setCargandoU]  = useState(false);
  const [usuarioDetalle, setDetalle]      = useState<Usuario | null>(null);

  const buscarUsuarios = useCallback(async (q: string) => {
    if (!q.trim()) { setUsuarios([]); return; }
    setCargandoU(true);
    try {
      const data = await adminService.buscarUsuarios(q);
      setUsuarios(data);
    } finally {
      setCargandoU(false);
    }
  }, []);

  const verDetalle = useCallback(async (id: number) => {
    const data = await adminService.obtenerUsuarioPorId(id);
    setDetalle(data);
  }, []);

  return {
    // Solicitudes
    solicitudes, cargandoSolicitudes, errorSolicitudes,
    cargarSolicitudes, rechazar, aprobar, suspender, reactivar,
    // Usuarios
    usuarios, cargandoUsuarios, usuarioDetalle,
    buscarUsuarios, verDetalle, setDetalle,
  };
};

