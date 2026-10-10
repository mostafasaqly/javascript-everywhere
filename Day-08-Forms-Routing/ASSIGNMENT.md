# Day 08 — Assignment

**Track 2 · Day 8 · Forms in React + Routing with React Router**

> Day 07 gave your Task Board state. Today it gets a real form and real URLs.
> **Tasks 1–6:** controlled inputs, validation, submit states, routes, params and URL state — each one broken on purpose.
> **Tasks 7–9:** **Task Board v2** — five routes, one form that creates *and* edits — and a feature of your own.
> **Tasks 10–12:** four bugs on purpose, notes with a pull request, and sharing it.

**⏱ Budget:** 10–12 hours · **📅 Duration:** 6 days · **🚩 Deadline:** before the next session

| # | Task | Part | Deliverable |
|---|---|---|---|
| 1 | Predict, then run | 1–2 | `predictions.md` + 1 screenshot |
| 2 | Controlled inputs lab | 1 | `src/forms/ControlsLab.tsx` + 1 screenshot |
| 3 | Validation lab | 1 | `validate.ts` + `ValidationLab.tsx` + 1 screenshot |
| 4 | Submit states lab | 1 | `fakeApi.ts` + `SavingLab.tsx` + 1 screenshot |
| 5 | Routing lab | 2 | `src/routing/` + 1 screenshot |
| 6 | URL state lab | 2 | `src/routing/UrlLab.tsx` + 1 screenshot |
| 7 | Build: Task Board v2 — structure and routes | 3 | `task-board-v2/` + 1 screenshot |
| 8 | Build: Task Board v2 — the form | 3 | `TaskForm.tsx` + 2 screenshots |
| 9 | Your feature, built into the board | 3 | code + `FEATURE.md` + 1 screenshot |
| 10 | Break it — four bugs, on purpose | 1–3 | `BREAK-IT.md` + 4 screenshots |
| 11 | Notes, branch and pull request | — | `NOTES.md` + repo link + merged PR link |
| 12 | Share it | — | LinkedIn post link |

> **Type every line by hand. Do not copy-paste.**

> **Do this whole assignment on a branch.** Create `feature/day-08` before writing a single file.

> **Versions:** React 19.3, React Router **8** (package `react-router`), Vite 8, TypeScript 6. React Router 8 needs **Node 22.22+** — run `node --version` first. Type form handlers as `SubmitEvent<HTMLFormElement>`, import everything router-related from `"react-router"` (not `react-router-dom`), and put your `npm ls react-router` output in `NOTES.md`.

> **Where it goes:** the labs (Tasks 2–6) live in one Vite project, `day-08-forms/`. Task Board v2 (Tasks 7–10) is its own project, `task-board-v2/`.

---

## Task 1 — Predict, Then Run

Twelve questions. #1–#8 are components or routes you can run; #9–#12 are written questions.

### 1.1 — Write Your Predictions First

- [ ] Create `predictions.md`
- [ ] For **each** snippet, write exactly what appears on screen — or the **exact error or warning** — **before running anything**

```tsx
// 1 — The user types "hello" into the box. What does the box show?
function A() {
  const [t, setT] = useState("");
  return <input value={t} />;
}

// 2 — What does the console say, and can the user type?
function B() {
  const [t, setT] = useState<string>();
  return <input value={t} onChange={(e) => setT(e.target.value)} />;
}

// 3 — The number input is empty. What is `Number(age)`, and what is `age === 0`?
const [age, setAge] = useState("");
<input type="number" value={age} onChange={(e) => setAge(e.target.value)} />;

// 4 — User presses Enter in the text field. What happens?
<form onSubmit={(e) => console.log("submit")}>
  <input />
  <button>Go</button>
</form>

// 5 — The user clicks the "Cancel" button. What happens, and why?
<form onSubmit={handleSubmit}>
  <input />
  <button type="submit">Save</button>
  <button>Cancel</button>
</form>

// 6 — Route table below. Which component renders for "/tasks/new", and for "/tasks/7"?
<Routes>
  <Route path="tasks/:id" element={<Detail />} />
  <Route path="tasks/new" element={<NewTask />} />
</Routes>

// 7 — URL is "/lessons/3". What does this log?
const { n } = useParams();
console.log(typeof n, n === 3);

// 8 — URL is "/?q=a%20b&sort=desc". What do these return?
const [p] = useSearchParams();
console.log(p.get("q"), p.get("sort"), p.get("page"));
```

