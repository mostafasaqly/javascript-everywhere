# Day 04 — ES6+: Destructuring, Spread & Rest

**Track 1: JS/TS Foundations + Web Basics · Session 4 of 52 · 3 hours**

> Session 3 gave you the box: a function with a name, parameters, and a return.
> Today we make getting data *into* that box — and back *out* of it — stop hurting.
> Every feature in this session exists for one reason: **less ceremony, more meaning.**

**Why this session matters:** Session 5 is **Async JS — Callbacks and the Event Loop**. Async code is drowning in objects you have to unpack (`response`, `data`, `error`) and callbacks you have to pass around. Destructuring is how you read that code without going cross-eyed.

---

## What You'll Have by the End

- [ ] Template literals — and why you'll never concatenate with `+` again
- [ ] Object destructuring: rename, default, nest
- [ ] Array destructuring: position, skip, swap
- [ ] Destructuring right on the parameter line
- [ ] Spread `...` — copying and merging arrays and objects
- [ ] Rest `...` — the same three dots doing the opposite job
- [ ] Why "copy" means *shallow* copy, and when that bites
- [ ] Optional chaining `?.` and nullish coalescing `??` on real nested data
- [ ] Object shorthand, computed keys, and `Object.entries`
- [ ] Your Day 03 grade library, rewritten in modern JavaScript

---

## Part 1 — Concept (65 min)

### 1.1 Template Literals — Strings That Read Like Sentences

You've been using these since Day 02. Here's the full picture.

```js
const name = "Sara";
const score = 92;

// ❌ The old way — count the spaces, mind the pluses
const old = "Student " + name + " scored " + score + " (" + (score >= 60 ? "pass" : "fail") + ")";

// ✅ Backticks — the shape of the output is the shape of the code
const modern = `Student ${name} scored ${score} (${score >= 60 ? "pass" : "fail"})`;
```

Any expression fits inside `${ }` — a variable, a calculation, a ternary, a function call:

```js
const student = { name: "Omar", score: 68 };

console.log(`${student.name.toUpperCase()} — ${student.score}%`);  // OMAR — 68%
console.log(`Next year: ${student.score + 5}`);                    // Next year: 73
console.log(`Grade: ${letterGrade(student.score)}`);               // Grade: D
```

**Multi-line for free** — the line breaks are real:

```js
const report = `
Name:  ${student.name}
Score: ${student.score}
Band:  ${letterGrade(student.score)}
`;
```

> **One rule:** backtick `` ` ``, not quote. It's the key above Tab on most keyboards. Getting `${name}` printed literally means you used `"` or `'` — the most common Day 04 bug.

---

### 1.2 Object Destructuring — Pull Properties Out by Name

You have an object. You want three values out of it. The old way repeats the object name every single time:

```js
const student = { name: "Sara", score: 92, city: "Cairo", attendance: 88 };

// ❌ Repetitive
const name = student.name;
const score = student.score;
const city = student.city;

// ✅ Destructuring — one line, matched by name
const { name, score, city } = student;
console.log(name, score, city); // Sara 92 Cairo
```

The braces on the **left** of `=` are not an object. They're a pattern that says *"find these keys and make variables with the same names"*.

**Order does not matter** — it matches by name, not position:

```js
const { score, name } = student;  // works identically
```

#### Renaming

When the key name is taken, awkward, or just bad, rename with `:`

```js
const { name: studentName, score: finalScore } = student;

console.log(studentName); // Sara
console.log(name);        // ❌ ReferenceError — `name` was never created
```

> Read `name: studentName` as **"take `name`, call it `studentName`"**. It looks backwards the first ten times. It stops looking backwards after that.

#### Defaults

A default fires when the key is **missing or `undefined`**:

```js
const partial = { name: "Omar", score: 68 };

const { name, score, attendance = 0, city = "Unknown" } = partial;
console.log(attendance); // 0        — key was absent
console.log(city);       // Unknown  — key was absent
```

Same rule as Day 03's default parameters: `null` is a real value, so it wins over the default.

```js
const withNull = { name: "Lina", city: null };
const { city = "Unknown" } = withNull;
console.log(city); // null — NOT "Unknown"
```

