# Day 10 — Assignment

**Track 2 · Day 10 · API Integration in React + Project: Course Management Dashboard**

> Day 09 gave your board a memory. Today your app talks to a real server — one that is slow, out of order and sometimes says no.
>
> Same format as Days 07–09: **problems, not checklists**. Each problem gives you the input, the expected output, the constraints and a set of examples. The **how** is yours. Read it, break it down, write your approach, *then* code — and you're done when every example produces the expected output.

**⏱ Budget:** ~7–8 hours · **📅 Duration:** 6 days · **🚩 Deadline:** before the next session

| # | Task | Topics | Difficulty | ⏱ |
|---|---|---|---|---|
| — | Warm-up — predict the output | fetch in effects, races, mutations | — | 30 min |
| P1 | Problem — `requestReducer` | request state, late answers, request ids | 🟢 Easy | 1 h |
| P2 | Problem — Course Feed | "Load more", pages that shift, retry one page | 🟡 Medium | 1 h 30 |
| P3 | Problem — Publish Board | optimistic updates, per-item rollback | 🟡 Medium | 2 h |
| P4 | Problem — Extend the Course Dashboard | parallel requests, live refresh, visibility | 🟠 Medium+ | 2 h |
| — | Ship it | notes, PR, LinkedIn | — | 45 min |

> **The Course Dashboard itself is not homework.** You build it while following the README. Problem 4 asks you to *extend* it — so finish the follow-along first.

---

## How to Work a Problem

1. **Read the whole problem twice** — examples and constraints included.
2. **Write your approach first** in `APPROACH.md` — 2–5 lines per problem, *before* any code.
3. **Code it** yourself. No copy-paste.
4. **Test it against every example**, character by character.
5. **Open a hint only after 20 minutes stuck** — one at a time.

> **Where it goes:** Problems 1–3 live in one Vite project, `day-10-problems/` (React + TypeScript). Copy the README's `server/` and `shared/` folders into it, add the `api` scripts and the `/api` proxy, and copy `src/api/http.ts` and `src/api/guards.ts`. Problem 4 lives in your README `course-dashboard/` project.

> **The API resets on every restart** — every example below assumes a **freshly started** server unless it says otherwise. Keep its terminal visible: the request log is part of several examples.

> **Rules for every problem:** typed everything · no `any`, no `@ts-ignore` · `react/exhaustive-deps` on, no lint-disable comments · every response goes through a type guard · every effect that starts a request or a timer cleans it up · mutations happen in event handlers, never in effects.

---

## Warm-up — Predict the Output

Six snippets. Predict in `predictions.md` **before** running, then run, record the actual result, and write **one sentence of why** for every miss. Run them in `day-10-problems/` with `<StrictMode>` on and the API running.

```tsx
// 1 — How many requests to /api/stats appear in the API's log when this mounts in development?
//     How many in a production build (npm run build && npm run preview)?
function A() {
  useEffect(() => {
    fetch("/api/stats");
  }, []);
  return null;
}

// 2 — The API is NOT running. What does this log, through the Vite proxy?
const res = await fetch("/api/stats");
console.log(res.ok, res.status);

// 3 — What does this log?
const res = await fetch("/api/courses/99");
console.log(res.ok, res.status, await res.json());

// 4 — The user types "re" quickly (two renders: q = "r", then q = "re").
//     The "r" response arrives LAST. What does the list show at the end?
function Search({ q }: { q: string }) {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    fetch(`/api/courses?q=${q}`)
      .then((r) => r.json())
      .then((page) => setItems(page.items.map((c: { title: string }) => c.title)));
  }, [q]);
  return <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>;
}

// 5 — Clicked once, in development. How many new courses does the server have afterwards?
function NewCourseButton() {
  const [create, setCreate] = useState(false);
  useEffect(() => {
    if (create) {
      fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Warm-up course", instructorId: 1, level: "beginner", price: 0, lessons: 1 }),
      });
    }
  }, [create]);
  return <button onClick={() => setCreate(true)}>Create</button>;
}

// 6 — What does this log? (Course 3 has 356 students.)
const res = await fetch("/api/courses/3", { method: "DELETE" });
console.log(res.status, res.ok);
const again = await fetch("/api/courses/3");
console.log(again.status);
```

