# Day 06 — Assignment

**Track 1 · Day 6 · TypeScript from Scratch, APIs, Web Basics + Project: Task Manager**

> Day 05 gave you a project that runs in Node **and** the browser. Today you make it tell you when it's wrong — then make it talk to a real server.
> **Tasks 1–12:** every TypeScript data type by hand, functions, objects and classes, generic helpers, your Day 05 project in TypeScript, and a bug hunt.
> **Tasks 13–22:** real APIs, every way a request fails, a typed client, HTML/CSS foundations, and a **Task Manager** app — plus a feature of your own, through every layer.
> **Tasks 23–24:** notes, a Track 1 retrospective, and sharing it.

**⏱ Budget:** 26–30 hours · **📅 Duration:** 10–12 days · **🚩 Deadline:** before the next session

> **This is two weeks of work.** Do it in two halves: finish Tasks 1–12 and commit them before starting Task 13.

| # | Task | Part | Deliverable |
|---|---|---|---|
| 1 | Predict, then check — TypeScript | 1–5 | `predictions.md` + 1 screenshot |
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
| 13 | Predict, then run — APIs & DOM | 6–8 | `predictions-api.md` + 1 screenshot |
| 14 | HTTP & `fetch` lab — a real public API | 6 | `github-lab.ts` + 1 screenshot |
| 15 | CRUD lab — the Task API by hand | 6 | `crud-lab.ts` + `curl.md` + 1 screenshot |
| 16 | Failure lab — every way it breaks | 7 | `failures-lab.ts` + 1 screenshot |
| 17 | The typed client | 7 | `http.ts` + `api.ts` + `smoke.ts` + 1 screenshot |
| 18 | HTML — structure and accessibility | 8 | `index.html` + `layout-lab.html` + 1 screenshot |
| 19 | CSS — Grid, Flexbox, responsive, dark mode | 8 | `styles.css` + 3 screenshots |
| 20 | Build: the Task Manager | 9 | `main.ts` + 2 screenshots |
| 21 | Your feature, through every layer | 9 | code + `FEATURE.md` + 1 screenshot |
| 22 | Break it — and prove it survives | 7 + 9 | `BREAK-IT.md` + 5 screenshots |
| 23 | Notes, repo, PRs — and a Track 1 retrospective | — | `NOTES.md` + `RETRO.md` + repo link + merged PR link |
| 24 | Share it | — | LinkedIn post link |

> **Type every line by hand. Do not copy-paste.** The **one** exception is `task-manager/src/server/server.ts` from README Step 20 — you may copy it. You'll write your own servers in Track 2.

> **Work on a branch** (`feature/day-06`), run `npm run check` (or `npx tsc`) before **every** commit, and from Task 15 on keep **`npm run api`** running in its own terminal.

> **No `any`** — except the one in Task 3 you're asked to write on purpose. No `innerHTML` with data. No `<div>` buttons. Anywhere.

---

## Task 1 — Predict, Then Check

Twenty-eight snippets. Put each one in its own file (`p01.ts` … `p28.ts`) inside `day-06/predictions/`.

These files are **full of errors on purpose**, so keep them out of your lab checks:

- Copy your `day-06/tsconfig.json` (README Step 1 — **including** `noUncheckedIndexedAccess`) into `day-06/predictions/`
- In `day-06/tsconfig.json`, change the last line to `"exclude": ["project", "task-manager", "predictions"]`
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

## Task 13 — Predict, Then Run

Twenty-one snippets. **#1–#18** are TypeScript files for Node — put each in `day-06/predictions-api/pNN.ts`, with a copy of your lab `tsconfig.json` in that folder (like Task 13), and add `"predictions-api"` to the lab config's `exclude`. **#19–#21** are HTML files — open them in the browser with the DevTools console open.

**Before running #1–#18:** stop the Task API, delete `task-manager/data/`, and start it again — so everyone starts from the same three seed tasks. Run the snippets **in order**; some change the data.

### 13.1 — Write Your Predictions First

- [ ] Create `predictions-api.md`
- [ ] For **each** snippet, write the exact output, or the exact error name — **before running anything**
- [ ] For **#16** and **#18**, also predict: does `npx tsc -p predictions-api` accept it?

