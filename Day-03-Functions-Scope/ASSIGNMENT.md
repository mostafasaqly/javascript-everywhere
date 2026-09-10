# Day 03 — Assignment

**Track 1 · Session 3 · Functions, Scope & Hoisting**

> Session 2 taught you to write logic. Session 3 taught you to name it, box it, and reuse it.
> This assignment makes that permanent — by rewriting your own Day 02 code into functions
> and watching it get shorter, clearer, and harder to break.
> Session 4 destructures what goes *into* those functions. It assumes the functions already exist.

**⏱ Budget:** 6–7 hours · **📅 Duration:** 3 days · **🚩 Deadline:** before Session 4

| # | Task | Deliverable |
|---|---|---|
| 1 | Predict the scope & hoisting | `predictions.md` + 1 screenshot |
| 2 | Function-writing drills | `basics.js` + 1 screenshot |
| 3 | Scope & hoisting lab | `scope.js` + 1 screenshot |
| 4 | Closures & callbacks | `closures.js` + 1 screenshot |
| 5 | Build: the Grade Library refactor | `grade-lib.js` + `report.js` + 1 screenshot |
| 6 | Browser: Grade Calculator | 2 files + 1 screenshot |
| 7 | Notes + repo | `NOTES.md` + repo link + `git log` screenshot |
| 8 | Share it | LinkedIn post link |

> **Type every line by hand. Do not copy-paste.** You are building muscle memory, and `Ctrl+V` builds none.

---

## Task 1 — Predict, Then Run

Same drill as Day 02 — this time on scope and hoisting, where being wrong is even more useful.

### 1.1 — Write Your Predictions First

- [ ] Create `predictions.md`
- [ ] For **each** numbered snippet, write what you think happens — a value, or the **exact error name** — **before running anything**

```js
// 1
console.log(a);
var a = 1;

// 2
console.log(b);
let b = 2;

// 3
hello();
function hello() { console.log("hi"); }

// 4
bye();
const bye = () => console.log("bye");

// 5
function f() { return; 42; }
console.log(f());

// 6
const g = (x) => { x * 2 };
console.log(g(5));

// 7
const h = (x) => { value: x };
console.log(h(5));

// 8
function k(a, b) { return a + b; }
console.log(k(1));

// 9
function m(x = 10) { return x; }
console.log(m(null), m(undefined), m(0));

// 10
let n = "outer";
function p() { let n = "inner"; return n; }
console.log(p(), n);

// 11
for (var i = 0; i < 3; i++) {}
console.log(i);

// 12
for (let j = 0; j < 3; j++) {}
console.log(j);

// 13
function counter() { let c = 0; return () => ++c; }
const q = counter();
console.log(q(), q(), counter()());

// 14
const nums = [1, 2, 3];
console.log(nums.map((x) => x * 2));

// 15
function r() { console.log("ran"); }
console.log(r);
```

### 1.2 — Now Run Them

- [ ] Create `predictions.js` and run each snippet — **one at a time**, since several throw and would stop the file
- [ ] In `predictions.md`, record **actual** next to each prediction
- [ ] For every one you got **wrong**, write one sentence explaining why JavaScript did that
- [ ] For #2 and #4, name the mechanism explicitly in your explanation

> Getting them wrong is the assignment. Getting them wrong and not explaining why is not.

**✅ Deliverable:** `predictions.md` with predictions, actuals, and explanations + screenshot of the output.

---

## Task 2 — Function-Writing Drills

Create `basics.js`. Each part is a few lines — run after every part.

### 2.1 — The Same Function, Three Ways

- [ ] Write `celsiusToF` as a **function declaration**
- [ ] Write the identical logic as a **function expression**
- [ ] Write it a third time as an **arrow function with implicit return**
- [ ] Call all three with `25` and prove they print the same thing

### 2.2 — Return, Not Log

- [ ] Write `addLog(a, b)` that only `console.log`s the sum
- [ ] Write `addReturn(a, b)` that returns it
- [ ] Try to use each in `const doubled = /* the call */ * 2;` and print the result
- [ ] Comment one sentence explaining why one gives `NaN`

### 2.3 — Defaults

