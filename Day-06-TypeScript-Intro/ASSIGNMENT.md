# Day 06 — Assignment

**Track 1 · Day 6 · TypeScript from Scratch — Data Types, Functions, Interfaces, Generics**

> Day 05 gave you a project that runs in Node **and** the browser. Today you make it tell you when it's wrong.
> You'll work through every TypeScript data type by hand, type functions, objects and classes, write generic helpers
> you'll reuse for the rest of the course, rewrite your Day 05 project in TypeScript — and hunt down the bugs your JavaScript was hiding all along.
> Same behaviour as Day 05. Every value typed. `npm run check` clean.

**⏱ Budget:** 14–16 hours · **📅 Duration:** 6 days · **🚩 Deadline:** before the next session

| # | Task | Part | Deliverable |
|---|---|---|---|
| 1 | Predict, then check | 1–5 | `predictions.md` + 1 screenshot |
| 2 | Data types lab | 2 | `types-lab.ts` + 1 screenshot |
| 3 | Special types lab | 2 | `special-lab.ts` + 1 screenshot |
| 4 | Functions & narrowing lab | 3 | `functions-lab.ts` + `narrowing-lab.ts` + 1 screenshot |
| 5 | Type your own database | 4 | `db-types.ts` + `typed-db.ts` + 1 screenshot |
| 6 | Discriminated unions & type guards | 3 | `states.ts` + `guards.ts` + 1 screenshot |
| 7 | Classes lab | 4 | `classes-lab.ts` + 1 screenshot |
| 8 | Generics lab | 5 | `generics-lab.ts` + 1 screenshot |
| 9 | Utility types lab | 5 | `utilities-lab.ts` + 1 screenshot |
| 10 | Build: the typed grade report | 5 | `project/` folder + 2 screenshots |
| 11 | Browser: typed DOM | 5 | `index.html` + `src/main.ts` + 2 screenshots |
| 12 | Migrate your own JavaScript — the bug hunt | 1–5 | `migrate/` folder + `BUG-HUNT.md` |
| 13 | Notes, repo and pull request | — | `NOTES.md` + repo link + merged PR link |
| 14 | Share it | — | LinkedIn post link |

> **Type every line by hand. Do not copy-paste.** You are building muscle memory, and `Ctrl+V` builds none.

> **Work on a branch.** Create `feature/day-06` before your first file, and run `npm run check` (or `npx tsc`) before **every** commit.

> **No `any`.** Not once, in any file you submit — except the one in Task 3 you're asked to write on purpose. If you're stuck, use `unknown` and narrow it, or ask.

---

## Task 1 — Predict, Then Check

Twenty-eight snippets. Put each one in its own file (`p01.ts` … `p28.ts`) inside `day-06/predictions/`.

These files are **full of errors on purpose**, so keep them out of your lab checks:

- Copy your `day-06/tsconfig.json` (README Step 1 — **including** `noUncheckedIndexedAccess`) into `day-06/predictions/`
- In `day-06/tsconfig.json`, change the last line to `"exclude": ["project", "predictions"]`
- Check the snippets with `npx tsc -p predictions` from `day-06/`; run them with `node predictions/p01.ts`

Every snippet gets **two** predictions:

- **A — `tsc`:** does `npx tsc` accept it? If not, which line, and what does the error say (in your own words is fine)?
- **B — `node`:** what does `node pNN.ts` print — or which runtime error does it throw?

They are often different. That difference is the lesson.

### 1.1 — Write Your Predictions First

- [ ] Create `predictions.md`
- [ ] For **each** snippet, write prediction **A** (tsc) and prediction **B** (node) — **before running anything**

