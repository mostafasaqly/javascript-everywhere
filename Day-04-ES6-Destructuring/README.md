# Day 04 — ES6+ & Async JS: Destructuring, Spread, Callbacks & the Event Loop

**Track 1: JS/TS Foundations + Web Basics · Day 4 · two parts**

> Day 03 gave you the box: a function with a name, parameters, and a return.
> Part 1 makes getting data *into* that box — and back *out* of it — stop hurting.
> Part 2 breaks the one rule you've relied on since Day 01: that code runs in the order you wrote it.

**Why this day matters:** the next session is **Promises and Async/Await**. Async code is drowning in objects you have to unpack (`response`, `data`, `error`) — that's Part 1. And Promises exist to fix the problems you'll create by hand in Part 2. If you skip the pain, `async`/`await` looks like magic syntax. If you feel it first, it looks like the obvious fix — which is what it is.

| Part | Topic | Concept | Build |
|---|---|---|---|
| **1** | ES6+ — Destructuring, Spread & Rest | Sections 1.1–1.8 | Steps 1–4 |
| **2** | Async JS — Callbacks & the Event Loop | Sections 2.1–2.9 | Steps 5–9 |

---

## What You'll Have by the End

**Part 1 — ES6+**

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

**Part 2 — Async**

- [ ] Why JavaScript has only **one** thread, and what "blocking" really costs
- [ ] The call stack — what it is and how to read a stack trace
- [ ] `setTimeout`, `setInterval`, and how to cancel both
- [ ] The event loop: stack, APIs, task queue, microtask queue
- [ ] Why `setTimeout(fn, 0)` doesn't mean "now"
- [ ] Sync callbacks vs async callbacks — and why you can't `return` from the second kind
- [ ] Error-first callbacks, the Node convention
- [ ] The three problems with callbacks: the pyramid, inversion of control, and scattered errors
- [ ] Running requests **in parallel** and knowing when they're all back
- [ ] Reading a real file with `fs.readFile`

---

# Part 1 — ES6+: Destructuring, Spread & Rest

## 1 — Concept (65 min)

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


---

# Part 2 — Async JS: Callbacks & the Event Loop

> For three days, your code has run top to bottom, one line after another, in the order you typed it.
> Now it stops doing that.
> Nothing in this part is hard once you can see **where each line waits** — so that's what we're going to draw.

## 2 — Concept (70 min)

### 2.1 Synchronous — The Way You've Written Everything So Far

```js
console.log("1");
console.log("2");
console.log("3");
// 1, 2, 3 — always, forever
```

Each line waits for the previous one to finish. That's **synchronous** code. Easy to reason about — and it has a cost you haven't noticed yet, because nothing you've written has been slow.

Here's something slow:

```js
function blockFor(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // do nothing, very busily
  }
}

console.log("Before");
blockFor(3000);          // 3 seconds of doing nothing
console.log("After");    // waits the full 3 seconds
```

In Node, the terminal just sits there. In the browser it's worse: **the whole tab freezes.** Buttons don't click, text doesn't select, the page can't even repaint. You'll try this yourself in Step 9.

> **The one fact this session is built on:** JavaScript runs your code on **one thread**. It can only do one thing at a time. While it's stuck in `blockFor`, it cannot do *anything* else — not respond to a click, not run a timer, nothing.

So how does a web page load data from a server — which can take seconds — without freezing? It doesn't wait. It **asks**, carries on, and gets **called back** later. That's the whole session.

---

### 2.2 The Call Stack — Where JavaScript Keeps Its Place

When a function calls another function, JavaScript has to remember where to come back to. It keeps a **stack** of the functions that are currently running.

```js
function letterGrade(score) {
  return score >= 90 ? "A" : "B";
}

function describe(name, score) {
  return `${name}: ${letterGrade(score)}`;
}

console.log(describe("Sara", 92));
```

The stack, step by step:

```
                                     letterGrade(92)
                    describe(...)    describe(...)    describe(...)
  console.log(...)  console.log(...) console.log(...) console.log(...)  console.log(...)   (empty)
  ───────────────── ──────────────── ──────────────── ────────────────  ────────────────   ───────
     1. push           2. push          3. push         4. pop "A"         5. pop           6. done
```

**Last in, first out.** The function on top is the one running right now. When it returns, it's popped, and the one below carries on from exactly where it stopped.

You've already been reading stacks — every error you've seen prints one:

```
TypeError: Cannot read properties of undefined (reading 'score')
    at letterGrade (report.js:3:15)      ← where it broke
    at describe (report.js:7:23)         ← who called that
    at Object.<anonymous> (report.js:10:13) ← who called THAT
```

Read it **top down**: the first line is where it broke; each line below is who called it.

#### Stack overflow

A function that calls itself forever never pops:

```js
function forever() {
  forever();
}
forever(); // RangeError: Maximum call stack size exceeded
```

