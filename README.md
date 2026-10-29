# Verbdag

Codzienny pakiet norweskich czasowników (domyślnie 5) do nauki form: infinitiv, presens, preteritum, perfektum.
Baza 131 czasowników pochodzi z lekcji kursu (lista nieregularnych z lekcji 18, grupy regularne 1–4, modalne).

## Jak działa
- **Pakiet dnia** – najpierw czasowniki, których termin powtórki minął, potem nowe (kolejność wg częstości).
- **Krok 1: Poznaj** – karta z odmianą, regułą grupy i przykładowymi zdaniami.
- **Krok 2: Ćwicz** – dla każdego czasownika: PL → infinitiv, presens, preteritum, perfektum oraz zdanie z luką,
  w którym czas wynika ze wskaźnika (i går, allerede, aldri, hver dag, i morgen skal…). Błędne odpowiedzi wracają na koniec kolejki.
- **Powtórki (system Leitnera)** – pakiet bez błędów przesuwa czasownik o poziom wyżej (powtórka po 1, 2, 4, 8, 16, 32 dniach),
  błąd cofa go na poziom 1.
- Postęp zapisuje się w `localStorage`; eksport/import w ustawieniach.

## Uruchomienie lokalne
```bash
npm install
npm run dev
npm test        # walidacja bazy czasowników i generatora ćwiczeń
npm run build   # wynik w dist/
```

## Publikacja za darmo

**Render (onrender.com)** – gotowy plik `render.yaml`:
1. Wypchnij kod do repozytorium na GitHubie (może być prywatne).
2. Na render.com: **New → Blueprint**, wskaż repozytorium. Render odczyta `render.yaml`
   i utworzy Static Site `verbdag` (build: `npm ci && npm test && npm run build`, publikacja: `dist`).
3. Kliknij **Apply**. Aplikacja będzie dostępna pod `https://verbdag.onrender.com`
   (lub z sufiksem, jeśli nazwa jest zajęta). Każdy push na `main` publikuje nową wersję.

Alternatywa bez Blueprint: **New → Static Site**, Build Command `npm ci && npm run build`, Publish Directory `dist`.
Wersję Node ustala plik `.node-version` (20).


**Netlify / Cloudflare Pages / Vercel**: build command `npm run build`, katalog wyjściowy `dist`.
Ścieżki są względne (`base: './'`), więc działa w dowolnym podkatalogu.

## Rozbudowa bazy
Czasowniki są w `src/data/verbs.js`, jeden wiersz na czasownik:
```
inf|presens|preteritum|perfektum|znaczenie PL|dopełnienie do zdań|grupa|lekcja
```
Formy alternatywne rozdziel `/` (np. `lagde/laget`). Dopełnienie `-` wyłącza zdanie z luką.
Grupy: `1` (-et), `2` (-te), `3` (-de), `4` (-dde), `S` (nieregularny), `M` (modalny). Po zmianach uruchom `npm test`.
