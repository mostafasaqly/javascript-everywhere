# Day 03 — Functions, Scope & Hoisting

**Track 1: JS/TS Foundations + Web Basics · Session 3 of 52 · 3 hours**

> Session 2 gave you the raw material — values, conditions, loops.
> Today we put it in a box, give the box a name, and hand that name around.
> That box is a **function**, and everything you build for the next 25 weeks is made of them.

**Why this session matters:** Session 4 is **ES6+ — Destructuring, Spread/Rest, Default Params**. Every one of those features exists to make passing data *into* and *out of* functions less painful. You need the function first.

---

## What You'll Have by the End

- [ ] Why functions exist — the copy-paste you'll never write again
- [ ] Declarations, expressions, and arrow functions — and when each one wins
- [ ] Parameters vs arguments, defaults, and `...rest`
- [ ] `return` — including the `undefined` you didn't mean to return
- [ ] Scope: global, function, block — and the scope chain
- [ ] Hoisting: what actually moves to the top, and what only *looks* like it does
- [ ] The Temporal Dead Zone, without the scary name
- [ ] Closures — a function that remembers
- [ ] Callbacks — a function handed to another function
- [ ] Your Day 02 report card, rewritten as pure functions

---

## Part 1 — Concept (65 min)

### 1.1 Why Functions Exist

Here is Day 02's grade logic. It works:

```js
let band;
if (score >= 90) band = "A";
else if (score >= 80) band = "B";
else band = "C";
```

Now you need it in three places. You copy it three times. Then the pass mark changes from 80 to 75, and you fix it in two of the three places. That third one is now a bug that will survive for months.

A function is the fix:

```js
function letterGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  return "C";
}

letterGrade(95); // "A"
letterGrade(85); // "B"
```

**One definition. Many uses. One place to fix.** That is the entire pitch.

---

### 1.2 The Anatomy of a Function

```js
function letterGrade(score) {
//       ^name      ^parameter
  return score >= 90 ? "A" : "B";
//^ return sends a value back out
}

const result = letterGrade(95);
//                         ^argument — the real value you pass in
```

| Term | What it means |
|---|---|
| **Parameter** | The name in the definition — a placeholder |
| **Argument** | The actual value you pass at call time |
| **Return** | The value the function hands back |
| **Call / invoke** | Running it — the `()` does this |

> `letterGrade` is the function. `letterGrade()` is the *result* of running it. Forgetting the `()` is the most common beginner bug in this session — you get the function itself instead of its answer.

---

### 1.3 Three Ways to Write One

#### Declaration

```js
function greet(name) {
  return `Hello, ${name}!`;
}
```

Hoisted — usable **before** the line that defines it. More on that in 1.7.

#### Expression

```js
const greet = function (name) {
  return `Hello, ${name}!`;
};
```

A function stored in a variable. **Not** usable before its line.

#### Arrow function ✅ your default for short ones