```ts
// p01
const res = await fetch("http://localhost:3000/api/tasks/999");
console.log(res.ok, res.status);

// p02
try {
  const res = await fetch("http://localhost:3000/api/tasks/999");
  console.log("no throw", res.status);
} catch {
  console.log("threw");
}

// p03
try {
  await fetch("http://localhost:3999/api/tasks");
  console.log("ok");
} catch (err) {
  console.log(err instanceof Error ? err.name : "?");
}

// p04
const res = await fetch("http://localhost:3000/api/tasks/1");
const a: unknown = await res.json();
const b: unknown = await res.json();
console.log(a, b);

// p05
const pending = fetch("http://localhost:3000/api/tasks");
console.log(pending instanceof Promise);
const res = await pending;
console.log(typeof res.json, Array.isArray(res));

// p06
const res = await fetch("http://localhost:3000/api/tasks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "  Trim me  " }),
});
const task = (await res.json()) as { title: string; priority: string; done: boolean };
console.log(res.status, JSON.stringify(task.title), task.priority, task.done);

// p07
const url = "http://localhost:3000/api/tasks/3";
const first = await fetch(url, { method: "DELETE" });
const second = await fetch(url, { method: "DELETE" });
console.log(first.status, second.status);

// p08
const res = await fetch("http://localhost:3000/api/tasks/1", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ done: "yes" }),
});
console.log(res.status, await res.text());

// p09
const res = await fetch("http://localhost:3000/api/tasks/1", { method: "PUT" });
console.log(res.status, res.statusText);

// p10
const res = await fetch("http://localhost:3000/");
console.log(res.status, res.headers.get("content-type"));
const data: unknown = await res.json();
console.log(data);

// p11
const u = new URL("https://example.com/search");
u.searchParams.set("q", "tom & jerry");
u.searchParams.set("page", "2");
console.log(u.search);
console.log(new URL("/api/tasks?q=a%20b", "http://localhost:3000").searchParams.get("q"));

// p12
console.log("start");
fetch("http://localhost:3000/api/tasks").then(() => console.log("response"));
setTimeout(() => console.log("timer"), 0);
Promise.resolve().then(() => console.log("microtask"));
console.log("end");

// p13
const controller = new AbortController();
controller.abort();
const outcome = await fetch("http://localhost:3000/api/tasks", { signal: controller.signal })
  .then((res) => `status ${res.status}`)
  .catch((err: Error) => err.name);
console.log(outcome);

// p14
const results = await Promise.all([
  fetch("http://localhost:3000/api/tasks/1"),
  fetch("http://localhost:3000/api/tasks/999"),
]);
console.log(results.map((r) => r.status));

// p15
const results = await Promise.allSettled([
  fetch("http://localhost:3000/api/tasks/1"),
  fetch("http://localhost:3999/api/tasks/1"),
]);
console.log(results.map((r) => r.status));

// p16
const res = await fetch("http://localhost:3000/api/tasks", {
  method: "POST",
  body: { title: "Object body" },
});
console.log(res.status);

// p17
const res = await fetch("http://localhost:3000/api/tasks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Hi", priority: "urgent" }),
});
const body = (await res.json()) as { error: string };
console.log(res.status, body.error);

// p18
const res = await fetch("http://localhost:3000/api/tasks/1");
const data = await res.json();
console.log(data.titel.toUpperCase());
```

```html
<!-- p19.html -->
<!DOCTYPE html>
<div id="box"></div>
<script>
  const box = document.getElementById("box");
  box.textContent = "<b>bold?</b>";
  console.log(box.children.length, box.innerHTML);
  box.innerHTML = "<b>bold?</b>";
  console.log(box.children.length, box.textContent);
</script>

<!-- p20.html -->
<!DOCTYPE html>
<form id="f">
  <input name="title" value="Buy milk" />
  <button id="b">Save</button>
</form>
<script>
  const form = document.getElementById("f");
  document.getElementById("b").addEventListener("click", () => console.log("click"));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("submit", new FormData(form).get("title"));
  });
  document.getElementById("b").click();
</script>

<!-- p21.html -->
<!DOCTYPE html>
<ul id="list"><li data-id="7"><button data-action="delete">✕</button></li></ul>
<script>
  const list = document.getElementById("list");
  list.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    console.log("ul heard it from", e.target.tagName, "for task", li.dataset.id, typeof li.dataset.id);
  });
  list.querySelector("li").addEventListener("click", () => console.log("li"));
  list.querySelector("button").click();
</script>
```

