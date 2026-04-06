# Copilot Instructions — Finance Tracking Monorepo

## Monorepo Layout

```
finance-tracking-app/
  apps/
    ui/          ← Angular 21 frontend (run commands from here for UI)
    api/         ← NestJS 11 backend   (run commands from here for API)
  docker-compose.yml   ← PostgreSQL 17 dev database (port 5433)
  package.json         ← root monorepo scripts
```

## Stack

### UI (`apps/ui`)

- **Angular 21** with standalone components (no NgModules anywhere)
- **NgRx 21** for state (store, effects, selectors) using functional API (`createActionGroup`, `createReducer`, `createFeatureSelector`)
- **Angular Material 21** for all UI components; **Bootstrap 5** for layout utilities
- **ng2-charts + chart.js** for charts; **chroma-js** for color utilities
- **Jasmine + Karma** for tests (`npm run test`); **Vitest** is installed but not yet the primary runner

### API (`apps/api`)

- **NestJS 11** with Express platform
- **Drizzle ORM** with `drizzle-kit` for schema + migrations
- **PostgreSQL 17** — runs in Docker on port `5433` (mapped to container `5432`)
- `class-validator` + `class-transformer` for DTO validation

## Developer Commands

### From repo root

```bash
npm run ui           # ng serve → http://localhost:4200
npm run api          # nest start --watch → http://localhost:3000
npm run dev          # both UI and API concurrently
npm run db:up        # docker-compose up -d  (start PostgreSQL)
npm run db:down      # docker-compose down
npm run db:migrate   # run Drizzle migrations
npm run db:generate  # generate new migration from schema
npm install          # install root dev deps (concurrently)
npm run install:all  # npm install in both apps/ui and apps/api
```

### From `apps/ui`

```bash
npm run start        # ng serve → http://localhost:4200
npm run test         # ng test (Jasmine/Karma)
npm run lint         # ngc type-check + eslint --fix + prettier --write
npm run format       # prettier only
```

### From `apps/api`

```bash
npm run start:dev    # nest start --watch
npm run build        # nest build
npm run db:generate  # drizzle-kit generate
npm run db:migrate   # drizzle-kit migrate
npm run db:studio    # drizzle-kit studio (DB GUI)
```

> `packageManager` is locked to `npm@11.6.2`.

## Architecture

### Routing & Layout (UI)

```
'' → MainComponent (sidenav + header shell)
  dashboard/      → lazy → DashboardComponent   (feature state registered here)
  transactions/   → lazy → TransactionsComponent (feature state registered here)
  breakdown/      → eager BreakdownComponent
  configuration/  → eager ConfigurationComponent
```

### NgRx State Pattern

- **Root store**: `provideStore()` in `app.config.ts` — no root reducers; only `MainEffects` + `ToastEffects` registered globally.
- **Feature state** is scoped to lazy routes via `provideState()` inside the route's `providers` array (see `dashboard.routes.ts`, `transactions.routes.ts`). Never add feature reducers to `appConfig`.
- **Actions** are split into two files per domain:
  - `core/store/actions/main.actions.ts` — UI/shell events (e.g. `openAddDataEntryModal`)
  - `core/store/actions/resources/main.actions.ts` — API request/success/failure (source suffix `[API]`)
- Selectors live in `core/store/selectors/` and may contain transformation logic (see `buildMonthTabs` in `transactions.selector.ts`).

### Modal Dialog Pattern

All modals extend `AbstractModalDialogComponent` (`shared/modal-dialog/modal-dialog.component.ts`) and implement `closeDialog()` / `saveDialog()`. Modals are opened exclusively via NgRx effects — dispatch an action, let `MainEffects` open `MatDialog`, and return the result as a new action:

```ts
this.store.dispatch(MainActions.openAddDataEntryModal());
// Effect opens EntryModalComponent; dialog result → MainResourceActions.saveDataEntry(...)
```

### Form Pattern

Each modal's form is encapsulated in a dedicated `*ControlService` (e.g. `EntryModalControlService`). The service owns `toFormGroup()` and `toRequestPayload(formGroup)`. Use the `AsFormGroup<T>` utility type from `shared/modal-dialog/modal-helper.ts` for typed `FormGroup`.

### Backend / Services

`MainService` (`apps/ui/src/app/core/services/main.services.ts`) is the single HTTP service. Base URL is `http://localhost:3000/entries`. All CRUD methods are live:

- `create(entry)` → `POST /entries`
- `getAll()` → `GET /entries`
- `update(id, entry)` → `PUT /entries/:id`
- `delete(id)` → `DELETE /entries/:id`

The API (`apps/api/src/entries/`) handles these endpoints, persists to PostgreSQL via Drizzle, and returns `{ id, amount, date (Unix ms), category }`.

### API Database Schema

The Drizzle schema (`apps/api/src/db/schema.ts`) defines `data_entries` table with a `category` enum that mirrors the Angular `Category` enum. Run `npm run db:migrate` in `apps/api` after schema changes.

### Models & Constants

- `models/DataEntry.ts` — core entity; `date` is stored as a Unix timestamp (`number`); `amount` as `string` (Drizzle numeric → string)
- `core/constants/Category.ts` — `Category` enum + `CategoryConfigurations` map (label + icon); `financialFlow` enum
- `core/constants/Modal.ts` — modal size constants + `retrieveMatModalConfiguration()` helper
- `models/transaction.models.ts` — `TransactionEntry`, `DayGroup`, `MonthTab` for the transactions view

## Testing Conventions

- Use `TestHelpers` (`apps/ui/src/app/test-helpers.ts`) for fixture factories — add new factory methods here rather than inlining test data.
- Effects are tested with `provideMockActions(() => actions$)` and spy objects for `MatDialog`.
- Example: `main.effects.spec.ts` shows the full pattern for dialog-based effect tests.

