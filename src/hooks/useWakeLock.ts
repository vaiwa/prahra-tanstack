import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Hook to keep the screen awake using the Screen Wake Lock API.
 * Prevents the phone from sleeping while the game is active.
 */
export function useWakeLock() {
  const [isActive, setIsActive] = useState(false)
  const [isSupported] = useState(
    () => typeof navigator !== "undefined" && "wakeLock" in navigator,
  )
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  const request = useCallback(async () => {
    if (!isSupported) return

    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen")
      setIsActive(true)

      wakeLockRef.current.addEventListener("release", () => {
        setIsActive(false)
      })
    } catch {
      // Wake lock request failed (e.g. low battery, minimized tab)
      setIsActive(false)
    }
  }, [isSupported])

  const release = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release()
      wakeLockRef.current = null
      setIsActive(false)
    }
  }, [])

  // Re-acquire wake lock when page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isActive) {
        request()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isActive, request])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release()
      }
    }
  }, [])

  return {
    isActive,
    isSupported,
    request,
    release,
  }
}
