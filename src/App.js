import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/home/Home';
import Navbar from './components/navbar/Navbar';
import MatchForm from './components/MatchForm/MatchForm';
import UploadExcel from './components/UploadExcel';
import MatchPage from './components/MatchPage';
import Login from './components/login/login'; // Página de login
import PrivateRoute from './components/PrivateRoute'; // Rutas protegidas
import { AuthProvider } from './context/AuthContext'; // Contexto de autenticación
import './assets/styles.css'; // Estilos globales
import '@fontsource/montserrat';
import '@fontsource/montserrat/700.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta para Login */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/match-form" element={<MatchForm />} />
                  <Route path="/upload-excel" element={<UploadExcel />} />
                  <Route path="/all-matches" element={<MatchPage />} />
                </Routes>
              </PrivateRoute>
            }
          />
          {/* Si el usuario intenta acceder a una ruta desconocida */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
