#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GSM Fixhouse — static multi-page site generator."""
import os, math, random
from urllib.parse import quote

OUT = os.path.dirname(os.path.abspath(__file__))
# No buttons point to the old website. Booking scrolls to the in-page contact band;
# selling routes to WhatsApp. Swap these for real URLs once the new site is live.
BOOK = "#afspraak"
SELLURL = "https://wa.me/31639432333"
WA_LEIDEN = "https://wa.me/31639432333"
WA_KATWIJK = "https://wa.me/31622444556"
VERSION = "17"  # bump to force browsers to reload css/js after changes

# ---------------------------------------------------------------- brand mark (old phone-G logo)
LOGO = '''<svg class="logo__mark" viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
<rect x="13" y="6" width="32" height="52" rx="10" fill="#36b349"/>
<path fill="#fff" d="M20 18 a3 3 0 0 1 3 -3 h12 a3 3 0 0 1 3 3 v6 h-7 v-2 h-11 v20 h11 v-5 h7 v7 a3 3 0 0 1 -3 3 H23 a3 3 0 0 1 -3 -3 Z"/>
<rect x="25.5" y="16.8" width="9" height="2" rx="1" fill="#0f0f12" opacity=".22"/>
<circle cx="29" cy="46.5" r="1.7" fill="#0f0f12" opacity=".28"/>
</svg>'''
WORDMARK = '<span class="logo__word"><b>GSM</b><i>FIXHOUSE</i></span>'
LOADER_LOGO = '''<svg viewBox="0 0 64 64" aria-hidden="true">
<rect x="13" y="6" width="32" height="52" rx="10" fill="#36b349"/>
<path fill="#fff" d="M20 18 a3 3 0 0 1 3 -3 h12 a3 3 0 0 1 3 3 v6 h-7 v-2 h-11 v20 h11 v-5 h7 v7 a3 3 0 0 1 -3 3 H23 a3 3 0 0 1 -3 -3 Z"/>
<rect x="25.5" y="16.8" width="9" height="2" rx="1" fill="#0f0f12" opacity=".22"/>
<circle cx="29" cy="46.5" r="1.7" fill="#0f0f12" opacity=".28"/>
</svg>'''

# ---------------------------------------------------------------- helpers
def eyebrow(text, light=False):
    cls = "eyebrow eyebrow--light reveal" if light else "eyebrow reveal"
    return f'<span class="{cls}" data-reveal data-decode>// {text}</span>'

def head(title, desc):
    return f'''<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/styles.css?v={VERSION}">
</head>'''

def loader():
    return f'''<div class="loader" id="loader" aria-hidden="true">
  <div class="loader__logo"><img src="assets/logo-mark.svg?v={VERSION}" alt="" width="115" height="163"></div>
  <div class="loader__bar"><span></span></div>
</div>'''

def ticker():
    items = ["6 maanden garantie", "Originele onderdelen", "30 minuten service", "No cure, no pay", "Geen gegevensverlies"]
    one = "".join(f'<span class="ticker__item">{t}</span>' for t in items)
    return f'<div class="ticker"><div class="ticker__track">{one}{one}{one}</div></div>'

NAV_ITEMS = [
    ("reparaties", "Reparaties", "reparaties.html"),
    ("verkopen", "Verkopen", "verkopen.html"),
    ("webshop", "Webshop", "webshop.html"),
    ("zakelijk", "Zakelijk", "zakelijk.html"),
    ("over", "Over ons", "over.html"),
    ("locaties", "Locaties", "locaties.html"),
]

def header(active):
    links = ""
    for key, label, href in NAV_ITEMS:
        cls = " is-active" if active == key or (active == "alle" and key == "reparaties") else ""
        links += f'<a class="{cls.strip()}" href="{href}">{label}</a>'
    return f'''<header class="header" id="header">
  <div class="header__inner">
    <a class="logo" href="index.html" aria-label="GSM Fixhouse"><img class="logo__img" src="assets/logo-full.png" alt="GSM Fixhouse" width="156" height="86"></a>
    <nav class="nav">{links}</nav>
    <div class="header__cta">
      <a class="btn btn--ghost btn--sm" href="tel:+31639432333">Bel ons</a>
      <a class="btn btn--primary btn--sm" href="{BOOK}">Plan je reparatie</a>
      <a class="header__wa" href="{WA_LEIDEN}" aria-label="WhatsApp"><svg viewBox="0 0 32 32" width="20" height="20"><path fill="#fff" d="M16 3C9 3 3.5 8.5 3.5 15.5c0 2.4.7 4.6 1.8 6.5L3 29l7.2-2.2c1.8 1 3.9 1.6 6.1 1.6 7 0 12.5-5.6 12.5-12.5S23 3 16 3zm0 22.7c-1.9 0-3.7-.5-5.2-1.4l-.4-.2-4.3 1.3 1.3-4.2-.3-.4a10.2 10.2 0 0 1-1.6-5.6C5.5 9.8 10.2 5.2 16 5.2S26.5 9.8 26.5 15.5 21.8 25.7 16 25.7zm5.8-7.6c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-1.9-1-3.2-1.7-4.4-3.8-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-1.2 1.2-1.5 2.6-1.1 4.2.7 2.6 2.4 4.6 5.9 6.2 3.4 1.5 3.5 1 4.2.9.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.3z"/></svg></a>
    </div>
  </div>
</header>'''

BN_ICONS = {
    "home": '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/>',
    "rep": '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2 2.3-2.3z"/>',
    "sell": '<path d="M20 12V7l-7-4-7 4v5c0 5 3 7 7 9 4-2 7-4 7-9z" opacity="0"/><path d="M3 11l9-7 9 7-1 8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" opacity="0"/><circle cx="9" cy="9" r="1.4"/><path d="M3.5 12.5 11 5h6.5a2 2 0 0 1 2 2V13.5L12 21z"/>',
    "info": '<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="8" x2="12" y2="8.1"/>',
    "pin": '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/>',
    "bag": '<path d="M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
}

def bottom_nav(active):
    tabs = [
        ("home", "Home", "index.html", "home"),
        ("reparaties", "Reparatie", "reparaties.html", "rep"),
        ("verkopen", "Verkopen", "verkopen.html", "sell"),
        ("webshop", "Webshop", "webshop.html", "bag"),
        ("locaties", "Locaties", "locaties.html", "pin"),
    ]
    out = ""
    for key, label, href, icon in tabs:
        on = active == key or (active == "alle" and key == "reparaties")
        cls = "bottom-nav__item is-active" if on else "bottom-nav__item"
        out += f'<a class="{cls}" href="{href}"><svg viewBox="0 0 24 24">{BN_ICONS[icon]}</svg><span>{label}</span></a>'
    return f'<nav class="bottom-nav" aria-label="Mobiele navigatie">{out}</nav>'

def device_cluster(variant="a", extra=""):
    cls = f"dev-cluster dev-cluster--{variant}" + (f" {extra}" if extra else "")
    return f'''<div class="{cls}" aria-hidden="true">
    <div class="ti-dev ti-laptop"></div>
    <div class="ti-dev ti-tablet"></div>
    <div class="ti-dev ti-phone"></div>
    <div class="ti-dev ti-watch"></div>
  </div>'''

