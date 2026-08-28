#!/usr/bin/env python
"""Capture the three live client sites into samples/previews/*.jpg.

Why this exists: uptownie.com, dhanboost.com and swashaa.com all refuse to be
iframed -- uptownie/swashaa send `X-Frame-Options: DENY` + `frame-ancestors 'none'`,
dhanboost sends SAMEORIGIN. That is enforced by the browser on behalf of the embedded
site, so no CSP change on our side can override it. The six in-house samples are
same-origin and get real <iframe>s; these three get tall screenshots that the page
slowly pans, inside identical browser chrome.

Capture recipe follows contexthandler.md:115 (shoot wide, downscale to 1100w, jpg).
Chrome only writes PNG, and this machine has neither PIL nor ImageMagick, so the
PNG -> JPG step goes through ffmpeg.

Idempotent: re-run any time a client site changes. Existing files are overwritten.
"""
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ROOT, "samples", "previews")

# Tall enough to be worth panning, short enough to stay a reasonable download.
SHOT_W = 1100
SHOT_H = 2200

SITES = [
    ("uptownie",  "https://uptownie.com/"),
    ("dhanboost", "https://dhanboost.com/"),
    ("swashaa",   "https://www.swashaa.com/"),
]

CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
]


def find_chrome():
    for p in CHROME_CANDIDATES:
        if os.path.isfile(p):
            return p
    raise SystemExit("FAIL: Chrome not found. Edit CHROME_CANDIDATES.")


def find_ffmpeg():
    p = shutil.which("ffmpeg")
    if not p:
        raise SystemExit("FAIL: ffmpeg not on PATH (needed for PNG->JPG; no PIL here).")
    return p


def avg_rgb(ffmpeg, path):
    """Scale the image to 1x1 and read the pixel -- a starting point for the
    island's ambient colour. Page screenshots skew pale, so treat this as a hint
    to eyeball, not a final value."""
    try:
        out = subprocess.run(
            [ffmpeg, "-v", "error", "-i", path, "-vf", "scale=1:1",
             "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
            capture_output=True, timeout=60,
        ).stdout
        if len(out) >= 3:
            return "#%02x%02x%02x" % (out[0], out[1], out[2])
    except Exception:
        pass
    return "?"


def main():
    chrome, ffmpeg = find_chrome(), find_ffmpeg()
    if not os.path.isdir(OUT_DIR):
        raise SystemExit("FAIL: %s does not exist" % OUT_DIR)

    tmp = os.path.join(ROOT, "_shot_tmp.png")
    failures = []

    for slug, url in SITES:
        jpg = os.path.join(OUT_DIR, slug + ".jpg")
        print("capturing %-10s %s" % (slug, url))
        try:
            subprocess.run([
                chrome, "--headless=new", "--hide-scrollbars", "--disable-gpu",
                "--force-prefers-reduced-motion",
                "--window-size=%d,%d" % (SHOT_W, SHOT_H),
                "--virtual-time-budget=20000",
                "--screenshot=" + tmp, url,
            ], capture_output=True, timeout=180)
        except subprocess.TimeoutExpired:
            failures.append("%s: chrome timed out" % slug)
            continue

        if not os.path.isfile(tmp) or os.path.getsize(tmp) < 5000:
            failures.append("%s: no usable screenshot produced" % slug)
            continue

        subprocess.run([ffmpeg, "-y", "-v", "error", "-i", tmp,
                        "-q:v", "4", jpg], capture_output=True, timeout=120)
        os.remove(tmp)

        if not os.path.isfile(jpg):
            failures.append("%s: ffmpeg produced no jpg" % slug)
            continue
        print("   -> %s  %.0f KB  avg %s"
              % (os.path.relpath(jpg, ROOT), os.path.getsize(jpg) / 1024.0,
                 avg_rgb(ffmpeg, jpg)))

    if failures:
        print("\nFAILED:")
        for f in failures:
            print("  *", f)
        sys.exit(1)
    print("\nOK - %d screenshots written to samples/previews/" % len(SITES))


if __name__ == "__main__":
    main()
