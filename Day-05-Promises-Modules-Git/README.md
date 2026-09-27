# Day 05 — Promises, Async/Await, Modules + Git & GitHub

**Track 1: JS/TS Foundations + Web Basics · Day 5 · four parts**

> Day 04 ended with a pyramid, four identical `if (err)` lines, and a `once()` helper to defend yourself from other people's code.
> Parts 1 and 2 make every one of those problems go away — and make async code read top to bottom again.
> Parts 3 and 4 fix the other thing that's been bothering you since Day 03: pasting `grade-lib.js` into every file, and committing straight to `main` with no safety net.

**Why this day matters:** every tool you'll touch from here on speaks Promises — `fetch`, `fs/promises`, databases, React, Electron, every AI SDK. Every real project is hundreds of files wired together with `import`. And every team you'll ever join works through branches and pull requests. This is the day your code starts looking like real-world code.

| Part | Topic | Concept | Build |
|---|---|---|---|
| **1** | Promises | Sections 1.1–1.7 | Steps 1–2 |
| **2** | Async / Await | Sections 2.1–2.7 | Steps 3–6 |
| **3** | Modules — CommonJS & ES Modules | Sections 3.1–3.7 | Steps 7–10 |
| **4** | Git & GitHub — commits, branches, PRs | Sections 4.1–4.8 | Steps 11–12 |

---

## What You'll Have by the End

**Part 1 — Promises**

- [ ] What a Promise actually is — and the three states it can be in
- [ ] Creating one with `new Promise((resolve, reject) => …)`
- [ ] Consuming one with `.then`, `.catch` and `.finally`
- [ ] Chaining — and the one missing `return` that breaks every chain
- [ ] One `.catch` for the whole chain, instead of an `if (err)` at every step
- [ ] Turning Day 04's callback functions into Promise functions
- [ ] `Promise.all`, `allSettled`, `race` and `any` — and when each one is right
- [ ] Where Promises sit in the event loop (the microtask queue, finally explained)

**Part 2 — Async / Await**

- [ ] `async` functions — and why they *always* return a Promise
- [ ] `await` — it pauses the function, not the program
- [ ] `try` / `catch` / `finally` working on async code again
- [ ] Sequential vs parallel with `await` — the most common performance bug in real apps
- [ ] Why `forEach(async …)` doesn't wait, and what to use instead
- [ ] Timeouts and retries, built from Promises you already understand
- [ ] Reading files with `fs/promises`

**Part 3 — Modules**

- [ ] Why pasting code between files breaks — and what a module fixes
- [ ] CommonJS: `require` and `module.exports`
- [ ] The `exports = …` trap, and the require cache
- [ ] ES Modules: `export`, `import`, default vs named, `as`, `* as`
- [ ] Switching Node to ESM with `"type": "module"` or `.mjs`
- [ ] CommonJS vs ESM — the differences that actually bite
- [ ] The same module file running in Node **and** the browser
- [ ] Barrel files and a folder structure that scales

**Part 4 — Git & GitHub**

- [ ] The three places your code lives: working tree, staging area, history
- [ ] `status`, `add`, `commit`, `diff`, `log` — the daily five
- [ ] `.gitignore` — and what must never be committed
- [ ] Branches: create, switch, merge, delete
- [ ] Reading and resolving a merge conflict
- [ ] `push`, `pull`, `clone` — working with GitHub
- [ ] The pull request workflow every team uses
- [ ] Undoing things safely — before and after you push

---

# Part 1 — Promises

## 1 — Concept (70 min)

### 1.1 What a Promise Is

Day 04's callbacks had one shape: *"here's a function — call it when you're done."* You handed over control and hoped.

A **Promise** flips that around. The slow function doesn't take your callback. It hands you back an **object** right away — a receipt that says *"the answer will be here later."* You keep the receipt. You decide what to do with it.

```js
const receipt = getStudent(1);   // returns IMMEDIATELY — a Promise, not a student
console.log(receipt);            // Promise { <pending> }
```

A Promise is always in exactly one of three states:

```
                    ┌──────────────────────────────┐
                    │  FULFILLED — has a value      │
  ┌──────────┐ ───▶ │  resolve(student)             │
  │ PENDING  │      └──────────────────────────────┘
  │ waiting… │      ┌──────────────────────────────┐
  └──────────┘ ───▶ │  REJECTED — has an error      │
                    │  reject(new Error("…"))       │
                    └──────────────────────────────┘
```

Fulfilled and rejected are both called **settled**. And here's the rule that fixes Day 04's worst problem:

> **A Promise settles once.** After it's fulfilled or rejected, it can never change again. Call `resolve` twice, or `reject` after `resolve` — the extra calls are silently ignored. The "callback called twice" bug from Day 04 section 2.7 is impossible by design.

---

### 1.2 Creating a Promise

You'll mostly *consume* Promises other people's code returns. But to understand them, build one:

```js
const promise = new Promise((resolve, reject) => {
  // This function is called the EXECUTOR. It runs immediately.
  setTimeout(() => {
    resolve("done!");        // fulfil with a value
  }, 1000);
});
```

You get two functions: call `resolve(value)` when it worked, `reject(error)` when it didn't.

The most useful Promise you'll ever write — a `delay` you can wait on:

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

delay(1000).then(() => console.log("one second later"));
```

And Day 04's `getStudent`, rebuilt:

```js
// Day 04 — takes a callback
function getStudentCb(id, callback) {
  setTimeout(() => {
    if (id !== 1) return callback(new Error(`No student with id ${id}`));
    callback(null, { id: 1, name: "Sara", score: 92 });
  }, 300);
}

// Day 05 — returns a Promise
function getStudent(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id !== 1) return reject(new Error(`No student with id ${id}`));
      resolve({ id: 1, name: "Sara", score: 92 });
    }, 300);
  });
}
```

Same body. The only change: `callback(err)` became `reject(err)`, and `callback(null, value)` became `resolve(value)`.

> **Always reject with an `Error`, never a string.** `reject(new Error("…"))` gives you a message *and* a stack trace. `reject("oops")` gives you a string with no idea where it came from.

`Promise.resolve(value)` and `Promise.reject(error)` make an already-settled Promise — handy for tests and for starting a chain.

---

### 1.3 Consuming a Promise — `.then`, `.catch`, `.finally`

```js
getStudent(1)
  .then((student) => {
    console.log(`Found ${student.name}`);
  })
  .catch((err) => {
    console.log(`Failed: ${err.message}`);
  })
  .finally(() => {
    console.log("Done — success or failure");
  });
```

| Method | Runs when | Receives |
|---|---|---|
| `.then(fn)` | fulfilled | the value |
| `.catch(fn)` | rejected | the error |
| `.finally(fn)` | either way | nothing — it's for cleanup (hide a spinner, re-enable a button) |

Destructuring works on the value exactly like it did on Day 04:

```js
getStudent(1).then(({ name, score }) => console.log(`${name}: ${score}`));
```

#### Chaining — the reason Promises exist

**`.then` returns a new Promise.** Whatever your function returns becomes the value of that new Promise. That's what lets you chain:

```js
Promise.resolve(2)
  .then((n) => n * 10)          // returns 20
  .then((n) => n + 1)           // returns 21
  .then((n) => console.log(n)); // 21
```

And if you return a **Promise**, the chain **waits** for it:

```js
getStudent(1)
  .then((student) => getCourse(student.courseId))  // returns a Promise — the chain waits
  .then((course) => console.log(course.title))
  .catch((err) => console.log(`Failed: ${err.message}`));
```

Put that next to Day 04's pyramid. **Flat.** And **one** `.catch` handles a failure at any step. (Each `.then` only sees what the previous one returned — Step 2 shows what to do when a later step needs data from an earlier one, and Step 3 shows why `await` makes that easy.)

#### ⚠️ The missing `return` — read this twice

```js
getStudent(1)
  .then((student) => {
    getScores(student.id);      // ❌ no return — the chain doesn't wait
  })
  .then((scores) => {
    console.log(scores);        // undefined
  });
```

With braces `{ }`, an arrow function returns nothing unless you write `return` (Day 03). The chain gets `undefined`, moves on immediately, and `getScores` runs off on its own with nobody listening — including for its errors.

```js
.then((student) => getScores(student.id))           // ✅ no braces — implicit return
.then((student) => { return getScores(student.id); }) // ✅ braces + return
```

> **Rule:** every `.then` that starts async work must `return` it. This is the #1 Promise bug.

---

### 1.4 Errors — One Place for All of Them

A rejection **skips** every `.then` until it reaches a `.catch`:

```js
getStudent(99)                                // rejects
  .then((s) => getScores(s.id))               // skipped
  .then((scores) => console.log(scores))      // skipped
  .catch((err) => console.log(err.message))   // "No student with id 99"
```

And **throwing inside a `.then` becomes a rejection** — so `throw` works again:

```js
getStudent(1)
  .then(({ score }) => {
    if (score > 100) throw new Error("Impossible score");
    return score;
  })
  .catch((err) => console.log(`Caught: ${err.message}`));
```

Remember Day 04's `try`/`catch` that couldn't catch an error thrown inside `setTimeout`? Inside a Promise chain, errors travel down the chain to the nearest `.catch`. That's the *scattered error handling* problem, solved.

#### `.catch` can recover

A `.catch` that returns a value puts the chain **back on track**:

```js
getStudent(99)
  .catch(() => ({ name: "Guest", score: 0 }))   // fallback value
  .then(({ name }) => console.log(`Hello, ${name}`));  // Hello, Guest
```

#### Unhandled rejections crash Node

```js
Promise.reject(new Error("nobody caught me"));
```

```
Error: nobody caught me
    at …
Node.js v24…            ← the process exits
```

Since Node 15, a rejected Promise with no `.catch` **ends your program**. In the browser it prints a red `Uncaught (in promise)` error. **Every chain ends in a `.catch`** — or, in Part 2, sits inside a `try`.

---

### 1.5 Promisifying — Converting Callback Functions

Lots of older code — including your Day 04 `fake-db.js` — uses error-first callbacks. Wrapping one in a Promise is a pattern called **promisifying**:

```js
// Day 04 — callback style
function getStudentCb(id, callback) { /* … */ }

