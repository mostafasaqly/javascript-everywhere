# Day 09 — Assignment

**Track 2 · Day 9 · State Management — `useState`/`useEffect` & the Context API**

> Day 08 gave your Task Board real URLs. Today it gets a real store — and a memory.
>
> Same format as Days 07 and 08: **problems, not checklists**. Each problem gives you the input, the expected output, the constraints and a set of examples. The **how** is yours. Read it, break it down, write your approach, *then* code — and you're done when every example produces the expected output.

**⏱ Budget:** ~7–8 hours · **📅 Duration:** 6 days · **🚩 Deadline:** before the next session

| # | Task | Topics | Difficulty | ⏱ |
|---|---|---|---|---|
| — | Warm-up — predict the output | effects, closures, context | — | 30 min |
| P1 | Problem — `cartReducer` | reducers, immutability, same-reference | 🟢 Easy | 1 h |
| P2 | Problem — Focus Timer | `useEffect`, intervals, cleanup, `document.title` | 🟡 Medium | 1 h 30 |
| P3 | Problem — Settings Provider | Context, parsing `localStorage`, syncing `<html>` | 🟡 Medium | 2 h |
| P4 | Problem — Extend Task Board v3 | undo with a timer, sync across tabs | 🟠 Medium+ | 2 h |
| — | Ship it | notes, PR, LinkedIn | — | 45 min |

> **Task Board v3 itself is not homework.** You build it while following README Part 3. Problem 4 asks you to *extend* it — so finish the follow-along first.

---

## How to Work a Problem

Same five steps as before:

1. **Read the whole problem twice** — examples and constraints included.
2. **Write your approach first** in `APPROACH.md` — 2–5 lines per problem, *before* any code.
3. **Code it** yourself. No copy-paste.
4. **Test it against every example**, character by character.
5. **Open a hint only after 20 minutes stuck** — one at a time.

> **Where it goes:** Problems 1–3 live in one Vite project, `day-09-problems/` (React + TypeScript), one folder per problem under `src/`. Problem 4 lives in your README `task-board-v3/` project.

> **Versions:** React 19.3, React Router 8, Vite 8, TypeScript 6, **Node 22.22+**. Keep `<StrictMode>` on — several examples depend on it.

> **Rules for every problem:** typed everything · no `any`, no `@ts-ignore` · no `eslint-disable` for `react-hooks/*` rules · every effect that starts something cleans it up · nothing read from `localStorage` is trusted without parsing it.

---

## Warm-up — Predict the Output

Six snippets. Predict in `predictions.md` **before** running, then run, record the actual result, and write **one sentence of why** for every miss. Run them in a Vite app **with `<StrictMode>` on**.

```tsx
// 1 — In development, what does the console show when this mounts? In what order?
function A() {
  console.log("render");
  useEffect(() => {
    console.log("effect");
    return () => console.log("cleanup");
  }, []);
  return null;
}

// 2 — What happens when this mounts?
function B() {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(n + 1);
  });
  return <p>{n}</p>;
}

// 3 — What does the screen show after 5 seconds?
function C() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <p>{count}</p>;
}

// 4 — The parent re-renders 3 times with the same `q`. How many times does "run" log
//     (ignore the Strict Mode double-mount)?
function D({ q }: { q: string }) {
  const options = { q, limit: 10 };
  useEffect(() => {
    console.log("run");
  }, [options]);
  return null;
}

// 5 — What does each <Show /> print?
const Lang = createContext("en");
function Show() { return <span>{useContext(Lang)} </span>; }
function E() {
  return (
    <>
      <Show />
      <Lang value="ar">
        <Show />
        <Lang value="fr"><Show /></Lang>
      </Lang>
    </>
  );
}

// 6 — The user clicks the button once. What does the console show, and what does the screen show?
function F() {
  const [n, setN] = useState(0);
  function click() {
    setN(n + 1);
    setN((x) => x + 1);
    console.log(n);
  }
  return <button onClick={click}>{n}</button>;
}
```

**✅ Deliverable:** `predictions.md`.

---

## Problem 1 — `cartReducer`

🟢 **Easy** · reducers, discriminated unions, immutability, returning the same reference

