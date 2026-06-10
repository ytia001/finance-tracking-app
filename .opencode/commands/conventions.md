---
description: Show style, tooling, data model conventions, and test helpers for this finance-tracking monorepo. Use this to ensure code follows project conventions.
---

# Finance Tracking Monorepo — Style & Conventions

## Style & Tooling

- **Prettier:** `singleQuote: true`, `printWidth: 100`, `parser: "angular"` for HTML
- **ESLint:** component selector `kebab-case`, directive selector `camelCase`, both prefixed with `app`
- **Lint command order:** `ngc:check` → `eslint` → `format`

## Data Models

- **DataEntry.date** — stored as Unix timestamp (`number`)
- **DataEntry.amount** — stored as `string` (Drizzle numeric → string)
- **Category enum** in `apps/ui/src/app/core/constants/Category.ts` mirrors API schema

## Test Helpers

Use `apps/ui/src/app/test-helpers.ts` factory methods (`createDataEntry`, `createTransactionEntry`, etc.) instead of inline test data.
