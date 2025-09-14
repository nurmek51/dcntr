import type { Coordinates, AddressResult } from '../types/prediction';

export class AddressServiceError extends Error {
  public code?: string;
  
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'AddressServiceError';
    this.code = code;
  }
}

export class KazakhstanAddressService {
  private static readonly NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
  
  /**
   * Convert coordinates to human-readable address (reverse geocoding)
   */
  static async reverseGeocode(coordinates: Coordinates): Promise<string> {
    try {
      const { lat, lng } = coordinates;
      
      // Validate coordinates
      if (!this.isValidCoordinate(lat, lng)) {
        throw new AddressServiceError('Invalid coordinates provided');
      }

      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`,
        {
          headers: {
            'User-Agent': 'DestinationPrediction/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new AddressServiceError(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new AddressServiceError(data.error);
      }

      // Format address for Kazakhstan context
      return this.formatKazakhstanAddress(data);
    } catch (error) {
      if (error instanceof AddressServiceError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error - return fallback
        return this.getCoordinatesFallback(coordinates);
      }
      
      // Unknown error - return fallback
      console.warn('Address service error:', error);
      return this.getCoordinatesFallback(coordinates);
    }
  }

  /**
   * Convert address to coordinates (forward geocoding)
   */
  static async forwardGeocode(address: string): Promise<AddressResult[]> {
    try {
      if (!address.trim()) {
        throw new AddressServiceError('Address cannot be empty');
      }

      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/search?format=json&q=${encodedAddress}&countrycodes=kz&limit=5&addressdetails=1&accept-language=en`,
        {
          headers: {
            'User-Agent': 'DestinationPrediction/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new AddressServiceError(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.map((item: any) => ({
        address: this.formatKazakhstanAddress(item),
        coordinates: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        },
      }));
    } catch (error) {
      if (error instanceof AddressServiceError) {
        throw error;
      }
      
      console.warn('Forward geocoding error:', error);
      throw new AddressServiceError('Unable to find address');
    }
  }

  /**
   * Format address data for Kazakhstan context
   */
  private static formatKazakhstanAddress(data: any): string {
    const address = data.address || {};
    const displayName = data.display_name || '';
    
    // Try to build a meaningful address from components
    const parts: string[] = [];
    
    // Add house number and street
    if (address.house_number && address.road) {
      parts.push(`${address.house_number} ${address.road}`);
    } else if (address.road) {
      parts.push(address.road);
    }
    
    // Add district or suburb
    if (address.suburb) {
      parts.push(address.suburb);
    } else if (address.district) {
      parts.push(address.district);
    }
    
    // Add city
    if (address.city) {
      parts.push(address.city);
    } else if (address.town) {
      parts.push(address.town);
    } else if (address.village) {
      parts.push(address.village);
    }
    
    // Add region/state
    if (address.state) {
      parts.push(address.state);
    }
    
    // If we have parts, join them
    if (parts.length > 0) {
      return parts.join(', ');
    }
    
    // Fallback to display name, but clean it up
    if (displayName) {
      // Take first few meaningful parts of display name
      const nameParts = displayName.split(', ').slice(0, 3);
      return nameParts.join(', ');
    }
    
    return 'Unknown location';
  }

  /**
   * Fallback when address service fails
   */
  private static getCoordinatesFallback(coordinates: Coordinates): string {
    return `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`;
  }

  /**
   * Validate coordinates
   */
  private static isValidCoordinate(lat: number, lng: number): boolean {
    return (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180 &&
      !isNaN(lat) &&
      !isNaN(lng)
    );
  }

  /**
   * Check if coordinates are within Kazakhstan bounds (approximate)
   */
  static isWithinKazakhstan(coordinates: Coordinates): boolean {
    const { lat, lng } = coordinates;
    
    // Approximate bounds of Kazakhstan
    const bounds = {
      north: 55.45,
      south: 40.95,
      east: 87.35,
      west: 46.85,
    };
    
    return (
      lat >= bounds.south &&
      lat <= bounds.north &&
      lng >= bounds.west &&
      lng <= bounds.east
    );
  }
}