def page_hero(eb, title, sub, deco="a"):
    return f'''<section class="page-hero">
  <div class="page-hero__grid"></div>
  {device_cluster(deco)}
  <div class="container page-hero__inner">
    {eyebrow(eb)}
    <h1 class="page-hero__title reveal" data-reveal>{title}</h1>
    <p class="page-hero__sub reveal" data-reveal>{sub}</p>
  </div>
</section>'''

# ---------------------------------------------------------------- cracks
def gen_cracks(seed=7):
    rnd = random.Random(seed)
    cx, cy = 120, 196
    spokes = 13
    paths = []
    spoke_pts = []  # list of lists of (r,x,y) per spoke for ring connectors
    for s in range(spokes):
        ang = (s / spokes) * 2 * math.pi + rnd.uniform(-0.10, 0.10)
        pts = [(0, cx, cy)]
        r = 0
        a = ang
        steps = rnd.randint(3, 4)
        for k in range(steps):
            r += rnd.uniform(45, 78)
            a += rnd.uniform(-0.14, 0.14)
            x = cx + math.cos(a) * r
            y = cy + math.sin(a) * r
            pts.append((r, x, y))
        d = "M" + " L".join(f"{x:.1f} {y:.1f}" for _, x, y in pts)
        paths.append(d)
        spoke_pts.append(pts)
        # occasional branch
        if rnd.random() < 0.5:
            bi = rnd.randint(1, len(pts) - 1)
            br, bx, by = pts[bi]
            ba = a + rnd.uniform(0.5, 1.0) * rnd.choice([-1, 1])
            bl = rnd.uniform(28, 55)
            paths.append(f"M{bx:.1f} {by:.1f} L{bx + math.cos(ba) * bl:.1f} {by + math.sin(ba) * bl:.1f}")
    # concentric web rings connecting spokes at similar radii
    for ring_r in (34, 70, 116):
        ring = []
        for pts in spoke_pts:
            # find point on this spoke closest to ring_r
            best = min(pts[1:], key=lambda p: abs(p[0] - ring_r))
            jitter = rnd.uniform(0.9, 1.08)
            ring.append((best[1] * 1.0, best[2] * 1.0, jitter))
        d = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y, _ in ring) + " Z"
        paths.append(d)
    # impact starburst
    for _ in range(10):
        a = rnd.uniform(0, 2 * math.pi)
        r = rnd.uniform(7, 18)
        paths.append(f"M{cx} {cy} L{cx + math.cos(a) * r:.1f} {cy + math.sin(a) * r:.1f}")

    dark = "".join(f'<path class="crack crack--dark" d="{d}"/>' for d in paths)
    light = "".join(f'<path class="crack" d="{d}"/>' for d in paths)
    return f'''<svg class="cracks" viewBox="0 0 240 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <g stroke="rgba(0,0,0,.55)" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round">{dark}</g>
  <g stroke="rgba(255,255,255,.92)" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round">{light}</g>
</svg>'''

# ---------------------------------------------------------------- home hero
def home_hero():
    return f'''<section class="hero">
  <div class="hero__grid" data-depth="0"></div>
  <div class="container hero__inner">
    <div class="hero__copy">
      {eyebrow("Reparatieservice, Leiden &amp; Katwijk")}
      <h1 class="hero__title">
        <span class="line"><span>Je toestel kapot?</span></span>
        <span class="line"><span>Wij <em>fixen</em> het,</span></span>
        <span class="line"><span>vaak binnen 30 min.</span></span>
      </h1>
      <p class="hero__lead reveal" data-reveal>Schermen, batterijen, laadpoorten en meer. Voor telefoons, tablets, laptops, computers, gameconsoles en smartwatches. Klaar terwijl u wacht.</p>
      <div class="hero__actions reveal" data-reveal>
        <a class="btn btn--primary btn--lg" href="{BOOK}">Plan je reparatie</a>
        <a class="btn btn--line btn--lg" href="reparaties.html">Bekijk reparaties</a>
      </div>
      <div class="hero__status status" data-loc="leiden"></div>
    </div>
    <div class="hero__device" data-depth="14">
      <div class="phone" id="phone">
        <div class="phone__notch"></div>
        <div class="phone__screen">
          <div class="phone__wall"></div>
          <div class="phone__impact"></div>
          {gen_cracks()}
          <div class="scanline"></div>
          <div class="phone__ui">
            <div class="phone__check">
              <svg width="58" height="58" viewBox="0 0 58 58"><circle cx="29" cy="29" r="26" fill="none" stroke="#36b349" stroke-width="3" opacity=".3"/><path d="M18 30 L26 38 L41 21" fill="none" stroke="#58c95c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="phone__status">Gerepareerd</div>
            <div class="phone__time">in 28 minuten</div>
          </div>
          <div class="phone__hint">beweeg je muis over het scherm</div>
        </div>
      </div>
      <div class="device-badge device-badge--1">📱 Scherm vervangen</div>
      <div class="device-badge device-badge--2">🔋 Nieuwe batterij</div>
    </div>
  </div>
</section>'''

# ---------------------------------------------------------------- shared sections
DEV_ICONS = {
    "smartphone": '<rect x="15" y="4" width="18" height="40" rx="4"/><line x1="21" y1="39" x2="27" y2="39"/>',
    "laptop": '<rect x="9" y="11" width="30" height="20" rx="2"/><path d="M5 38 h38 l-3 -7 H8 z"/>',
    "computer": '<rect x="8" y="8" width="32" height="22" rx="2"/><line x1="24" y1="30" x2="24" y2="38"/><line x1="16" y1="40" x2="32" y2="40"/>',
    "tablet": '<rect x="10" y="6" width="28" height="36" rx="4"/><line x1="24" y1="36" x2="24" y2="36.2"/>',
    "console": '<rect x="6" y="17" width="36" height="16" rx="8"/><circle cx="16" cy="25" r="1.6"/><circle cx="20" cy="25" r="1.6"/><circle cx="31" cy="23" r="1.4"/><circle cx="34" cy="27" r="1.4"/>',
    "smartwatch": '<rect x="16" y="14" width="16" height="20" rx="5"/><path d="M20 14l1-7h6l1 7M20 34l1 7h6l1-7"/>',
}

