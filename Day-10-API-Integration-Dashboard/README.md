# Day 10 — API Integration in React + Project: Course Management Dashboard

**Track 2: Full-Stack Web Application · Day 10 · three parts**

> Day 06 taught you to talk to an API from plain TypeScript: a careful `request<T>()`, type guards, and every failure turned into a value. Day 09 taught you effects, cleanup and aborting.
> Today those two meet. React components **load** data from a real server, **show** every state honestly (loading, error, empty, stale), **send** changes back, and stay correct when the network is slow, flaky, or answers out of order. Then you build the first project of the track: a **Course Management Dashboard**.

**Why this day matters:** almost every screen you'll build for money shows data that lives on a server. The difference between a demo and a product is what happens when that server is slow, down, or says *no* — and today you build for exactly those cases.

**Versions this guide is written for:** React **19.3** · React Router **8** (package `react-router`) · Vite **8** · TypeScript **6** · **Node 22.22+**.

| Part | Topic | Concept | Build |
|---|---|---|---|
| **1** | Reading — server state, a `useQuery` hook, every UI state | Sections 1.1–1.8 | Steps 1–4 |
| **2** | Writing — mutations, server errors, optimistic updates | Sections 2.1–2.5 | Steps 5–6 |
| **3** | **Project: Course Management Dashboard** | Sections 3.1–3.2 | Steps 7–9 |

---

## What You'll Have by the End

**Part 1 — Reading**

- [ ] The difference between **server state** and **client state** — and why it changes how you write components
- [ ] A Vite **proxy**, so the browser talks to your API without CORS
- [ ] Day 06's typed `request<T>()` reused in React, unchanged in spirit
- [ ] A `useQuery(url, check)` hook: aborts stale requests, ignores late answers, can reload
- [ ] All five UI states for any data: **loading, error, empty, success, and stale-while-reloading**
- [ ] Search and pagination done **on the server**, driven by the URL

**Part 2 — Writing**

- [ ] Mutations in **event handlers**, never in effects
- [ ] Showing the server's validation errors next to the right fields
- [ ] **Pessimistic** vs **optimistic** updates in React — and rolling back correctly
- [ ] What to refresh after a change, and why "just reload everything" is fine for now

**Part 3 — Project: Course Management Dashboard**

- [ ] A dashboard with live numbers, a searchable paginated course list, a detail page, create, edit, publish and delete
- [ ] Tested against a server that is **slow**, **jittery** and **failing on purpose**

---

# Part 1 — Reading Data

## 1 — Concept (60 min)

### 1.1 Server State Is Not Like Other State

Day 09's table had a row for "forever, on every device → a server". Data that lives there behaves differently from anything in `useState`:

| | **Client state** (Day 07–09) | **Server state** (today) |
|---|---|---|
| Who owns it | your component | the server — you hold a **copy** |
| Available | immediately | **later** — after a request |
| Can fail to load | no | yes, in several ways (Day 06, 7.1) |
| Can go out of date | no — you're the only writer | yes — other users, other tabs change it |
| Examples | a form draft, which tab is open, the theme | courses, students, orders, messages |

Two consequences shape everything today:

1. **Every piece of server data has more than one state.** It isn't "the courses" — it's "loading the courses", "the courses (as of 12:01)", or "couldn't load the courses". Your UI must show each of them.
2. **Your copy is a cache.** After you change something on the server, your copy is wrong until you refresh it or patch it.

---

### 1.2 The Five States of a Screen

Every component that shows server data has these states. Design each **on purpose**:

| State | When | Show |
|---|---|---|
| **Loading** (first time) | no data yet | a skeleton or "Loading…" — the **layout** of what's coming |
| **Error** | the request failed | what went wrong, in words, and a **Try again** button |
| **Empty** | it worked, and there's nothing | a friendly message — and often an action ("Create the first course") |
| **Success** | it worked | the data |
| **Stale** (reloading) | you have data, and a newer request is on its way | the old data, **dimmed**, with `aria-busy` — never a blank flash |

The bug students ship most often is collapsing these: `data ? <List /> : <p>Loading…</p>` shows "Loading…" **forever** when the request fails, and flashes a blank page every time you turn a page.

---

### 1.3 Talking to the API — the Vite Proxy

Your React app runs on `http://localhost:5173` (Vite). The Course API runs on `http://localhost:4000`. Different ports are **different origins**, so the browser blocks the response unless the server sends CORS headers (Day 06, 7.6).

The development fix is to let **Vite forward** API calls. In `vite.config.ts`:

```ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:4000",     // anything starting with /api goes to the API
    },
  },
});
```

```
browser ──GET /api/courses──▶ Vite :5173 ──GET /api/courses──▶ Course API :4000
        ◀──────── JSON ─────── (same origin, no CORS) ◀──────── JSON ────────
```

The app now calls **`/api/courses`** — a relative URL. Same origin, no CORS, and in production the same code works when the app and the API sit behind one domain (Session 23).

---

### 1.4 Reuse Day 06's Client

You already wrote the hard part. Day 06's `request<T>(url, { check })` turns every failure — network, timeout, abort, HTTP status, bad JSON, wrong shape — into a `Result<T>`, and never throws. React doesn't change any of that. Two small additions today:

- `request` accepts the `signal` from an effect's `AbortController` — Day 06 already had that option.
- An `http` error can carry the server's **field errors** (`{ "error": "…", "fields": { "title": "…" } }`) so a form can show them.

Type guards stay the boundary: nothing from the network reaches a component until a guard has checked it.

---

### 1.5 Loading in an Effect, Properly

Day 09's `UserCard` had the full recipe. As a reminder, the three rules:

1. **Abort in the cleanup.** When the input changes or the component unmounts, the old request is cancelled.
2. **Ignore late answers.** Even an aborted request's promise settles — check `signal.aborted` before setting state.
3. **Tag the result with its input**, and derive `loading` from "is the latest result for the current input?" — no `setLoading(true)` at the start of the effect.

Write that once per component and you'll get it wrong in one of them. So write it **once**, as a hook.

---

### 1.6 A `useQuery` Hook

```ts
const { data, error, loading, reload } = useQuery("/api/courses?page=2", isCoursePage);
```

- **Input:** a URL (a string — a perfect dependency) and a type guard (a module-level function — stable).
- **Output:** the last good `data`, the current `error`, whether a request is in flight, and `reload()` for a **Try again** button.

```ts
// src/api/useQuery.ts
import { useEffect, useState } from "react";
import { request } from "./http";
import type { ApiError, Result } from "./http";

export interface Query<T> {
  data: T | undefined;          // the last good value for this URL (or any URL, with keepPrevious)
  error: ApiError | undefined;  // only when the LATEST request for this URL failed
  loading: boolean;             // a request for the current URL is in flight
  reload: () => void;
}

interface Settled<T> {
  url: string;
  version: number;
  result: Result<T>;
}

export function useQuery<T>(
  url: string,
  check: (value: unknown) => value is T,
  keepPrevious = false,
): Query<T> {
  const [version, setVersion] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  const [lastGood, setLastGood] = useState<{ url: string; value: T } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void request(url, { check, signal: controller.signal }).then((result) => {
      if (controller.signal.aborted) return;            // an old request — nobody wants it
      setSettled({ url, version, result });
      if (result.ok) setLastGood({ url, value: result.value });
    });
    return () => controller.abort();
  }, [url, check, version]);

  const current = settled !== null && settled.url === url && settled.version === version;
  const showGood = lastGood !== null && (lastGood.url === url || keepPrevious);

  return {
    data: showGood ? lastGood.value : undefined,
    error: current && !settled.result.ok ? settled.result.error : undefined,
    loading: !current,
    reload: () => setVersion((v) => v + 1),
  };
}
```

Read it against Section 1.5:

- **Abort + ignore:** the cleanup aborts; the `.then` checks `signal.aborted` before touching state. In Strict Mode's double-mount, the first request is aborted and ignored — you'll see it as *(canceled)* in the Network tab.
- **Tagged results:** `settled` remembers which `url` and `version` it answered. `loading` is derived: "is the latest answer for *this* url and *this* version?"
- **`reload`** bumps `version`. That's a new dependency value, so the effect runs again — same URL, fresh request. The old data stays on screen meanwhile (`lastGood`), so a refresh never blanks the page.
- **`keepPrevious`** — for pagination and search: while page 3 loads, keep showing page 2 (dimmed) instead of nothing.