```ts
// p01
let score = 92;
score = "92";
console.log(score);

// p02
const grade = "A";
let other = "A";
const g1: "A" | "B" = grade;
const g2: "A" | "B" = other;
console.log(g1, g2);

// p03
function add(a: number, b: number) { return a + b; }
console.log(add(2, "3" as any));

// p04
const scores = [90, 80];
const top = scores[5];
console.log(top.toFixed(1));

// p05
const found = [90, 80].find((n) => n > 95);
console.log(found.toFixed(1));

// p06
function greet(name?: string) { return `Hi ${name.toUpperCase()}`; }
console.log(greet());

// p07
const pair: [string, number] = ["Sara", 92, true];
console.log(pair);

// p08
interface Student { name: string; score: number }
const s: Student = { name: "Sara", score: 92, age: 20 };
console.log(s);

// p09
interface Student { name: string; score: number }
const data = { name: "Sara", score: 92, age: 20 };
const s: Student = data;
console.log(s);

// p10
interface Student { readonly id: number; tags: string[] }
const s: Student = { id: 1, tags: [] };
s.tags.push("ts");
console.log(s);

// p11
const raw: unknown = JSON.parse('{"name":"Sara"}');
console.log(raw.name);

// p12
const raw: any = JSON.parse('{"name":"Sara"}');
console.log(raw.nmae.toUpperCase());

// p13
function label(x: string | number) {
  if (typeof x === "string") return x.toUpperCase();
  return x.toFixed(1);
}
console.log(label("a"), label(2));

// p14
function first<T>(items: T[]): T { return items[0]; }
const n = first([1, 2, 3]);
const s = first(["a"]);
console.log(n + 1, s + 1);

// p15
function longest<T extends { length: number }>(a: T, b: T): T { return a.length >= b.length ? a : b; }
console.log(longest("abc", "de"), longest([1], [1, 2]));
console.log(longest(10, 20));

// p16
async function getScore(): Promise<number> { return 92; }
const score: number = getScore();
console.log(score);

// p17
async function getScore(): Promise<number> { return 92; }
const score = await getScore();
console.log(score.toFixed(1));

// p18
try { throw new Error("boom"); }
catch (err) { console.log(err.message); }

// p19
type Student = { name: string; score: number };
const s = { name: "Sara", score: 92 } as Student;
const t = { name: "Omar" } as Student;
console.log(s.score, t.score);

// p20
enum Grade { A, B }
console.log(Grade.A);

// p21
type Student = { name: string; score: number };
const update: Partial<Student> = { score: 80 };
const full: Required<Partial<Student>> = { score: 80 };
console.log(update, full);

// p22
const sizes = { S: 1, M: 2 };
type Size = keyof typeof sizes;
const a: Size = "M";
const b: Size = "L";
console.log(a, b);

// p23
console.log(typeof null, typeof [], typeof NaN, typeof 10n);

// p24
const list = [];
list.push(1);
list.push("two");
console.log(list);

// p25
let big = 10n;
big = big + 5;
console.log(big);

// p26
const pair: [string, number] = ["Sara", 92];
pair.push(100);
console.log(pair.length, pair);

// p27
const settings = { theme: "dark" } as const;
settings.theme = "light";
console.log(settings.theme);

// p28
const score: number = Number("12px");
console.log(score, typeof score, Number.isNaN(score));
```

### 1.2 — Now Check and Run Them

- [ ] Run `npx tsc -p predictions` once and record every error next to the right snippet
- [ ] Run `node pNN.ts` for every snippet and record the **actual** output
- [ ] For every prediction you got **wrong**, write one sentence explaining why
- [ ] Mark every snippet where **`tsc` rejects it but `node` runs it fine** — and explain in one sentence what that tells you about Node and types
- [ ] Mark every snippet where **`tsc` accepts it but `node` crashes or prints something wrong** — and name what let the bug through (`any`, `as`, a tuple `push`, …)
- [ ] For **#2, #4, #9, #10, #14, #19, #20, #23, #26 and #27** name the mechanism explicitly — these are the ones that cause real bugs
- [ ] Screenshot the full `npx tsc -p predictions` output

> Getting them wrong is the assignment. Getting them wrong and not explaining why is not.

**✅ Deliverable:** `predictions.md` with both predictions, both actuals, and explanations + screenshot.

---

## Task 2 — Data Types Lab

Create `types-lab.ts`. Run it with `node` **and** check it with `npx tsc` after every part. Use your **own** data — your Day 04 scores, your classmates, your courses — not the README's.

### 2.1 — Annotate and Infer

- [ ] Declare five variables **without** annotations — a string, a number, a boolean, an array and a `const` string — and write the type TypeScript inferred for each in a comment (hover to check)
- [ ] Declare one variable **with** an annotation that TypeScript could have inferred, and comment why you'd normally leave it out
- [ ] Reassign a `let` number to a string, record the error, then remove the line
- [ ] Show the difference between `let x = "A"` and `const y = "A"` by hovering, and explain it in a comment

### 2.2 — The Primitives

- [ ] One `string` built with a template literal, and three string methods on it
- [ ] Three `number`s — a whole number, a decimal and a negative — and print `0.1 + 0.2`, `10 / 0` and `Number("abc")` with a comment on each
- [ ] A `boolean` computed from a comparison
- [ ] A `bigint` larger than `Number.MAX_SAFE_INTEGER`, one correct calculation with it, and one mixed with a `number` that TypeScript rejects
- [ ] Two `symbol`s with the same description, and prove they're not equal
- [ ] A `string | null` and a `string | undefined` variable — and a comment on when you'd use each
- [ ] Assign `null` to a plain `string` and record the error

