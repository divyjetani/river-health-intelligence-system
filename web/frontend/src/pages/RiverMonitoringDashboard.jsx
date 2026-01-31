// import React, { useState, useEffect } from 'react';

// const RiverMonitoringDashboard = () => {
//   // State for metrics data
//   const [metrics, setMetrics] = useState({
//     riversMonitored: 42,
//     highRiskZones: 6,
//     warnings: 10,
//     avgHealthScore: 74
//   });

//   // State for rivers data
//   const [rivers, setRivers] = useState([
//     { name: 'Musi', healthScore: 75, pollutionType: 'Foam', trend: 'Stable' },
//     { name: 'Yamuna', healthScore: 68, pollutionType: 'Plastic', trend: 'Increasing' },
//     { name: 'Ganga', healthScore: 72, pollutionType: 'Industrial', trend: 'Stable' },
//     { name: 'Sabarmati', healthScore: 81, pollutionType: 'Sewage', trend: 'Decreasing' }
//   ]);

//   // State for priority actions
//   const [priorityActions, setPriorityActions] = useState([
//     { river: 'Yamuna', riskLevel: 'High' },
//     { river: 'Ganga', riskLevel: 'High' },
//     { river: 'Musi', riskLevel: 'Medium' },
//     { river: 'Sabarmati', riskLevel: 'Medium' }
//   ]);

//   // State for environmental risk forecast
//   const [riskForecast, setRiskForecast] = useState({
//     riskLevel: 'HIGH',
//     reason: 'Heavy rainfall - oil washing waste',
//     impact: 'Foam bubbles, oxygen drop',
//     recommendedActions: [
//       'Deploy cleanup team to Zone-B',
//       'Install trash trap near bridge',
//       'Increase monitoring after rainfall'
//     ]
//   });

//   // State for primary concerns
//   const [primaryConcerns, setPrimaryConcerns] = useState([
//     'High plastic and waste accumulation',
//     'Toxic foam formation detected',
//     'Risk increasing due to heavy rainfall'
//   ]);

//   // Simulate live updates
//   useEffect(() => {
//     const interval = setInterval(() => {
//       // Simulate updating warnings count
//       setMetrics(prev => ({
//         ...prev,
//         warnings: prev.warnings + Math.floor(Math.random() * 2)
//       }));
//     }, 10000); // Update every 10 seconds

//     return () => clearInterval(interval);
//   }, []);

//   // Function to get risk level color
//   const getRiskColor = (riskLevel) => {
//     switch (riskLevel.toLowerCase()) {
//       case 'high':
//         return 'bg-red-100 text-red-800 border-red-300';
//       case 'medium':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-300';
//       case 'low':
//         return 'bg-green-100 text-green-800 border-green-300';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-300';
//     }
//   };

//   // Function to get health score color
//   const getHealthScoreColor = (score) => {
//     if (score >= 80) return 'text-green-600';
//     if (score >= 60) return 'text-yellow-600';
//     return 'text-red-600';
//   };

//   // Function to get trend indicator
//   const getTrendIndicator = (trend) => {
//     if (trend === 'Increasing') return '↗';
//     if (trend === 'Decreasing') return '↘';
//     return '→';
//   };

//   // Function to get trend color
//   const getTrendColor = (trend) => {
//     if (trend === 'Increasing') return 'text-red-500';
//     if (trend === 'Decreasing') return 'text-green-500';
//     return 'text-gray-500';
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <header className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">River Score</h1>
//           <p className="text-gray-600">Real-time monitoring and risk assessment for Indian rivers</p>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Primary Concerns & Map */}
//           <div className="lg:col-span-2">
//             {/* Primary Concerns */}
//             <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Primary Concerns</h2>
//               <ul className="space-y-3">
//                 {primaryConcerns.map((concern, index) => (
//                   <li key={index} className="flex items-start">
//                     <span className="inline-block w-3 h-3 bg-red-500 rounded-full mt-1 mr-3 flex-shrink-0"></span>
//                     <span className="text-gray-700">{concern}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Map Section */}
//             <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">River Network Map</h2>
//               <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg overflow-hidden border-2 border-gray-300">
//                 {/* Simplified map representation */}
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="text-center">
//                     <div className="text-gray-700 font-medium mb-2">India River Network</div>
//                     <div className="text-gray-500 text-sm">Highlighted areas show high-risk zones</div>
//                   </div>
//                 </div>
                
