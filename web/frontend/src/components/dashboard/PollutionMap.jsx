import { MapPin, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PollutionMap() {
  const zones = [
    { id: 1, name: 'Zone A - Industrial Area', status: 'critical', x: 25, y: 30, intensity: 95 },
    { id: 2, name: 'Zone B - Residential', status: 'moderate', x: 60, y: 45, intensity: 58 },
    { id: 3, name: 'Zone C - Agricultural', status: 'clean', x: 80, y: 65, intensity: 22 },
    { id: 4, name: 'Zone D - Urban Center', status: 'critical', x: 45, y: 70, intensity: 88 },
    { id: 5, name: 'Zone E - Forest Reserve', status: 'clean', x: 70, y: 25, intensity: 15 },
  ];

  const getZoneColor = (status) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500';
      case 'moderate':
        return 'bg-amber-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Heat Map</h2>
        <Link to="/dashboard/geographicmap">
        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
          <Navigation className="w-4 h-4" />
          <span>Full Map View</span>
        </button>
        </Link>
      </div>

      <div className="relative bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl h-96 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 0,50 Q 25,30 50,50 T 100,50 L 100,100 L 0,100 Z"
              fill="currentColor"
              className="text-blue-400"
            />
          </svg>
        </div>

        {zones.map((zone) => (
          <div
            key={zone.id}
            className="absolute group cursor-pointer"
            style={{ left: `${zone.x}%`, top: `${zone.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="relative">
              <div className={`${getZoneColor(zone.status)} w-6 h-6 rounded-full animate-ping absolute`} />
              <div className={`${getZoneColor(zone.status)} w-6 h-6 rounded-full border-4 border-white shadow-lg relative z-10`} />
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block z-20">
              <div className="bg-white rounded-lg shadow-xl p-4 w-48 border border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    zone.status === 'critical' ? 'bg-red-100 text-red-700' :
                    zone.status === 'moderate' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {zone.status.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">{zone.name}</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Pollution Index:</span>
                    <span className="font-semibold">{zone.intensity}/100</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        zone.status === 'critical' ? 'bg-red-500' :
                        zone.status === 'moderate' ? 'bg-amber-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${zone.intensity}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
          <h4 className="font-semibold text-slate-900 mb-3">Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-slate-700">Clean Zone (0-30)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
              <span className="text-sm text-slate-700">Moderate (31-70)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm text-slate-700">Critical (71-100)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
