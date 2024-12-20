import React from 'react';
import Navbar from '../navbar/Navbar';
import TopScorer from './topScorer/TopScorer';
import TeamList from './teamList/TeamList';
import Teams from './teams/Teams';
import './Home.css';

const Home = () => {
    return (
        <div>
            {/* Contenedor principal del dashboard */}
            <div className="dashboard-container">
                {/* Contenedor izquierdo con dos secciones */}
                <div className="dashboard-left">
                    <div className="dashboard-section">
                        <TopScorer />
                        <TeamList />
                    </div>
                </div>

                {/* Contenedor derecho que ocupa el resto */}
                <div className="dashboard-right">
                    <div className="dashboard-section">
                        <Teams />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
