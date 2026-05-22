import { describe, it, expect } from 'vitest';
import {
  calculateDistance,
  findClosestResponders,
  isAlertExpired,
  sanitizeLocationForLogging,
} from './privacy-location.js';

describe('Privacy-First Location System', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two coordinates', () => {
      // New York to Los Angeles (approximately 2,500 miles)
      const distance = calculateDistance(40.7128, -74.006, 34.0522, -118.2437);
      expect(distance).toBeGreaterThan(2400);
      expect(distance).toBeLessThan(2600);
    });

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(40.7128, -74.006, 40.7128, -74.006);
      expect(distance).toBe(0);
    });
  });

  describe('findClosestResponders', () => {
    it('should find responders within distance', () => {
      const responders = [
        { responderId: 1, lat: 40.7128, lng: -74.006 }, // Same location
        { responderId: 2, lat: 40.7580, lng: -73.9855 }, // ~0.5 miles away
        { responderId: 3, lat: 34.0522, lng: -118.2437 }, // ~2,500 miles away
      ];

      const closest = findClosestResponders(40.7128, -74.006, responders, 5);
      expect(closest.length).toBe(2);
      expect(closest[0].responderId).toBe(1);
      expect(closest[1].responderId).toBe(2);
    });

    it('should return empty array if no responders nearby', () => {
      const responders = [
        { responderId: 1, lat: 34.0522, lng: -118.2437 }, // 2,500 miles away
      ];

      const closest = findClosestResponders(40.7128, -74.006, responders, 5);
      expect(closest.length).toBe(0);
    });
  });

  describe('isAlertExpired', () => {
    it('should return false for recent alerts', () => {
      const now = new Date();
      expect(isAlertExpired(now, 30)).toBe(false);
    });

    it('should return true for old alerts', () => {
      const thirtyMinutesAgo = new Date(Date.now() - 31 * 60 * 1000);
      expect(isAlertExpired(thirtyMinutesAgo, 30)).toBe(true);
    });
  });

  describe('sanitizeLocationForLogging', () => {
    it('should sanitize coordinates for logging', () => {
      const sanitized = sanitizeLocationForLogging(40.7128, -74.006);
      expect(sanitized).toBe('[40.71, -74.01]');
    });

    it('should not expose exact coordinates', () => {
      const sanitized = sanitizeLocationForLogging(40.712812345, -74.00612345);
      expect(sanitized).not.toContain('40.712812345');
      expect(sanitized).not.toContain('-74.00612345');
    });
  });
});
