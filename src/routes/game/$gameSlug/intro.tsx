import { createFileRoute, Link } from '@tanstack/react-router'
import { getGameBySlug } from '@/data/games'
import type { Game } from '@/types/game'
import { MapPin, Clock, Star, Users, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/game/$gameSlug/intro')({
  component: GameIntro,
})

function GameIntro() {
  const { gameSlug } = Route.useParams()
  const game = getGameBySlug(gameSlug)

  if (!game) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-4xl">🔍</p>
          <h1 className="text-xl font-bold text-foreground">
            Hra nenalezena
          </h1>
          <p className="text-muted-foreground">
            Hra &quot;{gameSlug}&quot; neexistuje.
          </p>
          <Link
            to="/"
            className="inline-block rounded-md bg-primary text-primary-foreground py-2 px-4 text-sm font-medium hover:bg-primary/90"
          >
            Zpět na seznam
          </Link>
        </div>
      </div>
    )
  }

  return <GameIntroContent game={game} />
}

function GameIntroContent({ game }: { game: Game }) {
  const difficultyStars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={16}
      className={
        i < game.difficulty ? 'text-yellow-400 fill-yellow-400' : 'text-muted'
      }
    />
  ))

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Back link */}
      <div className="p-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Zpět
        </Link>
      </div>

      <div className="max-w-md mx-auto px-4 pb-8 space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{game.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">od {game.author}</p>
        </div>

        {/* Meta info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-2">
            <Clock size={18} className="text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                ~{game.estimatedDurationMin} min
              </p>
              <p className="text-xs text-muted-foreground">Délka</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-2">
            <MapPin size={18} className="text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {game.levels.length} míst
              </p>
              <p className="text-xs text-muted-foreground">Zastávky</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-2">
            <div className="flex">{difficultyStars}</div>
          </div>

          <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-2">
            <Users size={18} className="text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {game.maxTeamSize === 1
                  ? 'Solo'
                  : `1–${game.maxTeamSize} hráčů`}
              </p>
              <p className="text-xs text-muted-foreground">Tým</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-foreground leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Required items */}
        {game.requiredItems.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              🎒 Co si vzít s sebou
            </h3>
            <ul className="space-y-1">
              {game.requiredItems.map((item) => (
                <li key={item} className="text-sm text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Start location */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            📍 Start
          </h3>
          <p className="text-sm text-foreground">
            {game.startLocation.label ?? 'Neznámá lokace'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {game.startLocation.lat.toFixed(5)},{' '}
            {game.startLocation.lng.toFixed(5)}
          </p>
        </div>

        {/* Start button */}
        <Link
          to="/game/$gameSlug"
          params={{ gameSlug: game.slug }}
          className="block w-full rounded-md bg-primary text-primary-foreground py-3 px-4 text-center text-base font-medium hover:bg-primary/90 transition-colors"
        >
          🚀 Začít hru
        </Link>
      </div>
    </div>
  )
}
