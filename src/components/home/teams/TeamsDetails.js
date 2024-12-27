import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './TeamsDetails.css'; // Archivo CSS único para este componente

const TeamDetails = () => {
  const { teamId } = useParams(); // Obtenemos el ID del equipo desde la URL
  const [team, setTeam] = useState(null); // Guardamos los detalles del equipo
  const [loading, setLoading] = useState(true); // Indicador de carga

  useEffect(() => {
    // Llamada para obtener los detalles del equipo
    const fetchTeam = async () => {
      try {
        const response = await fetch(`http://localhost:8080/equipos/${teamId}`);
        const data = await response.json();
        setTeam(data);
      } catch (error) {
        console.error('Error al cargar los detalles del equipo:', error);
      } finally {
        setLoading(false); // Detenemos la animación de carga
      }
    };

    fetchTeam();
  }, [teamId]);

  if (loading) {
    return <div className="team-details-loading">Cargando detalles del equipo...</div>;
  }

  if (!team) {
    return <div className="team-details-error">No se pudieron cargar los detalles del equipo.</div>;
  }

  return (
    <div className="team-details-container">
      {/* Imagen del equipo */}
      <div className="team-details-header">
        <img
          src={`data:image/png;base64,${team.imgEquipo}`}
          alt="Logo del equipo"
          className="team-details-logo"
        />
        <h1 className="team-details-name">{team.nombre}</h1>
      </div>

      {/* Nombre del Entrenador y Jugadores */}
      <div className="team-details-body">
        {/* Entrenador */}
        <div className="team-details-coach">
          <h2>Entrenador</h2>
          {team.entrenadores && team.entrenadores.length > 0 ? (
            <p>{team.entrenadores[0].nombre}</p>
          ) : (
            <p>No hay entrenador disponible.</p>
          )}
        </div>

        {/* Jugadores */}
        <div className="team-details-players">
          <h2>Jugadores</h2>
          <ul className="team-details-players-list">
            {team.jugadores && team.jugadores.length > 0 ? (
              team.jugadores.map((jugador) => (
                <li key={jugador.id} className="team-details-player-item">
                  {jugador.nombre}
                </li>
              ))
            ) : (
              <p>No hay jugadores disponibles.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
