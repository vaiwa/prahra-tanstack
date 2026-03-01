import type { Game, GameState } from "@/types/game"

interface GameCompleteProps {
  game: Game
  state: GameState
  getElapsedTimeSec: () => number
  getTotalTimeSec: () => number
  onRestart: () => void
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}h ${m}min ${s}s`
  }
  return `${m}min ${s}s`
}

export function GameComplete({ game, state, getElapsedTimeSec, getTotalTimeSec, onRestart }: GameCompleteProps) {
  const elapsed = getElapsedTimeSec()
  const total = getTotalTimeSec()
  const totalHintsUsed = Object.values(state.revealedHints).reduce((sum, hints) => sum + hints.length, 0)
  const maxScore = game.levels.reduce((sum, l) => sum + l.points, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Celebration */}
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-foreground">Gratulujeme!</h1>
        <p className="text-muted-foreground">
          Dokončil jsi hru <strong className="text-foreground">{game.name}</strong>
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-foreground">{state.score}</p>
            <p className="text-xs text-muted-foreground">z {maxScore} bodů</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-foreground">{formatTime(elapsed)}</p>
            <p className="text-xs text-muted-foreground">Čistý čas</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-foreground">{formatTime(total)}</p>
            <p className="text-xs text-muted-foreground">S penalizacemi</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold text-foreground">{totalHintsUsed}</p>
            <p className="text-xs text-muted-foreground">Nápověd použito</p>
          </div>
        </div>

        {/* Level breakdown */}
        <div className="rounded-lg border border-border bg-card p-4 text-left">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Přehled levelů</h3>
          <div className="space-y-2">
            {game.levels.map((level) => {
              const hintsUsed = state.revealedHints[level.id]?.length ?? 0
              const isCompleted = level.id in state.completedLevels
              return (
                <div key={level.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">
                    {isCompleted ? "✅" : "⬜"} {level.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {level.points} bodů
                    {hintsUsed > 0 && <span className="text-yellow-400 ml-1">({hintsUsed} 💡)</span>}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={onRestart}
            className="w-full rounded-md border border-border text-muted-foreground py-2 px-4 text-sm hover:bg-muted/50 transition-colors"
          >
            Hrát znovu
          </button>
          <a
            href="/"
            className="block w-full rounded-md bg-primary text-primary-foreground py-2 px-4 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Zpět na seznam her
          </a>
        </div>
      </div>
    </div>
  )
}
