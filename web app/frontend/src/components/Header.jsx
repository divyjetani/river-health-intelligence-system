import { NavLink } from 'react-router-dom';
import { Gauge, CloudUpload } from 'lucide-react';

export default function Header() {
  const linkClass = (isActive) =>
    `relative px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${isActive ? 'text-blue-800 after:content-["\""] after:block after:absolute after:left-0 after:bottom-1 after:h-1 after:bg-blue-600 after:rounded-full after:transition-all after:duration-300 after:w-full' : 'text-slate-600 hover:text-slate-800 after:content-["\""] after:block after:absolute after:left-0 after:bottom-1 after:h-1 after:bg-blue-600 after:rounded-full after:transition-all after:duration-300 after:w-0'}`;

  return (
    <header className="bg-blue-200/70 backdrop-blur border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-3 group">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Team Cosmix
            </span>
          </NavLink>

          <nav className="flex items-center space-x-1">
            <NavLink to="/" className={({ isActive }) => linkClass(isActive)}>
              Home
            </NavLink>

            <NavLink to="/dashboard" className={({ isActive }) => `${linkClass(isActive)} flex items-center space-x-2`}>
              <Gauge className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/upload" className={({ isActive }) => `${linkClass(isActive)} flex items-center space-x-2`}>
              <CloudUpload className="w-4 h-4" />
              <span>Upload</span>
            </NavLink>

            <NavLink to="/login" className={({ isActive }) => linkClass(isActive)}>
              Login
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
} 
