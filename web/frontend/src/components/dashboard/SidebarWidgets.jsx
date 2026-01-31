import React from 'react';
import { AlertTriangle, TrendingUp, AlertCircle, Droplets } from 'lucide-react';

// --- LEFT SIDE WIDGETS ---

export function PrimaryConcerns() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-4">
      <h3 className="font-bold text-slate-700 mb-3 border-b pb-2">Primary Concerns</h3>
      <ul className="space-y-3 text-sm">
        <li className="flex items-start space-x-2">
          <span className="w-2 h-2 mt-1.5 bg-cyan-500 rounded-full flex-shrink-0" />
          <span className="text-slate-600">High plastic and waste accumulation</span>
        </li>
        <li className="flex items-start space-x-2">
          <span className="w-2 h-2 mt-1.5 bg-yellow-400 rounded-full flex-shrink-0" />
          <span className="text-slate-600">Toxic foam formation detected</span>
        </li>
        <li className="flex items-start space-x-2">
          <span className="w-2 h-2 mt-1.5 bg-green-500 rounded-full flex-shrink-0" />
          <span className="text-slate-600">Risk increasing due to heavy rainfall</span>
        </li>
      </ul>
    </div>
  );
}

export function RiskForecast() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
      <h3 className="font-bold text-slate-700 mb-3">Environmental Risk Forecast</h3>
      
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-yellow-100 p-2 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-bold">Next 48 hrs Risk</div>
          <div className="text-xl font-bold text-yellow-500">HIGH</div>
        </div>
      </div>

      <div className="space-y-2 text-xs mb-4">
        <p><span className="font-bold text-slate-700">Reason:</span> <span className="text-slate-500">Heavy rainfall - w/ existing waste</span></p>
        <p><span className="font-bold text-slate-700">Impact:</span> <span className="text-slate-500">Foam buildup, oxygen drop</span></p>
      </div>

      <div className="bg-slate-50 p-3 rounded-md">
        <h4 className="font-bold text-slate-700 text-xs mb-2">Recommended Actions</h4>
        <ul className="space-y-1 text-xs text-slate-600">
          <li className="flex items-center"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>Deploy cleanup team to Zone-B</li>
          <li className="flex items-center"><span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>Install trash trap near bridge</li>
          <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Increase monitoring after rainfall</li>
        </ul>
      </div>
    </div>
  );
}

// --- RIGHT SIDE WIDGETS ---

export function MetricTable() {
  return (
    <div className="border-2 border-cyan-500 rounded-lg overflow-hidden bg-white shadow-sm mb-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white border-b-2 border-slate-800">
            <th className="text-left p-2 font-bold text-slate-900">Metric</th>
            <th className="text-right p-2 font-bold text-slate-900">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <tr>
            <td className="p-2 font-medium text-slate-700">Rivers Monitored</td>
            <td className="p-2 text-right font-bold text-slate-900">42</td>
          </tr>
          <tr>
            <td className="p-2 font-medium text-slate-700">High Risk Zones</td>
            <td className="p-2 text-right font-bold text-slate-900">6</td>
          </tr>
          <tr>
            <td className="p-2 font-medium text-slate-700">Warnings</td>
            <td className="p-2 text-right font-bold text-slate-900">10</td>
          </tr>
          <tr>
            <td className="p-2 font-medium text-slate-700">Avg Health Score</td>
            <td className="p-2 text-right font-bold text-slate-900">74/100</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function PriorityActionTable() {
  return (
    <div className="border-2 border-black rounded-lg overflow-hidden bg-cyan-500 shadow-sm">
      <div className="bg-cyan-500 p-2 text-center font-bold text-slate-900 border-b-2 border-black">
        Priority Action
      </div>
      <div className="bg-black text-white flex justify-between px-3 py-1 text-sm font-bold">
        <span>River</span>
        <span>Risk Level</span>
      </div>
      <div className="bg-cyan-500 p-3 space-y-2">
        <div className="flex justify-between items-center text-white text-sm font-medium">
          <span>Yamuna</span>
          <span className="font-bold">High</span>
        </div>
        <div className="flex justify-between items-center text-white text-sm font-medium">
          <span>Ganga</span>
          <span className="font-bold">High</span>
        </div>
      </div>
    </div>
  );
}