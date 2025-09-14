/**
 * Utility functions for coordinate conversion and route calculations
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Convert DMS (Degrees, Minutes, Seconds) to decimal degrees
 * @param degrees - Degrees value
 * @param minutes - Minutes value
 * @param seconds - Seconds value
 * @param direction - Direction (N, S, E, W)
 * @returns Decimal degrees
 */
export function dmsToDecimal(degrees: number, minutes: number, seconds: number, direction: string): number {
  let decimal = degrees + minutes / 60 + seconds / 60 / 60;
  if (direction === 'S' || direction === 'W') {
    decimal = -decimal;
  }
  return decimal;
}

/**
 * Parse DMS string to decimal degrees
 * @param dmsString - String in format like "51°06'28.1"N"
 * @returns Decimal degrees
 */
export function parseDMS(dmsString: string): number {
  const regex = /(\d+)°(\d+)'([\d.]+)"([NSEW])/;
  const match = dmsString.match(regex);
  
  if (!match) {
    throw new Error(`Invalid DMS format: ${dmsString}`);
  }
  
  const degrees = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const seconds = parseFloat(match[3]);
  const direction = match[4];
  
  return dmsToDecimal(degrees, minutes, seconds, direction);
}

/**
 * Convert DMS coordinate pair to decimal coordinates
 * @param latDMS - Latitude in DMS format
 * @param lngDMS - Longitude in DMS format
 * @returns Coordinates object
 */
export function dmsToCoordinates(latDMS: string, lngDMS: string): Coordinates {
  return {
    lat: parseDMS(latDMS),
    lng: parseDMS(lngDMS)
  };
}

// Package route definitions with real coordinates
export const PACKAGE_ROUTES = {
  'package-1': [
    dmsToCoordinates('51°06\'28.1"N', '71°24\'29.9"E'), // 1
    dmsToCoordinates('51°06\'31.5"N', '71°24\'31.0"E'), // 2
    { lat: 51.108606, lng: 71.409565 }, // 3 (already decimal)
    dmsToCoordinates('51°06\'42.1"N', '71°24\'38.4"E'), // 4
    dmsToCoordinates('51°06\'34.5"N', '71°25\'30.6"E'), // 5
    dmsToCoordinates('51°06\'31.9"N', '71°25\'29.6"E'), // 6
  ],
  'package-2': [
    dmsToCoordinates('51°05\'23.6"N', '71°24\'10.4"E'), // 1
    dmsToCoordinates('51°05\'54.3"N', '71°24\'21.2"E'), // 2
    dmsToCoordinates('51°05\'48.3"N', '71°25\'04.5"E'), // 3
  ],
  'package-3': [
    dmsToCoordinates('51°04\'45.2"N', '71°25\'19.9"E'), // 1
    dmsToCoordinates('51°04\'45.7"N', '71°25\'16.5"E'), // 2
    dmsToCoordinates('51°05\'12.1"N', '71°25\'25.9"E'), // 3
    dmsToCoordinates('51°05\'08.4"N', '71°25\'51.1"E'), // 4
  ]
};

// Default map center (Package 2, Point 2)
export const DEFAULT_MAP_CENTER = dmsToCoordinates('51°05\'54.3"N', '71°24\'21.2"E');

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coord1 - First coordinate
 * @param coord2 - Second coordinate
 * @returns Distance in kilometers
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate total route distance
 * @param route - Array of coordinates
 * @returns Total distance in kilometers
 */
export function calculateRouteDistance(route: Coordinates[]): number {
  let totalDistance = 0;
  for (let i = 0; i < route.length - 1; i++) {
    totalDistance += calculateDistance(route[i], route[i + 1]);
  }
  return totalDistance;
}
