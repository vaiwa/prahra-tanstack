# GeoPuzzle Hunt — Datový model (JSON)

## Kde data držet?

Nejjednodušší přístup pro MVP: **statický JSON/TS soubor** v repozitáři (`src/data/games/`). Každá hra = jeden soubor. Později lze migrovat do DB (Drizzle + D1) bez změny typů.

```
src/data/games/
  ├── demo-prague-oldtown.ts
  └── demo-brno-center.ts
```

Každý soubor exportuje objekt typu `Game`.

---

## TypeScript typy

```typescript
// src/types/game.ts

export interface Game {
  /** Unique identifier (UUID or slug) */
  id: string
  /** Human-readable URL slug */
  slug: string
  /** Game name */
  name: string
  /** Author / creator name */
  author: string
  /** Creation date (ISO 8601) */
  createdAt: string
  /** Last modification date (ISO 8601) */
  updatedAt: string
  /** Game description (Markdown supported) */
  description: string
  /** Estimated duration in minutes */
  estimatedDurationMin: number
  /** Difficulty 1-5 */
  difficulty: 1 | 2 | 3 | 4 | 5
  /** Language code (cs, en, ...) */
  language: string
  /** Is the game published and playable? */
  isPublished: boolean
  /** Max team size (1 = solo only) */
  maxTeamSize: number
  /** List of things player needs to bring */
  requiredItems: string[]
  /** Cover image and other game-level media */
  media: Media[]
  /** Starting point GPS (where the game begins) */
  startLocation: GpsLocation
  /** Ordered list of levels/stages */
  levels: Level[]
}

export interface Level {
  /** Unique identifier within the game */
  id: string
  /** Order in sequence (1-based) */
  order: number
  /** Level name / title */
  name: string
  /** Story text / puzzle description (Markdown) */
  description: string
  /** GPS location of this checkpoint */
  location: GpsLocation
  /** Radius in meters to trigger "you're here" (min 20) */
  unlockRadius: number
  /** How the answer is validated */
  answerType: AnswerType
  /** Correct answer(s) — evaluated based on answerType */
  answer: string | string[]
  /** Progressive hints (ordered by helpfulness, each with penalty) */
  hints: Hint[]
  /** Points awarded for solving (before hint penalties) */
  points: number
  /** Optional time limit for this level in seconds (0 = no limit) */
  timeLimitSec: number
  /** Media: images, audio, video, attachments */
  media: Media[]
  /** Optional: what happens after solving (flavor text, animation, etc.) */
  solvedMessage?: string
}

export interface Hint {
  /** Hint text (Markdown) */
  text: string
  /** Time penalty in seconds added when hint is revealed */
  penaltySec: number
}

export interface GpsLocation {
  lat: number
  lng: number
  /** Optional human-readable name ("U Orloje", "Park Lužánky") */
  label?: string
}

export interface Media {
  /** Type of media */
  type: 'image' | 'audio' | 'video' | 'attachment' | 'youtube'
  /** URL or relative path to the file */
  url: string
  /** Alt text / caption */
  caption?: string
}

export type AnswerType =
  | 'exact' // Case-insensitive exact match
  | 'regex' // RegExp pattern match
  | 'multi-choice' // answer is string[], player picks one
  | 'qr-code' // Player scans QR → value must match answer
  | 'none' // No answer needed, just reach the location
```

---

## Příklad: Demo hra

```typescript
// src/data/games/demo-prague-oldtown.ts
import type { Game } from '~/types/game'

export const demoPragueOldtown: Game = {
  id: 'prague-oldtown-001',
  slug: 'prague-oldtown',
  name: 'Tajemství Starého Města',
  author: 'Jan Navrát',
  createdAt: '2026-02-24T00:00:00Z',
  updatedAt: '2026-02-24T00:00:00Z',
  description: 'Projděte se historickým centrem Prahy a odhalte zapomenuté příběhy.',
  estimatedDurationMin: 90,
  difficulty: 3,
  language: 'cs',
  isPublished: false,
  maxTeamSize: 5,
  requiredItems: ['Nabitý telefon', 'Pohodlné boty', 'Tužka a papír'],
  media: [{ type: 'image', url: '/games/prague-oldtown/cover.jpg', caption: 'Staroměstské náměstí' }],
  startLocation: { lat: 50.0875, lng: 14.4213, label: 'Staroměstské náměstí' },
  levels: [
    {
      id: 'level-1',
      order: 1,
      name: 'Orloj',
      description: 'Stojíš před nejslavnějšími hodinami v Čechách. Kolik apoštolů se ukazuje při každém odbíjení?',
      location: { lat: 50.087, lng: 14.4208, label: 'Pražský orloj' },
      unlockRadius: 30,
      answerType: 'exact',
      answer: '12',
      hints: [
        { text: 'Podívej se nahoru, až hodiny začnou odbíjet.', penaltySec: 120 },
        { text: 'Je jich tolik, kolik měsíců v roce.', penaltySec: 300 },
      ],
      points: 100,
      timeLimitSec: 0,
      media: [{ type: 'image', url: '/games/prague-oldtown/orloj.jpg', caption: 'Pražský orloj' }],
      solvedMessage: 'Správně! Apoštolů je 12. Pokračuj k Týnskému chrámu.',
    },
    {
      id: 'level-2',
      order: 2,
      name: 'Týnský chrám',
      description: 'Jak se jmenuje slavný astronom pohřbený v tomto kostele? (příjmení)',
      location: { lat: 50.0879, lng: 14.4225, label: 'Chrám Matky Boží před Týnem' },
      unlockRadius: 25,
      answerType: 'regex',
      answer: '^[Bb]rahe$',
      hints: [
        { text: 'Byl to Dán, který žil v Praze na dvoře Rudolfa II.', penaltySec: 120 },
        { text: 'Tycho ...', penaltySec: 300 },
      ],
      points: 150,
      timeLimitSec: 0,
      media: [{ type: 'youtube', url: 'https://youtube.com/watch?v=example', caption: 'Krátké video o Tychu Brahe' }],
    },
  ],
}
```

---

## Poznámky k designu

- **Proč TS místo čistého JSON?** Type-safety, IDE autocomplete, možnost komentářů. Import funguje stejně jednoduše.
- **Proč `media[]` místo `images[]` + `attachments[]`?** Jeden unifikovaný typ je jednodušší na rendering — prostě iteruješ pole a podle `type` vykreslíš komponentu.
- **Proč `hints[]` místo `hint_easy` / `hint_hard`?** Flexibilita — některé úrovně mohou mít 0 hintů, jiné 5. Penalizace se nastavuje per-hint.
- **`answerType: 'none'`** — umožňuje čistě navigační body ("dojdi sem a přečti si příběh"), bez hádanky.
- **`unlockRadius` per-level** — v parku stačí 20m, u rušné křižovatky dáš 50m.

## Budoucí rozšíření (ne pro MVP)

- `conditions` na levelech — nelineární trasy (odemkni level 4 až po splnění 2 a 3).
- `teamProgress` — sledování stavu týmů v reálném čase (vyžaduje backend/DB).
- `leaderboard` — žebříček nejrychlejších dokončení.
- `mediaUpload` v adminu — nahrávání obrázků přímo, ne jen URL.
- `i18n` — vícejazyčné verze stejné hry.
