export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ClusterCenter {
  lat: number;
  lng: number;
}

export interface Prediction {
  destination_area: string;
  trip_count: number;
  percentage: number;
  coordinates: Coordinates;
}

export interface ModelInfo {
  model_type: string;
  top_1_accuracy: number;
  top_3_accuracy: number;
  n_clusters: number;
  [key: string]: any; // Allow for additional model info fields
}

export interface RequestSummary {
  start_point: Coordinates;
}

export interface PredictionResponse {
  predictions: Prediction[];
  total_nearby_clients: number;
  search_radius_km: number;
  query_location: Coordinates;
}

export interface Cluster {
  cluster_id: number;
  start_center: Coordinates;
  trip_count: number;
  avg_distance: number;
}

export interface ClustersResponse {
  clusters: Cluster[];
  total_clusters: number;
  model_info: ModelInfo;
}

export interface PredictionRequest {
  start_lat: number;
  start_lng: number;
}

export interface AddressResult {
  address: string;
  coordinates: Coordinates;
}

export interface MapMarker {
  id: string;
  position: Coordinates;
  type: 'start' | 'prediction' | 'cluster';
  data?: Prediction | Cluster;
  probability?: number;
}

export interface HeatmapCluster {
  cluster_id: number;
  start_center: Coordinates;
  trip_count: number;
  avg_distance: number;
}

export interface HeatmapResponse {
  clusters: HeatmapCluster[];
  total_clusters: number;
  total_trips: number;
  model_info: ModelInfo;
}

export interface TripPackage {
  id: string;
  startCluster: HeatmapCluster;
  endCluster: HeatmapCluster;
  distance: number;
  routeName: string;
}
