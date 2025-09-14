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
            <div className="relative bg-gradient-to-br from-[#FFFEE9] via-white to-[#F0F9FF] rounded-[24px] shadow-2xl border-4 border-white/50 backdrop-blur-sm w-full max-w-[520px] p-8 mx-4 overflow-hidden">
              {/* Animated background elements */}
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-xl"
              />
              <motion.div
                animate={{ rotate: -360, scale: [1.2, 1, 1.2] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-r from-green-200/30 to-yellow-200/30 rounded-full blur-xl"
              />
              
              <div className="relative z-10">
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
                className="font-['Press_Start_2P',_monospace] text-[28px] text-black text-center mb-2"
              >
                Configure Your Vehicle
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-poppins font-medium text-[#858898] text-[16px] text-center mb-8"
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
                <label className="block font-poppins font-semibold text-[18px] text-black mb-4">
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
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider shadow-inner"
                    style={{
                      background: `linear-gradient(to right, #94EA0D 0%, #94EA0D ${((engineVolume - 1.2) / (4.5 - 1.2)) * 100}%, #e5e7eb ${((engineVolume - 1.2) / (4.5 - 1.2)) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between font-poppins text-sm text-[#858898] mt-2">
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
                <label className="block font-poppins font-semibold text-[18px] text-black mb-4">
                  Fuel Type
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {fuelTypeOptions.map((option) => (
                    <div
                      key={option.key}
                      onClick={() => setSelectedFuelType(option.key)}
                      className={`flex-1 p-4 rounded-[12px] border-2 transition-all cursor-pointer transform hover:scale-105 ${
                        selectedFuelType === option.key
                          ? 'border-[#94EA0D] bg-white shadow-xl border-4'
                          : 'border-gray-200 bg-white hover:border-gray-300 shadow-lg'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-poppins font-semibold text-[16px] text-black mb-1">
                          {option.label}
                        </div>
                        <div className="font-poppins text-[14px] text-[#858898]">
                          {option.price} ₸/L
                        </div>
                      </div>
                    </div>
                  ))}
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
                  className="w-full bg-[#94EA0D] hover:bg-[#7BC108] text-black py-4 text-[16px] font-poppins font-bold rounded-[12px] shadow-2xl border-4 border-white hover:border-[#94EA0D] transition-all transform hover:scale-105 active:scale-95"
                >
                  Continue
                </Button>
              </motion.div>

              {/* Slider Styles */}
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FuelConfigModal;
