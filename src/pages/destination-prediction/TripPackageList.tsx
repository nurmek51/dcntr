import React from 'react';
import { motion } from 'framer-motion';
import type { TripPackage } from '../../types/prediction';
import TripPackageCard from './TripPackageCard';

interface TripPackageListProps {
  packages: TripPackage[];
  fuelConsumption: number;
  fuelPrice: number;
  onViewOnMap: (packageData: TripPackage) => void;
}

const TripPackageList: React.FC<TripPackageListProps> = ({
  packages,
  fuelConsumption,
  fuelPrice,
  onViewOnMap,
}) => {
  if (packages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No trip packages available</p>
        <p className="text-sm mt-1">Packages are generated from popular routes</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {packages.map((pkg) => (
          <TripPackageCard
            key={pkg.id}
            package={pkg}
            fuelConsumption={fuelConsumption}
            fuelPrice={fuelPrice}
            onViewOnMap={onViewOnMap}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default TripPackageList;
