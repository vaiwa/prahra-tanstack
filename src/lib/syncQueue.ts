const SYNC_QUEUE_KEY = "prahra_sync_queue"

type SyncQueueItem = {
  path: string
  body: unknown
  timestamp: string
}

export const getSyncQueue = (): SyncQueueItem[] => {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY)
    return raw ? (JSON.parse(raw) as SyncQueueItem[]) : []
  } catch {
    return []
  }
}

export const addToSyncQueue = (path: string, body: unknown): void => {
  try {
    const queue = getSyncQueue()
    queue.push({ path, body, timestamp: new Date().toISOString() })
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue))
  } catch {
    // localStorage full — fail silently
  }
}

export const clearSyncQueue = (): void => {
  try {
    localStorage.removeItem(SYNC_QUEUE_KEY)
  } catch {
    // fail silently
  }
}
