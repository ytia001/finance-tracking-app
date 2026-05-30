---
description: Show Angular and API architecture patterns for this finance-tracking monorepo, including NgRx state, modals, API routes, and Drizzle ORM.
---

# Finance Tracking Monorepo — Architecture Patterns

## Angular

- **Standalone components only** — no NgModules
- **NgRx feature state** registered per-route via `provideState()` (see `dashboard.routes.ts`, `transactions.routes.ts`)
- **Root store** only has `auth` + `receipts` reducers (`app.reducer.ts`)
- **Modal pattern** — all modals extend `AbstractModalDialogComponent`, opened exclusively via NgRx effects (`MainEffects`)
- **NgRx action split** — UI trigger actions (e.g. `openAddDataEntryModal`, `uploadReceipt`) live in `actions/main.actions.ts`; API lifecycle events (success/failure) live in `actions/resources/*.actions.ts`

## API

- **Global `/api` prefix** — all routes under `apps/api/src/main.ts:18`
- **JWT auth enabled globally** — use `@Public()` decorator for public routes (login, register)
- **Drizzle migrations** — schema in `apps/api/src/db/schema/`, run `npm run db:migrate` after schema changes
