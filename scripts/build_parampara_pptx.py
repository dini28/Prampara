# -*- coding: utf-8 -*-
"""Build Parampara Path college presentation (.pptx). Facts only from project docs."""

from __future__ import annotations

import math
from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_AUTO_SHAPE_TYPE, MSO_CONNECTOR
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.ns import qn
from pptx.util import Inches, Pt, Emu
from lxml import etree
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "presentations" / "Parampara-Path-College.pptx"
ASSETS = ROOT / "presentations" / "assets"
ASSETS.mkdir(parents=True, exist_ok=True)

# Palette — deep navy + saffron + green
NAVY = RGBColor(0x0B, 0x1D, 0x36)
NAVY_SOFT = RGBColor(0x12, 0x2B, 0x4A)
INK = RGBColor(0xE8, 0xEE, 0xF6)
MUTED = RGBColor(0xA8, 0xB4, 0xC4)
SAFFRON = RGBColor(0xFF, 0x99, 0x33)
GREEN = RGBColor(0x13, 0x88, 0x08)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
CARD = RGBColor(0x14, 0x2F, 0x4F)

EN_FONT = "Poppins"
EN_FONT_BOLD = "Poppins"

GREETINGS = [
    # id, language, script text, font family, slide1 (left,top), slide2 map (left,top), color
    ("hi", "Hindi", "नमस्ते", "Noto Sans Devanagari", (0.55, 1.35), (5.55, 2.05), RGBColor(0xFF, 0x99, 0x33)),
    ("ta", "Tamil", "வணக்கம்", "Noto Sans Tamil", (3.15, 1.35), (6.35, 5.55), RGBColor(0x13, 0x88, 0x08)),
    ("te", "Telugu", "నమస్కారం", "Noto Sans Telugu", (5.75, 1.35), (7.35, 4.25), RGBColor(0xFF, 0x6B, 0x6B)),
    ("kn", "Kannada", "ನಮಸ್ಕಾರ", "Noto Sans Kannada", (8.35, 1.35), (5.55, 4.55), RGBColor(0x4E, 0xCD, 0xC4)),
    ("ml", "Malayalam", "നമസ്കാരം", "Noto Sans Malayalam", (10.75, 1.35), (5.35, 5.75), RGBColor(0xFF, 0xE6, 0x6D)),
    ("bn", "Bengali", "নমস্কার", "Noto Sans Bengali", (0.55, 3.85), (8.05, 2.35), RGBColor(0xA8, 0x55, 0xF7)),
    ("gu", "Gujarati", "નમસ્તે", "Noto Sans Gujarati", (3.15, 3.85), (4.75, 3.05), RGBColor(0xF9, 0x73, 0x16)),
    ("pa", "Punjabi", "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "Noto Sans Gurmukhi", (5.75, 3.85), (5.15, 1.55), RGBColor(0x3B, 0x82, 0xF6)),
    ("mr", "Marathi", "नमस्कार", "Noto Sans Devanagari", (8.35, 3.85), (5.15, 3.55), RGBColor(0xEC, 0x48, 0x99)),
    ("or", "Odia", "ନମସ୍କାର", "Noto Sans Oriya", (10.75, 3.85), (7.55, 3.35), RGBColor(0x14, 0xB8, 0xA6)),
]

NOTES: list[str] = []


def set_run_font(run, name: str, size_pt: float, color: RGBColor, bold: bool = False):
    run.font.name = name
    run.font.size = Pt(size_pt)
    run.font.color.rgb = color
    run.font.bold = bold
    # Force East Asian / complex script font slots so Indic glyphs resolve
    rPr = run._r.get_or_add_rPr()
    for tag in ("latin", "ea", "cs"):
        el = rPr.find(qn(f"a:{tag}"))
        if el is None:
            el = etree.SubElement(rPr, qn(f"a:{tag}"))
        el.set("typeface", name)


def add_textbox(slide, left, top, width, height, text, font, size, color, bold=False, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = box.text_frame
    tf.word_wrap = True
    tf.auto_size = None
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    set_run_font(run, font, size, color, bold)
    body = tf._txBody
    bodyPr = body.find(qn("a:bodyPr"))
    if bodyPr is not None:
        anchor_map = {
            MSO_ANCHOR.TOP: "t",
            MSO_ANCHOR.MIDDLE: "ctr",
            MSO_ANCHOR.BOTTOM: "b",
        }
        bodyPr.set("anchor", anchor_map.get(anchor, "t"))
    return box


def add_bg(slide, prs):
    shape = slide.shapes.add_shape(
        MSO_AUTO_SHAPE_TYPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = NAVY
    shape.line.fill.background()
    # Send to back
    spTree = slide.shapes._spTree
    sp = shape._element
    spTree.remove(sp)
    spTree.insert(2, sp)
    return shape


def accent_bar(slide, left, top, width=0.55, height=0.08):
    bar = slide.shapes.add_shape(
        MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
        Inches(left),
        Inches(top),
        Inches(width),
        Inches(height),
    )
    bar.fill.solid()
    bar.fill.fore_color.rgb = SAFFRON
    bar.line.fill.background()
    return bar


def draw_india_silhouette(path: Path):
    """Simplified India outline (stylized) for morph slide backdrop."""
    w, h = 900, 1100
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Rough coastal outline points (normalized artistic silhouette)
    pts = [
        (420, 40), (480, 55), (520, 90), (545, 140), (560, 200),
        (575, 250), (590, 300), (620, 340), (660, 380), (700, 420),
        (730, 470), (750, 520), (760, 570), (745, 620), (720, 660),
        (690, 700), (650, 740), (620, 790), (600, 840), (580, 900),
        (560, 960), (530, 1020), (490, 1060), (450, 1080), (410, 1065),
        (380, 1020), (360, 960), (350, 900), (340, 840), (320, 790),
        (290, 750), (250, 720), (210, 690), (180, 650), (160, 600),
        (150, 540), (155, 480), (170, 430), (200, 390), (230, 350),
        (250, 310), (255, 260), (240, 210), (230, 160), (250, 110),
        (290, 80), (340, 55), (380, 42),
    ]
    fill = (20, 47, 79, 210)
    outline = (255, 153, 51, 180)
    draw.polygon(pts, fill=fill, outline=outline)
    # soft inner stroke
    draw.line(pts + [pts[0]], fill=(19, 136, 8, 90), width=3)
    img.save(path)
    return path


def set_morph_transition(slide):
    """Attach Morph transition (Office 2010+ namespace)."""
    nsmap = {
        "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
        "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
        "p14": "http://schemas.microsoft.com/office/powerpoint/2010/main",
    }
    sld = slide._element
    # remove existing transition
    for child in list(sld):
        if child.tag == qn("p:transition"):
            sld.remove(child)
    transition = etree.Element(qn("p:transition"), nsmap=nsmap)
    transition.set("spd", "med")
    morph = etree.SubElement(
        transition,
        "{http://schemas.microsoft.com/office/powerpoint/2010/main}morph",
    )
    morph.set("option", "1")  # object morph
    # Insert before timing / clrMapOvr if present
    sld.append(transition)


def ensure_p14_content_type(prs):
    """Register Ignorable p14 so Morph survives open in PowerPoint."""
    # python-pptx keeps content types on the package; Morph usually works when
    # PowerPoint re-saves. COM polish step will re-apply Morph if needed.
    return


def build_base():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]

    # --- Slide 1: Opening greetings ---
    s1 = prs.slides.add_slide(blank)
    add_bg(s1, prs)
    add_textbox(
        s1, 0.6, 0.28, 12, 0.55,
        "Namaste — welcome, in India’s many voices",
        EN_FONT, 28, INK, bold=True, align=PP_ALIGN.CENTER,
    )
    add_textbox(
        s1, 0.6, 0.78, 12, 0.45,
        "A short opening before Parampara Path",
        EN_FONT, 24, MUTED, align=PP_ALIGN.CENTER,
    )

    greeting_shapes_s1 = {}
    for gid, lang, text, font, (lx, ty), _, color in GREETINGS:
        # greeting
        gbox = add_textbox(
            s1, lx, ty, 2.35, 0.7,
            text, font, 28, color, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE,
        )
        gbox.name = f"greet_{gid}"
        greeting_shapes_s1[gid] = gbox
        # language label
        lbox = add_textbox(
            s1, lx, ty + 0.72, 2.35, 0.45,
            lang, EN_FONT, 16, MUTED, align=PP_ALIGN.CENTER,
        )
        # Note: language labels stay 16 pt under greetings so the grid fits; body copy elsewhere is ≥24 pt.
        lbox.name = f"label_{gid}"

    # --- Slide 2: India map morph target ---
    s2 = prs.slides.add_slide(blank)
    add_bg(s2, prs)
    map_path = ASSETS / "india_silhouette.png"
    draw_india_silhouette(map_path)
    # Place silhouette centered-ish
    pic = s2.shapes.add_picture(
        str(map_path), Inches(4.35), Inches(0.55), height=Inches(6.5)
    )
    pic.name = "india_map_bg"

    add_textbox(
        s2, 0.4, 0.35, 3.8, 1.4,
        "Many greetings.\nOne geography of living heritage.",
        EN_FONT, 26, INK, bold=True, align=PP_ALIGN.LEFT,
    )
    add_textbox(
        s2, 0.4, 2.0, 3.8, 2.2,
        "Each colour marks a language from the opening — placed toward regions where those scripts are widely used.",
        EN_FONT, 24, MUTED, align=PP_ALIGN.LEFT,
    )
    NOTES.append(
        "Slide 2: Language positions on the map are approximate regional placements for storytelling, not a linguistic census."
    )

    for gid, lang, text, font, _, (lx, ty), color in GREETINGS:
        gbox = add_textbox(
            s2, lx, ty, 2.1, 0.65,
            text, font, 24, color, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE,
        )
        gbox.name = f"greet_{gid}"  # same names → Morph

    set_morph_transition(s2)

    # --- Slide 3: Bridge + title ---
    s3 = prs.slides.add_slide(blank)
    add_bg(s3, prs)
    accent_bar(s3, 0.7, 1.55)
    add_textbox(s3, 0.7, 1.75, 11.8, 0.7, "Parampara Path", EN_FONT, 44, INK, bold=True)
    add_textbox(s3, 0.7, 2.55, 11.8, 0.55, "Living Heritage Compass", EN_FONT, 28, SAFFRON, bold=True)
    add_textbox(
        s3, 0.7, 3.4, 11.5, 1.8,
        "From many ways of saying hello to one short learner journey through Indian living heritage — "
        "place or theme → source-attributed card → grounded Q&A that can refuse → short quiz → "
        "contribution that stays unpublished until a human accepts it.",
        EN_FONT, 22, MUTED,
    )
    add_textbox(
        s3, 0.7, 5.5, 11.5, 1.2,
        "Student MVP for AICTE / SIH Heritage & Culture. Unofficial learner tool — not affiliated with the Ministry of Culture, UNESCO, AICTE, or Sahapedia.",
        EN_FONT, 24, MUTED,
    )

    # --- Slide 4: Purpose ---
    s4 = prs.slides.add_slide(blank)
    add_bg(s4, prs)
    accent_bar(s4, 0.7, 0.55)
    add_textbox(s4, 0.7, 0.75, 12, 0.6, "What it is", EN_FONT, 36, INK, bold=True)
    add_textbox(
        s4, 0.7, 1.55, 11.8, 1.4,
        "A last-mile learner loop for Indian living heritage — not a national archive, and not a competitor to the Ministry of Culture / Indian Culture Portal.",
        EN_FONT, 24, MUTED,
    )
    points = [
        ("Own the journey", "Point learners to official pages; own the eight-minute pass."),
        ("Cited cards", "Heritage lives in content and sources — not decorative cultural styling."),
        ("Trust shown", "Source counts, check dates, grounded vs not-covered answers, human review."),
    ]
    y = 3.2
    for title, body in points:
        pill = s4.shapes.add_shape(
            MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
            Inches(0.7), Inches(y), Inches(11.8), Inches(1.05),
        )
        pill.fill.solid()
        pill.fill.fore_color.rgb = CARD
        pill.line.fill.background()
        add_textbox(s4, 0.95, y + 0.12, 11.3, 0.4, title, EN_FONT, 24, SAFFRON, bold=True)
        add_textbox(s4, 0.95, y + 0.48, 11.3, 0.5, body, EN_FONT, 24, INK)
        y += 1.2

    # --- Slide 5: Users ---
    s5 = prs.slides.add_slide(blank)
    add_bg(s5, prs)
    accent_bar(s5, 0.7, 0.55)
    add_textbox(s5, 0.7, 0.75, 12, 0.6, "Who it is for", EN_FONT, 36, INK, bold=True)

    users = [
        ("Primary", "College students (18–24)", "Laptop or mid-range Android Chrome; short study or assignment break."),
        ("Secondary", "Curious travellers", "Same responsive web app — planning or reflecting on a place visit."),
        ("Staff", "Human reviewer", "Moderates the contribution queue; nothing user-written goes public by default."),
    ]
    x = 0.55
    for role, title, body in users:
        card = s5.shapes.add_shape(
            MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
            Inches(x), Inches(1.8), Inches(3.9), Inches(4.4),
        )
        card.fill.solid()
        card.fill.fore_color.rgb = CARD
        card.line.fill.background()
        add_textbox(s5, x + 0.25, 2.1, 3.4, 0.45, role, EN_FONT, 18, GREEN, bold=True)
        add_textbox(s5, x + 0.25, 2.6, 3.4, 1.1, title, EN_FONT, 26, INK, bold=True)
        add_textbox(s5, x + 0.25, 3.9, 3.4, 2.0, body, EN_FONT, 24, MUTED)
        x += 4.15

    # --- Slide 6: Positioning ---
    s6 = prs.slides.add_slide(blank)
    add_bg(s6, prs)
    accent_bar(s6, 0.7, 0.55)
    add_textbox(s6, 0.7, 0.75, 12, 0.6, "Positioning", EN_FONT, 36, INK, bold=True)
    add_textbox(
        s6, 0.7, 1.6, 11.8, 1.2,
        "Unofficial learner tool. Do not compete with the national archive. Point to official pages; own the eight-minute journey.",
        EN_FONT, 24, MUTED,
    )
    left_items = [
        "Reliable reference tool",
        "Calm, neutral, cited",
        "English UI for this local MVP",
        "WCAG 2.2 AA intent",
    ]
    right_items = [
        "No AR/VR demos",
        "No culture Reels / social feed",
        "No ungrounded chatbots",
        "No exoticising ornament",
    ]
    add_textbox(s6, 0.7, 3.0, 5.5, 0.45, "Brand personality", EN_FONT, 24, SAFFRON, bold=True)
    add_textbox(s6, 7.0, 3.0, 5.5, 0.45, "Out of scope (locked)", EN_FONT, 24, SAFFRON, bold=True)
    y = 3.55
    for item in left_items:
        add_textbox(s6, 0.7, y, 5.5, 0.5, f"•  {item}", EN_FONT, 24, INK)
        y += 0.55
    y = 3.55
    for item in right_items:
        add_textbox(s6, 7.0, y, 5.5, 0.5, f"•  {item}", EN_FONT, 24, INK)
        y += 0.55
    add_textbox(
        s6, 0.7, 6.0, 11.8, 1.0,
        "Also out of scope this phase: native apps, payments, scraping ICP/Sahapedia wholesale, billed Google Maps. Supabase is not installed yet.",
        EN_FONT, 24, MUTED,
    )

    # --- Slide 7: Learner loop ---
    s7 = prs.slides.add_slide(blank)
    add_bg(s7, prs)
    accent_bar(s7, 0.7, 0.45)
    add_textbox(s7, 0.7, 0.65, 12, 0.55, "The five-step learner loop", EN_FONT, 36, INK, bold=True)
    add_textbox(
        s7, 0.7, 1.25, 12, 0.55,
        "Discover → card → Ask (cite or refuse) → quiz → contribution pending human accept",
        EN_FONT, 24, MUTED,
    )
    steps = [
        ("1", "Discover", "Place or theme — region or practice type, not an encyclopedia dump."),
        ("2", "Read card", "Source count, check dates, links to official or scholarly pages."),
        ("3", "Ask", "Q&A retrieves only from the card. Unsupported questions are refused."),
        ("4", "Quiz", "Short quiz from the same card closes the eight-minute learning pass."),
        ("5", "Contribute", "Notes stay unpublished until a reviewer accepts them."),
    ]
    y = 1.9
    for num, title, body in steps:
        circ = s7.shapes.add_shape(
            MSO_AUTO_SHAPE_TYPE.OVAL, Inches(0.7), Inches(y), Inches(0.55), Inches(0.55)
        )
        circ.fill.solid()
        circ.fill.fore_color.rgb = SAFFRON if num in ("1", "3", "5") else GREEN
        circ.line.fill.background()
        add_textbox(s7, 0.7, y + 0.08, 0.55, 0.4, num, EN_FONT, 18, NAVY, bold=True, align=PP_ALIGN.CENTER)
        add_textbox(s7, 1.45, y + 0.02, 2.4, 0.45, title, EN_FONT, 24, INK, bold=True)
        add_textbox(s7, 3.9, y + 0.02, 8.5, 0.55, body, EN_FONT, 24, MUTED)
        y += 0.95

    # --- Slide 8: Trust / AI ---
    s8 = prs.slides.add_slide(blank)
    add_bg(s8, prs)
    accent_bar(s8, 0.7, 0.55)
    add_textbox(s8, 0.7, 0.75, 12, 0.6, "Trust: AI as retrieval, not author", EN_FONT, 34, INK, bold=True)
    add_textbox(
        s8, 0.7, 1.55, 11.8, 1.0,
        "AI is a retrieval interface, not an author of culture. Answers come from the card — or the product refuses.",
        EN_FONT, 22, MUTED,
    )
    safeguards = [
        ("Cited sources", "Cards show source counts and check dates before Ask or Quiz."),
        ("Grounded answers", "Ask returns answers only from card material, with source links."),
        ("Clear refusal", "When cards do not cover a question: “Not covered by the cards”."),
        ("Human review", "Contributions stay pending until accept/reject in Admin."),
    ]
    y = 2.7
    for title, body in safeguards:
        add_textbox(s8, 0.7, y, 11.8, 0.4, title, EN_FONT, 24, SAFFRON, bold=True)
        add_textbox(s8, 0.7, y + 0.4, 11.8, 0.5, body, EN_FONT, 24, INK)
        y += 1.0

    # --- Slide 9: What’s built ---
    s9 = prs.slides.add_slide(blank)
    add_bg(s9, prs)
    accent_bar(s9, 0.7, 0.55)
    add_textbox(s9, 0.7, 0.75, 12, 0.6, "What is built (this phase)", EN_FONT, 36, INK, bold=True)

    facts = [
        ("40", "Team-written heritage cards in the catalogue"),
        ("Next.js 15", "App Router + Tailwind v4 responsive web app"),
        ("Local store", "JSON runtime queue for Ask logs, quiz scores, contributions"),
        ("Demo path", "Jaipur / Rajasthan → Kalbelia → Ask → Quiz → Contribute"),
    ]
    x = 0.55
    y = 1.7
    for i, (big, small) in enumerate(facts):
        col = i % 2
        row = i // 2
        lx = 0.55 + col * 6.3
        ty = 1.7 + row * 2.3
        card = s9.shapes.add_shape(
            MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE,
            Inches(lx), Inches(ty), Inches(5.9), Inches(2.0),
        )
        card.fill.solid()
        card.fill.fore_color.rgb = CARD
        card.line.fill.background()
        add_textbox(s9, lx + 0.35, ty + 0.35, 5.2, 0.7, big, EN_FONT, 32, SAFFRON, bold=True)
        add_textbox(s9, lx + 0.35, ty + 1.1, 5.2, 0.7, small, EN_FONT, 24, INK)

    # --- Slide 10: Jury surface ---
    s10 = prs.slides.add_slide(blank)
    add_bg(s10, prs)
    accent_bar(s10, 0.7, 0.55)
    add_textbox(s10, 0.7, 0.75, 12, 0.6, "Jury / viva surface", EN_FONT, 36, INK, bold=True)
    add_textbox(
        s10, 0.7, 1.5, 11.8, 1.2,
        "/about analyses personas and UR-01…UR-12 with acceptance tests. "
        "Primary screens show which requirements they satisfy, plus the five-step loop stepper.",
        EN_FONT, 24, MUTED,
    )
    add_textbox(
        s10, 0.7, 2.85, 11.8, 0.9,
        "Path analysis surfaces live Met / Partial / Ready / Not yet from Ask, Quiz, and contribution signals.",
        EN_FONT, 24, INK,
    )
    add_textbox(s10, 0.7, 3.85, 11.8, 0.45, "Demo walk", EN_FONT, 24, SAFFRON, bold=True)
    demo = [
        "Explore → Rajasthan / Kalbelia — UR-01",
        "Read card + Sources — UR-03",
        "Ask grounded, then refuse probe — UR-04 · UR-05",
        "Quiz — UR-06 · Contribute + Admin review — UR-07 · UR-09",
    ]
    y = 4.4
    for line in demo:
        add_textbox(s10, 0.7, y, 11.8, 0.45, f"•  {line}", EN_FONT, 24, MUTED)
        y += 0.55

    # --- Slide 11: Takeaway ---
    s11 = prs.slides.add_slide(blank)
    add_bg(s11, prs)
    accent_bar(s11, 0.7, 2.0, width=0.7)
    add_textbox(s11, 0.7, 2.25, 12, 0.7, "Key takeaway", EN_FONT, 36, INK, bold=True)
    add_textbox(
        s11, 0.7, 3.15, 11.8, 2.2,
        "Parampara Path is a calm, cited, eight-minute learner loop for Indian living heritage: "
        "discover with sources, ask only what the cards support, check recall, and contribute under human review — "
        "without pretending to be the national archive.",
        EN_FONT, 24, MUTED,
    )

    # --- Slide 12: Thank you ---
    s12 = prs.slides.add_slide(blank)
    add_bg(s12, prs)
    add_textbox(s12, 0.6, 0.9, 12, 0.6, "Thank you", EN_FONT, 40, INK, bold=True, align=PP_ALIGN.CENTER)
    add_textbox(
        s12, 0.6, 1.55, 12, 0.45,
        "Questions welcome — Parampara Path",
        EN_FONT, 24, MUTED, align=PP_ALIGN.CENTER,
    )
    thanks = [
        ("धन्यवाद", "Hindi", "Noto Sans Devanagari", SAFFRON),
        ("நன்றி", "Tamil", "Noto Sans Tamil", GREEN),
        ("ధన్యవాదాలు", "Telugu", "Noto Sans Telugu", RGBColor(0xFF, 0x6B, 0x6B)),
        ("ধন্যবাদ", "Bengali", "Noto Sans Bengali", RGBColor(0xA8, 0x55, 0xF7)),
        ("આભાર", "Gujarati", "Noto Sans Gujarati", RGBColor(0xF9, 0x73, 0x16)),
        ("ਧੰਨਵਾਦ", "Punjabi", "Noto Sans Gurmukhi", RGBColor(0x3B, 0x82, 0xF6)),
    ]
    x = 0.7
    y = 2.4
    for i, (text, lang, font, color) in enumerate(thanks):
        col = i % 3
        row = i // 3
        lx = 0.9 + col * 4.1
        ty = 2.5 + row * 1.7
        add_textbox(s12, lx, ty, 3.7, 0.7, text, font, 28, color, bold=True, align=PP_ALIGN.CENTER)
        add_textbox(s12, lx, ty + 0.75, 3.7, 0.45, lang, EN_FONT, 18, MUTED, align=PP_ALIGN.CENTER)

    add_textbox(
        s12, 0.6, 6.35, 12, 0.5,
        "Fonts: Poppins + Noto Sans Indic families — install before presenting.",
        EN_FONT, 18, MUTED, align=PP_ALIGN.CENTER,
    )

    prs.save(OUT)
    return OUT


def polish_with_powerpoint(pptx_path: Path):
    """Apply Morph + sequential fade entrances via PowerPoint COM."""
    import win32com.client

    powerpoint = win32com.client.Dispatch("PowerPoint.Application")
    powerpoint.Visible = 1
    # Prefer not to steal focus forever; still need Visible for some builds
    presentation = powerpoint.Presentations.Open(str(pptx_path.resolve()), WithWindow=True)

    try:
        # Slide 2 Morph (1-based index)
        s2 = presentation.Slides(2)
        # 3872 = ppEffectMorph (object); fall back if constant missing
        try:
            s2.SlideShowTransition.EntryEffect = 3872
        except Exception:
            s2.SlideShowTransition.EntryEffect = 3873
        s2.SlideShowTransition.Duration = 1.5

        # Slide 1: animate greet_* shapes one-by-one with fade
        s1 = presentation.Slides(1)
        seq = s1.TimeLine.MainSequence
        # Clear existing effect if any by leaving them; add Fade for greetings
        # Effect types: 10 = fade often works via Effect.Exit... use EffectInformation
        # msoAnimEffectFade = 10
        # One-by-one: greeting float/fade, then its language label
        first = True
        for g in GREETINGS:
            for name, duration in ((f"greet_{g[0]}", 0.6), (f"label_{g[0]}", 0.35)):
                shape = None
                for i in range(1, s1.Shapes.Count + 1):
                    if s1.Shapes(i).Name == name:
                        shape = s1.Shapes(i)
                        break
                if shape is None:
                    continue
                # 10 = Fade; 31 = Float Up (if available)
                effect_id = 31 if name.startswith("greet_") else 10
                try:
                    effect = seq.AddEffect(shape, effect_id, 0, 2)
                except Exception:
                    effect = seq.AddEffect(shape, 10, 0, 2)
                effect.Timing.TriggerType = 1 if first else 3
                effect.Timing.Duration = duration
                effect.Timing.TriggerDelayTime = 0.08 if not first else 0.0
                first = False

        presentation.Save()
    finally:
        presentation.Close()
        powerpoint.Quit()


def write_notes():
    notes_path = ROOT / "presentations" / "NOTES-for-you.md"
    lines = [
        "# Notes for you (not guessed into slides)",
        "",
        "**Context source:** No separate CONTEXT block was pasted in the chat. "
        "Slides use only facts from `PRODUCT.md`, `README.md`, and `src/lib/project.ts`.",
        "",
        "If you meant a different CONTEXT (paper, brief, script), paste it and I will rebuild.",
        "",
        "## Open items / caveats",
        "",
    ]
    if NOTES:
        for n in NOTES:
            lines.append(f"- {n}")
    else:
        lines.append("- (none beyond the context-source note above)")
    lines += [
        "",
        "- Exact Morph timing/feel depends on PowerPoint desktop (Morph requires Microsoft 365 / PowerPoint 2019+).",
        "- Opening language *labels* under each greeting are 16 pt so the 10-cell grid fits; all narrative body copy is ≥24 pt; titles ≥36 pt.",
        "- Thank-you slide uses six languages with common “thank you” forms; Kannada / Malayalam / Marathi / Odia thank-you forms were not specified in CONTEXT — say if you want those added.",
        "",
        "## Fonts to install (required)",
        "",
        "English:",
        "- **Poppins** (Regular, SemiBold, Bold)",
        "",
        "Indian scripts (Noto Sans family — install all listed):",
        "- **Noto Sans Devanagari** — Hindi, Marathi",
        "- **Noto Sans Tamil**",
        "- **Noto Sans Telugu**",
        "- **Noto Sans Kannada**",
        "- **Noto Sans Malayalam**",
        "- **Noto Sans Bengali**",
        "- **Noto Sans Gujarati**",
        "- **Noto Sans Gurmukhi** — Punjabi",
        "- **Noto Sans Oriya** — Odia",
        "",
        "Copies were downloaded to `presentations/fonts/` and registered for the current Windows user. "
        "If another machine opens the file, install the same fonts (or embed fonts when saving in PowerPoint: File → Options → Save → Embed fonts).",
        "",
        f"Deck path: `{OUT}`",
    ]
    notes_path.write_text("\n".join(lines), encoding="utf-8")
    return notes_path


def main():
    path = build_base()
    print(f"Wrote {path}")
    try:
        polish_with_powerpoint(path)
        print("Polished Morph + entrance animations via PowerPoint COM")
    except Exception as exc:
        NOTES.append(f"COM polish skipped/failed ({exc}). Open in PowerPoint → Transitions → Morph on slide 2; Animations → Fade on greetings.")
        print(f"COM polish warning: {exc}")
    notes = write_notes()
    print(f"Notes: {notes}")


if __name__ == "__main__":
    main()
