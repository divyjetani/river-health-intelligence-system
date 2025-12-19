import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Features from './components/Features';
import Upload from './components/Upload';
import Footer from './components/Footer';

function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header currentView={currentView} onNavigate={setCurrentView} />

      {currentView === 'home' && (
        <>
          <Hero onGetStarted={() => setCurrentView('dashboard')} />
          <Features />
        </>
      )}

      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'upload' && <Upload />}

      <Footer />
    </div>
  );
}

export default App;
