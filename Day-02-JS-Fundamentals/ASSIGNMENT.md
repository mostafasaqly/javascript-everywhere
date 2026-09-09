# Day 02 — Assignment

**Track 1 · Session 2 · JS Fundamentals**

> Session 1 proved your environment works. Session 2 gave you the four ideas
> every program is built from. This assignment makes them yours — by writing
> code that breaks, reading the error, and fixing it.
> Session 3 wraps all of this in functions. It assumes you can already write it loose.

**⏱ Budget:** 6–7 hours · **📅 Duration:** 3 days · **🚩 Deadline:** before Session 3

| # | Task | Deliverable |
|---|---|---|
| 1 | Predict, then run | `predictions.md` + 1 screenshot |
| 2 | Types and coercion drills | `types.js` + 1 screenshot |
| 3 | Conditionals — the grade engine | `grade-engine.js` + 1 screenshot |
| 4 | Loops — five problems | `loops.js` + 1 screenshot |
| 5 | Build: Student Report Card | `report-card.js` + 1 screenshot |
| 6 | Browser: Score Checker | 2 files + 1 screenshot |
| 7 | Notes + repo | `NOTES.md` + repo link + `git log` screenshot |
| 8 | Share it | LinkedIn post link |

> **Type every line by hand. Do not copy-paste.** You are building muscle memory, and `Ctrl+V` builds none.

---

## Task 1 — Predict, Then Run

The fastest way to learn coercion is to be wrong about it on purpose.

### 1.1 — Write Your Predictions First

- [ ] Create `predictions.md`
- [ ] For **each** line below, write down what you think it prints — **before running anything**

```js
console.log("5" + 3);
console.log("5" - 3);
console.log(5 + true);
console.log("5" === 5);
console.log("5" == 5);
console.log(typeof null);
console.log(typeof []);
console.log(0 || "default");
console.log(0 ?? "default");
console.log(Boolean(""));
console.log(Boolean("false"));
console.log(Boolean([]));
console.log(10 % 3);
console.log(null + 1);
console.log(undefined + 1);
```

### 1.2 — Now Run Them

- [ ] Create `predictions.js`, type all 15 lines, run it with `node predictions.js`
- [ ] In `predictions.md`, record **actual** next to each prediction
- [ ] For every one you got **wrong**, write one sentence explaining why JavaScript did that

> Getting them wrong is the assignment. Getting them wrong and not explaining why is not.

**✅ Deliverable:** `predictions.md` with predictions, actuals, and explanations + screenshot of the output.

---

## Task 2 — Types and Coercion Drills

Create `types.js`. Each part is a few lines — run after every part.

### 2.1 — One of Each

- [ ] Declare one variable of **each** primitive type: string, number, boolean, null, undefined
- [ ] Declare one object and one array
- [ ] Print each with its `typeof`, formatted like: `name → "Sara" → string`

### 2.2 — The `typeof` Traps

- [ ] Print `typeof null` and `typeof []`
- [ ] Add a comment above each explaining why the answer is misleading
- [ ] Show the **correct** way to detect an array

### 2.3 — Convert on Purpose

- [ ] Convert the string `"42"` to a number and prove it with `typeof`
- [ ] Convert the number `42` to a string and prove it
- [ ] Show what `Number("hello")` gives, and print `typeof` that result — it will surprise you
- [ ] Show the difference between `parseInt("42px")` and `Number("42px")`

### 2.4 — Falsy Roll Call

- [ ] Loop over an array holding all **8** falsy values plus `[]`, `{}`, `"0"`, and `"hello"`
- [ ] For each, print the value and whether it is truthy or falsy

### 2.5 — `||` vs `??`

- [ ] Create a variable set to `0`
- [ ] Print the result of `||` with a fallback, and `??` with the same fallback
- [ ] In a comment, state in one sentence which one you want when `0` is a valid value

**✅ Deliverable:** `types.js` + screenshot of the full output.

---

## Task 3 — Conditionals: The Grade Engine

Create `grade-engine.js`.

### 3.1 — Five Bands, Not Three

- [ ] Write an `if / else if / else` chain that turns a score into a letter:
  - `90–100` → `A`
  - `80–89` → `B`
  - `70–79` → `C`
  - `60–69` → `D`
  - below `60` → `F`
- [ ] Test it with `95`, `85`, `75`, `65`, `45` — all five must print correctly
- [ ] Guard against invalid input: a score above `100` or below `0` prints `Invalid score` instead

