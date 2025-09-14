import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { TripPackage } from '../../types/prediction';
import { calculateTripCost, formatCurrency, formatFuelAmount } from '../../utils/cost';
import { KazakhstanAddressService } from '../../services/addressService';

interface TripPackageCardProps {
  package: TripPackage;
  fuelConsumption: number;
  fuelPrice: number;
  onViewOnMap: (packageData: TripPackage) => void;
}

const TripPackageCard: React.FC<TripPackageCardProps> = ({
  package: pkg,
  fuelConsumption,
  fuelPrice,
  onViewOnMap,
}) => {
  const [startAddress, setStartAddress] = useState<string>('Loading...');
  const [endAddress, setEndAddress] = useState<string>('Loading...');
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // Calculate trip costs
  const costCalculation = calculateTripCost({
    distance: pkg.distance,
    litersPerHundredKm: fuelConsumption,
    fuelPrice,
  });

  // Load addresses for start and end clusters
  useEffect(() => {
    const loadAddresses = async () => {
      setIsLoadingAddresses(true);
      try {
        const [startAddr, endAddr] = await Promise.all([
          KazakhstanAddressService.reverseGeocode(pkg.startCluster.start_center),
          KazakhstanAddressService.reverseGeocode(pkg.endCluster.start_center)
        ]);
        setStartAddress(startAddr);
        setEndAddress(endAddr);
      } catch (error) {
        console.warn('Failed to load addresses:', error);
        setStartAddress(`${pkg.startCluster.start_center.lat.toFixed(4)}, ${pkg.startCluster.start_center.lng.toFixed(4)}`);
        setEndAddress(`${pkg.endCluster.start_center.lat.toFixed(4)}, ${pkg.endCluster.start_center.lng.toFixed(4)}`);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [pkg.startCluster, pkg.endCluster]);

  const handleViewOnMap = () => {
    onViewOnMap(pkg);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow"
    >
      {/* Route Header */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">
          {pkg.routeName}
        </h3>
        <div className="flex items-center text-sm text-gray-600">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
            {pkg.startCluster.trip_count.toLocaleString()} trips
          </span>
          <span className="mx-2">→</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            {pkg.endCluster.trip_count.toLocaleString()} trips
          </span>
        </div>
      </div>

      {/* Addresses */}
      <div className="mb-4 space-y-2">
        <div className="flex items-start gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">From</p>
            <p className="text-sm text-gray-800">
              {isLoadingAddresses ? 'Loading address...' : startAddress}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">To</p>
            <p className="text-sm text-gray-800">
              {isLoadingAddresses ? 'Loading address...' : endAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Distance:</span>
          <span className="font-medium">{pkg.distance.toFixed(1)} km</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Fuel needed:</span>
          <span className="font-medium">{formatFuelAmount(costCalculation.litersUsed)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Fuel cost:</span>
          <span className="font-medium">{formatCurrency(costCalculation.fuelCost)}</span>
        </div>
        <div className="flex justify-between text-sm border-t pt-2">
          <span className="text-gray-600 font-medium">Suggested price:</span>
          <span className="font-bold text-green-600">{formatCurrency(costCalculation.recommendedPrice)}</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleViewOnMap}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
      >
        View on Map
      </button>

      {/* Profit Indicator */}
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-500">
          Profit: {formatCurrency(costCalculation.recommendedPrice - costCalculation.fuelCost)} (30%)
        </span>
      </div>
    </motion.div>
  );
};

export default TripPackageCard;
