import type { Level, GpsLocation } from '@/types/game'

interface DebugPanelProps {
  position: GpsLocation | null
  accuracy: number | null
  isFakePosition: boolean
  isTracking: boolean
  currentLevel: Level | null
  distanceToTarget: number | null
  levels: Level[]
  onTeleport: (position: GpsLocation) => void
  onClearFake: () => void
}

export function DebugPanel({
  position,
  accuracy,
  isFakePosition,
  isTracking,
  currentLevel,
  distanceToTarget,
  levels,
  onTeleport,
  onClearFake,
}: DebugPanelProps) {
  return (
    <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
          🔧 Debug Mode
        </h3>
        {isFakePosition && (
          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
            FAKE GPS
          </span>
        )}
      </div>

      {/* Current state */}
      <div className="text-xs text-muted-foreground space-y-1 font-mono">
        <p>
          GPS: {isTracking ? '🟢 tracking' : '🔴 stopped'}
          {position
            ? ` [${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}]`
            : ' [no position]'}
        </p>
        <p>Accuracy: {accuracy ? `±${Math.round(accuracy)}m` : 'N/A'}</p>
        <p>
          Target: {currentLevel?.name ?? 'N/A'}
          {distanceToTarget !== null
            ? ` (${Math.round(distanceToTarget)}m away)`
            : ''}
        </p>
      </div>

      {/* Teleport buttons */}
      <div className="space-y-1">
        <p className="text-xs text-orange-400 font-medium">Teleport k levelu:</p>
        <div className="flex flex-wrap gap-1">
          {levels.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => onTeleport(level.location)}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                currentLevel?.id === level.id
                  ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                  : 'border-border text-muted-foreground hover:border-orange-500/50'
              }`}
            >
              {level.order}. {level.name}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      {isFakePosition && (
        <button
          type="button"
          onClick={onClearFake}
          className="w-full text-xs rounded-md border border-orange-500/30 text-orange-400 py-1 hover:bg-orange-500/10 transition-colors"
        >
          Vypnout fake GPS → použít reálnou polohu
        </button>
      )}
    </div>
  )
}
