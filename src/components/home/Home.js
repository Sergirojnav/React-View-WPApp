import React, { useEffect, useState } from 'react';
import './Home.css';
import TeamCarousel from '../home/teams/TeamsCarousel';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Home = () => {
  const [partidos27, setPartidos27] = useState([]);
  const [partidos28, setPartidos28] = useState([]);
  const [partidos29, setPartidos29] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

  const navigate = useNavigate(); // Hook de navegación

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const response27 = await axios.get('http://192.168.1.54:8080/partidos/por-fecha?fecha=2024-12-27');
        setPartidos27(response27.data);

        const response28 = await axios.get('http://192.168.1.54:8080/partidos/por-fecha?fecha=2024-12-28');
        setPartidos28(response28.data);

        const response29 = await axios.get('http://192.168.1.54:8080/partidos/por-fecha?fecha=2024-12-29');
        setPartidos29(response29.data);
      } catch (error) {
        console.error('Error fetching partidos:', error);
      }
    };

    fetchPartidos();
  }, []);

  const handleCardToggle = (date) => {
    setExpandedCard(expandedCard === date ? null : date);
  };

  const formatHora = (hora) => {
    if (hora) {
      const [hours, minutes] = hora.split(':');
      return `${hours}:${minutes}`;
    }
    return '';
  };

  const agruparPorHora = (partidos) => {
    return partidos.reduce((acc, partido) => {
      const hora = formatHora(partido.hora);
      if (!acc[hora]) {
        acc[hora] = [];
      }
      acc[hora].push(partido);
      return acc;
    }, {});
  };

  const partidosAgrupados27 = agruparPorHora(partidos27);
  const partidosAgrupados28 = agruparPorHora(partidos28);
  const partidosAgrupados29 = agruparPorHora(partidos29);

  const handlePartidoClick = (equipoLocal, equipoVisitante) => {
    // Navegar a 'match-form' con los equipos seleccionados
    navigate('/match-form', {
      state: { equipoLocal, equipoVisitante } // Pasar los equipos como estado
    });
  };

  return (
    <div className="home-container">
      <div className="card-container">
        <h2>MATCHES</h2>
        <div className="card" onClick={() => handleCardToggle('2024-12-27')}>
          <p>27th DECEMBER 2024</p>
          {expandedCard === '2024-12-27' && (
            <div className="partidos-details">
              {Object.keys(partidosAgrupados27).map((hora) => (
                <div key={hora}>
                  <div className="hora">{hora}</div>
                  {partidosAgrupados27[hora].map((partido) => (
                    <div
                      key={partido.id}
                      className="partido-item"
                      onClick={() => handlePartidoClick(partido.equipoLocal, partido.equipoVisitante)} // Enviar equipos a MatchForm
                    >
                      <div className="partido-info">
                        <span>{partido.equipoLocal.nombre}</span>
                        {/* <span> - </span> */}
                        <span>{partido.equipoVisitante.nombre}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" onClick={() => handleCardToggle('2024-12-28')}>
          <p>28th DECEMBER 2024</p>
          {expandedCard === '2024-12-28' && (
            <div className="partidos-details">
              {Object.keys(partidosAgrupados28).map((hora) => (
                <div key={hora}>
                  <div className="hora">{hora}</div>
                  {partidosAgrupados28[hora].map((partido) => (
                    <div
                      key={partido.id}
                      className="partido-item"
                      onClick={() => handlePartidoClick(partido.equipoLocal, partido.equipoVisitante)} // Enviar equipos a MatchForm
                    >
                      <div className="partido-info">
                        <span>{partido.equipoLocal.nombre}</span>
                        {/* <span> - </span> */}
                        <span>{partido.equipoVisitante.nombre}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" onClick={() => handleCardToggle('2024-12-29')}>
          <p>29th DECEMBER 2024</p>
          {expandedCard === '2024-12-29' && (
            <div className="partidos-details">
              {Object.keys(partidosAgrupados29).map((hora) => (
                <div key={hora}>
                  <div className="hora">{hora}</div>
                  {partidosAgrupados29[hora].map((partido) => (
                    <div
                      key={partido.id}
                      className="partido-item"
                      onClick={() => handlePartidoClick(partido.equipoLocal, partido.equipoVisitante)} // Enviar equipos a MatchForm
                    >
                      <div className="partido-info">
                        <span>{partido.equipoLocal.nombre}</span>
                        {/* <span> - </span> */}
                        <span>{partido.equipoVisitante.nombre}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="carousel-section">
        <TeamCarousel />
      </div>
    </div>
  );
};

export default Home;
