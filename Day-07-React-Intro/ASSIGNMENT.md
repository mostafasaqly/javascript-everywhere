# Day 07 — Assignment

**Track 2 · Day 7 · React Intro: Components, Props, State & JSX**

> Day 06 left you with a Task Manager you drove with `render()` calls. Today you hand that job to React.
> **Tasks 1–7:** JSX, props, lists, state, immutable updates and controlled inputs — each one broken on purpose.
> **Tasks 8–10:** a **Task Board** you plan on paper first, a feature of your own, and the four bugs every React beginner ships.
> **Tasks 11–12:** notes, a branch and a pull request — and sharing it.

**⏱ Budget:** 10–12 hours · **📅 Duration:** 6 days · **🚩 Deadline:** before the next session

| # | Task | Part | Deliverable |
|---|---|---|---|
| 1 | Predict, then run | 1–3 | `predictions.md` + 1 screenshot |
| 2 | JSX lab | 1 | `src/JsxLab.tsx` + 1 screenshot |
| 3 | Props lab — typed props, defaults, `children` | 2 | `src/props-lab/` + 1 screenshot |
| 4 | Lists, keys and conditional rendering | 2 | `src/ListLab.tsx` + 1 screenshot |
| 5 | State lab — the snapshot and the updater | 3 | `src/StateLab.tsx` + 1 screenshot |
| 6 | Immutable updates lab | 3 | `src/ImmutableLab.tsx` + 1 screenshot |
| 7 | Controlled input + lifting state up | 3 | `src/lift/` + 1 screenshot |
| 8 | Build: the Task Board | 4 | `task-board/` folder + 2 screenshots |
| 9 | Your feature, built into the board | 4 | code + `FEATURE.md` + 1 screenshot |
| 10 | Break it — four bugs, on purpose | 2–4 | `BREAK-IT.md` + 4 screenshots |
| 11 | Notes, branch and pull request | — | `NOTES.md` + repo link + merged PR link |
| 12 | Share it | — | LinkedIn post link |

> **Type every line by hand. Do not copy-paste.** React has a lot of small syntax (`{ }`, `=>`, `<>`) and the only way it stops feeling strange is typing it.

> **Do this whole assignment on a branch.** Create `feature/day-07` before writing a single file, exactly as in Day 05.

> **Versions:** React 19.3, Vite 8, TypeScript 6 — whatever `npm create vite@latest day-07-react -- --template react-ts` gives you. Run `npm ls react` and put the version in your `NOTES.md`. Type form handlers as `SubmitEvent<HTMLFormElement>` (the old `React.FormEvent` is deprecated).

> **Where it goes:** the labs (Tasks 2–7) live in one Vite project, `day-07-react/`. The Task Board (Task 8) is its own project, `task-board/`, so you can reuse it in Session 12.

---

## Task 1 — Predict, Then Run

Twelve questions. For #1–#8 create a throwaway Vite project (or reuse your lab) and read each snippet as a **component** that's rendered in `App`. #9–#12 are written questions about what happens on screen.

### 1.1 — Write Your Predictions First

- [ ] Create `predictions.md`
- [ ] For **each** snippet, write exactly what appears on screen — or the **exact error or warning** — **before running anything**

```tsx
// 1 — what renders?
function A() {
  const name = "Sara";
  return <p>Hello, {name.toUpperCase()}!</p>;
}

// 2 — what renders?
function B() {
  const user = { name: "Omar", age: 30 };
  return <p>{user}</p>;
}

// 3 — what renders when items is []?
function C({ items }: { items: string[] }) {
  return <div>{items.length && <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>}</div>;
}

// 4 — what renders?  (the click is the first thing the user does)
function D() {
  let count = 0;
  return <button onClick={() => { count++; console.log(count); }}>{count}</button>;
}

// 5 — what number does the button show after ONE click?
function E() {
  const [n, setN] = useState(0);
  return <button onClick={() => { setN(n + 1); setN(n + 1); setN(n + 1); }}>{n}</button>;
}

// 6 — what number does the button show after ONE click?
function F() {
  const [n, setN] = useState(0);
  return <button onClick={() => { setN((c) => c + 1); setN((c) => c + 1); setN((c) => c + 1); }}>{n}</button>;
}

// 7 — what does console.log print on the click, and what does the button show afterwards?
function G() {
  const [n, setN] = useState(5);
  function click() {
    setN(10);
    console.log(n);
  }
  return <button onClick={click}>{n}</button>;
}

// 8 — user clicks "Add" once. What happens on screen?
function H() {
  const [list, setList] = useState<number[]>([1, 2]);
  function add() {
    list.push(3);
    setList(list);
  }
  return <button onClick={add}>{list.join(",")}</button>;
}
```

