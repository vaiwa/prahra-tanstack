import type { Game } from "@/types/game"
import { demoPragueOldtown } from "./demo-prague-oldtown"

/** All available games indexed by slug */
export const games: Record<string, Game> = {
  [demoPragueOldtown.slug]: demoPragueOldtown,
}

/** Get all published games */
export function getPublishedGames(): Game[] {
  return Object.values(games).filter((g) => g.isPublished)
}

/** Get a game by slug */
export function getGameBySlug(slug: string): Game | undefined {
  return games[slug]
}
