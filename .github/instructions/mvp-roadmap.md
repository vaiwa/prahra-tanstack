# GeoPuzzle Hunt — Analýza projektu & MVP Roadmapa

## Stav projektu (analýza z 24.2.2026)

### ✅ Co je správně nastaveno

TanStack Start je **vygenerován správně** jako demo/starter projekt. Vše funguje:

| Komponenta              | Stav  | Poznámka                                               |
| ----------------------- | ----- | ------------------------------------------------------ |
| TanStack Start + Router | ✅ OK | File-based routing, SSR, route tree se generuje        |
| TanStack Query          | ✅ OK | QueryClient v routeru, SSR integrace                   |
| TanStack Form           | ✅ OK | `@tanstack/react-form` v dependencies                  |
| Vite 7                  | ✅ OK | S pluginy: devtools, tailwind, cloudflare, TS paths    |
| Tailwind CSS v4         | ✅ OK | S `tw-animate-css`, CSS variables pro theming          |
| Shadcn UI               | ✅ OK | button, input, label, select, slider, switch, textarea |
| Drizzle ORM             | ✅ OK | SQLite/better-sqlite3, schema: `todos` tabulka         |
| Cloudflare Workers      | ✅ OK | `wrangler.jsonc` nakonfigurován, deploy script ready   |
| Biome                   | ✅ OK | Linting + formatting                                   |
| TypeScript              | ✅ OK | Strict mode, path aliases (`@/*` → `./src/*`)          |
| Zod                     | ✅ OK | Pro validace                                           |

### 📁 Struktura routování

```
/                           → Landing page (demo TanStack features)
/demo/tanstack-query        → Demo: React Query
/demo/drizzle               → Demo: Drizzle ORM
/demo/db-chat               → Demo: TanStack DB chat
/demo/form/simple           → Demo: Simple form
/demo/form/address           → Demo: Address form
/demo/start/server-funcs    → Demo: Server functions
/demo/start/api-request     → Demo: API request
/demo/start/ssr/*           → Demo: SSR modes
/demo/api/names             → API route: names
/demo/api/tq-todos          → API route: todos
```

Demo routes jsou čistě pod `/demo/` — to je ideální, game routes půjdou na top level.

### ⚠️ Co je potřeba pro GeoPuzzle upravit/doplnit

1. **Landing page** (`/`) — je to TanStack demo, přepsat na GeoPuzzle landing.
2. **Header** — je to demo navigace s TanStack logem, přepsat na game UI.
3. **DB schema** — obsahuje jen `todos`, potřeba přidat game-related tabulky (nebo pro MVP stačí statická data).
4. **PWA manifest** — `public/manifest.json` existuje, ale je potřeba upravit pro GeoPuzzle (ikony, název, theme color).
5. **Service Worker** — chybí, bude potřeba pro offline mode.
6. **Žádná Leaflet/Mapbox dependency** — bude potřeba přidat.

---

## MVP Roadmapa — Kroky k funkčnímu prototypu

### Fáze 0: Příprava (Foundation)

- [ ] **0.1** Vytvořit `src/types/game.ts` — TypeScript typy z datového modelu (viz `game-data-model.md`)
- [ ] **0.2** Vytvořit `src/data/games/demo-prague-oldtown.ts` — demo hra s 3-4 body v Praze
- [ ] **0.3** Nainstalovat `leaflet` + `@types/leaflet` (nebo `react-leaflet`) pro mapy
- [ ] **0.4** Upravit `public/manifest.json` pro PWA (name, icons, theme_color, display: standalone)

### Fáze 1: Core Game Engine (Jádro hry)

- [ ] **1.1** `useGeolocation` hook — wrapper nad Geolocation API, watchPosition, error handling
- [ ] **1.2** `useWakeLock` hook — Screen Wake Lock API, aby telefon nezhasl
- [ ] **1.3** `useGameState` hook — stav hry (aktuální level, skóre, čas, použité hinty)
  - Persistovat do `localStorage` aby se hra neztratila po refreshi
- [ ] **1.4** `haversineDistance(a, b)` utilita — výpočet vzdálenosti mezi dvěma GPS body
- [ ] **1.5** `validateAnswer(input, level)` utilita — kontrola odpovědi (exact/regex/none)

### Fáze 2: Game UI (Hráčské rozhraní)

- [ ] **2.1** Route `/game/$gameSlug` — hlavní herní obrazovka
  - Načte game data podle slug
  - Zobrazí aktuální level
