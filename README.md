# Residence – Real Estate

Frontendowa aplikacja dla dewelopera nieruchomości zbudowana w Vue 3. Umożliwia przeglądanie inwestycji i mieszkań, korzystanie z rozbudowanych filtrów, interaktywnych rzutów, porównywarki oraz kalkulatora kosztów zakupu.

## Demo

[Zobacz aplikację online](https://natalkakielbicka-coder.github.io/real-estate/)

## Funkcjonalności

### Mieszkania

- lista 35 mieszkań,
- filtrowanie według lokalizacji, liczby pokoi, piętra, ceny, statusu i udogodnień,
- sortowanie według ceny, powierzchni i ceny za m²,
- aktywne filtry w formie etykiet,
- liczba wyników dostępna przy każdym filtrze,
- walidacja zakresu cen,
- synchronizacja filtrów z parametrami URL,
- obsługa nawigacji przeglądarki „Wstecz” i „Dalej”,
- mobilny panel filtrów,
- paginacja wyników,
- automatyczny powrót do pierwszej strony po zmianie filtrów,
- widok siatki, listy, tabeli, rzutu i mapy,
- stany ładowania zdjęć,
- komunikat o braku wyników wraz z możliwością wyczyszczenia filtrów,
- dodawanie i usuwanie mieszkań z ulubionych,
- dodawanie mieszkań do porównania,
- synchronizacja ulubionych i porównywanych mieszkań pomiędzy widokami.

### Szczegóły mieszkania

- galeria zdjęć oparta na Swiper,
- pełnoekranowy lightbox,
- rzut mieszkania,
- informacje o cenie, powierzchni, piętrze i terminie oddania,
- lista cech i udogodnień,
- historia ceny dostępna w oknie modalnym,
- sortowanie historii ceny od najnowszej do najstarszej,
- przewijana tabela dla dłuższej historii,
- udostępnianie mieszkania lub kopiowanie linku,
- pobieranie karty mieszkania w formacie PDF,
- przejście do kalkulatora kosztów zakupu,
- wyróżnienie mieszkania na interaktywnym rzucie,
- dodawanie do ulubionych i porównania,
- lista podobnych mieszkań,
- lista ostatnio oglądanych mieszkań.

### Ulubione

- osobna podstrona z zapisanymi mieszkaniami,
- licznik ulubionych mieszkań w nagłówku,
- możliwość usuwania mieszkań bezpośrednio z listy ulubionych,
- zachowanie listy po odświeżeniu strony,
- komunikaty toast po dodaniu i usunięciu mieszkania,
- pusty stan z odnośnikiem do listy mieszkań.

### Porównywarka

- dodawanie mieszkań do porównania z widoku siatki, listy, tabeli i szczegółów,
- możliwość porównania maksymalnie trzech mieszkań,
- osobna podstrona porównania,
- zestawienie ceny, powierzchni, liczby pokoi, piętra, ceny za m² i statusu,
- wyróżnienie najniższej ceny, największej powierzchni i najniższej ceny za m²,
- usuwanie pojedynczych mieszkań z porównania,
- możliwość wyczyszczenia całego porównania,
- licznik porównywanych mieszkań w nagłówku,
- zapis wybranych mieszkań w `localStorage`,
- pusty stan z odnośnikiem do listy mieszkań.

### Ostatnio oglądane

- automatyczne zapisywanie odwiedzonych mieszkań,
- zachowanie kolejności od ostatnio oglądanego,
- usuwanie powtórzeń,
- ograniczenie liczby przechowywanych mieszkań,
- zapis historii w `localStorage`,
- prezentacja ostatnio oglądanych ofert na stronie szczegółów.

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
- możliwość wpisania własnej ceny i powierzchni mieszkania,
- przełączanie pomiędzy mieszkaniem z oferty a własnymi danymi,
- obsługa rynku pierwotnego i wtórnego,
- obliczanie podatku PCC dla rynku wtórnego,
- uwzględnienie zwolnienia z PCC przy kwalifikującym się zakupie pierwszego mieszkania,
- walidacja własnej ceny i powierzchni,
- obliczanie potrzebnego kredytu,
- obliczanie procentowego wkładu własnego,
- ostrzeżenie o wkładzie własnym niższym niż 20%,
- wybór standardu wykończenia,
- obliczanie kosztu wykończenia na podstawie powierzchni,
- dodatkowe koszty miejsca parkingowego, komórki lokatorskiej i notariusza,
- podsumowanie wszystkich kosztów,
- wykres podziału kosztów,
- stan informacyjny wykresu dla niekompletnych danych,
- blokowanie zapisu niekompletnej kalkulacji,
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
- jsPDF,
- ESLint,
- Prettier.

## Struktura projektu

```text
src/
├── assets/       # Style globalne i konfiguracja Tailwind CSS
├── components/   # Komponenty interfejsu
├── composables/  # Logika wielokrotnego użytku
├── constants/    # Statusy i stałe aplikacji
├── data/         # Dane mieszkań, inwestycji, historii cen i rzutów
├── router/       # Konfiguracja Vue Router
├── utils/        # Funkcje pomocnicze, formatery i generator PDF
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

Historia cen ma obecnie charakter demonstracyjny i jest generowana na podstawie lokalnych danych mieszkań.

W `localStorage` przechowywane są:

- ulubione mieszkania,
- mieszkania dodane do porównania,
- ostatnio oglądane mieszkania,
- zapisana kalkulacja kosztów zakupu.

## Informacja o kalkulatorze

Wyniki kalkulatora mają charakter orientacyjny i nie stanowią oferty handlowej, finansowej ani porady podatkowej. Rzeczywiste koszty mogą zależeć od warunków transakcji oraz indywidualnej sytuacji kupującego.
