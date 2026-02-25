// src/types/game.ts — Prahra data model

export interface Game {
  /** Unique identifier (UUID or slug) */
  id: string
  /** Human-readable URL slug */
  slug: string
  /** Game name */
  name: string
  /** Author / creator name */
  author: string
  /** Creation date (ISO 8601) */
  createdAt: string
  /** Last modification date (ISO 8601) */
  updatedAt: string
  /** Game description (Markdown supported) */
  description: string
  /** Estimated duration in minutes */
  estimatedDurationMin: number
  /** Difficulty 1-5 */
  difficulty: 1 | 2 | 3 | 4 | 5
  /** Language code (cs, en, ...) */
  language: string
  /** Is the game published and playable? */
  isPublished: boolean
  /** Max team size (1 = solo only) */
  maxTeamSize: number
  /** List of things player needs to bring */
  requiredItems: string[]
  /** Cover image and other game-level media */
  media: Media[]
  /** Starting point GPS (where the game begins) */
  startLocation: GpsLocation
  /** Ordered list of levels/stages */
  levels: Level[]
}

export interface Level {
  /** Unique identifier within the game */
  id: string
  /** Order in sequence (1-based) */
  order: number
  /** Level name / title */
  name: string
  /** Story text / puzzle description (Markdown) */
  description: string
  /** GPS location of this checkpoint */
  location: GpsLocation
  /** Radius in meters to trigger "you're here" (min 20) */
  unlockRadius: number
  /** How the answer is validated */
  answerType: AnswerType
  /** Correct answer(s) — evaluated based on answerType */
  answer: string | string[]
  /** Progressive hints (ordered by helpfulness, each with penalty) */
  hints: Hint[]
  /** Points awarded for solving (before hint penalties) */
  points: number
  /** Optional time limit for this level in seconds (0 = no limit) */
  timeLimitSec: number
  /** Media: images, audio, video, attachments */
  media: Media[]
  /** Optional: what happens after solving (flavor text, animation, etc.) */
  solvedMessage?: string
}

export interface Hint {
  /** Hint text (Markdown) */
  text: string
  /** Time penalty in seconds added when hint is revealed */
  penaltySec: number
}

export interface GpsLocation {
  lat: number
  lng: number
  /** Optional human-readable name ("U Orloje", "Park Lužánky") */
  label?: string
}

export interface Media {
  /** Type of media */
  type: "image" | "audio" | "video" | "attachment" | "youtube"
  /** URL or relative path to the file */
  url: string
  /** Alt text / caption */
  caption?: string
}

export type AnswerType =
  | "exact" // Case-insensitive exact match
  | "regex" // RegExp pattern match
  | "multi-choice" // answer is string[], player picks one
  | "qr-code" // Player scans QR → value must match answer
  | "none" // No answer needed, just reach the location

/** Persisted game state (localStorage) */
export interface GameState {
  gameSlug: string
  currentLevelIndex: number
  startedAt: string
  score: number
  /** Total penalty time in seconds */
  penaltyTimeSec: number
  /** Which hints have been revealed: levelId -> hint indices */
  revealedHints: Record<string, number[]>
  /** Timestamps when each level was completed */
  completedLevels: Record<string, string>
  /** Is the game finished? */
  isComplete: boolean
  completedAt?: string
}
