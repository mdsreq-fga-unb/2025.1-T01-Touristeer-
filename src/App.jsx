import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Componentes
import Header from './components/Header';
import RouteList from './components/RouteList';
import RouteCreator from './components/RouteCreator';
import RouteViewer from './components/RouteViewer';
import TouristSpots from './components/TouristSpots';

// Contexto para idioma
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  const [currentView, setCurrentView] = useState('routes');

  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Header currentView={currentView} setCurrentView={setCurrentView} />
          
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Navigate to="/routes" replace />} />
              <Route 
                path="/routes" 
                element={<RouteList setCurrentView={setCurrentView} />} 
              />
              <Route 
                path="/create-route" 
                element={<RouteCreator setCurrentView={setCurrentView} />} 
              />
              <Route 
                path="/route/:id" 
                element={<RouteViewer setCurrentView={setCurrentView} />} 
              />
              <Route 
                path="/tourist-spots" 
                element={<TouristSpots setCurrentView={setCurrentView} />} 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;

