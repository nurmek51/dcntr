import { describe, it, expect } from 'vitest';
import { predictDestination, getClusters, validateCoordinates, PredictionApiError } from '../src/services/predictionApi';

describe('predictionApi', () => {
  describe('validateCoordinates', () => {
    it('should return true for valid coordinates', () => {
      expect(validateCoordinates(43.2220, 76.8512)).toBe(true);
      expect(validateCoordinates(0, 0)).toBe(true);
      expect(validateCoordinates(-90, -180)).toBe(true);
      expect(validateCoordinates(90, 180)).toBe(true);
    });

    it('should return false for invalid coordinates', () => {
      expect(validateCoordinates(91, 0)).toBe(false);
      expect(validateCoordinates(-91, 0)).toBe(false);
      expect(validateCoordinates(0, 181)).toBe(false);
      expect(validateCoordinates(0, -181)).toBe(false);
      expect(validateCoordinates(NaN, 0)).toBe(false);
      expect(validateCoordinates(0, NaN)).toBe(false);
    });
  });

  describe('predictDestination', () => {
    it('should return mock prediction response with updated start point', async () => {
      const request = { start_lat: 51.09526, start_lng: 71.11111 };
      const result = await predictDestination(request);

      expect(result).toHaveProperty('predictions');
      expect(result).toHaveProperty('model_info');
      expect(result).toHaveProperty('request_summary');
      expect(result.predictions).toHaveLength(3);
      expect(result.predictions[0]).toHaveProperty('cluster_id', 1);
      expect(result.predictions[0]).toHaveProperty('probability', 0.45);
      expect(result.predictions[0]).toHaveProperty('cluster_center');
      expect(result.request_summary.start_point).toEqual({ lat: 51.09526, lng: 71.11111 });
    });

    it('should return consistent mock data', async () => {
      const request1 = { start_lat: 40.7128, start_lng: -74.0060 };
      const request2 = { start_lat: 51.5074, start_lng: -0.1278 };

      const result1 = await predictDestination(request1);
      const result2 = await predictDestination(request2);

      // Results should be the same structure, but start points different
      expect(result1.predictions).toEqual(result2.predictions);
      expect(result1.model_info).toEqual(result2.model_info);
      expect(result1.request_summary.start_point).toEqual({ lat: 40.7128, lng: -74.0060 });
      expect(result2.request_summary.start_point).toEqual({ lat: 51.5074, lng: -0.1278 });
    });
  });

  describe('getClusters', () => {
    it('should return mock clusters response', async () => {
      const result = await getClusters();

      expect(result).toHaveProperty('clusters');
      expect(result).toHaveProperty('total_clusters', 5);
      expect(result).toHaveProperty('model_info');
      expect(result.clusters).toHaveLength(5);
      expect(result.clusters[0]).toHaveProperty('cluster_id', 1);
      expect(result.clusters[0]).toHaveProperty('center');
      expect(result.clusters[0]).toHaveProperty('description', 'Manhattan Downtown');
    });

    it('should return consistent mock clusters data', async () => {
      const result1 = await getClusters();
      const result2 = await getClusters();

      expect(result1).toEqual(result2);
    });
  });
});
