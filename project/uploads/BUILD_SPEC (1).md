# SofSolutionsAI — Build Specification

**Version 2.5 · Updated May 29, 2026**

**v2.5 changes (AI layer section added):**
- New section inserted after the solutions showcase: **the "AI layer" section** — a 3-card horizontal layout (deliberately NOT the sticky-split, to read as a fresh beat) offering AI augmentation for clients who already have a product. Three compact live demos: AI email management (click email → AI summary + drafted reply types in), AI chatbot (click suggested question → answer streams in with a source chip), AI dashboard (click NL question → chart draws + AI narrative types in). Framing: "Already built? We add the AI layer." Indigo = demo-internal accent; amber = brand. Built as Phase 4 (its own artifact in the same Claude Design chat).
- **Section renumbering** (page now has, in order): 01 hero (video scrub) + configurator · 02 [merged into hero/deferred] · 03 solutions showcase (4 industry demos) · **04 AI layer (3 cards) ← NEW** · 05 how we work (igloo cube) · 06 what you don't have to do (comparison) · 07 build your own (live builder). The igloo/comparison/builder each shifted down one number. Build-phase order is unaffected except the AI layer is now Phase 4, pushing igloo→Phase 5, comparison→Phase 6, builder→Phase 7.
- Two narrative halves now: sections 03 ("what we build from scratch") and 04 ("how we upgrade what you already run") form a build-new / augment-existing one-two punch.

**Version 2.4 · Updated May 28, 2026**

**v2.4 changes (Phase 3 definition):**
- Palette moved to "C": navy-purple dark surfaces + cool white text, with a TWO-ROLE accent system. `--bg-dark` is now `#16131f`, plus a new `--bg-dark-2` `#1f1a2e` for elevated surfaces. `--text-on-dark` is `#f5f4f9` (cool white). `--muted-on-dark` is `#908ba3` (lavender-gray). **Amber `#EF9F27` remains the SofSolutionsAI BRAND accent** (rail active state, CTAs, brand dots). A new `--accent-indigo` `#7c6cff` is used ONLY inside the demo product UIs (representing the software we build, not our brand). This gives an overall "purple + white" impression matching the hero video's dashboard end-frame while preserving amber as the brand signature and avoiding a Mercury-clone look.
- **Section 3 redefined** as the "solutions showcase": Stripe-style sticky split, left rail of four industry categories, right panel cross-fading through four interactive demos as the user scrolls. Entry transition: first demo slides center→right while the rail fades in (the "dashboard becomes a UI element" moment). Mobile drops the rail entirely, stacks demos full-width.
- **Demo categories changed** to: banking · school · restaurant · e-commerce (replacing the earlier restaurant-ordering / banking-dashboard / AI-support / healthcare-portal set). Each is a single-interaction mini-app: banking transaction dashboard (click row → fraud-check drawer), school ERP attendance (tap to toggle present/absent), restaurant table-booking floor plan (click table → reserve), e-commerce storefront (add to cart → mini-cart). The configurator's placement (kept before showcase vs removed vs folded into Phase 7) is DEFERRED to page assembly — the showcase entry transition is self-contained and works regardless.


Single source of truth for the SofSolutionsAI website build. Paste at the top of every new Claude chat when generating sections, components, or demos.

**v2.2 changes:** all pricing references removed; all specific time references (week counts, sprint counts, week ranges) removed. Qualitative cadence and commitment language replaces specifics throughout the customer-facing site. Internal build duration estimates for Kartik are retained where labeled.

