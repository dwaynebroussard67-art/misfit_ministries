/**
 * Privacy-First Location System for Narcan Watch
 * 
 * Location data is NEVER stored permanently.
 * Location is ONLY used during active OD alerts.
 * Responder locations are NEVER shared with anyone.
 * Only victim location is shared with closest responders during emergency.
 */

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface ResponderLocation {
  responderId: number;
  lat: number;
  lng: number;
  timestamp: number; // Client-side only, never sent to server
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Server-side only - responder locations never leave client
 */
export function calculateDistance(
  victimLat: number,
  victimLng: number,
  responderLat: number,
  responderLng: number
): number {
  const R = 3959; // Earth radius in miles
  const dLat = (responderLat - victimLat) * (Math.PI / 180);
  const dLng = (responderLng - victimLng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(victimLat * (Math.PI / 180)) *
      Math.cos(responderLat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find closest responders to victim
 * Server-side calculation only - no location data stored
 */
export function findClosestResponders(
  victimLat: number,
  victimLng: number,
  responderLocations: ResponderLocation[],
  maxDistance: number = 5 // miles
): Array<{
  responderId: number;
  distance: number;
}> {
  const nearby = responderLocations
    .map(r => ({
      responderId: r.responderId,
      distance: calculateDistance(victimLat, victimLng, r.lat, r.lng),
    }))
    .filter(r => r.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);

  return nearby;
}

/**
 * Generate temporary alert token
 * Expires after 30 minutes
 */
export function generateAlertToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Check if alert token is expired
 */
export function isAlertExpired(createdAt: Date, expiryMinutes: number = 30): boolean {
  const now = new Date();
  const elapsed = (now.getTime() - createdAt.getTime()) / 1000 / 60;
  return elapsed > expiryMinutes;
}

/**
 * Sanitize location data for logging
 * Never log exact coordinates
 */
export function sanitizeLocationForLogging(lat: number, lng: number): string {
  return `[${Math.round(lat * 100) / 100}, ${Math.round(lng * 100) / 100}]`;
}
