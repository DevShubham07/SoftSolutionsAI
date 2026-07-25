#!/usr/bin/env python3
"""
Generate sitemap.xml + robots.txt for the SoftSolutionsAI static site.

Run from the repo root:  python3 gen_sitemap.py

- Routes are declared in ROUTES below (URL path -> local file used for lastmod).
  Add new pages (e.g. the vertical service pages, /blog/*) here in the same
  commit that adds the file, then re-run this script.
- lastmod for each URL is the file's last *commit* date (`git log -1 %cs`),
  so editing one page bumps only that URL's date instead of all of them.
  Falls back to the file's filesystem mtime when git has no record yet.
- robots.txt allows all crawlers (incl. named AI/LLM crawlers), disallows the
  prototype scaffolding (/project/) and the raw iframed demo sites
  (/samples/sites/), and points at the sitemap.
"""
import subprocess, sys, os
from datetime import datetime, timezone

SITE = "https://www.softsolutionsai.com"

# URL path (as served)  ->  local file path (for lastmod)
ROUTES = [
    ("/",                        "index.html"),
    ("/samples.html",            "samples.html"),
    ("/samples/dinevibes.html",  "samples/dinevibes.html"),
    ("/samples/redwood.html",    "samples/redwood.html"),
    ("/samples/eschool365.html", "samples/eschool365.html"),
    ("/samples/solene.html",     "samples/solene.html"),
    ("/samples/vector.html",     "samples/vector.html"),
    ("/samples/atlas.html",      "samples/atlas.html"),
    # --- Phase 3 vertical service pages ---
    ("/ai-solutions.html",               "ai-solutions.html"),
    ("/restaurant-pos-software.html",    "restaurant-pos-software.html"),
    ("/core-banking-software.html",      "core-banking-software.html"),
    ("/school-management-software.html", "school-management-software.html"),
    ("/ecommerce-development.html",      "ecommerce-development.html"),
    # --- Phase 3.5 blog ---
    ("/blog.html",                                                   "blog.html"),
    ("/blog/from-ecommerce-to-core-banking-scaling-operations.html", "blog/from-ecommerce-to-core-banking-scaling-operations.html"),
    ("/blog/how-to-choose-software-development-company-india.html",  "blog/how-to-choose-software-development-company-india.html"),
]

# Non-indexable paths (raw iframed demos + design prototype scaffolding).
DISALLOW = ["/project/", "/samples/sites/"]

# Named AI / LLM crawlers we explicitly welcome (search + assistant retrieval).
AI_CRAWLERS = [
    "GPTBot", "ChatGPT-User", "OAI-SearchBot",
    "ClaudeBot", "Claude-Web", "anthropic-ai",
    "Google-Extended", "PerplexityBot", "PerplexityBot/1.0",
    "CCBot", "Applebot-Extended", "Bingbot",
]


def lastmod(path):
    """Last commit date (YYYY-MM-DD) for a file, or fs mtime as a fallback."""
    try:
        out = subprocess.run(
            ["git", "log", "-1", "--format=%cs", "--", path],
            capture_output=True, text=True, check=True,
        ).stdout.strip()
        if out:
            return out
    except Exception:
        pass
    try:
        ts = os.path.getmtime(path)
        return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")
    except OSError:
        return None


def build_sitemap():
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    missing = []
    for path, local in ROUTES:
        if not os.path.exists(local):
            missing.append(local)
            continue
        lm = lastmod(local)
        lines.append("  <url>")
        lines.append(f"    <loc>{SITE}{path}</loc>")
        if lm:
            lines.append(f"    <lastmod>{lm}</lastmod>")
        lines.append("  </url>")
    lines.append("</urlset>")
    if missing:
        print("WARN missing files (skipped):", ", ".join(missing), file=sys.stderr)
    return "\n".join(lines) + "\n"


def build_robots():
    out = [
        "# SoftSolutionsAI — https://www.softsolutionsai.com/",
        "# Static marketing site. Viewer pages are indexable; the raw iframed",
        "# demo sites and design-prototype scaffolding are not.",
        "",
        "User-agent: *",
        "Allow: /",
    ]
    for d in DISALLOW:
        out.append(f"Disallow: {d}")
    out.append("")
    out.append("# Named AI / LLM crawlers — explicitly allowed")
    for ua in AI_CRAWLERS:
        out += [f"User-agent: {ua}", "Allow: /", ""]
    out.append(f"Sitemap: {SITE}/sitemap.xml")
    return "\n".join(out) + "\n"


def main():
    sm = build_sitemap()
    rb = build_robots()
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sm)
    with open("robots.txt", "w", encoding="utf-8") as f:
        f.write(rb)
    n = sm.count("<loc>")
    print(f"WROTE sitemap.xml ({n} urls) + robots.txt")


if __name__ == "__main__":
    main()
