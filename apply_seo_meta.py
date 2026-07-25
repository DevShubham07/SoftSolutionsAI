#!/usr/bin/env python3
"""
Idempotent SEO-meta injector for the SoftSolutionsAI static site.

Adds, to every public page's <head>, the tags the audit found missing:
  - <link rel="canonical"> (self-referencing, absolute)
  - og:url, og:image (+ dimensions), twitter:card, twitter:image
  - JSON-LD @graph (Organization/ProfessionalService + page-appropriate nodes)
And, on index.html only:
  - demotes the two secondary <h1>s to <h2> (keeps the hero <h1>), updating the
    matching #sec-04 / #sec-05 CSS selectors so visual sizing is preserved
  - preloads the hero poster (LCP) with fetchpriority="high"

Mirrors the exact idempotent contract of apply_mobile_fixes.py: each edit must
match its anchor exactly once; re-running SKIPs cleanly; if any edit fails to
match, NOTHING is written. Run from repo root:  python3 apply_seo_meta.py

The 5 samples/*.html viewers are template-generated (the generator is not in
the tree). They are byte-identical in <head>, so we patch them directly here;
if the generator is ever restored, fold these blocks into it.
"""
import sys, json

SITE = "https://www.softsolutionsai.com"
LOGO = {"@type": "ImageObject", "url": f"{SITE}/favicon.png", "width": 128, "height": 128}
OG_DEFAULT = (f"{SITE}/og-default.png", 1200, 630)

ORG_DESC = ("SoftSolutionsAI is a small engineering studio that ships end-to-end "
            "custom software — from restaurant POS to core banking. Talk directly "
            "to the engineer who builds it.")

# --- Organization / ProfessionalService node, embedded in full on every page
# (cross-document @id references are not dereferenced by Google/LLM crawlers). ---
def org_node():
    return {
        "@type": ["ProfessionalService", "Organization"],
        "@id": f"{SITE}/#organization",
        "name": "SoftSolutionsAI",
        "legalName": "LABHFORCE SOLUTION PRIVATE LIMITED",
        "taxID": "06AAGCL4957L1Z0",
        "url": f"{SITE}/",
        "logo": LOGO,
        "image": OG_DEFAULT[0],
        "description": ORG_DESC,
        "email": "info.softsolutionsai@gmail.com",
        "contactPoint": [{
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": "info.softsolutionsai@gmail.com",
            "telephone": "+91-9258494901",
            "url": "https://wa.me/919258494901",
            "availableLanguage": ["English", "Hindi"],
        }],
        "areaServed": "Worldwide",
        "knowsAbout": [
            "Custom software development",
            "Web application development",
            "E-commerce platforms",
            "School / education ERP systems",
            "Restaurant POS systems",
            "Core banking software",
            "AI-assisted software engineering",
        ],
    }


def homepage_graph():
    return {"@context": "https://schema.org", "@graph": [
        org_node(),
        {"@type": "WebSite", "@id": f"{SITE}/#website", "url": f"{SITE}/",
         "name": "SoftSolutionsAI",
         "description": ("End-to-end custom software for any business. Talk to an "
                         "engineer directly on WhatsApp — no form, no sales call, no slide deck."),
         "publisher": {"@id": f"{SITE}/#organization"}, "inLanguage": "en"},
        {"@type": "WebPage", "@id": f"{SITE}/#webpage", "url": f"{SITE}/",
         "name": "SoftSolutionsAI — your business problem, our software solution",
         "description": ORG_DESC,
         "isPartOf": {"@id": f"{SITE}/#website"},
         "about": {"@id": f"{SITE}/#organization"}, "inLanguage": "en"},
    ]}


# --- portfolio items for samples.html ItemList + per-viewer CreativeWork ---
SAMPLES = [
    ("dinevibes", "DineVibe Studio", "Marketing agency website",
     "A restaurant-growth marketing agency site — data-driven ads, social, influencer "
     "campaigns, CRM and platform optimisation, on a conversion-focused site."),
    ("eschool365", "E-School 365", "School ERP web application",
     "A full school ERP web app — role-based logins for admins, teachers and parents, "
     "with attendance, fees, salary, exams and live dashboards."),
    ("redwood", "Redwood School", "School marketing website",
     "A marketing website for a premium IB World School — curriculum, campus, leadership, "
     "virtual tour, school news and admissions."),
    ("solene", "Solène", "E-commerce storefront",
     "A D2C skincare e-commerce storefront — shop by concern, a guided routine builder, "
     "cart & checkout, and an editorial journal."),
    ("vector", "Vector", "SaaS marketing website",
     "A SaaS marketing site for a developer deploy platform — feature sections, pricing "
     "tiers, customer proof and a docs/CLI focus."),
    ("atlas", "Atlas", "AI operations dashboard web app",
     "The logged-in workspace of an AI customer-ops app — an assistant that reviews calls "
     "and emails, summarises them with cited sources, and drafts replies."),
]


