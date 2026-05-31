# Phase 1 — Design system foundation

You are a senior designer building the foundational visual language for SofSolutionsAI, a high-end engineering studio. This file is the source of truth for typography, color, components, and visual rules that every other section will inherit.

This is not a homepage. It is a comprehensive design system reference page — a style guide that demonstrates every primitive used across the site, on both dark and cream backgrounds where applicable.

The output must read as the work of a senior designer who has spent days on typographic and spatial decisions. **Reference standard:** the visual rigor of resend.com, linear.app, stripe.com, mercury.com. Anti-references: template marketplace sites, WordPress themes, generic AI-generated SaaS landing pages.

---

## Philosophy

- Generous whitespace beats decoration
- Letter-spacing matters as much as font choice
- Restraint is the signal of taste
- Every border, padding, and radius is a deliberate decision
- Whitespace should feel slightly excessive — that's the signal
- Templates are the enemy

---

## Deliverable

**One HTML file. ~1000-1800 lines.** Vanilla HTML + CSS (in a single `<style>` block in head) + minimal JS only where genuinely needed.

Functions as a design system audit page — each component group labeled with its name and shown in default/hover/active states where relevant. Components shown on both dark (#0e0e10) and cream (#f5f1e8) backgrounds wherever they're used in both contexts.

No external dependencies except Google Fonts (Space Grotesk, Space Mono) and Tabler Icons via CDN.

---

## Required components

Every component below must be present, labeled, and demonstrated on both backgrounds where applicable.

### Typography specimens
- Display H1 (64px / 1.05 / weight 500 / tracking -0.025em)
- H1 (48px / 1.08 / weight 500 / tracking -0.02em)
- H2 (32px / 1.15 / weight 500 / tracking -0.015em)
- H3 (22px / 1.25 / weight 500)
- Body large (18px / 1.55 / weight 400)
- Body (16px / 1.6 / weight 400)
- Body small (14px / 1.55 / weight 400)
- Mono label (12px / weight 400 / tracking +0.12em / lowercase)
- Mono tag (11px / weight 400)

Each specimen shown with a small caption indicating the size, weight, and tracking. Both dark + cream.

### Wordmark
- Full: "SofSolutionsAI" with "Sof" in amber #EF9F27, rest in contextual text color
- Abbreviated: "Sof"
- Mark only: stylized "S"
- All three variants on both backgrounds

### Buttons
- Primary: amber fill, dark text, optional leading `●` dot, pill radius
- Ghost: transparent, 1px border, contextual text color
- Link: underline on hover with text-underline-offset: 4px
- Sizes: regular (10px 18px padding) + small (6px 12px padding)
- Default + hover states shown side by side
- Hover behavior: translateY(-1px), faint border shift, 200ms ease — never scale changes

### Cards
- Dark card: rich black bg, 1px subtle border, 12px radius, 24px padding
- Cream card: warm off-white bg, 1px subtle border, 12px radius, 24px padding
- Each card shown with: H3 title, body text, optional mono tag row, optional CTA
- Hover state: 1px lift, slightly stronger border, no shadow

### Eyebrow labels
- Pattern: `● 01 · section name`
- Lowercase, tracked +0.12em, mono, amber dot leading
- On dark + cream
- Variations: numbered + unnumbered

### Tags / pills
- Tech tags: mono, lowercase, 1px border, transparent fill (e.g., `react native`, `postgres`, `kafka`)
- Status tags: mono, lowercase, amber border with 8% amber fill (e.g., `14 weeks`, `₹18-25L`)
- Both shown on dark + cream backgrounds

### Form primitives
- Dropdown select: custom-styled, dark + cream variants. Show closed state and an inline editable-text variant where part of a sentence becomes a dropdown (for the configurator)
- Text input: 1px border, 40px height, 12px radius
- All shown in default + focus + filled states

### Device chrome frames (empty containers)
- macOS browser chrome: 3 traffic-light dots top-left, URL bar
- Phone frame: rounded rectangle ~280px wide × 580px tall, notch, side button
- Wide browser frame (for dashboard demos): chrome + URL bar
- Each shown empty (will receive content in later phases)

### Journey thread
- 1px vertical amber line running the full height of the page
- 14px circle nodes at section anchors — 5-6 visible in this demo
- Show both filled (scrolled past) and unfilled (not yet reached) states
- Optional small labels next to nodes (mono lowercase tracked)

### Section dividers
- Diagonal clip-path cuts between dark and cream sections
- ~3-4 degree angle
- Show both directions: dark → cream, cream → dark
- Live demonstration with two adjacent panels in the document

### Texture overlays (a/b comparison)
- Dark with noise overlay vs dark plain
- Dark with dot grid overlay vs dark plain
- Cream with dot grid overlay vs cream plain
- Show them side by side so the subtle difference is visible
- Noise: 3-4% opacity, monochrome
- Dot grid on dark: 1.5% opacity
- Dot grid on cream: 2-3% opacity

### Color swatches
- All 10 colors from the design tokens, each as a 60×60px swatch with hex value below in mono small
- Grouped by purpose (backgrounds, accents, text, borders)

### Iconography
- A grid of 12-16 Tabler Outline icons that will be used (e.g., chevron-down, x, check, arrow-right, brand-whatsapp, mail, send, cursor-text, hand-click, arrows-maximize, pencil, player-play)
- Shown at 20px and 24px sizes
- On both backgrounds

---

## Quality directives — these elevate from competent to designed

### Typography rigor
- All large headings get tight negative tracking (-0.02em to -0.025em)
- Body text gets loose line-height (1.55 small, 1.6 base)
- Mono labels are lowercase, tracked +0.12em — never ALL CAPS
- Two weights only: 400 + 500. Never 600 or 700.

### Spacing rigor
- Section padding: 120px vertical (this demo uses sections to organize component groups)
- Component padding: rem multiples (0.75, 1, 1.25, 1.5, 2)
- Generous breathing room between component groups
- Whitespace should feel slightly excessive

### Border + radius rigor
- All borders exactly 1px
- Radii: 4px small (inputs, tags), 8px medium, 12px cards, 999px pills
- Never rounded corners on single-side borders

### Hover state subtlety
- translateY(-1px) maximum
- Color shifts and border shifts only — no scale jumps above 1.02
- 200ms ease transitions
- Buttons get a border shift on hover, not a fill change

### Interaction touches
- Buttons faint border on hover (not fill)
- Cards lift 1px with stronger border on hover
- Links underline with offset 4px on hover

---

## Anti-template rules — do not violate

- No drop shadows (focus rings exempt)
- No gradients of any kind
- No emoji — Tabler Outline icons only
- No SVG decoration unless it's a real diagram
- No "Lorem ipsum" — use engineering-voice placeholder copy (sentence case, direct)
- No marketing words like "powered by", "ai-driven", "next-gen", "revolutionary"
- Sentence case for all prose
- No celebration imagery (rockets, checkmarks-with-confetti, etc.)

---

## Fonts

Load from Google Fonts:
```
Space Grotesk: weights 400, 500
Space Mono: weights 400, 700
```

---

## Output format

- One single HTML file, all CSS embedded in a `<style>` block in `<head>`
- Minimal JS only for theme toggle if you include one (optional)
- Component groups labeled with H3 headers (using the design system's own H3 style — lowercase, mono tracked, amber dot prefix)
- Each component group sits in a section with appropriate background (alternating or grouped logically)
- The page itself uses the design system — meaning the page navigation, section headers, and any captions all use the components being defined

---

## What this file is NOT

- Not a homepage
- Not any of the 6 site sections (hero, demos, igloo cube, etc.)
- Not interactive demos
- Not the configurator or live builder
- Not framework code (React, Next.js) — vanilla HTML only

This file is the visual foundation for every subsequent piece. Treat it accordingly.

---

## When you're done

Output the artifact. I will review it, identify gaps or refinements, and respond with the next prompt for Phase 2.
