import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { faForward, faHome, faVolleyball, faFile, faUpload, faSliders } from '@fortawesome/free-solid-svg-icons';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import './Navbar.css'; // Archivo CSS para estilos
import logo from "../../assets/images/bwmf.png";
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, getUsernameFromToken } = useAuth(); // Hook para autentificación
    const username = getUsernameFromToken() || 'Usuario'; // Valor predeterminado
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para manejar el colapso

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <img src={logo} alt="Logo" className="navbar-logo" />
                <button className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    ☰
                </button>
                <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
                    <li>
                        <Link to="/">
                            <FontAwesomeIcon icon={faHome} /> Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/match-form">
                            <FontAwesomeIcon icon={faFile} /> Match Form
                        </Link>
                    </li>
                    <li>
                        <Link to="/upload-excel">
                            <FontAwesomeIcon icon={faUpload} /> Upload
                        </Link>
                    </li>
                    <li>
                        <Link to="/all-matches">
                            <FontAwesomeIcon icon={faVolleyball} /> All Matches
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <FontAwesomeIcon icon={faSliders} /> Options
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
