#!/usr/bin/env python3
"""
Generate the vertical service pages for SoftSolutionsAI.

Emits 4 standalone static pages at repo root, each reusing the site's design
tokens + header/footer chrome (lifted from samples.html) and carrying full SEO
head tags (canonical, OG/Twitter, JSON-LD: Organization + Service + Breadcrumb +
WebPage). Run from repo root:  python3 gen_vertical_pages.py

Honesty rule baked in: school + e-commerce map to REAL portfolio samples
(E-School 365, Solène) so those case studies are real and link to the live
build; restaurant + banking have no real client work yet, so their builds are
labelled "illustrative build" — not presented as delivered client outcomes.

After adding/removing a page here, update ROUTES in gen_sitemap.py and re-run it.
"""
import json, html

SITE = "https://www.softsolutionsai.com"
WA = ("https://wa.me/919258494901?text=Hi%20%E2%80%94%20I'd%20like%20to%20talk"
      "%20to%20an%20engineer%20directly%20about%20a%20project.")

ORG = {
    "@type": ["ProfessionalService", "Organization"],
    "@id": f"{SITE}/#organization",
    "name": "SoftSolutionsAI", "url": f"{SITE}/",
    "legalName": "LABHFORCE SOLUTION PRIVATE LIMITED",
    "taxID": "06AAGCL4957L1Z0",
    "identifier": {"@type": "PropertyValue", "name": "PAN", "value": "AAGCL4957"},
    "logo": {"@type": "ImageObject", "url": f"{SITE}/favicon.png", "width": 128, "height": 128},
    "image": f"{SITE}/og-default.png",
    "description": ("SoftSolutionsAI is a small engineering studio that ships end-to-end custom "
                    "software — from restaurant POS to core banking. Talk directly to the engineer who builds it."),
    "email": "info.softsolutionsai@gmail.com",
    "contactPoint": [{"@type": "ContactPoint", "contactType": "customer support",
                      "email": "info.softsolutionsai@gmail.com", "telephone": "+91-9258494901",
                      "url": "https://wa.me/919258494901", "availableLanguage": ["English", "Hindi"]}],
    "areaServed": "Worldwide",
}

