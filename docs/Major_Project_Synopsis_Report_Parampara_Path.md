# A
# SYNOPSIS
# of
# MAJOR PROJECT
# on

# Parampara Path – Living Heritage Compass

**Submitted by**

_________________________________  
Student Name (RTU Roll No.)

| **Project Guide** | **Head of Department** |
|---|---|
| Dr. Ruchi Vyas | Dr. Mayank Patel |

**Geetanjali Institute of Technical Studies, Dabok, Udaipur (Raj.)**  
**Department of Computer Science and Engineering**  
**November, 2026**

---

## Problem Statement:

India has a very rich living heritage. This includes folk songs and dances, traditional crafts, festivals, oral stories and local knowledge of different communities. Today, information about these topics is available on many websites such as government culture portals, UNESCO pages and other educational sites. Still, for a normal college student, it is not easy to use this information in a simple and correct way.

After studying this problem, we found the following main difficulties:

1. Big culture websites have too much data. If a student wants to learn only one topic of one place (for example Kalbelia dance of Rajasthan), he/she has to open many pages and links. This wastes time.

2. On Google and social media, many blogs and posts give wrong or half information. Students cannot easily check which line is taken from a real source and which line is only someone’s opinion.

3. Nowadays students also use AI chatbots for answers. Sometimes these tools create wrong facts about rituals, timings, prices or community rules. For heritage topics, such wrong answers can create misunderstanding and are not safe.

4. After reading about a topic, there is usually no small test to check what the student has learned. Also, if a student wants to add a local note, there is no proper system where a teacher or admin can check the note before it becomes public.

So, the problem for our major project is:

**To develop a simple web application which helps college students to find living heritage by state/region or type, read short cards with source links, ask questions that are answered only from those cards (or clearly say “I do not know” when information is not present), attempt a short quiz, and submit notes that stay pending until an admin reviews them.**

Our project name is **Parampara Path (Living Heritage Compass)**. It is only a student learning tool. It is **not** an official website of Ministry of Culture, UNESCO or any government department.

---

## Brief Description:

Parampara Path is a web based major project developed by us in the Computer Science and Engineering department. The idea of this project is to give students a short and clear path to learn about Indian living heritage.

In this project, the student follows five simple steps:

**1) Discover → 2) Read card → 3) Ask question → 4) Give quiz → 5) Contribute note (after admin check)**

### What our system does

**1. Heritage cards**  
We have prepared **40 heritage cards** for **20 Indian regions** (for example Rajasthan, Gujarat, Kerala, West Bengal, Tamil Nadu, etc.).  
Types of cards in our data are mainly: craft, festival, performing art, oral tradition, ritual (very few and careful) and knowledge related practices.  
Each card has title, short summary, detailed description, tags, languages, sources and quiz questions.

**2. Search / Explore**  
On the Explore page, the student can filter by type or open a region page. From there the student can open any published card. Demo path used by us is: **Rajasthan → Kalbelia**.

**3. Card with sources**  
On the card page, the student can see how many sources are linked and when they were checked. Source list is also available. This helps the student to trust the content more than a random blog.

**4. Ask module**  
Student can type a question on the Ask page of that card.  
Our system does **not** use ChatGPT or any paid AI API.  
It searches inside the text of the selected card using word matching (token overlap score).  
- If matching score is good, it shows answer text taken from the card and shows sources.  
- If matching score is low, or if the question is about secrets, exact ritual time, price list, medical advice etc., the system **refuses** and says that it does not know from the verified cards.  
In this way we try to stop the system from inventing wrong cultural information.

**5. Quiz module**  
Every card has a small quiz made from the same card content. After submitting, score is saved with the learner name (using cookie in current version) and can be seen on the analysis page (`/me`).

**6. Contribute + Admin**  
Student can write a short local note. This note first goes to **pending** list. Only admin (using secret login on `/admin`) can accept or reject it. Until accept, the note is not shown as public content.

