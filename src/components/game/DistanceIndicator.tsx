import { formatDistance } from "@/lib/geo"

interface DistanceIndicatorProps {
  distanceMeters: number
  unlockRadius: number
}

/**
 * Shows the distance to the target with color coding:
 * - Red: > 500m
 * - Orange: 100-500m
 * - Yellow: 50-100m
 * - Green: < 50m (close to unlock)
 */
export function DistanceIndicator({ distanceMeters, unlockRadius }: DistanceIndicatorProps) {
  const isInRange = distanceMeters <= unlockRadius
  const formatted = formatDistance(distanceMeters)

  let colorClass: string
  let bgClass: string
  let label: string

  if (isInRange) {
    colorClass = "text-green-400"
    bgClass = "bg-green-500/10 border-green-500/30"
    label = "📍 Jsi na místě!"
  } else if (distanceMeters < 50) {
    colorClass = "text-green-400"
    bgClass = "bg-green-500/10 border-green-500/30"
    label = "Už jsi blízko!"
  } else if (distanceMeters < 100) {
    colorClass = "text-yellow-400"
    bgClass = "bg-yellow-500/10 border-yellow-500/30"
    label = "Skoro tam"
  } else if (distanceMeters < 500) {
    colorClass = "text-orange-400"
    bgClass = "bg-orange-500/10 border-orange-500/30"
    label = "Jdi dál"
  } else {
    colorClass = "text-red-400"
    bgClass = "bg-red-500/10 border-red-500/30"
    label = "Daleko"
  }

  return (
    <div className={`flex items-center justify-between rounded-lg border p-4 ${bgClass}`}>
      <div>
        <p className={`text-2xl font-bold tabular-nums ${colorClass}`}>{formatted}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      {!isInRange && (
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Přiblíž se na {unlockRadius}m</p>
        </div>
      )}
    </div>
  )
}