//                 {/* River lines on the map */}
//                 <div className="absolute top-1/4 left-1/4 w-1/2 h-1 bg-blue-400 transform rotate-12"></div>
//                 <div className="absolute top-1/3 left-1/3 w-1/3 h-1 bg-blue-400 transform -rotate-6"></div>
//                 <div className="absolute top-1/2 right-1/4 w-1/3 h-1 bg-blue-400 transform rotate-3"></div>
                
//                 {/* High risk zone indicators */}
//                 <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
//                 <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
//                 <div className="absolute bottom-1/4 left-2/5 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
//               </div>
//               <div className="mt-4 text-gray-600 text-sm">
//                 <span className="inline-flex items-center mr-4">
//                   <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span> High Risk Zone
//                 </span>
//                 <span className="inline-flex items-center">
//                   <span className="w-3 h-3 bg-blue-400 rounded-full mr-1"></span> River Flow
//                 </span>
//               </div>
//             </div>

//             {/* Environmental Risk Forecast */}
//             <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-md p-6 border-l-4 border-red-500">
//               <div className="flex items-center mb-4">
//                 <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
//                   <span className="text-white font-bold">⚠️</span>
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-800">Environmental Risk Forecast</h2>
//               </div>
              
//               <div className="mb-4">
//                 <div className="inline-block px-4 py-1 bg-red-500 text-white font-bold rounded-full mb-2">
//                   Next 48 hrs Risk: {riskForecast.riskLevel}
//                 </div>
//                 <div className="mt-3">
//                   <p className="font-medium text-gray-800">Reason: <span className="font-normal">{riskForecast.reason}</span></p>
//                   <p className="font-medium text-gray-800 mt-1">Impact: <span className="font-normal">{riskForecast.impact}</span></p>
//                 </div>
//               </div>
              
//               <div>
//                 <h3 className="font-bold text-gray-800 mb-2">Recommended Actions</h3>
//                 <ul className="space-y-2">
//                   {riskForecast.recommendedActions.map((action, index) => (
//                     <li key={index} className="flex items-start">
//                       <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
//                       <span className="text-gray-700">{action}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Metrics, River Details, Priority Actions */}
//           <div className="space-y-6">
//             {/* Metrics Table */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">River Metrics</h2>
//               <div className="space-y-4">
//                 {[
//                   { label: 'Rivers Monitored', value: metrics.riversMonitored, unit: '' },
//                   { label: 'High Risk Zones', value: metrics.highRiskZones, unit: '' },
//                   { label: 'Warnings', value: metrics.warnings, unit: '', isWarning: true },
//                   { label: 'Avg Health Score', value: metrics.avgHealthScore, unit: '/100' }
//                 ].map((metric, index) => (
//                   <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
//                     <span className="text-gray-700">{metric.label}</span>
//                     <span className={`text-xl font-bold ${metric.isWarning ? 'text-red-600' : 'text-gray-800'}`}>
//                       {metric.value}
//                       {metric.unit && <span className="text-sm font-normal text-gray-600">{metric.unit}</span>}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* River Health Details */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">River Health Details</h2>
//               <div className="space-y-5">
//                 {rivers.map((river, index) => (
//                   <div key={index} className={`p-4 rounded-lg ${index === 0 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
//                     <div className="flex justify-between items-center mb-2">
//                       <h3 className="font-bold text-lg text-gray-800">{river.name}</h3>
//                       <div className="flex items-center">
//                         <span className={`text-xl font-bold mr-2 ${getHealthScoreColor(river.healthScore)}`}>
//                           {river.healthScore}
//                         </span>
//                         <span className="text-gray-500 text-sm">/100</span>
//                       </div>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <div>
//                         <span className="text-gray-600">Pollution: </span>
//                         <span className="font-medium">{river.pollutionType}</span>
//                       </div>
//                       <div className={`flex items-center ${getTrendColor(river.trend)}`}>
//                         <span className="mr-1">{getTrendIndicator(river.trend)}</span>
//                         <span>{river.trend}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Priority Actions */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Priority Actions</h2>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-gray-200">
//                       <th className="text-left py-2 text-gray-700 font-medium">Priority Action</th>
//                       <th className="text-left py-2 text-gray-700 font-medium">River</th>
//                       <th className="text-left py-2 text-gray-700 font-medium">Risk Level</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {priorityActions.map((action, index) => (
//                       <tr key={index} className="border-b border-gray-100 last:border-0">
//                         <td className="py-3">Cleanup Initiative</td>
//                         <td className="py-3 font-medium">{action.river}</td>
//                         <td className="py-3">
//                           <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(action.riskLevel)}`}>
//                             {action.riskLevel}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Last Updated */}
//             <div className="text-center text-gray-500 text-sm">
//               <p>Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
//               <p className="mt-1">Data updates every 10 seconds</p>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <footer className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
//           <p>River Monitoring Dashboard • Real-time environmental risk assessment system</p>
//           <p className="mt-1">For official use only • Contact support for emergency alerts</p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default RiverMonitoringDashboard;


