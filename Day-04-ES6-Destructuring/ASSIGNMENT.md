# Day 04 — Assignment

**Track 1 · Day 4 · ES6+ & Async JS: Destructuring, Spread, Callbacks & the Event Loop**

> Part 1 taught you to get data in and out of functions without repeating yourself.
> Part 2 taught you that code doesn't always run in the order you wrote it.
> This assignment makes both permanent — you'll rewrite your Day 03 library in modern syntax,
> then feed it data that *arrives* instead of sitting in an array.
> The next session hands you Promises. You'll only appreciate them if you've done this first.

**⏱ Budget:** 10–12 hours · **📅 Duration:** 5 days · **🚩 Deadline:** before the next session

| # | Task | Part | Deliverable |
|---|---|---|---|
| 1 | Predict, then run | 1 + 2 | `predictions.md` + 1 screenshot |
| 2 | Destructuring drills | 1 | `destructuring.js` + 1 screenshot |
| 3 | Spread & rest lab | 1 | `spread.js` + 1 screenshot |
| 4 | Safe access on messy data | 1 | `messy.js` + 1 screenshot |
| 5 | Timers & callbacks lab | 2 | `timers.js` + `callbacks.js` + 1 screenshot |
| 6 | Callback hell — build it, then escape it | 2 | `fake-db.js` + `hell.js` + `flat.js` + 1 screenshot |
| 7 | Build: the grade library + async report | 1 + 2 | `grade-lib.js` + `students.json` + `report.js` + 1 screenshot |
| 8 | Browser: Student Dashboard | 1 + 2 | 2 files + 2 screenshots |
| 9 | Notes + repo | — | `NOTES.md` + repo link + `git log` screenshot |
| 10 | Share it | — | LinkedIn post link |

> **Type every line by hand. Do not copy-paste.** You are building muscle memory, and `Ctrl+V` builds none.

---

## Task 1 — Predict, Then Run

Twelve snippets on unpacking, where a wrong guess usually means a `TypeError`. Ten on timing, where a wrong guess means the right output in the wrong order.

### 1.1 — Write Your Predictions First

- [ ] Create `predictions.md`
- [ ] For **each** numbered snippet, write what you think happens — a value, the **exact error name**, or the **exact output order** — **before running anything**

#### Part 1 — Unpacking

```js
// 1
const { a } = { a: 1, b: 2 };
console.log(a, typeof b);

// 2
const { x: y } = { x: 10 };
console.log(x);

// 3
const { p = 5 } = { p: undefined };
console.log(p);

// 4
const { q = 5 } = { q: null };
console.log(q);

// 5
const [, , third] = ["a", "b", "c", "d"];
console.log(third);

// 6
const arr = [1, 2];
const copy = arr;
copy.push(3);
console.log(arr.length);

// 7
const obj = { nested: { v: 1 } };
const shallow = { ...obj };
shallow.nested.v = 99;
console.log(obj.nested.v);

// 8
console.log({ ...{ b: 3 }, ...{ a: 1, b: 2 } });

// 9
function f({ a } = {}) { return a; }
console.log(f(), f({ a: 7 }));

// 10
function g({ a }) { return a; }
console.log(g());

// 11
const s = { name: "Sara" };
console.log(s.address.city);

// 12
console.log(0 || "fallback", 0 ?? "fallback");
```

#### Part 2 — Order

```js
// 13
console.log("a");
setTimeout(() => console.log("b"), 0);
console.log("c");

// 14
setTimeout(() => console.log("timeout"), 0);
queueMicrotask(() => console.log("micro"));
console.log("sync");

// 15
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}

// 16
function later() {
  setTimeout(() => { return 42; }, 0);
}
console.log(later());

// 17
setTimeout(() => console.log("timer"), 0);
const start = Date.now();
while (Date.now() - start < 500) {}
console.log("loop finished");

// 18
setTimeout(() => console.log("outer"), 0);
setTimeout(() => {
  console.log("first");
  setTimeout(() => console.log("nested"), 0);
}, 0);
setTimeout(() => console.log("second"), 0);

// 19
setTimeout(() => {
  console.log("timer");
  queueMicrotask(() => console.log("micro inside timer"));
}, 0);
setTimeout(() => console.log("timer 2"), 0);

// 20
try {
  setTimeout(() => { throw new Error("late"); }, 0);
} catch (e) {
  console.log("caught", e.message);
}
console.log("after try");

// 21
function load(cb) {
  cb("sync call");
  setTimeout(() => cb("async call"), 0);
}
load((msg) => console.log(msg));
console.log("after load");

// 22
setTimeout(() => console.log("A"), 20);
setTimeout(() => console.log("B"), 10);
queueMicrotask(() => console.log("C"));
console.log("D");
```

