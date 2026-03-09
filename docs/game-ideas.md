# Prahra - 20 konceptu her

Kazdy koncept obsahuje: popis mechaniky, co je unikatni, priklady levelu a poznamku k realizovatelnosti v soucasne architekture.

---

## Research konkurence

| Aplikace | Klic. mechanika | Poznamka |
|---|---|---|
| **Questo** | Narritivni prochazky s mistnimi pribehami | Storytelling + GPS checkpointy |
| **Actionbound** | Flexibilni tvorba misi (30+ typu ukolu) | UGC platforma, multimedia |
| **Scavify** | Foto challenges + real-time leaderboardy | Gamifikace + soutezeni |
| **PlayTours** | QR kody + GPS + foto/video overeni | "No app download" pristup |
| **Ingress** | Teritorialni kontrola portalu | Faction warfare, persistent svet |
| **Pokemon GO** | Sbirani + AR | Masovy uspech diky sberatelstvi |
| **Zombies, Run!** | Audio drama + behani | Fitness motivace pres pribeh |
| **GuruShots** | Fotograficke souteze s hlasovanim | Community voting |
| **Geocaching** | Hledani fyzickych schrankek | Nejstarsi GPS hra, obrovska komunita |
| **Token Hunters** | Play-to-earn na GPS | Blockchain odmeny za lokace |

---

## 1. Fotohra - "Najdi to misto"

**Mechanika:** Hrac dostane fotografii (detail, vyrez, neobvykly uhel) a musi najit presne misto, kde byla vyfocena. Zadny GPS navadec - jen fotka jako vodítko. Po prijchodu na spravne misto (GPS unlock) odpovi na otazku o tom, co vidi.

**Co je unikatni:** Zadna textova napoveda k lokaci. Hrac musi vizualne rozpoznat misto z fotky. Fotky mohou byt schvalne matouci (detail dverniho klepátka, odraz v okne, vyrez dlazby).

**Priklady levelu:**
- Detail vitrazoveho okna → najdi kostel s timto oknem
- Fotka ulicky z neobvykleho uhlu → identifikuj prechod
- Vyrez sochy → najdi konkretni sochu v parku

**Realizovatelnost:** Plne realizovatelne v soucasne architekture. Fotky jako media, GPS unlock radius, odpoved typu exact/multi-choice. Popis levelu muze byt jen "Najdi misto z fotky."

---

## 2. Sifrovacka - "Cracking the Code"

**Mechanika:** Kazdy level je logicka nebo kryptograficka hadanka. Hrac musi rozlustit sifru, aby ziskal odpoved NEBO aby ziskal GPS souradnice dalsiho stanoviste. Sifry stupnuji obtiznost.

**Co je unikatni:** Duraz na logicke mysleni misto fyzickeho hledani. GPS slouzi jen k overeni, ze hrac je na spravnem miste - hlavni vyzva je v hlavě.

**Priklady levelu:**
- Caesarova sifra → rozlusteni da nazev ulice → jdi tam
- Morseovka schovaná ve zvukovem klipu
- Sudoku, jehoz reseni tvori GPS souradnice
- Rebus z obrazku mist v Praze

**Realizovatelnost:** Plne realizovatelne. Media (obrazky sifer), odpoved regex/exact. Hinty mohou postupne odhalovat postup reseni.

---

## 3. Audioprůvodce s kvizem - "Slyšíš Prahu?"

**Mechanika:** Kazdy level zacina audio nahravkou (pribeh, legenda, historicky vyklad). Po poslechu hrac odpovida na otazky, jejichz odpoved zaznel v nahravce NEBO je videt na miste.

**Co je unikatni:** Immersivni zazitek - hrac posloucha pribeh primo na miste, kde se odehral. Kombinace poslechu + pozorovani okoli.

**Priklady levelu:**
- Pribeh o Golemovi u Staronove synagogy → "Kolik ma synagoga stupnu u vchodu?"
- Legenda o Daliborce → "Jaky nastroj Dalibor hral?"
- Vyklad o kubismu u Domu U Cerne Matky Bozi → multi-choice otazka

**Realizovatelnost:** Plne realizovatelne. Audio media typ jiz existuje. Otazky pres exact/multi-choice.

---

## 4. Historicky detektiv - "Praha tehdy a ted"

