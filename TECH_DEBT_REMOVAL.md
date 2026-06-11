# Tech Debt Removal Plan

**Project:** `sobos-billing-station-clone`  
**Status:** Pre-removal audit — verify imports before each deletion  
**Rule:** Never delete until replacement is live and grep confirms zero active imports

---

## Overview

The platform carries **two UI generations**:

1. **Legacy (2019-style admin):** `styles/dashboard.css`, `ResourcePanel`, `SectionPage`, `Sidebar`, card hubs
2. **Modern (partial):** Tailwind, shadcn, `AppShell`, TanStack Query, operational modules

This document lists every item safe to remove **after** the corresponding transformation phase completes.

---

## Removal Phases

| Phase | When | What can be removed |
|-------|------|---------------------|
| After Phase 4 | Menu workspace live | MenuSidebar, menu slug routes, master-grid CSS |
| After Phase 3 | Inventory workflows live | Inventory SectionPage, stub inventory routes |
| After Phase 5 | CRM 360 live | CRM SectionPage, duplicate route |
| After Phase 9 | Settings tabs live | Standalone outlets/users/locations pages |
| After Phase 10 | All pages migrated | dashboard.css, ResourcePanel, SectionPage, dead shells |

---

## 1. Dead Components (Zero Active Imports Today)

These files are **not imported by any active page**. Safe to delete in Phase 10 (or earlier if verified).

### `components/DashboardShell.tsx`

| Field | Value |
|-------|-------|
| **Imports** | `Sidebar`, `DashboardHeader` |
| **Imported by** | **Nothing** (dead) |
| **Last purpose** | Pre-migration layout wrapper |
| **Remove when** | Phase 10 |
| **Verify** | `rg "DashboardShell" --glob '*.{tsx,ts}'` returns only this file |

### `components/Sidebar.tsx`

| Field | Value |
|-------|-------|
| **Imported by** | `DashboardShell.tsx` only |
| **CSS dependency** | `.sidebar`, `.sidebar-brand`, navy `#12263a` theme in `dashboard.css` |
| **Remove when** | Phase 10 (with DashboardShell) |
| **Verify** | `rg "from '@/components/Sidebar'"` returns zero after DashboardShell removed |

### `components/DashboardHeader.tsx`

| Field | Value |
|-------|-------|
| **Imported by** | `DashboardShell.tsx` only |
| **Remove when** | Phase 10 |
| **Verify** | `rg "DashboardHeader"` returns zero |

### `components/AuthGuard.tsx`

| Field | Value |
|-------|-------|
| **Imported by** | **Nothing** — replaced by `PlatformAuthGuard` |
| **Remove when** | Phase 10 |
| **Verify** | `rg "AuthGuard" --glob '*.{tsx,ts}'` excludes `platform-auth-guard` |
| **Note** | Keep `lib/auth.ts` (`checkAuth` used by login page) |

---

## 2. Duplicate Routes

### `app/crm/page.tsx` (OUTSIDE `(platform)` group)

| Field | Value |
|-------|-------|
| **Conflict** | Duplicates `app/(platform)/crm/page.tsx` |
| **Middleware** | Both match `/crm` — Next.js route resolution may be ambiguous |
| **Content** | Identical SectionPage + customers ResourcePanel |
| **Remove when** | Phase 5 (immediately safe — delete duplicate first) |
| **Action** | Delete `app/crm/page.tsx`; keep `(platform)/crm` only |
| **Verify** | Navigate to `/crm` — should render platform CRM page |

---

## 3. Legacy CSS

### `styles/dashboard.css` (~1,164 lines)

| Field | Value |
|-------|-------|
| **Imported by** | `app/layout.tsx` (global) |
| **Classes still in use** | See table below |
| **Remove when** | Phase 10 — after all consuming pages migrated |

**Active class consumers (as of audit):**

| Class / pattern | Used by |
|-----------------|---------|
| `.legacy-dashboard`, `.dashboard-body` | SectionPage, outlets, reports, settings, menu layout |
| `.data-panel`, `.data-panel-toolbar`, `.data-panel-title`, `.data-panel-card` | ResourcePanel |
| `.data-table`, `.data-table-head`, `.data-table-body`, `.data-table-row` | ResourcePanel, reports page |
| `.cols-*` (inventory, customers, items, etc.) | ResourcePanel column layouts |
| `.btn-new`, `.btn-export`, `.btn-primary` | ResourcePanel, outlets, settings |
| `.stat-grid`, `.stat-card`, `.chart-card`, `.bar-chart` | reports page |
| `.master-grid`, `.master-card`, `.menu-sidebar*` | menu pages |
| `.settings-card`, `.settings-form`, `.form-input`, `.modal-*` | settings, FormModal, outlets |
| `.status-pill`, `.loading-state`, `.loading-spinner` | ResourcePanel, reports, outlets |
| `.content-heading`, `.content-heading-row` | outlets |
| `.sidebar*` | Sidebar.tsx only (dead) |