# ---------------------------------------------------------------- per-vertical data
PAGES = [
    {
        "slug": "restaurant-pos-software",
        "accent": "#EF9F27", "accent2": "#BA7517",
        "eyebrow": "restaurant pos software",
        "title": "Custom Restaurant POS Software Development — SoftSolutionsAI",
        "meta": ("Custom restaurant POS software development — floor & table management, KDS, "
                 "covers and turn-times, card-terminal and payment integration, and back-office "
                 "reporting, built end-to-end and shipped to your own hardware. Talk to the engineer on WhatsApp."),
        "service_type": "Custom restaurant POS software development",
        "h1": "Custom restaurant POS software, built end-to-end.",
        "lead": ("We build custom restaurant point-of-sale software from scratch — floor and table "
                 "management, covers and turn-times, a kitchen display system, payments with "
                 "card-terminal integration, and back-office reporting — then ship it to your own "
                 "hardware and servers. One engineer designs and builds it, and you talk to that "
                 "engineer directly on WhatsApp: no agency, no reseller lock-in, no per-terminal SaaS tax."),
        "capabilities": [
            ("Floor & table management", "A live floor plan — open tables, merge/split checks, track covers and turn-times, and see section load at a glance."),
            ("Order entry & KDS", "Fast order entry for staff and a kitchen display system so tickets route to the right station in real time — no paper, no missed modifiers."),
            ("Payments & hardware", "Integration with your existing card terminals and receipt printers (VeriFone / Ingenico / Pine Labs-class hardware), split payments, tips and refunds."),
            ("Menu, inventory & 86ing", "Menu and modifier management, stock deduction per sale, low-stock and auto-86 rules so the floor always shows what's actually available."),
            ("Reporting & back office", "Daily sales, item mix, void/discount audit, staff and shift reports — exportable, and yours, in your own database."),
            ("Offline-first & multi-outlet", "Keeps taking orders when the internet drops and syncs on reconnect; one back office across multiple outlets when you grow."),
        ],
        "faqs": [
            ("How does a custom POS integrate with my existing card terminal and printers?",
             "That integration is the first thing we scope. We build against your specific terminal and "
             "printer models (and payment processor) rather than forcing you onto new hardware, so the "
             "system talks to what you already run on the floor. If a device only supports a proprietary "
             "SDK, we wrap it behind a clean interface so the rest of the app doesn't care."),
            ("Custom build vs. an off-the-shelf POS like Toast or Petpooja — when does custom win?",
             "Off-the-shelf wins when your operation fits its template and you're happy paying monthly per "
             "terminal forever. Custom wins when you have flows an off-the-shelf product fights you on — "
             "unusual pricing, a loyalty or franchise model, kitchen logic, or an integration it won't do — "
             "and when you'd rather own the software than rent it. We only recommend custom when it actually pays back."),
            ("How long does a custom restaurant POS take to build?",
             "A focused single-outlet POS with floor, order entry, KDS, payments and reporting is typically "
             "a few weeks to a usable first version, then iterations. You see a working build every Friday "
             "from early on, so scope stays honest and you're never waiting months to see something real."),
            ("Do I own the software and the data?",
             "Yes. The code ships to your repository and runs on your servers or hardware; the sales and "
             "customer data lives in your own database. There's no per-terminal licence and no vendor who can "
             "switch you off."),
        ],
        "case": {
            "label": "illustrative build",
            "title": "A single-outlet POS, honestly scoped",
            "body": ("The interactive restaurant demo on our homepage — a live floor plan where you tap a "
                     "table to seat covers — is an <em>illustrative</em> build, not a delivered client "
                     "project. We show it to make the flow concrete: seat a table, fire an order to the "
                     "kitchen display, take a split payment, watch turn-time tick. A real engagement starts "
                     "from your menu, your hardware and your service style, and is built the same way — one "
                     "vertical slice at a time, demoed every Friday."),
        },
        "related_sample": None,
        "cross": ["ecommerce-development", "school-management-software"],
    },
    {
        "slug": "core-banking-software",
        "accent": "#7c6cff", "accent2": "#9a8dff",
        "eyebrow": "core banking & fintech software",
        "title": "Custom Core Banking & Fintech Software Development — SoftSolutionsAI",
        "meta": ("Custom core-banking and fintech software development — ledgers, transaction "
                 "dashboards, reconciliation, real-time fraud checks and back-office tooling, built "
                 "carefully to your compliance requirements. Talk to the engineer on WhatsApp."),
        "service_type": "Custom banking and fintech software development",
        "h1": "Custom core-banking & fintech software, engineered carefully.",
        "lead": ("We build custom banking and fintech software — double-entry ledgers, transaction and "
                 "settlement dashboards, reconciliation, real-time fraud and limit checks, and the "
                 "back-office tooling around them. This is the vertical where correctness matters most, so "
                 "we build it deliberately, to your institution's compliance and audit requirements, and "
                 "you work directly with the engineer writing the code."),
        "capabilities": [
            ("Ledgers & transactions", "Double-entry ledgers, balances, holds and postings with a full immutable audit trail — the correctness core everything else sits on."),
            ("Dashboards & operations", "Real-time transaction, settlement and exposure dashboards for ops and finance teams, with drill-down and export."),
            ("Reconciliation", "Automated reconciliation across accounts, gateways and statements, with clean exception queues instead of spreadsheets."),
            ("Fraud & limit checks", "Configurable real-time rules — velocity, thresholds, anomaly flags — that score and hold transactions before they clear."),
            ("Integrations", "Payment rails, card networks, KYC/AML providers and reporting endpoints, wrapped behind interfaces you can swap without a rewrite."),
            ("Security & audit", "Role-based access, encryption, and audit logging built to the standards your auditors and regulators expect."),
        ],
        "faqs": [
            ("Are you a regulated bank or a certified processor?",
             "No — and we won't claim to be. We are a software studio that builds banking and fintech "
             "<em>software</em> to the compliance and security requirements you and your regulators define. "
             "Certifications (SOC 2, PCI DSS, ISO 27001) attach to your organisation and infrastructure; we "
             "build the system so it can meet them, and we're candid about that line rather than overselling it."),
            ("How do you handle correctness and auditability in financial software?",
             "The ledger is designed double-entry and append-only, every state change is logged with who/when/why, "
             "and money movements are covered by tests that assert balances reconcile. We favour boring, verifiable "
             "designs over clever ones here — in banking, predictability is the feature."),
            ("Build vs. buy for core banking?",
             "For a full regulated core, a proven vendor platform is often the right call. Custom software earns "
             "its place around the edges and above the core — reconciliation, dashboards, fraud rules, internal "
             "tooling and integrations that vendor platforms do poorly or charge heavily for. We'll tell you plainly "
             "which parts are worth building and which aren't."),
            ("Who can see the code and the data?",
             "You. The code ships to your repository, runs on your infrastructure, and the data stays in your "
             "controlled environment. You're never handing your financial system to a black box you can't inspect."),
        ],
        "case": {
            "label": "illustrative build",
            "title": "A fraud-check dashboard, shown honestly",
            "body": ("The banking widget on our homepage — a live transaction feed with a fraud-confidence "
                     "score — is an <em>illustrative</em> build with simulated data, not a deployed banking "
                     "system or a real client's numbers. We use it to make one slice tangible: a transaction "
                     "arrives, rules score it, a held payment surfaces for review. A real engagement is scoped "
                     "from your rails, your risk rules and your audit requirements, and built one verifiable "
                     "slice at a time."),
        },
        "related_sample": None,
        "cross": ["ecommerce-development", "restaurant-pos-software"],
    },
    {
        "slug": "school-management-software",
        "accent": "#5B47E0", "accent2": "#7c6cff",
        "eyebrow": "school management & erp software",
        "title": "Custom School Management & ERP Software Development — SoftSolutionsAI",
        "meta": ("Custom school management & ERP software development — role-based portals for admins, "
                 "teachers and parents, with attendance, fees, exams, report cards and live dashboards. "
                 "See E-School 365, a full ERP we built. Talk to the engineer on WhatsApp."),
        "service_type": "Custom school management and ERP software development",
        "h1": "Custom school management & ERP software, role by role.",
        "lead": ("We build custom school ERP software end-to-end — separate role-based workspaces for "
                 "administrators, teachers and parents, covering admissions, attendance, fees and salary, "
                 "exams and report cards, all tied together with live dashboards. You can click through a "
                 "full example right now: E-School 365 is a working ERP we built, and it's live inside this site."),
        "capabilities": [
            ("Role-based portals", "Separate, permissioned workspaces for admins, teachers, students and parents — each sees exactly what they should."),
            ("Attendance & timetables", "Daily and period attendance, timetables and substitutions, with parent visibility and alerts."),
            ("Fees & finance", "Fee structures, invoicing, online collection, receipts and dues tracking — plus staff salary and payroll if you need it."),
            ("Exams & report cards", "Exam scheduling, marks entry, grading schemes and auto-generated report cards families can access online."),
            ("Dashboards & reporting", "Live dashboards for collection, attendance and performance so leadership sees the school at a glance."),
            ("Communication", "Announcements, notices and parent messaging built in, so the school isn't stitching together WhatsApp groups and spreadsheets."),
        ],
        "faqs": [
            ("Can I see a real school ERP you've built?",
             "Yes — <a href=\"samples/eschool365.html\">open E-School 365</a>. It's a full working ERP with "
             "role-based logins for admins, teachers and parents; sign in as any role and click through "
             "attendance, fees, exams and dashboards. Your changes persist in the browser so it behaves like the "
             "real product, not a screenshot."),
            ("Do you also build the public school website, or just the ERP?",
             "Both. The ERP is the logged-in operations system; the public site is the marketing and admissions "
             "front door. We build either or both — see <a href=\"samples/redwood.html\">Redwood School</a> for a "
             "premium school website with admissions, curriculum and a virtual tour."),
            ("How long does a school ERP take, and how do we roll it out?",
             "We ship it in slices — start with the module that hurts most (often fees or attendance), get it live "
             "for real users, then add exams, report cards and dashboards. You see a working build every Friday, so "
             "the school is using value early instead of waiting for a big-bang launch."),
            ("Do we own the data and can it run on our servers?",
             "Yes. Student and finance data lives in your own database, the code ships to your repository, and it "
             "can run on your infrastructure — important for a school holding sensitive records on minors."),
        ],
        "case": {
            "label": "real build · live sample",
            "title": "E-School 365 — a full school ERP",
            "body": ("E-School 365 is a complete school ERP we designed and built: role-based logins for admins, "
                     "teachers and parents, with students, attendance, fees, salary, exams, report cards and live "
                     "dashboards. It's not a mockup — it's a working front-end you can sign into and drive, with "
                     "data that persists as you click. <a href=\"samples/eschool365.html\">Open E-School 365 →</a>"),
        },
        "related_sample": ("eschool365", "E-School 365", "Open the live school ERP"),
        "cross": ["ecommerce-development", "restaurant-pos-software"],
    },
    {
        "slug": "ecommerce-development",
        "accent": "#EF9F27", "accent2": "#BA7517",
        "eyebrow": "e-commerce development",
        "title": "Custom E-Commerce Development — Storefronts, Checkout & Inventory — SoftSolutionsAI",
        "meta": ("Custom e-commerce development — bespoke storefronts, cart and checkout, inventory and "
                 "back office, built end-to-end and owned by you. See Solène, a D2C store we built. "
                 "Talk to the engineer on WhatsApp."),
        "service_type": "Custom e-commerce development",
        "h1": "Custom e-commerce, from storefront to checkout.",
        "lead": ("We build custom e-commerce end-to-end — a storefront designed for your brand, product and "
                 "collection pages, cart and checkout, payments, and the inventory and order back office "
                 "behind it. You can explore a real one now: Solène is a D2C skincare store we built, live "
                 "inside this site — shop by concern, build a routine, and check out."),
        "capabilities": [
            ("Bespoke storefront", "A store designed for your brand, not a template — shop by concern/collection, product detail, editorial content, the lot."),
            ("Cart & checkout", "A checkout tuned for conversion — guest checkout, saved details, clear shipping and tax, and as few steps as your flow allows."),
            ("Payments", "Integration with the gateways you use (Razorpay / Stripe / PayPal-class), with refunds and order status handled properly."),
            ("Catalogue & inventory", "Products, variants, pricing and stock, with inventory that decrements on sale and warns before you oversell."),
            ("Orders & back office", "Order management, fulfilment status, customers and reporting — your operations team's daily tool."),
            ("Performance & SEO", "Fast, crawlable pages with product structured data, so the store loads quickly and shows up in search and shopping."),
        ],
        "faqs": [
            ("Can I see a real store you've built?",
             "Yes — <a href=\"samples/solene.html\">open Solène</a>, a D2C skincare storefront we built. Shop by "
             "skin concern, build a guided routine, read the journal, add to cart and go through checkout — it's a "
             "real working front-end, not a screenshot."),
            ("Custom build vs. Shopify or WooCommerce — when is custom worth it?",
             "For a straightforward catalogue, Shopify/WooCommerce is often the right, cheapest answer, and we'll "
             "say so. Custom earns its place when the platform fights your model — an unusual bundle or routine "
             "builder, a subscription or B2B pricing flow, deep back-office or ERP integration, or a brand "
             "experience the theme can't express. We recommend custom only when it pays back."),
            ("How long does a custom store take to launch?",
             "A focused storefront with catalogue, cart, checkout and payments is typically a few weeks to a "
             "launchable first version, then iteration on merchandising and conversion. You see a working build "
             "every Friday, so you're clicking through your real store early."),
            ("Do I own the store, the code and the customer data?",
             "Yes. The code ships to your repository, it runs on your hosting, and your product and customer data "
             "is yours — no platform lock-in and no revenue share on your own sales."),
        ],
        "case": {
            "label": "real build · live sample",
            "title": "Solène — a D2C skincare store",
            "body": ("Solène is a complete online store we designed and built for a skincare brand: shop by skin "
                     "concern, a guided routine builder, an editorial journal, and a full cart-and-checkout flow. "
                     "It's a real working front-end you can click through end to end. "
                     "<a href=\"samples/solene.html\">Open Solène →</a>"),
        },
        "related_sample": ("solene", "Solène", "Open the live store"),
        "cross": ["school-management-software", "restaurant-pos-software"],
    },
]
PAGE_BY_SLUG = {p["slug"]: p for p in PAGES}


