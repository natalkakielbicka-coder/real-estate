# Residence – Real Estate

A frontend application for a real estate developer, built with Vue 3. It lets users browse developments and apartments, use advanced filters, explore interactive floor plans, compare apartments and estimate purchase costs.

## Demo

[View the live app](https://natalkakielbicka-coder.github.io/real-estate/)

## Features

### Apartments

- list of 35 apartments,
- filtering by location, number of rooms, floor, price, status and amenities,
- sorting by price, area and price per m²,
- active filters shown as tags,
- result count next to each filter option,
- price range validation,
- filters synced with URL parameters,
- browser Back and Forward navigation support,
- mobile filter panel,
- paginated results,
- automatic return to the first page when filters change,
- grid, list, table, floor plan and map views,
- image loading states,
- empty state with an option to clear filters,
- adding and removing favourites,
- adding apartments to comparison,
- favourites and comparison synced across views.

### Apartment details

- photo gallery built with Swiper,
- full-screen lightbox,
- apartment floor plan,
- price, area, floor and completion date,
- list of features and amenities,
- price history in a modal,
- price history sorted from newest to oldest,
- scrollable table for longer price history,
- sharing the apartment or copying its link,
- downloadable apartment sheet in PDF,
- link to the purchase cost calculator,
- apartment highlighted on the interactive floor plan,
- adding to favourites and comparison,
- similar apartments,
- recently viewed apartments.

### Favourites

- dedicated page with saved apartments,
- favourites counter in the header,
- removing apartments directly from the list,
- list preserved after page refresh,
- toast notifications when adding and removing,
- empty state with a link to the apartment list.

### Comparison

- adding apartments to comparison from grid, list, table and details views,
- up to three apartments compared at once,
- dedicated comparison page,
- side-by-side price, area, rooms, floor, price per m² and status,
- lowest price, largest area and lowest price per m² highlighted,
- removing individual apartments from comparison,
- clearing the whole comparison,
- comparison counter in the header,
- selected apartments saved in `localStorage`,
- empty state with a link to the apartment list.

### Recently viewed

- visited apartments saved automatically,
- ordered from most recently viewed,
- duplicates removed,
- limited number of stored apartments,
- history saved in `localStorage`,
- recently viewed listings shown on the details page.

### Developments

- list of developments,
- development details view,
- development map built with Leaflet,
- counters of available, reserved and sold apartments,
- interactive floor selection on a building visualisation,
- interactive floor plan of apartments on the selected floor,
- filtering apartments by status,
- selected floor synced with the URL.

### Purchase cost calculator

- choice of development and available apartment,
- apartment preselected via URL parameter,
- custom price and area input,
- switching between a listed apartment and custom data,
- primary and secondary market support,
- PCC (civil law transactions tax) calculated for the secondary market,
- PCC exemption for eligible first-home purchases,
- validation of custom price and area,
- required mortgage amount,
- down payment percentage,
- warning when the down payment is below 20%,
- choice of finishing standard,
- finishing cost calculated from the area,
- additional costs: parking space, storage unit and notary fees,
- summary of all costs,
- cost breakdown chart,
- informational chart state for incomplete data,
- saving blocked for incomplete calculations,
- calculation saved in `localStorage`,
- saved calculation loaded automatically,
- calculator reset,
- toast notifications after saving and resetting.

## Tech stack

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

## Project structure

```text
src/
├── assets/       # Global styles and Tailwind CSS configuration
├── components/   # UI components
├── composables/  # Reusable logic
├── constants/    # Statuses and app constants
├── data/         # Apartments, developments, price history and floor plans
├── router/       # Vue Router configuration
├── utils/        # Helpers, formatters and PDF generator
└── views/        # Page views
```

## Installation

Requires Node.js and npm.

```bash
npm install
```

## Running the project

```bash
npm run dev
```

The app will be available at the address shown by Vite, by default:

```text
http://localhost:5173
```

## Available scripts

Start the development server:

```bash
npm run dev
```

Lint with ESLint:

```bash
npm run lint
```

Fix ESLint issues automatically:

```bash
npm run lint:fix
```

Check formatting:

```bash
npm run format:check
```

Format code:

```bash
npm run format
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Application data

The project uses local data stored in `src/data`. It does not require an external API or backend.

Price history is for demonstration purposes and is generated from local apartment data.

The following are stored in `localStorage`:

- favourite apartments,
- apartments added to comparison,
- recently viewed apartments,
- saved purchase cost calculation.

## Calculator disclaimer

Calculator results are approximate and do not constitute a commercial offer, financial advice or tax advice. Actual costs may depend on the terms of the transaction and the buyer's individual situation.
