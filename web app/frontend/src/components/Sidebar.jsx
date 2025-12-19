// not
// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 p-6">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <ul>
        <li>
          <Link to="/admin/dashboard" className="block py-2">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/manage-users" className="block py-2">Manage Users</Link>
        </li>
        <li>
          <Link to="/admin/manage-data" className="block py-2">Manage Data</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
