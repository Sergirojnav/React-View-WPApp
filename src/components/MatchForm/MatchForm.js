import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MatchForm.css';

const MatchForm = () => {
  const [equipos, setEquipos] = useState([]);
  const [jugadoresLocal, setJugadoresLocal] = useState([]);
  const [jugadoresVisitante, setJugadoresVisitante] = useState([]);
  const [equipoLocal, setEquipoLocal] = useState('');
  const [equipoVisitante, setEquipoVisitante] = useState('');
  const [golesLocal, setGolesLocal] = useState({});
  const [expulsionesLocal, setExpulsionesLocal] = useState({});
  const [golesVisitante, setGolesVisitante] = useState({});
  const [expulsionesVisitante, setExpulsionesVisitante] = useState({});
  const [resultadoLocal, setResultadoLocal] = useState(0);
  const [resultadoVisitante, setResultadoVisitante] = useState(0);
  const [searchLocal, setSearchLocal] = useState('');
  const [searchVisitante, setSearchVisitante] = useState('');
  const [showDropdownLocal, setShowDropdownLocal] = useState(false);
  const [showDropdownVisitante, setShowDropdownVisitante] = useState(false);
  const [entrenadorLocal, setEntrenadorLocal] = useState(null);
  const [entrenadorVisitante, setEntrenadorVisitante] = useState(null);

  // Cargar equipos
  useEffect(() => {
    axios.get('http://16.170.214.129:8080/equipos')
      .then(res => setEquipos(res.data))
      .catch(err => console.error(err));
  }, []);

  // Cargar jugadores y coach
  useEffect(() => {
    if (equipoLocal) {
      axios.get(`http://16.170.214.129:8080/equipos/${equipoLocal}/jugadores`)
        .then(res => setJugadoresLocal(res.data))
        .catch(err => console.error(err));

      axios.get(`http://16.170.214.129:8080/equipos/${equipoLocal}/staff`)
        .then(res => setEntrenadorLocal(res.data.find(p => p.rol === 'coach') || null))
        .catch(err => console.error(err));
    } else {
      setJugadoresLocal([]);
      setEntrenadorLocal(null);
    }
  }, [equipoLocal]);

  useEffect(() => {
    if (equipoVisitante) {
      axios.get(`http://16.170.214.129:8080/equipos/${equipoVisitante}/jugadores`)
        .then(res => setJugadoresVisitante(res.data))
        .catch(err => console.error(err));

      axios.get(`http://16.170.214.129:8080/equipos/${equipoVisitante}/staff`)
        .then(res => setEntrenadorVisitante(res.data.find(p => p.rol === 'coach') || null))
        .catch(err => console.error(err));
    } else {
      setJugadoresVisitante([]);
      setEntrenadorVisitante(null);
    }
  }, [equipoVisitante]);

  // Manejar goles
  const handleGolesChange = (jugadorId, equipo, incremento) => {
    const update = equipo === 'local' ? { ...golesLocal } : { ...golesVisitante };
    update[jugadorId] = Math.max(0, (update[jugadorId] || 0) + incremento);

    if (equipo === 'local') {
      setGolesLocal(update);
      setResultadoLocal(Object.values(update).reduce((a, b) => a + b, 0));
    } else {
      setGolesVisitante(update);
      setResultadoVisitante(Object.values(update).reduce((a, b) => a + b, 0));
    }
  };

  // Manejar expulsiones
  const handleExpulsionesChange = (jugadorId, equipo, incremento) => {
    const update = equipo === 'local' ? { ...expulsionesLocal } : { ...expulsionesVisitante };
    const limit = 3;
    update[jugadorId] = Math.max(0, Math.min(limit, (update[jugadorId] || 0) + incremento));

    if (equipo === 'local') setExpulsionesLocal(update);
    else setExpulsionesVisitante(update);
  };

  // Manejar submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const fechaPartido = new Date().toISOString().split('T')[0];

    const matchData = {
      fecha: fechaPartido,
      equipoLocal: { id: equipoLocal },
      equipoVisitante: { id: equipoVisitante },
      resultadoLocal,
      resultadoVisitante,
      actas: [
        ...Object.keys(golesLocal).map(id => ({ jugador: { id }, goles: golesLocal[id], expulsiones: expulsionesLocal[id] || 0 })),
        ...Object.keys(golesVisitante).map(id => ({ jugador: { id }, goles: golesVisitante[id], expulsiones: expulsionesVisitante[id] || 0 }))
      ]
    };

    axios.post('http://16.170.214.129:8080/partidos/guardar', matchData)
      .then(() => alert('Partido guardado exitosamente'))
      .catch(err => console.error(err));
  };

  // Selección de equipo
  const handleSelectEquipo = (id, tipo) => {
    if (tipo === 'local') {
      setEquipoLocal(id);
      setSearchLocal('');
      setShowDropdownLocal(false);
    } else {
      setEquipoVisitante(id);
      setSearchVisitante('');
      setShowDropdownVisitante(false);
    }
  };

  const filteredEquiposLocal = equipos.filter(e => e.nombre.toLowerCase().includes(searchLocal.toLowerCase()));
  const filteredEquiposVisitante = equipos.filter(e => e.nombre.toLowerCase().includes(searchVisitante.toLowerCase()));

  return (
    <div className="match-form-container">

      <div className="equipos-container">

        {/* ======== Local ======== */}
        <div className="equipo-section">
          {!equipoLocal ? (
            <div className="dropdown-container">
              <p>LOCAL TEAM:</p>
              <input
                type="text"
                placeholder="Search team..."
                value={searchLocal}
                onClick={() => setShowDropdownLocal(!showDropdownLocal)}
                onChange={e => setSearchLocal(e.target.value)}
              />
              {showDropdownLocal && (
                <ul className="dropdown-list">
                  {filteredEquiposLocal.map(e => (
                    <li key={e.id} onClick={() => handleSelectEquipo(e.id, 'local')} className="dropdown-item">{e.nombre}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="selected-team">
              <h4>{equipos.find(e => e.id === equipoLocal)?.nombre}</h4>
              <button className="remove-button" onClick={() => setEquipoLocal('')}>X</button>
            </div>
          )}

          <div className="coach">
            <p>COACH</p>
            <p>{entrenadorLocal ? `${entrenadorLocal.nombre} ${entrenadorLocal.apellido}` : 'Not found'}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Exclusions</th>
                <th>Goals</th>
              </tr>
            </thead>
            <tbody>
              {jugadoresLocal.map(j => (
                <tr key={j.id} className={expulsionesLocal[j.id] >= 3 ? 'expulsiones-red' : expulsionesLocal[j.id] === 2 ? 'expulsiones-yellow' : ''}>
                  <td>{j.numeroGorro}</td>
                  <td>{j.nombre}</td>
                  <td>
                    <div className="counter-container">
                      <button className="counter-button" onClick={() => handleExpulsionesChange(j.id, 'local', -1)} disabled={expulsionesLocal[j.id] <= 0}>-</button>
                      <span className="counter-value">{expulsionesLocal[j.id] || 0}</span>
                      <button className="counter-button" onClick={() => handleExpulsionesChange(j.id, 'local', 1)} disabled={expulsionesLocal[j.id] >= 3}>+</button>
                    </div>
                  </td>
                  <td>
                    <div className="counter-container">
                      <button className="counter-button" onClick={() => handleGolesChange(j.id, 'local', -1)} disabled={golesLocal[j.id] <= 0}>-</button>
                      <span className="counter-value">{golesLocal[j.id] || 0}</span>
                      <button className="counter-button" onClick={() => handleGolesChange(j.id, 'local', 1)}>+</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ======== Marcador ======== */}
        <div className="resultados-container">
          <div className="resultado-section">
            <div className="marcador">
              <p>{resultadoLocal}</p>
              <span className="separador">-</span>
              <p>{resultadoVisitante}</p>
            </div>
          </div>
          <button className="download-button">DOWNLOAD</button>
          <button className="submit-button" onClick={handleSubmit}>SAVE</button>
        </div>

        {/* ======== Visitante ======== */}
        <div className="equipo-section">
          {!equipoVisitante ? (
            <div className="dropdown-container">
              <p>AWAY TEAM:</p>
              <input
                type="text"
                placeholder="Search team..."
                value={searchVisitante}
                onClick={() => setShowDropdownVisitante(!showDropdownVisitante)}
                onChange={e => setSearchVisitante(e.target.value)}
              />
              {showDropdownVisitante && (
                <ul className="dropdown-list">
                  {filteredEquiposVisitante.map(e => (
                    <li key={e.id} onClick={() => handleSelectEquipo(e.id, 'visitante')} className="dropdown-item">{e.nombre}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="selected-team">
              <h4>{equipos.find(e => e.id === equipoVisitante)?.nombre}</h4>
              <button className="remove-button" onClick={() => setEquipoVisitante('')}>X</button>
            </div>
          )}

          <div className="coach">
            <p>COACH</p>
            <p>{entrenadorVisitante ? `${entrenadorVisitante.nombre} ${entrenadorVisitante.apellido}` : 'Not found'}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Exclusions</th>
                <th>Goals</th>
              </tr>
            </thead>
            <tbody>
              {jugadoresVisitante.map(j => (
                <tr key={j.id} className={expulsionesVisitante[j.id] >= 3 ? 'expulsiones-red' : expulsionesVisitante[j.id] === 2 ? 'expulsiones-yellow' : ''}>
                  <td>{j.numeroGorro}</td>
                  <td>{j.nombre}</td>
                  <td>
                    <div className="counter-container">
                      <button className="counter-button" onClick={() => handleExpulsionesChange(j.id, 'visitante', -1)} disabled={expulsionesVisitante[j.id] <= 0}>-</button>
                      <span className="counter-value">{expulsionesVisitante[j.id] || 0}</span>
                      <button className="counter-button" onClick={() => handleExpulsionesChange(j.id, 'visitante', 1)} disabled={expulsionesVisitante[j.id] >= 3}>+</button>
                    </div>
                  </td>
                  <td>
                    <div className="counter-container">
                      <button className="counter-button" onClick={() => handleGolesChange(j.id, 'visitante', -1)} disabled={golesVisitante[j.id] <= 0}>-</button>
                      <span className="counter-value">{golesVisitante[j.id] || 0}</span>
                      <button className="counter-button" onClick={() => handleGolesChange(j.id, 'visitante', 1)}>+</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default MatchForm;