#### Rename and default together

```js
const { city: hometown = "Unknown" } = partial;
console.log(hometown); // Unknown
```

#### Nested destructuring

```js
const enrolment = {
  student: { name: "Yusuf", score: 95 },
  course: { title: "JS Everywhere", track: 1 },
};

const {
  student: { name, score },
  course: { title },
} = enrolment;

console.log(name, score, title); // Yusuf 95 JS Everywhere
console.log(student);            // ❌ ReferenceError
```

> **The trap:** `student: { name }` does **not** create a `student` variable. It's a path you're travelling through, not a stop. If you want both, ask for both: `const { student, student: { name } } = enrolment;`

#### Rest in objects — "and everything else"

```js
const { name, ...rest } = student;
console.log(name); // Sara
console.log(rest); // { score: 92, city: 'Cairo', attendance: 88 }
```

Extremely useful for **removing a key** without mutating the original:

```js
const { attendance, ...withoutAttendance } = student;
// withoutAttendance is a new object with everything except attendance
```

---

### 1.3 Array Destructuring — Pull Values Out by Position

Arrays have no keys, so the pattern matches **position**. Square brackets, and the names are yours to choose:

```js
const tracks = ["Web", "Mobile", "Desktop", "Backend"];

const [first, second] = tracks;
console.log(first, second); // Web Mobile
```

#### Skipping with commas

```js
const [, , third] = tracks;
console.log(third); // Desktop
```

Each empty slot skips one position. Add a comment when you do this — it's easy to miscount.

#### Defaults

```js
const [a, b, c = "None"] = ["Web", "Mobile"];
console.log(c); // None — position 2 doesn't exist
```

#### Rest in arrays

```js
const [head, ...tail] = tracks;
console.log(head); // Web
console.log(tail); // [ 'Mobile', 'Desktop', 'Backend' ]  ← a real array
```

#### The swap

No temporary variable, no ceremony:

```js
let a = 1;
let b = 2;

[a, b] = [b, a];
console.log(a, b); // 2 1
```

#### Destructuring what a function returns

A function can only return one value — so return an array or an object and unpack it:

```js
function minMax(numbers) {
  let min = numbers[0];
  let max = numbers[0];
  for (const n of numbers) {
    if (n < min) min = n;
    if (n > max) max = n;
  }
  return [min, max];
}

const [lowest, highest] = minMax([92, 68, 79, 95, 55]);
console.log(lowest, highest); // 55 95
```

> **Array vs object return:** two or three values with an obvious order → array. More than that, or an order nobody will remember → object, so the caller reads by name.

#### Destructuring in a loop

This is where it starts paying rent:

```js
const students = [
  { name: "Sara", score: 92 },
  { name: "Omar", score: 68 },
];

for (const { name, score } of students) {
  console.log(`${name}: ${score}`);
}
```

And with `Object.entries`, which hands you `[key, value]` pairs:

```js
const counts = { A: 2, B: 1, C: 0, D: 1, F: 1 };

for (const [grade, count] of Object.entries(counts)) {
  console.log(`${grade}: ${"█".repeat(count)}`);
}
```

---

### 1.4 Destructuring on the Parameter Line

This is the one that changes how your functions read.

```js
// ❌ The caller can't see what this needs, and the body repeats `student` six times
function describe(student) {
  return `${student.name} scored ${student.score} in ${student.city}`;
}

// ✅ The signature IS the documentation
function describeBetter({ name, score, city }) {
  return `${name} scored ${score} in ${city}`;
}

describeBetter({ name: "Sara", score: 92, city: "Cairo" });
```

Anyone reading line 1 knows exactly which three fields this function touches.

**With defaults**, so missing fields don't explode:

```js
function summarise({ name, score = 0, attendance = 0, passMark = 60 }) {
  const result = score >= passMark ? "PASS" : "FAIL";
  return `${name}: ${score} / ${attendance}% — ${result}`;
}

summarise({ name: "Nour", score: 55 }); // Nour: 55 / 0% — FAIL
```

**The whole-object default** — calling with no argument at all:

```js
function greet({ name = "guest" } = {}) {
  return `Hi, ${name}`;
}

greet();                    // "Hi, guest"     ← the `= {}` saves you
greet({ name: "Sara" });    // "Hi, Sara"
```

Without that `= {}`, `greet()` tries to destructure `undefined` and throws `TypeError: Cannot destructure property 'name' of 'undefined'`. Read that error carefully today — you will meet it again.

> **Named arguments, effectively.** `createUser({ name, email, isAdmin: true })` at the call site beats `createUser("Sara", "s@x.com", true, false, null)` every time. You can't misorder what you have to name.

---

### 1.5 Spread — The Same Three Dots, Unpacking

**Rest** collects many into one. **Spread** takes one and scatters it out. Identical syntax; the position tells you which is which.

#### Arrays

```js
const web = ["HTML", "CSS", "JS"];
const backend = ["Node", "SQL"];

const all = [...web, ...backend];        // [ 'HTML', 'CSS', 'JS', 'Node', 'SQL' ]
const withExtra = [...web, "React"];     // adds without touching `web`
const copy = [...web];                   // a real copy, not a second name
```

Why the copy matters:

```js
const original = ["HTML", "CSS"];
const alias = original;      // ❌ same array, two names
const clone = [...original]; // ✅ a new array

alias.push("JS");
console.log(original); // [ 'HTML', 'CSS', 'JS' ]  ← mutated!

clone.push("TS");
console.log(original); // unchanged by clone
```

#### Objects

```js
const student = { name: "Sara", score: 92 };

const updated = { ...student, score: 95 };
console.log(student.score); // 92 — untouched
console.log(updated.score); // 95

const withId = { ...student, id: "STU-1" };       // add a field
const merged = { ...defaults, ...userSettings };  // merge, right wins
```

**Later keys overwrite earlier ones.** That's the whole merge rule, and the whole "override a default" pattern:

```js
const defaults = { passMark: 60, showAttendance: true };
const custom = { ...defaults, passMark: 85 };
// { passMark: 85, showAttendance: true }
```

> **Order is everything.** `{ ...defaults, ...overrides }` lets the caller win. `{ ...overrides, ...defaults }` silently ignores everything the caller asked for. Getting these backwards is a genuinely common bug.

#### Spread into function arguments

```js
function sum(a, b, c) {
  return a + b + c;
}

const numbers = [1, 2, 3];
console.log(sum(...numbers)); // 6 — spread into three separate arguments

console.log(Math.max(...[92, 68, 95]));  // 95 — Math.max takes arguments, not an array
```

#### ⚠️ Shallow copy — read this twice

Spread copies **one level deep**. Nested objects and arrays are still shared:

```js
const original = {
  name: "Sara",
  grades: { midterm: 90, final: 94 },
};

const copy = { ...original };

copy.name = "Omar";              // ✅ top level — independent
copy.grades.midterm = 0;         // ❌ nested — SHARED

console.log(original.name);            // Sara — safe
console.log(original.grades.midterm);  // 0 — the original was changed!
```

To copy a nested level, spread that level too:

```js
const deepish = {
  ...original,
  grades: { ...original.grades },
};
```

For genuinely deep structures, `structuredClone(original)` does the whole tree.

---

### 1.6 Rest vs Spread — Telling Them Apart

Same `...`. The rule is **which side of the `=` you're on**:

| Position | Job | Name | Example |
|---|---|---|---|
| Left of `=`, or in a parameter list | **Collects** many → one | Rest | `const [a, ...others] = arr` |
| Right of `=`, or in a call / literal | **Scatters** one → many | Spread | `const arr2 = [...arr]` |

```js
function f(first, ...others) {   // REST — collecting the leftovers
  return [first, ...others];     // SPREAD — scattering them into a new array
}
```

Rest is **always last** — `function f(...items, last)` is a syntax error, because "the rest" can't have anything after it.

---

### 1.7 Optional Chaining and Nullish Coalescing

Real data is missing fields. These two operators are how you survive that.

#### `?.` — stop instead of throwing