### 13.2 — Now Run Them

- [ ] Run every snippet and record the **actual** result next to each prediction
- [ ] For every one you got **wrong**, write one sentence explaining why
- [ ] For **#1, #2, #4, #7, #10, #12, #14 vs #15, #18 and #20** name the mechanism explicitly — these are the ones that cause real bugs
- [ ] For **#16** and **#18**, explain why `tsc` caught one and not the other
- [ ] Screenshot the output

> Getting them wrong is the assignment. Getting them wrong and not explaining why is not.

**✅ Deliverable:** `predictions-api.md` with predictions, actuals, and explanations + screenshot.

---

## Task 14 — HTTP & `fetch` Lab: A Real Public API

Create `github-lab.ts`, using GitHub's public API. Mind the limit: 60 requests an hour.

### 14.1 — Read

- [ ] Fetch **your own** GitHub user, and print `status`, `ok`, `statusText` and the `content-type` header
- [ ] Print the `x-ratelimit-remaining` header, and explain in a comment what it is
- [ ] A `GitHubUser` interface and an `isGitHubUser` type guard — the JSON is `unknown` until it passes
- [ ] At least one property that can be `null` (like `name` or `bio`), handled with `??`
- [ ] Check `res.ok` **before** reading the body, with a clear error that includes the status

### 14.2 — Query Strings

- [ ] Fetch your repos from `/users/<you>/repos` with `sort=updated` and `per_page=5`, built with `URL` + `searchParams`
- [ ] Print each repo's name, language (or `—`) and stars
- [ ] Search repositories with a query that includes a **space** and a `:` — print the encoded URL, and point out each encoded character in a comment
- [ ] Build one URL by hand with a template literal and a value containing `&`, and show what breaks

### 14.3 — Several at Once

- [ ] Fetch **three** users in parallel with `Promise.all` + `map`, and print them in the order you asked
- [ ] Include one username that doesn't exist, and show how you report it **without** losing the other two

**✅ Deliverable:** `github-lab.ts` + screenshot of the output.

---

## Task 15 — CRUD Lab: The Task API by Hand

Set up `day-06/task-manager/` with README Step 20 — `package.json`, `tsconfig.json`, `src/shared/`, and `src/server/server.ts` — and start it with `npm run api`.

### 15.1 — `curl.md` — The Terminal

- [ ] `data/` and `dist/` are in `.gitignore`
- [ ] Record one `curl` command and its output for **each** of: GET all, GET one, POST, PATCH, DELETE
- [ ] Use `curl -i` at least once, and label the status line and two headers in the output
- [ ] Trigger and record a `400` (invalid body), a `400` (broken JSON), a `404` (missing task), a `404` (unknown route) and a `405` (wrong method)
- [ ] Next to each error, write whether it's the **client's** fault or the **server's**, and why

### 15.2 — `crud-lab.ts` — `fetch`

- [ ] Create, read, update and delete a task with plain `fetch` — no helper library
- [ ] Every write sends `Content-Type: application/json` and a `JSON.stringify`'d body
- [ ] Check `res.ok` after **every** call, and print the server's `{ error }` message when it fails
- [ ] Type the created task with the `Task` interface from `src/shared/types.ts` (`import type`), after checking it with `isTask`
- [ ] PATCH **two** fields in one call, and prove the third field didn't change
- [ ] Handle the `204` from DELETE without calling `res.json()`
- [ ] Create **three** tasks in parallel with `Promise.all`, then delete all three in parallel

### 15.3 — The Network Tab

- [ ] Open `http://localhost:3000/api/tasks` in the browser, open DevTools → Network, reload, and screenshot the request's **Headers** and **Response**
- [ ] In the console, run one `fetch` POST, and screenshot its **Payload** in the Network tab

**✅ Deliverable:** `curl.md` + `crud-lab.ts` + screenshot.

---

