import React, { useEffect, useState } from 'react';
import './Home.css';
import TeamCarousel from '../home/teams/TeamsCarousel';
import axios from 'axios';

const Home = () => {
  const [quickStats, setQuickStats] = useState({
    mostWins: "No data",
    topScorer: "No data",
    leastGoals: "No data",
    totalMatches: "0"
  });

useEffect(() => {
  const fetchTopScorer = async () => {
    try {
      const response = await axios.get('http://16.170.214.129:8080/jugadores/top-scorers');
      if (response.data && response.data.length > 0) {
        const topPlayer = response.data[0]; // Primer jugador = máximo goleador
        setQuickStats(prev => ({
          ...prev,
          topScorer: `${topPlayer.jugadorNombre} (#${topPlayer.numeroGorro}) - ${topPlayer.totalGoles} goles`
        }));
      }
    } catch (error) {
      console.error('Error fetching top scorer data', error);
    }
  };

  fetchTopScorer();


  // Opcional: refrescar cada X segundos
  const interval = setInterval(fetchTopScorer, 60000); // cada 1 minuto
  return () => clearInterval(interval);

}, []);

useEffect(() => {
  const fetchMostWins = async () => {
    try {
      const response = await axios.get('http://16.170.214.129:8080/partidos/most-wins');
      if (response.data) {
        setQuickStats(prev => ({
          ...prev,
          mostWins: `${response.data.equipo} - ${response.data.victorias} wins`
        }));
      }
    } catch (error) {
      console.error('Error fetching most wins team', error);
    }
  };

  fetchMostWins();
  const interval = setInterval(fetchMostWins, 60000); // refrescar cada minuto
  return () => clearInterval(interval);
}, []);


useEffect(() => {
  const fetchTotalMatches = async () => {
    try {
      const response = await axios.get('http://16.170.214.129:8080/partidos/count');
      if (response.data) {
        setQuickStats(prev => ({
          ...prev,
          totalMatches: response.data.totalMatches
        }));
      }
    } catch (error) {
      console.error('Error fetching total matches', error);
    }
  };

  fetchTotalMatches();

  // Refrescar cada minuto
  const interval = setInterval(fetchTotalMatches, 60000);
  return () => clearInterval(interval);

}, []);

// Least goals conceded
  useEffect(() => {
    const fetchLeastGoals = async () => {
      try {
        const response = await axios.get('http://16.170.214.129:8080/partidos/menos-goleado');
        if (response.data) {
          const { equipo, golesRecibidos } = response.data;
          setQuickStats(prev => ({
            ...prev,
            leastGoals: `${equipo.nombre} - ${golesRecibidos} goals conceded`
          }));
        }
      } catch (error) {
        console.error('Error fetching least goals conceded', error);
      }
    };

    fetchLeastGoals();
    const interval = setInterval(fetchLeastGoals, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      <div className="layout">
        {/* Columna izquierda: calendario y carousel */}
        <div className="left-column">
          <div className="calendar-box">
            <h2>CALENDAR</h2>
            <div className="mini-calendar">
              <p>AUGUST 2025</p>
              <div className="days-grid">
                {Array.from({ length: 31 }, (_, i) => (
                  <div 
                    key={i+1} 
                    className={`day ${[28,29,30,31].includes(i+1) ? "highlight" : ""}`}
                  >
                    {i+1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="carousel-section">
            <TeamCarousel />
          </div>
        </div>

        {/* Columna derecha: estadísticas */}
        <div className="stats-box">
          <h2>QUICK STATISTICS</h2>
          <div className="stat-card">
            <span>MOST WINS</span>
            <strong>{quickStats.mostWins}</strong>
          </div>
          <div className="stat-card">
            <span>TOP SCORER</span>
            <strong>{quickStats.topScorer}</strong>
          </div>
          <div className="stat-card">
            <span>LEAST GOALS CONCEDED</span>
            <strong>{quickStats.leastGoals}</strong>
          </div>
          <div className="stat-card total">
            <span>TOTAL MATCHES</span>
            <strong>{quickStats.totalMatches}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
