# Day 07 — APIs, Web Basics + Project: Task Manager

**Track 1: JS/TS Foundations + Web Basics · Day 7 · four parts · the last day of Track 1**

> Day 06 ended with twenty lines that called GitHub's API with a typed `fetchJson<T>` and got back `⭐ TypeScript: 111232`.
> Today you learn everything underneath those twenty lines — HTTP, `fetch`, and every way a request can fail —
> then you put it together with HTML, CSS and the DOM into a real app: a **Task Manager** that talks to a real API.

**Why this day matters:** almost every app you'll ever build is a screen that talks to a server. React pages, mobile apps, Electron apps, Chrome extensions, AI chatbots — they all send an HTTP request, wait, and deal with whatever comes back. Most real bugs live in the "deal with whatever comes back" part: the slow server, the 500, the `null` field, the double-clicked button. Today you learn to handle all of them — and you ship the project that closes Track 1.

| Part | Topic | Concept | Build |
|---|---|---|---|
| **1** | HTTP & `fetch` — requests, responses, methods, status codes | Sections 1.1–1.8 | Steps 1–3 |
| **2** | Calling APIs Properly — errors, timeouts, a typed client | Sections 2.1–2.6 | Steps 4–5 |
| **3** | Web Basics Recap — semantic HTML, Flexbox, Grid, the DOM | Sections 3.1–3.8 | Steps 6–7 |
| **4** | **Project: Task Manager App** | Sections 4.1–4.4 | Steps 8–10 |

---

## What You'll Have by the End

**Part 1 — HTTP & `fetch`**

- [ ] How a browser and a server talk: requests, responses, and what's inside each
- [ ] Every part of a URL — and building query strings safely with `URLSearchParams`
- [ ] `GET`, `POST`, `PATCH`, `PUT`, `DELETE` — and how they map to Create, Read, Update, Delete
- [ ] Status codes: what `200`, `201`, `204`, `400`, `404`, `500` actually tell you
- [ ] `fetch` for reading **and** writing, with JSON bodies and headers
- [ ] The Network tab and `curl` — seeing every request for yourself

**Part 2 — Calling APIs Properly**

- [ ] The three layers of failure — network, HTTP, data — and why `fetch` only throws for one of them
- [ ] Timeouts and cancelling with `AbortSignal.timeout` and `AbortController`
- [ ] A typed `request<T>()` that turns every failure into a `Result<T>` instead of a crash
- [ ] When retrying is safe, and when it creates duplicates
- [ ] CORS, and why API keys never go in frontend code

**Part 3 — Web Basics Recap**

- [ ] Semantic HTML — the right element for the job, and why it matters
- [ ] Forms done right: labels, `submit`, `preventDefault`, `FormData`
- [ ] CSS foundations: the box model, custom properties, a small reset
- [ ] Flexbox for rows, Grid for layouts — and when to use which
- [ ] Mobile-first responsive design and dark mode
- [ ] The DOM: `textContent` vs `innerHTML`, `dataset`, event delegation, render-from-state
- [ ] An accessibility checklist you'll use on every page from now on

**Part 4 — Project: Task Manager**

- [ ] A full-stack app: TypeScript in the browser, a REST API in Node, shared types and validation
- [ ] Create, read, update and delete tasks, with filters and search
- [ ] Loading, empty, error and retry states — all from one discriminated union
- [ ] An optimistic update that rolls back when the server says no
- [ ] An app you've broken on purpose in five ways, that keeps working

---

# Part 1 — HTTP & `fetch`

## 1 — Concept (60 min)

### 1.1 Client, Server, Request, Response

Every time a web page loads data, two programs have a short conversation:

```
   CLIENT (browser, Node script, phone app)                SERVER (an API)
 ┌────────────────────────────┐    REQUEST     ┌────────────────────────────┐
 │                            │ ─────────────▶ │                            │
 │  fetch("/api/tasks")       │  GET /api/tasks │  finds the tasks           │
 │                            │  Accept: json   │                            │
 │                            │ ◀───────────── │                            │
 │  shows them on the page    │    RESPONSE    │  sends them back           │
 └────────────────────────────┘  200 OK        └────────────────────────────┘
                                 [{…}, {…}]
```

- The **client** always starts. It sends a **request**: *what* it wants (a method and a URL), plus optional **headers** and a **body**.
- The **server** sends back exactly one **response**: a **status code**, headers, and usually a body.
- Then the conversation is over. The server doesn't remember you, and it can't start a new conversation. That's **HTTP**.

An **API** (Application Programming Interface) is a server built for programs rather than people — it answers with data (almost always **JSON**) instead of web pages.

This is also Day 04's event loop, one more time: the request leaves, your code keeps running, and the response arrives later as a Promise that settles.

---

### 1.2 Anatomy of a URL

```
  https://api.github.com:443/search/repositories?q=typescript&per_page=5
  └─┬─┘   └──────┬─────┘ └┬┘ └─────────┬───────┘ └──────────┬──────────┘
 protocol      host      port        path               query string
```

| Part | Meaning |
|---|---|
| **Protocol** | `https` — encrypted. `http` only for `localhost`. |
| **Host** | Which server. `localhost` means *this computer*. |
| **Port** | Which program on that server. Default: 443 for https, 80 for http. Today's API uses **3000**. |
| **Path** | Which *thing* on the server — `/api/tasks`, `/api/tasks/3`. |
| **Query string** | Options after `?`, as `key=value` pairs joined with `&` — filters, search terms, page size. |

APIs name their paths after **resources** — nouns, not verbs:

```
/api/tasks         → the collection of all tasks
/api/tasks/3       → one task, the one with id 3
```

**Never build a query string by gluing strings together.** Spaces, `&`, `:`, `>` and non-English letters all need encoding. Let `URL` do it:

```ts
const url = new URL("https://api.github.com/search/repositories");
url.searchParams.set("q", "language:typescript stars:>50000");
url.searchParams.set("per_page", "5");
url.toString();
// https://api.github.com/search/repositories?q=language%3Atypescript+stars%3A%3E50000&per_page=5
```

---

### 1.3 Methods — What You Want to Do

The **method** says what the request is for. With a resource path, the method turns into Create, Read, Update or Delete — **CRUD**, the four things almost every app does with data:

| Method | CRUD | Example | Body? | Success |
|---|---|---|---|---|
| `GET` | Read | `GET /api/tasks` — all tasks | ❌ | `200 OK` |
| `GET` | Read | `GET /api/tasks/3` — one task | ❌ | `200 OK` |
| `POST` | Create | `POST /api/tasks` + `{ "title": "…" }` | ✅ | `201 Created` + the new task |
| `PATCH` | Update | `PATCH /api/tasks/3` + `{ "done": true }` — only what changes | ✅ | `200 OK` + the updated task |
| `PUT` | Update | `PUT /api/tasks/3` + the **whole** task — replaces it | ✅ | `200 OK` |
| `DELETE` | Delete | `DELETE /api/tasks/3` | ❌ | `204 No Content` |

Notice the pattern: the **path** says *which thing*, the **method** says *what to do with it*. `POST /api/deleteTask?id=3` works, technically — but it's not REST, and every developer who reads it will wince.

Two words you'll hear:

- **Safe** — doesn't change anything. `GET` is safe: call it a thousand times, nothing changes.
- **Idempotent** — doing it twice has the same effect as doing it once. `GET`, `PUT`, `PATCH` (usually) and `DELETE` are. **`POST` is not** — send it twice and you get two tasks. Remember this for retries (2.5).

---

### 1.4 Status Codes — What Happened

Every response starts with a three-digit **status code**. The first digit is the category:

| Range | Meaning | Whose fault |
|---|---|---|
| **2xx** | Success | — |
| **3xx** | Look somewhere else (redirect) | — (`fetch` follows these for you) |
| **4xx** | Your request was wrong | **the client** — you |
| **5xx** | The server broke | **the server** |

The ones you'll meet constantly:

| Code | Name | Means |
|---|---|---|
| `200` | OK | Here's what you asked for |
| `201` | Created | I made the thing — here it is |
| `204` | No Content | Done — and there's nothing to send back |
| `400` | Bad Request | Your data is invalid — usually with a message saying why |
| `401` | Unauthorized | Who are you? Log in first |
| `403` | Forbidden | I know who you are, and you're not allowed |
| `404` | Not Found | No such thing at this path |
| `405` | Method Not Allowed | This path exists, but not with that method |
| `409` | Conflict | That clashes with something that exists (a duplicate email…) |
| `429` | Too Many Requests | Slow down — you hit a rate limit |
| `500` | Internal Server Error | The server crashed or failed |
| `503` | Service Unavailable | The server is down or overloaded — try later |

> **4xx vs 5xx is the most useful split.** A 4xx means *change your request* — retrying the same thing will fail the same way. A 5xx means *the server has a problem* — retrying later might work.

---

### 1.5 Headers and Bodies — JSON Over the Wire

**Headers** are `Name: value` lines of extra information on a request or response:

| Header | On | Says |
|---|---|---|
| `Content-Type: application/json` | request **and** response | "The body I'm sending is JSON" |
| `Accept: application/json` | request | "Please answer in JSON" |
| `Authorization: Bearer <token>` | request | "Here's proof of who I am" (Track 2) |

The **body** is the data itself. HTTP only carries **text**, so objects travel as JSON strings:

```
your object ──JSON.stringify──▶ '{"title":"Learn fetch"}' ── the wire ──▶ JSON.parse ──▶ server's object
```

That's why sending data always needs **two** things — `JSON.stringify` on the body, and a `Content-Type` header saying that's what it is. Forget the header and many servers won't parse your body at all.

---

### 1.6 `fetch` — Reading

```ts
const res = await fetch("https://api.github.com/users/octocat");
```

`fetch` returns a `Promise<Response>` — Day 05. It settles as soon as the response **headers** arrive, so you can check the status before you read the body:

| On a `Response` | Gives you |
|---|---|
| `res.status` | `200`, `404`… |
| `res.ok` | `true` for 200–299, otherwise `false` |
| `res.statusText` | `"OK"`, `"Not Found"`… |
| `res.headers.get("content-type")` | one header |
| `await res.json()` | the body, parsed as JSON — **another Promise** |
| `await res.text()` | the body as a string |

Two rules that catch everyone:

1. **The body can only be read once.** Call `res.json()` then `res.text()` and the second one throws `Body is unusable`.
2. **`res.json()` returns `any`.** Give it `unknown`, and check it with a type guard — Day 06 Part 3.

And the rule that matters most:

> **`fetch` only rejects when there's no response at all** — the network is down, the host doesn't exist, the request was cancelled. **A `404` or a `500` is still a response**, so `fetch` *resolves* — with `res.ok === false`. If you don't check `res.ok`, a 404 page flows into your code as if it were data.

```ts
const res = await fetch(url);
if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
const data: unknown = await res.json();
```

---

### 1.7 `fetch` — Writing

Everything beyond a `GET` goes in a second argument:

```ts
const res = await fetch("http://localhost:3000/api/tasks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Learn fetch", priority: "high" }),
});

console.log(res.status);            // 201
const task: unknown = await res.json();
```

```ts
// Update — send only the fields that change
await fetch(`http://localhost:3000/api/tasks/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ done: true }),
});

