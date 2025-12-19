import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    // TODO: replace with real registration
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-gradient-to-br from-indigo-50 to-cyan-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/85 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 text-center">Create an account</h2>

        <label className="block text-sm font-medium text-slate-700 mb-2">Full name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500"
          required
        />

        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500"
          required
        />

        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500"
          required
        />

        <label className="block text-sm font-medium text-slate-700 mb-2">Confirm password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl mb-6 focus:ring-2 focus:ring-purple-500"
          required
        />

        <div className="mb-4">
          <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:brightness-105 transition">Create account</button>
        </div>

        <p className="text-sm text-slate-600 text-center">Already have an account? <Link to="/login" className="font-semibold text-purple-600 hover:underline">Sign in</Link></p>
      </form>
    </div>
  );
}
