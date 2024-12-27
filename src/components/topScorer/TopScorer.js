import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopScorer = () => {
  const [topScorers, setTopScorers] = useState([]);

  useEffect(() => {
    const fetchTopScorers = async () => {
      try {
        const response = await axios.get('http://192.168.1.54:8080/jugadores/top-scorers');
        console.log('API Top Scorers:', response.data);
        setTopScorers(response.data);
      } catch (error) {
        console.error('Error fetching top scorer data', error);
      }
    };

    fetchTopScorers();
  }, []);

  // Mostrar en pantalla solo los primeros 15
  const topFifteenScorers = topScorers.slice(0, 15);

  // Al hacer click en "Ver todo el listado", abrir otra ventana con hasta 30
  const openAllScorers = () => {
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <html>
        <head>
          <title>Listado Completo de Goleadores</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              margin: 0;
              background-color: #f0f8ff; /* Azul muy claro */
            }

            h1 {
              color: #005f9e; /* Azul intermedio */
              text-align: center;
              margin-bottom: 20px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              background-color: rgba(255, 255, 255, 0.7); /* Blanco con transparencia */
              border-radius: 10px; /* Bordes redondeados */
              overflow: hidden; /* Para que los bordes redondeados afecten a las celdas */
            }

            thead {
              background-color: #e6f2fa; /* Azul clarito */
            }

            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              color: #005f9e; /* Texto azul */
            }

            th {
              background-color: #e6f2fa; /* Azul clarito */
              color: #005f9e; /* Texto azul */
            }

            tr:nth-child(even) {
              background-color: rgba(255, 255, 255, 0.5);
            }
          </style>
        </head>
        <body>
          <h1>LISTADO COMPLETO DE GOLEADORES</h1>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Jugador</th>
                <th>Equipo</th>
                <th>Goles</th>
                <th>Partidos</th>
                <th>Expulsiones</th>
              </tr>
            </thead>
            <tbody>
    `);

    // hasta 30
    const topThirtyScorers = topScorers.slice(0, 30);
    topThirtyScorers.forEach((scorer, index) => {
      newWindow.document.write(`
        <tr>
          <td>${index + 1}</td>
          <td>${scorer.jugadorNombre}</td>
          <td>${scorer.equipoNombre}</td>
          <td>${scorer.totalGoles}</td>
          <td>${scorer.partidosJugados}</td>
          <td>${scorer.totalExpulsiones}</td>
        </tr>
      `);
    });

    newWindow.document.write(`
            </tbody>
          </table>
        </body>
      </html>
    `);

    newWindow.document.close();
  };

  return (
    <div
      className="dashboard-card"
      style={{
        padding: '20px',
        textAlign: 'center'
     
      }}
    >
      <h2 style={{ textTransform: 'uppercase', color: '#ffffff' }}>
        Top Scorers
      </h2>

      {topScorers.length === 0 ? (
        <p style={{ color: '#005f9e' }}>No hay jugadores disponibles...</p>
      ) : (
        <>
          {/* Tabla con los primeros 15 */}
          <table
            className="top-scorers-table"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              margin: '0 auto',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <thead
              style={{
                backgroundColor: '#e6f2fa',
              }}
            >
              <tr>
                <th style={{ padding: '8px', border: '1px solid #ddd', color: '#005f9e' }}>
                  Rank
                </th>
                <th style={{ padding: '8px', border: '1px solid #ddd', color: '#005f9e' }}>
                  Jugador
                </th>
                <th style={{ padding: '8px', border: '1px solid #ddd', color: '#005f9e' }}>
                  Equipo
                </th>
                <th style={{ padding: '8px', border: '1px solid #ddd', color: '#005f9e' }}>
                  Goles
                </th>
                <th style={{ padding: '8px', border: '1px solid #ddd', color: '#005f9e' }}>
                  Partidos
                </th>
                <th style={{ padding: '8px', border: '1px solid #ddd', color: '#005f9e' }}>
                  Expulsiones
                </th>
              </tr>
            </thead>
            <tbody>
              {topFifteenScorers.map((scorer, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px', color: '#005f9e' }}>
                    {index + 1}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', color: '#005f9e' }}>
                    {scorer.jugadorNombre}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', color: '#005f9e' }}>
                    {scorer.equipoNombre}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', color: '#005f9e' }}>
                    {scorer.totalGoles}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', color: '#005f9e' }}>
                    {scorer.partidosJugados}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', color: '#005f9e' }}>
                    {scorer.totalExpulsiones}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Si hay más de 15, botón para verlos todos en otra pestaña */}
          {topScorers.length > 15 && (
            <button
              className="view-more-button"
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#005f9e',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              onClick={openAllScorers}
            >
              VER TODO EL LISTADO
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default TopScorer;