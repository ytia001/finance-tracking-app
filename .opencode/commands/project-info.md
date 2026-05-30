---
description: Show project structure, dev commands, and stack info for this finance-tracking monorepo. This project uses Angular 21 + NestJS 11 + PostgreSQL 17.
---

# Finance Tracking Monorepo — Project Info

## Structure

```
apps/ui/          # Angular 21 frontend (port 4200, ng serve)
apps/api/         # NestJS 11 backend (port 3000, nest start --watch)
docker-compose.yml # PostgreSQL 17 (5433→5432), Redis (6379)
```

## Developer Commands

- **Start both services:** `npm run dev`
- **Separate services:** `npm run ui`, `npm run api`
- **Database:** `npm run db:up`, `npm run db:down`, `npm run db:migrate`, `npm run db:generate`
- **From `apps/ui`:** `npm run lint` (ngc + eslint + prettier), `npm run test` (Jasmine/Karma), `npm run format`
- **From `apps/api`:** `npm run start:dev`, `npm run build`, `npm run db:studio`

**Package manager locked to:** `npm@11.6.2`
