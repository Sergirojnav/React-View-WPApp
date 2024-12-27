// LoadingScreen.js
import React from 'react';
import './Loading.css'; // Importa el archivo CSS para los estilos

const LoadingScreen = () => {
    return (
        <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
};

export default LoadingScreen;