> **Libraries do this for you.** TanStack Query (`useQuery` — the name isn't a coincidence), SWR and React Router's data loaders all solve this problem, plus caching, deduplication, refetch-on-focus and more. Use one in real projects. Writing a small version first is how you'll understand what they're doing — and debug them when they surprise you.

---

### 1.7 Rendering Every State

With the hook, a page reads as the table from Section 1.2:

```tsx
const { data, error, loading, reload } = useQuery(`/api/courses?${query}`, isCoursePage, true);

if (error && !data) return <ErrorPanel error={error} onRetry={reload} />;   // failed, nothing to show
if (!data) return <ListSkeleton />;                                           // first load

return (
  <section aria-busy={loading} className={loading ? "stale" : undefined}>
    {error && <ErrorPanel error={error} onRetry={reload} />}               {/* failed reload: keep the old data */}
    {data.items.length === 0 ? <p>No courses match.</p> : <CourseTable courses={data.items} />}
  </section>
);
```

Order matters: **error without data**, then **no data yet**, then everything that has data. A failed *reload* shows the error **above** the old data instead of throwing it away.

---

### 1.8 Let the Server Search, Sort and Page

Day 08's Country Explorer filtered an array in the browser. With real data — 10,000 courses — you can't download everything. The **server** filters and pages; the client sends the request in the URL's query string:

```
GET /api/courses?q=react&status=published&sort=students&page=2
→ { "items": [ … up to 6 … ], "total": 9, "page": 2, "pages": 2 }
```

And the page's own URL (Day 08) holds the same values — so the flow is:

```
address bar  ──useSearchParams──▶  q, status, sort, page  ──build──▶  /api/courses?…  ──useQuery──▶  data
   ▲                                                                                              │
   └──────────────────────── setSearchParams (search box, filters, pager) ◀───────────────────────┘
```

Two details:

- **The server is the authority** on the page count. It clamps `page=99` to the last page and tells you `pages`; the pager uses *its* numbers.
- **Debounce the request, not the URL.** The search box updates the URL on every keystroke (with `replace`, Day 08); the *API* URL goes through Day 09's `useDebouncedValue`, so typing `react` sends one request instead of five. And when a request is still slow, the next one aborts it.

---

## Build — Follow Along: Part 1

### Step 1 — The Project and the Course API

```bash
node --version                    # v22.22 or newer
npm create vite@latest course-dashboard -- --template react-ts
cd course-dashboard
npm install
npm install react-router
mkdir server shared src/api src/pages src/components src/hooks
```

Switch on the hooks dependency check (Day 09, Step 1) in `.oxlintrc.json`:

```json
"rules": {
  "react/rules-of-hooks": "error",
  "react/exhaustive-deps": "warn",
  "react/only-export-components": ["warn", { "allowConstantExport": true }]
}
```

The layout:

```
course-dashboard/
├── server/
│   ├── seed.ts            ← the starting data (provided)
│   └── server.ts          ← the Course API (provided)
├── shared/
│   ├── types.ts           ← the contract — used by the server AND the app
│   └── validate.ts        ← the rules — used by the server AND the form
├── src/
│   ├── api/               ← http.ts, guards.ts, courses.ts, useQuery.ts
│   ├── hooks/             ← useDebouncedValue.ts (Day 09)
│   ├── components/        ← CourseForm, ErrorPanel, StatusBadge, …
│   ├── pages/             ← one file per route
│   ├── App.tsx, Layout.tsx, main.tsx
│   └── format.ts
└── vite.config.ts         ← the /api proxy
```

`shared/` is Day 06's idea again: one contract, imported by both sides, so the server and the browser can't disagree about what a course is.

```ts
// shared/types.ts — the API contract
export type Level = "beginner" | "intermediate" | "advanced";
export type Status = "draft" | "published";

export interface Instructor {
  readonly id: number;
  name: string;
  email: string;
}

export interface CourseInput {
  title: string;
  instructorId: number;
  level: Level;
  price: number;        // whole EGP
  lessons: number;
}

export interface Course extends CourseInput {
  readonly id: number;
  status: Status;
  readonly students: number;     // the server counts enrolments — clients can't set it
  readonly updatedAt: string;    // ISO date, set by the server
}

export type CoursePatch = Partial<CourseInput> & { status?: Status };

export interface Page<T> {
  items: T[];
  total: number;        // all matches, not just this page
  page: number;         // the page the server actually returned (after clamping)
  pages: number;        // at least 1
}

export interface Stats {
  courses: number;
  published: number;
  drafts: number;
  students: number;
  revenue: number;      // Σ price × students over published courses
}
```

```ts
// shared/validate.ts — the course rules, for the server and the form
import type { CourseInput, Level } from "./types.ts";

export type CourseErrors = Partial<Record<keyof CourseInput, string>>;

export const LEVELS: readonly Level[] = ["beginner", "intermediate", "advanced"];

function isWhole(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
}

// `values` is unknown-ish on purpose: the server passes a parsed request body
export function validateCourse(
  values: Partial<Record<keyof CourseInput, unknown>>,
  instructorIds: readonly number[],
): CourseErrors {
  const errors: CourseErrors = {};
  const title = typeof values.title === "string" ? values.title.trim() : "";

  if (title === "") errors.title = "Give the course a title.";
  else if (title.length < 3) errors.title = "Use at least 3 characters.";
  else if (title.length > 80) errors.title = "Keep it under 80 characters.";

  if (typeof values.instructorId !== "number" || !instructorIds.includes(values.instructorId)) {
    errors.instructorId = "Pick an instructor.";
  }
  if (!LEVELS.some((l) => l === values.level)) errors.level = "Pick a level.";
  if (!isWhole(values.price, 0, 5000)) errors.price = "Use a whole number from 0 to 5000.";
  if (!isWhole(values.lessons, 0, 200)) errors.lessons = "Use a whole number from 0 to 200.";

  return errors;
}

export function hasErrors(errors: CourseErrors): boolean {
  return Object.keys(errors).length > 0;
}
```

The seed data — copy it as is:

```ts
// server/seed.ts — the data the API starts with (it resets on every restart)
import type { Course, Instructor } from "../shared/types.ts";

export const INSTRUCTORS: Instructor[] = [
  { id: 1, name: "Mona Hassan", email: "mona@courses.dev" },
  { id: 2, name: "Omar Khaled", email: "omar@courses.dev" },
  { id: 3, name: "Salma Adel", email: "salma@courses.dev" },
  { id: 4, name: "Youssef Nabil", email: "youssef@courses.dev" },
];

const at = (day: number) => new Date(Date.UTC(2026, 8, day, 10)).toISOString();

export const SEED_COURSES: Course[] = [
  { id: 1, title: "JavaScript Foundations", instructorId: 1, level: "beginner", price: 0, lessons: 24, status: "published", students: 412, updatedAt: at(1) },
  { id: 2, title: "TypeScript in Practice", instructorId: 1, level: "intermediate", price: 450, lessons: 18, status: "published", students: 128, updatedAt: at(3) },
  { id: 3, title: "React From Zero", instructorId: 2, level: "beginner", price: 600, lessons: 30, status: "published", students: 356, updatedAt: at(5) },
  { id: 4, title: "Advanced React Patterns", instructorId: 2, level: "advanced", price: 900, lessons: 16, status: "published", students: 74, updatedAt: at(7) },
  { id: 5, title: "Node.js & Express APIs", instructorId: 3, level: "intermediate", price: 750, lessons: 22, status: "published", students: 203, updatedAt: at(9) },
  { id: 6, title: "Databases with PostgreSQL", instructorId: 3, level: "intermediate", price: 700, lessons: 20, status: "published", students: 97, updatedAt: at(11) },
  { id: 7, title: "Git & GitHub for Teams", instructorId: 4, level: "beginner", price: 0, lessons: 10, status: "published", students: 538, updatedAt: at(12) },
  { id: 8, title: "Testing JavaScript Apps", instructorId: 4, level: "intermediate", price: 550, lessons: 14, status: "published", students: 61, updatedAt: at(14) },
  { id: 9, title: "CSS Layout Mastery", instructorId: 2, level: "beginner", price: 300, lessons: 12, status: "published", students: 189, updatedAt: at(15) },
  { id: 10, title: "Next.js Full-Stack", instructorId: 2, level: "advanced", price: 1200, lessons: 0, status: "draft", students: 0, updatedAt: at(17) },
  { id: 11, title: "Authentication & Security", instructorId: 3, level: "advanced", price: 950, lessons: 0, status: "draft", students: 0, updatedAt: at(18) },
  { id: 12, title: "React Native Basics", instructorId: 4, level: "intermediate", price: 800, lessons: 8, status: "draft", students: 0, updatedAt: at(20) },
  { id: 13, title: "Automating with Node Scripts", instructorId: 1, level: "beginner", price: 250, lessons: 6, status: "draft", students: 0, updatedAt: at(22) },
  { id: 14, title: "Docker for Developers", instructorId: 3, level: "intermediate", price: 650, lessons: 9, status: "published", students: 45, updatedAt: at(24) },
];
```

And the server. **It's provided** — you'll write servers like it from Session 15. Copy it, run it, and *read* it: every rule the app has to cope with is visible here.

```ts
// server/server.ts — the Course API. Provided. Run: npm run api   (flags: --slow=1500 --jitter=1200 --fail=0.3)
import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { parseArgs } from "node:util";
import type { Course, CourseInput, Page, Stats, Status } from "../shared/types.ts";
import { hasErrors, validateCourse } from "../shared/validate.ts";
import { INSTRUCTORS, SEED_COURSES } from "./seed.ts";

const { values: flags } = parseArgs({
  options: {
    port: { type: "string", default: "4000" },
    slow: { type: "string", default: "0" },     // add this many ms to every API response
    jitter: { type: "string", default: "0" },   // plus a random 0..jitter ms — answers arrive out of order
    fail: { type: "string", default: "0" },     // this fraction of API calls fail with a 503
  },
});
const PORT = Number(flags.port);
const SLOW = Number(flags.slow);
const JITTER = Number(flags.jitter);
const FAIL = Number(flags.fail);
const PAGE_SIZE = 6;

let courses: Course[] = SEED_COURSES.map((c) => ({ ...c }));
let nextId = Math.max(...courses.map((c) => c.id)) + 1;
const instructorIds = INSTRUCTORS.map((i) => i.id);

// ---------- helpers ----------

function send(res: ServerResponse, status: number, body?: unknown): void {
  if (body === undefined) {
    res.writeHead(status);
    res.end();
    return;
  }
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function sendError(res: ServerResponse, status: number, error: string, fields?: Record<string, string>): void {
  send(res, status, fields ? { error, fields } : { error });
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  let text = "";
  for await (const chunk of req) text += chunk;
  return text === "" ? undefined : JSON.parse(text);           // a SyntaxError becomes a 400 below
}

function asObject(body: unknown): Record<string, unknown> | null {
  return typeof body === "object" && body !== null && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
}

function wholeParam(raw: string | null, fallback: number): number {
  return raw !== null && /^\d+$/.test(raw) ? Number(raw) : fallback;
}

function inputOf(c: Course): CourseInput {
  return { title: c.title, instructorId: c.instructorId, level: c.level, price: c.price, lessons: c.lessons };
}

const INPUT_KEYS = ["title", "instructorId", "level", "price", "lessons"] as const;

function pickInput(body: Record<string, unknown>): Partial<Record<keyof CourseInput, unknown>> {
  const out: Partial<Record<keyof CourseInput, unknown>> = {};
  for (const key of INPUT_KEYS) if (key in body) out[key] = body[key];
  return out;
}

const NEEDS_LESSONS = "A course needs at least one lesson before it can be published.";

// ---------- routes ----------

function listCourses(url: URL): Page<Course> {
  const p = url.searchParams;
  const q = (p.get("q") ?? "").trim().toLowerCase();
  const status = p.get("status");
  const level = p.get("level");
  const instructor = p.get("instructor");
  const sort = p.get("sort");
  const limit = Math.min(50, Math.max(1, wholeParam(p.get("limit"), PAGE_SIZE)));

  const matches = courses
    .filter((c) => q === "" || c.title.toLowerCase().includes(q))
    .filter((c) => status !== "draft" && status !== "published" ? true : c.status === status)
    .filter((c) => level === null || level === "" || c.level === level)
    .filter((c) => instructor === null || instructor === "" || c.instructorId === Number(instructor))
    .sort((a, b) =>
      sort === "students" ? b.students - a.students || a.id - b.id
      : sort === "price" ? a.price - b.price || a.id - b.id
      : sort === "updated" ? b.updatedAt.localeCompare(a.updatedAt) || b.id - a.id
      : a.title.localeCompare(b.title, "en") || a.id - b.id,
    );

  const pages = Math.max(1, Math.ceil(matches.length / limit));
  const page = Math.min(pages, Math.max(1, wholeParam(p.get("page"), 1)));
  return { items: matches.slice((page - 1) * limit, page * limit), total: matches.length, page, pages };
}

function stats(): Stats {
  const published = courses.filter((c) => c.status === "published");
  return {
    courses: courses.length,
    published: published.length,
    drafts: courses.length - published.length,
    students: courses.reduce((sum, c) => sum + c.students, 0),
    revenue: published.reduce((sum, c) => sum + c.price * c.students, 0),
  };
}

async function handleApi(req: IncomingMessage, res: ServerResponse, url: URL): Promise<void> {
  const method = req.method ?? "GET";
  const path = url.pathname;

  if (path === "/api/stats" && method === "GET") return send(res, 200, stats());
  if (path === "/api/instructors" && method === "GET") return send(res, 200, INSTRUCTORS);

  const instructorMatch = path.match(/^\/api\/instructors\/(\d+)$/);
  if (instructorMatch && method === "GET") {
    const found = INSTRUCTORS.find((i) => i.id === Number(instructorMatch[1]));
    return found ? send(res, 200, found) : sendError(res, 404, `No instructor with id ${instructorMatch[1]}`);
  }

  if (path === "/api/courses") {
    if (method === "GET") return send(res, 200, listCourses(url));
    if (method === "POST") {
      const body = asObject(await readJson(req));
      if (!body) return sendError(res, 400, "Send the course as a JSON object.");
      const values = pickInput(body);
      const errors = validateCourse(values, instructorIds);
      if (hasErrors(errors)) return sendError(res, 400, "Some fields need fixing.", errors);
      const input = values as CourseInput;                       // validated above
      const course: Course = {
        ...input, title: input.title.trim(), id: nextId++, status: "draft", students: 0,
        updatedAt: new Date().toISOString(),
      };
      courses = [...courses, course];
      return send(res, 201, course);
    }
    return sendError(res, 405, `${method} is not allowed on /api/courses`);
  }

  const courseMatch = path.match(/^\/api\/courses\/(\d+)$/);
  if (courseMatch) {
    const id = Number(courseMatch[1]);
    const course = courses.find((c) => c.id === id);
    if (!course) return sendError(res, 404, `No course with id ${id}`);

    if (method === "GET") return send(res, 200, course);

    if (method === "PATCH") {
      const body = asObject(await readJson(req));
      if (!body) return sendError(res, 400, "Send the changes as a JSON object.");
      const merged = { ...inputOf(course), ...pickInput(body) };
      const errors = validateCourse(merged, instructorIds);
      if (hasErrors(errors)) return sendError(res, 400, "Some fields need fixing.", errors);

      let status: Status = course.status;
      if ("status" in body) {
        if (body.status !== "draft" && body.status !== "published") return sendError(res, 400, "status must be draft or published.");
        status = body.status;
      }
      const input = merged as CourseInput;
      if (status === "published" && input.lessons === 0) return sendError(res, 409, NEEDS_LESSONS);

      const updated: Course = { ...course, ...input, title: input.title.trim(), status, updatedAt: new Date().toISOString() };
      courses = courses.map((c) => (c.id === id ? updated : c));
      return send(res, 200, updated);
    }

    if (method === "DELETE") {
      if (course.students > 0) {
        return sendError(res, 409, `This course has ${course.students} enrolled students — unpublish it instead.`);
      }
      courses = courses.filter((c) => c.id !== id);
      return send(res, 204);
    }

    return sendError(res, 405, `${method} is not allowed on /api/courses/${id}`);
  }

  sendError(res, 404, `No API route for ${method} ${path}`);
}

// ---------- the server ----------

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const server = createServer(async (req, res) => {
  const started = Date.now();
  const url = new URL(req.url ?? "/", "http://localhost");
  try {
    if (!url.pathname.startsWith("/api/")) return sendError(res, 404, "This server only serves /api/…");
    const delay = SLOW + Math.round(Math.random() * JITTER);
    if (delay > 0) await sleep(delay);
    if (Math.random() < FAIL) return sendError(res, 503, "The server is having a bad moment. Try again.");
    await handleApi(req, res, url);
  } catch (err) {
    if (err instanceof SyntaxError) sendError(res, 400, "The body is not valid JSON.");
    else sendError(res, 500, "Something went wrong on the server.");
  } finally {
    console.log(`${req.method} ${url.pathname}${url.search} → ${res.statusCode} (${Date.now() - started}ms)`);
  }
});

server.listen(PORT, () => {
  console.log(`Course API on http://localhost:${PORT}/api`);
  if (SLOW || JITTER) console.log(`  delay: ${SLOW}ms + up to ${JITTER}ms random`);
  if (FAIL) console.log(`  failing ${Math.round(FAIL * 100)}% of calls`);
});
```

Add the scripts to `package.json`:

```json
"scripts": {
  "dev": "vite",
  "api": "node server/server.ts",
  "api:slow": "node server/server.ts --slow=1500",
  "api:chaos": "node server/server.ts --jitter=1500 --fail=0.25",
  "build": "tsc -b && vite build",
  "lint": "oxlint",
  "preview": "vite preview"
}
```

…and let TypeScript check `server/` and `shared/` too. In `tsconfig.node.json` set `"include": ["vite.config.ts", "server", "shared"]`; in `tsconfig.app.json` set `"include": ["src", "shared"]` and add `"strict": true` to its `compilerOptions` if it isn't there.

Run it — and **leave this terminal open** all day:

```bash
npm run api
```

```
Course API on http://localhost:4000/api
```

Try it from a second terminal (Git Bash on Windows):

```bash
curl http://localhost:4000/api/stats
curl "http://localhost:4000/api/courses?q=react&sort=students"
curl -i http://localhost:4000/api/courses/99
curl -i -X PATCH http://localhost:4000/api/courses/10 -H "Content-Type: application/json" -d '{"status":"published"}'
curl -i -X POST http://localhost:4000/api/courses -H "Content-Type: application/json" -d '{"title":"x"}'
```

Read each answer: `stats` (14 courses, 10 published), a page of three React courses, a 404 with a message, a **409** (course 10 has no lessons), and a **400** with a `fields` object. Those last two are what Part 2's UI has to handle.

Finally, the proxy — `vite.config.ts`:

```ts
// vite.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { "/api": "http://localhost:4000" },
  },
});
```

In a second terminal: `npm run dev`, then open `http://localhost:5173/api/stats`. The same JSON — through Vite.

