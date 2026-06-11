# Sobos Billing Station — Platform Transformation Plan

**Version:** 1.0  
**Date:** 2026-06-11  
**Status:** Audit complete — no implementation started  
**Constraint:** Preserve all existing APIs, SQLite schema, auth, RBAC, and business logic

---

## Executive Summary

The platform is a **Next.js 15 App Router** application with **SQLite** backend, **HMAC session auth**, **generic CRUD APIs** (`/api/[resource]`), and **operational APIs** (orders, tables, KDS, billing, held orders, reports). The UI is split between:

- **Modern operational modules** (Billing, KDS, partial Tables/Orders/Dashboard) using Tailwind, shadcn, TanStack Query, Zustand, Framer Motion
- **Legacy CRUD modules** (Inventory, Menu, CRM, Users, Locations, Settings, Reports, Outlets) using `ResourcePanel`, `SectionPage`, and `styles/dashboard.css`

**Diagnosis:** The application behaves as **Restaurant Database Software**. Navigation exposes entities (Inventory Items, Categories, Customers). Operators navigate → open table → edit record → save.

**Target:** **Restaurant Operations Operating System**. Operators open platform → see status instantly → complete tasks → advance workflows.

This document is the complete pre-implementation audit. **No code changes until this plan is approved.**

---

## Product Vision

| Dimension | Current | Target |
|-----------|---------|--------|
| Mental model | Database → Tables → Records | Restaurant → Workflows → Tasks → Records |
| Primary nav | 22 entity routes in one sidebar | 10 icon rail domains + contextual section nav |
| Default screens | CRUD tables | Workflow entry points |
| Inventory landing | Inventory Items table | Receive Stock |
| Menu landing | Master card hub / Categories | Availability |
| Orders landing | Searchable order table | Live Operations kanban |
| Dashboard | Passive metric widgets | Command Center with action triggers |
| CRM | Customer CRUD table | Customer Operations + 360 panel |
| Reports | Sales stat grid (duplicate) | Business Health with drill-down |

---

## Current Architecture Snapshot

### Layout System

```
AppShell (per page, remounts on navigation)
├── AppSidebar (260px ↔ 72px, 6 groups, 22 items)
├── AppHeader (title, breadcrumb, search → CommandPalette)
└── Page content (varies)
```

**Key files:**
- `components/layout/app-shell.tsx`
- `components/layout/app-sidebar.tsx`
- `components/layout/app-header.tsx`
- `lib/navigation.ts`
- `(platform)/layout.tsx` — auth guard only; **does not mount shell**

### Data Layer

| Layer | Location | Purpose |
|-------|----------|---------|
| Schema | `lib/db.ts` (SCHEMA_VERSION 3) | SQLite tables |
| CRUD config | `lib/resources.ts` | 12 generic resources |
| Repositories | `lib/repositories/` | orders, tables, kds, billing |
| Services | `lib/services/` | order, table, kds, billing |
| API client | `lib/api-client.ts` | All frontend fetch wrappers |
| State | `lib/stores/cart-store.ts`, `outlet-store.ts` | Zustand (persisted) |
| Auth | `middleware.ts`, `lib/session*.ts`, `lib/auth/rbac.ts` | HMAC cookie + role permissions |

### API Inventory

| Endpoint | Used by | Status |
|----------|---------|--------|
| `GET/POST /api/[resource]` | ResourcePanel pages | Active |
| `PUT/DELETE /api/[resource]/[id]` | ResourcePanel | Active |
| `POST /api/[resource]/[id]/clone` | Menu items | Active |
| `POST /api/orders` | Billing | Active |
| `GET /api/orders`, `GET/PATCH /api/orders/[id]/*` | Orders | Active |
| `GET/PATCH /api/tables`, sessions | Tables, Billing | Active |
| `GET /api/kds/feed`, `POST /api/kds/bump` | KDS | Active |
| `GET/POST/DELETE /api/held-orders` | Billing (hold only) | Partial |
| `GET /api/reports/summary` | Dashboard, Reports | Active |
| `GET/PUT /api/settings` | Settings, Billing | Active |
| `GET /api/audit` | None | Unused in UI |
| `stock_movements`, `purchase_orders`, `recipes`, `loyalty_points` tables | None | Schema only |