def esc(s):
    return html.escape(s, quote=True)


def jsonld(page):
    url = f"{SITE}/{page['slug']}.html"
    graph = [
        ORG,
        {"@type": "BreadcrumbList", "@id": f"{url}#breadcrumb", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": page_short(page), "item": url},
        ]},
        {"@type": "Service", "@id": f"{url}#service",
         "name": page["service_type"], "serviceType": page["service_type"],
         "provider": {"@id": f"{SITE}/#organization"}, "areaServed": "Worldwide",
         "description": page["meta"], "url": url},
        {"@type": "WebPage", "@id": f"{url}#webpage", "url": url, "name": page["title"],
         "description": page["meta"], "isPartOf": {"@id": f"{SITE}/#website"},
         "about": {"@id": f"{url}#service"}, "breadcrumb": {"@id": f"{url}#breadcrumb"},
         "inLanguage": "en"},
    ]
    return json.dumps({"@context": "https://schema.org", "@graph": graph},
                      ensure_ascii=False, indent=2)


def page_short(page):
    return {"restaurant-pos-software": "Restaurant POS software",
            "core-banking-software": "Core banking software",
            "school-management-software": "School management software",
            "ecommerce-development": "E-commerce development"}[page["slug"]]


NAV_LINKS = [
    ("restaurant-pos-software.html", "Restaurant POS"),
    ("core-banking-software.html", "Core banking"),
    ("school-management-software.html", "School ERP"),
    ("ecommerce-development.html", "E-commerce"),
]


