# JavaScript Everywhere — 6-Month Recording Timeline

**Format:** 2 sessions/week × 3 hours/session = 6 hrs/week
**Duration:** 26 weeks (~6 months) → **52 sessions → 156 total hours**

---

## Overview

| # | Track | Weeks | Sessions | Hours |
|---|-------|-------|----------|-------|
| 1 | JS/TS Foundations + Web Basics | 1–5 | 10 | 30h |
| 2 | Full-Stack Web Application | 6–12 | 14 | 42h |
| 3 | Mobile (React Native, same Backend) | 13–16 | 8 | 24h |
| 4 | Desktop (Electron) | 17–19 | 6 | 18h |
| 5 | Chrome Extension | 20–21 | 4 | 12h |
| 6 | Automation (Node.js + Google Apps Script) | 22–23 | 4 | 12h |
| 7 | AI Application | 24–26 | 6 | 18h |
| | **Total** | **26 wks** | **52** | **156h** |

---

## Track 1: JS/TS Foundations + Web Basics
**Weeks 1–5 · Sessions 1–10 · 30h**

| Session | Week | Topic |
|---|---|---|
| 1 | 1 | Series intro + dev environment setup (Node.js, VS Code, extensions) |
| 2 | 1 | JS Fundamentals — variables, data types, conditionals, loops |
| 3 | 2 | Functions & Arrow Functions, Scope and Hoisting |
| 4 | 2 | ES6+ — Destructuring, Spread/Rest, Template Literals, Default Params |
| 5 | 3 | Async JS — Callbacks and their problems, the Event Loop |
| 6 | 3 | Promises and Async/Await |
| 7 | 4 | Modules (import/export, CommonJS vs ESM) + Git & GitHub (commits, branches, PRs) |
| 8 | 4 | TypeScript Intro — Basic Types, Interfaces, Generics |
| 9 | 5 | Working with APIs — Fetch, parsing JSON, error handling |
| 10 | 5 | Web Basics recap (Semantic HTML, CSS Flexbox/Grid, DOM) + **Project: Task Manager App** |

---

## Track 2: Full-Stack Web Application
**Weeks 6–12 · Sessions 11–24 · 42h**

| Session | Week | Topic |
|---|---|---|
| 11 | 6 | React Intro — Components, Props & State, JSX |
| 12 | 6 | Forms in React (Controlled Components) + Routing (React Router) |
| 13 | 7 | State Management — useState/useEffect, Context API |
| 14 | 7 | API Integration in React + **Project: Course Management Dashboard** |
| 15 | 8 | Node.js Intro + Express.js — server setup, routing, middleware |
| 16 | 8 | REST API Design — endpoints, HTTP methods, status codes, full CRUD |
| 17 | 9 | Authentication — JWT + Password hashing (bcrypt) |
| 18 | 9 | Validation (Zod/Joi) + Databases intro (MongoDB/Mongoose or PostgreSQL/Prisma) |
| 19 | 10 | Database relationships + File Upload handling |
| 20 | 10 | Centralized Error Handling + **Project: Course Platform API** |
| 21 | 11 | Connecting Front-End to Back-End |
| 22 | 11 | Login/Register full flow + Roles & Permissions (user/admin) |
| 23 | 12 | Environment Variables/Secrets + Deploying the Frontend (Vercel/Netlify) |
| 24 | 12 | Deploying the Backend (Render/Railway) + cloud DB — **Capstone: Full-Stack Course Platform (live)** |

---

## Track 3: Mobile Development — React Native (same Backend)
**Weeks 13–16 · Sessions 25–32 · 24h**

| Session | Week | Topic |
|---|---|---|
| 25 | 13 | React Native Intro — how it differs from React, setup |
| 26 | 13 | Navigation between screens |
| 27 | 14 | Forms on mobile |
| 28 | 14 | API Integration — connecting to the same Level-1 Backend |
| 29 | 15 | Local Storage (on-device data) |
| 30 | 15 | Authentication on mobile |
| 31 | 16 | Building & packaging an Android APK |
| 32 | 16 | **Project: Mobile App for Students** (mobile version of the course platform) |

---

## Track 4: Desktop Applications — Electron
**Weeks 17–19 · Sessions 33–38 · 18h**

| Session | Week | Topic |
|---|---|---|
| 33 | 17 | Electron Intro — turning a website into a desktop app |
| 34 | 17 | Building your first Desktop App |
| 35 | 18 | Working with the file system from inside the app |
| 36 | 18 | Local Database (SQLite) |
| 37 | 19 | Packaging — installable builds for Windows/Mac |
| 38 | 19 | **Project: Desktop App for Files/Notes** |

---

## Track 5: Chrome Extension
**Weeks 20–21 · Sessions 39–42 · 12h**

| Session | Week | Topic |
|---|---|---|
| 39 | 20 | Extension structure — Manifest & file structure |
| 40 | 20 | Content Scripts — interacting with page content |
| 41 | 21 | Background Scripts + Extension Storage |
| 42 | 21 | **Project: AI-Powered Article Summarizer Extension** |

---

## Track 6: Automation — Node.js Scripts + Google Apps Script
**Weeks 22–23 · Sessions 43–46 · 12h**

| Session | Week | Topic |
|---|---|---|
| 43 | 22 | Node.js Scripts — writing standalone automation scripts |
| 44 | 22 | Scheduled Tasks (Cron Jobs) + Email Automation |
| 45 | 23 | Google Apps Script — automating Sheets/Gmail |
| 46 | 23 | **Project: Registration System** with automated emails & reports |

---

## Track 7: AI Application
**Weeks 24–26 · Sessions 47–52 · 18h**

| Session | Week | Topic |
|---|---|---|
| 47 | 24 | LLM APIs Intro + Prompt Engineering basics |
| 48 | 24 | Building a simple AI Chatbot |
| 49 | 25 | Structured Outputs (clean JSON) + Tool/Function Calling |
| 50 | 25 | Embeddings (simplified intro) + Vector Databases (practical intro) |
| 51 | 26 | RAG (Retrieval-Augmented Generation) + AI Agents (concept & application) |
| 52 | 26 | MCP Servers (practical intro) + **Project: AI Assistant** that reads course files & answers student questions |

---

## Notes

- Each track ends with its own hands-on project — good natural split points for multi-episode YouTube uploads (concept episode(s) + build episode(s)).
- Mobile and Desktop both reuse the Backend built in Track 2 — no new API needs to be built, which keeps those tracks lean (8 and 6 sessions).
- This selection skips Automation's Puppeteer/Playwright step and n8n (kept lean to Node.js scripts + Apps Script per your request) — flag if you want those added back in, they'd add ~2 sessions.
- If you want buffer/review weeks (for re-shoots, Q&A episodes, or catching up), the plan currently has zero slack — consider stretching to 28 weeks to add 2 buffer sessions.