- [ ] Write `greet(name = "guest", greeting = "Hello")` returning a template literal
- [ ] Call it four ways: no arguments, one argument, both, and with `undefined` as the **first** argument
- [ ] Call it with `null` as the name — comment what happened and why the default did **not** fire

### 2.4 — Rest Parameters

- [ ] Write `sumAll(...numbers)` returning the total of any count of arguments
- [ ] Test with `0`, `1`, and `5` arguments
- [ ] Write `describe(label, ...values)` returning `"label: v1, v2, v3"`

### 2.5 — Guard Clauses

- [ ] Write `safeDivide(a, b)` that returns `"Cannot divide by zero"` when `b` is `0`, `"Not a number"` when either argument isn't a number, and the result otherwise
- [ ] All three checks must be **guard clauses at the top** — no `else` anywhere in the function
- [ ] Test all three paths

**✅ Deliverable:** `basics.js` + screenshot of the full output.

---

## Task 3 — Scope & Hoisting Lab

Create `scope.js`. Some parts here are meant to throw — that's the point. Comment out a broken line after you've seen its error so the file keeps running.

### 3.1 — Three Levels

- [ ] Declare a global variable, a function-scoped one, and a block-scoped one
- [ ] Print all three from the innermost scope — all three must work
- [ ] Try to print the innermost one from the outside, screenshot the error, then comment the line out

### 3.2 — `var` Leaks

- [ ] Inside an `if` block, declare one `let` and one `var`
- [ ] Print both from outside the block
- [ ] Comment one sentence on which escaped and why that's a problem

### 3.3 — Shadowing

- [ ] Create a global `status`, then a function with its own local `status`
- [ ] Print from inside and from outside, proving the global is untouched
- [ ] Add a comment stating which one "wins" inside the function and why

### 3.4 — Hoisting, Demonstrated

- [ ] Call a **function declaration** before it's defined — it works
- [ ] Print a `var` before its line — record the value (not an error)
- [ ] Print a `let` before its line — screenshot the error, then comment it out
- [ ] Call an **arrow function** before its line — screenshot the error, then comment it out
- [ ] In comments, state which of the four are safe and which are bugs waiting to happen

### 3.5 — The Loop Classic

- [ ] Write a `for` loop with `var i` that pushes `() => i` into an array three times, then calls all three
- [ ] Do the same with `let i`
- [ ] Print both sets of results and explain the difference in one comment

> This is the single most-asked JavaScript interview question. Understand it once, here.

**✅ Deliverable:** `scope.js` + screenshot (include the error screenshots in your notes).

---

## Task 4 — Closures & Callbacks

Create `closures.js`.

### 4.1 — A Counter That Remembers

- [ ] Write `makeCounter()` returning a function that increments and returns a private count
- [ ] Create **two** counters and prove they're independent
- [ ] Comment one sentence on why `count` still exists after `makeCounter()` returned

### 4.2 — A Function Factory

- [ ] Write `makeMultiplier(factor)` returning a function that multiplies its input
- [ ] Build `double`, `triple`, and `half` from it and test each

### 4.3 — A Grader Factory

- [ ] Write `makeGrader(passMark)` returning a function that gives `"Pass"` / `"Fail"`
- [ ] Build a strict grader (`85`) and a lenient one (`60`)
- [ ] Run the **same** score through both and print both answers

### 4.4 — Write Your Own `forEach`

- [ ] Write `myForEach(array, callback)` that calls the callback with `(item, index)` for every element
- [ ] Use a `for` loop inside — do **not** use the built-in `.forEach`
- [ ] Test it printing `1. Web`, `2. Mobile`, …

### 4.5 — Write Your Own `map` and `filter`

- [ ] Write `myMap(array, callback)` returning a **new** array of results
- [ ] Write `myFilter(array, test)` returning only the items where `test(item)` is truthy
- [ ] Prove the original array was **not** modified
- [ ] Test `myFilter` with a scores array, keeping only passing scores

### 4.6 — Callback, Not Call

- [ ] Write a `runTwice(fn)` that calls the function it's given, twice
- [ ] Call it correctly with `runTwice(sayHi)`
- [ ] Then deliberately call it as `runTwice(sayHi())`, screenshot the wrong behaviour, and comment what happened

**✅ Deliverable:** `closures.js` + screenshot of the full output.

