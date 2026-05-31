# Phase 3 — Solutions showcase (sticky split + 4 interactive demos)

You are continuing the SofSolutionsAI build. Phases 1 (design system) and 2 (scroll-scrub video hero + configurator) are complete and in this chat's context. Inherit all Phase 1 classes, conventions, and the journey thread.

This phase builds **Section 3 — the solutions showcase**: a Stripe-payments-style sticky split where a left rail of industry categories stays pinned while the right panel cross-fades through four live, interactive product demos as the user scrolls.

**Reference:** stripe.com/payments (the sticky left-label / right-panel pattern) and mercury.com (the warm-dark premium feel). Quality bar is the same senior-designer standard as Phases 1 and 2.

---

## 0. Palette update (applies to this section; we'll retrofit Phases 1–2 after)

Update these CSS custom properties. This shifts surfaces toward a navy-purple dark with cool-white text, while keeping amber as the BRAND accent and introducing an indigo used ONLY inside the demo UIs.

```
--bg-dark:        #16131f    /* navy-purple dark — primary dark surface */
--bg-dark-2:      #1f1a2e    /* elevated surface — demo panels, cards, chrome */
--bg-cream:       #f5f1e8    /* unchanged — light sections */
--accent-amber:   #EF9F27    /* BRAND accent — rail active state, CTAs, brand dots */
--accent-amber-2: #BA7517    /* amber hover/pressed */
--accent-indigo:  #7c6cff    /* DEMO-INTERNAL accent ONLY — inside the mockup product UIs */
--accent-indigo-2:#9a8dff    /* lighter indigo for highlights inside demos */
--text-on-dark:   #f5f4f9    /* cool white */
--text-on-light:  #1a1a1a
--muted-on-dark:  #908ba3    /* lavender-gray */
--muted-on-light: #6a655c
--border-dark:    rgba(245,244,249,0.10)
--border-light:   rgba(26,26,26,0.10)
```

**Critical rule:** amber is the SofSolutionsAI brand. It appears on the rail's active category, on CTA buttons, on brand eyebrow dots. Indigo appears ONLY inside the demo product UIs (a "Send" button in the banking demo, a selected state in the school ERP, etc.) — it represents the products we build, not our brand. Never use indigo for SofSolutionsAI's own brand chrome. Never use amber inside the demo product UIs except where a demo would plausibly use a warm accent.

---

## 1. Section architecture (desktop)

```
<section class="showcase">                 /* 100vh per demo of scroll runway */
  <div class="showcase-sticky">            /* position: sticky; top: 0; height: 100vh */
    <div class="showcase-rail"> ... </div>  /* left ~32% — category list */
    <div class="showcase-stage"> ... </div> /* right ~68% — active demo in browser chrome */
  </div>
</section>
```

- Outer `.showcase` height = `400vh` (one viewport of scroll per demo, 4 demos). This is the scroll runway.
- `.showcase-sticky` pins to the viewport for the full runway.
- Background: `--bg-dark` with the existing dot-grid texture at low opacity.
- As the user scrolls through the 400vh, the active demo advances 1 → 2 → 3 → 4, and the right panel cross-fades between them.

---

## 2. Entry transition (the "slides right and becomes a UI element" moment)

When `.showcase` first scrolls into view:

1. The **first demo (banking)** enters center-stage at ~70% scale, centered horizontally.
2. Over ~600ms it **slides to the right** into the `.showcase-stage` docked position and scales to 100%.
3. **Simultaneously**, the `.showcase-rail` fades + slides in from the left (translateX -20px → 0, opacity 0 → 1).

Felt effect: the dashboard the user just dove into during the video moves aside to make room for the menu of solutions. Trigger via IntersectionObserver on `.showcase` (threshold ~0.2), adding a class `.showcase-entered` that drives the CSS transition. This must be self-contained — it triggers on scroll-into-view regardless of what section precedes it.

---

## 3. Left rail (`.showcase-rail`)

