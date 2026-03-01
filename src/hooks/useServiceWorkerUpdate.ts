import { useEffect, useState } from "react"
import { registerServiceWorker } from "../lib/registerServiceWorker"

export function useServiceWorkerUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    let refreshing = false

    const onControllerChange = () => {
      if (refreshing) {
        return
      }
      refreshing = true
      window.location.reload()
    }

    registerServiceWorker({
      onUpdate: (registration) => {
        setUpdateAvailable(true)
        setWaitingWorker(registration.waiting)
      },
    })

    navigator.serviceWorker?.addEventListener(
      "controllerchange",
      onControllerChange
    )

    return () => {
      navigator.serviceWorker?.removeEventListener(
        "controllerchange",
        onControllerChange
      )
    }
  }, [])

  const refresh = () => {
    if (!waitingWorker) {
      return
    }
    waitingWorker.postMessage({ type: "SKIP_WAITING" })
  }

  return { updateAvailable, refresh }
}
