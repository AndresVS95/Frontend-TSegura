import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService, type CrearUsuarioDTO, type RolUsuario } from '../../services/adminService';

const ROLES: { valor: RolUsuario; label: string; desc: string; color: string }[] = [
  { valor: 'COMPRADOR',   label: 'Comprador',   desc: 'Puede comprar boletos en la plataforma', color: 'border-green-300 bg-green-50'  },
  { valor: 'ORGANIZADOR', label: 'Organizador', desc: 'Puede crear y gestionar eventos',         color: 'border-blue-300 bg-blue-50'    },
  { valor: 'ADMIN',       label: 'Admin',       desc: 'Acceso total al panel de administración', color: 'border-purple-300 bg-purple-50' },
];

const CrearUsuarioAdmin: React.FC = () => {
  const [form, setForm] = useState<CrearUsuarioDTO>({
    nombreCompleto: '',
    correo: '',
    contrasenaTemp: '',
    perfil: 'COMPRADOR',
  });
  const [enviando, setEnviando]   = useState(false);
  const [exito, setExito]         = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      // ── REAL ──────────────────────────────────────────────────────
      await adminService.crearUsuario(form);

      // ── MOCK (comentar cuando el endpoint esté listo) ──────────────
      // await new Promise((r) => setTimeout(r, 800));

      setExito(true);
      setForm({ nombreCompleto: '', correo: '', contrasenaTemp: '', perfil: 'COMPRADOR' });
      setTimeout(() => setExito(false), 4000);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Error al crear el usuario. Verifica los datos.');
    } finally {
      setEnviando(false);
    }
  };

  const campo = (
    id: keyof CrearUsuarioDTO,
    label: string,
    type = 'text',
    placeholder = ''
  ) => (
    <div>
      <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-2">
        {label} *
      </label>
      <input
        type={type}
        value={form[id] as string}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
        placeholder={placeholder}
        required
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E5ADF] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
      />
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-8 max-w-2xl">

        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Crear Usuario</h1>
          <p className="text-gray-500 mt-1">
            El usuario recibirá un correo de bienvenida con sus credenciales temporales.
          </p>
        </div>

        {/* Éxito */}
        {exito && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 font-bold text-sm flex items-center gap-3">
            <span className="text-2xl">✅</span>
            Usuario creado correctamente. Se envió un correo de bienvenida con la contraseña temporal.
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">

          {/* Selector de rol */}
          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-3">
              Rol *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {ROLES.map(({ valor, label, desc, color }) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => setForm({ ...form, perfil: valor })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.perfil === valor
                      ? color + ' border-opacity-100'
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <p className={`font-black text-sm ${form.perfil === valor ? 'text-gray-900' : 'text-gray-600'}`}>
                    {label}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 leading-tight">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {campo('nombreCompleto', 'Nombre Completo',  'text',     'Ej: Juan García López')}
          {campo('correo',         'Correo Electrónico','email',   'Ej: juan@email.com')}
          {campo('contrasenaTemp', 'Contraseña Temporal','password','Mínimo 8 caracteres')}

          {/* Nota */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-xs text-blue-700">
            <strong>Nota:</strong> El usuario deberá cambiar esta contraseña en su primer inicio de sesión.
          </div>

          <button
            type="submit"
            disabled={enviando || !form.nombreCompleto || !form.correo || !form.contrasenaTemp}
            className="w-full py-4 bg-[#1E5ADF] hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {enviando
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creando usuario...</>
              : 'Crear Usuario y Enviar Correo'
            }
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CrearUsuarioAdmin;