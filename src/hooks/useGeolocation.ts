import { useCallback, useEffect, useRef, useState } from "react"
import type { GpsLocation } from "@/types/game"

export interface GeolocationState {
  /** Current position or null if not yet acquired */
  position: GpsLocation | null
  /** Accuracy in meters */
  accuracy: number | null
  /** Error message if geolocation failed */
  error: string | null
  /** Whether actively tracking */
  isTracking: boolean
  /** Timestamp of last update */
  lastUpdate: number | null
}

interface UseGeolocationOptions {
  /** Enable high accuracy (GPS vs cell tower) */
  enableHighAccuracy?: boolean
  /** Maximum age of cached position in ms */
  maximumAge?: number
  /** Timeout for position request in ms */
  timeout?: number
}

/**
 * Hook to track the user's GPS position using the Geolocation API.
 * Supports a "fake position" override for debug/testing.
 */
export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    maximumAge = 5000,
    timeout = 15000,
  } = options

  const [state, setState] = useState<GeolocationState>({
    position: null,
    accuracy: null,
    error: null,
    isTracking: false,
    lastUpdate: null,
  })

  const [fakePosition, setFakePosition] = useState<GpsLocation | null>(null)
  const watchIdRef = useRef<number | null>(null)

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation API není v tomto prohlížeči dostupná.",
      }))
      return
    }

    setState((prev) => ({ ...prev, isTracking: true, error: null }))

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        // If fake position is active, ignore real GPS
        if (fakePosition) return

        setState({
          position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          accuracy: pos.coords.accuracy,
          error: null,
          isTracking: true,
          lastUpdate: pos.timestamp,
        })
      },
      (err) => {
        let errorMessage: string
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage =
              "Přístup k poloze byl zamítnut. Povol GPS v nastavení prohlížeče."
            break
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Poloha není dostupná. Zkus to venku."
            break
          case err.TIMEOUT:
            errorMessage = "Získání polohy trvá příliš dlouho."
            break
          default:
            errorMessage = "Neznámá chyba při získávání polohy."
        }
        setState((prev) => ({ ...prev, error: errorMessage }))
      },
      { enableHighAccuracy, maximumAge, timeout },
    )
  }, [enableHighAccuracy, maximumAge, timeout, fakePosition])

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setState((prev) => ({ ...prev, isTracking: false }))
  }, [])

  /** Override GPS with a fake position (for debug) */
  const teleportTo = useCallback((position: GpsLocation) => {
    setFakePosition(position)
    setState((prev) => ({
      ...prev,
      position,
      accuracy: 1,
      error: null,
      lastUpdate: Date.now(),
    }))
  }, [])

  /** Clear fake position and resume real GPS */
  const clearFakePosition = useCallback(() => {
    setFakePosition(null)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  return {
    ...state,
    startTracking,
    stopTracking,
    teleportTo,
    clearFakePosition,
    isFakePosition: fakePosition !== null,
  }
}
