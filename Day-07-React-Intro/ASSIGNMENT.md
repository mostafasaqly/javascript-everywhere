# Day 07 — Assignment

**Track 2 · Day 7 · React Intro: Components, Props, State & JSX**

> Day 06 left you with a Task Manager you drove with `render()` calls. Today you hand that job to React.
>
> This assignment is **problems, not checklists**. Each problem tells you **what** to build — the input, the expected output, the constraints and a set of examples — and leaves the **how** to you. Read it, break it into pieces, sketch your approach, *then* code. If all your examples produce the expected output, you've solved it.

**⏱ Budget:** ~7 hours · **📅 Duration:** 6 days · **🚩 Deadline:** before the next session

| # | Task | Topics | Difficulty | ⏱ |
|---|---|---|---|---|
| — | Warm-up — predict the output | the snapshot, mutation, JSX rules | — | 30 min |
| P1 | Problem — Star Rating | props, JSX, defaults | 🟢 Easy | 45 min |
| P2 | Problem — Product Catalog | lists, keys, conditional rendering | 🟡 Medium | 1 h 15 |
| P3 | Problem — Shopping List | state, controlled input, immutable updates, lifting state | 🟡 Medium | 1 h 30 |
| P4 | Problem — Extend the Task Board | derived state, where state lives | 🟠 Medium+ | 2 h |
| — | Ship it | notes, PR, LinkedIn | — | 45 min |

> **The Task Board itself is not homework.** You build it while following README Part 4. Problem 4 asks you to *extend* it — so finish the follow-along first.

---

## How to Work a Problem

Every problem has the same shape. Follow the same five steps every time — this is the habit the assignment is really training.

1. **Read the whole problem twice.** Including the examples and constraints. Most bugs come from a constraint you skimmed.
2. **Write your approach first.** In `APPROACH.md`, under the problem's name, write **2–5 lines** *before* any code: which components, what state (if any) and who owns it, and how you'll turn the input into the output. It can be wrong — you'll fix it later — but it must be written first.
3. **Code it.** Type it yourself. No copy-paste from the README or anywhere else.
4. **Test it against every example.** Render each example and compare the screen to the expected output, character by character.
5. **Only then open the hints** — if you're stuck for more than 20 minutes. Each hint gives away a little more than the last; open one at a time.

> **Where it goes:** Problems 1–3 live in one Vite project, `day-07-problems/` (`npm create vite@latest day-07-problems -- --template react-ts`), one folder per problem under `src/`. Problem 4 lives in your README `task-board/` project.

> **Rules for every problem:** TypeScript with typed props · no `any`, no `@ts-ignore` · no state mutated · every list keyed by data, never by index · anything you can compute is computed, not stored.

---

## Warm-up — Predict the Output

Six snippets. For each one write your prediction in `predictions.md` **before** running anything. Then run them, write the actual result next to your prediction, and for every one you got wrong write **one sentence** on *why*.

```tsx
// 1 — What renders?
function A() {
  const user = { name: "Omar", age: 30 };
  return <p>{user}</p>;
}

// 2 — What renders when items is []?
function B({ items }: { items: string[] }) {
  return <div>{items.length && <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>}</div>;
}

// 3 — The user clicks three times. What does the console show, and what does the button show?
function C() {
  let count = 0;
  return <button onClick={() => { count++; console.log(count); }}>{count}</button>;
}

// 4 — What number does the button show after ONE click?
function D() {
  const [n, setN] = useState(0);
  return <button onClick={() => { setN(n + 1); setN(n + 1); setN(n + 1); }}>{n}</button>;
}

// 5 — And this one, after ONE click?
function E() {
  const [n, setN] = useState(0);
  return <button onClick={() => { setN((c) => c + 1); setN((c) => c + 1); setN((c) => c + 1); }}>{n}</button>;
}

// 6 — The user clicks once. What changes on screen?
function F() {
  const [list, setList] = useState<number[]>([1, 2]);
  return <button onClick={() => { list.push(3); setList(list); }}>{list.join(",")}</button>;
}
```

**✅ Deliverable:** `predictions.md` — prediction, actual result, and a "why" for each one you missed.

---

## Problem 1 — Star Rating

🟢 **Easy** · props, JSX, default values

### Description

Build a `Rating` component that shows a score as stars.