```tsx
// 9 — <NavLink to="/">Home</NavLink> with no `end`. On which URLs is it "active"?

// 10 — An edit page for /tasks/1/edit uses `useState(task)` for its form's initial values.
//      The user navigates straight to /tasks/2/edit (the same route, a different :id).
//      Which task's data does the form show, and what fixes it?

// 11 — A page does `setSearchParams({ q: value })` on every keystroke in a search box
//      (no `replace`). After typing "react", how many times does Back need to be pressed
//      to leave the page?

// 12 — Tasks are stored in `useState` inside <TaskListPage>. The user opens a task's detail
//      page and presses Back. What happened to the tasks they'd added, and why?
```

### 1.2 — Now Run Them

> Getting them wrong is the assignment. Getting them wrong and not explaining why is not.

- [ ] Ran #1–#8 and recorded the **actual** result next to each prediction
- [ ] Tried #9–#12 in code too
- [ ] For every one you got wrong, wrote **one sentence** explaining why
- [ ] For **#2, #3, #5, #6, #10 and #12** named the mechanism explicitly
- [ ] Screenshotted the output
- [ ] Wrote down how many you got wrong, and which result surprised you most

**✅ Deliverable:** `predictions.md` + 1 screenshot.

---

## Task 2 — Controlled Inputs Lab

Create `src/forms/ControlsLab.tsx` and render it from `App.tsx`.

### 2.1 — Every Input

- [ ] A text input, a **textarea**, a **select**, a **checkbox**, a **radio group** (three options, in a `<fieldset>` with a `<legend>`), a **number** input and a **date** input — **all controlled**
- [ ] A `<pre>` at the bottom printing every value with `JSON.stringify`
- [ ] Every input has a visible `<label>` connected with `htmlFor` (using `useId`) or by wrapping

### 2.2 — One State Object

- [ ] Replaced the seven `useState`s with **one** `values` object and **one** `handleChange` using `name`
- [ ] The handler handles the **checkbox** (`checked`) differently from everything else, with an `instanceof HTMLInputElement` narrowing — no `any`, no `as`
- [ ] A comment explaining what `[name]: next` is and which Day 04 feature it is

### 2.3 — The Number Input

- [ ] Proved in a comment, with a `console.log`, that the number input's state is a **string**
- [ ] Converted on **submit**, not on every keystroke, and handled the empty string (`""` → `undefined`, not `0`)

### 2.4 — Break It

One at a time. Read the warning or error, write it as a comment, fix it.

- [ ] `value` without `onChange` — the warning
- [ ] State starting as `undefined` — the "uncontrolled to controlled" warning
- [ ] A button inside the form with no `type` — and what it did to the page
- [ ] A `<textarea>` written with children instead of `value`
- [ ] A `name` typo — and what happened to `values`

**✅ Deliverable:** `ControlsLab.tsx` + 1 screenshot.

---

## Task 3 — Validation Lab

### 3.1 — The Pure Part

- [ ] `src/forms/validate.ts` exports `Values`, `Errors`, `INITIAL`, `validate(values)` and `hasErrors(errors)`
- [ ] A **signup** with: name (≥ 2 characters after trimming), email (a regex), password (≥ 8 characters **and** a digit), password confirmation (must match), and an "I accept" checkbox
- [ ] `validate` is **pure** — it imports nothing from React
- [ ] A throwaway script, `node src/forms/validate.test-run.ts`, prints **at least eight** checks with their expected values in comments — including the empty form, a password with no digit, and a mismatched confirmation

