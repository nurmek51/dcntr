import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { checkHint, getMockHintResponse, type HintResponse } from '../services/hintApi';

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
  startCoordinates: Coordinates;
  endCoordinates: Coordinates;
}

interface PassengerOrder {
  id: string;
  pickupPoint: Coordinates;
  destinationPoint: Coordinates;
  passengerInfo: {
    name: string;
    rating: number;
    phone: string;
  };
  estimatedPrice: number;
  distance: number;
  estimatedTime: string;
}

interface Prediction {
  destination_area: string;
  trip_count: number;
  percentage: number;
  coordinates: Coordinates;
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
  passengerOrders: PassengerOrder[];
}

// Modern hint popup with enhanced styling and animations
const createHintPopup = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
  const typeStyles = {
    info: {
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: '#667eea',
      icon: '💡'
    },
    success: {
      bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      border: '#4facfe',
      icon: '✨'
    },
    warning: {
      bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      border: '#fa709a',
      icon: '⚡'
    }
  };
  
  const style = typeStyles[type];
  
  return `
    <style>
      @keyframes popupSlideIn {
        0% {
          opacity: 0;
          transform: translateY(-10px) scale(0.9);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      .hint-popup {
        animation: popupSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .hint-popup:hover {
        transform: scale(1.02);
        transition: transform 0.2s ease;
      }
    </style>
    <div class="hint-popup" style="
      background: ${style.bg};
      backdrop-filter: blur(20px);
      border: 2px solid ${style.border}40;
      border-radius: 16px;
      padding: 16px 20px;
      font-family: 'Press Start 2P', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 12px;
      font-weight: 400;
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1);
      max-width: 220px;
      text-align: center;
      line-height: 1.6;
      position: relative;
      overflow: hidden;
    ">
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
        animation: shimmer 2s infinite;
      "></div>
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 4px;
      ">
        <span style="font-size: 14px;">${style.icon}</span>
        <span style="font-family: 'poppins', sans-serif; font-size: 10px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px;">Hint</span>
      </div>
      <div style="font-family: 'poppins', sans-serif; font-size: 13px; font-weight: 500;">
        ${message}
      </div>
      <style>
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      </style>
    </div>
  `;
};