### Description

A shop's cart is managed by `useReducer`. Before any component exists, write the reducer and a small function that computes the totals. **No React** in this problem — they're plain functions you can run with `node`.

### Signature

```ts
export interface Product { id: string; name: string; price: number }   // price in whole EGP
export interface CartItem extends Product { qty: number }

export interface CartState {
  items: CartItem[];          // in the order they were first added
  coupon: string | null;      // a valid code, stored upper-case
}

export type CartAction =
  | { type: "add"; product: Product }
  | { type: "increment"; id: string }
  | { type: "decrement"; id: string }
  | { type: "remove"; id: string }
  | { type: "applyCoupon"; code: string }
  | { type: "clear" };

export const EMPTY_CART: CartState = { items: [], coupon: null };

export function cartReducer(state: CartState, action: CartAction): CartState

export interface CartTotals { count: number; subtotal: number; discount: number; total: number }
export function cartTotals(state: CartState): CartTotals
```

### Rules

**`cartReducer`**

| Action | Effect |
|---|---|
| `add` | Not in the cart → append it with `qty: 1`. Already in the cart → `qty + 1`, keeping the **original** name and price. |
| `increment` | `qty + 1`. |
| `decrement` | `qty − 1`. At `qty: 1` the item is **removed**. |
| `remove` | Removes the item. |
| `applyCoupon` | The code is trimmed and upper-cased. `SAVE10` and `FLAT50` are valid and **replace** any current coupon. Anything else is ignored. |
| `clear` | No items, no coupon. |

- An item's `qty` never goes above **10**. An `add` or `increment` at 10 does nothing.
- An action about an `id` that isn't in the cart does nothing.
- **When an action changes nothing, return the same `state` object** — not a copy. React uses that to skip a re-render.
- Never mutate `state`, its `items` array, or any item.

**`cartTotals`**

- `count` — total quantity · `subtotal` — Σ price × qty
- `SAVE10` → `discount` is 10% of the subtotal, rounded with `Math.round`
- `FLAT50` → `discount` is `50`, but **only while** the subtotal is at least `200`; below that it's `0` (the coupon stays applied)
- `total` = `subtotal − discount`

### Examples

```ts
const MUG = { id: "mug", name: "Mug", price: 120 };
const PEN = { id: "pen", name: "Pen", price: 15 };
const BAG = { id: "bag", name: "Tote bag", price: 90 };
```

Each example starts from `EMPTY_CART` unless it says otherwise. `items` are written as `id×qty`.

| # | Actions | Expected |
|---|---|---|
| 1 | add MUG, add PEN, add MUG | items `mug×2, pen×1` · totals `{ count: 3, subtotal: 255, discount: 0, total: 255 }` |
| 2 | *from Example 1:* applyCoupon `" save10 "` | coupon `"SAVE10"` · totals `{ count: 3, subtotal: 255, discount: 26, total: 229 }` |
| 3 | add PEN, decrement `pen` | items empty · then **another** decrement `pen` returns the **same object** (`===`) |
| 4 | add BAG, applyCoupon `"FLAT50"` → add MUG → decrement `mug` | totals: `90 / 0 / 90` → `210 / 50 / 160` → `90 / 0 / 90` (subtotal / discount / total) |
| 5 | add PEN, then increment `pen` **12 times** | `pen×10` · the last increment returns the **same object** as the one before it |
| 6 | *from Example 2:* applyCoupon `"HALF"` → clear | the coupon action returns the **same object**; after clear: `{ items: [], coupon: null }` |
| 7 | *from Example 1:* add `{ id: "mug", name: "Mug", price: 999 }` | items `mug×3, pen×1` · mug's price is still `120` · subtotal `375` · and Example 1's state still has `mug×2` |

> Example 2: 10% of 255 is 25.5. What does `Math.round` do with `.5`?
> Example 7 is the trap: a product with an id you've seen isn't a new product.

### Constraints

- `cartReducer` and `cartTotals` are **pure**: no React, no storage, no clock. `cartTotals` is **derived** — it is never stored in `CartState`.
- `CartAction` is a **discriminated union** and the `switch` covers every `type` — adding a new action type without handling it should be a compile error. (Try it.)
- Write `cart.test-run.ts` that runs all seven examples and prints `PASS` or `FAIL` for each. Use `Object.freeze` on every state you pass in, so a mutation **throws** instead of passing silently.