## Task 16 — Failure Lab: Every Way It Breaks

Create `failures-lab.ts`, using a small `attempt(label, fn)` helper like README Step 21.

### 16.1 — Cause Every Failure

- [ ] **Network:** a wrong port, and a host that doesn't exist — print `err.name` and `err.cause.code`
- [ ] **HTTP 4xx:** a `404` and a `400`, each reported with the server's own message
- [ ] **HTTP 5xx:** restart the API with `FAIL_RATE=1`, run a request, and record the `500`
- [ ] **Parse:** call `res.json()` on a response that isn't JSON
- [ ] **Shape:** fetch valid JSON that fails your `isTask` guard (hint: `/api/tasks` is an array)
- [ ] **Timeout:** restart the API with `SLOW=3000`, and time out a request with `AbortSignal.timeout(1000)`
- [ ] **Abort:** start a request and cancel it with an `AbortController`
- [ ] **Stale:** start two loads of `/api/tasks` in a row with `SLOW` on, cancel the first when the second starts, and prove only the second one's result is used

### 16.2 — Classify

- [ ] At the top of the file, a comment table: each failure, which **layer** it's in (network / HTTP / data), whether `fetch` **rejects or resolves**, and whether it's **safe to retry**
- [ ] One sentence: why does `res.ok` need checking even inside a `try` / `catch`?

**✅ Deliverable:** `failures-lab.ts` + screenshot of the full output.

---

## Task 17 — The Typed Client

In `task-manager/src/client/`, type README Step 22 — then extend it.

### 17.1 — `http.ts`

- [ ] `ApiError` as a discriminated union of **six** kinds, and `Result<T>`
- [ ] `request<T>()` checks the three layers **in order**, and every exit returns a `Result` — nothing throws
- [ ] Reads the server's `{ error }` message on a non-ok response, with a fallback when the body isn't JSON
- [ ] A timeout with `AbortSignal.timeout`, combined with the caller's signal using `AbortSignal.any`
- [ ] Handles `204` without parsing
- [ ] `describeError` is an exhaustive `switch` — add a seventh kind temporarily and screenshot the error that forces you to handle it

### 17.2 — `api.ts`

- [ ] `listTasks`, `createTask`, `updateTask`, `deleteTask` — plus **`getTask(id)`**, which isn't in the README
- [ ] Each one passes the right type guard, and hovers as the right `Promise<Result<…>>`
- [ ] It's the **only** file in `client/` that contains `/api`

### 17.3 — Retry, Safely

- [ ] Add `requestWithRetry<T>()` (or a `retries` option) that retries **only** `network`, `timeout` and `5xx` — never `4xx`, `parse` or `shape`
- [ ] It retries only `GET` requests, with a growing delay between attempts
- [ ] `listTasks` uses it; `createTask` does **not** — and a comment explains why

### 17.4 — `smoke.ts`

- [ ] Exercises all five API functions, including one `404` and two different `400`s
- [ ] Run it against a normal server, a `FAIL_RATE=0.5` server (showing retries), and a stopped server — screenshot all three
- [ ] `npm run check` is clean

**✅ Deliverable:** `http.ts` + `api.ts` + `smoke.ts` + screenshot.

---

## Task 18 — HTML: Structure and Accessibility

### 18.1 — `index.html`

- [ ] Type README Step 23, then check every item below yourself
- [ ] `<header>`, **one** `<main>`, `<section>`s labelled with `aria-labelledby`, `<footer>`
- [ ] Headings in order: one `<h1>`, then `<h2>`s — no skipped levels
- [ ] Every input and select has a `<label for>` or an `aria-label`
- [ ] The only `type="submit"` button is inside the form; every other button is `type="button"`
- [ ] The status line has `role="status"` / `aria-live`, and the form error has `role="alert"`
- [ ] The `<meta name="viewport">` tag is present
- [ ] Open the page with **CSS disabled** (DevTools → Rendering, or just before Step 24) and screenshot it — it should still read as a sensible document

### 18.2 — `layout-lab.html` — A Page Without JavaScript

A separate static page — an "About this project" page for your Task Manager.

