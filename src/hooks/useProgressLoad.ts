import { useAuth } from "@clerk/clerk-react"
import { useEffect, useRef } from "react"

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

type ProgressLoadParams = {
  gameSlug: string
  onRemoteProgress: (data: RemoteProgress) => void
}

export const useProgressLoad = ({ gameSlug, onRemoteProgress }: ProgressLoadParams) => {
  const { isSignedIn, getToken } = useAuth()
  const loadedForGame = useRef<string | null>(null)

  useEffect(() => {
    if (!isSignedIn) return
    if (loadedForGame.current === gameSlug) return

    loadedForGame.current = gameSlug

    const load = async () => {
      const token = await getToken()
      if (!token) return

      const response = await fetch(`/api/progress/${gameSlug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) return

      const data = (await response.json()) as RemoteProgress
      onRemoteProgress(data)
    }

    void load()
  }, [gameSlug, getToken, isSignedIn, onRemoteProgress])
}
