# Day 08 — Assignment

**Track 2 · Day 8 · Forms in React + Routing with React Router**

> Day 07 gave your Task Board state. Today it gets a real form and real URLs.
>
> Like Day 07, this assignment is **problems, not checklists**. Each problem gives you the input, the expected output, the constraints and a set of examples. The **how** is yours. Read it, break it down, write your approach, *then* code — and you're done when every example produces the expected output.

**⏱ Budget:** ~7–8 hours · **📅 Duration:** 6 days · **🚩 Deadline:** before the next session

| # | Task | Topics | Difficulty | ⏱ |
|---|---|---|---|---|
| — | Warm-up — predict the output | controlled inputs, forms, params | — | 30 min |
| P1 | Problem — `validateBooking` | pure functions, validation rules | 🟢 Easy | 1 h |
| P2 | Problem — Booking Form | controlled form, touched, submit states, a11y | 🟡 Medium | 1 h 30 |
| P3 | Problem — Country Explorer | routes, params, URL state, history | 🟡 Medium | 2 h |
| P4 | Problem — Extend Task Board v2 | sort in the URL, a new route, one form reused | 🟠 Medium+ | 2 h |
| — | Ship it | notes, PR, LinkedIn | — | 45 min |

> **Task Board v2 itself is not homework.** You build it while following README Part 3. Problem 4 asks you to *extend* it — so finish the follow-along first.

---

## How to Work a Problem

Same five steps as Day 07:

1. **Read the whole problem twice** — examples and constraints included.
2. **Write your approach first** in `APPROACH.md` — 2–5 lines per problem, *before* any code.
3. **Code it** yourself. No copy-paste.
4. **Test it against every example**, character by character.
5. **Open a hint only after 20 minutes stuck** — one at a time.

> **Where it goes:** Problems 1–3 live in one Vite project, `day-08-problems/` (React + TypeScript + `react-router`), with `/booking` and `/countries` as routes. Problem 4 lives in your README `task-board-v2/` project.

> **Versions:** React 19.3, React Router **8** (`react-router`), Vite 8, TypeScript 6, **Node 22.22+**. Import everything router-related from `"react-router"`.

> **Rules for every problem:** typed everything · no `any`, no `@ts-ignore` · no internal `<a href>` · nothing from the URL is trusted without parsing it · errors are derived, never stored.

---

## Warm-up — Predict the Output

Six snippets. Predict in `predictions.md` **before** running, then run, record the actual result, and write **one sentence of why** for every miss.

```tsx
// 1 — The user types "hello" into the box. What does the box show?
function A() {
  const [t, setT] = useState("");
  return <input value={t} />;
}

// 2 — The number input is empty. What are Number(age) and age === 0?
const [age, setAge] = useState("");
<input type="number" value={age} onChange={(e) => setAge(e.target.value)} />;

// 3 — The user clicks "Cancel". What happens, and why?
<form onSubmit={handleSubmit}>
  <input />
  <button type="submit">Save</button>
  <button>Cancel</button>
</form>

// 4 — Which component renders for "/tasks/new", and which for "/tasks/7"?
<Routes>
  <Route path="tasks/:id" element={<Detail />} />
  <Route path="tasks/new" element={<NewTask />} />
</Routes>

// 5 — The URL is "/lessons/3". What does this log?
const { n } = useParams();
console.log(typeof n, n === 3);

// 6 — A search box calls setSearchParams({ q: value }) on every keystroke (no `replace`).
//     After typing "react", how many Back presses does it take to leave the page?
```

**✅ Deliverable:** `predictions.md`.

---

## Problem 1 — `validateBooking`

🟢 **Easy** · pure functions, validation rules, strings and dates

### Description

A workshop takes seat bookings through a form. Before you build the form, write the function that decides what's wrong with it. **No React** in this problem — it's a plain function you can run with `node`.

### Signature

```ts
export interface BookingValues {
  name: string;
  email: string;
  phone: string;   // as typed — may contain spaces
  seats: string;   // as typed in a number input — always a string
  date: string;    // "YYYY-MM-DD", or "" if not picked
  terms: boolean;
}

export type BookingErrors = Partial<Record<keyof BookingValues, string>>;

export function validateBooking(values: BookingValues, today: string): BookingErrors
```

