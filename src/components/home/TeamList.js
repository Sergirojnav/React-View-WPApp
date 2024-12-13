import React, { useEffect, useState } from 'react';

const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [editingTeam, setEditingTeam] = useState(null);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = () => {
        fetch('/api/equipos')
            .then(response => response.json())
            .then(data => setTeams(data));
    };

    const handleAddTeam = () => {
        setEditingTeam(null);
        setTeamName('');
        setModalOpen(true);
    };

    const handleEditTeam = (team) => {
        setEditingTeam(team);
        setTeamName(team.nombre);
        setModalOpen(true);
    };

    const handleSaveTeam = (e) => {
        e.preventDefault();
        const teamData = { nombre: teamName };
        let fetchUrl = '/api/equipos';
        let fetchOptions = {
            method: editingTeam ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teamData),
        };

        if (editingTeam) {
            fetchUrl += `/${editingTeam.id}`;
        }

        fetch(fetchUrl, fetchOptions)
            .then(response => response.json())
            .then(() => {
                setModalOpen(false);
                fetchTeams();
            });
    };

    return (
        <div className="dashboard-card">
            <h3>Lista de Equipos</h3>
            <ul>
                {teams.map(team => (
                    <li key={team.id} onClick={() => handleEditTeam(team)}>
                        {team.nombre}
                    </li>
                ))}
            </ul>
            <button onClick={handleAddTeam}>Añadir Equipo</button>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
                        <h2>{editingTeam ? 'Editar Equipo' : 'Añadir Equipo'}</h2>
                        <form onSubmit={handleSaveTeam}>
                            <label htmlFor="team-name">Nombre del Equipo:</label>
                            <input
                                type="text"
                                id="team-name"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                required
                            />
                            <button type="submit">Guardar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamList;
