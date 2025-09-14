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
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-gradient-to-br from-[#FFFEE9] via-[#F8F9FA] to-[#E8F5E8] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-r from-[#94EA0D]/20 to-blue-400/20 rounded-full blur-3xl"
>>>>>>> 0e7f96c38c25ffb75719dd05381bdf17aa709e37
        />
        <motion.div 
          animate={{ 
            rotate: [360, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-l from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [-20, 20, -20],
            x: [-10, 10, -10]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-yellow-300/15 to-orange-400/15 rounded-full blur-2xl"
        />
      </div>

      {/* Floating Sidebar */}
      {!showFuelConfig && !showTripPackages && (
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute left-6 top-6 bottom-6 w-96 z-[1000]"
        >
          <div className="h-full bg-white/95 backdrop-blur-xl rounded-[24px] shadow-2xl border border-white/50 overflow-hidden">
            <Sidebar
              mode={mode}
              onModeChange={handleModeChange}
              coordinates={coordinates}
              onCoordinatesChange={setCoordinates}
              onMyLocation={handleMyLocation}
              onTestDataset={handleTestDataset}
              onAcceptOrder={handleAcceptOrder}
              isLoadingLocation={isLoadingLocation}
            />
          </div>
        </motion.div>
      )}

      {/* Main Map Container */}
      <div className="w-full h-screen relative">
        {!showFuelConfig && !showTripPackages ? (
          <MapView
            mode={mode}
            coordinates={coordinates}
            selectedPackage={selectedPackage}
            predictions={predictions}
            heatmapClusters={heatmapData?.clusters || []}
          />
        ) : (
<<<<<<< HEAD
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="font-bold text-[48px] text-black mb-4">Map Interface</h1>
              <p className="font-medium text-[#858898] text-[20px]">
=======
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-[#FFFEE9] overflow-hidden"
          >
            {/* Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#94EA0D]/30 rounded-full blur-xl" />
              <div className="absolute top-1/4 -right-16 w-32 h-32 bg-blue-400/30 rounded-full blur-xl" />
              <div className="absolute bottom-1/4 -left-16 w-36 h-36 bg-purple-400/30 rounded-full blur-xl" />
              <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-[#94EA0D]/30 rounded-full blur-xl" />
              <div className="absolute top-10 left-1/3 w-24 h-24 bg-yellow-400/20 rounded-full blur-lg" />
              <div className="absolute bottom-32 right-1/3 w-28 h-28 bg-pink-400/20 rounded-full blur-lg" />
            </div>
            
            <div className="text-center relative z-10">
              <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-['Press_Start_2P',_monospace] text-[48px] text-black mb-4 drop-shadow-lg"
              >
                Map Interface
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-poppins font-medium text-[#858898] text-[20px] drop-shadow-sm"
              >
>>>>>>> 0e7f96c38c25ffb75719dd05381bdf17aa709e37
                Complete configuration to access the map
              </motion.p>
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

<<<<<<< HEAD
      {/* Loading Predictions Overlay */}
      {isLoadingPredictions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1001]">
          <div className="bg-white rounded-[16px] p-8 text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="font-semibold text-[18px] text-black mb-2">Finding Orders</h3>
            <p className="text-[14px] text-[#858898]">Searching for nearby passengers...</p>
          </div>
        </div>
=======
      {/* Floating Passenger Orders Panel */}
      <AnimatePresence>
        {showOrders && passengerOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed right-6 top-6 bottom-6 w-96 z-[1001]"
          >
            <div className="h-full bg-white/95 backdrop-blur-xl rounded-[24px] shadow-2xl border border-white/50 overflow-hidden">
              <div className="p-8 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-['Press_Start_2P'] text-[18px] text-black mb-2 drop-shadow-sm">Orders</h3>
                    <p className="font-poppins text-[14px] text-gray-600">{passengerOrders.length} available</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowOrders(false)}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                  >
                    ×
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                {passengerOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                  >
                    <OrderCard
                      order={order}
                      onAccept={handleOrderAccept}
                      onDecline={handleOrderDecline}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Loading Overlay */}
      {isLoadingPredictions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-[1002]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white/95 backdrop-blur-xl rounded-[24px] p-12 text-center shadow-2xl border border-white/50 max-w-sm mx-4"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-gray-200 border-t-[#94EA0D] rounded-full mx-auto"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 w-16 h-16 border-2 border-[#94EA0D]/30 rounded-full mx-auto"
              />
            </div>
            <h3 className="font-['Press_Start_2P'] text-[16px] text-black mb-4 drop-shadow-sm">Finding Orders</h3>
            <p className="font-poppins text-[14px] text-gray-600">Searching for nearby passengers...</p>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-6 flex justify-center space-x-1"
            >
              <div className="w-2 h-2 bg-[#94EA0D] rounded-full"></div>
              <div className="w-2 h-2 bg-[#94EA0D] rounded-full"></div>
              <div className="w-2 h-2 bg-[#94EA0D] rounded-full"></div>
            </motion.div>
          </motion.div>
        </motion.div>
>>>>>>> 0e7f96c38c25ffb75719dd05381bdf17aa709e37
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