import React from "react";

export default function RiverMonitoringDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 p-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl shadow p-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">NADIQ</span>
          <div className="flex items-center gap-2 text-teal-600 font-semibold">
            <span className="text-2xl">⚠️</span>
            <span className="text-2xl">River Score</span>
          </div>
        </div>
        <input
          type="text"
          placeholder=""
          className="w-1/2 rounded-full border px-4 py-2 focus:outline-none"
        />
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-8 border-gray-200" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">42</div>
              <div className="text-xs">/ 100</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column */}
        <div className="col-span-3 space-y-4">
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="font-semibold mb-2">Primary Concerns</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-teal-500 rounded-full" />High plastic and waste accumulation</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-yellow-400 rounded-full" />Toxic foam formation detected</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" />Risk increasing due to heavy rainfall</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="font-semibold mb-2">Environmental Risk Forecast</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⚠️</span>
              <span className="font-bold text-orange-500">HIGH</span>
            </div>
            <p className="text-sm mb-2">Reason: Heavy rainfall - w/ existing state</p>
            <p className="text-sm mb-3">Impact: Foam buildup, oxygen drop</p>
            <h4 className="font-semibold text-sm mb-1">Recommended Actions</h4>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full" />Deploy cleanup team to Zone-8</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-yellow-400 rounded-full" />Install trash trap near bridge</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" />Increase monitoring after rainfall</li>
            </ul>
          </div>
        </div>

        {/* Center Map Placeholder */}
        <div className="col-span-6 bg-white rounded-2xl shadow flex items-center justify-center relative">
          <div className="absolute bottom-6 right-6 bg-sky-500 text-white p-4 rounded-xl shadow-lg text-sm">
            <div className="font-semibold">River: Random River</div>
            <div>Health Score: 55</div>
            <div>Pollution Type: Chemical</div>
            <div>Trend: Declining</div>
          </div>
          <span className="text-gray-400">Map Area (Empty)</span>
        </div>

        {/* Right Column */}
        <div className="col-span-3 space-y-4">
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="font-semibold mb-2">Metric</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr><td>Rivers Monitored</td><td className="text-right">42</td></tr>
                <tr><td>High Risk Zones</td><td className="text-right">9</td></tr>
                <tr><td>Warnings</td><td className="text-right">10</td></tr>
                <tr><td>Avg Health Score</td><td className="text-right">74/100</td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-teal-500 text-white rounded-2xl shadow p-4">
            <h3 className="font-semibold mb-2">Priority Action</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr><td>Yamuna</td><td className="text-right font-semibold">High</td></tr>
                <tr><td>Ganga</td><td className="text-right font-semibold">High</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