// Delete — no body, and a 204 answers with no body either
await fetch(`http://localhost:3000/api/tasks/${id}`, { method: "DELETE" });
```

> **A `204` has no body.** Calling `res.json()` on it throws. Check `res.status === 204` first, or don't read the body of a `DELETE`.

---

### 1.8 Seeing It — the Network Tab and `curl`

You can't debug what you can't see.

**In the browser** — DevTools (`F12`) → **Network** tab → filter by **Fetch/XHR**. Click any request to see its method, URL, status, request headers, the body you sent (**Payload**) and the body that came back (**Response** / **Preview**). When something doesn't work, this is the first place to look: did the request go out? What status came back? What did the server actually say?

**In a terminal** — `curl` sends a request without writing any code:

```bash
curl http://localhost:3000/api/tasks                        # GET
curl -i http://localhost:3000/api/tasks/1                   # -i shows status + headers
curl -X POST http://localhost:3000/api/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"From curl","priority":"low"}'            # POST with a JSON body
curl -X DELETE -i http://localhost:3000/api/tasks/4         # DELETE
```

> **Windows:** run these in **Git Bash** (VS Code terminal → the `+` dropdown → Git Bash). In PowerShell, `curl` is a different command with different options; use `curl.exe` there, and quoting JSON gets painful.

---

# Part 2 — Calling APIs Properly

> Part 1 showed `fetch` when things go right. Part 2 is about everything else — which is most of the work.

## 2 — Concept (50 min)

### 2.1 The Three Layers of Failure

A request can fail in three different places, and `fetch` behaves differently for each:

| Layer | What happened | `fetch` does | You see |
|---|---|---|---|
| **1. Network** | No response at all — server down, wrong port, no internet, DNS failed, CORS blocked | **rejects** | `TypeError: fetch failed` (Node) / `Failed to fetch` (browser) |
| **1b. Timeout / abort** | We stopped waiting | **rejects** | `TimeoutError` / `AbortError` |
| **2. HTTP** | The server answered with 4xx or 5xx | **resolves** — `res.ok` is `false` | nothing, unless you check |
| **3. Data** | A 2xx, but the body isn't JSON, or isn't the shape you expected | `res.json()` **rejects** / guard fails | `SyntaxError: Unexpected token '<'` / `undefined` everywhere |

That last row is Day 06's lesson: a `200 OK` doesn't mean the data is what you think. APIs change, return `null` for missing fields, or send an HTML error page with a 200. The type guard is your last line of defence.

A robust request checks all three, in order:

```ts
let res: Response;
try {
  res = await fetch(url);                         // layer 1
} catch (err) {
  // no response at all
}
if (!res.ok) { /* layer 2: 4xx / 5xx */ }
const data: unknown = await res.json();          // layer 3a: is it JSON?
if (!isTask(data)) { /* layer 3b: is it the right shape? */ }
```

Step 4 makes every one of these happen on purpose.

---

### 2.2 Reading the Error Body

A good API doesn't just say `400` — it says *why*. Today's API answers every error with the same shape:

```json
{ "error": "title is required" }
```

So on a failed response, read the body — carefully, because an error response might not be JSON at all (a proxy's HTML error page, an empty 502):

```ts
async function errorMessage(res: Response): Promise<string> {
  try {
    const body: unknown = await res.json();
    if (typeof body === "object" && body !== null && "error" in body && typeof body.error === "string") {
      return body.error;                   // the server's own message
    }
  } catch {
    // not JSON — fall through
  }
  return res.statusText || `HTTP ${res.status}`;
}
```

Show that message to the user. "title is required" is useful. "Error 400" is not.

---

### 2.3 Timeouts and Cancelling

**`fetch` has no timeout.** A server that never answers leaves your `await` hanging forever — and your "Loading…" spinner with it. Day 05 built `withTimeout` with `Promise.race`, which stopped *waiting* but couldn't stop the *request*. `fetch` supports real cancellation through an **`AbortSignal`**:

```ts
// Give up after 5 seconds — and actually cancel the request
const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
// → rejects with a TimeoutError if it takes longer
```

To cancel **yourself** — the user left the page, typed a new search, pressed Cancel — use an **`AbortController`**:

```ts
const controller = new AbortController();
fetch(url, { signal: controller.signal });
// …later
controller.abort();            // → that fetch rejects with an AbortError
```

The classic use is **stale responses**. The user clicks *Reload* twice; the first request is slow, the second is fast. Without cancelling, the slow first response can arrive **last** and overwrite the newer data. Cancel the old one before starting the new one:

```ts
let controller: AbortController | undefined;

async function load() {
  controller?.abort();                      // cancel the previous load, if any
  controller = new AbortController();
  const res = await fetch("/api/tasks", { signal: controller.signal });
  // …
}
```

Need both — your own cancel **and** a timeout? Combine them: `AbortSignal.any([controller.signal, AbortSignal.timeout(5000)])`.

---

### 2.4 A Typed Client — Every Failure Becomes a Value

Writing those three layers of checks in every function would be Day 04's copy-paste problem all over again. Write them **once**, in a generic `request<T>()`, and make every failure a **value** instead of an exception — Day 06's `Result<T>` with a discriminated union of error kinds:

```ts
export type ApiError =
  | { kind: "network"; message: string }                  // no response at all
  | { kind: "timeout"; message: string }                  // took too long — we gave up
  | { kind: "aborted"; message: string }                  // we cancelled it on purpose
  | { kind: "http"; status: number; message: string }     // a response, but 4xx / 5xx
  | { kind: "parse"; message: string }                    // the body wasn't valid JSON
  | { kind: "shape"; message: string };                   // valid JSON, wrong shape

export type Result<T> = { ok: true; value: T } | { ok: false; error: ApiError };
```

Then every call site looks the same, and TypeScript makes you handle the failure before you touch the value:

```ts
const result = await listTasks();
if (!result.ok) {
  showError(describeError(result.error));   // a readable sentence for any kind
  return;
}
render(result.value);                        // Task[] — checked by a type guard
```

**Why return a `Result` instead of throwing?** A thrown error is invisible in the function's type — nothing reminds you to `catch` it, and Day 05 showed how easily a rejection goes unhandled. A `Result<T>` is right there in the return type. You *can't* reach `.value` without checking `.ok` first. For code that talks to a network — where failure is normal, not exceptional — that's exactly what you want.

Step 5 builds the full `request<T>()` and a four-function API client on top of it.

---

### 2.5 Retrying — Carefully

Day 05's `retry` is useful here — but only for the right failures:

| Failure | Retry? | Why |
|---|---|---|
| `network`, `timeout` | ✅ Yes, with a delay | Might be a blip |
| `http` 500, 502, 503 | ✅ Yes, with a delay | The server might recover |
| `http` 429 | ✅ After waiting (often the `Retry-After` header says how long) | You're going too fast |
| `http` 400, 401, 403, 404, 409 | ❌ Never | The same request will fail the same way |
| `parse`, `shape` | ❌ Never | The server's answer won't change |

And watch the **method**. Retrying a `GET` is harmless. Retrying a **`POST`** that timed out is dangerous: the server may have created the task and only the *response* got lost — retry, and you have two. That's what "not idempotent" means in practice.

In the Task Manager, failed loads get a **Try again** button — the user decides. That's the simplest safe retry there is.

---

### 2.6 CORS, and Where Secrets Go

**CORS** (Cross-Origin Resource Sharing) is a browser rule. A page from one **origin** (protocol + host + port) can only read responses from **another** origin if that server explicitly allows it with an `Access-Control-Allow-Origin` header.

```
page on http://localhost:5500  ──fetch──▶  http://localhost:3000/api/tasks
                                           no Access-Control-Allow-Origin header
         ✗ "blocked by CORS policy"
```

- It's enforced **by the browser**, to protect users. Node, `curl` and servers don't have CORS at all — which is why a request can work in `curl` and fail in the browser.
- The fix is always on the **server** (it adds the header). You can't fix CORS from frontend code.
- Today you avoid it completely: the Task API **also serves the app**, so the page and the API share one origin, `http://localhost:3000`. That's why today's project uses `npm run api` instead of Live Server.

GitHub's API sends `Access-Control-Allow-Origin: *`, so the browser allows calls to it from any page.

**Secrets never go in frontend code.** Everything you ship to a browser — every `.js` file in `dist/` — can be read by anyone with DevTools. An API key in `main.ts` is a public API key. Keys live on a **server**, which calls the other API for you. You'll build exactly that in Track 2, and again in Track 7 for AI APIs.

---

# Part 3 — Web Basics Recap

> You've been writing HTML and wiring up buttons since Day 03. This part fills in the gaps — the foundations a real app's interface stands on.

## 3 — Concept (50 min)

### 3.1 Semantic HTML — Say What It Is

**Semantic** means choosing the element that describes what the content *is*, not how it looks:

| Element | For |
|---|---|
| `<header>` / `<footer>` | The top and bottom of the page (or of a section) |
| `<main>` | The main content — **one** per page |
| `<nav>` | A block of navigation links |
| `<section>` | A themed group with its own heading |
| `<article>` | A self-contained item — a post, a card, a comment |
| `<h1>`–`<h6>` | Headings, in order — one `<h1>`, don't skip levels |
| `<ul>` / `<ol>` + `<li>` | Lists — a list of tasks *is* a list |
| `<button>` | Anything you click that **does** something |
| `<a href>` | Anything you click that **goes** somewhere |
| `<form>`, `<label>`, `<input>`, `<select>` | Anything the user fills in |

```html
<!-- ❌ All divs — works with a mouse, meaningless to everything else -->
<div class="header"><div class="title">Task Manager</div></div>
<div class="btn" onclick="add()">Add</div>

<!-- ✅ Semantic -->
<header><h1>Task Manager</h1></header>
<button type="button">Add</button>
```

Why it matters, even when it looks the same:

- **Keyboard and screen reader users.** A `<button>` can be reached with `Tab` and pressed with `Enter` or `Space`, and is announced as "button". A `<div>` with a click handler is none of those.
- **Free behaviour.** `<form>` submits on `Enter`. `<label>` makes its text clickable. `<a>` can be opened in a new tab.
- **Readable code.** `<main>`, `<nav>` and `<section>` tell the next developer the structure at a glance.

---

### 3.2 Forms Done Right

```html
<form id="task-form" novalidate>
  <label for="title">Title</label>
  <input id="title" name="title" type="text" maxlength="120" />

  <label for="priority">Priority</label>
  <select id="priority" name="priority">…</select>

  <button type="submit">Add task</button>
  <p id="form-error" role="alert"></p>
</form>
```

- **`<label for="title">`** matches the input's **`id`**. Clicking the label focuses the input, and screen readers read the label when the input is focused. A `placeholder` is **not** a label — it disappears as soon as you type.
- **`name`** is the key the value is sent under — `FormData` uses it.
- **`type="submit"`** buttons submit the form — so do `Enter` key presses in any field. **Every other button needs `type="button"`**, or it submits the form too.
- **`novalidate`** turns off the browser's built-in error bubbles, because we'll show our own — using the **same** validation rules the server uses.

Handle the **form's `submit` event**, not the button's `click` — that way `Enter` works too:

```ts
form.addEventListener("submit", (event) => {
  event.preventDefault();                  // stop the browser reloading the page
  const data = new FormData(form);         // every named field
  const title = data.get("title");         // FormDataEntryValue | null
});
```

Without `preventDefault()`, the browser does what forms did in 1995: sends the data and **reloads the page** — and your app and its state are gone.

---

### 3.3 CSS Foundations

**The box model.** Every element is a box: content, then `padding`, then `border`, then `margin`. By default, `width` only measures the content — so `width: 300px` plus padding plus border is wider than 300px. One line fixes that everywhere:

```css
*, *::before, *::after { box-sizing: border-box; }   /* width now includes padding and border */
```

**Custom properties** (CSS variables) — define a value once, use it everywhere:

```css
:root {
  --accent: #2f6fdf;
  --radius: 10px;
}
button { background: var(--accent); border-radius: var(--radius); }
```

Change `--accent` once and every button, link and focus ring follows. Redefine the variables inside a media query and you have dark mode (3.6).

**Which rule wins?** When two rules set the same property: the more **specific** selector wins (`#id` > `.class` > `element`); if equally specific, the **later** one wins. Prefer classes; avoid `#id` selectors and `!important` in CSS, and you'll rarely have to think about it.

