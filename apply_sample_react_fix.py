#!/usr/bin/env python3
"""Inject React 18 into the three single-file bundler samples.

Why this is needed
------------------
vector.html / solene.html / atlas.html embed `dc-runtime` (the Claude Design
runtime) as gzip+base64 inside a <script type="__bundler/manifest"> block. That
runtime does:

    function getReact() {
      const R = window.React;
      if (!R) throw new Error("dc-runtime: window.React is not available yet");
      ...

i.e. it *requires* window.React / window.ReactDOM to already exist. But React is
not in the manifest (fonts + the runtime only), the
<script type="__bundler/ext_resources"> block is `[]` in all three files, and no
CDN URL for React appears anywhere. So the runtime threw on its first call, the
unpacker's catch fired ("Error unpacking: ..."), and each page stayed stuck on
its #__bundler_thumbnail placeholder SVG.

redwood/ (plain JS) and eschool365/ (vendors React itself) were never affected.

The fix
-------
Load React 18 UMD synchronously in <head>. It must be synchronous and in head so
it executes before DOMContentLoaded, which is when the unpacker runs. The tags
themselves are wiped when the unpacker replaces the document during hydration --
that is fine and expected, because React registers on `window`, and `window`
survives document replacement. See the Solene note in CLAUDE.md.

The src is *absolute* (/samples/sites/vendor/...) rather than relative on
purpose: these files are served both at www.../samples/sites/<name>.html and at
the bare root of their own subdomain, and on the subdomains a catch-all route
maps every path to the sample. A relative "vendor/..." would resolve differently
in each context. The absolute path is paired with per-host passthrough routes in
vercel.json -- keep the two in sync.

Idempotent: re-running is a no-op. Fails loudly if a file has drifted.
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
SAMPLES = ["vector.html", "solene.html", "atlas.html"]

MARKER = "ssai-react-vendor"
BLOCK = (
    '\n  <!-- %s: dc-runtime requires window.React/window.ReactDOM to exist before\n'
    '       hydration; neither is in the bundler manifest. Must stay synchronous and\n'
    '       in <head> so it runs before DOMContentLoaded. See apply_sample_react_fix.py -->\n'
    '  <script src="/samples/sites/vendor/react.production.min.js"></script>\n'
    '  <script src="/samples/sites/vendor/react-dom.production.min.js"></script>'
) % MARKER

TITLE_RE = re.compile(r"(<title>.*?</title>)", re.S)


def main() -> int:
    vendor = ROOT / "samples" / "sites" / "vendor"
    for dep in ("react.production.min.js", "react-dom.production.min.js"):
        if not (vendor / dep).is_file():
            sys.exit("missing vendored dependency: %s" % (vendor / dep))

    changed = 0
    for name in SAMPLES:
        path = ROOT / "samples" / "sites" / name
        html = path.read_text(encoding="utf-8", errors="surrogateescape")

        if MARKER in html:
            print("  = %-12s already patched" % name)
            continue

        matches = TITLE_RE.findall(html)
        if len(matches) != 1:
            sys.exit("%s: expected exactly 1 <title>, found %d" % (name, len(matches)))

        html = TITLE_RE.sub(lambda m: m.group(1) + BLOCK, html, count=1)
        path.write_text(html, encoding="utf-8", errors="surrogateescape")
        print("  + %-12s injected React 18" % name)
        changed += 1

    print("done (%d changed, %d already current)" % (changed, len(SAMPLES) - changed))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
