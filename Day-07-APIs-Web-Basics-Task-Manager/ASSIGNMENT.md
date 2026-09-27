# Day 07 — Assignment

**Track 1 · Day 7 · APIs, Web Basics + Project: Task Manager**

> Six days of foundations, one app. Today you call real APIs, handle every way a request can fail,
> build an interface with semantic HTML, Grid and Flexbox — and ship a **Task Manager** that talks to its own REST API,
> shares its types and validation with the server, and survives a flaky network.
> Then you add a feature of your own, through every layer, and close Track 1.

**⏱ Budget:** 14–16 hours · **📅 Duration:** 6 days · **🚩 Deadline:** before the next session

| # | Task | Part | Deliverable |
|---|---|---|---|
| 1 | Predict, then run | 1–3 | `predictions.md` + 1 screenshot |
| 2 | HTTP & `fetch` lab — a real public API | 1 | `github-lab.ts` + 1 screenshot |
| 3 | CRUD lab — the Task API by hand | 1 | `crud-lab.ts` + `curl.md` + 1 screenshot |
| 4 | Failure lab — every way it breaks | 2 | `failures-lab.ts` + 1 screenshot |
| 5 | The typed client | 2 | `http.ts` + `api.ts` + `smoke.ts` + 1 screenshot |
| 6 | HTML — structure and accessibility | 3 | `index.html` + `layout-lab.html` + 1 screenshot |
| 7 | CSS — Grid, Flexbox, responsive, dark mode | 3 | `styles.css` + 3 screenshots |
| 8 | Build: the Task Manager | 4 | `main.ts` + 2 screenshots |
| 9 | Your feature, through every layer | 4 | code + `FEATURE.md` + 1 screenshot |
| 10 | Break it — and prove it survives | 2 + 4 | `BREAK-IT.md` + 5 screenshots |
| 11 | Notes, repo, PR — and a Track 1 retrospective | — | `NOTES.md` + repo link + merged PR link |
| 12 | Share it | — | LinkedIn post link |

> **Type every line by hand. Do not copy-paste.** The **one** exception is `src/server/server.ts` from README Step 3 — you may copy it. You'll write your own servers in Track 2.

> **Work on a branch** (`feature/day-07`), run `npm run check` before every commit, and keep **`npm run api`** running in its own terminal while you work.

> **No `any`**, no `innerHTML` with data, no `<div>` buttons. Anywhere.

---

## Task 1 — Predict, Then Run

Twenty-one snippets. **#1–#18** are TypeScript files for Node — put each in `day-07/predictions/pNN.ts`, with a copy of your lab `tsconfig.json` in that folder (like Day 06), and add `"predictions"` to the lab config's `exclude`. **#19–#21** are HTML files — open them in the browser with the DevTools console open.

**Before running #1–#18:** stop the Task API, delete `project/data/`, and start it again — so everyone starts from the same three seed tasks. Run the snippets **in order**; some change the data.

### 1.1 — Write Your Predictions First

- [ ] Create `predictions.md`
- [ ] For **each** snippet, write the exact output, or the exact error name — **before running anything**
- [ ] For **#16** and **#18**, also predict: does `npx tsc -p predictions` accept it?