`today` is passed in as `"YYYY-MM-DD"` — the function never reads the clock itself.

### Rules

Check each field in order. A field gets **only its first** failing message. Valid fields don't appear in the result at all.

| Field | Rule (checked top to bottom) | Message |
|---|---|---|
| `name` | empty after trimming | `Name is required` |
| | fewer than 2 characters after trimming | `Use at least 2 characters` |
| `email` | empty after trimming | `Email is required` |
| | doesn't match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (after trimming) | `Enter an email like name@example.com` |
| `phone` | empty after removing **all** spaces | `Phone is required` |
| | not an Egyptian mobile: `01` + one of `0 1 2 5` + 8 more digits | `Enter a mobile number like 010 1234 5678` |
| `seats` | after trimming, not **digits only**, or less than 1, or more than 4 | `Book 1 to 4 seats` |
| `date` | empty | `Pick a date` |
| | before `today` | `That date has passed` |
| | a **Friday** | `We're closed on Fridays` |
| `terms` | `false` | `Accept the terms to continue` |

### Examples

All examples use `today = "2026-10-10"` (a Saturday).

**Example 1** — everything valid

```ts
validateBooking({ name: "Sara", email: "sara@mail.com", phone: "010 1234 5678",
                  seats: "2", date: "2026-10-17", terms: true }, "2026-10-10")
// → {}
```

**Example 2** — the empty form

```ts
validateBooking({ name: "", email: "", phone: "", seats: "", date: "", terms: false }, "2026-10-10")
// → {
//     name:  "Name is required",
//     email: "Email is required",
//     phone: "Phone is required",
//     seats: "Book 1 to 4 seats",
//     date:  "Pick a date",
//     terms: "Accept the terms to continue"
//   }
```

**Example 3** — everything slightly wrong

```ts
validateBooking({ name: " A ", email: "sara@mail", phone: "01312345678",
                  seats: "1e2", date: "2026-10-09", terms: true }, "2026-10-10")
// → {
//     name:  "Use at least 2 characters",
//     email: "Enter an email like name@example.com",
//     phone: "Enter a mobile number like 010 1234 5678",
//     seats: "Book 1 to 4 seats",
//     date:  "That date has passed"
//   }
```

> `2026-10-09` is also a Friday. Why does it get "has passed" and not "closed on Fridays"?

**Example 4** — spaces everywhere, but valid — except the day

```ts
validateBooking({ name: "Omar", email: " omar@site.org ", phone: "0115 555 1234",
                  seats: " 4 ", date: "2026-10-16", terms: true }, "2026-10-10")
// → { date: "We're closed on Fridays" }
```

**Example 5** — the edges

```ts
validateBooking({ name: "Mo", email: "mo@x.io", phone: "01098765432",
                  seats: "0", date: "2026-10-10", terms: true }, "2026-10-10")
// → { seats: "Book 1 to 4 seats" }          ← booking for today is fine
```

### Constraints

- `validateBooking` is **pure**: no React, no `Date.now()`, no `new Date()` without an argument. Same input → same output, always.
- Write `validate.test-run.ts` that runs all five examples and prints `PASS` or `FAIL` for each. Run it with `node`. Comparing objects is part of the problem — `===` won't work, and the order of keys isn't guaranteed to match.
- Add **three examples of your own** to the test run — at least one that you think might break your code.

<details>
<summary>💡 Hint 1</summary>

Write one small check per field, each with early `return`s, and let `validateBooking` call them. "Only the first message" is exactly what `if … else if …` gives you.
</details>

<details>
<summary>💡 Hint 2</summary>

`"YYYY-MM-DD"` strings compare with `<` the same way dates do — no `Date` needed for "has passed". For the weekday you **do** need a `Date`: `new Date(date + "T00:00").getDay()` reads it in local time (`5` is Friday). Without the `"T00:00"`, the string is read as UTC — and in Cairo the day can come out wrong.
</details>

