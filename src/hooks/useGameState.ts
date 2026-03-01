import { useCallback, useEffect, useState } from "react"
import type { Game, GameState } from "@/types/game"

type RemoteProgress = {
  progress: {
    started_at: string | null
    current_level_index: number
    total_penalty_sec: number
    is_complete: number
    completed_at: string | null
  } | null
  levels: Array<{
    level_id: string
    started_at: string | null
    completed_at: string | null
    hints_used: number
    penalty_sec: number
  }>
}

const STORAGE_PREFIX = "prahra_"

function getStorageKey(gameSlug: string): string {
  return `${STORAGE_PREFIX}${gameSlug}_state`
}

function loadState(gameSlug: string): GameState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(getStorageKey(gameSlug))
    if (!raw) return null
    return JSON.parse(raw) as GameState
  } catch {
    return null
  }
}

function saveState(state: GameState): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(getStorageKey(state.gameSlug), JSON.stringify(state))
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

function createInitialState(gameSlug: string): GameState {
  return {
    gameSlug,
    currentLevelIndex: 0,
    startedAt: new Date().toISOString(),
    score: 0,
    penaltyTimeSec: 0,
    revealedHints: {},
    unlockedLevels: {},
    completedLevels: {},
    isComplete: false,
  }
}

function normalizeState(saved: GameState): GameState {
  return {
    ...createInitialState(saved.gameSlug),
    ...saved,
    unlockedLevels: saved.unlockedLevels ?? {},
  }
}

function progressScore(state: GameState): number {
  const completed = Object.keys(state.completedLevels).length
  return (state.isComplete ? 10000 : 0) + state.currentLevelIndex * 100 + completed
}

function mergeHintIndices(existing: number[], incoming: number[]): number[] {
  const merged = new Set<number>()
  existing.forEach((idx) => {
    merged.add(idx)
  })
  incoming.forEach((idx) => {
    merged.add(idx)
  })
  return Array.from(merged).sort((a, b) => a - b)
}

/**
 * Hook to manage the game state with localStorage persistence.
 */
export function useGameState(game: Game) {
  const [state, setState] = useState<GameState>(() => {
    const saved = loadState(game.slug)
    if (saved && !saved.isComplete) return normalizeState(saved)
    return createInitialState(game.slug)
  })

  // Persist state on every change
  useEffect(() => {
    saveState(state)
  }, [state])

  /** Get the current level object */
  const currentLevel = game.levels[state.currentLevelIndex] ?? null

  /** Reveal a hint (adds penalty) */
  const revealHint = useCallback(
    (levelId: string, hintIndex: number) => {
      setState((prev) => {
        const existing = prev.revealedHints[levelId] ?? []
        if (existing.includes(hintIndex)) return prev // Already revealed

        const hint = game.levels.find((l) => l.id === levelId)?.hints[hintIndex]
        const penalty = hint?.penaltySec ?? 0

        return {
          ...prev,
          revealedHints: {
            ...prev.revealedHints,
            [levelId]: [...existing, hintIndex],
          },
          penaltyTimeSec: prev.penaltyTimeSec + penalty,
        }
      })
    },
    [game.levels],
  )

  /** Mark current level as completed and advance to next */
  const completeLevel = useCallback(
    (levelId: string) => {
      setState((prev) => {
        const nextIndex = prev.currentLevelIndex + 1
        const isLastLevel = nextIndex >= game.levels.length
        const level = game.levels.find((l) => l.id === levelId)

        return {
          ...prev,
          currentLevelIndex: isLastLevel ? prev.currentLevelIndex : nextIndex,
          score: prev.score + (level?.points ?? 0),
          completedLevels: {
            ...prev.completedLevels,
            [levelId]: new Date().toISOString(),
          },
          isComplete: isLastLevel,
          completedAt: isLastLevel ? new Date().toISOString() : undefined,
        }
      })
    },
    [game.levels],
  )

  /** Mark a level as GPS-unlocked */
  const unlockLevel = useCallback((levelId: string) => {
    setState((prev) => {
      if (prev.unlockedLevels[levelId]) return prev
      return {
        ...prev,
        unlockedLevels: {
          ...prev.unlockedLevels,
          [levelId]: new Date().toISOString(),
        },
      }
    })
  }, [])

  /** Reset the game to start over */
  const resetGame = useCallback(() => {
    const fresh = createInitialState(game.slug)
    setState(fresh)
    saveState(fresh)
  }, [game.slug])

  /** Check if there's a saved game in progress */
  const hasSavedGame = useCallback((): boolean => {
    const saved = loadState(game.slug)
    return saved !== null && !saved.isComplete && saved.currentLevelIndex > 0
  }, [game.slug])

  /** Continue a previously saved game */
  const continueSavedGame = useCallback(() => {
    const saved = loadState(game.slug)
    if (saved) setState(normalizeState(saved))
  }, [game.slug])

  /** Merge remote progress into local state (prefers more advanced progress) */
  const mergeRemoteProgress = useCallback(
    (remote: RemoteProgress) => {
      setState((prev) => {
        if (!remote.progress) return prev

        const revealedHints: GameState["revealedHints"] = { ...prev.revealedHints }
        const completedLevels: GameState["completedLevels"] = { ...prev.completedLevels }

        remote.levels.forEach((level) => {
          if (level.completed_at) {
            completedLevels[level.level_id] = level.completed_at
          }

          const maxHints = game.levels.find((l) => l.id === level.level_id)?.hints.length ?? 0
          const hintsUsed = Math.min(level.hints_used ?? 0, maxHints)
          if (hintsUsed > 0) {
            const incoming = Array.from({ length: hintsUsed }, (_, i) => i)
            const existing = revealedHints[level.level_id] ?? []
            revealedHints[level.level_id] = mergeHintIndices(existing, incoming)
          }
        })

        const remoteState: GameState = normalizeState({
          ...prev,
          startedAt: remote.progress.started_at ?? prev.startedAt,
          currentLevelIndex: remote.progress.current_level_index ?? prev.currentLevelIndex,
          penaltyTimeSec: Math.max(prev.penaltyTimeSec, remote.progress.total_penalty_sec ?? 0),
          isComplete: Boolean(remote.progress.is_complete),
          completedAt: remote.progress.completed_at ?? prev.completedAt,
          revealedHints,
          completedLevels,
        })

        const localScore = progressScore(prev)
        const remoteScore = progressScore(remoteState)

        if (remoteScore > localScore) {
          return remoteState
        }

        return normalizeState({
          ...prev,
          revealedHints,
          completedLevels,
          penaltyTimeSec: Math.max(prev.penaltyTimeSec, remoteState.penaltyTimeSec),
          isComplete: prev.isComplete || remoteState.isComplete,
          completedAt: prev.completedAt ?? remoteState.completedAt,
        })
      })
    },
    [game.levels],
  )

  /** Get elapsed time in seconds (without penalty) */
  const getElapsedTimeSec = useCallback((): number => {
    const start = new Date(state.startedAt).getTime()
    const end = state.completedAt ? new Date(state.completedAt).getTime() : Date.now()
    return Math.floor((end - start) / 1000)
  }, [state.startedAt, state.completedAt])

  /** Get total time including penalties */
  const getTotalTimeSec = useCallback((): number => {
    return getElapsedTimeSec() + state.penaltyTimeSec
  }, [getElapsedTimeSec, state.penaltyTimeSec])

  return {
    state,
    currentLevel,
    revealHint,
    completeLevel,
    unlockLevel,
    resetGame,
    hasSavedGame,
    continueSavedGame,
    mergeRemoteProgress,
    getElapsedTimeSec,
    getTotalTimeSec,
  }
}
