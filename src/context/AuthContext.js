import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  // Cambia a la exportación correcta

// Crear contexto
export const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  // Obtener nombre de usuario del token decodificado
  const getUsernameFromToken = () => {
    if (token) {
      const decodedToken = jwtDecode(token); // Usamos jwtDecode
      return decodedToken.sub; // Asumiendo que el nombre de usuario está en el 'sub' (sujeto) del token
    }
    return null;
  };

  // Login con API de Spring Boot
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password,
      });

      // Verificar si la API devuelve un token
      if (response.data && response.data.token) {
        setIsAuthenticated(true);
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token); // Guardar token en localStorage
        return true;
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
    }
    return false;
  };

  // Logout
  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token, getUsernameFromToken }}>
      {children}
    </AuthContext.Provider>
  );
};
