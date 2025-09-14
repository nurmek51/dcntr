import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FUEL_PRICES } from '../../utils/cost';
import Button from '../ui/button';
import { PACKAGE_ROUTES, calculateRouteDistance } from '../../utils/coordinates';

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

  // Generate 3 trip packages with real route coordinates
  const tripPackages: TripPackage[] = [
    {
      id: 'package-1',
      routeName: 'Route Package 1',
      route: PACKAGE_ROUTES['package-1'],
      distance: calculateRouteDistance(PACKAGE_ROUTES['package-1']),
      estimatedTime: '25 min',
      get fuelConsumption() { return (this.distance / 100) * fuelConsumptionPer100km; },
      get fuelCost() { return this.fuelConsumption * fuelPrice; },
      get passengerPrice() { return Math.round(this.fuelCost * 1.3); }
    },
    {
      id: 'package-2',
      routeName: 'Route Package 2',
      route: PACKAGE_ROUTES['package-2'],
      distance: calculateRouteDistance(PACKAGE_ROUTES['package-2']),
      estimatedTime: '18 min',
      get fuelConsumption() { return (this.distance / 100) * fuelConsumptionPer100km; },
      get fuelCost() { return this.fuelConsumption * fuelPrice; },
      get passengerPrice() { return Math.round(this.fuelCost * 1.3); }
    },
    {
      id: 'package-3',
      routeName: 'Route Package 3',
      route: PACKAGE_ROUTES['package-3'],
      distance: calculateRouteDistance(PACKAGE_ROUTES['package-3']),
      estimatedTime: '22 min',
      get fuelConsumption() { return (this.distance / 100) * fuelConsumptionPer100km; },
      get fuelCost() { return this.fuelConsumption * fuelPrice; },
      get passengerPrice() { return Math.round(this.fuelCost * 1.3); }
    }
  ].map(pkg => ({
    ...pkg,
    fuelConsumption: (pkg.distance / 100) * fuelConsumptionPer100km,
    fuelCost: ((pkg.distance / 100) * fuelConsumptionPer100km) * fuelPrice,
    passengerPrice: Math.round(((pkg.distance / 100) * fuelConsumptionPer100km) * fuelPrice * 1.3)
  }));

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
      className="bg-white rounded-[16px] shadow-2xl p-6 border-4 border-gray-200"
    >
      {/* Route Name */}
      <h3 className="font-poppins font-bold text-[20px] text-black mb-4 text-center">
        {pkg.routeName}
      </h3>

      {/* Trip Details Grid */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-poppins font-medium text-[#858898] text-[14px]">Distance:</span>
          <span className="font-poppins font-semibold text-black text-[16px]">{pkg.distance.toFixed(1)} km</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-poppins font-medium text-[#858898] text-[14px]">Est. Time:</span>
          <span className="font-poppins font-semibold text-black text-[16px]">{pkg.estimatedTime}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-poppins font-medium text-[#858898] text-[14px]">Fuel Consumption:</span>
          <span className="font-poppins font-semibold text-black text-[16px]">{pkg.fuelConsumption.toFixed(2)} L</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-poppins font-medium text-[#858898] text-[14px]">Fuel Cost:</span>
          <span className="font-poppins font-semibold text-black text-[16px]">{pkg.fuelCost.toFixed(0)} ₸</span>
        </div>
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between items-center">
            <span className="font-poppins font-semibold text-[#858898] text-[14px]">Passenger Price:</span>
            <span className="font-poppins font-bold text-green-600 text-[18px]">{pkg.passengerPrice} ₸</span>
          </div>
        </div>
      </div>

      {/* Select Button */}
      <Button
        onClick={() => onPackageSelect(pkg)}
        variant="primary"
        className="w-full transform hover:scale-105 transition-all shadow-2xl border-2 border-white"
      >
        <span className="font-['Press_Start_2P',_monospace] text-[14px]">
          Select Package
        </span>
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
            <div className="relative bg-gradient-to-br from-[#FFFEE9] via-white to-[#F0F9FF] rounded-[24px] shadow-2xl border-4 border-white/50 backdrop-blur-sm w-full max-w-[920px] max-h-[90vh] overflow-y-auto p-8 mx-4 overflow-hidden">
              {/* Animated background elements */}
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-2xl"
              />
              <motion.div
                animate={{ rotate: -360, scale: [1.1, 1, 1.1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-20 -left-20 w-56 h-56 bg-gradient-to-r from-blue-200/20 to-green-200/20 rounded-full blur-2xl"
              />
              
              <div className="relative z-10">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <h2 className="font-['Press_Start_2P',_monospace] text-[32px] text-black mb-2">
                  Choose Your Trip Package
                </h2>
                <p className="font-poppins font-medium text-[#858898] text-[16px] mb-4">
                  Based on your {engineVolume.toFixed(1)}L engine and {fuelType.replace('_', '-')} fuel
                </p>
                <div className="inline-block bg-white px-4 py-2 rounded-[8px] shadow-lg border-2 border-gray-200">
                  <span className="font-poppins text-[14px] text-[#858898]">
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
                  className="px-12 transform hover:scale-105 transition-all shadow-2xl border-2 border-white"
                >
                  <span className="font-['Press_Start_2P',_monospace] text-[14px]">
                    Skip
                  </span>
                </Button>
              </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TripPackageModal;
