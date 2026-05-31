# SofSolutionsAI — Build Specification

**Version 2.0 · Locked May 28, 2026**

Single source of truth for the SofSolutionsAI website build. Paste at the top of every new Claude chat when generating sections, components, or demos.

---

## 1. Brand & positioning

**Company:** SofSolutionsAI
**Domain:** sofsolutionsai.com (registration pending)
**One-line:** End-to-end custom software solutions for any business — restaurant POS to core banking systems.
**Positioning:** A small engineering studio that ships fast, talks directly, stays accountable. Not an agency. No middlemen, no sales team, no slide decks.

**Primary CTA:** WhatsApp (floating + multiple in-page placements)
**Secondary CTA:** Email (hello@sofsolutionsai.com)

**Voice:**
- Direct, technical, no marketing fluff
- Sentence case everywhere (never Title Case, never ALL CAPS except mono labels which are tracked lowercase)
- Confidence without bragging
- Indian context where natural (₹, WhatsApp, Bangalore)

**Quality bar:** Senior-designer craft. Reference standard: resend.com, linear.app, stripe.com, mercury.com. Anti-references: WordPress themes, template marketplaces, generic SaaS landing pages.

---

## 2. Design tokens

### Colors
```
--bg-dark:         #0e0e10
--bg-cream:        #f5f1e8
--accent-amber:    #EF9F27
--accent-amber-2:  #BA7517  (hover/pressed)
--text-on-dark:    #f5f1e8
--text-on-light:   #1a1a1a
--muted-on-dark:   #8a857b
--muted-on-light:  #6a655c
--border-dark:     rgba(245,241,232,0.12)
--border-light:    rgba(26,26,26,0.10)
```

### Typography
- **All text:** Space Grotesk (Google Fonts, weights 400, 500)
- **Mono labels/tags/code:** Space Mono (weights 400, 700)
- **Two weights only:** 400 + 500. Never 600 or 700.

**Type scale:**
```
H1 display:  64px / 1.05 / weight 500 / tracking -0.025em
H1:          48px / 1.08 / weight 500 / tracking -0.02em
H2:          32px / 1.15 / weight 500 / tracking -0.015em
H3:          22px / 1.25 / weight 500
Body large:  18px / 1.55 / weight 400
Body:        16px / 1.6  / weight 400
Body small:  14px / 1.55 / weight 400
Mono label:  12px / weight 400 / tracking +0.12em / lowercase
Mono tag:    11px / weight 400
```

### Spacing / layout
- Container max-width: 1200px, padding 32px (mobile 20px)
- Section vertical padding: 120px desktop, 80px mobile
- Border-radius: 4px (small), 8px (medium), 12px (cards), 999px (pills)
- Grid gap: 24px desktop, 16px mobile
- Whitespace should feel slightly excessive — that's the signal

### Texture
- Dark sections: subtle noise OR dot grid at ~1.5-3% opacity
- Cream sections: dot grid at ~2% opacity
- Visible enough to read as "considered," subtle enough to never compete with content

---

## 3. Tech stack

**Prototype phase (Claude Design):** Vanilla HTML + CSS + JS, single file per section. Google Fonts via `<link>`. Three.js via cdn.jsdelivr.net when needed.

**Production phase (Claude Code):** Next.js 15 (App Router) · Tailwind with custom theme · react-three-fiber + drei · Framer Motion · Lucide React · Vercel deploy.

---

## 4. Sitemap — 6 sections

1. **Hero + configurator** (dark)
2. **[Mercury zoom transition]** — bridge, not a section
3. **What we ship** — sticky scroll + 4 demos (dark)
4. **How we work** — Igloo cube metaphor (cream)
5. **What you don't have to do** — animated comparison (dark)
6. **Build your own** — live builder + WhatsApp send (dark with amber accents)

Footer is footer.

**Removed from v1:** Trusted-by carousel, services 6-card grid, tech stack marquee, sectors carousel, numbers/stats section, named testimonials, standalone case study section, separate WhatsApp CTA section. These can return later when real numbers/clients/quotes exist.

---

## 5. Section specs

