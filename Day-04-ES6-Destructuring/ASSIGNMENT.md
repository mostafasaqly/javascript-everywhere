# Day 04 — Assignment

**Track 1 · Session 4 · ES6+: Destructuring, Spread & Rest**

> Session 3 taught you to box logic into functions. Session 4 taught you to get data
> in and out of those boxes without repeating yourself.
> This assignment makes it permanent — by rewriting your own Day 03 library in modern
> syntax and proving, line by line, that it got shorter without getting cleverer.
> Session 5 is async. It hands you nested objects you did not build. Unpack them today.

**⏱ Budget:** 6–7 hours · **📅 Duration:** 3 days · **🚩 Deadline:** before Session 5

| # | Task | Deliverable |
|---|---|---|
| 1 | Predict the unpacking | `predictions.md` + 1 screenshot |
| 2 | Destructuring drills | `destructuring.js` + 1 screenshot |
| 3 | Spread & rest lab | `spread.js` + 1 screenshot |
| 4 | Safe access on messy data | `messy.js` + 1 screenshot |
| 5 | Build: the Grade Library, modernised | `grade-lib.js` + `report.js` + 1 screenshot |
| 6 | Browser: Student Dashboard | 2 files + 1 screenshot |
| 7 | Notes + repo | `NOTES.md` + repo link + `git log` screenshot |
| 8 | Share it | LinkedIn post link |

> **Type every line by hand. Do not copy-paste.** You are building muscle memory, and `Ctrl+V` builds none.

---

## Task 1 — Predict, Then Run

Same drill as Day 03 — this time on unpacking, where a wrong guess usually means a `TypeError` you'll meet again in Session 5.

### 1.1 — Write Your Predictions First

- [ ] Create `predictions.md`
- [ ] For **each** numbered snippet, write what you think happens — a value, or the **exact error name** — **before running anything**

```js
// 1
const { a } = { a: 1, b: 2 };
console.log(a, typeof b);

// 2
const { x: y } = { x: 10 };
console.log(y);

// 3
const { x: y } = { x: 10 };
console.log(x);

// 4
const { p = 5 } = { p: undefined };
console.log(p);

// 5
const { q = 5 } = { q: null };
console.log(q);

// 6
const { r = 5 } = { r: 0 };
console.log(r);

// 7
const [, , third] = ["a", "b", "c", "d"];
console.log(third);

// 8
const [m, n = "N"] = ["M"];
console.log(m, n);

// 9
const { length } = "JavaScript";
console.log(length);

// 10
const arr = [1, 2];
const copy = arr;
copy.push(3);
console.log(arr.length);

// 11
const obj = { nested: { v: 1 } };
const shallow = { ...obj };
shallow.nested.v = 99;
console.log(obj.nested.v);

// 12
console.log({ ...{ a: 1, b: 2 }, ...{ b: 3 } });

// 13
console.log({ ...{ b: 3 }, ...{ a: 1, b: 2 } });

// 14
function f({ a } = {}) { return a; }
console.log(f(), f({ a: 7 }));

// 15
function g({ a }) { return a; }
console.log(g());

// 16
const s = { name: "Sara" };
console.log(s.address?.city);

// 17
const s2 = { name: "Sara" };
console.log(s2.address.city);

// 18
console.log(0 || "fallback", 0 ?? "fallback");

// 19
const k = "score";
console.log({ [k]: 90 }, { k: 90 });

// 20
const nums = [3, 1, 2];
console.log(Math.max(nums), Math.max(...nums));
```

### 1.2 — Now Run Them

- [ ] Create `predictions.js` and run each snippet — **one at a time**, since several throw and would stop the file
- [ ] In `predictions.md`, record **actual** next to each prediction
- [ ] For every one you got **wrong**, write one sentence explaining why JavaScript did that
- [ ] For **#5, #11, #13 and #15** name the mechanism explicitly — these four are the ones that cause real bugs

> Getting them wrong is the assignment. Getting them wrong and not explaining why is not.

**✅ Deliverable:** `predictions.md` with predictions, actuals, and explanations + screenshot of the output.

---

## Task 2 — Destructuring Drills

Create `destructuring.js`. Each part is a few lines — run after every part.

### 2.1 — Objects, Four Ways

Start from `const student = { name: "Sara", score: 92, city: "Cairo" };`

- [ ] Pull `name` and `score` out in one line
- [ ] Pull `city` out **renamed** to `hometown`
- [ ] Pull a missing `attendance` with a **default** of `0`
- [ ] Pull a missing `level` **renamed** to `tier` **with** a default of `"beginner"` — one declaration doing both

### 2.2 — Nested

