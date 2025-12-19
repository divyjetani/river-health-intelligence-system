// not
// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // For navigation

const Navbar = () => {
  return (
    <nav className="bg-gray-900/70 backdrop-blur-2xl p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white font-bold text-xl">Team Cosmix</h1>
        <div>
          <Link to="/" className="text-white px-4">Home</Link>
          <Link to="/real-time-monitoring" className="text-white px-4">Real-Time Monitoring</Link>
          <Link to="/river-health-score" className="text-white px-4">River Health Score</Link>
          <Link to="/geographic-map" className="text-white px-4">Geographic Map</Link>
          <Link to="/upload" className="text-white px-4">Upload</Link>
        </div>
        <div>
            <Link to="/login" className="text-white px-4">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