**7. Other pages**  
Home page, About page, Bookmarks page and Admin page are also part of the project for easy use and viva demonstration.

**Important point:**  
This project is made for learning and college demo. English language UI is used in this version. We have also written in the app that it is an unofficial student tool.

---

## Objective and Scope:

### Objectives of the Project

The objectives of our major project are:

1. To understand the problems faced by students while learning living heritage from large websites and unverified internet content.

2. To design and develop a web application that gives a complete short learning flow: discover, read, ask, quiz and contribute.

3. To store heritage information in the form of cards with proper source references.

4. To implement a question-answer feature which answers only from card data and refuses when data is not enough.

5. To implement quiz for self checking and contribution system with admin approval.

6. To test the system with sample cases and prepare it for college demonstration and viva.

### Scope (What is included)

In the present project we have included:

- Web application that works on laptop browser and also on mobile Chrome (responsive design).
- 40 curated heritage cards and 20 regions in JSON format.
- Explore / region based browsing.
- Ask, Quiz and Contribute modules.
- Local file based storage for ask log, quiz scores and contribution queue (for college demo).
- Simple learner cookie and admin secret for demo of moderation.
- About page explaining users and project aims.
- Basic ethics rules: no autoplay of sacred sound, refuse unsafe questions, contribution stays pending.

### Limitations / Out of Scope

The following things are **not** part of this major project (to keep the work practical for college time):

- AR / VR features  
- Separate Android / iOS native app  
- Social media feed or Reels type feature  
- Payment gateway  
- Paid Google Maps API  
- Copying full data by scraping government portals  
- Saying that our app is an official government or UNESCO product  
- Full online database and login system (we have only kept notes for future using Supabase)

### Users of the System

1. **College students (main users)** – to learn a topic quickly for study / assignment.  
2. **Travellers (secondary)** – to read short cards about a place.  
3. **Admin / reviewer** – to accept or reject student contributions during demo.

---

## Methodology:

We have followed a simple step by step software development method for this major project.

### Step 1: Requirement study

First we listed what a student actually needs:

- Find topic by place or type  
- Read trusted short content  
- Ask doubt without getting fake answer  
- Check learning by quiz  
- Add note only after teacher/admin check  

These needs were written as requirements and acceptance points so that we can test later.

### Step 2: Content preparation

We prepared / generated seed data for 40 cards. Each card has:

- id, slug, title, type  
- summary and body  
- region  
- tags, languages  
- sources (title, publisher, url, check related info)  
- quiz questions  
- sensitivity flag where needed  

Data is kept in `catalogue.json`. A Python script can also regenerate seed data from CSV. This is important because heritage content should be written carefully, not randomly copied.

### Step 3: Design of the system

Our system design has three main parts:

1. **Frontend pages** – Home, Explore, Region, Item (card), Ask, Quiz, Contribute, Bookmarks, About, Me, Admin.  
2. **Backend logic (API routes in Next.js)** – Ask API, Quiz API, Contribution API.  
3. **Storage** – JSON catalogue + `runtime-queue.json` file for logs, scores and pending contributions.

### Step 4: Implementation

We implemented modules one by one in the same order as student flow:

1. Show cards by explore/region  
2. Open card and show sources  
3. Ask question → retrieve matching text → answer or refuse  
4. Quiz → save score  
5. Contribute → pending → admin accept/reject  

**Ask working (in simple words):**

- Take question from student  
- Break into words and remove common words like “the”, “is”, “and”  
- Compare with parts of card text  
- Give score to each part  
- If best score < 0.35, refuse  
- Also refuse some dangerous patterns (secret, exact minute, price list, medical, etc.)  
- Else show top matched text as answer and list sources  

### Step 5: Testing and demo path

After coding, we tested main paths. For viva we use this demo:

**Explore → Rajasthan → Kalbelia → Ask (one correct question + one refuse question) → Quiz → Contribute → Admin accept/reject**

To reset demo data, we delete the runtime queue file.

