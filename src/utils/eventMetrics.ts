import type { Evento, Zona } from '../types/event.types';

/**
 * Utilidades para calcular métricas de eventos cuando el backend
 * no proporciona los totales agregados.
 */
export const eventMetrics = {
    /**
     * Calcula cuántas entradas se han vendido en una zona específica
     */
    obtenerVendidosPorZona: (zona: Zona): number => {
        const disponibles = zona.cuposDisponibles ?? zona.capacidad;
        return Math.max(0, zona.capacidad - disponibles);
    },

    /**
     * Calcula el recaudo total de un evento sumando todas sus zonas
     */
    calcularRecaudoEvento: (evento: Evento): number => {
        if (evento.recaudo && evento.recaudo > 0) return evento.recaudo;
        
        return evento.zonas?.reduce((acc, zona) => {
            const vendidos = eventMetrics.obtenerVendidosPorZona(zona);
            return acc + (vendidos * zona.precio);
        }, 0) ?? 0;
    },

    /**
     * Calcula el total de entradas vendidas de un evento sumando todas sus zonas
     */
    calcularTicketsVendidosEvento: (evento: Evento): number => {
        if (evento.entradasVendidas && evento.entradasVendidas > 0) return evento.entradasVendidas;

        return evento.zonas?.reduce((acc, zona) => {
            return acc + eventMetrics.obtenerVendidosPorZona(zona);
        }, 0) ?? 0;
    },

    /**
     * Calcula el recaudo total de una lista de eventos
     */
    calcularRecaudoTotal: (eventos: Evento[]): number => {
        return eventos.reduce((acc, ev) => acc + eventMetrics.calcularRecaudoEvento(ev), 0);
    },

    /**
     * Calcula el total de tickets vendidos de una lista de eventos
     */
    calcularTicketsTotales: (eventos: Evento[]): number => {
        return eventos.reduce((acc, ev) => acc + eventMetrics.calcularTicketsVendidosEvento(ev), 0);
    }
};
