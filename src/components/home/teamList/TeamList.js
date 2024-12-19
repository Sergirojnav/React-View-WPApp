import React, { useEffect, useState } from 'react';
import { getPartidos } from '../../../services/partidoService';
import { useNavigate } from 'react-router-dom';

const MatchPage = () => {
    const [partidos, setPartidos] = useState([]);
    const navigate = useNavigate(); // Hook para manejar la navegación

    // Función para actualizar los partidos, manteniendo siempre los 3 últimos
    const updateMatches = (newMatches) => {
        setPartidos(prevPartidos => {
            // Agregar nuevos partidos a la lista existente
            const allMatches = [...prevPartidos, ...newMatches];

            // Mantener solo los 3 más recientes (los últimos 3)
            const lastThreeMatches = allMatches.slice(-3);

            return lastThreeMatches;
        });
    };

    useEffect(() => {
        const fetchPartidos = async () => {
            const data = await getPartidos();
            updateMatches(data); // Actualiza con los partidos obtenidos
        };
        fetchPartidos();
    }, []); // Solo se ejecuta al montar el componente

    // Simular la llegada de un nuevo partido cada 5 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            getPartidos().then(data => {
                updateMatches(data); // Actualiza con los partidos obtenidos cada vez
            });
        }, 5000); // Cada 5 segundos
        return () => clearInterval(interval); // Limpiar el intervalo cuando se desmonte el componente
    }, []);

    return (
        <div className="dashboard-card">
            <h2>Played Matches</h2>
            {partidos.length > 0 ? (
                <div className="scorer-list">
                    {partidos.map((partido) => (
                        <div key={partido.idPartido} className="team-card">
                            <div className="team-card-content">
                                <span>{partido.equipoLocal}</span>
                                <span className="match-score">{partido.resultadoLocal} - {partido.resultadoVisitante}</span>
                                <span>{partido.equipoVisitante}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No matches available...</p>
            )}
            {/* Botón para redirigir a la página "All Matches" */}
            <button className="view-more-button" onClick={() => navigate('/all-matches')}>
                View More
            </button>
        </div>
    );
};

export default MatchPage;