### 1.2 — Now Run Them

- [ ] Create `predictions.js` and run each snippet — **one at a time**, since #2, #10, #11 and #20 throw and would hide the rest
- [ ] In `predictions.md`, record the **actual** result next to each prediction
- [ ] For every one you got **wrong**, write one sentence explaining why JavaScript did that
- [ ] For **#4, #7, #8, #10, #15, #18, #19 and #21** name the mechanism explicitly — these eight are the ones that cause real bugs

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

> This is the single most expensive bug in Part 1. Make it happen on purpose, once, here.

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

Create `messy.js`. Real data has holes in it — and data that arrives from a server (Part 2) has the most.

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

## Task 5 — Timers & Callbacks Lab

Two files. Run after every part.

### 5.1 — `timers.js`: `setTimeout`

- [ ] Schedule three messages at 300ms, 100ms and 200ms, and predict the order in a comment before running
- [ ] Pass **two extra arguments** through `setTimeout(fn, ms, a, b)` into your callback
- [ ] Schedule a message, save its ID, cancel it with `clearTimeout`, and prove it never prints
- [ ] Write `setTimeout(sayHi(), 1000)` on purpose — record what happens and comment why

### 5.2 — `timers.js`: `setInterval`

- [ ] Build a countdown from 5 to 1 that prints `Lift off 🚀` and **stops itself** with `clearInterval`
- [ ] Prove the script **exits** on its own when the countdown ends
- [ ] Remove the `clearInterval`, run it, and note what happens (`Ctrl+C` to stop it) — then put it back

### 5.3 — `timers.js`: The Delay Is a Minimum

- [ ] Write `blockFor(ms)` — a busy-wait loop using `Date.now()`
- [ ] Schedule a `setTimeout` for 100ms, then call `blockFor(1000)` right after it
- [ ] Measure and print how long the timer **actually** took
- [ ] Comment one sentence explaining the difference between the delay you asked for and the one you got

### 5.4 — `callbacks.js`: Sync vs Async

- [ ] Write `repeat(times, callback)` calling `callback(i)` synchronously, and show `"done"` prints **after** every callback
- [ ] Write `repeatLater(times, callback)` calling each `callback(i)` through `setTimeout`, and show `"done"` prints **before** every callback
- [ ] Comment one sentence: how could you tell these apart without running them?

### 5.5 — `callbacks.js`: You Can't Return From the Future

- [ ] Write `getScoreLater()` that tries to `return` a score from inside a `setTimeout` — log what it gives you
- [ ] Rewrite it as `getScoreLater(callback)` and compute a letter grade **inside** the callback

### 5.6 — `callbacks.js`: Error-First

- [ ] Write `findStudent(id, callback)` that calls back with an `Error` for unknown ids, and `(null, student)` for known ones — **destructure** the student in the callback's parameter list
- [ ] Call it once with a good id and once with a bad one — both paths print something sensible
- [ ] Every error path uses `return callback(err)` — the `return` is not optional
- [ ] Delete one `return`, show the callback firing **twice**, screenshot it, then put it back

### 5.7 — `callbacks.js`: `try`/`catch` Can't Save You

- [ ] Wrap a `setTimeout` that throws in a `try`/`catch` and screenshot the crash
- [ ] Comment one sentence on why `catch` never ran
- [ ] Rewrite it so the error is passed to a callback instead, and handled without crashing

**✅ Deliverable:** `timers.js` + `callbacks.js` + screenshot of both outputs.

---

## Task 6 — Callback Hell: Build It, Then Escape It

### 6.1 — `fake-db.js`

Build your **own** fake database, not the README's. Different data, same idea.