def render(page):
    url = f"{SITE}/{page['slug']}.html"
    caps = "\n".join(
        f'        <div class="cap"><h3>{esc(t)}</h3><p>{esc(d)}</p></div>'
        for t, d in page["capabilities"])
    faqs = "\n".join(
        f'      <div class="qa"><h2>{esc(q)}</h2><p>{a}</p></div>'
        for q, a in page["faqs"])
    def nav_item(href, label):
        cur = ' aria-current="page"' if href.startswith(page["slug"]) else ''
        return f'          <a href="{href}"{cur}>{esc(label)}</a>'
    solutions_nav = "\n".join(nav_item(h, l) for h, l in NAV_LINKS)
    cross = "\n".join(
        f'        <a class="rel-card" href="{PAGE_BY_SLUG[s]["slug"]}.html">'
        f'<span class="rel-k">{esc(page_short(PAGE_BY_SLUG[s]))}</span>'
        f'<span class="rel-arr" aria-hidden="true">→</span></a>'
        for s in page["cross"])

    sample_cta = ""
    if page["related_sample"]:
        slug, name, label = page["related_sample"]
        sample_cta = (f'\n        <a class="btn btn--ghost" href="samples/{slug}.html">'
                      f'<span class="dot"></span>{esc(label)}</a>')

    return f"""<!doctype html>
<html lang="en" data-energy="electric">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{esc(page['title'])}</title>
<meta name="description" content="{esc(page['meta'])}" />
<meta name="theme-color" content="#16131f" />
<link rel="canonical" href="{url}" />
<meta property="og:url" content="{url}" />
<meta property="og:image" content="{SITE}/og-default.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="{SITE}/og-default.png" />
<script type="application/ld+json">
{jsonld(page)}
</script>
<meta property="og:type" content="website" />
<meta property="og:title" content="{esc(page['title'])}" />
<meta property="og:description" content="{esc(page['meta'])}" />
<link rel="icon" href="favicon.ico?v=2" sizes="any" />
<link rel="icon" type="image/png" href="favicon.png?v=2" />
<link rel="apple-touch-icon" href="favicon.png?v=2" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap" onload="this.onload=null;this.rel='stylesheet'" />
<noscript><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" /></noscript>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-BJHB9E66T4"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', 'G-BJHB9E66T4');
</script>
<style>
*{{box-sizing:border-box;}}
html,body{{margin:0;padding:0;}}
html{{scroll-behavior:smooth;}}
body{{font-family:var(--font-sans);font-weight:400;font-size:16px;line-height:1.6;background:var(--bg-dark);color:var(--text-on-dark);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;}}
::selection{{background:var(--accent);color:#1a1a1a;}}
:root{{
  --bg-dark:#16131f; --bg-dark-2:#1f1a2e; --bg-dark-3:#14111d;
  --accent:{page['accent']}; --accent-2:{page['accent2']};
  --accent-amber:#EF9F27;
  --text-on-dark:#f5f4f9; --muted-on-dark:#908ba3;
  --border-dark:rgba(245,244,249,0.10); --border-dark-strong:rgba(245,244,249,0.20);
  --font-sans:'Space Grotesk', system-ui, sans-serif;
  --font-mono:'Space Mono', ui-monospace, monospace;
  --container:1100px; --pad:32px;
  --r-sm:4px; --r-md:8px; --r-lg:12px; --r-pill:999px;
  --ease:cubic-bezier(.22,.61,.36,1);
}}
.eyebrow{{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:12px;letter-spacing:0.12em;text-transform:lowercase;color:var(--muted-on-dark);}}
.eyebrow::before{{content:"";width:6px;height:6px;border-radius:50%;background:var(--accent);display:inline-block;flex:none;}}
.btn{{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-sans);font-weight:500;font-size:14px;padding:12px 20px;border-radius:var(--r-pill);border:1px solid transparent;cursor:pointer;text-decoration:none;transition:transform .2s var(--ease),border-color .2s var(--ease),background-color .2s var(--ease);line-height:1;white-space:nowrap;min-height:44px;}}
.btn .dot{{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.9;}}
.btn--primary{{background:var(--accent-amber);color:#1a1a1a;border-color:var(--accent-amber);}}
.btn--primary:hover{{transform:translateY(-1px);}}
.btn--ghost{{background:transparent;color:var(--text-on-dark);border-color:var(--border-dark-strong);}}
.btn--ghost:hover{{border-color:var(--accent);color:var(--accent);}}
.btn:focus-visible,a:focus-visible{{outline:2px solid var(--accent);outline-offset:2px;border-radius:var(--r-sm);}}

.site-header{{position:fixed;top:0;left:0;right:0;z-index:300;height:68px;background:rgba(22,19,31,0.82);backdrop-filter:blur(12px) saturate(1.1);-webkit-backdrop-filter:blur(12px) saturate(1.1);border-bottom:1px solid var(--border-dark);}}
.nav-inner{{position:relative;height:100%;max-width:var(--container);margin:0 auto;display:flex;align-items:center;gap:16px;padding:0 max(var(--pad),24px);}}
.site-brand{{display:inline-flex;align-items:center;gap:11px;text-decoration:none;color:var(--text-on-dark);flex:0 0 auto;}}
.brand-mark{{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border:1px solid var(--border-dark-strong);border-radius:var(--r-sm);overflow:hidden;}}
.site-brand .wm{{font-family:var(--font-sans);font-weight:500;font-size:19px;letter-spacing:-0.015em;line-height:1;}}
.site-brand .wm .sof{{color:var(--accent-amber);}}
.nav-cta-group{{display:flex;align-items:center;gap:14px;flex:0 0 auto;margin-left:auto;}}
.back-link{{display:inline-flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:13px;letter-spacing:0.03em;color:var(--muted-on-dark);text-decoration:none;transition:color .2s var(--ease);}}
.back-link:hover{{color:var(--text-on-dark);}}

main{{padding-top:68px;}}
.wrap{{max-width:var(--container);margin:0 auto;padding:0 max(var(--pad),24px);}}
.crumb{{font-family:var(--font-mono);font-size:12px;letter-spacing:.03em;color:var(--muted-on-dark);padding:24px 0 0;}}
.crumb a{{color:var(--muted-on-dark);text-decoration:none;}}
.crumb a:hover{{color:var(--accent);}}
.hero{{padding:40px 0 26px;}}
.hero h1{{font-size:clamp(34px,5.2vw,58px);line-height:1.04;font-weight:500;letter-spacing:-0.025em;margin:16px 0 0;max-width:18ch;background:linear-gradient(120deg,var(--text-on-dark),var(--accent-2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}}
.hero .lead{{font-size:18px;line-height:1.6;color:#cdc8d9;margin:22px 0 0;max-width:64ch;}}
.cta-row{{display:flex;flex-wrap:wrap;gap:14px;margin-top:30px;}}

.sol-nav{{display:flex;flex-wrap:wrap;gap:8px;margin-top:34px;padding-top:26px;border-top:1px solid var(--border-dark);}}
.sol-nav a{{font-family:var(--font-mono);font-size:12.5px;letter-spacing:.02em;color:var(--muted-on-dark);text-decoration:none;border:1px solid var(--border-dark);border-radius:var(--r-pill);padding:7px 14px;transition:.2s var(--ease);}}
.sol-nav a:hover{{color:var(--text-on-dark);border-color:var(--border-dark-strong);}}
.sol-nav a[aria-current="page"]{{color:#1a1a1a;background:var(--accent);border-color:var(--accent);}}

section.block{{padding:44px 0;border-top:1px solid var(--border-dark);}}
section.block h2.sec{{font-size:clamp(24px,3.2vw,32px);font-weight:500;letter-spacing:-0.02em;margin:0 0 6px;}}
section.block .sec-sub{{color:var(--muted-on-dark);margin:0 0 26px;max-width:60ch;}}
.caps{{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}}
.cap{{background:var(--bg-dark-2);border:1px solid var(--border-dark);border-radius:var(--r-lg);padding:22px;}}
.cap h3{{font-size:17px;font-weight:500;margin:0 0 8px;letter-spacing:-0.01em;}}
.cap p{{font-size:14.5px;line-height:1.55;color:var(--muted-on-dark);margin:0;}}

.qa{{margin:0 0 22px;padding:0 0 22px;border-bottom:1px solid var(--border-dark);max-width:72ch;}}
.qa:last-child{{border-bottom:none;}}
.qa h2{{font-size:19px;font-weight:500;letter-spacing:-0.01em;margin:0 0 8px;}}
.qa p{{color:#cdc8d9;margin:0;font-size:15.5px;line-height:1.6;}}
.qa a{{color:var(--accent);}}

.case{{background:linear-gradient(150deg,var(--bg-dark-2),var(--bg-dark-3));border:1px solid var(--border-dark);border-radius:var(--r-lg);padding:30px;}}
.case .clabel{{display:inline-block;font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;text-transform:lowercase;color:var(--accent);border:1px solid var(--accent);border-radius:var(--r-pill);padding:4px 12px;}}
.case h3{{font-size:22px;font-weight:500;letter-spacing:-0.02em;margin:16px 0 10px;}}
.case p{{color:#cdc8d9;margin:0;line-height:1.6;max-width:70ch;}}
.case a{{color:var(--accent);font-weight:500;}}

.why{{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}}
.why div{{border:1px solid var(--border-dark);border-radius:var(--r-lg);padding:20px;}}
.why h3{{font-size:16px;font-weight:500;margin:0 0 6px;}}
.why p{{font-size:14px;color:var(--muted-on-dark);margin:0;line-height:1.5;}}

.rel{{display:flex;flex-wrap:wrap;gap:12px;}}
.rel-card{{display:inline-flex;align-items:center;gap:12px;background:var(--bg-dark-2);border:1px solid var(--border-dark);border-radius:var(--r-pill);padding:11px 18px;text-decoration:none;color:var(--text-on-dark);font-size:14px;transition:.2s var(--ease);}}
.rel-card:hover{{border-color:var(--accent);color:var(--accent);}}
.rel-k{{font-weight:500;}}
.final{{text-align:center;padding:64px 0 12px;}}
.final h2{{font-size:clamp(26px,3.6vw,38px);font-weight:500;letter-spacing:-0.02em;margin:0 0 10px;}}
.final p{{color:var(--muted-on-dark);margin:0 auto 26px;max-width:52ch;}}

.site-footer{{position:relative;z-index:1;background:var(--bg-dark);border-top:1px solid var(--border-dark);padding:56px max(var(--pad),24px) 64px;margin-top:40px;}}
.footer-inner{{max-width:var(--container);margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:20px 40px;}}
.footer-links{{display:flex;flex-wrap:wrap;gap:14px 26px;align-items:center;margin-left:auto;}}
.footer-links a{{display:inline-flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:13px;letter-spacing:0.03em;color:var(--muted-on-dark);text-decoration:none;transition:color .2s var(--ease);}}
.footer-links a:hover{{color:var(--accent-amber);}}
.footer-links .dot-wa{{width:7px;height:7px;border-radius:50%;background:var(--accent-amber);}}
.footer-copy{{flex-basis:100%;font-family:var(--font-mono);font-size:11px;letter-spacing:0.04em;color:var(--muted-on-dark);margin-top:8px;}}

@media (max-width:900px){{
  .caps,.why{{grid-template-columns:1fr;}}
  .footer-inner{{flex-direction:column;align-items:flex-start;gap:18px;}}
  .footer-links{{flex-direction:column;align-items:flex-start;margin-left:0;gap:6px;}}
}}
@media (max-width:600px){{ .back-link{{display:none;}} }}
@media (prefers-reduced-motion:reduce){{ html{{scroll-behavior:auto;}} .btn,.rel-card{{transition:none;}} }}
</style>
</head>
<body>

<header class="site-header">
  <nav class="nav-inner" aria-label="primary">
    <a class="site-brand" href="index.html#top">
      <span class="brand-mark" aria-hidden="true"><img src="favicon.png?v=2" alt="" width="30" height="30" style="width:100%;height:100%;object-fit:cover;border-radius:3px;display:block;" /></span>
      <span class="wm"><span class="sof">Soft</span>SolutionsAI</span>
    </a>
    <div class="nav-cta-group">
      <a class="back-link" href="index.html#top"><span aria-hidden="true">←</span> back to site</a>
      <a class="btn btn--primary" href="{WA}" target="_blank" rel="noopener"><span class="dot"></span>Start on WhatsApp</a>
    </div>
  </nav>
</header>

<main>
  <div class="wrap">
    <nav class="crumb" aria-label="breadcrumb"><a href="index.html#top">Home</a> &nbsp;/&nbsp; {esc(page_short(page))}</nav>
  </div>

  <section class="hero">
    <div class="wrap">
      <span class="eyebrow">{esc(page['eyebrow'])}</span>
      <h1>{esc(page['h1'])}</h1>
      <p class="lead">{esc(page['lead'])}</p>
      <div class="cta-row">
        <a class="btn btn--primary" href="{WA}" target="_blank" rel="noopener"><span class="dot"></span>Start on WhatsApp</a>{sample_cta}
      </div>
      <nav class="sol-nav" aria-label="solutions">
{solutions_nav}
      </nav>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <h2 class="sec">What a custom {esc(page_short(page).lower())} build includes</h2>
      <p class="sec-sub">Every project is bespoke — this is the ground the work usually covers.</p>
      <div class="caps">
{caps}
      </div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <h2 class="sec">Questions we get asked</h2>
{faqs}
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <div class="case">
        <span class="clabel">{esc(page['case']['label'])}</span>
        <h3>{esc(page['case']['title'])}</h3>
        <p>{page['case']['body']}</p>
      </div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <h2 class="sec">Why build it with SoftSolutionsAI</h2>
      <div class="why">
        <div><h3>You talk to the engineer</h3><p>Not an account manager. The person who designs and writes the code is the person you message on WhatsApp — before, during and long after launch.</p></div>
        <div><h3>A working demo every Friday</h3><p>One process, six stages, a real build you can click through each week. Scope stays honest and you're never waiting months to see something real.</p></div>
        <div><h3>You own it</h3><p>Code ships to your repository, runs on your servers, and the data stays in your database. No per-seat licence, no lock-in, no vendor who can switch you off.</p></div>
      </div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <h2 class="sec">Other things we build</h2>
      <div class="rel">
{cross}
        <a class="rel-card" href="samples.html"><span class="rel-k">See all work samples</span><span class="rel-arr" aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>

  <section class="final">
    <div class="wrap">
      <h2>Have a {esc(page_short(page).lower())} project?</h2>
      <p>Tell the engineer what you're trying to build. No form, no sales call — just a message.</p>
      <a class="btn btn--primary" href="{WA}" target="_blank" rel="noopener"><span class="dot"></span>Start on WhatsApp</a>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="footer-inner">
    <a class="site-brand" href="index.html#top">
      <span class="brand-mark" aria-hidden="true"><img src="favicon.png?v=2" alt="" width="30" height="30" style="width:100%;height:100%;object-fit:cover;border-radius:3px;display:block;" /></span>
      <span class="wm"><span class="sof">Soft</span>SolutionsAI</span>
    </a>
    <div class="footer-links">
      <a href="index.html#top">← back to site</a>
      <a href="samples.html">samples</a>
      <a href="mailto:info.softsolutionsai@gmail.com">info.softsolutionsai@gmail.com</a>
      <a href="https://wa.me/919258494901" target="_blank" rel="noopener"><span class="dot-wa"></span>WhatsApp</a>
    </div>
    <div class="footer-copy">© 2026 SoftSolutionsAI — talk to an engineer, not a sales team.<br>SoftSolutionsAI is a brand of LABHFORCE SOLUTION PRIVATE LIMITED · GSTIN 06AAGCL4957L1Z0</div>
  </div>
</footer>

</body>
</html>
"""


def main():
    for page in PAGES:
        out = f"{page['slug']}.html"
        with open(out, "w", encoding="utf-8") as f:
            f.write(render(page))
        wc = len(render(page).split())
        print(f"WROTE {out}  (~{wc} tokens in source)")
    print(f"\nDone — {len(PAGES)} vertical pages.")


if __name__ == "__main__":
    main()
