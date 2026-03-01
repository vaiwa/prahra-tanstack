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
- [x] **5.7** Deploy na Cloudflare Workers — `npm run deploy`, ověřit na `prahra.workers.dev`
- [x] **5.8** Nastavit doménu `www.prahra.cz` → Cloudflare custom domain
- [ ] **5.9** Otestovat na reálném mobilu (GPS, wake lock, PWA install prompt)
- [ ] **5.10** Nastavit GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

#### Zitra otestovat (mobil)

- [ ] Otevrit `www.prahra.cz` na Android (Chrome) a iOS (Safari)
- [ ] GPS povoleni, prvni fix, presnost se postupne zlepsi
- [ ] Odemknuti levelu: prijdu na GPS, puzzle se zobrazi a po vzdaleni zustava
- [ ] Wake lock: obrazovka neuspava behem hry
- [ ] PWA instalace: Install tlacitko (Android) + pridani na plochu (iOS share)
- [ ] Offline fallback: zapnout letovy rezim a overit offline obrazovku
- [ ] Offline banner: objevi se pri vypnutem internetu
- [ ] SW update toast: po update se ukaze a po kliknuti se appka refreshne
- [ ] GPS drift: pri stani na miste se stav nemeni prilis casto
- [ ] Background/foreground: po navratu do appky GPS a cas pokracuji
- [ ] Otoceni telefonu: layout zustava v poradku v portrait
- [ ] Poloha "jen pri pouziti": appka to zvladne bez padu
- [ ] Fallback "GPS nefunguje": puzzle jde zobrazit
- [ ] PWA ikona a splash: po instalaci se zobrazi spravne
- [ ] Feature flag: `VITE_FEATURE_DEBUG_MODE` funguje jen v dev

### Fáze 6: Service Worker & Offline

Cíl: **Hra funguje i bez signálu (les, metro, tunel).**

- [x] **6.1** Přidat `vite-plugin-pwa` nebo vlastní SW s Workbox (vlastní SW)
- [ ] **6.2** Precache: herní assets, map tiles pro oblast hry, game data
- [x] **6.3** Offline detection banner — "Jsi offline, hra běží v offline režimu"
- [ ] **6.4** Sync výsledků po obnovení spojení

### Fáze 6.5: Auth & Progress (Clerk + API)

Cíl: **Uživatel ma ucet a prubezny progres se uklada do D1.**

- [x] **6.5.1** Samostatny API worker na `/api/*`
- [x] **6.5.2** Clerk auth (Bearer token verify)
- [ ] **6.5.3** Klientsky sync prubezneho progresu
- [ ] **6.5.4** Migrace D1 aplikovane na produkci

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

- `public/manifest.json` — branded "Prahra", standalone, portrait, theme/background #2b1d0e
- Install prompt tlačítko na homepage + update toast při nové SW verzi
- Vlastní service worker + offline fallback
- Ikony: `favicon.ico`, `logo192.png`, `logo512.png` (zatím výchozí, potřeba vlastní)
