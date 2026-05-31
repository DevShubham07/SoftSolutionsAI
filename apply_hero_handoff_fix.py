#!/usr/bin/env python3
"""
Desktop bugs in the AI-layer hand-off zone (banking demo):
  1) a faded "ghost" of the hero video shows over the banking demo, and
  2) the banking fraud-drawer close (X) does nothing on desktop.

Root cause (confirmed by elementFromPoint scan): the hero `.hero-sticky`
(z-index:2) sits above the showcase, which is pulled up beneath it
(#sec-02{margin-top:-100vh}; z-index:1). Banking is the FIRST demo, so it sits
at the top of the showcase runway — directly under the hero as it slides up and
fades. During that overlap the half-opaque video both shows over the demo
("shadow") and intercepts its clicks (incl. the drawer X). The close handler
itself works (verified by direct dispatch); the click just never reaches it.

Fix: once the scrub completes (raw >= 1) the hero has done its job — fade the
video out quickly (over ~12% of remaining runway) and set the hero
pointer-events:none so the showcase behind is clean and fully clickable.
Idempotent; asserts each edit hits exactly once.
"""
import sys
F='index.html'
s=open(F,encoding='utf-8').read(); orig=s; ok=True

# 1) capture a reference to .hero-sticky next to the other hero refs
a_old = "  const scrollCue = document.getElementById('scroll-cue');"
a_new = ("  const scrollCue = document.getElementById('scroll-cue');\n"
         "  const heroSticky = document.querySelector('.hero-scrub .hero-sticky');")
if s.count(a_old)==1:
    s=s.replace(a_old,a_new,1); print('PASS  1: heroSticky reference added')
elif 'const heroSticky = document.querySelector' in s:
    print('SKIP  1: heroSticky ref already present')
else:
    print('FAIL  1: scrollCue anchor not found'); ok=False

# 2) replace the lingering rect.bottom-based fade with a prompt post-scrub fade
#    + pointer-events handoff. NOTE: there is one stray duplicate of the
#    video.style.opacity line in the file; collapse both into the new block.
b_old = ("    var vh = window.innerHeight || 1;\n"
         "    var rel = (rect.bottom - vh * 0.40) / (vh * 0.60);\n"
         "    video.style.opacity = Math.max(0, Math.min(1, rel)).toFixed(3);\n"
         "    video.style.opacity = Math.max(0, Math.min(1, rel)).toFixed(3);")
b_old_single = ("    var vh = window.innerHeight || 1;\n"
                "    var rel = (rect.bottom - vh * 0.40) / (vh * 0.60);\n"
                "    video.style.opacity = Math.max(0, Math.min(1, rel)).toFixed(3);")
b_new = ("    var vh = window.innerHeight || 1;\n"
         "    // The scrub completes at raw==1 (progress is the clamped form). Past that\n"
         "    // the hero unpins and slides up to reveal the showcase pinned behind it.\n"
         "    // Fade the video out promptly over the next ~12% of runway AND stop the\n"
         "    // hero intercepting pointer events — otherwise the half-faded hero ghosts\n"
         "    // over the banking demo (the 'shadow') and swallows its clicks (e.g. the\n"
         "    // fraud-drawer close button) on desktop.\n"
         "    var post = Math.max(0, Math.min(1, (raw - 1) / 0.12));\n"
         "    video.style.opacity = (1 - post).toFixed(3);\n"
         "    if (heroSticky) heroSticky.style.pointerEvents = (raw >= 1) ? 'none' : '';")
if s.count(b_old)==1:
    s=s.replace(b_old,b_new,1); print('PASS  2: post-scrub fade + pointer-events handoff (collapsed dup)')
elif s.count(b_old_single)==1:
    s=s.replace(b_old_single,b_new,1); print('PASS  2: post-scrub fade + pointer-events handoff')
elif 'var post = Math.max(0, Math.min(1, (raw - 1) / 0.12));' in s:
    print('SKIP  2: handoff fade already present')
else:
    print('FAIL  2: video-fade block not found in expected form'); ok=False

if not ok:
    print('\nNo changes written.'); sys.exit(1)
if s!=orig:
    open(F,'w',encoding='utf-8').write(s); print('\nWROTE',F,'(',len(s),'bytes )')
else:
    print('\nNo changes needed.')