```js
const greet = (name) => {
  return `Hello, ${name}!`;
};

// One expression? Drop the braces and the `return` — it's implicit:
const greetShort = (name) => `Hello, ${name}!`;

// One parameter? The parentheses are optional (keep them — be consistent):
const double = n => n * 2;

// No parameters? Empty parens are required:
const now = () => new Date();

// Returning an object literal? Wrap it in parentheses or JS reads `{` as a body:
const toStudent = (name) => ({ name, score: 0 });
```

| | Declaration | Expression | Arrow |
|---|---|---|---|
| Hoisted | ✅ Fully | ❌ No | ❌ No |
| Has its own `this` | ✅ Yes | ✅ Yes | ❌ No — inherits |
| Implicit return | ❌ No | ❌ No | ✅ Single expression |
| Best for | Top-level named logic | Rare — use arrow | Callbacks, short helpers |

> **`this` is Session 3's cliff-hanger.** Arrow functions don't have their own `this` — they borrow the surrounding one. That difference matters enormously in React (Track 2). For today, know that the difference exists.

---

### 1.4 Parameters — Defaults and Rest

#### Default parameters

```js
function band(score = 0) {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  return "Needs work";
}

band(95); // "Excellent"
band();   // "Needs work" — no argument, so score = 0
```

The default fires only for `undefined` — **not** for `null`, `0`, or `""`:

```js
function greet(name = "guest") {
  return `Hi, ${name}`;
}

greet();          // "Hi, guest"      — undefined → default
greet(undefined); // "Hi, guest"      — same thing
greet(null);      // "Hi, null"       — null is a real value!
greet("");        // "Hi, "           — so is an empty string
```

> Same lesson as `??` from Day 02: `undefined` means "absent", `null` means "deliberately empty".

#### Too few, too many

JavaScript never complains about the count:

```js
function add(a, b) {
  return a + b;
}

add(1, 2, 3); // 3   — the 3 is silently ignored
add(1);       // NaN — b is undefined, and 1 + undefined is NaN
```

#### `...rest` — collect the leftovers

```js
function sumAll(...numbers) {    // numbers is a real array
  let total = 0;
  for (const n of numbers) total += n;
  return total;
}

sumAll(1, 2, 3);        // 6
sumAll(10, 20, 30, 40); // 100
sumAll();               // 0

// Rest must come last, and there can only be one:
function report(title, ...scores) { /* ... */ }
```

---

### 1.5 `return` — The Way Out

```js
function checkScore(score) {
  if (score < 0) return "Invalid";  // exits here — nothing below runs
  if (score >= 70) return "Pass";
  return "Fail";
}
```

`return` does two things at once: **sends a value back** and **stops the function immediately**.

#### The three mistakes

```js
// 1 — No return at all
function addBad(a, b) {
  a + b;               // computed, then thrown away
}
addBad(2, 3);          // undefined

// 2 — Logging instead of returning
function addWorse(a, b) {
  console.log(a + b);  // prints 5, returns undefined
}
const x = addWorse(2, 3) * 2;  // NaN

// 3 — A newline after `return`
function addWorst(a, b) {
  return               // ← JS inserts a semicolon HERE
    a + b;             // unreachable
}
addWorst(2, 3);        // undefined
```

> **Print or return, know which you want.** `console.log` shows a human. `return` hands a value to the rest of your program. A function that only logs cannot be reused.

#### Guard clauses

Return early for the bad cases, and the happy path stays flat:

```js
// ❌ Nested — hard to read
function grade(score) {
  if (typeof score === "number") {
    if (score >= 0 && score <= 100) {
      return score >= 70 ? "Pass" : "Fail";
    } else {
      return "Out of range";
    }
  } else {
    return "Not a number";
  }
}

// ✅ Guards first — flat and obvious
function gradeBetter(score) {
  if (typeof score !== "number") return "Not a number";
  if (Number.isNaN(score)) return "Not a number";
  if (score < 0 || score > 100) return "Out of range";
  return score >= 70 ? "Pass" : "Fail";
}
```

---

### 1.6 Scope — Who Can See What

**Scope** is the answer to one question: *from this line, which variables exist?*

```js
const courseName = "JS Everywhere";   // 🌍 global — everywhere

function showSession() {
  const session = 3;                  // 📦 function scope — inside here only
  console.log(courseName);            // ✅ can see outward
  console.log(session);               // ✅ its own
}

console.log(session); // ❌ ReferenceError: session is not defined
```

#### Block scope

`let` and `const` are trapped by **any** `{ }`. `var` is not — one more reason it's gone:

```js
if (true) {
  let blockLet = "trapped";
  var blockVar = "escapes";
}
console.log(blockVar); // "escapes"  ← var leaks out of the block
console.log(blockLet); // ❌ ReferenceError

for (let i = 0; i < 3; i++) { /* ... */ }
console.log(i);        // ❌ ReferenceError — and that's good
```

#### The scope chain

An inner scope reads outward, never inward:

```js
const level1 = "global";

function outer() {
  const level2 = "outer";

  function inner() {
    const level3 = "inner";
    console.log(level1, level2, level3); // ✅ all three
  }

  inner();
  console.log(level3); // ❌ ReferenceError — can't see inward
}
```

JavaScript looks in the current scope, then the one containing it, then the one containing *that*, up to global. First match wins; nothing found is a `ReferenceError`.

#### Shadowing

An inner name hides an outer one of the same name:

```js
const status = "global";

function check() {
  const status = "local";   // shadows the outer one
  console.log(status);      // "local"
}

check();
console.log(status);        // "global" — untouched
```

> **The rule that saves you:** declare variables in the smallest scope that works. A variable everyone can see is a variable anyone can break.

---

### 1.7 Hoisting — What Moves to the Top

Before running your code, JavaScript scans it and registers every declaration. That scan is **hoisting**. What gets registered differs by keyword — and this is where the confusion lives.

#### Function declarations — fully hoisted ✅

```js
sayHi();   // ✅ "Hi!" — works before the definition

function sayHi() {
  console.log("Hi!");
}
```

The whole function is available from the first line of its scope.

#### `var` — hoisted, but empty

```js
console.log(score); // undefined — NOT an error
var score = 90;
console.log(score); // 90
```

JavaScript treats it as: `var score;` at the top, `score = 90` where you wrote it. The name exists; the value doesn't yet. That `undefined` is exactly the kind of silent weirdness `let` was invented to stop.

#### `let` and `const` — hoisted into the Temporal Dead Zone ❌

```js
console.log(score); // ❌ ReferenceError: Cannot access 'score' before initialization
let score = 90;
```

The name *is* registered — that's why the message says "cannot access" and not "is not defined". But it's unusable from the top of the block until the line that initializes it. That gap is the **Temporal Dead Zone (TDZ)**.

> **TDZ is a feature.** It converts a silent `undefined` bug into a loud error at the exact line you made the mistake.

#### Function expressions and arrows — the variable rule applies

```js
sayHi();  // ❌ ReferenceError — TDZ, it's a const
const sayHi = () => console.log("Hi!");

sayHello(); // ❌ TypeError: sayHello is not a function
var sayHello = function () { console.log("Hello!"); };
// ↑ var hoisted as undefined, and undefined() is a TypeError
```

#### The summary table

| Declaration | Hoisted? | Usable before its line? | Error if you try |
|---|---|---|---|
| `function foo() {}` | ✅ Name + body | ✅ Yes | — |
| `var x` | ✅ Name only | ⚠️ Yes, as `undefined` | Silent bug |
| `let x` / `const x` | ✅ Name only (TDZ) | ❌ No | `ReferenceError` |
| `const f = () => {}` | ✅ Name only (TDZ) | ❌ No | `ReferenceError` |

> **The practical rule:** define things before you use them, and hoisting stops being something you have to think about. Learn it so you can read other people's code — not so you can rely on it.

---

### 1.8 Closures — A Function That Remembers

When a function is created inside another function, it keeps access to the outer variables **even after the outer function has finished**. That is a **closure**.

```js
function makeCounter() {
  let count = 0;                 // lives on, because inner uses it

  return function () {
    count++;
    return count;
  };
}

const next = makeCounter();
next(); // 1
next(); // 2
next(); // 3

const other = makeCounter();
other(); // 1 — its own separate count
```

`makeCounter()` returned long ago, but `count` survives because the returned function still needs it. And each call to `makeCounter()` creates a **fresh** `count` — that's why `other` starts over.

A practical use — a function that builds functions:

```js
function makeGrader(passMark) {
  return (score) => (score >= passMark ? "Pass" : "Fail");
}

const strict = makeGrader(85);
const lenient = makeGrader(60);

strict(80);  // "Fail"
lenient(80); // "Pass"
```

> Closures power React hooks, event handlers, and every "private variable" pattern in JS. You'll meet them constantly. Today you only need: *the inner function remembers where it was born*.

---

### 1.9 Callbacks — Passing a Function as a Value

Functions are values. You can store one in a variable, put one in an array, and — most usefully — **pass one to another function**:

```js
function applyToAll(numbers, action) {
  const output = [];
  for (const n of numbers) {
    output.push(action(n));   // call whatever was handed in
  }
  return output;
}

applyToAll([1, 2, 3], (n) => n * 2);   // [2, 4, 6]
applyToAll([1, 2, 3], (n) => n + 10);  // [11, 12, 13]
```

You already used callbacks in Day 02 without naming them:

```js
tracks.forEach((track) => console.log(track));   // the arrow is a callback
button.addEventListener("click", () => { });     // so is this one
```

> **Pass the function, don't call it.** `addEventListener("click", handleClick)` hands the function over. `addEventListener("click", handleClick())` runs it *now* and hands over its return value — a classic bug.

---

## Part 2 — Build (Follow Along, ~85 min)

Create a folder `day-03` and build these as we go.

### Step 1 — `functions.js`

Type out every block from Part 1. Run after each one:

```bash
node functions.js
```

Run, read, fix, continue. Don't wait until the end.

---

### Step 2 — `grade-lib.js` — Day 02, Rewritten as Functions

The same logic you wrote loose in Day 02 — now each idea has a name.

```js
// grade-lib.js — one job per function

function isValidScore(score) {
  if (typeof score !== "number") return false;
  if (Number.isNaN(score)) return false;
  return score >= 0 && score <= 100;
}

function letterGrade(score) {
  if (!isValidScore(score)) return "?";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

const isPassing = (score, passMark = 60) => score >= passMark;

function average(numbers) {
  if (numbers.length === 0) return 0;      // guard: never divide by zero
  let total = 0;
  for (const n of numbers) total += n;
  return total / numbers.length;
}

function highest(students) {
  if (students.length === 0) return null;
  let best = students[0];
  for (const student of students) {
    if (student.score > best.score) best = student;
  }
  return best;
}

function formatRow(student) {
  const name = student.name.padEnd(8);
  const score = String(student.score).padStart(3);
  const result = isPassing(student.score) ? "PASS" : "FAIL";
  return `${name} ${score}  ${letterGrade(student.score)}     ${result}`;
}

// --- Use them ---
const students = [
  { name: "Sara", score: 92 },
  { name: "Omar", score: 68 },
  { name: "Lina", score: 79 },
  { name: "Yusuf", score: 95 },
  { name: "Nour", score: 55 },
];

console.log("Name     Score Grade Result");
console.log("-".repeat(32));

for (const student of students) {
  console.log(formatRow(student));
}

const scores = [];
for (const student of students) scores.push(student.score);

console.log("-".repeat(32));
console.log(`Average: ${average(scores).toFixed(1)}`);
console.log(`Top:     ${highest(students).name}`);
```

```bash
node grade-lib.js
```

Expected output:

```
Name     Score Grade Result
--------------------------------
Sara      92  A     PASS
Omar      68  D     PASS
Lina      79  C     PASS
Yusuf     95  A     PASS
Nour      55  F     FAIL
--------------------------------
Average: 77.8
Top:     Yusuf
```

> **Look at what changed.** Day 02's version was one long block you had to read top to bottom. This one is six small functions, each doing one thing, each testable on its own. Same output — completely different to maintain.

---

### Step 3 — `closures.js` — Functions That Remember

```js
// closures.js
function makeIdGenerator(prefix) {
  let count = 0;
  return () => {
    count++;
    return `${prefix}-${count}`;
  };
}

const studentId = makeIdGenerator("STU");
const courseId = makeIdGenerator("CRS");

console.log(studentId()); // STU-1
console.log(studentId()); // STU-2
console.log(courseId());  // CRS-1  ← its own counter
console.log(studentId()); // STU-3

// A grader factory
const makeGrader = (passMark) => (score) =>
  score >= passMark ? "Pass" : "Fail";

const finalExam = makeGrader(70);
const quiz = makeGrader(50);

console.log(finalExam(65)); // Fail
console.log(quiz(65));      // Pass
```

```bash
node closures.js
```

---

### Step 4 — `index.html` + `app.js` — Functions in the Browser

`index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JavaScript Everywhere — Day 03</title>
  </head>
  <body>
    <h1>Grade Calculator</h1>
    <input id="name" type="text" placeholder="Student name" />
    <input id="score" type="number" placeholder="Score 0-100" />
    <button id="add">Add</button>
    <button id="clear">Clear</button>
    <p id="message"></p>
    <ul id="list"></ul>
    <p id="summary"></p>

    <script src="app.js"></script>
  </body>
</html>
```

`app.js`:

```js
// app.js — the SAME functions, a different environment

// --- Pure logic: no DOM in here at all ---
const isValidScore = (score) =>
  typeof score === "number" && !Number.isNaN(score) && score >= 0 && score <= 100;

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

// --- DOM: reads the page, writes to the page ---
const nameInput = document.getElementById("name");
const scoreInput = document.getElementById("score");
const message = document.getElementById("message");
const list = document.getElementById("list");
const summary = document.getElementById("summary");

const students = [];

function showError(text) {
  message.textContent = text;
}

function render() {
  list.innerHTML = "";
  for (const student of students) {
    const li = document.createElement("li");
    li.textContent = `${student.name} — ${student.score} (${letterGrade(student.score)})`;
    list.appendChild(li);
  }

  const scores = [];
  for (const student of students) scores.push(student.score);

  summary.textContent =
    students.length === 0
      ? ""
      : `${students.length} students · average ${average(scores).toFixed(1)}`;
}

function handleAdd() {
  const name = nameInput.value.trim();
  const score = Number(scoreInput.value);

  if (name === "") return showError("Please enter a name.");
  if (scoreInput.value === "" || !isValidScore(score)) {
    return showError("Please enter a score between 0 and 100.");
  }

  students.push({ name, score });
  message.textContent = "";
  nameInput.value = "";
  scoreInput.value = "";
  render();
}

function handleClear() {
  students.length = 0;
  message.textContent = "";
  render();
}

document.getElementById("add").addEventListener("click", handleAdd);
document.getElementById("clear").addEventListener("click", handleClear);
```

Right-click `index.html` → **Open with Live Server**.

> **Notice the split.** The top half is pure logic — give it a number, get an answer, no page required. The bottom half touches the DOM. `letterGrade` is character-for-character identical to the one in `grade-lib.js`. That separation is what makes code testable, and it's the shape of every real app you'll write.

---

## Part 3 — The Cheat Sheet

| Idea | Write this | Not this |
|---|---|---|
| Short helper / callback | `const f = (x) => x * 2` | a `function` expression |
| Top-level named logic | `function calculate() {}` | — |
| Missing-value fallback | `function f(x = 0) {}` | `x = x \|\| 0` |
| Variable number of args | `function f(...items) {}` | `arguments` |
| Early exit | Guard clause at the top | Deep `if / else` nesting |
| Getting a value out | `return value` | `console.log(value)` |
| Passing a callback | `on("click", handler)` | `on("click", handler())` |
| Declaring | Smallest scope that works | Global for everything |

### The Hoisting One-Liner

```
function declarations: name + body   ->  usable early
var:                   name only     ->  undefined (silent bug)
let / const / arrow:   name only     ->  ReferenceError (TDZ)
```

### Arrow Function Shapes

```js
() => value              // no params, implicit return
(x) => x * 2             // one param
(x, y) => x + y          // two params
(x) => ({ value: x })    // returning an object — parens required
(x) => {                 // braces = a body, `return` is now required
  const y = x * 2;
  return y;
}
```

---

## Common Mistakes

| Mistake | What happens | Fix |
|---|---|---|
| Forgetting `()` when calling | Logs `[Function: f]` instead of the result | `f()` |
| `console.log` instead of `return` | Returns `undefined`; the value can't be reused | `return` it |
| Newline right after `return` | Semicolon inserted; returns `undefined` | Keep the value on the same line |
| `return` inside a loop too early | Exits the whole function, not just the loop | Use `break`, or collect then return |
| Arrow with `{ }` and no `return` | Returns `undefined` | Add `return`, or drop the braces |
| Arrow returning an object without parens | Braces read as a body — `undefined` | `(x) => ({ ... })` |
| Using a `const` function above its line | `ReferenceError` — TDZ | Define it before the call |
| `addEventListener("click", fn())` | Runs immediately, passes its result | Pass `fn` without `()` |
| Declaring everything global | Names collide and overwrite silently | Declare in the smallest scope |
| Expecting a default to fire for `null` | Defaults fire only on `undefined` | Validate explicitly, or use `??` |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `ReferenceError: Cannot access 'x' before initialization` | TDZ — you used a `let`/`const` above its declaration. Move the declaration up. |
| `ReferenceError: x is not defined` | Wrong scope (declared inside a block or function) or a typo in the name. |
| `TypeError: x is not a function` | You called something that isn't one — a `var` function expression used too early, or a typo. |
| Function prints the right thing but `const r = f()` is `undefined` | You logged instead of returning. |
| `NaN` coming out of a function | An argument was missing or was a string. Log `typeof` for each parameter on line 1. |
| The loop variable is wrong inside a callback | Almost always `var` in the loop. Use `let`. |
| Handler fires on page load instead of on click | You passed `fn()` instead of `fn`. |
| Counter resets on every call | You created the closure inside the handler. Create it once, outside. |

---

## Before the Next Session

Session 4 is **ES6+ — Destructuring, Spread/Rest, Template Literals, Default Params**. Today you passed whole objects into functions and dug values out with dots. Next session you pull them apart on the parameter line itself.

Come having finished [ASSIGNMENT.md](ASSIGNMENT.md). If `grade-lib.js` doesn't run, ask **before** Session 4.

### A Taste of Session 4

Type these out — we cover every line next session.

```js
const student = { name: "Sara", score: 92, city: "Cairo" };

// Destructuring — pull properties out by name
const { name, score } = student;
console.log(name, score); // Sara 92

// Straight on the parameter line
function describe({ name, score }) {
  return `${name} scored ${score}`;
}
console.log(describe(student));

// Arrays destructure by position
const [first, second] = ["Web", "Mobile", "Desktop"];
console.log(first, second); // Web Mobile

// Spread — copy and extend without mutating
const updated = { ...student, score: 95 };
console.log(student.score, updated.score); // 92 95

const tracks = ["Web", "Mobile"];
const allTracks = [...tracks, "Desktop"];
console.log(allTracks); // [ 'Web', 'Mobile', 'Desktop' ]
```

Notice `describe({ name, score })` — the function says exactly which fields it needs, right in its signature. That's Session 4's whole point.

---

## Day 03 Files

- [README.md](README.md) — this guide
- [ASSIGNMENT.md](ASSIGNMENT.md) — Day 03 assignment

← Back to [Day 02 — JS Fundamentals](../Day-02-JS-Fundamentals/README.md)