### Section 1 — Hero + configurator

**Background:** #0e0e10 with subtle noise + faint dot grid overlay
**Layout:** Full viewport. Configurator centered inside a macOS-style laptop frame.

**Content:**
- Top-left eyebrow (mono lowercase): `● software studio · bengaluru + remote`
- Center: laptop frame with traffic-light dots top-left, URL bar reading `sofsolutionsai.com/configure`
- Inside laptop: large display H1-style sentence
  `I run a [dropdown: restaurant chain] and I need [dropdown: a mobile ordering app]`
- Dropdown 1 options: restaurant chain · retail store · clinic · bank · logistics company · saas startup · d2c brand · manufacturing unit
- Dropdown 2 options dynamically filter based on dropdown 1
- Below sentence: response panel with 3 sentences describing what we'd build + 4 tech tags + estimated weeks + estimated cost range
- Two buttons under response: `● WhatsApp us about this` (amber primary) + `See a similar build →` (ghost)
- Below laptop, small sub-copy: "Edit the sentence. We'll tell you what we'd build, who we'd put on it, and how long it'd take — no form, no sales call, no slide deck."

**Behavior:**
- Selecting an option updates the response panel instantly (no spinners)
- WhatsApp button opens wa.me with configured message pre-filled

### Section 2 — Mercury zoom transition

**Behavior:**
- As scrollY increases from 0 to viewportHeight, laptop scales from 1.0 to ~8.0 via CSS transform
- At ~80% scroll, the laptop chrome fades to 0, screen content fills viewport
- Screen content transitions into Section 3
- Use IntersectionObserver + scroll progress to drive transform

**Mobile:** skipped, snap-scroll instead.

### Section 3 — What we ship · signature section

**Background:** #0e0e10
**Layout:** Stripe-style sticky split — 500vh scroll runway, sticky inner that locks to viewport.

**Structure:**
- Left rail (30%): 4 labels stacked — restaurant ordering · banking dashboard · ai support · healthcare portal. Active label has amber dot and underline.
- Right panel (70%): the active demo, wrapped in a browser chrome frame. Cross-fades between demos as user scrolls.
- No central metaphor here — Igloo moved to Section 4.

### Section 4 — How we work · Igloo cube

**Background:** #f5f1e8 (cream)
**The signature interaction.**

**Object:** Four thin horizontal slabs (CSS 3D, no Three.js) stacked vertically into one cohesive geometric form. Each slab represents one phase:
- Slab 1 (bottom): understand · week 1
- Slab 2: design · weeks 2-3
- Slab 3: build · weeks 4-12
- Slab 4 (top): support · forever

**At rest:** Object reads as one solid form. Subtle vertical "breathing" — compresses 1-2% every ~5 seconds. Slight ambient rotation around Y-axis (~1°).

**On hover any slab:**
- That slab translates X by 80-120px, rotates 4-6° on Y-axis
- A detail card slides out alongside containing: WE DO / YOU DO / OUTPUT cards for that phase
- Other slabs dim slightly (~15%) to focus attention
- Caption below the object updates with the slab's name + weeks

**On mouse-leave:**
- Slab snaps back into the stack (200-300ms ease)
- Detail card fades out
- Other slabs return to full brightness

**Around the object:**
- Eyebrow: `● 04 · how we work`
- H1: `One process. Four moments. No surprises.`
- Subhead: short paragraph about Friday demos
- The Igloo object sits center-stage

**Implementation:** CSS 3D transforms with `perspective` on the parent. Each slab is a positioned `<div>` with `transform: translateZ()`. Hover toggles a class that sets `transform: translateX() rotateY()`. ~6-8 days.

### Section 5 — What you don't have to do · animated battle

**Background:** #0e0e10
**Layout:** Comparison table — stage · typical agency · SofSolutionsAI

**Content stages:** first contact · design · build · after launch
For each stage, 3-4 agency items (struck out) and 3-4 SofSolutionsAI items (highlighted).

