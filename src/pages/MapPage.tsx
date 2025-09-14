import React, { useState, useEffect, useRef } from 'react';
import FuelConfigModal from '../components/modals/fuel-config-modal';
import TripPackageModal from '../components/modals/trip-package-modal';
import LoadingModal from '../components/modals/loading-modal';
import Sidebar from '../components/sidebar';
import MapView from '../components/map-view';
import { FUEL_PRICES } from '../utils/cost';
import { predictDestination, getHeatmap, getMockPredictionResponse } from '../services/predictionApi';
import type { Coordinates, Prediction, HeatmapResponse } from '../types/prediction';

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

const MapPage: React.FC = () => {
  const [showFuelConfig, setShowFuelConfig] = useState(true);
  const [showTripPackages, setShowTripPackages] = useState(false);
  const [engineVolume, setEngineVolume] = useState<number>(2.0);
  const [fuelType, setFuelType] = useState<keyof typeof FUEL_PRICES>('PREMIUM_95');
  
  // Map state
  const [mode, setMode] = useState<'prediction' | 'heatmap'>('prediction');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<TripPackage | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapResponse | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
  const [isLoadingHeatmap, setIsLoadingHeatmap] = useState(false);
  
  // Heatmap caching
  const heatmapCache = useRef<HeatmapResponse | null>(null);
  const [heatmapLoaded, setHeatmapLoaded] = useState(false);

  // Show fuel config modal on page load
  useEffect(() => {
    setShowFuelConfig(true);
  }, []);

  const handleFuelConfigComplete = (volume: number, fuel: keyof typeof FUEL_PRICES) => {
    setEngineVolume(volume);
    setFuelType(fuel);
    setShowFuelConfig(false);
    
    // Show trip packages modal after fuel config closes
    setTimeout(() => {
      setShowTripPackages(true);
    }, 300);
  };

  const handleTripPackagesSkip = () => {
    setShowTripPackages(false);
  };

  const handlePackageSelect = (packageData: TripPackage) => {
    setSelectedPackage(packageData);
    setShowTripPackages(false);
  };

  const handleModeChange = async (newMode: 'prediction' | 'heatmap') => {
    setMode(newMode);
    setPredictions([]);
    
    // Load heatmap data when switching to heatmap mode (with caching)
    if (newMode === 'heatmap' && !heatmapLoaded) {
      await loadHeatmapData();
    }
  };

  const handleClearPackage = () => {
    setSelectedPackage(null);
  };

  const handleMyLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCoordinates(coords);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to Almaty coordinates
          setCoordinates({ lat: 43.2220, lng: 76.8512 });
          setIsLoadingLocation(false);
        }
      );
    } else {
      console.error('Geolocation is not supported');
      setCoordinates({ lat: 43.2220, lng: 76.8512 });
      setIsLoadingLocation(false);
    }
  };

  const handleTestDataset = () => {
    setCoordinates({ lat: 51.0980240632225, lng: 71.40599948805387 });
  };

  const handleAcceptOrder = async () => {
    if (!coordinates) return;

    setIsLoadingPredictions(true);
    try {
      // Get predictions for the current location
      let predictionResult;
      try {
        predictionResult = await predictDestination({
          start_lat: coordinates.lat,
          start_lng: coordinates.lng
        });
      } catch (error) {
        console.warn('API call failed, using mock data:', error);
        predictionResult = getMockPredictionResponse(coordinates.lat, coordinates.lng);
      }
      setPredictions(predictionResult.predictions);
      
      // Send request to accept order endpoint
      // You can add your endpoint call here
      console.log('Order accepted for coordinates:', coordinates);
      
    } catch (error) {
      console.error('Failed to get predictions:', error);
    } finally {
      setIsLoadingPredictions(false);
    }
  };

  // Load heatmap data only when switching to heatmap mode (with caching)
  const loadHeatmapData = async () => {
    // Return cached data if already loaded
    if (heatmapCache.current) {
      setHeatmapData(heatmapCache.current);
      return;
    }

    setIsLoadingHeatmap(true);
    try {
      const data = await getHeatmap();
      heatmapCache.current = data; // Cache the data
      setHeatmapData(data);
      setHeatmapLoaded(true);
    } catch (error) {
      console.warn('Failed to load heatmap data, using empty data:', error);
      // Set empty heatmap data as fallback
      const fallbackData = {
        clusters: [],
        total_clusters: 0,
        total_trips: 0,
        model_info: {
          model_type: 'LogisticRegression',
          top_1_accuracy: 0,
          top_3_accuracy: 0,
          n_clusters: 0
        }
      };
      heatmapCache.current = fallbackData;
      setHeatmapData(fallbackData);
      setHeatmapLoaded(true);
    } finally {
      setIsLoadingHeatmap(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEE9] relative flex">
      {/* Sidebar */}
      {!showFuelConfig && !showTripPackages && (
        <Sidebar
          mode={mode}
          onModeChange={handleModeChange}
          coordinates={coordinates}
          onCoordinatesChange={setCoordinates}
          onMyLocation={handleMyLocation}
          onTestDataset={handleTestDataset}
          onAcceptOrder={handleAcceptOrder}
          onClearPackage={handleClearPackage}
          isLoadingLocation={isLoadingLocation}
          hasSelectedPackage={selectedPackage !== null}
        />
      )}

      {/* Map Container */}
      <div className="flex-1 relative">
        {!showFuelConfig && !showTripPackages ? (
          <MapView
            mode={mode}
            coordinates={coordinates}
            selectedPackage={selectedPackage}
            predictions={predictions}
            heatmapClusters={heatmapData?.clusters || []}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="font-bold text-[48px] text-black mb-4">Map Interface</h1>
              <p className="font-medium text-[#858898] text-[20px]">
                Complete configuration to access the map
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Fuel Configuration Modal */}
      <FuelConfigModal
        isOpen={showFuelConfig}
        onClose={handleFuelConfigComplete}
      />

      {/* Trip Package Selection Modal */}
      <TripPackageModal
        isOpen={showTripPackages}
        engineVolume={engineVolume}
        fuelType={fuelType}
        onSkip={handleTripPackagesSkip}
        onPackageSelect={handlePackageSelect}
      />

      {/* Loading Predictions Overlay */}
      {isLoadingPredictions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1001]">
          <div className="bg-white rounded-[16px] p-8 text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="font-semibold text-[18px] text-black mb-2">Finding Orders</h3>
            <p className="text-[14px] text-[#858898]">Searching for nearby passengers...</p>
          </div>
        </div>
      )}

      {/* Loading Heatmap Modal */}
      <LoadingModal
        isOpen={isLoadingHeatmap}
        title="Loading Heatmap Data"
        message="Analyzing trip patterns and demand zones across the city. This may take a moment..."
      />
    </div>
  );
};

export default MapPage;