**Units:** `px` for borders and small fixed things; `rem` for font sizes (relative to the root font size, so it respects the user's settings); `%`, `fr` and `min()` for layout.

---

### 3.4 Flexbox — One Direction

**Flexbox** lays items out in a **row** (or a column) and decides how they share the space.

```css
.task {
  display: flex;
  align-items: center;       /* cross axis — vertical, for a row */
  gap: 10px;                 /* space between items */
}
.task-title { flex: 1; }     /* take all the leftover space */
```

```
.task  ┌──────────────────────────────────────────────────────┐
       │ ☐  Call the API with fetch  ←── flex: 1 ──→  [high▾] ✕ │
       └──────────────────────────────────────────────────────┘
          main axis ─────────────────────────────────────────▶
```

| Property | On | Does |
|---|---|---|
| `display: flex` | container | turns it on — children become flex items in a row |
| `flex-direction: column` | container | stack instead of row |
| `justify-content` | container | spread along the main axis: `space-between`, `center`, `flex-end` |
| `align-items` | container | line up on the cross axis: `center`, `stretch`, `flex-start` |
| `gap` | container | space between items — no more margin hacks |
| `flex-wrap: wrap` | container | let items move to the next line when there's no room |
| `flex: 1` | item | grow to fill the leftover space |
| `flex: none` | item | never grow or shrink (checkboxes, icons) |

---

### 3.5 Grid — Two Directions

**Grid** lays items out in **rows and columns at the same time**. You describe the columns, and the items flow into them:

```css
.layout {
  display: grid;
  grid-template-columns: 300px 1fr;   /* a fixed sidebar, and the rest */
  gap: 16px;
}
```

- **`fr`** = a *fraction* of the free space. `1fr 2fr` = one third and two thirds.
- **`repeat(3, 1fr)`** = three equal columns.
- **`repeat(auto-fill, minmax(220px, 1fr))`** = as many columns as fit, each at least 220px — a responsive card grid with **no media query**.

| Use | When |
|---|---|
| **Flexbox** | A row or column of things whose size comes from their content — a toolbar, a task row, a nav bar, buttons |
| **Grid** | A layout you design first and fill after — the page, a form, a card gallery |

They nest happily: today's page is **Grid** (form beside list), each task is **Flexbox** (checkbox, title, select, button).

---

### 3.6 Responsive Design — Mobile First

Write the styles for a **narrow** screen first — one column — and **add** layout as the screen gets wider:

```css
.layout {
  display: grid;
  grid-template-columns: 1fr;               /* phones: one column */
}

@media (min-width: 760px) {
  .layout {
    grid-template-columns: 300px 1fr;       /* wider: form beside the list */
  }
}
```

Without `<meta name="viewport" content="width=device-width, initial-scale=1.0">` in the `<head>`, phones pretend to be 980px wide and shrink your page — every page needs it.

The same `@media` idea gives you **dark mode** with no JavaScript — redefine the custom properties:

```css
@media (prefers-color-scheme: dark) {
  :root { --bg: #12151c; --text: #e8ebf1; }
}
```

---

### 3.7 The DOM — Render From State

You've used the DOM since Day 03. A few things matter much more in a real app.

**`textContent` vs `innerHTML`.** Anything a user typed — or anything that came from an API — must go in with **`textContent`**:

```ts
li.textContent = task.title;       // ✅ shown as text, always
li.innerHTML = task.title;         // ❌ parsed as HTML
```

If a task's title is `<img src=x onerror="alert('hacked')">`, `innerHTML` **runs that code** in your page. That's **XSS** (cross-site scripting), and it's how attackers steal logins. Build elements with `document.createElement` + `textContent`, and it can't happen.

**`dataset`** — attach your own data to an element with `data-*` attributes:

```ts
li.dataset.id = "3";               // <li data-id="3">
Number(li.dataset.id);             // 3
```

**Event delegation.** Instead of one listener per task button — which you'd have to add every time the list redraws — put **one** listener on the list, and ask where the event came from:

```ts
list.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest("[data-action='delete']");
  if (!button) return;                                        // clicked something else
  const id = Number(button.closest<HTMLElement>(".task")?.dataset.id);
  removeTask(id);
});
```

Events **bubble**: a click on a button is also a click on its `<li>`, and on the `<ul>`. `closest()` walks up from the clicked element to find what you care about. One listener handles every task, including ones added later.

**Render from state.** Day 05's page changed the DOM in lots of little places. That gets messy fast. Instead:

```
   state (plain data)  ──render()──▶  DOM
        ▲                              │
        └──── event handler ◀── user clicks
```

1. Keep **everything** the page shows in one `state` object.
2. Write **one** `render()` that builds the DOM from `state`.
3. Event handlers never touch the DOM — they change `state` and call `render()`.

The DOM is always a picture of the state, so it can't drift out of sync. This is exactly how React works — which is next session.

---

### 3.8 Accessibility — A Checklist

Accessibility isn't a feature for later. These are cheap now and expensive to retrofit:

- [ ] Every input has a `<label>` (or an `aria-label` when there's no room for visible text)
- [ ] Clickable things are `<button>` or `<a>` — never a `<div>`
- [ ] Every button's `type` is right: `submit` in forms, `button` everywhere else
- [ ] You can use the whole page with **only the keyboard**: `Tab`, `Shift+Tab`, `Enter`, `Space`
- [ ] Focus is visible — `:focus-visible` has an outline, and you never `outline: none` without a replacement
- [ ] Icon-only buttons (`✕`) have an `aria-label` — "Delete Buy milk", not just "✕"
- [ ] Status messages are in an element with `role="status"` (or `aria-live="polite"`) so screen readers announce them
- [ ] Toggle buttons say whether they're on: `aria-pressed="true"`
- [ ] Colour is never the **only** signal — the priority border is also a `<select>` with the word in it
- [ ] Text has enough contrast in **both** light and dark mode

---

# Part 4 — Project: Task Manager App

## 4 — Concept (30 min)

### 4.1 The Architecture

```
 BROWSER                                                  NODE
┌──────────────────────────────────────────┐       ┌───────────────────────────┐
│ index.html + styles.css                  │       │ server/server.ts          │
│                                          │  HTTP │  GET    /api/tasks        │
│ client/main.ts   state → render → events │ ◀───▶ │  POST   /api/tasks        │
│      │                                   │ JSON  │  PATCH  /api/tasks/:id    │
│      ▼                                   │       │  DELETE /api/tasks/:id    │
│ client/api.ts    listTasks, createTask…  │       │  + serves the app files   │
│      │                                   │       │           │               │
│      ▼                                   │       │           ▼               │
│ client/http.ts   request<T>() → Result   │       │     data/tasks.json       │
└──────────────┬───────────────────────────┘       └─────────────┬─────────────┘
               │                                                 │
               └────────────► shared/types.ts ◄──────────────────┘
                              shared/validate.ts
                     (the SAME file, imported by both sides)
```

Each layer only knows about the one below it:

- **`main.ts`** knows about the page and about `api.ts`. It never calls `fetch`.
- **`api.ts`** knows the API's URLs. It never touches the DOM.
- **`http.ts`** knows how to make one careful request. It knows nothing about tasks.
- **`shared/`** is the **contract**: what a `Task` is, and what counts as valid. The browser validates before sending; the server validates what it receives — with the **same function**. Change a rule once, both sides follow.

That's the "Everywhere" in the course name, at full size: one language, one set of types, running on both ends of the wire.

---

### 4.2 The API Contract

| Method | Path | Body | Success | Errors |
|---|---|---|---|---|
| `GET` | `/api/tasks` | — | `200` `Task[]` | — |
| `POST` | `/api/tasks` | `{ title, priority? }` | `201` `Task` | `400` invalid |
| `GET` | `/api/tasks/:id` | — | `200` `Task` | `404` |
| `PATCH` | `/api/tasks/:id` | any of `{ title, done, priority }` | `200` `Task` | `400`, `404` |
| `DELETE` | `/api/tasks/:id` | — | `204` | `404` |

Every error body is `{ "error": "a readable message" }`.

The server has two switches for practising failure, set as environment variables when you start it:

| Variable | Effect |
|---|---|
| `SLOW=3000` | Every API response waits 3 extra seconds |
| `FAIL_RATE=0.3` | 30% of API calls fail with a `500` |

---

### 4.3 State, Render, Events

The whole page is described by one object:

```ts
type View =
  | { status: "loading" }
  | { status: "failed"; message: string }
  | { status: "ready" };

interface State {
  view: View;                     // what the list area is doing
  tasks: Task[];                  // the data, as the server last confirmed it
  filter: "all" | "active" | "done";
  query: string;                  // the search box
  pending: ReadonlySet<number>;   // tasks with a request in flight
  notice: string;                 // the result of the last action
}
```

`View` is a discriminated union — Day 06 — so the page can't be `loading` **and** `failed` at the same time. The status line is an exhaustive `switch` over it.

Every change goes through one function:

```ts
function setState(changes: Partial<State>): void {
  state = { ...state, ...changes };    // a new object — Day 04, never mutate
  render();
}
```

`Partial<State>` — Day 06's utility type — means "any of State's fields". One line, and every change is followed by a redraw.

---

### 4.4 Optimistic vs Pessimistic Updates

When the user ticks a task, you have two choices:

| | **Pessimistic** | **Optimistic** |
|---|---|---|
| **Does** | Wait for the server, *then* show the change | Show the change *now*, send it, undo it if the server says no |
| **Feels** | Laggy on a slow network | Instant |
| **On failure** | Nothing to undo | Must roll back — and tell the user |
| **Use for** | Things that can fail for a *reason* — creating, deleting, anything with validation | Small, very-likely-to-succeed changes — ticking a checkbox, a "like" |

The Task Manager uses **both**: ticking a task is optimistic (Step 8's `toggleTask`), changing priority and deleting are pessimistic. Start the server with `FAIL_RATE=1` in Step 9 and watch the tick jump back.

---

## Build — Follow Along

Create a folder `day-07` in your repo, on a branch: `git switch -c feature/day-07`.

Steps 1–2 use GitHub's public API. Steps 3–10 use **today's Task API**, which runs on your own machine.

### Step 1 — Setup + `first-fetch.ts`

```bash
mkdir day-07
cd day-07
npm init -y
npm install --save-dev typescript @types/node
```

Add `"type": "module"` to `package.json`, and create the same lab `tsconfig.json` as Day 06:

```json
{
  "compilerOptions": {
    "target": "es2023",
    "module": "nodenext",
    "types": ["node"],

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true,
    "skipLibCheck": true
  },
  "exclude": ["project"]
}
```

`first-fetch.ts`:

```ts
// first-fetch.ts — one GET request to a real API, looked at piece by piece

interface GitHubUser {
  login: string;
  name: string | null;           // people can leave their name empty
  public_repos: number;
  followers: number;
  created_at: string;
}

function isGitHubUser(value: unknown): value is GitHubUser {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.login === "string" &&
    (typeof v.name === "string" || v.name === null) &&
    typeof v.public_repos === "number" &&
    typeof v.followers === "number" &&
    typeof v.created_at === "string"
  );
}

const url = "https://api.github.com/users/octocat";

// 1. fetch returns a Promise<Response> — the response HEAD arrives first
const res = await fetch(url);
console.log("status:      ", res.status, res.statusText);
console.log("ok:          ", res.ok);                               // true for 200–299
console.log("content-type:", res.headers.get("content-type"));

// 2. The BODY is read separately — another Promise
const data: unknown = await res.json();

// 3. unknown until checked — Day 06
if (!isGitHubUser(data)) throw new Error("GitHub sent an unexpected shape");

const joined = new Date(data.created_at).getFullYear();
console.log(`\n${data.name ?? data.login} (@${data.login})`);
console.log(`${data.public_repos} public repos · ${data.followers} followers · on GitHub since ${joined}`);
```

```bash
node first-fetch.ts
npx tsc
```

```
status:       200 OK
ok:           true
content-type: application/json; charset=utf-8

The Octocat (@octocat)
8 public repos · 24280 followers · on GitHub since 2011
```

(Your follower count will be different — this is live data.)

Now:

1. Open `https://api.github.com/users/octocat` in your browser. That's the same JSON — an API is just a URL that answers with data.
2. Change the username to your own GitHub account and run it again.
3. Change it to a username that doesn't exist — `octocat-no-such-user-123`. The status is `404`, `ok` is `false`… and the script **still reaches `res.json()`**, gets `{"message":"Not Found",…}`, and the type guard throws `unexpected shape`. The guard saved you — but the real fix is to check `res.ok` first. Add `if (!res.ok) throw new Error(\`GitHub said ${res.status}\`);` right after the fetch.

> **GitHub allows 60 unauthenticated requests per hour** from one internet connection. If you get `403` with `rate limit exceeded`, wait — or move on to Step 3, which uses your own API with no limits.

---

### Step 2 — `search.ts` — Query Strings

```ts
// search.ts — building a URL with query parameters, safely

interface Repo {
  full_name: string;
  stargazers_count: number;
  language: string | null;
}

interface SearchResult {
  total_count: number;
  items: Repo[];
}

function isRepo(value: unknown): value is Repo {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.full_name === "string" && typeof v.stargazers_count === "number" &&
    (typeof v.language === "string" || v.language === null);
}

function isSearchResult(value: unknown): value is SearchResult {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.total_count === "number" && Array.isArray(v.items) && v.items.every(isRepo);
}

// Never glue query strings together by hand — URLSearchParams encodes spaces, ":" and ">" for you
const url = new URL("https://api.github.com/search/repositories");
url.searchParams.set("q", "language:typescript stars:>50000");
url.searchParams.set("sort", "stars");
url.searchParams.set("per_page", "5");

console.log(url.toString());   // look at how the query was encoded

const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
if (!res.ok) throw new Error(`GitHub said ${res.status} ${res.statusText}`);

const data: unknown = await res.json();
if (!isSearchResult(data)) throw new Error("Unexpected response shape");

console.log(`\n${data.total_count} repositories match. Top ${data.items.length}:`);
for (const { full_name, stargazers_count } of data.items) {
  console.log(`  ⭐ ${String(stargazers_count).padStart(7)}  ${full_name}`);
}
```

```bash
node search.ts
```

```
https://api.github.com/search/repositories?q=language%3Atypescript+stars%3A%3E50000&sort=stars&per_page=5

84 repositories match. Top 5:
  ⭐  456312  freeCodeCamp/freeCodeCamp
  ⭐  390622  openclaw/openclaw
  ⭐  368287  nilbuild/developer-roadmap
  ⭐  237270  deepseek-ai/deepseek-harness
  ⭐  212841  vuejs/vue
```

Look at the first line: `:` became `%3A`, `>` became `%3E`, spaces became `+`. That's **URL encoding**, done for you. Then:

1. Change the query to `language:javascript` and `per_page` to `10`.
2. Build the same URL by hand with a template literal — `` `…?q=${q}&per_page=5` `` — using a query with a `&` in it (`q = "tom & jerry"`). Print the URL. The `&` splits your query in two. That's why `URLSearchParams` exists.

---

### Step 3 — The Task API

Now you need an API you control — one that can be slow, fail, and forget things on command. Create the project folder:

```bash
mkdir project
cd project
npm init -y
npm install --save-dev typescript @types/node
mkdir -p src/shared src/server src/client src/scripts
```

```
day-07/project/
├── package.json
├── tsconfig.json
├── index.html                ← Step 6
├── styles.css                ← Step 7
├── data/tasks.json           ← created by the server — never committed
├── dist/                     ← created by npm run build — never committed
└── src/
    ├── shared/
    │   ├── types.ts          ← the contract
    │   └── validate.ts       ← rules for both sides
    ├── server/
    │   └── server.ts         ← the API (provided)
    ├── client/
    │   ├── http.ts           ← Step 5
    │   ├── api.ts            ← Step 5
    │   └── main.ts           ← Step 8
    └── scripts/
        └── smoke.ts          ← Step 5
```

Add `data/` and `dist/` to your `.gitignore` now.

`package.json` — set `type` and `scripts`:

```json
{
  "name": "task-manager",
  "type": "module",
  "scripts": {
    "api": "node src/server/server.ts",
    "check": "tsc --noEmit",
    "build": "tsc",
    "watch": "tsc --watch",
    "smoke": "node src/scripts/smoke.ts"
  },
  …
}
```

`tsconfig.json` — the same as Day 06's project config:

```json
{
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",

    "target": "es2023",
    "module": "nodenext",
    "lib": ["es2023", "dom"],
    "types": ["node"],

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true,
    "rewriteRelativeImportExtensions": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

`src/shared/types.ts` — the contract both sides agree on:

```ts
// shared/types.ts — the API contract. The server and the browser both import this file.

export type Priority = "low" | "medium" | "high";

export interface Task {
  readonly id: number;
  title: string;
  done: boolean;
  priority: Priority;
  readonly createdAt: string;      // ISO date, set by the server
}

// What the browser sends to create a task — the server fills in the rest
export type NewTask = Pick<Task, "title" | "priority">;

// What the browser sends to change a task — any of these, or none
export type TaskUpdate = Partial<Pick<Task, "title" | "done" | "priority">>;

// Every error response from the API has this shape
export interface ApiErrorBody {
  error: string;
}
```

`src/shared/validate.ts` — the rules, written once:

```ts
// shared/validate.ts — one set of rules, used on BOTH sides:
// the browser checks before it sends, the server checks what it receives.

import type { NewTask, Priority, Task, TaskUpdate } from "./types.ts";

export const PRIORITIES: readonly Priority[] = ["low", "medium", "high"];
export const TITLE_MAX = 120;

export type Checked<T> = { ok: true; value: T } | { ok: false; error: string };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPriority(value: unknown): value is Priority {
  return PRIORITIES.includes(value as Priority);
}

function checkTitle(value: unknown): Checked<string> {
  if (typeof value !== "string") return { ok: false, error: "title must be a string" };
  const title = value.trim();
  if (title.length === 0) return { ok: false, error: "title is required" };
  if (title.length > TITLE_MAX) return { ok: false, error: `title must be ${TITLE_MAX} characters or fewer` };
  return { ok: true, value: title };
}

export function validateNewTask(input: unknown): Checked<NewTask> {
  if (!isObject(input)) return { ok: false, error: "body must be a JSON object" };
  const title = checkTitle(input.title);
  if (!title.ok) return title;
  const priority = input.priority ?? "medium";
  if (!isPriority(priority)) return { ok: false, error: `priority must be one of: ${PRIORITIES.join(", ")}` };
  return { ok: true, value: { title: title.value, priority } };
}

export function validateTaskUpdate(input: unknown): Checked<TaskUpdate> {
  if (!isObject(input)) return { ok: false, error: "body must be a JSON object" };
  const update: TaskUpdate = {};
  if ("title" in input) {
    const title = checkTitle(input.title);
    if (!title.ok) return title;
    update.title = title.value;
  }
  if ("done" in input) {
    if (typeof input.done !== "boolean") return { ok: false, error: "done must be true or false" };
    update.done = input.done;
  }
  if ("priority" in input) {
    if (!isPriority(input.priority)) return { ok: false, error: `priority must be one of: ${PRIORITIES.join(", ")}` };
    update.priority = input.priority;
  }
  if (Object.keys(update).length === 0) return { ok: false, error: "nothing to update" };
  return { ok: true, value: update };
}

// A type guard for what comes BACK from the API
export function isTask(value: unknown): value is Task {
  return (
    isObject(value) &&
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.done === "boolean" &&
    isPriority(value.priority) &&
    typeof value.createdAt === "string"
  );
}

export function isTaskList(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask);
}
```

Read `validateTaskUpdate` closely. `"title" in input` checks whether the field was **sent**, not whether it's truthy — so `{ "done": false }` is a real update, not an empty one. And every function returns a `Checked<T>`: Day 06's `Result<T>` idea, used for validation.

`src/server/server.ts` — **this is the one file today you may copy instead of typing.** It's a web server built with Node's built-in `node:http` module. You'll build servers yourself in Track 2 with Express; today, *read* it — every idea in it is one you already know: `async`/`await`, `try`/`catch`, a `Record`, spread instead of mutation, `import.meta.url` paths, `fs/promises`, a type-only import, and the shared validation.

```ts
// server/server.ts — today's Task API, plus a static file server for the app.
// Provided code: you'll build servers like this yourself in Track 2, with Express.
// Read it — every idea in it is from Days 04–07 — but you don't need to write it.

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname } from "node:path";
import type { ApiErrorBody, Task } from "../shared/types.ts";
import { validateNewTask, validateTaskUpdate } from "../shared/validate.ts";

const PORT = Number(process.env.PORT ?? 3000);
const SLOW = Number(process.env.SLOW ?? 0);             // extra ms before every API response
const FAIL_RATE = Number(process.env.FAIL_RATE ?? 0);   // 0–1: chance an API call fails with 500

const ROOT = new URL("../../", import.meta.url);        // the project folder
const DATA_DIR = new URL("data/", ROOT);
const DATA_FILE = new URL("tasks.json", DATA_DIR);

const SEED: Task[] = [
  { id: 1, title: "Read the Day 07 README", done: true, priority: "high", createdAt: "2026-09-27T09:00:00.000Z" },
  { id: 2, title: "Call the API with fetch", done: false, priority: "high", createdAt: "2026-09-27T09:05:00.000Z" },
  { id: 3, title: "Style the task list with Grid", done: false, priority: "medium", createdAt: "2026-09-27T09:10:00.000Z" },
];

// ---------- storage: a JSON file, so tasks survive a restart ----------

async function loadTasks(): Promise<Task[]> {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8")) as Task[];
  } catch {
    return [...SEED];                     // first run, or the file was deleted
  }
}

