/**
 * Utility functions for cost calculations related to trip packages
 */

export interface FuelCalculation {
  litersUsed: number;
  fuelCost: number;
  recommendedPrice: number;
}

export interface CostInputs {
  distance: number; // in km
  litersPerHundredKm: number;
  fuelPrice: number; // per liter
  profitMargin?: number; // percentage (default 30%)
}

/**
 * Calculate fuel consumption, cost, and recommended passenger price
 * @param inputs Cost calculation inputs
 * @returns Fuel calculation results
 */
export function calculateTripCost(inputs: CostInputs): FuelCalculation {
  const { distance, litersPerHundredKm, fuelPrice, profitMargin = 0.3 } = inputs;
  
  // Calculate fuel consumption
  const litersUsed = (distance / 100) * litersPerHundredKm;
  
  // Calculate fuel cost
  const fuelCost = litersUsed * fuelPrice;
  
  // Calculate recommended price with profit margin
  const recommendedPrice = fuelCost * (1 + profitMargin);
  
  return {
    litersUsed: Math.round(litersUsed * 100) / 100, // Round to 2 decimal places
    fuelCost: Math.round(fuelCost * 100) / 100,
    recommendedPrice: Math.round(recommendedPrice * 100) / 100
  };
}

/**
 * Default fuel prices in KZT per liter (can be made configurable)
 */
export const FUEL_PRICES = {
  REGULAR_92: 215, // KZT per liter
  PREMIUM_95: 225, // KZT per liter
  DIESEL: 210, // KZT per liter
} as const;

/**
 * Format currency in KZT
 * @param amount Amount in KZT
 * @returns Formatted string
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('en-US')} ₸`;
}

/**
 * Format fuel consumption
 * @param liters Amount in liters
 * @returns Formatted string
 */
export function formatFuelAmount(liters: number): string {
  return `${liters.toFixed(2)} L`;
}
