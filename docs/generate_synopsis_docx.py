"""
Generate GITS/RTU Major Project Synopsis DOCX.
Target: ~11 pages | Font: Times New Roman | Body 12pt | Headings 14pt | 1.5 spacing
"""

from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, Cm, Twips
from docx.enum.table import WD_TABLE_ALIGNMENT


OUT = Path(__file__).with_name("Parampara_Path_Major_Project_Synopsis.docx")
FONT = "Times New Roman"


def set_run(run, size=12, bold=False, italic=False):
    run.font.name = FONT
    run._element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic


def add_para(
    doc,
    text="",
    size=12,
    bold=False,
    italic=False,
    align=WD_ALIGN_PARAGRAPH.JUSTIFY,
    space_before=0,
    space_after=4,
    line_spacing=1.5,
    first_line_indent=None,
):
    p = doc.add_paragraph()
    p.alignment = align
    pf = p.paragraph_format
    pf.space_before = Pt(space_before)
    pf.space_after = Pt(space_after)
    pf.line_spacing = line_spacing
    if first_line_indent is not None:
        pf.first_line_indent = Cm(first_line_indent)
    if text:
        set_run(p.add_run(text), size=size, bold=bold, italic=italic)
    return p


def add_rich_para(doc, parts, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.5):
    """parts: list of (text, bold, size)"""
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    for text, bold, size in parts:
        set_run(p.add_run(text), size=size, bold=bold)
    return p


def add_heading_section(doc, text):
    return add_para(
        doc,
        text,
        size=14,
        bold=True,
        align=WD_ALIGN_PARAGRAPH.LEFT,
        space_before=10,
        space_after=6,
        line_spacing=1.5,
    )


def add_subheading(doc, text):
    return add_para(
        doc,
        text,
        size=12,
        bold=True,
        align=WD_ALIGN_PARAGRAPH.LEFT,
        space_before=8,
        space_after=3,
        line_spacing=1.5,
    )


def add_bullet(doc, text, size=12):
    p = doc.add_paragraph(style="List Bullet")
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.5
    p.paragraph_format.space_after = Pt(3)
    p.clear()
    set_run(p.add_run(text), size=size)
    return p


def add_numbered(doc, text, size=12):
    p = doc.add_paragraph(style="List Number")
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.5
    p.paragraph_format.space_after = Pt(4)
    p.clear()
    set_run(p.add_run(text), size=size)
    return p


def set_cell_text(cell, text, bold=False, size=11, center=False):
    cell.text = ""
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER if center else WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(2)
    set_run(p.add_run(text), size=size, bold=bold)


