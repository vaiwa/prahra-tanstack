import { createFileRoute, Link } from "@tanstack/react-router"
import { Clock, MapPin, Star, Users } from "lucide-react"
import { getPublishedGames } from "@/data/games"
import { usePWAInstallPrompt } from "@/hooks/usePWAInstallPrompt"

export const Route = createFileRoute("/")({ component: HomePage })

function HomePage() {
  const games = getPublishedGames()
  const { canInstall, install } = usePWAInstallPrompt()

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-card to-background">
      {/* Hero */}
      <section className="relative py-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-primary/10 to-primary/5" />
        <div className="relative max-w-md mx-auto">
          <h1 className="text-4xl font-black text-primary mb-2">Prahra</h1>
          <p className="text-lg text-muted-foreground">
            Venkovní puzzle hry v Praze. Žádná instalace — stačí mobil a chuť objevovat.
          </p>
          {canInstall && (
            <button
              type="button"
              onClick={install}
              className="mt-6 px-6 py-2 rounded-full bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-all border border-border"
            >
              Instalovat aplikaci
            </button>
          )}
        </div>
      </section>

      {/* Game list */}
      <section className="px-4 pb-12 max-w-md mx-auto">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Dostupné hry</h2>

        {games.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">Žádné hry k dispozici.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {games.map((game) => (
              <Link
                key={game.id}
                to="/game/$gameSlug/intro"
                params={{ gameSlug: game.slug }}
                className="block rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-200 overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{game.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{game.author}</p>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{game.description}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {game.levels.length} míst
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />~{game.estimatedDurationMin} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={12} />
                      {game.difficulty}/5
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {game.maxTeamSize === 1 ? "Solo" : `1–${game.maxTeamSize}`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
