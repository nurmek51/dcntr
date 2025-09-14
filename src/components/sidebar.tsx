import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/button';

interface Coordinates {
  lat: number;
  lng: number;
}

interface SidebarProps {
  mode: 'prediction' | 'heatmap';
  onModeChange: (mode: 'prediction' | 'heatmap') => void;
  coordinates: Coordinates | null;
  onCoordinatesChange: (coordinates: Coordinates) => void;
  onMyLocation: () => void;
  onTestDataset: () => void;
  onAcceptOrder: () => void;
  isLoadingLocation: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  mode,
  onModeChange,
  coordinates,
  onCoordinatesChange,
  onMyLocation,
  onTestDataset,
  onAcceptOrder,
  isLoadingLocation
}) => {
  const [latInput, setLatInput] = useState(coordinates?.lat.toString() || '');
  const [lngInput, setLngInput] = useState(coordinates?.lng.toString() || '');

  // Update inputs when coordinates change externally
  React.useEffect(() => {
    if (coordinates) {
      setLatInput(coordinates.lat.toString());
      setLngInput(coordinates.lng.toString());
    }
  }, [coordinates]);

  const handleLatChange = (value: string) => {
    setLatInput(value);
    const lat = parseFloat(value);
    if (!isNaN(lat) && coordinates) {
      onCoordinatesChange({ lat, lng: coordinates.lng });
    }
  };

  const handleLngChange = (value: string) => {
    setLngInput(value);
    const lng = parseFloat(value);
    if (!isNaN(lng) && coordinates) {
      onCoordinatesChange({ lat: coordinates.lat, lng });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 bg-[#FFFEE9] h-full shadow-[3px_4px_4px_rgba(0,0,0,0.15)] border-r border-gray-200 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="font-bold text-[24px] text-black mb-4">Map Controls</h2>
        
        {/* Mode Switcher */}
        <div className="bg-white rounded-[12px] p-1 shadow-sm">
          <div className="flex">
            <button
              onClick={() => onModeChange('prediction')}
              className={`flex-1 py-3 px-4 text-[14px] font-semibold rounded-[8px] transition-all ${
                mode === 'prediction'
                  ? 'bg-black text-white shadow-[2px_3px_3px_rgba(0,0,0,0.2)]'
                  : 'text-[#858898] hover:text-black'
              }`}
            >
              Prediction
            </button>
            <button
              onClick={() => onModeChange('heatmap')}
              className={`flex-1 py-3 px-4 text-[14px] font-semibold rounded-[8px] transition-all ${
                mode === 'heatmap'
                  ? 'bg-black text-white shadow-[2px_3px_3px_rgba(0,0,0,0.2)]'
                  : 'text-[#858898] hover:text-black'
              }`}
            >
              Heatmap
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {mode === 'prediction' ? (
          <div className="space-y-6">
            {/* Location Buttons */}
            <div className="space-y-3">
              <Button
                onClick={onMyLocation}
                disabled={isLoadingLocation}
                loading={isLoadingLocation}
                variant="outline"
                className="w-full"
              >
                My Location
              </Button>
              
              <Button
                onClick={onTestDataset}
                variant="secondary"
                className="w-full"
              >
                Test with Dataset Context
              </Button>
            </div>

            {/* Coordinates Input */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[18px] text-black">Coordinates</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[14px] font-medium text-[#858898] mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={latInput}
                    onChange={(e) => handleLatChange(e.target.value)}
                    placeholder="51.0980240632225"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[8px] text-[16px] focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-[14px] font-medium text-[#858898] mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={lngInput}
                    onChange={(e) => handleLngChange(e.target.value)}
                    placeholder="71.40599948805387"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[8px] text-[16px] focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Accept Order Button */}
            <Button
              onClick={onAcceptOrder}
              disabled={!coordinates}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Accept Order
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-[12px] p-4 shadow-[2px_3px_3px_rgba(0,0,0,0.1)]">
              <h3 className="font-semibold text-[18px] text-black mb-2">Heatmap Mode</h3>
              <p className="text-[14px] text-[#858898] mb-4">
                Click anywhere on the map to check demand information for that location.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-[12px] text-[#858898]">High Demand</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-[12px] text-[#858898]">Medium Demand</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-[12px] text-[#858898]">Low Demand</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;