### Signature

```tsx
interface RatingProps {
  value: number;   // the score — may be a decimal, negative, too big, or NaN
  max?: number;    // how many stars in total — defaults to 5
  label?: string;  // optional text shown before the stars
}

export function Rating({ value, max, label }: RatingProps)   // returns the line, or null
```

### Output

One line of text:

```
[label: ]<filled stars><empty stars> (<filled>/<max>)
```

- Filled star is `★`, empty star is `☆`.
- The number of filled stars is `value` **rounded to the nearest whole number**, then **kept between 0 and `max`**.
- If `label` is given, it comes first, followed by `: `.
- If `max` is not a positive whole number, render **nothing at all**.
- A screen reader should announce `"3 out of 5"` — **not** read out five star characters.

### Examples

| # | Input | Output |
|---|---|---|
| 1 | `<Rating value={3} />` | `★★★☆☆ (3/5)` |
| 2 | `<Rating value={4.6} max={10} label="Food" />` | `Food: ★★★★★☆☆☆☆☆ (5/10)` |
| 3 | `<Rating value={2.5} />` | `★★★☆☆ (3/5)` |
| 4 | `<Rating value={-2} />` | `☆☆☆☆☆ (0/5)` |
| 5 | `<Rating value={9} max={3} />` | `★★★ (3/3)` |
| 6 | `<Rating value={NaN} label="Service" />` | `Service: ☆☆☆☆☆ (0/5)` |
| 7 | `<Rating value={2} max={0} />` | *(nothing)* |
| 8 | `<Rating value={2} max={2.5} />` | *(nothing)* |

### Constraints

- `Rating` must not crash for **any** `number` — including `NaN`, `Infinity` and `-Infinity`.
- No loops written by hand — there is a string method that repeats a character.
- Render all eight examples on one demo page, **from an array of example props** using `.map` (each needs a key — what is a good key here?).

<details>
<summary>💡 Hint 1</summary>

Split it into two jobs: **compute** the filled count (plain math, no JSX), then **render** it. Write the computing part as a small function outside the component — you can test it with `console.log` alone.
</details>

<details>
<summary>💡 Hint 2</summary>

`Math.round(NaN)` is `NaN`, and `Math.min(5, NaN)` is also `NaN`. Decide what NaN should become **before** you clamp. `Number.isNaN` and `Number.isInteger` are your friends.
</details>

<details>
<summary>💡 Hint 3</summary>

For the screen reader: wrap the stars in an element with `role="img"` and an `aria-label` — and hide the raw characters from assistive tech.
</details>

**✅ Deliverable:** `src/rating/Rating.tsx` + the demo page + 1 screenshot showing all eight examples.

---

## Problem 2 — Product Catalog

🟡 **Medium** · lists, keys, conditional rendering, not mutating props

### Description

A shop gives you a flat array of products. Show them **grouped by category**, sorted, with sold-out items optionally hidden.

### Signature

```tsx
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;     // in EGP
  inStock: boolean;
}

export function Catalog({ products, showSoldOut }: { products: Product[]; showSoldOut: boolean })
```

### Output Rules

1. One heading per category: `Category (n)`, where `n` is how many products are **shown** in it.
2. Categories in **A → Z** order.
3. Inside a category, products by **price, cheapest first**. Same price → by **name A → Z**.
4. Each product: `Name — 15.00 EGP` (always two decimals). A sold-out product, when shown, ends with ` · Sold out`.
5. When `showSoldOut` is `false`, sold-out products are hidden — and a category with **no** visible products is not shown at all.
6. Last line: `Showing X of Y products`.
7. Empty states **replace everything** (no headings, no footer line):
   - `products` is empty → `No products yet.`
   - products exist but none are visible → `Everything is sold out.`

### Test Data

```ts
const PRODUCTS: Product[] = [
  { id: 1, name: "Milk",   category: "Dairy",  price: 32,   inStock: true  },
  { id: 2, name: "Apple",  category: "Fruit",  price: 45.5, inStock: true  },
  { id: 3, name: "Cheese", category: "Dairy",  price: 120,  inStock: false },
  { id: 4, name: "Banana", category: "Fruit",  price: 30,   inStock: true  },
  { id: 5, name: "Yogurt", category: "Dairy",  price: 15,   inStock: true  },
  { id: 6, name: "Bread",  category: "Bakery", price: 15,   inStock: false },
];
```

