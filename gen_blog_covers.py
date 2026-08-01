#!/usr/bin/env python3
"""
Generate the blog cover art: one SVG per post + one 1200x630 OG PNG per post.

Run from the repo root:  python3 gen_blog_covers.py

Outputs into blog/assets/:
  <slug>.svg      1600x900, drawn in the site's own design tokens. Used twice:
                  as the 16:9 card thumbnail on blog.html and, cropped wider
                  with object-fit:cover, as the article hero band. Everything
                  that matters is kept inside the vertical centre band
                  (y 200..700) so the 1100x340 hero crop never clips it.
  <slug>-og.png   1200x630 social card = the same motif + the post title,
                  composed in HTML and screenshotted with headless Chrome.

Why Chrome and not a Python rasteriser: cairosvg isn't installed and Pillow
can't rasterise SVG. Chrome is already the verification tool of record for this
repo (see CLAUDE.md), so it is the one dependency that is always around.

The SVGs are referenced from <img> tags, which is a sandboxed context: external
webfonts never load there. All SVG text therefore uses a generic monospace
stack and is limited to short micro-labels. The OG card is a real HTML page, so
it does get Space Grotesk / Space Mono from Google Fonts (with a system
fallback if the network is down).

Idempotent: re-running overwrites the same 6 files byte-for-byte (modulo PNG
encoder noise) and asserts every one of them landed non-empty.
"""
import os
import shutil
import subprocess
import sys
import tempfile

OUT_DIR = os.path.join("blog", "assets")

# --- design tokens (mirrored from the :root block in blog.html) --------------
BG = "#16131f"
BG_2 = "#1f1a2e"
BG_3 = "#14111d"
AMBER = "#EF9F27"
AMBER_2 = "#BA7517"
TEXT = "#f5f4f9"
MUTED = "#908ba3"
HAIR = "rgba(245,244,249,0.10)"
MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"


# --- small SVG helpers -------------------------------------------------------
def panel(x, y, w, h, fill=BG_2, stroke=HAIR, r=14, extra=""):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" '
            f'stroke="{stroke}" stroke-width="2"{extra}/>')


def label(x, y, text, size=20, fill=MUTED, weight=400, anchor="start", spacing=2.4):
    return (f'<text x="{x}" y="{y}" font-family="{MONO}" font-size="{size}" '
            f'font-weight="{weight}" fill="{fill}" letter-spacing="{spacing}" '
            f'text-anchor="{anchor}">{text}</text>')


def bar(x, y, w, h, fill, opacity=1.0, r=3):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" '
            f'fill="{fill}" opacity="{opacity}"/>')


def rail(x1, x2, y, arrow=True):
    """Horizontal amber connector with an arrowhead."""
    head = (f'<path d="M{x2} {y} l-16 -9 v18 z" fill="{AMBER}"/>') if arrow else ""
    return (f'<line x1="{x1}" y1="{y}" x2="{x2 - (14 if arrow else 0)}" y2="{y}" '
            f'stroke="{AMBER}" stroke-width="2.5" stroke-linecap="round" '
            f'stroke-dasharray="1 0"/>{head}')


def frame(body, glow_cx=800):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" role="img" aria-hidden="true">
<defs>
  <linearGradient id="bgg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#1b1727"/><stop offset="1" stop-color="{BG_3}"/>
  </linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="{AMBER}" stop-opacity="0.20"/>
    <stop offset="1" stop-color="{AMBER}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="amberdown" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{AMBER}"/><stop offset="1" stop-color="{AMBER_2}"/>
  </linearGradient>
  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
    <path d="M50 0 L0 0 0 50" fill="none" stroke="{TEXT}" stroke-opacity="0.045" stroke-width="1"/>
  </pattern>
