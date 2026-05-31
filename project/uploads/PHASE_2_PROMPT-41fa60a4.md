# Phase 2 — Hero + configurator + Mercury laptop-zoom

You are continuing the SofSolutionsAI build. Phase 1 (the design system foundation) is complete and pasted as context above. **Inherit its CSS, custom properties, class names, and conventions exactly.** Do not redefine tokens, type scale, button styles, or components that already exist — reuse them by class name.

This phase delivers the homepage **Section 1 (Hero + configurator)** and **Section 2 (the Mercury laptop-zoom transition)** that bridges into a placeholder Section 3.

The output must read as the work of the same senior designer who built Phase 1 — same restraint, same typographic rigor, same anti-template instinct. **Reference standard: mercury.com's scroll-zoom, resend.com's embedded UI in hero, linear.app's restraint.**

---

## Deliverable

One HTML file. Includes Phase 1's full `<style>` block (copy it verbatim) plus the new styles needed for this phase. Vanilla HTML/CSS/JS. No frameworks. No external dependencies beyond what Phase 1 already uses (Google Fonts + Tabler).

**This file shows TWO things stacked vertically:**
1. The Hero section (Section 1) at full viewport height — dark background, configurator inside laptop frame, response panel below, CTAs
2. A placeholder Section 3 area that the laptop zoom reveals at the end of the transition

The user should be able to scroll from top of Hero down through the zoom and land cleanly in Section 3 placeholder.

---

## Section 1 — Hero composition

**Layout:** Full viewport height. Center-aligned. Dark surface using existing `.surface--dark` and `.tex-noise` + `.tex-dots-dark`.

**Top of hero (above the laptop):**
- `.page-header` rendered fully — wordmark on left (`<span class="wordmark"><span class="sof">Sof</span>SolutionsAI</span>`), nav on right with mono-lowercase links: services · work · how we work · about. Also a primary CTA button on the far right: `<button class="btn btn--primary"><span class="dot"></span>WhatsApp</button>`.
- Below the header, a small eyebrow: `<span class="eyebrow">● software studio · bengaluru + remote</span>`
- 32px below the eyebrow, a short H2 setting up the configurator: "Your business problem. Our software solution. Edit the sentence."

**The laptop (center stage):**
- Use the `.frame` class from Phase 1, sized larger — roughly 880px wide max, centered. Add the `.chrome` with traffic-light dots and the `.url` bar reading `● sofsolutionsai.com/configure`.
- Inside the laptop's body (not in the chrome), the configurator content lives. The laptop's body should be tall enough to comfortably hold the configurator sentence + response panel below it (~520-560px of content).

**Inside the laptop — the configurator:**

The sentence sits in the upper half of the laptop body, centered:

```
I run a [restaurant chain ▾] and I need [a mobile ordering app ▾].
```

Use `.h2` for sizing on the surrounding text and Phase 1's `.inline-select` pattern for the two dropdowns. The dropdowns must be functional — selecting an option updates the response panel below in real time.

**The response panel** (below the sentence, separated by 40-48px of vertical space, optionally a thin dashed `.border-dark` divider):

A bordered card-like region (use `.card` styling but make it span the full inner width of the laptop body) containing:

- A small eyebrow line at the top: `↳ HERE'S WHAT WE'D SHIP` (mono-label style, lowercase, amber dot prefix)
- 3-4 sentences of response copy (body-large), written in voice, describing what would be built. Specific to the current selection.
- A row of `.tag` chips showing tech stack relevant to the build (3-4 tags)
- A `.tag--status` pill showing timeline + cost range, e.g., `~14 weeks · ₹18–25L`
- A row at the bottom with two CTAs:
  - `<button class="btn btn--primary"><span class="dot"></span>WhatsApp us about this</button>`
  - `<button class="btn btn--ghost-dark">See a similar build<i class="ti ti-arrow-right"></i></button>`

**Content for the response panel — handle these business × need combinations explicitly, plus a sensible fallback:**

| Business | Need | Response copy | Tags | Status |
|---|---|---|---|---|
| restaurant chain | mobile ordering app | Mobile apps for F&B are our sweet spot — 8 shipped this year. We'd start with the order flow, wire up Stripe + WhatsApp ordering, sync to your kitchen display, and have something in your hands by week 4. | react native · stripe · postgres · whatsapp | ~14 weeks · ₹18–25L |
| restaurant chain | a web dashboard | A POS-grade dashboard for F&B operators — table turn, item velocity, kitchen lag, voids. We'd plug into your existing POS first, then add the layer you actually need. | next.js · postgres · clickhouse | ~10 weeks · ₹14–20L |
| bank | a web dashboard | Banking dashboards are core to what we do. We'd start with the transaction pipeline, layer in real-time fraud signals, build the reconciliation flow, and ship an ops view your auditors will trust. | typescript · kafka · redis · postgres | ~16 weeks · ₹25–40L |
| bank | an ai support agent | An LLM-backed agent inside your existing support stack — RAG over your policies, scoped to your data, escalates when it shouldn't guess. We've put 11 of these in front of real customers since 2023. | openai · pgvector · fastapi · python | ~12 weeks · ₹18–28L |
| clinic | an appointment booker | Healthcare booking flows are HIPAA-touched, ABDM-friendly. We'd build the booking engine, sync doctor availability, send SMS confirmations through Twilio, and a patient portal that doesn't feel like a webview. | next.js · mongodb · twilio · express | ~12 weeks · ₹14–22L |
| logistics company | a mobile ordering app | Last-mile driver apps with offline-first sync. Route optimization, hub dashboards, signature capture, and a back-office that doesn't fall over on Diwali. | react native · go · postgis · websockets | ~14 weeks · ₹20–30L |
| saas startup | a whole platform | A whole-stack build from auth to billing to dashboards. We move in 2-week sprints, deploy every Friday, and you'll have a working v1 long before any agency would have finished their wireframes. | next.js · typescript · stripe · supabase | ~16 weeks · ₹30–50L |