### Examples

**Example 1** — `products = PRODUCTS`, `showSoldOut = true`

```
Bakery (1)
  Bread — 15.00 EGP · Sold out
Dairy (3)
  Yogurt — 15.00 EGP
  Milk — 32.00 EGP
  Cheese — 120.00 EGP · Sold out
Fruit (2)
  Banana — 30.00 EGP
  Apple — 45.50 EGP
Showing 6 of 6 products
```

**Example 2** — `products = PRODUCTS`, `showSoldOut = false`

```
Dairy (2)
  Yogurt — 15.00 EGP
  Milk — 32.00 EGP
Fruit (2)
  Banana — 30.00 EGP
  Apple — 45.50 EGP
Showing 4 of 6 products
```

**Example 3** — `products = [...PRODUCTS, { id: 7, name: "Butter", category: "Dairy", price: 15, inStock: true }]`, `showSoldOut = false`

```
Dairy (3)
  Butter — 15.00 EGP
  Yogurt — 15.00 EGP
  Milk — 32.00 EGP
Fruit (2)
  Banana — 30.00 EGP
  Apple — 45.50 EGP
Showing 5 of 7 products
```

**Example 4** — `products = []`, `showSoldOut = true` → `No products yet.`

**Example 5** — `products = [Cheese, Bread]` (both sold out), `showSoldOut = false` → `Everything is sold out.`

### Constraints

- `Catalog` must **not change the array it receives.** Prove it: `console.log(PRODUCTS.map((p) => p.id).join(","))` after rendering prints `1,2,3,4,5,6`.
- Keys must come from the data — at **both** levels (categories and products).
- No `useState` — this problem has no state at all. Everything is derived from props.
- The demo page renders Examples 1–5 one under the other.

<details>
<summary>💡 Hint 1</summary>

Do it in three stages, each a plain function you can `console.log`: **filter** → **group** (category → products) → **sort**. Only the last step is JSX.
</details>

<details>
<summary>💡 Hint 2</summary>

`.sort()` sorts **in place** — on an array that's a prop, that's a mutation. Sort a copy. For the tie-break: a comparator can return `a.price - b.price || a.name.localeCompare(b.name)`.
</details>

<details>
<summary>💡 Hint 3</summary>

To group: `reduce` into an object (`Record<string, Product[]>`), then `Object.keys(...)` sorted gives the category order. The category name itself is a perfectly good key — it's unique.
</details>

**✅ Deliverable:** `src/catalog/Catalog.tsx` + demo page + 1 screenshot showing all five examples.

---

## Problem 3 — Shopping List

🟡 **Medium** · `useState`, controlled input, immutable updates, lifting state up, the updater function

### Description

A shopping list where you add items by name and change their quantity. Adding something that's already on the list **doesn't** make a second row — it bumps the quantity.

### Data

```ts
interface Item {
  readonly id: number;
  name: string;
  qty: number;   // always ≥ 1
}
```

### Behaviour

- A text input and an **Add** button. Pressing **Enter** in the input also adds.
- The name is **trimmed**. An empty (or spaces-only) name adds nothing.
- If an item with the same name already exists — **ignoring case and surrounding spaces** — its `qty` goes up by 1 and **its original spelling is kept**. No new row.
- After a successful add, the input is cleared.
- Each row shows `Name ×qty` and four buttons: **−**, **+**, **+3** and **Remove**.
- **−** on an item with `qty` 1 removes it.
- **+3** must be implemented by calling the row's `onIncrease(id)` handler **three times in a row** — not by passing `3` anywhere. It must add exactly 3.
- A summary line: `2 items · 5 units` — with correct singular forms (`1 item · 1 unit`). When the list is empty, show `Your list is empty.` instead of the summary.

### Example — a sequence of actions

Start from an empty list and do these in order:

| # | Action | Rows after | Summary after |
|---|---|---|---|
| 1 | *(page loads)* | — | `Your list is empty.` |
| 2 | add `Milk` | Milk ×1 | `1 item · 1 unit` |
| 3 | add `  bread  ` | Milk ×1, bread ×1 | `2 items · 2 units` |
| 4 | add `MILK` | Milk ×2, bread ×1 | `2 items · 3 units` |
| 5 | add `   ` | *(unchanged)* | `2 items · 3 units` |
| 6 | **+3** on bread | Milk ×2, bread ×4 | `2 items · 6 units` |
| 7 | **−** on Milk, twice | bread ×4 | `1 item · 4 units` |
| 8 | add `milk` | bread ×4, milk ×1 | `2 items · 5 units` |
| 9 | **Remove** bread | milk ×1 | `1 item · 1 unit` |

### Constraints

- **Exactly one** component owns the list. Split the rest into components however you like — but **no component receives `setItems`**. Children get specific handlers (`onAdd`, `onIncrease`, …).
- The summary is **derived** — no `useState` for counts.
- Ids are never reused: removing an item and adding a new one must not produce a duplicate key.
- At the top of the owner component, a comment with your **component tree** and where the state lives.

<details>
<summary>💡 Hint 1</summary>

Write `addItem(name)` on paper before code. It has three branches: empty → do nothing; exists → map; new → append. Which one needs to know about the *current* list?
</details>

<details>
<summary>💡 Hint 2</summary>

If **+3** only adds 1, re-read Warm-up snippets 4 and 5. Your handler is reading a snapshot.
</details>

<details>
<summary>💡 Hint 3</summary>

"**−** at 1 removes it" is easiest as one `setItems` call: map the quantities down, then `filter` out anything that reached 0.
</details>

**✅ Deliverable:** `src/shopping/` + 1 screenshot of the list after step 8.

---

## Problem 4 — Extend the Task Board

🟠 **Medium+** · derived state, pure functions, where state should live

### Description

Start from the Task Board you built in README Part 4. Add two features: **sorting** and **edit in place**.

### Feature A — Sort

- A `<select>` next to the filter bar with three options: **Added** (default), **Priority**, **A → Z**.
  - **Added** — by `id`, oldest first.
  - **Priority** — `high` → `medium` → `low`; same priority → by `id`.
  - **A → Z** — by title, **ignoring case**.
- Sort works **together** with the filter and the search.
- Write it as a pure function in `tasks.ts`:

  ```ts
  export type Sort = "added" | "priority" | "title";
  export function sortTasks(tasks: Task[], sort: Sort): Task[]
  ```

### Feature B — Edit a Title in Place

- **Double-click** a title → it becomes a text input, filled with the current title and focused.
- **Enter** saves the **trimmed** title. **Escape** cancels.
- Saving an empty (or spaces-only) title **cancels** — the old title stays.
- **Only one row** can be in edit mode at a time: double-clicking another row moves edit mode there.

### Examples

Start from the README's `INITIAL` tasks (1 "Read the Day 07 README" high ✓ · 2 "Set up Vite" low ✓ · 3 "Build the Task Board" high).

| # | Action | Expected list (top → bottom) |
|---|---|---|
| 1 | Sort: **Priority** | Read the Day 07 README · Build the Task Board · Set up Vite |
| 2 | Sort: **A → Z** | Build the Task Board · Read the Day 07 README · Set up Vite |
| 3 | Add `apply to 3 jobs` (medium), sort still **A → Z** | **apply to 3 jobs** · Build the Task Board · Read the Day 07 README · Set up Vite |
| 4 | Sort: **Added** | Read the Day 07 README · Set up Vite · Build the Task Board · apply to 3 jobs |
| 5 | Filter **Done** + Sort **A → Z** | Read the Day 07 README · Set up Vite |
| 6 | Double-click "Set up Vite", type `  Set up Vite 8 `, Enter | title is now `Set up Vite 8` |
| 7 | Double-click it again, delete everything, Enter | title stays `Set up Vite 8` |
| 8 | Double-click row 1, then double-click row 3 | only row 3 is an input |
| 9 | Double-click a title, type something, Escape | title unchanged |

### Constraints

- `sortTasks` **never mutates** its input — and you prove it with a throwaway script (`node src/sort.test-run.ts`) that prints the original order before and after sorting.
- Sorting must not be stored: the visible list is still **derived** on every render.
- Example 3 is a trap. Make sure your A → Z isn't fooled by the lowercase `a`.
- In `FEATURE.md`, answer in **one sentence each**: where does the sort value live, where does "which row is being edited" live, and **why there**?
- `npx tsc --noEmit -p tsconfig.app.json`, `npm run lint` and `npm run build` all pass.