### Flow chart (logical flow)

```
Student opens website
        ↓
Select region / filter type
        ↓
Open heritage card
        ↓
   ┌────┴────┬──────────┬────────────┐
   ↓         ↓          ↓            ↓
 Read     Ask Q&A     Quiz        Contribute
 sources  (match or   (score      (pending)
          refuse)     saved)         ↓
                                  Admin review
                                  (accept/reject)
```

---

## Hardware and Software Requirements:

### Hardware Requirements (for development)

| S. No. | Hardware | Minimum | Preferred |
|--------|----------|---------|-----------|
| 1 | Processor | Dual core 2 GHz | Quad core |
| 2 | RAM | 8 GB | 16 GB |
| 3 | Storage | 10 GB free | SSD with 20 GB free |
| 4 | Display | 1366×768 | Full HD |
| 5 | Internet | Required for installing packages | Stable internet |

### Hardware Requirements (for running / demo)

| S. No. | Device | Requirement |
|--------|--------|-------------|
| 1 | Laptop / PC | Browser like Chrome, Edge or Firefox |
| 2 | Android phone | Chrome browser (website is responsive) |
| 3 | Local server | Same PC where Node.js project is running |

Special hardware like graphics card or AR glass is **not required**.

### Software Requirements

| S. No. | Software | Use in project |
|--------|----------|----------------|
| 1 | Windows 10/11 (or other OS) | Development system |
| 2 | Node.js 22.x | To run Next.js project |
| 3 | npm | Install libraries |
| 4 | Next.js 15 | Main framework |
| 5 | React 19 | UI components |
| 6 | TypeScript | Typed JavaScript code |
| 7 | Tailwind CSS 4 | Styling |
| 8 | Python 3 (optional) | Seed script for cards |
| 9 | VS Code / Cursor | Writing code |
| 10 | Chrome / Edge | Testing |

### Configuration used in current project

- Project runs with `npm install` and `npm run dev`  
- Local URL: `http://localhost:3000`  
- Admin demo uses a project secret (for college demo)  
- No paid cloud key is compulsory for current version  

---

## Technologies:

In this major project we have used the following technologies:

### 1. Next.js 15 (App Router)

Next.js is a React based framework. We used it because:

- We can make many pages easily (Explore, Card, Ask, Quiz, Admin, etc.)  
- We can also write API routes in the same project for Ask, Quiz and Contribute  
- It is suitable for college web projects and easy to demonstrate  

### 2. React 19

React is used to make reusable UI parts like card view, ask box, quiz form, contribute form and admin list.

### 3. TypeScript

We used TypeScript so that data of cards, sources and API responses is clearly defined. This reduces mistakes and helps during debugging and viva explanation.

### 4. Tailwind CSS v4

Tailwind is used for designing pages. We kept design simple and clean (light background, clear buttons). We did not make heavy “decorative culture” design because our focus is on correct information and sources.

### 5. JSON files for data

For college MVP / first version:

- Card data → `catalogue.json`  
- Runtime data (ask log, quiz score, contributions) → local JSON queue file  

This helps us to run the project without buying or setting database first.

### 6. Information Retrieval (for Ask)

Ask feature is based on simple IR (Information Retrieval) method:

- Tokenization  
- Stop word removal  
- Overlap scoring between question and card text  
- Threshold check + refuse rules  

**Note for viva:** This is not a ChatGPT integration. Answer is taken only from our stored card text.

### 7. Cookies

We use cookies in a simple way for learner name and admin session during local demo.

### Why we selected these technologies

| Need | Technology |
|------|------------|
| Multi page website + APIs | Next.js 15 |
| Interactive screens | React |
| Better code safety | TypeScript |
| Fast UI styling | Tailwind CSS |
| Easy demo without cloud DB | JSON storage |
| Safe Q&A | Retrieval + refuse (no free AI invention) |

---

## Testing Techniques:

For testing our project we mainly used manual testing and requirement based testing, which is common for college major projects.

