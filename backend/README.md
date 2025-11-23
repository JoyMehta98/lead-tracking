## Leads Tracking Backend (Project Docs)

### What this service does

- Provides REST APIs to manage websites, detect forms, and collect leads.
- Authenticated dashboard endpoints to view, paginate, and search leads by website and form.
- Public endpoint `POST /leads/collect` for external websites to submit form data using a website `secretKey`.

### System requirements

- Node.js 18+
- pnpm 8+
- PostgreSQL 13+

### Environment variables (.env)

- DATABASE_HOST
- DATABASE_PORT
- DATABASE_USER
- DATABASE_PASSWORD
- DATABASE_NAME
- NODE_ENV=local|development|production
- PORT (optional, default used by Nest if not set)

Example .env

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=leads_tracking
NODE_ENV=local
PORT=3000
```

### Setup

```bash
pnpm install
```

### Run

```bash
# development (watch)
pnpm run start:dev

# production
pnpm run build && pnpm run start:prod
```

The server uses TypeORM with Postgres (see `src/modules/database/data-source.ts`). Migrations are auto-run and synchronize is enabled for local development.

### Useful endpoints

- GET /websites — list websites with forms and total leads counts
- GET /websites/:id/forms — list detected forms for a website, including `leadCount` per form
- GET /leads — list leads with filters: `websiteId`, `formId`, pagination, search by field
- POST /leads/collect — public ingestion endpoint for external sites (requires valid websiteId + secretKey)