// Wrapper — returns a Promise
function getStudent(id) {
  return new Promise((resolve, reject) => {
    getStudentCb(id, (err, student) => {
      if (err) return reject(err);
      resolve(student);
    });
  });
}
```

Every error-first function has the same shape, so you can write the wrapper **once** — a closure plus rest/spread, exactly Day 03 + Day 04:

```js
function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, value) => (err ? reject(err) : resolve(value)));
    });
}

const getStudent = promisify(getStudentCb);
const getScores = promisify(getScoresCb);
```

Node ships this as `util.promisify`:

```js
const { promisify } = require("util");
const getStudent = promisify(getStudentCb);
```

And most of Node's modules already have a Promise version, so you don't even need that:

```js
const fs = require("fs/promises");   // readFile returns a Promise — no callback
```

---

### 1.6 Many Promises at Once — The Combinators

Day 04's parallel loader needed a results array, an index, and a counter. Now it's one line.

#### `Promise.all` — all of them, or fail fast

```js
const students = await Promise.all([getStudent(1), getStudent(2), getStudent(3)]);
// [sara, omar, lina] — in the order you ASKED, not the order they finished
```

- Starts nothing itself — the three requests are already running when you pass them in.
- Fulfils with an array **in the input order**. (Day 04's `results[index] = …`, built in.)
- **Rejects as soon as any one rejects.** The other results are thrown away.

#### `Promise.allSettled` — all of them, no matter what

```js
const results = await Promise.allSettled([getStudent(1), getStudent(42)]);
// [
//   { status: "fulfilled", value: { name: "Sara", … } },
//   { status: "rejected",  reason: Error("No student with id 42") }
// ]
```

Never rejects. You get one report per Promise. This is the one for *"load everyone, show what you can, list what failed."*

#### `Promise.race` — whoever settles first

```js
const winner = await Promise.race([slowServer(), fastServer()]);
```

First to **settle** wins — fulfilled *or* rejected. Its real use is **timeouts** (Step 5).

#### `Promise.any` — first success

```js
const data = await Promise.any([mirror1(), mirror2(), mirror3()]);
```

First to **fulfil** wins; rejections are ignored unless *all* of them reject (then you get an `AggregateError`).

| Combinator | Settles when | Result | Rejects when |
|---|---|---|---|
| `all` | all fulfil | array of values, input order | **any** rejects |
| `allSettled` | all settle | array of `{ status, value / reason }` | never |
| `race` | the first settles | that one's value | the first to settle rejected |
| `any` | the first fulfils | that one's value | **all** reject |

---

### 1.7 Promises and the Event Loop

Day 04 section 2.4 drew two queues and said *"Promises use the VIP lane."* Here's what that means.

`.then`, `.catch` and `.finally` callbacks are **microtasks**. They run right after the current code finishes — **before** any timer:

```js
console.log("1 — sync");
setTimeout(() => console.log("4 — timeout"), 0);
Promise.resolve().then(() => console.log("3 — then"));
console.log("2 — sync");
// 1, 2, 3, 4
```

Two more rules that surprise people:

- **The executor runs immediately**, synchronously, when you call `new Promise(...)`. Only `.then` callbacks wait.
- **`.then` on an already-resolved Promise still waits** for the current code to finish. A Promise never calls you back synchronously — which kills Day 04's "sometimes sync, sometimes async" problem too.

That's all three callback problems from Day 04 section 2.7 — the pyramid, scattered errors, inversion of control — fixed.

---

# Part 2 — Async / Await

> Promises fixed the problems. `async` / `await` fixes how it *reads*.

## 2 — Concept (60 min)

### 2.1 `async` Functions

Put `async` in front of any function and two things change:

1. It **always returns a Promise.** Return a value, and the Promise fulfils with it. Throw, and the Promise rejects.
2. You're allowed to use **`await`** inside it.

```js
async function getScore() {
  return 92;
}

console.log(getScore());                          // Promise { 92 }  — not 92!
getScore().then((score) => console.log(score));   // 92
```

Works with every function form from Day 03:

```js
async function load() {}
const load2 = async () => {};
const helper = { async load() {} };
```

---

### 2.2 `await` — Pause the Function, Not the Program

`await` takes a Promise and gives you its **value** — waiting, if it has to:

```js
async function showStudent() {
  const student = await getStudent(1);   // waits ~300ms
  console.log(student.name);             // then carries on
}
```

That line *looks* like Day 01 synchronous code. It isn't. Here's what really happens:

```js
async function f() {
  console.log("B");
  await null;          // pause HERE — f() returns a pending Promise to its caller
  console.log("D");    // resumes later, as a microtask
}

console.log("A");
f();
console.log("C");
// A, B, C, D
```

> **`await` pauses only the `async` function it's in.** Everything outside keeps running — clicks, timers, other requests. The thread is never blocked. That's the difference from Day 04's `blockFor`.

Everything *before* the first `await` runs synchronously, like the executor in 1.2.

#### The pyramid, one last time

```js
async function buildReport(id) {
  const student = await getStudent(id);
  const scores = await getScores(student.id);
  const course = await getCourse(student.courseId);
  return { ...student, scores, course: course.title };
}
```

Every variable is in scope for every later line — no `let student` hoisted up to share between `.then`s. This is why nearly everyone writes `await` instead of long `.then` chains.

---

### 2.3 Errors — `try` / `catch` Works Again

A rejected Promise makes `await` **throw**. So you catch it the way you catch anything:

```js
async function main() {
  try {
    const student = await getStudent(99);
    console.log(student.name);           // never runs
  } catch (err) {
    console.log(`Failed: ${err.message}`);
  } finally {
    console.log("Cleanup runs either way");
  }
}
```

One `try` covers every `await` inside it. Day 04 said *"`try`/`catch` only catches errors from code on the stack right now."* That's still true — `await` just puts your function **back** on the stack when the Promise settles, so the `catch` is there to catch it.

> **Where to catch:** catch where you can actually *do* something — show a message, use a fallback, retry. A low-level function like `buildReport` usually lets errors bubble up; `main()` or the click handler catches them.

#### The top of the program

`await` only works inside `async` functions (and at the top level of ES modules — Part 3). In a plain Node script, wrap your program in one:

```js
async function main() {
  // … all your awaits
}

main().catch((err) => console.log(`Fatal: ${err.message}`));
```

---

### 2.4 Sequential vs Parallel — The Most Common Performance Bug

This looks harmless:

```js
const sara = await getStudent(1);   // 300ms
const omar = await getStudent(2);   // then 100ms
const lina = await getStudent(3);   // then 200ms
// total ≈ 600ms
```

The three requests don't depend on each other — but each `await` waits for the previous one before *starting* the next. Start them all first, then wait:

```js
const [sara, omar, lina] = await Promise.all([
  getStudent(1),
  getStudent(2),
  getStudent(3),
]);
// total ≈ 300ms — the slowest one
```

With a list of ids, `map` builds the array of Promises for you:

```js
const students = await Promise.all(ids.map((id) => getStudent(id)));
// or, since getStudent takes exactly one argument:
const students2 = await Promise.all(ids.map(getStudent));
```

> **Ask one question before every `await`:** *does this line need the result of the one before it?* If yes → sequential, that's correct. If no → start them together and `Promise.all`.

---

### 2.5 Loops — `for…of` Waits, `forEach` Doesn't

```js
// ✅ Sequential, in order, and it waits
for (const id of ids) {
  const student = await getStudent(id);
  console.log(student.name);
}
console.log("all done");     // really is done
```

```js
// ❌ forEach ignores the Promise your callback returns
ids.forEach(async (id) => {
  const student = await getStudent(id);
  console.log(student.name);
});
console.log("all done");     // prints FIRST — nothing has loaded yet
```

`forEach` calls your `async` callback, gets a Promise back, and throws it away. It has no idea it's supposed to wait. Same for `filter`, `some`, `reduce`.

| You want | Write |
|---|---|
| One after another, in order | `for (const x of list) { await … }` |
| All at once, results in order | `await Promise.all(list.map(async (x) => …))` |
| All at once, some may fail | `await Promise.allSettled(list.map(…))` |
| — | never `list.forEach(async …)` |

---

### 2.6 Timeouts and Retries

Two things every real network call needs, built from what you know.

**Timeout** — race the real work against a timer that rejects:

```js
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

const student = await withTimeout(getStudent(1), 2000);
```

**Retry** — a `for` loop with `try`/`catch` inside:

```js
async function retry(fn, times) {
  for (let attempt = 1; attempt <= times; attempt++) {
    try {
      return await fn();                 // success → leave immediately
    } catch (err) {
      if (attempt === times) throw err;  // out of attempts → give up
      await delay(attempt * 100);        // wait a bit longer each time
    }
  }
}
```

> **`return await` inside `try`** is deliberate. Without the `await`, the function returns the Promise before it settles — the `try` block has already finished, and a rejection skips your `catch` entirely.

---

### 2.7 `.then` or `await`?

Both are Promises underneath — you can mix them freely, and you'll read both in other people's code.

| Situation | Prefer |
|---|---|
| Several steps that depend on each other | `await` — reads top to bottom |
| Anything with `if`, loops, or `try`/`catch` | `await` |
| A one-liner at the top level: `main().catch(…)` | `.then` / `.catch` |
| Running things in parallel | `Promise.all` — with either style |

Default to `await`. Reach for `.then` when it's genuinely shorter.

---

# Part 3 — Modules

> Since Day 03, every assignment has said *"paste `grade-lib.js` at the top — modules come later."* Later is now.

## 3 — Concept (70 min)

### 3.1 The Problem Modules Solve

Here's what "paste it at the top" really did since Day 03 — and in Parts 1 and 2 today:

```
report.js                     app.js                      await.js
┌──────────────────────┐      ┌──────────────────────┐    ┌──────────────────────┐
│ letterGrade  (copy 1)│      │ letterGrade  (copy 2)│    │ letterGrade  (copy 3)│
│ average      (copy 1)│      │ average      (copy 2)│    │ average      (copy 3)│
│ …your program…       │      │ …your program…       │    │ …your program…       │
└──────────────────────┘      └──────────────────────┘    └──────────────────────┘
```

Three copies of `letterGrade`. Fix a bug in one, and the other two still have it. Rename a variable in one, and a name clash appears in another. Nobody can tell which copy is the real one.

A **module** is simply a file with its own private scope that chooses what to share:

```
lib/grade-lib.js  ─── exports ──▶  letterGrade, average, formatRow
                                          │
          ┌───────────────────────────────┼───────────────────────────┐
          ▼                               ▼                           ▼
     report.js                         app.js                      await.js
  import { average }             import { letterGrade }       import { formatRow }