- [ ] Build an object with a `profile` inside it, holding `email` and `github`
- [ ] Destructure `email` out of the nested level in a single statement
- [ ] Try to log the intermediate `profile` variable — screenshot the error, then comment one sentence on why it doesn't exist
- [ ] Rewrite it so you get **both** `profile` and `email`

### 2.3 — Arrays

- [ ] Destructure the first two items of a five-item array
- [ ] Use skip-commas to grab **only** the fourth item
- [ ] Give a sixth position a default and prove it fires
- [ ] Swap two variables using array destructuring — no temporary variable
- [ ] Split an array into `head` and `...tail` and log both

### 2.4 — Parameters

- [ ] Rewrite Day 03's `describe(student)` as `describe({ name, score })`
- [ ] Add a `city = "Unknown"` default on the parameter line
- [ ] Write `summarise({ name, score = 0, passMark = 60 } = {})` that returns a PASS/FAIL sentence
- [ ] Call it with a full object, a partial object, and **no arguments at all** — all three must work
- [ ] Delete the `= {}`, call it with no arguments again, screenshot the `TypeError`, then put it back

### 2.5 — In a Loop

- [ ] Make an array of at least four student objects
- [ ] Loop with `for (const { name, score } of students)` and print one line each
- [ ] Build a `{ A: 2, B: 1, ... }` tally object, then print it with `Object.entries` and `[grade, count]` destructuring

**✅ Deliverable:** `destructuring.js` + screenshot of the full output.

---

## Task 3 — Spread & Rest Lab

Create `spread.js`. This task is about **not mutating things**, which is the habit Track 2 will demand of you constantly.

### 3.1 — Copy vs Alias

- [ ] Create an array, make an **alias** (`const b = a`), push to the alias, log the original
- [ ] Create the same array, make a **copy** with spread, push to the copy, log the original
- [ ] Comment one sentence on the difference

### 3.2 — Arrays Without Mutation

- [ ] Combine two arrays into a third with spread
- [ ] Add an item to the **end** and to the **front**, each producing a new array
- [ ] Prove the original array's `length` never changed
- [ ] Remove an item by index using spread and slicing — original untouched

### 3.3 — Objects Without Mutation

- [ ] Create a student object, then produce an `updated` copy with a different score
- [ ] Log both scores to prove the original survived
- [ ] Add a new field (`id`) with spread
- [ ] Remove a field using **object rest** (`const { attendance, ...without } = student`)

### 3.4 — Merge Order

- [ ] Create `defaults` and `custom` objects sharing at least one key
- [ ] Merge them so **`custom` wins**; log the result
- [ ] Merge them the wrong way round; log that too
- [ ] Comment one sentence on which order you want and why the other is a bug

### 3.5 — The Shallow Copy Trap

- [ ] Build an object with a **nested** object inside it
- [ ] Spread-copy it, change a **nested** field on the copy, log the original
- [ ] Screenshot the original being wrong
- [ ] Fix it by spreading the nested level too, and prove the original is now safe

> This is the single most expensive bug in this session. Make it happen on purpose, once, here.

### 3.6 — Rest in Functions

- [ ] Write `total(...numbers)` returning the sum of any count of arguments
- [ ] Write `logAll(label, ...items)` printing the label then each item on its own line
- [ ] Write a function taking `(first, ...others)` that returns a **new** array with `first` moved to the end
- [ ] Try putting `...rest` before another parameter, screenshot the `SyntaxError`, then remove it

### 3.7 — Spread Into Arguments

- [ ] Use `Math.max` on an array **without** spread — record the result
- [ ] Use it **with** spread
- [ ] Comment one sentence explaining the difference

**✅ Deliverable:** `spread.js` + screenshot of the full output.

---

## Task 4 — Safe Access on Messy Data

Create `messy.js`. Real data has holes in it. This task is practice for Session 5.

- [ ] Build an array of at least **five** student objects where:
  - two are missing an `address` entirely
  - one has an `address` but no `city`
  - one has an empty `scores: []`
  - one has `attendance: 0` (a real value, not missing!)
- [ ] Loop over them and print each student's city using `?.` and `??` with `"Unknown"` — no crashes, no `if` statements
- [ ] Print each student's first score with a `?? "No scores yet"` fallback
- [ ] Print each student's attendance with a `?? "Not recorded"` fallback — the student with `0` **must** print `0`, not the fallback
- [ ] Do the same line with `||` instead, screenshot the wrong output for the `0` student, and comment why
- [ ] Write `getCity(student)` returning the city or `"Unknown"` in a **single** return line
- [ ] Write `safeFirstScore(student)` using `student.scores?.[0] ?? null`
- [ ] Call a method that might not exist with `?.()` and prove it doesn't throw

