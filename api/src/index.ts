/// <reference types="@cloudflare/workers-types" />
import { verifyToken } from "@clerk/backend"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { APP_VERSION } from "./version"

type Bindings = {
  prahra_db: D1Database
  CLERK_SECRET_KEY: string
}

type Variables = {
  authUserId: string
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:4242", "http://127.0.0.1:4242"],
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
)

app.get("/api/health", (c) => {
  return c.json({ ok: true })
})

app.get("/api/version", (c) => {
  return c.json({ version: APP_VERSION })
})

app.use("/api/*", async (c, next) => {
  const authHeader = c.req.header("Authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  try {
    const payload = await verifyToken(token, {
      secretKey: c.env.CLERK_SECRET_KEY,
    })

    const userId = payload?.sub
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    c.set("authUserId", userId)
    await next()
  } catch {
    return c.json({ error: "Unauthorized" }, 401)
  }
})

async function ensureUserId(db: D1Database, clerkUserId: string) {
  const existing = await db
    .prepare("SELECT id FROM users WHERE clerk_user_id = ?")
    .bind(clerkUserId)
    .first<{ id: number }>()

  if (existing?.id) {
    return existing.id
  }

  const createdAt = new Date().toISOString()
  const result = await db
    .prepare("INSERT INTO users (clerk_user_id, created_at) VALUES (?, ?)")
    .bind(clerkUserId, createdAt)
    .run()

  return result.meta.last_row_id as number
}

app.get("/api/me", async (c) => {
  const clerkUserId = c.get("authUserId")
  const userId = await ensureUserId(c.env.prahra_db, clerkUserId)
  return c.json({ userId, clerkUserId })
})

app.get("/api/progress/:gameSlug", async (c) => {
  const clerkUserId = c.get("authUserId")
  const userId = await ensureUserId(c.env.prahra_db, clerkUserId)
  const gameSlug = c.req.param("gameSlug")

  const progress = await c.env.prahra_db
    .prepare("SELECT * FROM game_progress WHERE user_id = ? AND game_slug = ?")
    .bind(userId, gameSlug)
    .first()

  const levels = await c.env.prahra_db
    .prepare("SELECT * FROM level_progress WHERE user_id = ? AND game_slug = ?")
    .bind(userId, gameSlug)
    .all()

  return c.json({ progress: progress ?? null, levels: levels.results })
})

app.post("/api/progress/:gameSlug", async (c) => {
  const clerkUserId = c.get("authUserId")
  const userId = await ensureUserId(c.env.prahra_db, clerkUserId)
  const gameSlug = c.req.param("gameSlug")
  const body = await c.req.json<{
    startedAt?: string
    currentLevelIndex?: number
    totalHintsUsed?: number
    totalPenaltySec?: number
    isComplete?: boolean
    completedAt?: string | null
  }>()

  const now = new Date().toISOString()

  await c.env.prahra_db
    .prepare(
      "INSERT INTO game_progress (user_id, game_slug, started_at, current_level_index, total_hints_used, total_penalty_sec, is_complete, completed_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) " +
        "ON CONFLICT(user_id, game_slug) DO UPDATE SET started_at = excluded.started_at, current_level_index = excluded.current_level_index, total_hints_used = excluded.total_hints_used, total_penalty_sec = excluded.total_penalty_sec, is_complete = excluded.is_complete, completed_at = excluded.completed_at, updated_at = excluded.updated_at",
    )
    .bind(
      userId,
      gameSlug,
      body.startedAt ?? null,
      body.currentLevelIndex ?? 0,
      body.totalHintsUsed ?? 0,
      body.totalPenaltySec ?? 0,
      body.isComplete ? 1 : 0,
      body.completedAt ?? null,
      now,
    )
    .run()

  return c.json({ ok: true })
})

app.post("/api/level/:gameSlug/:levelId", async (c) => {
  const clerkUserId = c.get("authUserId")
  const userId = await ensureUserId(c.env.prahra_db, clerkUserId)
  const gameSlug = c.req.param("gameSlug")
  const levelId = c.req.param("levelId")
  const body = await c.req.json<{
    startedAt?: string | null
    completedAt?: string | null
    hintsUsed?: number
    penaltySec?: number
  }>()

  const now = new Date().toISOString()

  await c.env.prahra_db
    .prepare(
      "INSERT INTO level_progress (user_id, game_slug, level_id, started_at, completed_at, hints_used, penalty_sec, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?) " +
        "ON CONFLICT(user_id, game_slug, level_id) DO UPDATE SET started_at = excluded.started_at, completed_at = excluded.completed_at, hints_used = excluded.hints_used, penalty_sec = excluded.penalty_sec, updated_at = excluded.updated_at",
    )
    .bind(
      userId,
      gameSlug,
      levelId,
      body.startedAt ?? null,
      body.completedAt ?? null,
      body.hintsUsed ?? 0,
      body.penaltySec ?? 0,
      now,
    )
    .run()

  return c.json({ ok: true })
})

export default app
