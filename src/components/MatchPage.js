import React, { useEffect, useState } from 'react';
import { getPartidos } from '../services/partidoService';
import MatchesList from './matchList/MatchesList';

function MatchPage() {
    const [partidos, setPartidos] = useState([]);

    useEffect(() => {
        getPartidos().then(data => setPartidos(data));
    }, []);

    return (
        <div className="home-container">
            <MatchesList partidos={partidos} />
        </div>
    );
}

export default MatchPage;