**✅ Deliverable:** `messy.js` + screenshot of the full output.

---

## Task 5 — Build: The Grade Library, Modernised

This is the main build. Take your **own** Day 03 `grade-lib.js` and `report.js` and rewrite them using this session's syntax. Same behaviour — different shape.

### 5.1 — `grade-lib.js` — Pure Functions Only

**No `console.log` anywhere in this file.** Every function takes input and returns output.

- [ ] `isValidScore(score)` — unchanged from Day 03
- [ ] `letterGrade(score)` — unchanged
- [ ] `isPassing({ score, passMark = 60 })` — **destructured parameter** with a default
- [ ] `isAtRisk({ score = 0, attendance = 0 })` — destructured, both defaulted
- [ ] `average(numbers)` — with its empty-array guard
- [ ] `minMaxStudent(students)` — returns **two** students as an array, so the caller destructures `const [low, high] = ...`
- [ ] `countByGrade(students)` — built with **computed keys** and `??`
- [ ] `formatRow({ name, score, attendance } = {})` — destructured parameter, template literal, `padEnd` / `padStart`
- [ ] `withBonus(student, bonus = 5)` — returns a **new** student with spread; must never mutate the input
- [ ] `withoutField(student, field)` — returns a copy with one key removed
- [ ] Every function that takes a student destructures on the parameter line
- [ ] Every string built with a template literal — **zero** `+` concatenation in the file

### 5.2 — `report.js` — The Program

- [ ] An array of **at least 10** student objects with `name`, `score`, `attendance`
- [ ] At least **three** must have holes: a missing `attendance`, a missing nested `address`, and one deliberately invalid score
- [ ] Loop with `for (const { name, score } of students)` — destructure in the loop header
- [ ] Skip invalid records with `continue`, counting them
- [ ] Print a header, one `formatRow` line per valid student, and a separator
- [ ] Print the summary using `const [lowest, highest] = minMaxStudent(...)`
- [ ] Print the grade tally with `Object.entries` and `[grade, count]` destructuring
- [ ] Apply `withBonus` to one student and print **both** the original and the boosted score, proving no mutation
- [ ] All grading logic lives in `grade-lib.js` — `report.js` holds **none**

### 5.3 — Prove It's Better

- [ ] In `NOTES.md`, paste your Day 03 line count and your Day 04 line count
- [ ] Pick **one** function and paste the Day 03 version next to the Day 04 version
- [ ] Write two sentences: what the new signature tells a reader that the old one didn't

**✅ Deliverable:** `grade-lib.js` + `report.js` + screenshot of the output.

---

## Task 6 — The Browser Side

Create `index.html` and `app.js`. Same functions, different environment — and this time, **nothing mutates**.

- [ ] Inputs for **name**, **score**, and an **optional city**, plus **Add** and **Clear** buttons
- [ ] `app.js` split into two clearly commented sections: **pure logic** at the top, **DOM handling** below
- [ ] The pure section reuses `isValidScore`, `letterGrade`, and `average` — identical to `grade-lib.js`, no DOM inside them
- [ ] A `describe({ name, score, city = "Unknown" })` function using a destructured parameter and a template literal
- [ ] Adding a student uses `students = [...students, newStudent]` — **no `.push`**
- [ ] The optional city adds **no key at all** when the field is left blank
- [ ] Named `handleAdd` / `handleClear` wired with `addEventListener` — pass the function, don't call it
- [ ] Guard clauses for empty name, empty score, non-number, and out of `0–100`
- [ ] A `render()` rebuilding the list, called after every change
- [ ] A summary line with the count and the average to one decimal
- [ ] Log the students array on every add
- [ ] Runs through **Live Server**

- [ ] Screenshot the page with at least 5 students added — including one with no city — and DevTools console open.

> **The point of this task:** replacing the array instead of mutating it feels pointless with 5 students on one page. It is the entire reason React can tell that something changed. Build the habit now, understand the payoff in Track 2.

**✅ Deliverable:** `index.html` + `app.js` pushed + 1 screenshot.

---

## Task 7 — Notes and Repository

### 7.1 — Repo Structure

- [ ] Add a `day-04/` folder to your `javascript-everywhere` repo:

```
javascript-everywhere/
├── README.md
├── day-01/
├── day-02/
├── day-03/
└── day-04/
    ├── NOTES.md
    ├── predictions.md
    ├── predictions.js
    ├── destructuring.js
    ├── spread.js
    ├── messy.js
    ├── grade-lib.js
    ├── report.js
    ├── index.html
    └── app.js
```

- [ ] Add a Day 04 row to your root `README.md` table of contents

### 7.2 — `day-04/NOTES.md`