---

## Target Architecture

### Shell (Phase 1)

```
┌────┬──────────────┬────────────────────────────────────────────┐
│Rail│ SectionSidebar│ WorkspaceLayout                           │
│64px│ 240px        │ PageHeader → FilterBar → ActionToolbar     │
│    │ (contextual) │ → WorkspaceContent → ContextPanel (320px)  │
└────┴──────────────┴────────────────────────────────────────────┘
```

**New components to build:**

| Component | Purpose |
|-----------|---------|
| `PrimaryRail` | 64px icon-only domain switcher |
| `SectionSidebar` | 240px workflow groups per domain |
| `WorkspaceLayout` | Standard page scaffold |
| `PageHeader` | Title, subtitle, primary actions |
| `FilterBar` | Persistent filters |
| `ActionToolbar` | Task-mode actions |
| `ContextPanel` | 320px right panel for detail |
| `DataGrid` | Replaces ResourcePanel for secondary master data |

**Shell mounts once** at `(platform)/layout.tsx`. KDS remains fullscreen exception.

### Primary Rail (10 icons)

Dashboard · Billing · Tables · Kitchen · Orders · Inventory · Menu · CRM · Reports · Settings

### Design Tokens (target)

| Token | Value |
|-------|-------|
| Background | `#f8fafc` |
| Panels | `#ffffff` |
| Border | `#e5e7eb` (1px) |
| Text | `#111827` |
| Muted | `#6b7280` |
| Radius | `12px` |
| Shadow | Minimal |

Update `app/globals.css`; remove dependency on `styles/dashboard.css`.

### Motion Standards

| Interaction | Spec |
|-------------|------|
| Page transition | 200ms fade |
| Panel | 200ms |
| Sidebar | Spring |
| ContextPanel | Slide from right |
| Lists | Stagger |
| Async views | Skeleton loaders |

---

## Per-Page Audit

Each entry: route, components, APIs, state, UX pattern, operational purpose, problems, refactor strategy.

---

### Auth Pages (out of transformation scope)

#### `/` — Login

| Field | Detail |
|-------|--------|
| **Route** | `app/page.tsx` |
| **Components** | Inline form, `styles/login.css` |
| **APIs** | `apiLogin`, `checkAuth` |
| **State** | Local `useState` |
| **UX pattern** | Marketing-style login form |
| **Operational purpose** | Authenticate operator |
| **Problems** | None critical |
| **Refactor** | Apply design tokens only; no workflow change |

#### `/otp` — OTP Login

| Field | Detail |
|-------|--------|
| **Route** | `app/otp/page.tsx` |
| **Components** | Inline form, `styles/login.css` |
| **APIs** | `apiSendOtp`, `apiVerifyOtp` |
| **State** | Local `useState` |
| **UX pattern** | Two-step OTP |
| **Operational purpose** | Alternate auth |
| **Problems** | None critical |
| **Refactor** | Token alignment only |

---

### Operations Domain

#### `/dashboard` — Dashboard

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/dashboard/page.tsx` |
| **Components** | `AppShell`, shadcn `Card`, Recharts `BarChart`, Framer Motion |
| **APIs** | `apiReportSummary` (30s poll) |
| **State** | TanStack Query |
| **UX pattern** | Passive metric grid + charts + recent orders list |
| **Operational purpose** | Executive overview (intended) |
| **Problems** | 14-day revenue not today; widgets non-clickable; duplicates Reports; no attention queue; kitchen/table signals passive |
| **Refactor** | **Command Center**: action tiles (revenue today, open orders, delayed, kitchen backlog, occupied tables, low stock, alerts). Every tile links to workflow. Reuse `apiReportSummary` + order queries. |

#### `/billing` — POS

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/billing/page.tsx` → `billing-client.tsx` |
| **Components** | `AppShell` (fullWidth), category sidebar, product grid, cart panel |
| **APIs** | `apiList('items')`, `apiList('categories')`, `apiGetSettings`, `apiCreateOrder`, `apiSaveHeldOrder` |
| **State** | `useCartStore` (Zustand persist), `useOutletStore`, TanStack Query, URL searchParams for table |
| **UX pattern** | Cart-first POS (3-pane inside AppShell) |
| **Operational purpose** | Take orders, hold, pay |
| **Problems** | No ActionToolbar; cart-first not action-first; missing modify/split/transfer/KOT/resume held; AppSidebar consumes ~320px horizontal space |
| **Refactor** | **Phase 8**: ActionToolbar (Take/Modify/Transfer/Split/Discount/KOT/Hold/Resume/Close). Rail-only chrome variant. Wire `apiListHeldOrders`, `apiDeleteHeldOrder`. Keep order APIs unchanged. |

