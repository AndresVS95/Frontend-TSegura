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
import  CatalogoEventos  from './pages/CatalogoEventos';
import DetalleEventoOrg from './pages/DetalleEventoOrg';

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 4000 }} />
      <Router>
      <Routes>
        <Route path="/" element={<CatalogoEventos />} />
        {/* Si el usuario entra a la raíz, lo enviamos al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas de nuestra aplicación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Ruta Protegida para COMPRADOR */}
        <Route
          path="/dashboard-buyer"
          element={
            <PrivateRoute allowedRole="COMPRADOR">
              <DashboardBuyer />
            </PrivateRoute>
          }
        />

        {/* Ruta Protegida para ORGANIZADOR */}
        <Route
          path="/dashboard-organizer"
          element={
            <PrivateRoute allowedRole="ORGANIZADOR">
              <DashboardOrganizer />
            </PrivateRoute>
          }
        />

        {/* Ruta Protegida: Panel Detalles del Evento (Organizador) */}
        <Route
          path="/detalles/:id"
          element={
            <PrivateRoute allowedRole="ORGANIZADOR">
              <DetalleEventoOrg />
            </PrivateRoute>
          }
        />

        {/* Ruta Protegida: Mapa para comprar boletos */}
        <Route
          path="/comprar/:eventoId/zona/:zonaId"
          element={
            <PrivateRoute allowedRole="COMPRADOR">
              <ComprarBoletos />
            </PrivateRoute>
          }
        />
        
        {/* Wizard para crear eventos */}
        <Route
          path="/crearevento"
          element={
            <PrivateRoute allowedRole="ORGANIZADOR">
              <CrearEvento />
            </PrivateRoute>
          }
        />

        {/* Ruta comodín (opcional): si escribe una URL que no existe, lo enviamos al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;



