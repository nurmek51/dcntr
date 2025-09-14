/**
 * API service for hint/check endpoint
 */

export interface HintRequest {
  lat: number;
  lng: number;
  radius_km: number;
}

export interface HintResponse {
  location: {
    lat: number;
    lng: number;
  };
  order_probability: number;
  confidence_level: string;
  nearby_destinations: Array<{
    area: string;
    distance_km: number;
  }>;
  nearby_demand_count: number;
  hint_score: number;
  recommendation: string;
  search_radius_km: number;
}

export class HintApiError extends Error {
  public statusCode?: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'HintApiError';
    this.statusCode = statusCode;
  }
}

const API_BASE_URL = 'http://167.172.171.161:8001/api/v1';

/**
 * Check hint information for a specific location
 */
export async function checkHint(request: HintRequest): Promise<HintResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/hint/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new HintApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof HintApiError) {
      throw error;
    }
    
    // Network or other errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new HintApiError('Network error: Unable to connect to the hint service');
    }
    
    throw new HintApiError('An unexpected error occurred while checking hint');
  }
}

/**
 * Mock hint response for testing when API is not available
 */
export function getMockHintResponse(lat: number, lng: number): HintResponse {
  // Generate realistic mock data based on coordinates
  const baseScore = Math.random() * 0.8 + 0.1; // 0.1 to 0.9
  const demandCount = Math.floor(Math.random() * 5) + 1; // 1 to 5
  
  let confidenceLevel: string;
  let recommendation: string;
  
  if (baseScore > 0.7) {
    confidenceLevel = 'High';
    recommendation = '⚡ Высокая активность, отличное место для ожидания';
  } else if (baseScore > 0.4) {
    confidenceLevel = 'Medium';
    recommendation = '⚡ Средняя активность, можно попробовать';
  } else {
    confidenceLevel = 'Low';
    recommendation = '⚡ Низкая активность, лучше поискать другое место';
  }
  
  // Generate mock nearby destinations
  const destinations = [
    { area: 'Торговый центр', distance_km: Math.round(Math.random() * 0.5 * 100) / 100 },
    { area: 'Школа', distance_km: Math.round(Math.random() * 0.3 * 100) / 100 },
    { area: 'Больница', distance_km: Math.round(Math.random() * 0.8 * 100) / 100 },
    { area: 'Офисный центр', distance_km: Math.round(Math.random() * 0.6 * 100) / 100 }
  ];
  
  return {
    location: { lat, lng },
    order_probability: Math.round(baseScore * 100) / 100,
    confidence_level: confidenceLevel,
    nearby_destinations: destinations.slice(0, demandCount),
    nearby_demand_count: demandCount,
    hint_score: Math.round(baseScore * 100 * 100) / 100,
    recommendation,
    search_radius_km: 0.5
  };
}