**Fallback for unspecified combinations:** A general response saying we'd scope it on a 30-minute WhatsApp call — keep the same structure (eyebrow + paragraph + tags + status). Pick sensible defaults.

**Below the laptop (outside the frame):**

- 32px down from the laptop's bottom edge: a small caption (body-sm, muted) "Edit the sentence. We'll tell you what we'd build, who we'd put on it, and how long it'd take — no form, no sales call, no slide deck."

---

## Section 2 — Mercury laptop-zoom transition

**The behavior:**

As the user scrolls down from the top of the hero:
- The laptop scales up via CSS transform, tied to scroll position
- From `scrollY = 0` to `scrollY = viewportHeight × 1.2` (i.e., one viewport plus a bit more of scroll runway), the laptop scales from `1.0` to approximately `6.0–8.0`
- At scale ~2.5+, the laptop's `.chrome` (traffic lights + URL bar) starts fading out (opacity 1 → 0) so it doesn't dominate as it grows
- At scale ~5+, the laptop's outer border and background are no longer visible — only the inner content (configurator + response panel) remains visible, scaled up to fill the viewport
- The page background simultaneously starts transitioning into Section 3's dark surface as the laptop fills the screen

**The mechanic:**

- Add scroll runway: the hero section is 100vh tall, and below it sits a 120vh "scroll spacer" that drives the zoom. Use `position: sticky` on the laptop so it locks to the viewport while the surrounding scroll happens.
- Use a single JS `requestAnimationFrame` loop that reads `window.scrollY`, computes a normalized progress (0 to 1) over the runway, and applies `transform: scale(p)` to the laptop + `opacity` to the chrome.
- Use `transform-origin: center center` on the laptop so it scales from the middle of the viewport.
- Use `will-change: transform` on the laptop element for smooth scaling.
- The configurator inside must remain interactive during the zoom — don't disable pointer-events until the very end of the zoom.

**Mobile (≤900px): skip the zoom entirely.**

On mobile, the laptop is replaced by a phone-sized variant (use Phase 1's `.phone` class concept but containing the same configurator content). No scroll-driven zoom. The hero stacks normally. Scrolling past the hero just snap-scrolls into Section 3 placeholder.

---

## Section 3 placeholder

After the zoom completes, the user lands in:

- A dark surface, full viewport height
- An eyebrow: `<span class="eyebrow">● 03 · what we ship</span>`
- A large H1: "Section 3 lives here — coming in phase 03."
- A body-large paragraph: "The Mercury zoom will reveal the sticky-scroll showcase with four interactive demos. Built next."
- The journey thread (inherit from Phase 1) should still be visible on the right and should now show the second node filled as the user crosses into Section 3.

This is purely a destination so the zoom has somewhere to land. Don't build the sticky scroll or demos — those belong to Phase 3.

---

## Quality directives (same bar as Phase 1)

- Inherit Phase 1's CSS verbatim. Add only what's new.
- Use existing classes (`.h1`, `.h1-display`, `.body-lg`, `.btn--primary`, `.eyebrow`, `.inline-select`, `.frame`, `.chrome`, `.url`, `.lights`, `.tag`, `.tag--status`, `.card`, `.surface--dark`, `.tex-noise`, `.tex-dots-dark`, `.journey`, etc.).
- Section padding stays at `var(--section-pad)` (120px) where appropriate.
- Two font weights only — 400 and 500.
- Sentence case everywhere except mono labels (lowercase tracked).
- No drop shadows. No gradients. No emoji.
- Hover states: translateY(-1px), border-color shift, 200ms ease.
- The configurator selection logic must work — selecting an option must immediately update the response panel without any spinner, delay, or page reload.
- WhatsApp button must build a `wa.me` URL with a pre-filled message containing the current selections. Example:
  `https://wa.me/91XXXXXXXXXX?text=Hi%21%20I%20run%20a%20restaurant%20chain%20and%20I%20need%20a%20mobile%20ordering%20app...`
  Use a placeholder phone number `91XXXXXXXXXX` — Kartik will replace with the real number later.

---

## Anti-template rules (still apply)

- No drop shadows. No gradients. No emoji.
- No marketing words: no "powered by", "ai-driven", "next-gen", "revolutionary".
- The laptop chrome should NOT have window minimize/maximize text or "back/forward" buttons — only the three traffic-light dots + URL bar, matching Phase 1's `.chrome` exactly.
- No bouncing animations, no parallax effects beyond the controlled zoom, no celebration animations on form actions.

---

## What this file is NOT

- Not the full homepage. Only Section 1 + zoom + Section 3 placeholder.
- Not Section 3's content. The placeholder is just a destination; the actual sticky-scroll demos come in Phase 3.
- Not a React component. Vanilla HTML + CSS + minimal JS only.
- Not a polished mobile design. Mobile should function (configurator usable, scroll works) but the polish iteration for mobile is its own pass.

---

## Output

One single HTML file containing everything. After generating, I will review:
- Does the laptop zoom feel smooth and intentional, or jumpy?
- Does the configurator update the response panel instantly?
- Does the WhatsApp URL get built correctly from current selections?
- Does the response copy feel like the same voice as Phase 1?
- Does the Section 3 placeholder set up the next phase cleanly?
- Does the journey thread still work and show the right state at each scroll position?

If any of those answer wrong, I'll respond with corrections before moving to Phase 3.
