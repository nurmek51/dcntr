import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { 
  Coordinates, 
  PredictionResponse, 
  ClustersResponse,
  Prediction 
} from '../../types/prediction';
import { validateCoordinates } from '../../services/predictionApi';

interface PredictionPanelProps {
  startPoint: Coordinates | null;
  predictions: PredictionResponse | null;
  clusters: ClustersResponse | null;
  isLoading: boolean;
  error: string | null;
  showTop3Only: boolean;
  showRoutePreview: boolean;
  mapMode: 'prediction' | 'heatmap';
  onPredictDestination: () => void;
  onToggleTop3: () => void;
  onToggleRoutePreview: () => void;
  onToggleMapMode: () => void;
  onStartPointChange: (coordinates: Coordinates) => void;
}

const PredictionPanel: React.FC<PredictionPanelProps> = ({
  startPoint,
  predictions,
  clusters,
  isLoading,
  error,
  showTop3Only,
  showRoutePreview,
  mapMode,
  onPredictDestination,
  onToggleTop3,
  onToggleRoutePreview,
  onToggleMapMode,
  onStartPointChange,
}) => {
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [coordinateError, setCoordinateError] = useState('');

  const handleManualCoordinateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setCoordinateError('');

    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      setCoordinateError('Please enter valid numbers for latitude and longitude');
      return;
    }

    if (!validateCoordinates(lat, lng)) {
      setCoordinateError('Coordinates must be valid (lat: -90 to 90, lng: -180 to 180)');
      return;
    }

    onStartPointChange({ lat, lng });
    setManualLat('');
    setManualLng('');
  }, [manualLat, manualLng, onStartPointChange]);

  const renderModelInfo = () => {
    if (!predictions?.model_info) return null;

    const { model_info } = predictions;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 rounded-lg p-4 mb-6"
      >
        <h3 className="font-semibold text-gray-800 mb-3">Model Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Model Type:</span>
            <span className="font-medium">{model_info.model_type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Top-1 Accuracy:</span>
            <span className="font-medium">
              {(model_info.top_1_accuracy * 100).toFixed(1)}%
              <span 
                className="ml-1 text-xs text-gray-500 cursor-help" 
                title="Model accuracy is historical; treat predictions as probabilistic guidance only"
              >
                ℹ️
              </span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Top-3 Accuracy:</span>
            <span className="font-medium">
              {(model_info.top_3_accuracy * 100).toFixed(1)}%
              <span 
                className="ml-1 text-xs text-gray-500 cursor-help" 
                title="Model accuracy is historical; treat predictions as probabilistic guidance only"
              >
                ℹ️
              </span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Clusters:</span>
            <span className="font-medium">{model_info.n_clusters}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderPredictionsList = () => {
    if (!predictions?.predictions.length) return null;

    const predictionsToShow = showTop3Only 
      ? predictions.predictions.slice(0, 3)
      : predictions.predictions;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Predictions</h3>
          <button
            onClick={onToggleTop3}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showTop3Only ? `Show All (${predictions.predictions.length})` : 'Show Top 3'}
          </button>
        </div>

        <div className="space-y-3">
          {predictionsToShow.map((prediction, index) => (
            <PredictionCard
              key={prediction.cluster_id}
              prediction={prediction}
              rank={index + 1}
              isTop={index === 0}
            />
          ))}
        </div>

        {predictions.predictions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No prediction available for this start point</p>
          </div>
        )}
      </motion.div>
    );
  };

  const renderControls = () => (
    <div className="space-y-4 mb-6">
      {/* Map Mode Switcher */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Map Mode</h3>
        <div className="flex gap-2">
          <button
            onClick={() => mapMode === 'heatmap' && onToggleMapMode()}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded transition-colors ${
              mapMode === 'prediction'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Prediction
          </button>
          <button
            onClick={() => mapMode === 'prediction' && onToggleMapMode()}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded transition-colors ${
              mapMode === 'heatmap'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Heatmap
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {mapMode === 'prediction' 
            ? 'Click on map to set start point and predict destinations'
            : 'View trip density heatmap across all clusters'
          }
        </p>
      </div>

      {/* Manual Coordinate Input */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Set Start Point</h3>
        <form onSubmit={handleManualCoordinateSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                placeholder="43.2220"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                placeholder="76.8512"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {coordinateError && (
            <p className="text-xs text-red-600">{coordinateError}</p>
          )}
          
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            Set Coordinates
          </button>
        </form>
        
        <div className="mt-3 text-xs text-gray-500">
          Or click on the map to set start point
        </div>
      </div>

      {/* Current Start Point */}
      {startPoint && (
        <div className="bg-green-50 rounded-lg p-3">
          <h4 className="font-medium text-green-800 mb-2">Current Start Point</h4>
          <p className="text-sm text-green-700">
            {startPoint.lat.toFixed(6)}, {startPoint.lng.toFixed(6)}
          </p>
        </div>
      )}

      {/* Predict Button */}
      <button
        onClick={onPredictDestination}
        disabled={!startPoint || isLoading}
        className={`w-full px-6 py-3 font-semibold rounded-lg transition-colors ${
          !startPoint || isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Predicting...
          </div>
        ) : (
          'Predict Destination'
        )}
      </button>

      {/* Options */}
      {predictions && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showRoutePreview}
              onChange={onToggleRoutePreview}
              className="rounded"
            />
            <span>Show route preview</span>
          </label>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        {renderControls()}
        
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center gap-2 text-red-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {renderModelInfo()}
        {renderPredictionsList()}

        {/* Clusters Summary */}
        {clusters && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <h3 className="font-semibold text-gray-800 mb-2">Available Clusters</h3>
            <p className="text-sm text-gray-600">
              {clusters.total_clusters} destination clusters available for prediction
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

interface PredictionCardProps {
  prediction: Prediction;
  rank: number;
  isTop: boolean;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, rank, isTop }) => {
  const handleNavigate = () => {
    const { lat, lng } = prediction.cluster_center;
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={`rounded-lg p-4 border-2 transition-all ${
        isTop 
          ? 'bg-red-50 border-red-200' 
          : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded ${
            isTop ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
          }`}>
            #{rank}
          </span>
          {isTop && (
            <span className="text-xs font-medium text-red-600">TOP PREDICTION</span>
          )}
        </div>
        <div className={`text-lg font-bold ${
          isTop ? 'text-red-600' : 'text-blue-600'
        }`}>
          {(prediction.probability * 100).toFixed(1)}%
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Cluster ID:</span>
          <span className="font-medium">{prediction.cluster_id}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Location:</span>
          <span className="font-medium text-right">
            {prediction.cluster_center.lat.toFixed(4)}, {prediction.cluster_center.lng.toFixed(4)}
          </span>
        </div>
      </div>

      <button
        onClick={handleNavigate}
        className={`w-full px-3 py-2 text-sm font-medium rounded transition-colors ${
          isTop
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        Navigate Here
      </button>
    </motion.div>
  );
};

export default PredictionPanel;
