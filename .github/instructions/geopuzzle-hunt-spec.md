# GeoPuzzle Hunt Engine — Research & Specifikace

## 1. Deep Research: Co už existuje?

Většina existujících řešení jsou nativní aplikace (Android/iOS), takže **webová aplikace (PWA)** má obrovskou konkurenční výhodu – uživatel nemusí nic instalovat, stačí načíst QR kód.

### Hlavní globální hráči (Platformy pro tvorbu her):

- **Actionbound:** Asi největší konkurent. Umožňuje vytvářet multimediální trasy (odpovídat na otázky, hledat místa, skenovat kódy). Je ale robustní, drahý pro komerční užití a UI je trochu zastaralé.
- **GooseChase:** Zaměřeno spíše na teambuildingy a "scavenger hunts" (seznam úkolů: "vyfoť se s psem"), méně na lineární příběhové puzzle.
- **ClueKeeper:** Platforma specializovaná přímo na puzzle hunty. Umožňuje nápovědy, časové limity a GPS triggery. Je to ale uzavřený ekosystém.
- **Wherigo:** "Dědeček" geolokačních her spojený s Geocachingem. Dnes už technologicky velmi zastaralý, ale princip "zón" (vstoupíš do zóny -> něco se stane) je základem všeho.

### Česká scéna (Inspirace obsahem):

- **Skryté příběhy:** Velmi populární. Cílí na rodiny s dětmi. Offline mapy, hezký příběh, úkoly na místě.
- **Nachozeno:** Placené venkovní únikovky. Fungují přes mobilní aplikaci.

### Díra na trhu

Většina platforem je buď **příliš drahá** (B2B teambuildingy), nebo **vyžaduje instalaci aplikace** (což lidi na jednorázové akci otravuje). _Web App_ (PWA) přístupná přes URL/QR kód je ideální "frictionless" řešení.

---

## 2. Specifikace aplikace (Blueprint)

### Název projektu: GeoPuzzle Hunt Engine (Web PWA)

**Základní princip:**
Webová aplikace optimalizovaná pro mobilní zařízení (Mobile-first), která využívá Geolocation API prohlížeče k navigaci hráče po sérii bodů (waypoints). Na každém bodě se odemkne obsah (příběh/puzzle).

### Klíčové moduly:

#### A) Hráčské rozhraní (Frontend)

- **Dashboard:** Zobrazení aktuálního stavu (např. "Jsi u bodu 3 z 10"), uplynulý čas, skóre.
- **Mapa vs. Kompas:** Možnost přepínat mezi mapovým podkladem (Mapbox/OpenStreetMap) a "šipkou" (směr a vzdálenost), pokud chceš mapu skrýt pro vyšší obtížnost.
- **Geofencing Trigger:** Aplikace musí v cyklu (např. každých 5s) kontrolovat polohu. Pokud `vzdalenost(hrac, cil) < radius (např. 20m)`, odemkne se úkol.
- **Input mechanismy:**
  - Textové pole (ověření odpovědi pomocí RegEx nebo hash).
  - Multiple choice.
  - Nahrání fotky (volitelné).
  - Skenování QR kódu (pro potvrzení, že tam člověk fyzicky je, když GPS zlobí).
- **Hint System:** Penalizované nápovědy (zobrazit nápovědu = +5 minut k času).

#### B) Admin / Builder (Backend)

- Editor tras: Kliknutí do mapy -> vytvoření bodu -> přiřazení obsahu (HTML/Markdown text úkolu, obrázek, správná odpověď).
- Nastavení tolerance GPS (Radius).
- Generování startovního QR kódu / URL pro unikátní instanci hry (např. pro týmy).

### Kritické body (NESMÍŠ zapomenout):

1. **Offline Mode (Service Workers):** "Killer feature". V lese často není signál. Aplikace se musí celá načíst na startu (všechna data o trase, obrázky) a fungovat offline. Odeslání výsledků proběhne, až se obnoví spojení.

2. **GPS Drift & Tolerance:** GPS v mobilu má přesnost 5-15 metrů, ve městě mezi domy hůř.
   - _Řešení:_ Nikdy nedávej radius menší než 20-30 metrů.
   - _Řešení:_ Přidej tlačítko "Jsem na místě, ale GPS nefunguje", které odemkne úkol manuálně (třeba za malou penalizaci nebo po zadání kódu, který je na místě nalepený).

3. **Wake Lock API:** Webové stránky se na mobilu uspávají, když zhasne displej. Musíš implementovat "No Sleep" funkcionalitu, aby GPS běžela, i když hráč nekouká na displej (pokud to prohlížeč dovolí), nebo hráče upozornit, ať nezhasíná telefon.

4. **Anti-Cheat (základní):** Kontrola rychlosti pohybu. Pokud se hráč přesune o 1 km za 3 sekundy, podvádí (GPS spoofing) nebo jede autem, když má jít pěšky.

---

## 3. Prompt pro vývoj (MVP)

> **Role:** Jsi Senior Full-Stack Developer specializovaný na React, TypeScript a PWA (Progressive Web Apps).
>
> **Úkol:** Chci vytvořit kostru webové aplikace pro "Real-world Puzzle Hunt". Aplikace povede uživatele z bodu A do bodu B pomocí GPS souřadnic.
>
> **Tech Stack:**
>
> - Frontend: React + Vite (použij TypeScript) + TanStack Start.
> - Mapy: Leaflet nebo Mapbox GL JS.
> - UI: Tailwind CSS (Mobile-first design).
> - Logika: Použití Geolocation API s výpočtem Haversine formule pro vzdálenost.
>
> **Požadavky na MVP (Minimum Viable Product):**
>
> 1. **Hardcoded Data:** Vytvoř JSON soubor `route.ts`, kde bude pole objektů (stages). Každá stage má: `id`, `coords` [lat, lng], `title`, `description` (hádanka), `unlockRadius` (metry) a `answer` (správná odpověď).
> 2. **GPS Tracking:** Aplikace musí v reálném čase ukazovat vzdálenost k aktuálnímu cíli.
> 3. **Unlock Mechanika:** Pokud se uživatel dostane do rádiusu, zobrazí se input pro zadání odpovědi.
> 4. **Game Loop:** Po správné odpovědi se cíl přepne na další bod v JSONu.
> 5. **Debug Mode:** Přidej tlačítko pro "Fake GPS teleport", abychom to mohli testovat od stolu bez chození venku.
>
> Prosím, navrhni strukturu projektu a napiš kód pro hlavní hook `useGeolocation` a komponentu `GameEngine`, která řídí logiku postupu hrou.