```ts
// p01
const res = await fetch("http://localhost:3000/api/tasks/999");
console.log(res.ok, res.status);

// p02
try {
  const res = await fetch("http://localhost:3000/api/tasks/999");
  console.log("no throw", res.status);
} catch {
  console.log("threw");
}

// p03
try {
  await fetch("http://localhost:3999/api/tasks");
  console.log("ok");
} catch (err) {
  console.log(err instanceof Error ? err.name : "?");
}

// p04
const res = await fetch("http://localhost:3000/api/tasks/1");
const a: unknown = await res.json();
const b: unknown = await res.json();
console.log(a, b);

// p05
const pending = fetch("http://localhost:3000/api/tasks");
console.log(pending instanceof Promise);
const res = await pending;
console.log(typeof res.json, Array.isArray(res));

// p06
const res = await fetch("http://localhost:3000/api/tasks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "  Trim me  " }),
});
const task = (await res.json()) as { title: string; priority: string; done: boolean };
console.log(res.status, JSON.stringify(task.title), task.priority, task.done);

// p07
const url = "http://localhost:3000/api/tasks/3";
const first = await fetch(url, { method: "DELETE" });
const second = await fetch(url, { method: "DELETE" });
console.log(first.status, second.status);

// p08
const res = await fetch("http://localhost:3000/api/tasks/1", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ done: "yes" }),
});
console.log(res.status, await res.text());

// p09
const res = await fetch("http://localhost:3000/api/tasks/1", { method: "PUT" });
console.log(res.status, res.statusText);

// p10
const res = await fetch("http://localhost:3000/");
console.log(res.status, res.headers.get("content-type"));
const data: unknown = await res.json();
console.log(data);

// p11
const u = new URL("https://example.com/search");
u.searchParams.set("q", "tom & jerry");
u.searchParams.set("page", "2");
console.log(u.search);
console.log(new URL("/api/tasks?q=a%20b", "http://localhost:3000").searchParams.get("q"));

// p12
console.log("start");
fetch("http://localhost:3000/api/tasks").then(() => console.log("response"));
setTimeout(() => console.log("timer"), 0);
Promise.resolve().then(() => console.log("microtask"));
console.log("end");

// p13
const controller = new AbortController();
controller.abort();
const outcome = await fetch("http://localhost:3000/api/tasks", { signal: controller.signal })
  .then((res) => `status ${res.status}`)
  .catch((err: Error) => err.name);
console.log(outcome);

// p14
const results = await Promise.all([
  fetch("http://localhost:3000/api/tasks/1"),
  fetch("http://localhost:3000/api/tasks/999"),
]);
console.log(results.map((r) => r.status));

// p15
const results = await Promise.allSettled([
  fetch("http://localhost:3000/api/tasks/1"),
  fetch("http://localhost:3999/api/tasks/1"),
]);
console.log(results.map((r) => r.status));

// p16
const res = await fetch("http://localhost:3000/api/tasks", {
  method: "POST",
  body: { title: "Object body" },
});
console.log(res.status);

// p17
const res = await fetch("http://localhost:3000/api/tasks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Hi", priority: "urgent" }),
});
const body = (await res.json()) as { error: string };
console.log(res.status, body.error);

// p18
const res = await fetch("http://localhost:3000/api/tasks/1");
const data = await res.json();
console.log(data.titel.toUpperCase());
```

```html
<!-- p19.html -->
<!DOCTYPE html>
<div id="box"></div>
<script>
  const box = document.getElementById("box");
  box.textContent = "<b>bold?</b>";
  console.log(box.children.length, box.innerHTML);
  box.innerHTML = "<b>bold?</b>";
  console.log(box.children.length, box.textContent);
</script>

<!-- p20.html -->
<!DOCTYPE html>
<form id="f">
  <input name="title" value="Buy milk" />
  <button id="b">Save</button>
</form>
<script>
  const form = document.getElementById("f");
  document.getElementById("b").addEventListener("click", () => console.log("click"));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("submit", new FormData(form).get("title"));
  });
  document.getElementById("b").click();
</script>

<!-- p21.html -->
<!DOCTYPE html>
<ul id="list"><li data-id="7"><button data-action="delete">✕</button></li></ul>
<script>
  const list = document.getElementById("list");
  list.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    console.log("ul heard it from", e.target.tagName, "for task", li.dataset.id, typeof li.dataset.id);
  });
  list.querySelector("li").addEventListener("click", () => console.log("li"));
  list.querySelector("button").click();
</script>
```

### 1.2 — Now Run Them

