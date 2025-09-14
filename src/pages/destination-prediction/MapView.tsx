import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMapEvents } from 'react-leaflet';
import L, { type LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Coordinates, MapMarker, Prediction, HeatmapResponse, TripPackage } from '../../types/prediction';
import { KazakhstanAddressService } from '../../services/addressService';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

const startIcon = createCustomIcon('#22c55e', 'medium'); // Green for start
const predictionIcon = createCustomIcon('#3b82f6', 'large'); // Blue for predictions
const topPredictionIcon = createCustomIcon('#ef4444', 'large'); // Red for top prediction
const clusterIcon = createCustomIcon('#6b7280', 'small'); // Gray for background clusters

interface MapClickHandlerProps {
  onMapClick: (coordinates: Coordinates) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click: (e: LeafletMouseEvent) => {
      onMapClick({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });
  return null;
};

interface MarkerWithAddressProps {
  marker: MapMarker;
  icon: L.DivIcon;
}

const MarkerWithAddress: React.FC<MarkerWithAddressProps> = ({ marker, icon }) => {
  const [address, setAddress] = useState<string>('Loading address...');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

<<<<<<< HEAD
  // Guard against undefined position
  if (!marker.position) {
    console.warn('Marker has undefined position:', marker);
    return null;
  }

=======
>>>>>>> 0e7f96c38c25ffb75719dd05381bdf17aa709e37
  const loadAddress = async () => {
    if (isLoadingAddress) return;
    
    setIsLoadingAddress(true);
    try {
      const addressResult = await KazakhstanAddressService.reverseGeocode(marker.position);
      setAddress(addressResult);
    } catch (error) {
      console.warn('Failed to load address:', error);
      setAddress(`${marker.position.lat.toFixed(6)}, ${marker.position.lng.toFixed(6)}`);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handlePopupOpen = () => {
    if (address === 'Loading address...') {
      loadAddress();
    }
  };

  const handleNavigate = () => {
    const { lat, lng } = marker.position;
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  const renderPopupContent = () => {
    switch (marker.type) {
      case 'start':
        return (
          <div className="p-2 min-w-[200px]">
            <h3 className="font-semibold text-green-600 mb-2">Start Point</h3>
            <p className="text-sm text-gray-600 mb-3">{address}</p>
            <button
              onClick={handleNavigate}
              className="w-full px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
            >
              Navigate Here
            </button>
          </div>
        );
        
      case 'prediction':
        const prediction = marker.data as Prediction;
        const isTopPrediction = marker.probability && marker.probability > 0.4;
        
        return (
          <div className="p-2 min-w-[200px]">
            <h3 className={`font-semibold mb-2 ${isTopPrediction ? 'text-red-600' : 'text-blue-600'}`}>
              {isTopPrediction ? 'Top Prediction' : 'Prediction'}
            </h3>
            <div className="space-y-2 mb-3">
              <p className="text-sm">
<<<<<<< HEAD
                <span className="font-medium">Cluster:</span> {prediction.cluster_id}
              </p>
              <p className="text-sm">
                <span className="font-medium">Probability:</span> {(prediction.probability * 100).toFixed(1)}%
=======
                <span className="font-medium">Area:</span> {prediction.destination_area}
              </p>
              <p className="text-sm">
                <span className="font-medium">Probability:</span> {prediction.percentage.toFixed(1)}%
>>>>>>> 0e7f96c38c25ffb75719dd05381bdf17aa709e37
              </p>
              <p className="text-sm text-gray-600">{address}</p>
            </div>
            <button
              onClick={handleNavigate}
              className={`w-full px-3 py-1 text-white text-sm rounded transition-colors ${
                isTopPrediction 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Navigate Here
            </button>
          </div>
        );
        
      case 'cluster':
        const cluster = marker.data as any;
        
        return (
          <div className="p-2 min-w-[200px]">
            <h3 className="font-semibold text-gray-600 mb-2">Cluster Center</h3>
            <div className="space-y-2 mb-3">
              <p className="text-sm">
                <span className="font-medium">Cluster:</span> {cluster.cluster_id}
              </p>
              <p className="text-sm text-gray-600">{address}</p>
            </div>
            <button
              onClick={handleNavigate}
              className="w-full px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
            >
              Navigate Here
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Marker 
      position={[marker.position.lat, marker.position.lng]} 
      icon={icon}
      eventHandlers={{
        popupopen: handlePopupOpen,
      }}
    >
      <Popup>
        {renderPopupContent()}
      </Popup>
    </Marker>
  );
};

interface MapViewProps {
  markers: MapMarker[];
  onStartPointChange: (coordinates: Coordinates) => void;
  showRoutePreview: boolean;
  startPoint: Coordinates | null;
  topPrediction: Prediction | null;
  mapMode: 'prediction' | 'heatmap';
  heatmap: HeatmapResponse | null;
  tripPackages: TripPackage[];
  selectedPackage: TripPackage | null;
}

const MapView: React.FC<MapViewProps> = ({
  markers,
  onStartPointChange,
  showRoutePreview,
  startPoint,
  topPrediction,
  mapMode,
  heatmap,
  tripPackages,
  selectedPackage,
}) => {
  const mapRef = useRef<L.Map>(null);

  // Default center for Kazakhstan (Almaty area)
  const defaultCenter: [number, number] = [43.2220, 76.8512];
  const defaultZoom = 11;

  // Fit map to show all markers when they change
  useEffect(() => {
    if (mapRef.current && markers.length > 0) {
      const validMarkers = markers.filter(marker => marker.position);
      const invalidCount = markers.length - validMarkers.length;
      if (invalidCount > 0) {
        console.warn(`Found ${invalidCount} markers with undefined positions, skipping them for bounds calculation`);
      }
      if (validMarkers.length > 0) {
        const bounds = L.latLngBounds(
          validMarkers.map(marker => [marker.position!.lat, marker.position!.lng])
        );
        
        // Add some padding to the bounds
        const paddedBounds = bounds.pad(0.1);
        
        // Fit the map to show all markers
        mapRef.current.fitBounds(paddedBounds, {
          maxZoom: 15,
          animate: true,
        });
      }
    }
  }, [markers]);

  const getMarkerIcon = (marker: MapMarker): L.DivIcon => {
    switch (marker.type) {
      case 'start':
        return startIcon;
      case 'prediction':
        // Use red icon for top prediction (highest probability)
        return marker.probability && marker.probability > 0.4 
          ? topPredictionIcon 
          : predictionIcon;
      case 'cluster':
        return clusterIcon;
      default:
        return clusterIcon;
    }
  };

  // Generate route preview polyline
  const routePreviewPath = React.useMemo(() => {
    if (!showRoutePreview || !startPoint || !topPrediction) {
      return null;
    }

    // Simple straight line from start to top prediction
    // In a real app, you might use a routing service
    return [
      [startPoint.lat, startPoint.lng],
      [topPrediction.cluster_center.lat, topPrediction.cluster_center.lng],
    ] as [number, number][];
  }, [showRoutePreview, startPoint, topPrediction]);

  // Calculate heatmap circle color based on trip count
  const getHeatmapColor = (tripCount: number, maxTripCount: number): string => {
    const intensity = tripCount / maxTripCount;
    
    if (intensity >= 0.8) return '#dc2626'; // Red for top 20%
    if (intensity >= 0.6) return '#ea580c'; // Orange for next 20%
    if (intensity >= 0.4) return '#d97706'; // Amber for next 20%
    if (intensity >= 0.2) return '#ca8a04'; // Yellow for next 20%
    return '#65a30d'; // Lime for bottom 20%
  };

  // Calculate circle radius based on trip count (normalized)
  const getHeatmapRadius = (tripCount: number, maxTripCount: number): number => {
    const minRadius = 50;
    const maxRadius = 200;
    const intensity = tripCount / maxTripCount;
    return minRadius + (maxRadius - minRadius) * intensity;
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={onStartPointChange} />
        
        {/* Render heatmap circles when in heatmap mode */}
        {mapMode === 'heatmap' && heatmap && (
          (() => {
            const maxTripCount = Math.max(...heatmap.clusters.map(c => c.trip_count));
            return heatmap.clusters.map((cluster) => (
              <Circle
                key={`heatmap-${cluster.cluster_id}`}
                center={[cluster.start_center.lat, cluster.start_center.lng]}
                radius={getHeatmapRadius(cluster.trip_count, maxTripCount)}
                pathOptions={{
                  color: getHeatmapColor(cluster.trip_count, maxTripCount),
                  fillColor: getHeatmapColor(cluster.trip_count, maxTripCount),
                  fillOpacity: 0.6,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-gray-800 mb-2">Cluster {cluster.cluster_id}</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Trip Count:</span> {cluster.trip_count.toLocaleString()}</p>
                      <p><span className="font-medium">Avg Distance:</span> {cluster.avg_distance.toFixed(4)} km</p>
                      <p><span className="font-medium">Coordinates:</span> {cluster.start_center.lat.toFixed(6)}, {cluster.start_center.lng.toFixed(6)}</p>
                    </div>
                  </div>
                </Popup>
              </Circle>
            ));
          })()
        )}
        
        {/* Render markers only in prediction mode */}
        {mapMode === 'prediction' && markers.map((marker) => (
          <MarkerWithAddress
            key={marker.id}
            marker={marker}
            icon={getMarkerIcon(marker)}
          />
        ))}
        
        {/* Render trip package polylines */}
        {tripPackages.map((pkg) => {
          const isSelected = selectedPackage?.id === pkg.id;
          return (
            <Polyline
              key={`package-${pkg.id}`}
              positions={[
                [pkg.startCluster.start_center.lat, pkg.startCluster.start_center.lng],
                [pkg.endCluster.start_center.lat, pkg.endCluster.start_center.lng]
              ]}
              color={isSelected ? "#dc2626" : "#6b7280"}
              weight={isSelected ? 4 : 2}
              opacity={isSelected ? 0.9 : 0.4}
              dashArray={isSelected ? undefined : "5, 5"}
            />
          );
        })}
        
        {/* Render trip package markers when a package is selected */}
        {selectedPackage && (
          <>
            <Marker
              position={[selectedPackage.startCluster.start_center.lat, selectedPackage.startCluster.start_center.lng]}
              icon={createCustomIcon('#22c55e', 'medium')}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-green-600 mb-2">Start Point</h3>
                  <p className="text-sm"><strong>Cluster:</strong> {selectedPackage.startCluster.cluster_id}</p>
                  <p className="text-sm"><strong>Trips:</strong> {selectedPackage.startCluster.trip_count.toLocaleString()}</p>
                  <p className="text-sm"><strong>Avg Distance:</strong> {selectedPackage.startCluster.avg_distance.toFixed(4)} km</p>
                </div>
              </Popup>
            </Marker>
            <Marker
              position={[selectedPackage.endCluster.start_center.lat, selectedPackage.endCluster.start_center.lng]}
              icon={createCustomIcon('#ef4444', 'medium')}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-red-600 mb-2">Destination</h3>
                  <p className="text-sm"><strong>Cluster:</strong> {selectedPackage.endCluster.cluster_id}</p>
                  <p className="text-sm"><strong>Trips:</strong> {selectedPackage.endCluster.trip_count.toLocaleString()}</p>
                  <p className="text-sm"><strong>Avg Distance:</strong> {selectedPackage.endCluster.avg_distance.toFixed(4)} km</p>
                </div>
              </Popup>
            </Marker>
          </>
        )}
        
        {/* Route preview polyline */}
        {routePreviewPath && (
          <Polyline
            positions={routePreviewPath}
            color="#ef4444"
            weight={3}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}
      </MapContainer>
      
      {/* Map controls overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
        <div className="text-sm text-gray-600 mb-2">
          <strong>
            {mapMode === 'prediction' ? 'Click on map' : 'Heatmap view'}
          </strong> 
          {mapMode === 'prediction' ? ' to set start point' : ' - trip density visualization'}
        </div>
        <div className="space-y-1 text-xs text-gray-500">
          {mapMode === 'prediction' ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Start Point</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Top Prediction</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Other Predictions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>Cluster Centers</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-xs font-medium text-gray-700 mb-1">Trip Density:</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span>Very High (Top 20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                <span>High (60-80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
                <span>Medium (40-60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                <span>Low (20-40%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-lime-600 rounded-full"></div>
                <span>Very Low (Bottom 20%)</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