- [ ] At least **three** lookup tables — for example `STUDENTS`, `SCORES` and `COURSES` — linked by ids
- [ ] Add a **fourth** level that the README didn't have — `TEACHERS`, `ROOMS`, `CITIES`, anything linked from the previous level
- [ ] One error-first function per table (`getStudent`, `getScores`, `getCourse`, `getTeacher`…), each answering through `setTimeout`
- [ ] Every function calls back with an `Error` when the id doesn't exist
- [ ] At least one function uses a **different delay per id**, so answers can come back out of order

> Modules get their own session later. Paste `fake-db.js` at the top of each file that uses it.

### 6.2 — `hell.js` — The Pyramid

- [ ] Chain **all four** lookups for one student, nesting each inside the previous callback
- [ ] Print one line using data from **every** level, built with a template literal
- [ ] Handle the error at **every** level
- [ ] Break it on purpose three ways — bad student id, bad course id, bad teacher id — and confirm each one reports a clear error
- [ ] Count the levels of indentation at the deepest line and write it in a comment

### 6.3 — `flat.js` — The Escape

- [ ] Rewrite the same chain as **named functions**, one per step, none nested more than one level deep
- [ ] One `done` callback threaded through every step — errors are handled in **one** place
- [ ] Each step builds a **new** object with spread (`{ ...student, scores }`) — no mutation
- [ ] Wrap it as `buildReport(id, done)` — a function that is itself error-first and async
- [ ] Call `buildReport` for a good id and a bad id **at the same time**, and explain in a comment why they finish in the order they do

### 6.4 — Defend Yourself

- [ ] Write a `once(fn)` helper — a closure plus `...args` — so a callback can only ever run once
- [ ] Write a deliberately broken function that calls its callback twice, and prove `once` stops the second call

**✅ Deliverable:** `fake-db.js` + `hell.js` + `flat.js` + screenshot of both outputs.

---

## Task 7 — Build: The Grade Library + Async Report

The main build. First rewrite your **own** Day 03 library in modern syntax. Then feed it data that **arrives** instead of sitting in an array.

### 7.1 — `grade-lib.js` — Pure Functions Only

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

### 7.2 — `students.json`

- [ ] A JSON file with **at least 10** students, each with `id`, `name`, `score` and `attendance`
- [ ] At least **three** with holes — a missing `attendance`, a missing nested `address`, and one invalid score
- [ ] Valid JSON: double quotes, no trailing commas, no comments

### 7.3 — `report.js` — The Program

Paste `grade-lib.js`'s functions at the top — modules get their own session later.

**Loading the data (Part 2):**

- [ ] Read `students.json` with `fs.readFile` — **not** `readFileSync`
- [ ] Handle the read error error-first — rename the file, run it, and prove a clear message prints instead of a crash
- [ ] Handle a `JSON.parse` error without crashing (break the JSON on purpose to test this one — `try`/`catch` **does** work here, because `JSON.parse` is synchronous)
- [ ] Print `Loading…` **before** the file arrives, proving the read doesn't block
- [ ] For each student, simulate a slow "attendance service" with `getAttendance(id, callback)` — a `setTimeout` with a **different delay per student**
- [ ] Load every student's attendance **in parallel**, storing results by **index** and counting completions
- [ ] Log each arrival as it happens, then print the report in the **original** order
- [ ] Measure the total time with `Date.now()`, and comment what it **would** have been one-after-another, and why it isn't

**Printing the report (Part 1):**

- [ ] Loop with `for (const { name, score } of students)` — destructure in the loop header
- [ ] Skip invalid records with `continue`, counting them
- [ ] Print a header, one `formatRow` line per valid student, and a separator
- [ ] Print the summary using `const [lowest, highest] = minMaxStudent(...)`
- [ ] Print the grade tally with `Object.entries` and `[grade, count]` destructuring
- [ ] Apply `withBonus` to one student and print **both** the original and the boosted score, proving no mutation
- [ ] All grading logic lives in the `grade-lib.js` functions — `report.js`'s own code holds **none**

### 7.4 — Prove It's Better

- [ ] In `NOTES.md`, paste your Day 03 line count and your Day 04 line count for the library
- [ ] Pick **one** function and paste the Day 03 version next to the Day 04 version
- [ ] Write two sentences: what the new signature tells a reader that the old one didn't

**✅ Deliverable:** `grade-lib.js` + `students.json` + `report.js` + screenshot of the output — the one showing arrival order **and** printed order.

