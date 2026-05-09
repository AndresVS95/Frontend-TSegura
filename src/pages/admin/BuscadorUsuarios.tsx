import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../hooks/useAdmin';
import type { Usuario, RolUsuario } from '../../services/adminService';

// ─── Badge de rol ─────────────────────────────────────────────────────────────
const BadgeRol: React.FC<{ perfil: RolUsuario }> = ({ perfil }) => {
  const map: Record<RolUsuario, string> = {
    ADMIN:        'bg-purple-100 text-purple-700',
    ORGANIZADOR:  'bg-blue-100 text-[#1E5ADF]',
    COMPRADOR:    'bg-green-100 text-green-700',
  };
  return (
    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${map[perfil]}`}>
      {perfil}
    </span>
  );
};

// ─── Badge de estado ──────────────────────────────────────────────────────────
const BadgeEstadoCuenta: React.FC<{ estado: string }> = ({ estado }) => {
  const map: Record<string, string> = {
    ACTIVO:     'bg-green-100 text-green-700',
    SUSPENDIDO: 'bg-red-100 text-red-700',
    PENDIENTE:  'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${map[estado] ?? 'bg-gray-100 text-gray-500'}`}>
      {estado}
    </span>
  );
};

// ─── Panel de perfil completo ─────────────────────────────────────────────────
const PerfilUsuario: React.FC<{ usuario: Usuario; onClose: () => void }> = ({ usuario, onClose }) => {
  const inicial = usuario.nombreCompleto.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>

        {/* Cabecera */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-[#1E5ADF] rounded-2xl flex items-center justify-center text-white font-black text-2xl">
            {inicial}
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">{usuario.nombreCompleto}</h2>
            <p className="text-gray-400 text-sm">{usuario.correo}</p>
            <div className="flex gap-2 mt-2">
              <BadgeRol perfil={usuario.perfil} />
              <BadgeEstadoCuenta estado={usuario.estado} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto w-8 h-8 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Datos */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Documento', valor: usuario.numeroDocumento ?? '—' },
            { label: 'Teléfono',  valor: usuario.numeroTelefono  ?? '—' },
            { label: 'Registro',  valor: usuario.fechaRegistro },
            { label: 'ID',        valor: `#${usuario.id}` },
          ].map(({ label, valor }) => (
            <div key={label} className="bg-gray-50 p-3 rounded-xl">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="font-bold text-gray-900 text-sm">{valor}</p>
            </div>
          ))}
        </div>

        {/* Historial según rol */}
        {usuario.perfil === 'ORGANIZADOR' && (
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-xs font-black text-[#1E5ADF] uppercase tracking-wider mb-3">Actividad como Organizador</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-2xl font-black text-gray-900">{usuario.totalEventos ?? 0}</p>
                <p className="text-xs text-gray-500">Eventos creados</p>
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">
                  ${((usuario.totalRecaudo ?? 0) / 1_000_000).toFixed(1)}M
                </p>
                <p className="text-xs text-gray-500">Total recaudado</p>
              </div>
            </div>
          </div>
        )}

        {usuario.perfil === 'COMPRADOR' && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
            <p className="text-xs font-black text-green-700 uppercase tracking-wider mb-3">Actividad como Comprador</p>
            <div>
              <p className="text-2xl font-black text-gray-900">{usuario.totalCompras ?? 0}</p>
              <p className="text-xs text-gray-500">Compras realizadas</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Página principal ─────────────────────────────────────────────────────────
const BuscadorUsuarios: React.FC = () => {
  const { usuarios, cargandoUsuarios, buscarUsuarios, usuarioDetalle, verDetalle, setDetalle } = useAdmin();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce búsqueda
  useEffect(() => {
    const t = setTimeout(() => buscarUsuarios(query), 350);
    return () => clearTimeout(t);
  }, [query, buscarUsuarios]);

  // Focus al montar
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <AdminLayout>
      <div className="p-8 max-w-5xl">

        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Buscar Usuarios</h1>
          <p className="text-gray-500 mt-1">Busca por nombre, correo o número de documento</p>
        </div>

        {/* Buscador */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar por nombre, correo o cédula..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1E5ADF] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-gray-700 font-medium"
          />
          {cargandoUsuarios && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-[#1E5ADF] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Estado vacío inicial */}
        {!query && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-gray-400 font-semibold">Escribe para buscar usuarios</p>
          </div>
        )}

        {/* Sin resultados */}
        {query && !cargandoUsuarios && usuarios.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <span className="text-5xl block mb-4">😕</span>
            <p className="text-gray-700 font-bold mb-1">Sin resultados para "{query}"</p>
            <p className="text-gray-400 text-sm">Intenta con otro nombre, correo o documento</p>
          </div>
        )}

        {/* Resultados */}
        {usuarios.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider">
                {usuarios.length} resultado{usuarios.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="divide-y divide-gray-50">
              {usuarios.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => verDetalle(u.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-black text-[#1E5ADF]">
                      {u.nombreCompleto.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{u.nombreCompleto}</p>
                      <p className="text-gray-400 text-xs">{u.correo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BadgeRol perfil={u.perfil} />
                    <BadgeEstadoCuenta estado={u.estado} />
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Panel de perfil completo */}
      {usuarioDetalle && (
        <PerfilUsuario usuario={usuarioDetalle} onClose={() => setDetalle(null)} />
      )}
    </AdminLayout>
  );
};

export default BuscadorUsuarios;