- [ ] Run every snippet and record the **actual** result next to each prediction
- [ ] For every one you got **wrong**, write one sentence explaining why
- [ ] For **#1, #2, #4, #7, #10, #12, #14 vs #15, #18 and #20** name the mechanism explicitly — these are the ones that cause real bugs
- [ ] For **#16** and **#18**, explain why `tsc` caught one and not the other
- [ ] Screenshot the output

> Getting them wrong is the assignment. Getting them wrong and not explaining why is not.

**✅ Deliverable:** `predictions.md` with predictions, actuals, and explanations + screenshot.

---

## Task 2 — HTTP & `fetch` Lab: A Real Public API

Create `github-lab.ts`, using GitHub's public API. Mind the limit: 60 requests an hour.

### 2.1 — Read

- [ ] Fetch **your own** GitHub user, and print `status`, `ok`, `statusText` and the `content-type` header
- [ ] Print the `x-ratelimit-remaining` header, and explain in a comment what it is
- [ ] A `GitHubUser` interface and an `isGitHubUser` type guard — the JSON is `unknown` until it passes
- [ ] At least one property that can be `null` (like `name` or `bio`), handled with `??`
- [ ] Check `res.ok` **before** reading the body, with a clear error that includes the status

### 2.2 — Query Strings

- [ ] Fetch your repos from `/users/<you>/repos` with `sort=updated` and `per_page=5`, built with `URL` + `searchParams`
- [ ] Print each repo's name, language (or `—`) and stars
- [ ] Search repositories with a query that includes a **space** and a `:` — print the encoded URL, and point out each encoded character in a comment
- [ ] Build one URL by hand with a template literal and a value containing `&`, and show what breaks

### 2.3 — Several at Once

- [ ] Fetch **three** users in parallel with `Promise.all` + `map`, and print them in the order you asked
- [ ] Include one username that doesn't exist, and show how you report it **without** losing the other two

**✅ Deliverable:** `github-lab.ts` + screenshot of the output.

---

## Task 3 — CRUD Lab: The Task API by Hand

Set up `day-07/project/` with README Step 3 — `package.json`, `tsconfig.json`, `src/shared/`, and `src/server/server.ts` — and start it with `npm run api`.

### 3.1 — `curl.md` — The Terminal

- [ ] `data/` and `dist/` are in `.gitignore`
- [ ] Record one `curl` command and its output for **each** of: GET all, GET one, POST, PATCH, DELETE
- [ ] Use `curl -i` at least once, and label the status line and two headers in the output
- [ ] Trigger and record a `400` (invalid body), a `400` (broken JSON), a `404` (missing task), a `404` (unknown route) and a `405` (wrong method)
- [ ] Next to each error, write whether it's the **client's** fault or the **server's**, and why

### 3.2 — `crud-lab.ts` — `fetch`

- [ ] Create, read, update and delete a task with plain `fetch` — no helper library
- [ ] Every write sends `Content-Type: application/json` and a `JSON.stringify`'d body
- [ ] Check `res.ok` after **every** call, and print the server's `{ error }` message when it fails
- [ ] Type the created task with the `Task` interface from `src/shared/types.ts` (`import type`), after checking it with `isTask`
- [ ] PATCH **two** fields in one call, and prove the third field didn't change
- [ ] Handle the `204` from DELETE without calling `res.json()`
- [ ] Create **three** tasks in parallel with `Promise.all`, then delete all three in parallel

### 3.3 — The Network Tab

- [ ] Open `http://localhost:3000/api/tasks` in the browser, open DevTools → Network, reload, and screenshot the request's **Headers** and **Response**
- [ ] In the console, run one `fetch` POST, and screenshot its **Payload** in the Network tab

**✅ Deliverable:** `curl.md` + `crud-lab.ts` + screenshot.

---

## Task 4 — Failure Lab: Every Way It Breaks

Create `failures-lab.ts`, using a small `attempt(label, fn)` helper like README Step 4.

