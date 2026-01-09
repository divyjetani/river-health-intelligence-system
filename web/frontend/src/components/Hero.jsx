import { ArrowRight, TriangleAlert, TrendingDown, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            {/* <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span>Clean Energy & Sustainability</span>
            </div> */}

            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Real-Time River
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Health Intelligence
              </span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed">
              AI-powered computer vision system that automatically detects pollution,
              analyzes water quality, and forecasts environmental risks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
              >
                <span>View Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="inline-flex items-center justify-center space-x-2 bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold border-2 border-slate-200 hover:border-blue-300 hover:bg-slate-50 transition-all">
                <span>Learn More</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-red-600">
                  <TriangleAlert className="w-5 h-5" />
                  <span className="text-2xl font-bold">78%</span>
                </div>
                <p className="text-sm text-slate-600">Rivers Polluted</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-amber-600">
                  <TrendingDown className="w-5 h-5" />
                  <span className="text-2xl font-bold">Manual</span>
                </div>
                <p className="text-sm text-slate-600">Current Systems</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-green-600">
                  <Clock className="w-5 h-5" />
                  <span className="text-2xl font-bold">24/7</span>
                </div>
                <p className="text-sm text-slate-600">AI Monitoring</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-gradient-to-br from-blue-200 to-cyan-200 rounded-xl p-2 shadow-2xl">
              <img
                src="hero-img.png"
                alt="River monitoring"
                className="rounded-xl w-full h-full shadow-lg"
              />
              {/* <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-slate-700">Live Monitoring Active</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
