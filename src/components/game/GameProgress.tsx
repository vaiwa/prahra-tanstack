import { useEffect, useState } from "react"
import type { GameState } from "@/types/game"

type GameProgressProps = {
  state: GameState
  totalLevels: number
  getElapsedTimeSec: () => number
}

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }
  return `${m}:${String(s).padStart(2, "0")}`
}

export const GameProgress = ({ state, totalLevels, getElapsedTimeSec }: GameProgressProps) => {
  const [elapsed, setElapsed] = useState(getElapsedTimeSec())

  // Update timer every second
  useEffect(() => {
    if (state.isComplete) return

    const interval = setInterval(() => {
      setElapsed(getElapsedTimeSec())
    }, 1000)

    return () => clearInterval(interval)
  }, [state.isComplete, getElapsedTimeSec])

  const completedCount = Object.keys(state.completedLevels).length
  const progressPercent = (completedCount / totalLevels) * 100

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">
            📍 {completedCount}/{totalLevels}
          </span>
          <span className="text-muted-foreground">⏱️ {formatTime(elapsed)}</span>
          {state.penaltyTimeSec > 0 && (
            <span className="text-yellow-400 text-xs">(+{formatTime(state.penaltyTimeSec)})</span>
          )}
        </div>
        <span className="font-medium text-foreground">{state.score} bodů</span>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}
