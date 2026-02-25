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

- [x] **0.1** Vytvořit `src/types/game.ts` — TypeScript typy (`Game`, `Level`, `Hint`, `GpsLocation`, `Media`, `GameState`)
- [x] **0.2** Vytvořit `src/data/games/demo-prague-oldtown.ts` — demo hra se 4 body v Praze (Orloj → Týnský chrám → Černá Matka Boží → Prašná brána)
- [x] **0.3** Nainstalovat `leaflet` + `react-leaflet` + `@types/leaflet`
- [x] **0.4** Upravit `public/manifest.json` pro PWA (GeoPuzzle Hunt, portrait, dark theme)

### Fáze 1: Core Game Engine (Jádro hry) ✅

- [x] **1.1** `useGeolocation` hook — `watchPosition`, error handling (CZ chybové hlášky), fake GPS teleport pro debug
- [x] **1.2** `useWakeLock` hook — Screen Wake Lock API + re-acquire on visibility change
- [x] **1.3** `useGameState` hook — stav hry s localStorage persistencí, podpora "Pokračovat" / "Začít znovu"
- [x] **1.4** `haversineDistance(a, b)` + `formatDistance()` + `calculateBearing()` v `src/lib/geo.ts`
- [x] **1.5** `validateAnswer(input, level)` — exact, regex, multi-choice, qr-code, none v `src/lib/validate-answer.ts`

### Fáze 2: Game UI (Hráčské rozhraní) ✅

- [x] **2.1** Route `/game/$gameSlug` — hlavní herní obrazovka (GameEngine komponenta)
- [x] **2.2** Komponenta `GameMap` — Leaflet mapa, modrá tečka hráče, zelený radius, lazy-loaded
- [x] **2.3** Komponenta `DistanceIndicator` — barevné kódování (red > orange > yellow > green)
- [x] **2.4** Komponenta `PuzzleCard` — text input, multi-choice, potvrzení hintů s penalizací
- [x] **2.5** Komponenta `GameProgress` — progress bar, živý čas, body, penalizace
- [x] **2.6** Obrazovka `GameComplete` — stats grid, breakdown levelů, restart + zpět

### Fáze 3: Game Start & Navigation ✅

- [x] **3.1** Route `/` — přepsán na seznam her (card grid s metadata: místa, čas, obtížnost, tým)
- [x] **3.2** Route `/game/$gameSlug/intro` — intro obrazovka (popis, pomůcky, "Začít hru" + "Pokračovat")
- [x] **3.3** Header skrytý na `/game/*` routes, title změněn na "GeoPuzzle Hunt"

### Fáze 4: Debug & Testing ✅

- [x] **4.1** Debug panel (toggle přes 🐛 ikonku) — GPS stav, přesnost, vzdálenost, raw coords
- [x] **4.2** Fake GPS teleport — tlačítka pro každý level, "Vypnout fake GPS"
- [x] **4.3** Tlačítko "GPS nefunguje?" — odemkne puzzle manuálně bez příchodu do radiusu
- [ ] **4.4** Otestovat na reálném mobilu přes HTTPS (ngrok / Cloudflare tunnel)

### Fáze 5: Polish & PWA (po MVP)

- [ ] **5.1** Service Worker — precache všech game assets při startu hry
- [ ] **5.2** Offline detection banner — "Jsi offline, hra běží v offline režimu"
- [ ] **5.3** Kompas mode — `DeviceOrientationEvent` pro šipku směrem k cíli (alternativa k mapě)
- [ ] **5.4** QR code scanner — pro `answerType: 'qr-code'` levely (HTML5 camera API)
- [ ] **5.5** Anti-cheat — základní kontrola rychlosti pohybu
- [ ] **5.6** Vlastní GeoPuzzle Header — logo, navigace, dark/light mode

---

## Stav implementace (aktualizováno 24.2.2026)

```
Fáze 0 (příprava)     ✅ HOTOVO
Fáze 1 (hooks/utils)  ✅ HOTOVO
Fáze 2 (UI)           ✅ HOTOVO
Fáze 3 (navigace)     ✅ HOTOVO
Fáze 4 (debug)        🟡 SKORO HOTOVO (zbývá test na mobilu)
────────────────────────────────────
MVP:                  ✅ FUNKČNÍ (build OK)
────────────────────────────────────
Fáze 5 (polish/PWA)   ⬜ DALŠÍ KROK
```

### Další kroky (po pořadí důležitosti)

1. **Otestovat na mobilu** — `npm run dev`, ngrok/CF tunnel, otevřít na telefonu
2. **Service Worker + offline** — nejkritičtější post-MVP feature
3. **Kompas mode** — alternativa k mapě, lepší UX venku
4. **Vlastní Header** — nahradit demo Header za GeoPuzzle navigaci
5. **Vytvořit druhou hru** — ověřit že data model funguje pro různé typy her
6. **QR code scanner** — pro `answerType: 'qr-code'`

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
