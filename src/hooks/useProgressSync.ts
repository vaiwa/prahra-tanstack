import { useAuth } from "@clerk/clerk-react"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { addToSyncQueue, clearSyncQueue, getSyncQueue } from "@/lib/syncQueue"
import type { GameState, Level } from "@/types/game"

type ProgressSyncParams = {
  gameSlug: string
  state: GameState
  currentLevel: Level | null
}

export const useProgressSync = ({ gameSlug, state, currentLevel }: ProgressSyncParams) => {
  const { isSignedIn, getToken } = useAuth()
  const lastGamePayload = useRef<string | null>(null)
  const lastLevelStarted = useRef<string | null>(null)
  const lastCompleted = useRef<Record<string, string>>({})

  const totalHintsUsed = useMemo(() => {
    return Object.values(state.revealedHints).reduce((sum, hints) => sum + hints.length, 0)
  }, [state.revealedHints])

  const postWithAuth = useCallback(
    async (path: string, body: unknown) => {
      const token = await getToken()
      if (!token) return

      try {
        const res = await fetch(path, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      } catch {
        addToSyncQueue(path, body)
      }
    },
    [getToken],
  )

  // Flush queued items when coming back online
  useEffect(() => {
    if (!isSignedIn) return

    const flushQueue = async () => {
      const queue = getSyncQueue()
      if (queue.length === 0) return

      const token = await getToken()
      if (!token) return

      clearSyncQueue()

      for (let i = 0; i < queue.length; i++) {
        try {
          await fetch(queue[i].path, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(queue[i].body),
          })
        } catch {
          // Re-queue this and all remaining items
          for (let j = i; j < queue.length; j++) {
            addToSyncQueue(queue[j].path, queue[j].body)
          }
          break
        }
      }
    }

    window.addEventListener("online", flushQueue)
    // Also try to flush on mount (in case we came back online while app was closed)
    void flushQueue()

    return () => {
      window.removeEventListener("online", flushQueue)
    }
  }, [isSignedIn, getToken])

  useEffect(() => {
    if (!isSignedIn) return

    const payload = {
      startedAt: state.startedAt,
      currentLevelIndex: state.currentLevelIndex,
      totalHintsUsed,
      totalPenaltySec: state.penaltyTimeSec,
      isComplete: state.isComplete,
      completedAt: state.completedAt ?? null,
    }

    const payloadKey = JSON.stringify(payload)
    if (payloadKey === lastGamePayload.current) return
    lastGamePayload.current = payloadKey

    void postWithAuth(`/api/progress/${gameSlug}`, payload)
  }, [gameSlug, isSignedIn, postWithAuth, state, totalHintsUsed])

  useEffect(() => {
    if (!isSignedIn || !currentLevel) return

    if (lastLevelStarted.current === currentLevel.id) return
    lastLevelStarted.current = currentLevel.id

    const payload = {
      startedAt: new Date().toISOString(),
      completedAt: null,
      hintsUsed: state.revealedHints[currentLevel.id]?.length ?? 0,
      penaltySec: 0,
    }

    void postWithAuth(`/api/level/${gameSlug}/${currentLevel.id}`, payload)
  }, [currentLevel, gameSlug, isSignedIn, postWithAuth, state.revealedHints])

  useEffect(() => {
    if (!isSignedIn) return

    const completed = state.completedLevels
    const previous = lastCompleted.current

    for (const levelId of Object.keys(completed)) {
      if (previous[levelId]) continue

      const payload = {
        startedAt: null,
        completedAt: completed[levelId],
        hintsUsed: state.revealedHints[levelId]?.length ?? 0,
        penaltySec: 0,
      }

      void postWithAuth(`/api/level/${gameSlug}/${levelId}`, payload)
    }

    lastCompleted.current = completed
  }, [gameSlug, isSignedIn, postWithAuth, state.completedLevels, state.revealedHints])
}
