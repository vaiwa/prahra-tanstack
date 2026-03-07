import type { Game } from "@/types/game"

export const demoPragueOldtown: Game = {
  id: "prague-oldtown-001",
  slug: "prague-oldtown",
  name: "Tajemství Starého Města",
  author: "Jan Navrát",
  createdAt: "2026-02-24T00:00:00Z",
  updatedAt: "2026-02-24T00:00:00Z",
  description:
    "Projděte se historickým centrem Prahy a odhalte zapomenuté příběhy. Trasa vás provede od Staroměstského náměstí přes skryté uličky až k tajemným zákoutím, která turisté běžně přehlédnou.",
  estimatedDurationMin: 60,
  difficulty: 2,
  language: "cs",
  isPublished: true,
  maxTeamSize: 5,
  requiredItems: ["Nabitý telefon", "Pohodlné boty"],
  media: [
    {
      type: "image",
      url: "/games/prague-oldtown/cover.svg",
      caption: "Staroměstské náměstí",
    },
  ],
  startLocation: { lat: 50.0875, lng: 14.4213, label: "Staroměstské náměstí" },
  levels: [
    {
      id: "level-1",
      order: 1,
      name: "Pražský orloj",
      description:
        "Stojíš před nejslavnějšími hodinami v Čechách. Každou hodinu předvádějí své představení.\n\n**Otázka:** Kolik apoštolů se ukazuje v okénkách při každém odbíjení?",
      location: { lat: 50.087, lng: 14.4208, label: "Pražský orloj" },
      unlockRadius: 30,
      answerType: "exact",
      answer: "12",
      hints: [
        {
          text: "Podívej se nahoru na dvě malá okénka nad ciferníkem. Až hodiny začnou odbíjet, okénka se otevřou.",
          penaltySec: 120,
        },
        {
          text: "Je jich tolik, kolik měsíců v roce.",
          penaltySec: 300,
        },
      ],
      points: 100,
      timeLimitSec: 0,
      media: [],
      solvedMessage:
        "✅ Správně! Apoštolů je 12 — jeden za každý měsíc. Pokračuj k Týnskému chrámu, uvidíš jeho dvě věže přímo před sebou.",
    },
    {
      id: "level-2",
      order: 2,
      name: "Týnský chrám",
      description:
        "Stojíš před mohutným Chrámem Matky Boží před Týnem. Uvnitř je pohřben slavný astronom, který strávil poslední roky života v Praze na dvoře císaře Rudolfa II.\n\n**Otázka:** Jak se jmenoval? (napiš příjmení)",
      location: {
        lat: 50.0879,
        lng: 14.4225,
        label: "Chrám Matky Boží před Týnem",
      },
      unlockRadius: 30,
      answerType: "regex",
      answer: "^[Bb]rahe$",
      hints: [
        {
          text: "Byl to Dán, který přišel do Prahy v roce 1599. Proslavil se přesnými astronomickými pozorováními — ještě před vynálezem dalekohledu.",
          penaltySec: 120,
        },
        {
          text: "Jeho křestní jméno bylo Tycho. Příjmení začíná na B...",
          penaltySec: 300,
        },
      ],
      points: 150,
      timeLimitSec: 0,
      media: [],
      solvedMessage:
        "✅ Tycho Brahe! Zemřel v Praze roku 1601 za záhadných okolností. Pokračuj do Celetné ulice — najdeš ji po pravé straně chrámu.",
    },
    {
      id: "level-3",
      order: 3,
      name: "Dům U Černé Matky Boží",
      description:
        "Jsi v Celetné ulici u jedné z nejznámějších kubistických staveb na světě. Tento dům je unikátní — kubismus v architektuře je téměř výhradně český fenomén.\n\n**Otázka:** Jaký architektonický styl tento dům reprezentuje?",
      location: {
        lat: 50.0872,
        lng: 14.4265,
        label: "Dům U Černé Matky Boží",
      },
      unlockRadius: 25,
      answerType: "regex",
      answer: "^[Kk]ubis",
      hints: [
        {
          text: "Podívej se na fasádu — všimni si geometrických tvarů a šikmých hran. Tento styl se inspiroval malířstvím počátku 20. století.",
          penaltySec: 120,
        },
        {
          text: "Picasso a Braque malovali v tomto stylu. Čeští architekti ho jako jediní na světě přenesli do architektury.",
          penaltySec: 300,
        },
      ],
      points: 100,
      timeLimitSec: 0,
      media: [],
      solvedMessage:
        "✅ Kubismus! Dům navrhl Josef Gočár v roce 1912. Dnes je zde muzeum kubismu. Pokračuj na Prašnou bránu — uvidíš ji na konci Celetné.",
    },
    {
      id: "level-4",
      order: 4,
      name: "Prašná brána",
      description:
        'Prašná brána je jedna z původních 13 bran vedoucích do Starého Města. Její současná gotická podoba pochází z přestavby v 19. století.\n\n**Otázka:** Ze kterého století pochází PŮVODNÍ brána? (napiš jen číslo, např. "13")',
      location: { lat: 50.0868, lng: 14.4314, label: "Prašná brána" },
      unlockRadius: 30,
      answerType: "exact",
      answer: "15",
      hints: [
        {
          text: "Stavba původní brány začala za vlády krále Vladislava II. Jagellonského.",
          penaltySec: 120,
        },
        {
          text: "Vladislav II. vládl v druhé polovině 1400s. Brána se začala stavět v roce 1475.",
          penaltySec: 300,
        },
      ],
      points: 150,
      timeLimitSec: 0,
      media: [],
      solvedMessage:
        "🎉 Správně! Původní brána pochází z 15. století (1475). Gratulujeme — dokončil jsi procházku Starým Městem!",
    },
  ],
}
