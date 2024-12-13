import React from 'react';

function MatchesList({ partidos }) {
    return (
        <div className="matches-container">
            <h1>Resultados de los Partidos</h1>
            <ul className="matches-list">
                {partidos.map(partido => (
                    <li key={partido.idPartido} className="match-item">
                        <div className="match-teams">
                            <span className="team-name">{partido.equipoLocal}</span>
                            <span className="match-score">{partido.resultadoLocal} - {partido.resultadoVisitante}</span>
                            <span className="team-name">{partido.equipoVisitante}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
    
}

export default MatchesList;