<details>
<summary>💡 Hint 1</summary>

Most cases are "find the item, then map or filter". Do the **find first** — if it's missing (or already at 10), `return state` before building anything new.
</details>

<details>
<summary>💡 Hint 2</summary>

`Object.freeze` is shallow. To catch a mutation of an item or the array, freeze those too: `Object.freeze({ ...s, items: Object.freeze(s.items.map((i) => Object.freeze(i))) })`. In ES modules (strict mode), writing to a frozen object throws a `TypeError`.
</details>

<details>
<summary>💡 Hint 3</summary>

For exhaustiveness, add `default: { const never: never = action; return never; }` — or just rely on the function's return type: with `strict` on, a missing case makes the function "not return a value on all paths".
</details>

**✅ Deliverable:** `src/cart/cart.ts` + `cart.test-run.ts` + 1 screenshot of the test output, all `PASS`.

---

## Problem 2 — Focus Timer

🟡 **Medium** · `useEffect`, intervals, cleanup, functional updates, `document.title`

### Description

A countdown timer for focused work sessions. It looks simple, and almost every first attempt has at least one of these bugs: it stops after one tick, it runs twice as fast in development, it keeps running after it's gone, or it counts past zero. Yours has none of them.

### Signature

```ts
// src/timer/format.ts — pure
export function formatTime(seconds: number): string
```

```tsx
// src/timer/FocusTimer.tsx
export function FocusTimer()
```

### `formatTime`

`MM:SS`, both parts at least two digits. Negative → `00:00`. Fractions are rounded **down**. Minutes are not capped at 59.

| Input | `0` | `9` | `65` | `600` | `3599` | `3600` | `-5` | `59.9` |
|---|---|---|---|---|---|---|---|---|
| Output | `00:00` | `00:09` | `01:05` | `10:00` | `59:59` | `60:00` | `00:00` | `00:59` |

### Behaviour

- **Preset buttons:** `10 s`, `1 min`, `25 min`. Choosing one sets the timer to that length and **stops** it. Default: `25 min`.
- **Start / Pause** — one button. Reads `Start` when stopped, `Pause` while running. **Disabled** at `00:00`.
- **Reset** — back to the current preset's length, stopped.
- The display shows `formatTime(remaining)` and decreases by exactly 1 each second while running.
- At `00:00` the timer **stops by itself** and shows `Time's up!` (in an element with `role="status"`). It never shows a negative time.
- **The tab title:** while running → `MM:SS · Focus` (updated every second). At zero → `Time's up!`. When the timer is paused, reset, or **removed from the page**, the title goes back to what it was before.
- A **"Show timer"** checkbox in `App` mounts and unmounts `<FocusTimer />` — that's how you test the last rule.

### Example — a sequence of actions

Open the console and add `console.log("interval start")` / `console.log("interval stop")` in your effect's setup and cleanup. `<StrictMode>` is on.

| # | Action | Expected |
|---|---|---|
| 1 | Open the page | `25:00`, `Start`. Tab title is whatever it was (e.g. `Vite + React + TS`). Console: **no** `interval start` yet |
| 2 | Click `10 s`, then **Start** | `00:10` → `00:09` → `00:08` … one step per second. Title `00:09 · Focus`, `00:08 · Focus`, … |
| 3 | At `00:07`, click **Pause**, wait 3 seconds, click **Start** | It stays at `00:07` while paused (title back to the original), then continues `00:06`, `00:05`, … |
| 4 | Let it run out | `00:00` and `Time's up!`. Title `Time's up!`. `Start` is disabled. The console shows `interval stop` and **no** new `interval start` |
| 5 | Click **Reset** | `00:10`, `Start` enabled, `Time's up!` gone, title back to the original |
| 6 | Click **Start**, then at `00:08` click `1 min` | `01:00`, stopped |
| 7 | Click **Start**, then untick **Show timer** at `00:55` | The timer disappears, the title is back to the original, and the console's last line is `interval stop`. No errors |
| 8 | Count the console lines from Example 2 | At any moment there is at most **one** interval running: every `interval start` after the first is preceded by an `interval stop` |