**Mechanika:** Hrac dostane historickou fotografii (cernobilou, 19. stoleti, povodnovy snimek...) a musi najit stejne misto dnes. Na miste porovnava, co se zmenilo, a odpovida na otazky typu "Co na tomto miste stalo drive?" nebo "Kolik pater mela budova na stare fotce?"

**Co je unikatni:** Cestovani v case. Hrac vidi promen mesta a uci se historii. Fotky pred/po jsou fascinujici.

**Priklady levelu:**
- Vaclavske namesti 1968 vs. dnes → "Jaky obchod stal na rohu?"
- Karluv most pred sochou sv. Jana → "V kterem roce byla socha postavena?"
- Stare Mesto pred asanaci → "Ktera ulice uz neexistuje?"

**Realizovatelnost:** Realizovatelne. Stare fotky jako image media, otazky pres exact/multi-choice.

---

## 5. Escape Room venku - "Utec z Prahy"

**Mechanika:** 5-7 levelu, ktere jsou navzajem propojene jednim pribehom. Odpoved z jednoho levelu je soucasti klice k dalsimu. Hrac musi kombinovat informace ze vsech predchozich levelu, aby vyresil finalni puzzle.

**Co je unikatni:** Na rozdil od nezavislych levelu, tady vsechno souvisi. Hrac si musi pamatovat/zapisovat vodítka. Finalni level vyzaduje zkombinovat vsechny predchozi odpovedi.

**Priklady levelu:**
- Level 1: "Kolik soch je na moste?" → odpoved: 30
- Level 2: "Rok zalozeni kostela?" → 1344
- Level 3: "Pocet oken na fasade?" → 8
- Finalni: Zadej kod 30-1344-8 pro odemceni

**Realizovatelnost:** Realizovatelne s drobnym trikem - finalni odpoved je kombinace predchozich. Markdown popis muze hrace instruovat, at si zapisuji. Pro plne propojeni by se hodil novy feature (promena/inventory system).

---

## 6. Speedrun rallye - "Bleskova Praha"

**Mechanika:** Hra na cas. Vsechny lokace jsou relativne blizko sebe (do 500m). Otazky jsou jednoduche, ale je jich hodne (10-15). Cil: projet vsechny co nejrychleji. Leaderboard porovnava hrace.

**Co je unikatni:** Adrenalinkovy zazitek. Mene premysleni, vice behani. Krátké, punchline otázky. Penalizace za spatne odpovedi pridava cas.

**Priklady levelu:**
- "Jaka barva jsou dvere?" → blue (5s na odpoved)
- "Precti cislo na domě" → exact match
- "Kolik lavicek vidis?" → cislo

**Realizovatelnost:** Plne realizovatelne. timeLimitSec na levelech, scoring system jiz existuje, penaltyTimeSec taky. Chybi verejny leaderboard (novy feature).

---

## 7. Sberatel - "Prazske poklady"

**Mechanika:** Hrac sbira virtualni predmety na ruznych lokacich (odznaky, karticky, puzzle dily). Kazdy predmet ma unikatni design. Sbírka se postupne plni. Nektere predmety jsou vzacne (daleko, tezke puzzle).

**Co je unikatni:** Kolekcionarsky instinkt. Hrac se chce vracet a dosbírat vsechno. Predmety mohou tvorit sadu (napr. vsechny prazske veze, vsechny mosty).

**Priklady levelu:**
- Navstiv Petrinskou rozhlednu → ziskej karticky "Rozhledna"
- Vyresi hadanku u Narodniho divadla → ziskej vzacny odznak
- Najdi 5 kubistickych budov → kompletni sada "Kubismus"

**Realizovatelnost:** Castecne realizovatelne. Zakladni sber pres completedLevels. Pro vizualni sbirku a rarity system by byl potreba novy feature (inventory/collection UI).

---

## 8. Multiplayer souboj - "Praha vs. Praha"

**Mechanika:** Dva tymy (nebo vice) hraji stejnou trasu soucasne. Kdo vyresi level driv, dostane bonus body. Tymy vidi na mape pozici souperu v realnem case.

**Co je unikatni:** Soutezni adrenalin. Videt, ze souperuv tym je pred tebou, motivuje k rychlejsimu reseni. Moznost "blokovat" level (kdo ho vyresi prvni, ziska dvojite body).

