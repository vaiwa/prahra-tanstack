# Prahra — Roadmapa

> Venkovní puzzle hry v Praze. PWA, TanStack Start, Cloudflare Workers.
> **www.prahra.cz**

---

## Co je hotovo (MVP — 24.2.2026)

Kompletní hratelný prototyp. Build OK, deploy ready.

### Herní engine

- Typy: `Game`, `Level`, `Hint`, `GpsLocation`, `Media`, `GameState`, `AnswerType`
- `useGeolocation` — GPS tracking + fake teleport pro debug
- `useWakeLock` — Screen Wake Lock API
- `useGameState` — stav hry + localStorage persistence (`prahra_{slug}_state`)
- `haversineDistance`, `formatDistance`, `calculateBearing`
- `validateAnswer` — exact, regex, multi-choice, qr-code, none

### UI komponenty

- `GameMap` — Leaflet, modrá tečka hráče, target marker, accuracy + unlock radius circle, lazy-loaded
- `DistanceIndicator` — barevné kódování (red/orange/yellow/green)
- `PuzzleCard` — text input, multi-choice, hint reveal s penalizací, GPS fallback
- `GameProgress` — progress bar, živý čas, skóre, penalizace
- `GameComplete` — stats grid, breakdown levelů, restart + zpět
- `DebugPanel` — GPS stav, fake teleport tlačítka pro každý level

### Routes

- `/` — seznam her (card grid s metadata)
- `/game/$gameSlug/intro` — intro, popis, pomůcky, "Začít" / "Pokračovat"
- `/game/$gameSlug` — hlavní herní engine
- Header skrytý na herních stránkách

### Data

- Demo hra: Praha Staré Město (4 levely: Orloj → Týnský chrám → Černá Matka Boží → Prašná brána)

### Stack

- TanStack Start + Router (file-based routing, SSR)
- TanStack Query (provider ready, zatím nepoužitý)
- Vite 7, Tailwind CSS v4, Shadcn UI
- Leaflet + react-leaflet
- Cloudflare Workers (`wrangler.jsonc`, `npm run deploy`)
- Biome (lint + format), TypeScript strict, Zod

---

## Známé nedostatky

| #   | Problém                                                                                   | Závažnost |
| --- | ----------------------------------------------------------------------------------------- | --------- |
| 1   | Žádná 404 stránka                                                                         | nízká     |
| 2   | `timeLimitSec` v datech existuje, ale engine ho neimplementuje                            | nízká     |
| 3   | `media` pole existuje v typech, ale nikde se nerenderuje                                  | nízká     |
| 4   | Popisy jsou plain text, ne Markdown                                                       | nízká     |
| 5   | Cover obrázek v demo datech (`/games/prague-oldtown/cover.jpg`) neexistuje                | nízká     |
| 6   | Nepoužité shadcn komponenty: select, slider, switch, textarea                             | úklid     |
| 7   | `web-vitals` v devDeps — nepoužitý                                                        | úklid     |
| 8   | TanStack devtools se renderují i v produkci (odstraňuje `@tanstack/devtools-vite` plugin) | info      |

---

## Další kroky

### Fáze 5: Deploy & PWA základ

Cíl: **Aplikace běží na prahra.cz, funguje jako PWA, testovatelná na mobilu.**

- [x] **5.1** Opravit `<head>` — manifest link, theme-color, apple-touch-icon, apple-mobile-web-app-capable
- [x] **5.2** Bundlovat Leaflet marker ikony lokálně (zkopírováno do `public/`)
- [x] **5.3** Error boundary kolem GameEngine + GameMap (+ fallback UI)
- [x] **5.4** GitHub Actions CI/CD — biome check → tsc → unit testy → build → deploy na CF Workers
- [x] **5.5** Vitest config + unit testy (19 testů: geo.ts, validate-answer.ts)
- [x] **5.6** `wrangler.jsonc` name → `"prahra"`, `typecheck` script v package.json
- [ ] **5.7** Deploy na Cloudflare Workers — `npm run deploy`, ověřit na `prahra.workers.dev`
- [ ] **5.8** Nastavit doménu `www.prahra.cz` → Cloudflare custom domain
- [ ] **5.9** Otestovat na reálném mobilu (GPS, wake lock, PWA install prompt)
- [ ] **5.10** Nastavit GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