### Constraints

- `remaining` and whether it's running are **state**. `Time's up!`, the button label, the title text and whether Start is disabled are **derived**.
- Exactly **one** interval while running — prove it with Example 8, with Strict Mode on.
- The interval's callback must not read `remaining` from the render (no stale closure) — and you may not silence the dependency warning to get there.
- The title effect restores the **previous** title in its cleanup — never a hard-coded string.

<details>
<summary>💡 Hint 1</summary>

Two effects with two jobs is cleaner than one: one keeps an interval alive **while running**, one keeps `document.title` in sync. Ask of each: *what does it depend on?* The interval shouldn't be re-created every second.
</details>

<details>
<summary>💡 Hint 2</summary>

Stopping at zero: the interval can't see `remaining`… but a functional update can. `setRemaining((r) => Math.max(0, r - 1))` keeps it from going negative. Then "running and at zero → stop" is something you can decide **in render**: is "running" really `running && remaining > 0`?
</details>

<details>
<summary>💡 Hint 3</summary>

If `isRunning` is derived as `running && remaining > 0`, and the interval effect depends on `isRunning`, the effect's cleanup runs by itself when the count hits zero — no `setRunning(false)` inside an effect needed. The README's `useDocumentTitle` does the title, if you pass it the right string… and what should you pass when the title *shouldn't* change?
</details>

**✅ Deliverable:** `src/timer/` + 1 screenshot of the console for Examples 2–4, plus 1 of the tab title while running.

---

## Problem 3 — Settings Provider

🟡 **Medium** · Context, the throw-outside-provider hook, parsing `localStorage`, effects on `<html>`

### Description

An app-wide settings store: theme, language and font size. Any component, at any depth, can read and change them — with **no props** carrying them. They survive a refresh, and a corrupt saved value never crashes the app.

### Signature

```ts
// src/settings/parse.ts — pure
export type Theme = "light" | "dark";
export type Lang = "en" | "ar";

export interface Settings {
  theme: Theme;
  lang: Lang;
  fontSize: number;       // a whole number of px, 12–24
}

export const DEFAULT_SETTINGS: Settings = { theme: "light", lang: "en", fontSize: 16 };

