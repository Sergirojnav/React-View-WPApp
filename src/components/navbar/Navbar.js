import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importa useLocation
import { faForward, faHome, faVolleyball, faFile, faUpload, faSliders, faChartSimple} from '@fortawesome/free-solid-svg-icons';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import './Navbar.css'; // Archivo CSS para estilos
import logo from "../../assets/images/bwmf.png";
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, getUsernameFromToken } = useAuth(); // Hook para autentificación
    const username = getUsernameFromToken() || 'Usuario'; // Valor predeterminado
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para manejar el colapso

    const location = useLocation(); // Obtener la ubicación actual

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
                        <Link to="/match-form" className={location.pathname === '/match-form' ? 'active' : ''}>
                            <FontAwesomeIcon icon={faChartSimple} /> STATICS
                        </Link>
                    </li>
                    <li>
                        <Link to="/upload-excel" className={location.pathname === '/upload-excel' ? 'active' : ''}>
                            <FontAwesomeIcon icon={faUpload} /> UPLOAD
                        </Link>
                    </li>
                    <li>
                        <Link to="/options" className={location.pathname === '/options' ? 'active' : ''}>
                            <FontAwesomeIcon icon={faSliders} /> OPTIONS
                        </Link>
                    </li>
                </ul>
                <div className="navbar-user">
                    <span className="user-icon">👤</span>
                    {isAuthenticated && <span>{username}</span>}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
