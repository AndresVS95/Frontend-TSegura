// src/components/ZonesPublish.tsx  —  HU-020 + HU-021
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Zona {
  nombreZona: string;
  capacidad: number;
  precio: number;
  precioMin?: number;
  precioMax?: number;
  asientos_numerados?: boolean;
  cuposDisponibles?: number;
}

interface Props {
  submitEvent: (estado: 'BORRADOR' | 'PUBLICADO') => void;
  prevStep: () => void;
  isLoading: boolean;
  formData: any;
  setFormData?: (data: any) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const zonaCompleta = (zona: Zona): boolean =>
  zona.capacidad > 0 &&
  zona.precio > 0 &&
  (zona.precioMin ?? 0) >= 0 &&
  (zona.precioMax ?? 0) >= zona.precio;

const fmt = (v: number) =>
  v > 0 ? `$${v.toLocaleString('es-CO')}` : '—';

// ─── Subcomponente: fila de zona editable ─────────────────────────────────────
const ZonaRow: React.FC<{
  zona: Zona;
  index: number;
  onChange: (index: number, field: keyof Zona, value: number) => void;
}> = ({ zona, index, onChange }) => {
  const [expandida, setExpandida] = useState(false);
  const completa = zonaCompleta(zona);

  return (
    <div className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
      completa ? 'border-green-200 bg-green-50/30' : 'border-gray-100 bg-white'
    }`}>
      {/* Cabecera de la zona */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer select-none"
        onClick={() => setExpandida(!expandida)}
      >
        <div className="flex items-center gap-4">
          {/* Indicador visual de completada */}
          {completa ? (
            <CheckCircle2 size={20} className="text-green-500 shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
          )}
          <div>
            <p className="font-black text-gray-900">{zona.nombreZona}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              {completa
                ? `Cap: ${zona.capacidad} · Precio: ${fmt(zona.precio)} · Rango: ${fmt(zona.precioMin ?? 0)} – ${fmt(zona.precioMax ?? 0)}`
                : 'Completa los campos para marcar como lista'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completa && (
            <span className="text-[10px] font-black bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-wider">
              Lista
            </span>
          )}
          {expandida ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </div>
      </div>

      {/* Inputs expandibles — HU-020 */}
      {expandida && (
        <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-gray-100 pt-5">

          {/* Capacidad */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
              Capacidad *
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                value={zona.capacidad || ''}
                onChange={(e) => onChange(index, 'capacidad', Number(e.target.value))}
                placeholder="Ej: 200"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2748E8] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-bold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300 font-bold">
                cupos
              </span>
            </div>
          </div>

          {/* Precio base */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
              Precio Base *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
              <input
                type="number"
                min={0}
                step={1000}
                value={zona.precio || ''}
                onChange={(e) => onChange(index, 'precio', Number(e.target.value))}
                placeholder="Ej: 50000"
                className="w-full pl-7 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#2748E8] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-bold"
              />
            </div>
          </div>

          {/* Precio mínimo */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
              Precio Mínimo *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
              <input
                type="number"
                min={0}
                step={1000}
                value={zona.precioMin ?? ''}
                onChange={(e) => onChange(index, 'precioMin', Number(e.target.value))}
                placeholder="Ej: 40000"
                className="w-full pl-7 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#2748E8] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-bold"
              />
            </div>
          </div>

          {/* Precio máximo */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
              Precio Máximo *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
              <input
                type="number"
                min={0}
                step={1000}
                value={zona.precioMax ?? ''}
                onChange={(e) => onChange(index, 'precioMax', Number(e.target.value))}
                placeholder="Ej: 80000"
                className={`w-full pl-7 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-bold ${
                  (zona.precioMax ?? 0) > 0 && (zona.precioMax ?? 0) < zona.precio
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 focus:border-[#2748E8]'
                }`}
              />
            </div>
            {(zona.precioMax ?? 0) > 0 && (zona.precioMax ?? 0) < zona.precio && (
              <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1">
                <AlertCircle size={10} /> El máximo debe ser ≥ al precio base
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ZonesPublish({
  submitEvent,
  prevStep,
  isLoading,
  formData,
  setFormData,
}: Props) {

  // Actualizar campo de una zona específica
  const handleZonaChange = (index: number, field: keyof Zona, value: number) => {
    if (!setFormData) return;
    const nuevasZonas = formData.zonas.map((z: Zona, i: number) =>
      i === index ? { ...z, [field]: value } : z
    );
    setFormData({ ...formData, zonas: nuevasZonas });
  };

  const zonasCompletas = formData.zonas?.filter((z: Zona) => zonaCompleta(z)).length ?? 0;
  const totalZonas     = formData.zonas?.length ?? 0;
  const todasListas    = zonasCompletas === totalZonas && totalZonas > 0;

  const validarYPublicar = () => {
    // Validar que todas las zonas tengan datos completos
    const incompletas = formData.zonas?.filter((z: Zona) => !zonaCompleta(z)) ?? [];
    if (incompletas.length > 0) {
      toast.error(`Completa los datos de: ${incompletas.map((z: Zona) => z.nombreZona).join(', ')}`);
      return;
    }

    // Validar que ningún precio máximo sea menor al base
    const invalidas = formData.zonas?.filter(
      (z: Zona) => (z.precioMax ?? 0) > 0 && (z.precioMax ?? 0) < z.precio
    ) ?? [];
    if (invalidas.length > 0) {
      toast.error(`El precio máximo no puede ser menor al base en: ${invalidas.map((z: Zona) => z.nombreZona).join(', ')}`);
      return;
    }

    const tienePreciosCero = formData.zonas?.some((z: Zona) => z.precio <= 0);
    if (tienePreciosCero) {
      toast('⚠️ Tienes zonas con precio $0. Verifica antes de publicar.', { icon: '⚠️' });
    }

    submitEvent('PUBLICADO');
  };

  return (
    <div className="animate-fade-in w-full">

      {/* Cabecera */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Paso 3: Configurar Zonas y Publicar
        </h2>
        <p className="text-sm text-gray-500">
          Define la capacidad y rango de precios de cada zona. Todas deben estar completas antes de publicar.
        </p>
      </div>

      {/* Barra de progreso de zonas */}
      <div className="bg-gray-50 rounded-2xl p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-gray-700">
            {zonasCompletas} de {totalZonas} zonas configuradas
          </p>
          <div className="flex gap-1 mt-2">
            {formData.zonas?.map((_: Zona, i: number) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  zonaCompleta(formData.zonas[i]) ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
        {todasListas && (
          <span className="flex items-center gap-2 text-green-600 font-black text-sm bg-green-100 px-4 py-2 rounded-xl">
            <CheckCircle2 size={16} /> ¡Todo listo!
          </span>
        )}
      </div>

      {/* Tabla de zonas editables — HU-020 */}
      <div className="space-y-3 mb-8">
        {formData.zonas?.map((zona: Zona, index: number) => (
          <ZonaRow
            key={index}
            zona={zona}
            index={index}
            onChange={handleZonaChange}
          />
        ))}
        {(!formData.zonas || formData.zonas.length === 0) && (
          <div className="text-center py-10 bg-gray-50 rounded-2xl text-gray-400 font-medium">
            No hay zonas configuradas. Vuelve al paso anterior.
          </div>
        )}
      </div>

      {/* Resumen del evento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
          <h4 className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-3">General</h4>
          <p className="text-lg font-bold text-gray-800">{formData.nombre}</p>
          <p className="text-sm text-gray-500 mt-1">
            {formData.fecha_evento
              ? new Date(formData.fecha_evento).toLocaleString('es-CO')
              : '—'}
          </p>
        </div>
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
          <h4 className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-3">Resumen de Zonas</h4>
          <div className="space-y-1.5">
            {formData.zonas?.map((z: Zona, i: number) => (
              <div key={i} className="flex justify-between text-sm items-center">
                <span className="font-medium text-gray-700">{z.nombreZona}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#2748E8]">{fmt(z.precio)}</span>
                  {zonaCompleta(z) && <CheckCircle2 size={12} className="text-green-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerta de publicación */}
      <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl flex items-start gap-4 mb-8">
        <span className="text-2xl shrink-0">ℹ️</span>
        <div>
          <h4 className="font-bold text-blue-900 mb-1">Revisión Finalizada</h4>
          <p className="text-sm text-blue-700 leading-relaxed">
            Al publicar, se activará la venta de boletos y cada compra generará automáticamente
            un ticket NFT en la blockchain para el comprador.
          </p>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-100 gap-4">
        <button
          onClick={prevStep}
          disabled={isLoading}
          className="text-sm font-bold text-gray-500 hover:text-[#2748E8] transition-colors disabled:opacity-50"
        >
          ← Paso anterior
        </button>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => submitEvent('BORRADOR')}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : 'Guardar como Borrador'}
          </button>

          <button
            onClick={validarYPublicar}
            disabled={isLoading || !todasListas}
            className="px-8 py-3 rounded-xl font-bold text-white bg-[#10b981] hover:bg-[#059669] transition-all shadow-lg shadow-green-200/50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading
              ? 'Publicando...'
              : todasListas
              ? 'Publicar Evento Oficialmente'
              : `Faltan ${totalZonas - zonasCompletas} zona(s)`}
          </button>
        </div>
      </div>
    </div>
  );
}