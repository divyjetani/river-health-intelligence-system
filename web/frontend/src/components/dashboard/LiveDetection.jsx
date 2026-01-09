import { Camera, CheckCircle2 } from 'lucide-react';

export default function LiveDetection() {
  const detections = [
    { type: 'Plastic Bottles', count: 23, confidence: 94, color: 'bg-red-500' },
    { type: 'Gloves', count: 8, confidence: 89, color: 'bg-amber-500' },
    { type: 'Mobiles', count: 15, confidence: 91, color: 'bg-orange-500' },
    { type: 'Net', count: 3, confidence: 87, color: 'bg-yellow-500' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Trash Detection</h3>
        {/* <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-slate-600">Active</span>
        </div> */}
      </div>

      <div className="bg-slate-900 rounded-xl overflow-hidden mb-6 relative">
        <img
          src="https://images.pexels.com/photos/2382894/pexels-photo-2382894.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="River monitoring feed"
          className="w-full h-48 object-cover"
        />
        {/* <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
          <Camera className="w-3 h-3" />
          <span>LIVE</span>
        </div> */}
        {/* <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded">
          Camera ID: RV-2024-A1
        </div> */}
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Detected Pollutants</h4>
        {detections.map((detection, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${detection.color} rounded-full`} />
                <span className="text-sm font-medium text-slate-700">{detection.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-900">{detection.count}</span>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${detection.color}`}
                  style={{ width: `${detection.confidence}%` }}
                />
              </div>
              <span className="text-xs text-slate-500">{detection.confidence}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Total Objects</span>
          <span className="font-bold text-slate-900">49 detected</span>
        </div>
        {/* <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-slate-600">Last Updated</span>
          <span className="font-medium text-slate-700">2 seconds ago</span>
        </div> */}
      </div>
    </div>
  );
}
