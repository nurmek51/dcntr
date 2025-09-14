import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { checkHint, getMockHintResponse, type HintResponse } from '../services/hintApi';
import { DEFAULT_MAP_CENTER } from '../utils/coordinates';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Coordinates {
  lat: number;
  lng: number;
}

interface TripPackage {
  id: string;
  routeName: string;
  distance: number;
  estimatedTime: string;
  fuelConsumption: number;
  fuelCost: number;
  passengerPrice: number;
  route: Array<{ lat: number; lng: number }>;
}

interface Prediction {
  cluster_id: number;
  probability: number;
  cluster_center: Coordinates;
}

interface HeatmapCluster {
  cluster_id: number;
  start_center: Coordinates;
  trip_count: number;
  avg_distance: number;
}

interface MapViewProps {
  mode: 'prediction' | 'heatmap';
  coordinates: Coordinates | null;
  selectedPackage: TripPackage | null;
  predictions: Prediction[];
  heatmapClusters: HeatmapCluster[];
}

// Custom marker icons
const createCustomIcon = (color: string, size: 'small' | 'medium' | 'large' = 'medium') => {
  const sizes = {
    small: [20, 32],
    medium: [25, 41],
    large: [32, 52],
  };
  
  const [width, height] = sizes[size];
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${width}px;
        height: ${height}px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -height],
  });
};