### 3.2 — The Same Logic as a Ternary

- [ ] Write a **single-level** ternary that returns `"pass"` or `"fail"` at a pass mark of `60`
- [ ] In a comment, explain why you would *not* write the five-band version as a nested ternary

### 3.3 — `switch`

- [ ] Write a `switch` that takes a letter grade (`"A"` … `"F"`) and prints a message for each
- [ ] Include a `default` case
- [ ] Then **deliberately delete one `break`**, run it, screenshot the wrong output, and put it back

> Fall-through is a bug you will meet in real code. Meet it here first, on purpose.

### 3.4 — Logical Operators

- [ ] Write a check that prints `"Certificate awarded"` only when the score is `>= 70` **and** attendance is `>= 80%`
- [ ] Write a check that prints `"Review needed"` when the score is `< 60` **or** attendance is `< 50%`
- [ ] Test each with at least two different sets of values

**✅ Deliverable:** `grade-engine.js` + screenshot (include the fall-through screenshot in your notes).

---

## Task 4 — Loops: Five Problems

Create `loops.js`. Solve each with the loop named — part of the exercise is using the right tool.

- [ ] **4.1 — `for`:** Print the numbers `1` to `20`, but for every multiple of `3` print `"Fizz"` instead
- [ ] **4.2 — `for...of`:** Given an array of at least 6 track names, print each with its position (`1.`, `2.`, …)
- [ ] **4.3 — `for...in`:** Given an object with at least 5 keys, print every `key: value` pair
- [ ] **4.4 — `while`:** Start at `100` and keep halving until the value drops below `1`, printing each step
- [ ] **4.5 — `do...while`:** Write a loop whose condition is **false from the start**, and prove it still runs once

### 4.6 — `break` and `continue`

- [ ] Loop an array of scores. `continue` past any score below `50`. `break` out entirely on the first score above `95`. Print everything else.
- [ ] Add a comment stating exactly which scores printed and why

### 4.7 — Sum and Max Without Built-ins

- [ ] Given an array of at least 8 numbers, find the **sum**, the **average**, the **highest**, and the **lowest**
- [ ] Do it with loops only — **no** `Math.max`, `Math.min`, or `.reduce()`
- [ ] Print all four results

**✅ Deliverable:** `loops.js` + screenshot of the full output.

---

## Task 5 — Build: Student Report Card

This is the main build. Create `report-card.js` — your own program, not a copy of the README's `report.js`.

### 5.1 — Requirements

- [ ] An array of **at least 8** student objects, each with `name`, `score`, and `attendance` (a percentage)
- [ ] `const` everywhere it belongs; `let` **only** for values that actually change
- [ ] `===` and `!==` throughout — **no `==` anywhere in the file**
- [ ] Loop with `for...of`
- [ ] Give each student a letter grade using your five-band logic from Task 3
- [ ] Mark a student `"At risk"` when the score is below `60` **or** attendance is below `70`
- [ ] Skip (`continue`) any student whose score is not a valid number — include one broken record in your data on purpose
- [ ] Print one aligned line per student: name, score, attendance, letter, status

### 5.2 — The Summary Block

After the loop, print:

- [ ] How many students in **each** of the five bands
- [ ] The class **average**, to one decimal place
- [ ] The **highest** and **lowest** scoring student **by name** — found with a loop, not `Math.max`
- [ ] How many students are **at risk**
- [ ] How many records were **skipped** as invalid

### 5.3 — Make It Readable

- [ ] Use template literals — no `+` string concatenation
- [ ] Use `padEnd` or `padStart` so the columns line up
- [ ] Add a header row and a separator line

**✅ Deliverable:** `report-card.js` + screenshot of the output.

---

## Task 6 — The Browser Side

Same four concepts, different environment. Create `index.html` and `app.js`.

- [ ] An input where the user types a score, and a **Check** button
- [ ] On click, convert the input with `Number()` — do not rely on coercion
- [ ] If the input is empty or not a number, show `"Please enter a number between 0 and 100"` and stop
- [ ] Reject values above `100` or below `0` with the same message
- [ ] Show the letter grade using your five-band conditional
- [ ] Keep a running list: every checked score appends to a `<ul>` on the page, built with a loop
- [ ] A **Clear** button that empties the list and the array
- [ ] Log the full history array to the console on every check
- [ ] Runs through **Live Server**

- [ ] Screenshot the page with at least 4 scores checked and DevTools console open.