- [ ] Uses `<header>`, `<nav>` (with at least two links, one back to the app), `<main>`, at least one `<article>` and a `<footer>`
- [ ] A small **contact form** with at least three fields of different `type`s (`email`, `text`, a `<select>` or `<textarea>`), all labelled, and a submit button
- [ ] A **card grid** of at least six cards (features, or the Day 01–07 topics), using `repeat(auto-fill, minmax(…, 1fr))` — no media query needed
- [ ] Linked from the app's footer

### 18.3 — Audit

- [ ] Run **Lighthouse** (DevTools → Lighthouse → Accessibility) on both pages, fix what it finds, and screenshot the final score
- [ ] Do a full pass of the app with **only the keyboard** — every action reachable with `Tab` / `Enter` / `Space` — and note anything you had to fix

**✅ Deliverable:** `index.html` + `layout-lab.html` + Lighthouse screenshot.

---

## Task 19 — CSS: Grid, Flexbox, Responsive, Dark Mode

### 19.1 — `styles.css`

- [ ] **Tokens:** every colour and the radius / spacing are custom properties on `:root` — no raw colour values anywhere else
- [ ] **Reset:** `box-sizing: border-box` on everything, and form controls inherit the font
- [ ] **Grid** for the page layout, one column on phones and two from a breakpoint you choose
- [ ] **Flexbox** for the task rows, the toolbar and the list header, with `gap` — no margins between siblings
- [ ] The toolbar **wraps** on a narrow screen instead of overflowing
- [ ] Priority shown with `[data-priority]` attribute selectors
- [ ] Done tasks and pending tasks each have a distinct style
- [ ] A visible `:focus-visible` style
- [ ] **Dark mode** by redefining the tokens inside `@media (prefers-color-scheme: dark)`

### 19.2 — Make It Yours

- [ ] Change the design — at least a new colour palette, a different font stack and one layout decision of your own — while keeping every item in 7.1 true
- [ ] Check text contrast in **both** themes with DevTools (inspect a text element → the contrast ratio in the colour picker), and fix anything below 4.5:1

### 19.3 — Prove It

- [ ] Screenshot the app at **phone** width (DevTools device toolbar), at **desktop** width, and in **dark mode**
- [ ] In a comment at the top of `styles.css`, name every place you used Grid and every place you used Flexbox, and why

**✅ Deliverable:** `styles.css` + 3 screenshots.

---

## Task 20 — Build: The Task Manager

Type README Step 25's `main.ts`, get it working, then make sure every item below is true of **your** version.

### 20.1 — State and Render

- [ ] **One** `state` object holds everything the page shows, with a `View` discriminated union for loading / failed / ready
- [ ] Every change goes through `setState`, which never mutates and always calls `render()`
- [ ] `render()` builds the list with `createElement` + `textContent` only — search your file: **no** `innerHTML`
- [ ] The status line is an exhaustive `switch` over `view.status`
- [ ] Keyboard focus survives a re-render (tick a task with `Space` — focus stays on it)

### 20.2 — Features

- [ ] **Load** on start, with a loading message, and a **Try again** button when it fails
- [ ] **Add** with `FormData` + the **shared** `validateNewTask` — an invalid title shows an error without sending a request
- [ ] The Add button is disabled during the request, and re-enabled in `finally`
- [ ] **Toggle** done — **optimistic**, with rollback and a message on failure
- [ ] **Change priority** — pessimistic, with the row marked as pending while it waits
- [ ] **Delete**, treating a `404` as already deleted
- [ ] **Filter** (all / active / done) with `aria-pressed` on the active button
- [ ] **Search** that filters as you type
- [ ] **Clear completed** — parallel deletes, and one message saying how many succeeded and failed
- [ ] Counts of active and done tasks
- [ ] A friendly empty state, and a different one when a filter matches nothing
- [ ] **Event delegation:** one listener on the list handles every task's controls

### 20.3 — Prove It

- [ ] `npm run check` clean, `npm run build`, and the app works at `http://localhost:3000`
- [ ] Reload the page — every change is still there. Open `data/tasks.json` and find your tasks
- [ ] Screenshot the app with at least six tasks across all three priorities, some done, with the DevTools **Network** tab showing a `PATCH`
- [ ] Screenshot `npm run check` + the server terminal log

**✅ Deliverable:** `main.ts` + 2 screenshots.