### 3.2 — The Component

- [ ] `src/forms/ValidationLab.tsx` — `values`, `touched`, and **derived** `errors` (never in `useState`)
- [ ] An error appears **only** after the field's `onBlur` **or** after a submit attempt
- [ ] Submitting an invalid form shows **every** error and focuses the **first** invalid field
- [ ] `noValidate` on the form, and you can say why
- [ ] Fixing a field makes its error disappear **immediately**, while typing

### 3.3 — Accessible

- [ ] Every field: `<label htmlFor>` + `useId`-based ids
- [ ] Invalid fields have `aria-invalid="true"` and `aria-describedby` pointing at the message's `id` — and the attribute is **absent** (not `"false"`) when the field is fine
- [ ] The radio/checkbox group uses `<fieldset>`/`<legend>` where it applies
- [ ] Errors say what to do ("Use at least 8 characters"), not just what's wrong
- [ ] You tabbed through the whole form with the **keyboard only** and submitted it with Enter

### 3.4 — Break It

- [ ] Stored `errors` in `useState` and updated them only on submit — screenshotted a stale error staying after the field was fixed
- [ ] Removed `noValidate` and described what the browser did with `type="email"`
- [ ] Showed errors **immediately** (no `touched`) and described in a comment why it feels wrong after one keystroke

**✅ Deliverable:** `validate.ts` + `ValidationLab.tsx` + 1 screenshot (with errors visible).

---

## Task 4 — Submit States Lab

### 4.1 — A Fake Server

- [ ] `src/forms/fakeApi.ts` — `sleep(ms)` and `pretendToSave(title)` that waits ~600 ms and **rejects** for one specific title (use your own)
- [ ] Both return Promises and `pretendToSave` is `async`

### 4.2 — The Form

- [ ] `SavingLab.tsx` with `submitting` and `error` state — **no `useEffect`**
- [ ] The button is `disabled` and reads **"Saving…"** while submitting
- [ ] The handler **also** returns early `if (submitting)` — and you proved the difference by removing `disabled` and pressing Enter twice
- [ ] On **failure** the typed text is **kept**; on **success** it is cleared
- [ ] The button is re-enabled in a **`finally`** block, and you proved why with a `try`/`catch` that forgot to
- [ ] `catch (err)` is narrowed with `err instanceof Error` — no `any`

### 4.3 — Reset and `FormData`

- [ ] A **Reset** button (`type="button"`) that restores initial values, clears `touched` and the error
- [ ] A component whose parent passes a `key` — switching `key` resets the form; you screenshotted the form keeping **stale** initial values **without** it
- [ ] A **second** version of the form using **`FormData`** and **uncontrolled** inputs (`defaultValue`), narrowing `data.get(…)` with `typeof` — and a comment: what can't you do with it?

### 4.4 — Break It

- [ ] Removed the double-submit protection and pressed Enter twice — screenshotted the duplicate
- [ ] Cleared the input in the `catch` — described why users hate it
- [ ] Put the save in a render-time call instead of the handler and described what happened

**✅ Deliverable:** `fakeApi.ts` + `SavingLab.tsx` + 1 screenshot (the "Saving…" state **and** an error).

---

## Task 5 — Routing Lab

In `day-08-forms/src/routing/`. First `npm install react-router` and `<BrowserRouter>` in `main.tsx`.

### 5.1 — Routes

- [ ] A layout route (no `path`) with a header, a `NavLink` nav and an `<Outlet />`
- [ ] An **index** route, three static pages, and a **404** (`path="*"`)
- [ ] A **dynamic** route `lessons/:n` and a list of links to it
- [ ] A `<Navigate to="…" replace />` route for an old URL — and you confirmed Back **skips** it

### 5.2 — Links

- [ ] `NavLink`s style the active page; the Home link has **`end`**
- [ ] `<Link>` for in-app links — and **no** `<a href>` for any internal page
- [ ] Used `aria-label` on the `<nav>`

