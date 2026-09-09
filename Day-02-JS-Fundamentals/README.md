# Day 02 — JS Fundamentals

**Track 1: JS/TS Foundations + Web Basics · Session 2 of 52 · 3 hours**

> Session 1 built the workshop. Today we pick up the tools.
> Variables, data types, operators, conditionals, loops — the four ideas every
> line of JavaScript you write for the next 25 weeks is made of.

**Why this session matters:** Session 3 is **Functions, Scope and Hoisting**. A function is a box you put *this* session's code inside. You cannot understand the box before you understand what goes in it.

---

## What You'll Have by the End

- [ ] `const`, `let`, and why `var` is gone
- [ ] Every data type JavaScript has — and how to tell them apart
- [ ] Type coercion: what JS does behind your back, and how to stop it
- [ ] Operators: arithmetic, comparison, logical, and the modern short ones
- [ ] Conditionals: `if` / `else if` / `else`, ternary, `switch`
- [ ] Loops: `for`, `for...of`, `for...in`, `while`, `do...while`
- [ ] `break` and `continue`
- [ ] A working program that uses all of it at once

---

## Part 1 — Concept (60 min)

### 1.1 Variables — Naming a Value

A variable is a name pointing at a value. JavaScript gives you three ways to make one, and you only need two.

```js
const courseName = "JavaScript Everywhere"; // never reassigned
let sessionNumber = 1;                      // will change
var oldStyle = "legacy";                    // do not write this
```

| Keyword | Reassign? | Redeclare? | Scope | Use it? |
|---|---|---|---|---|
| `const` | ❌ No | ❌ No | Block `{ }` | ✅ Default choice |
| `let` | ✅ Yes | ❌ No | Block `{ }` | ✅ When the value changes |
| `var` | ✅ Yes | ✅ Yes | Function | ❌ Never in new code |

**The rule:** start with `const`. If the value has to change, switch that one to `let`. If you find yourself typing `var`, you're writing 2014.

#### `const` protects the name, not the contents

This is the part that confuses everyone. `const` means *this name will always point at this same value*. For objects and arrays, "the same value" means the same box — not the same contents.

```js
const student = { name: "Sara" };
student.name = "Omar";   // ✅ allowed — same object, different contents
student.score = 90;      // ✅ allowed — adding to the same object

student = { name: "Lina" }; // ❌ TypeError — pointing the name somewhere new

const tracks = ["Web"];
tracks.push("Mobile");   // ✅ allowed
tracks = [];             // ❌ TypeError
```

#### Naming rules

```js
// ✅ Good — camelCase, says what it holds
const studentScore = 92;
const isActive = true;         // booleans read like a question
const MAX_ATTEMPTS = 3;        // true constants: SCREAMING_SNAKE

// ❌ Bad
const s = 92;                  // what is s?
const 2ndScore = 80;           // cannot start with a digit
const student-score = 92;      // hyphens are minus signs
```

---

### 1.2 Data Types — What Kinds of Values Exist

JavaScript has **7 primitives** and **1 object type**. That's the whole list.

```js
// --- Primitives ---
const name = "Mostafa";           // string
const age = 25;                   // number   (one type for 5 and 5.5)
const big = 9007199254740993n;    // bigint   (rare)
const isLearning = true;          // boolean
const notSet = null;              // null      — intentionally empty
let notAssigned;                  // undefined — declared, never given a value
const id = Symbol("id");          // symbol    (rare)

// --- Objects: everything else ---
const student = { name: "Sara", score: 92 };  // object
const tracks = ["Web", "Mobile"];             // array    — an object
const greet = function () {};                 // function — an object too
```

#### `typeof` — asking what something is

```js
console.log(typeof "hello");     // "string"
console.log(typeof 42);          // "number"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof {});          // "object"
console.log(typeof []);          // "object"    ← arrays are objects
console.log(typeof null);        // "object"    ← a famous 1995 bug, never fixed
console.log(typeof console.log); // "function"
```

To actually check for an array, `typeof` is useless — use this:

```js
Array.isArray([]);   // true
Array.isArray({});   // false
```

#### `null` vs `undefined`

| | Meaning | Who sets it |
|---|---|---|
| `undefined` | "No value was ever put here" | JavaScript |
| `null` | "Empty on purpose" | You |

```js
let score;                  // undefined — JS filled the gap
let selectedStudent = null; // null — you're saying "nobody selected yet"
```