```

**One copy. Three users.** Fix it once, and every file gets the fix.

Three rules make this work:

1. **Everything inside a module is private** unless you export it. Your helper functions don't leak into anyone else's file.
2. **A module says what it needs** with `import` / `require` at the top. You can read a file's dependencies in the first five lines.
3. **A module runs once.** However many files import it, its top-level code runs the first time, and every importer shares the same result.

JavaScript has **two** module systems, for historical reasons. You need to read both.

---

### 3.2 CommonJS — `require` and `module.exports`

**CommonJS** (CJS) is Node's original system. You've already used it — `require("fs")` on Day 04.

```js
// lib/grade-lib.js
function letterGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function average(numbers) { /* … */ }

function secretHelper() { /* not exported — private */ }

module.exports = { letterGrade, average };   // Day 04 object shorthand
```

```js
// report.js
const { letterGrade, average } = require("./lib/grade-lib");   // Day 04 destructuring

console.log(letterGrade(92));   // A
console.log(typeof secretHelper); // undefined — it never left its file
```

- `module.exports` is **whatever the file hands out** — usually an object of functions.
- `require(path)` **returns** that exact value.
- **Relative paths start with `./` or `../`.** `require("./lib/grade-lib")` is your file. `require("fs")` — no dot — is a built-in or an npm package.
- In CommonJS, the `.js` extension is optional. `require("./students.json")` even parses JSON for you.

#### Exporting one thing

```js
// lib/delay.js
module.exports = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// anywhere
const delay = require("./lib/delay");
```

#### ⚠️ The `exports =` trap

Node also gives you a shortcut called `exports`. Adding to it works. **Replacing it doesn't:**

```js
exports.hello = () => "hi";        // ✅ adds to module.exports
exports = { hello: () => "hi" };   // ❌ just reassigns a local variable
```

```js
const lib = require("./bad-exports");
console.log(lib, typeof lib.hello);   // {} undefined
```

`exports` is only a *second name* for `module.exports` — the same alias-vs-copy idea from Day 04 Part 1. Reassigning the alias doesn't touch the original. **Rule: always write `module.exports = { … }`**, and you'll never hit this.

#### The require cache — modules run once

```js
// lib/grade-lib.js
console.log("[grade-lib.js] loading…");
```

```js
// report.js
const { average } = require("./lib/grade-lib");
const lib = require("./lib/grade-lib");      // second time
console.log(lib.average === average);        // true
```

`"[grade-lib.js] loading…"` prints **once**. The second `require` returns the cached result — the very same object. That's why a module is the natural place for shared state, like a database connection you only want to open once.

---

### 3.3 ES Modules — `export` and `import`

**ES Modules** (ESM) are the official JavaScript standard. The browser speaks only this. Node speaks both. New code should be ESM.

#### Named exports

Put `export` in front of any declaration:

```js
// lib/grade-lib.js
export const PASS_MARK = 60;

export function letterGrade(score) { /* … */ }

export function average(numbers) { /* … */ }

function secretHelper() { /* not exported — still private */ }
```

Import them by **exact name**, in braces:

```js
// report.js
import { letterGrade, average } from "./lib/grade-lib.js";
```

The braces *look* like Day 04 destructuring, but they aren't — you can't use defaults, and renaming uses `as`:

```js
import { average as mean } from "./lib/grade-lib.js";
console.log(mean([90, 80]));   // 85
```

Grab everything as one object — a **namespace import**:

```js
import * as grades from "./lib/grade-lib.js";
grades.letterGrade(92);        // "A"
grades.PASS_MARK;              // 60
```

#### The default export

A module can also have **one** default export — "the main thing this file is":

```js
// lib/db.js
export default async function getAttendance(id) { /* … */ }

export { delay };               // named exports can sit alongside it
```

```js
import getAttendance, { delay } from "./lib/db.js";   // default first, no braces
import whateverYouLike from "./lib/db.js";            // the importer picks the name
```

| | Named export | Default export |
|---|---|---|
| How many per file | as many as you want | at most one |
| Import syntax | `import { name } from …` | `import anyName from …` |
| Name at import | must match (or use `as`) | importer chooses |
| Typos | error at load time | silently "works" with any name |

> **Prefer named exports.** A typo in a named import fails loudly: `SyntaxError: The requested module './lib/a.js' does not provide an export named 'nope'`. A default import accepts any name, so the same function ends up called four different things across a codebase. Use default for one-thing-per-file cases — you'll see it everywhere in React components.

#### Where `import` can go

`import` statements must be at the **top level** of the file — not inside an `if` or a function. If you need to load something conditionally, `import()` is a function that returns a Promise (Day 05):

```js
if (needsCharts) {
  const { drawChart } = await import("./lib/charts.js");
  drawChart(data);
}
```

---

### 3.4 Turning On ESM in Node

A `.js` file is CommonJS by default in Node. Two ways to switch:

**1. `"type": "module"` in `package.json`** — every `.js` file in that folder becomes ESM:

```json
{
  "name": "day-05",
  "type": "module"
}
```

**2. The `.mjs` extension** — that one file is ESM, whatever `package.json` says. (And `.cjs` forces CommonJS.)

Create `package.json` by hand, or run `npm init -y` and add the `"type"` line. You'll use option 1 for every project from now on.

#### What changes once you're in ESM

```js
// ✅ file extensions are REQUIRED on relative imports
import { average } from "./lib/grade-lib.js";

// ❌ this worked with require, fails with import
import { average } from "./lib/grade-lib";
// Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/lib/grade-lib'
```

```js
// ✅ top-level await — no main() wrapper needed (promised in Part 2)
import { readFile } from "node:fs/promises";
const text = await readFile("students.json", "utf8");
```

```js
// ❌ CommonJS variables don't exist
console.log(__dirname);
// ReferenceError: __dirname is not defined in ES module scope

// ✅ the ESM versions
console.log(import.meta.dirname);    // the folder this file is in
console.log(import.meta.filename);   // this file's full path
```

```js
// ❌ require doesn't exist either
const fs = require("fs");
// ReferenceError: require is not defined in ES module scope, you can use import instead
```

The `node:` prefix on built-ins (`node:fs/promises`) is optional but recommended — it makes it obvious the module is built in, not from npm.

> **ESM code always runs in strict mode.** Assigning to an undeclared variable, which silently created a global in old scripts, now throws a `ReferenceError`. That's a good thing.

---

### 3.5 CommonJS vs ESM — The Differences That Bite

| | CommonJS | ES Modules |
|---|---|---|
| Export | `module.exports = { a, b }` | `export function a() {}` / `export default …` |
| Import | `const { a } = require("./x")` | `import { a } from "./x.js"` |
| Where it works | Node only | Node **and** browsers |
| Turned on by | default for `.js`; `.cjs` | `"type": "module"`; `.mjs` |
| File extension | optional | **required** for relative paths |
| Can be conditional | yes — `require` is a function call | static `import` at top only; `import()` for dynamic |
| Loading | synchronous | asynchronous — allows top-level `await` |
| `__dirname` | ✅ | ❌ — use `import.meta.dirname` |
| Import JSON | `require("./data.json")` | read it with `fs/promises` + `JSON.parse` |
| Strict mode | opt in | always |

#### Live bindings vs copies

One difference that looks small and causes real bugs:

```js
// counter.mjs (ESM)                     // counter.js (CommonJS)
export let count = 0;                    let count = 0;
export function inc() { count++; }       function inc() { count++; }
                                         module.exports = { count, inc };
```

```js
import { count, inc } from "./counter.mjs";      const { count, inc } = require("./counter");
inc(); inc();                                    inc(); inc();
console.log(count);   // 2                       console.log(count);   // 0
```

An ES `import` is a **live view** of the exporter's variable — when the module changes it, you see the change. `module.exports = { count }` copied the **value** `0` into an object at export time, and Day 04 destructuring copied it again. And you can't assign to an import at all: `count = 5` throws `TypeError: Assignment to constant variable.` Only the module that owns a variable can change it.

**Mixing them:**

- ESM can `import` a CommonJS module — `module.exports` becomes the default import.
- Recent Node (22+) can `require()` an ES module too, as long as it doesn't use top-level `await`. Older tutorials will tell you this is impossible — it was, until recently.

> **Which should you write?** ESM, for anything new. You'll still *read* CommonJS in older Node code, Stack Overflow answers, and config files — so you need both.

---

### 3.6 Modules in the Browser

ESM is the browser's native module system. Add `type="module"` to the script tag:

```html
<script type="module" src="./main.js"></script>
```

```js
// main.js — runs in the browser
import { letterGrade, average } from "./lib/grade-lib.js";
```

**The same `lib/grade-lib.js` file now runs in Node and in the browser, unchanged.** Day 03 made you keep two identical copies of `letterGrade` — one in `grade-lib.js`, one in `app.js`. That's over.

What `type="module"` changes:

| Classic `<script>` | `<script type="module">` |
|---|---|
| top-level variables become globals | module scope — nothing leaks onto `window` |
| runs the moment it's reached | deferred — runs after the HTML is parsed |
| can't use `import` | can use `import`, and top-level `await` |
| works from `file://` | **needs a server** — Live Server |

Open the page by double-clicking it (`file://…`) and you'll get a CORS error in the console — browsers refuse to load modules from the file system. **Use Live Server**, as you have since Day 01.

> **Module scope has a side effect.** `onclick="handleAdd()"` in your HTML stops working, because `handleAdd` is no longer global. Use `addEventListener` — which is what you've been doing since Day 03 anyway.

---

### 3.7 Organising a Project

A structure that scales from today to Track 2:

```
day-05/
├── package.json          { "type": "module" }
├── students.json
├── report.js             ← the program: imports, then does the work
└── lib/
    ├── index.js          ← barrel: re-exports everything below
    ├── grade-lib.js      ← pure grading functions
    └── db.js             ← async data access
```

**A barrel file** re-exports a folder, so callers need one import instead of three:

```js
// lib/index.js
export * from "./grade-lib.js";
export { default as getAttendance, delay } from "./db.js";
```

