// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import DashboardOrganizer from './pages/DashboardOrganizer';
import DashboardBuyer from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import CrearEvento from './pages/CrearEvento';
import { ComprarBoletos } from './pages/ComprarBoletos';
import CatalogoEventos from './pages/CatalogoEventos';
import EventoDetalle from './components/EventoDetalle';  // ✅ corregido: viene de pages, no components
import PagoReserva from './pages/PagoReserva';
import ProcesandoPago from './components/ProcesandoPago';
import ResultadoPago from './components/ResultadoPago';
import MisBoletos from './pages/MisBoletos';
import PanelAsistentesZona from './components/PanelAsistentesZona';

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 4000 }}
      />
      <Router>
        <Routes>

          {/* ── Rutas públicas ── */}
          <Route path="/" element={<CatalogoEventos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ── Detalle de evento (público) */}
          <Route path="/eventos/:id" element={<EventoDetalle />} />

          {/* ── Rutas de pago ── */}
          <Route path="/pago/:reservaId" element={<PagoReserva />} />
          {/* Con parámetros — coinciden con navigate() en PagoReserva y ProcesandoPago */}
          <Route path="/pago/procesando/:reservaId" element={<ProcesandoPago />} />
          <Route path="/pago/resultado/:estado/:reservaId" element={<ResultadoPago />} />

          {/* ── Mis boletos ── */}
          <Route path="/my-tickets" element={<MisBoletos />} />

          {/* ── Rutas protegidas: COMPRADOR ── */}
          <Route
            path="/dashboard-buyer"
            element={
              <PrivateRoute allowedRole="COMPRADOR">
                <DashboardBuyer />
              </PrivateRoute>
            }
          />
          <Route
            path="/comprar/:eventoId/zona/:zonaId"
            element={
              <PrivateRoute allowedRole="COMPRADOR">
                <ComprarBoletos />
              </PrivateRoute>
            }
          />

          {/* ── Rutas protegidas: ORGANIZADOR ── */}
          <Route
            path="/dashboard-organizer"
            element={
              <PrivateRoute allowedRole="ORGANIZADOR">
                <DashboardOrganizer />
              </PrivateRoute>
            }
          />
          <Route
            path="/crearevento"
            element={
              <PrivateRoute allowedRole="ORGANIZADOR">
                <CrearEvento />
              </PrivateRoute>
            }
          />
          <Route
            path="/organizer/eventos/:eventoId/zonas/:zonaId/asistentes"
            element={
              <PrivateRoute allowedRole="ORGANIZADOR">
                <PanelAsistentesZona />
              </PrivateRoute>
            }
          />

          {/* ── Comodín: SIEMPRE al final ──
              ✅ Movido aquí para no interceptar las rutas de arriba */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;