**✅ Deliverable:** `predictions.md`.

---

## Problem 1 — `requestReducer`

🟢 **Easy** · request state as a reducer, request ids, ignoring late answers

### Description

Every request a screen makes goes through the same states. Write the reducer that tracks them — including the hard part: answers that arrive **late** or **twice** must be ignored. **No React** in this problem; it's a plain function you can run with `node`.

### Signature

```ts
export type RequestStatus = "idle" | "loading" | "success" | "error";

export interface RequestState<T> {
  status: RequestStatus;
  data: T | null;          // the last successful data — kept while reloading and after an error
  error: string | null;
  latest: number;          // the id of the newest request started so far
}

export type RequestAction<T> =
  | { type: "started"; id: number }
  | { type: "succeeded"; id: number; data: T }
  | { type: "failed"; id: number; error: string }
  | { type: "reset" };

export function initialRequest<T>(): RequestState<T>      // { status: "idle", data: null, error: null, latest: 0 }

export function requestReducer<T>(state: RequestState<T>, action: RequestAction<T>): RequestState<T>
```

### Rules

| Action | Effect |
|---|---|
| `started` | Only if `id` is **greater than** `latest`: status `loading`, `latest = id`, `error = null`, **`data` kept**. Otherwise nothing changes. |
| `succeeded` | Only if `id === latest` **and** status is `loading`: status `success`, the new `data`, `error = null`. Otherwise nothing changes. |
| `failed` | Only if `id === latest` **and** status is `loading`: status `error`, the `error` message, **`data` kept**. Otherwise nothing changes. |
| `reset` | status `idle`, `data = null`, `error = null` — **`latest` is kept**. If the state is already idle with no data and no error, nothing changes. |

- **"Nothing changes" means: return the same `state` object.**
- Never mutate `state`.

### Examples

Each example starts from `initialRequest<string>()`. `S(n)` = `started` with id n, `OK(n, x)` = `succeeded`, `NO(n, e)` = `failed`. The last column marks each step: `≠` a new state, `=` the same object returned.

| # | Actions | Final state | Steps |
|---|---|---|---|
| 1 | S(1), OK(1, "A") | `success · data "A" · error null · latest 1` | `≠≠` |
| 2 | S(1), S(2), OK(2, "B"), OK(1, "A") | `success · data "B" · error null · latest 2` | `≠≠≠=` |
| 3 | S(1), S(2), OK(1, "A"), NO(2, "Timeout") | `error · data null · error "Timeout" · latest 2` | `≠≠=≠` |
| 4 | S(1), OK(1, "A"), S(2), NO(2, "503") | `error · data "A" · error "503" · latest 2` | `≠≠≠≠` |
| 5 | S(2), S(2), S(1) | `loading · data null · error null · latest 2` | `≠==` |
| 6 | S(1), OK(1, "A"), OK(1, "Z") | `success · data "A" · error null · latest 1` | `≠≠=` |
| 7 | S(1), reset, OK(1, "A"), S(1), S(2) | `loading · data null · error null · latest 2` | `≠≠==≠` |
| 8 | S(1), NO(1, "x"), S(2), OK(2, "B") | `success · data "B" · error null · latest 2` | `≠≠≠≠` |
| 9 | reset | `idle · data null · error null · latest 0` | `=` |

> Example 2 is the race from the warm-up, solved. Example 7 is the trap: after a `reset`, why must a late answer for request 1 still be ignored — and why can't the next request reuse id 1?

### Constraints

- Pure: no React, no `fetch`, no clock.
- `requestReducer` is **generic** — the same function works for `RequestState<Course[]>` and `RequestState<Stats>`.
- Write `request.test-run.ts` that runs all nine examples on **frozen** states and prints `PASS`/`FAIL` for each — checking the final state **and** the `=`/`≠` of every step.

<details>
<summary>💡 Hint 1</summary>

Three of the four cases start with a guard that returns `state`. Write the guards first; the "change" part of each case is one object literal.
</details>

