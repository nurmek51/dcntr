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
  onClearPackage: () => void;
  isLoadingLocation: boolean;
  hasSelectedPackage: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  mode,
  onModeChange,
  coordinates,
  onCoordinatesChange,
  onMyLocation,
  onTestDataset,
  onAcceptOrder,
  onClearPackage,
  isLoadingLocation,
  hasSelectedPackage
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
      className="w-[320px] bg-white/95 backdrop-blur-sm h-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-r border-white/20 flex flex-col"
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100/50">
        {/* Mode Switcher */}
        <div className="bg-gray-50/80 rounded-[16px] p-1.5 backdrop-blur-sm">
          <div className="flex">
            <motion.button
              onClick={() => onModeChange('prediction')}
              className={`flex-1 py-2.5 px-4 text-[13px] font-medium rounded-[12px] transition-all relative ${
                mode === 'prediction'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {mode === 'prediction' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-black rounded-[12px] shadow-sm"
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Prediction
              </span>
            </motion.button>
            <motion.button
              onClick={() => onModeChange('heatmap')}
              className={`flex-1 py-2.5 px-4 text-[13px] font-medium rounded-[12px] transition-all relative ${
                mode === 'heatmap'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {mode === 'heatmap' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-black rounded-[12px] shadow-sm"
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Heatmap
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto">
        {mode === 'prediction' ? (
          <div className="space-y-5">
            {/* Clear Package Button */}
            {hasSelectedPackage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Button
                  onClick={onClearPackage}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Route
                </Button>
              </motion.div>
            )}

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <Button
                onClick={onMyLocation}
                disabled={isLoadingLocation}
                loading={isLoadingLocation}
                variant="outline"
                className="w-full justify-start"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                My Location
              </Button>
              
              <Button
                onClick={onTestDataset}
                variant="secondary"
                className="w-full justify-start"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Test Dataset
              </Button>
            </div>

            {/* Coordinates */}
            <div className="space-y-3">
              <h3 className="text-[15px] font-semibold text-gray-900">Coordinates</h3>
              
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={latInput}
                    onChange={(e) => handleLatChange(e.target.value)}
                    placeholder="Latitude"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border-0 rounded-[12px] text-[14px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition-all"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={lngInput}
                    onChange={(e) => handleLngChange(e.target.value)}
                    placeholder="Longitude"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border-0 rounded-[12px] text-[14px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition-all"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Accept Order */}
            <Button
              onClick={onAcceptOrder}
              disabled={!coordinates}
              variant="primary"
              size="lg"
              className="w-full mt-6"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Accept Order
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Heatmap Info */}
            <div className="bg-gradient-to-br from-gray-50/80 to-white/50 rounded-[16px] p-4 backdrop-blur-sm border border-gray-100/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-black/5 rounded-[10px] flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h3 className="text-[15px] font-semibold text-gray-900">Demand Zones</h3>
              </div>
              <p className="text-[13px] text-gray-600 mb-4 leading-relaxed">
                Tap any location on the map to analyze demand patterns and get location insights.
              </p>
              
              {/* Legend */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full shadow-sm"></div>
                  <span className="text-[12px] text-gray-600 font-medium">High Demand</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full shadow-sm"></div>
                  <span className="text-[12px] text-gray-600 font-medium">Medium Demand</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-lime-400 to-green-400 rounded-full shadow-sm"></div>
                  <span className="text-[12px] text-gray-600 font-medium">Low Demand</span>
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