**Priklady levelu:**
- Oba tymy maji stejne otazky, ale v jinem poradi
- Bonus level: kdo ho najde prvni, ziska 3x body
- Finalní sprint k poslednimu checkpointu

**Realizovatelnost:** Vyzaduje nove features: real-time sync pozic hracu, tymovy system, live leaderboard. WebSocket nebo polling API.

---

## 9. Nocni hra - "Stíny Prahy"

**Mechanika:** Hra je navrzenà tak, aby se hrala po setmeni (19:00-23:00). Temata: duchove, legendy, zahadna mista. Hinty mohou byt batekou podsvicene nápisy, UV svetlo na QR kodech. Atmosfera je klic.

**Co je unikatni:** Uplne jiny zazitek nez ve dne. Praha v noci ma jinou atmosferu. Mene turistu, vic tajemna. Audio efekty (strasidelne zvuky) zesilují zážitek.

**Priklady levelu:**
- Navstiv Faustuv dum v noci → "Kdo podle legendy v dome bydlel?"
- Najdi "nejuzsi ulicku v Praze" → projdi ji (v noci je to zazitek)
- Stary zidovsky hrbitov → otazka o Golemovi

**Realizovatelnost:** Realizovatelne. Casove omezeni lze popsat v game description. Atmosfericke audio a temne fotky pres media. Pro vynucení nočního hrani by se hodil time-gate feature.

---

## 10. Zvukova stopa - "Poslechni a najdi"

**Mechanika:** Misto fotky nebo textového popisu hrac dostane zvukovou stopu nahrany na konkretnim miste (zvoneni zvonu, tramvaj, fontana, poulični muzikant). Podle zvuku musi identifikovat lokaci.

**Co je unikatni:** Smyslovy zazitek. Hrac musi pozorne poslouchat a premyslet, kde by takovy zvuk mohl byt. Uplne jiny typ vnimani mesta.

**Priklady levelu:**
- Zvuk zvonu → identifikuj kostel (kazdy ma jiny zvuk)
- Zvuk tramvaje na specificke krizovatce → jaká linka to je?
- Ambientni zvuk trhu → ktery trh to je?

**Realizovatelnost:** Plne realizovatelne. Audio media jiz podporovany. GPS unlock + exact/multi-choice odpovedi. Popis: "Poslechni nahravku a najdi misto."

---

## 11. QR kod hon - "Skryté kódy"

**Mechanika:** Na realnych mistech v meste jsou umisteny QR kody (nalepky, plakaty). Hrac musi fyzicky najit a naskenovat QR kod, cimz odemkne dalsi level. QR kody mohou byt schované na nečekaných místech.

**Co je unikatni:** Fyzická interakce s prostredim. Hrac musi opravdu hledat - neni to jen o GPS pozici, ale o nalezeni konkrétního objektu na miste.

**Priklady levelu:**
- QR kod na spodní strane lavicky v parku
- QR kod na sloupu pouličního osvetleni
- QR kod v kapse sochy (pokud je pristupna)

**Realizovatelnost:** Plne realizovatelne. answerType "qr-code" jiz existuje! Staci pripravit fyzicke QR kody. GPS unlock priblizi hrace k oblasti, QR kod je finalni overeni.

---

## 12. Kreativni vyzvy - "Tvoř v Praze"

**Mechanika:** Na kazdem stanovisti hrac plni kreativni ukol: vyfot sebe v pose sochy, nakresli budovu, natoc 10s video, napís báseň inspirovanou místem. Ukoly se odevzdavaji fotkou/videem.

**Co je unikatni:** Zadne "spravne odpovedi". Hrac se vyjadruje kreativne. Vytvari si osobni vzpominky. Moznost community galerie, kde hráči vidi tvorbu ostatnich.

**Priklady levelu:**
- "Vyfot sebe tak, abys vypadal jako socha na moste"
- "Nakresli Petrinskou rozhlednu behem 2 minut"
- "Natoc 15s video zachycujici atmosferu tohoto mista"

**Realizovatelnost:** Castecne. Momentalne neni foto/video upload od hrace. Novy feature: user media upload + volitelne community voting misto answer validation. Alternativne lze pouzit answerType "none" (lokacni overeni staci).

---