### 5.3 — Params Are Strings

- [ ] A page printing `typeof n` — `string`
- [ ] **Bad IDs render "not found"**: `/lessons/abc` and `/lessons/99` both show a not-found message, using `Number(n)` + `Number.isInteger` and a lookup — **not** a crash
- [ ] A `useNavigate` button doing `navigate(-1)`, and another doing `navigate("/", { replace: true })`

### 5.4 — A Layout That Owns State

- [ ] `SharedLayout` owns a `useState` counter and passes it with `<Outlet context={…} />`
- [ ] A typed `useShared()` wrapper around `useOutletContext<Shared>()`
- [ ] **Two pages** read the counter. One page has its own `useState`, and you showed it **reset to 0** when you left and returned, while the layout's count survived — and wrote one sentence on why

### 5.5 — Break It

- [ ] Removed `end` from the Home `NavLink` and screenshotted it active everywhere
- [ ] Replaced one `<Link>` with `<a href>` and showed the Network tab making a **document** request
- [ ] Compared `n === 3` (`useParams` string vs number) and described the result
- [ ] Moved `path="*"` to the top and described why it still works (specificity, not order)

**✅ Deliverable:** `routing/` + 1 screenshot (include the Network tab **or** the active-everywhere bug).

---

## Task 6 — URL State Lab

Create `src/routing/UrlLab.tsx` with a list of at least eight items (fruit, countries, anything).

### 6.1 — The URL Is the State

- [ ] A **search box** and a **sort** button, both stored in `useSearchParams` — **no** `useState` for them
- [ ] Unknown values fall back safely: `?sort=banana` behaves like the default (a `parseSort` function using `find` or a type guard)
- [ ] An empty search **deletes** the param, so the URL stays clean
- [ ] Updates use the **function form** of `setSearchParams` and `new URLSearchParams(prev)` — you never mutate `prev`

### 6.2 — History

- [ ] The search box uses **`{ replace: true }`** — and you proved Back leaves the page, not the previous letter
- [ ] The sort button **pushes** — and you proved Back reverses the sort
- [ ] Refreshing keeps the view; the URL pasted into a private window shows the same view

### 6.3 — Add a Third Param

- [ ] A **page** param with Previous/Next buttons, validated: `?page=abc`, `?page=-3` and `?page=999` all land on a real page
- [ ] **Changing the search resets the page to 1** — and you wrote down why

### 6.4 — Break It

- [ ] Used `{ replace: false }` on the search box, typed a word, and counted the Back presses
- [ ] Used `setSearchParams({ q })` (not the function form) and showed it **erasing** the sort param

**✅ Deliverable:** `UrlLab.tsx` + 1 screenshot **showing the URL** with several params.

---

## Task 7 — Build: Task Board v2 — Structure and Routes

A **new** project `task-board-v2/` (React + TypeScript + `react-router`) — copy your Day 07 board's styles if you like.

### 7.1 — Plan on Paper

- [ ] `docs/route-table.md` — every URL, its page, and whether it has params
- [ ] `docs/state-table.md` — every piece of data, **state or derived**, and **which component owns it** — with a column saying **why it can't live lower**
- [ ] Your table has `tasks` in **`Layout`**, `filter` and `q` in the **URL**, and **no stored `errors`**

### 7.2 — Structure

- [ ] The tree from README Step 9: `Layout`, `board-context.ts`, `types.ts`, `validate.ts`, `fakeApi.ts`, `components/TaskForm.tsx`, and **five** pages
- [ ] `types.ts` has `TaskFormValues` and `Task extends TaskFormValues` with a `readonly id`
- [ ] `validate.ts` is **pure** and proved with a throwaway Node script printing at least six checks
- [ ] `main.tsx` has the `BrowserRouter`; `App.tsx` is **only** the route table

### 7.3 — Behaviour