// Component to handle map clicks
const MapClickHandler: React.FC<{
  mode: 'prediction' | 'heatmap';
  onMapClick: (coordinates: Coordinates) => void;
}> = ({ mode, onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (mode === 'heatmap') {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
};

// Hint popup component
const HintPopup: React.FC<{
  hint: HintResponse;
  coordinates: Coordinates;
  onClose: () => void;
}> = ({ hint, coordinates, onClose }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="fixed top-4 right-4 bg-white rounded-[16px] shadow-[3px_4px_4px_rgba(0,0,0,0.2)] p-6 max-w-sm z-[1000]"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-[18px] text-black">Location Hint</h3>
      <button
        onClick={onClose}
        className="text-[#858898] hover:text-black text-[20px] leading-none"
      >
        ×
      </button>
    </div>
    
    <div className="space-y-3 mb-4">
      <div className="flex justify-between">
        <span className="text-[14px] text-[#858898]">Order Probability:</span>
        <span className="font-semibold text-black">{(hint.order_probability * 100).toFixed(1)}%</span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-[14px] text-[#858898]">Confidence:</span>
        <span className={`font-semibold ${
          hint.confidence_level === 'High' ? 'text-green-600' :
          hint.confidence_level === 'Medium' ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {hint.confidence_level}
        </span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-[14px] text-[#858898]">Nearby Destinations:</span>
        <span className="font-semibold text-black">{hint.nearby_demand_count}</span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-[14px] text-[#858898]">Hint Score:</span>
        <span className="font-semibold text-black">{hint.hint_score.toFixed(1)}</span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-[14px] text-[#858898]">Search Radius:</span>
        <span className="font-semibold text-black">{hint.search_radius_km} km</span>
      </div>
    </div>
    
    {/* Nearby Destinations */}
    {hint.nearby_destinations.length > 0 && (
      <div className="mb-4">
        <h4 className="font-semibold text-[14px] text-black mb-2">Nearby Destinations:</h4>
        <div className="space-y-1">
          {hint.nearby_destinations.map((dest, index) => (
            <div key={index} className="flex justify-between text-[12px]">
              <span className="text-[#858898]">{dest.area}</span>
              <span className="text-black font-medium">{dest.distance_km.toFixed(2)} km</span>
            </div>
          ))}
        </div>
      </div>
    )}
    
    <div className="p-3 bg-gray-50 rounded-[8px] mb-4">
      <p className="text-[12px] text-[#858898] mb-1">Recommendation:</p>
      <p className="text-[14px] text-black">{hint.recommendation}</p>
    </div>
    
    <div className="text-[12px] text-[#858898]">
      Location: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
    </div>
  </motion.div>
);

const MapView: React.FC<MapViewProps> = ({
  mode,
  coordinates,
  selectedPackage,
  predictions,
  heatmapClusters
}) => {
  const [hintInfo, setHintInfo] = useState<{ hint: HintResponse; coordinates: Coordinates } | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  // Default center (Package 2, Point 2: 51°05'54.3"N 71°24'21.2"E)
  const mapCenter = coordinates || DEFAULT_MAP_CENTER;

  const handleMapClick = async (clickedCoordinates: Coordinates) => {
    if (mode === 'heatmap') {
      setIsLoadingHint(true);
      try {
        // Try to call the real API first, fall back to mock data
        let hint: HintResponse;
        try {
          hint = await checkHint({
            lat: clickedCoordinates.lat,
            lng: clickedCoordinates.lng,
            radius_km: 0.5
          });
        } catch (error) {
          console.warn('API call failed, using mock data:', error);
          hint = getMockHintResponse(clickedCoordinates.lat, clickedCoordinates.lng);
        }
        
        setHintInfo({ hint, coordinates: clickedCoordinates });
      } catch (error) {
        console.error('Failed to get hint information:', error);
      } finally {
        setIsLoadingHint(false);
      }
    }
  };

  const getHeatmapColor = (tripCount: number, maxTripCount: number) => {
    const intensity = tripCount / maxTripCount;
    
    if (intensity >= 0.8) return '#dc2626'; // Red for top 20%
    if (intensity >= 0.6) return '#ea580c'; // Orange for next 20%
    if (intensity >= 0.4) return '#d97706'; // Amber for next 20%
    if (intensity >= 0.2) return '#ca8a04'; // Yellow for next 20%
    return '#65a30d'; // Lime for bottom 20%
  };

  const getHeatmapRadius = (tripCount: number, maxTripCount: number) => {
    const minRadius = 50;
    const maxRadius = 200;
    const intensity = tripCount / maxTripCount;
    return minRadius + (maxRadius - minRadius) * intensity;
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={13}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler mode={mode} onMapClick={handleMapClick} />

        {/* Current location marker */}
        {coordinates && (
          <Marker
            position={[coordinates.lat, coordinates.lng]}
            icon={createCustomIcon('#3b82f6', 'large')}
          >
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
                <br />
                {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Selected package route */}
        {selectedPackage && (
          <>
            {/* Route markers */}
            {selectedPackage.route.map((point, index) => (
              <Marker
                key={`route-${selectedPackage.id}-${index}`}
                position={[point.lat, point.lng]}
                icon={createCustomIcon(
                  index === 0 ? '#22c55e' : // Green for start
                  index === selectedPackage.route.length - 1 ? '#ef4444' : // Red for end
                  '#3b82f6', // Blue for intermediate points
                  index === 0 || index === selectedPackage.route.length - 1 ? 'large' : 'small'
                )}
              >
                <Popup>
                  <div>
                    <strong>
                      {selectedPackage.routeName} - {
                        index === 0 ? 'Start' :
                        index === selectedPackage.route.length - 1 ? 'End' :
                        `Point ${index + 1}`
                      }
                    </strong>
                    <br />
                    Coordinates: {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                    {index === 0 && (
                      <>
                        <br />
                        Total Distance: {selectedPackage.distance.toFixed(1)} km
                        <br />
                        Estimated Time: {selectedPackage.estimatedTime}
                        <br />
                        Passenger Price: {selectedPackage.passengerPrice} ₸
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Route polyline */}
            <Polyline
              positions={selectedPackage.route.map(point => [point.lat, point.lng])}
              color="#3b82f6"
              weight={5}
              opacity={0.8}
              dashArray="10, 5"
            />
          </>
        )}

        {/* Prediction markers */}
        {mode === 'prediction' && predictions.map((prediction, index) => (
          <Marker
            key={`prediction-${index}`}
            position={[prediction.cluster_center.lat, prediction.cluster_center.lng]}
            icon={createCustomIcon('#8b5cf6', 'medium')}
          >
            <Popup>
              <div>
                <strong>Cluster #{prediction.cluster_id}</strong>
                <br />
                Probability: {(prediction.probability * 100).toFixed(1)}%
                <br />
                Coordinates: {prediction.cluster_center.lat.toFixed(4)}, {prediction.cluster_center.lng.toFixed(4)}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Heatmap clusters */}
        {mode === 'heatmap' && heatmapClusters.length > 0 && (() => {
          const maxTripCount = Math.max(...heatmapClusters.map(c => c.trip_count));
          return heatmapClusters.map((cluster) => (
            <Circle
              key={`heatmap-${cluster.cluster_id}`}
              center={[cluster.start_center.lat, cluster.start_center.lng]}
              radius={getHeatmapRadius(cluster.trip_count, maxTripCount)}
              fillColor={getHeatmapColor(cluster.trip_count, maxTripCount)}
              fillOpacity={0.6}
              stroke={true}
              color={getHeatmapColor(cluster.trip_count, maxTripCount)}
              weight={2}
            >
              <Popup>
                <div>
                  <strong>Start Zone #{cluster.cluster_id}</strong>
                  <br />
                  Trip Count: {cluster.trip_count.toLocaleString()}
                  <br />
                  Avg Distance: {cluster.avg_distance.toFixed(4)} km
                  <br />
                  <em className="text-sm text-gray-600">Click anywhere on map for location hints</em>
                </div>
              </Popup>
            </Circle>
          ));
        })()}
      </MapContainer>

      {/* Loading indicator for hint */}
      {isLoadingHint && (
        <div className="absolute top-4 right-4 bg-white rounded-[8px] shadow-lg p-3 z-[1000]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            <span className="text-[14px] text-[#858898]">Analyzing location...</span>
          </div>
        </div>
      )}

      {/* Hint popup */}
      <AnimatePresence>
        {hintInfo && (
          <HintPopup
            hint={hintInfo.hint}
            coordinates={hintInfo.coordinates}
            onClose={() => setHintInfo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapView;
