import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import DashboardOrganizer from './pages/DashboardOrganizer';

function App() {
  return (
    <Router>
      <Routes>
        {/* Si el usuario entra a la raíz, lo enviamos al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas de nuestra aplicación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard-organizer" element={<DashboardOrganizer />} />

        {/* Ruta comodín (opcional): si escribe una URL que no existe, lo enviamos al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;



