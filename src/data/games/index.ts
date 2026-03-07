import type { Game } from "@/types/game"
import { demoPragueOldtown } from "./demo-prague-oldtown"
import { testLevels } from "./test-levels"

/** All available games indexed by slug */
export const games: Record<string, Game> = {
  [demoPragueOldtown.slug]: demoPragueOldtown,
  [testLevels.slug]: testLevels,
}

/** Get all published games */
export const getPublishedGames = (): Game[] => {
  return Object.values(games).filter((g) => g.isPublished)
}

/** Get a game by slug */
export const getGameBySlug = (slug: string): Game | undefined => {
  return games[slug]
}