#### `/orders` — Order Management

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/orders/page.tsx` |
| **Components** | `AppShell`, filter chips, CSS grid table, shadcn `Sheet` detail |
| **APIs** | `apiListOrders`, `apiGetOrder`, `apiUpdateOrderStatus` |
| **State** | TanStack Query + local filter/search/selectedId |
| **UX pattern** | Table-first CRUD browse + detail drawer |
| **Operational purpose** | Monitor and advance orders (intended) |
| **Problems** | Detail-first; not live board; no Delayed column; no inline bump; duplicates KDS mental model in wrong shape |
| **Refactor** | **Phase 2**: Live Operations Center kanban (New/Preparing/Ready/Served/Delayed). Inline status actions. ContextPanel for timeline. Secondary tab "All Orders" uses DataGrid. Reuse existing status API + state machine. |

#### `/kds` — Kitchen Display

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/kds/page.tsx` |
| **Components** | Standalone fullscreen (no AppShell), 3-column kanban, Framer Motion |
| **APIs** | `apiKdsFeed('Kitchen')`, `apiKdsBump` (3s poll) |
| **State** | TanStack Query, `useRef` for sound |
| **UX pattern** | Operational kanban — **correct pattern** |
| **Operational purpose** | Kitchen bump workflow |
| **Problems** | Hardcoded station; no zone selector; no sound prefs; no threshold config |
| **Refactor** | Enhance in place: station selector from `stations` table, timer threshold settings, touch sizing. Keep polling. Fullscreen exception preserved. |

#### `/tables` — Floor Plan

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/tables/page.tsx` |
| **Components** | `AppShell`, section-grouped card grid, Framer Motion |
| **APIs** | `apiListTables`, `apiOpenTableSession`, `apiCloseSession` |
| **State** | TanStack Query, `useOutletStore`, router navigation |
| **UX pattern** | Card gallery by section (not spatial floor plan) |
| **Operational purpose** | Open sessions, route to billing |
| **Problems** | Ignores `posX/posY`; no drag (PATCH API exists); no transfer/merge; no ContextPanel for session detail |
| **Refactor** | **Phase 7**: Interactive floor plan canvas, drag via `PATCH /api/tables`, ContextPanel for session, quick actions (transfer, merge, close). Reuse session APIs. |

---

### Inventory Domain

#### `/inventory` — Inventory Items (PRIMARY TODAY — WRONG)

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/inventory/page.tsx` |
| **Components** | `SectionPage` → `ResourcePanel` |
| **APIs** | `apiList/Create/Update/Delete('inventory')` |
| **State** | ResourcePanel local state (useState, useEffect) |
| **UX pattern** | CRUD data table |
| **Operational purpose** | Track stock levels (intended) |
| **Problems** | Entity-first not workflow-first; should be secondary Settings screen |
| **Refactor** | Demote to **Settings → Inventory Items**. Default inventory route becomes **Receive Stock**. |

#### `/inventory/movements` — Stock Movement

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/inventory/movements/page.tsx` |
| **Components** | `StubPage` |
| **APIs** | None |
| **State** | None |
| **UX pattern** | Placeholder card |
| **Operational purpose** | Should be transfer/adjustment history |
| **Problems** | Unbuilt |
| **Refactor** | **Phase 3**: Movement log view + link to workflow forms. Read from `stock_movements` via new thin API. |

#### `/inventory/purchase-orders` — Purchase Orders

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/inventory/purchase-orders/page.tsx` |
| **Components** | `StubPage` |
| **APIs** | None (`purchase_orders` table exists) |
| **State** | None |
| **UX pattern** | Placeholder |
| **Operational purpose** | Create/manage POs |
| **Problems** | Unbuilt |
| **Refactor** | **Phase 3**: PO workflow UI wrapping `purchase_orders` table. |