def samples_graph():
    items = []
    for i, (slug, name, genre, desc) in enumerate(SAMPLES, start=1):
        items.append({
            "@type": "ListItem", "position": i,
            "item": {
                "@type": "CreativeWork", "name": name,
                "url": f"{SITE}/samples/{slug}.html",
                "description": desc,
                "image": f"{SITE}/samples/previews/{slug}.jpg",
                "genre": genre,
                "creator": {"@id": f"{SITE}/#organization"},
            },
        })
    return {"@context": "https://schema.org", "@graph": [
        org_node(),
        {"@type": "BreadcrumbList", "@id": f"{SITE}/samples.html#breadcrumb",
         "itemListElement": [
             {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
             {"@type": "ListItem", "position": 2, "name": "Samples", "item": f"{SITE}/samples.html"},
         ]},
        {"@type": "CollectionPage", "@id": f"{SITE}/samples.html#webpage",
         "url": f"{SITE}/samples.html", "name": "Samples — SoftSolutionsAI",
         "description": ("Sample sites we design and ship at SoftSolutionsAI — a restaurant "
                         "marketing agency site, a full school ERP web app, a premium school "
                         "website, a skincare e-commerce storefront, a developer deploy-platform, "
                         "and an AI customer-ops workspace app."),
         "isPartOf": {"@id": f"{SITE}/#website"},
         "about": {"@id": f"{SITE}/#organization"},
         "breadcrumb": {"@id": f"{SITE}/samples.html#breadcrumb"},
         "mainEntity": {"@id": f"{SITE}/samples.html#portfolio"}},
        {"@type": "ItemList", "@id": f"{SITE}/samples.html#portfolio",
         "name": "SoftSolutionsAI work samples", "itemListElement": items},
    ]}


def viewer_graph(slug, name, genre, desc):
    url = f"{SITE}/samples/{slug}.html"
    return {"@context": "https://schema.org", "@graph": [
        org_node(),
        {"@type": "BreadcrumbList", "@id": f"{url}#breadcrumb", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": "Samples", "item": f"{SITE}/samples.html"},
            {"@type": "ListItem", "position": 3, "name": name, "item": url},
        ]},
        {"@type": "WebPage", "@id": f"{url}#webpage", "url": url, "name": f"{name} — sample",
         "description": desc, "isPartOf": {"@id": f"{SITE}/#website"},
         "breadcrumb": {"@id": f"{url}#breadcrumb"},
         "mainEntity": {"@id": f"{url}#work"}},
        {"@type": "CreativeWork", "@id": f"{url}#work", "name": name, "url": url,
         "description": desc, "genre": genre,
         "image": f"{SITE}/samples/previews/{slug}.jpg",
         "creator": {"@id": f"{SITE}/#organization"}},
    ]}


def head_block(canonical, og_img, graph, extra_head=""):
    """The tags to inject, as a string, ending with a newline."""
    img_url, w, h = og_img
    ld = json.dumps(graph, ensure_ascii=False, indent=2)
    lines = [
        f'<link rel="canonical" href="{canonical}" />',
        f'<meta property="og:url" content="{canonical}" />',
        f'<meta property="og:image" content="{img_url}" />',
        f'<meta property="og:image:width" content="{w}" />',
        f'<meta property="og:image:height" content="{h}" />',
        '<meta name="twitter:card" content="summary_large_image" />',
        f'<meta name="twitter:image" content="{img_url}" />',
    ]
    if extra_head:
        lines.append(extra_head)
    lines.append('<script type="application/ld+json">')
    lines.append(ld)
    lines.append('</script>')
    return "\n".join(lines) + "\n"


# --- GA4 (gtag.js) — injected at end of <head> on every page, idempotently.
# Requires the CSP in vercel.json to allow googletagmanager.com + google-analytics.com. ---
GA_ID = "G-BJHB9E66T4"
GA_BLOCK = (
    '<!-- Google tag (gtag.js) -->\n'
    f'<script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>\n'
    '<script>\n'
    '  window.dataLayer = window.dataLayer || [];\n'
    '  function gtag(){dataLayer.push(arguments);}\n'
    "  gtag('js', new Date());\n"
    f"  gtag('config', '{GA_ID}');\n"
    '</script>\n'
)
GA_OLD = "</style>\n</head>"
GA_NEW = "</style>\n" + GA_BLOCK + "</head>"


