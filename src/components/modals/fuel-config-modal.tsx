import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import smartCar from '../../assets/smart-car.png';
import { FUEL_PRICES } from '../../utils/cost';
import Button from '../ui/button';

interface FuelConfigModalProps {
  isOpen: boolean;
  onClose: (engineVolume: number, fuelType: keyof typeof FUEL_PRICES) => void;
}

const FuelConfigModal: React.FC<FuelConfigModalProps> = ({ isOpen, onClose }) => {
  const [engineVolume, setEngineVolume] = useState<number>(2.0);
  const [selectedFuelType, setSelectedFuelType] = useState<keyof typeof FUEL_PRICES>('PREMIUM_95');

  const handleSubmit = () => {
    onClose(engineVolume, selectedFuelType);
  };

  const fuelTypeOptions = [
    { key: 'REGULAR_92' as const, label: 'AI-92', price: FUEL_PRICES.REGULAR_92 },
    { key: 'PREMIUM_95' as const, label: 'AI-95', price: FUEL_PRICES.PREMIUM_95 },
    { key: 'DIESEL' as const, label: 'Diesel', price: FUEL_PRICES.DIESEL },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-[#FFFEE9] rounded-[20px] shadow-[3px_4px_4px_rgba(0,0,0,0.4)] w-full max-w-[500px] p-8 mx-4">
              {/* Car Illustration */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-8"
              >
                <div
                  className="bg-center bg-contain bg-no-repeat"
                  style={{
                    backgroundImage: `url('${smartCar}')`,
                    height: '120px',
                    width: '200px',
                  }}
                />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-bold text-[28px] text-black text-center mb-2"
              >
                Configure Your Vehicle
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-medium text-[#858898] text-[16px] text-center mb-8"
              >
                Set up your car's engine and fuel preferences
              </motion.p>

              {/* Engine Volume Slider */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <label className="block font-semibold text-[18px] text-black mb-4">
                  Engine Volume: {engineVolume.toFixed(1)}L
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="1.2"
                    max="4.5"
                    step="0.1"
                    value={engineVolume}
                    onChange={(e) => setEngineVolume(parseFloat(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-[#858898] mt-2">
                    <span>1.2L</span>
                    <span>4.5L</span>
                  </div>
                </div>
              </motion.div>

              {/* Fuel Type Dropdown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <label className="block font-semibold text-[18px] text-black mb-4">
                  Fuel Type & Current Tariff
                </label>
                <div className="relative">
                  <select
                    value={selectedFuelType}
                    onChange={(e) => setSelectedFuelType(e.target.value as keyof typeof FUEL_PRICES)}
                    className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-[12px] font-medium text-[16px] text-black appearance-none cursor-pointer focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                  >
                    {fuelTypeOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label} - {option.price} ₸/L
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                    <svg className="fill-current h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Continue
                </Button>
              </motion.div>

              {/* Custom Slider Styles */}
              <style>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  height: 24px;
                  width: 24px;
                  border-radius: 50%;
                  background: #000000;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                
                .slider::-moz-range-thumb {
                  height: 24px;
                  width: 24px;
                  border-radius: 50%;
                  background: #000000;
                  cursor: pointer;
                  border: none;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                
                .slider::-webkit-slider-track {
                  height: 12px;
                  border-radius: 6px;
                  background: linear-gradient(to right, #e5e7eb 0%, #9ca3af 50%, #374151 100%);
                }
                
                .slider::-moz-range-track {
                  height: 12px;
                  border-radius: 6px;
                  background: linear-gradient(to right, #e5e7eb 0%, #9ca3af 50%, #374151 100%);
                  border: none;
                }
              `}</style>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FuelConfigModal;