</defs>
<rect width="1600" height="900" fill="url(#bgg)"/>
<rect width="1600" height="900" fill="url(#grid)"/>
<ellipse cx="{glow_cx}" cy="450" rx="760" ry="430" fill="url(#glow)"/>
{body}
</svg>
'''


# --- motif 1: restaurants — the order flow ----------------------------------
def cover_restaurants():
    p = []

    # three stations on one amber rail: POS -> KDS -> INVENTORY
    stations = [(150, "01", "POS", "tableside · kiosk · app"),
                (630, "02", "KDS", "bar · fry · pass"),
                (1110, "03", "INVENTORY", "recipe-level deduction")]
    for x, ix, name, sub in stations:
        p.append(panel(x, 360, 340, 190))
        p.append(label(x + 28, 404, ix, 17, AMBER, spacing=3))
        p.append(label(x + 28, 452, name, 30, TEXT, weight=700, spacing=1.4))
        p.append(label(x + 28, 492, sub, 16, MUTED, spacing=0.6))
        p.append(f'<rect x="{x + 28}" y="512" width="120" height="3" rx="1.5" fill="{AMBER}" opacity="0.55"/>')
    p.append(rail(490, 630, 455))
    p.append(rail(970, 1110, 455))

    # order tickets feeding the line from above
    for i, (t, w) in enumerate([("#1041", 150), ("#1042", 130), ("#1043", 165), ("#1044", 140)]):
        x = 150 + i * 200
        p.append(panel(x, 214, w, 84, fill=BG_3, r=10))
        p.append(label(x + 18, 248, t, 15, AMBER if i == 1 else MUTED, spacing=1.6))
        p.append(bar(x + 18, 264, w - 60, 5, TEXT, 0.16))
        p.append(bar(x + 18, 278, w - 90, 5, TEXT, 0.10))
        p.append(f'<line x1="{x + w / 2}" y1="298" x2="{x + w / 2}" y2="360" stroke="{TEXT}" '
                 f'stroke-opacity="0.13" stroke-width="2" stroke-dasharray="4 6"/>')

    # waste / margin readout along the bottom of the centre band
    p.append(f'<line x1="150" y1="640" x2="1450" y2="640" stroke="{TEXT}" stroke-opacity="0.10" stroke-width="2"/>')
    for i in range(14):
        x = 150 + i * 100
        h = [26, 40, 33, 52, 44, 61, 55, 72, 66, 84, 78, 95, 88, 104][i]
        on = i >= 8
        p.append(bar(x, 640 - h, 44, h, "url(#amberdown)" if on else TEXT, 1.0 if on else 0.13))
    p.append(label(150, 686, "food waste ↓   table turns ↑   margin ↑", 18, MUTED, spacing=2))

    # live pulse on the head of the rail
    p.append(f'<circle cx="1450" cy="455" r="9" fill="{AMBER}"/>')
    p.append(f'<circle cx="1450" cy="455" r="20" fill="none" stroke="{AMBER}" stroke-opacity="0.35" stroke-width="2"/>')
    return frame("\n".join(p))


# --- motif 2: e-commerce -> core banking ------------------------------------
def cover_scaling():
    p = []

    # left: order volume climbing
    p.append(label(170, 268, "e-commerce", 20, AMBER, spacing=3))
    p.append(label(170, 300, "orders / sec", 17, MUTED, spacing=1.2))
    base = 640
    for i in range(9):
        h = int(28 * (1.30 ** i))
        x = 170 + i * 62
        p.append(bar(x, base - h, 40, h, "url(#amberdown)" if i >= 5 else TEXT,
                     1.0 if i >= 5 else 0.14))
    p.append(f'<line x1="160" y1="{base}" x2="740" y2="{base}" stroke="{TEXT}" stroke-opacity="0.12" stroke-width="2"/>')

    # the hand-off arc
    p.append(f'<path d="M760 470 C 830 470, 830 470, 900 470" stroke="{AMBER}" stroke-width="2.5" fill="none"/>')
    p.append(f'<path d="M900 470 l-16 -9 v18 z" fill="{AMBER}"/>')
    p.append(label(760, 440, "one platform", 15, MUTED, spacing=2))

    # right: core-banking ledger, one row settling
    p.append(label(930, 268, "core banking", 20, AMBER, spacing=3))
    p.append(label(930, 300, "ledger · settlement", 17, MUTED, spacing=1.2))
    p.append(panel(920, 326, 520, 274, fill=BG_2))
    for i in range(6):
        y = 352 + i * 44
        live = i == 2
        p.append(bar(948, y, 8, 8, AMBER if live else TEXT, 1.0 if live else 0.22, r=4))
        p.append(bar(976, y, 250 if not live else 210, 8, AMBER if live else TEXT,
                     0.9 if live else 0.16, r=4))
        p.append(bar(1290, y, 124, 8, AMBER if live else TEXT, 0.55 if live else 0.10, r=4))
        if i < 5:
            p.append(f'<line x1="948" y1="{y + 26}" x2="1414" y2="{y + 26}" stroke="{TEXT}" stroke-opacity="0.07" stroke-width="1"/>')
    p.append(label(920, 638, "microservices · open APIs · fraud checks", 16, MUTED, spacing=1.4))

    p.append(label(170, 686, "elastic under load — from cart spikes to settlement windows", 18, MUTED, spacing=1.6))
    return frame("\n".join(p))


# --- motif 3: choosing the right partner ------------------------------------
def cover_choosing():
    p = []
    cols = ["vendor a", "vendor b", "vendor c", "the fit"]
    rows = ["domain depth", "agile + devops", "security / ip", "communication"]
    cw, ch, gx, gy, x0, y0 = 268, 76, 18, 14, 330, 286

    for r, rname in enumerate(rows):
        p.append(label(300, y0 + r * (ch + gy) + 47, rname, 18, MUTED, spacing=1.2, anchor="end"))

    for c, cname in enumerate(cols):
        x = x0 + c * (cw + gx)
        pick = c == 3
        p.append(label(x + cw / 2, y0 - 26, cname, 17, AMBER if pick else MUTED,
                       weight=700 if pick else 400, spacing=2.6, anchor="middle"))
        for r in range(len(rows)):
            y = y0 + r * (ch + gy)
            if pick:
                p.append(panel(x, y, cw, ch, fill="rgba(239,159,39,0.10)", stroke=AMBER, r=10))
                p.append(f'<path d="M{x + cw / 2 - 18} {y + 38} l13 14 l24 -28" fill="none" '
                         f'stroke="{AMBER}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>')
            else:
                p.append(panel(x, y, cw, ch, fill=BG_2, r=10))
                filled = [(1, 0), (0, 1), (1, 1), (0, 0)][r][c % 2]
                p.append(bar(x + 40, y + 30, 100 if filled else 64, 7, TEXT,
                             0.22 if filled else 0.11, r=3.5))
                p.append(bar(x + 40, y + 48, 62 if filled else 38, 7, TEXT,
                             0.14 if filled else 0.08, r=3.5))

    # the shortlist funnel above the matrix
    p.append(label(330, 220, "1,000s of vendors", 19, MUTED, spacing=2))
    p.append(f'<path d="M700 214 l16 -9 v18 z" fill="{AMBER}"/>')
    p.append(f'<line x1="620" y1="214" x2="700" y2="214" stroke="{AMBER}" stroke-width="2.5" stroke-linecap="round"/>')
    p.append(label(730, 220, "one partner", 19, AMBER, weight=700, spacing=2))

    p.append(label(330, 688, "scope · portfolio · agile + devops · nda / iso 27001 · source-code ownership",
                   18, MUTED, spacing=1.4))
    return frame("\n".join(p), glow_cx=1160)


# --- posts -------------------------------------------------------------------
COVERS = [
    {
        "slug": "custom-software-development-for-restaurants",
        "eyebrow": "custom software development",
        "title": "From Burnout to Profit: Custom Software Development for Restaurants",
        "draw": cover_restaurants,
    },
    {
        "slug": "from-ecommerce-to-core-banking-scaling-operations",
        "eyebrow": "custom software development",
        "title": "From E-commerce to Core Banking: Scaling Your Operations",
        "draw": cover_scaling,
    },
    {
        "slug": "how-to-choose-software-development-company-india",
        "eyebrow": "custom software development",
        "title": "How to Choose the Right Software Development Company in India",
        "draw": cover_choosing,
    },
]


# --- OG card -----------------------------------------------------------------
def og_html(svg, eyebrow, title):
    """1200x630 social card: the motif as a dimmed backdrop + the post title."""
    return f'''<!doctype html>
