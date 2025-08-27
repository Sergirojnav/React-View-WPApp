import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Crear contexto
export const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  // Recuperar token de localStorage cuando la app carga
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Obtener nombre de usuario del token decodificado
  const getUsernameFromToken = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.sub;  // El nombre de usuario está en 'sub'
    }
    return null;
  };

  // Obtener el rol del usuario (en este caso, basado en 'sub')
  const getRoleFromToken = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.sub;  // Usamos 'sub' como rol (en este caso, 'admin')
    }
    return null;
  };

  // Login con API de Spring Boot
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://16.170.214.129:8080/api/auth/login', {
        username,
        password,
      });

      if (response.data && response.data.token) {
        setIsAuthenticated(true);
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);  // Guardar token en localStorage
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
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token, getUsernameFromToken, getRoleFromToken }}>
      {children}
    </AuthContext.Provider>
  );
};
