import { createFileRoute, Link } from "@tanstack/react-router"
import { Clock, MapPin, Star, Users } from "lucide-react"
import { GolemIcon } from "@/components/GolemIcon"
import { MediaRenderer } from "@/components/game/MediaRenderer"
import { getPublishedGames } from "@/data/games"
import { usePWAInstallPrompt } from "@/hooks/usePWAInstallPrompt"

export const Route = createFileRoute("/")({ component: HomePage })

function HomePage() {
  const games = getPublishedGames()
  const { canInstall, install, showIOSInstructions, dismissIOSInstructions } = usePWAInstallPrompt()

  return (
    <div className="bg-linear-to-b from-background via-card to-background">
      {/* Hero */}
      <section className="relative py-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-primary/10 to-primary/5" />
        <div className="relative max-w-md mx-auto">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-4xl font-black text-primary">Prahra</h1>
            <GolemIcon className="h-60 w-60 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground">Venkovní puzzle hry v Praze</p>
          {canInstall && (
            <button
              type="button"
              onClick={install}
              className="mt-6 px-6 py-2 rounded-full bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-all border border-border"
            >
              Instalovat aplikaci
            </button>
          )}
          {showIOSInstructions && (
            <div className="mt-6 rounded-xl border border-border bg-card p-4 text-left space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Nainstaluj si aplikaci</p>
                <button
                  type="button"
                  onClick={dismissIOSInstructions}
                  className="text-muted-foreground hover:text-foreground text-lg leading-none"
                >
                  &times;
                </button>
              </div>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>
                  Klepni na <span className="inline-block align-text-bottom text-base">&#xfed8;</span> (Sdileni) dole v
                  Safari
                </li>
                <li>Zvol "Pridat na plochu"</li>
              </ol>
            </div>
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
                {game.media.length > 0 && (
                  <MediaRenderer media={game.media.slice(0, 1)} className="[&_img]:rounded-none [&_img]:max-h-48" />
                )}
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
