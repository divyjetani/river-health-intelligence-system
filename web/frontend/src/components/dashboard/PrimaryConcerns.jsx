import { AlertCircle, Droplets, CloudLightning } from 'lucide-react';

export default function PrimaryConcerns() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Primary Concerns</h3>
      
      <div className="space-y-4">
        {/* Concern 1 */}
        <div className="flex items-start space-x-3">
          <div className="mt-1">
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">High plastic and waste accumulation</p>
            <p className="text-xs text-slate-500 mt-0.5">Zone A & B reporting 85% coverage</p>
          </div>
        </div>

        {/* Concern 2 */}
        <div className="flex items-start space-x-3">
          <div className="mt-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Toxic foam formation detected</p>
            <p className="text-xs text-slate-500 mt-0.5">Chemical runoff in Sector 4</p>
          </div>
        </div>

        {/* Concern 3 */}
        <div className="flex items-start space-x-3">
          <div className="mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Risk increasing due to heavy rainfall</p>
            <p className="text-xs text-slate-500 mt-0.5">Forecasted for next 12 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}