<html><head><meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:1200px;height:630px;overflow:hidden;background:{BG}}}
.card{{position:relative;width:1200px;height:630px;overflow:hidden}}
.art{{position:absolute;inset:0}}
.art svg{{width:100%;height:100%;object-fit:cover;opacity:.62}}
.scrim{{position:absolute;inset:0;background:
  linear-gradient(100deg,{BG} 18%,rgba(22,19,31,.82) 48%,rgba(22,19,31,.28) 100%)}}
.body{{position:absolute;inset:0;padding:64px 72px;display:flex;flex-direction:column;
  justify-content:space-between;font-family:'Space Grotesk',system-ui,sans-serif;color:{TEXT}}}
.eyebrow{{display:inline-flex;align-items:center;gap:12px;font-family:'Space Mono',ui-monospace,monospace;
  font-size:19px;letter-spacing:.12em;text-transform:lowercase;color:{MUTED}}}
.eyebrow::before{{content:"";width:9px;height:9px;border-radius:50%;background:{AMBER}}}
h1{{font-size:60px;line-height:1.1;font-weight:500;letter-spacing:-0.025em;max-width:16ch;
  background:linear-gradient(120deg,{TEXT},{AMBER_2});-webkit-background-clip:text;
  background-clip:text;-webkit-text-fill-color:transparent}}