### 2.3 — Arrays, Tuples, Objects

- [ ] A `number[]` of your own scores, with `map`, `filter` and `reduce` — hover and comment the inferred type of each result
- [ ] An empty array with and without an annotation — show what TypeScript infers for each
- [ ] A mixed `(string | number)[]`, and the `string | number[]` mistake with its error
- [ ] A `readonly` array and a rejected `push`
- [ ] A named tuple with an optional element, and a function that returns a tuple you destructure
- [ ] An object type with at least one optional property, nested one level deep, with an array of objects inside it
- [ ] Add a property that isn't in the type, and record the error

### 2.4 — Conversions and `typeof`

- [ ] Convert a form-style string (`"68"`) to a number three ways: `Number()`, `Number.parseInt()`, and unary `+` — and one input where they give different results
- [ ] Convert a number to a string, and five values to booleans — including every falsy value
- [ ] Print a `typeof` table for one value of each primitive **and** `null`, and comment on the `null` row
- [ ] Prove in one line that a type annotation does **not** convert: `const n: number = "5" as unknown as number;` then `console.log(typeof n)` — and explain what happened

**✅ Deliverable:** `types-lab.ts` (with `npx tsc` clean at the end) + screenshot of the `node` output.

---

## Task 3 — Special Types Lab

Create `special-lab.ts`.

### 3.1 — `any`, `unknown`, `void`, `never`

- [ ] Write **one** `any` on purpose, and show a bug it lets through that crashes at runtime — wrapped in `try` / `catch` so the file keeps running
- [ ] Change it to `unknown`, record the error that now catches the bug, and narrow the `unknown` with `typeof` / `in` until it's safe to use
- [ ] A `void` function, and a comment on the difference between `void` and `undefined`
- [ ] A `never` function that always throws, used inside `try` / `catch`
- [ ] Write a function without a parameter type, and record the implicit-`any` error

### 3.2 — Literals, Unions, Intersections, Aliases

- [ ] Two literal unions of your own — one of strings, one of numbers — each with an invalid value recorded
- [ ] A union of two different kinds, like `number | string`, and a function that accepts it
- [ ] A `type` alias for an object shape, and a second one combined with it using `&`
- [ ] A variable of the intersection type, and one missing property recorded as an error

### 3.3 — Enums and `as const`

- [ ] Write a real `enum` — record the editor error **and** Node's runtime error — then delete it
- [ ] Rebuild it as an `as const` object plus a derived union type
- [ ] A function that takes that union, called once with the object property and once with the plain string, plus one invalid call recorded
- [ ] Hover over the derived type and paste what TypeScript shows in a comment

### 3.4 — Assertions

- [ ] Use `as` on parsed JSON that **does** match, and once on JSON that **doesn't** — print a property that turns out `undefined` despite its type
- [ ] Freeze an object with `as const`, and record the error when you try to change it
- [ ] Use `!` once, show it compiles but crashes when you're wrong, then replace it with a proper check
- [ ] In a comment: when is `as` acceptable, and what should you use instead for outside data?

**✅ Deliverable:** `special-lab.ts` + screenshot of the output.

---

## Task 4 — Functions & Narrowing Lab

### 4.1 — `functions-lab.ts`

- [ ] A function with typed parameters **and** a typed return, as a `function` and again as an arrow function
- [ ] A function with one **default** and one **optional** parameter that handles the missing case with `??`
- [ ] A **rest** parameter function, called with zero, one and five arguments
- [ ] A function with a **destructured** object parameter
- [ ] A **function type** alias, and two different functions that fit it
- [ ] A function that takes a callback of that type — and hover to show the callback's parameter is typed with no annotation
- [ ] An `async` function returning `Promise<…>`, and prove that assigning it to a plain type without `await` is an error
- [ ] An overloaded function with two signatures, and hover to show the two different return types
- [ ] Call functions with the wrong number of arguments and the wrong type — record both errors, then fix them

### 4.2 — `narrowing-lab.ts` — Literal Unions

- [ ] `type LetterGrade = "A" | "B" | "C" | "D" | "F"` and a `letterGrade(score: number): LetterGrade`
- [ ] A `switch` over every `LetterGrade` that returns a message for every case — then delete one case and record the error

### 4.3 — `narrowing-lab.ts` — Narrowing

- [ ] `parseScore(input: number | string | null | undefined): number | null` that handles every member, using `typeof`, `===` and `Number.isNaN`
- [ ] Hover over the parameter inside each branch and write the narrowed type in a comment next to it
- [ ] A function taking `string | string[]` that narrows with `Array.isArray` and always returns a `string[]`
- [ ] A function taking `Error | string` that narrows with `instanceof`
- [ ] A function taking `{ name: string } | { title: string }` that narrows with `in`

