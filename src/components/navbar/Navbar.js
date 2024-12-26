import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { faHome, faVolleyball, faFile, faUpload, faSliders, faChartSimple, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Navbar.css';
import logo from "../../assets/images/bwmf.png";
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, getUsernameFromToken, getRoleFromToken, logout } = useAuth(); // Accedemos a los valores del contexto
  const username = getUsernameFromToken() || 'Usuario';
  const role = getRoleFromToken();  // Obtenemos el rol del usuario
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // Nuevo estado para el desplegable
  const location = useLocation();

  // Función para manejar el logout
  const handleLogout = () => {
    logout();  // Llama al método logout del contexto
  };

  // Función para abrir o cerrar el desplegable
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <button className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>
        <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              <FontAwesomeIcon icon={faHome} /> HOME
            </Link>
          </li>
          <li>
            <Link to="/match-form" className={location.pathname === '/match-form' ? 'active' : ''}>
              <FontAwesomeIcon icon={faFile} /> MATCH REPORT
            </Link>
          </li>
          <li>
            <Link to="/all-matches" className={location.pathname === '/all-matches' ? 'active' : ''}>
              <FontAwesomeIcon icon={faVolleyball} /> ALL MATCHES
            </Link>
          </li>
          <li>
            <Link to="/stats" className={location.pathname === '/stats' ? 'active' : ''}>
              <FontAwesomeIcon icon={faChartSimple} /> STATICS
            </Link>
          </li>
          {/* Mostrar solo el enlace de UPLOAD si el usuario es admin */}
          {role === 'admin' && (
            <li>
              <Link to="/upload" className={location.pathname === '/upload' ? 'active' : ''}>
                <FontAwesomeIcon icon={faSliders} /> ADMIN OPTIONS
              </Link>
            </li>
          )}
        </ul>

        {/* Menú de usuario con desplegable */}
        <div className="navbar-user">
          <span className="user-icon" onClick={toggleDropdown}>👤 {username}</span>
          
          {/* Desplegable */}
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={handleLogout} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} /> LOGOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