### 4.1 — Cause Every Failure

- [ ] **Network:** a wrong port, and a host that doesn't exist — print `err.name` and `err.cause.code`
- [ ] **HTTP 4xx:** a `404` and a `400`, each reported with the server's own message
- [ ] **HTTP 5xx:** restart the API with `FAIL_RATE=1`, run a request, and record the `500`
- [ ] **Parse:** call `res.json()` on a response that isn't JSON
- [ ] **Shape:** fetch valid JSON that fails your `isTask` guard (hint: `/api/tasks` is an array)
- [ ] **Timeout:** restart the API with `SLOW=3000`, and time out a request with `AbortSignal.timeout(1000)`
- [ ] **Abort:** start a request and cancel it with an `AbortController`
- [ ] **Stale:** start two loads of `/api/tasks` in a row with `SLOW` on, cancel the first when the second starts, and prove only the second one's result is used

### 4.2 — Classify

- [ ] At the top of the file, a comment table: each failure, which **layer** it's in (network / HTTP / data), whether `fetch` **rejects or resolves**, and whether it's **safe to retry**
- [ ] One sentence: why does `res.ok` need checking even inside a `try` / `catch`?

**✅ Deliverable:** `failures-lab.ts` + screenshot of the full output.

---

## Task 5 — The Typed Client

In `project/src/client/`, type README Step 5 — then extend it.

### 5.1 — `http.ts`

- [ ] `ApiError` as a discriminated union of **six** kinds, and `Result<T>`
- [ ] `request<T>()` checks the three layers **in order**, and every exit returns a `Result` — nothing throws
- [ ] Reads the server's `{ error }` message on a non-ok response, with a fallback when the body isn't JSON
- [ ] A timeout with `AbortSignal.timeout`, combined with the caller's signal using `AbortSignal.any`
- [ ] Handles `204` without parsing
- [ ] `describeError` is an exhaustive `switch` — add a seventh kind temporarily and screenshot the error that forces you to handle it

### 5.2 — `api.ts`

- [ ] `listTasks`, `createTask`, `updateTask`, `deleteTask` — plus **`getTask(id)`**, which isn't in the README
- [ ] Each one passes the right type guard, and hovers as the right `Promise<Result<…>>`
- [ ] It's the **only** file in `client/` that contains `/api`

### 5.3 — Retry, Safely

- [ ] Add `requestWithRetry<T>()` (or a `retries` option) that retries **only** `network`, `timeout` and `5xx` — never `4xx`, `parse` or `shape`
- [ ] It retries only `GET` requests, with a growing delay between attempts
- [ ] `listTasks` uses it; `createTask` does **not** — and a comment explains why

### 5.4 — `smoke.ts`

- [ ] Exercises all five API functions, including one `404` and two different `400`s
- [ ] Run it against a normal server, a `FAIL_RATE=0.5` server (showing retries), and a stopped server — screenshot all three
- [ ] `npm run check` is clean

**✅ Deliverable:** `http.ts` + `api.ts` + `smoke.ts` + screenshot.

---

## Task 6 — HTML: Structure and Accessibility

### 6.1 — `index.html`

- [ ] Type README Step 6, then check every item below yourself
- [ ] `<header>`, **one** `<main>`, `<section>`s labelled with `aria-labelledby`, `<footer>`
- [ ] Headings in order: one `<h1>`, then `<h2>`s — no skipped levels
- [ ] Every input and select has a `<label for>` or an `aria-label`
- [ ] The only `type="submit"` button is inside the form; every other button is `type="button"`
- [ ] The status line has `role="status"` / `aria-live`, and the form error has `role="alert"`
- [ ] The `<meta name="viewport">` tag is present
- [ ] Open the page with **CSS disabled** (DevTools → Rendering, or just before Step 7) and screenshot it — it should still read as a sensible document

### 6.2 — `layout-lab.html` — A Page Without JavaScript

