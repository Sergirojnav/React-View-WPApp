
import React from 'react';
import Navbar from '../navbar/Navbar';
import TopScorer from './topScorer/TopScorer';
import TeamList from './teamList/TeamList';
import Teams from './teams/Teams';
import './Home.css';

const Home = () => {
    return (
        <div>
            {/* Contenido principal del dashboard */}
            <div className="dashboard-container">
                <div className="dashboard-section">
                    <TopScorer />
                </div>
                <div className="dashboard-section-list">
                <Teams />
                </div>
                {/* Contenedores vacíos adicionales */}
                <div className="dashboard-section">
                    <TeamList />
                </div>

            </div>
        </div>
    );
};

export default Home;