- Sticky within the pinned area, vertically centered.
- Small eyebrow at top: `<span class="eyebrow">● 03 · solutions we ship</span>`
- A short H2 above the list: "Four industries. Four working demos. Touch them."
- The four categories stacked as a vertical list, generous line spacing:
  - banking solutions
  - school solutions
  - restaurant solutions
  - e-commerce solutions
- **Active state:** amber dot prefix + amber text + a thin amber left-border or underline. Inactive: muted lavender-gray, no dot.
- The active category is driven by scroll position (which demo is currently showing).
- Clicking a category smooth-scrolls to that demo's portion of the runway (so the rail is also navigation).
- Below the list, a tiny mono caption: "scroll, or pick one ↓"

---

## 4. Right panel (`.showcase-stage`)

- Each demo sits inside a browser chrome frame (reuse Phase 1's `.frame` / `.chrome` pattern): three window dots + a URL bar showing a plausible product URL per demo:
  - banking → `console.bank.app`
  - school → `erp.school.app`
  - restaurant → `floor.restaurant.app`
  - e-commerce → `shop.store.app`
- Only one demo is visible at a time. Transition between demos is a **cross-fade** (opacity + a subtle 8px vertical drift), ~400ms — never a hard cut, never a slide.
- The frame uses `--bg-dark-2` as its surface so it reads as elevated against the section background.
- Below each demo frame, a one-line caption in mono describing what the demo proves, e.g. "live fraud check on every transaction · 0.3s".

---

## 5. The cross-fade-on-scroll mechanic

```js
// Pseudocode for the scroll driver
const section = .showcase;
const demos = [banking, school, restaurant, ecommerce];
on scroll (throttled via requestAnimationFrame):
  progress = clamp((scrollY - sectionTop) / (sectionHeight - viewportHeight), 0, 1);
  activeIndex = clamp(floor(progress * demos.length), 0, demos.length - 1);
  // cross-fade: active demo opacity 1, others 0
  // update rail active state to activeIndex
  // (optional) within-demo subtle parallax based on local progress
```

- Throttle with `requestAnimationFrame` (same pattern as the Phase 2 scrub).
- The active demo gets `opacity: 1; pointer-events: auto`; inactive demos `opacity: 0; pointer-events: none` so only the visible demo is interactive.

---

## 6. The four demos — each is a real, single-interaction mini-app

Each demo must have ONE meaningful working interaction (not a video, not a static image). Keep each contained — a single satisfying interaction, not a full app. Space Grotesk for UI text, Space Mono for data/numbers. Use `--accent-indigo` for the demo's internal accent.

### Demo 1 — Banking (transaction dashboard)
Continues the banking dashboard the video dove into.
- **Layout:** a slim left sidebar (Home · Transactions · Cards · Payments) + main area with a balance card (e.g. "₹52,16,471" — ₹ is fine here, it's the product's own data) and a list of 5-6 recent transactions (merchant, amount, time).
- **Interaction:** click any transaction row → a detail drawer slides in from the right of the frame showing merchant, category, amount, and a fraud-check result: "✓ cleared in 0.3s" with a small confidence bar at ~96%. Clicking another row updates the drawer. Clicking a close affordance dismisses it.
- **Internal accent:** indigo for the active nav item, the "Move money" button, the confidence bar.
- **Caption:** "live fraud check on every transaction · 0.3s"

### Demo 2 — School (ERP attendance)
- **Layout:** a class header ("Grade 9-A · Period 3 · Mathematics") + a grid of ~12 student cards, each with initials-avatar and name.
- **Interaction:** tap a student card to toggle present (indigo check, card highlights) / absent (muted, gray). A live counter at the top updates: "10 / 12 present". A "save attendance" button (indigo) sits at the bottom; clicking it briefly shows "saved ✓".
- **Internal accent:** indigo for present-state and the save button; a muted red/gray for absent.
- **Caption:** "mark a full class in seconds · syncs to parents"

### Demo 3 — Restaurant (table booking floor plan)
- **Layout:** a stylized restaurant floor — ~10 tables as rounded shapes positioned in a layout, color-coded: green = open, soft-red = occupied, amber = reserved. A small legend.
- **Interaction:** click an open (green) table → a compact booking popover appears (name field pre-fillable or pre-filled "Walk-in", party size stepper, a time pill) → click "reserve" → the table flips to reserved (amber) with a small name label, and a counter updates: "13 / 20 booked tonight".
- **Internal accent:** indigo for the popover's confirm button and interactive controls.
- **Caption:** "tables, turns, and covers — one tap each"

### Demo 4 — E-commerce (storefront + cart)
- **Layout:** a product grid of 4-6 items (image placeholder block + name + price), a small cart badge in the top-right of the frame.
- **Interaction:** click "add" on any product → the cart badge increments with a subtle pop animation, and a mini-cart drawer slides in showing the added items with a running total. Adding more updates the total live. A "checkout" button (indigo) sits at the bottom of the mini-cart.
- **Internal accent:** indigo for "add" buttons, the cart badge, and checkout.
- **Caption:** "storefront to checkout, fully custom"

---

## 7. Mobile behavior (≤900px)

Per the brief: **remove the left rail entirely.** The sticky split does not apply on mobile.

- The section becomes regular vertical flow (not 400vh, not sticky).
- Each solution becomes a full-width block stacked vertically:
  - A category heading above each demo: `<span class="eyebrow">● banking solutions</span>` + a short one-line description.
  - The demo frame below, full-width, sized to fit a mobile viewport.
- Every demo's interaction must work on **tap** (not hover) — the fraud drawer, attendance toggle, table booking, and add-to-cart all need to be touch-driven.
- The user scrolls through the four solutions naturally, one after another.
- Keep the browser chrome frame but simplify (smaller URL bar). Demos may need internal layouts adjusted for narrow width (e.g., banking sidebar collapses to a top bar; school grid goes 3-across instead of 4).

---

## 8. What stays / inherits

- All Phase 1 components, typography, spacing, hover conventions (now with palette C tokens).
- The journey thread on the right — add a node for this section (it's section 03). Node fills/activates when the showcase is in view.
- The header bar behavior from Phase 2 (frosted on scroll) if a header is present in this artifact; otherwise omit the header here since this is a mid-page section.

## 9. What this file is NOT

- Not the hero or configurator (those are Phase 2).
- Not the Igloo cube (Phase 5), the comparison table (Phase 6), or the live builder (Phase 7).
- Not framework code — vanilla HTML + CSS + JS only.

---

## 10. Quality directives

- No drop shadows except subtle elevation on the demo frames if needed for separation (keep minimal; prefer border + surface contrast over shadow).
- No gradients except the existing ambient-glow technique and the radial textures.
- Two font weights only (400, 500).
- Sentence case everywhere except mono labels (lowercase tracked).
- Cross-fades between demos, never hard cuts.
- Demo interactions are instant and smooth — no spinners, no lag.
- The amber-brand / indigo-demo separation is strictly observed.
- Generous whitespace; the rail and stage should breathe.

---

## 11. Output + verification

One HTML file. After generating, I'll test:

1. Does the entry transition read as "first demo slides right while the rail appears"?
2. Does scrolling cleanly advance the active demo 1→2→3→4 with cross-fades (not hard cuts)?
3. Does the rail's active state track the scroll position, and does clicking a category jump to it?
4. Does each of the four demos have a working, satisfying single interaction?
5. Is amber used only for SofSolutionsAI brand chrome, and indigo only inside the demo UIs?
6. Does the section feel navy-purple + white overall while amber remains the brand signature?
7. On mobile (≤900px): is the rail gone, demos stacked full-width, and every interaction tap-driven?
8. Did anything from Phases 1–2 break under the new palette tokens?

If anything is off, I'll send surgical corrections before we move on.