---

## Task 21 — Your Feature, Through Every Layer

The real test of an architecture: add something, and see how many places change. Add **both** of these:

### 21.1 — Edit a Title

- [ ] An **Edit** button (or double-click) on each task turns its title into a text input
- [ ] `Enter` saves with `PATCH { title }`, `Escape` cancels, and leaving the field saves
- [ ] Uses the shared validation — an empty or 121-character title shows an error and keeps the input open
- [ ] The edit mode lives in **state** (`editingId`), not in the DOM
- [ ] Fully keyboard-accessible, with a label

### 21.2 — A New Field

Add **one** new field to `Task`: a **due date**, **tags**, or **notes** — your choice.

- [ ] Added to `Task`, `NewTask` and `TaskUpdate` in `shared/types.ts`
- [ ] Validated in `shared/validate.ts` — at least one real rule (a valid date, max 3 tags, max length…) — and `isTask` updated
- [ ] The server needed **no** new route — note in `FEATURE.md` whether `server.ts` needed any change at all
- [ ] Old tasks in `data/tasks.json` without the field still load — decide: optional, or a default?
- [ ] Shown in each task row, settable when adding, and changeable afterwards
- [ ] One more thing it enables: sort by due date, filter by tag, or search inside notes
- [ ] Tested with `curl`: one valid and one invalid request with the new field

### 21.3 — `FEATURE.md`

- [ ] Every file you changed for each feature, with one line on why
- [ ] The first `npm run check` error list after changing `types.ts` — how TypeScript led you to every place that needed updating
- [ ] One paragraph: what the `shared/` folder saved you, compared to validating separately on each side

**✅ Deliverable:** the code + `FEATURE.md` + a screenshot of both features in use.

---

## Task 22 — Break It, and Prove It Survives

Follow README Step 26 on **your** app. For each test, record in `BREAK-IT.md`: how you caused it, what the user saw, a screenshot, and one sentence on **which line of your code** handled it.

- [ ] **`FAIL_RATE=0.5`** — a failed load with **Try again**, a toggle that rolled back, and a partial **Clear completed**
- [ ] **`SLOW=3000`** — the loading state, and proof a double-click on **Add** creates only **one** task
- [ ] **`SLOW=6000`** — the timeout message
- [ ] **Server stopped** — a failed action, then recovery with **Try again** after restarting
- [ ] **XSS** — a task titled `<img src=x onerror="alert('hacked')">` shown as harmless text; then (temporarily) switch to `innerHTML`, screenshot the alert, and switch back
- [ ] **Stale load** — add a **Reload** button (`type="button"`) to the toolbar that calls `loadTasks`. With `SLOW=2000`, click it twice quickly, and show in the Network tab that the first request was **cancelled** and the page shows the second one's result
- [ ] **Bad data** — temporarily change `server.ts` to send `"done": "yes"` for one task, and show your app reports a shape error instead of breaking — then change it back

**✅ Deliverable:** `BREAK-IT.md` + at least 5 screenshots.

---

## Task 23 — Notes, Repo, PRs — and a Track 1 Retrospective

### 23.1 — Repo Structure

- [ ] Your repo now looks like this:

```
javascript-everywhere/
├── .gitignore               ← node_modules/, dist/, data/, .env
├── README.md
├── day-01/ … day-05/
└── day-06/
    ├── NOTES.md
    ├── RETRO.md
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── predictions.md
    ├── predictions/
    ├── predictions-api.md
    ├── predictions-api/
    ├── hello.ts, reading-errors.ts, primitives.ts, collections.ts, special-types.ts
    ├── functions.ts, narrowing.ts, results.ts, shapes.ts, classes.ts, generics.ts, utility-types.ts
    ├── fetch-preview.ts, first-fetch.ts, search.ts, crud.ts, failures.ts
    ├── types-lab.ts, special-lab.ts, functions-lab.ts, narrowing-lab.ts
    ├── db-types.ts, typed-db.ts, states.ts, guards.ts, classes-lab.ts
    ├── generics-lab.ts, utilities-lab.ts
    ├── github-lab.ts, crud-lab.ts, curl.md, failures-lab.ts
    ├── migrate/
    │   └── BUG-HUNT.md
    ├── project/                ← the typed grade report (Tasks 10–11)
    └── task-manager/           ← the Task Manager (Tasks 15–22)
        ├── README.md
        ├── index.html
        ├── layout-lab.html
        ├── styles.css
        ├── FEATURE.md
        ├── BREAK-IT.md
        └── src/
            ├── shared/
            ├── server/
            ├── client/
            └── scripts/
```

