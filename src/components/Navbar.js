import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faForward, faHome, faVolleyball, faFile, faUpload, faSliders } from '@fortawesome/free-solid-svg-icons';  
import '../assets/styles.css';  
import bwmfLogo from '../assets/images/bwmf.png';

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <img src={bwmfLogo} alt="BWFM Logo" className="sidebar-logo" />
            </div>
            <ul className="sidebar-links">
                <li>
                    <Link to="/">
                        <span className="icon-container">
                            <FontAwesomeIcon icon={faHome} className="home-icon" /> {/* Añadir clase aquí */}
                        </span>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/match-form">
                        <span className="icon-container">
                            <FontAwesomeIcon icon={faFile} className="home-icon" /> {/* Añadir clase aquí */}
                        </span>
                    Match Form
                    </Link>
                </li>
                <li>
                    <Link to="/upload-excel">
                        <span className="icon-container">
                            <FontAwesomeIcon icon={faUpload} className="home-icon" /> {/* Añadir clase aquí */}
                        </span>
                    Upload
                    </Link>
                </li>
                <li>
                    <Link to="/all-matches">
                        <span className="icon-container">
                            <FontAwesomeIcon icon={faVolleyball} className="home-icon" /> {/* Añadir clase aquí */}
                        </span>
                    All Matches
                    </Link>
                </li>
                <li>
                    <Link to="/next-matches">
                    <span className="icon-container">
                            <FontAwesomeIcon icon={faForward} className="home-icon" /> {/* Añadir clase aquí */}
                        </span>
                    Next Matches
                    </Link>
                </li>
                <li>
                    <Link to="/">
                    <span className="icon-container">
                            <FontAwesomeIcon icon={faSliders} className="home-icon" /> {/* Añadir clase aquí */}
                        </span>
                    Options
                    </Link>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
