import { useState, useEffect } from 'react';
import HealthScore from './dashboard/HealthScore';
import PollutionMap from './dashboard/PollutionMap';
import LiveDetection from './dashboard/LiveDetection';
import AlertPanel from './dashboard/AlertPanel';
import AnalyticsCharts from './dashboard/AnalyticsCharts';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">River Health Dashboard</h1>
            <p className="text-slate-600 mt-1">Real-time monitoring and analytics</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Live Updates</div>
            <div className="text-lg font-semibold text-slate-900">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <HealthScore />
            <PollutionMap />
            <AnalyticsCharts />
          </div>
          <div className="space-y-6">
            <AlertPanel />
            <LiveDetection />
          </div>
        </div>
      </div>
    </div>
  );
}
