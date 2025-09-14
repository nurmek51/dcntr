import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FUEL_PRICES } from '../../utils/cost';

interface FuelConfigProps {
  onConfigSubmit: (fuelConsumption: number, fuelPrice: number) => void;
}

const FuelConfig: React.FC<FuelConfigProps> = ({ onConfigSubmit }) => {
  const [fuelConsumption, setFuelConsumption] = useState<string>('');
  const [selectedFuelType, setSelectedFuelType] = useState<keyof typeof FUEL_PRICES>('REGULAR_92');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const consumption = parseFloat(fuelConsumption);
    if (isNaN(consumption) || consumption <= 0 || consumption > 50) {
      setError('Please enter a valid fuel consumption between 1 and 50 L/100km');
      return;
    }

    const fuelPrice = FUEL_PRICES[selectedFuelType];
    onConfigSubmit(consumption, fuelPrice);
  };

  return (
    <div className="min-h-screen bg-[#FFFEE9] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Trip Package Calculator
          </h1>
          <p className="text-gray-600">
            Configure your vehicle details to calculate trip costs and suggested passenger prices
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fuel Consumption Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Consumption (L/100km)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="50"
              value={fuelConsumption}
              onChange={(e) => setFuelConsumption(e.target.value)}
              placeholder="e.g., 8.5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Average consumption of your vehicle per 100 kilometers
            </p>
          </div>

          {/* Fuel Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Type
            </label>
            <select
              value={selectedFuelType}
              onChange={(e) => setSelectedFuelType(e.target.value as keyof typeof FUEL_PRICES)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="REGULAR_92">Regular 92 ({FUEL_PRICES.REGULAR_92} ₸/L)</option>
              <option value="PREMIUM_95">Premium 95 ({FUEL_PRICES.PREMIUM_95} ₸/L)</option>
              <option value="DIESEL">Diesel ({FUEL_PRICES.DIESEL} ₸/L)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Current fuel prices in Kazakhstan
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue to Trip Packages
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">How it works:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• We calculate fuel costs based on route distance</li>
            <li>• Add 30% profit margin for passenger pricing</li>
            <li>• Show popular routes based on trip data</li>
            <li>• All prices shown in Kazakhstani Tenge (₸)</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default FuelConfig;
