# Prahra

Venkovní puzzle hry v Praze. PWA webová aplikace — žádná instalace, stačí mobil a chuť objevovat.

**www.prahra.cz**

## Tech Stack

- [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) (file-based routing, SSR)
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/) (mapy)
- [Cloudflare Workers](https://workers.cloudflare.com/) (deploy)
- [Biome](https://biomejs.dev/) (lint + format)
- [Vitest](https://vitest.dev/) (testy)

## Vývoj

```bash
npm install
npm run dev
```

Otevři http://localhost:3000

## Feature flags

- `VITE_FEATURE_DEBUG_MODE=true` — zobrazí Debug Mode tlačítko (jen v dev režimu)

## Příkazy

| Příkaz                  | Popis                                                |
| ----------------------- | ---------------------------------------------------- |
| `npm run dev`           | Spustí dev server na portu 3000                      |
| `npm run build`         | Produkční build                                      |
| `npm run preview`       | Náhled produkčního buildu                            |
| `npm test`              | Spustí unit testy                                    |
| `npm run typecheck`     | TypeScript type check                                |
| `npm run lint`          | Biome lint                                           |
| `npm run format`        | Biome formátování                                    |
| `npm run check`         | Biome lint + format                                  |
| `npm run verify`        | Kompletní CI check (biome + tsc + testy)             |
| `npm run clean`         | Smaže node_modules + dist                            |
| `npm run clean-install` | Clean + npm install                                  |
| `npm run version:bump`  | Zvýší patch verzi a synchronizuje API version soubor |
| `npm run deploy`        | Build + deploy na Cloudflare Workers                 |
| `npm run dev:api`       | Spustí API worker lokálně (wrangler)                 |
| `npm run deploy:api`    | Deploy API worker                                    |

## Struktura projektu

```
src/
  routes/              # File-based routing
    index.tsx           # Landing — seznam her
    game/$gameSlug/
      intro.tsx         # Intro obrazovka hry
      index.tsx         # Herní engine (GPS, mapa, puzzle)
  components/
    game/               # Herní komponenty (GameMap, PuzzleCard, ...)
    ui/                 # Shadcn UI primitives
    ErrorBoundary.tsx
    Header.tsx
  hooks/                # useGeolocation, useGameState, useWakeLock
  lib/                  # geo.ts, validate-answer.ts, utils.ts
  data/games/           # Herní data (statické TS soubory)
  types/                # TypeScript typy (Game, Level, GameState, ...)
```

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):

1. **check** — Biome lint + format, TypeScript, unit testy
2. **build** — Produkční build
3. **deploy** — Automatický deploy na Cloudflare Workers (jen push do `main`)

Vyžaduje GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

## API worker (Clerk + D1)

API běží jako samostatný Cloudflare Worker na `/api/*`.

Verze API:

- `GET /api/version` vrací aktuálně nasazenou verzi.
- Hodnota se synchronizuje do `api/src/version.ts` skriptem `npm run version:sync`.
- CI při merge do `main` automaticky provede patch bump (`version:bump`) před deployem.

Nastavení:

1. V `api/wrangler.api.jsonc` doplň `database_id` pro D1.
2. Spusť migrace:

- `wrangler d1 migrations apply prahra-db --config api/wrangler.api.jsonc`

3. Nastav Clerk secret pro API worker:

- `wrangler secret put CLERK_SECRET_KEY --config api/wrangler.api.jsonc`

Lokální běh:

```bash
npm run dev:api
```

Poznamka:

API ocekava `Authorization: Bearer <token>` od Clerk. Na klientu pouzij:

```ts
const token = await getToken()
fetch('/api/progress/my-game', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
})
```
