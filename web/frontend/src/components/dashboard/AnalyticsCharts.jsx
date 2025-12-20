import { TrendingUp, Activity } from 'lucide-react';

export default function AnalyticsCharts() {
  const weeklyData = [
    { day: 'Mon', score: 58, pollutants: 35 },
    { day: 'Tue', score: 52, pollutants: 45 },
    { day: 'Wed', score: 48, pollutants: 52 },
    { day: 'Thu', score: 45, pollutants: 58 },
    { day: 'Fri', score: 42, pollutants: 65 },
    { day: 'Sat', score: 40, pollutants: 68 },
    { day: 'Sun', score: 42, pollutants: 62 },
  ];

  const maxPollutants = Math.max(...weeklyData.map(d => d.pollutants));

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Weekly Trends</h2>
          <p className="text-slate-600 text-sm mt-1">Health score vs pollutant detection</p>
        </div>
        <div className="flex items-center space-x-2 text-red-600">
          <TrendingUp className="w-5 h-5" />
          <span className="font-semibold">-16 points</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-6">
        {weeklyData.map((data, index) => (
          <div key={index} className="space-y-2">
            <div className="relative h-48 bg-slate-100 rounded-lg overflow-hidden">
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-500 to-red-400 transition-all duration-500"
                style={{ height: `${(data.pollutants / maxPollutants) * 100}%` }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-cyan-400 mix-blend-screen transition-all duration-500"
                style={{ height: `${data.score}%` }}
              />
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-slate-600">{data.day}</div>
              <div className="text-lg font-bold text-slate-900">{data.score}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Avg Health Score</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">47</div>
          <div className="text-xs text-slate-600 mt-1">This week</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-slate-700">Avg Pollutants</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">55</div>
          <div className="text-xs text-slate-600 mt-1">Objects/day</div>
        </div>
      </div>
    </div>
  );
}