- [ ] **List** page: toggle, remove, **filter** and **search** — both stored in the URL and surviving a refresh
- [ ] **Detail** page: all fields, an **Edit** link and a **Delete** button that navigates home
- [ ] **New** and **Edit** pages use the **same** `TaskForm`
- [ ] The nav marks the current page (`NavLink`, with `end` where needed)
- [ ] `/tasks/999` shows a **"Task not found"** page; `/nope` shows the **404** page
- [ ] After **adding**, you land on the new task's page and **Back does not return to the form** (`replace`)
- [ ] Tasks survive navigating between pages (they live in `Layout`)

### 7.4 — Quality

- [ ] **No** `any`, no `@ts-ignore`, no `as` except the `name as FieldName` in the blur handler
- [ ] `npx tsc --noEmit -p tsconfig.app.json` prints **no errors**, and `npm run lint` prints no warnings
- [ ] `npm run build` succeeds
- [ ] No internal `<a href>` anywhere — `grep` proves it
- [ ] Every URL param and search param is **parsed** before use — nothing trusts the address bar
- [ ] No browser console warnings or errors while using the app
- [ ] You can explain every line of `Layout.tsx` and `TaskListPage.tsx` out loud

**✅ Deliverable:** `task-board-v2/` + 1 screenshot of the list page **with the URL visible** (a filter and a search in it).

---

## Task 8 — Build: Task Board v2 — The Form

### 8.1 — One Form, Two Jobs

- [ ] `TaskForm` takes `initial`, `submitLabel`, `checkPast` and an **async** `onSubmit` — and **nothing else**
- [ ] It's **controlled**, with one `values` object and one `handleChange`
- [ ] Fields: title, priority (**radio group** in a `<fieldset>`), due date, notes (**textarea** with a live `n / 200` counter) and a done checkbox
- [ ] **Edit** passes a `key={task.id}` — and you proved the form updates when you go from `/tasks/1/edit` to `/tasks/2/edit`

### 8.2 — Validation

- [ ] Title: required, 3–80 characters after trimming
- [ ] Due date: **can't be in the past when creating**, but an old task can stay overdue when editing
- [ ] Notes: ≤ 200 characters
- [ ] Errors appear on **blur** and on **submit**; submit shows **all** and focuses the first invalid field
- [ ] The values are **trimmed** before they're saved

### 8.3 — Submit

- [ ] The button is disabled and reads **"Saving…"** while saving
- [ ] A **server error** (your fake API rejecting a specific title) shows in a `role="alert"` message and **keeps** what the user typed
- [ ] On success the page navigates away; the form does not try to reset itself
- [ ] A double-click on **Add task** adds **one** task

### 8.4 — Accessibility

- [ ] Every field has a label; every error has `aria-describedby` and `aria-invalid`
- [ ] You used the **whole** app with the keyboard only — add, filter, edit, delete
- [ ] Focus lands somewhere sensible after a failed submit

### 8.5 — Screenshots

- [ ] A screenshot of the form **with errors showing**
- [ ] A screenshot of the **server-error** state **or** the "Saving…" state

**✅ Deliverable:** `TaskForm.tsx` + 2 screenshots.

---

## Task 9 — Your Feature, Built Into the Board

Pick **one** feature that is yours. It must touch **both** a form and a route — not just CSS.

Ideas: a **`/tasks/:id/duplicate`** route that opens the form pre-filled · **tags** (a comma-separated field) with a **`/tag/:name`** page · a **due-soon** filter stored in the URL · **sort by** due date or priority, stored in the URL · a **`/stats`** page · an **"unsaved changes"** warning when leaving a dirty form · a **bulk-add** form that adds several tasks from a pasted list.

- [ ] Wrote `FEATURE.md`: what it is and **why it's useful**
- [ ] Added fields to `types.ts` and updated `INITIAL` data if needed
- [ ] New code has typed props / typed hooks, no `any`
- [ ] Added at least one **new validation rule** or **new route** — and covered it in your throwaway script or a screenshot
- [ ] Anything you can compute is **derived**, not stored; anything that should survive refresh and sharing is in the **URL**
- [ ] `FEATURE.md` says where each new piece of state lives and why, in one sentence each
- [ ] `tsc`, `lint` and `npm run build` still pass
- [ ] Screenshot of the feature in use

