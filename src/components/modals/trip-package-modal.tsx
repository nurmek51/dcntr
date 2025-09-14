import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FUEL_PRICES } from '../../utils/cost';
import Button from '../ui/button';

interface TripPackage {
  id: string;
  routeName: string;
  distance: number;
  estimatedTime: string;
  fuelConsumption: number;
  fuelCost: number;
  passengerPrice: number;
  startCoordinates: { lat: number; lng: number };
  endCoordinates: { lat: number; lng: number };
}

interface TripPackageModalProps {
  isOpen: boolean;
  engineVolume: number;
  fuelType: keyof typeof FUEL_PRICES;
  onSkip: () => void;
  onPackageSelect: (packageData: TripPackage) => void;
}

const TripPackageModal: React.FC<TripPackageModalProps> = ({ 
  isOpen, 
  engineVolume, 
  fuelType, 
  onSkip,
  onPackageSelect
}) => {
  // Calculate fuel consumption based on engine volume (rough estimation)
  const fuelConsumptionPer100km = Math.round((engineVolume * 4 + 2) * 10) / 10;
  const fuelPrice = FUEL_PRICES[fuelType];

  // Generate 3 sample trip packages with placeholder data
  const tripPackages: TripPackage[] = [
    {
      id: 'package-1',
      routeName: 'Package 1',
      distance: 25.5,
      estimatedTime: '20 min',
      fuelConsumption: (25.5 / 100) * fuelConsumptionPer100km,
      fuelCost: ((25.5 / 100) * fuelConsumptionPer100km) * fuelPrice,
      passengerPrice: Math.round(((25.5 / 100) * fuelConsumptionPer100km) * fuelPrice * 1.3),
      startCoordinates: { lat: 51.0980240632225, lng: 71.40599948805387 },
      endCoordinates: { lat: 51.1280240632225, lng: 71.43599948805387 }
    },
    {
      id: 'package-2',
      routeName: 'Package 2',
      distance: 18.2,
      estimatedTime: '15 min',
      fuelConsumption: (18.2 / 100) * fuelConsumptionPer100km,
      fuelCost: ((18.2 / 100) * fuelConsumptionPer100km) * fuelPrice,
      passengerPrice: Math.round(((18.2 / 100) * fuelConsumptionPer100km) * fuelPrice * 1.3),
      startCoordinates: { lat: 51.0880240632225, lng: 71.39599948805387 },
      endCoordinates: { lat: 51.1080240632225, lng: 71.41599948805387 }
    },
    {
      id: 'package-3',
      routeName: 'Package 3',
      distance: 32.8,
      estimatedTime: '28 min',
      fuelConsumption: (32.8 / 100) * fuelConsumptionPer100km,
      fuelCost: ((32.8 / 100) * fuelConsumptionPer100km) * fuelPrice,
      passengerPrice: Math.round(((32.8 / 100) * fuelConsumptionPer100km) * fuelPrice * 1.3),
      startCoordinates: { lat: 51.1180240632225, lng: 71.42599948805387 },
      endCoordinates: { lat: 51.1480240632225, lng: 71.45599948805387 }
    }
  ];

  const PackageCard: React.FC<{ package: TripPackage; index: number }> = ({ package: pkg, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1 + 0.3,
        type: "spring",
        bounce: 0.3
      }}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="bg-white rounded-[16px] shadow-[3px_4px_4px_rgba(0,0,0,0.15)] p-6 border border-gray-100"
    >
      {/* Route Name */}
      <h3 className="font-bold text-[20px] text-black mb-4 text-center">
        {pkg.routeName}
      </h3>

      {/* Trip Details Grid */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-medium text-[#858898] text-[14px]">Distance:</span>
          <span className="font-semibold text-black text-[16px]">{pkg.distance.toFixed(1)} km</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-medium text-[#858898] text-[14px]">Est. Time:</span>
          <span className="font-semibold text-black text-[16px]">{pkg.estimatedTime}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-medium text-[#858898] text-[14px]">Fuel Consumption:</span>
          <span className="font-semibold text-black text-[16px]">{pkg.fuelConsumption.toFixed(2)} L</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-medium text-[#858898] text-[14px]">Fuel Cost:</span>
          <span className="font-semibold text-black text-[16px]">{pkg.fuelCost.toFixed(0)} ₸</span>
        </div>
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#858898] text-[14px]">Passenger Price:</span>
            <span className="font-bold text-green-600 text-[18px]">{pkg.passengerPrice} ₸</span>
          </div>
        </div>
      </div>

      {/* Select Button */}
      <Button
        onClick={() => onPackageSelect(pkg)}
        variant="primary"
        className="w-full"
      >
        Select Package
      </Button>
    </motion.div>
  );

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
            transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-[#FFFEE9] rounded-[20px] shadow-[3px_4px_4px_rgba(0,0,0,0.4)] w-full max-w-[900px] max-h-[90vh] overflow-y-auto p-8 mx-4">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <h2 className="font-bold text-[32px] text-black mb-2">
                  Choose Your Trip Package
                </h2>
                <p className="font-medium text-[#858898] text-[16px] mb-4">
                  Based on your {engineVolume.toFixed(1)}L engine and {fuelType.replace('_', '-')} fuel
                </p>
                <div className="inline-block bg-white px-4 py-2 rounded-[8px] shadow-sm">
                  <span className="text-[14px] text-[#858898]">
                    Consumption: <strong className="text-black">{fuelConsumptionPer100km}L/100km</strong> • 
                    Fuel Price: <strong className="text-black">{fuelPrice}₸/L</strong>
                  </span>
                </div>
              </motion.div>

              {/* Trip Package Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {tripPackages.map((pkg, index) => (
                  <PackageCard key={pkg.id} package={pkg} index={index} />
                ))}
              </div>

              {/* Skip Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <Button
                  onClick={onSkip}
                  variant="secondary"
                  size="lg"
                  className="px-12"
                >
                  Skip
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TripPackageModal;