---

### Step 2 — `src/api/` — The Client and the Guards

`http.ts` is Day 06's Step 22 file with one addition — `fields` on HTTP errors. Copy yours and add it, or use this:

```ts
// src/api/http.ts — one careful fetch wrapper (Day 06), plus field errors from the server
export type ApiError =
  | { kind: "network"; message: string }
  | { kind: "timeout"; message: string }
  | { kind: "aborted"; message: string }
  | { kind: "http"; status: number; message: string; fields?: Record<string, string> }
  | { kind: "parse"; message: string }
  | { kind: "shape"; message: string };

export type Result<T> = { ok: true; value: T } | { ok: false; error: ApiError };

export interface RequestOptions<T> {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  check: (value: unknown) => value is T;
  timeoutMs?: number;
  signal?: AbortSignal;
}

function isStringRecord(x: unknown): x is Record<string, string> {
  return typeof x === "object" && x !== null && Object.values(x).every((v) => typeof v === "string");
}

// The server sends { "error": "…", "fields"?: { … } } — read whatever is there
async function readError(res: Response): Promise<{ message: string; fields?: Record<string, string> }> {
  try {
    const body: unknown = await res.json();
    if (typeof body === "object" && body !== null && "error" in body && typeof body.error === "string") {
      const fields = "fields" in body && isStringRecord(body.fields) ? body.fields : undefined;
      return { message: body.error, fields };
    }
  } catch {
    // not JSON
  }
  return { message: res.statusText || `HTTP ${res.status}` };
}

export async function request<T>(url: string, options: RequestOptions<T>): Promise<Result<T>> {
  const { method = "GET", body, check, timeoutMs = 8000, signal } = options;
  const timeout = AbortSignal.timeout(timeoutMs);

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: body === undefined ? { Accept: "application/json" } : { Accept: "application/json", "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
  } catch (err) {
    if (signal?.aborted) return { ok: false, error: { kind: "aborted", message: "Request cancelled" } };
    if (timeout.aborted) return { ok: false, error: { kind: "timeout", message: `No response after ${timeoutMs}ms` } };
    return { ok: false, error: { kind: "network", message: err instanceof Error ? err.message : String(err) } };
  }

  if (!res.ok) {
    const { message, fields } = await readError(res);
    return { ok: false, error: { kind: "http", status: res.status, message, fields } };
  }

  if (res.status === 204) {
    return check(undefined)
      ? { ok: true, value: undefined as T }
      : { ok: false, error: { kind: "shape", message: "Expected a body, got 204" } };
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return { ok: false, error: { kind: "parse", message: "The response was not valid JSON" } };
  }
  return check(data) ? { ok: true, value: data } : { ok: false, error: { kind: "shape", message: "The response had an unexpected shape" } };
}

export function describeError(error: ApiError): string {
  switch (error.kind) {
    case "network": return "Can't reach the server. Is `npm run api` running?";
    case "timeout": return "The server is taking too long. Try again.";
    case "aborted": return "Cancelled.";
    case "http":    return error.status === 502 ? "Can't reach the API. Is `npm run api` running?" : error.message;
    case "parse":   return "The server sent something that isn't JSON.";
    case "shape":   return "The server sent data in an unexpected shape.";
  }
}
```