def add_table(doc, headers, rows, col_widths=None):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(headers):
        set_cell_text(table.rows[0].cells[i], h, bold=True, size=11, center=True)
    for r_i, row in enumerate(rows):
        for c_i, val in enumerate(row):
            set_cell_text(table.rows[r_i + 1].cells[c_i], val, size=11)
    if col_widths:
        for row in table.rows:
            for idx, w in enumerate(col_widths):
                row.cells[idx].width = Inches(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(8)
    return table


def build():
    doc = Document()

    # Page setup: A4, 1 inch margins
    section = doc.sections[0]
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    section.left_margin = Inches(1.0)
    section.right_margin = Inches(1.0)
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)

    # Default style
    style = doc.styles["Normal"]
    style.font.name = FONT
    style.font.size = Pt(12)
    style._element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    style.paragraph_format.line_spacing = 1.5

    # ========== COVER PAGE ==========
    for _ in range(3):
        add_para(doc, "", size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)

    add_para(doc, "A", size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2)
    add_para(doc, "SYNOPSIS", size=18, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2)
    add_para(doc, "of", size=14, bold=False, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2)
    add_para(doc, "MAJOR PROJECT", size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2)
    add_para(doc, "on", size=14, bold=False, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=12)

    add_para(
        doc,
        "Parampara Path – Living Heritage Compass",
        size=16,
        bold=True,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        space_after=4,
    )
    add_para(
        doc,
        "(Web Based Learning System for Indian Living Heritage)",
        size=12,
        italic=True,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        space_after=24,
    )

    add_para(doc, "Submitted by", size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)
    add_para(
        doc,
        "_________________________________",
        size=12,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        space_after=2,
    )
    add_para(
        doc,
        "Student Name (RTU Roll No.)",
        size=12,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        space_after=24,
    )

    # Guide / HOD table
    t = doc.add_table(rows=2, cols=2)
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_cell_text(t.rows[0].cells[0], "Project Guide", bold=True, size=12, center=True)
    set_cell_text(t.rows[0].cells[1], "Head of Department", bold=True, size=12, center=True)
    set_cell_text(t.rows[1].cells[0], "Dr. Ruchi Vyas", size=12, center=True)
    set_cell_text(t.rows[1].cells[1], "Dr. Mayank Patel", size=12, center=True)

    add_para(doc, "", space_after=36)
    add_para(
        doc,
        "Geetanjali Institute of Technical Studies, Dabok, Udaipur (Raj.)",
        size=12,
        bold=True,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        space_after=4,
    )
    add_para(
        doc,
        "Department of Computer Science and Engineering",
        size=12,
        bold=True,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        space_after=4,
    )
    add_para(doc, "November, 2026", size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)

    doc.add_page_break()

    # ========== PROBLEM STATEMENT ==========
    add_heading_section(doc, "Problem Statement:")

    add_para(
        doc,
        "India has a very rich living heritage. This includes folk songs and dances, "
        "traditional crafts, festivals, oral stories and local knowledge of different "
        "communities. Today, information about these topics is available on many websites "
        "such as government culture portals, UNESCO pages and other educational sites. "
        "Still, for a normal college student, it is not easy to use this information in a "
        "simple and correct way.",
    )

    add_para(
        doc,
        "After studying this problem, we found the following main difficulties:",
    )

    add_numbered(
        doc,
        "Big culture websites have too much data. If a student wants to learn only one "
        "topic of one place (for example Kalbelia dance of Rajasthan), he/she has to open "
        "many pages and links. This wastes time.",
    )
    add_numbered(
        doc,
        "On Google and social media, many blogs and posts give wrong or half information. "
        "Students cannot easily check which line is taken from a real source and which "
        "line is only someone’s opinion.",
    )
    add_numbered(
        doc,
        "Nowadays students also use AI chatbots for answers. Sometimes these tools create "
        "wrong facts about rituals, timings, prices or community rules. For heritage "
        "topics, such wrong answers can create misunderstanding and are not safe.",
    )
    add_numbered(
        doc,
        "After reading about a topic, there is usually no small test to check what the "
        "student has learned. Also, if a student wants to add a local note, there is no "
        "proper system where a teacher or admin can check the note before it becomes public.",
    )

    add_para(doc, "So, the problem for our major project is:", space_before=6)

    add_para(
        doc,
        "To develop a simple web application which helps college students to find living "
        "heritage by state/region or type, read short cards with source links, ask "
        "questions that are answered only from those cards (or clearly say “I do not know” "
        "when information is not present), attempt a short quiz, and submit notes that "
        "stay pending until an admin reviews them.",
        bold=True,
    )

    add_para(
        doc,
        "Our project name is Parampara Path (Living Heritage Compass). It is only a "
        "student learning tool. It is not an official website of Ministry of Culture, "
        "UNESCO or any government department.",
    )

    # ========== BRIEF DESCRIPTION ==========
    add_heading_section(doc, "Brief Description:")

    add_para(
        doc,
        "Parampara Path is a web based major project developed by us in the Computer "
        "Science and Engineering department. The idea of this project is to give students "
        "a short and clear path to learn about Indian living heritage.",
    )

    add_para(doc, "In this project, the student follows five simple steps:", space_after=4)
    add_para(
        doc,
        "1) Discover → 2) Read card → 3) Ask question → 4) Give quiz → 5) Contribute note (after admin check)",
        bold=True,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        space_after=10,
    )

    add_subheading(doc, "What our system does")

    add_rich_para(
        doc,
        [
            ("1. Heritage cards: ", True, 12),
            (
                "We have prepared 40 heritage cards for 20 Indian regions (for example "
                "Rajasthan, Gujarat, Kerala, West Bengal, Tamil Nadu, etc.). Types of cards "
                "in our data are mainly craft, festival, performing art, oral tradition, "
                "ritual (very few and careful) and knowledge related practices. Each card "
                "has title, short summary, detailed description, tags, languages, sources "
                "and quiz questions.",
                False,
                12,
            ),
        ],
    )
    add_rich_para(
        doc,
        [
            ("2. Search / Explore: ", True, 12),
            (
                "On the Explore page, the student can filter by type or open a region page. "
                "From there the student can open any published card. Demo path used by us "
                "is: Rajasthan → Kalbelia.",
                False,
                12,
            ),
        ],
    )
    add_rich_para(
        doc,
        [
            ("3. Card with sources: ", True, 12),
            (
                "On the card page, the student can see how many sources are linked and when "
                "they were checked. Source list is also available. This helps the student "
                "to trust the content more than a random blog.",
                False,
                12,
            ),
        ],
    )
    add_rich_para(
        doc,
        [
            ("4. Ask module: ", True, 12),
            (
                "Student can type a question on the Ask page of that card. Our system does "
                "not use ChatGPT or any paid AI API. It searches inside the text of the "
                "selected card using word matching (token overlap score). If matching score "
                "is good, it shows answer text taken from the card and shows sources. If "
                "matching score is low, or if the question is about secrets, exact ritual "
                "time, price list, medical advice etc., the system refuses and says that it "
                "does not know from the verified cards. In this way we try to stop the "
                "system from inventing wrong cultural information.",
                False,
                12,
            ),
        ],
    )
    add_rich_para(
        doc,
        [
            ("5. Quiz module: ", True, 12),
            (
                "Every card has a small quiz made from the same card content. After "
                "submitting, score is saved with the learner name (using cookie in current "
                "version) and can be seen on the analysis page.",
                False,
                12,
            ),
        ],
    )
    add_rich_para(
        doc,
        [
            ("6. Contribute + Admin: ", True, 12),
            (
                "Student can write a short local note. This note first goes to pending list. "
                "Only admin (using secret login on Admin page) can accept or reject it. "
                "Until accept, the note is not shown as public content.",
                False,
                12,
            ),
        ],
    )
    add_rich_para(
        doc,
        [
            ("7. Other pages: ", True, 12),
            (
                "Home page, About page, Bookmarks page and Admin page are also part of the "
                "project for easy use and viva demonstration.",
                False,
                12,
            ),
        ],
    )

    add_para(
        doc,
        "Important point: This project is made for learning and college demo. English "
        "language UI is used in this version. We have also written in the app that it is "
        "an unofficial student tool.",
    )

    # ========== OBJECTIVE AND SCOPE ==========
    add_heading_section(doc, "Objective and Scope:")

    add_subheading(doc, "Objectives of the Project")
    add_para(doc, "The objectives of our major project are:", space_after=4)

    objectives = [
        "To understand the problems faced by students while learning living heritage from large websites and unverified internet content.",
        "To design and develop a web application that gives a complete short learning flow: discover, read, ask, quiz and contribute.",
        "To store heritage information in the form of cards with proper source references.",
        "To implement a question-answer feature which answers only from card data and refuses when data is not enough.",
        "To implement quiz for self checking and contribution system with admin approval.",
        "To test the system with sample cases and prepare it for college demonstration and viva.",
    ]
    for o in objectives:
        add_numbered(doc, o)

    add_subheading(doc, "Scope (What is included)")
    add_para(doc, "In the present project we have included:", space_after=4)
    for b in [
        "Web application that works on laptop browser and also on mobile Chrome (responsive design).",
        "40 curated heritage cards and 20 regions in JSON format.",
        "Explore / region based browsing.",
        "Ask, Quiz and Contribute modules.",
        "Local file based storage for ask log, quiz scores and contribution queue (for college demo).",
        "Simple learner cookie and admin secret for demo of moderation.",
        "About page explaining users and project aims.",
        "Basic ethics rules: no autoplay of sacred sound, refuse unsafe questions, contribution stays pending.",
    ]:
        add_bullet(doc, b)

    add_subheading(doc, "Limitations / Out of Scope")
    add_para(
        doc,
        "The following things are not part of this major project (to keep the work practical for college time):",
        space_after=4,
    )
    for b in [
        "AR / VR features",
        "Separate Android / iOS native app",
        "Social media feed or Reels type feature",
        "Payment gateway",
        "Paid Google Maps API",
        "Copying full data by scraping government portals",
        "Saying that our app is an official government or UNESCO product",
        "Full online database and login system (notes kept for future using Supabase)",
    ]:
        add_bullet(doc, b)

    add_subheading(doc, "Users of the System")
    add_numbered(doc, "College students (main users) – to learn a topic quickly for study / assignment.")
    add_numbered(doc, "Travellers (secondary) – to read short cards about a place.")
    add_numbered(doc, "Admin / reviewer – to accept or reject student contributions during demo.")

    # ========== METHODOLOGY ==========
    add_heading_section(doc, "Methodology:")

    add_para(
        doc,
        "We have followed a simple step by step software development method for this major project.",
    )

    add_subheading(doc, "Step 1: Requirement study")
    add_para(doc, "First we listed what a student actually needs:", space_after=4)
    for b in [
        "Find topic by place or type",
        "Read trusted short content",
        "Ask doubt without getting fake answer",
        "Check learning by quiz",
        "Add note only after teacher/admin check",
    ]:
        add_bullet(doc, b)
    add_para(
        doc,
        "These needs were written as requirements and acceptance points so that we can test later.",
    )

    add_subheading(doc, "Step 2: Content preparation")
    add_para(
        doc,
        "We prepared / generated seed data for 40 cards. Each card has id, slug, title, "
        "type, summary and body, region, tags, languages, sources (title, publisher, url), "
        "quiz questions and sensitivity flag where needed. Data is kept in catalogue.json. "
        "A Python script can also regenerate seed data from CSV. This is important because "
        "heritage content should be written carefully, not randomly copied.",
    )

    add_subheading(doc, "Step 3: Design of the system")
    add_para(doc, "Our system design has three main parts:", space_after=4)
    add_numbered(
        doc,
        "Frontend pages – Home, Explore, Region, Item (card), Ask, Quiz, Contribute, Bookmarks, About, Me, Admin.",
    )
    add_numbered(doc, "Backend logic (API routes in Next.js) – Ask API, Quiz API, Contribution API.")
    add_numbered(
        doc,
        "Storage – JSON catalogue + runtime-queue.json file for logs, scores and pending contributions.",
    )

    add_subheading(doc, "Step 4: Implementation")
    add_para(
        doc,
        "We implemented modules one by one in the same order as student flow:",
        space_after=4,
    )
    add_numbered(doc, "Show cards by explore/region")
    add_numbered(doc, "Open card and show sources")
    add_numbered(doc, "Ask question → retrieve matching text → answer or refuse")
    add_numbered(doc, "Quiz → save score")
    add_numbered(doc, "Contribute → pending → admin accept/reject")

    add_para(doc, "Ask working (in simple words):", bold=True, space_before=6, space_after=4)
    for b in [
        "Take question from student",
        "Break into words and remove common words like “the”, “is”, “and”",
        "Compare with parts of card text and give score to each part",
        "If best score < 0.35, refuse",
        "Also refuse some dangerous patterns (secret, exact minute, price list, medical, etc.)",
        "Else show top matched text as answer and list sources",
    ]:
        add_bullet(doc, b)

    add_subheading(doc, "Step 5: Testing and demo path")
    add_para(
        doc,
        "After coding, we tested main paths. For viva we use this demo:",
        space_after=4,
    )
    add_para(
        doc,
        "Explore → Rajasthan → Kalbelia → Ask (one correct question + one refuse question) → Quiz → Contribute → Admin accept/reject",
        bold=True,
        align=WD_ALIGN_PARAGRAPH.LEFT,
    )
    add_para(doc, "To reset demo data, we delete the runtime queue file.")

    add_subheading(doc, "Logical flow of the system")
    add_para(
        doc,
        "Student opens website → Select region / filter type → Open heritage card → "
        "then user can Read sources, Ask Q&A (match or refuse), attempt Quiz (score saved), "
        "or Contribute (pending). Finally Admin reviews contribution (accept/reject).",
    )

    # ========== H/W S/W ==========
    add_heading_section(doc, "Hardware and Software Requirements:")

    add_subheading(doc, "Hardware Requirements (for development)")
    add_table(
        doc,
        ["S. No.", "Hardware", "Minimum", "Preferred"],
        [
            ["1", "Processor", "Dual core 2 GHz", "Quad core"],
            ["2", "RAM", "8 GB", "16 GB"],
            ["3", "Storage", "10 GB free", "SSD with 20 GB free"],
            ["4", "Display", "1366×768", "Full HD"],
            ["5", "Internet", "For installing packages", "Stable internet"],
        ],
        col_widths=[0.7, 1.5, 2.2, 2.2],
    )

    add_subheading(doc, "Hardware Requirements (for running / demo)")
    add_table(
        doc,
        ["S. No.", "Device", "Requirement"],
        [
            ["1", "Laptop / PC", "Chrome, Edge or Firefox browser"],
            ["2", "Android phone", "Chrome browser (responsive website)"],
            ["3", "Local server", "Same PC where Node.js project is running"],
        ],
        col_widths=[0.7, 1.8, 4.0],
    )
    add_para(doc, "Special hardware like graphics card or AR glass is not required.")

    add_subheading(doc, "Software Requirements")
    add_table(
        doc,
        ["S. No.", "Software", "Use in project"],
        [
            ["1", "Windows 10/11 (or other OS)", "Development system"],
            ["2", "Node.js 22.x", "To run Next.js project"],
            ["3", "npm", "Install libraries"],
            ["4", "Next.js 15", "Main framework"],
            ["5", "React 19", "UI components"],
            ["6", "TypeScript", "Typed JavaScript code"],
            ["7", "Tailwind CSS 4", "Styling"],
            ["8", "Python 3 (optional)", "Seed script for cards"],
            ["9", "VS Code / Cursor", "Writing code"],
            ["10", "Chrome / Edge", "Testing"],
        ],
        col_widths=[0.7, 2.4, 3.4],
    )

    add_subheading(doc, "Configuration used in current project")
    add_bullet(doc, "Project runs with npm install and npm run dev")
    add_bullet(doc, "Local URL: http://localhost:3000")
    add_bullet(doc, "Admin demo uses a project secret (for college demo)")
    add_bullet(doc, "No paid cloud key is compulsory for current version")

    # ========== TECHNOLOGIES ==========
    add_heading_section(doc, "Technologies:")

    add_para(doc, "In this major project we have used the following technologies:")

    add_subheading(doc, "1. Next.js 15 (App Router)")
    add_para(
        doc,
        "Next.js is a React based framework. We used it because we can make many pages "
        "easily (Explore, Card, Ask, Quiz, Admin, etc.), we can also write API routes in "
        "the same project for Ask, Quiz and Contribute, and it is suitable for college "
        "web projects and easy to demonstrate.",
    )

    add_subheading(doc, "2. React 19")
    add_para(
        doc,
        "React is used to make reusable UI parts like card view, ask box, quiz form, "
        "contribute form and admin list.",
    )

    add_subheading(doc, "3. TypeScript")
    add_para(
        doc,
        "We used TypeScript so that data of cards, sources and API responses is clearly "
        "defined. This reduces mistakes and helps during debugging and viva explanation.",
    )

    add_subheading(doc, "4. Tailwind CSS v4")
    add_para(
        doc,
        "Tailwind is used for designing pages. We kept design simple and clean (light "
        "background, clear buttons). We did not make heavy decorative culture design "
        "because our focus is on correct information and sources.",
    )

    add_subheading(doc, "5. JSON files for data")
    add_para(
        doc,
        "For college first version, card data is stored in catalogue.json and runtime "
        "data (ask log, quiz score, contributions) is stored in a local JSON queue file. "
        "This helps us to run the project without buying or setting database first.",
    )

    add_subheading(doc, "6. Information Retrieval (for Ask)")
    add_para(
        doc,
        "Ask feature uses simple Information Retrieval: tokenization, stop-word removal, "
        "overlap scoring, threshold check and refuse rules. Note for viva: This is not a "
        "ChatGPT integration. Answer is taken only from our stored card text. Cookies are "
        "used simply for learner name and admin session during local demo.",
    )

    add_subheading(doc, "Why we selected these technologies")
    add_table(
        doc,
        ["Need", "Technology"],
        [
            ["Multi page website + APIs", "Next.js 15"],
            ["Interactive screens", "React 19"],
            ["Better code safety", "TypeScript"],
            ["Fast UI styling", "Tailwind CSS 4"],
            ["Easy demo without cloud DB", "JSON storage"],
            ["Safe Q&A", "Retrieval + refuse (no free AI invention)"],
        ],
        col_widths=[3.2, 3.3],
    )

    # ========== TESTING ==========
    add_heading_section(doc, "Testing Techniques:")

    add_para(
        doc,
        "For testing our project we mainly used manual testing and requirement based "
        "testing, which is common for college major projects.",
    )

    add_subheading(doc, "1. Unit / Module testing (manual)")
    add_para(doc, "We tested each module separately:", space_after=4)
    for b in [
        "Explore page opens cards or not",
        "Card page shows sources or not",
        "Ask gives answer / refuse correctly",
        "Quiz saves score or not",
        "Contribute goes to pending or not",
        "Admin can accept/reject or not",
    ]:
        add_bullet(doc, b)

    add_subheading(doc, "2. Integration testing")
    add_para(
        doc,
        "We checked complete flow together: Discover → Card → Ask → Quiz → Contribute → "
        "Admin. If any step breaks, student learning loop is incomplete. So this testing "
        "is important.",
    )

    add_subheading(doc, "3. Functional testing")
    add_para(
        doc,
        "We checked input and output of main functions. Example: correct question gives "
        "grounded answer; unsupported question gives refuse message; empty contribution "
        "should not save invalid data as per form validation.",
    )

    add_subheading(doc, "4. UI and ethics testing")
    for b in [
        "Checked on laptop and mobile Chrome; buttons easy to click; no sacred audio autoplay",
        "Source links visible; refuse for medical / secret / exact time questions",
        "Pending contribution not shown publicly before admin accept",
    ]:
        add_bullet(doc, b)

    add_subheading(doc, "Sample Test Case Table")
    add_table(
        doc,
        ["Test ID", "What we tested", "Expected result", "Result"],
        [
            ["TC-01", "Open Rajasthan → Kalbelia", "Card opens with sources", "Pass"],
            ["TC-02", "Ask question present in card", "Answer from card + sources", "Pass"],
            ["TC-03", "Ask unsupported / trap question", "Refuse message", "Pass"],
            ["TC-04", "Submit quiz", "Score saved and shown", "Pass"],
            ["TC-05", "Submit contribution", "Only pending in admin", "Pass"],
            ["TC-06", "Admin accept / reject", "Status changes", "Pass"],
            ["TC-07", "Bookmark a card", "Shows in Bookmarks", "Pass"],
            ["TC-08", "Disclaimer on Home/About", "Unofficial tool message", "Pass"],
        ],
        col_widths=[0.8, 2.2, 2.2, 0.8],
    )

    add_subheading(doc, "6. Demo readiness testing")
    add_para(
        doc,
        "Before final presentation we again run the Kalbelia demo path and reset queue "
        "file if old demo data is present.",
    )

    # ========== PROJECT CONTRIBUTION ==========
    add_heading_section(doc, "Project Contribution:")

    add_subheading(doc, "What we have contributed through this project")

    add_numbered(
        doc,
        "A complete student learning website for living heritage – Instead of only "
        "collecting information, we made a full path: find topic, read, ask, quiz and contribute.",
    )
    add_numbered(
        doc,
        "Safer question answering for culture topics – Many student projects connect open "
        "AI chat and allow any answer. In our project, answer comes only from card text. "
        "If not found, system says it does not know. This is our main technical contribution.",
    )
    add_numbered(
        doc,
        "Source based learning – Students can see references with the card. This supports "
        "better study habit for assignments.",
    )
    add_numbered(
        doc,
        "Admin controlled contribution – Student notes do not become public automatically. "
        "This reduces chance of wrong or sensitive content going live.",
    )
    add_numbered(
        doc,
        "Practical college level implementation – Using Next.js, React, TypeScript, "
        "Tailwind and JSON storage, we completed a working demo that can run on localhost for viva.",
    )

    add_subheading(doc, "Usefulness, Limitations and Future Work")
    add_para(
        doc,
        "This project is useful as a CSE web major project on a social topic (heritage) "
        "and also helps in short culture assignment preparation. It shows good practice "
        "that user content should not be published without review.",
    )
    add_para(
        doc,
        "Limitations: only 40 cards; Ask uses word matching (not advanced semantic AI); "
        "local JSON storage; English UI only; simple cookie + admin secret login for demo.",
    )
    add_para(
        doc,
        "Future work: add more cards and languages; use database and authentication "
        "(for example Supabase); improve Ask search but keep refuse rule; add Hindi / "
        "regional language support; host the website on internet.",
    )

    add_subheading(doc, "Conclusion")
    add_para(
        doc,
        "In this major project we studied the problem of learning living heritage in a "
        "short and correct way and developed Parampara Path – Living Heritage Compass. "
        "The system allows students to discover heritage cards, read source based content, "
        "ask questions with grounded or refuse answers, take quiz and submit notes for "
        "admin review. The project is developed using Next.js, React, TypeScript and "
        "Tailwind CSS and is tested with sample test cases. Within the given college "
        "scope, the project is ready for demonstration and viva voce.",
    )
    add_para(
        doc,
        "We conclude that the proposed system is useful, practical and meets the "
        "objectives of our major project for session 2026–2027.",
    )

    add_para(doc, "", space_after=16)
    add_para(
        doc,
        "Geetanjali Institute of Technical Studies, Dabok, Udaipur (Raj.)",
        size=12,
        bold=True,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        space_after=2,
    )
    add_para(
        doc,
        "Department of Computer Science and Engineering",
        size=12,
        bold=True,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        space_after=2,
    )
    add_para(
        doc,
        "November, 2026",
        size=12,
        bold=True,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        space_after=0,
    )

    doc.save(OUT)
    print(f"Saved: {OUT}")
    return OUT


if __name__ == "__main__":
    build()
