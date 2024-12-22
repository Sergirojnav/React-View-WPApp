import React, { useEffect, useState } from 'react';
import './Home.css';
import TeamCarousel from '../home/teams/TeamsCarousel'; // Asegúrate de importar el componente del carousel
import axios from 'axios'; // Necesitamos axios para hacer solicitudes HTTP

const Home = () => {
  const [partidos27, setPartidos27] = useState([]);
  const [partidos28, setPartidos28] = useState([]);
  const [partidos29, setPartidos29] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null); // Estado para saber cuál card está expandida

  // Obtener los partidos del backend para las fechas 27, 28 y 29 de diciembre
  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        // Obtener partidos del 27-12-2024
        const response27 = await axios.get('http://localhost:8080/partidos/por-fecha?fecha=2024-12-27');
        setPartidos27(response27.data);

        // Obtener partidos del 28-12-2024
        const response28 = await axios.get('http://localhost:8080/partidos/por-fecha?fecha=2024-12-28');
        setPartidos28(response28.data);

        // Obtener partidos del 29-12-2024
        const response29 = await axios.get('http://localhost:8080/partidos/por-fecha?fecha=2024-12-29');
        setPartidos29(response29.data);
      } catch (error) {
        console.error('Error fetching partidos:', error);
      }
    };

    fetchPartidos();
  }, []);

  // Función para manejar la expansión de la card
  const handleCardToggle = (date) => {
    setExpandedCard(expandedCard === date ? null : date); // Si la misma card se hace clic, colapsarla
  };

  // Función para formatear la hora eliminando los segundos y evitando la adición de una hora extra
  const formatHora = (hora) => {
    if (hora) {
      // Hora esperada en formato HH:mm:ss (por ejemplo, "14:30:00")
      const [hours, minutes] = hora.split(':'); // Dividir la hora en horas y minutos
      return `${hours}:${minutes}`; // Regresar el formato correcto de HH:mm
    }
    return ''; // Si no hay hora, devolver una cadena vacía
  };

  // Función para agrupar los partidos por hora
  const agruparPorHora = (partidos) => {
    return partidos.reduce((acc, partido) => {
      const hora = formatHora(partido.hora); // Obtener la hora formateada
      if (!acc[hora]) {
        acc[hora] = []; // Si no existe, inicializar el array para esa hora
      }
      acc[hora].push(partido); // Agregar el partido a la hora correspondiente
      return acc;
    }, {});
  };

  const partidosAgrupados27 = agruparPorHora(partidos27);
  const partidosAgrupados28 = agruparPorHora(partidos28);
  const partidosAgrupados29 = agruparPorHora(partidos29);

  return (
    <div className="home-container">
      <div className="card-container">
        <h2>MATCHES</h2>
        {/* Card para el 27 de diciembre */}
        <div className="card" onClick={() => handleCardToggle('2024-12-27')}>
          <p>27th DECEMBER 2024</p>
          {expandedCard === '2024-12-27' && (
            <div className="partidos-details">
              {Object.keys(partidosAgrupados27).map((hora) => (
                <div key={hora}>
                  <div className="hora">{hora}</div> {/* Solo muestra la hora una vez */}
                  {partidosAgrupados27[hora].map((partido) => (
                    <div key={partido.id} className="partido-item">
                      <div className="partido-info">
                        <span>{partido.equipoLocal.nombre}</span>
                        <span> - </span>
                        <span>{partido.equipoVisitante.nombre}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card para el 28 de diciembre */}
        <div className="card" onClick={() => handleCardToggle('2024-12-28')}>
          <p>28th DECEMBER 2024</p>
          {expandedCard === '2024-12-28' && (
            <div className="partidos-details">
              {Object.keys(partidosAgrupados28).map((hora) => (
                <div key={hora}>
                  <div className="hora">{hora}</div> {/* Solo muestra la hora una vez */}
                  {partidosAgrupados28[hora].map((partido) => (
                    <div key={partido.id} className="partido-item">
                      <div className="partido-info">
                        <span>{partido.equipoLocal.nombre}</span>
                        <span> - </span>
                        <span>{partido.equipoVisitante.nombre}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card para el 29 de diciembre */}
        <div className="card" onClick={() => handleCardToggle('2024-12-29')}>
          <p>29th DECEMBER 2024</p>
          {expandedCard === '2024-12-29' && (
            <div className="partidos-details">
              {Object.keys(partidosAgrupados29).map((hora) => (
                <div key={hora}>
                  <div className="hora">{hora}</div> {/* Solo muestra la hora una vez */}
                  {partidosAgrupados29[hora].map((partido) => (
                    <div key={partido.id} className="partido-item">
                      <div className="partido-info">
                        <span>{partido.equipoLocal.nombre}</span>
                        <span> - </span>
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

      {/* Aquí se inserta el carousel de equipos debajo de las tarjetas */}
      <div className="carousel-section">
        <TeamCarousel /> {/* El componente que contiene el carousel */}
      </div>
    </div>
  );
};

export default Home;