## 13. Pribehova hra - "Volby Prahy"

**Mechanika:** Hrac je hlavni postava pribehu (detektiv, cas. cestovatel, zlodej). Na kazdém stanovisti si vybira z 2-3 moznosti, co udelat. Volba urcuje, kam pujde dal (branching paths). Vice koncu.

**Co je unikatni:** Kazdy hrac ma jinou trasu a jiny zazitek. Replay value - hrac muze hru hrat znovu a zvolit jine cesty. Imerze do role.

**Priklady levelu:**
- "Pronásleduješ podezřelého. Zahnul doleva do uličky nebo doprava k řece?" → kazda volba = jiny dalsi level
- "Našel jsi tajný dopis. Otevřeš ho nebo ho předáš policii?" → ovlivni finale

**Realizovatelnost:** Vyzaduje novy feature: branching level progression (ne lineární sekvence). Multi-choice odpoved by mohla urcovat nasledujici level. Architektonicky vyznamna zmena.

---

## 14. Matematicka stezka - "Cisla v ulicích"

**Mechanika:** Kazdy level je matematicky problem, ktery vyzaduje informace z realneho sveta. Hrac musi secist, nasobit nebo jinak spocitat neco, co vidi na ulici.

**Co je unikatni:** Vzdelavaci aspekt (mate + mestska architektura). Hrac si musi vsimat detailu, ktere normalne prehlizi. Idealni pro skolni skupiny.

**Priklady levelu:**
- "Secti vsechna cisla popisna na teto strane ulice a vydel tremi"
- "Kolik oken ma budova? Vynasob poctem pater"
- "Odecti rok na pamětní desce od soucasneho roku"

**Realizovatelnost:** Plne realizovatelne. Exact odpovedi (cisla). Markdown popis s matematickym zadanim.

---

## 15. Orientacni beh - "Ztracen v Praze"

**Mechanika:** Hrac dostane jen startovni bod a mapu BEZ navigace (nebo jen kompas). Checkpointy jsou oznaceny na papirove/staticke mape. Hrac musi sam navigovat. Zadny GPS navadec, zadny distance indicator.

**Co je unikatni:** Testuje orientacni smysl. Hrac se musi divat na okoli a skutecne navigovat. Mapa muze byt stylizovana (rucne kreslena, historicka).

**Priklady levelu:**
- Rucne kreslena mapa s X na miste → najdi ho
- Historicka mapa z 18. stoleti → naviguj podle ni
- Pouze popis ("200 kroku na sever od kostela, pak doleva")

**Realizovatelnost:** Castecne. GPS unlock funguje, ale je potreba skryt mapu a distance indicator. Novy feature: game-level nastaveni pro skryti navigacnich prvku. Alternativne: velky unlockRadius (napr. 1km) + puzzle na miste.

---

## 16. Gastro quest - "Chute Prahy"

**Mechanika:** Hra vede hrace po kavarnach, restauracich a street food standech. Na kazdem miste ochutna neco typickeho a odpovida na otazky o jídle, ingrediencich nebo historii podniku.

**Co je unikatni:** Multi-smyslovy zazitek (chut + pohyb). Hrac skutecne neco jí/pije. Spoluprace s lokálními podniky (slevové kódy jako odmena).

**Priklady levelu:**
- Kavarna → "Z ktere zeme pochazi kava, kterou ti naservírovali?" (multi-choice)
- Trdelnik stand → "Jaky je puvod trdelniku?" (exact: Slovensko/Madarsko)
- Pivovar → "Kolik stupnu ma tady varene pivo?"

**Realizovatelnost:** Plne realizovatelne v soucasne architekture. GPS unlock + otazky. requiredItems muze obsahovat "penize na obcerstveni". Slevove kody v solvedMessage.

---

## 17. Street art galerie - "Umení ulice"

**Mechanika:** Hrac hleda street art (graffiti, murale, instalace) po meste. Na kazdem miste odpovida na otazky o dile nebo autorovi. Buduje si virtualni galerii nalezenych del.

**Co je unikatni:** Objevovani umeni, ktere lide normalne prechazi. Edukacni aspekt o street art scene. Fotodokumentace - nektera dila casem zmizi.

**Priklady levelu:**
- Lennon Wall → "V kterem roce zacali lide zed malovat?"
- David Cerny socha → "Jak se jmenuje toto dilo?"
- Skryty mural v pasazi → "Co je na obraze?"