A separate static page — an "About this project" page for your Task Manager.

- [ ] Uses `<header>`, `<nav>` (with at least two links, one back to the app), `<main>`, at least one `<article>` and a `<footer>`
- [ ] A small **contact form** with at least three fields of different `type`s (`email`, `text`, a `<select>` or `<textarea>`), all labelled, and a submit button
- [ ] A **card grid** of at least six cards (features, or the Day 01–07 topics), using `repeat(auto-fill, minmax(…, 1fr))` — no media query needed
- [ ] Linked from the app's footer

### 6.3 — Audit

- [ ] Run **Lighthouse** (DevTools → Lighthouse → Accessibility) on both pages, fix what it finds, and screenshot the final score
- [ ] Do a full pass of the app with **only the keyboard** — every action reachable with `Tab` / `Enter` / `Space` — and note anything you had to fix

**✅ Deliverable:** `index.html` + `layout-lab.html` + Lighthouse screenshot.

---

## Task 7 — CSS: Grid, Flexbox, Responsive, Dark Mode

### 7.1 — `styles.css`

- [ ] **Tokens:** every colour and the radius / spacing are custom properties on `:root` — no raw colour values anywhere else
- [ ] **Reset:** `box-sizing: border-box` on everything, and form controls inherit the font
- [ ] **Grid** for the page layout, one column on phones and two from a breakpoint you choose
- [ ] **Flexbox** for the task rows, the toolbar and the list header, with `gap` — no margins between siblings
- [ ] The toolbar **wraps** on a narrow screen instead of overflowing
- [ ] Priority shown with `[data-priority]` attribute selectors
- [ ] Done tasks and pending tasks each have a distinct style
- [ ] A visible `:focus-visible` style
- [ ] **Dark mode** by redefining the tokens inside `@media (prefers-color-scheme: dark)`

### 7.2 — Make It Yours

- [ ] Change the design — at least a new colour palette, a different font stack and one layout decision of your own — while keeping every item in 7.1 true
- [ ] Check text contrast in **both** themes with DevTools (inspect a text element → the contrast ratio in the colour picker), and fix anything below 4.5:1

### 7.3 — Prove It

- [ ] Screenshot the app at **phone** width (DevTools device toolbar), at **desktop** width, and in **dark mode**
- [ ] In a comment at the top of `styles.css`, name every place you used Grid and every place you used Flexbox, and why

**✅ Deliverable:** `styles.css` + 3 screenshots.

---

## Task 8 — Build: The Task Manager

Type README Step 8's `main.ts`, get it working, then make sure every item below is true of **your** version.

### 8.1 — State and Render

- [ ] **One** `state` object holds everything the page shows, with a `View` discriminated union for loading / failed / ready
- [ ] Every change goes through `setState`, which never mutates and always calls `render()`
- [ ] `render()` builds the list with `createElement` + `textContent` only — search your file: **no** `innerHTML`
- [ ] The status line is an exhaustive `switch` over `view.status`
- [ ] Keyboard focus survives a re-render (tick a task with `Space` — focus stays on it)

### 8.2 — Features

- [ ] **Load** on start, with a loading message, and a **Try again** button when it fails
- [ ] **Add** with `FormData` + the **shared** `validateNewTask` — an invalid title shows an error without sending a request
- [ ] The Add button is disabled during the request, and re-enabled in `finally`
- [ ] **Toggle** done — **optimistic**, with rollback and a message on failure
- [ ] **Change priority** — pessimistic, with the row marked as pending while it waits
- [ ] **Delete**, treating a `404` as already deleted
- [ ] **Filter** (all / active / done) with `aria-pressed` on the active button
- [ ] **Search** that filters as you type
- [ ] **Clear completed** — parallel deletes, and one message saying how many succeeded and failed
- [ ] Counts of active and done tasks
- [ ] A friendly empty state, and a different one when a filter matches nothing
- [ ] **Event delegation:** one listener on the list handles every task's controls

