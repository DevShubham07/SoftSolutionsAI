# Redwood Science Academy — Website

A fully functional, dependency-light **static** website for Redwood Science Academy
(navy/gold serif premium school site). Plain HTML, CSS and vanilla JS — **no build step,
no framework**. Deploys as-is to Netlify, Vercel or GitHub Pages.

Every link and button resolves to a real action: a **smooth-scroll**, an **accessible modal**,
or a **real page**. There are no dead `#` links.

---

## Quick start

```bash
# from this folder — any static server works:
python3 -m http.server 8000
# then open http://localhost:8000
```

> You can also open `index.html` directly via `file://` — the shared chrome is built by
> `site.js` (not `fetch()`), so it works offline too. A server is only needed for clean URLs
> and is recommended because the 360° viewer loads from a CDN.

---

## Architecture (how it stays DRY)

The header, footer, floating UI, modals and mobile nav are **defined once** in
`assets/js/site.js` and injected into every page at runtime. Each page only contains its
own `<main>` content plus empty mount points:

```html
<header id="site-header"></header>
<main id="main">…page content…</main>
<footer id="site-footer"></footer>
<div id="site-floating"></div>
<div id="site-modals"></div>
<script defer src="…/assets/js/site.js"></script>
```

> **Why `site.js` instead of `fetch()`-ing `/partials/*.html`?** The spec allowed either.
> `fetch()` of partials breaks under the `file://` protocol (CORS) and adds a flash of empty
> chrome. Building the chrome in JS keeps a **single source of truth**, works everywhere
> (including offline), and lets us wire events the moment nodes are created. Nav/footer/modals
> live in exactly one place: `site.js`.

Each page declares its context with `data-*` attributes on `<body>`:

| attribute | purpose | example |
|---|---|---|
| `data-root` | relative path back to site root (so injected links work at any depth) | `""`, `"../"`, `"../../"`, `"/"` |
| `data-page` | page id (drives active states) | `home`, `about`, `sports` |
| `data-title` | subpage hero heading (omit on home) | `Admissions` |
| `data-subtitle` | subpage hero lede | `Inclusive, year-round admissions…` |
| `data-breadcrumb` | breadcrumb trail (` > ` separates levels) | `Student Life > Sports` |
| `data-hero-img` | subpage hero background image URL | `https://images.unsplash.com/…` |

`site.js` reads these and auto-injects the subpage hero + breadcrumb, so subpages never
hand-write chrome.

### File tree

```
redwood-science-academy/
├── index.html                  # homepage (13 sections)
├── 404.html                    # not-found page
├── README.md
├── assets/
│   ├── css/styles.css          # ALL styles (one stylesheet)
│   └── js/site.js              # ALL shared chrome + behavior (one script)
└── pages/
    ├── about.html              # ← canonical subpage template
    ├── admissions.html         # has #fees and #apply deep-link targets
    ├── academics.html
    ├── campus.html             # "Launch 360°" → Pannellum viewer
    ├── news.html               # news listing + upcoming events
    ├── news-article.html       # ?id=… data-driven article (3 stories)
    ├── careers.html            # "Work With Us"
    ├── calendar.html
    ├── the-school.html         ┐
    ├── curriculum.html         │
    ├── leadership.html         │ Explore-tile detail pages
    ├── infrastructure.html     │
    ├── virtual-tour.html       │
    ├── college-advisory.html   │
    ├── alumni.html             │
    ├── parent-connect.html     ┘
    └── student-life/
        ├── sports.html
        ├── arts.html
        └── boarding.html
```

---

## Configuration

Both constants live at the top of **`assets/js/site.js`**:

```js
// 1) FORMS — create a form at https://formspree.io and paste its endpoint:
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

// 2) 360° PANORAMA — your real equirectangular (2:1) campus photo:
const PANO_IMAGE = 'https://pannellum.org/images/alma.jpg';
```

- **`FORM_ENDPOINT`** — while it still contains `YOUR_FORM_ID` (unconfigured), every form
  **falls back to a pre-filled `mailto:`** to `admissions@redwoodscienceacademy.edu` so no
  submission is ever lost, and shows a success state + toast. Once you paste a real Formspree
  endpoint, forms POST there (with a graceful `mailto:` fallback if the network call fails).