> Through the Vite proxy, "API not running" is **not** a network error — the browser *did* reach Vite, and Vite answers **`502 Bad Gateway`** (plain text, no JSON). That's why `readError` falls back to the status text, and why `describeError` turns a 502 into the same sentence as a network failure. Stop `npm run api` later and see what the app says.

The guards — the boundary between the network and your components:

```ts
// src/api/guards.ts
import type { Course, Instructor, Page, Stats } from "../../shared/types.ts";
import { LEVELS } from "../../shared/validate.ts";

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null;
const isNumber = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);

export function isCourse(x: unknown): x is Course {
  return (
    isObject(x) &&
    isNumber(x.id) &&
    typeof x.title === "string" &&
    isNumber(x.instructorId) &&
    LEVELS.some((l) => l === x.level) &&
    isNumber(x.price) &&
    isNumber(x.lessons) &&
    (x.status === "draft" || x.status === "published") &&
    isNumber(x.students) &&
    typeof x.updatedAt === "string"
  );
}

export function isCoursePage(x: unknown): x is Page<Course> {
  return (
    isObject(x) && Array.isArray(x.items) && x.items.every(isCourse) &&
    isNumber(x.total) && isNumber(x.page) && isNumber(x.pages)
  );
}

export function isInstructor(x: unknown): x is Instructor {
  return isObject(x) && isNumber(x.id) && typeof x.name === "string" && typeof x.email === "string";
}

export function isInstructorList(x: unknown): x is Instructor[] {
  return Array.isArray(x) && x.every(isInstructor);
}

export function isStats(x: unknown): x is Stats {
  return isObject(x) && ["courses", "published", "drafts", "students", "revenue"].every((k) => isNumber(x[k]));
}

export const isNothing = (x: unknown): x is undefined => x === undefined;
```

