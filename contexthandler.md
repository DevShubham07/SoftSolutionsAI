# Context Handoff — SoftSolutionsAI samples/nav/photo work

_Last session date: 2026-06-17. Read this top-to-bottom before continuing._

## TL;DR
A SoftSolutionsAI static portfolio site. An earlier session fixed 5 user-reported issues + 2 bugs
found while verifying + 2 adversarial-review findings.

**2026-06-17 follow-up (committed):** fixed the "more samples" mini-cards on the sample viewer
pages — they were rendering ~690px tall with the preview sliced into a vertical strip (see the
generated-viewers section below). Committed on branch `fix/samples-more-card-height`.

## Repo layout (what matters)
- `index.html` — ~4.6k-line single-page site (no framework/build). Per-section scoped `<style>`
  blocks + CSS-variable tokens. Nav + the scroll-driven "AI layer" deck (`#sec-03`) live here.
- `samples.html` — the gallery (3 cards: Solène / Vector / Atlas).
- `samples/{solene,vector,atlas}.html` — **in-site viewer pages** (SoftSolutions chrome + the live
  demo embedded in an iframe "browser frame"). GENERATED from a template — see below.
- `samples/sites/{solene,vector,atlas}.html` — the raw demo sites (large; atlas ~5MB). These are
  what the viewers iframe and what "Open full screen" opens.
- `samples/previews/{solene,vector,atlas}.jpg` — NEW. Screenshot thumbnails used on the gallery cards.
- `samples/sites/assets/*.jpg` — NEW. 12 royalty-free photos for the Solène demo.

## Tooling / how to verify (no project skill exists)
```bash
# serve
python3 -m http.server 8765   # run from repo root; pages at http://localhost:8765/...
# static screenshot (top-of-page only)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --disable-gpu --window-size=1440,900 --virtual-time-budget=5000 --screenshot=/tmp/x.png URL
```
For **scroll / hover / interaction / computed-style** checks, use puppeteer-core (already installed
at `/tmp/node_modules`): drive the real Chrome at `/Applications/Google Chrome.app/...`. Example
drivers written this session: `/tmp/drive.js`, `/tmp/checksec.js`, `/tmp/chk2.js` (may be gone if
/tmp cleared — re-create with `npm i puppeteer-core@22` in /tmp).
A local server may still be running on :8765 from last session.

## What was changed (all done + verified)

### index.html
1. **Nav hover vs active marker** (~lines 82–95): removed the hover underline `.lbl::after`
   (it looked identical to the active `.nav-marker`, which is why hovering "samples" read as
   selected). Hover is now a subtle background pill; `.nav-marker` got a `box-shadow` glow.
   The active-marker default-to-first-item logic (`index.html:~1778`, `if(!current) current =
   allTargets[0]`) was ALREADY correct from a prior commit — verified it never lands on "samples".
2. **`#sec-03` deck pager "01 email/02 chatbot/03 dashboard" was cut off**: the absolutely-
   positioned `.deck-card`s (`z-index:30`) overflow `.deck-stage{min-height:668px}` and covered the
   pager. Fix = `.deck-pager{position:relative; z-index:40;}` (line ~703) so labels render ABOVE the
   cards. NOTE: I briefly also bumped `min-height` to 704 but **reverted to 668** because on short
   desktop windows (<~920px tall) the `100vh; overflow:hidden` sticky pane (`.ailayer-sticky`,
   line ~715) clips the pager at the bottom fold. z-index alone fixes the reported bug with no
   regression. The short-viewport fold-clip is PRE-EXISTING (do not destabilize the deck to chase it
   unless asked).

### samples.html
- Cards rewritten: real `<img class="sample-shot" src="samples/previews/<name>.jpg">` previews
  instead of big letters; clearer type labels (online store / SaaS website / web app) + plain
  descriptions + feature chips. `.sample-thumb::after` gradient + `.sample-tag{z-index:2}` over image.