# Stylised device renders (original artwork, brand colours) used on the
# verkoop + reparatie pages. Generic device shapes, no trademarked imagery.
DEVART = {
    "smartphone": '<svg viewBox="0 0 96 96" fill="none"><rect x="34" y="12" width="28" height="72" rx="7" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="37.5" y="18" width="21" height="56" rx="3" fill="#0f2e1a"/><rect x="37.5" y="18" width="21" height="18" rx="3" fill="#1d4f2b"/><rect x="43" y="14.5" width="10" height="2.4" rx="1.2" fill="#0a0a0d"/><circle cx="48" cy="79" r="1.6" fill="#3a3a44"/></svg>',
    "tablet": '<svg viewBox="0 0 96 96" fill="none"><rect x="26" y="14" width="44" height="68" rx="6" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="30" y="20" width="36" height="52" rx="2.5" fill="#0f2e1a"/><rect x="30" y="20" width="36" height="16" rx="2.5" fill="#1d4f2b"/><circle cx="48" cy="17" r="1" fill="#3a3a44"/><circle cx="48" cy="77" r="2" fill="none" stroke="#3a3a44" stroke-width="1.2"/></svg>',
    "laptop": '<svg viewBox="0 0 96 96" fill="none"><rect x="22" y="24" width="52" height="34" rx="3" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="26" y="28" width="44" height="26" rx="1.5" fill="#0f2e1a"/><rect x="26" y="28" width="44" height="9" fill="#1d4f2b"/><path d="M14 58 h68 l5 8 a3 3 0 0 1 -3 4 H12 a3 3 0 0 1 -3 -4 z" fill="#1a1a20" stroke="#2c2c34" stroke-width="1.2"/><rect x="40" y="61" width="16" height="2.4" rx="1.2" fill="#2c2c34"/></svg>',
    "computer": '<svg viewBox="0 0 96 96" fill="none"><rect x="16" y="16" width="64" height="44" rx="4" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="20" y="20" width="56" height="36" rx="2" fill="#0f2e1a"/><rect x="20" y="20" width="56" height="12" fill="#1d4f2b"/><rect x="43" y="60" width="10" height="9" fill="#1a1a20"/><rect x="32" y="70" width="32" height="5" rx="2.5" fill="#1a1a20" stroke="#2c2c34" stroke-width="1"/></svg>',
    "console": '<svg viewBox="0 0 96 96" fill="none"><path d="M30 40 q-10 0 -13 14 q-3 14 7 16 q7 1.5 11 -7 h26 q4 8.5 11 7 q10 -2 7 -16 q-3 -14 -13 -14 z" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="29.5" y="50" width="3" height="11" rx="1.5" fill="#2c2c34"/><rect x="25.5" y="54" width="11" height="3" rx="1.5" fill="#2c2c34"/><circle cx="62" cy="52" r="2.4" fill="#36b349"/><circle cx="69" cy="58" r="2.4" fill="#36b349"/><circle cx="55" cy="58" r="2.4" fill="#2c2c34"/><circle cx="62" cy="64" r="2.4" fill="#2c2c34"/></svg>',
    "smartwatch": '<svg viewBox="0 0 96 96" fill="none"><rect x="40" y="8" width="16" height="16" rx="4" fill="#1a1a20"/><rect x="40" y="72" width="16" height="16" rx="4" fill="#1a1a20"/><rect x="32" y="24" width="32" height="48" rx="10" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="36" y="29" width="24" height="38" rx="6" fill="#0f2e1a"/><rect x="36" y="29" width="24" height="13" rx="6" fill="#1d4f2b"/><rect x="64" y="40" width="3" height="9" rx="1.5" fill="#2c2c34"/></svg>',
}
def device_categories():
    cats = [
        ("smartphone", "Smartphone", "Scherm, batterij, laadpoort", "Smartphone"),
        ("laptop", "Laptop", "Scherm, toetsenbord, opslag", "Laptop"),
        ("computer", "Computer", "Opschonen, upgrade, herstel", "Computer"),
        ("tablet", "Tablet", "iPad &amp; Android tablets", "Tablet"),
        ("console", "Console", "PlayStation, Xbox, Switch", "Console"),
        ("smartwatch", "Smartwatch", "Apple Watch &amp; meer", "Smartwatch"),
    ]
    cards = ""
    for icon, name, sub, catfilter in cats:
        cards += f'''<a class="device-card reveal" data-reveal data-tilt href="alle-reparaties.html?cat={catfilter}">
        <span class="dev-art">{DEVART[icon]}</span>
        <h3>{name}</h3><p>{sub}</p>
        <span class="device-card__arrow">Bekijk reparaties &rsaquo;</span></a>'''
    return f'''<section class="section section--tint" id="reparaties">
  <div class="container">
    <header class="section__head">
      {eyebrow("Welk toestel mogen wij repareren?")}
      <h2 class="section__title reveal" data-reveal>Kies je apparaat</h2>
      <p class="section__sub reveal" data-reveal>Van een gebarsten iPhone-scherm tot een trage laptop of een console die niet meer opstart, wij fixen het.</p>
    </header>
    <div class="cards" data-stagger>{cards}</div>
    <div class="section__cta reveal" data-reveal><a class="btn btn--line btn--lg" href="alle-reparaties.html">Bekijk alle reparaties &amp; prijzen</a></div>
  </div>
</section>'''

def why_us():
    usps = [
        ("30 minuten service", "De meeste reparaties klaar terwijl u wacht of dezelfde dag."),
        ("No cure, no pay", "Lukt de reparatie niet? Dan betaalt u niets."),
        ("6 maanden garantie", "Op alle reparaties en onderdelen die wij plaatsen."),
        ("Originele kwaliteit", "Hoogwaardige onderdelen met behoud van uw gegevens."),
        ("Eerlijke prijs", "Vooraf een duidelijke prijsopgave, zonder verrassingen."),
    ]
    cells = ""
    for i, (t, d) in enumerate(usps, 1):
        cells += f'''<div class="usp reveal" data-reveal>
        <span class="usp__num">{i:02d}</span><h3>{t}</h3><p>{d}</p></div>'''
    return f'''<section class="section section--dark">
  <div class="container">
    <header class="section__head">
      {eyebrow("Waarom GSM Fixhouse", light=True)}
      <h2 class="section__title reveal" data-reveal>Snel, eerlijk en vakkundig</h2>
    </header>
    <div class="usp-grid" data-stagger>{cells}</div>
    <div class="section__cta reveal" data-reveal><a class="btn btn--primary btn--lg" href="{BOOK}">Plan je reparatie</a></div>
  </div>
</section>'''

def stats():
    data = [("8", "+", "jaar ervaring"), ("3500", "+", "reparaties per jaar"),
            ("1500", "+", "tevreden klanten"), ("30", " min", "gem. reparatietijd")]
    cells = ""
    for n, suf, lab in data:
        cells += f'''<div class="stat reveal" data-reveal>
        <div class="stat__num"><span data-count="{n}" data-suffix="{suf}">0</span></div>
        <div class="stat__label">{lab}</div></div>'''
    return f'<section class="stats"><div class="container stats__inner">{cells}</div></section>'

def process():
    steps = [
        ("Breng langs of stuur op", "Loop binnen in Leiden of Katwijk, of maak online een afspraak."),
        ("Gratis diagnose", "We bekijken het toestel en geven een eerlijke prijsopgave."),
        ("Wij repareren", "Vaak binnen 30 minuten, met originele kwaliteit onderdelen."),
        ("Klaar &amp; getest", "U krijgt het toestel werkend terug, met 6 maanden garantie."),
    ]
    cells = ""
    for i, (t, d) in enumerate(steps, 1):
        cells += f'''<div class="step reveal" data-reveal>
        <div class="step__num">{i}</div><h3>{t}</h3><p>{d}</p></div>'''
    return f'''<section class="section section--mist">
  <div class="container">
    <header class="section__head">
      {eyebrow("Zo werkt het")}
      <h2 class="section__title reveal" data-reveal>In vier stappen weer als nieuw</h2>
    </header>
    <div class="steps" data-stagger>{cells}</div>
  </div>
</section>'''