### 4.4 — `narrowing-lab.ts` — `null` and `undefined`

- [ ] Use `.find()` and handle the `undefined` three ways: an `if`, `?.`, and `??`
- [ ] Read an array element by index and handle the `undefined` that `noUncheckedIndexedAccess` adds

**✅ Deliverable:** `functions-lab.ts` + `narrowing-lab.ts` + screenshot of the output.

---

## Task 5 — Type Your Own Database

Take **your own** Day 05 `promise-db.js` — the one with four tables, promisified.

### 5.1 — `db-types.ts` — The Shapes

- [ ] An `interface` for **every** table in your database — at least four
- [ ] Every id field is `readonly`
- [ ] At least **two** optional properties, where the data genuinely might be missing
- [ ] At least **one** literal-union property (a level, a status, a track…)
- [ ] At least **one** interface that `extends` another
- [ ] At least **one** `type` built with `&`
- [ ] Every export uses `export interface` / `export type`

### 5.2 — `typed-db.ts` — The Functions

- [ ] Import the shapes with `import type` from `./db-types.ts`
- [ ] Your tables as `Record<number, …>` constants
- [ ] Your `lookup` helper, typed — it must return `Promise<T>` for whatever table it's given (a generic — Part 5; it's fine to come back to this after Task 8)
- [ ] Every `get…` function with typed parameters and a `Promise<…>` return type
- [ ] Your Day 05 `buildReport(id)` with `async` / `await`, returning a typed object (write an interface for it)
- [ ] Print one report line and one error line from a `main` with `try` / `catch`, using a safe `errorMessage(err: unknown)`

### 5.3 — Break It

- [ ] Misspell a property name in one of your table rows — record the error
- [ ] Leave out a required property — record the error
- [ ] Reassign a `readonly` id — record the error
- [ ] Change `import type` to a plain `import` and run it with `node` — record the runtime error
- [ ] In a comment, list any **real** mistake in your Day 04/05 data that the types found

**✅ Deliverable:** `db-types.ts` + `typed-db.ts` + screenshot of the output.

---

## Task 6 — Discriminated Unions & Type Guards

### 6.1 — `states.ts` — The `status` Pattern

- [ ] A `LoadState` union with **at least four** members, each with a `status` literal and its own data
- [ ] A `describe(state)` function using `switch (state.status)` that reads each member's **own** data
- [ ] An exhaustive `default` using `const unreachable: never = state`
- [ ] Add a fifth member **without** handling it — screenshot the `never` error — then handle it
- [ ] Try to read a property from the wrong member inside a `case` — record the error
- [ ] A second union of your own — e.g. a form `Step`, a payment `Status`, a `Notification` — with at least three members
- [ ] Rewrite Day 05's `Promise.allSettled` loop so it narrows on `status` and reads `value` / `reason` safely — with an explicit type annotation of `PromiseSettledResult<…>[]`

### 6.2 — `guards.ts` — Untrusted Data

- [ ] Write `isStudent(value: unknown): value is Student`, checking **every** required property's type
- [ ] Also check at least one **range** — a score between 0 and 100
- [ ] A JSON string of at least **six** records, where at least **three** are broken in different ways (wrong type, missing field, out of range, not an object)
- [ ] Parse it as `unknown`, check `Array.isArray`, and use `raw.filter(isStudent)` to get a `Student[]`
- [ ] Print the valid names and the number rejected
- [ ] Change the guard's return type to `boolean`, and show in a comment what type `filter` gives you now — then change it back
- [ ] Write a guard for a **second** shape from your Task 5 database
- [ ] In a comment, explain the difference between `raw as Student` and `isStudent(raw)`

**✅ Deliverable:** `states.ts` + `guards.ts` + screenshot of the output **and** the `never` error.

---

## Task 7 — Classes Lab

Create `classes-lab.ts`, modelling something from your **own** Task 5 database as a class.

### 7.1 — A Class

- [ ] An `interface` describing what the object can do, with at least one `readonly` property and two methods
- [ ] A class that `implements` it, with every field declared and typed before the constructor
- [ ] At least one `readonly` field set in the constructor, and one `#private` field
- [ ] A method that validates its input and throws on bad data
- [ ] A getter, and a `static` counter
- [ ] A method that returns `this`, and a chain of three calls

### 7.2 — Inheritance

- [ ] A second class that `extends` the first, calls `super(…)`, and adds a field
- [ ] One method replaced with `override`, calling `super.method()` inside it
- [ ] An array typed as the **interface**, holding objects of **both** classes, processed in one loop
- [ ] Use `instanceof` to find the child-class objects in that array