# Anchor present (once) in every page: theme-color line immediately followed by
# the og:type line. We insert our block between them so the anchor is consumed
# (guarantees clean idempotency under replace_once).
ANCHOR = ('<meta name="theme-color" content="#16131f" />\n'
          '<meta property="og:type" content="website" />')


def replace_once(src, old, new, label, results):
    n = src.count(old)
    if n == 1:
        results.append((True, f"PASS  {label}"))
        return src.replace(old, new, 1)
    if n == 0 and new in src:
        results.append((True, f"SKIP  {label} (already applied)"))
        return src
    results.append((False, f"FAIL  {label} (found {n}x, expected 1)"))
    return src


def inject(src, canonical, og_img, graph, label, results, extra_head=""):
    block = head_block(canonical, og_img, graph, extra_head)
    new_anchor = ANCHOR.replace(
        '<meta property="og:type" content="website" />',
        block + '<meta property="og:type" content="website" />')
    return replace_once(src, ANCHOR, new_anchor, label, results)


def process_file(path, canonical, og_img, graph, results, extra_head="", extra_edits=None):
    with open(path, encoding="utf-8") as f:
        src = orig = f.read()
    src = inject(src, canonical, og_img, graph, f"{path}: head meta+jsonld", results, extra_head)
    src = replace_once(src, GA_OLD, GA_NEW, f"{path}: GA4 gtag", results)
    if extra_edits:
        for old, new, lbl in extra_edits:
            src = replace_once(src, old, new, f"{path}: {lbl}", results)
    return path, src, orig


def main():
    jobs = []

    # index.html — full org graph + hero-poster preload + H1 demotion
    poster_preload = ('<link rel="preload" as="image" '
                      'href="./project/assets/hero_start_frame_sm.jpg" fetchpriority="high" />')
    h1_edits = [
        ("<h1>One process. Six moments. No surprises.</h1>",
         "<h2>One process. Six moments. No surprises.</h2>",
         "demote #sec-04 h1 -> h2"),
        ("<h1>What you don't have to do.</h1>",
         "<h2>What you don't have to do.</h2>",
         "demote #sec-05 h1 -> h2"),
        ("#sec-04 h1{margin-top: 20px;", "#sec-04 h2{margin-top: 20px;",
         "css #sec-04 h1 -> h2"),
        ("#sec-05 h1{margin-top: 20px;", "#sec-05 h2{margin-top: 20px;",
         "css #sec-05 h1 -> h2"),
        # discoverability: link the vertical service pages from the homepage footer
        ('    <div class="footer-links">\n'
         '      <a href="mailto:info.softsolutionsai@gmail.com">info.softsolutionsai@gmail.com</a>',
         '    <div class="footer-links">\n'
         '      <a href="restaurant-pos-software.html">Restaurant POS</a>\n'
         '      <a href="core-banking-software.html">Core banking</a>\n'
         '      <a href="school-management-software.html">School ERP</a>\n'
         '      <a href="ecommerce-development.html">E-commerce</a>\n'
         '      <a href="samples.html">Samples</a>\n'
         '      <a href="blog.html">Blog</a>\n'
         '      <a href="mailto:info.softsolutionsai@gmail.com">info.softsolutionsai@gmail.com</a>',
         "footer: vertical-page links"),
    ]
    jobs.append(("index.html", f"{SITE}/", OG_DEFAULT, homepage_graph(),
                 poster_preload, h1_edits))

    # samples.html — portfolio collection graph
    jobs.append(("samples.html", f"{SITE}/samples.html", OG_DEFAULT,
                 samples_graph(), "", None))

    # 5 viewer pages — each with its own preview image + CreativeWork graph
    for slug, name, genre, desc in SAMPLES:
        og = (f"{SITE}/samples/previews/{slug}.jpg", 1100, 688)
        jobs.append((f"samples/{slug}.html", f"{SITE}/samples/{slug}.html", og,
                     viewer_graph(slug, name, genre, desc), "", None))

    results = []
    staged = []
    for path, canonical, og_img, graph, extra_head, extra_edits in jobs:
        try:
            staged.append(process_file(path, canonical, og_img, graph, results,
                                       extra_head, extra_edits))
        except FileNotFoundError:
            results.append((False, f"FAIL  {path}: file not found"))

    for _, msg in results:
        print(msg)

    if not all(ok for ok, _ in results):
        print("\nNo changes written (a match failed).")
        sys.exit(1)

    wrote = 0
    for path, src, orig in staged:
        if src != orig:
            with open(path, "w", encoding="utf-8") as f:
                f.write(src)
            wrote += 1
            print("WROTE", path)
    print(f"\nDone ({wrote} file(s) changed)." if wrote else "\nNo changes needed (already applied).")


if __name__ == "__main__":
    main()