And the writes, as plain functions (Part 2 uses them):

```ts
// src/api/courses.ts — every write the app makes. Reads go through useQuery.
import type { Course, CourseInput, CoursePatch } from "../../shared/types.ts";
import { isCourse, isNothing } from "./guards";
import { request } from "./http";
import type { Result } from "./http";

export function createCourse(input: CourseInput): Promise<Result<Course>> {
  return request("/api/courses", { method: "POST", body: input, check: isCourse });
}

export function updateCourse(id: number, changes: CoursePatch): Promise<Result<Course>> {
  return request(`/api/courses/${id}`, { method: "PATCH", body: changes, check: isCourse });
}

export function deleteCourse(id: number): Promise<Result<undefined>> {
  return request(`/api/courses/${id}`, { method: "DELETE", check: isNothing });
}
```

---

### Step 3 — `useQuery` and the Small Components

Add `src/api/useQuery.ts` from Section 1.6, and `src/hooks/useDebouncedValue.ts` from Day 09 (Step 4). Then three tiny components every page will use:

```tsx
// src/components/ErrorPanel.tsx
import type { ApiError } from "../api/http";
import { describeError } from "../api/http";

export function ErrorPanel({ error, onRetry }: { error: ApiError; onRetry?: () => void }) {
  return (
    <div role="alert" className="error-panel">
      <p>{describeError(error)}</p>
      {onRetry && <button onClick={onRetry}>Try again</button>}
    </div>
  );
}
```

```tsx
// src/components/StatusBadge.tsx
import type { Status } from "../../shared/types.ts";

export function StatusBadge({ status }: { status: Status }) {
  return <span className={`badge badge-${status}`}>{status === "published" ? "Published" : "Draft"}</span>;
}
```

```ts
// src/format.ts
const egp = new Intl.NumberFormat("en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 });
const count = new Intl.NumberFormat("en");

export const formatPrice = (n: number): string => (n === 0 ? "Free" : egp.format(n));
export const formatCount = (n: number): string => count.format(n);
```

---

### Step 4 — The Frame and a First Page: the Dashboard

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

```tsx
// src/App.tsx
import { Route, Routes } from "react-router";
import { Layout } from "./Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { CoursesPage } from "./pages/CoursesPage";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { NewCoursePage } from "./pages/NewCoursePage";
import { EditCoursePage } from "./pages/EditCoursePage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/new" element={<NewCoursePage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="courses/:id/edit" element={<EditCoursePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
```

```tsx
// src/Layout.tsx
import { NavLink, Outlet } from "react-router";

export function Layout() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Course Dashboard</h1>
        <nav aria-label="Main">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/courses/new">New course</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

```tsx
// src/pages/NotFoundPage.tsx
import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <>
      <h2>404 — page not found</h2>
      <Link to="/">Go to the dashboard</Link>
    </>
  );
}
```

The dashboard makes **two** requests. Two `useQuery` calls run **in parallel** — neither waits for the other:

```tsx
// src/pages/DashboardPage.tsx
import { Link } from "react-router";
import { isCoursePage, isStats } from "../api/guards";
import { useQuery } from "../api/useQuery";
import { ErrorPanel } from "../components/ErrorPanel";
import { formatCount, formatPrice } from "../format";