---

### 1.3 Type Coercion — What JS Does Behind Your Back

JavaScript converts types automatically. This is the single biggest source of beginner bugs.

```js
console.log("5" + 3);   // "53"  ← + with a string means JOIN
console.log("5" - 3);   // 2     ← - has no string meaning, so JS converts
console.log("5" * "2"); // 10
console.log(true + 1);  // 2     ← true is 1, false is 0
console.log([] + {});   // "[object Object]"  ← don't ask
```

**Convert on purpose instead:**

```js
Number("42");       // 42
Number("hello");    // NaN  — "Not a Number", the result of failed math
String(42);         // "42"
Boolean(0);         // false
parseInt("42px");   // 42   — reads until it hits nonsense
parseFloat("3.14"); // 3.14
```

#### Truthy and falsy

Every value becomes `true` or `false` in a condition. Only **8** values are falsy — memorize these, everything else is truthy:

```
false   0   -0   0n   ""   null   undefined   NaN
```

```js
if ("0")  console.log("runs");   // ✅ a non-empty string is truthy
if ([])   console.log("runs");   // ✅ an empty array is truthy!
if ({})   console.log("runs");   // ✅ an empty object is truthy!
if ("")   console.log("never");  // ❌ empty string is falsy
```

> **The trap:** `[]` and `{}` are truthy even when empty. To check if an array is empty, check `arr.length === 0`.

---

### 1.4 Operators

#### Arithmetic

```js
10 + 3;   // 13
10 - 3;   // 7
10 * 3;   // 30
10 / 3;   // 3.3333333333333335
10 % 3;   // 1     ← remainder — use it to test even/odd
10 ** 3;  // 1000  ← power
```

`%` is worth knowing well:

```js
7 % 2 === 0;   // false → 7 is odd
8 % 2 === 0;   // true  → 8 is even
```

#### Assignment shortcuts

```js
let n = 10;
n += 5;  // 15   same as n = n + 5
n -= 3;  // 12
n *= 2;  // 24
n /= 4;  // 6
n++;     // 7    add one
n--;     // 6    subtract one
```

#### Comparison — always `===`

```js
5 === 5;    // true
5 === "5";  // false  ← different types, strict
5 ==  "5";  // true   ← == converts first. Bug factory.
5 !== "5";  // true   ← strict not-equal
7 > 5;      // true
7 >= 7;     // true
```

**Rule of thumb:** always `===` and `!==`. Never `==`. There is no exception you need yet.

#### Logical

```js
const age = 22;
const hasTicket = true;

age >= 18 && hasTicket;   // true  — AND: both must be true
age >= 65 || hasTicket;   // true  — OR:  at least one
!hasTicket;               // false — NOT: flips it
```

#### The two modern ones

```js
// ?? — nullish coalescing: fall back only on null/undefined
const score = 0;
console.log(score || 100);  // 100 ← wrong! 0 is falsy
console.log(score ?? 100);  // 0   ← right — 0 is a real value

// ?. — optional chaining: stop instead of crashing
const user = { profile: { city: "Cairo" } };
console.log(user.profile?.city); // "Cairo"
console.log(user.address?.city); // undefined — no crash
```

---

### 1.5 Conditionals

```js
const score = 85;

if (score >= 90) {
  console.log("Excellent");
} else if (score >= 70) {
  console.log("Good");
} else {
  console.log("Keep going");
}
```

> **Order matters.** If `score >= 70` came first, it would catch `95` too, and "Excellent" would never print. Check the narrowest condition first.

#### Ternary — an if/else that produces a value

```js
const status = score >= 70 ? "pass" : "fail";

// Fine to nest once. Never twice — use if/else instead.
const band = score >= 90 ? "A" : score >= 70 ? "B" : "C";
```

#### `switch` — one value, many exact cases

```js
const track = "mobile";

switch (track) {
  case "web":
    console.log("React");
    break;              // ← forget this and it falls into the next case
  case "mobile":
    console.log("React Native");
    break;
  case "desktop":
    console.log("Electron");
    break;
  default:
    console.log("Unknown track");
}
```

`switch` compares with `===`. Use it when you're matching one variable against a list of exact values; use `if / else if` for ranges.

---

### 1.6 Loops

#### `for` — when you need the index