### 7.3 — Break It

- [ ] Reassign a `readonly` field, and read a `#private` field from outside — record both errors
- [ ] Delete a method the interface requires, and record the `implements` error
- [ ] Try `constructor(private name: string)`, and record the `erasableSyntaxOnly` error
- [ ] Try `instanceof` on the interface, and record the error — then explain in a comment why interfaces can't be checked at runtime

**✅ Deliverable:** `classes-lab.ts` + screenshot of the output.

---

## Task 8 — Generics Lab

Create `generics-lab.ts`. **No `any` anywhere in it.**

### 8.1 — Generic Functions

- [ ] `first<T>(items: T[]): T | undefined` and `last<T>(…)`, called with three different types — hover and comment the inferred type each time
- [ ] `findById<T extends { id: number }>(…)`, used on **two** of your Task 5 tables — and one call that the constraint rejects
- [ ] `pluck<T, K extends keyof T>(items: T[], key: K): T[K][]` — one valid call per type of key, and one invalid key that TypeScript rejects
- [ ] `groupBy<T, K extends string>(items: T[], keyOf: (item: T) => K): Partial<Record<K, T[]>>` — group your students by letter grade
- [ ] `unique<T>(items: T[]): T[]` using a `Set<T>`

### 8.2 — Generic Types

- [ ] `type Result<T> = { ok: true; value: T } | { ok: false; error: string }`
- [ ] `safeParse<T>(json, check)` returning `Result<T>`, tested with a valid input, a wrong-shaped input and invalid JSON
- [ ] Prove that reading `result.value` without checking `result.ok` is an error
- [ ] A generic `interface Store<T extends { id: number }>` with `add`, `get`, `all` and `remove`
- [ ] `createStore<T>()` implemented with a closure over a `Map<number, T>` — two stores for two different tables
- [ ] Try to `add` the wrong shape to one store — record the error

### 8.3 — Generic Async

- [ ] `withTimeout<T>(promise: Promise<T>, ms: number): Promise<T>` — prove the result type follows the input by hovering
- [ ] `retry<T>(fn: () => Promise<T>, times: number): Promise<T>` — with **no** "lacks ending return statement" error and **no** `err.message` on an `unknown`
- [ ] `mapAsync<T, U>(items: T[], fn: (item: T) => Promise<U>): Promise<U[]>` using `Promise.all`
- [ ] Call all three on your Task 5 database functions

**✅ Deliverable:** `generics-lab.ts` + screenshot of the output.

---

## Task 9 — Utility Types Lab

Create `utilities-lab.ts`, using one interface from your Task 5 database.

- [ ] `type New… = Omit<…, "id">` and an `add…(input)` function that assigns the id
- [ ] `type …Update = Partial<Omit<…, "id">>` and an `update…(id, changes)` that uses spread — no mutation
- [ ] Prove `update…` rejects an `id`, and a wrong value type
- [ ] `Pick<…>` for a public "card" view, and a function that produces one
- [ ] `Readonly<…>` on one object, and one rejected assignment
- [ ] `Record<LetterGrade, number>` for a full grade tally, initialised with **every** grade at `0`
- [ ] `ReturnType<typeof …>` and `Awaited<…>` to reuse the type of one of your `async` functions without rewriting it
- [ ] An `as const` array, and a union type derived from it with `(typeof X)[number]`
- [ ] Add one property to the base interface and record which lines turned red — in a comment, say why that's a good thing

**✅ Deliverable:** `utilities-lab.ts` + screenshot of the output.

---

## Task 10 — Build: The Typed Grade Report

The main build. Your **own** Day 05 `project/` — rewritten in TypeScript. Same data, same output, same `lib/` split, every value typed.

### 10.1 — Setup

- [ ] Create `day-06/project/` with this shape (add more files if you need them):

```
day-06/project/
├── package.json
├── package-lock.json
├── tsconfig.json
├── students.json
├── index.html
└── src/
    ├── types.ts
    ├── report.ts
    ├── main.ts
    └── lib/
        ├── index.ts
        ├── grade-lib.ts
        ├── async-utils.ts
        ├── list-utils.ts
        └── db.ts
```