export function DashboardPage() {
  const stats = useQuery("/api/stats", isStats);
  const popular = useQuery("/api/courses?sort=students&status=published&limit=5", isCoursePage);

  return (
    <>
      <h2>Dashboard</h2>

      {stats.error && !stats.data ? (
        <ErrorPanel error={stats.error} onRetry={stats.reload} />
      ) : (
        <dl className="stats" aria-busy={stats.loading}>
          <Stat label="Courses" value={stats.data && formatCount(stats.data.courses)} />
          <Stat label="Published" value={stats.data && formatCount(stats.data.published)} />
          <Stat label="Drafts" value={stats.data && formatCount(stats.data.drafts)} />
          <Stat label="Students" value={stats.data && formatCount(stats.data.students)} />
          <Stat label="Revenue" value={stats.data && formatPrice(stats.data.revenue)} />
        </dl>
      )}

      <h3>Most popular</h3>
      {popular.error && !popular.data ? (
        <ErrorPanel error={popular.error} onRetry={popular.reload} />
      ) : !popular.data ? (
        <p className="skeleton">Loading courses…</p>
      ) : (
        <ol>
          {popular.data.items.map((c) => (
            <li key={c.id}>
              <Link to={`/courses/${c.id}`}>{c.title}</Link> — {formatCount(c.students)} students
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

// While loading, the card keeps its size and shows "…" — the layout doesn't jump
function Stat({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="stat">
      <dt>{label}</dt>
      <dd>{value ?? "…"}</dd>
    </div>
  );
}
```

Comment out the routes in `App.tsx` you haven't written yet, then `npm run dev` and look at `/`. Five numbers (14 · 10 · 4 · 2,103 · EGP 677,450) and five courses.

Now **make it fail**, one way at a time — this is the real test of a data screen:

1. Stop the API (Ctrl+C) and reload the page. Two readable error panels, each with **Try again**. Start the API, click them.
2. `npm run api:slow` and reload. The cards hold their size with `…` for 1.5 s. Nothing jumps.
3. `npm run api -- --fail=1` and reload: errors. Stop it, `npm run api`, **Try again**: data.
4. In the Network tab, find the two `(canceled)` requests from Strict Mode's double-mount. Then find the two that weren't.

---

# Part 2 — Writing Data

## 2 — Concept (45 min)

### 2.1 Mutations Belong in Event Handlers

Day 09, Section 1.8: if something happens *because the user did something*, it goes in the handler. Saving, publishing and deleting are the purest example:

```tsx
// ❌ an effect that "reacts" to a flag — runs twice in Strict Mode, runs again on re-mount
useEffect(() => {
  if (shouldPublish) updateCourse(id, { status: "published" });
}, [shouldPublish, id]);

// ✅ the click IS the reason
async function publish() {
  const result = await updateCourse(id, { status: "published" });
  …
}
```

A `GET` in an effect is safe to repeat. A `POST` in an effect **creates two courses** in development — and you'd only find out from the database.

---

### 2.2 Every Write Has Three Outcomes

| Outcome | Example | What the user sees |
|---|---|---|
| **Success** | `200`, `201`, `204` | the change — and data elsewhere that depends on it updates |
| **Rejected** | `400` with `fields`, `409` with a reason | the server's message, **next to what caused it**; nothing they typed is lost |
| **Failed** | network, timeout, `503` | "couldn't save — try again"; the button comes back |

And while it's in flight: the button is **disabled** and says what's happening (`Publishing…`), so it can't be sent twice (Day 08).

A `409 Conflict` is the server saying *"that request is valid, but not right now"* — publishing a course with no lessons, deleting one that has students. Those rules live on the **server**, because only the server sees the whole truth. The client may warn early, but it can never be the only check.

---

### 2.3 Server Validation Errors, in the Form

The client validates first (same `validateCourse`, shared). But the server **always** validates again, and it can know things the browser doesn't — an instructor someone just removed, a title that's now taken. So the form must show **server** field errors too:

```
POST /api/courses   {"title":"x", …}
← 400 { "error": "Some fields need fixing.", "fields": { "title": "Use at least 3 characters." } }
```

The pattern: `onSubmit` returns the `ApiError` (or `null` on success). The form puts `fields` into a `serverErrors` state, shows each one under its field, and **clears a field's server error as soon as the user edits that field** — the server's opinion was about the old value.

---

### 2.4 After a Write: Refresh, or Patch the Copy?

Your screen holds a **copy** of server data (1.1). After a successful write it's out of date. Three options, simplest first:

| Option | How | Good for |
|---|---|---|
| **Navigate** | go to a page that loads fresh data | create → detail page, delete → list |
| **Reload** | call the query's `reload()` | small pages; you want the server's exact answer |
| **Patch** | use the server's response to update what you show | the response *is* the new object (PATCH returns the course) |

Today's dashboard mostly **navigates** and **reloads**: every page loads its data when it mounts, so moving between pages refreshes naturally. It costs a few extra requests and gives you one big guarantee — what you see is what the server said. Libraries call this **invalidation**, and make it automatic.

---

### 2.5 Optimistic Updates in React

Day 06, 9.4: **pessimistic** waits for the server; **optimistic** shows the change immediately and rolls it back if the server says no.

In React, an optimistic change is a piece of **local state that overrides the server's copy** until the server answers:

```tsx
const [override, setOverride] = useState<Status | null>(null);   // what we're pretending
const shown = override ?? course.status;                          // derived

async function toggle() {
  const next = shown === "published" ? "draft" : "published";
  setOverride(next);                               // 1. show it now
  const result = await updateCourse(course.id, { status: next });
  if (!result.ok) setMessage(describeError(result.error));   // 3b. tell them why
  setOverride(null);                               // 2/3a. stop pretending — the server's copy wins
  if (result.ok) reload();                         //      …and fetch that copy
}
```

The rules that make it safe:

- **Roll back only what you changed.** Rolling back is "drop *my* override", never "restore a snapshot of the whole list" — that snapshot would also undo changes made in the meantime. (Problem 3 is built around this trap.)
- **One request per item at a time.** Disable that item's control while its request is pending, so two toggles can't race.
- **Always say why it rolled back.** A checkbox that silently jumps back is worse than a slow one.
- **Use it only for changes that almost always succeed.** Publishing usually works; the dashboard uses optimistic for the publish toggle and pessimistic for everything with a form.

> React 19 also ships `useOptimistic`, built for exactly this pattern together with Actions. Once you've written it by hand, its documentation will read like a summary of this section.

---

## Build — Follow Along: Part 2

### Step 5 — `CourseDetailPage` — Publish (Optimistic) and Delete (Pessimistic)

```tsx
// src/pages/CourseDetailPage.tsx
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { Course, Status } from "../../shared/types.ts";
import { deleteCourse, updateCourse } from "../api/courses";
import { isCourse, isInstructorList } from "../api/guards";
import { describeError } from "../api/http";
import { useQuery } from "../api/useQuery";
import { ErrorPanel } from "../components/ErrorPanel";
import { StatusBadge } from "../components/StatusBadge";
import { formatCount, formatPrice } from "../format";

export function CourseDetailPage() {
  const { id } = useParams();
  const course = useQuery(`/api/courses/${id}`, isCourse);
  const instructors = useQuery("/api/instructors", isInstructorList);

  if (course.error?.kind === "http" && course.error.status === 404) {
    return (
      <>
        <h2>Course not found</h2>
        <p>There's no course with id “{id}”.</p>
        <Link to="/courses">Back to the courses</Link>
      </>
    );
  }
  if (course.error && !course.data) return <ErrorPanel error={course.error} onRetry={course.reload} />;
  if (!course.data) return <p className="skeleton">Loading course…</p>;

  const instructor = instructors.data?.find((i) => i.id === course.data?.instructorId);

  return (
    <CourseView
      key={course.data.id}
      course={course.data}
      instructorName={instructor?.name ?? "…"}
      onChanged={course.reload}
    />
  );
}

interface CourseViewProps {
  course: Course;
  instructorName: string;
  onChanged: () => void;
}

function CourseView({ course, instructorName, onChanged }: CourseViewProps) {
  const navigate = useNavigate();
  const [override, setOverride] = useState<Status | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const status = override ?? course.status;        // optimistic value wins while pending
  const toggling = override !== null;

  async function togglePublished() {
    if (toggling) return;
    const next: Status = status === "published" ? "draft" : "published";
    setMessage("");
    setOverride(next);
    const result = await updateCourse(course.id, { status: next });
    setOverride(null);
    if (result.ok) onChanged();
    else setMessage(describeError(result.error));
  }

  async function remove() {
    if (!window.confirm(`Delete “${course.title}”? This can't be undone.`)) return;
    setMessage("");
    setDeleting(true);
    const result = await deleteCourse(course.id);
    if (result.ok) {
      navigate("/courses", { replace: true });       // the detail page no longer exists
      return;
    }
    setDeleting(false);
    setMessage(describeError(result.error));
  }

  return (
    <article>
      <h2>{course.title}</h2>
      <p>
        <StatusBadge status={status} /> · {course.level} · {instructorName}
      </p>
      <dl className="facts">
        <dt>Price</dt><dd>{formatPrice(course.price)}</dd>
        <dt>Lessons</dt><dd>{course.lessons}</dd>
        <dt>Students</dt><dd>{formatCount(course.students)}</dd>
      </dl>

      {message && <p role="alert" className="error">{message}</p>}

      <div className="actions">
        <button onClick={togglePublished} disabled={toggling || deleting}>
          {status === "published" ? "Unpublish" : "Publish"}
        </button>
        <Link to={`/courses/${course.id}/edit`}>Edit</Link>
        <button onClick={remove} disabled={deleting || toggling} className="danger">
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </article>
  );
}
```

Why split it into `CourseDetailPage` and `CourseView`?

- The page deals with **loading** — 404, error, skeleton. By the time `CourseView` renders, `course` is a real `Course`, not `Course | undefined`.
- `key={course.data.id}` resets the view's local state (override, message) when you move to another course — Day 08, 1.6.

Try it with `npm run api:slow`:

1. Open **React From Zero**, click **Unpublish**. The badge flips **immediately**; 1.5 s later the page reloads from the server and agrees.
2. Open **Next.js Full-Stack** (no lessons), click **Publish**. The badge says Published for 1.5 s… then flips back, with the server's reason in an alert.
3. Click **Delete** on **React From Zero**: `This course has 356 enrolled students — unpublish it instead.` Nothing is lost.
4. Delete **Automating with Node Scripts** (a draft with no students): you land on `/courses`, and **Back** doesn't return to the deleted course.
5. Visit `/courses/99`: Course not found.

---

### Step 6 — `CourseForm` — Client Rules, Server Rules, One Form

The form works with **strings** (that's what inputs give you, Day 08) and converts on submit. The values type and its helpers go in their own file — `only-export-components` (Day 09, 2.3) wants component files to export only components:

```ts
// src/components/course-form-values.ts
import type { CourseInput, Level } from "../../shared/types.ts";

export interface CourseFormValues {
  title: string;
  instructorId: string;
  level: Level;
  price: string;
  lessons: string;
}

export const EMPTY_COURSE: CourseFormValues = { title: "", instructorId: "", level: "beginner", price: "0", lessons: "0" };

export function toFormValues(c: CourseInput): CourseFormValues {
  return { title: c.title, instructorId: String(c.instructorId), level: c.level, price: String(c.price), lessons: String(c.lessons) };
}

// "" → NaN, "12" → 12, "1e2" → NaN: only plain digits count as a number here
const toWhole = (s: string): number => (/^\d+$/.test(s.trim()) ? Number(s.trim()) : Number.NaN);

export function toInput(v: CourseFormValues): CourseInput {
  return {
    title: v.title.trim(),
    instructorId: v.instructorId === "" ? Number.NaN : Number(v.instructorId),
    level: v.level,
    price: toWhole(v.price),
    lessons: toWhole(v.lessons),
  };
}
```

```tsx
// src/components/CourseForm.tsx
import { useId, useState } from "react";
import type { ChangeEvent, ReactNode, SubmitEvent } from "react";
import type { CourseInput, Instructor } from "../../shared/types.ts";
import { hasErrors, LEVELS, validateCourse } from "../../shared/validate.ts";
import type { CourseErrors } from "../../shared/validate.ts";
import type { ApiError } from "../api/http";
import { describeError } from "../api/http";
import { toInput } from "./course-form-values";
import type { CourseFormValues } from "./course-form-values";

type Field = keyof CourseFormValues;

interface CourseFormProps {
  initial: CourseFormValues;
  instructors: Instructor[];
  submitLabel: string;
  onSubmit: (input: CourseInput) => Promise<ApiError | null>;   // null = saved
}

export function CourseForm({ initial, instructors, submitLabel, onSubmit }: CourseFormProps) {
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<CourseErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const id = useId();

  const clientErrors = validateCourse(toInput(values), instructors.map((i) => i.id));     // derived
  const shown = (f: Field): string | undefined => serverErrors[f] ?? (touched[f] ? clientErrors[f] : undefined);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const name = e.target.name as Field;
    setValues((prev) => ({ ...prev, [name]: e.target.value }));
    setServerErrors((prev) => ({ ...prev, [name]: undefined }));   // the server judged the OLD value
  }

  function handleBlur(e: { target: { name: string } }) {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = e.currentTarget;
    setTouched({ title: true, instructorId: true, level: true, price: true, lessons: true });
    setFormError("");

    if (hasErrors(clientErrors)) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    setSubmitting(true);
    const error = await onSubmit(toInput(values));
    if (error === null) return;                       // the page navigates away
    setSubmitting(false);
    if (error.kind === "http" && error.fields) setServerErrors(error.fields);
    setFormError(describeError(error));
  }

  function field(name: Field, label: string, control: ReactNode) {
    const message = shown(name);
    return (
      <div className="field">
        <label htmlFor={`${id}-${name}`}>{label}</label>
        {control}
        {message && <p id={`${id}-${name}-error`} className="error">{message}</p>}
      </div>
    );
  }

  const aria = (name: Field) => ({
    id: `${id}-${name}`,
    name,
    onChange: handleChange,
    onBlur: handleBlur,
    "aria-invalid": shown(name) ? true : undefined,
    "aria-describedby": shown(name) ? `${id}-${name}-error` : undefined,
  });

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={submitting}>
      {field("title", "Title", <input {...aria("title")} value={values.title} />)}
      {field("instructorId", "Instructor",
        <select {...aria("instructorId")} value={values.instructorId}>
          <option value="">Choose…</option>
          {instructors.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>,
      )}
      {field("level", "Level",
        <select {...aria("level")} value={values.level}>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>,
      )}
      {field("price", "Price (EGP, 0 = free)", <input {...aria("price")} inputMode="numeric" value={values.price} />)}
      {field("lessons", "Lessons", <input {...aria("lessons")} inputMode="numeric" value={values.lessons} />)}

      {formError && <p role="alert" className="error">{formError}</p>}

      <button type="submit" disabled={submitting}>{submitting ? "Saving…" : submitLabel}</button>
    </form>
  );
}
```

> `noValidate` — the shared `validateCourse` is the one source of rules; the browser's built-in bubbles would be a second, different set (Day 08, 1.4).

The two pages are thin, as on Day 08 — the form owns the form, the page owns what happens next:

```tsx
// src/pages/NewCoursePage.tsx
import { useNavigate } from "react-router";
import { createCourse } from "../api/courses";
import { isInstructorList } from "../api/guards";
import { useQuery } from "../api/useQuery";
import { CourseForm } from "../components/CourseForm";
import { EMPTY_COURSE } from "../components/course-form-values";
import { ErrorPanel } from "../components/ErrorPanel";

export function NewCoursePage() {
  const navigate = useNavigate();
  const instructors = useQuery("/api/instructors", isInstructorList);

  if (instructors.error && !instructors.data) return <ErrorPanel error={instructors.error} onRetry={instructors.reload} />;
  if (!instructors.data) return <p className="skeleton">Loading…</p>;

  return (
    <>
      <h2>New course</h2>
      <p className="hint">New courses start as drafts.</p>
      <CourseForm
        initial={EMPTY_COURSE}
        instructors={instructors.data}
        submitLabel="Create course"
        onSubmit={async (input) => {
          const result = await createCourse(input);
          if (!result.ok) return result.error;
          navigate(`/courses/${result.value.id}`, { replace: true });
          return null;
        }}
      />
    </>
  );
}
```

```tsx
// src/pages/EditCoursePage.tsx
import { Link, useNavigate, useParams } from "react-router";
import { updateCourse } from "../api/courses";
import { isCourse, isInstructorList } from "../api/guards";
import { useQuery } from "../api/useQuery";
import { CourseForm } from "../components/CourseForm";
import { toFormValues } from "../components/course-form-values";
import { ErrorPanel } from "../components/ErrorPanel";

export function EditCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = useQuery(`/api/courses/${id}`, isCourse);
  const instructors = useQuery("/api/instructors", isInstructorList);

  if (course.error?.kind === "http" && course.error.status === 404) {
    return <p>Course not found. <Link to="/courses">Back to the courses</Link></p>;
  }
  const error = (!course.data && course.error) || (!instructors.data && instructors.error);
  if (error) {
    return <ErrorPanel error={error} onRetry={() => { course.reload(); instructors.reload(); }} />;
  }
  if (!course.data || !instructors.data) return <p className="skeleton">Loading…</p>;

  const courseId = course.data.id;
  return (
    <>
      <h2>Edit course</h2>
      <CourseForm
        key={courseId}
        initial={toFormValues(course.data)}
        instructors={instructors.data}
        submitLabel="Save changes"
        onSubmit={async (input) => {
          const result = await updateCourse(courseId, input);
          if (!result.ok) return result.error;
          navigate(`/courses/${courseId}`, { replace: true });
          return null;
        }}
      />
    </>
  );
}
```

Try it:

1. `/courses/new` — submit empty: client errors, focus on Title, **no request** in the Network tab.
2. Create a valid course: you land on its page, as a **Draft**. Back skips the form.
3. **See the server's rules:** temporarily change `hasErrors(clientErrors)` in `handleSubmit` to `false`, and submit `x` as the title. The **server's** message appears under Title. Type one letter — it disappears. Put the check back.
4. Edit **Docker for Developers**, set Lessons to `0`, save: `409` — it's published, and the server won't allow a published course with no lessons. Everything you typed is still there.

---

# Part 3 — Project: Course Management Dashboard

## 3 — Concept (20 min)

### 3.1 Plan Before You Type

**1. The route table**

| URL | Page | Loads |
|---|---|---|
| `/` | `DashboardPage` | `/api/stats` + the 5 most popular — in parallel |
| `/courses?q=&status=&sort=&page=` | `CoursesPage` | `/api/courses?…` (debounced) + `/api/instructors` |
| `/courses/new` | `NewCoursePage` | `/api/instructors` |
| `/courses/:id` | `CourseDetailPage` | `/api/courses/:id` + `/api/instructors` |
| `/courses/:id/edit` | `EditCoursePage` | both, before the form appears |
| anything else | `NotFoundPage` | — |

**2. The state table**

| Data | Kind | Lives in |
|---|---|---|
| courses, stats, instructors | **server state** — a copy | `useQuery` in each page |
| `q`, `status`, `sort`, `page` | **URL state** | `useSearchParams` |
| the form's values, touched, server errors, submitting | **client state** | `CourseForm` |
| the optimistic status, the action message | **client state** | `CourseView` |
| "loading", "showing 7–12 of 14", the badge text | **derived** | computed in render |

Notice what's **missing**: there's no app-wide store and no Context. Server data doesn't need one — each page asks the server. Day 09's Context is for client state many components share; tomorrow's login (Session 22) will be exactly that.

---

### 3.2 The List Page's Pipeline

```
searchParams ──parse──▶ { q, status, sort, page }
      │                           │
      │                    build the API URL ──useDebouncedValue(300)──▶ useQuery(url, isCoursePage, keepPrevious)
      │                                                                          │
   controls ◀──────────────── render: table (dimmed while loading) + "Showing 7–12 of 14" + pager ◀──┘
```

- Parsing protects the **controls** (Day 08). The server parses again — never trust the URL on either side.
- Changing `q` or `status` removes `page` (back to page 1) — Day 08's rule.
- The pager uses the **server's** `page` and `pages`, so `?page=99` shows the last page and the pager agrees.

---

## Build — Follow Along: Part 3

### Step 7 — `CoursesPage`

```tsx
// src/pages/CoursesPage.tsx
import { Link, useSearchParams } from "react-router";
import type { Course, Instructor } from "../../shared/types.ts";
import { isCoursePage, isInstructorList } from "../api/guards";
import { useQuery } from "../api/useQuery";
import { ErrorPanel } from "../components/ErrorPanel";
import { StatusBadge } from "../components/StatusBadge";
import { formatCount, formatPrice } from "../format";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

const STATUSES = ["all", "published", "draft"] as const;
const SORTS = [
  { value: "title", label: "Title" },
  { value: "students", label: "Most students" },
  { value: "price", label: "Price" },
  { value: "updated", label: "Recently updated" },
] as const;
type StatusFilter = (typeof STATUSES)[number];
type Sort = (typeof SORTS)[number]["value"];

const PAGE_SIZE = 6;
const parseStatus = (raw: string | null): StatusFilter => STATUSES.find((s) => s === raw) ?? "all";
const parseSort = (raw: string | null): Sort => SORTS.find((s) => s.value === raw)?.value ?? "title";
const parsePage = (raw: string | null): number => (raw !== null && /^\d+$/.test(raw) && Number(raw) >= 1 ? Number(raw) : 1);

export function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const status = parseStatus(searchParams.get("status"));
  const sort = parseSort(searchParams.get("sort"));
  const page = parsePage(searchParams.get("page"));

  // The API URL — built only from parsed values, then debounced
  const api = new URLSearchParams();
  if (q.trim() !== "") api.set("q", q.trim());
  if (status !== "all") api.set("status", status);
  api.set("sort", sort);
  api.set("page", String(page));
  const url = useDebouncedValue(`/api/courses?${api}`, 300);

  const courses = useQuery(url, isCoursePage, true);
  const instructors = useQuery("/api/instructors", isInstructorList);

  function update(changes: Record<string, string | null>, replace = false) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(changes)) {
          if (value === null || value === "") next.delete(key);
          else next.set(key, value);
        }
        return next;
      },
      { replace },
    );
  }

  return (
    <>
      <div className="list-head">
        <h2>Courses</h2>
        <Link to="/courses/new" className="button">New course</Link>
      </div>

      <div className="filter-bar">
        <input
          type="search"
          value={q}
          onChange={(e) => update({ q: e.target.value, page: null }, true)}
          placeholder="Search titles…"
          aria-label="Search courses"
        />
        <select aria-label="Status" value={status} onChange={(e) => update({ status: e.target.value === "all" ? null : e.target.value, page: null })}>
          {STATUSES.map((s) => <option key={s} value={s}>{s === "all" ? "All statuses" : s}</option>)}
        </select>
        <select aria-label="Sort by" value={sort} onChange={(e) => update({ sort: e.target.value === "title" ? null : e.target.value })}>
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {courses.error && !courses.data ? (
        <ErrorPanel error={courses.error} onRetry={courses.reload} />
      ) : !courses.data ? (
        <p className="skeleton">Loading courses…</p>
      ) : (
        <section aria-busy={courses.loading} className={courses.loading ? "stale" : undefined}>
          {courses.error && <ErrorPanel error={courses.error} onRetry={courses.reload} />}
          {courses.data.total === 0 ? (
            <p className="empty">No courses match. <Link to="/courses/new">Create one</Link></p>
          ) : (
            <>
              <CourseTable courses={courses.data.items} instructors={instructors.data ?? []} />
              <Pager
                page={courses.data.page}
                pages={courses.data.pages}
                total={courses.data.total}
                onPage={(p) => update({ page: p === 1 ? null : String(p) })}
              />
            </>
          )}
        </section>
      )}
    </>
  );
}