That's the actual error behind the website's name.

---

### 2.3 Timers — Your First Asynchronous Code

#### `setTimeout` — run once, later

```js
console.log("Ordering coffee");

setTimeout(() => {
  console.log("☕ Coffee is ready");
}, 2000);

console.log("Reading a book while I wait");
```

Output:

```
Ordering coffee
Reading a book while I wait
☕ Coffee is ready        ← two seconds later
```

The line that prints last was written in the middle. `setTimeout` doesn't pause anything — it **registers** a function to be called later and returns **immediately**.

You pass a function, not a call. Same rule as `addEventListener` on Day 03:

```js
setTimeout(sayHi, 1000);    // ✅ "call sayHi in a second"
setTimeout(sayHi(), 1000);  // ❌ calls sayHi NOW, passes its return value (undefined)
```

Extra arguments after the delay are passed to your function:

```js
setTimeout((name, score) => console.log(`${name}: ${score}`), 500, "Sara", 92);
```

#### `setInterval` — run repeatedly

```js
let seconds = 5;

const timerId = setInterval(() => {
  console.log(seconds);
  seconds--;

  if (seconds === 0) {
    clearInterval(timerId);
    console.log("Lift off 🚀");
  }
}, 1000);
```

Both functions return an **ID**. Hand that ID to `clearTimeout` / `clearInterval` to cancel:

```js
const reminderId = setTimeout(() => console.log("Don't forget!"), 5000);
clearTimeout(reminderId); // never prints
```

> **Forget to clear an interval and it runs forever.** In Node, your script never exits. In the browser, it keeps running after you've "left" that part of the page. Every `setInterval` needs a matching `clearInterval` somewhere.

#### The delay is a **minimum**, not a promise

```js
const start = Date.now();

setTimeout(() => {
  console.log(`Asked for 100ms, got ${Date.now() - start}ms`);
}, 100);

blockFor(1000); // from 1.1
```

```
Asked for 100ms, got 1001ms
```

The timer was *ready* at 100ms. But JavaScript was busy — one thread, remember — so it couldn't run the callback until `blockFor` finished. **`setTimeout(fn, 100)` means "not before 100ms". It never means "at exactly 100ms".**

To see why, we need the event loop.

---

### 2.4 The Event Loop — The Picture That Explains Everything

There are four pieces. Learn this diagram; it answers every "why did this print in that order?" question for the rest of the course.

```
 ┌──────────────────────┐        ┌───────────────────────────────┐
 │      CALL STACK      │        │  BROWSER / NODE APIs          │
 │  (your code runs     │ ─────▶ │  timers, network, disk, clicks│
 │   here, one at a     │  hand  │  (these run OUTSIDE your one  │
 │   time)              │  off   │   JavaScript thread)          │
 └──────────▲───────────┘        └──────────────┬────────────────┘
            │                                   │ when done, the callback
            │                                   ▼ is put in a queue
            │                    ┌───────────────────────────────┐
            │                    │  MICROTASK QUEUE  (VIP lane)  │
            │                    │  queueMicrotask, Promises     │
            │                    ├───────────────────────────────┤
            │                    │  TASK QUEUE  (normal lane)    │
            │                    │  setTimeout, setInterval, I/O │
            │                    └──────────────┬────────────────┘
            │                                   │
            └───────────  EVENT LOOP  ◀─────────┘
          "Is the stack empty? Then take the next callback:
           ALL microtasks first, then ONE task. Repeat forever."
```

1. **Call stack** — your code runs here. One thing at a time.
2. **APIs** — `setTimeout`, `fs.readFile`, `fetch`, click listeners. JavaScript *hands off* the waiting to the browser or Node, which do it outside your thread.
3. **Queues** — when the wait is over, the callback doesn't run immediately. It gets in line.
4. **The event loop** — a tiny loop that only ever asks one question: *"Is the call stack empty?"* If yes, it moves the next queued callback onto the stack.

#### Walk through the classic

```js
console.log("1 — first");

setTimeout(() => {
  console.log("2 — timeout");
}, 0);

console.log("3 — last line");
```

| Step | Stack | API | Task queue | Printed |
|---|---|---|---|---|
| 1 | `console.log("1…")` | | | `1 — first` |
| 2 | `setTimeout(…)` | timer (0ms) | | |
| 3 | | timer done | `() => log("2…")` | |
| 4 | `console.log("3…")` | | `() => log("2…")` | `3 — last line` |
| 5 | *empty* → loop moves callback | | | |
| 6 | `() => log("2…")` | | | `2 — timeout` |

The timer finished almost instantly — but the callback **had to wait in the queue until the stack was empty**, and the stack wasn't empty until the whole script had run.

> **The rule:** a queued callback never interrupts running code. It waits until *everything* synchronous has finished. `setTimeout(fn, 0)` means "run this as soon as you're free" — and you aren't free until the script ends.