<details>
<summary>💡 Hint 1</summary>

Order of operations matters: `sortTasks(visibleTasks(tasks, filter, search), sort)`. Which one runs first doesn't change the result — but which one runs on fewer items?
</details>

<details>
<summary>💡 Hint 2</summary>

For priority, map each value to a number: `const RANK = { high: 0, medium: 1, low: 2 }`. For titles, `"a" < "B"` is **false** in JavaScript — compare with `localeCompare` instead.
</details>

<details>
<summary>💡 Hint 3</summary>

"Only one row at a time" means the rows have to *know about each other* — so the editing state can't live inside each row. One `editingId: number | null`, owned higher up.
</details>

**✅ Deliverable:** updated `task-board/` + `FEATURE.md` + 1 screenshot (a sort applied **and** a row in edit mode).

---

## Ship It

### Repo

```
your-repo/
└── day-07/
    ├── NOTES.md
    ├── predictions.md
    ├── APPROACH.md
    ├── day-07-problems/     ← Problems 1–3
    └── task-board/          ← README Part 4 + Problem 4
```

- All work on a `feature/day-07` branch, with clear commit messages, merged through a **pull request**.
- `node_modules` and `dist` are **not** committed.

### `day-07/NOTES.md` — four short answers, in your own words

1. **Props vs state** — one difference, one similarity.
2. **Why you never mutate state** — use something you saw in this assignment.
3. **Derived vs stored** — one value from your code that you compute instead of storing, and what would go wrong if you stored it.
4. **One real bug** you hit: the exact error or symptom, how you found it, the fix.

### LinkedIn

A short post about Day 7 with a screenshot of one of your problems, your repo link, and **one concrete thing that clicked** (not "excited to continue my journey").

**✅ Deliverable:** repo link + merged PR link + LinkedIn post link.

---

## Bonus (Optional) — Challenge Problems

<details>
<summary>⭐ Challenge 1 — Undo Counter</summary>

A counter with **+1**, **−1**, **+10** and **Undo**. Undo reverts the last change, all the way back to the start; at the start Undo is **disabled**. Show the history as `0 → 1 → 11 → 10`.

Constraint: store **only one** piece of state. The current value is derived from it.

| Action | Screen |
|---|---|
| start | `0` · history `0` · Undo disabled |
| +1, +10, −1 | `10` · history `0 → 1 → 11 → 10` |
| Undo | `11` · history `0 → 1 → 11` |
| Undo ×2 | `0` · Undo disabled |
</details>

<details>
<summary>⭐ Challenge 2 — <code>useReducer</code> Board</summary>

Replace the Task Board's handlers with `useReducer` and a typed action union (`{ type: "add"; … } | { type: "toggle"; id: number } | …`). Every example from Problem 4 must still pass.
</details>

<details>
<summary>⭐ Challenge 3 — Tests</summary>

Write unit tests for `sortTasks` and `visibleTasks` with `node:test` (Day 06 style) — at least one test per sort option and one that proves the input isn't mutated.
</details>

<details>
<summary>⭐ Challenge 4 — Deploy</summary>

Deploy the Task Board to GitHub Pages, Netlify or Vercel and put the live link in your repo's README.
</details>

---

## How This Is Graded

| Level | What it looks like |
|---|---|
| ❌ **Incomplete** | An example that doesn't match its expected output, approach written after the code, copy-pasted code, state mutated, `key={index}`, a stored value that could be derived, `any` or `@ts-ignore`, `node_modules` committed, no merged PR, or code you can't explain line by line |
| ✅ **Done** | Warm-up done honestly · Problems 1–4 pass **every** example · `APPROACH.md` written before each problem · notes in your own words · a merged PR |
| 🔥 **10%** | Done + the challenge problems + notes someone else could learn from |

---

## A Reminder

> **90%** study only — free, self-paced, no assignments turned in.
> **10%** study + assignments + more — I personally help this group get there.
>
> **If you show up for the 10%, I show up for you.**

The next session is **Forms in React (Controlled Components) + Routing (React Router)** — where your `AddTaskForm` grows up, and the board gets more than one page. Come with the Task Board working and your PR merged.

---

← Back to [Day 07 README](README.md)