function CourseTable({ courses, instructors }: { courses: Course[]; instructors: Instructor[] }) {
  const nameOf = (id: number) => instructors.find((i) => i.id === id)?.name ?? "…";
  return (
    <table className="courses">
      <thead>
        <tr><th>Title</th><th>Instructor</th><th>Status</th><th>Students</th><th>Price</th></tr>
      </thead>
      <tbody>
        {courses.map((c) => (
          <tr key={c.id}>
            <td><Link to={`/courses/${c.id}`}>{c.title}</Link></td>
            <td>{nameOf(c.instructorId)}</td>
            <td><StatusBadge status={c.status} /></td>
            <td>{formatCount(c.students)}</td>
            <td>{formatPrice(c.price)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface PagerProps { page: number; pages: number; total: number; onPage: (page: number) => void }

function Pager({ page, pages, total, onPage }: PagerProps) {
  const first = (page - 1) * PAGE_SIZE + 1;
  const last = Math.min(page * PAGE_SIZE, total);
  return (
    <nav className="pager" aria-label="Pages">
      <button onClick={() => onPage(page - 1)} disabled={page <= 1}>← Previous</button>
      <span>Showing {first}–{last} of {total} · page {page} of {pages}</span>
      <button onClick={() => onPage(page + 1)} disabled={page >= pages}>Next →</button>
    </nav>
  );
}
```

Two things worth reading twice:

- **The URL is built from parsed values**, so `?status=banana` never reaches the server as `banana` — and `?page=99` *does* go to the server, which clamps it and answers `page: 3`. The pager shows the server's page.
- **Debouncing the API URL**, not the search box: the box and the address bar react instantly; only the request waits.

Add a few styles to `src/index.css` — at least this one, so stale data looks stale:

```css
.stale { opacity: 0.55; transition: opacity 0.2s; }
```

---

### Step 8 — Run It Against a Hostile Server

```bash
npx tsc -b                                    # zero type errors (app + server + shared)
npm run lint                                  # zero warnings
npm run build                                 # production build succeeds
npm run api                                   # terminal 1
npm run dev                                   # terminal 2
```

With `npm run api`:

1. `/courses` — 6 courses, `Showing 1–6 of 14 · page 1 of 3`. Next, Next: `13–14 of 14`.
2. Search `react`: 3 courses. Status **draft**: 4. Both: `React Native Basics` only. Refresh — all still there.
3. `/courses?page=99` — page 3 of 3, and the pager agrees.
4. Create a course, publish it (it needs lessons), find it on the dashboard's numbers.

Now restart with `npm run api:chaos` (random delays up to 1.5 s, a quarter of calls failing):

5. Type `react` **fast** in the search box. Watch the Network tab: earlier requests are canceled or ignored, and the table **always** matches the box when it settles.
6. Page back and forth quickly. The old page stays visible, dimmed, until the new one arrives — never a blank flash.
7. Keep clicking around until something fails: every failure shows a readable message and a **Try again** that works.
8. On a course page, toggle publish a few times. Some fail and roll back **with a message**.

### Step 9 — Break It, Then Ship It

Break each, see the symptom, fix it. You'll explain one in the assignment.

1. **No abort** — in `useQuery`, delete `return () => controller.abort();` *and* the `if (controller.signal.aborted) return;` line. With `api:chaos`, type fast: the table sometimes shows results for an **older** search than the box.
2. **One loading flag** — replace the page's render with `courses.loading ? <p>Loading…</p> : …`. Page through the list: the table **flashes empty** every time.
3. **Mutation in an effect** — make `NewCoursePage` create the course in a `useEffect` that depends on a `submitted` flag. Submit once in development: Strict Mode creates **two** courses. Count them on the list.
4. **Trusting the URL** — send `status` to the API without `parseStatus`. Try `?status=banana`: the server ignores it, but your `<select>` now shows a value it doesn't have.

On a branch (`feature/day-10`): commit, push, open a PR, merge it.

---

## What's Next

You've been using an API someone else wrote. Starting next session, **you write it**: Session 15 is **Node.js + Express** — servers, routing, middleware — and by Session 20 you'll have replaced this provided server with your own Course Platform API, backed by a real database.

---

## Day 10 Files

- [README.md](README.md) — this guide
- [ASSIGNMENT.md](ASSIGNMENT.md) — Day 10 assignment

← Back to [Day 09 — State Management: useState, useEffect & the Context API](../Day-09-State-Management/README.md)
