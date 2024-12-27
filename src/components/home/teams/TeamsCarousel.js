import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Reemplazamos useHistory por useNavigate
import './TeamsCarousel.css';
import nextPrevImage from '../../../assets/images/next-prev.png';

const TeamCarousel = () => {
  const [teams, setTeams] = useState([]); // Guardará los equipos de la base de datos
  const [activeIndex, setActiveIndex] = useState(0); // Indica cuál es el equipo central
  const navigate = useNavigate(); // Inicializamos useNavigate

  useEffect(() => {
    // Llamada al endpoint para obtener los equipos
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://192.168.1.54:8080/equipos'); // Endpoint para obtener equipos
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error al cargar los equipos:", error);
      }
    };

    fetchTeams();
  }, []);

  // Función para pasar al siguiente equipo (cíclico)
  const nextTeam = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % teams.length);
  };

  // Función para retroceder al equipo anterior (cíclico)
  const prevTeam = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + teams.length) % teams.length);
  };

  // Función para manejar el clic en un equipo
  const handleTeamClick = (teamId) => {
    navigate(`/team/${teamId}`); // Redirigir a la página del equipo
  };

  return (
    <div className="carousel-container">
      {teams.length > 0 && (
        <div className="carousel">
          {/* Mostrar solo tres equipos visibles con desplazamiento circular */}
          {[...Array(3)].map((_, idx) => {
            const teamIndex = (activeIndex + idx) % teams.length;
            const isActive = idx === 1; // El equipo central
            const isPrev = idx === 0; // El equipo de la izquierda
            const isNext = idx === 2; // El equipo de la derecha

            return (
              <div
                key={teams[teamIndex].id}
                className={`carousel-item ${isActive ? 'active' : ''} ${isPrev || isNext ? 'side' : ''}`}
                onClick={() => handleTeamClick(teams[teamIndex].id)} // Redirigir al hacer clic
              >
                <div className="team-logo-container">
                  {/* Mostrar solo el escudo de los equipos */}
                  {teams[teamIndex].imgEquipo && (
                    <img
                      src={`data:image/png;base64,${teams[teamIndex].imgEquipo}`}
                      alt={`${teams[teamIndex].nombre} logo`}
                      className="team-logo"
                    />
                  )}
                </div>
                {/* Nombre del equipo solo visible en el del centro */}
                {isActive && <h3 className="team-name">{teams[teamIndex].nombre}</h3>}
              </div>
            );
          })}
        </div>
      )}
      {/* Botones con las flechas de imagen para cambiar de equipo */}
      <button className="carousel-prev" onClick={prevTeam}>
        <img src={nextPrevImage} alt="Previous" className="carousel-arrow" />
      </button>
      <button className="carousel-next" onClick={nextTeam}>
        <img src={nextPrevImage} alt="Next" className="carousel-arrow" />
      </button>
    </div>
  );
};

export default TeamCarousel;
