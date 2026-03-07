type RegisterCallbacks = {
  onUpdate?: (registration: ServiceWorkerRegistration) => void
}

export const registerServiceWorker = (callbacks: RegisterCallbacks = {}) => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (!newWorker) {
              return
            }

            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                callbacks.onUpdate?.(registration)
              }
            })
          })
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.warn("SW registration failed:", err)
        })
    })
  }
}
