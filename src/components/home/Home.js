import React from 'react';
import axios from 'axios';
import TopScorer from './TopScorer';
import TeamList from './TeamList';
import './Home.css';  

const Home = () => {
    return (
        <div className="dashboard-container">
            <TopScorer />
            <TeamList />
            <div className="dashboard-card empty-card">
                <h3>Contenedor Vacío 1</h3>
            </div>
            <div className="dashboard-card empty-card">
                <h3>Contenedor Vacío 2</h3>
            </div>
        </div>
    );
};

export default Home;
