import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Importar la biblioteca xlsx
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

    // Aquí manejamos la carga de equipos
    useEffect(() => {
        axios.get('http://localhost:8080/equipos')
            .then(response => setEquipos(response.data))
            .catch(error => console.error('Error fetching equipos:', error));
    }, []);

    // Cargar jugadores y staff cuando se selecciona el equipo local
    useEffect(() => {
        if (equipoLocal) {
            axios.get(`http://localhost:8080/equipos/${equipoLocal}/jugadores`)
                .then(response => setJugadoresLocal(response.data))
                .catch(error => console.error('Error fetching jugadores local:', error));

            // Obtener el entrenador del equipo local
            axios.get(`http://localhost:8080/equipos/${equipoLocal}/staff`)
                .then(response => {
                    const entrenador = response.data.find(person => person.rol === 'coach');
                    setEntrenadorLocal(entrenador || null);
                })
                .catch(error => console.error('Error fetching entrenador local:', error));
        } else {
            setJugadoresLocal([]);
            setEntrenadorLocal(null);
        }
    }, [equipoLocal]);

    // Cargar jugadores y staff cuando se selecciona el equipo visitante
    useEffect(() => {
        if (equipoVisitante) {
            axios.get(`http://localhost:8080/equipos/${equipoVisitante}/jugadores`)
                .then(response => setJugadoresVisitante(response.data))
                .catch(error => console.error('Error fetching jugadores visitante:', error));

            // Obtener el entrenador del equipo visitante
            axios.get(`http://localhost:8080/equipos/${equipoVisitante}/staff`)
                .then(response => {
                    const entrenador = response.data.find(person => person.rol === 'coach');
                    setEntrenadorVisitante(entrenador || null);
                })
                .catch(error => console.error('Error fetching entrenador visitante:', error));
        } else {
            setJugadoresVisitante([]);
            setEntrenadorVisitante(null);
        }
    }, [equipoVisitante]);

    // Función para manejar goles
    const handleGolesChange = (jugadorId, equipo, incremento) => {
        const updateGoles = equipo === 'local' ? { ...golesLocal } : { ...golesVisitante };

        if (!updateGoles[jugadorId]) updateGoles[jugadorId] = 0;
        updateGoles[jugadorId] = Math.max(0, updateGoles[jugadorId] + incremento);

        if (equipo === 'local') {
            setGolesLocal(updateGoles);
            setResultadoLocal(Object.values(updateGoles).reduce((a, b) => a + b, 0));
        } else {
            setGolesVisitante(updateGoles);
            setResultadoVisitante(Object.values(updateGoles).reduce((a, b) => a + b, 0));
        }
    };

    // Función para manejar expulsiones
    const handleExpulsionesChange = (jugadorId, equipo, incremento) => {
        const updateExpulsiones = equipo === 'local' ? { ...expulsionesLocal } : { ...expulsionesVisitante };
        const limit = 3;

        if (!updateExpulsiones[jugadorId]) updateExpulsiones[jugadorId] = 0;
        updateExpulsiones[jugadorId] = Math.max(0, Math.min(limit, updateExpulsiones[jugadorId] + incremento));

        if (equipo === 'local') {
            setExpulsionesLocal(updateExpulsiones);
        } else {
            setExpulsionesVisitante(updateExpulsiones);
        }
    };

    // Función para manejar el submit del partido
    const handleSubmit = (event) => {
        event.preventDefault();

        const fechaPartido = new Date().toISOString().split('T')[0];

        const matchData = {
            fecha: fechaPartido,
            equipoLocal: { id: equipoLocal },
            equipoVisitante: { id: equipoVisitante },
            resultadoLocal: resultadoLocal,
            resultadoVisitante: resultadoVisitante,
            actas: [
                ...Object.keys(golesLocal).map(id => ({
                    jugador: { id: id },
                    goles: golesLocal[id],
                    expulsiones: expulsionesLocal[id] || 0
                })),
                ...Object.keys(golesVisitante).map(id => ({
                    jugador: { id: id },
                    goles: golesVisitante[id],
                    expulsiones: expulsionesVisitante[id] || 0
                }))
            ]
        };

        axios.post('http://localhost:8080/partidos/guardar', matchData)
            .then(response => alert('Partido guardado exitosamente'))
            .catch(error => console.error('Error saving match:', error));
    };

    // Función para descargar los datos en formato Excel
    const handleDownloadExcel = () => {
        const fechaPartido = new Date().toISOString().split('T')[0];

        const dataLocal = jugadoresLocal.map(jugador => ({
            Equipo: equipos.find(e => e.id === equipoLocal)?.nombre || 'Equipo Local',
            Nombre: jugador.nombre,
            NumeroGorro: jugador.numeroGorro,
            Goles: golesLocal[jugador.id] || 0,
            Expulsiones: expulsionesLocal[jugador.id] || 0,
            Resultado: resultadoLocal // Añadir el resultado local
        }));

        const dataVisitante = jugadoresVisitante.map(jugador => ({
            Equipo: equipos.find(e => e.id === equipoVisitante)?.nombre || 'Equipo Visitante',
            Nombre: jugador.nombre,
            NumeroGorro: jugador.numeroGorro,
            Goles: golesVisitante[jugador.id] || 0,
            Expulsiones: expulsionesVisitante[jugador.id] || 0,
            Resultado: resultadoVisitante // Añadir el resultado visitante
        }));

        const combinedData = [
            { Equipo: 'Equipo', Nombre: 'Nombre', NumeroGorro: 'Número de Gorro', Goles: 'Goles', Expulsiones: 'Expulsiones', Resultado: 'Resultado' },
            ...dataLocal,
            ...dataVisitante
        ];

        const ws = XLSX.utils.json_to_sheet(combinedData, { skipHeader: true });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Partido');

        XLSX.writeFile(wb, `partido_${fechaPartido}.xlsx`);
    };

    // Función para manejar la selección de un equipo
    const handleSelectEquipo = (equipoId, equipo) => {
        if (equipo === 'local') {
            setEquipoLocal(equipoId);
            setSearchLocal('');
            setShowDropdownLocal(false);
        } else {
            setEquipoVisitante(equipoId);
            setSearchVisitante('');
            setShowDropdownVisitante(false);
        }
    };

    // Filtros de equipos para la búsqueda
    const filteredEquiposLocal = equipos.filter(equipo =>
        equipo.nombre.toLowerCase().includes(searchLocal.toLowerCase())
    );

    const filteredEquiposVisitante = equipos.filter(equipo =>
        equipo.nombre.toLowerCase().includes(searchVisitante.toLowerCase())
    );

    return (
        <div className="match-form-container">
            {/* Renderizar el formulario para el equipo local y visitante */}
            <div className="equipos-container">
                {/* Equipo Local */}
                <div className="equipo-section">
                    {!equipoLocal ? (
                        <>
                            <div className="dropdown-container">
                                <p>LOCAL TEAM:</p>
                                <input
                                    type="text"
                                    placeholder="Buscar equipo local..."
                                    value={searchLocal}
                                    onClick={() => setShowDropdownLocal(!showDropdownLocal)}
                                    onChange={e => setSearchLocal(e.target.value)}
                                    className="search-input"
                                />
                                {showDropdownLocal && (
                                    <ul className="dropdown-list">
                                        {filteredEquiposLocal.map(equipo => (
                                            <li
                                                key={equipo.id}
                                                onClick={() => handleSelectEquipo(equipo.id, 'local')}
                                                className="dropdown-item"
                                            >
                                                {equipo.nombre}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="selected-team">
                            <h4>{equipos.find(e => e.id === equipoLocal)?.nombre}</h4>
                            <button className="remove-button" onClick={() => setEquipoLocal('')}>X</button>
                        </div>
                    )}
                    <div className="coach">
                        <p>COACH</p>
                        <p>{entrenadorLocal ? `${entrenadorLocal.nombre} ${entrenadorLocal.apellido}` : 'No disponible'}</p>
                    </div>
                    <table className="equipo-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Player</th>
                                <th>Exclusions</th>
                                <th>Goals</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jugadoresLocal.map(jugador => (
                                <tr
                                    key={jugador.id}
                                    className={`jugador-row 
                                        ${expulsionesLocal[jugador.id] >= 3 ? 'expulsiones-red' :
                                        expulsionesLocal[jugador.id] === 2 ? 'expulsiones-yellow' : ''}`}
                                >
                                    <td>{jugador.numeroGorro}</td>
                                    <td>{jugador.nombre}</td>
                                    <td>
                                        <div className="counter-container">
                                            <button className="counter-button" onClick={() => handleExpulsionesChange(jugador.id, 'local', -1)} disabled={expulsionesLocal[jugador.id] <= 0}>-</button>
                                            <span className="counter-value">{expulsionesLocal[jugador.id] || 0}</span>
                                            <button className="counter-button" onClick={() => handleExpulsionesChange(jugador.id, 'local', 1)} disabled={expulsionesLocal[jugador.id] >= 3}>+</button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="counter-container">
                                            <button className="counter-button" onClick={() => handleGolesChange(jugador.id, 'local', -1)} disabled={golesLocal[jugador.id] <= 0}>-</button>
                                            <span className="counter-value">{golesLocal[jugador.id] || 0}</span>
                                            <button className="counter-button" onClick={() => handleGolesChange(jugador.id, 'local', 1)}>+</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Resultado y botones */}
                <div className="resultados-container">
                    <div className="resultado-section">
                        <div className="marcador">
                            <p>{resultadoLocal}</p>
                            <span className="separador">-</span>
                            <p>{resultadoVisitante}</p>
                        </div>
                    </div>
                    <button className="download-button" onClick={handleDownloadExcel}>DOWNLOAD</button>
                    <button className="submit-button" onClick={handleSubmit}>SAVE</button>
                </div>

                {/* Equipo Visitante */}
                <div className="equipo-section">
                    {!equipoVisitante ? (
                        <>
                            <div className="dropdown-container">
                                <p>AWAY TEAM:</p>
                                <input
                                    type="text"
                                    placeholder="Search team..."
                                    value={searchVisitante}
                                    onClick={() => setShowDropdownVisitante(!showDropdownVisitante)}
                                    onChange={e => setSearchVisitante(e.target.value)}
                                    className="search-input"
                                />
                                {showDropdownVisitante && (
                                    <ul className="dropdown-list">
                                        {filteredEquiposVisitante.map(equipo => (
                                            <li
                                                key={equipo.id}
                                                onClick={() => handleSelectEquipo(equipo.id, 'visitante')}
                                                className="dropdown-item"
                                            >
                                                {equipo.nombre}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="selected-team">
                            <h4>{equipos.find(e => e.id === equipoVisitante)?.nombre}</h4>
                            <button className="remove-button" onClick={() => setEquipoVisitante('')}>X</button>
                        </div>
                    )}
                    <div className="coach">
                        <p>COACH</p>
                        <p>{entrenadorVisitante ? `${entrenadorVisitante.nombre} ${entrenadorVisitante.apellido}` : 'No disponible'}</p>
                    </div>
                    <table className="equipo-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Player</th>
                                <th>Exclusions</th>
                                <th>Goals</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jugadoresVisitante.map(jugador => (
                                <tr
                                    key={jugador.id}
                                    className={`jugador-row 
                                        ${expulsionesVisitante[jugador.id] >= 3 ? 'expulsiones-red' :
                                        expulsionesVisitante[jugador.id] === 2 ? 'expulsiones-yellow' : ''}`}
                                >
                                    <td>{jugador.numeroGorro}</td>
                                    <td>{jugador.nombre}</td>
                                    <td>
                                        <div className="counter-container">
                                            <button className="counter-button" onClick={() => handleExpulsionesChange(jugador.id, 'visitante', -1)} disabled={expulsionesVisitante[jugador.id] <= 0}>-</button>
                                            <span className="counter-value">{expulsionesVisitante[jugador.id] || 0}</span>
                                            <button className="counter-button" onClick={() => handleExpulsionesChange(jugador.id, 'visitante', 1)} disabled={expulsionesVisitante[jugador.id] >= 3}>+</button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="counter-container">
                                            <button className="counter-button" onClick={() => handleGolesChange(jugador.id, 'visitante', -1)} disabled={golesVisitante[jugador.id] <= 0}>-</button>
                                            <span className="counter-value">{golesVisitante[jugador.id] || 0}</span>
                                            <button className="counter-button" onClick={() => handleGolesChange(jugador.id, 'visitante', 1)}>+</button>
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
