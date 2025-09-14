/**
 * Utility functions for geographic calculations
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculate the distance between two points using the Haversine formula
 * @param point1 First coordinate point
 * @param point2 Second coordinate point
 * @returns Distance in kilometers
 */
export function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate the center point (midpoint) between two coordinates
 * @param point1 First coordinate point
 * @param point2 Second coordinate point
 * @returns Midpoint coordinates
 */
export function calculateMidpoint(point1: Coordinates, point2: Coordinates): Coordinates {
  const lat1Rad = toRadians(point1.lat);
  const lat2Rad = toRadians(point2.lat);
  const dLng = toRadians(point2.lng - point1.lng);

  const bx = Math.cos(lat2Rad) * Math.cos(dLng);
  const by = Math.cos(lat2Rad) * Math.sin(dLng);

  const midLat = Math.atan2(
    Math.sin(lat1Rad) + Math.sin(lat2Rad),
    Math.sqrt((Math.cos(lat1Rad) + bx) * (Math.cos(lat1Rad) + bx) + by * by)
  );

  const midLng = toRadians(point1.lng) + Math.atan2(by, Math.cos(lat1Rad) + bx);

  return {
    lat: toDegrees(midLat),
    lng: toDegrees(midLng)
  };
}

/**
 * Convert radians to degrees
 * @param radians Angle in radians
 * @returns Angle in degrees
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}
