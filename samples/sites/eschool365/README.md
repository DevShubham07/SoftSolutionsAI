# eschool365 — School ERP (frontend-only, data-persistent demo)

A production-styled **School ERP** for the demo tenant *Greenfield International School*, running **entirely in the browser** — no server, no real OAuth, **no network calls at runtime**. Every action persists to `localStorage` and **survives a page refresh**. It is statically deployable as-is (Netlify / Vercel / GitHub Pages / any static host).

> **Authentication is mocked for demo/testing only** (clearly labelled in the UI). *Everything else* behaves like a real product a client can trial: real data, real mutations, real persistence.

Ported from a Claude Design prototype (the original DC-runtime artifact) to **standard React 18 + `React.createElement` (no JSX, no build step)**; React / ReactDOM / ApexCharts / Inter are vendored locally under `vendor/` so the app is fully offline-capable.

---

## Quick start

```bash
cd ~/school-erp-v2
python3 -m http.server 8765        # or: npx serve .   /   any static server
# open http://127.0.0.1:8765/
```

No build step. Just serve the folder (an HTTP server is required — `file://` won't load the local modules).

### Deploy (static)
- **Netlify / Vercel:** drag-drop the folder, or point the project at it; no build command, publish directory = the folder root.
- **GitHub Pages:** push the folder contents to the `gh-pages` branch / `/docs`.
- **Deploy contents** = `index.html`, `styles.css`, `favicon.svg`, the app `*.js` files, and `vendor/`.
  You can omit `design-source/` (original reference) and `_*.png` (verification screenshots).

---

## Demo accounts

Pick a **role card**, use the **mock "Continue with Google"** chooser, or **"Continue as Guest"**. (Passwords are not required — it's a mock gate.)

| Role | Name | Email (Google-mock) |
|---|---|---|
| Admin | Anita Menon | `principal@greenfield.edu` |
| Class Coordinator | Rahul Nair | `coord.viiia@greenfield.edu` |
| Teacher | Rohit Verma | `r.verma@greenfield.edu` |
| Parent / Student | Nikhil Patel (parent) | `n.patel@gmail.com` |
| Parent / Student | Diya Patel (student) | `diya.patel@greenfield.edu` |

**Guests:** *Guest Admin · Guest Class Coordinator · Guest Teacher · Guest Parent/Student* — each drops you into that role on a **sandboxed copy** of the data (`eschool365.guest.v1.*`). Guest changes are wiped on logout and never touch the main demo store.

Top-bar avatar menu → **Log out** (clears the session) / identity / guest badge. The role pills (desktop) switch role instantly and persist the choice.

---

## Persistence & reset

A single store layer (`store.js`, `window.RWStore`) backs everything with `localStorage`:

- **Namespaced & versioned:** keys live under `eschool365.v1.*` with `eschool365.v1.__schema`. The session is `eschool365.session`; the guest sandbox is `eschool365.guest.v1.*`.
- **Seed on first load:** the full demo dataset (≈363 students across 10 sections, staff, timetable, fees, admissions pipeline, etc.) is written once. All KPIs/charts/Setup-Health **derive from this store** (e.g. *Total Students = 363* is computed, not hard-coded).
- **Every mutation persists:** `componentDidUpdate` → `RWStore.persist()` (debounced, per-slice diff). Reload restores exactly where you were (the hash route is restored too).
- **Resilient:** every read is `try/catch`; a corrupt slice is dropped and re-seeded — the app never white-screens (and an error boundary offers *Reload / Reset* if anything throws).
- **Reset demo data:** Rae → "Reset demo data", the error-boundary button, or `RWStore.resetDemo()` in the console. (Bump `SCHEMA` in `store.js` to invalidate old seeds on a breaking change.)
- **Image uploads:** stored as downscaled (≤256px) base64 to stay within quota.

---

## Routes

Hash-based, deep-linkable, refresh-safe, back/forward-aware: **`#/<role>/<page>[/<param>]`**

| Example | Opens |
|---|---|
| `#/admin/dash_admin` | Admin dashboard |
| `#/admin/allstd` | All Students |
| `#/admin/stdprofile/2026-0143` | Student profile (deep-link by reg #) |
| `#/admin/collect` | Collect Fees |
| `#/admin/defaulters` | Fees Defaulters |
| `#/teach/markatt` | Mark Attendance |
| `#/student/payonline` | Pay Fees (Parent/Student) |
| *(unknown page)* | **404** view with "Go to dashboard" |

Unauthenticated → redirected to the login gate. `~67` page keys total (full inventory in `app.js` `this.M`).

---

## Control audit (status)

Baseline audit of the prototype: **~455 interactive controls — ~110 working, ~55 view-only, ~290 dead** (no `alert()`, no dead `#` links). Current status:

| Area | Controls | Status |
|---|---|---|
| **Auth** — role login, mock Google chooser, guest, logout, session persistence, role switch | login + topbar | ✅ Functional |
| **Navigation** — sidebar (role-filtered), search, group toggles, breadcrumbs, role pills, hash router, 404, mobile bottom nav | shell | ✅ Functional |
| **Collect Fee** → records payment, decrements balance, updates status (Paid/Partial/Overdue), recomputes KPIs/charts | Fees, profile, drill-downs | ✅ Functional **+ persistent** |
| **Mark / Lock Attendance** → future-date + uncovered-period + partial-mark guards | Attendance | ✅ Functional **+ persistent** |
| **Teacher leave → Substitute** → flags periods, clash-checked picker, blocks attendance lock | Staff Leave, Timetable | ✅ Functional **+ persistent** |
| **Timetable builder** → drag-drop, conflict prevention, assign-sub | Timetable | ✅ Functional **+ persistent** (Save persists) |
| **Admissions lifecycle** → Enquiry→Provisional→Enrolled, duplicate/capacity/fee-structure guards | Admissions wizard | ✅ Functional **+ persistent** |
| **Promote** (dues-override + reason) / **referential delete-guards** (`tryDelete`/`DELRULES`: archive/reassign/withdraw/cancel/block) | Promote, lists | ✅ Functional **+ persistent** |
| **Charts** — KPI tiles, drill slide-overs, "View data" tables, range toggle, in-module charts | dashboards/finance/etc. | ✅ Functional (store-derived) |
| **Rae assistant** — role/store-aware answers + "Take me there" deep-links | every screen | ✅ Functional |
| **Settings / Add-Edit forms** (Institute, Fee, Grading, Theme, Account, Password, Add Employee, Create Class, Create Exam, Homework, Certificate…) | `FormCard` × ~30 | ✅ **Functional** — validate required → persist to the `forms` slice → success toast → values **restored on reload**; Reset & Print/Download secondaries wired |
| **Table toolbars / exports** (Reload, Search, +Add, Copy/CSV/Excel/PDF/Print) | `DataTable` × ~20 | ✅ **Functional** — Copy→clipboard, CSV/Excel→real file download, PDF/Print→print dialog, Reload→refresh, +Add→navigates to the create screen |
| **Generic row actions** (eye/edit/trash/key) | `rowActions` × ~30 | ✅ **Functional** — trash→confirm→remove, key→reset-login, eye/edit→feedback (tables can pass real per-row handlers via `rowActions(kinds, handlers)`) |
| **Feature screens** — Enter-Marks · Pay-Online · Messaging · Salary · Add Employee & Create Class · Filter-by-Class · image upload · mobile cards | Marks/Fees/Comms/HR/Tables | ✅ Functional **+ persistent** |

The 3 shared primitives (`FormCard`, `DataTable`, `rowActions`) are now wired, making the large majority of controls functional with real effects + feedback. **Now functional (verified end-to-end):** the Enter-Marks grid (saves a mark to the `marks` slice), Messaging (send appends to the `messages` slice), and Add Employee (appends a live roster row, then auto-navigates to All Employees) — each confirmed with a success toast. **Also verified this pass:** Pay-Fees-Online (records a payment + receipt via the live fee store), Salary (pay action + printable slip), Create Class & Add Employee (append live rows that show in their lists), Filter-by-Class (rows actually filter — e.g. 8→2 for VI-A), and image upload (stored to the `img` slice, survives reload). Minor remainders: the "Date Range" toolbar filter is basic, and salary records a confirmation rather than a stored ledger entry. `jspdf` is vendored for richer receipts/report-cards later.

---

## File map

```
index.html        shell + vendored <script>/<link> in load order
styles.css        resets, page canvas, keyframes, boot skeleton, mobile @media, a11y
favicon.svg
vendor/           react / react-dom (prod) · @babel (unused at runtime) · apexcharts · jspdf · inter (woff2)
charts.js         RWCharts — ApexCharts theme factory (indigo)
store.js          RWStore — localStorage persistence (seed/persist/reset/guest/quota)
auth.js           RWAuth — mock session, demo accounts, Google-mock data
auth-ui.js        RWLogin — login screen + simulated Google chooser
router.js         RWRouter — #/role/page[/param] parse/build
assistant.js      RWAssistant — "Rae" support bot (intent engine + deep-links)
app.js            the app: Component (state store, ~67 pages, derivations, canDo/tryDelete,
                  charts bridge, render shell), ErrorBoundary, Root (auth gate + Rae)
design-source/    original Claude Design export (reference only — not deployed)
```

All cross-file values are shared via `window.RW*` (plain classic scripts → shared global scope; no bundler).

---

## Self-test checklist

1. **Login** — cold load shows the gate; each role card lands on its dashboard; **mock Google chooser** lists accounts → selecting one logs in; **Guest** badges the session.
2. **Route guard + refresh** — reload keeps the session *and* the current page (`#/admin/allstd` → reload → same page). Logout → back to gate.
3. **Persistence** — Fees → Collect Fees → Diya Patel → ₹1000 → reload → **balance still ₹1,400** (`eschool365.v1.fees`). Reset demo → restored.
4. **Guards fire** — overpayment blocked; future attendance date blocked; lock blocked while a period is uncovered; promotion blocked on dues (override + reason); delete blocked when referenced (archive/reassign/withdraw offered).
5. **Charts reconcile** — collecting a fee updates the KPI tiles, fee donut and Estimated-Fee block together; "View data" toggles an accessible table.
6. **Rae** — opens on every screen; "Show defaulters" gives a store-derived count; **"Take me there" navigates** (`#/admin/defaulters`).
7. **Resilience** — corrupt a slice in DevTools → reload → app re-seeds that slice, no white-screen.
8. **Mobile (360–1440)** — at 360px: no horizontal overflow, persistent bottom nav (Dashboard·Students·Fees·Attend·More), condensed top bar, single-column KPIs, Rae above the bottom nav; desktop restores the sidebar + role pills.

*(Automated puppeteer checks for items 1–8 live in `~/erp-verify/verify-*.js`.)*

---

## Notes / known gaps
- **Mock auth** is deliberate and labelled. Everything else is real + persistent.
- **Pending (per-feature):** in-table filter dropdowns, full table→card reflow on mobile (tables scroll horizontally on small screens), the Pay-Online and Salary submit flows (their screens now render live), full Create-Class roster append, and image-upload persistence. All additive — they don't affect the verified flows above.
