#!/usr/bin/env python3
"""
Ping IndexNow (Bing / Yandex / Naver / Seznam) with the site's URLs so they
re-crawl on demand. IndexNow feeds Bing, which in turn feeds ChatGPT Search and
Copilot — so this is a cheap AI-visibility lever after any content change.

Prereq: the key file 0f3a5dea11384ff3aecf15fdf77aec15.txt must be live at the
site root (it is committed at repo root, goes live on deploy).

Usage:
  python3 indexnow_ping.py                 # submit every route in gen_sitemap.ROUTES
  python3 indexnow_ping.py /restaurant-pos-software.html /core-banking-software.html
"""
import sys, json, urllib.request

KEY = "0f3a5dea11384ff3aecf15fdf77aec15"
HOST = "www.softsolutionsai.com"
SITE = f"https://{HOST}"
ENDPOINT = "https://api.indexnow.org/indexnow"


def all_routes():
    try:
        from gen_sitemap import ROUTES
        return [p for p, _ in ROUTES]
    except Exception as e:
        print("Could not import ROUTES from gen_sitemap.py:", e, file=sys.stderr)
        return ["/"]


def main():
    paths = sys.argv[1:] or all_routes()
    urls = [SITE + (p if p.startswith("/") else "/" + p) for p in paths]
    payload = json.dumps({
        "host": HOST,
        "key": KEY,
        "keyLocation": f"{SITE}/{KEY}.txt",
        "urlList": urls,
    }).encode("utf-8")
    req = urllib.request.Request(ENDPOINT, data=payload,
                                 headers={"Content-Type": "application/json; charset=utf-8"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            print(f"IndexNow: HTTP {r.status} for {len(urls)} URL(s)")
    except urllib.error.HTTPError as e:
        # 200/202 = accepted; 422 = URL/key mismatch; 403 = key not found at keyLocation
        print(f"IndexNow: HTTP {e.code} — {e.reason}")
        print("  (403 = key file not live yet; 422 = host/key mismatch)")
    for u in urls:
        print("  submitted:", u)


if __name__ == "__main__":
    main()