#### `/inventory/vendors` — Vendors

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/inventory/vendors/page.tsx` |
| **Components** | `StubPage` |
| **APIs** | `vendors` in `RESOURCES` but page doesn't call it |
| **State** | None |
| **UX pattern** | Placeholder |
| **Operational purpose** | Vendor master (secondary) |
| **Problems** | API exists, UI stub |
| **Refactor** | **Phase 3**: DataGrid under PROCUREMENT group. Uses existing `/api/vendors`. |

**New inventory routes (Phase 3):**

| Route | Workflow | New API (additive) |
|-------|----------|-------------------|
| `/inventory/receive` | Receive Stock | `POST /api/inventory/workflows/receive` |
| `/inventory/transfer` | Transfer Stock | `POST /api/inventory/workflows/transfer` |
| `/inventory/return` | Return Stock | `POST /api/inventory/workflows/return` |
| `/inventory/adjust` | Adjust Stock | `POST /api/inventory/workflows/adjust` |
| `/inventory/grn` | GRN | `POST /api/inventory/workflows/grn` |
| `/inventory/recipes` | Recipes | `GET/POST /api/recipes` (wrap existing tables) |
| `/inventory/consumption` | Consumption | Service layer on order completion |
| `/inventory/health` | Stock Health | `GET /api/inventory/health` |
| `/inventory/low-stock` | Low Stock | Reuse summary + inventory query |

All workflow APIs write to `stock_movements` + update `inventory.quantity`. Generic CRUD preserved.

---

### Menu Domain

#### `/menu` — Menu Master Hub

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/menu/page.tsx` |
| **Components** | `AppShell`, `MenuSidebar`, `master-grid` cards, `ManageLink` |
| **APIs** | None (navigation only) |
| **State** | None |
| **UX pattern** | Card hub linking to entity routes |
| **Operational purpose** | Navigate menu masters |
| **Problems** | Triple nav (AppSidebar + MenuSidebar + routes); entity-first |
| **Refactor** | Replace with single **Menu Workspace**. Default view: **Availability**. Remove hub as landing. |

#### `/menu/[slug]` × 7 — Menu Masters

| Slug | Resource | Components |
|------|----------|------------|
| `super-categories` | `super-categories` | `MenuMasterContent` → `ResourcePanel` |
| `categories` | `categories` | Same |
| `sub-categories` | `sub-categories` | Same |
| `items` | `items` | Same (+ clone, export) |
| `addons` | `addons` | Same |
| `variants` | `variants` | Same |
| `submenu` | `submenu` | Same |

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/menu/[slug]/page.tsx` |
| **Components** | `AppShell`, `MenuSidebar`, `MenuMasterContent`, `menu/layout.tsx` legacy wrapper |
| **APIs** | Generic CRUD per resource |
| **State** | ResourcePanel local state |
| **UX pattern** | Full-page route per entity + CRUD table |
| **Operational purpose** | Manage menu structure |
| **Problems** | Route-per-entity; no 3-panel workspace; no availability/performance views |
| **Refactor** | **Phase 4**: Single `/menu` workspace with client state (`?view=availability|build|optimize`). 3-panel: Structure \| Items \| Properties. Redirect slugs for bookmark compat. BUILD group uses DataGrid internally. |

**Target section nav:**

```
OPERATE: Availability, Scheduling, Outlet Mapping
BUILD: Categories, Products, Modifiers
OPTIMIZE: Popular Items, Performance, Menu Engineering
```

---

### CRM Domain

#### `/crm` — Customers

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/crm/page.tsx` AND duplicate `app/crm/page.tsx` |
| **Components** | `SectionPage` → `ResourcePanel` |
| **APIs** | `apiList/Create/Update/Delete('customers')` |
| **State** | ResourcePanel local |
| **UX pattern** | Customer CRUD table |
| **Operational purpose** | Customer management |
| **Problems** | Duplicate route; manual visits/spend; no 360 view; CRM **is** the table |
| **Refactor** | **Phase 5**: Customer Operations workspace. List + ContextPanel (profile, orders, loyalty, feedback). Compute metrics from orders. Remove duplicate route. |