---

## Task 8 — The Browser Side

Create `index.html` and `app.js`: **one** Student Dashboard that uses both parts. Nothing mutates, and nothing freezes.

**The dashboard (Part 1):**

- [ ] Inputs for **name**, **score**, and an **optional city**, plus **Add** and **Clear** buttons
- [ ] `app.js` split into two clearly commented sections: **pure logic** at the top, **DOM handling** below
- [ ] A `describe({ name, score, city = "Unknown" })` function using a destructured parameter and a template literal
- [ ] Adding a student uses `students = [...students, newStudent]` — **no `.push`**
- [ ] The optional city adds **no key at all** when the field is left blank
- [ ] Guard clauses for empty name, empty score, non-number, and out of `0–100`
- [ ] A `render()` rebuilding the list, and a summary line with the count and the average to one decimal

**Loading from a server (Part 2):**

- [ ] A **Load from server** button that calls a fake `fetchStudents(callback)` with a delay of at least one second
- [ ] `fetchStudents` fails randomly about 1 time in 4 — with an error-first callback
- [ ] While loading: the button is **disabled** and a `Loading…` message shows
- [ ] On success: the loaded students are **merged** into the list with spread — added students are kept
- [ ] On failure: a clear error message shows, **and the button is re-enabled**
- [ ] `console.log` a line right after sending the request, proving the page carries on

**Freeze vs don't (Part 2):**

- [ ] A **Freeze** button that runs `blockFor(3000)` — prove you can't type in the name input while it runs
- [ ] A **Chunked** button that does the same 3 seconds of work in slices with `setTimeout(step, 0)`, updating a progress message

**Wiring:**

- [ ] Named handlers wired with `addEventListener` — pass the function, don't call it
- [ ] Runs through **Live Server**
- [ ] Screenshot the page with at least 5 students — some added by hand, some loaded — and DevTools console open
- [ ] Screenshot the error state after a failed load

> **The point of this task:** replacing the array instead of mutating it is the entire reason React can tell that something changed. And "the page froze" is the most common complaint about bad web apps. You now know what causes both — and what fixes both.

**✅ Deliverable:** `index.html` + `app.js` pushed + 2 screenshots.

---

## Task 9 — Notes and Repository

### 9.1 — Repo Structure

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
    ├── timers.js
    ├── callbacks.js
    ├── fake-db.js
    ├── hell.js
    ├── flat.js
    ├── grade-lib.js
    ├── students.json
    ├── report.js
    ├── index.html
    └── app.js
