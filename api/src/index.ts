/// <reference types="@cloudflare/workers-types" />
import { verifyToken } from "@clerk/backend"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { z } from "zod"
import { APP_VERSION } from "./version"

type Bindings = {
  prahra_db: D1Database
  CLERK_SECRET_KEY: string
}

type Variables = {
  authUserId: string
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// --- Validation schemas ---

const slugPattern = /^[a-z0-9_-]{1,100}$/

const gameProgressSchema = z.object({
  startedAt: z.string().max(50).optional(),
  currentLevelIndex: z.number().int().min(0).max(100).optional(),
  totalHintsUsed: z.number().int().min(0).max(1000).optional(),
  totalPenaltySec: z.number().int().min(0).max(100_000).optional(),
  isComplete: z.boolean().optional(),
  completedAt: z.string().max(50).nullable().optional(),
})

const levelProgressSchema = z.object({
  startedAt: z.string().max(50).nullable().optional(),
  completedAt: z.string().max(50).nullable().optional(),
  hintsUsed: z.number().int().min(0).max(100).optional(),
  penaltySec: z.number().int().min(0).max(100_000).optional(),
})

// --- CORS ---

app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:4242", "http://127.0.0.1:4242", "https://prahra.cz", "https://www.prahra.cz"],
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
)

// --- Public endpoints ---

app.get("/api/health", (c) => {
  return c.json({ ok: true })
})

app.get("/api/version", (c) => {
  return c.json({ version: APP_VERSION })
})

// --- Auth middleware ---

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

// --- Helpers ---

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

// --- Authenticated endpoints ---

app.get("/api/me", async (c) => {
  const clerkUserId = c.get("authUserId")
  const userId = await ensureUserId(c.env.prahra_db, clerkUserId)
  return c.json({ userId, clerkUserId })
})

app.get("/api/progress/:gameSlug", async (c) => {
  const clerkUserId = c.get("authUserId")
  const gameSlug = c.req.param("gameSlug")

  if (!slugPattern.test(gameSlug)) {
    return c.json({ error: "Invalid game slug" }, 400)
  }

  const userId = await ensureUserId(c.env.prahra_db, clerkUserId)

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
  const gameSlug = c.req.param("gameSlug")

  if (!slugPattern.test(gameSlug)) {
    return c.json({ error: "Invalid game slug" }, 400)
  }

  const raw = await c.req.json()
  const parsed = gameProgressSchema.safeParse(raw)
  if (!parsed.success) {
    return c.json({ error: "Invalid request body" }, 400)
  }

  const body = parsed.data
  const userId = await ensureUserId(c.env.prahra_db, clerkUserId)
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
  const gameSlug = c.req.param("gameSlug")
  const levelId = c.req.param("levelId")

  if (!slugPattern.test(gameSlug) || !slugPattern.test(levelId)) {
    return c.json({ error: "Invalid parameters" }, 400)
  }

  const raw = await c.req.json()
  const parsed = levelProgressSchema.safeParse(raw)
  if (!parsed.success) {
    return c.json({ error: "Invalid request body" }, 400)
  }

  const body = parsed.data
  const userId = await ensureUserId(c.env.prahra_db, clerkUserId)
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