def popular():
    reps = [
        ("Telefoonscherm", "Gebarsten of dood scherm vervangen", "vanaf € 49"),
        ("Batterij vervangen", "Houdt uw toestel geen lading meer vast?", "vanaf € 39"),
        ("Laadpoort", "Laadt niet meer of alleen in een bepaalde hoek", "vanaf € 45"),
        ("Waterschade", "Diagnose en reiniging na contact met vocht", "op aanvraag"),
        ("Computer opschonen", "Trage pc of laptop weer snel en fris", "vanaf € 49"),
    ]
    cells = ""
    for t, d, p in reps:
        cells += f'''<a class="repair reveal" data-reveal href="alle-reparaties.html">
        <div class="repair__top"><h3>{t}</h3><span class="repair__price">{p}</span></div>
        <p>{d}</p><span class="repair__link">Bekijk &rsaquo;</span></a>'''
    return f'''<section class="section">
  <div class="container">
    <header class="section__head">
      {eyebrow("Populaire reparaties")}
      <h2 class="section__title reveal" data-reveal>Waar we het vaakst mee helpen</h2>
    </header>
    <div class="repairs" data-stagger>{cells}</div>
    <div class="section__cta reveal" data-reveal><a class="btn btn--line btn--lg" href="alle-reparaties.html">Alle reparaties &amp; prijzen</a></div>
  </div>
</section>'''

def biz():
    brands = ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Oppo", "Huawei", "Nokia", "Sony"]
    one = "".join(f'<span class="brand">{b}</span>' for b in brands)
    return f'''<section class="section section--mist">
  <div class="container biz">
    <div class="biz__media reveal" data-reveal>
      <img class="biz__img" src="assets/winkel-leiden.jpg" alt="GSM Fixhouse winkel in Leiden" loading="lazy">
    </div>
    <div class="biz__copy">
      {eyebrow("Zakelijke klanten")}
      <h2 class="section__title reveal" data-reveal>Ook voor bedrijven en scholen</h2>
      <p class="reveal" data-reveal>Heeft uw organisatie meerdere toestellen die onderhoud nodig hebben? Wij bieden zakelijke reparatie met scherpe tarieven, snelle doorlooptijd en facturatie. Van een enkele laptop tot een hele vloot telefoons.</p>
      <ul class="biz__list reveal" data-reveal>
        <li>Vaste contactpersoon en prioriteit</li>
        <li>Ophaal- en bezorgservice mogelijk</li>
        <li>Factuur met btw, scherpe stafeltarieven</li>
      </ul>
      <a class="btn btn--primary reveal" data-reveal href="zakelijk.html">Lees meer over zakelijk</a>
      <div class="brands reveal" data-reveal><div class="brands__track">{one}{one}</div></div>
    </div>
  </div>
</section>'''

def about():
    vals = [
        ("Vakmanschap", "Ervaren technici die elk toestel met zorg behandelen."),
        ("Transparant", "Heldere prijzen vooraf, geen verborgen kosten achteraf."),
        ("Snel", "Korte wachttijden, vaak klaar terwijl u wacht."),
        ("Duurzaam", "Repareren in plaats van weggooien, beter voor uw portemonnee en het milieu."),
    ]
    cells = ""
    for t, d in vals:
        cells += f'<div class="value reveal" data-reveal><h3>{t}</h3><p>{d}</p></div>'
    return f'''<section class="section">
  <div class="container biz">
    <div class="biz__media reveal" data-reveal>
      <img class="biz__img" src="assets/winkel-leiden.jpg" alt="GSM Fixhouse winkel in Leiden" loading="lazy">
    </div>
    <div class="biz__copy">
      {eyebrow("Over GSM Fixhouse")}
      <h2 class="section__title reveal" data-reveal>Uw lokale reparatiespecialist</h2>
      <p class="reveal" data-reveal>GSM Fixhouse is dé reparatiespecialist in de regio Leiden en Katwijk. Met twee winkels en jarenlange ervaring helpen wij dagelijks mensen met een kapot scherm, een lege batterij of een toestel dat het niet meer doet. Klaar terwijl u wacht, met eerlijke prijzen en garantie.</p>
      <p class="reveal" data-reveal>Of het nu gaat om een smartphone, tablet, laptop, computer, gameconsole of smartwatch, wij zorgen ervoor dat uw apparaat weer werkt zoals het hoort.</p>
    </div>
  </div>
</section>
<section class="section section--mist">
  <div class="container">
    <header class="section__head">
      {eyebrow("Onze waarden")}
      <h2 class="section__title reveal" data-reveal>Waar wij voor staan</h2>
    </header>
    <div class="values" data-stagger>{cells}</div>
  </div>
</section>'''

def reviews(n=6, more=False, mist=False):
    data = [
        ("Sanne de V.", "iPhone 13 scherm", "Binnen een half uur klaar en het scherm is weer als nieuw. Top service en vriendelijk geholpen."),
        ("Mark J.", "Laptop opgeschoond", "Mijn laptop was loeitraag. Nu start hij in seconden op. Eerlijk advies, geen onnodige kosten."),
        ("Aylin K.", "Samsung batterij", "Snel geholpen zonder afspraak. Batterij vervangen terwijl ik koffie dronk. Aanrader!"),
        ("Peter H.", "iPad laadpoort", "Dachten dat de iPad afgeschreven was, bleek de laadpoort. Voor een fractie van een nieuwe gefixt."),
        ("Lisa M.", "PlayStation HDMI", "Console gaf geen beeld meer. Keurig gerepareerd en netjes uitgelegd wat er stuk was."),
        ("Tom R.", "iPhone 12 batterij", "Vriendelijk, snel en eerlijk geprijsd. Precies wat je wil van een reparatiezaak."),
    ]
    cells = ""
    for name, dev, txt in data[:n]:
        stars = "".join('<svg viewBox="0 0 20 20" class="star"><path d="M10 1l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.8 4.8 17.1l1-5.8L1.5 7.2l5.9-.9z"/></svg>' for _ in range(5))
        cells += f'''<figure class="review reveal" data-reveal>
        <div class="review__stars">{stars}</div>
        <blockquote>{txt}</blockquote>
        <figcaption><strong>{name}</strong><span>{dev}</span></figcaption></figure>'''
    cta = '<div class="section__cta reveal" data-reveal><a class="btn btn--line btn--lg" href="over.html#reviews">Lees alle reviews</a></div>' if more else ""
    sec_cls = "section section--mist" if mist else "section"
    return f'''<section class="{sec_cls}" id="reviews">
  <div class="container">
    <header class="section__head">
      {eyebrow("Wat klanten zeggen")}
      <h2 class="section__title reveal" data-reveal>Beoordeeld met een dikke voldoende</h2>
    </header>
    <div class="reviews" data-stagger>{cells}</div>
    {cta}
  </div>
</section>'''

