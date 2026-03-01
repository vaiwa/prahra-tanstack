import { useAuth } from "@clerk/clerk-react"
import { useCallback, useEffect, useMemo, useRef } from "react"
import type { GameState, Level } from "@/types/game"

type ProgressSyncParams = {
  gameSlug: string
  state: GameState
  currentLevel: Level | null
}

export function useProgressSync({ gameSlug, state, currentLevel }: ProgressSyncParams) {
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

      await fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
    },
    [getToken],
  )

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

    void postWithAuth(`/api/progress/${gameSlug}`, payload).catch(() => {})
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

    void postWithAuth(`/api/level/${gameSlug}/${currentLevel.id}`, payload).catch(() => {})
  }, [currentLevel, gameSlug, isSignedIn, postWithAuth, state.revealedHints])

  useEffect(() => {
    if (!isSignedIn) return

    const completed = state.completedLevels
    const previous = lastCompleted.current

    Object.keys(completed).forEach((levelId) => {
      if (previous[levelId]) return

      const payload = {
        startedAt: null,
        completedAt: completed[levelId],
        hintsUsed: state.revealedHints[levelId]?.length ?? 0,
        penaltySec: 0,
      }

      void postWithAuth(`/api/level/${gameSlug}/${levelId}`, payload).catch(() => {})
    })

    lastCompleted.current = completed
  }, [gameSlug, isSignedIn, postWithAuth, state.completedLevels, state.revealedHints])
}
