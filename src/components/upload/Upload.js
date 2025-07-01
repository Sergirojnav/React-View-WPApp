import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Necesario para la redirección
import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación
import './Upload.css';

const Upload = () => {
    const navigate = useNavigate(); // Función para redirigir a otra página
    const { isAuthenticated, getRoleFromToken } = useAuth(); // Extraemos el rol del token

    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [equipoLocal, setEquipoLocal] = useState("");
    const [equipoVisitante, setEquipoVisitante] = useState("");
    const [equipos, setEquipos] = useState([]); // Lista de equipos
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [usuarios, setUsuarios] = useState([]); // Lista de usuarios

    // Equipo y jugadores
    const [nombreEquipo, setNombreEquipo] = useState("");
    const [imgEquipo, setImgEquipo] = useState(null); // Para la imagen
    const [jugadores, setJugadores] = useState([{ nombre: "", numeroGorro: "" }]); // Lista de jugadores

    // Estado para el entrenador
    const [entrenadorNombre, setEntrenadorNombre] = useState("");
    const [entrenadorApellido, setEntrenadorApellido] = useState("");
    const [entrenadorRol, setEntrenadorRol] = useState("coach"); // Valor predeterminado: "coach"

    // Verificar el rol del usuario y redirigir si no es admin
    useEffect(() => {
        if (!isAuthenticated || getRoleFromToken() !== 'admin') {
            navigate('/login'); // Redirige a login si no es admin
        }
    }, [isAuthenticated, navigate, getRoleFromToken]);

    // Obtener la lista de equipos al cargar el componente
    useEffect(() => {
        const fetchEquipos = async () => {
            try {
                const response = await fetch("http://192.168.1.54:8080/equipos"); // Endpoint para obtener equipos
                if (!response.ok) {
                    throw new Error("Error al obtener la lista de equipos");
                }
                const data = await response.json();
                setEquipos(data); // Guardar equipos en el estado
            } catch (error) {
                console.error("Error:", error);
                alert("Ocurrió un error al obtener la lista de equipos");
            }
        };
        fetchEquipos();
    }, []);

    // Obtener la lista de usuarios al cargar el componente
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch("http://192.168.1.54:8080/api/auth/users"); // Endpoint para obtener usuarios
                if (!response.ok) {
                    throw new Error("Error al obtener la lista de usuarios");
                }
                const data = await response.json();
                setUsuarios(data); // Guardar usuarios en el estado
            } catch (error) {
                console.error("Error:", error);
                alert("Ocurrió un error al obtener la lista de usuarios");
            }
        };
        fetchUsuarios();
    }, []);

    // Crear un partido
    const handleSubmitPartido = async (e) => {
        e.preventDefault();

        const partido = {
            fecha,
            hora,
            resultadoLocal: 0, // Inicializado en 0 por defecto
            resultadoVisitante: 0, // Inicializado en 0 por defecto
            equipoLocal,
            equipoVisitante,
        };

        try {
            const response = await fetch("http://192.168.1.54:8080/partidos/crear", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(partido),
            });

            if (!response.ok) {
                throw new Error("Error al crear el partido");
            }

            const data = await response.json();
            console.log("Partido creado:", data);
            alert("Partido creado exitosamente");
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al crear el partido");
        }
    };

    // Modificar un partido
    const handleModificarPartido = async (id) => {
        const partidoModificado = {
            fecha,
            hora,
            resultadoLocal: 0, // Puedes actualizar esto según sea necesario
            resultadoVisitante: 0, // Puedes actualizar esto según sea necesario
            equipoLocal,
            equipoVisitante,
        };

        try {
            const response = await fetch(`http://192.168.1.54:8080/partidos/modificar/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(partidoModificado),
            });

            if (!response.ok) {
                throw new Error("Error al modificar el partido");
            }

            const data = await response.json();
            console.log("Partido modificado:", data);
            alert("Partido modificado exitosamente");
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al modificar el partido");
        }
    };

    // Crear un usuario
    const handleSubmitUsuario = async (e) => {
        e.preventDefault();

        const usuario = {
            username,
            password,
            role,
            email,
        };

        try {
            const response = await fetch("http://192.168.1.54:8080/api/auth/crear", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(usuario),
            });

            if (!response.ok) {
                throw new Error("Error al crear el usuario");
            }

            const data = await response.json();
            console.log("Usuario creado:", data);
            alert("Usuario creado exitosamente");
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al crear el usuario");
        }
    };

    // Modificar un usuario
    const handleModificarUsuario = async (id) => {
        const usuarioModificado = {
            username,
            password,
            role,
            email,
        };

        try {
            const response = await fetch(`http://192.168.1.54:8080/api/auth/modificar/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(usuarioModificado),
            });

            if (!response.ok) {
                throw new Error("Error al modificar el usuario");
            }

            const data = await response.json();
            console.log("Usuario modificado:", data);
            alert("Usuario modificado exitosamente");
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al modificar el usuario");
        }
    };

    // Crear un equipo
    const handleSubmitEquipo = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("nombre", nombreEquipo);
        formData.append("imgEquipo", imgEquipo);

        // Agregar los jugadores al equipo
        formData.append("jugadores", JSON.stringify(jugadores)); // Asegúrate de que esté serializado

        // Agregar los datos del entrenador
        const entrenadorData = {
            nombre: entrenadorNombre,
            apellido: entrenadorApellido,
            rol: entrenadorRol,
        };
        formData.append("entrenador", JSON.stringify(entrenadorData));

        try {
            const response = await fetch("http://192.168.1.54:8080/equipos/crear", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al crear el equipo");
            }

            const data = await response.json();
            console.log("Equipo creado:", data);
            alert("Equipo creado exitosamente");
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al crear el equipo");
        }
    };

    // Modificar un equipo
    const handleModificarEquipo = async (id) => {
        const formData = new FormData();
        formData.append("nombre", nombreEquipo);
        formData.append("imgEquipo", imgEquipo);

        // Agregar los jugadores al equipo
        formData.append("jugadores", JSON.stringify(jugadores)); // Asegúrate de que esté serializado

        // Agregar los datos del entrenador
        const entrenadorData = {
            nombre: entrenadorNombre,
            apellido: entrenadorApellido,
            rol: entrenadorRol,
        };
        formData.append("entrenador", JSON.stringify(entrenadorData));

        try {
            const response = await fetch(`http://192.168.1.54:8080/equipos/modificar/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al modificar el equipo");
            }

            const data = await response.json();
            console.log("Equipo modificado:", data);
            alert("Equipo modificado exitosamente");
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al modificar el equipo");
        }
    };

    // Manejo de la imagen del equipo
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImgEquipo(file);
    };

    // Manejo de los jugadores
    const handleJugadorChange = (index, event) => {
        const values = [...jugadores];
        values[index][event.target.name] = event.target.value;
        setJugadores(values);
    };

    const addJugador = () => {
        setJugadores([...jugadores, { nombre: "", numeroGorro: "" }]);
    };

    return (
        <div className="create-match">
            <h3>CREATE MATCH</h3>
            <form className="upload-form" onSubmit={handleSubmitPartido}>
                <div className="form-group">
                    <label className="form-label">DATE</label>
                    <input
                        type="date"
                        className="form-input"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">HOUR</label>
                    <input
                        type="time"
                        className="form-input"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">LOCAL TEAM</label>
                    <select
                        className="form-select"
                        value={equipoLocal}
                        onChange={(e) => setEquipoLocal(e.target.value)}
                        required
                    >
                        <option value="">SELECT TEAM</option>
                        {equipos.map((equipo) => (
                            <option key={equipo.id} value={equipo.nombre}>
                                {equipo.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">AWAY TEAM</label>
                    <select
                        className="form-select"
                        value={equipoVisitante}
                        onChange={(e) => setEquipoVisitante(e.target.value)}
                        required
                    >
                        <option value="">SELECT TEAM</option>
                        {equipos.map((equipo) => (
                            <option key={equipo.id} value={equipo.nombre}>
                                {equipo.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="submit-button">CREATE MATCH</button>
            </form>

            <h3>CREATE USER</h3>
            <form className="upload-form" onSubmit={handleSubmitUsuario}>
                <div className="form-group">
                    <label className="form-label">USERNAME</label>
                    <input
                        type="text"
                        className="form-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">PASSWORD</label>
                    <input
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">ROLE</label>
                    <select
                        className="form-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="">SELECT ROLE</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">EMAIL</label>
                    <input
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">CREATE USER</button>
            </form>

            <h3>CREATE TEAM</h3>
            <form className="upload-form" onSubmit={handleSubmitEquipo}>
                <div className="form-group">
                    <label className="form-label">TEAM NAME</label>
                    <input
                        type="text"
                        className="form-input"
                        value={nombreEquipo}
                        onChange={(e) => setNombreEquipo(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">TEAM IMAGE</label>
                    <input
                        type="file"
                        className="form-input"
                        onChange={handleImageChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">PLAYERS</label>
                    {jugadores.map((jugador, index) => (
                        <div key={index} className="jugador-group">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Player Name"
                                name="nombre"
                                value={jugador.nombre}
                                onChange={(e) => handleJugadorChange(index, e)}
                                required
                            />
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Player Number"
                                name="numeroGorro"
                                value={jugador.numeroGorro}
                                onChange={(e) => handleJugadorChange(index, e)}
                                required
                            />
                        </div>
                    ))}
                    <button type="button" className="add-player-button" onClick={addJugador}>Add Player</button>
                </div>
                
                <div className="form-group">
                    <label className="form-label">COACH NAME</label>
                    <input
                        type="text"
                        className="form-input"
                        value={entrenadorNombre}
                        onChange={(e) => setEntrenadorNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">COACH LAST NAME</label>
                    <input
                        type="text"
                        className="form-input"
                        value={entrenadorApellido}
                        onChange={(e) => setEntrenadorApellido(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">COACH ROLE</label>
                    <select
                        className="form-select"
                        value={entrenadorRol}
                        onChange={(e) => setEntrenadorRol(e.target.value)}
                        required
                    >
                        <option value="coach">Coach</option>
                        <option value="assistant">Assistant</option>
                    </select>
                </div>
                <button type="submit" className="submit-button">CREATE TEAM</button>
            </form>
        </div>
    );
};

export default Upload;
