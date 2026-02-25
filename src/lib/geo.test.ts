import { describe, expect, it } from "vitest"
import { calculateBearing, formatDistance, haversineDistance } from "./geo"

describe("haversineDistance", () => {
  it("returns 0 for the same point", () => {
    const point = { lat: 50.0865, lng: 14.4211 }
    expect(haversineDistance(point, point)).toBe(0)
  })

  it("calculates roughly correct distance between Prague landmarks", () => {
    // Orloj → Týnský chrám ≈ 150m
    const orloj = { lat: 50.087, lng: 14.4213 }
    const tyn = { lat: 50.0879, lng: 14.4225 }
    const distance = haversineDistance(orloj, tyn)
    expect(distance).toBeGreaterThan(100)
    expect(distance).toBeLessThan(200)
  })

  it("handles long distances", () => {
    // Prague → Brno ≈ 185 km
    const prague = { lat: 50.0755, lng: 14.4378 }
    const brno = { lat: 49.1951, lng: 16.6068 }
    const distance = haversineDistance(prague, brno)
    expect(distance).toBeGreaterThan(170_000)
    expect(distance).toBeLessThan(200_000)
  })
})

describe("formatDistance", () => {
  it("formats meters under 1000", () => {
    expect(formatDistance(340)).toBe("340 m")
    expect(formatDistance(0)).toBe("0 m")
    expect(formatDistance(999)).toBe("999 m")
  })

  it("formats kilometers for 1000+", () => {
    expect(formatDistance(1000)).toBe("1.0 km")
    expect(formatDistance(1500)).toBe("1.5 km")
    expect(formatDistance(12345)).toBe("12.3 km")
  })
})

describe("calculateBearing", () => {
  it("returns ~0 for due north", () => {
    const from = { lat: 50.0, lng: 14.0 }
    const to = { lat: 51.0, lng: 14.0 }
    const bearing = calculateBearing(from, to)
    expect(bearing).toBeCloseTo(0, 0)
  })

  it("returns ~90 for due east", () => {
    const from = { lat: 50.0, lng: 14.0 }
    const to = { lat: 50.0, lng: 15.0 }
    const bearing = calculateBearing(from, to)
    expect(bearing).toBeCloseTo(90, 0)
  })

  it("returns ~180 for due south", () => {
    const from = { lat: 51.0, lng: 14.0 }
    const to = { lat: 50.0, lng: 14.0 }
    const bearing = calculateBearing(from, to)
    expect(bearing).toBeCloseTo(180, 0)
  })
})
