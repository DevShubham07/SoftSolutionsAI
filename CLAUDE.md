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
python3 apply_seo_meta.py        # SEO: canonical + OG/Twitter + JSON-LD into index/samples/viewers,
                                 #      demote 2 secondary <h1>->h2, preload hero poster (idempotent)
python3 gen_sitemap.py           # regenerate sitemap.xml + robots.txt from the ROUTES list
```

Each `apply_*.py` reads and rewrites its target(s) in place, asserting that every edit matches
**exactly once** — so they fail loudly if the file has drifted from what they expect. Run
`build_clean_index.py` first if regenerating from scratch. Note the apply scripts target the
current `index.html`, not the prototype. `apply_seo_meta.py` also patches `samples.html` and the
5 `samples/*.html` viewer pages (canonical/OG/JSON-LD); if the viewer generator is ever restored,
fold those head tags into it. Re-run `gen_sitemap.py` (and add the new route to its `ROUTES` list)
whenever a page is added — there is no build-time sitemap step.

**SEO assets at repo root** (not generated): `og-default.png` (1200×630 social card, rendered from
a headless-Chrome HTML card), `llms.txt` (AI-crawler summary), `vercel.json` (security headers +
CSP + apex→www 308 + `/samples`→`/samples.html` + per-subdomain sample routing).

**`vercel.json` uses the legacy `routes` array — this is deliberate and load-bearing.** Vercel
evaluates `rewrites` only *after* the filesystem, so a rewrite can never beat the root
`index.html`: every sample subdomain served the marketing homepage at `/` while working correctly
on every other path. Routes listed before the `{"handle":"filesystem"}` marker run *before*
static-file lookup, which is the only way to remap `/` per-host without adding a build step or an
npm dependency for Routing Middleware. Consequences: `routes` is mutually exclusive with
`redirects`/`rewrites`/`headers`/`cleanUrls`/`trailingSlash`, so all of those must be expressed as
routes; `src` is a **regex** (not path-to-regexp), captures interpolate as `$1`; the security-header
route needs `"continue": true` so matching proceeds; and the subdomain routes now run before the
filesystem, so those hosts can no longer reach root-level files (correct isolation — each sample is
self-contained). Unknown top-level keys are rejected, so don't add a `_comment` field.

**Deferred perf work (needs real-browser verification before shipping):** three.js r128 loads
synchronously (603KB) and the hero video is `fetch()`+Blob'd in full (4.79MB) on load; deferring/
gating either requires restructuring the inline WebGL/scrub init and must be checked with
puppeteer (static screenshots can't render the hero) so the animation doesn't silently fall back.

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
- **`vector.html` / `solene.html` / `atlas.html` need two things the export doesn't provide.**
  They embed `dc-runtime` as gzip+base64 in a `<script type="__bundler/manifest">` block, and that
  runtime (a) throws `"dc-runtime: window.React is not available yet"` unless React/ReactDOM are
  already globals — React is *not* in the manifest (fonts + runtime only) and
  `<script type="__bundler/ext_resources">` is `[]`; and (b) compiles the demo's logic with
  `new Function`, so it needs `'unsafe-eval'`. Without (a) the page sits on its
  `#__bundler_thumbnail` placeholder; without (b) it renders but every `{{ expr }}` resolves empty.
  Fixes: `apply_sample_react_fix.py` injects React 18 UMD from `samples/sites/vendor/` (synchronous,
  in `<head>`, so it runs before the unpacker's DOMContentLoaded hook — the tags are wiped by the
  document swap but `window` survives), and `vercel.json` grants `'unsafe-eval'` **only** to those
  three, scoped by path for the www context and by host for the subdomains. The main site's CSP
  stays strict — verify with `curl -sI <url> | grep -i content-security-policy` that exactly one CSP
  header comes back. Their vendor `src` is absolute, paired with per-host passthrough routes; keep
  those in sync. `redwood/` (plain JS) and `eschool365/` (vendors React itself) are unaffected.
- `#sec-02` ("what we build") uses `margin-top:-100vh` to reveal beneath the hero; nav scroll
  targeting compensates with a `+100vh` correction. The AI-layer deck cards are
  `position:absolute`, so they contribute no height — the stage height is synced from JS
  (`syncDeckHeight` / ResizeObserver). Both are deliberate; read the relevant `apply_*.py`
  docstring before changing deck/nav layout.

## Git / publishing

- `gh` is not authenticated. Push over SSH: `git@github.com:DevShubham07/SoftSolutionsAI.git`,
  and open PRs via the GitHub compare URL.
- Commit only when asked; branch from `main` for new work.