---

## Task 5 — Build: The Grade Library Refactor

This is the main build. Take your **own** Day 02 `report-card.js` and rewrite it as functions — split across two files.

### 5.1 — `grade-lib.js` — Pure Functions Only

**No `console.log` anywhere in this file.** Every function takes input and returns output.

- [ ] `isValidScore(score)` → `true` / `false`, rejecting non-numbers, `NaN`, and anything outside `0–100`
- [ ] `letterGrade(score)` → `"A"`–`"F"` using your five bands
- [ ] `isPassing(score, passMark = 60)` → boolean, with a working default
- [ ] `isAtRisk(student)` → `true` when the score is below `60` **or** attendance is below `70`
- [ ] `average(numbers)` → the mean, returning `0` for an empty array (guard clause — no division by zero)
- [ ] `highest(students)` / `lowest(students)` → the **student object**, found with a loop, no `Math.max`
- [ ] `countByGrade(students)` → an object like `{ A: 2, B: 1, C: 0, D: 1, F: 1 }`
- [ ] `formatRow(student)` → one aligned string, using `padEnd` / `padStart`
- [ ] Each function does **one** thing and has a name that says what it returns

### 5.2 — `report.js` — The Program

This file does the printing, and calls the library.

- [ ] An array of **at least 10** student objects with `name`, `score`, `attendance`
- [ ] Include **two deliberately broken** records — one with a string score, one with `null`
- [ ] Print a header row and separator
- [ ] Loop with `for...of`, skipping invalid records with `continue` and counting them
- [ ] Print one line per valid student via `formatRow`
- [ ] Print a summary: counts per band, class average to one decimal, highest and lowest **by name**, at-risk count, skipped count
- [ ] Every function called here must be defined in `grade-lib.js` — `report.js` holds **no** grading logic

> For today, put both files' contents in one folder and paste `grade-lib.js`'s functions above `report.js`'s code, or copy them in. Session 7 covers `import` / `export` properly — don't fight modules yet.

### 5.3 — Prove It's Better

- [ ] In `NOTES.md`, paste your Day 02 `report-card.js` line count and your Day 03 total
- [ ] Name **one** change you can now make in a single place that previously needed three edits

**✅ Deliverable:** `grade-lib.js` + `report.js` + screenshot of the output.

---

## Task 6 — The Browser Side

Create `index.html` and `app.js`. Same functions, different environment.

- [ ] Inputs for a student **name** and a **score**, plus **Add** and **Clear** buttons
- [ ] `app.js` split into two clearly commented sections: **pure logic** at the top, **DOM handling** below
- [ ] The pure section reuses `isValidScore`, `letterGrade`, and `average` — **identical** to `grade-lib.js`, no DOM inside them
- [ ] A named `handleAdd` function wired with `addEventListener` — pass the function, don't call it
- [ ] Validate: empty name, empty score, non-number, and out of `0–100` each show a clear message and stop via a guard clause
- [ ] A `render()` function that rebuilds the `<ul>` from the array with a loop — called after every change
- [ ] A summary line showing the count and the average to one decimal
- [ ] **Clear** empties the array and re-renders
- [ ] Log the students array to the console on every add
- [ ] Runs through **Live Server**

- [ ] Screenshot the page with at least 5 students added and DevTools console open.

> **The point of this task:** `render()` and `handleAdd()` cannot exist in Node — there's no page. `letterGrade()` runs unchanged in both. Be ready to say in one sentence why that separation matters.

**✅ Deliverable:** `index.html` + `app.js` pushed + 1 screenshot.

---

## Task 7 — Notes and Repository

### 7.1 — Repo Structure

- [ ] Add a `day-03/` folder to your `javascript-everywhere` repo:

```
javascript-everywhere/
├── README.md
├── day-01/
├── day-02/
└── day-03/
    ├── NOTES.md
    ├── predictions.md
    ├── predictions.js
    ├── basics.js
    ├── scope.js
    ├── closures.js
    ├── grade-lib.js
    ├── report.js
    ├── index.html
    └── app.js
```

- [ ] Add a Day 03 row to your root `README.md` table of contents

### 7.2 — `day-03/NOTES.md`

**In your own words** — not the README's words:

