# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A **static, single-page marketing/portfolio site for SoftSolutionsAI** — no framework, no
build step, no package manager. Everything ships as hand-authored HTML/CSS/JS. The site
originated as a [Claude Design](claude.ai/design) handoff bundle (see `README.md`) and has
since been turned into a real, committed site at the repo root.

The canonical site is **`index.html`** (~4.6k lines, single page). It uses per-section scoped
`<style>` blocks and CSS-variable design tokens; sections are `#sec-01`..`#sec-06`. Key
interactive pieces: the scroll-scrubbed hero video, and the scroll-driven "AI layer" card deck
at `#sec-03`.

## Layout (what matters)

- `index.html` — the production single-page site. **Generated** from `project/index.html` by
  `build_clean_index.py`, then patched by the `apply_*.py` scripts. Hand-edits are fine but see
  the regeneration note below.
- `project/` — the original Claude Design prototype bundle (`project/index.html` is the source
  prototype; many `phase-*.html` / `*standalone*.html` are per-section design iterations and
  authoring scaffolding — not the live site).
- `samples.html` — gallery page (3 cards: Solène / Vector / Atlas).
- `samples/{solene,vector,atlas}.html` — in-site viewer pages. **GENERATED from a template — do
  not hand-edit;** edit the generator (historically `/tmp/gen_viewers.py`, see git history).
- `samples/sites/{solene,vector,atlas}.html` — the raw demo sites iframed by the viewers
  (large; atlas ~5MB). `samples/sites/assets/` holds the Solène demo photos.
- `samples/previews/*.jpg` — gallery card thumbnails.
- `diag/` — `*.json` measurement dumps + `*.png` screenshots from past verification sessions
  (reference artifacts, not site assets).
- `contexthandler.md` — detailed session-handoff notes; read it for the full history and
  rationale behind specific layout fixes before touching the deck/nav/samples.

## Build / regenerate

There is no package manager or test suite. The "build" is a Python pipeline that derives the
clean root `index.html` from the design prototype and applies idempotent layout fixes:

```bash
python3 build_clean_index.py     # project/index.html -> index.html (strips design-tool scaffolding)
python3 apply_hero_handoff_fix.py   # then patch index.html in place (each is idempotent)
python3 apply_mobile_fixes.py
python3 apply_deck_mobile_stack.py
```

Each `apply_*.py` reads and rewrites `index.html` in place, asserting that every edit matches
**exactly once** — so they fail loudly if `index.html` has drifted from what they expect. Run
`build_clean_index.py` first if regenerating from scratch. Note the apply scripts target the
current `index.html`, not the prototype.

## Serve & verify (no test framework)

```bash
python3 -m http.server 8765      # run from repo root; pages at http://localhost:8765/...
```

Static top-of-page screenshot:
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --disable-gpu --window-size=1440,900 --virtual-time-budget=5000 --screenshot=/tmp/x.png <URL>
```

**Static screenshots cannot render the scroll-driven hero or the `#sec-03` deck.** For scroll /
hover / interaction / computed-style checks, drive real Chrome with puppeteer-core
(`npm i puppeteer-core@22` in a scratch dir; point `executablePath` at the Chrome above).

## Working notes / gotchas

- The Solène demo (`samples/sites/solene.html`) is a **bundled/hydrated app**: the bundler
  replaces the whole document on hydration (wiping any `<style>`/`<script>` you add to the
  original markup), and a reactive framework re-renders on cart changes. Make product-photo
  changes **data-driven** in the `products = [...]` array; static slots are set via an injected
  `<script id="ssai-photos">` whose closures survive document replacement. See `contexthandler.md`
  for the full asset→slot map.
- `#sec-02` ("what we build") uses `margin-top:-100vh` to reveal beneath the hero; nav scroll
  targeting compensates with a `+100vh` correction. The AI-layer deck cards are
  `position:absolute`, so they contribute no height — the stage height is synced from JS
  (`syncDeckHeight` / ResizeObserver). Both are deliberate; read the relevant `apply_*.py`
  docstring before changing deck/nav layout.

## Git / publishing

- `gh` is not authenticated. Push over SSH: `git@github.com:DevShubham07/SoftSolutionsAI.git`,
  and open PRs via the GitHub compare URL.
- Commit only when asked; branch from `main` for new work.