export function parseSettings(raw: string | null): Settings
```

```ts
// src/settings/settings-context.ts
export interface SettingsValue {
  settings: Settings;
  update: (changes: Partial<Settings>) => void;
  reset: () => void;
}
export function useSettings(): SettingsValue
```

```tsx
// src/settings/SettingsProvider.tsx
export function SettingsProvider({ children }: { children: ReactNode })
```

### `parseSettings`

`raw` is the text stored under the key `"settings"` (or `null` if there is none).

- Unusable `raw` — `null`, not valid JSON, or valid JSON that **isn't a plain object** (a string, a number, an array, `null`) → the defaults.
- Otherwise each field is checked **on its own**: a valid value is kept, an invalid or missing one falls back to its default.
  - `theme`: exactly `"light"` or `"dark"` · `lang`: exactly `"en"` or `"ar"` · `fontSize`: a **number** that is a whole number from 12 to 24
- The result has **exactly** these three keys, and is a new object every time (never `DEFAULT_SETTINGS` itself).

| # | `raw` | Expected |
|---|---|---|
| 1 | `null` | `{ theme: "light", lang: "en", fontSize: 16 }` |
| 2 | `""` | the defaults |
| 3 | `{bad` | the defaults |
| 4 | `null` *(the four-character string)* | the defaults |
| 5 | `[]` | the defaults |
| 6 | `"dark"` *(a JSON string, quotes included)* | the defaults |
| 7 | `{"theme":"dark","lang":"ar","fontSize":20}` | `{ theme: "dark", lang: "ar", fontSize: 20 }` |
| 8 | `{"theme":"DARK","lang":"ar"}` | `{ theme: "light", lang: "ar", fontSize: 16 }` |
| 9 | `{"theme":"dark","fontSize":"18"}` | `{ theme: "dark", lang: "en", fontSize: 16 }` |
| 10 | `{"fontSize":18.5}` | the defaults |
| 11 | `{"fontSize":24}` / `{"fontSize":25}` | `fontSize: 24` / `fontSize: 16` |
| 12 | `{"theme":"dark","extra":true}` | `{ theme: "dark", lang: "en", fontSize: 16 }` — no `extra` |

> Example 4 is the classic crash: `JSON.parse("null")` succeeds — and `typeof null` is `"object"`.

### Behaviour

- `SettingsProvider` loads once from `localStorage` with `parseSettings`, and saves to `"settings"` after every change.
- `update({ fontSize: 18 })` changes only the given fields. `reset()` goes back to the defaults.
- While mounted, the provider keeps `<html>` in sync: `data-theme` = the theme, `lang` = the language, `dir` = `rtl` for Arabic and `ltr` for English, and `style.fontSize` = e.g. `18px`.
- `useSettings()` outside a provider throws `useSettings must be used inside <SettingsProvider>`.
- Build three consumers **at different depths**, none of which receives settings as a prop:
  - `Greeting` — `Hello!` in English, `أهلاً!` in Arabic
  - `SettingsPanel` — a theme toggle, an `en` / `ar` switch, `A−` / `A+` buttons (steps of 2, clamped to 12–24), and **Reset**
  - `FontBadge`, nested at least **three** components deep — shows `16px`

### Example — a sequence of actions

| # | Action | Expected |
|---|---|---|
| 13 | Fresh browser (no `settings` key), open the app | Light, `Hello!`, `16px`, `<html lang="en" dir="ltr" data-theme="light">` |
| 14 | Switch to `ar` | `أهلاً!`, the layout flips right-to-left, `<html dir="rtl" lang="ar">` |
| 15 | Click `A+` five times | `24px` — the fifth click does nothing |
| 16 | Refresh | Still Arabic, still `24px` |
| 17 | In DevTools set `settings` to `{"theme":"dark","fontSize":"huge"}`, refresh | Dark, English, `16px` — no crash |
| 18 | Click **Reset**, refresh | The defaults, and `localStorage` holds the defaults |
| 19 | Temporarily render `<FontBadge />` outside the provider | The error names `useSettings` and `<SettingsProvider>` |

### Constraints

- `parseSettings` is pure — test all 12 parse examples with `node` (`parse.test-run.ts`, `PASS`/`FAIL` each).
- Loading uses a **lazy initializer** — not an effect. Saving and the `<html>` sync are effects.
- No component between the provider and `FontBadge` mentions settings at all.
- The context object and `useSettings` live in `settings-context.ts`; the provider component in `SettingsProvider.tsx` (no `react-refresh` lint warnings).

<details>
<summary>💡 Hint 1</summary>

For "a plain object": `typeof data === "object" && data !== null && !Array.isArray(data)`. After that, treat it as `Record<string, unknown>` and check each field with `===` and `Number.isInteger`.
</details>

<details>
<summary>💡 Hint 2</summary>

`update` with `Partial<Settings>` is a functional update: `setSettings((s) => ({ ...s, ...changes }))`. The `A+` clamp belongs in the button's handler (or a tiny helper) — `Math.min(24, fontSize + 2)`.
</details>

<details>
<summary>💡 Hint 3</summary>

`document.documentElement` is `<html>`. `.dataset.theme = …`, `.lang = …`, `.dir = …`, `.style.fontSize = …` — one effect that depends on `settings`. For the RTL flip to be visible, use logical CSS (`margin-inline-start`, `text-align: start`) instead of `left`/`right`.
</details>

**✅ Deliverable:** `src/settings/` + `parse.test-run.ts` + 2 screenshots: Example 14 (Arabic, with `<html>` visible in the Elements panel) and Example 17.

---

## Problem 4 — Extend Task Board v3

🟠 **Medium+** · a pure helper, a timer with cleanup, the `storage` event

### Description

Start from the Task Board v3 you built in README Part 3. Add two features.

### Feature A — Undo Delete

- Deleting a task (from the list **or** the detail page) shows a toast: `Deleted “Write the board reducer”.` with an **Undo** button.
- **Undo** puts the task back **where it was** in the list, with everything it had (id, done, notes…), and closes the toast.
- The toast closes by itself after **5 seconds**. Deleting **another** task replaces the toast and **restarts** the 5 seconds — only the latest deletion can be undone.
- **Adding** a task while the toast is showing closes the toast. (Why? Look at what `nextId` would give the new task.)
- The toast is visible on whichever page you're on (deleting from the detail page navigates to the list — the toast is there).
- The toast has `role="status"` so screen readers announce it.

Write the "put it back" logic as a **pure** function in `board-reducer.ts`, and use it from a new `"restored"` action:

```ts
export function restoreTask(tasks: Task[], task: Task, index: number): Task[]
```

- Inserts `task` at `index`. An `index` past the end → at the end; below 0 → at the start.
- If a task with the same `id` is already in `tasks`, return **`tasks` itself**, unchanged.
- Never mutates `tasks`.

### Feature B — Sync Across Tabs

- With the board open in **two tabs**, a change in one (add, edit, tick, delete, undo) appears in the other **without a refresh**.
- If the new stored value can't be parsed (someone typed `{oops` in DevTools), the other tab **keeps** what it has.
- If the key is **removed** entirely, the other tab shows an empty list.

The browser fires a `storage` event on `window` in **every other tab** of the same origin when `localStorage` changes. (Not in the tab that made the change.)

### Examples

Start from the README's `INITIAL` tasks: 1 "Read the Day 09 README" · 2 "Write the board reducer" · 3 "Save tasks to localStorage". `[1,2,3]` below means tasks with those ids, in that order.

| # | Pure call | Expected |
|---|---|---|
| 1 | `restoreTask([1,3], task2, 1)` | `[1,2,3]` |
| 2 | `restoreTask([1], task3, 2)` | `[1,3]` |
| 3 | `restoreTask([2,3], task1, 0)` | `[1,2,3]` |
| 4 | `restoreTask(list, task2, 1)` where `list` is `[1,2,3]` | returns `list` itself (`===`) |
| 5 | `restoreTask([], task5, 3)` | `[5]` |

| # | Action | Expected |
|---|---|---|
| 6 | Delete "Write the board reducer", click **Undo** | The list is back to 1, 2, 3 — task 2 in the **middle**, still with its due date and notes |
| 7 | Delete task 3, wait 6 seconds | The toast is gone; task 3 stays deleted |
| 8 | Delete task 3, wait 3 s, delete task 1, wait 3 s | The toast (about task 1) is **still showing** — the timer restarted. Undo brings back task 1 only |
| 9 | Delete task 2, refresh before the toast closes | Task 2 is deleted, no toast — the deletion was already saved |
| 10 | Open task 2's detail page, click **Delete** | You're on the list, and the toast is showing |
| 11 | Delete task 3, then add a new task | The toast closes; the new task is saved normally |
| 12 | Two tabs. In tab A, tick task 3 | Tab B shows task 3 done, without a refresh |
| 13 | Two tabs. In tab B's DevTools console: `localStorage.setItem("task-board", "{oops")` | Tab A keeps its tasks and doesn't crash |
| 14 | Two tabs. In tab B's console: `localStorage.removeItem("task-board")` | Tab A shows `No tasks yet.` |

### Constraints

- `restoreTask` is pure — a throwaway script runs Examples 1–5 on **frozen** arrays.
- Every timer and every `window` listener you add is cleaned up — show it with Strict Mode on (no double toasts, no double handling).
- Tabs must **not** ping-pong: receiving a change must not cause an endless loop of saves and events between the tabs. In `FEATURE.md`, explain in one or two sentences why yours doesn't.
- `FEATURE.md` also answers: where does the toast's state live, and why there?
- `tsc`, `npm run lint` and `npm run build` all pass.

<details>
<summary>💡 Hint 1</summary>

The toast needs two things to undo: **the task** and **the index it had**. Capture both *before* dispatching `"removed"`. That pair (or `null`) is the toast's whole state — and it must outlive the page, so think about which component never unmounts.
</details>

<details>
<summary>💡 Hint 2</summary>

"Close after 5 s, restart on a new deletion" is an effect that depends on the toast's state: when it changes, the cleanup clears the old timer and setup starts a new one. You've written this exact shape — it's `useDebouncedValue`.
</details>

<details>
<summary>💡 Hint 3</summary>

For the sync: a `"replaced"` action that swaps in a whole new list, and an effect in the provider that listens for `storage`, checks `e.key`, and parses `e.newValue` with the README's `parseTasks` (`null` from a removed key and `null` from bad JSON need different handling — look at `e.newValue`). About ping-pong: what does `localStorage.setItem` do when the value is **identical** to what's already stored?
</details>

**✅ Deliverable:** updated `task-board-v3/` + `FEATURE.md` + 1 screenshot of the toast, and 1 of two tabs side by side after Example 12.

---

## Ship It

### Repo

```
your-repo/
└── day-09/
    ├── NOTES.md
    ├── predictions.md
    ├── APPROACH.md
    ├── day-09-problems/     ← Problems 1–3
    └── task-board-v3/       ← README Part 3 + Problem 4
```

- All work on a `feature/day-09` branch, with clear commit messages, merged through a **pull request**.
- `node_modules` and `dist` are **not** committed.

### `day-09/NOTES.md` — four short answers, in your own words

1. **Effect or not?** — one thing you almost put in a `useEffect` that belonged in render or in a handler, and why.
2. **Cleanup** — what Strict Mode's double-mount caught (or would have caught) in your Focus Timer.
3. **Context vs props vs URL** — one value from today in each, and why it lives there.
4. **One real bug** you hit: the exact error or symptom, how you found it, the fix.

### LinkedIn

A short post about Day 9 with a screenshot (two synced tabs, or the Arabic RTL settings), your repo link, and **one concrete thing that clicked**.

**✅ Deliverable:** repo link + merged PR link + LinkedIn post link.

---

## Bonus (Optional) — Challenge Problems

<details>
<summary>⭐ Challenge 1 — Cart, Persisted and Provided</summary>

Turn Problem 1 into a `CartProvider` (Context + your reducer), saved to `localStorage` with a parse function that rejects bad items, and a small shop page: a product grid, a cart badge in the header showing `count`, and a cart panel with the totals. Your Problem 1 test run still passes **unchanged**.
</details>

<details>
<summary>⭐ Challenge 2 — `useInterval`</summary>

Extract a `useInterval(callback, delayMs | null)` hook (`null` = paused) where the callback can change on every render **without** restarting the interval. Rewrite the Focus Timer with it. Explain in two sentences how you kept the latest callback without making it a dependency.
</details>

<details>
<summary>⭐ Challenge 3 — Follow the System Theme</summary>

Add `"system"` as a third theme in Problem 3. While it's selected, the app follows the OS setting **live** — change your OS to dark mode and the app switches without a refresh. (`matchMedia("(prefers-color-scheme: dark)")` and its `change` event — cleaned up.)
</details>

<details>
<summary>⭐ Challenge 4 — Undo Stack</summary>

In Task Board v3, keep the last **five** deletions. The toast shows `Undo (3)`; each click restores the most recent one. Write it as reducer actions, tested with `node`.
</details>

---

## How This Is Graded

| Level | What it looks like |
|---|---|
| ❌ **Incomplete** | An example that doesn't match its expected output, approach written after the code, copy-pasted code, a timer or listener without cleanup, a silenced `react-hooks` warning, derived values stored in state, data from `localStorage` used without parsing, a mutated reducer state, `any` or `@ts-ignore`, `node_modules` committed, no merged PR, or code you can't explain line by line |
| ✅ **Done** | Warm-up done honestly · Problems 1–4 pass **every** example · `APPROACH.md` written before each problem · notes in your own words · a merged PR |
| 🔥 **10%** | Done + the challenge problems + notes someone else could learn from |

---

## A Reminder

> **90%** study only — free, self-paced, no assignments turned in.
> **10%** study + assignments + more — I personally help this group get there.
>
> **If you show up for the 10%, I show up for you.**

The next session is **API Integration in React + Project: Course Management Dashboard** — where the data finally comes from a real server. Come with Task Board v3 working and your PR merged.

---

← Back to [Day 09 README](README.md)