### 8.3 — Prove It

- [ ] `npm run check` clean, `npm run build`, and the app works at `http://localhost:3000`
- [ ] Reload the page — every change is still there. Open `data/tasks.json` and find your tasks
- [ ] Screenshot the app with at least six tasks across all three priorities, some done, with the DevTools **Network** tab showing a `PATCH`
- [ ] Screenshot `npm run check` + the server terminal log

**✅ Deliverable:** `main.ts` + 2 screenshots.

---

## Task 9 — Your Feature, Through Every Layer

The real test of an architecture: add something, and see how many places change. Add **both** of these:

### 9.1 — Edit a Title

- [ ] An **Edit** button (or double-click) on each task turns its title into a text input
- [ ] `Enter` saves with `PATCH { title }`, `Escape` cancels, and leaving the field saves
- [ ] Uses the shared validation — an empty or 121-character title shows an error and keeps the input open
- [ ] The edit mode lives in **state** (`editingId`), not in the DOM
- [ ] Fully keyboard-accessible, with a label

### 9.2 — A New Field

Add **one** new field to `Task`: a **due date**, **tags**, or **notes** — your choice.

- [ ] Added to `Task`, `NewTask` and `TaskUpdate` in `shared/types.ts`
- [ ] Validated in `shared/validate.ts` — at least one real rule (a valid date, max 3 tags, max length…) — and `isTask` updated
- [ ] The server needed **no** new route — note in `FEATURE.md` whether `server.ts` needed any change at all
- [ ] Old tasks in `data/tasks.json` without the field still load — decide: optional, or a default?
- [ ] Shown in each task row, settable when adding, and changeable afterwards
- [ ] One more thing it enables: sort by due date, filter by tag, or search inside notes
- [ ] Tested with `curl`: one valid and one invalid request with the new field

### 9.3 — `FEATURE.md`

- [ ] Every file you changed for each feature, with one line on why
- [ ] The first `npm run check` error list after changing `types.ts` — how TypeScript led you to every place that needed updating
- [ ] One paragraph: what the `shared/` folder saved you, compared to validating separately on each side

**✅ Deliverable:** the code + `FEATURE.md` + a screenshot of both features in use.

---

## Task 10 — Break It, and Prove It Survives

Follow README Step 9 on **your** app. For each test, record in `BREAK-IT.md`: how you caused it, what the user saw, a screenshot, and one sentence on **which line of your code** handled it.

- [ ] **`FAIL_RATE=0.5`** — a failed load with **Try again**, a toggle that rolled back, and a partial **Clear completed**
- [ ] **`SLOW=3000`** — the loading state, and proof a double-click on **Add** creates only **one** task
- [ ] **`SLOW=6000`** — the timeout message
- [ ] **Server stopped** — a failed action, then recovery with **Try again** after restarting
- [ ] **XSS** — a task titled `<img src=x onerror="alert('hacked')">` shown as harmless text; then (temporarily) switch to `innerHTML`, screenshot the alert, and switch back
- [ ] **Stale load** — add a **Reload** button (`type="button"`) to the toolbar that calls `loadTasks`. With `SLOW=2000`, click it twice quickly, and show in the Network tab that the first request was **cancelled** and the page shows the second one's result
- [ ] **Bad data** — temporarily change `server.ts` to send `"done": "yes"` for one task, and show your app reports a shape error instead of breaking — then change it back

**✅ Deliverable:** `BREAK-IT.md` + at least 5 screenshots.

---

## Task 11 — Notes, Repo, PR — and a Track 1 Retrospective

### 11.1 — Repo Structure

- [ ] Your repo now looks like this:

```
javascript-everywhere/
├── .gitignore               ← node_modules/, dist/, data/, .env
├── README.md
├── day-01/ … day-06/
└── day-07/
    ├── NOTES.md
    ├── RETRO.md
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── predictions.md
    ├── predictions/
    ├── first-fetch.ts, search.ts, crud.ts, failures.ts
    ├── github-lab.ts
    ├── crud-lab.ts
    ├── curl.md
    ├── failures-lab.ts
    └── project/
        ├── package.json
        ├── package-lock.json
        ├── tsconfig.json
        ├── index.html
        ├── layout-lab.html
        ├── styles.css
        ├── FEATURE.md
        ├── BREAK-IT.md
        └── src/
            ├── shared/
            ├── server/
            ├── client/
            └── scripts/
```

- [ ] Add a Day 07 row to your root `README.md` table of contents
- [ ] Add a `project/README.md` for the Task Manager: what it is, a screenshot, and exactly how to run it (`npm install`, `npm run build`, `npm run api`)

### 11.2 — `day-07/NOTES.md`

**In your own words** — not the README's words.

**Part 1 — HTTP & `fetch`:**

- [ ] The request/response cycle, with your own drawing
- [ ] Every part of a URL, and why `URLSearchParams` beats string gluing
- [ ] The CRUD ↔ method ↔ status code table, from memory
- [ ] 4xx vs 5xx — whose fault, and whether to retry
- [ ] Why `fetch` resolves on a 404

**Part 2 — Calling APIs Properly:**

- [ ] The three layers of failure, with a real example of each from Task 4
- [ ] Timeout vs abort, and what a "stale response" is
- [ ] Why `request<T>()` returns a `Result` instead of throwing
- [ ] What CORS is, who enforces it, and why today's app didn't hit it
- [ ] Why secrets never go in frontend code

**Part 3 — Web Basics:**

- [ ] Five semantic elements and what each one gives you for free
- [ ] Why forms use the `submit` event, `preventDefault` and `FormData`
- [ ] Flexbox vs Grid — when you reach for each
- [ ] `textContent` vs `innerHTML`, and what XSS is
- [ ] Event delegation, and why it works (bubbling)
- [ ] The state → render → events loop

**Part 4 — The Project:**

- [ ] The architecture: what each layer knows, and what it doesn't
- [ ] Optimistic vs pessimistic — which you used where, and why
- [ ] What `shared/` gives you — with your Task 9 as the example

**Everything:**

- [ ] **One bug you hit**, the exact error message or wrong behaviour, and how you fixed it

> The bug section is not optional. If nothing broke, you copy-pasted.

### 11.3 — `day-07/RETRO.md` — Track 1 Retrospective

- [ ] The **three** ideas from Days 01–07 you'd teach a friend first, and why
- [ ] The day that was hardest, and what finally made it click
- [ ] One piece of code from Day 02 or 03 you'd now write differently — show before and after
- [ ] What you want to be able to build by the end of Track 2

### 11.4 — Commits and PR

- [ ] At least **eight** commits on `feature/day-07`, each one logical change with an imperative message
- [ ] `node_modules/`, `dist/` and `data/` are **not** in your repo — search GitHub to prove it
- [ ] Opened a PR with **What / Why / How to test**, where How to test lists `npm install`, `npm run build`, `npm run api`, `npm run smoke`
- [ ] Left yourself one review comment on a line in **Files changed**
- [ ] Merged it, deleted the branch on GitHub, then `git pull` and `git branch -d` locally
- [ ] Run `git log --oneline --graph -20` and screenshot it

**✅ Deliverable:** repo link + merged PR link + `git log` screenshot.

---

## Task 12 — Share It

- [ ] Post on **LinkedIn** about completing **Track 1** of JavaScript Everywhere
- [ ] Include a short **screen recording** or GIF of your Task Manager — adding, ticking, filtering, and one failure being handled
- [ ] Include the link to your repo **and** your merged pull request
- [ ] Name the feature you added in Task 9, and one thing you had to change to add it
- [ ] Say one concrete thing you understood that you didn't before — why `fetch` doesn't throw on a 404, what an optimistic update is, why `innerHTML` is dangerous, how one validation file runs on both ends. Not "excited to continue my journey".