```js
// report.js
import { average, formatRow, getAttendance } from "./lib/index.js";
```

Guidelines:

- **One job per file.** `grade-lib.js` grades. `db.js` fetches. `report.js` prints.
- **`lib/` files don't print.** They take input and return output (Day 03's pure functions). The program file does the `console.log`.
- **Imports go at the top**, built-ins first, then your own files.
- **Avoid circular imports** — `a.js` imports `b.js` which imports `a.js`. It sometimes works and sometimes gives you `undefined`. If two files need each other, the shared part belongs in a third.

#### npm packages are modules too

```bash
npm install dayjs
```

```js
import dayjs from "dayjs";           // no ./ — Node looks in node_modules
console.log(dayjs().format("YYYY-MM-DD"));
```

`npm install` downloads the package into `node_modules/` and records it in `package.json` under `"dependencies"`. You'll use this constantly in Track 2. For today, just know that `import x from "name"` with **no** `./` means "a package", and `"./name.js"` means "my file".

---

# Part 4 — Git & GitHub

> You've committed every day since Day 01. Now you learn what's actually happening — and how teams use it.

## 4 — Concept (60 min)

### 4.1 The Three Places Your Code Lives

```
  WORKING TREE              STAGING AREA               HISTORY (.git)
  the files you edit        "what goes in the          commits — permanent
                             next commit"               snapshots
 ┌─────────────────┐       ┌─────────────────┐        ┌─────────────────┐
 │ grade-lib.js *  │ ────▶ │ grade-lib.js    │ ─────▶ │ 27cd90a         │
 │ report.js    *  │ add   │                 │ commit │ bf3942e         │
 │ notes.txt       │       │                 │        │ …               │
 └─────────────────┘       └─────────────────┘        └─────────────────┘
          ▲                                                    │
          └──────────────── git restore / git switch ◀─────────┘
```

- **Working tree** — the actual files on your disk.
- **Staging area** — a draft of your next commit. `git add` puts changes here.
- **History** — the chain of commits. Each commit is a **snapshot** of every staged file, with a message, an author, and a pointer to its parent.

The staging area is why you can edit five files and commit them as **two** separate, meaningful commits.

---

### 4.2 The Daily Five

```bash
git status                  # what changed? what's staged?
git diff                    # show unstaged changes, line by line
git diff --staged           # show what's about to be committed
git add grade-lib.js        # stage one file
git add .                   # stage everything in this folder — check status first!
git commit -m "Add letterGrade to grade-lib"
git log --oneline           # history, one line per commit
```

`git status --short` gives the compact version:

```
?? grade-lib.js       ← untracked: Git has never seen this file
A  grade-lib.js       ← added: staged, new file
 M report.js          ← modified, NOT staged (M in the second column)
M  report.js          ← modified AND staged (M in the first column)
UU grade-lib.js       ← unmerged: a conflict to resolve (2.4)
```

#### Good commit messages

A commit message is written for the person reading `git log` in six months — often you.

| ❌ | ✅ |
|---|---|
| `update` | `Add letterGrade and average to grade-lib` |
| `fix` | `Fix average() returning NaN for an empty array` |
| `day 6` | `Split report.js into lib/grade-lib and lib/db modules` |
| `asdfgh` | `Load attendance in parallel with Promise.allSettled` |

Rules: **imperative mood** ("Add", not "Added"), say **what and why**, one logical change per commit.

#### `.gitignore` — what never goes in

A file named `.gitignore` at the repo root lists paths Git should never track:

```gitignore
# dependencies — reinstalled with `npm install`
node_modules/

# secrets — NEVER commit these
.env

# OS and editor clutter
.DS_Store
Thumbs.db
.vscode/
```

> **`node_modules` can be tens of thousands of files.** It's rebuilt from `package.json` by `npm install`, so it never belongs in Git. And a `.env` file pushed to a public repo is a leaked password — bots scan GitHub for them within minutes. Deleting it in a later commit doesn't help; it's still in the history. Track 2 comes back to this.

---

### 4.3 Branches

A **branch** is a movable name pointing at a commit. `main` is just the default one. Creating a branch lets you work on something without touching `main` until it's ready.

```bash
git switch -c feature/letter-grade   # create a branch AND switch to it
# … edit, add, commit as usual …
git switch main                      # back to main — your branch's changes vanish from disk
git merge feature/letter-grade       # bring them into main
git branch -d feature/letter-grade   # delete the branch name (the commits stay)
git branch                           # list branches, * marks the current one
```

> Older tutorials use `git checkout -b` and `git checkout main`. Same thing — `git switch` is the newer, clearer command.

#### Fast-forward vs merge commit

If `main` hasn't moved since you branched, Git just slides the `main` pointer forward:

```
Updating 27cd90a..bf3942e
Fast-forward
 grade-lib.js | 3 +++
 1 file changed, 3 insertions(+)
```

If **both** branches have new commits, Git creates a **merge commit** with two parents:

```
*   d489c5a Merge branch 'feature/strict'
|\
| * 6d61359 Raise pass mark to 70         ← on the feature branch
* | 07f592d Lower pass mark to 50         ← on main, meanwhile
|/
* bf3942e Add letterGrade
* 27cd90a Add grade-lib with PASS_MARK
```

That drawing comes from `git log --oneline --graph`. Run it often.

#### Branch names

Short, lowercase, hyphenated, with a prefix that says what kind of work it is: `feature/esm-modules`, `fix/average-empty-array`, `docs/day-05-notes`.

---

### 4.4 Merge Conflicts

A conflict happens when **both branches changed the same lines**. Git can't guess which one you want, so it stops and asks:

```
Auto-merging grade-lib.js
CONFLICT (content): Merge conflict in grade-lib.js
Automatic merge failed; fix conflicts and then commit the result.
```

The file now contains **both** versions, fenced by markers:

```js
<<<<<<< HEAD
export const PASS_MARK = 50;
=======
export const PASS_MARK = 70;
>>>>>>> feature/strict
export function letterGrade(score) {
  return score >= 90 ? "A" : "B";
}
```

- Between `<<<<<<< HEAD` and `=======` — **your current branch** (main).
- Between `=======` and `>>>>>>> feature/strict` — **the branch you're merging in**.

To resolve:

1. **Edit the file** into what it *should* be — one side, the other, or a mix. Delete all three marker lines.
2. `git add grade-lib.js` — marks it resolved.
3. `git commit` — finishes the merge (Git pre-fills the message).

VS Code highlights conflicts and offers **Accept Current / Accept Incoming / Accept Both** buttons above each block. Use them — but **read the result** before committing. Git only checks that the markers are gone, not that the code makes sense.

> **Panic button:** `git merge --abort` puts everything back to how it was before the merge.

---

### 4.5 GitHub — Remotes, Push, Pull, Clone

Git lives on your machine. **GitHub** hosts a copy online — a **remote** — so you can back up, share, and collaborate.

```bash
git remote add origin https://github.com/you/javascript-everywhere.git   # once
git push -u origin main          # upload main; -u remembers the pairing
git push                         # every time after that

git pull                         # download + merge others' new commits
git clone https://github.com/someone/repo.git   # copy a whole repo to your machine
```

`origin` is just the conventional name for "the main remote".

**Push a branch** the same way:

```bash
git switch -c feature/esm-modules
# … commits …
git push -u origin feature/esm-modules
```

> **`git pull` before you start work, `git push` when you finish.** Most "rejected — fetch first" errors mean someone (or you, from another computer, or the GitHub web editor) pushed while you weren't looking. `git pull`, fix any conflicts, then push again.

---

### 4.6 Pull Requests — How Teams Change Code

On a team, nobody pushes straight to `main`. Every change goes through a **pull request** (PR): *"here's my branch — please review it and merge it in."*

```
 1. git switch main && git pull            ← start from the latest main
 2. git switch -c feature/esm-modules      ← one branch per change
 3. edit → add → commit (several times)    ← small, clear commits
 4. git push -u origin feature/esm-modules
 5. GitHub → "Compare & pull request"      ← write a title and description
 6. Review: comments, requested changes, more commits on the same branch
 7. "Merge pull request" on GitHub
 8. git switch main && git pull            ← get the merged result locally
 9. git branch -d feature/esm-modules      ← tidy up
```

A good PR description answers three questions:

```markdown
## What
Split `report.js` into ES modules: `lib/grade-lib.js`, `lib/db.js` and a `lib/index.js` barrel.

## Why
The grading functions were copy-pasted into three files. Now there's one copy.

## How to test
`node report.js` — output matches Step 3, and `index.html` works through Live Server.
```

Even working alone, opening PRs on your own repo is worth it: you get a page showing exactly what changed, a place for notes, and a history of *why* each change happened. It's also exactly the workflow an employer expects to see on your GitHub.

---

### 4.7 Undoing Things

The safe choice depends on **whether you've pushed**.

| Situation | Command | What it does |
|---|---|---|
| Throw away unstaged edits to a file | `git restore report.js` | ⚠️ back to the last commit — edits are gone |
| Unstage a file (keep the edits) | `git restore --staged report.js` | moves it out of the staging area |
| Fix the last commit's message or add a forgotten file — **not pushed yet** | `git commit --amend` | replaces the last commit |
| Undo a commit that's **already pushed** | `git revert <hash>` | adds a **new** commit that reverses it |
| Stop a merge halfway | `git merge --abort` | back to before the merge |
| See what a commit changed | `git show <hash>` | the diff for that one commit |

> **Never rewrite history that others already have.** `--amend`, `reset` and `push --force` change commits. On your own unpushed work, that's fine. On a pushed `main`, it breaks everyone else's copy. After pushing, `git revert` is the safe undo.

---

### 4.8 Git in VS Code

Everything above has a button in VS Code's **Source Control** panel (`Ctrl+Shift+G`): stage with **+**, write the message, **✓ Commit**, and the branch name in the bottom-left corner switches or creates branches. The **GitHub Pull Requests** extension lets you open and review PRs without leaving the editor.

Learn the commands first — the buttons make much more sense once you know what they run. And when something goes wrong, the error messages talk in command-line terms.

---

## Build — Follow Along

Create a folder `day-05` in your repo. Steps 1–6 are Parts 1–2, Steps 7–10 are Part 3, Steps 11–12 are Part 4.

> **Do today's work on a branch.** Step 11 shows how — read it before you start.

