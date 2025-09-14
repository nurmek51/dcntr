import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FuelConfigModal from '../components/modals/fuel-config-modal';
import TripPackageModal from '../components/modals/trip-package-modal';
import Sidebar from '../components/sidebar';
import MapView from '../components/map-view';
import OrderCard from '../components/order-card';
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
  const [passengerOrders, setPassengerOrders] = useState<PassengerOrder[]>([]);
  const [showOrders, setShowOrders] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);

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

  const handleModeChange = (newMode: 'prediction' | 'heatmap') => {
    setMode(newMode);
    setSelectedPackage(null);
    setPredictions([]);
    setPassengerOrders([]);
    setShowOrders(false);
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

      // Generate mock passenger orders
      const mockOrders: PassengerOrder[] = [
        {
          id: 'order-1',
          pickupPoint: { lat: coordinates.lat + 0.01, lng: coordinates.lng + 0.01 },
          destinationPoint: { lat: coordinates.lat + 0.02, lng: coordinates.lng + 0.02 },
          passengerInfo: {
            name: 'Aidar Nazarbayev',
            rating: 4.8,
            phone: '+7 777 123 4567'
          },
          estimatedPrice: 1200,
          distance: 3.2,
          estimatedTime: '8 min'
        },
        {
          id: 'order-2',
          pickupPoint: { lat: coordinates.lat - 0.005, lng: coordinates.lng + 0.015 },
          destinationPoint: { lat: coordinates.lat + 0.015, lng: coordinates.lng - 0.01 },
          passengerInfo: {
            name: 'Aida Sultanova',
            rating: 4.9,
            phone: '+7 777 987 6543'
          },
          estimatedPrice: 1800,
          distance: 5.1,
          estimatedTime: '12 min'
        }
      ];
      setPassengerOrders(mockOrders);
      setShowOrders(true);
    } catch (error) {
      console.error('Failed to get predictions:', error);
    } finally {
      setIsLoadingPredictions(false);
    }
  };

  const handleOrderAccept = (orderId: string) => {
    console.log('Order accepted:', orderId);
    setPassengerOrders(prev => prev.filter(order => order.id !== orderId));
    if (passengerOrders.length <= 1) {
      setShowOrders(false);
    }
  };

  const handleOrderDecline = (orderId: string) => {
    console.log('Order declined:', orderId);
    setPassengerOrders(prev => prev.filter(order => order.id !== orderId));
    if (passengerOrders.length <= 1) {
      setShowOrders(false);
    }
  };

  // Load heatmap data on component mount
  useEffect(() => {
    const loadHeatmapData = async () => {
      try {
        const data = await getHeatmap();
        setHeatmapData(data);
      } catch (error) {
        console.warn('Failed to load heatmap data, using empty data:', error);
        // Set empty heatmap data as fallback
        setHeatmapData({
          clusters: [],
          total_clusters: 0,
          total_trips: 0,
          model_info: {
            model_type: 'LogisticRegression',
            top_1_accuracy: 0,
            top_3_accuracy: 0,
            n_clusters: 0
          }
        });
      }
    };
    loadHeatmapData();
  }, []);

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
          isLoadingLocation={isLoadingLocation}
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
            passengerOrders={passengerOrders}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-100"
          >
            <div className="text-center">
              <h1 className="font-bold text-[48px] text-black mb-4">Map Interface</h1>
              <p className="font-medium text-[#858898] text-[20px]">
                Complete configuration to access the map
              </p>
            </div>
          </motion.div>
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

      {/* Passenger Orders Panel */}
      <AnimatePresence>
        {showOrders && passengerOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-4 top-4 bottom-4 w-80 bg-[#FFFEE9] rounded-[16px] shadow-[3px_4px_4px_rgba(0,0,0,0.2)] p-6 z-[1000] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[20px] text-black">Passenger Orders</h3>
              <button
                onClick={() => setShowOrders(false)}
                className="text-[#858898] hover:text-black text-[24px] leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {passengerOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <OrderCard
                    order={order}
                    onAccept={handleOrderAccept}
                    onDecline={handleOrderDecline}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Predictions Overlay */}
      {isLoadingPredictions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1001]"
        >
          <div className="bg-white rounded-[16px] p-8 text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="font-semibold text-[18px] text-black mb-2">Finding Orders</h3>
            <p className="text-[14px] text-[#858898]">Searching for nearby passengers...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MapPage;
