import { AlertTriangle, CloudRain, TrendingUp, Bell } from 'lucide-react';

export default function AlertPanel() {
  const alerts = [
    {
      type: 'critical',
      icon: AlertTriangle,
      title: 'High Pollution Spike',
      message: 'Zone A showing 95% pollution index',
      time: '5 min ago',
    },
    {
      type: 'warning',
      icon: CloudRain,
      title: 'Foam Formation Risk',
      message: 'Heavy rainfall predicted in next 48 hours',
      time: '23 min ago',
    },
    {
      type: 'info',
      icon: TrendingUp,
      title: 'Pollution Trend Alert',
      message: 'Zone D pollution increased by 15% this week',
      time: '1 hour ago',
    },
  ];

  const getAlertStyles = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  const getIconStyles = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-100 text-red-600';
      case 'warning':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Predictive Alerts</h3>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`border rounded-xl p-4 ${getAlertStyles(alert.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${getIconStyles(alert.type)}`}>
                <alert.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 mb-1">{alert.title}</h4>
                <p className="text-sm text-slate-600 mb-2">{alert.message}</p>
                <span className="text-xs text-slate-500">{alert.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition-colors">
        View All Alerts
      </button>
    </div>
  );
}