```js
const student = { name: "Sara", address: { city: "Cairo" } };
const other = { name: "Omar" };

console.log(student.address.city); // "Cairo"
console.log(other.address.city);   // ❌ TypeError: Cannot read properties of undefined

console.log(other.address?.city);  // ✅ undefined — no crash
```

`?.` checks the thing on its left: if it's `null` or `undefined`, the whole expression short-circuits to `undefined` instead of throwing.

Works on nested paths, array indexes, and method calls:

```js
data?.students?.[0]?.name
student.getGrade?.()        // only calls it if it exists
```

#### `??` — a default only for `null` / `undefined`

You met this on Day 02. Here's why it beats `||`:

```js
const score = 0;

console.log(score || 100); // 100 ← WRONG, 0 is falsy but it's a real score
console.log(score ?? 100); // 0   ← correct
```

Use `||` for "any falsy value", `??` for "genuinely absent". With scores, empty strings, and `false` flags, `??` is almost always the one you want.

#### The pair, together

```js
const city = student?.address?.city ?? "Unknown";
```

That single line replaces about six lines of nested `if` checks, and reads left to right in plain English: *look for the city, and if there isn't one, say Unknown*.

---

### 1.8 Object Shorthand and Computed Keys

#### Shorthand — when the key and the variable share a name

```js
const name = "Sara";
const score = 92;

const verbose = { name: name, score: score };  // ❌ noisy
const student = { name, score };               // ✅ identical result
```

You'll see this constantly. It's the same object.

#### Method shorthand

```js
const helper = {
  greet(name) {           // instead of  greet: function (name) {
    return `Hi, ${name}`;
  },
};
```

#### Computed keys — a key decided at runtime

```js
const field = "score";
const value = 92;

const record = { [field]: value };   // { score: 92 }
```

The brackets say *"evaluate this expression and use the result as the key"*. Without them you'd get a key literally called `"field"`.

A real use — counting by grade, building the keys as you go:

```js
function countByGrade(students) {
  const counts = {};
  for (const { score } of students) {
    const grade = letterGrade(score);
    counts[grade] = (counts[grade] ?? 0) + 1;
  }
  return counts;
}
```

---

## Part 2 — Build (Follow Along, ~85 min)

Create a folder `day-04` and build these as we go.

### Step 1 — `es6-basics.js`

Type out every block from Part 1. Run after each one:

```bash
node es6-basics.js
```

Run, read, fix, continue. Don't wait until the end.

---

### Step 2 — `grade-lib.js` — Day 03, Modernised

The same library from Day 03 — now with the ES6 features doing the heavy lifting. Compare each function to what you wrote last session.

```js
// grade-lib.js — Day 03's logic, Day 04's syntax

const isValidScore = (score) =>
  typeof score === "number" && !Number.isNaN(score) && score >= 0 && score <= 100;

function letterGrade(score) {
  if (!isValidScore(score)) return "?";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

// Destructured parameter + defaults: the signature says what it needs
const isPassing = ({ score = 0, passMark = 60 }) => score >= passMark;

const isAtRisk = ({ score = 0, attendance = 0 }) => score < 60 || attendance < 70;

function average(numbers) {
  if (numbers.length === 0) return 0;
  let total = 0;
  for (const n of numbers) total += n;
  return total / numbers.length;
}

// Returns two values — the caller destructures them
function minMaxStudent(students) {
  if (students.length === 0) return [null, null];
  let low = students[0];
  let high = students[0];
  for (const student of students) {
    if (student.score < low.score) low = student;
    if (student.score > high.score) high = student;
  }
  return [low, high];
}

// Computed keys + ?? — builds the tally as it goes
function countByGrade(students) {
  const counts = {};
  for (const { score } of students) {
    const grade = letterGrade(score);
    counts[grade] = (counts[grade] ?? 0) + 1;
  }
  return counts;
}

// Destructured parameter with a whole-object default
function formatRow({ name = "???", score = 0, attendance = 0 } = {}) {
  const paddedName = name.padEnd(8);
  const paddedScore = String(score).padStart(3);
  const result = isPassing({ score }) ? "PASS" : "FAIL";
  return `${paddedName} ${paddedScore}  ${letterGrade(score)}  ${String(attendance).padStart(3)}%  ${result}`;
}

// Spread: returns a NEW student, never mutates the original
const withBonus = (student, bonus = 5) => ({
  ...student,
  score: Math.min(100, student.score + bonus),
});

// --- Use them ---
const students = [
  { name: "Sara", score: 92, attendance: 95 },
  { name: "Omar", score: 68, attendance: 62 },
  { name: "Lina", score: 79, attendance: 88 },
  { name: "Yusuf", score: 95, attendance: 91 },
  { name: "Nour", score: 55, attendance: 70 },
];

console.log("Name     Score Gr  Att  Result");
console.log("-".repeat(34));

for (const student of students) {
  console.log(formatRow(student));
}

const scores = [];
for (const { score } of students) scores.push(score);

const [lowest, highest] = minMaxStudent(students);

console.log("-".repeat(34));
console.log(`Average: ${average(scores).toFixed(1)}`);
console.log(`Top:     ${highest.name} (${highest.score})`);
console.log(`Bottom:  ${lowest.name} (${lowest.score})`);

for (const [grade, count] of Object.entries(countByGrade(students))) {
  console.log(`${grade}: ${"█".repeat(count)} ${count}`);
}

// Prove immutability
const boosted = withBonus(students[4], 10);
console.log(`${boosted.name}: ${students[4].score} → ${boosted.score} (original untouched)`);
```