```tsx
// 9 — a list of rows with `key={index}`, each with a checkbox. The user ticks row 1
//     (the first row), then deletes row 1. Which row is ticked now, and why?

// 10 — <button onClick={handleSave()}>Save</button>
//      When does handleSave run, and what is passed to onClick?

// 11 — A component has `if (loggedIn) { const [x, setX] = useState(0); }`.
//      What goes wrong, and when?

// 12 — <input value={name} />   with no onChange.
//      What can the user do in the box, and what does React say in the console?
```

### 1.2 — Now Run Them

> Getting them wrong is the assignment. Getting them wrong and not explaining why is not.

- [ ] Ran #1–#8 and recorded the **actual** result next to each prediction
- [ ] Tried #9–#12 in code too (#9 as a small list, #10 with a `console.log`, #11 and #12 as written)
- [ ] For every one you got wrong, wrote **one sentence** explaining why
- [ ] For **#2, #3, #5 vs #6, #7, #8 and #9** named the mechanism explicitly (what React does, not just what you saw)
- [ ] Screenshotted the output
- [ ] Wrote down how many you got wrong, and which result surprised you most

**✅ Deliverable:** `predictions.md` + 1 screenshot.

---

## Task 2 — JSX Lab

Create `src/JsxLab.tsx` and render it from `App.tsx`. Run after every part.

### 2.1 — Expressions

- [ ] A component showing a name, a score array, the **average** (`toFixed(1)`) and a pass/fail label chosen with a **ternary**
- [ ] A value shown **as an attribute** with braces (`alt={name}`, `src={url}`), and another shown as a literal string — screenshot both in the DOM inspector
- [ ] An inline `style={{ … }}` using two camelCase properties, and a `className` from a CSS file
- [ ] A JSX comment `{/* … */}`

### 2.2 — Rules

- [ ] Returned two sibling elements wrapped in a **Fragment** (`<>…</>`)
- [ ] Used `htmlFor` on a `<label>` and `id` on its input; clicking the label focuses the input
- [ ] Self-closed `<br />`, `<hr />` and `<input />`

### 2.3 — Break It

One at a time. Read the error, write it as a comment, fix it.

- [ ] Used `class` instead of `className`
- [ ] Left two siblings without a parent
- [ ] Put an **object** inside `{ }` as content (`Objects are not valid as a React child`)
- [ ] Wrote `return` followed by a **newline** and JSX without parentheses — and described why it returns `undefined`
- [ ] Named a component in lowercase (`<greeting />`) and described what React does

**✅ Deliverable:** `JsxLab.tsx` + 1 screenshot.

---

## Task 3 — Props Lab

Create a `src/props-lab/` folder with one component per file.

### 3.1 — Typed Props

