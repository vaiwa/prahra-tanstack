import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { addToSyncQueue, clearSyncQueue, getSyncQueue } from "./syncQueue"

describe("syncQueue", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-07T10:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns empty array when queue is empty", () => {
    expect(getSyncQueue()).toEqual([])
  })

  it("adds item to queue", () => {
    addToSyncQueue("/api/test", { foo: "bar" })
    const queue = getSyncQueue()
    expect(queue).toHaveLength(1)
    expect(queue[0].path).toBe("/api/test")
    expect(queue[0].body).toEqual({ foo: "bar" })
    expect(queue[0].timestamp).toBe("2026-03-07T10:00:00.000Z")
  })

  it("appends multiple items", () => {
    addToSyncQueue("/api/a", { a: 1 })
    addToSyncQueue("/api/b", { b: 2 })
    expect(getSyncQueue()).toHaveLength(2)
  })

  it("clears the queue", () => {
    addToSyncQueue("/api/test", {})
    clearSyncQueue()
    expect(getSyncQueue()).toEqual([])
  })

  it("returns empty array on corrupted localStorage data", () => {
    localStorage.setItem("prahra_sync_queue", "not-json")
    expect(getSyncQueue()).toEqual([])
  })
})