### Step 1 — `promise-basics.js` — Predict, Then Run

Write down the order you expect **before** running it.

```js
// promise-basics.js — predict the order BEFORE you run it

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

console.log("1 — script starts");

const p = new Promise((resolve) => {
  console.log("2 — executor runs immediately");
  resolve("3 — resolved value");
});

p.then((value) => console.log(value));

setTimeout(() => console.log("4 — timeout 0"), 0);

Promise.resolve().then(() => console.log("5 — microtask from .then"));

delay(100).then(() => console.log("6 — after 100ms"));

console.log("7 — script ends");
```

```bash
node promise-basics.js
```

<details>
<summary>Expected output — check your prediction first</summary>

```
1 — script starts
2 — executor runs immediately
7 — script ends
3 — resolved value
5 — microtask from .then
4 — timeout 0
6 — after 100ms
```

- **1, 2, 7** — synchronous. The executor is synchronous too.
- **3, 5** — microtasks, in the order their `.then` was attached. Both beat the timer.
- **4** — the 0ms timer: a task, so after every microtask.
- **6** — a real 100ms wait.

The numbers are the order the lines appear in the file. The output order is the event loop.

</details>

---

### Step 2 — `promise-db.js` + `chain.js` — Day 04's Database, Promised

The same fake database as Day 04 Step 6 — but every function now **returns a Promise**. One `lookup` helper does the waiting and failing for all three tables.

```js
// promise-db.js — Day 04's fake database, now returning Promises

const STUDENTS = {
  1: { id: 1, name: "Sara", courseId: 10 },
  2: { id: 2, name: "Omar", courseId: 10 },
  3: { id: 3, name: "Lina", courseId: 20 },
};
const SCORES = { 1: [92, 88, 95], 2: [68, 71], 3: [79] };
const COURSES = {
  10: { id: 10, title: "JS Everywhere" },
  20: { id: 20, title: "TypeScript Basics" },
};
const LATENCY = { 1: 300, 2: 100, 3: 200 };

// One helper does the waiting and the failing for every table
function lookup(table, id, label, ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const row = table[id];
      if (!row) return reject(new Error(`No ${label} with id ${id}`));
      resolve(row);
    }, ms);
  });
}

const getStudent = (id) => lookup(STUDENTS, id, "student", LATENCY[id] ?? 50);
const getScores = (studentId) => lookup(SCORES, studentId, "scores for student", 100);
const getCourse = (courseId) => lookup(COURSES, courseId, "course", 100);

function average(numbers) {
  if (numbers.length === 0) return 0;
  let total = 0;
  for (const n of numbers) total += n;
  return total / numbers.length;
}
```

> **Modules arrive in Part 3, later today.** Until then, paste `promise-db.js` at the top of each file that uses it — Step 8 is where that stops.

#### `chain.js` — the report as a `.then` chain

```js
// chain.js — paste promise-db.js above this line first

function buildReport(id) {
  let student;                                   // needed by a later step
  return getStudent(id)
    .then((found) => {
      student = found;
      return getScores(student.id);              // ← return the next Promise
    })
    .then((scores) => {
      student = { ...student, scores };
      return getCourse(student.courseId);
    })
    .then((course) => ({ ...student, course: course.title }));
}

const print = ({ name, course, scores }) =>
  console.log(`✓ ${name} — ${course} — avg ${average(scores).toFixed(1)}`);

buildReport(1)
  .then(print)
  .catch((err) => console.log(`✗ ${err.message}`));

buildReport(99)
  .then(print)
  .catch((err) => console.log(`✗ ${err.message}`))
  .finally(() => console.log("(99 finished, one way or the other)"));
```

```bash
node chain.js
```

```
✗ No student with id 99
(99 finished, one way or the other)
✓ Sara — JS Everywhere — avg 91.7
```

> **Compare it to Day 04's `flat.js`.** No `done` threaded through every step, no `if (err) return done(err)` three times — one `.catch` at the end. But notice the awkward `let student` at the top: the third step needs data from the first, and each `.then` has its own scope. Step 3 fixes that.

Break it: delete the `return` in front of `getScores`. Run it. Sara's line becomes `✗ Cannot read properties of undefined (reading 'length')` — the next `.then` got `undefined` instead of the scores, and `average(undefined)` threw. That's the missing-`return` bug from 1.3, live — and notice the `.catch` still caught it.

---

### Step 3 — `await-report.js` — The Same Report, With `await`

Paste `promise-db.js` above this:

```js
// await-report.js — paste promise-db.js above this line first

async function buildReport(id) {
  const student = await getStudent(id);
  const scores = await getScores(student.id);
  const course = await getCourse(student.courseId);
  return { ...student, scores, course: course.title };
}

async function main() {
  // 1. One student, with try/catch
  try {
    const { name, course, scores } = await buildReport(1);
    console.log(`✓ ${name} — ${course} — avg ${average(scores).toFixed(1)}`);
    await buildReport(99);
    console.log("never printed");
  } catch (err) {
    console.log(`✗ ${err.message}`);
  }

  // 2. Sequential — each await waits for the previous one
  let started = Date.now();
  for (const id of [1, 2, 3]) {
    await buildReport(id);
  }
  console.log(`Sequential: ${Date.now() - started}ms`);

  // 3. Parallel — start all three, then wait for all three
  started = Date.now();
  const reports = await Promise.all([1, 2, 3].map(buildReport));
  console.log(`Parallel:   ${Date.now() - started}ms`);
  for (const { name, scores } of reports) {
    console.log(`  ${name.padEnd(5)} ${average(scores).toFixed(1)}`);
  }

  // 4. One failure rejects Promise.all — allSettled keeps everyone
  const results = await Promise.allSettled([1, 42, 3].map(buildReport));
  for (const result of results) {
    if (result.status === "fulfilled") {
      console.log(`  ✓ ${result.value.name}`);
    } else {
      console.log(`  ✗ ${result.reason.message}`);
    }
  }
}

main();
```

```bash
node await-report.js
```

```
✓ Sara — JS Everywhere — avg 91.7
✗ No student with id 99
Sequential: 1215ms
Parallel:   512ms
  Sara  91.7
  Omar  69.5
  Lina  79.0
  ✓ Sara
  ✗ No student with id 42
  ✓ Lina
```

Your milliseconds will differ slightly.

> **Three things to notice.** `buildReport` is four lines — the same logic as Day 04's three named functions plus `done`, and as `chain.js`'s `let student` juggling. The parallel version is **more than twice as fast** for the same work: ~500ms (the slowest student) against ~1,200ms (all of them added up). And `Promise.all` did Day 04's entire `loadAll` — index, counter, order — in one line.

Try it: change `Promise.allSettled` to `Promise.all` in part 4. The whole thing rejects on student 42, and `main()` crashes with an unhandled rejection — because part 4 isn't inside a `try`.

---

### Step 4 — `files.js` — `fs/promises`

Create `students.json` next to it (same as Day 04 Step 8):

```json
[
  { "name": "Sara", "score": 92 },
  { "name": "Omar", "score": 68 },
  { "name": "Lina", "score": 79 }
]
```

```js
// files.js — the same file, the Promise way
const fs = require("fs/promises");

async function loadStudents(path) {
  const text = await fs.readFile(path, "utf8");
  return JSON.parse(text);
}

async function main() {
  console.log("Loading…");

  try {
    const students = await loadStudents("students.json");
    console.log(`Loaded ${students.length} students`);
    for (const { name, score } of students) {
      console.log(`  ${name.padEnd(5)} ${score}`);
    }
  } catch (err) {
    console.log(`Failed: ${err.message}`);
  }

  try {
    await loadStudents("missing.json");
  } catch (err) {
    console.log(`Failed: ${err.code}`);
  }
}

main();
console.log("main() started — the file hasn't arrived yet");
```

```bash
node files.js
```

```
Loading…
main() started — the file hasn't arrived yet
Loaded 3 students
  Sara  92
  Omar  68
  Lina  79
Failed: ENOENT
```

> **One `try` catches two different failures.** A missing file (`fs.readFile` rejects) and broken JSON (`JSON.parse` throws) both land in the same `catch` — async and sync errors, handled the same way. On Day 04 you needed an `if (err)` for one and a `try` for the other.

Notice line 2 of the output: `main()` hit its first `await` and handed control back, so the last line of the file printed before the student list.

---

### Step 5 — `resilience.js` — Timeouts and Retries

```js
// resilience.js — timeouts and retries, built from Promises you already know

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Reject if `promise` takes longer than `ms`
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

// A flaky "server": fails the first two calls, succeeds on the third
let calls = 0;
async function flakyFetch() {
  calls++;
  await delay(100);
  if (calls < 3) throw new Error(`Server error (call ${calls})`);
  return { name: "Sara", score: 92 };
}

// Try up to `times` times, waiting a little longer after each failure
async function retry(fn, times) {
  for (let attempt = 1; attempt <= times; attempt++) {
    try {
      return await fn();
    } catch (err) {
      console.log(`  attempt ${attempt} failed: ${err.message}`);
      if (attempt === times) throw err;
      await delay(attempt * 100);
    }
  }
}

async function main() {
  try {
    await withTimeout(delay(1000), 300);
  } catch (err) {
    console.log(`Slow request: ${err.message}`);
  }

  const fast = await withTimeout(delay(100).then(() => "fast answer"), 300);
  console.log(`Fast request: ${fast}`);

  const student = await retry(flakyFetch, 5);
  console.log(`Got ${student.name} after ${calls} calls`);
}

main();
```

```bash
node resilience.js
```

```
Slow request: Timed out after 300ms
Fast request: fast answer
  attempt 1 failed: Server error (call 1)
  attempt 2 failed: Server error (call 2)
Got Sara after 3 calls
```

> **The script takes ~1 second to exit, not 300ms.** `withTimeout` stops *waiting* for the slow request — it doesn't *cancel* it. The `delay(1000)` timer still runs to the end. Real cancellation uses `AbortController`, which you'll meet with `fetch`.

Change `retry(flakyFetch, 5)` to `retry(flakyFetch, 2)`. Now it gives up — and since that `await` isn't inside a `try`, you get an unhandled rejection. Wrap it.

---

### Step 6 — `index.html` + `app.js` — Async/Await in the Browser

Day 04's loader, rebuilt: `await` instead of callbacks, `finally` for the button, `Promise.allSettled` for a second slow service, and a timeout.

