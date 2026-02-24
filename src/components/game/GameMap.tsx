import { useEffect, useRef } from 'react'
import type { GpsLocation } from '@/types/game'

// Leaflet CSS must be imported in the component that uses the map
import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'

// Fix default marker icons in bundled environments
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const playerIcon = L.divIcon({
  className: 'player-marker',
  html: `<div style="
    width: 16px;
    height: 16px;
    background: #3b82f6;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

/** Auto-pan map to follow player position */
function MapFollower({ position }: { position: GpsLocation }) {
  const map = useMap()
  const isFirstRef = useRef(true)

  useEffect(() => {
    if (isFirstRef.current) {
      map.setView([position.lat, position.lng], 16)
      isFirstRef.current = false
    } else {
      map.panTo([position.lat, position.lng])
    }
  }, [map, position.lat, position.lng])

  return null
}

interface GameMapProps {
  playerPosition: GpsLocation | null
  targetPosition: GpsLocation
  unlockRadius: number
  accuracy: number | null
  /** Whether to show the target on the map */
  showTarget?: boolean
}

export function GameMap({
  playerPosition,
  targetPosition,
  unlockRadius,
  accuracy,
  showTarget = true,
}: GameMapProps) {
  const center = playerPosition ?? targetPosition

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={16}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Player position */}
        {playerPosition && (
          <>
            <Marker position={[playerPosition.lat, playerPosition.lng]} icon={playerIcon}>
              <Popup>
                Tvoje pozice
                {accuracy && <span className="text-xs text-muted-foreground"> (±{Math.round(accuracy)}m)</span>}
              </Popup>
            </Marker>

            {/* Accuracy circle */}
            {accuracy && accuracy > 10 && (
              <Circle
                center={[playerPosition.lat, playerPosition.lng]}
                radius={accuracy}
                pathOptions={{
                  color: '#3b82f6',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.1,
                  weight: 1,
                }}
              />
            )}

            <MapFollower position={playerPosition} />
          </>
        )}

        {/* Target position */}
        {showTarget && (
          <>
            <Marker position={[targetPosition.lat, targetPosition.lng]} icon={defaultIcon}>
              <Popup>{targetPosition.label ?? 'Cíl'}</Popup>
            </Marker>

            {/* Unlock radius circle */}
            <Circle
              center={[targetPosition.lat, targetPosition.lng]}
              radius={unlockRadius}
              pathOptions={{
                color: '#22c55e',
                fillColor: '#22c55e',
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '5, 10',
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  )
}