```

- [ ] Add a Day 04 row to your root `README.md` table of contents

### 9.2 — `day-04/NOTES.md`

**In your own words** — not the README's words.

**Part 1:**

- [ ] What destructuring actually does, and how object and array destructuring differ in what they match on
- [ ] What `const { a: b } = obj` creates — and what it does **not** create
- [ ] When a destructuring default fires — and the three values that do **not** trigger it
- [ ] Why `const { x } = undefined` throws, and the fix
- [ ] Rest vs spread — the rule you use to tell them apart at a glance
- [ ] What "shallow copy" means, and the exact bug it caused you in Task 3.5
- [ ] Why spread order matters when merging defaults
- [ ] The difference between `||` and `??`, with the `0` example from Task 4
- [ ] Your Task 7.4 answer — the line counts and the before/after function

**Part 2:**

- [ ] What "single-threaded" means, and what blocking costs in the browser
- [ ] Draw the event loop — ASCII is fine — with the stack, the APIs, both queues, and the loop
- [ ] Why `setTimeout(fn, 0)` doesn't run immediately, and which queue goes first
- [ ] Why you can't `return` a value out of an async callback, and what you do instead
- [ ] The error-first convention, and why the `return` in `return callback(err)` matters
- [ ] Why `try`/`catch` can't catch an error thrown inside a `setTimeout`
- [ ] The three problems with callbacks, in one sentence each
- [ ] Parallel vs sequential — the time difference from Task 7, and why results go in by index

**Both:**

- [ ] **One bug you hit**, the exact error message or wrong output, and how you fixed it

> The bug section is not optional. If nothing broke, you copy-pasted.

### 9.3 — Six Separate Commits

- [ ] Commit 1 — `predictions.md` + `predictions.js`
- [ ] Commit 2 — `destructuring.js` + `spread.js` + `messy.js`
- [ ] Commit 3 — `timers.js` + `callbacks.js`
- [ ] Commit 4 — `fake-db.js` + `hell.js` + `flat.js`
- [ ] Commit 5 — `grade-lib.js` + `students.json` + `report.js`
- [ ] Commit 6 — browser files + `NOTES.md`

Real commit messages. `update` is not a message.

- [ ] Run `git log --oneline` and screenshot it.

**✅ Deliverable:** repo link + `git log` screenshot.

---

## Task 10 — Share It

- [ ] Post on **LinkedIn** about completing Day 4
- [ ] Include the screenshot of your `report.js` output
- [ ] Include the link to your repo
- [ ] Show **one** before-and-after: Day 03's function signature next to Day 04's, **or** your `hell.js` pyramid next to your `flat.js`
- [ ] Say one concrete thing you understood that you didn't before — the shallow copy bug, `??` vs `||` on a zero, why `setTimeout(fn, 0)` isn't instant, why the page froze. Not "excited to continue my journey".

**✅ Deliverable:** the link to your post.

---

## Bonus (Optional)

- [ ] Write `pick(object, keys)` and `omit(object, keys)` — the second one using object rest
- [ ] Write `groupBy(students, key)` returning `{ Cairo: [...], Alexandria: [...] }` using computed keys
- [ ] Write `deepMerge(a, b)` that merges nested objects one level deeper than spread does
- [ ] Use `structuredClone` on the nested object from Task 3.5 and compare it to the manual nested spread
- [ ] Add a **Remove** button per row and an **Undo** button holding the previous `students` array — one line, thanks to immutability
- [ ] Write `series(tasks, done)` that runs callback-style functions **one after another**, stopping at the first error
- [ ] Write `withTimeout(fn, ms)` that calls back with a `"Timed out"` error if `fn` doesn't answer in time — and ignores the late answer
- [ ] Write `retry(fn, times, done)` that retries a randomly failing function up to `times` attempts
- [ ] Write `debounce(fn, ms)` and use it on a search input in the dashboard
- [ ] Rewrite `getAttendance` from Task 7 with `new Promise` (peek at the README's teaser) and compare the two versions in `NOTES.md`

---

## Submission Checklist

- [ ] **Task 1** — `predictions.md` with wrong answers explained + screenshot
- [ ] **Task 2** — `destructuring.js` + screenshot
- [ ] **Task 3** — `spread.js` + screenshot (include the shallow-copy screenshot)
- [ ] **Task 4** — `messy.js` + screenshot
- [ ] **Task 5** — `timers.js` + `callbacks.js` + screenshot (include the called-twice screenshot)
- [ ] **Task 6** — `fake-db.js` + `hell.js` + `flat.js` + screenshot
- [ ] **Task 7** — `grade-lib.js` + `students.json` + `report.js` + screenshot
- [ ] **Task 8** — `index.html` + `app.js` + 2 screenshots
- [ ] **Task 9** — repo link, correct structure, `NOTES.md`, 6 commits, `git log` screenshot
- [ ] **Task 10** — LinkedIn post link

Submit all links together before the next session.

---

## How This Is Graded

| Level | What it looks like |
|---|---|
| ❌ **Incomplete** | Copy-pasted README code, predictions written after running, `.push` and `student.score` still everywhere, `readFileSync` in the report, results printed in arrival order, a button that stays disabled after an error, one giant commit, or code you can't explain line by line |
| ✅ **Done** | All ten tasks, working code, a genuinely non-mutating `grade-lib.js`, a four-level pyramid **and** its flat rewrite, a genuinely parallel report printed in the original order, every error path handled, `NOTES.md` in your own words, a real bug documented |
| 🔥 **10%** | Done + the bonus + a `report.js` that does something beyond the spec + notes someone else could actually learn from |

---

## A Reminder

> **90%** study only — free, self-paced, no assignments turned in.
> **10%** study + assignments + more — I personally help this group get there.
>
> **If you show up for the 10%, I show up for you.**

The next session is **Promises and Async/Await** — the fix for everything that hurt in Part 2. Come with `report.js` running.

---

← Back to [Day 04 README](README.md)
