import type { GpsLocation } from "@/types/game"

/**
 * Calculate the distance between two GPS coordinates using the Haversine formula.
 * @returns Distance in meters
 */
export function haversineDistance(a: GpsLocation, b: GpsLocation): number {
  const R = 6_371_000 // Earth's radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)

  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)

  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng

  return 2 * R * Math.asin(Math.sqrt(h))
}

/**
 * Format distance for display.
 * Under 1000m → "340 m", above → "1.2 km"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

/**
 * Calculate bearing from point A to point B in degrees (0-360).
 * 0 = North, 90 = East, 180 = South, 270 = West.
 */
export function calculateBearing(from: GpsLocation, to: GpsLocation): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const toDeg = (rad: number) => (rad * 180) / Math.PI

  const dLng = toRad(to.lng - from.lng)
  const fromLat = toRad(from.lat)
  const toLat = toRad(to.lat)

  const y = Math.sin(dLng) * Math.cos(toLat)
  const x =
    Math.cos(fromLat) * Math.sin(toLat) -
    Math.sin(fromLat) * Math.cos(toLat) * Math.cos(dLng)

  return (toDeg(Math.atan2(y, x)) + 360) % 360
}
