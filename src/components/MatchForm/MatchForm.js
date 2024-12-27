import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Importar la biblioteca xlsx
import { jsPDF } from 'jspdf'; //libreria pdf
import 'jspdf-autotable';
import './MatchForm.css';

import logo from '../../assets/images/bwmf.png';
import wallpaper from '../../assets/images/form-wallpaper.png';

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
        axios.get('http://192.168.1.54:8080/equipos')
            .then(response => setEquipos(response.data))
            .catch(error => console.error('Error fetching equipos:', error));
    }, []);

    // Cargar jugadores y staff cuando se selecciona el equipo local
    useEffect(() => {
        if (equipoLocal) {
            axios.get(`http://192.168.1.54:8080/equipos/${equipoLocal}/jugadores`)
                .then(response => setJugadoresLocal(response.data))
                .catch(error => console.error('Error fetching jugadores local:', error));

            // Obtener el entrenador del equipo local
            axios.get(`http://192.168.1.54:8080/equipos/${equipoLocal}/staff`)
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
            axios.get(`http://192.168.1.54:8080/equipos/${equipoVisitante}/jugadores`)
                .then(response => setJugadoresVisitante(response.data))
                .catch(error => console.error('Error fetching jugadores visitante:', error));

            // Obtener el entrenador del equipo visitante
            axios.get(`http://192.168.1.54:8080/equipos/${equipoVisitante}/staff`)
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

        axios.post('http://192.168.1.54:8080/partidos/guardar', matchData)
            .then(response => alert('Partido guardado exitosamente'))
            .catch(error => console.error('Error saving match:', error));
    };

    // Funcion para descargar Acta en pdf
    const handleDownloadPDF = () => {
        const fechaPartido = new Date().toISOString().split('T')[0];
        const nombreLocal =
          equipos.find(e => e.id === equipoLocal)?.nombre || 'Equipo A';
        const nombreVisitante =
          equipos.find(e => e.id === equipoVisitante)?.nombre || 'Equipo B';
    
        const nombreEntrenadorLocal = entrenadorLocal
          ? `${entrenadorLocal.nombre} ${entrenadorLocal.apellido}`
          : 'Not found';
        const nombreEntrenadorVisitante = entrenadorVisitante
          ? `${entrenadorVisitante.nombre} ${entrenadorVisitante.apellido}`
          : 'Not found';
    
        // Cabeceras y data
        const headColumns = [['Gorro', 'Jugador', 'Goles', 'Expulsiones']];
        const bodyLocal = jugadoresLocal.map(jug => [
          jug.numeroGorro,
          jug.nombre,
          golesLocal[jug.id] || 0,
          expulsionesLocal[jug.id] || 0
        ]);
        const bodyVisit = jugadoresVisitante.map(jug => [
          jug.numeroGorro,
          jug.nombre,
          golesVisitante[jug.id] || 0,
          expulsionesVisitante[jug.id] || 0
        ]);
    
        // Crear PDF
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: 'a4'
        });
    
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
    
        // Fondo + logos
        doc.addImage(wallpaper, 'PNG', 0, 0, pageWidth, pageHeight);
        doc.addImage(logo, 'PNG', 20, 15, 50, 50);
        doc.addImage(logo, 'PNG', pageWidth - 70, 15, 50, 50);
    
        //   Título en blanco
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);  // BLANCO
        doc.text(
          `ACTA PARTIDO ${nombreLocal} VS ${nombreVisitante}`,
          pageWidth / 2,
          50,
          { align: 'center' }
        );
    
        // Ajustes para las tablas
        const tableWidth = 240; // ancho mayor
        const leftMarginLocal = 30;
        const leftMarginVisit = pageWidth - tableWidth - 30;
        const startY = 100;
    
        //  NOMBRE DEL EQUIPO LOCAL
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255); 
        doc.text(nombreLocal, leftMarginLocal, startY);
    
        doc.setTextColor(0, 0, 0);
    
        // Tabla local
        doc.autoTable({
          startY: startY + 10,
          tableWidth,
          margin: { left: leftMarginLocal },
          head: headColumns,
          body: bodyLocal,
          theme: 'grid',
          styles: {
            cellPadding: 2,
            lineWidth: 0.3
          },
          headStyles: {
            fillColor: [0, 0, 0],
            textColor: [255, 255, 255],
            halign: 'center'
          },
          bodyStyles: {
            halign: 'center'
          },
          columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 105 },
            2: { cellWidth: 40 },
            3: { cellWidth: 60 }
          },
          didParseCell: data => {
            // Pintar expulsiones=3 en rojo
            if (data.section === 'body' && data.column.index === 3) {
              const val = Number(data.cell.raw);
              if (val === 3) {
                data.cell.styles.fillColor = [255, 0, 0];
                data.cell.styles.textColor = [255, 255, 255];
              }
            }
          }
        });
    
        const localTableEndY = doc.lastAutoTable.finalY;
    
        // Entrenador local en BLANCO
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(255, 255, 255);  // blanco
        doc.text(
          `Entrenador: ${nombreEntrenadorLocal}`,
          leftMarginLocal,
          localTableEndY + 15
        );
    
        //  NOMBRE EQUIPO VISITANTE
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255); 
        doc.text(nombreVisitante, leftMarginVisit, startY);
    
        // Tabla en negro
        doc.setTextColor(0, 0, 0);
    
        doc.autoTable({
          startY: startY + 10,
          tableWidth,
          margin: { left: leftMarginVisit },
          head: headColumns,
          body: bodyVisit,
          theme: 'grid',
          styles: {
            cellPadding: 2,
            lineWidth: 0.3
          },
          headStyles: {
            fillColor: [0, 0, 0],
            textColor: [255, 255, 255],
            halign: 'center'
          },
          bodyStyles: {
            halign: 'center'
          },
          columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 105 },
            2: { cellWidth: 40 },
            3: { cellWidth: 60 }
          },
          didParseCell: data => {
            if (data.section === 'body' && data.column.index === 3) {
              const val = Number(data.cell.raw);
              if (val === 3) {
                data.cell.styles.fillColor = [255, 0, 0];
                data.cell.styles.textColor = [255, 255, 255];
              }
            }
          }
        });
    
        const visitTableEndY = doc.lastAutoTable.finalY;
        // Entrenador visitante en BLANCO
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(255, 255, 255);
        doc.text(
          `Entrenador: ${nombreEntrenadorVisitante}`,
          leftMarginVisit,
          visitTableEndY + 15
        );
    
        //  RESULTADO Y GANADOR
        const maxEndY = Math.max(localTableEndY, visitTableEndY);
        const resultStartY = maxEndY + 60;
    
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);  // blanco
        doc.text('RESULTADO', pageWidth / 2, resultStartY, { align: 'center' });
    
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `${resultadoLocal} - ${resultadoVisitante}`,
          pageWidth / 2,
          resultStartY + 20,
          { align: 'center' }
        );
    
        let ganador = 'Empate';
        if (resultadoLocal > resultadoVisitante) ganador = nombreLocal;
        if (resultadoLocal < resultadoVisitante) ganador = nombreVisitante;
    
        doc.text(
          `GANADOR: ${ganador}`,
          pageWidth / 2,
          resultStartY + 40,
          { align: 'center' }
        );
    
        // Guardar
        const safeLocal = nombreLocal.replace(/\s+/g, '_');
        const safeVisit = nombreVisitante.replace(/\s+/g, '_');
        doc.save(`partido_${fechaPartido}_${safeLocal}_vs_${safeVisit}_bwmf.pdf`);
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
                                    placeholder="Search team..."
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
                        <p>{entrenadorLocal ? `${entrenadorLocal.nombre} ${entrenadorLocal.apellido}` : 'Not found'}</p>
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
                    <button className="download-button" onClick={handleDownloadPDF}>DOWNLOAD</button>
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
                        <p>{entrenadorVisitante ? `${entrenadorVisitante.nombre} ${entrenadorVisitante.apellido}` : 'Not found'}</p>
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