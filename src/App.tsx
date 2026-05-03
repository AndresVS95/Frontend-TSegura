// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import DashboardOrganizer from './pages/DashboardOrganizer';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import CrearEvento from './pages/CrearEvento';
import DetalleEventoOrg from './pages/DetalleEventoOrg';

// Importaciones de los nuevos módulos de la Suite de Organizador
import OrganizerEvents from './pages/OrganizerEvents';
import OrganizerFinances from './pages/OrganizerFinances';
import OrganizerValidator from './pages/OrganizerValidator';
import OrganizerSettings from './pages/OrganizerSettings';

import EventoDetalle from './components/EventoDetalle';
import PagoReserva from './pages/PagoReserva';
import MisBoletos from './pages/MisBoletos';
import ProcesandoPago from './components/ProcesandoPago';
import ResultadoPago from './components/ResultadoPago';
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
          {/* Ruta pública principal (Catálogo Dinámico) */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* 1. Ruta para que cualquier usuario vea los detalles del evento (Pública) */}
          <Route path="/eventos/:id" element={<EventoDetalle />} /> 

          {/* 3. Ruta para el Checkout (Pantalla de Pago) */}
          <Route
            path="/pago/:zonaId"
            element={
              <PrivateRoute allowedRole="COMPRADOR">
                <PagoReserva />
              </PrivateRoute>
            }
          />

          {/* 4. Ruta para el inventario del usuario */}
          <Route
            path="/my-tickets"
            element={
              <PrivateRoute allowedRole="COMPRADOR">
                <MisBoletos />
              </PrivateRoute>
            }
          />

          {/* 5. Rutas de Procesamiento y Resultado de Pago */}
          <Route
            path="/pago/procesando/:reservaId"
            element={
              <PrivateRoute allowedRole="COMPRADOR">
                <ProcesandoPago />
              </PrivateRoute>
            }
          />
          <Route
            path="/pago/resultado/:estado/:reservaId"
            element={
              <PrivateRoute allowedRole="COMPRADOR">
                <ResultadoPago />
              </PrivateRoute>
            }
          />

          {/* RUTAS PARA ORGANIZADOR (Suite Profesional) */}
          <Route
            path="/dashboard-organizer"
            element={
              <PrivateRoute allowedRole="ORGANIZADOR">
                <DashboardOrganizer />
              </PrivateRoute>
            }
          />

          <Route
            path="/organizer-events"
            element={
              <PrivateRoute allowedRole="ORGANIZADOR">
                <OrganizerEvents />
              </PrivateRoute>
            }
          />

          <Route
            path="/detalles/:id"
            element={
              <PrivateRoute allowedRole="ORGANIZADOR">
                <DetalleEventoOrg />
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
            path="/organizer-finances"
            element={
              <PrivateRoute allowedRole="ORGANIZADOR">
                <OrganizerFinances />
              </PrivateRoute>
            }
          />

          <Route
            path="/organizer-validator"
            element={
              <PrivateRoute allowedRole="ORGANIZADOR">
                <OrganizerValidator />
              </PrivateRoute>
            }
          />

          <Route
            path="/organizer-settings"
            element={
              <PrivateRoute allowedRole="ORGANIZADOR">
                <OrganizerSettings />
              </PrivateRoute>
            }
          />

          <Route
            path="/asistentes/:eventoId/:zonaId"
            element={
              <PrivateRoute allowedRole="ORGANIZADOR">
                <PanelAsistentesZona />
              </PrivateRoute>
            }
          />

          {/* Ruta comodín */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