#### The VIP lane — microtasks

There are two queues, and one of them always goes first:

```js
setTimeout(() => console.log("task"), 0);
queueMicrotask(() => console.log("microtask"));
console.log("sync");

// sync, microtask, task
```

After every piece of synchronous code, the loop empties the **entire microtask queue** before it takes even **one** task. `queueMicrotask` is rare in real code — but **Promises use this lane**, which is why it matters next session. For today: *sync first, then microtasks, then tasks.*

---

### 2.5 Callbacks — Sync and Async

You've been writing callbacks since Day 03 — `myMap(numbers, double)` took a function and called it. That was a **synchronous** callback: called right away, before `myMap` returned.

```js
// SYNC callback — runs during forEach, before the next line
[1, 2, 3].forEach((n) => console.log(n));
console.log("done");
// 1, 2, 3, done
```

```js
// ASYNC callback — runs after the current script, whenever the wait ends
setTimeout(() => console.log("timer"), 0);
console.log("done");
// done, timer
```

Same syntax. Completely different timing. **You can't tell which one you're dealing with by looking at the arrow** — you have to know what the function you're passing it to does.

#### The problem: you can't `return` your way out

```js
function getScoreSync() {
  return 92;
}

function getScoreLater() {
  setTimeout(() => {
    return 92;             // returns to... whoever called the arrow. Not you.
  }, 100);
}                          // getScoreLater itself returns undefined, immediately

console.log(getScoreSync());  // 92
console.log(getScoreLater()); // undefined
```

By the time the `92` exists, `getScoreLater` finished long ago. There's nobody left to return it to.

**The callback solution:** don't return the value — *pass in a function*, and call it with the value when it's ready.

```js
function getScoreLater(callback) {
  setTimeout(() => {
    callback(92);
  }, 100);
}

getScoreLater((score) => {
  console.log(`Got it: ${score}`);   // everything that needs the score lives in here
});
```

That last comment is the catch. **Anything that depends on the result has to go inside the callback.** Hold that thought — it's where every problem in 1.7 comes from.

---

### 2.6 Error-First Callbacks — The Node Convention

Async operations fail: the file isn't there, the server is down, the student ID doesn't exist. How does a callback say "it went wrong"?

Node settled this years ago. **The first argument is always the error.** `null` if it worked.

```js
function getStudent(id, callback) {
  setTimeout(() => {
    if (id !== 1) {
      return callback(new Error(`No student with id ${id}`));
    }
    callback(null, { id: 1, name: "Sara", score: 92 });
  }, 300);
}

getStudent(1, (err, student) => {
  if (err) return console.log(`Failed: ${err.message}`);   // ← always check first
  console.log(`Found ${student.name}`);
});

getStudent(7, (err, student) => {
  if (err) return console.log(`Failed: ${err.message}`);
  console.log(`Found ${student.name}`);
});
```

```
Found Sara
Failed: No student with id 7
```

Two habits, every time:

1. **`if (err) return …` on the first line.** The `return` matters — without it, the code carries on and reads `student.name` from `undefined`.
2. **`return callback(...)`** inside your own functions when you report an error — otherwise you'll call the callback *twice*.

#### Why not `try`/`catch`?

```js
try {
  setTimeout(() => {
    throw new Error("boom");
  }, 0);
} catch (e) {
  console.log("Caught:", e.message);   // never runs
}
console.log("after try");
```

```
after try
Error: boom      ← crashes the program
```

By the time the callback throws, the `try` block finished long ago — it's not on the stack any more, so nothing catches it. **`try`/`catch` only catches errors from code on the stack *right now*.** That's why async errors travel as arguments instead.

---

### 2.7 The Three Problems With Callbacks

Callbacks work. Node ran on them for years. But they have three problems, and every one of them is why Promises exist.

#### Problem 1 — The pyramid of doom

Real work is steps that depend on each other: get the student, *then* their scores, *then* their course. Each step needs the previous result — and results only exist inside callbacks — so each step nests one level deeper:

```js
getStudent(1, (err, student) => {
  if (err) return console.log(`Failed: ${err.message}`);

  getScores(student.id, (err, scores) => {
    if (err) return console.log(`Failed: ${err.message}`);

    getCourse(student.courseId, (err, course) => {
      if (err) return console.log(`Failed: ${err.message}`);

      getTeacher(course.teacherId, (err, teacher) => {
        if (err) return console.log(`Failed: ${err.message}`);

        console.log(`${student.name} — ${course.title} with ${teacher.name}`);
      });
    });
  });
});
```

Four steps and the real code is pushed halfway across the screen. Add a loop or an `if` in the middle and it becomes unreadable. This is called **callback hell**, or the **pyramid of doom** — look at its shape.

#### Problem 2 — Scattered error handling

Count the `if (err)` lines above: four, identical. Forget one and a failure disappears silently, or crashes three levels deeper with a confusing message. There's no single place that says "if *anything* in here fails, do this."