- [ ] `typescript` and `@types/node` are **dev** dependencies
- [ ] `tsconfig.json` has `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `erasableSyntaxOnly` and `rewriteRelativeImportExtensions`, with `src` → `dist`
- [ ] `package.json` has `"type": "module"` and the four scripts: `report`, `check`, `build`, `start`
- [ ] `dist/` and `node_modules/` are in `.gitignore` — prove neither appears in `git status`

### 10.2 — `types.ts`

- [ ] `Student`, `GradedStudent` (with `extends`) and `LetterGrade` — plus any shape your own Day 05 project had that the README's didn't
- [ ] At least one `readonly` and one optional property
- [ ] Only types — no runtime code at all

### 10.3 — `lib/`

- [ ] **Start from your own Day 05 JavaScript.** Rename each file to `.ts`, run `npm run check`, and paste the **first** error list into `NOTES.md` before fixing anything
- [ ] `grade-lib.ts` — every function typed, `letterGrade` returns `LetterGrade`, plus an `isStudent` type guard
- [ ] `async-utils.ts` — generic `withTimeout<T>` and `retry<T>`, plus `errorMessage(err: unknown)`
- [ ] `list-utils.ts` — at least one generic helper (`countBy`, `groupBy`…) used by the report
- [ ] `db.ts` — `getAttendance(id: number): Promise<number>`, failing for at least one student
- [ ] `index.ts` — a barrel re-exporting what `report.ts` and `main.ts` need
- [ ] Every type-only import uses `import type`
- [ ] Every relative import ends in `.ts`

### 10.4 — `report.ts`

- [ ] `students.json` has at least **two** broken records, and the report skips and counts them — using the type guard, not a hand-written `if`
- [ ] `JSON.parse` result is annotated `unknown` — no `any` reaches your code
- [ ] Top-level `await`, `withTimeout` on the file read, `Promise.allSettled` + `retry` for attendance — like Day 05
- [ ] Every `catch` uses `errorMessage` — no `err.message` on an `unknown`
- [ ] Prints the header, one row per valid student (failed attendance shown as `—`), the average, passed count, skipped count and a typed grade tally
- [ ] Has **no** grading logic of its own — only imports, calls and `console.log`

### 10.5 — Prove It

- [ ] `npm run check` prints nothing — screenshot it
- [ ] `npm run report` works — screenshot it
- [ ] `npm run build` then `npm start` prints the same report from `dist/`
- [ ] Open `dist/lib/grade-lib.js` and confirm the types and `import type` lines are gone, and imports end in `.js`
- [ ] Break it three ways from README Step 15 — `import` without `type`, a renamed property in `types.ts`, a wrong `countBy` key — and record each error

**✅ Deliverable:** `project/` folder + screenshots of `npm run check` and `npm run report`.

---

## Task 11 — Browser: Typed DOM

In `day-06/project/`, rewrite your Day 05 `main.js` as `src/main.ts`. It imports the **same** `lib/` as `report.ts`.

### 11.1 — The Page

- [ ] `index.html` sits in `project/` and loads `./dist/main.js` with `type="module"`
- [ ] Every element is looked up through a typed helper (like the README's `$<T>`) or `querySelector<T>` + a `null` check — no unchecked `getElementById`
- [ ] Every element has its **specific** type: `HTMLInputElement`, `HTMLButtonElement`, `HTMLUListElement`…
- [ ] `students` is typed as `GradedStudent[]`
- [ ] Handlers are wired with `addEventListener`, and each has a typed signature (`(): void`, `(): Promise<void>`)

### 11.2 — Behaviour

- [ ] A **Load students** button — `async` handler, `try` / `catch` / `finally`, button disabled while loading and re-enabled **only** in `finally`
- [ ] The fetched JSON is `unknown`, and only records that pass `isStudent` are shown — the status line says how many were skipped
- [ ] Attendance for every loaded student is fetched in parallel with the imported `getAttendance`, and a failed one shows `—`
- [ ] An **Add** form using `valueAsNumber` that rejects empty names, `NaN`, and scores outside 0–100
- [ ] A summary line with the imported `average` and `letterGrade`
- [ ] Your page state is a **discriminated union** (`idle` / `loading` / `loaded` / `failed`, or your own) rendered with an exhaustive `switch`

### 11.3 — Prove It

- [ ] Runs through **Live Server** after `npm run build`
- [ ] Screenshot a successful load with skipped records **and** a `—` attendance, DevTools console open
- [ ] Change an id in `index.html`, rebuild, and screenshot your own clear "missing element" error
- [ ] Run `npx tsc --watch` in a second terminal and prove a save in `main.ts` reaches the browser after a reload

**✅ Deliverable:** `index.html` + `src/main.ts` + 2 screenshots.

---

## Task 12 — Migrate Your Own JavaScript: The Bug Hunt

TypeScript earns its keep on code that already exists. Prove it on yours.

### 12.1 — Pick and Rename

- [ ] Copy **two** of your own JavaScript files from Days 02–05 into `day-06/migrate/` — at least one must be 40+ lines
- [ ] Rename them to `.ts` and run `npx tsc` — **before** changing anything
- [ ] Record the total number of errors in `BUG-HUNT.md`

### 12.2 — Fix Them Properly

- [ ] Fix every error by describing the real data — interfaces, parameter types, narrowing — **never** with `any`, `as` or `!`
- [ ] If you use `// @ts-expect-error` at all, each one has a written reason
- [ ] `npx tsc` is clean and both files still run with `node` and produce the same output as before