- [ ] The difference between a parameter and an argument
- [ ] Declaration vs expression vs arrow — one line each, and when you'd pick each
- [ ] Why `return` and `console.log` are not interchangeable
- [ ] What a guard clause is and why it beats nested `if / else`
- [ ] Global vs function vs block scope, one sentence each
- [ ] What the scope chain is, and which direction it searches
- [ ] What hoisting actually moves — for `function`, `var`, `let`, and `const`
- [ ] What the TDZ is, and why an error there is better than `undefined`
- [ ] What a closure is, in one sentence, without using the word "closure"
- [ ] The difference between passing `fn` and passing `fn()`
- [ ] Your Task 5.3 answer — the line counts and the one-place change
- [ ] **One bug you hit today**, the exact error message, and how you fixed it

> The bug section is not optional. If nothing broke, you copy-pasted.

### 7.3 — Five Separate Commits

- [ ] Commit 1 — `predictions.md` + `predictions.js`
- [ ] Commit 2 — `basics.js`
- [ ] Commit 3 — `scope.js` + `closures.js`
- [ ] Commit 4 — `grade-lib.js` + `report.js`
- [ ] Commit 5 — browser files + `NOTES.md`

Real commit messages. `update` is not a message.

- [ ] Run `git log --oneline` and screenshot it.

**✅ Deliverable:** repo link + `git log` screenshot.

---

## Task 8 — Share It

- [ ] Post on **LinkedIn** about completing Session 3
- [ ] Include the screenshot of your `report.js` output
- [ ] Include the link to your repo
- [ ] Say one concrete thing you understood today that you didn't before — a hoisting result, the `var`-in-a-loop trap, the first closure that clicked. Not "excited to continue my journey".

**✅ Deliverable:** the link to your post.

---

## Bonus (Optional)

- [ ] Write `compose(f, g)` returning a function that runs `g` then feeds its result into `f`
- [ ] Write `once(fn)` — a function that runs only the first time it's called and returns the same result forever after
- [ ] Write `memoize(fn)` that caches results in an object so repeated arguments skip the work — prove it with a slow loop
- [ ] Write `myReduce(array, callback, initial)` and rebuild `average` on top of it
- [ ] Add `weightedScore(student)` — `70%` exam + `30%` attendance — and sort the report by it, with your own sort loop
- [ ] Make `makeIdGenerator(prefix)` and use it to give every student a unique id in `report.js`
- [ ] In the browser app, add a **Remove** button per row — each one a closure remembering its own index
- [ ] Write a `validateStudent(student)` returning an **array of error messages**, and use it instead of the single-check guards

---

## Submission Checklist

- [ ] **Task 1** — `predictions.md` with wrong answers explained + screenshot
- [ ] **Task 2** — `basics.js` + screenshot
- [ ] **Task 3** — `scope.js` + screenshot (+ error screenshots in notes)
- [ ] **Task 4** — `closures.js` + screenshot
- [ ] **Task 5** — `grade-lib.js` + `report.js` + screenshot
- [ ] **Task 6** — `index.html` + `app.js` + screenshot with console open
- [ ] **Task 7** — repo link, correct structure, `NOTES.md`, 5 commits, `git log` screenshot
- [ ] **Task 8** — LinkedIn post link

Submit all links together before Session 4.

---

## How This Is Graded

| Level | What it looks like |
|---|---|
| ❌ **Incomplete** | Copy-pasted README code, predictions written after running, grading logic still sitting in `report.js`, one giant commit, or functions you can't explain line by line |
| ✅ **Done** | All eight tasks, working code, a genuinely pure `grade-lib.js`, `NOTES.md` in your own words, a real bug documented |
| 🔥 **10%** | Done + the bonus + `grade-lib.js` doing something beyond the spec + notes someone else could actually learn from |

---

## A Reminder

> **90%** study only — free, self-paced, no assignments turned in.
> **10%** study + assignments + more — I personally help this group get there.
>
> **If you show up for the 10%, I show up for you.**

Session 4 is **ES6+ — Destructuring, Spread/Rest, Template Literals, Default Params** — where the data going into today's functions gets unpacked on the parameter line. Come with `report.js` running.

---

← Back to [Day 03 README](README.md)