#### Problem 3 — Inversion of control

When you pass a callback to someone else's function, **you're trusting them to call it correctly.** You have no control over whether they:

- call it **never** (your program just… stops, silently)
- call it **twice** (charge the card twice, send the email twice)
- call it **synchronously sometimes and asynchronously other times** (order bugs that only appear sometimes)
- swallow the error instead of passing it on

```js
// A badly written library function
function saveGrade(grade, callback) {
  if (grade > 100) {
    callback(new Error("Too high"));   // ❌ forgot `return`...
  }
  setTimeout(() => callback(null, "saved"), 100);   // ...so this runs as well
}

saveGrade(150, (err, result) => {
  console.log(err ? `Error: ${err.message}` : `OK: ${result}`);
});
// Error: Too high
// OK: saved          ← the same callback, called twice
```

You handed control of *your* code to *their* function. That's the "inversion". You can defend against it:

```js
function once(fn) {
  let called = false;
  return (...args) => {
    if (called) return;
    called = true;
    fn(...args);
  };
}

saveGrade(150, once((err, result) => {
  console.log(err ? `Error: ${err.message}` : `OK: ${result}`);
}));
// Error: Too high   ← only once now
```

> `once` is a **closure** (Day 03) wrapping a **rest/spread** function (Part 1). Every tool you've learned so far is in that five-line function.

Defending against every library, everywhere, forever, is exhausting. Promises (next session) fix this at the source: a Promise can only settle **once**, and always asynchronously. That's the whole pitch.

---

### 2.8 Taming Callbacks — Before Promises Arrive

You can't fix inversion of control by hand, but you can fix the pyramid and the scattered errors.

**1. Name your steps.** Pull each nested callback out into a function with one job. The nesting disappears from the page even though it still exists at runtime.

**2. Pass one `done` callback all the way through.** Every step reports errors to the same place, so the caller handles them once.

**3. Return early on errors.** `if (err) return done(err);` — one line, first line, every time.

You'll do exactly this in Step 6.

#### Parallel vs sequential

The pyramid is **sequential**: step 2 can't start until step 1 finishes. That's necessary when step 2 *needs* step 1's result.

But loading three *unrelated* students doesn't need that. Start all three at once, and count them back in:

```js
const results = [];
let finished = 0;

ids.forEach((id, index) => {
  getStudent(id, (err, student) => {
    results[index] = err ? { id, error: err.message } : student;  // by index, NOT push
    finished++;
    if (finished === ids.length) {
      console.log("All back:", results);
    }
  });
});
```

Two details that are easy to get wrong:

- **`results[index] = …`, not `results.push(…)`.** Answers come back in the order they *finish*, not the order you asked. Storing by index keeps them in the order you asked.
- **Count, don't check `results.length`.** Setting `results[2]` first makes `results.length` equal `3` while slots 0 and 1 are still empty.

Sequential: 3 requests × 300ms = ~900ms. Parallel: ~300ms. That difference is the reason async exists.

---

### 2.9 Node's Real Async — Reading a File

Timers are practice. Here's the real thing — Node's `fs` module gives you both versions:

```js
const fs = require("fs");

// Synchronous: the program stops until the disk answers
const text = fs.readFileSync("students.json", "utf8");

// Asynchronous: ask, carry on, get an error-first callback
fs.readFile("students.json", "utf8", (err, text) => {
  if (err) return console.log(`Failed: ${err.code}`);
  const students = JSON.parse(text);
});
```

`require` is how Node loads a built-in module — modules get their own session soon. For today, treat that first line as "give me the file tools".

> **When is sync OK?** In a short script that reads one config file at startup and then does its work, `readFileSync` is fine and simpler. In a **server** handling hundreds of users, a sync read makes every other user wait while one file loads. That's the Track 2 reason to care.

---


## Build — Follow Along

Create a folder `day-04` and build these as we go. Steps 1–4 are Part 1, Steps 5–9 are Part 2.

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

The shape below is roughly what an API hands you in Part 2. Practise on it now, while it's sitting in a variable and can't fail on you.

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


---

### Step 5 — `event-loop.js` — Predict, Then Run

Before running this, **write down** the order you think the letters will print. Then run it.

```js
// event-loop.js — predict each line's order BEFORE you run it

console.log("A — script starts");

setTimeout(() => console.log("B — timeout 0"), 0);
setTimeout(() => console.log("C — timeout 100"), 100);
setTimeout(() => console.log("D — timeout 50"), 50);

queueMicrotask(() => console.log("E — microtask"));

for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log(`F — loop timeout ${i}`), 0);
}

console.log("G — script ends");

// Block the thread for 200ms — every timer above is now "late"
const start = Date.now();
while (Date.now() - start < 200) {}
console.log("H — finished blocking");
```

```bash
node event-loop.js
```

