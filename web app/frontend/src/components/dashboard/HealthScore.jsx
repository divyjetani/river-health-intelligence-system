import { TrendingDown, Droplets, AlertTriangle, Wind } from 'lucide-react';

export default function HealthScore() {
  const score = 42;
  const previousScore = 58;
  const change = score - previousScore;

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score) => {
    if (score >= 70) return 'from-green-500 to-emerald-500';
    if (score >= 40) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">River Health Score</h2>
        <div className="flex items-center space-x-2 text-sm">
          {change < 0 ? (
            <span className="text-red-600 font-semibold flex items-center">
              <TrendingDown className="w-4 h-4 mr-1" />
              {Math.abs(change)} points
            </span>
          ) : (
            <span className="text-green-600 font-semibold">+{change} points</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-slate-200"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${(score / 100) * 553} 553`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={`${getScoreGradient(score).split(' ')[0].replace('from-', 'text-')}`} stopColor="currentColor" />
                <stop offset="100%" className={`${getScoreGradient(score).split(' ')[1].replace('to-', 'text-')}`} stopColor="currentColor" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</div>
              <div className="text-sm text-slate-500 mt-1">/ 100</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Water Color</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">Fair</div>
          <div className="text-xs text-slate-500 mt-1">Dark green detected</div>
        </div>

        <div className="bg-red-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-slate-700">Pollution</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">High</div>
          <div className="text-xs text-slate-500 mt-1">87 objects detected</div>
        </div>

        <div className="bg-amber-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Wind className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-slate-700">Foam Level</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">Medium</div>
          <div className="text-xs text-slate-500 mt-1">3 zones affected</div>
        </div>

        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-slate-700">Flow Rate</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">Normal</div>
          <div className="text-xs text-slate-500 mt-1">2.3 m/s average</div>
        </div>
      </div>
    </div>
  );
}
