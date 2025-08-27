import axios from 'axios';

const API_URL = 'http://16.170.214.129:8080';

export const getTeams = async () => {
    const response = await axios.get(`${API_URL}/equipos`);
    return response.data;
};

export const getPlayersByTeam = async (teamId) => {
    const response = await axios.get(`${API_URL}/equipos/${teamId}/jugadores`);
    return response.data;
};
