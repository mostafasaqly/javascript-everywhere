# Day 05 — Assignment

**Track 1 · Day 5 · Promises, Async/Await, Modules + Git & GitHub**

> Day 04 made you build the pyramid by hand and paste `grade-lib.js` into every file.
> Today you fix both — for good. You'll promisify your **own** Day 04 database, rewrite your async report with `await`,
> split it into modules that run in Node **and** the browser, and ship the whole thing through branches and a pull request.
> Same behaviour as Day 04. Half the code. And a history you can trust.

**⏱ Budget:** 12–14 hours · **📅 Duration:** 6 days · **🚩 Deadline:** before the next session

| # | Task | Part | Deliverable |
|---|---|---|---|
| 1 | Predict, then run | 1–4 | `predictions.md` + 1 screenshot |
| 2 | Promise basics lab | 1 | `promises.js` + 1 screenshot |
| 3 | Promisify your Day 04 database, then flatten the pyramid | 1 | `promisify.js` + `promise-db.js` + `chain.js` + 1 screenshot |
| 4 | Combinators lab | 1 | `combinators.js` + 1 screenshot |
| 5 | `async` / `await` lab | 2 | `await.js` + 1 screenshot |
| 6 | Modules lab — CommonJS and ESM | 3 | `cjs/` + `esm-lab/` + 1 screenshot |
| 7 | Build: the async grade report, as modules | 1–3 | `project/` folder + 1 screenshot |
| 8 | Browser: one module, two runtimes | 2 + 3 | `index.html` + `main.js` + 2 screenshots |
| 9 | Git lab — staging, `.gitignore`, branches, a conflict | 4 | `.gitignore` + `git log --graph` screenshot |
| 10 | Pull request workflow | 4 | merged PR link |
| 11 | Notes + repo | — | `NOTES.md` + repo link + `git log` screenshot |
| 12 | Share it | — | LinkedIn post link |

> **Type every line by hand. Do not copy-paste.** You are building muscle memory, and `Ctrl+V` builds none.

> **Do this whole assignment on a branch.** Read Tasks 9 and 10 before you start, and create `feature/day-05` before writing a single file.

---

## Task 1 — Predict, Then Run

Twenty-one snippets. The Promise ones are about **values and order** — none of them crash, so you can run #1–#10 from one file. The module ones are **two or more files** — put each in its own small folder (`p11/`, `p12/`, …). Run the Git ones in a **throwaway** `git init` folder, not your course repo.

### 1.1 — Write Your Predictions First

- [ ] Create `predictions.md`
- [ ] For **each** numbered snippet, write the exact output, order, or **exact error name** — **before running anything**

#### Parts 1–2 — Promises and `await`

```js
// 1
console.log("a");
new Promise((resolve) => {
  console.log("b");
  resolve();
});
console.log("c");

// 2
const p2 = new Promise((resolve) => {
  resolve("first");
  resolve("second");
});
p2.then((v) => console.log(v));

// 3
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
Promise.resolve("start")
  .then(() => {
    delay(100).then(() => "slow value");
  })
  .then((v) => console.log(v));

// 4
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("then"));
console.log("sync");

// 5
async function f() {
  console.log("B");
  await null;
  console.log("D");
}
console.log("A");
f();
console.log("C");

// 6
async function run() {
  [3, 1, 2].forEach(async (n) => {
    await delay(n * 10);
    console.log(n);
  });
  console.log("done");
}
run();

// 7
const later = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
Promise.all([later(300, "slow"), later(100, "fast")]).then((values) => console.log(values));

// 8
Promise.all([later(100, "a"), Promise.reject(new Error("b failed")), later(50, "c")])
  .then((values) => console.log(values))
  .catch((e) => console.log("all:", e.message));

// 9
const failAt = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error(`failed at ${ms}`)), ms));
Promise.race([later(200, "win"), failAt(100)])
  .then((v) => console.log("race:", v))
  .catch((e) => console.log("race:", e.message));
Promise.any([later(200, "win"), failAt(100)])
  .then((v) => console.log("any:", v));

// 10
async function risky() {
  throw new Error("boom");
}
async function main10() {
  try {
    return risky();
  } catch (e) {
    console.log("caught inside:", e.message);
  }
}
main10().catch((e) => console.log("caught outside:", e.message));
```

