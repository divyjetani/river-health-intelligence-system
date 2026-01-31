import React from 'react';
import HealthScore from '../components/dashboard/HealthScore';
import PollutionMap from '../components/dashboard/PollutionMap';
import LiveDetection from '../components/dashboard/LiveDetection';
import AlertPanel from '../components/dashboard/AlertPanel';
import SearchBar from '../components/dashboard/SearchBar';
import PrimaryConcerns from '../components/dashboard/PrimaryConcerns';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      
      {/* 1. Header Section */}
      <HealthScore />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2. Search Bar (Centered) */}
        <SearchBar />

        {/* 3. Main 3-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* --- LEFT COLUMN (Primary Concerns & Risk Forecast) --- */}
          <div className="lg:col-span-3 space-y-6 flex flex-col h-full">
            <PrimaryConcerns />
            {/* Moving AlertPanel here to match the "Environmental Risk Forecast" position in your image */}
            <AlertPanel />
          </div>

          {/* --- MIDDLE COLUMN (Map) --- */}
          <div className="lg:col-span-6 h-full min-h-[600px]">
            <PollutionMap />
          </div>

          {/* --- RIGHT COLUMN (Metrics & Actions) --- */}
          <div className="lg:col-span-3 space-y-6 flex flex-col h-full">
            <LiveDetection />
            {/* You can add a PriorityActions component here if you have one, 
                otherwise LiveDetection sits here alone or with other charts */}
          </div>
        </div>
      </div>
    </div>
  );
}
