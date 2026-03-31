import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';

type Role = 'comprador' | 'organizador' | null;

export const Register: React.FC = () => {
  const [role, setRole] = useState<Role>(null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8F9FA]">

      {/* Mitad Izquierda: Panel Azul (Marca y Mensaje) */}
      <div className="hidden md:flex md:w-5/12 bg-[#1E5ADF] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Elemento decorativo de fondo */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          {/* Aquí iría la imagen del edificio o patrón */}
          <div className="w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">🎫</span> TSegura.
          </h1>
        </div>

        <div className="relative z-10 max-w-md">
          <span className="text-4xl text-blue-300 font-serif leading-none">"</span>
          <p className="text-lg leading-relaxed mt-2 mb-6 text-blue-50">
            Únete a la plataforma líder de boletería digital. Diseñada para ofrecer la mejor experiencia tanto a fans como a creadores de eventos.
          </p>
          <div className="flex items-center gap-2">
            <span className="font-semibold">El equipo de TSegura</span>
            <span className="text-green-400">✓</span>
          </div>
        </div>
      </div>

      {/* Mitad Derecha: Formularios */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-6 sm:p-12 lg:p-20 overflow-y-auto">
        <div className="w-full max-w-lg">

          {/* Cabecera de Navegación */}
          <div className="flex justify-between items-center mb-10">
            <button
              onClick={() => setRole(null)}
              className={`text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 ${!role ? 'invisible' : ''}`}
            >
              <span>‹</span> Back
            </button>
            <div className="text-right text-xs text-gray-400 uppercase tracking-widest">
              Paso {role ? '02' : '01'}/02
              <div className="text-gray-800 font-semibold mt-0.5">
                {!role ? 'Tipo de Cuenta' : role === 'comprador' ? 'Datos Personales' : 'Plan Profesional'}
              </div>
            </div>
          </div>

          {/* ESTADO 1: Selección de Rol */}
          {!role && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Crea tu Cuenta!</h2>
              <p className="text-gray-500 mb-8">Para brindarte la mejor experiencia, dinos cómo usarás TSegura.</p>

              <div className="space-y-4">
                <button onClick={() => setRole('comprador')} className="w-full text-left p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1E5ADF] hover:shadow-md transition-all">
                  <h3 className="text-lg font-bold text-gray-900">Comprador Individual</h3>
                  <p className="text-sm text-gray-500 mt-1">Quiero explorar eventos y comprar mis entradas fácilmente.</p>
                </button>
                <button onClick={() => setRole('organizador')} className="w-full text-left p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1E5ADF] hover:shadow-md transition-all">
                  <h3 className="text-lg font-bold text-gray-900">Cuenta de Organizador</h3>
                  <p className="text-sm text-gray-500 mt-1">Represento a una empresa o quiero organizar mis propios eventos.</p>
                </button>
              </div>
            </div>
          )}

          {/* ESTADO 2: Formulario Comprador */}
          {role === 'comprador' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Registro de Comprador!</h2>
              <p className="text-gray-500 mb-8">Por regulaciones de la industria, necesitamos algunos datos tuyos.</p>

              <form onSubmit={(e) => e.preventDefault()}>
                <Input label="Nombre completo*" id="fullname" placeholder="Ej. Carlos Mendoza" required />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  <Input label="Cédula*" id="document" placeholder="Número de documento" required />
                  <Input label="Teléfono*" id="phone" type="tel" placeholder="+57 300 000 0000" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  <Input label="Fecha de Nacimiento*" id="dob" type="date" required />
                  <Select
                    label="Género*"
                    id="gender"
                    options={[
                      { value: 'm', label: 'Masculino' },
                      { value: 'f', label: 'Femenino' },
                      { value: 'o', label: 'Otro' }
                    ]}
                    required
                  />
                </div>

                <Input label="Correo electrónico*" id="email" type="email" placeholder="Ingresa tu correo" required />

                <Input
                  label="Crear contraseña*"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  required
                  rightElement={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="font-semibold text-gray-800">
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  }
                />
                <Input label="Verificar contraseña*" id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Repite tu contraseña" required />

                <div className="flex items-center mt-2 mb-6">
                  <input type="checkbox" id="terms" className="w-4 h-4 text-[#1E5ADF] border-gray-300 rounded focus:ring-[#1E5ADF]" required />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    Acepto los <a href="#" className="text-gray-900 font-medium hover:underline">términos & condiciones</a>
                  </label>
                </div>

                <Button type="submit" variant="primary">Registrar Cuenta</Button>

                <div className="relative flex py-5 items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">Or</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <Button type="button" variant="social">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  Registrarse con Google
                </Button>
              </form>
            </div>
          )}

          {/* ESTADO 3: Pitch Organizador */}
          {role === 'organizador' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Potencia tus Eventos</h2>
              <p className="text-gray-500 mb-8">
                Crea, gestiona y vende entradas de manera profesional con las herramientas de TSegura.
              </p>

              <div className="bg-white border-2 border-[#1E5ADF] rounded-xl p-6 mb-8 shadow-sm">
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-black text-gray-900">$5</span>
                  <span className="text-gray-500 ml-2 font-medium">USD / Registro único</span>
                </div>
                <ul className="space-y-4 text-sm text-gray-600 mb-6">
                  <li className="flex items-center gap-3">
                    <span className="text-[#1E5ADF] text-lg">✓</span> Panel de analíticas avanzado
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#1E5ADF] text-lg">✓</span> App de escaneo de QR ilimitada
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#1E5ADF] text-lg">✓</span> Desembolsos rápidos
                  </li>
                </ul>
                <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
                  Cobramos una comisión transparente del 5% + $0.50 por cada boleto vendido.
                </div>
              </div>

              <Button variant="primary">Continuar al pago y registro</Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};