def locations():
    locs = [
        ("leiden", "Leiden", "Haarlemmerstraat 226", "2312 GJ Leiden", "+31 6 39432333", WA_LEIDEN, "assets/winkel-leiden.jpg"),
        ("katwijk", "Katwijk", "Princestraat 24B", "2225 GC Katwijk", "+31 6 22444556", WA_KATWIJK, "assets/winkel-katwijk.jpg"),
    ]
    hours_rows = [("Maandag", "13:00 – 17:30"), ("Dinsdag t/m vrijdag", "10:00 – 17:30"),
                  ("Zaterdag", "10:00 – 17:00"), ("Zondag", "Gesloten")]
    hrs = "".join(f'<div class="hours__row"><span>{d}</span><span>{t}</span></div>' for d, t in hours_rows)
    cards = ""
    for key, city, street, zipc, tel, wa, img in locs:
        dest = quote(f"GSM Fixhouse, {street}, {zipc}")
        route = f"https://www.google.com/maps/dir/?api=1&destination={dest}"
        embed = f"https://maps.google.com/maps?q={quote(f'{street}, {zipc}')}&z=16&hl=nl&output=embed"
        cards += f'''<div class="location reveal" data-reveal>
        <img class="location__img" src="{img}" alt="GSM Fixhouse {city}" loading="lazy">
        <div class="status" data-loc="{key}"></div>
        <h3>GSM Fixhouse {city}</h3>
        <p class="location__addr">{street}<br>{zipc}</p>
        <div class="hours">{hrs}</div>
        <iframe class="location__map" src="{embed}" loading="lazy" title="Kaart {city}" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
        <div class="location__actions">
          <a class="btn btn--primary btn--sm" href="{route}" target="_blank" rel="noopener">Route plannen</a>
          <a class="btn btn--line btn--sm" href="{wa}">WhatsApp</a>
          <a class="btn btn--line btn--sm" href="tel:{tel.replace(' ', '')}">{tel}</a>
        </div></div>'''
    return f'''<section class="section">
  <div class="container">
    <header class="section__head">
      {eyebrow("Adres &amp; openingstijden")}
      <h2 class="section__title reveal" data-reveal>Onze twee vestigingen</h2>
    </header>
    <div class="locations" data-stagger>{cards}</div>
  </div>
</section>'''

def cta_band(active="home"):
    v = {"reparaties": "c", "alle": "a", "verkopen": "b", "zakelijk": "b", "over": "d", "locaties": "e"}.get(active, "a")
    return f'''<section class="cta-band" id="afspraak">
  <div class="cta-band__glow"></div>
  {device_cluster(v, extra="dev-cluster--cta dev-cluster--cta-l")}
  {device_cluster(v, extra="dev-cluster--cta dev-cluster--cta-r")}
  <div class="container cta-band__inner">
    <div>
      <h2 class="reveal" data-reveal>Klaar om je toestel te laten fixen?</h2>
      <p class="reveal" data-reveal>Maak online een afspraak of loop gewoon binnen in Leiden of Katwijk.</p>
    </div>
    <div class="cta-band__actions reveal" data-reveal>
      <a class="btn btn--primary btn--lg" href="{WA_LEIDEN}">App ons direct</a>
      <a class="btn btn--line-light btn--lg" href="locaties.html">Bekijk locaties</a>
    </div>
  </div>
</section>'''

def footer():
    return f'''<footer class="footer">
  <div class="container footer__inner">
    <div class="footer__brand">
      <a class="logo logo--light" href="index.html"><img class="logo__img logo__img--footer" src="assets/logo-full-light.png" alt="GSM Fixhouse" width="156" height="86"></a>
      <p>Dé reparatiespecialist voor telefoon, tablet, laptop, computer, console en smartwatch in Leiden en Katwijk.</p>
    </div>
    <div class="footer__col">
      <h4>Reparaties</h4>
      <a href="reparaties.html">Alle apparaten</a>
      <a href="alle-reparaties.html">Alle reparaties &amp; prijzen</a>
      <a href="verkopen.html">Verkoop je toestel</a>
      <a href="webshop.html">Webshop</a>
      <a href="zakelijk.html">Zakelijke klanten</a>
    </div>
    <div class="footer__col">
      <h4>Bedrijf</h4>
      <a href="over.html">Over ons</a>
      <a href="over.html#reviews">Reviews</a>
      <a href="locaties.html">Locaties</a>
    </div>
    <div class="footer__col">
      <h4>Contact</h4>
      <a href="{WA_LEIDEN}">Leiden · 06 39432333</a>
      <a href="{WA_KATWIJK}">Katwijk · 06 22444556</a>
      <a href="#afspraak">Afspraak maken</a>
    </div>
  </div>
  <div class="footer__bar"><div class="container">© 2026 GSM Fixhouse · Klaar terwijl u wacht</div></div>
</footer>'''

def wa_fab():
    return f'<a class="wa-fab" href="{WA_LEIDEN}" aria-label="WhatsApp"><svg viewBox="0 0 32 32" width="26" height="26"><path fill="#fff" d="M16 3C9 3 3.5 8.5 3.5 15.5c0 2.4.7 4.6 1.8 6.5L3 29l7.2-2.2c1.8 1 3.9 1.6 6.1 1.6 7 0 12.5-5.6 12.5-12.5S23 3 16 3zm0 22.7c-1.9 0-3.7-.5-5.2-1.4l-.4-.2-4.3 1.3 1.3-4.2-.3-.4a10.2 10.2 0 0 1-1.6-5.6C5.5 9.8 10.2 5.2 16 5.2S26.5 9.8 26.5 15.5 21.8 25.7 16 25.7zm5.8-7.6c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-1.9-1-3.2-1.7-4.4-3.8-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-1.2 1.2-1.5 2.6-1.1 4.2.7 2.6 2.4 4.6 5.9 6.2 3.4 1.5 3.5 1 4.2.9.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.3z"/></svg></a>'