**The animation (this is the section's signature):**
- IntersectionObserver triggers on scroll-in
- Rows cascade top to bottom (~150ms stagger between rows)
- For each row:
  - Agency cells: an SVG `<path>` line draws across the cell (~400ms via `stroke-dasharray` animation). When the line finishes, the cell desaturates and tilts ~2°.
  - Us cells: amber border pulses, cell lifts 2px, amber background tints briefly, then settles into the won state.
- After cascade completes, the table sits in a "won" state — agency side gray and crossed, us side amber-accented.
- Hover any row → replay the animation just for that row.

**Reads like watching a debate get won.**

**Implementation:** SVG path stroke animation + CSS keyframes triggered by IntersectionObserver. ~3-4 days.

### Section 6 — Build your own + send · final interaction

**Background:** #0e0e10 with amber accents (final CTA tier)
**Layout:** Split — picker left (40%), assembled preview right (60%).

**Picker (left):** Five categories, all visible at once. Click any pill to set/change.
- Business: restaurant · bank · clinic · retail · logistics · saas · d2c · manufacturing
- Need: mobile app · web app · dashboard · ai feature · internal tool · whole platform
- Stack: we recommend · react native · native ios/android · next.js · python/fastapi
- Timeline: urgent (<8w) · standard (8-16w) · flexible (16w+)
- Budget: ₹5-10L · ₹10-25L · ₹25-50L · ₹50L+

**Preview (right):** As selections change, UI components animate into a device frame:
- "Mobile" → phone frame; "web" → laptop frame; "dashboard" → wide browser frame
- Business-specific UI populates inside (restaurant menu cards if restaurant; transaction table if bank; appointment booker if clinic; etc.)
- "AI feature" toggle adds an AI chat panel sliding in
- Below the device, a live spec card updates: "14 weeks · 4 engineers · ₹18-25L estimated"

**WhatsApp send (below preview):** Big amber `● Send to WhatsApp` button. Click opens wa.me with pre-filled message containing the full spec:

> Hi! I'm building [a mobile ordering app] for [my restaurant chain]. Thinking [React Native] stack, [14-week] timeline, [₹15-20L] budget. Can we talk?

**Around the builder:**
- Eyebrow: `● 06 · build your own`
- H1: `Pick what you need. We'll quote it Monday.`
- Subhead: "No discovery call. No form. The configurator builds your spec. WhatsApp sends it to an engineer."

**Implementation:** State management for selections, conditional rendering of preview components, message generation. ~8-10 days.

---

## 6. Three signature elements

### 6a. Mercury laptop-zoom (Section 1 → 3 bridge)
CSS transform tied to scrollY. Pure CSS/JS, no library. ~3-4 days. See Section 2 spec.

### 6b. Igloo cube (Section 4)
CSS 3D transforms with hover-driven slab separation. ~6-8 days. See Section 4 spec.

### 6c. Resend-style decorative 3D object (optional, ambient)
Slowly rotating wireframe shape using Three.js. Placement TBD — could be hero corner or Section 5 backdrop. Build LAST. ~5 days.

---

## 7. Four interactive demos (right panel of Section 3)

All sit inside browser chrome frames. Space Grotesk for UI, Space Mono for code/data.

### Demo 1 — Restaurant review widget
Clickable 5-star rating · text input · submit animates review into feed · pre-existing reviews from Indian names · toast: "5-star reviews boost orders by 23%" · mini bar chart: reviews vs orders correlation
Tech tags: react native · stripe · postgres

### Demo 2 — Banking fraud detection chat
Pre-loaded conversation about ₹4,500 unauthorized charge · visitor types question → typing indicator → bot responds with confidence score, similar cases, recommended action · system card: "Processed in 0.3s using real-time fraud detection pipeline"
Tech tags: typescript · kafka · redis · postgres

### Demo 3 — AI knowledge query
Split panel: chat 60% / knowledge base 40% · pre-loaded Q&A about 2FA reset · visitor types → searching animation on KB panel → AI responds with 3 cited sources · confidence meter updates dynamically
Tech tags: openai · pgvector · fastapi · python

### Demo 4 — Healthcare appointment booker
Mini week calendar · time slot pills · pre-selected doctor "Dr. Meera Patel · Cardiologist" · confirm → checkmark animation + confirmation card · counter: "847 appointments booked this month"
Tech tags: next.js · mongodb · twilio · express

---

## 8. Build order — pre-written prompts for each phase

### Phase 1 — Design system foundation (THIS PHASE)

Single HTML file functioning as a comprehensive design system reference. Tokens, typography specimens, every base component on both backgrounds, no full sections yet. See PHASE_1_PROMPT.md.

### Phase 2 — Hero + Mercury zoom

> Using BUILD_SPEC and the design system from Phase 1, build Section 1 (Hero + configurator) and Section 2 (Mercury zoom transition) in a single HTML file. The configurator must work — both dropdowns functional, response panel updates inline. The laptop frame must scale on scroll per spec section 2. Mobile: skip the zoom, snap-scroll. Output as a single artifact.

### Phase 3 — What we ship scaffold

> Build Section 3 ("What we ship") scaffold. Sticky split layout per spec, left rail with 4 labels, right panel that cross-fades between 4 empty demo slots wrapped in browser chrome. Use placeholder content for the 4 demos. Output as a single artifact.

### Phase 4 — Four demos (4 separate chats)

**4a — Restaurant review:**
> Build the Restaurant review widget per spec section 7 Demo 1. Self-contained interactive component in vanilla JS. Output as a single artifact.

**4b — Banking fraud chat:** [same pattern, Demo 2]
**4c — AI knowledge query:** [same pattern, Demo 3]
**4d — Healthcare booker:** [same pattern, Demo 4]

### Phase 5 — Igloo cube (Section 4)

> Build Section 4 (How we work) with the Igloo cube metaphor per spec section 5 Section 4. Four CSS 3D slabs stack into one form at rest, hover separates with detail card. Breathing animation. Mobile: degrade to vertical stacked cards. Output as a single artifact.

### Phase 6 — Animated comparison (Section 5)

> Build Section 5 (What you don't have to do) with the cascade animation per spec. SVG stroke-dasharray on agency cells, amber pulse on us cells. IntersectionObserver triggers. Hover replays per row. Output as a single artifact.

### Phase 7 — Live builder (Section 6)

> Build Section 6 (Build your own) per spec section 5 Section 6. Five pill rows for selections, right-panel preview that assembles components based on choices, live spec card, WhatsApp send button with pre-filled message generation. Output as a single artifact.

### Phase 8 — Resend cube (optional decorative)

> Build the ambient 3D wireframe object per spec section 6c using Three.js (via cdn.jsdelivr.net). Slowly rotates, reacts to cursor proximity. Output as a single artifact.

### Phase 9 — Port + deploy (Claude Code)

> Port artifacts from phases 1-8 into a production Next.js 15 + Tailwind project. Use react-three-fiber for the Resend cube, Framer Motion for scroll animations. Set up Vercel deployment. Target: production-ready at sofsolutionsai.com.

---

## 9. Content Kartik still needs to write

1. Real configurator response copy for each business × need combination (Section 1)
2. Optional case studies content (currently no separate case study section)
3. About page when added (founder story, partnership structure)

---

## 10. Deploy plan

1. Register sofsolutionsai.com (namecheap or hostinger, ~₹850/yr)
2. Vercel free tier — connect GitHub, auto-deploys on push
3. DNS: apex + www to Vercel
4. SSL: automatic via Vercel
5. Plausible/Umami analytics
6. WhatsApp Business API or wa.me links

**Pre-launch checklist:**
- [ ] Lighthouse mobile score > 90
- [ ] OG image + meta tags
- [ ] Favicon (wordmark "S" in amber)
- [ ] robots.txt + sitemap.xml
- [ ] Test all 4 demos + live builder on iOS Safari, Android Chrome, desktop browsers
- [ ] WhatsApp links open with pre-filled messages
- [ ] Configurator + builder fully functional on mobile
- [ ] Mercury zoom disabled or simplified on mobile
- [ ] 4G load time < 3 seconds

---

*End of spec v2.0. Update this doc whenever decisions change. Keep version number current.*