<details>
<summary>💡 Hint 2</summary>

To check the step marks, run the actions with a loop that remembers `prev`, and push `next === prev ? "=" : "≠"` to a string. Compare that string with the table.
</details>

**✅ Deliverable:** `src/request/request.ts` + `request.test-run.ts` + 1 screenshot of the test output, all `PASS`.

---

## Problem 2 — Course Feed

🟡 **Medium** · "Load more", deduplication, retrying one page, your reducer in a component

### Description

A feed that shows courses four at a time with a **Load more** button — the pattern every social app uses. Easy to build; hard to build *correctly*, because the server's pages move when someone else adds a course, and the server never says "there's no page 5".

### Given

`GET /api/courses?sort=title&limit=4&page=N` → `Page<Course>` (README, `shared/types.ts`). With the seed data that's **4 pages: 4 + 4 + 4 + 2 courses**. The server **clamps** a page past the end to the last page.

### Behaviour

- On mount, page 1 loads. Before it arrives: `Loading courses…`.
- Each course is one line: its title. Under the list: `8 of 14 loaded` — *loaded* counts the courses on screen, *of* is the server's latest `total`.
- **Load more** fetches the next page and **appends** it. While it's loading the button is disabled and reads `Loading…`; everything already loaded stays.
- A course is **never shown twice** — even if the server returns it again.
- When the last page has been loaded, the button is replaced by `That's everything.`
- If a page fails: `Couldn't load more: <message>` with **Try again**, which retries **that same page**. Nothing already loaded disappears. If **page 1** fails, there's nothing to keep: the message and Try again replace the list.
- Use **your Problem 1 reducer** (`useReducer`) to track the page request, and abort it if the feed unmounts.

### Examples

Fresh server. `T(…)` lists titles top to bottom.

| # | Action | Expected |
|---|---|---|
| 1 | Open the feed | Advanced React Patterns · Authentication & Security · Automating with Node Scripts · CSS Layout Mastery · `4 of 14 loaded` |
| 2 | **Load more** | + Databases with PostgreSQL · Docker for Developers · Git & GitHub for Teams · JavaScript Foundations · `8 of 14 loaded` |
| 3 | **Load more** twice | + 6 more, ending with TypeScript in Practice · `14 of 14 loaded` · `That's everything.` |
| 4 | `npm run api:slow`, open the feed, click **Load more** | For 1.5 s: the first 4 still visible, button `Loading…` and disabled. Clicking it again does nothing — the server log shows **one** `page=2` request |
| 5 | Load page 1. In a terminal, **POST** a course titled `AAA Practice Course` (instructor 1, beginner, price 0, 1 lesson). Click **Load more** | The new page starts with CSS Layout Mastery — already on screen. You see **3** new courses (Databases with PostgreSQL · Docker for Developers · Git & GitHub for Teams) · `7 of 15 loaded` |
| 6 | Continue Example 5: **Load more** until the end | `14 of 15 loaded` · `That's everything.` — AAA Practice Course isn't shown (why not? answer in `APPROACH.md`) |
| 7 | Load page 1, **stop the API**, click **Load more** | `Couldn't load more: Can't reach the API. Is `npm run api` running?` · the first 4 still visible |
| 8 | Continue: start the API, click **Try again** | Page 2 is appended — not page 3, not page 1 again · `8 of 14 loaded` |
| 9 | Stop the API, open the feed | The error and **Try again**, no list. Start the API, Try again: Example 1 |

> Example 5 is the trap: page boundaries are positions, not courses. Example 3 hides a second one — what would a feed that requests "page + 1" forever show after the last page, given that the server clamps?

### Constraints

- The list of loaded courses is **one** piece of state; `N of M loaded` and "is there more?" are **derived**.
- "Is there more?" uses the server's `page` and `pages` from the **last** response — not `loaded < total` (Example 6 shows why).
- No `useQuery` here — the point is to drive the requests yourself with Problem 1's reducer.
- Loading a page is started by a **click** (a handler), except page 1 (an effect, cleaned up).

<details>
<summary>💡 Hint 1</summary>

