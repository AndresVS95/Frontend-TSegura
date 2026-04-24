import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import DashboardOrganizer from './pages/DashboardOrganizer';
import DashboardBuyer from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import CrearEvento from './pages/CrearEvento';
import { ComprarBoletos } from './pages/ComprarBoletos';
import  CatalogoEventos  from './pages/CatalogoEventos';
import EventoDetalle from './components/EventoDetalle';
import PagoReserva from './pages/PagoReserva';
import ProcesandoPago from './components/ProcesandoPago'; 
import ResultadoPago from './components/ResultadoPago';
import MisBoletos from './pages/MisBoletos';

function App() {
  return (
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
        <Route path="*" element={<Navigate to="/login" replace />} 
        />

        {/* Ruta para ver detalles de un evento específico */}
       <Route path="/evento/:id" element={<EventoDetalle />}
        />
        {/* Ruta para el proceso de pago después de seleccionar boletos */}
        <Route path="/pago/:reservaId" element={<PagoReserva />}
        />  

         {/* Rutas para el proceso de pago */}
        <Route path="/pago/procesando" element={<ProcesandoPago />} />
        <Route path="/pago/resultado" element={<ResultadoPago />} />  

        {/*Rutas para mis boletos*/}
        <Route path="/my-tickets" element={<MisBoletos />} />
      </Routes>
    </Router>
  );
}

export default App;



