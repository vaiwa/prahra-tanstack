import type { Game } from "@/types/game"

export const testLevels: Game = {
  id: "test-levels-001",
  slug: "test-levels",
  name: "Testovací trasa",
  author: "Jan Navrát",
  createdAt: "2026-02-27T00:00:00Z",
  updatedAt: "2026-02-27T00:00:00Z",
  description:
    "Testovací hra se třemi levely pro ověření funkčnosti GPS navigace a zadávání hesel.",
  estimatedDurationMin: 15,
  difficulty: 1,
  language: "cs",
  isPublished: true,
  maxTeamSize: 5,
  requiredItems: ["Nabitý telefon"],
  media: [],
  startLocation: { lat: 50.052889, lng: 14.340889, label: "Start" },
  levels: [
    {
      id: "test-1",
      order: 1,
      name: "Bod 1",
      description:
        "Dojdi na první testovací bod.\n\n**Heslo:** Napiš správné heslo.",
      location: { lat: 50.052889, lng: 14.340889, label: "Bod 1" },
      unlockRadius: 10,
      answerType: "exact",
      answer: "JEDNA",
      hints: [
        {
          text: "Heslo je číslovka — první v řadě.",
          penaltySec: 60,
        },
      ],
      points: 100,
      timeLimitSec: 0,
      media: [],
      solvedMessage: "✅ Správně! Pokračuj na druhý bod.",
    },
    {
      id: "test-2",
      order: 2,
      name: "Bod 2",
      description:
        "Dojdi na druhý testovací bod.\n\n**Heslo:** Napiš správné heslo.",
      location: { lat: 50.0515, lng: 14.3405, label: "Bod 2" },
      unlockRadius: 10,
      answerType: "exact",
      answer: "DVA",
      hints: [
        {
          text: "Heslo je číslovka — druhá v řadě.",
          penaltySec: 60,
        },
      ],
      points: 100,
      timeLimitSec: 0,
      media: [],
      solvedMessage: "✅ Správně! Pokračuj na třetí bod.",
    },
    {
      id: "test-3",
      order: 3,
      name: "Bod 3",
      description:
        "Dojdi na třetí testovací bod.\n\n**Heslo:** Napiš správné heslo.",
      location: { lat: 50.050611, lng: 14.340833, label: "Bod 3" },
      unlockRadius: 10,
      answerType: "exact",
      answer: "TRI",
      hints: [
        {
          text: "Heslo je číslovka — třetí v řadě.",
          penaltySec: 60,
        },
      ],
      points: 100,
      timeLimitSec: 0,
      media: [],
      solvedMessage: "🎉 Gratulujeme! Dokončil jsi testovací trasu.",
    },
  ],
}