`index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JavaScript Everywhere — Day 05</title>
  </head>
  <body>
    <h1>Student Loader — async/await</h1>

    <label><input type="checkbox" id="slow" /> Simulate a slow network</label>
    <button id="load">Load students</button>
    <p id="status"></p>
    <ul id="list"></ul>

    <h2>Sequential vs parallel</h2>
    <button id="compare">Time both</button>
    <p id="timing"></p>

    <script src="app.js"></script>
  </body>
</html>
```

`app.js`:

```js
// app.js — async logic on top, DOM below

// --- Fake server (Promise-based) ---
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SERVER_STUDENTS = [
  { id: 1, name: "Sara", score: 92 },
  { id: 2, name: "Omar", score: 68 },
  { id: 3, name: "Lina", score: 79 },
  { id: 4, name: "Yusuf", score: 95 },
];

async function fetchStudents({ slow = false } = {}) {
  await delay(slow ? 3000 : 800);
  if (Math.random() < 0.2) throw new Error("Server did not respond");
  return [...SERVER_STUDENTS];
}

// A second, slower "service" — one call per student, and it sometimes fails
async function fetchAttendance(id) {
  await delay(300 + Math.random() * 900);
  if (Math.random() < 0.15) throw new Error(`Attendance for #${id} unavailable`);
  return 60 + Math.floor(Math.random() * 41);
}

function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

// --- DOM ---
const loadBtn = document.getElementById("load");
const slowBox = document.getElementById("slow");
const status = document.getElementById("status");
const list = document.getElementById("list");
const timing = document.getElementById("timing");

function render(students, attendanceResults) {
  list.innerHTML = "";
  students.forEach(({ name, score }, index) => {
    const result = attendanceResults[index];
    const attendance = result.status === "fulfilled" ? `${result.value}%` : "—";
    const li = document.createElement("li");
    li.textContent = `${name} — ${score} · attendance ${attendance}`;
    list.appendChild(li);
  });
}

async function handleLoad() {
  loadBtn.disabled = true;
  status.textContent = "Loading students…";
  list.innerHTML = "";

  try {
    const students = await withTimeout(fetchStudents({ slow: slowBox.checked }), 2000);

    status.textContent = `Loading attendance for ${students.length} students…`;
    const results = await Promise.allSettled(students.map(({ id }) => fetchAttendance(id)));
    render(students, results);

    const failed = results.filter(({ status }) => status === "rejected").length;
    status.textContent =
      failed === 0
        ? `✓ Loaded ${students.length} students`
        : `✓ Loaded ${students.length} students — ${failed} attendance lookup(s) failed`;
  } catch (err) {
    status.textContent = `❌ ${err.message} — try again.`;
  } finally {
    loadBtn.disabled = false;          // runs on success AND failure
  }
}

async function handleCompare() {
  timing.textContent = "Timing…";
  const ids = [1, 2, 3, 4];

  let started = performance.now();
  for (const id of ids) {
    await fetchAttendance(id).catch(() => null);   // ignore failures for timing
  }
  const sequential = performance.now() - started;

  started = performance.now();
  await Promise.allSettled(ids.map(fetchAttendance));
  const parallel = performance.now() - started;

  timing.textContent =
    `Sequential: ${sequential.toFixed(0)}ms · Parallel: ${parallel.toFixed(0)}ms`;
}

loadBtn.addEventListener("click", handleLoad);
document.getElementById("compare").addEventListener("click", handleCompare);
```

Right-click `index.html` → **Open with Live Server**. Then:

1. **Load students** several times. Sometimes the whole load fails; sometimes one student shows `attendance —`. Those are two different failures — one that stops everything (`await` throws → `catch`), one that doesn't (`allSettled`).
2. Tick **Simulate a slow network** and load again. After 2 seconds: `Timed out after 2000ms`, and the button comes back — thanks to `finally`.
3. Click **Time both** a few times. Parallel is always roughly the slowest single call; sequential is all of them added up.

> **Compare `handleLoad` to Day 04's.** The button is re-enabled in exactly **one** place — `finally` — instead of once per branch. Forgetting the failure path was a Day 04 common mistake. With `finally`, there's nothing to forget.

---

### Step 7 — `cjs/` — Your Library With `require`

```
day-05/cjs/
├── students.json
├── report.js
└── lib/
    └── grade-lib.js
```

`students.json`:

```json
[
  { "id": 1, "name": "Sara", "score": 92, "attendance": 95 },
  { "id": 2, "name": "Omar", "score": 68, "attendance": 62 },
  { "id": 3, "name": "Lina", "score": 79, "attendance": 88 },
  { "id": 4, "name": "Yusuf", "score": 95, "attendance": 91 },
  { "id": 5, "name": "Nour", "score": 55 }
]
```

`lib/grade-lib.js`:

```js
// lib/grade-lib.js — CommonJS: pure functions, exported by name

console.log("[grade-lib.js] loading…");   // watch how many times this prints

const PASS_MARK = 60;

function letterGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function average(numbers) {
  if (numbers.length === 0) return 0;
  let total = 0;
  for (const n of numbers) total += n;
  return total / numbers.length;
}

function formatRow({ name = "???", score = 0, attendance }) {
  const result = score >= PASS_MARK ? "PASS" : "FAIL";
  const att = attendance === undefined ? "  —" : `${String(attendance).padStart(3)}%`;
  return `${name.padEnd(6)} ${String(score).padStart(3)}  ${letterGrade(score)}  ${att}  ${result}`;
}

// Not exported — private to this file
function secretHelper() {
  return "you can't reach me from outside";
}

module.exports = { letterGrade, average, formatRow, PASS_MARK };
```

`report.js`:

```js
// report.js — CommonJS: require what you need, nothing else leaks in

const { letterGrade, average, formatRow } = require("./lib/grade-lib");
const lib = require("./lib/grade-lib");            // second require — cached
const students = require("./students.json");       // JSON parsed for you

console.log(`Same object both times? ${lib.average === average}`);
console.log(`Private helper visible? ${typeof secretHelper}`);
console.log("");

for (const student of students) {
  console.log(formatRow(student));
}

const scores = students.map(({ score }) => score);
console.log(`\nAverage: ${average(scores).toFixed(1)} (${letterGrade(average(scores))})`);
```

```bash
cd day-05/cjs
node report.js
```

```
[grade-lib.js] loading…
Same object both times? true
Private helper visible? undefined

Sara    92  A   95%  PASS
Omar    68  D   62%  PASS
Lina    79  C   88%  PASS
Yusuf   95  A   91%  PASS
Nour    55  F    —  FAIL

Average: 77.8 (C)
```

> **Three things to notice.** `loading…` printed **once**, despite two `require` calls — the cache. `secretHelper` is `undefined` in `report.js` — it never left its module. And there's no `letterGrade` pasted anywhere in `report.js`.

Now break it on purpose: change `module.exports = { … }` to `exports = { … }`. Run it. `formatRow is not a function` — the trap from 1.2. Change it back.

---

### Step 8 — `esm/` — The Same Project as ES Modules

```
day-05/esm/
├── package.json
├── students.json
├── report.js
└── lib/
    ├── index.js
    ├── grade-lib.js
    └── db.js
```

`package.json`:

```json
{
  "name": "day-05-esm",
  "type": "module"
}
```

`students.json` — this time **without** attendance. It comes from a slow "service", like Part 2:

```json
[
  { "id": 1, "name": "Sara", "score": 92 },
  { "id": 2, "name": "Omar", "score": 68 },
  { "id": 3, "name": "Lina", "score": 79 },
  { "id": 4, "name": "Yusuf", "score": 95 },
  { "id": 5, "name": "Nour", "score": 55 }
]
```

`lib/grade-lib.js` — the same functions, `export` instead of `module.exports`:

```js
// lib/grade-lib.js — ES module: works in Node AND in the browser, unchanged

export const PASS_MARK = 60;

export function letterGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function average(numbers) {
  if (numbers.length === 0) return 0;
  let total = 0;
  for (const n of numbers) total += n;
  return total / numbers.length;
}

export function formatRow({ name = "???", score = 0, attendance }) {
  const result = score >= PASS_MARK ? "PASS" : "FAIL";
  const att = attendance === undefined ? "  —" : `${String(attendance).padStart(3)}%`;
  return `${name.padEnd(6)} ${String(score).padStart(3)}  ${letterGrade(score)}  ${att}  ${result}`;
}
```

`lib/db.js` — Part 2's async service, with a default export and a named one:

```js
// lib/db.js — Part 2's promise database, as a module

const LATENCY = { 1: 300, 2: 100, 3: 200 };

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// The default export: the one main thing this file provides
export default async function getAttendance(id) {
  await delay(LATENCY[id] ?? 50);
  if (id === 4) throw new Error(`Attendance service down for #${id}`);
  return 60 + id * 7;
}

// A named export alongside it
export { delay };
```

`lib/index.js` — the barrel:

```js
// lib/index.js — a "barrel": one import point for the whole folder

export * from "./grade-lib.js";
export { default as getAttendance, delay } from "./db.js";
```

`report.js`:

```js
// report.js — ES module: import, top-level await, no main() wrapper

import { readFile } from "node:fs/promises";
import { average, letterGrade, formatRow, getAttendance } from "./lib/index.js";

const started = Date.now();
const students = JSON.parse(await readFile(new URL("./students.json", import.meta.url), "utf8"));

// Fetch attendance for everyone in parallel — Part 2, now in its own module
const results = await Promise.allSettled(students.map(({ id }) => getAttendance(id)));

const merged = students.map((student, i) =>
  results[i].status === "fulfilled" ? { ...student, attendance: results[i].value } : student
);

for (const student of merged) console.log(formatRow(student));

const scores = merged.map(({ score }) => score);
console.log(`\nAverage: ${average(scores).toFixed(1)} (${letterGrade(average(scores))})`);
console.log(`Failed lookups: ${results.filter(({ status }) => status === "rejected").length}`);
console.log(`Done in ${Date.now() - started}ms`);
```

```bash
cd day-05/esm
node report.js
```

```
Sara    92  A   67%  PASS
Omar    68  D   74%  PASS
Lina    79  C   81%  PASS
Yusuf   95  A    —  PASS
Nour    55  F   95%  FAIL

