#!/usr/bin/env python3
"""
Idempotent mobile-bug fixes for index.html (the clean SofSolutionsAI page).
Matches against true file bytes and asserts each edit hits exactly once.

A) nav "what we build" (#sec-02) lands on the hero, because #sec-02 has
   margin-top:-100vh (it reveals beneath the hero). Add a +100vh correction
   in scrollToId so the nav lands on the first solutions demo.
B) AI-layer deck on mobile: cards are position:absolute in a fixed
   min-height:760px stage, so the tall dash card overflows into the
   "how we work" section and the stack reads out of order. Replace the
   cascade with a clean vertical stack (all three in flow, in order,
   interactive).
C) "how we work" crystal: the tap-an-orbiting-3D-dot interaction is broken
   on phones. Per BUILD_SPEC ("mobile: degrade to vertical stacked cards"),
   force the existing buildFallback() grid on <=760px.
"""
import sys, re

F = 'index.html'
src = open(F, encoding='utf-8').read()
orig = src

def show_ctx(needle_start):
    i = src.find(needle_start)
    if i < 0:
        print('   (anchor not found:', repr(needle_start[:60]), ')')
        return
    print('   ctx:', repr(src[i:i+160]))

def replace_once(old, new, label):
    global src
    n = src.count(old)
    if n == 1:
        src = src.replace(old, new, 1)
        print(f'PASS  {label}')
        return True
    if n == 0 and new in src:
        print(f'SKIP  {label} (already applied)')
        return True
    print(f'FAIL  {label} (found {n}x, expected 1)')
    return False

ok = True

# ---------- A) nav scroll correction for #sec-02 ----------
A_old = ("    var el = document.getElementById(id);\n"
         "    if(!el) return;\n"
         "    var y = window.scrollY + el.getBoundingClientRect().top - (NAV_H - 8);\n"
         "    window.scrollTo({top:y, behavior: reduce.matches?'auto':'smooth'});")
A_new = ("    var el = document.getElementById(id);\n"
         "    if(!el) return;\n"
         "    /* #sec-02 (solutions) is pulled up 100vh via margin-top:-100vh so it\n"
         "       reveals beneath the hero; skip that overlap so the nav lands on the\n"
         "       first demo instead of back in the hero. */\n"
         "    var overlap = (id === 'sec-02') ? window.innerHeight : 0;\n"
         "    var y = window.scrollY + el.getBoundingClientRect().top - (NAV_H - 8) + overlap;\n"
         "    window.scrollTo({top:y, behavior: reduce.matches?'auto':'smooth'});")
if not replace_once(A_old, A_new, 'A: nav sec-02 +100vh correction'):
    ok = False; show_ctx('var y = window.scrollY + el.getBoundingClientRect().top')

# ---------- B) AI deck mobile -> vertical stack ----------
B_old = (
"#sec-03 .deck-stage{position: relative; height: auto; min-height: 760px; max-width: 480px; margin: 0 auto; display: block;}\n"
"#sec-03 .deck-card{position: absolute !important; top: 0; left: 50%; width: calc(100% - 12px) !important; transform-origin: 50% 0 !important; transition: transform 480ms var(--spring), opacity 440ms var(--ease) !important; box-shadow: rgba(0,0,0,0.55) 0 18px 44px -26px !important; cursor: pointer;}\n"
"/* Stacked-TAB cascade (height-independent): each card's title strip peeks ABOVE\n"
"   the one in front via an explicit top stagger, so all three are visible & tappable\n"
"   no matter how tall each card's content is. */\n"
"#sec-03 .deck-card.is-front{transform: translate(-50%, 104px) scale(1) !important; opacity: 1 !important; filter: none !important; z-index: 30 !important; cursor: default;}\n"
"#sec-03 .deck-card.is-mid{transform: translate(-50%, 52px) scale(0.975) !important; opacity: 0.82 !important; filter: none !important; z-index: 20 !important;}\n"
"#sec-03 .deck-card.is-back{transform: translate(-50%, 0) scale(0.95) !important; opacity: 0.62 !important; filter: none !important; z-index: 10 !important;}\n"
"#sec-03 .deck-card.is-mid:hover{opacity: 0.92 !important;}\n"
"#sec-03 .deck-card.is-back:hover{opacity: 0.74 !important;}\n"
"#sec-03 .deck-card:not(.is-front) .ai-demo, #sec-03 .deck-card:not(.is-front) .demo-caption{pointer-events: none !important;}\n"
"#sec-03 .deck-pager{display: flex !important;}\n"
)
B_new = (
"/* Mobile: drop the absolute cascade (it overflowed the fixed-height stage into\n"
"   the next section and read out of order). Stack all three cards in normal flow\n"
"   — in order, fully visible, each demo interactive. */\n"
"#sec-03 .deck-stage{position: static !important; height: auto !important; min-height: 0 !important; max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px;}\n"
"#sec-03 .deck-card{position: static !important; top: auto !important; left: auto !important; width: 100% !important; transform: none !important; transform-origin: 50% 50% !important; opacity: 1 !important; filter: none !important; z-index: auto !important; box-shadow: rgba(0,0,0,0.55) 0 18px 44px -26px !important; cursor: default !important;}\n"
"#sec-03 .deck-card::before{opacity: .45 !important;}\n"
"#sec-03 .deck-card .ai-demo, #sec-03 .deck-card .demo-caption{pointer-events: auto !important;}\n"
"#sec-03 .deck-pager{display: none !important;}\n"
)
if not replace_once(B_old, B_new, 'B: AI deck mobile vertical stack'):
    ok = False; show_ctx('#sec-03 .deck-card.is-front{transform: translate(-50%, 104px)')

# ---------- C) force crystal fallback on small screens ----------
C_old = "  if(typeof THREE==='undefined' || !webglOK()){ buildFallback(); }\n  else { initCrystal(); }"
C_new = ("  /* phones: the 3D tap-a-dot interaction is awkward and the floating card\n"
         "     can land off-screen — use the readable stacked-card fallback instead\n"
         "     (BUILD_SPEC: \"mobile: degrade to vertical stacked cards\"). */\n"
         "  var __smallScreen = window.matchMedia && window.matchMedia('(max-width: 760px)').matches;\n"
         "  if(typeof THREE==='undefined' || !webglOK() || __smallScreen){ buildFallback(); }\n"
         "  else { initCrystal(); }")
if not replace_once(C_old, C_new, 'C: crystal fallback on <=760px'):
    ok = False; show_ctx("if(typeof THREE==='undefined' || !webglOK())")

if not ok:
    print('\nNo changes written (a match failed).')
    sys.exit(1)

if src != orig:
    open(F, 'w', encoding='utf-8').write(src)
    print('\nWROTE', F, '(', len(src), 'bytes )')
else:
    print('\nNo changes needed (already applied).')