### 1. Unit / Module testing (manual)

We tested each module separately:

- Explore page opens cards or not  
- Card page shows sources or not  
- Ask gives answer / refuse correctly  
- Quiz saves score or not  
- Contribute goes to pending or not  
- Admin can accept/reject or not  

### 2. Integration testing

We checked complete flow together:

Discover → Card → Ask → Quiz → Contribute → Admin  

If any step breaks, student learning loop is incomplete. So this testing is important.

### 3. Functional testing

We checked input and output of main functions without depending only on code reading. Example:

- Correct question → grounded answer  
- Unsupported question → refuse message  
- Empty contribution → should not save invalid data (as per form validation)  

### 4. UI testing

- Checked on laptop browser  
- Checked on mobile size screen  
- Checked that buttons are easy to click  
- Checked that no sacred audio autoplays  

### 5. Ethics / content testing

- Source links visible or not  
- Refuse for medical / secret / exact time type questions  
- Pending contribution not shown publicly before accept  

### Sample Test Case Table

| Test ID | What we tested | Expected result | Result |
|---------|----------------|-----------------|--------|
| TC-01 | Open Rajasthan → Kalbelia card | Card opens with source count | Pass |
| TC-02 | Ask question present in card | Answer from card + sources | Pass |
| TC-03 | Ask unsupported / trap question | Refuse message | Pass |
| TC-04 | Submit quiz | Score saved and shown | Pass |
| TC-05 | Submit contribution | Only pending in admin | Pass |
| TC-06 | Admin accept / reject | Status changes | Pass |
| TC-07 | Bookmark a card | Shows in Bookmarks | Pass |
| TC-08 | Read disclaimer on Home/About | Shows unofficial student tool | Pass |

### 6. Demo readiness testing

Before final presentation we again run the Kalbelia demo path and reset queue file if old demo data is present.

---

## Project Contribution:

### What we have contributed through this project

1. **A complete student learning website for living heritage**  
   Instead of only collecting information, we made a full path: find topic, read, ask, quiz and contribute.

2. **Safer question answering for culture topics**  
   Many student projects connect open AI chat and allow any answer. In our project, answer comes only from card text. If not found, system says it does not know. This is our main technical contribution.

3. **Source based learning**  
   Students can see references with the card. This supports better study habit for assignments.

4. **Admin controlled contribution**  
   Student notes do not become public automatically. This reduces chance of wrong or sensitive content going live.

5. **Practical college level implementation**  
   Using Next.js, React, TypeScript, Tailwind and JSON storage, we completed a working demo that can run on localhost for viva.

### Usefulness

- Helpful for CSE students as a web application major project with real social topic (heritage).  
- Helpful for arts / culture assignment preparation in short time.  
- Shows good practice: do not publish user content without review.  

### Limitations of current version

1. Only 40 cards are available right now.  
2. Ask uses word matching, not advanced semantic AI model.  
3. Data is stored in local JSON files, not in online database.  
4. UI is in English only.  
5. Login system is simple (cookie + admin secret) for demo purpose.

### Future work

1. Add more cards and more languages.  
2. Use proper database and authentication (for example Supabase).  
3. Improve Ask using better search methods, but still keep refuse rule.  
4. Add Hindi / regional language support.  
5. Host the website on internet for more users.

### Conclusion

In this major project we studied the problem of learning living heritage in a short and correct way and developed **Parampara Path – Living Heritage Compass**. The system allows students to discover heritage cards, read source based content, ask questions with grounded or refuse answers, take quiz and submit notes for admin review. The project is developed using Next.js, React, TypeScript and Tailwind CSS and is tested with sample test cases. Within the given college scope, the project is ready for demonstration and viva voce.

We conclude that the proposed system is useful, practical and meets the objectives of our major project for session **2026–2027**.

---

**Geetanjali Institute of Technical Studies, Dabok, Udaipur (Raj.)**  
**Department of Computer Science and Engineering**  
**November, 2026**