Average: 77.8 (C)
Failed lookups: 1
Done in 308ms
```

> **`new URL("./students.json", import.meta.url)`** builds the path relative to **this file**, not to wherever you ran `node` from. Run `node day-05/esm/report.js` from the repo root and it still finds the JSON — which Day 04's `"students.json"` path couldn't. `import.meta.dirname` works too; `import.meta.url` is the version that also works in browsers.

Then try each of these, one at a time, and read the error:

1. Remove `.js` from `"./lib/index.js"` → `ERR_MODULE_NOT_FOUND`.
2. Import a name that doesn't exist: `import { nope } from "./lib/index.js"` → `does not provide an export named 'nope'`.
3. Add `console.log(__dirname)` → `__dirname is not defined in ES module scope`.
4. Delete `"type": "module"` from `package.json`. Recent Node still runs it, but prints `[MODULE_TYPELESS_PACKAGE_JSON] Warning: … Reparsing as ES module` — it had to *guess*. Older Node refuses with `SyntaxError: Cannot use import statement outside a module`. Either way: put it back, and never make Node guess.

---

### Step 9 — Default vs Named, Side by Side

Add this file to `esm/` to see every import form in one place:

```js
// imports-tour.js
import getAttendance from "./lib/db.js";                    // default — any name works
import fetchAttendance from "./lib/db.js";                  // same function, another name
import { delay } from "./lib/db.js";                        // named
import { average as mean, PASS_MARK } from "./lib/grade-lib.js";  // renamed + named
import * as grades from "./lib/grade-lib.js";              // namespace

console.log(getAttendance === fetchAttendance);   // true — one function, two names
console.log(mean([90, 80]), PASS_MARK);           // 85 60
console.log(Object.keys(grades));                 // [ 'PASS_MARK', 'average', 'formatRow', 'letterGrade' ]
console.log(typeof delay);                        // function

const { letterGrade } = await import("./lib/grade-lib.js");   // dynamic import
console.log(letterGrade(72));                     // C
```

```bash
node imports-tour.js
```

The first line is the argument for named exports: `getAttendance` and `fetchAttendance` are the same thing, and nothing forced them to share a name.

---

### Step 10 — `esm/index.html` + `main.js` — The Same Module in the Browser

`index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JavaScript Everywhere — Day 05 Modules</title>
  </head>
  <body>
    <h1>Grade Checker — one module, two runtimes</h1>
    <input id="name" type="text" placeholder="Name" />
    <input id="score" type="number" placeholder="Score 0-100" />
    <button id="add">Add</button>
    <ul id="list"></ul>
    <p id="summary"></p>

    <script type="module" src="./main.js"></script>
  </body>
</html>
```

`main.js`:

```js
// main.js — imports the SAME lib/grade-lib.js that report.js uses in Node
import { letterGrade, average, PASS_MARK } from "./lib/grade-lib.js";

const nameInput = document.getElementById("name");
const scoreInput = document.getElementById("score");
const list = document.getElementById("list");
const summary = document.getElementById("summary");

let students = [];

function render() {
  list.innerHTML = "";
  for (const { name, score } of students) {
    const li = document.createElement("li");
    const result = score >= PASS_MARK ? "PASS" : "FAIL";
    li.textContent = `${name} — ${score} (${letterGrade(score)}) ${result}`;
    list.appendChild(li);
  }
  const scores = students.map(({ score }) => score);
  summary.textContent = students.length
    ? `${students.length} students · average ${average(scores).toFixed(1)}`
    : "";
}

function handleAdd() {
  const name = nameInput.value.trim();
  const score = Number(scoreInput.value);
  if (!name || scoreInput.value === "" || score < 0 || score > 100) return;
  students = [...students, { name, score }];
  nameInput.value = "";
  scoreInput.value = "";
  render();
}

document.getElementById("add").addEventListener("click", handleAdd);

console.log(typeof students);        // "object" — works here, inside the module
```

Open `index.html` with **Live Server**. Then:

1. Add a few students — the grading comes from the file Node used in Step 8.
2. In the DevTools console, type `students`. → `ReferenceError: students is not defined`. Module scope: nothing leaked onto `window`.
3. Open the **Network** tab and reload. You'll see `main.js` **and** `grade-lib.js` requested separately — the browser follows the `import`.
4. Double-click `index.html` to open it as `file://…`. The console shows a CORS error and nothing works. Back to Live Server.

> **This is the payoff of the whole day.** `lib/grade-lib.js` has no idea whether it's running in Node or Chrome. Pure functions + ES modules = code that runs everywhere. That's the "Everywhere" in the course name.

---

### Step 11 — A Branch, a Merge, and a Conflict

Do this **in your `javascript-everywhere` repo**.

#### 5a — Today's work, on a branch

```bash
git switch main
git pull
git status                              # should say "nothing to commit, working tree clean"

git switch -c feature/day-05

# Commit Steps 1–10 in small, meaningful pieces
git add day-05/promise-basics.js day-05/promise-db.js day-05/chain.js
git commit -m "Add Promise basics and promise-based fake database"
git add day-05/await-report.js day-05/files.js day-05/resilience.js day-05/students.json
git commit -m "Add async/await report, fs/promises and retry demos"
git add day-05/index.html day-05/app.js
git commit -m "Add async/await student loader for the browser"
git add day-05/cjs
git commit -m "Add CommonJS version of grade-lib and report"
git add day-05/esm/lib day-05/esm/package.json
git commit -m "Add ES module grade-lib, db and barrel"
git add day-05/esm
git commit -m "Add ESM report, imports tour and browser demo"

git log --oneline --graph
```

Merge it into `main`. Nothing changed on `main` meanwhile, so this is a fast-forward:

```bash
git switch main
git merge feature/day-05        # "Fast-forward"
git branch -d feature/day-05
```

#### 5b — A conflict, on purpose

Make your first conflict now, on purpose, so it isn't at 2am before a deadline. Two branches, **one line**, two different edits:

```bash
# On a new branch: change PASS_MARK to 70 in day-05/esm/lib/grade-lib.js
git switch -c experiment/pass-mark
#   edit: export const PASS_MARK = 70;
git commit -am "Raise pass mark to 70"

# Back on main: change the SAME line to 50
git switch main
#   edit: export const PASS_MARK = 50;
git commit -am "Lower pass mark to 50"

# Merge — and watch it fail
git merge experiment/pass-mark
```

```
Auto-merging day-05/esm/lib/grade-lib.js
CONFLICT (content): Merge conflict in day-05/esm/lib/grade-lib.js
Automatic merge failed; fix conflicts and then commit the result.
```

```bash
git status --short                      # UU day-05/esm/lib/grade-lib.js
```

Open the file. You'll see:

```js
<<<<<<< HEAD
export const PASS_MARK = 50;
=======
export const PASS_MARK = 70;
>>>>>>> experiment/pass-mark
```

Decide what it should be — say, back to `60` — delete **all three** marker lines, save, then:

```bash
node day-05/esm/report.js               # prove it still runs
git add day-05/esm/lib/grade-lib.js
git commit                              # accept the pre-filled "Merge branch …" message
git branch -d experiment/pass-mark
git log --oneline --graph -6            # see the two lines join
```

---

### Step 12 — Push and Open a Pull Request

```bash
git switch -c feature/day-05-notes
# write day-05/NOTES.md
git add day-05/NOTES.md
git commit -m "Add Day 05 notes"
git push -u origin feature/day-05-notes
```

The push output includes a link:

```
remote: Create a pull request for 'feature/day-05-notes' on GitHub by visiting:
remote:      https://github.com/you/javascript-everywhere/pull/new/feature/day-05-notes
```

Open it (or click **Compare & pull request** on the repo page), then:

1. **Title:** `Add Day 05 notes`
2. **Description:** What / Why / How to test — the template from 2.6.
3. **Create pull request.** Look at the **Files changed** tab — this is what a reviewer sees.
4. Leave yourself one review comment on a line of `NOTES.md`.
5. Push one more commit to the same branch, and watch it appear in the PR automatically.
6. **Merge pull request** → **Delete branch**.
7. Back in the terminal:

```bash
git switch main
git pull                                 # the merge commit comes down
git branch -d feature/day-05-notes       # tidy up locally
git log --oneline --graph -10
```

> **From now on, every day's work goes through a PR** on your own repo — branch, commits, push, PR, merge. The PR list on your GitHub becomes a readable history of the whole course, and it's the first thing a hiring manager clicks on.

---

## The Cheat Sheet

### Part 1 — Promises

| Idea | Write this | Not this |
|---|---|---|
| Make a Promise | `new Promise((resolve, reject) => …)` | a callback parameter |
| Fail | `reject(new Error("…"))` | `reject("…")` |
| Wait N ms | `const delay = (ms) => new Promise((r) => setTimeout(r, ms))` | `blockFor(ms)` |
| Use the value | `.then((value) => …)` | reading it on the next line |
| Next async step | `.then((x) => nextStep(x))` — **returned** | `.then((x) => { nextStep(x); })` |
| Handle every error | one `.catch` at the end | `if (err)` at each step |
| Cleanup | `.finally(() => …)` | the same line in `then` and `catch` |
| Wrap a callback API | `promisify(fn)` / `util.promisify` | nesting callbacks inside `.then` |
| Node files | `require("fs/promises")` | `fs.readFile(path, cb)` |
| All, fail fast | `Promise.all([...])` | a counter + index |
| All, keep failures | `Promise.allSettled([...])` | `Promise.all` + hope |
| First to settle | `Promise.race([...])` | — |
| First success | `Promise.any([...])` | — |

### Part 2 — Async / Await

| Idea | Write this | Not this |
|---|---|---|
| Async function | `async function f() {}` | expecting it to return a plain value |
| Get a value | `const x = await promise` | `const x = promise` |
| Handle errors | `try { await … } catch (err) {}` | `.catch` inside every line |
| Always clean up | `finally { btn.disabled = false; }` | re-enabling in each branch |
| Independent calls | `await Promise.all([a(), b()])` | `await a(); await b();` |
| List, in parallel | `await Promise.all(list.map(fn))` | `list.forEach(async …)` |
| List, in order | `for (const x of list) await fn(x)` | `list.forEach(async …)` |
| Timeout | `Promise.race([work, timer])` | hoping it's fast |
| Retry | `for` + `try` + `return await` | recursion without a limit |
| Script entry point | `main().catch(…)` | a bare `main()` with no catch |

