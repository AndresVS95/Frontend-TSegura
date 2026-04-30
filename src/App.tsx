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
import DetalleEventoOrg from './pages/DetalleEventoOrg';

// Importaciones de los nuevos módulos de la Suite de Organizador
import OrganizerEvents from './pages/OrganizerEvents';
import OrganizerFinances from './pages/OrganizerFinances';
import OrganizerValidator from './pages/OrganizerValidator';
import OrganizerSettings from './pages/OrganizerSettings';

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
          <Route path="/" element={<CatalogoEventos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Rutas para COMPRADOR */}
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

          {/* Ruta comodín */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