### 12.3 — `BUG-HUNT.md`

- [ ] A table with one row per error: the error code, the line, and whether it was a **real bug** or just **missing type information**
- [ ] For every **real bug**: the input that would have triggered it, and what would have happened at runtime
- [ ] One paragraph: which kind of error was most common, and what that says about how you wrote JavaScript

> If you found zero real bugs, look again at every `.find()`, every `catch`, every array index and every `JSON.parse`.

**✅ Deliverable:** `migrate/` folder + `BUG-HUNT.md`.

---

## Task 13 — Notes, Repo and Pull Request

### 13.1 — Repo Structure

- [ ] Your repo now looks like this:

```
javascript-everywhere/
├── .gitignore               ← includes node_modules/ and dist/
├── README.md
├── day-01/ … day-05/
└── day-06/
    ├── NOTES.md
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── predictions.md
    ├── predictions/
    ├── hello.ts, reading-errors.ts, primitives.ts, collections.ts, special-types.ts
    ├── functions.ts, narrowing.ts, results.ts, shapes.ts, classes.ts, generics.ts, utility-types.ts
    ├── types-lab.ts
    ├── special-lab.ts
    ├── functions-lab.ts
    ├── narrowing-lab.ts
    ├── db-types.ts
    ├── typed-db.ts
    ├── states.ts
    ├── guards.ts
    ├── classes-lab.ts
    ├── generics-lab.ts
    ├── utilities-lab.ts
    ├── migrate/
    │   └── BUG-HUNT.md
    └── project/
```

- [ ] Add a Day 06 row to your root `README.md` table of contents

### 13.2 — `day-06/NOTES.md`

**In your own words** — not the README's words.

**Part 1 — Getting Started:**

- [ ] What TypeScript is, and what "types are erased" means — with your own drawing
- [ ] Why `node file.ts` running is **not** proof your code is correct
- [ ] How to read an error: the five parts, and the three error codes you met most

**Part 2 — Data Types:**

- [ ] When you annotate, and when you let TypeScript infer — and why `let` and `const` infer differently
- [ ] The seven primitives, one line each, with one surprise from `number`
- [ ] `null` vs `undefined`, and what `strict` changes about them
- [ ] Arrays vs tuples vs object types — when you'd use each
- [ ] `any` vs `unknown` vs `as` — one line each, and which one you use for outside data
- [ ] Why `enum` doesn't work in today's setup, and the `as const` pattern that replaces it

**Part 3 — Functions & Narrowing:**

- [ ] Optional, default and rest parameters — one example each
- [ ] Narrowing — how an ordinary `if` changes a variable's type, with an example
- [ ] Discriminated unions — why they beat a `loading` boolean plus an `error` string
- [ ] Type guards — "types describe; guards verify"

**Part 4 — Objects:**

- [ ] `interface` vs `type` — and the rule you'll follow
- [ ] Structural typing — why `fromForm` fits `Student`, but the `scor` typo didn't
- [ ] `#private` vs `private`, and `readonly` — what each protects, and when
- [ ] Why `instanceof` works on a class but not on an interface

**Part 5 — Generics & the Project:**

- [ ] Why generics exist — the `any` vs copy-paste problem, in your own example
- [ ] What `<T extends { id: number }>` and `<K extends keyof T>` each mean
- [ ] Your three most useful utility types, and a real use for each
- [ ] Every line of your project's `tsconfig.json`, one sentence each
- [ ] Node runs / `tsc` checks / `tsc` builds — which script you run when
- [ ] Why `import type` and `.ts` extensions are needed, and why the browser loads `dist/`
- [ ] Your Task 10.3 first error list, and what it taught you about your Day 05 code

**Everything:**

- [ ] **One bug you hit**, the exact error message, and how you fixed it

> The bug section is not optional. If nothing broke, you copy-pasted.

### 13.3 — Commits and PR

- [ ] At least **six** commits on `feature/day-06`, each one logical change with an imperative message
- [ ] `npm run check` was clean before every commit — no commit message says "fix types" for a commit that broke them
- [ ] `node_modules/` and `dist/` are **not** in your repo — search GitHub to prove it
- [ ] Opened a pull request with a **What / Why / How to test** description, with `npm run check` under **How to test**
- [ ] Left yourself one review comment on a line in **Files changed**
- [ ] Merged the PR, deleted the branch on GitHub, then `git pull` and `git branch -d` locally
- [ ] Run `git log --oneline --graph -20` and screenshot it