State: the loaded `courses`, the last `page`/`pages` you received, and the request state from your reducer. The next page to ask for is `lastPage + 1` — and "Try again" asks for the same number, because `lastPage` didn't change.
</details>

<details>
<summary>💡 Hint 2</summary>

Dedupe on append: keep the courses whose `id` isn't already in the list — `const seen = new Set(prev.map((c) => c.id))`. Use a **functional** update so two quick appends can't overwrite each other.
</details>

<details>
<summary>💡 Hint 3</summary>

Give every request an id from a counter (`useRef(0)`, then `++ref.current`), dispatch `started` before calling `request`, and dispatch `succeeded`/`failed` with the same id. Your reducer then ignores anything late — for free.
</details>

**✅ Deliverable:** `src/feed/` + 2 screenshots: Example 5 (with the server log), and Example 7.

---

## Problem 3 — Publish Board

🟡 **Medium** · optimistic updates, per-item pending state, rolling back only what failed

### Description

An editor's screen: every course with a **Published** checkbox. Ticking it must feel instant — so it's **optimistic** — but the server may refuse, and several courses can be in flight at once. Whatever happens, the screen must end up showing exactly what the server has.

### Given

- `GET /api/courses?sort=title&limit=50` — all courses, once, on mount.
- `PATCH /api/courses/:id` with `{ "status": "published" }` or `{ "status": "draft" }` → the updated `Course`, or a `409` for a course with no lessons.

### Behaviour

- One row per course: a checkbox labelled with the course title, then `· N lessons`. The checkbox shows the status — the optimistic one while a request is pending.
- The heading reads `10 published · 4 drafts` — counted from what's **shown**, so it changes the moment you click.
- Clicking a checkbox flips it **immediately** and sends the `PATCH`. While that course's request is pending, its checkbox is **disabled** and the row shows `Saving…`. Other rows stay usable.
- On success, that row shows the **server's** course (from the response) — the list is **not** re-fetched.
- On failure, **only that row** goes back to the status it had, and shows `Couldn't save: <message>` until its checkbox is clicked again.

### Examples

Run with `npm run api:slow` (1.5 s per call), fresh server. Examples continue from each other.

| # | Action | Expected |
|---|---|---|
| 1 | Open the board | 14 rows, A → Z · `10 published · 4 drafts` |
| 2 | Untick **React From Zero** | At once: unticked, `Saving…`, `9 published · 5 drafts`. After 1.5 s: still unticked, `Saving…` gone |
| 3 | Tick **Next.js Full-Stack** (0 lessons) | At once: ticked, `10 published · 4 drafts`. After 1.5 s: unticked, `Couldn't save: A course needs at least one lesson before it can be published.`, `9 published · 5 drafts` |
| 4 | Tick **Next.js Full-Stack**, then within a second tick **React Native Basics** | Both ticked, both `Saving…`, `11 published · 3 drafts`. After both answer: Next.js unticked with its message, React Native **still ticked** · `10 published · 4 drafts` |
| 5 | Double-click **CSS Layout Mastery** quickly | It flips **once**; the server log shows **one** `PATCH /api/courses/9` |
| 6 | Refresh the page | Exactly what you saw after Example 5 — the server agrees with the screen |
| 7 | Stop the API. Untick **Docker for Developers** | After the proxy answers: ticked again, `Couldn't save: Can't reach the API. Is `npm run api` running?` |

> Example 4 is the trap. The obvious rollback — "save the whole list before the request, put it back if it fails" — would also untick React Native Basics. Yours mustn't.

### Constraints

- The server's courses are **one** state; the in-flight changes are **another** (for example, `Record<number, Status>` of overrides). What's shown — and the heading — is **derived** from both.
- Rolling back removes **that course's** override and nothing else.
- On success, update **only that course** with the server's response.
- In `APPROACH.md`, write down your state shape *before* coding, and say which example forced it.

<details>
<summary>💡 Hint 1</summary>

`const shown = (c: Course) => overrides[c.id] ?? c.status;` — then the checkbox, the heading and "is this row pending?" (`c.id in overrides`) all come from that one line.
</details>