- [ ] `Badge.tsx` with an `interface BadgeProps`: a required `label`, an optional `tone` union with a default
- [ ] `Avatar.tsx` taking `name: string` and rendering the **initials** (compute them — don't pass them in)
- [ ] `Rating.tsx` taking `value: number` (0–5) and rendering that many ★ and the rest ☆ with `repeat`
- [ ] A component whose prop is an **object** typed with your own `interface`, rendering two of its fields

### 3.2 — `children`

- [ ] `Card.tsx` with a `title` and `children: ReactNode`
- [ ] Used `Card` three times with **different** content, including another component and a list inside one

### 3.3 — Composition

- [ ] A `ProfileCard` that is built **only** from `Card`, `Avatar`, `Badge` and `Rating` — no raw markup beyond a wrapper
- [ ] Rendered **three** `ProfileCard`s from an array of three profile objects

### 3.4 — Break It

- [ ] Omitted a required prop — copied the TypeScript error into a comment
- [ ] Passed `"5"` where a number was expected — copied the error
- [ ] Passed a tone that isn't in the union — copied the error
- [ ] Tried to **change a prop inside the child** (`props.label = "x"`) and wrote down what TypeScript says

**✅ Deliverable:** `props-lab/` + 1 screenshot of all three profile cards.

---

## Task 4 — Lists, Keys and Conditional Rendering

Create `src/ListLab.tsx`.

### 4.1 — Rendering a List

- [ ] Rendered an array of at least five objects with `.map`, each with `key={item.id}`
- [ ] Rendered a **filtered** and a **sorted** copy of the same array — sorted with `[...items].sort(…)` and a comment saying why the spread matters
- [ ] Rendered a list of lists (categories → items) with correct keys at **both** levels

### 4.2 — Conditionals

- [ ] An **empty state**, with an early `return`, when the array is `[]`
- [ ] A ternary showing one of two labels per row
- [ ] An `&&` showing an optional field only when it exists
- [ ] A component that returns `null` in one case

### 4.3 — The `0` Trap

- [ ] Rendered `{items.length && <List />}` with an empty array, screenshotted the stray **0**
- [ ] Fixed it with `items.length > 0 &&` and commented why

### 4.4 — Keys, On Purpose

Put a **checkbox** (uncontrolled — no `checked` prop) and a **text input** in each row, so each row holds state of its own.

- [ ] Used `key={index}`, ticked row 1, deleted row 1 (a button that removes the first item), and screenshotted the tick **moving to the wrong row**
- [ ] Switched to `key={item.id}` and proved the tick now follows the right row
- [ ] Removed the `key` entirely and copied the console warning verbatim

**✅ Deliverable:** `ListLab.tsx` + 1 screenshot (include the stray `0` **and** the wrong-row tick).

---

## Task 5 — State Lab

Create `src/StateLab.tsx`.

### 5.1 — Basics

- [ ] A counter with **+**, **−** and **Reset**
- [ ] A **toggle** (boolean state) that shows/hides a paragraph
- [ ] A **text input** mirrored live into a heading (`useState("")`)
- [ ] State holding an **object** — a `{ name, city }` — with two buttons that each change one field

### 5.2 — Why a Variable Isn't Enough

- [ ] A second counter using `let count = 0` — clicked it, showed the console counting while the screen stays at 0, and commented the two reasons
- [ ] Added `console.log("render")` to a component and described what **two logs per render** means in development

### 5.3 — The Snapshot and the Updater

- [ ] A button doing `setN(n + 1)` **three times** — screenshot it adding **1**
- [ ] The same button using `setN((c) => c + 1)` three times — screenshot it adding **3**
- [ ] A button that does `setN(10); console.log(n)` and shows the **old** value — commented why
- [ ] One sentence in a comment: when is `setN(value)` enough, and when do you need the updater?

### 5.4 — Break It

- [ ] Put `useState` inside an `if` — copied the error or warning
- [ ] Gave `useState([])` no type, tried to add a number, and copied the error — then fixed it with `useState<number[]>([])`

**✅ Deliverable:** `StateLab.tsx` + 1 screenshot.

---

## Task 6 — Immutable Updates Lab

Create `src/ImmutableLab.tsx` with an array of **five** task-like objects in state.

### 6.1 — The Four Patterns

- [ ] **Add** — `[...prev, newItem]` with a button
- [ ] **Remove** — `filter` by id
- [ ] **Update one field of one item** — `map` + `{ ...item, field: value }`
- [ ] **Update an object** in state — `{ ...prev, field: value }`

### 6.2 — Without Mutating Anything

- [ ] **Sort** by title using a copy (`[...prev].sort(…)`), with a button for A→Z and Z→A
- [ ] **Move an item up** one position — build a new array, don't `splice` the old one
- [ ] **Clear all done** — one `filter`
- [ ] **Toggle all** — one `map`

### 6.3 — Break It

- [ ] Wrote a button that **mutates** (`tasks.push(…); setTasks(tasks)`) — screenshotted that nothing changes
- [ ] Clicked another working button afterwards and showed the mutated value suddenly appear — commented why
- [ ] Wrote `tasks[0].done = true; setTasks([...tasks])` — a **shallow copy that still mutates** an object — and explained in a comment why this is still a bug even though the array is new
- [ ] Used `n.reverse()` inside an updater and described what React does

**✅ Deliverable:** `ImmutableLab.tsx` + 1 screenshot.

---

## Task 7 — Controlled Input + Lifting State Up

Create `src/lift/` with a small shopping-list app. **State lives in `App`-level parent `Shopping.tsx`; the pieces below it are components with props only.**

### 7.1 — The Pieces

- [ ] `Shopping.tsx` — owns `items: Item[]` (with `id`, `name`, `qty`, `bought`)
- [ ] `AddItem.tsx` — a **controlled** `name` input and a `qty` number input; submits with `onAdd(name, qty)`, then clears itself
- [ ] `ItemList.tsx` + `ItemRow.tsx` — render the list, with a checkbox for `bought` and a remove button
- [ ] `Summary.tsx` — shows "N items, M bought" computed from the list

### 7.2 — Rules

- [ ] **No** component below `Shopping` receives `setItems` — only specific handlers like `onToggle`, `onRemove`, `onAdd`
- [ ] The summary is **derived** in render — no `useState` for the counts
- [ ] Submitting an empty or whitespace-only name does nothing; `qty` is at least 1
- [ ] `e.preventDefault()` is called — and you removed it once to screenshot the page reloading
- [ ] Submit works with the **Enter key**

### 7.3 — Draw It

- [ ] Wrote (as a comment at the top of `Shopping.tsx`) the component tree and where each piece of state lives

**✅ Deliverable:** `lift/` + 1 screenshot.

---

## Task 8 — Build: The Task Board

Plan first, then build. Create a **new** Vite project `task-board/` (React + TypeScript).

### 8.1 — Plan on Paper

- [ ] Sketched the layout (any medium — paper, Excalidraw) and committed a photo or export as `docs/sketch.png`
- [ ] Wrote `docs/state-table.md`: **every piece of data**, whether it's **state or derived**, and **which component owns it**
- [ ] Your table has **exactly** the state from README 4.1 (tasks, filter, search, plus the form's own title and priority) — and no stored counters

### 8.2 — Structure

- [ ] `src/types.ts` — `Priority`, `Filter`, `Task` (with `readonly id`)
- [ ] `src/tasks.ts` — `visibleTasks` and `nextId` as **pure functions**, and a throwaway script proving them (`node src/tasks.test-run.ts`) printing `2 1 0 1 1 3`
- [ ] `src/components/` — `Header`, `AddTaskForm`, `FilterBar`, `TaskList`, `TaskItem`, `Footer` — **one component per file**, every one with a typed props `interface`
- [ ] `App.tsx` — all three pieces of top-level state and the handlers that replace the list

### 8.3 — Behaviour

- [ ] **Add** a task with a title and a priority (Enter submits; whitespace is rejected)
- [ ] **Toggle** done (checkbox) with a struck-through title
- [ ] **Remove** a task
- [ ] **Change priority** from a `<select>` on the row
- [ ] **Filter** All / Open / Done, with the active button marked `aria-pressed`
- [ ] **Search** by title, case-insensitive
- [ ] **Clear completed** — and the button is **hidden** when nothing is complete
- [ ] A header that says `N left` — and `All done 🎉` at zero
- [ ] **Two different empty states**: no tasks at all vs. no matches for the filter or search
- [ ] New ids come from `nextId` — never reused after a delete

### 8.4 — Quality

- [ ] **No** `any`, **no** `as` except the single `as Priority` on the `<select>`, **no** `@ts-ignore`
- [ ] `npx tsc --noEmit -p tsconfig.app.json` prints **no errors**, and `npm run lint` prints no warnings
- [ ] `npm run build` succeeds
- [ ] No state is mutated anywhere — you can point to every `map`, `filter` and spread
- [ ] Every list has a stable `key` from the data
- [ ] Every input has a visible or `aria-label` label; every button has text or an `aria-label`
- [ ] No console warnings or errors in the browser while using the app
- [ ] You can explain every line of `App.tsx` out loud

### 8.5 — Screenshots

- [ ] A screenshot of the app with **several tasks**, a filter selected and a search typed
- [ ] A screenshot of **both** empty states (two images or a collage)

**✅ Deliverable:** `task-board/` folder + 2 screenshots.

---

## Task 9 — Your Feature, Built Into the Board

Pick **one** feature that is yours, not mine. It must add **new state** or **a new component with props** — not just CSS.

Ideas: a **due date** with an "overdue" badge · **edit a title in place** (click → input → Enter/Escape) · **drag-free reordering** with up/down buttons · **tags** you can filter by · a **progress bar** · **undo** for the last delete (keep the previous array in state) · **dark mode** toggle · a **pomodoro-style timer** per task (careful: needs `useEffect` — skip unless you've read ahead).

- [ ] Wrote `FEATURE.md`: what the feature is and **why it's useful**
- [ ] Added the field(s) to `Task` in `types.ts` and updated `INITIAL` data
- [ ] New or changed component has a typed props `interface`
- [ ] State for the feature lives in the **right** place — and `FEATURE.md` says where and why in one sentence
- [ ] Anything you can compute is **derived**, not stored
- [ ] The feature works with **filter and search** and with remove
- [ ] `tsc` and `npm run build` still pass
- [ ] Screenshot of the feature in use

**✅ Deliverable:** code + `FEATURE.md` + 1 screenshot.

---

## Task 10 — Break It — Four Bugs, On Purpose

Create `BREAK-IT.md` in `task-board/`. For each bug below: make the change, **screenshot** what goes wrong, write what you saw and **why**, then fix it. Four sections, four screenshots.

### 10.1 — Mutated State

- [ ] Rewrote `toggleTask` to mutate (`tasks.find(…)!.done = true; setTasks(tasks)`), screenshotted the unchanged screen, fixed with `map` + spread

### 10.2 — Index as Key

- [ ] Changed `TaskList` to `key={index}`, put an uncontrolled checkbox or text input in each row, deleted a row above one you'd changed, screenshotted the wrong row holding the state, fixed with `task.id`

### 10.3 — Stale Snapshot

- [ ] Wrote `addTask` as `setTasks([...tasks, newTask])` and added a button that calls it **twice**; screenshotted **one** task appearing; fixed with `setTasks((prev) => …)`

### 10.4 — Stored Derived State

- [ ] Added `const [remaining, setRemaining] = useState(2)`, updated it in `addTask` but **not** in `removeTask`, screenshotted the counter disagreeing with the list, fixed by deleting the state and computing it

### 10.5 — After

- [ ] After all four fixes the app is back to `tsc`-clean and the browser console is empty
- [ ] `BREAK-IT.md` ends with a short paragraph: **which of the four bugs would you have been slowest to find in a big app, and why?**

**✅ Deliverable:** `BREAK-IT.md` + 4 screenshots.

---

## Task 11 — Notes, Branch and Pull Request

### 11.1 — Repo Structure

Your repo from Day 05/06 gets a Day 07 folder:

```
your-repo/
├── day-05/
├── day-06/
└── day-07/
    ├── NOTES.md
    ├── day-07-react/        ← Tasks 2–7
    │   ├── src/
    │   ├── package.json
    │   └── predictions.md   (or at day-07/predictions.md)
    └── task-board/          ← Tasks 8–10
        ├── docs/
        ├── src/
        ├── FEATURE.md
        ├── BREAK-IT.md
        └── package.json
```

- [ ] Every project has its own `package.json` and a `.gitignore` containing `node_modules` and `dist`
- [ ] **`node_modules` and `dist` are not committed** — run `git ls-files | findstr node_modules` (Windows) or `git ls-files | grep node_modules` and screenshot **no output**
- [ ] Each project's `README.md` (or the top-level one) says how to run it: `npm install` then `npm run dev`

### 11.2 — `day-07/NOTES.md`

In your own words. If a sentence could have been copied from the README, rewrite it.

- [ ] **UI = f(state)** — what it means, with one example from your own board
- [ ] **Props vs state** — one difference and one similarity
- [ ] **Why a plain variable doesn't work** as state (two reasons)
- [ ] **Why you never mutate state**, with your own bug as the example
- [ ] **What `key` does** and what you saw when it was wrong
- [ ] **Derived vs stored state** — one value from your board that you compute
- [ ] **Where each piece of state lives** and why — a short table
- [ ] **A real bug** you hit that wasn't in the README: the exact error, how you found it, the fix

> The bug section is not optional. If nothing broke, you copy-pasted.

### 11.3 — Branch, Commits and PR

- [ ] All work was done on `feature/day-07`
- [ ] Every commit has an imperative, specific message — no `update`, no `stuff`
- [ ] At least **five** commits (labs, then the board, then the feature)
- [ ] Opened a pull request, wrote a description, and **merged** it
- [ ] Ran `git log --oneline --graph -15` and screenshotted it

**✅ Deliverable:** repo link + merged PR link + `git log` screenshot.

---

## Task 12 — Share It

- [ ] Post on **LinkedIn** about completing Day 7 — your first React app
- [ ] Include the screenshot of your Task Board
- [ ] Include the link to your repo **and** your merged pull request
- [ ] Show one before-and-after: your Day 06 `render()` function next to the matching React component
- [ ] Say one concrete thing you understood that you didn't before — the snapshot, why `key` exists, why `setX(x + 1)` three times adds one. Not "excited to continue my journey".

**✅ Deliverable:** the link to your post.

---

## Bonus (Optional)

- [ ] Write a **custom hook** `useCounter(initial)` returning `{ count, increment, decrement, reset }`, and use it in two components — and say what `use…` means for the rules of hooks
- [ ] Replace the task handlers with **`useReducer`** and a typed action union (`{ type: "add"; … } | { type: "toggle"; id: number } | …`)
- [ ] Add a typed `<Select<T>>` **generic component** whose `onChange` returns `T`
- [ ] Add **keyboard shortcuts** (`/` focuses search, `Esc` clears it) — and say honestly what you had to look up
- [ ] Make the board **fully usable with a keyboard and a screen-reader pass** — no mouse, correct focus after add and delete
- [ ] Add `React.memo` to `TaskItem`, log renders, and show how many rows re-render when you toggle one — then read about the **React Compiler** (react.dev) and say why you might not need `memo` at all
- [ ] Write **three** unit tests for `visibleTasks` using `node:test` (Day 06 style)
- [ ] Replace the `INITIAL` list with the Day 06 **API** using `fetch` in a click handler (no `useEffect` yet) — and note what's awkward about it
- [ ] Deploy the board to **GitHub Pages**, Netlify or Vercel and add the live link to your repo
- [ ] Read the first page of **react.dev → "Thinking in React"** and add a comment to `docs/state-table.md` where you'd now do it differently

---

## Submission Checklist

- [ ] **Task 1** — `predictions.md` with wrong answers explained + screenshot
- [ ] **Task 2** — `JsxLab.tsx` + screenshot (with the five break-it errors in comments)
- [ ] **Task 3** — `props-lab/` + screenshot of three `ProfileCard`s
- [ ] **Task 4** — `ListLab.tsx` + screenshot (stray `0` **and** wrong-row tick)
- [ ] **Task 5** — `StateLab.tsx` + screenshot (the +1 vs +3 buttons)
- [ ] **Task 6** — `ImmutableLab.tsx` + screenshot (the mutated button doing nothing)
- [ ] **Task 7** — `lift/` + screenshot + tree comment
- [ ] **Task 8** — `task-board/` + 2 screenshots, `tsc` and `build` clean
- [ ] **Task 9** — your feature + `FEATURE.md` + screenshot
- [ ] **Task 10** — `BREAK-IT.md` + 4 screenshots
- [ ] **Task 11** — repo link, `NOTES.md`, merged PR link, `git log` screenshot
- [ ] **Task 12** — LinkedIn post link

Submit all links together before the next session.

---

## How This Is Graded

| Level | What it looks like |
|---|---|
| ❌ **Incomplete** | Copy-pasted README code, predictions written after running, any state mutated, `key={index}` on a list that changes, a stored value that could be derived, `any` or `@ts-ignore`, a component that receives `setTasks`, `node_modules` committed, everything done on `main`, no merged PR, or code you can't explain line by line |
| ✅ **Done** | All twelve tasks, a board where every list has a data key and every update **replaces** state, typed props on every component, state placed on purpose and documented in `state-table.md`, two empty states, your own feature, four bugs broken and fixed with screenshots, `NOTES.md` in your own words, a real bug documented, a merged PR |
| 🔥 **10%** | Done + the bonus + a feature that is genuinely yours + notes someone else could actually learn from |

---

## A Reminder

> **90%** study only — free, self-paced, no assignments turned in.
> **10%** study + assignments + more — I personally help this group get there.
>
> **If you show up for the 10%, I show up for you.**

The next session is **Forms in React (Controlled Components) + Routing (React Router)** — where your `AddTaskForm` grows up, and the board gets more than one page. Come with the Task Board working and your PR merged.

---

← Back to [Day 07 README](README.md)