```bash
node grade-lib.js
```

Expected output:

```
Name     Score Gr  Att  Result
----------------------------------
Sara      92  A   95%  PASS
Omar      68  D   62%  PASS
Lina      79  C   88%  PASS
Yusuf     95  A   91%  PASS
Nour      55  F   70%  FAIL
----------------------------------
Average: 77.8
Top:     Yusuf (95)
Bottom:  Nour (55)
A: ██ 2
D: █ 1
C: █ 1
F: █ 1
Nour: 55 → 65 (original untouched)
```

> **Look at what changed.** Day 03's functions took a `student` and wrote `student.score` four times. These say `{ score }` on line 1 and never mention the object again. Same behaviour, and now the signature tells you what the function actually reads.

---

### Step 3 — `unpack.js` — Destructuring Real Nested Data

The shape below is roughly what an API hands you in Session 5. Practise on it now, while it's sitting in a variable and can't fail on you.

```js
// unpack.js
const response = {
  status: 200,
  data: {
    course: { title: "JS Everywhere", track: 1, sessions: 52 },
    students: [
      { id: 1, name: "Sara", scores: [92, 88, 95], address: { city: "Cairo" } },
      { id: 2, name: "Omar", scores: [68, 71], address: { city: "Alexandria" } },
      { id: 3, name: "Lina", scores: [79] },
    ],
  },
};

// Reach in and rename as you go
const {
  status,
  data: {
    course: { title, sessions },
    students,
  },
} = response;

console.log(`${title} — ${sessions} sessions (HTTP ${status})`);

// Destructure in the loop, with ?. and ?? for the missing address
for (const { name, scores, address } of students) {
  const [firstScore, ...otherScores] = scores;
  const city = address?.city ?? "Unknown";
  console.log(`${name} (${city}) — first ${firstScore}, then ${otherScores.length} more`);
}

// Safe access on data that isn't there
const { students: [, , third] } = response.data;
console.log(third?.address?.city ?? "No city on record");

// Build a new response without mutating the old one
const updated = {
  ...response,
  data: {
    ...response.data,
    students: [...students, { id: 4, name: "Yusuf", scores: [95] }],
  },
};

console.log(students.length, updated.data.students.length); // 3 4
```

```bash
node unpack.js
```

> **That last block is the pattern.** Copy the outer object, copy the level you're changing, replace only the piece that moved. It's how every React state update and every Redux reducer you will ever write is shaped.

---

### Step 4 — `index.html` + `app.js` — Modern Syntax in the Browser

