import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft, Bug } from "lucide-react"
import { lazy, Suspense, useEffect, useMemo, useState } from "react"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { DebugPanel } from "@/components/game/DebugPanel"
import { DistanceIndicator } from "@/components/game/DistanceIndicator"
import { GameComplete } from "@/components/game/GameComplete"
import { GameProgress } from "@/components/game/GameProgress"
import { PuzzleCard } from "@/components/game/PuzzleCard"
import { getGameBySlug } from "@/data/games"
import { useGameState } from "@/hooks/useGameState"
import { useGeolocation } from "@/hooks/useGeolocation"
import { useWakeLock } from "@/hooks/useWakeLock"
import { haversineDistance } from "@/lib/geo"

// Lazy load the map (Leaflet is heavy)
const GameMap = lazy(() =>
  import("@/components/game/GameMap").then((m) => ({ default: m.GameMap })),
)

export const Route = createFileRoute("/game/$gameSlug/")({
  component: GamePlay,
})

function GamePlay() {
  const { gameSlug } = Route.useParams()
  const game = getGameBySlug(gameSlug)

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-4xl">🔍</p>
          <h1 className="text-xl font-bold text-foreground">Hra nenalezena</h1>
          <Link
            to="/"
            className="inline-block rounded-md bg-primary text-primary-foreground py-2 px-4 text-sm font-medium hover:bg-primary/90"
          >
            Zpět na seznam
          </Link>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <GameEngine gameSlug={gameSlug} />
    </ErrorBoundary>
  )
}

function GameEngine({ gameSlug }: { gameSlug: string }) {
  // biome-ignore lint/style/noNonNullAssertion: game existence is validated in GamePlay before rendering GameEngine
  const game = getGameBySlug(gameSlug)!
  const [debugMode, setDebugMode] = useState(false)
  const [solvedMessage, setSolvedMessage] = useState<string | null>(null)
  const [forceShowPuzzle, setForceShowPuzzle] = useState(false)

  // Core hooks
  const geo = useGeolocation()
  const wakeLock = useWakeLock()
  const gameState = useGameState(game)

  const { state, currentLevel, revealHint, completeLevel, resetGame } =
    gameState

  // Start tracking GPS and wake lock on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only effect
  useEffect(() => {
    geo.startTracking()
    wakeLock.request()

    return () => {
      geo.stopTracking()
      wakeLock.release()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Calculate distance to current target
  const distanceToTarget = useMemo(() => {
    if (!geo.position || !currentLevel) return null
    return haversineDistance(geo.position, currentLevel.location)
  }, [geo.position, currentLevel])

  // Is player within unlock radius?
  const isInRange = useMemo(() => {
    if (distanceToTarget === null || !currentLevel) return false
    return distanceToTarget <= currentLevel.unlockRadius
  }, [distanceToTarget, currentLevel])

  // Handle correct answer
  const handleCorrectAnswer = () => {
    if (!currentLevel) return

    if (currentLevel.solvedMessage) {
      setSolvedMessage(currentLevel.solvedMessage)
      setTimeout(() => {
        setSolvedMessage(null)
        setForceShowPuzzle(false)
        completeLevel(currentLevel.id)
      }, 3000)
    } else {
      setForceShowPuzzle(false)
      completeLevel(currentLevel.id)
    }
  }

  // Game complete screen
  if (state.isComplete) {
    return (
      <GameComplete
        game={game}
        state={state}
        getElapsedTimeSec={gameState.getElapsedTimeSec}
        getTotalTimeSec={gameState.getTotalTimeSec}
        onRestart={resetGame}
      />
    )
  }

  // Solved message overlay
  if (solvedMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4 animate-in fade-in">
          <p className="text-5xl">🎯</p>
          <p className="text-lg text-foreground leading-relaxed whitespace-pre-line">
            {solvedMessage}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Link
          to="/game/$gameSlug/intro"
          params={{ gameSlug }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          {game.name}
        </Link>
        <button
          type="button"
          onClick={() => setDebugMode((d) => !d)}
          className={`p-2 rounded-lg transition-colors ${
            debugMode
              ? "bg-orange-500/20 text-orange-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title="Debug mode"
        >
          <Bug size={18} />
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 pb-8 space-y-4">
        {/* Progress */}
        <GameProgress
          state={state}
          totalLevels={game.levels.length}
          getElapsedTimeSec={gameState.getElapsedTimeSec}
        />

        {/* GPS Error */}
        {geo.error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <p className="text-sm text-red-400">{geo.error}</p>
          </div>
        )}

        {/* Map */}
        {currentLevel && (
          <ErrorBoundary
            fallback={
              <div className="w-full h-64 rounded-lg bg-muted flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Mapa není dostupná
                </p>
              </div>
            }
          >
            <Suspense
              fallback={
                <div className="w-full h-64 rounded-lg bg-muted animate-pulse flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Načítám mapu...
                  </p>
                </div>
              }
            >
              <GameMap
                playerPosition={geo.position}
                targetPosition={currentLevel.location}
                unlockRadius={currentLevel.unlockRadius}
                accuracy={geo.accuracy}
                showTarget={true}
              />
            </Suspense>
          </ErrorBoundary>
        )}

        {/* Distance indicator */}
        {currentLevel && distanceToTarget !== null && (
          <DistanceIndicator
            distanceMeters={distanceToTarget}
            unlockRadius={currentLevel.unlockRadius}
          />
        )}

        {/* Puzzle card — shows when in range, no GPS, or forced */}
        {currentLevel && (isInRange || !geo.position || forceShowPuzzle) && (
          <PuzzleCard
            level={currentLevel}
            revealedHintIndices={state.revealedHints[currentLevel.id] ?? []}
            onRevealHint={(idx) => revealHint(currentLevel.id, idx)}
            onCorrectAnswer={handleCorrectAnswer}
          />
        )}

        {/* Waiting state — not in range yet */}
        {currentLevel && !isInRange && geo.position && !forceShowPuzzle && (
          <div className="rounded-lg border border-border bg-card p-4 text-center space-y-2">
            <h2 className="text-lg font-bold text-foreground">
              {currentLevel.order}. {currentLevel.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Naviguj se k dalšímu bodu. Až budeš blízko, odemkne se hádanka.
            </p>
            <button
              type="button"
              onClick={() => setForceShowPuzzle(true)}
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              GPS nefunguje? Klikni sem
            </button>
          </div>
        )}

        {/* Debug Panel */}
        {debugMode && (
          <DebugPanel
            position={geo.position}
            accuracy={geo.accuracy}
            isFakePosition={geo.isFakePosition}
            isTracking={geo.isTracking}
            currentLevel={currentLevel}
            distanceToTarget={distanceToTarget}
            levels={game.levels}
            onTeleport={geo.teleportTo}
            onClearFake={geo.clearFakePosition}
          />
        )}
      </div>
    </div>
  )
}