#### `/crm/loyalty` — Loyalty

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/crm/loyalty/page.tsx` |
| **Components** | `StubPage` |
| **APIs** | None (`loyalty_points` table exists) |
| **Refactor** | **Phase 5**: Award/redeem workflow using `loyalty_points` |

#### `/crm/feedback` — Feedback

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/crm/feedback/page.tsx` |
| **Components** | `StubPage` |
| **Refactor** | **Phase 5**: Feedback capture + triage under INSIGHTS group |

---

### Reports Domain

#### `/reports` — Sales Reports

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/reports/page.tsx` |
| **Components** | `AppShell`, legacy `stat-grid`, CSS bar charts, `data-table` |
| **APIs** | `apiReportSummary` |
| **State** | Local useState |
| **UX pattern** | Passive reporting dashboard (duplicate of `/dashboard`) |
| **Operational purpose** | Sales analytics |
| **Problems** | Legacy CSS; duplicates dashboard; no drill-down; not "business health" |
| **Refactor** | **Phase 6**: Replace with **Business Health** (Revenue, Margin, Waste, Inventory Health, Kitchen Efficiency, Customer Retention). Each metric drill-down to workflow. |

#### `/reports/inventory`, `/reports/finance`

| Field | Detail |
|-------|--------|
| **Components** | `StubPage` |
| **Refactor** | Fold into Business Health sections; remove standalone stubs |

---

### Administration Domain (move under Settings)

#### `/outlets` — Outlets

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/outlets/page.tsx` |
| **Components** | `AppShell`, legacy card grid, `FormModal`, `ConfirmModal` |
| **APIs** | `apiList/Create/Update/Delete('outlets')` |
| **State** | Local useState |
| **UX pattern** | Card grid CRUD |
| **Refactor** | **Phase 9**: Settings tab "Outlets". DataGrid. |

#### `/users` — Users

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/users/page.tsx` |
| **Components** | `SectionPage` → `ResourcePanel` (resource: `staff`) |
| **APIs** | Generic CRUD on `staff` |
| **Refactor** | **Phase 9**: Settings → Users & Roles tab |

#### `/locations` — Locations

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/locations/page.tsx` |
| **Components** | `SectionPage` → `ResourcePanel` |
| **Refactor** | **Phase 9**: Settings → Locations tab |

#### `/settings` — Restaurant Settings

| Field | Detail |
|-------|--------|
| **Route** | `app/(platform)/settings/page.tsx` |
| **Components** | `AppShell`, legacy form |
| **APIs** | `apiGetSettings`, `apiSaveSettings` |
| **Refactor** | **Phase 9**: Tabbed settings (Restaurant, Billing, Taxes, Printers, Users, Roles, Integrations, Outlets, Locations) |

---

### Redirect

#### `/` (platform root)

| Route | `app/(platform)/page.tsx` → redirects to `/dashboard` |

---

## Screen Classification Summary

| Classification | Count | Pages |
|----------------|-------|-------|
| **Operational (working)** | 3 | Billing (partial), KDS, Tables (partial) |
| **Operational (needs rebuild)** | 4 | Dashboard, Orders, Inventory workflows, Menu operate views |
| **Data Management (keep secondary)** | 11 | Inventory items, 7 menu masters, Users, Locations, Vendors |
| **Stub / unbuilt** | 6 | inventory×3, crm×2, reports×2 |
| **Admin (demote to Settings)** | 3 | Outlets, Users, Locations, Settings |
| **Auth** | 2 | Login, OTP |

---

## New Workflow APIs (Additive Only)

These wrap existing tables. **Do not modify** generic `/api/[resource]` handlers.

```
POST /api/inventory/workflows/receive
POST /api/inventory/workflows/transfer
POST /api/inventory/workflows/return
POST /api/inventory/workflows/adjust
POST /api/inventory/workflows/grn
GET  /api/inventory/health
GET  /api/inventory/movements
GET  /api/recipes
POST /api/recipes
GET  /api/customers/[id]/360        → profile + orders + loyalty + feedback
POST /api/loyalty/award
POST /api/loyalty/redeem
GET  /api/reports/business-health   → extends summary with SLA, retention, waste
```

