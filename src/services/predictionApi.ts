import type { PredictionRequest, PredictionResponse, ClustersResponse, HeatmapResponse } from '../types/prediction';

const API_BASE_URL = 'http://167.172.171.161:8001/api/v1';

export class PredictionApiError extends Error {
  public statusCode?: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'PredictionApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Predict destination areas based on client trips from nearby locations
 */
export async function predictDestination(request: PredictionRequest): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/ml`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new PredictionApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof PredictionApiError) {
      throw error;
    }
    
    // Network or other errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new PredictionApiError('Network error: Unable to connect to the prediction service');
    }
    
    throw new PredictionApiError('An unexpected error occurred while predicting destination');
  }
}

/**
 * Get heatmap data showing clusters of trip start points
 */
export async function getHeatmap(): Promise<HeatmapResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/heatmap`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new PredictionApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof PredictionApiError) {
      throw error;
    }
    
    // Network or other errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new PredictionApiError('Network error: Unable to connect to the heatmap service');
    }
    
    throw new PredictionApiError('An unexpected error occurred while fetching heatmap data');
  }
}

/**
 * Get clusters data (using heatmap endpoint as they provide the same data structure)
 */
export async function getClusters(): Promise<ClustersResponse> {
  try {
    const heatmapData = await getHeatmap();
    
    // Convert heatmap response to clusters response format
    return {
      clusters: heatmapData.clusters.map(cluster => ({
        cluster_id: cluster.cluster_id,
        start_center: cluster.start_center,
        trip_count: cluster.trip_count,
        avg_distance: cluster.avg_distance
      })),
      total_clusters: heatmapData.total_clusters,
      model_info: heatmapData.model_info
    };
  } catch (error) {
    if (error instanceof PredictionApiError) {
      throw error;
    }
    
    throw new PredictionApiError('An unexpected error occurred while fetching clusters data');
  }
}

/**
 * Validate coordinates
 */
export function validateCoordinates(lat: number, lng: number): boolean {
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
 * Mock prediction response for testing when API is not available
 */
export function getMockPredictionResponse(lat: number, lng: number): PredictionResponse {
  return {
    predictions: [
      {
        destination_area: "Торговый центр",
        trip_count: 1,
        percentage: 14.29,
        coordinates: {
          lat: lat + 0.01,
          lng: lng + 0.01
        }
      },
      {
        destination_area: "Больница",
        trip_count: 1,
        percentage: 14.29,
        coordinates: {
          lat: lat - 0.01,
          lng: lng - 0.01
        }
      },
      {
        destination_area: "Фитнес-центр",
        trip_count: 1,
        percentage: 14.29,
        coordinates: {
          lat: lat + 0.005,
          lng: lng + 0.015
        }
      }
    ],
    total_nearby_clients: 3,
    search_radius_km: 1,
    query_location: { lat, lng }
  };
}