async function saveTasks(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
}

let tasks = await loadTasks();

// ---------- helpers ----------

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function sendError(res: ServerResponse, status: number, error: string): void {
  const body: ApiErrorBody = { error };
  sendJson(res, status, body);
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  let text = "";
  for await (const chunk of req) {
    text += chunk;
    if (text.length > 10_000) throw new Error("Body too large");
  }
  return JSON.parse(text);                // throws SyntaxError on bad JSON → 400
}

// ---------- the API ----------

async function handleApi(req: IncomingMessage, res: ServerResponse, path: string): Promise<void> {
  if (SLOW > 0) await delay(SLOW);
  if (Math.random() < FAIL_RATE) return sendError(res, 500, "Random failure (FAIL_RATE is on)");

  const method = req.method ?? "GET";

  // /api/tasks
  if (path === "/api/tasks") {
    if (method === "GET") return sendJson(res, 200, tasks);

    if (method === "POST") {
      const checked = validateNewTask(await readBody(req));
      if (!checked.ok) return sendError(res, 400, checked.error);
      const task: Task = {
        id: Math.max(0, ...tasks.map((t) => t.id)) + 1,
        title: checked.value.title,
        done: false,
        priority: checked.value.priority,
        createdAt: new Date().toISOString(),
      };
      tasks = [...tasks, task];
      await saveTasks();
      return sendJson(res, 201, task);
    }

    return sendError(res, 405, `${method} is not allowed on /api/tasks`);
  }

  // /api/tasks/:id
  const match = path.match(/^\/api\/tasks\/(\d+)$/);
  if (match) {
    const id = Number(match[1]);
    const task = tasks.find((t) => t.id === id);
    if (!task) return sendError(res, 404, `No task with id ${id}`);

    if (method === "GET") return sendJson(res, 200, task);

    if (method === "PATCH") {
      const checked = validateTaskUpdate(await readBody(req));
      if (!checked.ok) return sendError(res, 400, checked.error);
      const updated: Task = { ...task, ...checked.value };
      tasks = tasks.map((t) => (t.id === id ? updated : t));
      await saveTasks();
      return sendJson(res, 200, updated);
    }

    if (method === "DELETE") {
      tasks = tasks.filter((t) => t.id !== id);
      await saveTasks();
      res.writeHead(204);               // 204 No Content — success, empty body
      return void res.end();
    }

    return sendError(res, 405, `${method} is not allowed on /api/tasks/${id}`);
  }

  sendError(res, 404, `No API route for ${method} ${path}`);
}

// ---------- static files: index.html, styles.css, and the compiled dist/ ----------

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

async function handleStatic(res: ServerResponse, path: string): Promise<void> {
  const file = path === "/" ? "/index.html" : path;
  const allowed = file === "/index.html" || file === "/styles.css" || file.startsWith("/dist/");
  if (!allowed || file.includes("..")) return sendError(res, 404, "Not found");
  try {
    const body = await readFile(new URL(`.${file}`, ROOT));
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    sendError(res, 404, `Not found: ${file}${file.startsWith("/dist/") ? " — did you run npm run build?" : ""}`);
  }
}

// ---------- the server ----------

