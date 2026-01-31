import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, LoadScript, HeatmapLayer, InfoWindow } from "@react-google-maps/api";
import { Play, Pause } from 'lucide-react';

// Map Configuration
const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "600px",
};

const center = { lat: 22.2587, lng: 71.1924 }; // Center of Gujarat

// Pollution timeline data
const pollutionTimeline = [
  {
    label: "Normal Day",
    data: [
      { lat: 23.0225, lng: 72.5714, weight: 3, river: "Sabarmati", type: "Minor waste", score: 70 },
      { lat: 21.7051, lng: 72.9959, weight: 2, river: "Narmada", type: "Clean", score: 85 }
    ]
  },
  {
    label: "After Rainfall",
    data: [
      { lat: 23.0225, lng: 72.5714, weight: 6, river: "Sabarmati", type: "Sewage overflow", score: 50 },
      { lat: 21.1702, lng: 72.8311, weight: 5, river: "Tapi", type: "Industrial discharge", score: 55 }
    ]
  },
  {
    label: "Peak Pollution",
    data: [
      { lat: 23.0225, lng: 72.5714, weight: 9, river: "Sabarmati", type: "Toxic foam", score: 30 },
      { lat: 22.3072, lng: 73.1812, weight: 8, river: "Vishwamitri", type: "Algae bloom", score: 35 }
    ]
  }
];

export default function PollutionMap() {
  const [timeIndex, setTimeIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false); // Track if map is ready
  
  const mapRef = useRef(null);

  // Auto-play timeline
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setTimeIndex((prev) =>
        prev === pollutionTimeline.length - 1 ? 0 : prev + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  // Convert points ONLY AFTER google maps loads
  const handleMapLoad = (map) => {
    mapRef.current = map;
    setMapLoaded(true); // Set true so we can render InfoWindows safely
    updateHeatmapData();
  };

  const updateHeatmapData = () => {
    if (window.google) {
      const converted = pollutionTimeline[timeIndex].data.map((p) => ({
        location: new window.google.maps.LatLng(p.lat, p.lng),
        weight: p.weight,
        meta: p 
      }));
      setHeatmapData(converted);
    }
  };

  // Update heatmap when timeline changes
  useEffect(() => {
    if (mapLoaded) {
      updateHeatmapData();
    }
  }, [timeIndex, mapLoaded]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-full flex flex-col">
      {/* Header with Timeline Controls */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap justify-between items-center bg-slate-50 gap-4">
        
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-bold text-slate-900">River Pollution Heatmap</h2>
          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            Live Feed
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-sm font-semibold text-slate-700 bg-slate-200 px-3 py-1.5 rounded-lg">
            {pollutionTimeline[timeIndex].label}
          </div>

          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              autoPlay 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {autoPlay ? (
              <>
                <Pause className="w-3 h-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span>Play Timeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Google Map Container */}
      <div className="flex-1 w-full relative min-h-[500px]">
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          libraries={["visualization"]}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={7}
            onLoad={handleMapLoad}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              styles: [
                {
                  featureType: "water",
                  elementType: "geometry",
                  stylers: [{ color: "#e9e9e9" }, { lightness: 17 }]
                },
                {
                  featureType: "landscape",
                  elementType: "geometry",
                  stylers: [{ color: "#f5f5f5" }, { lightness: 20 }]
                }
              ]
            }}
          >
            {/* 1. HEATMAP LAYER */}
            {heatmapData.length > 0 && (
              <HeatmapLayer
                data={heatmapData}
                options={{
                  radius: 40,
                  opacity: 0.8,
                }}
              />
            )}

            {/* 2. INFO WINDOWS (MARKERS) - FIXED ERROR HERE */}
            {mapLoaded && pollutionTimeline[timeIndex].data.map((p, idx) => (
                <InfoWindow
                  key={idx}
                  position={{ lat: p.lat, lng: p.lng }}
                  options={{
                    // Safe check: Only create Size if window.google exists
                    pixelOffset: window.google 
                      ? new window.google.maps.Size(0, -10) 
                      : undefined,
                    disableAutoPan: true
                  }}
                >
                  <div className="p-1 min-w-[150px]">
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{p.river} River</h4>
                    <div className="space-y-1">
                        <p className="text-xs text-slate-600">
                            <span className="font-semibold">Pollution:</span> {p.type}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">Health Score:</span>
                            <span className={`font-bold ${p.score < 50 ? 'text-red-600' : 'text-green-600'}`}>
                                {p.score}/100
                            </span>
                        </div>
                    </div>
                  </div>
                </InfoWindow>
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}