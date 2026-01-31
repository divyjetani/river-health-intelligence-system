import { AlertTriangle } from 'lucide-react';

export default function HealthScore() {
  const score = 42; // Example score from your design

  return (
    <div className="relative w-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg overflow-hidden mb-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
        </svg>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between relative z-10">
        
        {/* Left Side: Title & Warnings */}
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="bg-yellow-400 p-2 rounded-lg shadow-md">
            <AlertTriangle className="text-yellow-900 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide">River Score</h1>
            <div className="flex space-x-4 text-blue-100 text-sm font-medium mt-1">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-cyan-300 rounded-full mr-2"></span>
                High plastic waste
              </span>
              <span className="hidden md:flex items-center">
                <span className="w-2 h-2 bg-yellow-300 rounded-full mr-2"></span>
                Toxic foam detected
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: The Score Gauge */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center space-x-4">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Simple CSS Circle Gauge */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-white/20"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="white"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * score) / 100}
                strokeLinecap="round"
                className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-white">{score}</span>
              <span className="text-[10px] text-blue-100">/ 100</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}