const server = createServer(async (req, res) => {
  const started = Date.now();
  const path = new URL(req.url ?? "/", "http://localhost").pathname;
  try {
    if (path.startsWith("/api/")) await handleApi(req, res, path);
    else await handleStatic(res, path);
  } catch (err) {
    if (err instanceof SyntaxError) sendError(res, 400, "Body is not valid JSON");
    else sendError(res, 500, "Something went wrong on the server");
  } finally {
    if (path.startsWith("/api/")) {
      console.log(`${req.method} ${path} → ${res.statusCode} (${Date.now() - started}ms)`);
    }
  }
});

server.listen(PORT, () => {
  console.log(`Task API on http://localhost:${PORT}  ·  app on http://localhost:${PORT}/`);
  if (SLOW) console.log(`  SLOW: +${SLOW}ms per API call`);
  if (FAIL_RATE) console.log(`  FAIL_RATE: ${FAIL_RATE * 100}% of API calls fail`);
});
```

Start it — and **leave this terminal running** for the rest of the day:

```bash
npm run api
```

```
Task API on http://localhost:3000  ·  app on http://localhost:3000/
```

Open `http://localhost:3000/api/tasks` in your browser — three tasks, as JSON. Open `http://localhost:3000/api/tasks/2` — one task. Open `http://localhost:3000/api/tasks/99` — `{"error":"No task with id 99"}`.

Now, in a **second** terminal (Git Bash on Windows), talk to it with `curl`:

```bash
curl -i http://localhost:3000/api/tasks/1
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"From curl","priority":"low"}'
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":""}'
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title": "Buy milk"'
```

The last three answer `201` with the new task, `400 {"error":"title is required"}`, and `400 {"error":"Body is not valid JSON"}`. Look at the **first** terminal: the server logs every call, with its status and timing.

#### `crud.ts` — the same four operations, with `fetch`

Back in `day-07/` (not `project/`), create `crud.ts`:

```ts
// crud.ts — all four CRUD operations with plain fetch, against today's Task API.
// Start the API first, in another terminal:  cd project && npm run api

const API = "http://localhost:3000/api/tasks";

// A tiny helper: print the method, URL, status — and the body, if there is one
async function show(label: string, res: Response): Promise<unknown> {
  const body: unknown = res.status === 204 ? null : await res.json();
  console.log(`${label.padEnd(26)} ${res.status} ${res.statusText.padEnd(12)} ${JSON.stringify(body)}`);
  return body;
}

// CREATE — POST with a JSON body. Two headers + JSON.stringify: forget either and it fails.
const created = await show("POST   /api/tasks", await fetch(API, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Learn fetch", priority: "high" }),
}));

const id = (created as { id: number }).id;

// READ — GET is the default method
await show(`GET    /api/tasks/${id}`, await fetch(`${API}/${id}`));

// UPDATE — PATCH sends only the fields that change
await show(`PATCH  /api/tasks/${id}`, await fetch(`${API}/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ done: true }),
}));

// DELETE — 204 No Content: success, and no body to read
await show(`DELETE /api/tasks/${id}`, await fetch(`${API}/${id}`, { method: "DELETE" }));

// READ it again — it's gone. Watch closely: fetch does NOT throw on a 404.
const res = await fetch(`${API}/${id}`);
await show(`GET    /api/tasks/${id}`, res);
console.log(`\nres.ok is ${res.ok} — the request "worked"; the answer was "not found". Checking is your job.`);
```

```bash
node crud.ts
```

```
POST   /api/tasks          201 Created      {"id":4,"title":"Learn fetch","done":false,"priority":"high","createdAt":"2026-09-27T10:29:33.771Z"}
GET    /api/tasks/4        200 OK           {"id":4,"title":"Learn fetch","done":false,"priority":"high","createdAt":"2026-09-27T10:29:33.771Z"}
PATCH  /api/tasks/4        200 OK           {"id":4,"title":"Learn fetch","done":true,"priority":"high","createdAt":"2026-09-27T10:29:33.771Z"}
DELETE /api/tasks/4        204 No Content   null
GET    /api/tasks/4        404 Not Found    {"error":"No task with id 4"}

res.ok is false — the request "worked"; the answer was "not found". Checking is your job.
```

Create, read, update, delete — and a 404 that **didn't throw**. Then break it:

1. Remove the `"Content-Type"` header from the `POST`. The server still parses it here (it's lenient) — but many real APIs won't. Put it back; always send it.
2. Remove `JSON.stringify` from the `POST` body. TypeScript stops you: an object isn't a valid body. HTTP only carries text.
3. Read `res.json()` on the `DELETE` response. `SyntaxError: Unexpected end of JSON input` — a 204 has no body.

---

### Step 4 — `failures.ts` — Every Way It Breaks

Keep the Task API running. In `day-07/`:

```ts
// failures.ts — every way a request can go wrong, one at a time.
// Keep the Task API running (npm run api) — except where a step says otherwise.

async function attempt(label: string, work: () => Promise<string>): Promise<void> {
  try {
    console.log(`✓ ${label.padEnd(24)} ${await work()}`);
  } catch (err) {
    const e = err as Error & { cause?: { code?: string } };
    console.log(`✗ ${label.padEnd(24)} ${e.name}: ${e.message}${e.cause?.code ? ` (${e.cause.code})` : ""}`);
  }
}

// 1. NETWORK — nothing is listening on port 3999. No response at all → fetch REJECTS.
await attempt("network: wrong port", async () => {
  const res = await fetch("http://localhost:3999/api/tasks");
  return String(res.status);
});

// 2. NETWORK — the host doesn't exist (DNS lookup fails) → fetch REJECTS.
await attempt("network: bad host", async () => {
  const res = await fetch("https://no-such-host.invalid/");
  return String(res.status);
});

// 3. HTTP 404 — the server answered "not found". fetch RESOLVES. No error unless you check.
await attempt("http 404, unchecked", async () => {
  const res = await fetch("http://localhost:3000/api/tasks/99999");
  return `status ${res.status} — and no error was thrown`;
});

// 4. HTTP 400 — the server rejected our data, and said why in the body
await attempt("http 400, checked", async () => {
  const res = await fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "" }),
  });
  if (!res.ok) {
    const body = (await res.json()) as { error?: string };
    throw new Error(`${res.status} — ${body.error ?? res.statusText}`);
  }
  return "created";
});

// 5. PARSE — the response isn't JSON (this is the app's HTML page) → res.json() REJECTS
await attempt("parse: HTML, not JSON", async () => {
  const res = await fetch("http://localhost:3000/");
  const data: unknown = await res.json();
  return JSON.stringify(data);
});

// 6. TIMEOUT — give up after 1ms. AbortSignal.timeout makes fetch REJECT with a TimeoutError.
await attempt("timeout: 1ms", async () => {
  const res = await fetch("https://api.github.com/users/octocat", { signal: AbortSignal.timeout(1) });
  return String(res.status);
});

// 7. ABORT — cancel it ourselves, e.g. the user typed again or left the page
await attempt("aborted by us", async () => {
  const controller = new AbortController();
  const pending = fetch("https://api.github.com/users/octocat", { signal: controller.signal });
  controller.abort();
  const res = await pending;
  return String(res.status);
});
```

```bash
node failures.ts
```

```
✗ network: wrong port      TypeError: fetch failed (ECONNREFUSED)
✗ network: bad host        TypeError: fetch failed (ENOTFOUND)
✓ http 404, unchecked      status 404 — and no error was thrown
✗ http 400, checked        Error: 400 — title is required
✗ parse: HTML, not JSON    SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
✗ timeout: 1ms             TimeoutError: The operation was aborted due to timeout
✗ aborted by us            AbortError: This operation was aborted
```

Line by line, that's the table from 2.1:

- **Network** — `TypeError: fetch failed`, with the real reason in `err.cause.code`: `ECONNREFUSED` (nothing listening), `ENOTFOUND` (no such host). In the browser you only get `Failed to fetch` — browsers hide the reason.
- **HTTP** — the ✓ on the 404 is the dangerous one. The second 404-style case only failed because *we checked* `res.ok` and read the server's message.
- **Parse** — `res.json()` on an HTML page. `Unexpected token '<'` almost always means *"you got HTML when you expected JSON"* — often a 404 page or a wrong URL.
- **Timeout / abort** — different names, `TimeoutError` vs `AbortError`, so you can tell "too slow" from "we cancelled".

Then stop the Task API (`Ctrl+C` in its terminal) and run `failures.ts` again. Which lines changed, and to what? Start the API again before moving on.

---

### Step 5 — `http.ts` + `api.ts` — A Typed Client

Now handle all of that **once**. In `project/src/client/`:

`http.ts` — one careful request function:

```ts
// client/http.ts — one careful fetch wrapper. Every way a request can fail becomes
// a typed ApiError instead of a crash. No DOM here, so it runs in Node too.

export type ApiError =
  | { kind: "network"; message: string }                  // no response at all
  | { kind: "timeout"; message: string }                  // took too long — we gave up
  | { kind: "aborted"; message: string }                  // we cancelled it on purpose
  | { kind: "http"; status: number; message: string }     // a response, but 4xx / 5xx
  | { kind: "parse"; message: string }                    // the body wasn't valid JSON
  | { kind: "shape"; message: string };                   // valid JSON, wrong shape

export type Result<T> = { ok: true; value: T } | { ok: false; error: ApiError };

export interface RequestOptions<T> {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  check: (value: unknown) => value is T;   // a type guard for the response
  timeoutMs?: number;
  signal?: AbortSignal;                    // lets the caller cancel
}

// Read the server's { "error": "…" } message if it sent one
async function errorMessage(res: Response): Promise<string> {
  try {
    const body: unknown = await res.json();
    if (typeof body === "object" && body !== null && "error" in body && typeof body.error === "string") {
      return body.error;
    }
  } catch {
    // not JSON — fall through
  }
  return res.statusText || `HTTP ${res.status}`;
}

export async function request<T>(url: string, options: RequestOptions<T>): Promise<Result<T>> {
  const { method = "GET", body, check, timeoutMs = 5000, signal } = options;
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
    if (timeout.aborted) return { ok: false, error: { kind: "timeout", message: `No response after ${timeoutMs}ms` } };
    if (signal?.aborted) return { ok: false, error: { kind: "aborted", message: "Request cancelled" } };
    return { ok: false, error: { kind: "network", message: err instanceof Error ? err.message : String(err) } };
  }

  if (!res.ok) {
    return { ok: false, error: { kind: "http", status: res.status, message: await errorMessage(res) } };
  }

  if (res.status === 204) {
    // No Content — nothing to parse. The guard decides whether "nothing" is acceptable.
    return check(undefined) ? { ok: true, value: undefined as T } : { ok: false, error: { kind: "shape", message: "Expected a body, got 204" } };
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return { ok: false, error: { kind: "parse", message: "The response was not valid JSON" } };
  }

  if (!check(data)) return { ok: false, error: { kind: "shape", message: "The response had an unexpected shape" } };
  return { ok: true, value: data };
}

// A readable sentence for any ApiError — used by the UI and by scripts
export function describeError(error: ApiError): string {
  switch (error.kind) {
    case "network": return `Can't reach the server (${error.message}). Is it running?`;
    case "timeout": return `The server is too slow — ${error.message}.`;
    case "aborted": return "Cancelled.";
    case "http":    return `${error.status}: ${error.message}`;
    case "parse":   return "The server sent something that isn't JSON.";
    case "shape":   return "The server sent data in an unexpected shape.";
  }
}
```

The order of the checks *is* the three layers from 2.1: no response → not ok → not JSON → wrong shape. Every exit returns a `Result`; nothing throws.

Three details worth a second look:

- **`AbortSignal.any([signal, timeout])`** — the request stops if *either* the caller cancels *or* the time runs out. Afterwards, `timeout.aborted` tells you which one it was.
- **`check`** — the caller passes a type guard, and `request<T>` infers `T` from it. Pass `isTaskList`, and the result is `Result<Task[]>` — Day 06 generics and type guards, together.
- **`describeError`** — an exhaustive `switch` over `error.kind`. Add a new kind to `ApiError` and TypeScript shows you this function needs a new case.

`api.ts` — the Task API as four functions:

```ts
// client/api.ts — the Task API as four typed functions. Nothing else talks to the server.

