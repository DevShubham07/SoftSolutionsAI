#!/usr/bin/env python3
"""
Derive a clean, self-contained, production index.html from the Claude Design
prototype at project/index.html.

What it strips (design-tool authoring scaffolding, NOT part of the real site):
  - the React/Babel "Tweaks" control panel (comment + #tweaks-root + 3 CDN
    <script> tags + the external tweaks-panel.jsx + the inline babel block)
  - the <style id="tweak-styles"> block that styles only that panel
  - the #__bundler_thumbnail element (design-tool preview image)
  - the bundler-only <meta name="ext-resource-dependency"> hint + its comment

What it fixes / adds:
  - rewrites ./assets/ -> ./project/assets/ so the new root-level file finds
    the hero video + poster that live under project/assets/
  - keeps data-energy="electric" (the prototype's default ambient setting,
    previously applied by the now-removed tweaks panel)
  - injects production <meta> (description, theme-color, OpenGraph) + an inline
    SVG favicon (amber "S" on the dark surface) — no visual change to the page
"""
import re
import sys

INP = 'project/index.html'
OUT = 'index.html'

with open(INP, encoding='utf-8') as f:
    lines = f.readlines()

out = []
i = 0
n = len(lines)
removed = {'thumbnail': 0, 'tweak_styles': 0, 'tweaks_block': 0, 'meta': 0, 'comment': 0}

while i < n:
    line = lines[i]

    # --- bundler-only meta + its explanatory comment ---
    if 'ext-resource-dependency' in line:
        removed['meta'] += 1
        i += 1
        continue
    if 'Hero MP4 is loaded via fetch()' in line:
        removed['comment'] += 1
        i += 1
        continue

    # --- <style id="tweak-styles"> ... </style> ---
    if '<style id="tweak-styles">' in line:
        removed['tweak_styles'] += 1
        i += 1
        while i < n and '</style>' not in lines[i]:
            i += 1
        i += 1  # also drop the closing </style>
        continue

    # --- TWEAKS block: from its comment up to the </script> right before </body> ---
    if '===== TWEAKS' in line:
        removed['tweaks_block'] += 1
        i += 1
        while i < n and lines[i].strip() != '</body>':
            i += 1
        continue  # leave lines[i] == </body> for the normal path to append

    out.append(line)
    i += 1

txt = ''.join(out)

# --- bundler thumbnail (#__bundler_thumbnail): robust to single- or multi-line.
#     handles <img id=...> and a single-level <div id=...>...</div>. ---
before = len(txt)
txt = re.sub(r'\s*<template[^>]*id="__bundler_thumbnail".*?</template>', '', txt, flags=re.S)
txt = re.sub(r'\s*<div[^>]*id="__bundler_thumbnail".*?</div>', '', txt, flags=re.S)
txt = re.sub(r'\s*<img[^>]*id="__bundler_thumbnail"[^>]*/?>', '', txt, flags=re.S)
removed['thumbnail'] = 1 if len(txt) < before else 0

# repo-root placement: assets live under project/assets/
txt = txt.replace('./assets/', './project/assets/')

# preserve the prototype's default ambient (tweaks panel used to set this)
txt = txt.replace('<html lang="en">', '<html lang="en" data-energy="electric">', 1)

# production head additions (no visual change)
inject = (
    '<meta name="description" content="SofSolutionsAI is a small engineering studio that ships end-to-end custom software — from restaurant POS to core banking. Talk directly to the engineer who builds it, on WhatsApp. No agency, no sales team, no slide decks." />\n'
    '<meta name="theme-color" content="#16131f" />\n'
    '<meta property="og:type" content="website" />\n'
    '<meta property="og:title" content="SofSolutionsAI — your business problem, our software solution" />\n'
    '<meta property="og:description" content="End-to-end custom software for any business. Talk to an engineer directly on WhatsApp — no form, no sales call, no slide deck." />\n'
    '<link rel="icon" href="favicon.ico?v=2" sizes="any" />\n'
    '<link rel="icon" type="image/png" href="favicon.png?v=2" />\n'
    '<link rel="apple-touch-icon" href="favicon.png?v=2" />\n'
)
if '</title>\n' in txt:
    txt = txt.replace('</title>\n', '</title>\n' + inject, 1)
else:
    print('WARN: could not find </title> newline to inject head meta', file=sys.stderr)

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(txt)

# diagnostics
print('removed counts :', removed)
print('output bytes   :', len(txt))
print('output lines   :', txt.count(chr(10)) + 1)
print('leftover tweaks-panel.jsx :', txt.count('tweaks-panel.jsx'))
print('leftover __bundler         :', txt.count('__bundler'))
print('leftover text/babel        :', txt.count('text/babel'))
print('leftover ReactDOM          :', txt.count('ReactDOM'))
print('leftover ./assets/ (want 0):', txt.count('./assets/'))
print('./project/assets/ refs     :', txt.count('./project/assets/'))
print('<style blocks open/close   :', txt.count('<style'), '/', txt.count('</style>'))
print('<script open/close         :', txt.count('<script'), '/', txt.count('</script>'))
print('ends with </html> ?        :', txt.rstrip().endswith('</html>'))