**In your own words** — not the README's words:

- [ ] What destructuring actually does, in one sentence
- [ ] How object destructuring and array destructuring differ in what they match on
- [ ] What `const { a: b } = obj` creates, and what it does **not** create
- [ ] When a destructuring default fires — and the three values that do **not** trigger it
- [ ] Why `const { x } = undefined` throws, and the one-character-ish fix
- [ ] Rest vs spread — the rule you use to tell them apart at a glance
- [ ] What "shallow copy" means, and the exact bug it caused you in Task 3.5
- [ ] Why spread order matters when merging defaults
- [ ] The difference between `||` and `??`, with the `0` example from Task 4
- [ ] What `?.` does when the left side is `null`
- [ ] Why `{ [key]: value }` needs the brackets
- [ ] Your Task 5.3 answer — the line counts and the before/after function
- [ ] **One bug you hit today**, the exact error message, and how you fixed it

> The bug section is not optional. If nothing broke, you copy-pasted.

### 7.3 — Five Separate Commits

- [ ] Commit 1 — `predictions.md` + `predictions.js`
- [ ] Commit 2 — `destructuring.js`
- [ ] Commit 3 — `spread.js` + `messy.js`
- [ ] Commit 4 — `grade-lib.js` + `report.js`
- [ ] Commit 5 — browser files + `NOTES.md`

Real commit messages. `update` is not a message.

- [ ] Run `git log --oneline` and screenshot it.

**✅ Deliverable:** repo link + `git log` screenshot.

---

## Task 8 — Share It

- [ ] Post on **LinkedIn** about completing Session 4
- [ ] Include the screenshot of your `report.js` output
- [ ] Include the link to your repo
- [ ] Show the **before and after** of one function — Day 03's signature next to Day 04's. It's the most visual thing you've produced so far; use it.
- [ ] Say one concrete thing you understood today that you didn't before — the shallow copy bug, `??` vs `||` on a zero, why `{ ...defaults, ...custom }` has to be in that order. Not "excited to continue my journey".

**✅ Deliverable:** the link to your post.

---

## Bonus (Optional)

- [ ] Write `pick(object, keys)` returning a new object with only the listed keys
- [ ] Write `omit(object, keys)` — the opposite — using object rest
- [ ] Write `deepMerge(a, b)` that merges nested objects one level deeper than spread does
- [ ] Write `groupBy(students, key)` returning `{ Cairo: [...], Alexandria: [...] }` using computed keys
- [ ] Rebuild Day 03's `myMap` / `myFilter` so the callback receives `({ item, index })` as a destructured object
- [ ] Write `swapKeys(object)` turning `{ a: 1 }` into `{ 1: "a" }` with `Object.entries` and computed keys
- [ ] Add a **Remove** button per row in the browser app that filters the student out into a **new** array
- [ ] Add an **Undo** button holding the previous `students` array — one line, thanks to immutability
- [ ] Use `structuredClone` on the nested object from Task 3.5 and compare it to the manual nested spread

---

## Submission Checklist

- [ ] **Task 1** — `predictions.md` with wrong answers explained + screenshot
- [ ] **Task 2** — `destructuring.js` + screenshot
- [ ] **Task 3** — `spread.js` + screenshot (include the shallow-copy error screenshot)
- [ ] **Task 4** — `messy.js` + screenshot
- [ ] **Task 5** — `grade-lib.js` + `report.js` + screenshot
- [ ] **Task 6** — `index.html` + `app.js` + screenshot with console open
- [ ] **Task 7** — repo link, correct structure, `NOTES.md`, 5 commits, `git log` screenshot
- [ ] **Task 8** — LinkedIn post link

Submit all links together before Session 5.

---

## How This Is Graded

| Level | What it looks like |
|---|---|
| ❌ **Incomplete** | Copy-pasted README code, predictions written after running, `.push` and `student.score` still everywhere, string concatenation with `+`, one giant commit, or destructuring you can't explain line by line |
| ✅ **Done** | All eight tasks, working code, a genuinely non-mutating `grade-lib.js`, every student-taking function destructured on its parameter line, `NOTES.md` in your own words, a real bug documented |
| 🔥 **10%** | Done + the bonus + a `grade-lib.js` that does something beyond the spec + notes someone else could actually learn from |

---

## A Reminder

> **90%** study only — free, self-paced, no assignments turned in.
> **10%** study + assignments + more — I personally help this group get there.
>
> **If you show up for the 10%, I show up for you.**

Session 5 is **Async JS — Callbacks and their problems, the Event Loop** — where your code stops running in the order you wrote it. Come with `report.js` running.

---

← Back to [Day 04 README](README.md)