```js
for (let i = 0; i < 5; i++) {
  console.log(i); // 0 1 2 3 4
}
```

Three parts, separated by `;` — **start**, **keep going while**, **after each pass**.

#### `for...of` — when you just need each item ✅ prefer this

```js
const tracks = ["Web", "Full-Stack", "Mobile"];

for (const track of tracks) {
  console.log(track);
}
```

#### `for...in` — the **keys** of an object

```js
const student = { name: "Sara", score: 92, city: "Cairo" };

for (const key in student) {
  console.log(`${key}: ${student[key]}`);
}
// name: Sara
// score: 92
// city: Cairo
```

> **Don't use `for...in` on arrays.** It gives you index *strings* (`"0"`, `"1"`) and can pick up extra properties. Arrays get `for...of`.

#### `while` — when you don't know the count up front

```js
let countdown = 3;
while (countdown > 0) {
  console.log(countdown);
  countdown--;         // ← forget this and the loop never ends
}
console.log("Go!");
```

#### `do...while` — runs at least once, then checks

```js
let attempts = 0;
do {
  attempts++;
} while (attempts < 3);
```

#### `break` and `continue`

```js
const scores = [80, 40, 85, 95, 70];

for (const s of scores) {
  if (s === 40) continue; // skip this one, keep looping
  if (s > 90) break;      // stop the loop entirely
  console.log(s);         // 80, 85
}
```

#### `forEach` — the array's own loop

```js
tracks.forEach((track, index) => {
  console.log(`${index + 1}. ${track}`);
});
```

> `forEach` cannot `break`. If you need to stop early, use `for...of`.

---

## Part 2 — Build (Follow Along, ~90 min)

Create a folder `day-02` and build these files as we go.

### Step 1 — `fundamentals.js`

Type out every block from Part 1. Run after each one:

```bash
node fundamentals.js
```

Don't wait until the end to run it. Run, read, fix, continue.

---

### Step 2 — `report.js` — Everything at Once

```js
// report.js — variables + types + operators + conditionals + loops
const courseName = "JavaScript Everywhere";
const passMark = 70;

const students = [
  { name: "Sara", score: 92 },
  { name: "Omar", score: 68 },
  { name: "Lina", score: 79 },
  { name: "Yusuf", score: 95 },
  { name: "Nour", score: 55 },
];

let excellent = 0;
let good = 0;
let needsWork = 0;
let total = 0;

console.log(`${courseName} — Session 2 Report`);
console.log("-".repeat(40));

for (const student of students) {
  total += student.score;

  let band;
  if (student.score >= 90) {
    band = "Excellent";
    excellent++;
  } else if (student.score >= passMark) {
    band = "Good";
    good++;
  } else {
    band = "Needs work";
    needsWork++;
  }

  const result = student.score >= passMark ? "PASS" : "FAIL";
  console.log(`${student.name.padEnd(8)} ${student.score}  ${result.padEnd(5)} ${band}`);
}

const average = total / students.length;

console.log("-".repeat(40));
console.log(`Average:    ${average.toFixed(1)}`);
console.log(`Excellent:  ${excellent}`);
console.log(`Good:       ${good}`);
console.log(`Needs work: ${needsWork}`);
```

Run it:

```bash
node report.js
```

Expected output:

```
JavaScript Everywhere — Session 2 Report
----------------------------------------
Sara     92  PASS  Excellent
Omar     68  FAIL  Needs work
Lina     79  PASS  Good
Yusuf    95  PASS  Excellent
Nour     55  FAIL  Needs work
----------------------------------------
Average:    77.8
Excellent:  2
Good:       1
Needs work: 2
```

---

### Step 3 — `index.html` + `app.js` — The Same Ideas in the Browser

Same concepts, different environment. `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JavaScript Everywhere — Day 02</title>
  </head>
  <body>
    <h1>Score Checker</h1>
    <input id="score" type="number" placeholder="Enter a score" />
    <button id="check">Check</button>
    <p id="result"></p>
    <ul id="list"></ul>

    <script src="app.js"></script>
  </body>
</html>
```

`app.js`:

```js
// app.js
const input = document.getElementById("score");
const button = document.getElementById("check");
const result = document.getElementById("result");
const list = document.getElementById("list");

const history = [];

button.addEventListener("click", () => {
  const score = Number(input.value); // string → number, on purpose

  if (input.value === "" || Number.isNaN(score)) {
    result.textContent = "Please enter a number.";
    return;
  }

  let band;
  if (score >= 90) {
    band = "Excellent";
  } else if (score >= 70) {
    band = "Good";
  } else {
    band = "Needs work";
  }

  result.textContent = `${score} → ${band}`;
  history.push({ score, band });

  list.innerHTML = "";
  for (const entry of history) {
    const li = document.createElement("li");
    li.textContent = `${entry.score} — ${entry.band}`;
    list.appendChild(li);
  }
});
```

Right-click `index.html` → **Open with Live Server**.

> **Notice:** `input.value` is always a **string**, even from `type="number"`. Without `Number()`, `"90" >= 90` still works by coercion — but `"9" + 1` gives `"91"`. Convert at the edge, every time.

---

## Part 3 — The Cheat Sheet

| Idea | Write this | Not this |
|---|---|---|
| Declaring | `const`, then `let` | `var` |
| Comparing | `===`, `!==` | `==`, `!=` |
| Looping an array | `for...of` | `for...in` |
| Looping object keys | `for...in` | `for...of` |
| Default value | `??` | `\|\|` (breaks on `0` and `""`) |
| Empty array check | `arr.length === 0` | `if (!arr)` |
| Array check | `Array.isArray(x)` | `typeof x === "object"` |
| String → number | `Number(x)` | relying on coercion |

### The 8 Falsy Values

```
false   0   -0   0n   ""   null   undefined   NaN
```

Everything else — including `[]`, `{}`, `"0"`, and `"false"` — is truthy.

---

## Common Mistakes

| Mistake | What happens | Fix |
|---|---|---|
| `=` instead of `===` in an `if` | Assigns instead of compares; branch always runs | `if (x === 5)` |
| Forgetting `break` in `switch` | Falls through into the next case | Add `break` to every case |
| `while` without changing the condition | Infinite loop — terminal freezes | `Ctrl+C`, then update the variable inside |
| `i <= arr.length` in a `for` | Last pass is `undefined` | `i < arr.length` |
| `"5" + 3` expecting `8` | Gets `"53"` | `Number("5") + 3` |
| Reassigning a `const` | `TypeError` | Use `let` — or don't reassign |
| Widest `if` condition first | Later branches never run | Narrowest first |
| `for...in` over an array | Index strings, not values | `for...of` |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `ReferenceError: x is not defined` | Typo in the name, or you used it before declaring it. |
| `TypeError: Assignment to constant variable` | You reassigned a `const`. Change it to `let`, or stop reassigning. |
| Terminal frozen after `node file.js` | Infinite loop. Press `Ctrl+C` and check that your `while` condition can ever become false. |
| Output is `NaN` | Math on something that isn't a number. Log the value and its `typeof` right before the math. |
| `undefined` printed at the end in the browser console | Normal — the console shows the return value of the last expression. Not an error. |
| Numbers concatenate instead of adding | One of them is a string. Wrap it in `Number()`. |

---

## Before the Next Session

Session 3 is **Functions & Arrow Functions, Scope and Hoisting**. Everything you wrote today lives loose in a file. Next session we put it in boxes with names, and learn exactly which parts of your code can see which variables.

Come having finished [ASSIGNMENT.md](ASSIGNMENT.md). If `report.js` doesn't run, ask **before** Session 3.

### A Taste of Session 3

Type these out — we cover every line next session.

```js
// A function declaration
function greet(name) {
  return `Hello, ${name}!`;
}

// The same thing as an arrow function
const greetArrow = (name) => `Hello, ${name}!`;

console.log(greet("Sara"));
console.log(greetArrow("Omar"));

// A default parameter
function band(score = 0) {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  return "Needs work";
}

console.log(band(95)); // "Excellent"
console.log(band());   // "Needs work" — no argument, default used

// Scope: a block keeps its own variables
let outer = "visible everywhere";
{
  let inner = "only inside these braces";
  console.log(outer); // ✅ works
}
// console.log(inner); // ❌ ReferenceError
```

Notice `band()` replaced the whole if/else chain you wrote today with one reusable name. That is the point of Session 3.

---

## Day 02 Files

- [README.md](README.md) — this guide
- [ASSIGNMENT.md](ASSIGNMENT.md) — Day 02 assignment

← Back to [Day 01 — Setup](../Day-01-Setup/README.md)