- [ ] Add a Day 06 row to your root `README.md` table of contents
- [ ] Add a `task-manager/README.md`: what it is, a screenshot, and exactly how to run it (`npm install`, `npm run build`, `npm run api`)

### 23.2 — `day-06/NOTES.md`

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

**Part 6 — HTTP & `fetch`:**

- [ ] The request/response cycle, with your own drawing
- [ ] Every part of a URL, and why `URLSearchParams` beats string gluing
- [ ] The CRUD ↔ method ↔ status code table, from memory
- [ ] 4xx vs 5xx — whose fault, and whether to retry
- [ ] Why `fetch` resolves on a 404

**Part 7 — Calling APIs Properly:**

- [ ] The three layers of failure, with a real example of each from Task 16
- [ ] Timeout vs abort, and what a "stale response" is
- [ ] Why `request<T>()` returns a `Result` instead of throwing
- [ ] What CORS is, who enforces it, and why today's app didn't hit it
- [ ] Why secrets never go in frontend code

**Part 8 — Web Basics:**

- [ ] Five semantic elements and what each one gives you for free
- [ ] Why forms use the `submit` event, `preventDefault` and `FormData`
- [ ] Flexbox vs Grid — when you reach for each
- [ ] `textContent` vs `innerHTML`, and what XSS is
- [ ] Event delegation, and why it works (bubbling)
- [ ] The state → render → events loop

**Part 9 — The Project:**

- [ ] The architecture: what each layer knows, and what it doesn't
- [ ] Optimistic vs pessimistic — which you used where, and why
- [ ] What `shared/` gives you — with your Task 21 as the example

**Everything:**

- [ ] **One bug you hit** in each half — the exact error message or wrong behaviour, and how you fixed it

> The bug section is not optional. If nothing broke, you copy-pasted.

### 23.3 — `day-06/RETRO.md` — Track 1 Retrospective

- [ ] The **three** ideas from Days 01–06 you'd teach a friend first, and why
- [ ] The day that was hardest, and what finally made it click
- [ ] One piece of code from Day 02 or 03 you'd now write differently — show before and after
- [ ] What you want to be able to build by the end of Track 2

### 23.4 — Commits and PRs

- [ ] At least **fourteen** commits on `feature/day-06`, each one logical change with an imperative message
- [ ] `npm run check` was clean before every commit — in `day-06/`, `project/` and `task-manager/`
- [ ] `node_modules/`, `dist/` and `data/` are **not** in your repo — search GitHub to prove it
- [ ] **Two** pull requests — one after Task 12, one after Task 22 — each with **What / Why / How to test**. The second one's How to test lists `npm install`, `npm run build`, `npm run api`, `npm run smoke`
- [ ] Left yourself one review comment on a line in **Files changed** on each
- [ ] Merged both, deleted the branch on GitHub, then `git pull` and `git branch -d` locally
- [ ] Run `git log --oneline --graph -30` and screenshot it

**✅ Deliverable:** repo link + both merged PR links + `git log` screenshot.

---

## Task 24 — Share It

- [ ] Post on **LinkedIn** about completing Day 6 — and **Track 1** — of JavaScript Everywhere
- [ ] Include a screenshot of a **real** error TypeScript caught in your own code — Task 10.3 or Task 12
- [ ] Include a short **screen recording** or GIF of your Task Manager — adding, ticking, filtering, and one failure being handled
- [ ] Include the link to your repo **and** your merged pull requests
- [ ] Name the feature you added in Task 21, and one thing you had to change to add it
- [ ] Say one concrete thing you understood that you didn't before — why Node runs code with type errors, what `unknown` protects you from, why `fetch` doesn't throw on a 404, why `innerHTML` is dangerous, how one validation file runs on both ends. Not "excited to continue my journey".

