// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, getRoleFromToken } = useAuth();

  // Si no está autenticado o no tiene el rol adecuado, redirige al login
  if (!isAuthenticated || getRoleFromToken() !== requiredRole) {
    return <Navigate to="/home" replace />;
  }

  // Si está autenticado y tiene el rol adecuado, muestra los hijos (el componente)
  return children;
};

export default ProtectedRoute;