**v2.3 changes (post Phase 2 build):**
- Palette warmed: `--bg-dark` is now `#13121a` (was #0e0e10), `--muted-on-dark` is `#8a8595`, `--border-dark` is `rgba(245,241,232,0.10)`. This harmonizes with the hero video's sunrise/mountain/slate color story and matches Mercury's warm-dark feel. Amber accent and cream unchanged.
- **Hero architecture changed.** The original "configurator inside a macOS laptop frame + CSS Mercury zoom" was replaced with: a scroll-scrubbed pre-rendered video (Kartik's own AI-generated camera-pullback, 1920×720, 6.4s, keyframed every 0.1s for smooth scrubbing) followed by a frameless configurator on the dark surface. The video scrubs via `video.currentTime = progress * duration * 0.82` (trimmed before the dashboard reveal). Loaded as a Blob URL for seekability. Video fades to dark in the final 12% of scroll, handing off to the configurator which reveals via IntersectionObserver stagger. The laptop frame is gone — the configurator sits directly on dark because the video has visually "entered the screen."
- Phase 1 ✓ complete. Phase 2 ✓ complete.

---

## 1. Brand & positioning

**Company:** SofSolutionsAI
**Domain:** sofsolutionsai.com (registration pending)
**One-line:** End-to-end custom software solutions for any business — restaurant POS to core banking systems.
**Positioning:** A small engineering studio that ships fast, talks directly, stays accountable. Not an agency. No middlemen, no sales team, no slide decks. **No pricing on the site. No timelines on the site.** Everything specific happens on WhatsApp.

**Primary CTA:** WhatsApp (floating + multiple in-page placements)
**Secondary CTA:** Email (hello@sofsolutionsai.com)

**Voice:**
- Direct, technical, no marketing fluff
- Sentence case everywhere (never Title Case, never ALL CAPS except mono labels which are tracked lowercase)
- Confidence without bragging
- Indian context where natural (₹ symbol only inside simulated demo UIs, never as a price for our work)

**Quality bar:** Senior-designer craft. Reference standard: resend.com, linear.app, stripe.com, mercury.com. Anti-references: WordPress themes, template marketplaces, generic SaaS landing pages.

**Specifics policy:** Throughout the customer-facing site, replace any quantitative claim about our work (cost, timeline, team size, productivity count) with a qualitative claim about cadence, commitment, or philosophy. Example: "ships every Friday" instead of "14-week build." "Same engineer all the way" instead of "4-engineer team." "Friday demos, weekly" instead of "demo every two weeks." This policy applies everywhere except simulated product data inside Section 3 demos (which represent fake client app analytics, not our claims).

---

## 2. Design tokens

### Colors
```
--bg-dark:         #16131f    (navy-purple dark — primary dark surface)
--bg-dark-2:       #1f1a2e    (elevated surface — demo panels, cards, chrome)
--bg-cream:        #f5f1e8    (light sections, unchanged)
--accent-amber:    #EF9F27    (BRAND accent — rail active, CTAs, brand dots)
--accent-amber-2:  #BA7517    (amber hover/pressed)
--accent-indigo:   #7c6cff    (DEMO-INTERNAL only — inside mockup product UIs)
--accent-indigo-2: #9a8dff    (lighter indigo for highlights inside demos)
--text-on-dark:    #f5f4f9    (cool white)
--text-on-light:   #1a1a1a
--muted-on-dark:   #908ba3    (lavender-gray)
--muted-on-light:  #6a655c
--border-dark:     rgba(245,244,249,0.10)
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

---

## 5. Section specs

### Section 1 — Hero (video scrub) + configurator  ✓ BUILT

**As built (v2.3):** Scroll-scrubbed video hero, NOT a laptop-frame zoom. A 200vh sticky section scrubs a pre-rendered camera-pullback video (wide mountain valley with desk + laptop → dives into the laptop screen). Headline "Your business problem. Our software solution. / Edit the sentence." floats over the video and fades out by 20% scroll. Video fades to dark in the final 12%, handing off to a frameless configurator section on the warm-dark surface (no laptop frame). Configurator content reveals via IntersectionObserver stagger. Ambient amber glow at the top of the configurator section bridges the handoff.

**Original spec (superseded, kept for reference):**
**Background:** #0e0e10 with subtle noise + faint dot grid overlay
**Layout:** Full viewport. Configurator centered inside a macOS-style laptop frame.

**Content:**
- Top-left eyebrow (mono lowercase): `● software studio · bengaluru + remote`
- Center: laptop frame with traffic-light dots top-left, URL bar reading `sofsolutionsai.com/configure`
- Inside laptop: large display H1-style sentence
  `I run a [dropdown: restaurant chain] and I need [dropdown: a mobile ordering app]`
- Dropdown 1 options: restaurant chain · retail store · clinic · bank · logistics company · saas startup · d2c brand · manufacturing unit
- Dropdown 2 options dynamically filter based on dropdown 1
- Below sentence: response panel with 3-4 sentences describing what we'd build + 4 tech tags + a single qualitative cadence pill (e.g., `ships every Friday`)
- Two buttons under response: `● WhatsApp us about this` (amber primary) + `See a similar build →` (ghost)
- Below laptop, small sub-copy: "Edit the sentence. We'll tell you what we'd build and how we'd ship it — no form, no sales call, no slide deck."

**Behavior:**
- Selecting an option updates the response panel instantly (no spinners)
- WhatsApp button opens wa.me with configured message pre-filled (no timeline, no cost — just business + need + stack)

### Section 2 — Mercury zoom transition

**Behavior:**
- As scrollY increases from 0 to viewportHeight, laptop scales from 1.0 to ~6.0-8.0 via CSS transform
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
- Slab 1 (bottom): `understand` — we ask before we build
- Slab 2: `design` — you click it before we sign
- Slab 3: `build` — friday demos, every friday
- Slab 4 (top): `support` — same engineer, forever

**No week ranges. No durations. Each slab is named and tagged with a value-prop line.**

**At rest:** Object reads as one solid form. Subtle vertical "breathing" — compresses 1-2% every ~5 seconds. Slight ambient rotation around Y-axis (~1°).

**On hover any slab:**
- That slab translates X by 80-120px, rotates 4-6° on Y-axis
- A detail card slides out alongside containing: WE DO / YOU DO / OUTPUT cards for that phase
- Other slabs dim slightly (~15%) to focus attention
- Caption below the object updates with the slab's name + value-prop tagline

**On mouse-leave:**
- Slab snaps back into the stack (200-300ms ease)
- Detail card fades out
- Other slabs return to full brightness

**Detail card content per slab (no week mentions):**
- Understand → WE DO: ask hard questions, read the code · YOU DO: tell us what's actually broken · OUTPUT: a spec you'd approve in plain language
- Design → WE DO: architecture, UX, a clickable prototype · YOU DO: one review call, break what feels wrong · OUTPUT: clickable prototype you sign off on
- Build → WE DO: ship in pairs, friday demos, deploy on green · YOU DO: come to friday demos, redirect when needed · OUTPUT: working software in production
- Support → WE DO: on-call, maintenance, the same engineers · YOU DO: WhatsApp us when something breaks · OUTPUT: uptime + the team that built it

**Around the object:**
- Eyebrow: `● 04 · how we work`
- H1: `One process. Four moments. No surprises.`
- Subhead: short paragraph about Friday demos
- The Igloo object sits center-stage

**Implementation:** CSS 3D transforms with `perspective` on the parent. Each slab is a positioned `<div>` with `transform: translateZ()`. Hover toggles a class that sets `transform: translateX() rotateY()`. *Build estimate (internal, not on site): ~6-8 days.*

### Section 5 — What you don't have to do · animated battle

**Background:** #0e0e10
**Layout:** Comparison table — stage · typical agency · SofSolutionsAI

**Content stages:** first contact · design · build · after launch
For each stage, 3-4 agency items (struck out) and 3-4 SofSolutionsAI items (highlighted).

**Sample cells (no week mentions):**
- first contact / typical: discovery call · NDA exchange · proposal slide deck · signed SOW (long after)
- first contact / us: WhatsApp message · an engineer replies, same day · quote in writing
- design / typical: UX research phase · brand workshop · wireframes v1 → v3 · hi-fi mocks PM review
- design / us: clickable prototype, before we sign · you break it, we fix it · same engineer who'll build it
- build / typical: offshored to a dev partner · Monday status reports · code you never see · black box
- build / us: Friday demos, weekly · staging URL from sprint 1 · direct WhatsApp to engineers · your repo, your servers
- after launch / typical: support tickets · SLA terms · escalation matrix · account manager
- after launch / us: same team on WhatsApp · no tickets · break-it-we-fix-it · forever

**The animation:**
- IntersectionObserver triggers on scroll-in
- Rows cascade top to bottom (~150ms stagger)
- Agency cells: SVG line draws across (~400ms), cell desaturates, tilts ~2°
- Us cells: amber border pulses, lifts 2px, amber tint briefly, settles
- After cascade: agency side gray + crossed, us side amber-accented
- Hover any row → replay animation just for that row

*Build estimate (internal): ~3-4 days.*

### Section 6 — Build your own + send · final interaction

**Background:** #0e0e10 with amber accents (final CTA tier)
**Layout:** Split — picker left (40%), assembled preview right (60%).

**Picker (left):** Four categories, all visible at once. Click any pill to set/change. **No budget, no timeline.**
- Business: restaurant · bank · clinic · retail · logistics · saas · d2c · manufacturing
- Need: mobile app · web app · dashboard · ai feature · internal tool · whole platform
- Stack: we recommend · react native · native ios/android · next.js · python/fastapi
- Scope: just the core · core + polish · the whole thing

**Preview (right):** As selections change, UI components animate into a device frame:
- "Mobile" → phone frame; "web" → laptop frame; "dashboard" → wide browser frame
- Business-specific UI populates inside (restaurant menu cards if restaurant; transaction table if bank; appointment booker if clinic; etc.)
- "AI feature" toggle adds an AI chat panel sliding in
- Below the device, a qualitative spec card updates with phrases like: `production-ready · friday demos · same team on call`. No engineers count, no weeks, no cost.

**WhatsApp send (below preview):** Big amber `● Send to WhatsApp` button. Click opens wa.me with pre-filled message:

> Hi! I'm building [a mobile ordering app] for [my restaurant chain]. Thinking [React Native] stack, [the whole thing] scope. Can we talk?

**Around the builder:**
- Eyebrow: `● 06 · build your own`
- H1: `Pick what you need. We'll quote it on WhatsApp.`
- Subhead: "No discovery call. No form. The configurator builds your spec. WhatsApp sends it to an engineer. We'll talk shape, scope, and what it actually takes — there."

*Build estimate (internal): ~8-10 days.*

---

## 6. Three signature elements

### 6a. Mercury laptop-zoom (Section 1 → 3 bridge)
CSS transform tied to scrollY. Pure CSS/JS, no library. *~3-4 days internal.*

### 6b. Igloo cube (Section 4)
CSS 3D transforms with hover-driven slab separation. *~6-8 days internal.*

### 6c. Resend-style decorative 3D object (optional, ambient)
Slowly rotating wireframe shape using Three.js. Placement TBD. Build LAST. *~5 days internal.*

---

## 7. Four interactive demos (right panel of Section 3)

All sit inside browser chrome frames. Space Grotesk for UI, Space Mono for code/data. **Demo content (simulated product analytics) may contain numbers — they represent fake client app data, not claims about SofSolutionsAI.**

### Demo 1 — Restaurant review widget
Clickable 5-star rating · text input · submit animates review into feed · pre-existing reviews from Indian names · toast inside the demo: "5-star reviews boost orders by 23%" (simulated product insight, fine as-is) · mini bar chart: reviews vs orders correlation
Tech tags: react native · stripe · postgres

### Demo 2 — Banking fraud detection chat
Pre-loaded conversation about ₹4,500 unauthorized charge (₹ inside the demo UI is fine — it's simulated transaction data) · visitor types question → typing indicator → bot responds with confidence score, similar cases, recommended action · system card: "Processed in 0.3s using real-time fraud detection pipeline" (simulated product metric, fine as-is)
Tech tags: typescript · kafka · redis · postgres

### Demo 3 — AI knowledge query
Split panel: chat 60% / knowledge base 40% · pre-loaded Q&A about 2FA reset · visitor types → searching animation on KB panel → AI responds with 3 cited sources · confidence meter updates dynamically
Tech tags: openai · pgvector · fastapi · python

### Demo 4 — Healthcare appointment booker
Mini week calendar · time slot pills · pre-selected doctor "Dr. Meera Patel · Cardiologist" · confirm → checkmark animation + confirmation card · counter inside the demo: "847 appointments booked this month" (simulated product metric, fine as-is)
Tech tags: next.js · mongodb · twilio · express

---

## 8. Build order — pre-written prompts for each phase

### Phase 1 — Design system foundation ✓ COMPLETE

### Phase 2 — Hero + Mercury zoom

> Using BUILD_SPEC and the design system from Phase 1, build Section 1 (Hero + configurator) and Section 2 (Mercury zoom transition) in a single HTML file. The configurator must work — both dropdowns functional, response panel updates inline. The laptop frame scales on scroll per spec. Status pills use qualitative cadence language only (no weeks, no cost). Mobile: skip the zoom, snap-scroll. Output as a single artifact.

### Phase 3 — What we ship scaffold

> Build Section 3 ("What we ship") scaffold. Sticky split layout per spec, left rail with 4 labels, right panel that cross-fades between 4 empty demo slots wrapped in browser chrome. Use placeholder content. Output as a single artifact.

### Phase 4 — Four demos (4 separate chats or continued chat)

**4a — Restaurant review:**
> Build the Restaurant review widget per spec section 7 Demo 1. Self-contained interactive component in vanilla JS. Output as a single artifact.

**4b — Banking fraud chat:** [same pattern, Demo 2]
**4c — AI knowledge query:** [same pattern, Demo 3]
**4d — Healthcare booker:** [same pattern, Demo 4]

### Phase 5 — Igloo cube (Section 4)

> Build Section 4 (How we work) with the Igloo cube metaphor per spec. Four CSS 3D slabs stack into one form at rest, hover separates with detail card. Slab labels: understand · design · build · support — each with its value-prop tagline. No weeks anywhere. Breathing animation. Mobile: degrade to vertical stacked cards. Output as a single artifact.

### Phase 6 — Animated comparison (Section 5)

> Build Section 5 (What you don't have to do) with the cascade animation per spec. SVG stroke-dasharray on agency cells, amber pulse on us cells. IntersectionObserver triggers. Hover replays per row. Sample cells from spec. Output as a single artifact.

### Phase 7 — Live builder (Section 6)

> Build Section 6 (Build your own) per spec. Four pill rows for selections (business · need · stack · scope — no budget, no timeline), right-panel preview that assembles components based on choices, qualitative spec card below preview (no weeks, no cost), WhatsApp send button with pre-filled message that excludes timeline and budget. Output as a single artifact.

### Phase 8 — Resend cube (optional decorative)

> Build the ambient 3D wireframe object per spec using Three.js (via cdn.jsdelivr.net). Slowly rotates, reacts to cursor proximity. Output as a single artifact.

### Phase 9 — Port + deploy (Claude Code)

> Port artifacts from phases 1-8 into a production Next.js 15 + Tailwind project. Use react-three-fiber for the Resend cube, Framer Motion for scroll animations. Set up Vercel deployment. Target: production-ready at sofsolutionsai.com.

---

## 9. Content Kartik still needs to write

1. Real configurator response copy for each business × need combination (Section 1) — keep qualitative voice, no specifics
2. Voice consistency pass across all sections
3. About page content (founder story, partnership structure)

---

## 10. Deploy plan

1. Register sofsolutionsai.com (namecheap or hostinger)
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
- [ ] WhatsApp links open with pre-filled messages (no pricing, no timelines in the messages)
- [ ] Configurator + builder fully functional on mobile
- [ ] Mercury zoom disabled or simplified on mobile
- [ ] Final scrub: no ₹ amounts and no week/sprint counts anywhere in customer-facing copy (demo simulated data exempt)
- [ ] 4G load time < 3 seconds

---

*End of spec v2.2. Update this doc whenever decisions change. Keep version number current.*
