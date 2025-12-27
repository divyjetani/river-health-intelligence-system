import { Eye, ChartBar, MapPin, TrendingUp, Brain, AlertCircle } from 'lucide-react';

const features = [
  {
    icon: ChartBar,
    title: 'River Health Score',
    description: 'AI-powered scoring system (0-100) based on water color metrics, pollution density, foam detection, and flow analysis.',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: MapPin,
    title: 'Spatial Pollution Heatmaps',
    description: 'Interactive geographic mapping of clean zones, moderately polluted areas, and critical red-alert hotspots.',
    color: 'from-teal-500 to-teal-600',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Alerts',
    description: 'Forecast pollution risks using weather data, historical patterns, and visual trends to prevent environmental disasters.',
    color: 'from-emerald-500 to-emerald-600',
  },
];

export default function Features() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
            Intelligent Features
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive ML-driven system for river health monitoring and pollution prevention
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-2xl border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-200 to-cyan-200 bg-opacity-30 rounded-3xl p-8 text-center text-black shadow border-blue-300 border">
          <h3 className="text-3xl font-bold mb-4">
            Detecting Visible Pollutants
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20">
              <p className="font-semibold text-lg">Plastic Waste</p>
              <p className="text-slate-600 text-sm mt-2">Bags, bottles, Styrofoam</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20">
              <p className="font-semibold text-lg">Toxic Foam</p>
              <p className="text-slate-600 text-sm mt-2">Chemical accumulation</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20">
              <p className="font-semibold text-lg">Water Discoloration</p>
              <p className="text-slate-600 text-sm mt-2">Black, green, oily layers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20">
              <p className="font-semibold text-lg">Debris Clusters</p>
              <p className="text-slate-600 text-sm mt-2">Sedimentation analysis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
