# shobox Billing Station

Next.js 15 (App Router) admin UI, now backed by a local **SQLite** database via
API route handlers. No external services — the database is a single file at
`data/shobox.db`, created and seeded automatically on first run.

## Run it

```bash
npm install      # installs better-sqlite3 (prebuilt binary on most platforms)
npm run dev      # http://localhost:3000
```

The first request creates `data/shobox.db` and seeds it with the original menu
data (categories, items, addons, variants, etc.). Delete that file to reset.

## Auth (demo)

Login accepts **any email + any non-empty password** (as requested). A real
session is issued as an httpOnly cookie, and protected pages (`/outlets`,
`/menu/*`) are guarded by `middleware.ts`.

- **Email/password** — `/`
- **OTP** — `/otp`. Since there's no mail server locally, the generated 6-digit
  code is returned by the API and shown on screen.
- **Log out** — via the avatar menu in the dashboard header.

## What's wired to the backend

Every menu master and the outlets list now reads/writes SQLite with full
Create / Edit / Delete (and Clone for Items):

| Page | Resource | API |
|------|----------|-----|
| Outlets | `outlets` | `/api/outlets` |
| Super Categories | `super-categories` | `/api/super-categories` |
| Categories | `categories` | `/api/categories` |
| Sub-Categories | `sub-categories` | `/api/sub-categories` |
| Items | `items` | `/api/items` (+ `/[id]/clone`) |
| Addons | `addons` | `/api/addons` |
| Variants | `variants` | `/api/variants` |
| Submenu | `submenu` | `/api/submenu` |
| Inventory | `inventory` | `/api/inventory` (low-stock flagging) |
| CRM | `customers` | `/api/customers` |
| Locations | `locations` | `/api/locations` |
| Users | `staff` | `/api/staff` |

Plus two non-CRUD sections:

- **Reports** — `/reports` reads `GET /api/reports/summary`, which aggregates a
  seeded **Orders** table (~60 sample orders over 14 days): total sales, order
  count, average order value, items sold, a 14-day sales bar chart, top-selling
  items, low-stock count, and recent orders. Charts are dependency-free (CSS/SVG).
- **Settings** — `/settings` reads/writes restaurant settings via
  `GET`/`PUT /api/settings` (stored as key/value rows).

Every sidebar entry now routes to a working page; navigation highlights the
active section, and all six previously-dead links are live.

Each resource supports:

- `GET /api/<resource>?q=<search>` — list (server-side search)
- `POST /api/<resource>` — create
- `PUT /api/<resource>/<id>` — update
- `DELETE /api/<resource>/<id>` — delete
- `POST /api/<resource>/<id>/clone` — clone (items)

Search, sort, pagination, the New/Edit/Delete/Clone modals, and CSV export
(Items, Addons) all run against live data.

## Architecture

```
lib/db.ts            SQLite connection (singleton), schema migration
lib/seed.ts          One-time seed from the original UI data
lib/resources.ts     Declarative table/field config driving the generic API
lib/crud.ts          Shared list/create/update/delete/clone handlers
lib/session.ts       httpOnly cookie session helpers (server)
lib/session-token.ts Pure token encode/decode (Edge-safe, used by middleware)
lib/api-client.ts    Browser fetch wrapper
app/api/...          Route handlers (auth + generic [resource] CRUD)
middleware.ts        Redirects unauthenticated users away from dashboard pages
```
