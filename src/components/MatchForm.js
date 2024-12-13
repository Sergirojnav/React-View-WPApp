import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Importar la biblioteca xlsx
import '../assets/styles.css';

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

    const resizeWindowTo80Percent = () => {
        const width = window.outerWidth * 0.8;
        const height = window.outerHeight * 0.8;
        window.resizeTo(width, height);
    };

    useEffect(() => {
        resizeWindowTo80Percent();

        axios.get('http://localhost:8080/equipos')
            .then(response => setEquipos(response.data))
            .catch(error => console.error('Error fetching equipos:', error));
    }, []);

    useEffect(() => {
        if (equipoLocal) {
            axios.get(`http://localhost:8080/equipos/${equipoLocal}/jugadores`)
                .then(response => {
                    const jugadoresOrdenados = response.data.sort((a, b) => a.numeroGorro - b.numeroGorro);
                    setJugadoresLocal(jugadoresOrdenados);
                })
                .catch(error => console.error('Error fetching jugadores local:', error));
        } else {
            setJugadoresLocal([]);
        }
    }, [equipoLocal]);

    useEffect(() => {
        if (equipoVisitante) {
            axios.get(`http://localhost:8080/equipos/${equipoVisitante}/jugadores`)
                .then(response => {
                    const jugadoresOrdenados = response.data.sort((a, b) => a.numeroGorro - b.numeroGorro);
                    setJugadoresVisitante(jugadoresOrdenados);
                })
                .catch(error => console.error('Error fetching jugadores visitante:', error));
        } else {
            setJugadoresVisitante([]);
        }
    }, [equipoVisitante]);

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

    const handleDownloadExcel = () => {
        const fechaPartido = new Date().toISOString().split('T')[0];
    
        // Formato de datos esperado para upload
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
    
        // Combinar datos locales y visitantes para una sola hoja
        const combinedData = [
            // Encabezado de la hoja
            { Equipo: 'Equipo', Nombre: 'Nombre', NumeroGorro: 'Número de Gorro', Goles: 'Goles', Expulsiones: 'Expulsiones', Resultado: 'Resultado' },
            ...dataLocal,
            ...dataVisitante
        ];
    
        // Crear una hoja de cálculo
        const ws = XLSX.utils.json_to_sheet(combinedData, { skipHeader: true });
    
        // Crear un libro de Excel y añadir la hoja
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Partido');
    
        // Descargar el archivo Excel
        XLSX.writeFile(wb, `partido_${fechaPartido}.xlsx`);
    };
    
    
    
    

    const handleDropdownClickLocal = () => {
        setShowDropdownLocal(!showDropdownLocal);
    };

    const handleDropdownClickVisitante = () => {
        setShowDropdownVisitante(!showDropdownVisitante);
    };

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

    const filteredEquiposLocal = equipos.filter(equipo => 
        equipo.nombre.toLowerCase().includes(searchLocal.toLowerCase())
    );

    const filteredEquiposVisitante = equipos.filter(equipo => 
        equipo.nombre.toLowerCase().includes(searchVisitante.toLowerCase())
    );

    return (
        <div className="match-form-container">
            <div className="equipos-container">
                <div className="equipo-section">
                    <label>Equipo Local:</label>
                    <div className="dropdown-container">
                        <input 
                            type="text" 
                            placeholder="Buscar equipo local..." 
                            value={searchLocal} 
                            onClick={handleDropdownClickLocal}
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
                    <h4>{equipoLocal ? equipos.find(e => e.id === equipoLocal)?.nombre : 'Equipo Local'}</h4>
                    <table className="equipo-table">
                        <thead>
                            <tr>
                                <th>Número de Gorro</th>
                                <th>Nombre</th>
                                <th>Expulsiones</th>
                                <th>Goles</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jugadoresLocal.map(jugador => (
                                <tr
                                    id={`jugador-${jugador.id}-local`}
                                    className={`jugador-row 
                                        ${expulsionesLocal[jugador.id] >= 3 ? 'expulsiones-red' : 
                                        expulsionesLocal[jugador.id] === 2 ? 'expulsiones-yellow' : ''}
                                        ${[1, 13].includes(jugador.numeroGorro) ? 'highlight-red' : ''}`}
                                    key={jugador.id}
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
                <div className="equipo-section">
                    <label>Equipo Visitante:</label>
                    <div className="dropdown-container">
                        <input 
                            type="text" 
                            placeholder="Buscar equipo visitante..." 
                            value={searchVisitante} 
                            onClick={handleDropdownClickVisitante}
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
                    <h4>{equipoVisitante ? equipos.find(e => e.id === equipoVisitante)?.nombre : 'Equipo Visitante'}</h4>
                    <table className="equipo-table">
                        <thead>
                            <tr>
                                <th>Número de Gorro</th>
                                <th>Nombre</th>
                                <th>Expulsiones</th>
                                <th>Goles</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jugadoresVisitante.map(jugador => (
                                <tr
                                    id={`jugador-${jugador.id}-visitante`}
                                    className={`jugador-row 
                                        ${expulsionesVisitante[jugador.id] >= 3 ? 'expulsiones-red' : 
                                        expulsionesVisitante[jugador.id] === 2 ? 'expulsiones-yellow' : ''}
                                        ${[1, 13].includes(jugador.numeroGorro) ? 'highlight-red' : ''}`}
                                    key={jugador.id}
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
            <div className="resultados-container">
                <div className="resultado-section">
                    <div className="marcador">
                        <div className="resultado-local">
                            <p>{resultadoLocal}</p>
                        </div>
                        <span className="separador">-</span>
                        <div className="resultado-visitante">
                            <p>{resultadoVisitante}</p>
                        </div>
                    </div>
                </div>
            </div>
            <button className="submit-button" onClick={handleSubmit}>Guardar Partido</button>
            <button className="download-button" onClick={handleDownloadExcel}>Descargar Excel</button>
        </div>
    );
};

export default MatchForm;