RBAC: apply `requirePermission` consistent with existing patterns.

---

## ContextPanel Usage Map

| Domain | ContextPanel content |
|--------|---------------------|
| Orders | Order timeline, items, inline status actions |
| Tables | Session detail, active order, transfer/merge |
| CRM | Customer 360 (profile, orders, loyalty, feedback) |
| Inventory | Item detail, movement history |
| Menu | Product properties (price, tax, availability) |
| Billing | Held orders list, table info |

Never open full page when ContextPanel suffices.

---

## DataGrid Migration Map

Replace `ResourcePanel` on these pages (Phase 10 or when each module migrates):

| Page | Resource | Priority |
|------|----------|----------|
| Inventory Items (Settings) | `inventory` | Phase 3 |
| Vendors | `vendors` | Phase 3 |
| Menu BUILD views | categories, items, addons, variants | Phase 4 |
| CRM customer list | `customers` | Phase 5 |
| Users | `staff` | Phase 9 |
| Locations | `locations` | Phase 9 |
| Outlets | `outlets` | Phase 9 |
| Orders history tab | orders | Phase 2 |

---

## Implementation Phases

### Phase 1 — Foundation Shell
Build: `PrimaryRail`, `SectionSidebar`, `WorkspaceLayout`, `PageHeader`, `FilterBar`, `ActionToolbar`, `ContextPanel`, design tokens. Mount shell at `(platform)/layout.tsx`. Define `lib/workflow-nav.ts`.

### Phase 2 — Orders Live Operations Center
Kanban board; inline status; ContextPanel; secondary All Orders DataGrid.

### Phase 3 — Inventory Workflows
Receive Stock default; workflow APIs; section nav groups; demote Items to Settings.

### Phase 4 — Menu Workspace
Availability default; 3-panel workspace; redirect slug routes.

### Phase 5 — CRM Customer 360
Customer operations; computed metrics; loyalty; remove duplicate route.

### Phase 6 — Business Health
Replace reports; drill-down metrics; remove dashboard duplication.

### Phase 7 — Tables Floor Plan
Canvas + drag + ContextPanel + transfer/merge.

### Phase 8 — Billing Enhancements
ActionToolbar; resume held; transfer table; split/modify UI.

### Phase 9 — Settings Consolidation
Tabbed settings; move Outlets/Users/Locations under Settings rail domain.

### Phase 10 — Legacy Cleanup
See `TECH_DEBT_REMOVAL.md`.

---

## Success Criteria

- [ ] Operator understands restaurant status in **under 10 seconds** on Command Center
- [ ] Primary nav exposes **workflows**, not entities
- [ ] Inventory default = **Receive Stock**
- [ ] Menu default = **Availability**
- [ ] Orders default = **Live Operations kanban**
- [ ] CRM default = **Customer Operations** (not raw table)
- [ ] Dashboard = **Command Center** with action triggers only
- [ ] All existing APIs remain functional
- [ ] No functionality lost (CRUD accessible via Settings/secondary views)
- [ ] Application feels like Restaurant OS, not CRUD admin panel

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Breaking CRUD flows | Keep generic APIs; DataGrid uses same endpoints |
| Route bookmark breakage | Redirect old routes (`/inventory` → `/inventory/receive`, `/menu/items` → `/menu?view=products`) |
| Shell remount performance | Single shell in layout |
| Parallel legacy + new UI | Feature-flag or route-level migration per phase |
| RBAC gaps on new endpoints | Mirror `lib/auth/rbac.ts` patterns |

---

## File Creation Map (Implementation)

```
components/layout/
  primary-rail.tsx
  section-sidebar.tsx
  workspace-layout.tsx
  page-header.tsx
  filter-bar.tsx
  action-toolbar.tsx
  context-panel.tsx
components/data/
  data-grid.tsx
lib/
  workflow-nav.ts
  design-tokens.ts
app/api/inventory/workflows/
  receive/route.ts
  transfer/route.ts
  ...
```

---

*End of Platform Transformation Plan*
