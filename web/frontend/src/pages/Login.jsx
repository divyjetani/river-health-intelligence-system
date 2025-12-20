import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: replace with real auth
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-gradient-to-br from-indigo-50 to-cyan-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 text-center">Sign in</h2>

        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500"
          required
        />

        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl mb-6 focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="mb-4">
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:brightness-105 transition">Sign in</button>
        </div>

        <p className="text-sm text-slate-600 text-center">New here? <Link to="/register" className="font-semibold text-blue-600 hover:underline">Create an account</Link></p>
      </form>
    </div>
  );
}
