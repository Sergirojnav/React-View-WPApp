import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Para obtener los parámetros de la URL
import './TeamsDetails.css'; // Opcional: estilos para esta página

const TeamDetails = () => {
  const { teamId } = useParams(); // Obtenemos el ID del equipo desde la URL
  const [team, setTeam] = useState(null); // Guardamos los detalles del equipo

  useEffect(() => {
    // Llamada para obtener los detalles del equipo
    const fetchTeam = async () => {
      try {
        const response = await fetch(`http://localhost:8080/equipos/${teamId}`); // Endpoint para obtener detalles
        const data = await response.json();
        setTeam(data);
      } catch (error) {
        console.error("Error al cargar los detalles del equipo:", error);
      }
    };

    fetchTeam();
  }, [teamId]); // Dependencia en teamId para recargar si cambia

  return (
    <div className="team-details">
      {team ? (
        <>
          <h1>{team.nombre}</h1>
          <img
            src={`data:image/png;base64,${team.imgEquipo}`}
            alt={`${team.nombre} logo`}
            className="team-logo"
          />
        </>
      ) : (
        <p>Cargando detalles del equipo...</p>
      )}
    </div>
  );
};

export default TeamDetails;