> **The point of this task:** `report-card.js` cannot touch the DOM, and `app.js` cannot touch the file system. The `if/else` inside them is character-for-character identical. Be ready to say why in one sentence.

**✅ Deliverable:** `index.html` + `app.js` pushed + 1 screenshot.

---

## Task 7 — Notes and Repository

### 7.1 — Repo Structure

- [ ] Add a `day-02/` folder to your `javascript-everywhere` repo:

```
javascript-everywhere/
├── README.md
├── day-01/
└── day-02/
    ├── NOTES.md
    ├── predictions.md
    ├── predictions.js
    ├── types.js
    ├── grade-engine.js
    ├── loops.js
    ├── report-card.js
    ├── index.html
    └── app.js
```

- [ ] Add a Day 02 row to your root `README.md` table of contents

### 7.2 — `day-02/NOTES.md`

**In your own words** — not the README's words:

- [ ] The difference between `const` and `let`, and why `const` still lets you `push` into an array
- [ ] All 7 primitive types, one line each
- [ ] Why `typeof null` returns `"object"`, and how you check for `null` properly
- [ ] The 8 falsy values, written from memory
- [ ] The difference between `===` and `==`, with one example where `==` causes a real bug
- [ ] When you use `??` instead of `||`
- [ ] When you use each of the five loops — one sentence each
- [ ] The difference between `break` and `continue`
- [ ] **One bug you hit today**, the exact error message, and how you fixed it

> The bug section is not optional. If nothing broke, you copy-pasted.

### 7.3 — Five Separate Commits

- [ ] Commit 1 — `predictions.md` + `predictions.js`
- [ ] Commit 2 — `types.js`
- [ ] Commit 3 — `grade-engine.js` + `loops.js`
- [ ] Commit 4 — `report-card.js`
- [ ] Commit 5 — browser files + `NOTES.md`

Real commit messages. `update` is not a message.

- [ ] Run `git log --oneline` and screenshot it.

**✅ Deliverable:** repo link + `git log` screenshot.

---

## Task 8 — Share It

- [ ] Post on **LinkedIn** about completing Session 2
- [ ] Include the screenshot of your `report-card.js` output
- [ ] Include the link to your repo
- [ ] Say one concrete thing that surprised you — a coercion result, a `typeof` answer, a bug you fixed. Not "excited to continue my journey".

**✅ Deliverable:** the link to your post.

---

## Bonus (Optional)

- [ ] Rewrite `report-card.js` reading the data from `process.argv` instead of a hard-coded array
- [ ] Add a letter-grade **histogram** to the summary — one `*` per student, drawn with a loop
- [ ] Sort the students by score highest-to-lowest **without** using `.sort()` — write the loop yourself
- [ ] Add a weighted final score: `70%` exam + `30%` attendance, rounded to one decimal
- [ ] Write a `while` loop that finds the first score above the class average, then `break`s
- [ ] In the browser app, colour each list item green / orange / red by band, set from JS
- [ ] Print a multiplication table (1–9) with **nested** `for` loops, aligned in columns

---

## Submission Checklist

- [ ] **Task 1** — `predictions.md` with wrong answers explained + screenshot
- [ ] **Task 2** — `types.js` + screenshot
- [ ] **Task 3** — `grade-engine.js` + screenshot (+ fall-through screenshot in notes)
- [ ] **Task 4** — `loops.js` + screenshot
- [ ] **Task 5** — `report-card.js` + screenshot
- [ ] **Task 6** — `index.html` + `app.js` + screenshot with console open
- [ ] **Task 7** — repo link, correct structure, `NOTES.md`, 5 commits, `git log` screenshot
- [ ] **Task 8** — LinkedIn post link

Submit all links together before Session 3.

---

## How This Is Graded

| Level | What it looks like |
|---|---|
| ❌ **Incomplete** | Copy-pasted README code, no predictions written before running, one giant commit, or code you can't explain line by line |
| ✅ **Done** | All eight tasks, working code, `NOTES.md` in your own words, a real bug documented |
| 🔥 **10%** | Done + the bonus + `report-card.js` doing something beyond the spec + notes someone else could actually learn from |

---

## A Reminder

> **90%** study only — free, self-paced, no assignments turned in.
> **10%** study + assignments + more — I personally help this group get there.
>
> **If you show up for the 10%, I show up for you.**

Session 3 is **Functions & Arrow Functions, Scope and Hoisting** — where all of today's loose code gets a name and a box. Come with `report-card.js` running.

---

← Back to [Day 02 README](README.md)