<details>
<summary>Expected output — check your prediction first</summary>

```
A — script starts
G — script ends
H — finished blocking
E — microtask
B — timeout 0
F — loop timeout 1
F — loop timeout 2
F — loop timeout 3
D — timeout 50
C — timeout 100
```

- **A, G, H** — all synchronous, so they run first, in order. The blocking loop is synchronous too.
- **E** — microtasks run as soon as the script finishes, before any timer.
- **B, F1, F2, F3** — all 0ms timers, in the order they were registered.
- **D before C** — by the time the blocking ends, *both* are overdue. They still run in order of their deadlines: 50 before 100.
- **`let i` gives 1, 2, 3.** With `var i` all three would print `4` — the Day 03 closure bug, now with a timer.

</details>

---

### Step 6 — `fake-db.js` + `callback-hell.js` + `flat.js`

We need something slow to wait on. This file pretends to be a database on a server far away — every function answers later, through an error-first callback.

```js
// fake-db.js — pretend this data lives on a server far away

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

// How long each student's "network request" takes, in ms
const LATENCY = { 1: 300, 2: 100, 3: 200 };

function getStudent(id, callback) {
  setTimeout(() => {
    const student = STUDENTS[id];
    if (!student) return callback(new Error(`No student with id ${id}`));
    callback(null, student);
  }, LATENCY[id] ?? 50);
}

function getScores(studentId, callback) {
  setTimeout(() => {
    const scores = SCORES[studentId];
    if (!scores) return callback(new Error(`No scores for student ${studentId}`));
    callback(null, scores);
  }, 100);
}

function getCourse(courseId, callback) {
  setTimeout(() => {
    const course = COURSES[courseId];
    if (!course) return callback(new Error(`No course with id ${courseId}`));
    callback(null, course);
  }, 100);
}

function average(numbers) {
  if (numbers.length === 0) return 0;
  let total = 0;
  for (const n of numbers) total += n;
  return total / numbers.length;
}
```

> **Modules get their own session later.** Paste `fake-db.js` at the top of each file that uses it, the same way you did with `grade-lib.js`. It's clumsy on purpose — you'll feel why `import` exists.

#### `callback-hell.js` — the pyramid, on purpose

```js
// callback-hell.js — paste fake-db.js above this line first

getStudent(1, (err, student) => {
  if (err) return console.log(`Failed: ${err.message}`);

  getScores(student.id, (err, scores) => {
    if (err) return console.log(`Failed: ${err.message}`);

    getCourse(student.courseId, (err, course) => {
      if (err) return console.log(`Failed: ${err.message}`);

      console.log(`[pyramid] ${student.name} — ${course.title} — avg ${average(scores).toFixed(1)}`);
    });
  });
});
```

```
[pyramid] Sara — JS Everywhere — avg 91.7
```

Change the `1` to `99` and run it again. Then change `getScores(student.id` to `getScores(123` and run it again. Notice you had to *think* about which `if (err)` caught it.

#### `flat.js` — same work, no pyramid

```js
// flat.js — paste fake-db.js above this line first

// Each step is a named function with ONE job, and ONE `done` for the whole chain
function buildReport(id, done) {
  getStudent(id, (err, student) => {
    if (err) return done(err);
    addScores(student, done);
  });
}

function addScores(student, done) {
  getScores(student.id, (err, scores) => {
    if (err) return done(err);
    addCourse({ ...student, scores }, done);
  });
}

function addCourse(student, done) {
  getCourse(student.courseId, (err, course) => {
    if (err) return done(err);
    done(null, { ...student, course: course.title });
  });
}

// ONE place that handles success AND failure
function printReport(err, report) {
  if (err) return console.log(`✗ ${err.message}`);
  const { name, course, scores } = report;
  console.log(`✓ ${name} — ${course} — avg ${average(scores).toFixed(1)}`);
}

console.log("Requesting 1 and 99...");
buildReport(1, printReport);
buildReport(99, printReport);
console.log("...both requests sent. Nothing has come back yet.");
```

```bash
node flat.js
```

```
Requesting 1 and 99...
...both requests sent. Nothing has come back yet.
✗ No student with id 99
✓ Sara — JS Everywhere — avg 91.7
```

> **Three things to notice.** First, 99 was requested *second* but answered *first* — it failed fast (50ms) while Sara took three round trips (500ms). **Order of asking ≠ order of answering.** Second, `{ ...student, scores }` is Part 1's spread building a new object at each step instead of mutating. Third, `buildReport` is itself an async function with an error-first callback — you've built the same kind of thing you've been calling.

---

### Step 7 — `parallel.js` — Load Everyone at Once

Paste `fake-db.js` and the four functions from `flat.js` (not the three calls at the bottom) above this:

```js
// parallel.js

function loadAll(ids, done) {
  const results = [];
  let finished = 0;

  if (ids.length === 0) return done([]);

  ids.forEach((id, index) => {
    buildReport(id, (err, report) => {
      console.log(`  arrived: id ${id}`);
      results[index] = err ? { id, error: err.message } : report;
      finished++;
      if (finished === ids.length) done(results);
    });
  });
}

const started = Date.now();

loadAll([1, 2, 3, 42], (results) => {
  console.log(`All ${results.length} back in ${Date.now() - started}ms:`);
  for (const result of results) {
    if (result.error) {
      console.log(`  ✗ ${result.id}: ${result.error}`);
    } else {
      console.log(`  ✓ ${result.name.padEnd(5)} ${average(result.scores).toFixed(1)}  ${result.course}`);
    }
  }
});
```

```bash
node parallel.js
```

```
  arrived: id 42
  arrived: id 2
  arrived: id 3
  arrived: id 1
All 4 back in 510ms:
  ✓ Sara  91.7  JS Everywhere
  ✓ Omar  69.5  JS Everywhere
  ✓ Lina  79.0  TypeScript Basics
  ✗ 42: No student with id 42
```

Your millisecond number will differ slightly — it's never exactly 500.

> **Look at the two orders.** They *arrived* 42, 2, 3, 1. They're *printed* 1, 2, 3, 42 — the order you asked for — because each one was stored at its `index`. And the total is ~500ms: the time of the **slowest** request, not the sum of all four (~1,250ms). One failing request didn't stop the other three.

Try it: change `results[index] = …` to `results.push(…)`. Run it. The printed order is now the arrival order.

---

### Step 8 — `files.js` — A Real File, Read Asynchronously

Create `students.json` next to it:

```json
[
  { "name": "Sara", "score": 92 },
  { "name": "Omar", "score": 68 },
  { "name": "Lina", "score": 79 }
]
```

```js
// files.js — Node's real async I/O
const fs = require("fs");

// 1. Synchronous — the whole program waits on the disk
console.log("sync: before");
const text = fs.readFileSync("students.json", "utf8");
console.log(`sync: read ${text.length} characters`);
console.log("sync: after");

// 2. Asynchronous — ask, carry on, get called back
console.log("async: before");
fs.readFile("students.json", "utf8", (err, text) => {
  if (err) return console.log(`async: failed — ${err.code}`);

  const students = JSON.parse(text);
  console.log(`async: loaded ${students.length} students`);
  for (const { name, score } of students) {
    console.log(`  ${name.padEnd(5)} ${score}`);
  }
});
console.log("async: after — the file hasn't arrived yet");

// 3. A file that doesn't exist — the error comes back as the FIRST argument
fs.readFile("missing.json", "utf8", (err, text) => {
  if (err) return console.log(`missing: ${err.code}`);
  console.log(text);
});
```

```bash
node files.js
```

```
sync: before
sync: read 108 characters
sync: after
async: before
async: after — the file hasn't arrived yet
missing: ENOENT
async: loaded 3 students
  Sara  92
  Omar  68
  Lina  79
```

> **Run it from the `day-05` folder.** The path `"students.json"` is relative to where you *run* `node`, not where the file lives. Run it from the wrong folder and you'll see `ENOENT` twice.

`ENOENT` is Node for *"Error: NO ENTry"* — file not found. Your character count may differ by a few if your editor saves different line endings. The `missing` line may print before or after the student list: **two I/O operations started together can finish in either order**, exactly like Step 7.

---

### Step 9 — `loader.html` + `loader.js` — Async in the Browser

A second page, next to Step 4's — so the two don't overwrite each other.

Now make the freeze visible, then fix it.

`loader.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JavaScript Everywhere — Day 04 Loader</title>
  </head>
  <body>
    <h1>Async Student Loader</h1>

    <section>
      <h2>1. Load students</h2>
      <button id="load">Load students</button>
      <p id="status"></p>
      <ul id="list"></ul>
    </section>

    <section>
      <h2>2. Freeze vs don't</h2>
      <input type="text" placeholder="Try typing here during each test" />
      <button id="freeze">Freeze for 3s</button>
      <button id="chunked">Same work, in chunks</button>
      <p id="work"></p>
    </section>

    <section>
      <h2>3. Countdown</h2>
      <button id="start">Start 10s</button>
      <button id="stop">Stop</button>
      <p id="countdown"></p>
    </section>

    <script src="loader.js"></script>
  </body>
</html>
```

`loader.js`:

```js
// loader.js — pure async logic on top, DOM below

// --- Fake server ---
const SERVER_STUDENTS = [
  { name: "Sara", score: 92 },
  { name: "Omar", score: 68 },
  { name: "Lina", score: 79 },
];

// Error-first callback, fails 1 time in 4 — like a real network
function fetchStudents(callback) {
  setTimeout(() => {
    if (Math.random() < 0.25) return callback(new Error("Server did not respond"));
    callback(null, [...SERVER_STUDENTS]);
  }, 1200);
}

function blockFor(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {}
}

// --- DOM ---
const loadBtn = document.getElementById("load");
const status = document.getElementById("status");
const list = document.getElementById("list");
const work = document.getElementById("work");
const countdown = document.getElementById("countdown");

// 1. Loading state: disable, show "Loading…", then success OR error
function handleLoad() {
  loadBtn.disabled = true;
  status.textContent = "Loading…";
  list.innerHTML = "";

  fetchStudents((err, students) => {
    loadBtn.disabled = false;

    if (err) {
      status.textContent = `❌ ${err.message} — try again.`;
      return;
    }

    status.textContent = `✓ Loaded ${students.length} students`;
    for (const { name, score } of students) {
      const li = document.createElement("li");
      li.textContent = `${name} — ${score}`;
      list.appendChild(li);
    }
  });

  console.log("Request sent — the page is still responsive");
}

// 2a. Blocks the one thread: nothing on the page works for 3 seconds
function handleFreeze() {
  work.textContent = "Working… (try typing!)";
  blockFor(3000);
  work.textContent = "Done — did you see 'Working…'? You shouldn't have.";
}

// 2b. The same 3 seconds, split into 30 slices of 100ms with a break between
function handleChunked() {
  let slice = 0;

  function doSlice() {
    blockFor(100);
    slice++;
    work.textContent = `Working… ${slice}/30`;
    if (slice < 30) {
      setTimeout(doSlice, 0);   // give the event loop a turn, then continue
    } else {
      work.textContent = "Done — and the page stayed usable the whole time.";
    }
  }

  doSlice();
}

// 3. setInterval + clearInterval, with a guard against double-starting
let timerId = null;

function handleStart() {
  if (timerId !== null) return;     // already running
  let seconds = 10;
  countdown.textContent = seconds;

  timerId = setInterval(() => {
    seconds--;
    countdown.textContent = seconds;
    if (seconds === 0) {
      handleStop();
      countdown.textContent = "⏰ Time's up";
    }
  }, 1000);
}

function handleStop() {
  clearInterval(timerId);
  timerId = null;
}

loadBtn.addEventListener("click", handleLoad);
document.getElementById("freeze").addEventListener("click", handleFreeze);
document.getElementById("chunked").addEventListener("click", handleChunked);
document.getElementById("start").addEventListener("click", handleStart);
document.getElementById("stop").addEventListener("click", handleStop);
```

Right-click `loader.html` → **Open with Live Server**. Then try all of these:

1. **Load students** several times. Sometimes it fails — the error path is part of the feature, not a bug.
2. Click **Freeze for 3s**, then immediately try to type in the input box. Nothing happens until the freeze ends — and you never see "Working…", because the page can't repaint while the thread is busy.
3. Click **Same work, in chunks** and type. The counter moves *and* your typing appears. Same total work, but every `setTimeout(doSlice, 0)` lets the event loop handle your keystrokes and repaint the page.
4. Click **Start 10s** twice quickly. Only one countdown runs — thanks to the `timerId !== null` guard. Remove the guard and try again: two intervals, counting down at double speed, and **Stop** can only cancel one of them.

> **Why the button gets disabled.** Without it, an impatient user clicks Load five times and fires five requests. Disable on start, re-enable in the callback — on success **and** on failure. Forgetting the failure path leaves the button disabled forever the first time the network blips.

---


## The Cheat Sheet

### Part 1 — ES6+

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

#### Rest or Spread?

```
LEFT of =, or in a parameter list   ->  REST    collects many into one
RIGHT of =, or in a call / literal  ->  SPREAD  scatters one into many
```

#### Destructuring Shapes

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

### Part 2 — Async

| Idea | Write this | Not this |
|---|---|---|
| Run later, once | `setTimeout(fn, ms)` | `setTimeout(fn(), ms)` |
| Run repeatedly | `const id = setInterval(fn, ms)` | a `while` loop with `Date.now()` |
| Cancel | `clearTimeout(id)` / `clearInterval(id)` | forgetting the ID |
| Get an async result | pass a callback | `return` from inside it |
| Report an async error | `return callback(err)` | `throw` inside a timer |
| Handle an async error | `if (err) return …` first line | `try`/`catch` around the call |
| Signal success | `callback(null, value)` | `callback(value)` |
| Several steps in a row | named functions + one `done` | four levels of nesting |
| Several independent loads | start all, count them back | wait for each one in turn |
| Keep results in order | `results[index] = x` | `results.push(x)` |
| Know when all are done | `if (++finished === total)` | `results.length === total` |
| Read a file | `fs.readFile(path, "utf8", cb)` | `readFileSync` in a server |
| Long work in the browser | chunk it with `setTimeout(step, 0)` | one giant loop |
| Guard a callback | `once(callback)` | trusting the library |

#### Execution Order, Every Time

