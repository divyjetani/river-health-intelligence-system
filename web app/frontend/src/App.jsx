// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RealTimeMonitoring from './pages/RealTimeMonitoring';
import RiverHealthScore from './pages/RiverHealthScore';
import GeographicMap from './pages/GeographicMap';
import Upload from './pages/Upload';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/real-time-monitoring" element={<RealTimeMonitoring />} />
        <Route path="/river-health-score" element={<RiverHealthScore />} />
        <Route path="/geographic-map" element={<GeographicMap />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