- [ ] **2.2** Komponenta `GameMap` — Leaflet mapa s pozicí hráče (modrá tečka) a cílem (pokud není skrytý)
- [ ] **2.3** Komponenta `DistanceIndicator` — "Za 340m" s vizuálním feedbackem (barva se mění blíž k cíli)
- [ ] **2.4** Komponenta `PuzzleCard` — zobrazení hádanky po příchodu do radius
  - Input pro odpověď
  - Tlačítko "Zkontrolovat"
  - Hinty s potvrzením ("Opravdu chceš nápovědu? +2 minuty k času")
- [ ] **2.5** Komponenta `GameProgress` — progress bar (level 2/5), uplynulý čas, skóre
- [ ] **2.6** Obrazovka `GameComplete` — gratulace, shrnutí (čas, body, použité hinty)

### Fáze 3: Game Start & Navigation

- [ ] **3.1** Route `/` — přepsat landing page: seznam dostupných her (card grid)
- [ ] **3.2** Route `/game/$gameSlug/intro` — intro obrazovka hry (popis, potřebné pomůcky, odhad času, tlačítko "Začít")
- [ ] **3.3** Header zjednodušit — logo GeoPuzzle, hamburger menu jen s "Zpět na seznam" a "Debug mode"

### Fáze 4: Debug & Testing

- [ ] **4.1** Debug panel (toggle) — zobrazit na obrazovce: aktuální GPS, přesnost, vzdálenost k cíli, raw coords
- [ ] **4.2** Fake GPS teleport — dropdown s přednastavenými souřadnicemi (= souřadnice levelů), "Teleport" tlačítko
- [ ] **4.3** Tlačítko "Jsem na místě" (GPS fallback) — odemkne puzzle manuálně, malá penalizace
- [ ] **4.4** Otestovat na reálném mobilu přes HTTPS (ngrok / Cloudflare tunnel)

### Fáze 5: Polish & PWA (po MVP)

- [ ] **5.1** Service Worker — precache všech game assets při startu hry
- [ ] **5.2** Offline detection banner — "Jsi offline, hra běží v offline režimu"
- [ ] **5.3** Kompas mode — `DeviceOrientationEvent` pro šipku směrem k cíli (alternativa k mapě)
- [ ] **5.4** QR code scanner — pro `answerType: 'qr-code'` levely (HTML5 camera API)
- [ ] **5.5** Anti-cheat — základní kontrola rychlosti pohybu

---

## Doporučené pořadí implementace

```
Fáze 0 (příprava)     → 1-2 hodiny
Fáze 1 (hooks/utils)  → 2-3 hodiny
Fáze 2 (UI)           → 3-4 hodiny
Fáze 3 (navigace)     → 1-2 hodiny
Fáze 4 (debug)        → 1-2 hodiny
────────────────────────────────────
Celkem MVP:            ~ 8-13 hodin
────────────────────────────────────
Fáze 5 (polish/PWA)   → 4-6 hodin (po MVP)
```

## Co NEŘEŠIT v MVP

- ❌ Admin panel / editor tras (data jsou hardcoded v TS souborech)
- ❌ Databáze pro game data (stačí statické TS soubory)
- ❌ Uživatelské účty / autentizace
- ❌ Leaderboard / multiplayer
- ❌ Nahrávání fotek
- ❌ Platby / monetizace

## Technické poznámky

### Leaflet v React

Doporučuji `react-leaflet` v5 — nativní React wrapper. Dlaždice: OpenStreetMap (free) nebo Mapy.cz tiles (pro CZ kontext).

```bash
pnpm add leaflet react-leaflet
pnpm add -D @types/leaflet
```

### Geolocation API gotchas

- `navigator.geolocation.watchPosition` je ASYNCHRONNÍ a potřebuje `enableHighAccuracy: true`
- Na iOS Safari vyžaduje HTTPS (localhost je výjimka)
- Accuracy se zlepšuje časem (první fix je nepřesný)

### Wake Lock API

```typescript
// Podporováno v Chrome, Edge, Safari 16.4+
const wakeLock = await navigator.wakeLock.request('screen')
```

### localStorage pro game state

Klíč: `geopuzzle_${gameSlug}_state` → JSON s aktuálním levelem, časem, skóre, hinty.
Při startu hry: zkontrolovat jestli existuje rozpracovaná hra → nabídnout "Pokračovat" / "Začít znovu".
