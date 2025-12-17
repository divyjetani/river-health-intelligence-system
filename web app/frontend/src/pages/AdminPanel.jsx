// src/pages/AdminPanel.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';

const AdminPanel = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold">Admin Panel</h1>
        <p className="mt-4 text-lg">Manage the AI system, users, and data.</p>
      </div>
    </div>
  );
};

export default AdminPanel;