**✅ Deliverable:** code + `FEATURE.md` + 1 screenshot.

---

## Task 10 — Break It — Four Bugs, On Purpose

Create `BREAK-IT.md` in `task-board-v2/`. For each bug: make the change, **screenshot** what goes wrong, write what you saw and **why**, then fix it.

### 10.1 — `<a href>` Instead of `<Link>`

- [ ] Changed the "New task" nav link to `<a href>`, added a task, clicked it, and screenshotted the tasks **gone** (and a document request in the Network tab)

### 10.2 — The Param Is a String

- [ ] Wrote `t.id === id` in `TaskDetailPage`, screenshotted every task being "not found", fixed with `Number(id)`

### 10.3 — No Double-Submit Guard

- [ ] Removed `disabled={submitting}` **and** the early return, double-clicked **Add task**, screenshotted the duplicate, restored both

### 10.4 — `NavLink` Without `end`

- [ ] Removed `end` from the Tasks link, screenshotted it active on every page, restored it

### 10.5 — After

- [ ] After all four fixes the app is `tsc`- and `lint`-clean and the console is empty
- [ ] `BREAK-IT.md` ends with a paragraph: **which bug would have been hardest to notice in a big app, and why?**

**✅ Deliverable:** `BREAK-IT.md` + 4 screenshots.

---

## Task 11 — Notes, Branch and Pull Request

### 11.1 — Repo Structure

```
your-repo/
├── day-05/ … day-07/
└── day-08/
    ├── NOTES.md
    ├── predictions.md
    ├── day-08-forms/        ← Tasks 2–6
    └── task-board-v2/       ← Tasks 7–10
        ├── docs/            (route-table.md, state-table.md)
        ├── src/
        ├── FEATURE.md
        ├── BREAK-IT.md
        └── package.json
```

- [ ] Every project has its own `package.json` and a `.gitignore` containing `node_modules` and `dist`
- [ ] **`node_modules` and `dist` are not committed** — screenshot `git ls-files` showing none
- [ ] Each project says how to run it: `npm install` then `npm run dev`

### 11.2 — `day-08/NOTES.md`

In your own words. If a sentence could have been copied from the README, rewrite it.

- [ ] **Controlled vs uncontrolled** — one example of each from your own code, and when you'd pick which
- [ ] **Why errors are derived, not stored** — with your own stale-error bug as the example
- [ ] **`touched`** — what it is and why a form needs it
- [ ] **The four states of a submit** and how your form handles each
- [ ] **`<Link>` vs `<a href>`** — what the browser does differently, with your own screenshot
- [ ] **Why a route's `id` is a string** — and what you do about a URL you don't recognise
- [ ] **State in the URL vs `useState`** — one value from your board that you moved to the URL and why
- [ ] **Why `tasks` lives in `Layout`** — what would break if it lived in `TaskListPage`
- [ ] **`replace` vs push** — where you used each and why
- [ ] **A real bug** that wasn't in the README: the exact error, how you found it, the fix
- [ ] The output of `npm ls react react-router` (to show your versions)

> The bug section is not optional. If nothing broke, you copy-pasted.

### 11.3 — Branch, Commits and PR

- [ ] All work was done on `feature/day-08`
- [ ] Every commit has an imperative, specific message
- [ ] At least **five** commits (forms labs, routing labs, the board, the form, the feature)
- [ ] Opened a pull request, wrote a description, and **merged** it
- [ ] Ran `git log --oneline --graph -15` and screenshotted it

**✅ Deliverable:** repo link + merged PR link + `git log` screenshot.

---

## Task 12 — Share It