**Removal steps:**
1. Migrate each page off legacy classes
2. Remove `@import '@/styles/dashboard.css'` from `app/layout.tsx`
3. Delete `styles/dashboard.css`
4. Run build + visual smoke test on all routes

### `styles/login.css`

| Field | Value |
|-------|-------|
| **Imported by** | `app/layout.tsx` |
| **Used by** | `/`, `/otp` |
| **Remove when** | Optional — restyle login with design tokens (low priority) |
| **Action** | Keep until login redesign; not blocking transformation |

---

## 4. Components to Replace (Not Delete Until Replacement Exists)

### `components/SectionPage.tsx`

| Field | Value |
|-------|-------|
| **Imported by** | inventory, crm (×2 routes), users, locations pages |
| **Replacement** | `WorkspaceLayout` + `DataGrid` |
| **Remove when** | Phases 3, 5, 9 complete |

### `components/menu/ResourcePanel.tsx`

| Field | Value |
|-------|-------|
| **Imported by** | SectionPage, MenuMasterContent |
| **Replacement** | `DataGrid` + `ContextPanel` for master data |
| **Remove when** | Phases 3, 4, 5, 9, 10 complete |
| **Preserve types** | Move `PanelConfig`, `ColumnDef`, `Row` types to `lib/types/data-grid.ts` before deletion |

### `components/menu/MenuMasterContent.tsx`

| Field | Value |
|-------|-------|
| **Imported by** | `app/(platform)/menu/[slug]/page.tsx` |
| **Replacement** | Menu workspace BUILD views |
| **Remove when** | Phase 4 complete |

### `components/MenuSidebar.tsx`

| Field | Value |
|-------|-------|
| **Imported by** | menu page, menu/[slug] page |
| **Replacement** | `SectionSidebar` with menu workflow groups |
| **Remove when** | Phase 4 complete |

### `components/ManageLink.tsx`

| Field | Value |
|-------|-------|
| **Imported by** | menu page (card footer), outlets page |
| **Replacement** | Standard `Button` + Link in WorkspaceLayout actions |
| **Remove when** | Phase 4 + Phase 9 |

### `components/menu/MenuTableParts.tsx`

| Field | Value |
|-------|-------|
| **Imported by** | ResourcePanel only |
| **Replacement** | DataGrid internals |
| **Remove when** | ResourcePanel deleted |

### `components/menu/FormModal.tsx`

| Field | Value |
|-------|-------|
| **Imported by** | ResourcePanel, outlets page |
| **Replacement** | shadcn `Dialog` + form patterns; ContextPanel for inline edit |
| **Remove when** | ResourcePanel + outlets migrated |
| **Note** | `ConfirmModal` may remain as thin wrapper over shadcn Dialog |

### `components/layout/stub-page.tsx`

| Field | Value |
|-------|-------|
| **Imported by** | 6 stub routes (inventory×3, crm×2, reports×2) |
| **Remove when** | Each stub replaced by real workflow page |
| **Do not bulk delete** | Remove one at a time as workflows ship |

---

## 5. Navigation Systems to Replace

### `components/layout/app-sidebar.tsx`

| Field | Value |
|-------|-------|
| **Status** | Active — all AppShell pages |
| **Replacement** | `PrimaryRail` + `SectionSidebar` |
| **Remove when** | Phase 1 complete and all pages use new shell |
| **Do not delete** until `AppShell` refactored to use new components |

### `lib/navigation.ts` — `NAV_GROUPS`

| Field | Value |
|-------|-------|
| **Imported by** | `app-sidebar.tsx`, `command-palette.tsx` |
| **Replacement** | `lib/workflow-nav.ts` with `RAIL_ITEMS` + `SECTION_NAV` |
| **Remove when** | Phase 1 — replace in place, then delete old structure |
| **Preserve** | `COMMAND_PAGES` concept for ⌘K palette (update to workflow routes) |

---

## 6. Layout Anti-Patterns to Fix

### Per-page AppShell mounting

| Problem | Every page wraps its own `AppShell` → sidebar remounts, state lost |
| Fix | Move shell to `(platform)/layout.tsx` in Phase 1 |
| Files affected | All 20+ platform pages |

### `app/(platform)/menu/layout.tsx`

| Problem | Injects legacy `legacy-dashboard dashboard-body` wrapper |
| Remove when | Phase 4 — delete file when menu workspace replaces slug routes |

---