**✅ Deliverable:** the link to your post.

---

## Bonus (Optional)

- [ ] Replace the Clear-completed `Promise.all` with a real **bulk** endpoint — add `DELETE /api/tasks?done=true` to `server.ts`, and use it
- [ ] **Undo delete:** after deleting, show "Deleted — Undo" for 5 seconds, and re-create the task if clicked
- [ ] **Drag to reorder** tasks, with an `order` field saved through the API
- [ ] **Search-as-you-type on the server:** add `?q=` support to `GET /api/tasks`, debounce the input by 300ms, and cancel stale requests with `AbortController`
- [ ] **Offline mode:** keep a copy of the last loaded tasks in `localStorage`, show them with an "offline" banner when the load fails, and listen for the `online` event to reload
- [ ] A **theme toggle** button (light / dark / system) that overrides `prefers-color-scheme`, remembered in `localStorage`
- [ ] Show relative dates — "created 3 hours ago" — with `Intl.RelativeTimeFormat`, no library
- [ ] A **Playwright** or plain-script test that starts the server, adds a task through the API, and checks `data/tasks.json`
- [ ] A GitHub **Actions** workflow that runs `npm ci`, `npm run check` and the smoke test against a started server
- [ ] Open a pull request on a classmate's Task Manager with one real accessibility or error-handling fix

---

## Submission Checklist

- [ ] **Task 1** — `predictions.md` with wrong answers explained + screenshot
- [ ] **Task 2** — `github-lab.ts` + screenshot
- [ ] **Task 3** — `curl.md` + `crud-lab.ts` + screenshot
- [ ] **Task 4** — `failures-lab.ts` + screenshot
- [ ] **Task 5** — `http.ts` + `api.ts` + `smoke.ts` + screenshot
- [ ] **Task 6** — `index.html` + `layout-lab.html` + Lighthouse screenshot
- [ ] **Task 7** — `styles.css` + phone, desktop and dark-mode screenshots
- [ ] **Task 8** — `main.ts` + 2 screenshots
- [ ] **Task 9** — both features + `FEATURE.md` + screenshot
- [ ] **Task 10** — `BREAK-IT.md` + screenshots
- [ ] **Task 11** — repo link, merged PR link, `NOTES.md`, `RETRO.md`, `git log` screenshot
- [ ] **Task 12** — LinkedIn post link

Submit all links together before the next session.

---

## How This Is Graded

| Level | What it looks like |
|---|---|
| ❌ **Incomplete** | Copy-pasted README code (other than `server.ts`), predictions written after running, a `fetch` with no `res.ok` check, `any` or unchecked `res.json()`, `innerHTML` with task data, `<div>` buttons or unlabelled inputs, no timeout, a button that stays disabled after an error, `data/`, `dist/` or `node_modules/` committed, no merged PR, or code you can't explain line by line |
| ✅ **Done** | All twelve tasks, a typed client that turns every failure into a `Result`, shared validation on both sides, a semantic and keyboard-accessible page, Grid + Flexbox + dark mode, a Task Manager with every feature in 8.2, your own feature through every layer, every failure in Task 10 handled, `NOTES.md` and `RETRO.md` in your own words, a merged PR |
| 🔥 **10%** | Done + the bonus + a project that does something beyond the spec + notes someone else could actually learn from |

---

## A Reminder

> **90%** study only — free, self-paced, no assignments turned in.
> **10%** study + assignments + more — I personally help this group get there.
>
> **If you show up for the 10%, I show up for you.**

**That's Track 1.** The next session starts **Track 2: Full-Stack Web Application** with **React Intro — Components, Props & State, JSX** — the state → render loop you wrote by hand today, done for you. Come with your Task Manager working and your PR merged.

---

← Back to [Day 07 README](README.md)