import type { NewTask, Task, TaskUpdate } from "../shared/types.ts";
import { isTask, isTaskList } from "../shared/validate.ts";
import { request, type Result } from "./http.ts";

let baseUrl = "/api";                         // same origin in the browser

// Node has no "current page", so scripts pass a full URL
export function setBaseUrl(url: string): void {
  baseUrl = url;
}

const isNothing = (value: unknown): value is void => value === undefined;

export function listTasks(signal?: AbortSignal): Promise<Result<Task[]>> {
  return request(`${baseUrl}/tasks`, { check: isTaskList, signal });
}

export function createTask(input: NewTask): Promise<Result<Task>> {
  return request(`${baseUrl}/tasks`, { method: "POST", body: input, check: isTask });
}

export function updateTask(id: number, changes: TaskUpdate): Promise<Result<Task>> {
  return request(`${baseUrl}/tasks/${id}`, { method: "PATCH", body: changes, check: isTask });
}

export function deleteTask(id: number): Promise<Result<void>> {
  return request(`${baseUrl}/tasks/${id}`, { method: "DELETE", check: isNothing });
}
```

This is the **only** file that knows the API's URLs. If the API moves to `/v2/tasks`, you change one string.

`http.ts` and `api.ts` have no DOM code — so they run in **Node** too. Prove it before building any page. `src/scripts/smoke.ts`:

```ts
// scripts/smoke.ts — drive the API from Node with the SAME client code the browser uses.
// Start the server first (npm run api), then: npm run smoke

import { createTask, deleteTask, listTasks, setBaseUrl, updateTask } from "../client/api.ts";
import { describeError, type Result } from "../client/http.ts";

setBaseUrl(process.env.API_URL ?? "http://localhost:3000/api");

// Print a result, and hand back the value (or undefined) so the next step can use it
function show<T>(label: string, result: Result<T>): T | undefined {
  if (result.ok) {
    console.log(`✓ ${label}`);
    return result.value;
  }
  console.log(`✗ ${label} — ${describeError(result.error)}`);
  return undefined;
}

const before = show("list", await listTasks());
console.log(`  ${before?.length ?? 0} tasks on the server`);

const created = show("create", await createTask({ title: "Smoke test task", priority: "low" }));
if (created) {
  console.log(`  new id ${created.id}, created ${created.createdAt}`);
  const updated = show("update", await updateTask(created.id, { done: true, priority: "high" }));
  console.log(`  done=${updated?.done} priority=${updated?.priority}`);
  show("delete", await deleteTask(created.id));
  show("delete again (should be 404)", await deleteTask(created.id));
}

show("create with empty title (should be 400)", await createTask({ title: "   ", priority: "low" }));
show("update with bad priority (should be 400)", await updateTask(1, { priority: "urgent" as never }));
```

```bash
cd project
npm run check
npm run smoke
```

```
✓ list
  3 tasks on the server
✓ create
  new id 4, created 2026-09-27T10:23:54.341Z
✓ update
  done=true priority=high
✓ delete
✗ delete again (should be 404) — 404: No task with id 4
✗ create with empty title (should be 400) — 400: title is required
✗ update with bad priority (should be 400) — 400: priority must be one of: low, medium, high
```

(Your task count may differ — `crud.ts` and `curl` added some.)

A **smoke test**: a quick script that exercises the whole API, so you know it works before you build a UI on top of it. Every line is typed — hover over `created` and `updated`.

Then: stop the server and run `npm run smoke`. Every call now reports `Can't reach the server (fetch failed). Is it running?` — and nothing crashed. Start the server again.

> Notice `"urgent" as never` in the last line — the only way to get an invalid priority past TypeScript is to lie to it. That's the point: in *your* code, the types stop the bug. The server's validation is for everyone else — `curl`, other apps, attackers.

---

### Step 6 — `index.html` — The Structure

`project/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Task Manager — JavaScript Everywhere</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <header class="site-header">
      <h1>Task Manager</h1>
      <p>Track 1 project · TypeScript, fetch and a real API</p>
    </header>

    <main class="layout">
      <section class="panel" aria-labelledby="add-heading">
        <h2 id="add-heading">New task</h2>
        <form id="task-form" class="task-form" novalidate>
          <label for="title">Title</label>
          <input id="title" name="title" type="text" maxlength="120" autocomplete="off" placeholder="What needs doing?" />

          <label for="priority">Priority</label>
          <select id="priority" name="priority">
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
          </select>

          <button id="add-button" type="submit">Add task</button>
          <p id="form-error" class="form-error" role="alert"></p>
        </form>
      </section>

      <section class="panel" aria-labelledby="tasks-heading">
        <div class="tasks-head">
          <h2 id="tasks-heading">Tasks</h2>
          <p id="counts" class="muted"></p>
        </div>

        <div class="toolbar">
          <input id="search" type="search" placeholder="Search tasks…" aria-label="Search tasks" />
          <div class="filters" role="group" aria-label="Show">
            <button type="button" data-filter="all">All</button>
            <button type="button" data-filter="active">Active</button>
            <button type="button" data-filter="done">Done</button>
          </div>
        </div>

        <div class="status-row">
          <p id="status" class="status" role="status" aria-live="polite"></p>
          <button id="retry" type="button" hidden>Try again</button>
        </div>

        <ul id="task-list" class="task-list"></ul>

        <button id="clear-done" type="button" class="quiet">Clear completed</button>
      </section>
    </main>

    <footer class="site-footer">JavaScript Everywhere · Day 07 · Track 1 project</footer>

    <!-- The browser can't run .ts — this is the compiled file (npm run build) -->
    <script type="module" src="/dist/client/main.js"></script>
  </body>
</html>
```

Before any CSS, read it as a document: a `<header>` with the `<h1>`, a `<main>` with two `<section>`s — each labelled by its `<h2>` through `aria-labelledby` — a real `<form>` with `<label>`s, a `<ul>` for the list, and a `<footer>`. The status line has `role="status"` so screen readers announce it. Every button that isn't a submit says `type="button"`.

The script tag loads `/dist/client/main.js` — the **compiled** file, from the same server as the API. That's why there's no Live Server today: **`npm run api` serves the app too**, and the page and the API share one origin, so there's no CORS to deal with (2.6).

---

### Step 7 — `styles.css` — Grid, Flexbox, Tokens

`project/styles.css`:

```css
/* styles.css — Task Manager. Custom properties, Grid for the page, Flexbox for the rows. */

/* 1. Design tokens — change a colour once, it changes everywhere */
:root {
  --bg: #f6f7f9;
  --surface: #ffffff;
  --text: #1c2230;
  --muted: #6b7385;
  --line: #dde1e8;
  --accent: #2f6fdf;
  --danger: #c93a3a;
  --low: #3c9a5f;
  --medium: #d49a1f;
  --high: #d0453b;
  --radius: 10px;
  --space: 16px;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #12151c;
    --surface: #1b2029;
    --text: #e8ebf1;
    --muted: #98a0b2;
    --line: #2d3442;
    --accent: #6d9cff;
    --danger: #ff7b72;
  }
}

/* 2. A small reset */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
}

h1,
h2,
p {
  margin: 0;
}

button,
input,
select {
  font: inherit;
  color: inherit;
}

/* 3. Page layout — Grid */
.site-header,
.layout,
.site-footer {
  width: min(1000px, 100% - 2 * var(--space));
  margin-inline: auto;
}

.site-header {
  padding-block: calc(var(--space) * 2) var(--space);
}

.site-header p,
.muted,
.site-footer {
  color: var(--muted);
}

.layout {
  display: grid;
  gap: var(--space);
  grid-template-columns: 1fr;            /* mobile first: one column */
  align-items: start;
}

@media (min-width: 760px) {
  .layout {
    grid-template-columns: 300px 1fr;    /* form beside the list */
  }
}

.panel {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: var(--space);
}

.panel h2 {
  font-size: 1.1rem;
  margin-bottom: 12px;
}

.site-footer {
  padding-block: calc(var(--space) * 2);
  font-size: 0.85rem;
}

/* 4. The form — a single column of fields */
.task-form {
  display: grid;
  gap: 6px;
}

.task-form label {
  font-weight: 600;
  font-size: 0.9rem;
}

input,
select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg);
}

button {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 8px 14px;
  background: var(--surface);
  cursor: pointer;
}

button[type="submit"] {
  margin-top: 8px;
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  font-weight: 600;
}

button:disabled {
  opacity: 0.55;
  cursor: progress;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.form-error {
  color: var(--danger);
  font-size: 0.9rem;
  min-height: 1.5em;
}

/* 5. Toolbar and list head — Flexbox rows */
.tasks-head,
.toolbar,
.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar {
  margin-block: 12px;
}

.toolbar input {
  flex: 1 1 200px;
}

.filters {
  display: flex;
  gap: 4px;
}

.filters button[aria-pressed="true"] {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.status {
  color: var(--muted);
  min-height: 1.5em;
}

.status.error {
  color: var(--danger);
}

/* 6. The task list */
.task-list {
  list-style: none;
  padding: 0;
  margin: 12px 0;
  display: grid;
  gap: 8px;
}

.task {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-left: 4px solid var(--medium);
  border-radius: 8px;
}

.task[data-priority="low"] {
  border-left-color: var(--low);
}

.task[data-priority="high"] {
  border-left-color: var(--high);
}

.task input[type="checkbox"] {
  width: 18px;
  height: 18px;
  flex: none;
}

.task-title {
  flex: 1;
  overflow-wrap: anywhere;
}

.task.done .task-title {
  text-decoration: line-through;
  color: var(--muted);
}

.task.pending {
  opacity: 0.6;
}

.task select {
  width: auto;
  padding: 4px 6px;
}

.task .delete {
  border: none;
  background: none;
  color: var(--danger);
  padding: 4px 8px;
}

.quiet {
  background: none;
  border: none;
  color: var(--muted);
  padding: 0;
  text-decoration: underline;
}
```

Match each section to Part 3:

1. **Tokens** — every colour is a custom property, redefined for dark mode in one `@media` block.
2. **Reset** — `box-sizing: border-box`, and form controls inherit the page font (they don't by default).
3. **Page layout — Grid.** One column on phones; at 760px and wider, a 300px form beside the list. `min(1000px, 100% - 2 * var(--space))` is a max-width with a gutter, in one line.
4. **The form — Grid** in one column, so labels and inputs stack with an even `gap`.
5. **Toolbar — Flexbox** with `flex-wrap: wrap`, so the search box and filter buttons fall onto two lines on a phone.
6. **Task rows — Flexbox**, with the title taking the leftover space (`flex: 1`), and `[data-priority="high"]` attribute selectors colouring the left border from the `data-priority` your TypeScript sets.

You can't see it working yet — the list is empty until Step 8. Keep going.

---

### Step 8 — `main.ts` — The App

`project/src/client/main.ts`:

```ts
// client/main.ts — the Task Manager. One state object, one render(), and event handlers
// that change state, talk to the API, and call render() again.

import type { Priority, Task } from "../shared/types.ts";
import { PRIORITIES, validateNewTask } from "../shared/validate.ts";
import { createTask, deleteTask, listTasks, updateTask } from "./api.ts";
import { describeError } from "./http.ts";

// ---------- DOM lookups (Day 06's typed helper) ----------

function $<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing #${id} in index.html`);
  return el as T;
}

const form = $<HTMLFormElement>("task-form");
const titleInput = $<HTMLInputElement>("title");
const addButton = $<HTMLButtonElement>("add-button");
const formError = $<HTMLParagraphElement>("form-error");
const search = $<HTMLInputElement>("search");
const list = $<HTMLUListElement>("task-list");
const counts = $<HTMLParagraphElement>("counts");
const status = $<HTMLParagraphElement>("status");
const retry = $<HTMLButtonElement>("retry");
const clearDone = $<HTMLButtonElement>("clear-done");
const filterButtons = document.querySelectorAll<HTMLButtonElement>("[data-filter]");

// ---------- state ----------

type Filter = "all" | "active" | "done";