`index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JavaScript Everywhere — Day 04</title>
  </head>
  <body>
    <h1>Student Dashboard</h1>
    <input id="name" type="text" placeholder="Student name" />
    <input id="score" type="number" placeholder="Score 0-100" />
    <input id="city" type="text" placeholder="City (optional)" />
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
// app.js — pure logic on top, DOM below

// --- Pure logic ---
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

const describe = ({ name, score, city = "Unknown" }) =>
  `${name} — ${score} (${letterGrade(score)}) · ${city}`;

// --- DOM ---
const nameInput = document.getElementById("name");
const scoreInput = document.getElementById("score");
const cityInput = document.getElementById("city");
const message = document.getElementById("message");
const list = document.getElementById("list");
const summary = document.getElementById("summary");

let students = []; // `let`, because we replace it rather than mutate it

const showError = (text) => (message.textContent = text);

function render() {
  list.innerHTML = "";

  for (const student of students) {
    const li = document.createElement("li");
    li.textContent = describe(student);
    list.appendChild(li);
  }

  const scores = [];
  for (const { score } of students) scores.push(score);

  summary.textContent =
    students.length === 0
      ? ""
      : `${students.length} students · average ${average(scores).toFixed(1)}`;
}

function handleAdd() {
  const name = nameInput.value.trim();
  const score = Number(scoreInput.value);
  const city = cityInput.value.trim();

  if (name === "") return showError("Please enter a name.");
  if (scoreInput.value === "" || !isValidScore(score)) {
    return showError("Please enter a score between 0 and 100.");
  }

  // Spread instead of push — a NEW array every time
  students = [...students, { name, score, ...(city && { city }) }];

  message.textContent = "";
  for (const input of [nameInput, scoreInput, cityInput]) input.value = "";

  console.log(students);
  render();
}

function handleClear() {
  students = [];
  message.textContent = "";
  render();
}

document.getElementById("add").addEventListener("click", handleAdd);
document.getElementById("clear").addEventListener("click", handleClear);
```

Right-click `index.html` → **Open with Live Server**.

> **Two things to notice.** `{ name, score }` is shorthand — the keys come from the variable names. And `...(city && { city })` spreads an object only when `city` isn't empty, so blank inputs add no key at all. Spreading `false` or `""` into an object adds nothing, which is exactly why that trick is safe.

---

## Part 3 — The Cheat Sheet