## 7. Unused / Underused Backend

Not UI debt, but note for cleanup after UI ships:

| Item | Status |
|------|--------|
| `GET /api/audit` | No UI — wire to Command Center alerts or defer |
| `stock_movements` table | Schema only until Phase 3 APIs |
| `purchase_orders` table | Schema only until Phase 3 |
| `recipes`, `recipe_ingredients` | Schema only until Phase 3 |
| `loyalty_points` | Schema only until Phase 5 |
| `lib/menu-data.ts` seed arrays | Keep — used by `lib/seed.ts` for demo data |

---

## 8. Pre-Deletion Verification Checklist

Run before **every** deletion batch:

```bash
# 1. Confirm zero imports
rg "ComponentName" --glob '*.{tsx,ts}' 

# 2. Confirm zero CSS class usage (for dashboard.css classes)
rg "class-name" --glob '*.{tsx,ts,css}'

# 3. Build passes
npm run build

# 4. Smoke routes (manual or E2E)
# /dashboard /billing /orders /kds /tables
# /inventory/receive (after Phase 3)
# /menu (after Phase 4)
# /crm /settings
```

---

## 9. Recommended Deletion Order

### Batch A — Immediate (Phase 5 start)
- [ ] Delete `app/crm/page.tsx` (duplicate)

### Batch B — After Phase 4 (Menu)
- [ ] Delete `app/(platform)/menu/[slug]/` directory (after redirects)
- [ ] Delete `components/MenuSidebar.tsx`
- [ ] Delete `components/menu/MenuMasterContent.tsx`
- [ ] Delete `app/(platform)/menu/layout.tsx`

### Batch C — After Phase 3 (Inventory)
- [ ] Delete inventory stub pages (movements, purchase-orders, vendors stubs — replaced by real pages)
- [ ] Repoint `/inventory` index away from SectionPage

### Batch D — After Phase 9 (Settings)
- [ ] Delete standalone `outlets/page.tsx`, `users/page.tsx`, `locations/page.tsx` (merged into settings tabs)

### Batch E — Phase 10 Final
- [ ] Delete `components/DashboardShell.tsx`
- [ ] Delete `components/Sidebar.tsx`
- [ ] Delete `components/DashboardHeader.tsx`
- [ ] Delete `components/AuthGuard.tsx`
- [ ] Delete `components/SectionPage.tsx`
- [ ] Delete `components/menu/ResourcePanel.tsx`
- [ ] Delete `components/menu/MenuTableParts.tsx`
- [ ] Delete `components/ManageLink.tsx`
- [ ] Delete `components/layout/stub-page.tsx` (if no stubs remain)
- [ ] Delete `components/layout/app-sidebar.tsx` (replaced by PrimaryRail)
- [ ] Remove `@import '@/styles/dashboard.css'` from `app/layout.tsx`
- [ ] Delete `styles/dashboard.css`

---

## 10. Files to Keep (Do Not Delete)

| File | Reason |
|------|--------|
| `lib/menu-data.ts` | Seed data for SQLite demo |
| `lib/resources.ts` | Generic CRUD API config |
| `lib/api-client.ts` | Extend, don't replace |
| `components/menu/FormModal.tsx` | Until outlets + ResourcePanel migrated |
| `components/layout/app-shell.tsx` | Refactor in place → becomes new shell |
| `components/layout/command-palette.tsx` | Keep; update route list |
| `components/layout/outlet-switcher.tsx` | Keep; move to rail or header |
| `styles/login.css` | Login pages still use it |

---

## 11. Import Dependency Graph (Legacy)

```
app/layout.tsx
  └── styles/dashboard.css (GLOBAL)

SectionPage
  ├── AppShell
  │     └── AppSidebar → lib/navigation.ts
  └── ResourcePanel
        ├── MenuTableParts
        ├── FormModal
        └── dashboard.css classes

Menu [slug]
  ├── AppShell
  ├── MenuSidebar → lib/menu-data.ts (MENU_MASTERS)
  └── MenuMasterContent → ResourcePanel

DashboardShell (DEAD)
  ├── Sidebar (DEAD)
  └── DashboardHeader (DEAD)
```

Target graph:

```
(platform)/layout.tsx
  ├── PrimaryRail → lib/workflow-nav.ts
  ├── SectionSidebar → lib/workflow-nav.ts (per domain)
  └── WorkspaceLayout
        ├── PageHeader / FilterBar / ActionToolbar
        ├── WorkspaceContent
        │     ├── Operational workflows (forms, kanban, floor plan)
        │     └── DataGrid (secondary master data)
        └── ContextPanel
```

---

*Verify imports before every deletion. When in doubt, deprecate with a re-export rather than delete.*