**Realizovatelnost:** Plne realizovatelne. Fotky del jako media, GPS unlock, exact/multi-choice odpovedi.

---

## 18. Tymova stafeta - "Rozdelená Praha"

**Mechanika:** Hra pro 3-4 hrace. Kazdy hrac dostane jinou cast trasy (jine levely na jinych mistech). Casti se hraji paralelne. Na konci se vsichni sejdou a musi zkombinovat sve odpovedi, aby vyresili finalni puzzle.

**Co je unikatni:** Nutnost spoluprace a komunikace. Kazdy hrac vi jen svou cast. Finalni level vyzaduje informace od vsech clenu tymu.

**Priklady levelu:**
- Hrac A: zjisti rok na moste → posle ostatnim
- Hrac B: zjisti jmeno architekta → posle ostatnim
- Hrac C: zjisti pocet vezicek → posle ostatnim
- Final (vsichni): "Rok + prvni pismeno jmena + pocet = kod"

**Realizovatelnost:** Vyzaduje nove features: paralelni trasy v ramci jedne hry, tymovy system, sdileni odpovedi mezi hraci. Alternativne: 3-4 samostatne hry + instrukce v popisu.

---

## 19. Augmented Reality - "Skrytá Praha"

**Mechanika:** Hrac na miste zapne kameru a pres AR vrstvu vidi virtualni objekty (duchy, historicke postavy, skryte napisy). Interaguje s nimi - odpovida na otazky, sbira virtualni predmety.

**Co je unikatni:** Wow efekt. Videt na Karlovem moste virtualniho Jana Nepomuckeho, ktery vam klada otazky. Technologicky nejnarocnejsi koncept.

**Priklady levelu:**
- AR postava na moste vam da hadanku
- AR sipky na zemi ukazuji skrytou cestu
- AR rekonstrukce budovy, ktera uz nestoji

**Realizovatelnost:** Vyzaduje zcela novy feature: AR engine (WebXR/AR.js/8th Wall). Nejnarocnejsi na implementaci ze vsech konceptu. Mozny MVP: jednoduse AR markery pres kameru.

---

## 20. Tajny agent - "Operace Praha"

**Mechanika:** Hrac je tajny agent na misi. Dostava sifrovane zpravy (morseovka, pigpen cipher, neviditelny inkoust = UV baterka). Na kazdem stanovisti plni "misi" - sledovani, predani balicku (virtualni), desifrování.

**Co je unikatni:** Roleplay aspekt. Hrac se citi jako spion. Kombinace sifer, pozorovani a znalosti prostredi. Atmosfera studene valky v Praze.

**Priklady levelu:**
- "Vase kontaktni osoba sedi na lavicce u fontany. Kolik lidi sedi na lavickach v okruhu 20m?" (pozorovani)
- Pigpen cipher → rozlusti jmeno ulice → jdi tam
- "Najdete mrtvou schranku (dead drop). Naskenujte QR kod na zadni strane lavicky"
- Morsovka ve zvukovém klipu → GPS souradnice

**Realizovatelnost:** Vetsinou realizovatelne. Sifry jako obrazky/audio (media), QR kody (qr-code answer type), pozorovaci ukoly (exact odpoved). UV baterka by byla fyzicky requiredItem.

---

## Souhrn realizovatelnosti

### Hned realizovatelne (soucasna architektura):
1. Fotohra
2. Sifrovacka
3. Audioprůvodce
4. Historicky detektiv
6. Speedrun rallye (bez leaderboardu)
10. Zvukova stopa
11. QR kod hon
14. Matematicka stezka
16. Gastro quest
17. Street art galerie
20. Tajny agent

### Castecne realizovatelne (drobne upravy):
5. Escape Room (propojene odpovedi → inventory system)
9. Nocni hra (casovy time-gate)
12. Kreativni vyzvy (foto upload od hrace)
15. Orientacni beh (skryti navigace)

### Vyzaduji nove features:
7. Sberatel (collection/inventory UI)
8. Multiplayer souboj (real-time sync, tymy)
13. Pribehova hra (branching paths)
18. Tymova stafeta (paralelni trasy, tymovy system)
19. Augmented Reality (AR engine)
