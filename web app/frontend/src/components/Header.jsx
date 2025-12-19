import { Droplet, Gauge, CloudUpload } from 'lucide-react';

export default function Header({ currentView, onNavigate }) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 group"
          >
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              RiverGuard AI
            </span>
          </button>

          <nav className="flex items-center space-x-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentView === 'home'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                currentView === 'dashboard'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Gauge className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => onNavigate('upload')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                currentView === 'upload'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CloudUpload className="w-4 h-4" />
              <span>Upload</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
