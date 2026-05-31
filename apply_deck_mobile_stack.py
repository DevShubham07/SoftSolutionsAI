#!/usr/bin/env python3
"""
Restore the desktop-style STACKED card deck on mobile for the AI-layer (#sec-03),
replacing the earlier "flatten to vertical list" fix (fix B).

Why the original mobile cascade overflowed: the cards are position:absolute, so they
don't contribute height to the stage; the stage used a fixed min-height:760px, and
when the tallest card was in front it spilled past the stage into the next section.

Fix: bring back the stacked cascade (front card full at +104px, mid/back peek above,
pager switches) AND size the stage to its cards from JS (syncDeckHeight) — re-run on
advance, resize, and whenever a demo's content changes height (ResizeObserver).
Idempotent; asserts each edit hits exactly once.
"""
import sys

F = 'index.html'
src = open(F, encoding='utf-8').read()
orig = src
ok = True

# ---------- 1) CSS: replace the flattened block with the stacked cascade ----------
cssA = '/* Mobile: drop the absolute cascade'
cssB = '#sec-03 .deck-pager{display: none !important;}'
i = src.find(cssA)
j = src.find(cssB)
NEW_CSS = (
"/* Mobile: keep the desktop-style stacked deck — front card shown in full, the\n"
"   other two peek above it, the pager switches cards. The stage is position:relative\n"
"   with its height synced to the cards by JS (syncDeckHeight), so the absolute cards\n"
"   never overflow into the next section the way a fixed min-height did. */\n"
"#sec-03 .deck-stage{position: relative; height: auto; min-height: 460px; max-width: 480px; margin: 0 auto; display: block; overflow: visible;}\n"
"#sec-03 .deck-card{position: absolute !important; top: 0; left: 50%; width: calc(100% - 12px) !important; transform-origin: 50% 0 !important; transition: transform 480ms var(--spring), opacity 440ms var(--ease) !important; box-shadow: rgba(0,0,0,0.55) 0 18px 44px -26px !important; cursor: pointer;}\n"
"#sec-03 .deck-card.is-front{transform: translate(-50%, 104px) scale(1) !important; opacity: 1 !important; filter: none !important; z-index: 30 !important; cursor: default;}\n"
"#sec-03 .deck-card.is-mid{transform: translate(-50%, 52px) scale(0.975) !important; opacity: 0.82 !important; filter: none !important; z-index: 20 !important;}\n"
"#sec-03 .deck-card.is-back{transform: translate(-50%, 0) scale(0.95) !important; opacity: 0.62 !important; filter: none !important; z-index: 10 !important;}\n"
"#sec-03 .deck-card.is-mid:active{opacity: 0.92 !important;}\n"
"#sec-03 .deck-card.is-back:active{opacity: 0.74 !important;}\n"
"#sec-03 .deck-card:not(.is-front) .ai-demo, #sec-03 .deck-card:not(.is-front) .demo-caption{pointer-events: none !important;}\n"
"#sec-03 .deck-pager{display: flex !important;}"
)
if i != -1 and j != -1 and j > i:
    src = src[:i] + NEW_CSS + src[j+len(cssB):]
    print('PASS  1: CSS restored to stacked cascade')
elif '#sec-03 .deck-card.is-front{transform: translate(-50%, 104px)' in src:
    print('SKIP  1: stacked CSS already present')
else:
    print('FAIL  1: could not find flattened CSS block to replace'); ok = False

# ---------- 2) JS: advanceTo early-return also syncs deck height on mobile ----------
j2_old = "      if (RM || !isDesktop() || first) { applyAmbient(true); return; }"
j2_new = "      if (RM || !isDesktop() || first) { applyAmbient(true); if (!isDesktop()) syncDeckHeight(); return; }"
if src.count(j2_old) == 1:
    src = src.replace(j2_old, j2_new, 1); print('PASS  2: advanceTo syncs height on mobile')
elif j2_new in src:
    print('SKIP  2: advanceTo already patched')
else:
    print('FAIL  2: advanceTo early-return not found'); ok = False

# ---------- 3) JS: define syncDeckHeight + ResizeObserver before init() ----------
j3_old = (
"    function init() {\n"
"      setSlots(0);\n"
"      if (isDesktop()) { activeIndex = -1; onScroll(); }\n"
"      else { advanceTo(0); }\n"
"    }\n"
"    init();"
)
j3_new = (
"    /* mobile stacked deck: the cards are position:absolute, so size the stage to\n"
"       contain them (front sits at +104px). re-runs when a demo's content height\n"
"       changes (e.g. selecting an email expands the panel) so it never overflows. */\n"
"    function syncDeckHeight() {\n"
"      if (isDesktop()) { stage.style.height = ''; return; }\n"
"      var maxB = 0;\n"
"      cardEls.forEach(function (el) {\n"
"        var off = el.classList.contains('is-front') ? 104 : el.classList.contains('is-mid') ? 52 : 0;\n"
"        var b = off + el.offsetHeight;\n"
"        if (b > maxB) maxB = b;\n"
"      });\n"
"      if (maxB) stage.style.height = maxB + 'px';\n"
"    }\n"
"    if (window.ResizeObserver) {\n"
"      var deckRO = new ResizeObserver(function () {\n"
"        if (deckRO._raf) return;\n"
"        deckRO._raf = requestAnimationFrame(function () { deckRO._raf = 0; syncDeckHeight(); });\n"
"      });\n"
"      cardEls.forEach(function (el) { deckRO.observe(el); });\n"
"    }\n"
"\n"
"    function init() {\n"
"      setSlots(0);\n"
"      if (isDesktop()) { activeIndex = -1; onScroll(); }\n"
"      else { advanceTo(0); syncDeckHeight(); }\n"
"    }\n"
"    init();"
)
if src.count(j3_old) == 1:
    src = src.replace(j3_old, j3_new, 1); print('PASS  3: syncDeckHeight + ResizeObserver added')
elif 'function syncDeckHeight()' in src:
    print('SKIP  3: syncDeckHeight already present')
else:
    print('FAIL  3: init() block not found'); ok = False

# ---------- 4) JS: resize handler re-syncs height on mobile ----------
j4_old = "        else { if (activeIndex < 0) advanceTo(0); cards.forEach(c => { c.wantRun = false; }); syncCards(); }"
j4_new = "        else { if (activeIndex < 0) advanceTo(0); cards.forEach(c => { c.wantRun = false; }); syncCards(); syncDeckHeight(); }"
if src.count(j4_old) == 1:
    src = src.replace(j4_old, j4_new, 1); print('PASS  4: resize re-syncs height')
elif j4_new in src:
    print('SKIP  4: resize already patched')
else:
    print('FAIL  4: resize mobile branch not found'); ok = False

if not ok:
    print('\nNo changes written (a match failed).'); sys.exit(1)
if src != orig:
    open(F, 'w', encoding='utf-8').write(src)
    print('\nWROTE', F, '(', len(src), 'bytes )')
else:
    print('\nNo changes needed (already applied).')