# ---------------------------------------------------------------- verkopen body
def verkopen_body():
    trust = [
        ("Stuur je device <strong>gratis</strong> op", True),
        ("9.7 ★★★★★ · <strong>23.000</strong> verkocht", False),
        ("Toch bedacht? <strong>Gratis</strong> retour", True),
        ("Snel geld op je rekening", True),
        ("Elk device <strong>vakkundig gewist</strong>", True),
    ]
    titems = ""
    for txt, chk in trust:
        dot = '<span class="chk"></span>' if chk else ""
        titems += f'<span class="trustbar__item">{dot}{txt}</span>'
    trustbar = f'<section class="trustbar"><div class="trustbar__viewport"><div class="trustbar__track">{titems}{titems}</div></div></section>'

    cats = [
        ("Telefoon", "iPhone, Samsung, Google", "smartphone"),
        ("Tablet", "iPad &amp; Galaxy Tab", "tablet"),
        ("Smartwatch", "Apple Watch &amp; meer", "smartwatch"),
        ("Laptop", "MacBook", "laptop"),
    ]
    catcards = ""
    for name, sub, art in cats:
        catcards += f'''<a class="device-card reveal" data-reveal data-tilt href="#sellApp">
        <span class="dev-art">{DEVART[art]}</span>
        <h3>{name}</h3><p>{sub}</p><span class="device-card__arrow">Bereken prijs &rsaquo;</span></a>'''

    steps = [
        ("Schat de waarde", "Beantwoord een paar vragen over je toestel en zie direct een eerlijke schatting."),
        ("Stuur gratis op", "Verstuur je device kosteloos met een gratis verzendlabel."),
        ("Direct je geld", "Na controle staat het bedrag snel op je rekening."),
    ]
    stepcells = ""
    for i, (t, d) in enumerate(steps, 1):
        stepcells += f'<div class="sellstep reveal" data-reveal><span class="sellstep__num">{i}</span><div><h4>{t}</h4><p>{d}</p></div></div>'

    search_svg = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>'

    return f'''{trustbar}
<section class="tradein">
  <div class="tradein__glow"></div>
  <div class="container tradein__inner">
    <div class="tradein__copy">
      {eyebrow("Verkopen", light=True)}
      <h1 class="tradein__title reveal" data-reveal>Verkoop je <span class="rotate" id="rotateWord">iPhone</span><br>eenvoudig en snel</h1>
      <p class="tradein__sub reveal" data-reveal>Meer dan <strong>400.000</strong> devices kregen al een tweede leven. Ontvang direct een eerlijke prijs voor jouw toestel.</p>
      <div class="tradein__search reveal" data-reveal>
        {search_svg}
        <input type="text" name="q" placeholder="Zoek op model, bijv. iPhone 13" aria-label="Zoek op model">
        <a class="btn btn--primary btn--sm" href="#sellApp">Bekijk prijs</a>
      </div>
      <p class="tradein__hint reveal" data-reveal>Liever zelf rekenen? Gebruik de stap-voor-stap tool hieronder.</p>
    </div>
    <div class="tradein__art reveal" data-reveal>
      <div class="ti-dev ti-laptop"></div>
      <div class="ti-dev ti-tablet"></div>
      <div class="ti-dev ti-phone"></div>
      <div class="ti-dev ti-watch"></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <header class="section__head">
      {eyebrow("Wat wil je verkopen?")}
      <h2 class="section__title reveal" data-reveal>Kies je categorie</h2>
    </header>
    <div class="cards cards--4" data-stagger>{catcards}</div>
  </div>
</section>

<section class="section section--mist">
  <div class="container">
    <header class="section__head section__head--center">
      {eyebrow("Zo werkt het")}
      <h2 class="section__title reveal" data-reveal>In 3 simpele stappen je device verkopen</h2>
    </header>
    <div class="sellsteps">{stepcells}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    <header class="section__head section__head--center">
      {eyebrow("Direct een prijs")}
      <h2 class="section__title reveal" data-reveal>Bereken wat je toestel waard is</h2>
      <p class="section__sub reveal" data-reveal>Voorbeeldtool met indicatieprijzen. De officiële verkoop loopt via onze partner Trade-in.</p>
    </header>
    <div class="flow-app reveal" data-reveal><div id="sellApp"></div></div>
  </div>
</section>'''

# ---------------------------------------------------------------- alle-reparaties body
def alle_reparaties_body():
    chips = ["Alle", "Smartphone", "Tablet", "Laptop", "Computer", "Console", "Smartwatch"]
    chiphtml = ""
    for i, c in enumerate(chips):
        on = " is-on" if i == 0 else ""
        chiphtml += f'<button class="flow-chip{on}" type="button" data-cat="{c}">{c}</button>'
    search_svg = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>'
    return f'''{page_hero("Alle reparaties", "Alle reparaties &amp; indicatieprijzen", "Zoek je toestel, bekijk de mogelijke reparaties en zie direct een indicatie van de prijs.", deco="a")}
<section class="section">
  <div class="container" id="repairApp">
    <div class="repair-tools">
      <div class="repair-search">{search_svg}<input id="repairSearch" type="text" placeholder="Zoek een toestel, bijv. iPhone 13" aria-label="Zoek een toestel"></div>
      <div class="flow-chips">{chiphtml}</div>
    </div>
    <div class="repair-brands" id="repairBrands" hidden></div>
    <div class="repair-grid" id="repairGrid"></div>
  </div>
  <div class="repair-modal" id="repairModal"><div class="repair-modal__panel"></div></div>
</section>'''

# ---------------------------------------------------------------- zakelijk body
def zakelijk_body():
    feats = [
        ("Vaste contactpersoon", "Eén aanspreekpunt voor al uw reparaties en vragen."),
        ("Prioriteit &amp; snelheid", "Zakelijke opdrachten krijgen voorrang in de werkplaats."),
        ("Ophalen &amp; bezorgen", "In de regio Leiden en Katwijk halen we toestellen op."),
        ("Facturatie met btw", "Nette factuur en scherpe stafeltarieven bij volume."),
        ("Datazekerheid", "Uw gegevens blijven veilig, conform afspraak gewist of behouden."),
        ("Alle apparaten", "Telefoons, tablets, laptops, computers en meer."),
    ]
    cells = ""
    for t, d in feats:
        cells += f'<div class="value reveal" data-reveal><h3>{t}</h3><p>{d}</p></div>'
    return f'''{page_hero("Zakelijke klanten", "Reparatie voor bedrijven &amp; scholen", "Van een enkele laptop tot een hele vloot telefoons. Betrouwbaar, snel en met facturatie.", deco="b")}
<section class="section">
  <div class="container biz">
    <div class="biz__media reveal" data-reveal>
      <img class="biz__img" src="assets/winkel-katwijk.jpg" alt="GSM Fixhouse winkel in Katwijk" loading="lazy">
    </div>
    <div class="biz__copy">
      {eyebrow("Waarom zakelijk bij ons")}
      <h2 class="section__title reveal" data-reveal>Eén partner voor al uw toestellen</h2>
      <p class="reveal" data-reveal>Stilstand kost geld. Daarom zorgen wij dat uw apparatuur zo snel mogelijk weer werkt, met korte lijnen en duidelijke afspraken. Of u nu een paar toestellen heeft of een grote vloot beheert.</p>
      <a class="btn btn--primary reveal" data-reveal href="{BOOK}">Vraag een offerte aan</a>
    </div>
  </div>
</section>
<section class="section section--mist">
  <div class="container">
    <header class="section__head">
      {eyebrow("Zakelijke voordelen")}
      <h2 class="section__title reveal" data-reveal>Wat u van ons mag verwachten</h2>
    </header>
    <div class="values" data-stagger>{cells}</div>
  </div>
</section>'''

def mobile_cta():
    return f'''<div class="mfab" aria-label="Snel contact">
  <a class="mfab__plan" href="{BOOK}">Plan je reparatie</a>
  <a class="mfab__wa" href="{WA_LEIDEN}" aria-label="WhatsApp"><svg viewBox="0 0 32 32" width="22" height="22"><path fill="#fff" d="M16 3C9 3 3.5 8.5 3.5 15.5c0 2.4.7 4.6 1.8 6.5L3 29l7.2-2.2c1.8 1 3.9 1.6 6.1 1.6 7 0 12.5-5.6 12.5-12.5S23 3 16 3zm0 22.7c-1.9 0-3.7-.5-5.2-1.4l-.4-.2-4.3 1.3 1.3-4.2-.3-.4a10.2 10.2 0 0 1-1.6-5.6C5.5 9.8 10.2 5.2 16 5.2S26.5 9.8 26.5 15.5 21.8 25.7 16 25.7zm5.8-7.6c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-1.9-1-3.2-1.7-4.4-3.8-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-1.2 1.2-1.5 2.6-1.1 4.2.7 2.6 2.4 4.6 5.9 6.2 3.4 1.5 3.5 1 4.2.9.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.3z"/></svg></a>
</div>'''