```
1. All synchronous code, top to bottom — to the very end of the script
2. ALL microtasks        (queueMicrotask, and next session: Promises)
3. ONE task              (the oldest ready timer, I/O callback, or click)
4. ALL microtasks again
5. Back to 3, forever
```

#### The Error-First Callback Shape

```js
function doSomething(input, callback) {
  setTimeout(() => {
    if (/* failed */) return callback(new Error("what went wrong"));
    callback(null, result);
  }, ms);
}

doSomething(input, (err, result) => {
  if (err) return console.log(err.message);
  // use result
});
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
| `setTimeout(fn(), 1000)` | `fn` runs immediately; nothing runs later | Pass `fn`, don't call it |
| `return` a value from inside a callback | The outer function already returned `undefined` | Pass the value to a callback |
| Using an async result on the next line | `undefined` — it hasn't arrived yet | Put the code **inside** the callback |
| `if (err) console.log(...)` without `return` | Carries on and crashes on `undefined` | `if (err) return …` |
| `callback(err)` without `return` | Callback runs twice — error, then success | `return callback(err)` |
| `callback(value)` instead of `callback(null, value)` | Caller treats your data as an error | Error first, always |
| `try`/`catch` around async code | Error escapes and crashes | Pass errors as the first argument |
| `setInterval` with no `clearInterval` | Runs forever; Node never exits | Save the ID and clear it |
| Starting an interval twice | Double speed, and Stop only stops one | Guard with `if (timerId !== null) return` |
| `results.push` for parallel loads | Results in arrival order, not request order | `results[index] = …` |
| Checking `results.length` for "all done" | Fires early when a later index lands first | Keep a separate counter |
| `var i` in a loop with `setTimeout` | Every callback sees the final value | `let i` |
| Disabling a button and only re-enabling on success | Button is stuck after the first failure | Re-enable before checking `err` |
| Expecting `setTimeout(fn, 100)` to fire at 100ms | Fires later if the thread is busy | It's a minimum, not a schedule |

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
| Output prints in a "random" order | It isn't random — sync first, then microtasks, then tasks. Redraw the event loop table for it. |
| `undefined` where the data should be | You used the result outside the callback. Move that code in. |
| Node script never exits | A `setInterval` is still running. Find it and `clearInterval` it. |
| Callback runs twice | Somewhere, a `callback(err)` is missing its `return`. |
| Program crashes with an error you "caught" | The throw happened inside a callback, after `try` finished. Use error-first instead. |
| `TypeError: Cannot read properties of undefined` in a callback | You skipped the `if (err) return` check, so the data argument is `undefined`. |
| `TypeError [ERR_INVALID_ARG_TYPE]: The "callback" argument must be of type function` | You passed `fn()` instead of `fn`, or forgot the callback entirely. |
| `ENOENT: no such file or directory` | Wrong path, or you ran `node` from a different folder. `cd` into `day-05` first. |
| `SyntaxError: Unexpected token` from `JSON.parse` | The JSON file has a trailing comma or single quotes. JSON is stricter than JavaScript. |
| Browser page freezes | Something synchronous is running too long. Chunk it with `setTimeout`. |
| "Working…" never appears before the freeze | Expected — the page can't repaint while the thread is blocked. That's the demo. |
| `RangeError: Maximum call stack size exceeded` | A function calls itself with no way to stop. |

---

## Before the Next Session

The next session is **Promises and Async/Await** — the fix for every problem in section 2.7.

Come having finished [ASSIGNMENT.md](ASSIGNMENT.md). If `grade-lib.js` doesn't run or `parallel.js` doesn't print in the right order, ask **before** the next session.

### A Taste of the Next Session

Here's `getStudent` from Step 6, rewritten to return a **Promise** instead of taking a callback. Type it and run it — we cover every line next session.

```js
function getStudent(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id !== 1) return reject(new Error(`No student with id ${id}`));
      resolve({ id: 1, name: "Sara", score: 92 });
    }, 300);
  });
}

// Callback-free, pyramid-free, one catch for everything:
async function main() {
  try {
    const student = await getStudent(1);
    console.log(`Found ${student.name}`);

    const missing = await getStudent(7);
    console.log(missing.name);          // never runs
  } catch (err) {
    console.log(`Failed: ${err.message}`);
  }
}

main();
```

```
Found Sara
Failed: No student with id 7
```

Look at what's gone: no nesting, no `if (err)` at every step, and **`try`/`catch` works again**. The `resolve` / `reject` pair can only be settled once, which kills the "called twice" problem at the source.

The code *reads* synchronously — but underneath, it's exactly the event loop you drew today.

---

## Day 04 Files

- [README.md](README.md) — this guide
- [ASSIGNMENT.md](ASSIGNMENT.md) — Day 04 assignment

← Back to [Day 03 — Functions, Scope & Hoisting](../Day-03-Functions-Scope/README.md)