.foot{{display:flex;align-items:center;justify-content:space-between;gap:24px}}
.wm{{font-size:29px;font-weight:500;letter-spacing:-0.015em}}
.wm .sof{{color:{AMBER}}}
.dom{{font-family:'Space Mono',ui-monospace,monospace;font-size:19px;letter-spacing:.05em;color:{MUTED}}}
.rule{{position:absolute;left:0;right:0;bottom:0;height:6px;
  background:linear-gradient(90deg,{AMBER},{AMBER_2} 62%,transparent)}}
</style></head>
<body><div class="card">
  <div class="art">{svg}</div>
  <div class="scrim"></div>
  <div class="body">
    <span class="eyebrow">{eyebrow}</span>
    <h1>{title}</h1>
    <div class="foot">
      <span class="wm"><span class="sof">Soft</span>SolutionsAI</span>
      <span class="dom">softsolutionsai.com/blog</span>
    </div>
  </div>
  <div class="rule"></div>
</div></body></html>
'''


CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
]


def find_chrome():
    for c in CHROME_CANDIDATES:
        if os.path.isfile(c):
            return c
    for name in ("google-chrome", "chromium", "chrome"):
        found = shutil.which(name)
        if found:
            return found
    return None


def shrink_png(path):
    """Halve the OG card's weight. The art is flat vector on a dark ground, so a
    256-colour adaptive palette with Floyd-Steinberg dithering is visually
    lossless here (checked against the truecolour render) — ~415KB -> ~195KB.
    No-op if Pillow isn't installed."""
    try:
        from PIL import Image
    except ImportError:
        return
    with Image.open(path) as im:
        rgb = im.convert("RGB")
    rgb.quantize(colors=256, method=Image.MEDIANCUT,
                 dither=Image.FLOYDSTEINBERG).save(path, optimize=True)


def render_png(html, out_path, chrome):
    tmp_dir = tempfile.mkdtemp(prefix="ssai-og-")
    tmp_html = os.path.join(tmp_dir, "card.html")
    with open(tmp_html, "w", encoding="utf-8") as f:
        f.write(html)
    url = "file:///" + tmp_html.replace("\\", "/")
    subprocess.run([
        chrome, "--headless=new", "--hide-scrollbars", "--disable-gpu",
        "--force-device-scale-factor=1", "--window-size=1200,630",
        "--virtual-time-budget=8000", f"--screenshot={os.path.abspath(out_path)}", url,
    ], capture_output=True, text=True, timeout=120)
    shutil.rmtree(tmp_dir, ignore_errors=True)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    chrome = find_chrome()
    if not chrome:
        print("FAIL no Chrome found — tried:\n  " + "\n  ".join(CHROME_CANDIDATES), file=sys.stderr)
        return 1
    print(f"chrome: {chrome}")

    failures = []
    for cov in COVERS:
        svg = cov["draw"]()
        svg_path = os.path.join(OUT_DIR, cov["slug"] + ".svg")
        with open(svg_path, "w", encoding="utf-8") as f:
            f.write(svg)
        print(f"WROTE {svg_path} ({len(svg.encode('utf-8')):,} bytes)")

        png_path = os.path.join(OUT_DIR, cov["slug"] + "-og.png")
        render_png(og_html(svg, cov["eyebrow"], cov["title"]), png_path, chrome)
        if os.path.exists(png_path):
            shrink_png(png_path)
        size = os.path.getsize(png_path) if os.path.exists(png_path) else 0
        if size < 1024:
            failures.append(f"{png_path} ({size} bytes)")
        else:
            print(f"WROTE {png_path} ({size:,} bytes)")

    if failures:
        print("FAIL empty/missing PNG(s):\n  " + "\n  ".join(failures), file=sys.stderr)
        return 1
    print(f"OK {len(COVERS)} covers + {len(COVERS)} og cards in {OUT_DIR}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
