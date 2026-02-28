# Copilot Instructions — FintracUI

## Stack

- **Angular 21** with standalone components (no NgModules anywhere)
- **NgRx 21** for state (store, effects, selectors) using functional API (`createActionGroup`, `createReducer`, `createFeatureSelector`)
- **Angular Material 21** for all UI components; **Bootstrap 5** for layout utilities
- **ng2-charts + chart.js** for charts; **chroma-js** for color utilities
- **Jasmine + Karma** for tests (`npm run test`); **Vitest** is installed but not yet the primary runner

## Developer Commands

```bash
npm run start        # ng serve → http://localhost:4200
npm run test         # ng test (Jasmine/Karma)
npm run lint         # ngc type-check + eslint --fix + prettier --write
npm run format       # prettier only
```

> `packageManager` is locked to `npm@11.6.2`. Always run `npm install` after cloning.

## Architecture

### Routing & Layout

```
'' → MainComponent (sidenav + header shell)
  dashboard/      → lazy → DashboardComponent   (feature state registered here)
  transactions/   → lazy → TransactionsComponent (feature state registered here)
  breakdown/      → eager BreakdownComponent
  configuration/  → eager ConfigurationComponent
```

### NgRx State Pattern

- **Root store**: `provideStore()` in `app.config.ts` — no root reducers; only `MainEffects` registered globally.
- **Feature state** is scoped to lazy routes via `provideState()` inside the route's `providers` array (see `dashboard.routes.ts`, `transactions.routes.ts`). Never add feature reducers to `appConfig`.
- **Actions** are split into two files per domain:
  - `core/store/actions/main.actions.ts` — UI/shell events (e.g. `openAddDataEntryModal`)
  - `core/store/actions/resources/main.actions.ts` — API request/success/failure (source suffix `[API]`)
- Selectors live in `core/store/selectors/` and may contain transformation logic (see `selectListData` in `transactions.selector.ts`).

### Modal Dialog Pattern

All modals extend `AbstractModalDialogComponent` (`shared/modal-dialog/modal-dialog.component.ts`) and implement `closeDialog()` / `saveDialog()`. Modals are opened exclusively via NgRx effects — dispatch an action, let `MainEffects` open `MatDialog`, and return the result as a new action:

```ts
// Dispatch
this.store.dispatch(MainActions.openAddDataEntryModal());
// Effect opens EntryModalComponent; dialog result → MainResourceActions.saveDataEntry(...)
```

### Form Pattern

Each modal's form is encapsulated in a dedicated `*ControlService` (e.g. `EntryModalControlService`). The service owns `toFormGroup()` and `toRequestPayload(formGroup)`. Use the `AsFormGroup<T>` utility type from `shared/modal-dialog/modal-helper.ts` for typed `FormGroup`.

### Backend / Services

`MainService` (`core/services/main.services.ts`) is the single service. The `baseUrl` is currently empty and `create()` returns a mocked `of(...)` response — HTTP calls are commented out. When wiring real endpoints, uncomment the `http.post/get/put/delete` methods.

### Models & Constants

- `models/DataEntry.ts` — core entity; `date` is stored as a Unix timestamp (`number`)
- `core/constants/Category.ts` — `Category` enum + `CategoryOptions` display map; `financialFlow` enum for inflow/outflow classification
- `core/constants/Modal.ts` — modal size constants (`MODAL_WIDTH_PERCENTAGE`, `MODAL_HEIGHT_PERCENTAGE`)

## Testing Conventions

- Use `TestHelpers` (`src/app/test-helpers.ts`) for fixture factories — add new factory methods here rather than inlining test data.
- Effects are tested with `provideMockActions(() => actions$)` and spy objects for `MatDialog`.
- Example: `main.effects.spec.ts` shows the full pattern for dialog-based effect tests.

## Key Conventions

- All components use `inject()` (not constructor injection).
- Standalone component `imports` array must list every Angular/Material module used directly in that component's template.
- Charts live under `features/contents/dashboard/charts/` — one subdirectory per chart type (`Pie/`, `Line/`, `Bar/`).
- The `dashboard` feature currently uses dummy data (`get dummyDashboardData()`); real data should come from the store once the backend is connected.
