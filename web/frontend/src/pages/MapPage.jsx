import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  HeatmapLayer,
  InfoWindow
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "12px"
};

const center = { lat: 22.2587, lng: 71.1924 };

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

function MapPage() {
  const [timeIndex, setTimeIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);

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
  const handleMapLoad = () => {
    const google = window.google;

    const converted = pollutionTimeline[timeIndex].data.map((p) => ({
      location: new google.maps.LatLng(p.lat, p.lng),
      weight: p.weight,
      meta: p
    }));

    setHeatmapData(converted);
  };

  // Update heatmap when timeline changes
  useEffect(() => {
    if (!window.google) return;
    handleMapLoad();
  }, [timeIndex]);

  return (
    <div style={{ paddingTop: "80px", paddingLeft: "30px", paddingRight: "30px" }}>
      <h2>River Pollution Heatmap – Gujarat</h2>

      <div style={{ marginBottom: "15px", display: "flex", gap: "15px" }}>
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            background: autoPlay ? "#d32f2f" : "#1976d2",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          {autoPlay ? "Pause" : "▶ Play Timeline"}
        </button>

        <strong>{pollutionTimeline[timeIndex].label}</strong>
      </div>

      <div
        style={{
          background: "#fff",
          padding: "15px",
          borderRadius: "14px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.15)"
        }}
      >
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          libraries={["visualization"]}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={7}
            onLoad={handleMapLoad}
          >
            {heatmapData.length > 0 && (
              <HeatmapLayer
                data={heatmapData}
                options={{ radius: 40, opacity: 0.9 }}
              />
            )}

            {selectedPoint && (
              <InfoWindow
                position={{
                  lat: selectedPoint.lat,
                  lng: selectedPoint.lng
                }}
                onCloseClick={() => setSelectedPoint(null)}
              >
                <div>
                  <h4>{selectedPoint.river} River</h4>
                  <p><strong>Pollution:</strong> {selectedPoint.type}</p>
                  <p><strong>Health Score:</strong> {selectedPoint.score}/100</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}

export default MapPage;
