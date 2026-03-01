import { useCallback, useEffect, useState } from "react"
import type { Game, GameState } from "@/types/game"

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
    getElapsedTimeSec,
    getTotalTimeSec,
  }
}