type View =
  | { status: "loading" }
  | { status: "failed"; message: string }
  | { status: "ready" };

interface State {
  view: View;
  tasks: Task[];
  filter: Filter;
  query: string;
  pending: ReadonlySet<number>;   // ids with a request in flight
  notice: string;                 // the result of the last action
}

let state: State = {
  view: { status: "loading" },
  tasks: [],
  filter: "all",
  query: "",
  pending: new Set(),
  notice: "",
};

// Every change goes through here: merge, then redraw. Never mutate state directly.
function setState(changes: Partial<State>): void {
  state = { ...state, ...changes };
  render();
}

function withPending(id: number, on: boolean): ReadonlySet<number> {
  const next = new Set(state.pending);
  if (on) next.add(id);
  else next.delete(id);
  return next;
}

function replaceTask(updated: Task): Task[] {
  return state.tasks.map((t) => (t.id === updated.id ? updated : t));
}

// ---------- render: state → DOM ----------

function visibleTasks(): Task[] {
  const q = state.query.trim().toLowerCase();
  return state.tasks.filter((t) => {
    if (state.filter === "active" && t.done) return false;
    if (state.filter === "done" && !t.done) return false;
    return q === "" || t.title.toLowerCase().includes(q);
  });
}

function taskItem(task: Task): HTMLLIElement {
  const li = document.createElement("li");
  li.className = "task";
  li.classList.toggle("done", task.done);
  li.classList.toggle("pending", state.pending.has(task.id));
  li.dataset.id = String(task.id);
  li.dataset.priority = task.priority;

  const box = document.createElement("input");
  box.type = "checkbox";
  box.id = `task-${task.id}`;
  box.checked = task.done;
  box.dataset.action = "toggle";

  const label = document.createElement("label");
  label.htmlFor = box.id;
  label.className = "task-title";
  label.textContent = task.title;             // textContent, never innerHTML, for user text

  const select = document.createElement("select");
  select.dataset.action = "priority";
  select.ariaLabel = `Priority for ${task.title}`;
  for (const p of PRIORITIES) select.add(new Option(p, p, false, p === task.priority));

  const del = document.createElement("button");
  del.type = "button";
  del.className = "delete";
  del.dataset.action = "delete";
  del.ariaLabel = `Delete ${task.title}`;
  del.textContent = "✕";

  for (const control of [box, select, del]) control.disabled = state.pending.has(task.id);
  li.append(box, label, select, del);
  return li;
}

function statusText(view: View, shown: number): string {
  switch (view.status) {
    case "loading": return "Loading tasks…";
    case "failed":  return view.message;
    case "ready":
      if (state.notice) return state.notice;
      if (state.tasks.length === 0) return "No tasks yet — add your first one.";
      if (shown === 0) return "Nothing matches this filter.";
      return "";
    default: {
      const unreachable: never = view;
      return unreachable;
    }
  }
}

function render(): void {
  // Remember which control had focus, so a redraw doesn't lose the keyboard user's place
  const focused = document.activeElement;
  const focusId = focused instanceof HTMLElement ? focused.closest<HTMLElement>(".task")?.dataset.id : undefined;
  const focusAction = focused instanceof HTMLElement ? focused.dataset.action : undefined;

  const shown = visibleTasks();
  list.replaceChildren(...shown.map(taskItem));

  const done = state.tasks.filter((t) => t.done).length;
  counts.textContent = `${state.tasks.length - done} active · ${done} done`;

  status.textContent = statusText(state.view, shown.length);
  status.classList.toggle("error", state.view.status === "failed");
  retry.hidden = state.view.status !== "failed";

  for (const button of filterButtons) {
    button.ariaPressed = String(button.dataset.filter === state.filter);
  }
  clearDone.disabled = done === 0;

  if (focusId && focusAction) {
    list.querySelector<HTMLElement>(`[data-id="${focusId}"] [data-action="${focusAction}"]`)?.focus();
  }
}

// ---------- actions: talk to the API, then update state ----------

let loadController: AbortController | undefined;

async function loadTasks(): Promise<void> {
  loadController?.abort();                    // a newer load cancels an older one
  loadController = new AbortController();
  setState({ view: { status: "loading" }, notice: "" });

  const result = await listTasks(loadController.signal);
  if (!result.ok) {
    if (result.error.kind !== "aborted") setState({ view: { status: "failed", message: describeError(result.error) } });
    return;
  }
  setState({ view: { status: "ready" }, tasks: result.value });
}

async function handleAdd(event: SubmitEvent): Promise<void> {
  event.preventDefault();                     // stop the browser's full-page form submit
  const data = new FormData(form);

  // The same rules the server uses — check before we send
  const checked = validateNewTask({ title: data.get("title"), priority: data.get("priority") });
  if (!checked.ok) {
    formError.textContent = checked.error;
    titleInput.focus();
    return;
  }

  formError.textContent = "";
  addButton.disabled = true;
  try {
    const result = await createTask(checked.value);
    if (!result.ok) {
      formError.textContent = describeError(result.error);
      return;
    }
    form.reset();
    setState({ tasks: [...state.tasks, result.value], notice: `Added “${result.value.title}”.` });
    titleInput.focus();
  } finally {
    addButton.disabled = false;
  }
}

// Optimistic: show the change now, undo it if the server says no
async function toggleTask(id: number, done: boolean): Promise<void> {
  const before = state.tasks;
  setState({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, done } : t)),
    pending: withPending(id, true),
    notice: "",
  });

  const result = await updateTask(id, { done });
  if (result.ok) {
    setState({ tasks: replaceTask(result.value), pending: withPending(id, false) });
  } else {
    setState({ tasks: before, pending: withPending(id, false), notice: `Couldn't save — ${describeError(result.error)}` });
  }
}

// Pessimistic: wait for the server, then show the change
async function changePriority(id: number, priority: Priority): Promise<void> {
  setState({ pending: withPending(id, true), notice: "" });
  const result = await updateTask(id, { priority });
  setState({
    tasks: result.ok ? replaceTask(result.value) : state.tasks,
    pending: withPending(id, false),
    notice: result.ok ? "" : `Couldn't change priority — ${describeError(result.error)}`,
  });
}

async function removeTask(id: number): Promise<void> {
  setState({ pending: withPending(id, true), notice: "" });
  const result = await deleteTask(id);
  // A 404 means it's already gone — which is what we wanted anyway
  if (!result.ok && !(result.error.kind === "http" && result.error.status === 404)) {
    setState({ pending: withPending(id, false), notice: `Couldn't delete — ${describeError(result.error)}` });
    return;
  }
  setState({ tasks: state.tasks.filter((t) => t.id !== id), pending: withPending(id, false), notice: "" });
}

// Many requests at once — Day 05's allSettled, with Day 06's types
async function clearCompleted(): Promise<void> {
  const doneIds = state.tasks.filter((t) => t.done).map((t) => t.id);
  clearDone.disabled = true;
  const results = await Promise.all(doneIds.map((id) => deleteTask(id)));
  const removed = new Set(doneIds.filter((_, i) => results[i]?.ok));
  const failed = doneIds.length - removed.size;
  setState({
    tasks: state.tasks.filter((t) => !removed.has(t.id)),
    notice: failed ? `Removed ${removed.size}, ${failed} failed — try again.` : `Removed ${removed.size} completed.`,
  });
}

// ---------- events ----------

form.addEventListener("submit", handleAdd);
retry.addEventListener("click", loadTasks);
clearDone.addEventListener("click", clearCompleted);
search.addEventListener("input", () => setState({ query: search.value, notice: "" }));

for (const button of filterButtons) {
  button.addEventListener("click", () => setState({ filter: button.dataset.filter as Filter, notice: "" }));
}

// Event delegation: ONE listener on the list handles every task, even ones added later
list.addEventListener("change", (event) => {
  const target = event.target;
  const id = Number((target as HTMLElement).closest<HTMLElement>(".task")?.dataset.id);
  if (target instanceof HTMLInputElement && target.dataset.action === "toggle") {
    void toggleTask(id, target.checked);
  } else if (target instanceof HTMLSelectElement && target.dataset.action === "priority") {
    void changePriority(id, target.value as Priority);
  }
});

list.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-action="delete"]');
  const id = Number(button?.closest<HTMLElement>(".task")?.dataset.id);
  if (button && !Number.isNaN(id)) void removeTask(id);
});

void loadTasks();
```

Build it, and open the app:

```bash
npm run build          # compiles src/ → dist/
```

Open **`http://localhost:3000/`** — not Live Server, not `file://`. You should see your tasks (the three seeded ones, plus anything `crud.ts` and `curl` left behind).

Now use it:

1. **Add** a task. Try an empty title — the error appears **without** a request (check the Network tab: nothing was sent). The same `validateNewTask` the server uses ran in the browser.
2. **Tick** a task — it moves instantly (optimistic). Watch the server terminal: `PATCH /api/tasks/2 → 200`.
3. Change a task's **priority** — the row fades while the request is in flight (`pending`), then updates.
4. **Delete** one. **Filter** by Active / Done. **Search**.
5. **Clear completed** — several `DELETE`s at once, with `Promise.all`, and one message for the lot.
6. **Reload the page.** Everything is still there — it's on the server now, in `data/tasks.json`. Open that file.
7. Resize the window below 760px — one column. Switch your OS to dark mode.

Now the walkthrough, top to bottom:

- **DOM lookups** — Day 06's `$<T>` helper. A missing id fails loudly at startup, not as `null` somewhere later.
- **`State` and `setState`** — 4.3. `pending` is a `ReadonlySet<number>`; `withPending` makes a **new** Set rather than changing the old one — the same no-mutation rule as Day 04's spread.
- **`render()`** — throws the whole list away and rebuilds it from `state` every time. For a few hundred items that's fast, and it can never drift out of sync. The only extra work: remembering which control had keyboard focus, and putting it back, so a keyboard user doesn't get thrown to the top of the page after every tick.
- **`taskItem`** — every piece built with `createElement` + `textContent`. No `innerHTML`, so a task called `<img src=x onerror=alert(1)>` is just a strange title (Step 9 proves it).
- **`loadTasks`** — cancels any older load with an `AbortController` before starting (2.3), and ignores `aborted` results so a cancelled load never shows an error.
- **`handleAdd`** — `preventDefault`, `FormData`, shared validation, button disabled during the request and re-enabled in `finally` (Day 05).
- **`toggleTask`** — optimistic, with `before` saved for the rollback. **`changePriority`** and **`removeTask`** — pessimistic. `removeTask` treats a `404` as success: if it's already gone, that's what the user wanted.
- **`clearCompleted`** — `Promise.all` over `deleteTask` calls. Because every call returns a `Result` and **never rejects**, `Promise.all` can't fail fast here — each `result.ok` says what happened. (With functions that throw, this is where you'd need Day 05's `allSettled`.)
- **Events** — one `change` and one `click` listener on the whole list (delegation, 3.7). `void toggleTask(…)` says "yes, I'm deliberately not awaiting this Promise" — the function handles its own errors.

---

### Step 9 — Break It Five Ways

A real app has to survive a real network. Stop the server (`Ctrl+C`) between each of these and restart it with the new setting.

**1. A flaky server.**

```bash
FAIL_RATE=0.5 npm run api          # Git Bash / macOS / Linux
```

(PowerShell: `$env:FAIL_RATE="0.5"; npm run api`, and `Remove-Item Env:FAIL_RATE` afterwards.)

Reload. Half the time: `500: Random failure (FAIL_RATE is on)` and a **Try again** button. Tick tasks — some jump back with *Couldn't save*. That's the optimistic rollback. Try **Clear completed** — you may see *Removed 1, 2 failed — try again.*

**2. A slow server.**

```bash
SLOW=3000 npm run api
```

Reload: `Loading tasks…` for 3 seconds. Add a task: the button is disabled while it waits — so a double-click can't create two. Change a priority: the row fades until the server answers.

**3. A server that's too slow.** `SLOW=6000` is longer than `request`'s 5-second timeout. Reload: *The server is too slow — No response after 5000ms.* Without the timeout, that spinner would never stop.

**4. No server at all.** Stop it. Tick a task: *Couldn't save — Can't reach the server (Failed to fetch). Is it running?* Press **Try again** — same message, no crash. Start the server, press **Try again** — everything's back.