**✅ Deliverable:** the link to your post.

---

## Bonus (Optional)

**TypeScript (Tasks 1–12):**

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

**APIs & the Task Manager (Tasks 13–22):**

- [ ] Replace the Clear-completed `Promise.all` with a real **bulk** endpoint — add `DELETE /api/tasks?done=true` to `server.ts`, and use it
- [ ] **Undo delete:** after deleting, show "Deleted — Undo" for 5 seconds, and re-create the task if clicked
- [ ] **Drag to reorder** tasks, with an `order` field saved through the API
- [ ] **Search-as-you-type on the server:** add `?q=` support to `GET /api/tasks`, debounce the input by 300ms, and cancel stale requests with `AbortController`
- [ ] **Offline mode:** keep a copy of the last loaded tasks in `localStorage`, show them with an "offline" banner when the load fails, and listen for the `online` event to reload
- [ ] A **theme toggle** button (light / dark / system) that overrides `prefers-color-scheme`, remembered in `localStorage`
- [ ] Show relative dates — "created 3 hours ago" — with `Intl.RelativeTimeFormat`, no library
- [ ] A **Playwright** or plain-script test that starts the server, adds a task through the API, and checks `data/tasks.json`
- [ ] A GitHub **Actions** workflow that runs `npm ci`, `npm run check` and the smoke test against a started server
- [ ] Open a pull request on a classmate's Task Manager with one real accessibility or error-handling fix

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
- [ ] **Task 13** — `predictions-api.md` with wrong answers explained + screenshot
- [ ] **Task 14** — `github-lab.ts` + screenshot
- [ ] **Task 15** — `curl.md` + `crud-lab.ts` + screenshot
- [ ] **Task 16** — `failures-lab.ts` + screenshot
- [ ] **Task 17** — `http.ts` + `api.ts` + `smoke.ts` + screenshot
- [ ] **Task 18** — `index.html` + `layout-lab.html` + Lighthouse screenshot
- [ ] **Task 19** — `styles.css` + phone, desktop and dark-mode screenshots
- [ ] **Task 20** — `main.ts` + 2 screenshots
- [ ] **Task 21** — both features + `FEATURE.md` + screenshot
- [ ] **Task 22** — `BREAK-IT.md` + screenshots
- [ ] **Task 23** — repo link, both merged PR links, `NOTES.md`, `RETRO.md`, `git log` screenshot
- [ ] **Task 24** — LinkedIn post link

Submit all links together before the next session.

---

## How This Is Graded

| Level | What it looks like |
|---|---|
| ❌ **Incomplete** | Copy-pasted README code (other than `server.ts`), predictions written after running, any `any` you weren't asked for, errors silenced with `as` / `!` / `@ts-ignore`, `JSON.parse`, `res.json()` or `catch (err)` used without narrowing, a `fetch` with no `res.ok` check, no timeout, `innerHTML` with data, `<div>` buttons or unlabelled inputs, `npm run check` failing, `node_modules/`, `dist/` or `data/` committed, everything done on `main`, no merged PR, or code you can't explain line by line |
| ✅ **Done** | All twenty-four tasks, your **own** database and Day 05 project typed, a type guard at every boundary, generic helpers with real constraints, discriminated unions with exhaustive `switch`es, a typed client that turns every failure into a `Result`, shared validation on both sides, a semantic and keyboard-accessible page with Grid + Flexbox + dark mode, a Task Manager with every feature in 20.2 plus your own feature, every failure in Task 22 handled, a bug hunt with real bugs found, `NOTES.md` and `RETRO.md` in your own words, two merged PRs |
| 🔥 **10%** | Done + the bonus + a project that does something beyond the spec + notes someone else could actually learn from |

---

## A Reminder

> **90%** study only — free, self-paced, no assignments turned in.
> **10%** study + assignments + more — I personally help this group get there.
>
> **If you show up for the 10%, I show up for you.**

**That's Track 1.** The next session starts **Track 2: Full-Stack Web Application** with **React Intro — Components, Props & State, JSX** — the state → render loop you wrote by hand in Task 20, done for you. Come with `npm run check` clean, your Task Manager working, and both PRs merged.

---

← Back to [Day 06 README](README.md)