### Fáze 6: Service Worker & Offline

Cíl: **Hra funguje i bez signálu (les, metro, tunel).**

- [ ] **6.1** Přidat `vite-plugin-pwa` nebo vlastní SW s Workbox
- [ ] **6.2** Precache: herní assets, map tiles pro oblast hry, game data
- [ ] **6.3** Offline detection banner — "Jsi offline, hra běží v offline režimu"
- [ ] **6.4** Sync výsledků po obnovení spojení

### Fáze 7: Herní vylepšení

Cíl: **Bohatší herní zážitek.**

- [ ] **7.1** Kompas mode — `DeviceOrientationEvent`, šipka směrem k cíli (alternativa k mapě)
- [ ] **7.2** QR code scanner — kamera pro `answerType: 'qr-code'` levely
- [ ] **7.3** Media rendering — obrázky, audio, video v puzzle popisu + intro
- [ ] **7.4** Markdown rendering v popisech (lightweight parser, např. `marked` nebo `mdx`)
- [ ] **7.5** Countdown timer pro `timeLimitSec` > 0
- [ ] **7.6** Anti-cheat — kontrola rychlosti pohybu (GPS spoofing detection)

### Fáze 8: Obsah & Design

Cíl: **Více her, lepší vizuál.**

- [ ] **8.1** Vytvořit druhou hru — ověřit flexibilitu data modelu
- [ ] **8.2** Vlastní Header — logo Prahra, navigace, dark/light mode
- [ ] **8.3** Cover obrázky pro hry (fotky míst)
- [ ] **8.4** PWA ikony — vlastní logo místo výchozích
- [ ] **8.5** 404 stránka
- [ ] **8.6** Odstranit nepoužité shadcn komponenty + web-vitals

### Fáze 9: Backend & Multiplayer (budoucnost)

Cíl: **Sdílení výsledků, leaderboard, admin.**

- [ ] **9.1** API pro ukládání výsledků (Cloudflare D1 / KV)
- [ ] **9.2** Leaderboard — nejlepší časy pro každou hru
- [ ] **9.3** Admin panel / editor tras
- [ ] **9.4** Uživatelské účty (volitelné)
- [ ] **9.5** Generování QR kódu pro start hry

---

## Co NEŘEŠIT teď

- ❌ Databáze pro game data (stačí statické TS soubory)
- ❌ Uživatelské účty / autentizace
- ❌ Leaderboard / multiplayer
- ❌ Nahrávání fotek
- ❌ Platby / monetizace
- ❌ Admin panel / editor tras

---

## Technické poznámky

### Cloudflare Workers deploy

```bash
npm run deploy  # = npm run build && wrangler deploy
```

`wrangler.jsonc`: name `"prahra"`, `nodejs_compat` flag, `@tanstack/react-start/server-entry`.

### Geolocation API

- `watchPosition` s `enableHighAccuracy: true`
- iOS Safari vyžaduje HTTPS (localhost je výjimka)
- Accuracy se zlepšuje časem (první fix je nepřesný)
- Radius nikdy < 20–30 m kvůli GPS drift

### localStorage

Klíč: `prahra_${gameSlug}_state` → JSON s aktuálním levelem, časem, skóre, hinty.

### PWA

- `public/manifest.json` — branded "Prahra", standalone, portrait, dark theme (#0f172a)
- Ikony: `favicon.ico`, `logo192.png`, `logo512.png` (zatím výchozí, potřeba vlastní)