**5. An attacker.** Add a task called:

```
<img src=x onerror="alert('hacked')">
```

No alert. It's shown as text, because `taskItem` uses `textContent`. Now, **temporarily**, change `label.textContent = task.title;` to `label.innerHTML = task.title;`, rebuild, reload — the alert fires on every page load, for everyone who loads the list. Change it back, rebuild, and delete that task.

Finally, check the **Network** tab during each of these, and do one full pass of the page using **only the keyboard** (3.8).

---

### Step 10 — Ship It — and Close Track 1

```bash
npm run check                          # clean? then commit
git status                             # data/, dist/ and node_modules/ must NOT appear

git add day-07/package.json day-07/package-lock.json day-07/tsconfig.json day-07/first-fetch.ts day-07/search.ts
git commit -m "Add first fetch and query string labs"
git add day-07/project/package.json day-07/project/package-lock.json day-07/project/tsconfig.json day-07/project/src/shared day-07/project/src/server
git commit -m "Add Task API with shared types and validation"
git add day-07/crud.ts day-07/failures.ts
git commit -m "Add CRUD and failure labs"
git add day-07/project/src/client/http.ts day-07/project/src/client/api.ts day-07/project/src/scripts
git commit -m "Add typed HTTP client and smoke test"
git add day-07/project/index.html day-07/project/styles.css
git commit -m "Add Task Manager page structure and styles"
git add day-07/project/src/client/main.ts
git commit -m "Add Task Manager app with optimistic updates"

git push -u origin feature/day-07
```

Open the pull request (What / Why / How to test — with `npm run api`, `npm run build`, `npm run smoke` under **How to test**), merge it, delete the branch, `git pull`.

> **That's Track 1.** Seven days ago you installed Node. Today you have a typed, full-stack app with a REST API, shared validation, error handling for every failure mode, a responsive accessible interface, and a Git history of pull requests. Everything from here — React, Express, databases, mobile, desktop, AI — is built on exactly these pieces.

---

## The Cheat Sheet

### Part 1 — HTTP & `fetch`

| Idea | Write this |
|---|---|
| GET | `const res = await fetch(url)` |
| Check it worked | `if (!res.ok) …` — **always** |
| Read JSON | `const data: unknown = await res.json()` + a type guard |
| POST JSON | `fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) })` |
| Update some fields | `method: "PATCH"` + only the changed fields |
| Delete | `fetch(url, { method: "DELETE" })` — expect `204`, no body |
| Query string | `const u = new URL(base); u.searchParams.set("q", text)` |
| One header | `res.headers.get("content-type")` |

| Method | CRUD | Success |
|---|---|---|
| `GET` | Read | `200` |
| `POST` | Create | `201` |
| `PATCH` / `PUT` | Update (some / all fields) | `200` |
| `DELETE` | Delete | `204` |

`2xx` success · `4xx` **your** request is wrong — don't retry · `5xx` **server** problem — retry later

### Part 2 — Calling APIs Properly

| Idea | Write this |
|---|---|
| Timeout | `fetch(url, { signal: AbortSignal.timeout(5000) })` |
| Cancel | `const c = new AbortController(); fetch(url, { signal: c.signal }); c.abort()` |
| Both | `AbortSignal.any([c.signal, AbortSignal.timeout(5000)])` |
| Cancel a stale load | `controller?.abort()` before starting a new one |
| Failure as a value | `Result<T> = { ok: true; value: T } \| { ok: false; error: ApiError }` |
| Error kinds | `network` · `timeout` · `aborted` · `http` (+`status`) · `parse` · `shape` |
| Server's message | read `{ error }` from the body of a non-ok response |
| Safe to retry | network, timeout, 5xx — on `GET` / idempotent calls |
| Never retry | 4xx, parse, shape — and be careful with `POST` |
| Secrets | server only — never in `dist/` |

#### Which error is it?

```
fetch REJECTS ─── TypeError ──────── network: no response (down, wrong port, DNS, CORS)
              ├── TimeoutError ───── our AbortSignal.timeout fired
              └── AbortError ─────── we called controller.abort()
fetch RESOLVES ── !res.ok ────────── http: the server said 4xx / 5xx
              ├── res.json() throws ─ parse: not JSON ("Unexpected token '<'")
              └── guard fails ─────── shape: JSON, but not what we expected
```

### Part 3 — Web Basics

| Idea | Write this |
|---|---|
| Page skeleton | `<header>` · `<main>` · `<section aria-labelledby>` · `<footer>` |
| Input | `<label for="x">` + `<input id="x" name="x">` |
| Buttons | `type="submit"` in forms, `type="button"` everywhere else |
| Handle a form | `form.addEventListener("submit", e => { e.preventDefault(); new FormData(form) })` |
| Sizing | `*, *::before, *::after { box-sizing: border-box; }` |
| Variables | `:root { --accent: … }` · `var(--accent)` |
| A row | `display: flex; align-items: center; gap: …` + `flex: 1` on the stretchy item |
| A layout | `display: grid; grid-template-columns: 300px 1fr; gap: …` |
| Auto columns | `grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))` |
| Responsive | mobile styles first, then `@media (min-width: …) { … }` |
| Dark mode | `@media (prefers-color-scheme: dark) { :root { … } }` |
| User text | `el.textContent = text` — never `innerHTML` |
| Own data | `el.dataset.id = "3"` ↔ `data-id="3"` |
| Many items, one listener | delegation + `event.target.closest("[data-action]")` |
| The loop | `state` → `render()` → event → `setState()` → `render()` |

### Part 4 — The Project

| Command | Does |
|---|---|
| `npm run api` | Starts the API **and** serves the app on `http://localhost:3000` |
| `SLOW=3000 npm run api` | Every API call waits 3s |
| `FAIL_RATE=0.3 npm run api` | 30% of API calls fail with 500 |
| `npm run build` | `src/` → `dist/` — rerun after every change (or `npm run watch`) |
| `npm run check` | Type-check everything |
| `npm run smoke` | Exercise the API from Node with the browser's client code |

---

## Common Mistakes

| Mistake | What happens | Fix |
|---|---|---|
| Not checking `res.ok` | A 404 / 500 body flows into your code as data | `if (!res.ok)` straight after `fetch` |
| `try`/`catch` around `fetch` and nothing else | 4xx / 5xx never reach the `catch` | `fetch` only rejects on network failure — check `res.ok` too |
| `const data = await res.json()` used directly | `any` — no checking at all | `const data: unknown` + a type guard |
| Forgetting `await` on `res.json()` | `data` is a `Promise` | `await res.json()` |
| Reading the body twice | `TypeError: Body is unusable` | Read it once, into a variable |
| `res.json()` on a `204` | `Unexpected end of JSON input` | Check `res.status === 204` first |
| `body: { title }` | TypeScript error / `[object Object]` sent | `body: JSON.stringify({ title })` |
| No `Content-Type` on a JSON body | The server may not parse it | `headers: { "Content-Type": "application/json" }` |
| Building query strings by hand | Spaces, `&`, `#` break the URL | `URL` + `searchParams.set` |
| No timeout | Spinner forever when a server hangs | `AbortSignal.timeout(ms)` |
| Retrying a 400 | Fails the same way, forever | Only retry network / timeout / 5xx |
| Retrying a `POST` blindly | Duplicate records | Retry `GET`s; let the user retry writes |
| API key in frontend code | Anyone can read it in DevTools | Keys live on a server |
| `innerHTML = userText` | XSS — attacker's code runs in your page | `textContent` |
| `<div onclick>` as a button | No keyboard, no screen reader | `<button type="button">` |
| A button inside a form without `type` | It submits the form | `type="button"` |
| Handling the button's `click` instead of the form's `submit` | `Enter` doesn't work | Listen for `submit` |
| No `preventDefault()` on submit | The page reloads, state is lost | `event.preventDefault()` first |
| `placeholder` instead of `<label>` | Screen readers and users lose the label once they type | A real `<label for>` |
| One listener per list item | Leaks listeners, misses new items | Event delegation on the list |
| Changing the DOM in every handler | The page drifts out of sync with the data | Change `state`, call `render()` |
| Mutating `state.tasks` directly | `render()` isn't called, or old references change | `setState({ tasks: [...] })` |
| Button not disabled during a request | Double-click → two tasks | Disable it; re-enable in `finally` |
| Opening the app with Live Server or `file://` | CORS errors, or `/api` 404s | `http://localhost:3000` from `npm run api` |
| Editing `main.ts` and just reloading | Nothing changes | `npm run build` (or `npm run watch`) |
| Committing `data/tasks.json` | Your test data in everyone's clone | `data/` in `.gitignore` |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `TypeError: fetch failed` / `Failed to fetch` | No response. Is the server running? Right port? In the browser, also check the console for a CORS message. |
| `ECONNREFUSED` | Nothing is listening on that port — start the server. |
| `EADDRINUSE: address already in use :::3000` | The server is already running in another terminal. Stop that one, or `PORT=3001 npm run api`. |
| `SyntaxError: Unexpected token '<'` | You got HTML, not JSON — wrong URL, or a 404 page. Log `res.status` and `await res.text()`. |
| `Unexpected end of JSON input` | Empty body — a `204`, or the server crashed mid-response. |
| `… has been blocked by CORS policy` | The page and the API are on different origins. Open the app from `http://localhost:3000`. |
| The page shows nothing and the console says `main.js` 404 | You haven't run `npm run build` — or the message on the page says so. |
| Changes to `main.ts` don't show up | Rebuild. Run `npm run watch` in a third terminal to rebuild on save. |
| `403 … rate limit exceeded` from GitHub | 60 requests an hour without a token. Wait, or use today's local API. |
| `curl: (3) URL rejected` / JSON errors from curl on Windows | Use Git Bash, or `curl.exe` with escaped quotes in PowerShell. |
| `'SLOW' is not recognized` on Windows | That's `cmd`/PowerShell syntax. Use Git Bash, or PowerShell: `$env:SLOW="3000"; npm run api`. |
| Tasks disappear on restart | They shouldn't — check `data/tasks.json` exists. Deleting it resets to the three seed tasks. |
| Everything is `Loading tasks…` forever | The server is running with a huge `SLOW`, or `request` has no timeout. |
| Layout doesn't change on a phone | Missing `<meta name="viewport" …>`. |
| Styles don't apply at all | The `<link>` href is wrong — check the Network tab for a 404 on `styles.css`. |
| `Cannot find name 'document'` in `npm run check` | `"dom"` missing from `lib` in `tsconfig.json`. |

---

## Before the Next Session

**Track 1 is done.** The next session starts **Track 2: Full-Stack Web Application** with **React Intro — Components, Props & State, JSX**.

Come having finished [ASSIGNMENT.md](ASSIGNMENT.md) — **merged through a pull request**, with `npm run check` clean and the Task Manager surviving every test in Step 9. If your app shows a blank page or `Failed to fetch` and you can't see why, ask **before** the next session.

### A Taste of the Next Session

You don't need to run this — just read it next to your `taskItem` and `render`:

```tsx
// TaskList.tsx — the same list, in React
function TaskList({ tasks, onToggle }: { tasks: Task[]; onToggle: (id: number, done: boolean) => void }) {
  if (tasks.length === 0) return <p>No tasks yet — add your first one.</p>;
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={task.done ? "task done" : "task"} data-priority={task.priority}>
          <input type="checkbox" checked={task.done} onChange={(e) => onToggle(task.id, e.target.checked)} />
          <span className="task-title">{task.title}</span>
        </li>
      ))}
    </ul>
  );
}
```

HTML-like syntax inside TypeScript, a function that turns data into interface, and no `createElement`, no `replaceChildren`, no focus juggling — React redraws only what changed. It's the **state → render** loop you wrote by hand today, done for you. Your `http.ts`, `api.ts` and `shared/` come along unchanged.

---

## Day 07 Files

- [README.md](README.md) — this guide
- [ASSIGNMENT.md](ASSIGNMENT.md) — Day 07 assignment

← Back to [Day 06 — TypeScript from Scratch](../Day-06-TypeScript-Intro/README.md)