**✅ Deliverable:** repo link + merged PR link + `git log` screenshot.

---

## Task 14 — Share It

- [ ] Post on **LinkedIn** about completing Day 6
- [ ] Include a screenshot of a **real** error TypeScript caught in your own code — Task 10.3 or Task 12
- [ ] Include the link to your repo **and** your merged pull request
- [ ] Show one before-and-after: a Day 05 function next to its typed Day 06 version, **or** your `BUG-HUNT.md` table
- [ ] Say one concrete thing you understood that you didn't before — why Node runs code with type errors, what `unknown` protects you from, what a discriminated union replaces, why `retry` needed a `throw` at the end. Not "excited to continue my journey".

**✅ Deliverable:** the link to your post.

---

## Bonus (Optional)

- [ ] Add a GitHub **Actions** workflow that runs `npm ci` and `npm run check` on every pull request — and screenshot a PR where it failed, then passed
- [ ] Install **Zod**, write a `StudentSchema`, derive the `Student` type with `z.infer`, and replace your hand-written `isStudent`
- [ ] Write `deepReadonly<T>`-style protection with a recursive `DeepReadonly<T>` type, and prove nested mutation is rejected
- [ ] Write a generic `EventEmitter<Events extends Record<string, unknown>>` with typed `on` and `emit`
- [ ] Use a **template literal type** — e.g. `` type Route = `/students/${number}` `` — and show one accepted and one rejected value
- [ ] Use `satisfies` to type-check a config object while keeping its literal types, and explain the difference from an annotation
- [ ] Turn on `exactOptionalPropertyTypes` in your project, fix whatever it finds, and explain the rule in `NOTES.md`
- [ ] Add JSDoc comments to your `lib/` exports, and screenshot them showing up on hover in `main.ts`
- [ ] Write a `.d.ts` file for a small untyped JavaScript helper of your own, and import it from TypeScript
- [ ] Open a pull request on a classmate's repo that removes an `any` or adds a missing type guard

---

## Submission Checklist

- [ ] **Task 1** — `predictions.md` with both predictions, both actuals, and explanations + screenshot
- [ ] **Task 2** — `types-lab.ts` + screenshot
- [ ] **Task 3** — `special-lab.ts` + screenshot
- [ ] **Task 4** — `functions-lab.ts` + `narrowing-lab.ts` + screenshot
- [ ] **Task 5** — `db-types.ts` + `typed-db.ts` + screenshot
- [ ] **Task 6** — `states.ts` + `guards.ts` + screenshot (include the `never` error)
- [ ] **Task 7** — `classes-lab.ts` + screenshot
- [ ] **Task 8** — `generics-lab.ts` + screenshot
- [ ] **Task 9** — `utilities-lab.ts` + screenshot
- [ ] **Task 10** — `project/` + screenshots of `npm run check` and `npm run report`
- [ ] **Task 11** — `index.html` + `src/main.ts` + 2 screenshots
- [ ] **Task 12** — `migrate/` + `BUG-HUNT.md`
- [ ] **Task 13** — repo link, merged PR link, `NOTES.md`, `git log` screenshot
- [ ] **Task 14** — LinkedIn post link

Submit all links together before the next session.

---

## How This Is Graded

| Level | What it looks like |
|---|---|
| ❌ **Incomplete** | Copy-pasted README code, predictions written after running, any `any` you weren't asked for, errors silenced with `as` / `!` / `@ts-ignore`, `JSON.parse` or `catch (err)` used without narrowing, `npm run check` failing, `dist/` or `node_modules/` committed, everything done on `main`, no merged PR, or code you can't explain line by line |
| ✅ **Done** | All fourteen tasks, your **own** database and Day 05 project typed, a type guard at every boundary, generic helpers with real constraints, a discriminated union with an exhaustive `switch`, one `lib/` running in Node **and** the browser, `npm run check` clean, a bug hunt with real bugs found, `NOTES.md` in your own words, a merged PR |
| 🔥 **10%** | Done + the bonus + a project that does something beyond the spec + notes someone else could actually learn from |

---

## A Reminder

> **90%** study only — free, self-paced, no assignments turned in.
> **10%** study + assignments + more — I personally help this group get there.
>
> **If you show up for the 10%, I show up for you.**

The next session is **Day 07 — APIs, Web Basics + Project: Task Manager** — where the `unknown`, the type guards and the `Result<T>` you wrote today meet real data from a real server, inside the app that closes Track 1. Come with `npm run check` clean and your PR merged.

---

← Back to [Day 06 README](README.md)
