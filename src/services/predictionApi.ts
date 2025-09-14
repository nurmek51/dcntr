import type { PredictionRequest, PredictionResponse, ClustersResponse, HeatmapResponse } from '../types/prediction';

// Mock data for testing UI and map integration
const mockClustersResponse: ClustersResponse = {
  clusters: [
    {
      cluster_id: 1,
      center: { lat: 40.7128, lng: -74.0060 }, // New York City
      description: "Manhattan Downtown"
    },
    {
      cluster_id: 2,
      center: { lat: 40.7589, lng: -73.9851 }, // Times Square
      description: "Times Square Area"
    },
    {
      cluster_id: 3,
      center: { lat: 40.7505, lng: -73.9934 }, // Midtown Manhattan
      description: "Midtown Business District"
    },
    {
      cluster_id: 4,
      center: { lat: 40.7282, lng: -73.7949 }, // Queens
      description: "Queens Residential"
    },
    {
      cluster_id: 5,
      center: { lat: 40.6501, lng: -73.9496 }, // Brooklyn
      description: "Brooklyn Heights"
    }
  ],
  total_clusters: 5,
  model_info: {
    model_type: "KMeans",
    top_1_accuracy: 0.85,
    top_3_accuracy: 0.95,
    n_clusters: 5
  }
};

const mockPredictionResponse: PredictionResponse = {
  predictions: [
    {
      cluster_id: 1,
      probability: 0.45,
      cluster_center: { lat: 40.7128, lng: -74.0060 }
    },
    {
      cluster_id: 2,
      probability: 0.32,
      cluster_center: { lat: 40.7589, lng: -73.9851 }
    },
    {
      cluster_id: 3,
      probability: 0.23,
      cluster_center: { lat: 40.7505, lng: -73.9934 }
    }
  ],
  model_info: {
    model_type: "KMeans",
    top_1_accuracy: 0.85,
    top_3_accuracy: 0.95,
    n_clusters: 5
  },
  request_summary: {
    start_point: { lat: 40.7128, lng: -74.0060 } // Will be updated based on request
  }
};

const mockHeatmapResponse: HeatmapResponse = {
  clusters: [
    {
      cluster_id: 4,
      destination_center: {
        lat: 51.098039184813835,
        lng: 71.41182358006851
      },
      trip_count: 168931,
      avg_distance: 0.0060091475815049564
    },
    {
      cluster_id: 9,
      destination_center: {
        lat: 51.08479616426331,
        lng: 71.412670463472
      },
      trip_count: 113249,
      avg_distance: 0.005686349819560172
    },
    {
      cluster_id: 1,
      destination_center: {
        lat: 51.08987649142364,
        lng: 71.40941045721327
      },
      trip_count: 112620,
      avg_distance: 0.009713958202520754
    },
    {
      cluster_id: 7,
      destination_center: {
        lat: 51.08587503509357,
        lng: 71.43063994988637
      },
      trip_count: 94179,
      avg_distance: 0.009581353078868019
    },
    {
      cluster_id: 10,
      destination_center: {
        lat: 51.0980240632225,
        lng: 71.40599948805387
      },
      trip_count: 80570,
      avg_distance: 0.010127638399551525
    },
    {
      cluster_id: 2,
      destination_center: {
        lat: 51.09509098424556,
        lng: 71.42589948596769
      },
      trip_count: 66751,
      avg_distance: 0.008890975006526643
    },
    {
      cluster_id: 5,
      destination_center: {
        lat: 51.090096989245346,
        lng: 71.42592466890109
      },
      trip_count: 66240,
      avg_distance: 0.009369482548943375
    },
    {
      cluster_id: 12,
      destination_center: {
        lat: 51.09901834238404,
        lng: 71.42832149179036
      },
      trip_count: 64824,
      avg_distance: 0.008020505430109333
    },
    {
      cluster_id: 8,
      destination_center: {
        lat: 51.08931260894752,
        lng: 71.40227848915644
      },
      trip_count: 51676,
      avg_distance: 0.009382358361269693
    },
    {
      cluster_id: 14,
      destination_center: {
        lat: 51.085470095970656,
        lng: 71.42184287709576
      },
      trip_count: 49087,
      avg_distance: 0.008671438547065907
    },
    {
      cluster_id: 0,
      destination_center: {
        lat: 51.09564237935837,
        lng: 71.41920956582923
      },
      trip_count: 48937,
      avg_distance: 0.008558932517211215
    },
    {
      cluster_id: 11,
      destination_center: {
        lat: 51.10056870073526,
        lng: 71.42042458674875
      },
      trip_count: 41729,
      avg_distance: 0.009570064588358265
    },
    {
      cluster_id: 6,
      destination_center: {
        lat: 51.08327205143197,
        lng: 71.4029434610796
      },
      trip_count: 41048,
      avg_distance: 0.012759967834130357
    },
    {
      cluster_id: 3,
      destination_center: {
        lat: 51.07877686245986,
        lng: 71.42171784231624
      },
      trip_count: 39609,
      avg_distance: 0.011153272951449042
    },
    {
      cluster_id: 13,
      destination_center: {
        lat: 51.09401066079874,
        lng: 71.43285695769838
      },
      trip_count: 38389,
      avg_distance: 0.013860924590456734
    }
  ],
  total_clusters: 15,
  total_trips: 1077839,
  model_info: {
    model_type: "LogisticRegression",
    top_1_accuracy: 0.11212921261065383,
    top_3_accuracy: 0.2943003571983227,
    n_samples: 32191,
    n_features: 2,
    n_clusters: 15,
    feature_columns: [
      "start_lat",
      "start_lng"
    ],
    cluster_labels: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14
    ],
    cluster_sizes: {
      "0": 2204,
      "1": 2010,
      "2": 2688,
      "3": 1976,
      "4": 3168,
      "5": 2703,
      "6": 1941,
      "7": 1751,
      "8": 1630,
      "9": 1694,
      "10": 3122,
      "11": 1467,
      "12": 2185,
      "13": 1660,
      "14": 1992
    }
  }
};

export class PredictionApiError extends Error {
  public status?: number;
  public code?: string;
  
  constructor(
    message: string,
    status?: number,
    code?: string
  ) {
    super(message);
    this.name = 'PredictionApiError';
    this.status = status;
    this.code = code;
  }
}

// Mock API functions for testing
export async function predictDestination(request: PredictionRequest): Promise<PredictionResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data with updated start point
  return {
    ...mockPredictionResponse,
    request_summary: {
      start_point: { lat: request.start_lat, lng: request.start_lng }
    }
  };
}

export async function getClusters(): Promise<ClustersResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockClustersResponse;
}

export async function getHeatmap(): Promise<HeatmapResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return mockHeatmapResponse;
}

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
