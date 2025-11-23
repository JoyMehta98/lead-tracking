## Leads Tracking Frontend (Project Docs)

### What this app does

- Admin dashboard to manage websites and view leads collected from forms on those websites.
- Shows detected forms per website and displays leads per form in a drawer with pagination.
- Connects to the backend API for authentication and data via `VITE_API_BASE_URL`.

### System requirements

- Node.js 18+
- pnpm 8+

### Environment variables (.env)

- VITE_API_BASE_URL (default: http://localhost:3001/api/v1)

Example .env

```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

### Setup

```bash
pnpm install
```

### Run

```bash
pnpm run dev
```

Build for production

```bash
pnpm run build && pnpm run preview
```

---