| Idea | Write this | Not this |
|---|---|---|
| Building a string | `` `${a} and ${b}` `` | `a + " and " + b` |
| Reading object fields | `const { name, score } = s` | `const name = s.name` ×3 |
| Renaming a field | `const { name: title } = s` | a second assignment |
| Missing field | `const { x = 0 } = s` | `s.x \|\| 0` |
| Function taking an object | `function f({ name, score })` | `function f(s)` + `s.` everywhere |
| Copying an array | `[...arr]` | `arr` (that's an alias!) |
| Copying an object | `{ ...obj }` | `obj` |
| Adding to an array | `[...arr, item]` | `arr.push(item)` when copying |
| Changing one field | `{ ...obj, score: 95 }` | `obj.score = 95` |
| Merging defaults | `{ ...defaults, ...custom }` | manual `if` per key |
| Many arguments | `function f(...items)` | `arguments` |
| Array → arguments | `f(...arr)` | `f(arr[0], arr[1], …)` |
| Maybe-missing path | `a?.b?.c` | `a && a.b && a.b.c` |
| Default for absent only | `x ?? fallback` | `x \|\| fallback` |
| Key from a variable | `{ [key]: value }` | impossible without it |
| Key matches variable | `{ name }` | `{ name: name }` |

### Rest or Spread?

```
LEFT of =, or in a parameter list   ->  REST    collects many into one
RIGHT of =, or in a call / literal  ->  SPREAD  scatters one into many
```

### Destructuring Shapes

```js
const { a } = obj;                  // by name
const { a: b } = obj;               // rename to b
const { a = 1 } = obj;              // default if absent
const { a: b = 1 } = obj;           // rename AND default
const { a, ...rest } = obj;         // everything else
const { a: { b } } = obj;           // nested — no `a` variable created!

const [x] = arr;                    // by position
const [, , z] = arr;                // skip two
const [x = 1] = arr;                // default
const [head, ...tail] = arr;        // first and the rest
[a, b] = [b, a];                    // swap

function f({ a, b = 2 } = {}) {}    // parameter + default + safe no-arg call
```

---

## Common Mistakes

| Mistake | What happens | Fix |
|---|---|---|
| Quotes instead of backticks | Prints `${name}` literally | Use `` ` `` |
| `const { name } = undefined` | `TypeError: Cannot destructure...` | Add `= {}` as a default |
| `f()` where `f({ a })` has no `= {}` | Same `TypeError` | `function f({ a } = {})` |
| Expecting a `student` variable from `student: { name }` | `ReferenceError` | It's a path, not a stop — ask for both |
| Expecting a default to fire for `null` | Defaults fire only on `undefined` | Use `??` explicitly |
| `const arr2 = arr` then pushing | Both names point at one array | `const arr2 = [...arr]` |
| Spreading and editing a nested field | The original changes too — shallow copy | Spread the nested level as well |
| `{ ...overrides, ...defaults }` | Defaults silently win over the caller | Put defaults **first** |
| Rest not last | `SyntaxError` | `...rest` goes at the end |
| `Math.max(arr)` | `NaN` — it wants arguments | `Math.max(...arr)` |
| Miscounting skip commas | Wrong element, no error | Comment the position |
| `{ key: value }` where key is a variable | Key is literally `"key"` | `{ [key]: value }` |
| Destructuring an array with `{ }` | `undefined` — arrays match by position | Use `[ ]` |
| Using `?.` everywhere | Hides real bugs behind `undefined` | Only where a value is legitimately optional |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `TypeError: Cannot destructure property 'x' of 'undefined'` | The thing on the right is `undefined`. Log it first, then add `= {}`. |
| `ReferenceError: x is not defined` after destructuring | You renamed it (`x: y`) — the new name is `y`. Or it was a nested path, not a variable. |
| Template literal prints `${...}` as text | You used `"` or `'`. Backticks only. |
| The "copy" changed the original | Shallow copy — you edited a nested object. Spread that level too. |
| `undefined` from a key you can see in the object | Typo, or wrong case. Destructuring matches the key **exactly**. |
| Default never fires | The value is `null`, `0`, or `""` — all real values. Only `undefined` triggers defaults. |
| `SyntaxError: Rest element must be last element` | Move `...rest` to the end. |
| Swap line throws `SyntaxError` | A previous line has no semicolon; `[a, b] = [b, a]` needs one before it. |
| Merged object missing the caller's values | Spread order is backwards — defaults go first. |
| `?.` returns `undefined` and you expected data | The path really is missing. Log each level to find where it stops. |

---

## Before the Next Session

Session 5 is **Async JS — Callbacks and their problems, the Event Loop**. Everything so far has run top to bottom, in order. Next session, it stops doing that.

Come having finished [ASSIGNMENT.md](ASSIGNMENT.md). If `grade-lib.js` doesn't run, ask **before** Session 5.

### A Taste of Session 5

Type these out — we cover every line next session.

```js
console.log("1 — first");

setTimeout(() => {
  console.log("2 — after 0ms... but not really");
}, 0);

console.log("3 — last line, prints second");

// Output: 1, 3, 2  ← run it. That order is Session 5's entire subject.
```

And the callback shape you'll be unpacking — note how much destructuring is already in it:

```js
function fetchStudent(id, callback) {
  setTimeout(() => {
    callback(null, { id, name: "Sara", scores: [92, 88] });
  }, 500);
}

fetchStudent(1, (error, { name, scores: [firstScore] } = {}) => {
  if (error) return console.log("Failed:", error);
  console.log(`${name} scored ${firstScore} first`);
});
```

That `(error, data)` shape is called an **error-first callback**, and it's everywhere in Node. Notice you already know how to read the second parameter.

---

## Day 04 Files

- [README.md](README.md) — this guide
- [ASSIGNMENT.md](ASSIGNMENT.md) — Day 04 assignment

← Back to [Day 03 — Functions, Scope & Hoisting](../Day-03-Functions-Scope/README.md)