<details>
<summary>💡 Hint 2</summary>

Remove one key without mutating: `setOverrides(({ [id]: _, ...rest }) => rest)` — or copy and `delete` on the copy. Both are functional updates, so two requests finishing at once can't lose each other's changes.
</details>

<details>
<summary>💡 Hint 3</summary>

The messages are a third small state, keyed by id like the overrides. Clear a row's message when its checkbox is clicked, set it when its request fails.
</details>

**✅ Deliverable:** `src/publish/` + 2 screenshots: during Example 4 (both saving), and after it.

---

## Problem 4 — Extend the Course Dashboard

🟠 **Medium+** · parallel requests, 404s, intervals, the Page Visibility API

### Description

Start from the Course Dashboard you built in the README. Add two features.

### Feature A — Instructors

- A nav link **Instructors** → `/instructors`: a table with each instructor's **name** (a link), **email**, **courses** and **students** (the sum over their courses).
- `/instructors/:id`: the instructor's name and email, then their courses — **most students first** — each linking to its course page, and a total: `4 courses · 619 students`.
- An unknown id shows `Instructor not found` — never "0 courses".
- On the course detail page, the instructor's name becomes a link to their page.
- Every page shows the README's loading and error states (Section 1.2).

### Feature B — A Live Dashboard

- Under the stats: `Updated 14:05:09` — the local time of the last **successful** stats load — and a **Refresh** button that reads `Refreshing…` and is disabled while a load is in flight.
- The stats reload by themselves **every 30 seconds** — but **only while the tab is visible**. While the tab is hidden, no requests are made at all.
- When the tab becomes visible again, the 30-second clock **restarts** from that moment — and if the last successful load is **30 seconds old or more**, it also reloads straight away.
- Leaving the dashboard page stops the reloading.
- A failed reload **keeps the old numbers** and shows the error with Try again.

### Examples

Fresh server.

| # | URL / action | Expected |
|---|---|---|
| 1 | `/instructors` | Mona Hassan 3 courses / 540 students · Omar Khaled 4 / 619 · Salma Adel 4 / 345 · Youssef Nabil 3 / 599 |
| 2 | `/instructors/2` | Omar Khaled · React From Zero · CSS Layout Mastery · Advanced React Patterns · Next.js Full-Stack · `4 courses · 619 students` |
| 3 | `/instructors/99` and `/instructors/abc` | `Instructor not found` |
| 4 | `/instructors/2` with the server log visible | The instructor request and the courses request start **together** — neither waits for the other |
| 5 | Open `/courses/5`, click the instructor's name | `/instructors/3`, Salma Adel |
| 6 | Open `/`, wait 65 seconds | The log shows `GET /api/stats` at about 0, 30 and 60 s; the `Updated` time changes each time |
| 7 | Open `/`, switch to another tab for 2 minutes, come back | **No** stats requests while hidden; one immediately on return |
| 8 | Open `/`, switch away for 5 seconds, come back | **No** request on return — the next one comes 30 s **after you came back** |
| 9 | Open `/`, go to `/courses`, wait a minute | No more `GET /api/stats` in the log |
| 10 | Open `/`, stop the API, wait for the next reload | The old numbers stay, with the error and Try again; `Updated` keeps the last good time |

### Constraints

- Feature A's requests run **in parallel** (Example 4) — no request waits for another one's answer unless it needs data from it.
- The instructor page derives everything from two responses — no counting in a `useEffect`.
- You may add **one** field to `useQuery`'s result (e.g. when the data last arrived). If you do, say why in `FEATURE.md`.
- Every interval and every `visibilitychange` listener is cleaned up — Example 9 and Strict Mode prove it.
- `FEATURE.md`: one sentence each — why must Example 3 not say "0 courses", and how do you know the tab is hidden?
- `tsc -b`, `npm run lint` and `npm run build` all pass.

<details>
<summary>💡 Hint 1</summary>

Two `useQuery` calls in the same component **are** parallel requests: `/api/instructors/2` and `/api/courses?instructor=2&sort=students&limit=50`. Decide the screen by looking at the instructor's result first: a 404 there means "not found", whatever the courses request says.
</details>

