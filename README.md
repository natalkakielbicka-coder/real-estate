# Residence – Real Estate

Frontendowa aplikacja dla dewelopera nieruchomości zbudowana w Vue 3. Aplikacja umożliwia przeglądanie inwestycji i mieszkań, korzystanie z rozbudowanych filtrów, interaktywnych rzutów oraz kalkulatora kosztów zakupu.

## Funkcjonalności

### Mieszkania

- lista 35 mieszkań,
- filtrowanie według lokalizacji, liczby pokoi, ceny, statusu i udogodnień,
- sortowanie według ceny, powierzchni i ceny za m²,
- aktywne filtry w formie etykiet,
- liczba wyników dostępna przy każdym filtrze,
- walidacja zakresu cen,
- synchronizacja filtrów z parametrami URL,
- obsługa nawigacji przeglądarki „Wstecz” i „Dalej”,
- mobilny panel filtrów,
- widok siatki, listy, tabeli, rzutu i mapy,
- komunikat o braku wyników wraz z możliwością wyczyszczenia filtrów.

### Szczegóły mieszkania

- galeria zdjęć oparta na Swiper,
- pełnoekranowy lightbox,
- rzut mieszkania,
- informacje o cenie, powierzchni, piętrze i terminie oddania,
- lista cech i udogodnień,
- udostępnianie mieszkania lub kopiowanie linku,
- przejście do kalkulatora kosztów zakupu,
- wyróżnienie mieszkania na interaktywnym rzucie,
- lista podobnych mieszkań.

### Inwestycje

- lista inwestycji,
- szczegółowy widok inwestycji,
- mapa inwestycji oparta na Leaflet,
- liczniki dostępnych, zarezerwowanych i sprzedanych mieszkań,
- interaktywny wybór piętra z wizualizacji budynku,
- interaktywny rzut mieszkań na wybranym piętrze,
- filtrowanie mieszkań według statusu,
- synchronizacja wybranego piętra z adresem URL.

### Kalkulator kosztów zakupu

- wybór inwestycji i dostępnego mieszkania,
- obsługa mieszkania przekazanego przez parametr URL,
- obliczanie potrzebnego kredytu,
- obliczanie procentowego wkładu własnego,
- ostrzeżenie o wkładzie własnym niższym niż 20%,
- wybór standardu wykończenia,
- obliczanie kosztu wykończenia na podstawie powierzchni,
- dodatkowe koszty miejsca parkingowego, komórki lokatorskiej i notariusza,
- podsumowanie wszystkich kosztów,
- wykres podziału kosztów,
- zapis kalkulacji w `localStorage`,
- automatyczne wczytywanie zapisanej kalkulacji,
- możliwość zresetowania kalkulatora,
- komunikaty toast po zapisaniu i zresetowaniu danych.

## Technologie

- Vue 3,
- Composition API,
- Vue Router,
- Vite,
- Tailwind CSS,
- Chart.js,
- Vue Chart.js,
- Leaflet,
- Swiper,
- Vue Easy Lightbox,
- ESLint,
- Prettier.

## Struktura projektu

```text
src/
├── assets/       # Style globalne i konfiguracja Tailwind CSS
├── components/   # Komponenty interfejsu
├── composables/  # Logika wielokrotnego użytku
├── constants/    # Statusy i stałe aplikacji
├── data/         # Dane mieszkań, inwestycji i rzutów
├── router/       # Konfiguracja Vue Router
├── utils/        # Funkcje pomocnicze i formatery
└── views/        # Widoki poszczególnych podstron
```

## Instalacja

Wymagany jest Node.js oraz npm.

```bash
npm install
```

## Uruchomienie projektu

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem podanym przez Vite, domyślnie:

```text
http://localhost:5173
```

## Dostępne polecenia

Uruchomienie środowiska deweloperskiego:

```bash
npm run dev
```

Sprawdzenie kodu przez ESLint:

```bash
npm run lint
```

Automatyczna naprawa problemów ESLint:

```bash
npm run lint:fix
```

Sprawdzenie formatowania:

```bash
npm run format:check
```

Automatyczne formatowanie kodu:

```bash
npm run format
```

Zbudowanie wersji produkcyjnej:

```bash
npm run build
```

Lokalny podgląd wersji produkcyjnej:

```bash
npm run preview
```

## Dane aplikacji

Projekt korzysta obecnie z lokalnych danych zapisanych w katalogu `src/data`. Nie wymaga zewnętrznego API ani backendu.

Zapisana kalkulacja jest przechowywana lokalnie w przeglądarce przy użyciu `localStorage`.
