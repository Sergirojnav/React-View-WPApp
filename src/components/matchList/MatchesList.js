import React, { useState, useEffect } from 'react';
import './MatchesList.css'; // Archivo CSS para estilos

function MatchesList({ partidos }) {
    const [actas, setActas] = useState([]);
    const [expandedMatch, setExpandedMatch] = useState(null); // Maneja el partido desplegado

    useEffect(() => {
        // Llamada para obtener las actas relacionadas con los partidos
        const fetchActas = async () => {
            try {
                const response = await fetch('http://localhost:8080/actas'); // Endpoint para obtener actas
                const data = await response.json();
                console.log('Actas obtenidas:', data); // Verifica que se obtienen las actas
                setActas(data);
            } catch (error) {
                console.error('Error al cargar las actas:', error);
            }
        };

        fetchActas();
    }, []);

    // Función para alternar la visibilidad del desplegable de un partido
    const toggleMatchDetails = (idPartido) => {
        setExpandedMatch(expandedMatch === idPartido ? null : idPartido);
    };

    return (
        <div className="matches-container">
            <h1>ALL MATCHES</h1>
            <div className="matches-grid">
                {partidos.map((partido) => (
                    <div
                        key={partido.idPartido}
                        className="match-card"
                        onClick={() => toggleMatchDetails(partido.idPartido)} // Al hacer clic, se despliega
                    >
                        <div className="match-teams">
                            <div className="team-section team-local">
                                <span className="team-name">{partido.equipoLocal}</span>
                            </div>
                            <div className="team-section match-score">
                                <span>{partido.resultadoLocal} - {partido.resultadoVisitante}</span>
                            </div>
                            <div className="team-section team-visitor">
                                <span className="team-name">{partido.equipoVisitante}</span>
                            </div>
                        </div>

                        {/* Desplegar detalles del partido solo si el partido está expandido */}
                        {expandedMatch === partido.idPartido && (
                            <div className="match-details">
                                <h3>Detalles del Partido</h3>
                                <ul>
                                    {/* Filtramos las actas que coinciden con el id del partido */}
                                    {actas
                                        .filter((acta) => acta.partido.id === partido.idPartido) // Asegúrate de que el id de partido coincida
                                        .map((acta) => (
                                            <li key={acta.idActa}>
                                                <p><strong>Goles:</strong> {acta.goles}</p>
                                                <p><strong>Expulsiones:</strong> {acta.expulsiones}</p>
                                                <p><strong>Jugador ID:</strong> {acta.jugador.id}</p>
                                                <p><strong>Jugador Nombre:</strong> {acta.jugador.nombre}</p>
                                            </li>
                                        ))}
                                    {/* Si no hay detalles, mostramos un mensaje */}
                                    {actas.filter((acta) => acta.partido.id === partido.idPartido).length === 0 && (
                                        <p>No details available for this match.</p>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MatchesList;