#### Part 3 — Modules

```js
// 11 — a.js
exports.x = 1;
exports = { y: 2 };
// main.js
console.log(require("./a"));

// 12 — counter.js
let count = 0;
module.exports = () => ++count;
// main.js
const c1 = require("./counter");
const c2 = require("./counter");
console.log(c1(), c2(), c1());

// 13 — main.mjs
console.log("main");
import "./b.mjs";
// b.mjs
console.log("b");

// 14 — lib.mjs
export default function hello() {}
// main.mjs
import greet from "./lib.mjs";
console.log(greet.name);

// 15 — counter.mjs
export let count = 0;
export function inc() { count++; }
// main.mjs
import { count, inc } from "./counter.mjs";
inc();
inc();
console.log(count);

// 16 — counter.js
let count = 0;
function inc() { count++; }
module.exports = { count, inc };
// main.js
const { count, inc } = require("./counter");
inc();
inc();
console.log(count);

// 17 — main.mjs (same counter.mjs as #15)
import { count } from "./counter.mjs";
count = 5;

// 18 — lib.mjs
export const x = 1;
// main.mjs
import { X } from "./lib.mjs";
console.log(X);
```

#### Part 4 — Git

```bash
# 19 — notes.txt is committed containing "v1"
echo v2 > notes.txt
git add notes.txt
echo v3 > notes.txt
git status --short        # what does this print?
git commit -m "Update notes"
git status --short        # and now? which version was committed — v2 or v3?

# 20
git switch -c feature
echo x > feature.txt
git add . && git commit -m "Add feature file"
git switch main
ls feature.txt            # is it there?

# 21 — main has not moved since `feature` was created
git merge feature         # what's the first word Git prints on line 2?
```

### 1.2 — Now Run Them

- [ ] Run every snippet and record the **actual** result next to each prediction
- [ ] For every one you got **wrong**, write one sentence explaining why
- [ ] For **#2, #3, #6, #10, #11, #15 vs #16, #17 and #19** name the mechanism explicitly — these are the ones that cause real bugs
- [ ] Screenshot the output

> Getting them wrong is the assignment. Getting them wrong and not explaining why is not.

**✅ Deliverable:** `predictions.md` with predictions, actuals, and explanations + screenshot.

---

## Task 2 — Promise Basics Lab

Create `promises.js`. Run after every part.

### 2.1 — Create

- [ ] Write `delay(ms)` returning a Promise that fulfils after `ms` milliseconds
- [ ] Write `delayValue(ms, value)` that fulfils **with** `value`
- [ ] Write `failAfter(ms, message)` that rejects with a real `Error` after `ms`
- [ ] Log a Promise **before** it settles and **after** — screenshot `<pending>` next to the settled value

### 2.2 — Settles Once

- [ ] Write a Promise that calls `resolve` twice with different values — prove only the first one counts
- [ ] Write one that calls `resolve` and then `reject` — prove the `reject` is ignored
- [ ] Comment one sentence: which Day 04 callback bug does this make impossible?

### 2.3 — Chain

- [ ] Chain four `.then`s that each transform a number, and log the final result
- [ ] Chain three steps where each one **returns** a `delayValue(...)`, and prove the chain waits for each
- [ ] Remove one `return`, log what the next step receives, then put it back
- [ ] Destructure an object value directly in a `.then` parameter: `.then(({ name, score }) => …)`

### 2.4 — Errors