### samples/{solene,vector,atlas}.html — GENERATED, do not hand-edit
- **Edit the generator, not the files.** Generator script content is in git history / was at
  `/tmp/gen_viewers.py` (re-create if gone — it's a Python script with a `SAMPLES` dict + `TEMPLATE`).
  Each page: SoftSolutions header (brand, "all samples" back, prev/next arrows, "Build mine like this"
  CTA that becomes a WhatsApp icon `<560px`), intro band (type + name + lead + chips + actions),
  the live demo in a `.browser` frame (traffic lights + url bar + "live demo" pulse) iframing
  `sites/<name>.html`, a "more samples" mini-card row, footer.
- prev/next cycle: solene→vector→atlas→solene.
- Mobile header fix: `.hdr-back-t` text hidden `<820px` (arrow kept); CTA → icon-only `<560px`
  (avoids horizontal overflow that pushed it off-screen). Verified ctaVisible at 360/414px.
- a11y: added `.sr-only` class + `<h2 class="sr-only">… live … demo</h2>` + `aria-label` on `.stage`.
- **Mini-card height fix (2026-06-17):** `.mini-shot` (the "more samples" thumbnail `<img>`) had a
  width (`46%`/max `220px`) but **no height** → inside the `display:flex; align-items:stretch` card
  the img fell back to its intrinsic **688px** height, blowing each card up to ~690px tall and
  cropping the wide 1100×688 preview into a tall vertical sliver (the user's "image cut in half" /
  "these 2 don't align" reports). Fix = added `aspect-ratio:16/10;height:auto;` to the `.mini-shot`
  rule (generator `/tmp/gen_viewers.py` line ~165 + regenerated all 3 files). Cards now ~140px tall
  (desktop card 668×140 / shot 220×138; mobile card 366×117 / shot 146×115), full preview shown
  undistorted. Verified all 3 viewers × desktop+mobile via puppeteer; `git diff` was 1 line/file.
  NOTE: the fix lives in the committed HTML, so re-creating the generator from these files carries
  it forward — but if you re-create `gen_viewers.py` from memory, keep the `aspect-ratio` line.

### samples/sites/solene.html — real photos (IMPORTANT architecture note)
This demo is a **bundled/hydrated app**: the real DOM is an ESCAPED string (`/` for `/`)
injected at runtime, and **the bundler REPLACES the whole document on hydration** (wipes any
`<style>`/`<script>` you add to the original markup). A reactive framework re-renders the product
grid on cart changes (wipes inline styles). So:
- **Product photos are DATA-DRIVEN**: in the `products = [...]` array, each product's `g1`/`g2`
  background fields were changed from gradients to `url(assets/<file>) center/cover no-repeat`.
  IDs are `serum, cream, tonic, milk` (milk = "Cleansing Milk" → `p-cleanser.jpg`). `g1`=front
  (`.pimg-a`, visible by default), `g2`=hover swatch (`.pimg-b`). Survives re-renders.
- **Static slots set via an injected `<script id="ssai-photos">`** (its closures survive document
  replacement): `.hero-img .ph`, `.philo-img .ph` (portrait), `.ingr .bg` (dark block, gets a
  darkening gradient overlay), `.ctile .ph` (4 concern tiles). Runs on a 120ms interval + a
  MutationObserver (15s).
- **Caption-hiding + cover** done two ways for robustness: a `<style id="ssai-photos-css">` in the
  real `<head>` AND a runtime-injected `<style id="ssai-rt-style">` created by the script AFTER
  hydration (the only one that truly survives) — rules: `.ph-cap{display:none!important}` and
  `.ssai-photo{background-size:cover!important;...}`.
- Asset→slot map (files in `samples/sites/assets/`): `hero, p-serum, p-cream, p-tonic, p-cleanser,
  portrait, ingredient, concern-barrier, concern-lines, concern-tone, concern-hydration, swatch`.
  All from Pexels (free for commercial use, no attribution required).
- Verified via puppeteer: captions stay `display:none` and product photos persist after a cart add.

## Adversarial review result (27-agent workflow)
13 findings; 11 were "no fix needed" (links, nav cycle, iframe titles, alt text, aria-labels,
assets, product data, captions — all confirmed correct). 2 real, both FIXED: the pager short-
viewport clip (reverted min-height) and the missing live-demo heading (added sr-only h2).

## Open / optional follow-ups
- **Not committed.** When the user asks: branch from main, commit, optionally open PR (note: `gh`
  not authed — push over SSH `git@github.com:DevShubham07/SoftSolutionsAI.git`, open PR via compare URL).
- A few Solène stock photos have small visible brand labels (e.g., a Vichy tube for "Cleansing
  Milk", EMANI serum, miSolo tonic). Fine for a demo; swap on request — re-run the Pexels
  contact-sheet curation approach (search → thumbnails → view → pick → download to assets/).
- `samples/previews/solene.jpg` was regenerated AFTER photos were added (so the gallery card shows
  the photo-rich hero). If the Solène demo changes, regenerate it (screenshot `sites/solene.html`
  at 1280x800, resize to 1100w, jpg q82).

## Quick re-verify checklist for next session
1. `python3 -m http.server 8765` from repo root.
2. Home: nav marker on first item at top (not samples); scroll to #sec-03 → pager labels fully
   visible (use puppeteer to scroll; static screenshots can't render the scroll-driven deck).
3. `/samples.html` → 3 distinct cards with real previews.
4. `/samples/sites/solene.html` → real photos everywhere, no "HERO · SERUM…" placeholder captions.
5. `/samples/vector.html` at 414px → header CTA visible (WhatsApp icon), no horizontal overflow.