// Enhanced custom marker icons with modern design
const createCustomIcon = (color: string, size: 'small' | 'medium' | 'large' = 'medium', type: 'default' | 'pulse' | 'glow' = 'default') => {
  const sizes = {
    small: [24, 36],
    medium: [32, 48],
    large: [40, 60],
  };
  
  const [width, height] = sizes[size];
  const pulseAnimation = type === 'pulse' ? 'animation: pulse 2s infinite;' : '';
  const glowEffect = type === 'glow' ? `box-shadow: 0 0 20px ${color}80, 0 4px 12px rgba(0,0,0,0.3);` : 'box-shadow: 0 4px 12px rgba(0,0,0,0.2);';
  
  return L.divIcon({
    className: 'custom-marker-enhanced',
    html: `
      <style>
        @keyframes pulse {
          0% { transform: rotate(-45deg) scale(1); }
          50% { transform: rotate(-45deg) scale(1.1); }
          100% { transform: rotate(-45deg) scale(1); }
        }
        .marker-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marker-ring {
          position: absolute;
          width: ${width + 8}px;
          height: ${width + 8}px;
          border: 2px solid ${color}40;
          border-radius: 50%;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      </style>
      <div class="marker-container">
        ${type === 'pulse' ? `<div class="marker-ring"></div>` : ''}
        <div style="
          width: ${width}px;
          height: ${height}px;
          background: linear-gradient(135deg, ${color}, ${color}dd);
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          ${glowEffect}
          ${pulseAnimation}
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        ">
          <div style="
            width: 10px;
            height: 10px;
            background-color: white;
            border-radius: 50%;
            transform: rotate(45deg);
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          "></div>
        </div>
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
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="fixed top-4 right-4 bg-[#FFFEE9] rounded-[12px] shadow-2xl border-4 border-white p-4 max-w-[300px] z-[1000]"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-['Press_Start_2P',_monospace] text-[16px] text-black drop-shadow-lg">Location Hint</h3>
      <button
        onClick={onClose}
        className="text-[#858898] hover:text-black text-[20px] leading-none transform hover:scale-110 transition-all"
      >
        ×
      </button>
    </div>
    
    <div className="space-y-3 mb-4">
      <div className="flex justify-between">
        <span className="font-poppins text-[14px] text-[#858898]">Order Probability:</span>
        <span className="font-poppins font-semibold text-black">{(hint.order_probability * 100).toFixed(1)}%</span>
      </div>
      
      <div className="flex justify-between">
        <span className="font-poppins text-[14px] text-[#858898]">Confidence:</span>
        <span className={`font-poppins font-semibold ${
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
  heatmapClusters,
  passengerOrders
}) => {
  const [hintInfo, setHintInfo] = useState<{ hint: HintResponse; coordinates: Coordinates } | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  // Default center (Almaty, Kazakhstan)
  const defaultCenter: Coordinates = { lat: 43.2220, lng: 76.8512 };
  const mapCenter = coordinates || defaultCenter;

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

  const getHeatmapColor = (tripCount: number) => {
    if (tripCount > 100) return '#ef4444'; // red-500
    if (tripCount > 50) return '#eab308'; // yellow-500
    return '#22c55e'; // green-500
  };

  const getHeatmapRadius = (tripCount: number) => {
    return Math.max(100, Math.min(500, tripCount * 2));
  };

  return (
    <div className="relative w-full h-full bg-[#FFFEE9] rounded-[12px] overflow-hidden border-4 border-white shadow-2xl">
      {/* Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#94EA0D]/20 rounded-full blur-lg" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-400/20 rounded-full blur-lg" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-400/20 rounded-full blur-md" />
      </div>
      
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={13}
        className="w-full h-full relative z-10"
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
            icon={createCustomIcon('#3b82f6', 'large', 'pulse')}
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
            <Marker
              position={[selectedPackage.startCoordinates.lat, selectedPackage.startCoordinates.lng]}
              icon={createCustomIcon('#22c55e', 'medium', 'pulse')}
            >
              <Popup>
                <div>
                  <strong>{selectedPackage.routeName} - Start</strong>
                  <br />
                  Distance: {selectedPackage.distance.toFixed(1)} km
                  <br />
                  Price: {selectedPackage.passengerPrice} ₸
                </div>
              </Popup>
            </Marker>
            
            <Marker
              position={[selectedPackage.endCoordinates.lat, selectedPackage.endCoordinates.lng]}
              icon={createCustomIcon('#ef4444', 'medium', 'glow')}
            >
              <Popup>
                <div>
                  <strong>{selectedPackage.routeName} - End</strong>
                  <br />
                  Fuel Cost: {selectedPackage.fuelCost.toFixed(0)} ₸
                  <br />
                  Time: {selectedPackage.estimatedTime}
                </div>
              </Popup>
            </Marker>
            
            <Polyline
              positions={[
                [selectedPackage.startCoordinates.lat, selectedPackage.startCoordinates.lng],
                [selectedPackage.endCoordinates.lat, selectedPackage.endCoordinates.lng]
              ]}
              color="#3b82f6"
              weight={4}
              opacity={0.8}
            />
          </>
        )}

        {/* Prediction markers */}
        {mode === 'prediction' && predictions.map((prediction, index) => (
          <Marker
            key={`prediction-${index}`}
            position={[prediction.coordinates.lat, prediction.coordinates.lng]}
            icon={createCustomIcon('#8b5cf6', 'medium', 'pulse')}
          >
            <Popup>
              <div>
                <strong>{prediction.destination_area}</strong>
                <br />
                Trips: {prediction.trip_count}
                <br />
                Percentage: {prediction.percentage.toFixed(1)}%
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Passenger order markers */}
        {passengerOrders.map((order) => (
          <React.Fragment key={order.id}>
            <Marker
              position={[order.pickupPoint.lat, order.pickupPoint.lng]}
              icon={createCustomIcon('#22c55e', 'small', 'pulse')}
            >
              <Popup>
                <div>
                  <strong>Pickup - {order.passengerInfo.name}</strong>
                  <br />
                  Price: {order.estimatedPrice} ₸
                  <br />
                  Rating: ★ {order.passengerInfo.rating.toFixed(1)}
                </div>
              </Popup>
            </Marker>
            
            <Marker
              position={[order.destinationPoint.lat, order.destinationPoint.lng]}
              icon={createCustomIcon('#ef4444', 'small', 'glow')}
            >
              <Popup>
                <div>
                  <strong>Destination</strong>
                  <br />
                  Distance: {order.distance.toFixed(1)} km
                  <br />
                  Time: {order.estimatedTime}
                </div>
              </Popup>
            </Marker>
            
            <Polyline
              positions={[
                [order.pickupPoint.lat, order.pickupPoint.lng],
                [order.destinationPoint.lat, order.destinationPoint.lng]
              ]}
              color="#f59e0b"
              weight={3}
              opacity={0.7}
              dashArray="5, 10"
            />
          </React.Fragment>
        ))}

        {/* Heatmap clusters */}
        {mode === 'heatmap' && heatmapClusters.map((cluster) => (
          <Circle
            key={`heatmap-${cluster.cluster_id}`}
            center={[cluster.start_center.lat, cluster.start_center.lng]}
            radius={getHeatmapRadius(cluster.trip_count)}
            fillColor={getHeatmapColor(cluster.trip_count)}
            fillOpacity={0.3}
            stroke={true}
            color={getHeatmapColor(cluster.trip_count)}
            weight={2}
          >
            <Popup>
              <div>
                <strong>Start Zone #{cluster.cluster_id}</strong>
                <br />
                Trip Count: {cluster.trip_count}
                <br />
                Avg Distance: {(cluster.avg_distance * 100).toFixed(2)} km
                <br />
                Click anywhere for detailed hint
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>

      {/* Loading indicator for hint */}
      {isLoadingHint && (
        <div className="absolute top-4 right-4 bg-white rounded-[8px] shadow-lg p-3 z-[1000]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            <span className="text-[14px] text-[#858898]">Loading hint...</span>
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
