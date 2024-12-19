import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faVolleyball } from '@fortawesome/free-solid-svg-icons';
import profileDefault from '../../../assets/images/img_user_default.jpg';

const TopScorer = () => {
    const [topScorers, setTopScorers] = useState([]);

    useEffect(() => {
        const fetchTopScorers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/jugadores/top-scorers');
                console.log('API Response:', response.data);
                setTopScorers(response.data);
            } catch (error) {
                console.error('Error fetching top scorer data', error);
            }
        };

        fetchTopScorers();
    }, []);

    const topFiveScorers = topScorers.slice(0, 3);

    const openAllScorers = () => {
        const newWindow = window.open('', '_blank');
        newWindow.document.write('<html><head><title>Todos los Máximos Goleadores</title>');
        newWindow.document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">');
        newWindow.document.write('<style>');
        newWindow.document.write(`
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            .scorer-list { display: flex; flex-direction: column; gap: 10px; }
            .scorer-card { display: flex; align-items: center; border: 1px solid #ddd; border-radius: 8px; padding: 10px; width: 100%; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); }
            .scorer-card img { width: 50px; height: 50px; border-radius: 50%; margin-right: 15px; }
            .scorer-card-content { flex: 1; }
            .scorer-card-content h4 { margin: 0 0 5px 0; font-size: 16px; }
            .scorer-card-content p { margin: 2px 0; font-size: 14px; }
        `);
        newWindow.document.write('</style></head><body>');
        newWindow.document.write('<h1>Todos los Máximos Goleadores</h1>');
        newWindow.document.write('<div class="scorer-list">');

        topScorers.forEach(scorer => {
            const imageUrl = scorer.profileImageUrl || 'default-profile.png';
            newWindow.document.write(`
                <div class="scorer-card">
                    <img src="${imageUrl}" alt="Foto de perfil">
                    <div class="scorer-card-content">
                        <h4>${scorer.nombre}</h4>
                        <p><strong>Equipo:</strong> ${scorer.nombreEquipo}</p>
                        <p><strong>Goles Totales:</strong> ${scorer.goles}</p>
                    </div>
                </div>
            `);
        });

        newWindow.document.write('</div>');
        newWindow.document.write('</body></html>');
        newWindow.document.close();
    };

    return (
        <div className="dashboard-card">
            <h2>Top Scorer</h2>
            {topFiveScorers.length > 0 ? (
                <div className="scorer-list">
                    {topFiveScorers.map((scorer, index) => {
                        // Usar imagen por defecto si `profileImageUrl` está ausente o vacío
                        const imageUrl = scorer.profileImageUrl || profileDefault;
                        return (
                            <div key={index} className="scorer-card">
                                <img src={imageUrl} alt="Foto de perfil" />
                                <div className="scorer-card-content">
                                    <h4>{scorer.nombre}</h4>
                                    <p><strong>Equipo:</strong> {scorer.nombreEquipo}</p>
                                    <p><strong>Goles Totales:</strong> {scorer.goles}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>No players available...</p>
            )}
            {topScorers.length > 3 && (
                <button className="view-more-button" onClick={openAllScorers}>View More</button>
            )}
        </div>
    );
};

export default TopScorer;