- [ ] `throw` inside a `.then` and catch it in a `.catch` three steps later — prove the steps in between were skipped
- [ ] Use a `.catch` that **returns a fallback value**, and prove the chain continues after it
- [ ] Add a `.finally` that logs `"cleanup"` on both a fulfilled and a rejected chain
- [ ] `reject("a string")` once and `reject(new Error("…"))` once — log `err.message` for both and comment on the difference
- [ ] Create a rejected Promise with **no** `.catch`, run it, screenshot the crash, then add the `.catch`

**✅ Deliverable:** `promises.js` + screenshot of the full output.

---

## Task 3 — Promisify Your Day 04 Database, Then Flatten the Pyramid

Take **your own** Day 04 `fake-db.js` — the one with four tables and the level you invented.

### 3.1 — `promisify.js` — Wrap It

- [ ] Paste your Day 04 `fake-db.js` at the top — unchanged, still callback-style
- [ ] Wrap **one** function by hand: `getStudent(id)` returning `new Promise(...)` around `getStudentCb`
- [ ] Write your own `promisify(fn)` — a closure using `...args` — and use it to wrap the other three
- [ ] Wrap one of them with Node's `util.promisify` as well, and prove it behaves identically to yours
- [ ] Call each wrapped function once with a good id (`.then`) and once with a bad one (`.catch`)

### 3.2 — `promise-db.js` — Rewrite It

