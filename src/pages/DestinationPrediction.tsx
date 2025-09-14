import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import MapView from './destination-prediction/MapView';
import PredictionPanel from './destination-prediction/PredictionPanel';
import FuelConfig from './destination-prediction/FuelConfig';
import TripPackageList from './destination-prediction/TripPackageList';
import type { 
  Coordinates, 
  PredictionResponse, 
  ClustersResponse, 
  MapMarker,
  HeatmapResponse,
  TripPackage
} from '../types/prediction';
import { predictDestination, getClusters, getHeatmap, PredictionApiError } from '../services/predictionApi';
import { calculateDistance } from '../utils/geo';

interface DestinationPredictionProps {}

const DestinationPrediction: React.FC<DestinationPredictionProps> = () => {
  // State management
  const [startPoint, setStartPoint] = useState<Coordinates | null>(null);
  const [predictions, setPredictions] = useState<PredictionResponse | null>(null);
  const [clusters, setClusters] = useState<ClustersResponse | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapResponse | null>(null);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTop3Only, setShowTop3Only] = useState(true);
  const [showRoutePreview, setShowRoutePreview] = useState(false);
  const [mapMode, setMapMode] = useState<'prediction' | 'heatmap'>('prediction');
  
  // Trip packages state
  const [fuelConfigured, setFuelConfigured] = useState(false);
  const [fuelConsumption, setFuelConsumption] = useState<number>(0);
  const [fuelPrice, setFuelPrice] = useState<number>(0);
  const [tripPackages, setTripPackages] = useState<TripPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<TripPackage | null>(null);
  const [activeTab, setActiveTab] = useState<'predictions' | 'packages'>('predictions');

  // Load clusters on component mount
  useEffect(() => {
    const loadClusters = async () => {
      try {
        const clustersData = await getClusters();
        setClusters(clustersData);
      } catch (error) {
        console.warn('Failed to load clusters:', error);
        // Don't show error to user for background cluster loading
      }
    };

    loadClusters();
  }, []);

  // Load heatmap data on component mount
  useEffect(() => {
    const loadHeatmap = async () => {
      try {
        const heatmapData = await getHeatmap();
        setHeatmap(heatmapData);
      } catch (error) {
        console.warn('Failed to load heatmap:', error);
        // Don't show error to user for background heatmap loading
      }
    };

    loadHeatmap();
  }, []);

  // Update map markers when data changes
  useEffect(() => {
    const markers: MapMarker[] = [];

    // Add start point marker
    if (startPoint) {
      markers.push({
        id: 'start',
        position: startPoint,
        type: 'start',
      });
    }

    // Add prediction markers
    if (predictions) {
      const predictionsToShow = showTop3Only 
        ? predictions.predictions.slice(0, 3)
        : predictions.predictions;

      predictionsToShow.forEach((prediction) => {
        markers.push({
          id: `prediction-${prediction.cluster_id}`,
          position: prediction.cluster_center,
          type: 'prediction',
          data: prediction,
          probability: prediction.probability,
        });
      });
    }

    // Add background cluster markers
    if (clusters) {
      clusters.clusters.forEach((cluster) => {
        // Don't add cluster marker if there's already a prediction marker for this cluster
        const hasPrediction = predictions?.predictions.some(
          p => p.cluster_id === cluster.cluster_id
        );
        
        if (!hasPrediction) {
          markers.push({
            id: `cluster-${cluster.cluster_id}`,
            position: cluster.start_center,
            type: 'cluster',
            data: cluster,
          });
        }
      });
    }

    setMapMarkers(markers);
  }, [startPoint, predictions, clusters, showTop3Only]);

  // Generate trip packages from heatmap data
  useEffect(() => {
    if (heatmap && fuelConfigured) {
      const packages: TripPackage[] = [];
      const sortedClusters = [...heatmap.clusters]
        .sort((a, b) => b.trip_count - a.trip_count)
        .slice(0, 10); // Top 10 clusters

      // Create packages between top clusters
      for (let i = 0; i < sortedClusters.length - 1; i++) {
        for (let j = i + 1; j < Math.min(i + 4, sortedClusters.length); j++) {
          const startCluster = sortedClusters[i];
          const endCluster = sortedClusters[j];
          const distance = calculateDistance(
            startCluster.start_center,
            endCluster.start_center
          );

          // Only create packages for reasonable distances (5-50km)
          if (distance >= 5 && distance <= 50) {
            packages.push({
              id: `package-${startCluster.cluster_id}-${endCluster.cluster_id}`,
              startCluster,
              endCluster,
              distance,
              routeName: `Cluster ${startCluster.cluster_id} → Cluster ${endCluster.cluster_id}`
            });
          }
        }
      }

      // Sort by total trip volume (start + end)
      packages.sort((a, b) => 
        (b.startCluster.trip_count + b.endCluster.trip_count) - 
        (a.startCluster.trip_count + a.endCluster.trip_count)
      );

      setTripPackages(packages.slice(0, 6)); // Show top 6 packages
    }
  }, [heatmap, fuelConfigured]);

  const handleStartPointChange = useCallback((coordinates: Coordinates) => {
    setStartPoint(coordinates);
    // Clear previous predictions when start point changes
    setPredictions(null);
    setError(null);
  }, []);

  const handlePredictDestination = useCallback(async () => {
    if (!startPoint) {
      setError('Please select a start point first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await predictDestination({
        start_lat: startPoint.lat,
        start_lng: startPoint.lng,
      });

      setPredictions(result);
    } catch (error) {
      if (error instanceof PredictionApiError) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred while predicting destination');
      }
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [startPoint]);

  const handleClearResults = useCallback(() => {
    setPredictions(null);
    setStartPoint(null);
    setError(null);
  }, []);

  const handleToggleTop3 = useCallback(() => {
    setShowTop3Only(!showTop3Only);
  }, [showTop3Only]);

  const handleToggleRoutePreview = useCallback(() => {
    setShowRoutePreview(!showRoutePreview);
  }, []);

  const handleToggleMapMode = useCallback(() => {
    setMapMode(prev => prev === 'prediction' ? 'heatmap' : 'prediction');
    // Clear selected package when switching modes
    setSelectedPackage(null);
  }, []);

  const handleFuelConfig = useCallback((consumption: number, price: number) => {
    setFuelConsumption(consumption);
    setFuelPrice(price);
    setFuelConfigured(true);
  }, []);

  const handlePackageViewOnMap = useCallback((pkg: TripPackage) => {
    setSelectedPackage(pkg);
    setMapMode('prediction'); // Switch to prediction mode to show the route clearly
    setActiveTab('predictions'); // Switch to predictions tab to see the map better
  }, []);

  // Show fuel config screen if not configured
  if (!fuelConfigured) {
    return <FuelConfig onConfigSubmit={handleFuelConfig} />;
  }

  return (
    <div className="min-h-screen bg-[#FFFEE9] flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200 px-4 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Destination Prediction & Trip Packages
          </h1>
          <div className="flex items-center gap-4">
            {/* Tab Switcher */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('predictions')}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  activeTab === 'predictions'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Predictions
              </button>
              <button
                onClick={() => setActiveTab('packages')}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  activeTab === 'packages'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Trip Packages
              </button>
            </div>
            {predictions && (
              <button
                onClick={handleClearResults}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear Results
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Map Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 relative"
        >
          <MapView
            markers={mapMarkers}
            onStartPointChange={handleStartPointChange}
            showRoutePreview={showRoutePreview && predictions !== null}
            startPoint={startPoint}
            topPrediction={predictions?.predictions[0] || null}
            mapMode={mapMode}
            heatmap={heatmap}
            tripPackages={tripPackages}
            selectedPackage={selectedPackage}
          />
        </motion.div>

        {/* Sidebar/Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col"
        >
          {activeTab === 'predictions' ? (
            <PredictionPanel
              startPoint={startPoint}
              predictions={predictions}
              clusters={clusters}
              isLoading={isLoading}
              error={error}
              showTop3Only={showTop3Only}
              showRoutePreview={showRoutePreview}
              mapMode={mapMode}
              onPredictDestination={handlePredictDestination}
              onToggleTop3={handleToggleTop3}
              onToggleRoutePreview={handleToggleRoutePreview}
              onToggleMapMode={handleToggleMapMode}
              onStartPointChange={handleStartPointChange}
            />
          ) : (
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Trip Packages</h2>
                <p className="text-sm text-gray-600">
                  Popular routes with cost calculations for your vehicle
                </p>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>Vehicle:</strong> {fuelConsumption}L/100km • 
                    <strong> Fuel:</strong> {fuelPrice}₸/L
                  </p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <TripPackageList
                  packages={tripPackages}
                  fuelConsumption={fuelConsumption}
                  fuelPrice={fuelPrice}
                  onViewOnMap={handlePackageViewOnMap}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Error Toast */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DestinationPrediction;
