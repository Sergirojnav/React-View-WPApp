import React, { useEffect, useState } from 'react';

const Teams = () => {
    const [teams, setTeams] = useState([]); // Guardará los equipos de la base de datos

    useEffect(() => {
        // Llamada al endpoint para obtener los equipos
        const fetchTeams = async () => {
            try {
                const response = await fetch('http://localhost:8080/equipos'); // Endpoint para obtener equipos
                const data = await response.json();
                setTeams(data);
            } catch (error) {
                console.error("Error al cargar los equipos:", error);
            }
        };

        fetchTeams();
    }, []);

    // Alternar visibilidad de los jugadores
    const togglePlayers = (teamId) => {
        const teamPlayersList = document.getElementById(`team-${teamId}`);
        teamPlayersList.style.display = teamPlayersList.style.display === 'block' ? 'none' : 'block';
    };

    return (
        <div className="dashboard-section-list">
            <h2>Teams</h2>
            <div className="teams-list">
                {teams.map((team) => (
                    <div key={team.id} className="team-card">
                        <div className="team-card-header" onClick={() => togglePlayers(team.id)}>
                            {/* Mostrar la imagen del equipo desde el campo imgEquipo */}
                            {team.imgEquipo && (
                                <img
                                    src={`data:image/png;base64,${team.imgEquipo}`}
                                    alt={`${team.nombre} logo`}
                                    className="team-logo"
                                />
                            )}
                            <h3 className="team-name">{team.nombre}</h3>
                        </div>
                        <div className="team-players-list" id={`team-${team.id}`} style={{ display: 'none' }}>
                            {team.jugadores.map((player, index) => (
                                <p key={index} className="player-name">{player.nombre}</p>
                            ))}
                        </div>
                    </div> 
                ))}
            </div>
        </div>
    );
};

export default Teams;