- [ ] Post on **LinkedIn** about completing Day 8 — forms and routing in React
- [ ] Include a screenshot of the Task Board **with the filter in the URL**
- [ ] Include the link to your repo **and** your merged pull request
- [ ] Show one before-and-after: your Day 07 `useState` filter next to the URL-driven one, **or** your Day 07 `AddTaskForm` next to `TaskForm`
- [ ] Say one concrete thing you understood that you didn't before — why errors are derived, why `id` is a string, why the layout owns the state. Not "excited to continue my journey".

**✅ Deliverable:** the link to your post.

---

## Bonus (Optional)

- [ ] Extract a reusable **`TextField`** component (label + input + error + hint) and use it for every text field in `TaskForm`
- [ ] Replace the hand-written form with **React Hook Form** — and list what it removed and what it hid
- [ ] Write the validation as a **Zod** schema and infer `TaskFormValues` from it with `z.infer`
- [ ] Add an **"unsaved changes — leave anyway?"** guard when navigating away from a dirty form
- [ ] Add **`<ScrollRestoration>`-style** behaviour by hand: scroll to the top on every route change (hint: `useLocation`) — and say what you need `useEffect` for
- [ ] Add a **lazy-loaded** route with `React.lazy` + `Suspense` and show the extra chunk in the Network tab
- [ ] Add a `/tasks?…` **deep link** that opens the list with a task highlighted — from a URL param
- [ ] Switch to **Data mode** (`createBrowserRouter` + `RouterProvider` from `react-router/dom`) and say what you gained
- [ ] Deploy the board to Netlify or Vercel with the **SPA rewrite** — and prove a refresh on `/tasks/2` works
- [ ] Read the **React Router "Picking a Mode"** page and write three sentences on which mode you'd pick for Session 21's app

---

## Submission Checklist

- [ ] **Task 1** — `predictions.md` with wrong answers explained + screenshot
- [ ] **Task 2** — `ControlsLab.tsx` + screenshot
- [ ] **Task 3** — `validate.ts` + `ValidationLab.tsx` + screenshot with errors
- [ ] **Task 4** — `fakeApi.ts` + `SavingLab.tsx` + screenshot (Saving… and error)
- [ ] **Task 5** — `routing/` + screenshot
- [ ] **Task 6** — `UrlLab.tsx` + screenshot with the URL visible
- [ ] **Task 7** — `task-board-v2/` + screenshot (URL visible), `tsc`/`lint`/`build` clean
- [ ] **Task 8** — `TaskForm.tsx` + 2 screenshots
- [ ] **Task 9** — your feature + `FEATURE.md` + screenshot
- [ ] **Task 10** — `BREAK-IT.md` + 4 screenshots
- [ ] **Task 11** — repo link, `NOTES.md`, merged PR link, `git log` screenshot
- [ ] **Task 12** — LinkedIn post link

Submit all links together before the next session.

---

## How This Is Graded

| Level | What it looks like |
|---|---|
| ❌ **Incomplete** | Copy-pasted README code, predictions written after running, `<a href>` for an internal link, errors stored in state, a route param compared without converting, a search box that pushes a history entry per keystroke, state shared between pages that lives in a page, no double-submit protection, `any` or `@ts-ignore`, `node_modules` committed, everything done on `main`, no merged PR, or code you can't explain line by line |
| ✅ **Done** | All twelve tasks, a pure validation function proved by a script, one `TaskForm` for create **and** edit, five routes with a layout, filter and search in the URL and parsed safely, a not-found page for bad ids **and** bad URLs, your own feature, four bugs broken and fixed with screenshots, `NOTES.md` in your own words, a real bug documented, a merged PR |
| 🔥 **10%** | Done + the bonus + a feature that is genuinely yours + notes someone else could actually learn from |

---

## A Reminder

> **90%** study only — free, self-paced, no assignments turned in.
> **10%** study + assignments + more — I personally help this group get there.
>
> **If you show up for the 10%, I show up for you.**

The next session is **State Management — `useState`/`useEffect` and the Context API** — where your tasks survive a refresh, load from an API, and stop being passed down by hand. Come with Task Board v2 working and your PR merged.

---

← Back to [Day 08 README](README.md)
