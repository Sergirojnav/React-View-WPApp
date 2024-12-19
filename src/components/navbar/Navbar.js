import React from 'react';
import { Link } from 'react-router-dom';
import { faForward, faHome, faVolleyball, faFile, faUpload, faSliders } from '@fortawesome/free-solid-svg-icons';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import './Navbar.css'; // Asegúrate de que este archivo CSS esté creado e incluya los estilos
import logo from "../../assets/images/bwmf.png";
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, getUsernameFromToken } = useAuth(); // Usamos el hook para obtener el nombre de usuario
    const username = getUsernameFromToken() || 'Usuario'; // Si no hay token, mostramos 'Usuario'
    return (
        <div className="navbar">
            <img src={logo} alt="Logo" className="navbar-logo" />
            <ul className="navbar-menu">
            <li>
                    <Link to="/">
                        <span className="icon-container">
                            <FontAwesomeIcon icon={faHome} className="home-icon" />
                        </span>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/match-form">
                        <span className="icon-container">
                            <FontAwesomeIcon icon={faFile} className="home-icon" />
                        </span>
                        Match Form
                    </Link>
                </li>
                <li>
                    <Link to="/upload-excel">
                        <span className="icon-container">
                            <FontAwesomeIcon icon={faUpload} className="home-icon" />
                        </span>
                        Upload
                    </Link>
                </li>
                <li>
                    <Link to="/all-matches">
                        <span className="icon-container">
                            <FontAwesomeIcon icon={faVolleyball} className="home-icon" />
                        </span>
                        All Matches
                    </Link>
                </li>
                <li>
                    <Link to="/">
                        <span className="icon-container">
                            <FontAwesomeIcon icon={faSliders} className="home-icon" />
                        </span>
                        Options
                    </Link>
                </li>
            </ul>
            <div className="navbar-user">
                <span className="user-icon">👤</span> 
                {isAuthenticated && (
                <div className="sidebar-user">
                    <span>{username}</span>
                </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