<details>
<summary>💡 Hint 2</summary>

`document.visibilityState` is `"visible"` or `"hidden"`, and `document` fires `visibilitychange` when it changes. One effect can own both the interval and the listener: start the interval when visible, clear it when hidden, and on becoming visible compare "now" with the last successful load.
</details>

<details>
<summary>💡 Hint 3</summary>

The effect needs `reload` and the last-loaded time — but you don't want it to restart every render. Ask what it *really* depends on: if `reload` were stable (`useCallback` inside `useQuery`), and the time came in as a value, which dependencies are left — and are they fine?
</details>

**✅ Deliverable:** updated `course-dashboard/` + `FEATURE.md` + 2 screenshots: `/instructors/2`, and the server log for Example 7.

---

## Ship It

### Repo

```
your-repo/
└── day-10/
    ├── NOTES.md
    ├── predictions.md
    ├── APPROACH.md
    ├── day-10-problems/     ← Problems 1–3
    └── course-dashboard/    ← README + Problem 4
```

- All work on a `feature/day-10` branch, with clear commit messages, merged through a **pull request**.
- `node_modules` and `dist` are **not** committed.

### `day-10/NOTES.md` — four short answers, in your own words

1. **Server state vs client state** — one example of each from today, and one way they behave differently.
2. **Late answers** — how your code makes sure an old response can never overwrite a newer one.
3. **Optimistic or pessimistic?** — one action from today that should be each, and why.
4. **One real bug** you hit: the exact error or symptom, how you found it, the fix.

### LinkedIn

A short post about Day 10 with a screenshot of your dashboard (or two terminals: the API's log next to the app), your repo link, and **one concrete thing that clicked**.

**✅ Deliverable:** repo link + merged PR link + LinkedIn post link.

---

## Bonus (Optional) — Challenge Problems

<details>
<summary>⭐ Challenge 1 — TanStack Query</summary>

Install `@tanstack/react-query` and move the **Courses** page to `useQuery` from the library (with `placeholderData: keepPreviousData`). Then make **Publish** on the detail page invalidate the course and the stats. Write in `NOTES.md` three things the library did that your hook doesn't.
</details>

<details>
<summary>⭐ Challenge 2 — Infinite Scroll</summary>

Replace Problem 2's button with an `IntersectionObserver` on a sentinel at the end of the list — keeping every Problem 2 example working (Try again included). Clean the observer up.
</details>

<details>
<summary>⭐ Challenge 3 — Retry With Backoff</summary>

Give `useQuery` an optional `retries` count: a failed `GET` with a `network`, `timeout` or `5xx` error retries after 500 ms, then 1 s, then 2 s — and **never** on a 4xx. Prove it against `npm run api:chaos` with the server log.
</details>

<details>
<summary>⭐ Challenge 4 — `useOptimistic`</summary>

Rewrite Problem 3 with React 19's `useOptimistic` and an Action. Every Problem 3 example must still pass — especially Example 4.
</details>

---

## How This Is Graded

| Level | What it looks like |
|---|---|
| ❌ **Incomplete** | An example that doesn't match its expected output, approach written after the code, copy-pasted code, a response used without a type guard, a request without an abort, a late response that can overwrite a newer one, a mutation inside an effect, a whole-list rollback, a loading state that hides an error, a timer or listener without cleanup, `any` or `@ts-ignore`, `node_modules` committed, no merged PR, or code you can't explain line by line |
| ✅ **Done** | Warm-up done honestly · Problems 1–4 pass **every** example · `APPROACH.md` written before each problem · notes in your own words · a merged PR |
| 🔥 **10%** | Done + the challenge problems + notes someone else could learn from |

---

## A Reminder

> **90%** study only — free, self-paced, no assignments turned in.
> **10%** study + assignments + more — I personally help this group get there.
>
> **If you show up for the 10%, I show up for you.**

The next session is **Node.js Intro + Express.js** — and from then on, the server is yours to write. Come with the Course Dashboard working and your PR merged.

---

← Back to [Day 10 README](README.md)