<details>
<summary>💡 Hint 3</summary>

`Number("1e2")` is `100` and `Number(" ")` is `0` — that's why the rule says **digits only**. Test the string with `/^\d+$/` before converting. To compare two error objects, compare their sorted keys, then each value.
</details>

**✅ Deliverable:** `src/booking/validate.ts` + `validate.test-run.ts` + 1 screenshot of the test output, all `PASS`.

---

## Problem 2 — Booking Form

🟡 **Medium** · controlled inputs, `touched`, submit states, accessibility

### Description

Build the form that uses Problem 1. It should behave the way a good form on a real website does: quiet until you've had a chance to type, honest when something fails, and impossible to submit twice.

### Given

A fake server — copy this one file, it's infrastructure, not the problem:

```ts
// src/booking/fakeApi.ts
import type { BookingValues } from "./validate";

export async function fakeBook(values: BookingValues): Promise<void> {
  console.log("fakeBook called");
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (values.email.trim().toLowerCase() === "full@example.com") {
    throw new Error("This session is fully booked.");
  }
}
```

### Behaviour

- All six fields are **controlled**, held in **one** `values` object, updated by **one** change handler.
- Errors come from `validateBooking(values, todayISO())` on every render — **never** stored in state.
- A field's error is **visible** only after that field has been **blurred**, or after a **submit attempt**.
- Submitting an invalid form shows **every** error, moves **focus to the first invalid field** (in form order), and does **not** call `fakeBook`.
- Submitting a valid form calls `fakeBook`. While it's pending, the button is **disabled** and reads **`Booking…`**, and another submit (Enter) does **nothing**.
- If `fakeBook` fails: the message appears in an element with `role="alert"`, and **everything the user typed is kept**.
- If it succeeds, the form is replaced by one line:
  `See you on Saturday 17 October, Sara — 2 seats booked.` (`1 seat` when it's one; the name trimmed.)
- Every field has a `<label>`. A field with a visible error has `aria-invalid="true"` and `aria-describedby` pointing at its message; a field without one has **neither** attribute.

### Example — a sequence of actions

Pick a date in the future that isn't a Friday for the valid steps.

| # | Action | Expected |
|---|---|---|
| 1 | Open `/booking` | No errors anywhere. Button reads `Book`. |
| 2 | Click into **Name**, press Tab | `Name is required` under Name — and nowhere else |
| 3 | Type `S` | `Use at least 2 characters` |
| 4 | Type `a` | The error disappears **immediately** — no blur needed |
| 5 | Click **Book** | Errors under Email, Phone, Seats, Date and Terms; **focus is in Email**; console shows no `fakeBook called` |
| 6 | Fill everything validly with email `full@example.com`, click **Book** | `Booking…` (disabled) for ~0.8 s, then `This session is fully booked.` — every field still filled in |
| 7 | Change the email to `sara@mail.com`, press **Enter twice quickly** | `fakeBook called` appears **once**, then the success line |

### Constraints

- `noValidate` on the form — and a one-line comment saying why.
- The re-enabling of the button must survive a failure (think about where it goes).
- Catch the error **without** `any`.

<details>
<summary>💡 Hint 1</summary>

You need three pieces of state besides `values`: which fields are touched, whether a submit was attempted, and the submit status (`idle` / `submitting` / an error message / `done`). Can any of them be one value instead of two?
</details>

<details>
<summary>💡 Hint 2</summary>

"Visible error" = `errors[field]` **and** (`touched[field]` **or** `submitAttempted`). Compute it once in a tiny helper, then use it for the message, `aria-invalid` and `aria-describedby`.
</details>

<details>
<summary>💡 Hint 3</summary>

To focus the first invalid field: give each input a `name`, then `form.querySelector<HTMLElement>('[name="…"]')?.focus()` on the first key of the errors **in form order** — not in `Object.keys` order. The double-submit guard is an early `return` at the top of the handler; `disabled` alone isn't enough for Enter.
</details>

**✅ Deliverable:** `src/booking/BookingForm.tsx` + 2 screenshots: the form at step 5 (errors visible) and at step 6 (the alert).

---

## Problem 3 — Country Explorer

🟡 **Medium** · routes, URL params, search params, `replace` vs push

### Description

A small app for browsing countries. The twist: **the URL is the state.** Every search, filter, sort and page lives in the address bar — so refresh, Back and a shared link all just work.

### Given

```ts
// src/countries/data.ts — population in millions, approximate
export interface Country { code: string; name: string; region: Region; population: number }
export type Region = "Africa" | "Asia" | "Europe" | "Americas";

export const COUNTRIES: Country[] = [
  { code: "EG", name: "Egypt",        region: "Africa",   population: 114 },
  { code: "NG", name: "Nigeria",      region: "Africa",   population: 227 },
  { code: "MA", name: "Morocco",      region: "Africa",   population: 38 },
  { code: "KE", name: "Kenya",        region: "Africa",   population: 56 },
  { code: "JP", name: "Japan",        region: "Asia",     population: 124 },
  { code: "IN", name: "India",        region: "Asia",     population: 1441 },
  { code: "SA", name: "Saudi Arabia", region: "Asia",     population: 33 },
  { code: "DE", name: "Germany",      region: "Europe",   population: 84 },
  { code: "FR", name: "France",       region: "Europe",   population: 68 },
  { code: "IT", name: "Italy",        region: "Europe",   population: 59 },
  { code: "BR", name: "Brazil",       region: "Americas", population: 216 },
  { code: "CA", name: "Canada",       region: "Americas", population: 40 },
];
```

### Routes

| URL | Shows |
|---|---|
| `/countries` | the list (below) |
| `/countries/:code` | one country — `code` is **case-insensitive** |
| `/` | redirects to `/countries` — and Back doesn't return to `/` |
| anything else | `Page not found.` |

A header with `NavLink`s to **Booking** and **Countries** marks the current section.

### The List — Search Params

| Param | Meaning | Default / fallback |
|---|---|---|
| `q` | name contains this text — trimmed, case-insensitive | absent → everything |
| `region` | exactly `Africa`, `Asia`, `Europe` or `Americas` | anything else → all regions |
| `sort` | `name` (A → Z) or `pop` (largest first) | anything else → `name` |
| `page` | 5 countries per page | not a whole number, or < 1 → `1`; past the last page → the last page |

Each row is a link: `Egypt — 114 M`. Under the list: `Page 1 of 3 · 12 countries` (the count is all **matching** countries, not just this page). No matches → `No countries match.` and no pager.

Controls: a **search box**, a **region** `<select>`, a **sort** toggle, and **Previous / Next**.

- Typing in the search box **replaces** the history entry. Everything else **pushes**.
- An empty search **removes** `q` from the URL.
- Changing the search or the region **removes** `page` (back to page 1).

### Detail Page

`/countries/eg` shows `Egypt (EG)`, `Africa` and `114 million`. An unknown code shows `Country not found.` with a link back to the list.

### Examples

| # | URL | Expected |
|---|---|---|
| 1 | `/countries` | Brazil, Canada, Egypt, France, Germany · `Page 1 of 3 · 12 countries` |
| 2 | `/countries?page=3` | Nigeria, Saudi Arabia · `Page 3 of 3 · 12 countries` |
| 3 | `/countries?region=Africa&sort=pop` | Nigeria — 227 M, Egypt — 114 M, Kenya — 56 M, Morocco — 38 M · `Page 1 of 1 · 4 countries` |
| 4 | `/countries?q=AN&page=2` | Canada, France, Germany, Japan · `Page 1 of 1 · 4 countries` |
| 5 | `/countries?region=Mars&sort=banana&page=-4` | exactly the same as Example 1 |
| 6 | `/countries?q=zz` | `No countries match.` |
| 7 | `/countries/eg` | Egypt (EG) · Africa · 114 million |
| 8 | `/countries/XX` | `Country not found.` |
| 9 | `/nope` | `Page not found.` |

| # | History scenario | Expected |
|---|---|---|
| 10 | On `/countries`, type `ger` in the search box, press Back **once** | You leave `/countries` entirely — not `?q=ge` |
| 11 | On `/countries?region=Europe`, switch sort to population, press Back | Region still Europe, sorted by name again |
| 12 | On `/countries?region=Europe`, open France, press Back | The list is **still filtered to Europe** |
| 13 | On `/countries?page=3`, pick region Asia | URL has no `page`; you're on page 1 |

### Constraints

- **No `useState`** for `q`, `region`, `sort` or `page`.
- Parse every param through a small function (`parseRegion`, `parseSort`, `parsePage`) — nothing from the URL is used raw.
- Update params with the **function form** of `setSearchParams` and a **new** `URLSearchParams` — never mutate `prev`.
- Internal navigation uses `<Link>` / `<NavLink>` — no `<a href>`.

<details>
<summary>💡 Hint 1</summary>

The list is a pipeline of pure steps: **parse** params → **filter** (q, region) → **sort** → **clamp the page** (needs the filtered count) → **slice**. Each step is a function you can `console.log` alone.
</details>

<details>
<summary>💡 Hint 2</summary>

Example 4 is the clamp: `q=AN` leaves 4 countries — one page — so `page=2` must show page 1. You can only clamp **after** filtering. `Math.ceil(count / 5)` is the last page — but what is it when `count` is 0?
</details>

<details>
<summary>💡 Hint 3</summary>

Write one helper that takes the changes and the history mode:
`update({ q: "ger", page: null }, { replace: true })` — where `null` means "delete this param". Every control becomes one line.
</details>

**✅ Deliverable:** `src/countries/` + 1 screenshot of Example 3 **with the URL visible**.

---

## Problem 4 — Extend Task Board v2

🟠 **Medium+** · search params, a new route, one form reused

### Description

Start from the Task Board v2 you built in README Part 3. Add two features.

### Feature A — Sort, in the URL

- A sort control on the list page, stored as `?sort=` alongside `filter` and `q`.
  - absent → **Added** (by `id`)
  - `due` → tasks **with** a due date first, earliest first; tasks **without** one after them, by `id`
  - `priority` → `high` → `medium` → `low`; same priority → by `id`
  - anything else → **Added**
- Choosing **Added** removes `sort` from the URL.
- Sorting works together with the filter and the search, and survives a refresh.

### Feature B — Duplicate a Task

- A **Duplicate** link on the detail page goes to `/tasks/:id/duplicate`.
- That page shows the **same `TaskForm`** used by New and Edit, pre-filled from the task, except:
  - the title starts with `Copy of ` (`Build the task form` → `Copy of Build the task form`)
  - `done` is `false`
  - a due date that is **in the past** is cleared (a new task can't be due in the past)
- Saving creates a **new** task, lands on its detail page, and **Back does not return to the form**.
- `/tasks/999/duplicate` shows `Task not found`.

### Examples

Start from the README's `INITIAL` tasks: 1 "Read the Day 08 README" (high, done, no due date) · 2 "Build the task form" (high, due 2027-01-15) · 3 "Add the routes" (medium, no due date).

| # | URL / action | Expected list (top → bottom) |
|---|---|---|
| 1 | `/?sort=due` | Build the task form · Read the Day 08 README · Add the routes |
| 2 | `/?sort=priority` | Read the Day 08 README · Build the task form · Add the routes |
| 3 | `/?sort=banana` | Read the Day 08 README · Build the task form · Add the routes |
| 4 | `/?filter=open&sort=due` | Build the task form · Add the routes |
| 5 | Choose **Added** in the sort control | `sort` disappears from the URL; `filter` and `q` stay |
| 6 | Open task 2 → **Duplicate** | Form shows `Copy of Build the task form`, high, due 2027-01-15, the same notes, not done |
| 7 | Save it | You're on `/tasks/4`; pressing Back goes to task 2's page, **not** the form |
| 8 | `/tasks/999/duplicate` | `Task not found` |
| 9 | Duplicate a task whose title is 78 characters long, click Save | The title error appears — `Copy of ` pushed it over 80 |

### Constraints

- `sortTasks(tasks, sort)` is pure and never mutates — prove it with a throwaway script.
- The duplicate page reuses `TaskForm` **unchanged** — if you had to add a prop to it, say why in `FEATURE.md`.
- `FEATURE.md`: one sentence each — why is the sort in the URL and not in `useState`, and how did you make Back skip the form?
- `tsc`, `npm run lint` and `npm run build` all pass.

<details>
<summary>💡 Hint 1</summary>

For "due first": tasks with `dueDate === ""` need to sort **after** every real date. One way: compare "has a date" first (`Number(a.dueDate === "") - Number(b.dueDate === "")`), then the date strings, then `id`.
</details>

<details>
<summary>💡 Hint 2</summary>

The duplicate page is mostly the Edit page: find the task by `Number(id)`, build the `initial` values from it, pass `onSubmit={addTask}`-style logic like the New page — and the `replace` you already used after adding.
</details>

**✅ Deliverable:** updated `task-board-v2/` + `FEATURE.md` + 1 screenshot of the list with `sort` **in the URL**.

---

## Ship It

### Repo

```
your-repo/
└── day-08/
    ├── NOTES.md
    ├── predictions.md
    ├── APPROACH.md
    ├── day-08-problems/     ← Problems 1–3
    └── task-board-v2/       ← README Part 3 + Problem 4
```

- All work on a `feature/day-08` branch, with clear commit messages, merged through a **pull request**.
- `node_modules` and `dist` are **not** committed.

### `day-08/NOTES.md` — four short answers, in your own words

1. **Why errors are derived, not stored** — what would go wrong in your Booking Form if they were state?
2. **`touched`** — what problem does it solve for the user?
3. **URL state vs `useState`** — one value you put in the URL, one you kept in state, and why each.
4. **One real bug** you hit: the exact error or symptom, how you found it, the fix.

### LinkedIn

A short post about Day 8 with a screenshot showing a URL full of params, your repo link, and **one concrete thing that clicked**.

**✅ Deliverable:** repo link + merged PR link + LinkedIn post link.

---

## Bonus (Optional) — Challenge Problems

<details>
<summary>⭐ Challenge 1 — Zod</summary>

Rewrite `validateBooking` as a **Zod** schema, infer `BookingValues` from it with `z.infer`, and make your Problem 1 test run pass **unchanged**.
</details>

<details>
<summary>⭐ Challenge 2 — Unsaved Changes</summary>

In Task Board v2, leaving a form with unsaved changes asks *"Leave without saving?"* — and saving or cancelling doesn't ask. Leaving an **unchanged** form doesn't ask either.
</details>

<details>
<summary>⭐ Challenge 3 — Country Explorer, Bookmarkable Detail</summary>

The detail page shows **Previous / Next country** links that respect the list's current `q`, `region` and `sort` — so you can page through the filtered list one country at a time. (Hint: the list's params have to travel with the link.)
</details>

<details>
<summary>⭐ Challenge 4 — Deploy</summary>

Deploy `day-08-problems/` to Netlify or Vercel with the **SPA rewrite** — and prove that a refresh on `/countries/eg?…` works.
</details>

---

## How This Is Graded

| Level | What it looks like |
|---|---|
| ❌ **Incomplete** | An example that doesn't match its expected output, approach written after the code, copy-pasted code, errors stored in state, a URL param used without parsing, a search box that pushes on every keystroke, a form that submits twice, `<a href>` for an internal link, `any` or `@ts-ignore`, `node_modules` committed, no merged PR, or code you can't explain line by line |
| ✅ **Done** | Warm-up done honestly · Problems 1–4 pass **every** example · `APPROACH.md` written before each problem · notes in your own words · a merged PR |
| 🔥 **10%** | Done + the challenge problems + notes someone else could learn from |

---

## A Reminder

> **90%** study only — free, self-paced, no assignments turned in.
> **10%** study + assignments + more — I personally help this group get there.
>
> **If you show up for the 10%, I show up for you.**

The next session is **State Management — `useState`/`useEffect` and the Context API** — where your tasks survive a refresh, load from an API, and stop being passed down by hand. Come with Task Board v2 working and your PR merged.

---

← Back to [Day 08 README](README.md)
