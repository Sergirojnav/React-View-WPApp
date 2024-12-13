import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home/Home';
import Navbar from './components/Navbar';
import MatchForm from './components/MatchForm';
import UploadExcel from './components/UploadExcel';
import MatchPage from './components/MatchPage';
// import AllMatches from './components/AllMatches';
// import NextMatches from './components/NextMatches';
import './assets/styles.css'; // Importa los estilos CSS
import MatchesList from './components/MatchesList';


function App() {
    return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match-form" element={<MatchForm />} /> {/* Ruta para MatchForm */}
          <Route path="/upload-excel" element={<UploadExcel />} /> {/* Ruta para MatchForm */}
          <Route path="/all-matches" element={<MatchPage />} /> {/* Ruta para MatchForm */}
        </Routes>
      </Router>
    );
  }

export default App;
