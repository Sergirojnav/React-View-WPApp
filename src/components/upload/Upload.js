import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext'; 
import './Upload.css';

const Upload = () => {
    const navigate = useNavigate();
    const { isAuthenticated, getRoleFromToken } = useAuth();

    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [equipoLocal, setEquipoLocal] = useState("");
    const [equipoVisitante, setEquipoVisitante] = useState("");
    const [equipos, setEquipos] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [usuarios, setUsuarios] = useState([]);

    // Equipo y jugadores
    const [nombreEquipo, setNombreEquipo] = useState("");
    const [imgEquipo, setImgEquipo] = useState(null);
    const [jugadores, setJugadores] = useState([{ nombre: "", numeroGorro: "" }]);

    // Entrenador
    const [entrenadorNombre, setEntrenadorNombre] = useState("");
    const [entrenadorApellido, setEntrenadorApellido] = useState("");
    const [entrenadorRol, setEntrenadorRol] = useState("coach");

    const [selectedEquipoId, setSelectedEquipoId] = useState(null); // equipo que se edita
    const [equipoEditando, setEquipoEditando] = useState(null);

    useEffect(() => {
        if (!isAuthenticated || getRoleFromToken() !== 'admin') {
            navigate('/login');
        }
    }, [isAuthenticated, navigate, getRoleFromToken]);

    useEffect(() => {
        const fetchEquipos = async () => {
            try {
                const response = await fetch("http://16.170.214.129:8080/equipos");
                if (!response.ok) throw new Error("Error al obtener equipos");
                const data = await response.json();
                setEquipos(data);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchEquipos();
    }, []);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch("http://16.170.214.129:8080/api/auth/users");
                if (!response.ok) throw new Error("Error al obtener usuarios");
                const data = await response.json();
                setUsuarios(data);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchUsuarios();
    }, []);

    // Crear partido
    const handleSubmitPartido = async (e) => {
        e.preventDefault();
        const partido = { fecha, hora, resultadoLocal: 0, resultadoVisitante: 0, equipoLocal, equipoVisitante };
        try {
            const response = await fetch("http://16.170.214.129:8080/partidos/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(partido),
            });
            if (!response.ok) throw new Error("Error al crear partido");
            alert("Partido creado exitosamente");
        } catch (error) {
            console.error("Error:", error);
            alert("Error creando partido");
        }
    };

    // Crear usuario
    const handleSubmitUsuario = async (e) => {
        e.preventDefault();
        const usuario = { username, password, role, email };
        try {
            const response = await fetch("http://16.170.214.129:8080/api/auth/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario),
            });
            if (!response.ok) throw new Error("Error al crear usuario");
            alert("Usuario creado exitosamente");
        } catch (error) {
            console.error("Error:", error);
            alert("Error creando usuario");
        }
    };

    // Crear equipo
    const handleSubmitEquipo = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nombre", nombreEquipo);
        if (imgEquipo) formData.append("imgEquipo", imgEquipo);
        formData.append("jugadores", JSON.stringify(jugadores));
        const entrenadorData = { nombre: entrenadorNombre, apellido: entrenadorApellido, rol: entrenadorRol };
        formData.append("entrenador", JSON.stringify(entrenadorData));

        try {
            const response = await fetch("http://16.170.214.129:8080/equipos/crear", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) throw new Error("Error al crear equipo");
            alert("Equipo creado exitosamente");
        } catch (error) {
            console.error("Error:", error);
            alert("Error creando equipo");
        }
    };

    // Modificar equipo
    const handleModificarEquipo = async () => {
        if (!selectedEquipoId) {
            alert("Selecciona un equipo primero");
            return;
        }

        const formData = new FormData();
        formData.append("nombre", nombreEquipo);
        if (imgEquipo) formData.append("imgEquipo", imgEquipo);
        formData.append("jugadores", JSON.stringify(jugadores));
        const entrenadorData = { nombre: entrenadorNombre, apellido: entrenadorApellido, rol: entrenadorRol };
        formData.append("entrenador", JSON.stringify(entrenadorData));

        try {
            const response = await fetch(`http://16.170.214.129:8080/equipos/modificar/${selectedEquipoId}`, {
                method: "PUT",
                body: formData,
            });
            if (!response.ok) throw new Error("Error al modificar equipo");
            alert("Equipo modificado exitosamente");
        } catch (error) {
            console.error("Error:", error);
            alert("Error modificando equipo");
        }
    };

    // Cargar equipo en formulario
    const loadEquipoEnFormulario = (equipo) => {
        setSelectedEquipoId(equipo.id);
        setEquipoEditando(equipo);
        setNombreEquipo(equipo.nombre);
        setJugadores(equipo.jugadores || [{ nombre: "", numeroGorro: "" }]);
        if (equipo.entrenadores && equipo.entrenadores.length > 0) {
            setEntrenadorNombre(equipo.entrenadores[0].nombre || "");
            setEntrenadorApellido(equipo.entrenadores[0].apellido || "");
            setEntrenadorRol(equipo.entrenadores[0].rol || "coach");
        }
    };

    const handleImageChange = (e) => setImgEquipo(e.target.files[0]);

    const handleJugadorChange = (index, event) => {
        const values = [...jugadores];
        values[index][event.target.name] = event.target.value;
        setJugadores(values);
    };

    const addJugador = () => setJugadores([...jugadores, { nombre: "", numeroGorro: "" }]);

    return (
        <div className="create-match">
            {/* Crear partido */}
            <h3>CREATE MATCH</h3>
            <form className="upload-form" onSubmit={handleSubmitPartido}>
                <div className="form-group">
                    <label>DATE</label>
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>HOUR</label>
                    <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>LOCAL TEAM</label>
                    <select value={equipoLocal} onChange={(e) => setEquipoLocal(e.target.value)} required>
                        <option value="">SELECT TEAM</option>
                        {equipos.map((eq) => <option key={eq.id} value={eq.nombre}>{eq.nombre}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>AWAY TEAM</label>
                    <select value={equipoVisitante} onChange={(e) => setEquipoVisitante(e.target.value)} required>
                        <option value="">SELECT TEAM</option>
                        {equipos.map((eq) => <option key={eq.id} value={eq.nombre}>{eq.nombre}</option>)}
                    </select>
                </div>
                <button type="submit" className="submit-button">CREATE MATCH</button>
            </form>

            {/* Crear usuario */}
            <h3>CREATE USER</h3>
            <form className="upload-form" onSubmit={handleSubmitUsuario}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit" className="submit-button">CREATE USER</button>
            </form>

            {/* Crear equipo */}
            <h3>CREATE TEAM</h3>
            <form className="upload-form" onSubmit={handleSubmitEquipo}>
                <input type="text" placeholder="Team Name" value={nombreEquipo} onChange={(e) => setNombreEquipo(e.target.value)} required />
                <input type="file" onChange={handleImageChange} />
                {jugadores.map((jugador, i) => (
                    <div key={i}>
                        <input type="text" placeholder="Player Name" name="nombre" value={jugador.nombre} onChange={(e) => handleJugadorChange(i, e)} required />
                        <input type="number" placeholder="Player Number" name="numeroGorro" value={jugador.numeroGorro} onChange={(e) => handleJugadorChange(i, e)} required />
                    </div>
                ))}
                <button type="button" onClick={addJugador}>Add Player</button>
                <input type="text" placeholder="Coach Name" value={entrenadorNombre} onChange={(e) => setEntrenadorNombre(e.target.value)} required />
                <input type="text" placeholder="Coach Last Name" value={entrenadorApellido} onChange={(e) => setEntrenadorApellido(e.target.value)} required />
                <select value={entrenadorRol} onChange={(e) => setEntrenadorRol(e.target.value)} required>
                    <option value="coach">Coach</option>
                    <option value="assistant">Assistant</option>
                </select>
                <button type="submit" className="submit-button">CREATE TEAM</button>
            </form>

            {/* Modificar equipo */}
            {equipoEditando && (
                <div className="modify-form">
                    <h3>MODIFY TEAM: <span>{equipoEditando.nombre}</span></h3>
                    <form className="upload-form modify" onSubmit={(e) => { e.preventDefault(); handleModificarEquipo(); }}>
                        <input type="text" placeholder="Team Name" value={nombreEquipo} onChange={(e) => setNombreEquipo(e.target.value)} required />
                        <input type="file" onChange={handleImageChange} />
                        {jugadores.map((jugador, i) => (
                            <div key={i}>
                                <input type="text" placeholder="Player Name" name="nombre" value={jugador.nombre} onChange={(e) => handleJugadorChange(i, e)} required />
                                <input type="number" placeholder="Player Number" name="numeroGorro" value={jugador.numeroGorro} onChange={(e) => handleJugadorChange(i, e)} required />
                            </div>
                        ))}
                        <button type="button" onClick={addJugador}>➕ Add Player</button>
                        <input type="text" placeholder="Coach Name" value={entrenadorNombre} onChange={(e) => setEntrenadorNombre(e.target.value)} required />
                        <input type="text" placeholder="Coach Last Name" value={entrenadorApellido} onChange={(e) => setEntrenadorApellido(e.target.value)} required />
                        <select value={entrenadorRol} onChange={(e) => setEntrenadorRol(e.target.value)} required>
                            <option value="coach">Coach</option>
                            <option value="assistant">Assistant</option>
                        </select>
                        <button type="submit" className="modify-button">SAVE CHANGES</button>
                    </form>
                </div>
            )}

            {/* Listado de equipos */}
            <h3>EXISTING TEAMS</h3>
            <div className="teams-list">
                {equipos.length === 0 ? (
                    <p>No hay equipos disponibles</p>
                ) : (
                    equipos.map((eq) => (
                        <div key={eq.id} className="team-card">
                            <h4>{eq.nombre}</h4>
                            {eq.imgEquipo && (
                                <img src={`data:image/png;base64,${eq.imgEquipo}`} alt={eq.nombre} style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                            )}
                            <button type="button" onClick={() => loadEquipoEnFormulario(eq)}>Load in Form</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Upload;