# ---------------------------------------------------------------- page assembler
def page(title, desc, active, body, scripts=("js/main.js",)):
    scr = "".join(f'<script src="{s}?v={VERSION}" defer></script>' for s in scripts)
    html = f'''{head(title, desc)}
<body>
<div class="scroll-progress" id="scrollProgress"></div>
{loader()}
{ticker()}
{header(active)}
<main>
{body}
{cta_band(active)}
</main>
{footer()}
{bottom_nav(active)}
{wa_fab()}
{scr}
</body>
</html>'''
    # strip em-dashes (keep en-dash in opening hours)
    html = html.replace(" — ", ", ").replace("—", ",")
    return html

# ---------------------------------------------------------------- admin (intern, /admin)
def admin_head():
    return f'''<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Admin · Facturatie · GSM Fixhouse</title>
<link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/styles.css?v={VERSION}">
<link rel="stylesheet" href="../css/admin.css?v={VERSION}">
</head>'''

def admin_field(id_, label, ph="", typ="text", span=False, extra=""):
    cls = "a-field a-span2" if span else "a-field"
    return f'''<div class="{cls}"><label for="{id_}">{label}</label><input id="{id_}" type="{typ}" placeholder="{ph}" {extra}></div>'''

def admin_body():
    cats = ["Smartphone", "Tablet", "Laptop", "Computer", "Console", "Smartwatch"]
    cat_opts = "".join(f'<option value="{c}">{c}</option>' for c in cats)
    search_icon = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>'
    return f'''<body class="admin-body">

<!-- ===================== LOGIN ===================== -->
<div class="a-login" id="aLogin">
  <form class="a-login__card" id="aLoginForm" autocomplete="off">
    <img class="a-login__mark" src="../assets/logo-mark.svg" alt="">
    <h1>GSM Fixhouse Admin</h1>
    <p>Interne facturatie, log in om door te gaan.</p>
    <div class="a-login__err" id="aLoginErr">Onjuiste gebruikersnaam of wachtwoord.</div>
    <div class="a-field" style="text-align:left;margin-bottom:12px">
      <label for="aUser">Gebruikersnaam</label>
      <input id="aUser" type="text" autocomplete="username">
    </div>
    <div class="a-field" style="text-align:left;margin-bottom:18px">
      <label for="aPass">Wachtwoord</label>
      <input id="aPass" type="password" autocomplete="current-password">
    </div>
    <button class="btn btn--primary btn--full" type="submit">Inloggen</button>
  </form>
</div>

<!-- ===================== TOPBAR ===================== -->
<div class="a-bar">
  <div class="a-bar__brand">
    <img src="../assets/logo-full.png" alt="GSM Fixhouse">
    <span class="a-badge">Facturatie</span>
  </div>
  <div class="a-bar__right">
    <a class="btn btn--ghost btn--sm" href="../index.html">&larr; Website</a>
    <button class="btn btn--line btn--sm" type="button" id="aLogout">Uitloggen</button>
  </div>
</div>

<!-- ===================== WORKSPACE ===================== -->
<main>
<div class="a-wrap">

  <!-- LEFT: builder -->
  <div class="a-col">

    <!-- Vestiging: bovenaan, bepaalt adres + contact op de factuur -->
    <div class="a-card a-vest">
      <div class="a-vest__label">Vestiging op de factuur</div>
      <div class="a-vest__seg" id="aVestSeg" role="tablist">
        <button class="a-vest__btn" type="button" data-vest="Leiden" role="tab">Leiden</button>
        <button class="a-vest__btn" type="button" data-vest="Katwijk" role="tab">Katwijk</button>
      </div>
      <select id="mVestiging" class="a-vest__select" hidden><option>Leiden</option><option>Katwijk</option></select>
    </div>

    <!-- Step 1: zoek toestel + dienst -->
    <div class="a-card">
      <div class="a-step"><span class="a-step__n">1</span><h2>Zoek toestel &amp; dienst</h2><p>Kies een toestel en voeg de reparatie toe</p></div>
      <div class="a-search">{search_icon}<input id="aSearch" type="text" placeholder="Zoek op model, bv. iPhone 13 of Samsung S Serie"></div>
      <div class="a-chips" id="aChips"></div>
      <div class="a-devgrid" id="aDevGrid"></div>
      <div class="a-custom" style="margin-top:16px">
        <div class="a-field" style="margin-bottom:8px"><label>Staat het toestel er niet bij? Voeg handmatig toe</label></div>
        <div class="a-custom__row" style="grid-template-columns:1fr 150px auto">
          <div class="a-field"><label for="aManualName">Toestel</label><input id="aManualName" type="text" placeholder="bv. Fairphone 5"></div>
          <div class="a-field"><label for="aManualCat">Categorie</label><select id="aManualCat">{cat_opts}</select></div>
          <button class="a-add" type="button" id="aManual">Toevoegen</button>
        </div>
      </div>
    </div>

    <!-- Selection / cart -->
    <div class="a-card">
      <div class="a-step"><span class="a-step__n">&#9776;</span><h2>Reparaties op deze factuur</h2></div>
      <div class="a-cart" id="aCart"></div>
      <button class="a-add" type="button" id="aLosse" style="margin-top:14px">+ Losse regel of korting</button>
      <div class="a-totals" id="aTotals"></div>
    </div>

    <!-- Step 2: NAW + factuurgegevens -->
    <div class="a-card">
      <div class="a-step"><span class="a-step__n">2</span><h2>Klantgegevens &amp; factuur</h2></div>
      <form id="aForm" autocomplete="off">
        <div class="a-grid2">
          {admin_field("cNaam", "Naam klant", "Voor- en achternaam", span=True)}
          {admin_field("cStraat", "Adres", "Straat en huisnummer", span=True)}
          {admin_field("cPostcode", "Postcode", "0000 AA")}
          {admin_field("cPlaats", "Woonplaats", "Plaats")}
          {admin_field("cEmail", "E-mail (optioneel)", "klant@email.nl", typ="email")}
          {admin_field("cTel", "Telefoon (optioneel)", "06 ...", typ="tel")}
        </div>
        <div class="a-grid2" style="margin-top:14px">
          {admin_field("mNummer", "Factuurnummer", "")}
          {admin_field("mDatum", "Factuurdatum", "", typ="date")}
        </div>
        <div class="a-grid2" style="margin-top:14px">
          <div class="a-field"><label for="mBetaal">Betaalwijze</label><select id="mBetaal"><option>Pin</option><option>Contant</option><option>Op rekening</option></select></div>
          <div class="a-field"><label for="mNotitie">Notitie op factuur (optioneel)</label><input id="mNotitie" type="text" placeholder="bv. Toestel opgehaald"></div>
        </div>
      </form>
    </div>

    <!-- Step 3: printen -->
    <div class="a-card">
      <div class="a-step"><span class="a-step__n">3</span><h2>Printen</h2></div>
      <div class="a-actions">
        <button class="btn btn--primary btn--lg" type="button" id="aPrintFac">Print / PDF factuur</button>
        <button class="btn btn--line btn--lg" type="button" id="aPrintBon">Print bonnetje</button>
        <button class="btn btn--ghost btn--sm" type="button" id="aReset">Nieuwe factuur</button>
      </div>
      <p class="fac__note" style="margin-top:12px">Tip: kies in het printvenster &ldquo;Opslaan als PDF&rdquo; om te bewaren of te mailen. Voor het bonnetje kun je het papierformaat op 80&nbsp;mm zetten als je een bonprinter hebt.</p>
    </div>

  </div>

  <!-- RIGHT: live preview -->
  <div class="a-preview">
    <div class="a-tabs" id="aPreviewTabs">
      <button class="a-tab is-on" type="button" data-tab="factuur">Factuur</button>
      <button class="a-tab" type="button" data-tab="bon">Bonnetje</button>
    </div>
    <div class="a-stage" id="aStage"></div>
  </div>

</div>
</main>

<!-- service picker -->
<div class="a-modal" id="aModal"><div class="a-modal__panel" id="aModalBody"></div></div>

<!-- print target -->
<div id="printRoot" aria-hidden="true"></div>

<script src="../js/catalog.js?v={VERSION}" defer></script>
<script src="../js/admin.js?v={VERSION}" defer></script>
</body>
</html>'''