#### Execution Order, With Promises

```
1. All synchronous code — including every Promise executor
2. ALL microtasks — .then / .catch / .finally, and code after each `await`
3. ONE task — a timer, an I/O callback, a click
4. Back to 2
```

### Part 3 — Modules

| Idea | CommonJS | ES Modules |
|---|---|---|
| Export several | `module.exports = { a, b }` | `export function a() {}` |
| Export one main thing | `module.exports = fn` | `export default fn` |
| Import named | `const { a } = require("./x")` | `import { a } from "./x.js"` |
| Import default | `const fn = require("./x")` | `import fn from "./x.js"` |
| Rename | `const { a: b } = require("./x")` | `import { a as b } from "./x.js"` |
| Everything | `const x = require("./x")` | `import * as x from "./x.js"` |
| Load later | `require()` inside an `if` | `const m = await import("./x.js")` |
| Built-in | `require("fs")` | `import fs from "node:fs"` |
| This file's folder | `__dirname` | `import.meta.dirname` |
| Switch on | default | `"type": "module"` or `.mjs` |
| Browser | ❌ | `<script type="module">` + Live Server |

#### Relative or package?

```
"./lib/grade-lib.js"   → my file, relative to THIS file
"../shared/utils.js"   → my file, one folder up
"node:fs/promises"     → Node built-in
"dayjs"                → an npm package in node_modules
```

### Part 4 — Git

| Task | Command |
|---|---|
| What changed? | `git status` / `git diff` / `git diff --staged` |
| Stage | `git add file` / `git add .` |
| Commit | `git commit -m "Imperative, specific message"` |
| History | `git log --oneline --graph` |
| New branch | `git switch -c feature/name` |
| Change branch | `git switch main` |
| Merge into current | `git merge feature/name` |
| Delete branch | `git branch -d feature/name` |
| Abort a merge | `git merge --abort` |
| Upload | `git push -u origin branch` then `git push` |
| Download | `git pull` |
| Copy a repo | `git clone <url>` |
| Discard file edits | `git restore file` |
| Unstage | `git restore --staged file` |
| Fix last commit (unpushed) | `git commit --amend` |
| Undo a pushed commit | `git revert <hash>` |

#### The PR Loop

```
switch main → pull → switch -c feature/x → commit… → push -u → open PR → review → merge → switch main → pull → branch -d
```

---

## Common Mistakes

| Mistake | What happens | Fix |
|---|---|---|
| `.then((x) => { next(x); })` | Chain moves on with `undefined`; `next`'s errors go nowhere | `return next(x)` — or drop the braces |
| No `.catch` on a chain | Node crashes with an unhandled rejection | End every chain with `.catch` |
| `reject("oops")` | No stack trace, `err.message` is `undefined` | `reject(new Error("oops"))` |
| Expecting `resolve` twice to update | Second call is ignored — Promises settle once | Make a new Promise per result |
| `const data = fetchThing();` then `data.name` | `data` is a Promise; `.name` is `undefined` | `await fetchThing()` |
| `await` outside an `async` function | `SyntaxError: await is only valid in async functions…` | Mark the function `async`, or wrap in `main()` |
| `async` function "returns 92" but you see `Promise { 92 }` | `async` always wraps the return value | `await` it or `.then` it |
| `await a(); await b();` for independent calls | Twice as slow as it needs to be | `await Promise.all([a(), b()])` |
| `list.forEach(async …)` | Nothing waits; "done" prints first | `for…of` or `Promise.all(list.map(…))` |
| `Promise.all` when some may fail | One failure throws away every result | `Promise.allSettled` |
| `return fn()` inside `try` in an async function | Rejection skips your `catch` | `return await fn()` |
| Re-enabling a button only on success | Stuck disabled after the first failure | Put it in `finally` |
| Thinking `withTimeout` cancels the work | The slow request keeps running | It stops *waiting*; real cancel needs `AbortController` |
| `Promise.all(a(), b())` | `TypeError` — it takes **one** array | `Promise.all([a(), b()])` |
| `exports = { … }` | Importer gets `{}` | `module.exports = { … }` |
| Forgetting to export a function | `TypeError: x is not a function` / `does not provide an export named 'x'` | Add it to `module.exports` or put `export` in front |
| `import … from "./lib/grade-lib"` in ESM | `ERR_MODULE_NOT_FOUND` | Add `.js` |
| `require` in an ESM file | `ReferenceError: require is not defined in ES module scope` | Use `import` |
| `import` in a CommonJS file | `SyntaxError: Cannot use import statement outside a module` | Add `"type": "module"` or rename to `.mjs` |
| `__dirname` in ESM | `ReferenceError` | `import.meta.dirname` |
| `import grades from "./grade-lib.js"` when it only has named exports | `does not provide an export named 'default'` | `import * as grades` or `import { … }` |
| `import { getAttendance }` when it's a default export | `does not provide an export named 'getAttendance'` | `import getAttendance from …` |
| `<script src="main.js">` without `type="module"` | `SyntaxError: Cannot use import statement outside a module` | `type="module"` |
| Opening a module page as `file://` | CORS error, nothing loads | Live Server |
| `onclick="fn()"` with a module script | `fn is not defined` | `addEventListener` |
| Committing `node_modules` or `.env` | Huge repo / leaked secrets | `.gitignore` **before** the first commit |
| `git add .` without `git status` first | Commits junk you didn't mean to | Always `status` before `add .` |
| Commit message `update` | History nobody can read | Imperative, specific: what and why |
| Working on `main` directly | No review, hard to undo | `git switch -c feature/…` first |
| Leaving conflict markers in the file | `SyntaxError: Unexpected token '<<'` | Delete all three marker lines |
| `git push --force` on a shared branch | Deletes other people's commits | Never on `main`; use `git revert` |
| Pushing without pulling | `rejected — fetch first` | `git pull`, resolve, push |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Promise { <pending> }` printed instead of data | You logged the Promise. `await` it, or log inside `.then`. |
| `undefined` in the next `.then` | The previous `.then` has braces and no `return`. |
| `SyntaxError: await is only valid in async functions and the top level bodies of modules` | Add `async` to the function that contains the `await`. |
| Node exits with an error you "handled" | That `await` or chain isn't inside a `try` / before a `.catch`. Find the one that isn't. |
| `Uncaught (in promise)` in the browser console | Same thing — a rejection nobody caught. |
| Script is suddenly much slower | Independent `await`s in a row. Start them together with `Promise.all`. |
| "Done" logs before the work finished | `forEach(async …)`, or a missing `await` in front of a call. |
| `Promise.all` rejects and you lose all results | Use `allSettled`, or catch per item: `list.map((x) => f(x).catch(() => null))`. |
| `TypeError: object is not iterable` from `Promise.all` | You passed separate arguments or a single Promise. Pass an array. |
| Timed out but the work still finishes later | Expected — the timeout stops waiting; it doesn't cancel. |
| `ENOENT` from `fs/promises` | Wrong path, or `node` run from a different folder. `cd` into `day-05`. |
| Button stays disabled after an error | Move the re-enable into `finally`. |
| `Cannot find module './lib/grade-lib'` | Wrong path, or missing `.js` in ESM. Paths are relative to the **importing file**. |
| `does not provide an export named 'x'` | Typo, not exported, or it's a default export — check the other file's `export` lines. |
| `x is not a function` after `require` | The module exported something else — `console.log(require("./x"))` and look. |
| `Cannot use import statement outside a module` | Node: add `"type": "module"`. Browser: add `type="module"`. |
| A module's `console.log` runs only once | That's the cache — it's supposed to. |
| Module page is blank, CORS error in console | You opened it as `file://`. Use Live Server. |
| `students is not defined` in the browser console | Module scope. Log from inside `main.js`, or `window.students = students` while debugging. |
| `fatal: not a git repository` | You're in the wrong folder. `cd` into the repo. |
| `error: Your local changes would be overwritten by checkout` | Commit or stash your edits before `git switch`. |
| `CONFLICT (content): Merge conflict in …` | Edit the file, remove the markers, `git add`, `git commit`. Or `git merge --abort`. |
| `! [rejected] main -> main (fetch first)` | Someone pushed first. `git pull`, then `git push`. |
| `fatal: The current branch … has no upstream branch` | First push of a branch: `git push -u origin branch-name`. |
| `Author identity unknown` | `git config --global user.name "Your Name"` and `user.email`. |
| Pushed `node_modules` by accident | Add it to `.gitignore`, then `git rm -r --cached node_modules` and commit. |
| Pushed a secret | **Change the secret first** (new password / key). Removing it from Git is second — it's already public. |

---

## Before the Next Session

The next session is **TypeScript Intro — Basic Types, Interfaces, Generics** — where your `grade-lib.js` finds out at compile time that `letterGrade("ninety")` is a bug, before any student ever sees it.

Come having finished [ASSIGNMENT.md](ASSIGNMENT.md) — **merged through a pull request**. If `await-report.js` doesn't show parallel beating sequential, or `import` still throws, ask **before** the next session.

### A Taste of the Next Session

Save this as `day-05/esm/grade-lib-preview.ts` (inside `esm/`, so `"type": "module"` applies) and run it with `node grade-lib-preview.ts`. Recent Node versions run TypeScript directly by stripping the types out:

```ts
// grade-lib-preview.ts
type Student = {
  name: string;
  score: number;
  attendance?: number;          // ? = optional
};

export function letterGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

const students: Student[] = [
  { name: "Sara", score: 92, attendance: 95 },
  { name: "Omar", score: 68 },
];

for (const { name, score } of students) {
  console.log(`${name}: ${letterGrade(score)}`);
}
```

Same functions, with **types** on every parameter and return value. Node just runs it — but open it in VS Code and change `letterGrade(score)` to `letterGrade(name)`. The red underline appears before you run anything. That's the whole idea of TypeScript, and it's next.

---

## Day 05 Files

- [README.md](README.md) — this guide
- [ASSIGNMENT.md](ASSIGNMENT.md) — Day 05 assignment

← Back to [Day 04 — ES6+ & Async JS](../Day-04-ES6-Destructuring/README.md)

Next: [Day 06 — TypeScript from Scratch: Data Types, Functions, Interfaces, Generics](../Day-06-TypeScript-Intro/README.md) →