- [ ] Rewrite `fake-db.js` so every function **returns a Promise directly** — no callbacks anywhere
- [ ] Use **one** shared helper (like the README's `lookup`) instead of repeating `new Promise` four times
- [ ] Keep your different-delay-per-id behaviour from Day 04
- [ ] Every rejection is a real `Error` with a message that names the table and the id

### 3.3 — `chain.js` — The Pyramid, Flattened

Paste your `promise-db.js` at the top — Task 7 is where the pasting stops.

- [ ] Rewrite your Day 04 `hell.js` four-level lookup as **one flat `.then` chain**
- [ ] Every step `return`s the next Promise
- [ ] Print one line using data from **every** level, built with a template literal
- [ ] Exactly **one** `.catch`, at the end, handles a failure at **any** level
- [ ] Break it three ways — bad student id, bad course id, bad teacher id — and prove the same `.catch` reports each one
- [ ] Add a `.finally` that logs how long the whole chain took
- [ ] Wrap it as `buildReport(id)` that **returns** the chain, so callers can `.then` it
- [ ] In a comment, count: how many `if (err)` lines did Day 04's `hell.js` have, and how many error checks does `chain.js` have?

**✅ Deliverable:** `promisify.js` + `promise-db.js` + `chain.js` + screenshot of the good run and the three broken runs.

---

## Task 4 — Combinators Lab

Create `combinators.js`. Use your `delayValue` and `failAfter` from Task 2.

### 4.1 — `Promise.all`

- [ ] Pass three Promises with **different** delays and prove the result array is in **input** order, not finish order
- [ ] Measure the total time with `Date.now()` — prove it's the slowest one, not the sum
- [ ] Make one of them reject and show that `.all` rejects — and that the other values are lost
- [ ] Rebuild Day 04's parallel loader (`loadAll`) with `Promise.all` + `map`, and compare the line counts in a comment

### 4.2 — `Promise.allSettled`

- [ ] Run the same three (one failing) through `allSettled`, and print a ✓ / ✗ line for each using `status`, `value` and `reason`
- [ ] Count the failures with `filter`

### 4.3 — `Promise.race` and `Promise.any`

- [ ] Race a slow success against a fast failure — show `race` rejects
- [ ] Run the same pair through `any` — show it fulfils
- [ ] Make **every** Promise passed to `any` reject, and log the `AggregateError`'s name and its `errors.length`
- [ ] In a comment, write one sentence per combinator: when would you use it in a real app?

**✅ Deliverable:** `combinators.js` + screenshot of the full output.

---

## Task 5 — `async` / `await` Lab

Create `await.js`. Paste your `promise-db.js` at the top.

### 5.1 — Rewrite

- [ ] Rewrite Task 3's `buildReport` with `async` / `await` — no `.then` anywhere in it
- [ ] Every intermediate value is a plain `const` — no `let` shared between steps
- [ ] Log what `buildReport(1)` returns **without** `await` — screenshot the `Promise`
- [ ] Write `main()` with `try` / `catch` / `finally` that reports a good id and a bad id, and logs `"done"` in `finally`
- [ ] Call it as `main().catch(…)` at the bottom of the file

### 5.2 — Sequential vs Parallel

- [ ] Load students 1, 2 and 3 **sequentially** with a `for…of` loop and `await`, and time it
- [ ] Load the same three **in parallel** with `Promise.all` + `map`, and time it
- [ ] Print both times, and comment on why the difference is what it is
- [ ] Write one example where sequential is **correct** — a step that genuinely needs the previous result — and comment why

### 5.3 — The `forEach` Trap

- [ ] Use `ids.forEach(async (id) => …)` and log `"done"` after it — screenshot `"done"` printing first
- [ ] Fix it once with `for…of`, and once with `Promise.all` + `map`

### 5.4 — `return await`

- [ ] Write an `async` function with `return risky()` inside a `try` — prove its `catch` never runs
- [ ] Change it to `return await risky()` — prove the `catch` now runs
- [ ] Comment one sentence explaining the difference

**✅ Deliverable:** `await.js` + screenshot of the full output.

---

## Task 6 — Modules Lab: CommonJS and ESM

Two small folders. Screenshot every error you're asked to cause, then fix it.

### 6.1 — `cjs/` — Export and Require

No `package.json` needed — CommonJS is the default.

- [ ] `lib/grade-lib.js` with `letterGrade`, `average` and `formatRow`, exported with `module.exports = { … }`
- [ ] One **private** helper function that is **not** exported — prove `report.js` can't see it
- [ ] `lib/delay.js` that exports **one** function directly: `module.exports = (ms) => …`
- [ ] `report.js` that uses destructuring on `require` to get only what it needs
- [ ] Load `students.json` with `require` — no `fs`, no `JSON.parse`

### 6.2 — `cjs/` — The Cache

- [ ] Add a `console.log` at the top of `grade-lib.js` and `require` it from **two** different files — prove it prints once
- [ ] Write `lib/counter.js` that exports a function incrementing a private `count`, require it from two files, and prove they share the same count

### 6.3 — `cjs/` — Break It

- [ ] Replace `module.exports = { … }` with `exports = { … }`, screenshot the error, then fix it
- [ ] `require` a path without `./` (`require("lib/grade-lib")`), screenshot the error, and comment why Node looked in the wrong place

### 6.4 — `esm-lab/` — Every Import Form

Create `esm-lab/` with a `package.json` containing `"type": "module"`.

- [ ] A module with **at least three named exports** and **one default export**
- [ ] Import named exports in braces
- [ ] Rename one with `as`
- [ ] Import the whole module with `import * as`, and log `Object.keys` of it
- [ ] Import the default under **two different names** in two files, and prove they're the same function
- [ ] Use a dynamic `await import(…)` inside an `if`

### 6.5 — `esm-lab/` — ESM Rules

- [ ] Use top-level `await` to read a file with `node:fs/promises` — no `main()` wrapper
- [ ] Build a path with `new URL("./file.json", import.meta.url)` and prove it works when you run `node` from a **different** folder
- [ ] Log `import.meta.dirname` and `import.meta.filename`
- [ ] Recreate snippet #15 vs #16 from Task 1 and comment in your own words why they differ

### 6.6 — `esm-lab/` — Break It

- [ ] Remove the `.js` extension from a relative import
- [ ] Use `require` in an ESM file
- [ ] Use `__dirname` in an ESM file
- [ ] Import a name that isn't exported
- [ ] Delete `"type": "module"` and read what Node prints

**✅ Deliverable:** `cjs/` + `esm-lab/` + screenshot of the outputs and errors.

---

## Task 7 — Build: The Async Grade Report, as Modules

The main build. Your Day 04 `report.js` — rewritten with `await` **and** split into modules. Same `students.json` data, same `grade-lib.js` functions, same output. No function pasted anywhere.

### 7.1 — Structure

- [ ] Create `day-05/project/` with this shape (add more files if you need them):

```
day-05/project/
├── package.json          { "type": "module" }
├── students.json
├── report.js
└── lib/
    ├── index.js
    ├── grade-lib.js
    ├── db.js
    └── async-utils.js
```

- [ ] `package.json` has `"type": "module"` — and a `"scripts": { "report": "node report.js" }` entry so `npm run report` works

### 7.2 — The Modules

- [ ] `lib/grade-lib.js` — every grading function from your Day 04 `grade-lib.js`, as **named** exports, **no** `console.log`
- [ ] `lib/db.js` — `getAttendance(id)` **returning a Promise**, with a different delay per student, failing for at least one student — as the **default export**
- [ ] `lib/async-utils.js` — `delay`, `withTimeout` and `retry` from Part 2, as named exports
- [ ] `lib/index.js` — a barrel that re-exports everything `report.js` needs
- [ ] No function is defined in more than one file — search your folder to prove it

### 7.3 — `report.js`

- [ ] Imports **only** from `./lib/index.js`, `node:` built-ins, and npm packages (Task 9 adds one)
- [ ] Uses **top-level `await`** — no `main()` wrapper
- [ ] Reads `students.json` with `node:fs/promises` and a path built from `import.meta.url` — no `readFileSync`
- [ ] **One** `try` / `catch` handles a missing file **and** broken JSON — test both
- [ ] `Loading…` prints first, and a `finally` prints the total time taken
- [ ] Wraps the file load in `withTimeout(…, 2000)`, and proves it fires by setting the timeout to `1`
- [ ] Loads every student's attendance in parallel with `Promise.allSettled` + `map`
- [ ] Wraps `getAttendance` in `retry` so a flaky student succeeds on a later attempt, logging each failed attempt
- [ ] Students whose attendance failed still appear in the report, with attendance shown as `—`
- [ ] Prints in the **original** order — header, one `formatRow` line per valid student, separator, summary, grade tally
- [ ] Invalid students are skipped and counted, like Day 04
- [ ] `withBonus` still proves no mutation
- [ ] Has **no** grading logic of its own — only imports, calls, and `console.log`
- [ ] Runs with `npm run report` **and** with `node day-05/project/report.js` from the repo root

### 7.4 — Prove It's Better

- [ ] In `NOTES.md`, paste your Day 04 `report.js` line count next to today's `report.js` + `lib/` line counts
- [ ] Count how many copies of `letterGrade` existed across your Day 03–04 folders, vs how many exist now
- [ ] Write two sentences: what got shorter, and what got **clearer**?

**✅ Deliverable:** `project/` folder + screenshot of `npm run report`.

---

## Task 8 — The Browser Side: One Module, Two Runtimes

In `day-05/project/`, add `index.html` and `main.js`. They import the **same** `lib/` files your Node report uses — and rebuild Day 04's Load button with `await`.

### 8.1 — Modules in the Browser

- [ ] `index.html` loads `main.js` with `<script type="module">`
- [ ] `main.js` imports from the **same** `lib/grade-lib.js`, `lib/db.js` and `lib/async-utils.js` as `report.js` — no copies
- [ ] Handlers wired with `addEventListener` — no `onclick` in the HTML
- [ ] Runs through **Live Server**
- [ ] In DevTools, type the name of a variable from `main.js` and screenshot the `ReferenceError` — module scope
- [ ] Open the **Network** tab, reload, and screenshot `main.js` **and** the `lib/` files being requested
- [ ] Open the page as `file://` once, screenshot the CORS error, and comment why

### 8.2 — Loading With `await`

> `fetch` gets its own full session soon. Today you only need `const res = await fetch("./students.json");` and `const data = await res.json();`

- [ ] A **Load students** button whose handler is an `async` function with `try` / `catch` / `finally`
- [ ] It loads `students.json` with `await fetch(…)` and `.json()`
- [ ] While loading: the button is **disabled** and a `Loading…` message shows
- [ ] The button is re-enabled in **`finally` only** — not in the `try` or the `catch`
- [ ] Attendance for every student loads in parallel with `Promise.allSettled` and the imported `getAttendance`, and a failed one shows `—`
- [ ] The status line says how many attendance lookups failed, if any
- [ ] A **Simulate slow network** checkbox adds a delay before the fetch, long enough to trip a `withTimeout` of 2 seconds
- [ ] A **Time both** button prints sequential vs parallel timings for the attendance calls
- [ ] An **Add** form adds students with `students = [...students, newStudent]`, showing letter grade and PASS/FAIL from the imported `letterGrade` and `PASS_MARK`
- [ ] A summary line using the imported `average`
- [ ] Screenshot a successful load with at least one `—` attendance and DevTools console open
- [ ] Screenshot the timeout error after a slow load

> **The point of this task:** the `lib/` folder has no idea whether it's running in Node or Chrome. Pure functions + ES modules + Promises = code that runs everywhere. That's the "Everywhere" in the course name.

**✅ Deliverable:** `index.html` + `main.js` + 2 screenshots.

---

## Task 9 — Git Lab: Staging, `.gitignore`, Branches, a Conflict

In your **course repo**. Follow README Steps 11 and 12 on **your own** code.

### 9.1 — Staging

- [ ] Change **two** files, then stage and commit them as **two separate** commits
- [ ] Use `git diff` before staging and `git diff --staged` after, and screenshot both
- [ ] Stage a file, then unstage it with `git restore --staged`
- [ ] Make a throwaway edit and discard it with `git restore`

### 9.2 — `.gitignore`

- [ ] Add a `.gitignore` at the repo root covering `node_modules/`, `.env`, and your OS/editor clutter
- [ ] Create a fake `.env` containing `SECRET=abc` and prove `git status` doesn't show it
- [ ] Run `npm install dayjs` in `day-05/project/`, import it in `report.js` to print today's date, and prove `node_modules/` stays out of `git status`
- [ ] Confirm `package.json` **does** show the new dependency, and commit it

### 9.3 — History

- [ ] Rewrite one bad commit message from an earlier day **as it should have been** in `NOTES.md` — don't change history, just show the better version
- [ ] Use `git log --oneline --graph` and `git show <hash>` on one of today's commits
- [ ] Amend your **latest unpushed** commit with `git commit --amend` to fix its message

### 9.4 — A Clean Branch

- [ ] Do Tasks 1–8 on `feature/day-05` — **not** on `main`
- [ ] At least **six** commits on the branch, each one logical change with an imperative message
- [ ] Merge it into `main` — note whether it was a fast-forward
- [ ] Delete the branch with `git branch -d`

### 9.5 — A Conflict on Purpose

- [ ] Create `experiment/pass-mark` and change `PASS_MARK` on it
- [ ] On `main`, change the **same line** to a different value
- [ ] Merge, screenshot the `CONFLICT` message and the markers in the file
- [ ] Resolve it by hand, delete all three marker lines, and prove `npm run report` still works
- [ ] Complete the merge with `git add` + `git commit`
- [ ] Start a second conflict and cancel it with `git merge --abort`
- [ ] Screenshot `git log --oneline --graph` showing the merge

**✅ Deliverable:** `.gitignore` committed + the `git log --oneline --graph` screenshot with the merge visible.

---

## Task 10 — Pull Request Workflow

Every change from here on goes through a PR. Practise the full loop on your own repo.

- [ ] Start from an up-to-date `main` (`git switch main && git pull`)
- [ ] Create `docs/day-05-notes` and write `day-05/NOTES.md` on it (Task 11)
- [ ] Push it with `git push -u origin docs/day-05-notes`
- [ ] Open a pull request on GitHub
- [ ] Give it an imperative **title** and a **What / Why / How to test** description
- [ ] Look at the **Files changed** tab and leave yourself at least **one review comment** on a line
- [ ] Push **one more commit** to the same branch, and see it appear in the PR
- [ ] **Merge** the pull request on GitHub, then **delete** the branch there
- [ ] Locally: `git switch main`, `git pull`, `git branch -d docs/day-05-notes`
- [ ] Screenshot the merged PR page

**✅ Deliverable:** the link to your merged pull request.

---

## Task 11 — Notes and Repository

### 11.1 — Repo Structure

- [ ] Your repo now looks like this:

```
javascript-everywhere/
├── .gitignore
├── README.md
├── day-01/ … day-04/
└── day-05/
    ├── NOTES.md
    ├── predictions.md
    ├── predictions.js
    ├── p11/ … p18/
    ├── promises.js
    ├── promisify.js
    ├── promise-db.js
    ├── chain.js
    ├── combinators.js
    ├── await.js
    ├── cjs/
    ├── esm-lab/
    └── project/
        ├── package.json
        ├── package-lock.json
        ├── students.json
        ├── report.js
        ├── index.html
        ├── main.js
        └── lib/
```

- [ ] Add a Day 05 row to your root `README.md` table of contents

### 11.2 — `day-05/NOTES.md`

**In your own words** — not the README's words.

**Parts 1–2 — Promises and `await`:**

- [ ] What a Promise is, its three states, and why "settles once" fixes a real Day 04 bug
- [ ] The missing-`return` bug — what it looks like and what it does
- [ ] How one `.catch` — or one `try` — replaces every `if (err)`
- [ ] `all` vs `allSettled` vs `race` vs `any` — one line each, with when to use it
- [ ] Why `.then` callbacks run before a `setTimeout(…, 0)`
- [ ] What `await` pauses — and what it does **not** pause
- [ ] Sequential vs parallel — the question you ask before every `await`, with your Task 5.2 timings
- [ ] Why `forEach(async …)` doesn't wait, and why `return await` matters inside `try`

**Part 3 — Modules:**

- [ ] What a module is, and the three rules that make modules work
- [ ] `module.exports` vs `exports`, and the trap
- [ ] Named vs default exports — which you prefer, and why
- [ ] Five differences between CommonJS and ESM
- [ ] Live bindings vs copies — your #15 vs #16 explanation
- [ ] Why a module page needs Live Server, and what `type="module"` changes
- [ ] Your Task 7.4 answer — the line counts and the copies of `letterGrade`

**Part 4 — Git:**

- [ ] Working tree vs staging area vs history, with a drawing
- [ ] What belongs in `.gitignore`, and why a pushed secret must be changed, not just deleted
- [ ] Fast-forward vs merge commit
- [ ] How to resolve a conflict, step by step
- [ ] The PR loop, from `git pull` to `git branch -d`
- [ ] Which undo command to use before pushing, which after — and why

**Everything:**

- [ ] **One bug you hit**, the exact error message or wrong output, and how you fixed it

> The bug section is not optional. If nothing broke, you copy-pasted.

### 11.3 — Commits

- [ ] Every commit today has an imperative, specific message — no `update`
- [ ] The work reached `main` through **at least one merge** and **at least one merged PR**
- [ ] Run `git log --oneline --graph -20` and screenshot it

**✅ Deliverable:** repo link + `git log` screenshot.

---

## Task 12 — Share It

- [ ] Post on **LinkedIn** about completing Day 5
- [ ] Include the screenshot of your `npm run report` output
- [ ] Include the link to your repo **and** your merged pull request
- [ ] Show one before-and-after: your Day 04 `hell.js` pyramid next to your `await` version, **or** your Day 04 single-file `report.js` next to today's `project/lib/` tree
- [ ] Say one concrete thing you understood that you didn't before — why `forEach(async …)` doesn't wait, why parallel beat sequential, live bindings, what a merge conflict really is. Not "excited to continue my journey".

**✅ Deliverable:** the link to your post.

---

## Bonus (Optional)

- [ ] Write your own `myPromiseAll(promises)` — without using `Promise.all` — that keeps input order and rejects fast
- [ ] Write `mapLimit(items, limit, fn)` that runs at most `limit` async calls at once
- [ ] Add exponential backoff **with jitter** to your `retry`
- [ ] Use `AbortController` to make `withTimeout` actually **cancel** a `delay`, and prove the script exits early
- [ ] Add a **Cancel** button to the browser loader that ignores a response arriving after it was clicked
- [ ] Create a circular import on purpose (`a.js` ↔ `b.js`), capture the failure, and fix it by moving the shared part into a third file
- [ ] Lazy-load a module in the browser with `import()` only when a button is clicked, and screenshot the Network tab showing it load late
- [ ] Add a GitHub **Actions** workflow that runs `npm run report` on every push
- [ ] Protect `main` on GitHub so it only accepts changes through pull requests
- [ ] Open a pull request on a classmate's repo with one genuine improvement

---

## Submission Checklist

- [ ] **Task 1** — `predictions.md` with wrong answers explained + screenshot
- [ ] **Task 2** — `promises.js` + screenshot (include the unhandled-rejection crash)
- [ ] **Task 3** — `promisify.js` + `promise-db.js` + `chain.js` + screenshot
- [ ] **Task 4** — `combinators.js` + screenshot
- [ ] **Task 5** — `await.js` + screenshot (include the `forEach` trap)
- [ ] **Task 6** — `cjs/` + `esm-lab/` + screenshot
- [ ] **Task 7** — `project/` + screenshot of `npm run report`
- [ ] **Task 8** — `index.html` + `main.js` + 2 screenshots
- [ ] **Task 9** — `.gitignore` + `git log --oneline --graph` screenshot with a merge
- [ ] **Task 10** — merged PR link
- [ ] **Task 11** — repo link, correct structure, `NOTES.md`, `git log` screenshot
- [ ] **Task 12** — LinkedIn post link

Submit all links together before the next session.

---

## How This Is Graded

| Level | What it looks like |
|---|---|
| ❌ **Incomplete** | Copy-pasted README code, predictions written after running, a `.then` with no `return`, `await` in a row for independent calls, `forEach(async …)`, a button re-enabled anywhere but `finally`, a function still defined in two files, `node_modules` or `.env` committed, everything done on `main`, no merged PR, or code you can't explain line by line |
| ✅ **Done** | All twelve tasks, your **own** Day 04 database promisified, one `.catch` / one `try` per flow, parallel work done with `Promise.all` / `allSettled`, your report split into modules that run in Node **and** the browser, a resolved conflict and a merged PR in your history, `NOTES.md` in your own words, a real bug documented |
| 🔥 **10%** | Done + the bonus + a project that does something beyond the spec + notes someone else could actually learn from |

---

## A Reminder

> **90%** study only — free, self-paced, no assignments turned in.
> **10%** study + assignments + more — I personally help this group get there.
>
> **If you show up for the 10%, I show up for you.**

The next session is **TypeScript Intro — Basic Types, Interfaces, Generics** — where your modules get types, and the editor catches bugs before you run anything. Come with `npm run report` working and your PR merged.

---

← Back to [Day 05 README](README.md)