def admin_page():
    return admin_head() + "\n" + admin_body()

# ---------------------------------------------------------------- build
def webshop_body():
    products = [
        ("case",    "Hoesjes",      "Telefoonhoesjes",          "vanaf &euro; 9,95"),
        ("shield",  "Bescherming",  "Screenprotectors",         "vanaf &euro; 12,50"),
        ("plug",    "Opladen",      "Opladers &amp; adapters",  "vanaf &euro; 14,95"),
        ("cable",   "Kabels",       "USB-C &amp; Lightning",    "vanaf &euro; 7,95"),
        ("buds",    "Audio",        "Oordopjes &amp; headsets", "vanaf &euro; 19,95"),
        ("battery", "Onderweg",     "Powerbanks",               "vanaf &euro; 24,95"),
    ]
    icons = {
        "case":    '<rect x="7" y="3" width="10" height="18" rx="2.5"/><circle cx="12" cy="6" r=".7"/>',
        "shield":  '<path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>',
        "plug":    '<rect x="6" y="9" width="12" height="10" rx="2"/><path d="M9 9V5M15 9V5"/>',
        "cable":   '<path d="M8 4v6a4 4 0 0 0 8 0V4"/><path d="M12 14v6"/>',
        "buds":    '<circle cx="8" cy="9" r="3"/><circle cx="16" cy="15" r="3"/><path d="M8 12v3M16 12V9"/>',
        "battery": '<rect x="4" y="7" width="15" height="10" rx="2"/><line x1="21" y1="10.5" x2="21" y2="13.5"/><rect x="7" y="10" width="6" height="4" rx="1"/>',
    }
    cards = ""
    for icon, cat, name, price in products:
        cards += f'''<article class="shop-card reveal" data-reveal>
      <div class="shop-card__media"><svg viewBox="0 0 24 24">{icons[icon]}</svg></div>
      <div class="shop-card__body">
        <span class="shop-card__cat">{cat}</span>
        <h3 class="shop-card__name">{name}</h3>
        <div class="shop-card__row"><span class="shop-card__price">{price}</span><button class="shop-card__btn" type="button" disabled>Binnenkort</button></div>
      </div>
    </article>'''
    return f'''{page_hero("Webshop", "Accessoires &amp; meer", "Hoesjes, opladers, screenprotectors en meer. Binnenkort eenvoudig online te bestellen.", deco="b")}
<section class="section">
  <div class="container">
    <div class="shop-demo reveal" data-reveal>
      <span class="shop-demo__badge">Demo</span>
      <p>Deze webshop is nog in opbouw. De producten en prijzen hieronder zijn <strong>voorbeelden</strong> &mdash; online bestellen is nog niet mogelijk. Accessoires nodig? Kom gerust langs in onze winkel in <a href="locaties.html">Leiden of Katwijk</a>.</p>
    </div>
    <header class="section__head">
      {eyebrow("Ons assortiment")}
      <h2 class="section__title reveal" data-reveal>Accessoires voor elk toestel</h2>
    </header>
    <div class="shop-grid" data-stagger>{cards}</div>
  </div>
</section>'''

def build():
    os.makedirs(OUT, exist_ok=True)
    pages = {
        "index.html": page(
            "GSM Fixhouse · Telefoon, tablet &amp; laptop reparatie in Leiden &amp; Katwijk",
            "Snelle, eerlijke reparatie van telefoon, tablet, laptop, computer, console en smartwatch in Leiden en Katwijk. Klaar terwijl u wacht.",
            "home",
            home_hero() + device_categories() + why_us() + stats() + reviews(3, more=True, mist=True)),
        "reparaties.html": page(
            "Reparaties · GSM Fixhouse",
            "Reparatie van smartphone, laptop, computer, tablet, console en smartwatch. Bekijk wat wij voor u kunnen fixen.",
            "reparaties",
            page_hero("Onze reparaties", "Wat wij repareren", "Van smartphones tot spelcomputers. Bekijk de apparaten die wij dagelijks weer aan de praat krijgen.", deco="c")
            + device_categories() + process() + popular()),
        "alle-reparaties.html": page(
            "Alle reparaties &amp; prijzen · GSM Fixhouse",
            "Bekijk alle reparaties en indicatieprijzen per toestel. Zoek je apparaat en plan direct een reparatie.",
            "alle",
            alle_reparaties_body(),
            scripts=("js/main.js", "js/catalog.js", "js/flow.js")),
        "verkopen.html": page(
            "Verkoop je toestel · GSM Fixhouse",
            "Verkoop je telefoon, tablet, smartwatch of laptop eenvoudig en snel. Ontvang direct een eerlijke prijs.",
            "verkopen",
            verkopen_body(),
            scripts=("js/main.js", "js/catalog.js", "js/flow.js")),
        "webshop.html": page(
            "Webshop &middot; Accessoires &middot; GSM Fixhouse",
            "Hoesjes, opladers, screenprotectors en meer accessoires bij GSM Fixhouse. Binnenkort online te bestellen.",
            "webshop",
            webshop_body()),
        "zakelijk.html": page(
            "Zakelijke klanten · GSM Fixhouse",
            "Reparatie voor bedrijven en scholen. Vaste contactpersoon, prioriteit, ophaalservice en facturatie.",
            "zakelijk",
            zakelijk_body()),
        "over.html": page(
            "Over ons · GSM Fixhouse",
            "Uw lokale reparatiespecialist in Leiden en Katwijk. Lees ons verhaal, bekijk de winkels en de reviews.",
            "over",
            page_hero("Over GSM Fixhouse", "Uw lokale reparatiespecialist", "Twee winkels, jarenlange ervaring en duizenden tevreden klanten in de regio Leiden en Katwijk.", deco="d")
            + about() + locations() + reviews(6, mist=True)),
        "locaties.html": page(
            "Locaties · GSM Fixhouse",
            "Bezoek GSM Fixhouse in Leiden of Katwijk. Adres, openingstijden en contactgegevens.",
            "locaties",
            page_hero("Locaties", "Kom langs in Leiden of Katwijk", "Loop gerust binnen of maak vooraf een afspraak. Wij staan voor u klaar.", deco="e")
            + locations()),
    }
    for name, html in pages.items():
        with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
            f.write(html)
    # intern admin (niet gelinkt, niet geindexeerd) -> /admin/
    admin_dir = os.path.join(OUT, "admin")
    os.makedirs(admin_dir, exist_ok=True)
    with open(os.path.join(admin_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(admin_page())
    print("Built:", ", ".join(pages.keys()), "+ admin/index.html")

if __name__ == "__main__":
    build()