- **`PANO_IMAGE`** — swap in your own 360° image. The viewer ([Pannellum](https://pannellum.org),
  loaded lazily from jsDelivr **only when the 360° modal is first opened**) supports drag-to-look,
  zoom and fullscreen.
- School contact details (phone, email, address, WhatsApp number) are in the `SCHOOL` object,
  also at the top of `site.js`.

---

## Element → action map (audit)

| Element | Action | Type |
|---|---|---|
| Top nav · **Work With Us** | → `pages/careers.html` | page |
| Top nav · **Apply Now** | open **Apply** modal | modal |
| Hamburger ☰ | open full-screen menu overlay | overlay |
| Menu · About / Head’s Welcome / Academics & Admissions / Campus / News / Visit | smooth-scroll to `#details` / `#welcome` / `#explore` / `#campus` / `#news` / `#findus` (→ `index.html#…` from subpages) | anchor |
| Menu · **Apply Now** | open Apply modal | modal |
| Left-edge **Upcoming Events** tab | → `#news` | anchor |
| Util bar · phone | `tel:` link | link |
| Util bar · Parent Login / Pay Fee | → `admissions.html` / `admissions.html#fees` | page |
| Hero · **Apply Now** | Apply modal | modal |
| Hero · **Book a Visit** | Visit modal | modal |
| Hero · **Scroll** cue | → `#details` | anchor |
| Welcome · ▶ play | open chat (Rae) | chat |
| 3 CTAs · Meet the Head / Schedule a Call / Apply Now | `#welcome` / Contact modal / Apply modal | anchor + modals |
| For Life · Get Newsletter / Contact | Newsletter modal / Contact modal | modals |
| **Explore** bento tiles (12) | → their detail pages (`the-school`, `curriculum`, `admissions`, `leadership` ×2, `virtual-tour`, `infrastructure`, `sports`, `arts`, `alumni`, `college-advisory`, `parent-connect`) | pages |
| Campus · tabs (View / Facilities / Tour) | swap image + caption | tabs |
| Campus · **Launch 360°** | open Pannellum panorama modal | 360 |
| News cards (3) | → `news-article.html?id=…` | page |
| News · **View All** | → `news.html` | page |
| Visit · phone / emails | `tel:` / `mailto:` links | links |
| **Ask a Question** | Question modal | modal |
| Footer · Quick Links / Student Life | → real pages | pages |
| Footer · subscribe form | inline submit → toast (Formspree/mailto) | form |
| Footer · social icons | Contact modal (replace with real URLs) | modal |
| Float · **Rae AI** | open chat panel (rule-based replies + quick chips → Visit/Apply modals) | chat |
| Float · **WhatsApp** | `https://wa.me/…` | link |
| Float · **Enquire** ✉ | Enquiry modal | modal |
| Float · **Back to top** ↑ | scroll to top (appears after 700px) | scroll |
| Mobile bottom nav (5) | scroll-spy anchors → home sections | anchor |
| Any modal | ESC / ✕ / backdrop closes; focus-trapped; validated; success + toast | modal |

**Modals:** Question, Newsletter, Contact, Enquiry, Apply, Visit — all keyboard-accessible
(focus trap, ESC, `aria-modal`, focus restore), with client-side validation, a loading state,
a success panel and a toast.

---

## Deploy

**Netlify** — drag this folder onto <https://app.netlify.com/drop>, or:
```bash
netlify deploy --dir . --prod
```
`404.html` is served automatically for unknown routes.

**Vercel** —
```bash
vercel --prod
```
(no config needed for a static site; `404.html` is picked up automatically).

**GitHub Pages** — push to a repo and enable Pages (branch = `main`, folder = `/root`).
- For a **user/org** site (`username.github.io`) the site is at `/` — works as-is.
- For a **project** site (`username.github.io/repo/`) everything is under `/repo/`. Relative
  links still work; only `404.html`'s links (which use `/…`) need the prefix — change
  `data-root="/"` and the two asset hrefs in `404.html` to `/repo/`.

---

## Self-test checklist

Desktop + mobile (resize below 880px for the mobile layout):

- [ ] Home loads; hero videos cross-fade; header turns solid after scrolling past the hero.
- [ ] Menu ☰ opens/closes (✕, ESC, link click); links smooth-scroll to the right sections.
- [ ] Every menu/mobile-nav anchor lands on its section with the sticky header offset correct.
- [ ] From a subpage, a nav/menu anchor navigates to `index.html` and jumps to the section.
- [ ] All 12 Explore tiles open their detail pages; hover/focus reveals the overlay.
- [ ] Campus tabs swap the image + caption; **Launch 360°** opens the panorama (drag, zoom, fullscreen, ESC to close).
- [ ] All 3 news cards open `news-article.html?id=…` and render the story; a bad `id` shows a friendly “not found”.
- [ ] Each form (Apply, Visit, Contact, Enquiry, Question, Newsletter, footer subscribe): empty required fields and a bad email are blocked; a valid submit shows success + toast (and opens a pre-filled email while `FORM_ENDPOINT` is unconfigured).
- [ ] Modals trap focus, close on ESC / ✕ / backdrop, and restore focus to the trigger; the page behind doesn’t scroll.
- [ ] Rae chat opens, replies to typed questions and quick chips; “Book a Visit”/“Apply” chips open their modals.
- [ ] WhatsApp, `tel:` and `mailto:` links work; Back-to-top appears after scrolling and works.
- [ ] Mobile bottom nav is visible < 880px, sits above the floats, and highlights the active section.
- [ ] Keyboard only: Skip-link works; everything is reachable; focus is visible.
- [ ] No console errors; visit `404.html` (or any unknown URL on a deploy) and confirm it renders with working links.
- [ ] **No dead links** — no `href="#"` without a `data-action` anywhere.
```bash
# quick dead-link scan (should only match data-action triggers):
grep -rn 'href="#"' --include=*.html . | grep -v 'data-action'   # expect: no output
```
