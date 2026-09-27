# Day 06 — TypeScript from Scratch: Data Types, Functions, Interfaces, Generics

**Track 1: JS/TS Foundations + Web Basics · Day 6 · five parts**

> Day 05 ended with a teaser: `letterGrade("ninety")` runs, returns `"F"`, and nobody finds out until a student complains.
> Today you learn TypeScript **from zero** — what it is, every data type it has, how to type functions, objects and classes, and how generics let one function work for everything.
> Then you take your whole Day 05 project — `lib/`, `report.js`, the browser page — and rewrite it in TypeScript.

**Why this day matters:** TypeScript is the default for new JavaScript projects now. React, Next.js, Angular, Express, React Native, Electron, every AI SDK — their docs are written in TypeScript first. Every file you write from Day 07 onward is `.ts`. And the habit you build today — *say what shape your data is, and let the tools check it* — is the single biggest thing that separates code that works in a demo from code that works for a year.

| Part | Topic | Concept | Build |
|---|---|---|---|
| **1** | Getting Started — what TypeScript is, setup, running vs checking, reading errors | Sections 1.1–1.4 | Steps 1–2 |
| **2** | Data Types — primitives, arrays, tuples, objects, special types, literals, unions, enums | Sections 2.1–2.11 | Steps 3–5 |
| **3** | Functions & Narrowing — typed functions, unions, type guards | Sections 3.1–3.8 | Steps 6–8 |
| **4** | Objects — interfaces, type aliases, classes | Sections 4.1–4.6 | Steps 9–10 |
| **5** | Generics, Utility Types & a Real Project | Sections 5.1–5.12 | Steps 11–17 |

---

## What You'll Have by the End

**Part 1 — Getting Started**

- [ ] What TypeScript is — and what it is **not** (it doesn't run; it checks)
- [ ] TypeScript installed, a `tsconfig.json`, and the two commands: `node file.ts` runs, `npx tsc` checks
- [ ] How to read a TypeScript error: file, line, column, code, message

**Part 2 — Data Types**

- [ ] Annotations vs inference — and why `let x = "A"` and `const y = "A"` get different types
- [ ] The seven primitives: `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`
- [ ] Arrays (`number[]`, `readonly`), tuples (`[string, number]`) and object types
- [ ] The special types: `any`, `unknown`, `void`, `never`
- [ ] Literal types, unions, intersections and type aliases
- [ ] Enums — how they work, and the `as const` pattern that replaces them
- [ ] Type assertions (`as`, `as const`, `!`) — and why types never convert values

**Part 3 — Functions & Narrowing**

- [ ] Typed parameters and returns; optional, default and rest parameters
- [ ] Function types, callbacks, `async` functions returning `Promise<T>`, overloads
- [ ] Narrowing with `typeof`, `===`, `in`, `instanceof` and `Array.isArray`
- [ ] Discriminated unions — the `status` pattern you already used with `Promise.allSettled`
- [ ] Type guards — turning untrusted JSON into typed data safely

**Part 4 — Objects**

- [ ] Interfaces and type aliases — and the rule for choosing
- [ ] Optional and `readonly` properties, `extends`, `&`
- [ ] Structural typing — why the *shape* matters, not the name
- [ ] Classes with types: fields, constructors, `readonly`, `#private`, getters, `extends`, `implements`

**Part 5 — Generics, Utility Types & a Real Project**

- [ ] Generic functions and types: `first<T>`, `findById<T extends { id: number }>`, `Result<T>`
- [ ] Utility types: `Partial`, `Omit`, `Pick`, `Readonly`, `Record`, `ReturnType`, `Awaited`
- [ ] A `tsconfig.json` you understand line by line
- [ ] Your Day 05 project, fully typed, running in Node **and** in the browser
- [ ] `npm run check` in your workflow — type errors caught before they're committed

---

# Part 1 — Getting Started

## 1 — Concept (35 min)

### 1.1 What TypeScript Is

**TypeScript is JavaScript with types written on it.** Every JavaScript file is already valid TypeScript. TypeScript adds one thing: a way to say *what kind of value* a variable, parameter or return value holds — and a checker that reads your whole project and tells you where those promises are broken.

```ts
function letterGrade(score: number): string {   // score must be a number; returns a string
  if (score >= 90) return "A";
  return "F";
}

letterGrade("ninety");
//          ~~~~~~~~  Argument of type 'string' is not assignable to parameter of type 'number'.
```

That red underline appears **in your editor, as you type** — before you save, before you run, before a student ever sees `"F"`.

The most important thing to understand on day one:

> **Types are erased before your code runs.** Node and the browser never see them. TypeScript checks your code, then the types are stripped off and plain JavaScript runs — exactly the JavaScript you already know.

```
   your .ts file                               what actually runs
┌──────────────────────────────┐          ┌──────────────────────────┐
│ function f(score: number):   │  strip   │ function f(score) {      │
│   string {                   │ ───────▶ │   …                      │
│   …                          │  types   │ }                        │
│ }                            │          │                          │
└──────────────────────────────┘          └──────────────────────────┘
           │
           │ tsc reads it and CHECKS it
           ▼
   error TS2345: Argument of type 'string' is not
   assignable to parameter of type 'number'.
```

Two consequences you'll keep running into:

1. **Types don't exist at runtime.** You can't ask "is this value a `Student`?" while the program runs — there's no `Student` left to ask about. You check with plain JavaScript (`typeof`, `in`, `Array.isArray`), and TypeScript *follows along* (3.5).
2. **A type error doesn't stop the code from running.** Node will happily run a file full of type errors. Checking is a separate step — and it's your job to run it.

| Catches | JavaScript | TypeScript |
|---|---|---|
| `letterGrade("ninety")` | Returns `"F"`. Silently wrong. | Red underline, before you run anything |
| `student.nmae` | `undefined`. Silently wrong. | `Property 'nmae' does not exist on type 'Student'.` |
| `scores.find(…).toFixed(1)` when nothing matched | Crashes — at runtime, maybe in production | `'…' is possibly 'undefined'` |
| Renaming `score` → `mark` in 30 files | Search and pray | Every place you missed turns red |
| "What does this function return?" | Read the code | Hover over it |

---

### 1.2 Setting Up — Two Commands

```bash
npm install --save-dev typescript @types/node
npx tsc --version        # Version 7.x
```

- **`typescript`** gives you `tsc`, the TypeScript compiler and checker. Version 7 is the compiler rewritten in Go — the same language, just much faster.
- **`@types/node`** describes Node's built-in modules (`fs`, `path`, `process`…) so TypeScript knows their types.
- `--save-dev` because they're **dev dependencies** — tools for building your code, not code your app runs.

You now have two separate commands, and it's important to keep them apart in your head:

| Command | What it does | Checks types? |
|---|---|---|
| `node file.ts` | **Runs** the file. Node strips the types out and runs the JavaScript left over. | ❌ No — never |
| `npx tsc` | **Checks** every file in the project against its types. | ✅ Yes — that's all it's for |

> **Node runs. `tsc` checks.** Node 22.18 and later (you have 24) run `.ts` files directly, by deleting the type annotations and running what's left. That makes TypeScript as quick to start as JavaScript — but Node does **zero** type checking. A file with ten type errors runs fine. You only find out if you run `npx tsc`, or look at your editor.

`tsc` reads its settings from **`tsconfig.json`** in the folder. Step 1 gives you one, and 1.3 walks through it.

VS Code has TypeScript built in: the red underlines, the hover types, the autocomplete that lists an object's real properties — all of it is a copy of the TypeScript checker running in the background as you type. The editor's copy is bundled with VS Code, so it can be a version behind your project's `tsc`. They agree on everything in this course — but when they ever disagree, **`npx tsc` is the one that counts.**

---

### 1.3 The Lab `tsconfig.json`

Here's the one Step 1 gives you for today's lab files:

```json
{
  "compilerOptions": {
    "target": "es2023",
    "module": "nodenext",
    "types": ["node"],

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true,
    "skipLibCheck": true
  },
  "exclude": ["project"]
}
```

For now, three lines matter:

- **`"strict": true`** — turns on every safety check. Without it, TypeScript lets through most of the bugs this day is about. **Always on**, in every project in this course.
- **`"noEmit": true`** — "just check, don't write any files." Node runs your `.ts` files directly, so there's nothing to build.
- **`"noUncheckedIndexedAccess": true`** — `scores[5]` might not exist, so its type includes `undefined` (2.5).

Section 5.7 explains every other line, when you build a real project.

---

### 1.4 Reading an Error Message

Every `tsc` error has the same five parts:

```
reading-errors.ts(10,7): error TS2322: Type 'string' is not assignable to type 'number'.
└───────┬───────┘ └─┬┘        └──┬─┘  └───────────────────┬───────────────────────────┘
      file      line,column    code                   the message
```

- **File, line, column** — exactly where. In VS Code, `Ctrl`+click it in the terminal to jump there.
- **The code** (`TS2322`) — the same mistake always has the same code. Search it online and you'll find thousands of explanations.
- **The message** — read it slowly, **from the end**. *"Type 'string' is not assignable to type 'number'"* means: *"you gave me a string, and this place needs a number."*

The ones you'll see most:

| Code | Message starts with | Usually means |
|---|---|---|
| `TS2322` | Type 'X' is not assignable to type 'Y' | You put the wrong kind of value in a variable or property |
| `TS2345` | Argument of type 'X' is not assignable to parameter… | You passed the wrong kind of value to a function |
| `TS2339` | Property 'x' does not exist on type… | A typo, or the property really isn't there |
| `TS2554` | Expected 2 arguments, but got 1 | Wrong number of arguments |
| `TS2741` | Property 'x' is missing in type… | An object is missing a required property |
| `TS2353` | Object literal may only specify known properties… | An extra (often misspelled) property |
| `TS18048` | 'x' is possibly 'undefined' | It might not exist — check first |
| `TS18046` | 'x' is of type 'unknown' | Check what it is before you use it |
| `TS7006` | Parameter 'x' implicitly has an 'any' type | Add a type to the parameter |
| `TS2349` | This expression is not callable | You called something that isn't a function |

> **Fix the first error first.** One mistake can cause several errors further down. Fix the top one, run `npx tsc` again, and often the rest disappear.

---

# Part 2 — Data Types

## 2 — Concept (70 min)

### 2.1 Annotations and Inference

An **annotation** is a type you write after a colon:

```ts
let score: number = 92;
const name: string = "Sara";
```

But most of the time you don't need to — TypeScript **infers** the type from the value:

```ts
let score = 92;          // number    — inferred
const name = "Sara";     // "Sara"    — a const can never change, so its type IS the value
let names = ["Sara"];    // string[]
```

Hover over any variable in VS Code and it shows you what TypeScript inferred.

**Once a variable has a type, it keeps it:**

```ts
let score = 92;
score = "92";
// ~~~~~ Type 'string' is not assignable to type 'number'.
```

In JavaScript, a variable can hold a number now and a string later. In TypeScript, it can't — and that one rule removes a whole family of bugs.

> **Rule of thumb:** annotate function **parameters** (TypeScript can't guess them) and the **return type** of functions other files use. Let everything else be inferred. Writing `const x: number = 5` is not wrong — just noise.

---

### 2.2 `string`, `number`, `boolean`

The three types you'll use most — the same three JavaScript has always had, now with names.

| Type | Values | Watch out for |
|---|---|---|
| `string` | `"Sara"`, `'Sara'`, `` `Hi ${name}` `` | All three quote styles make the same type |
| `number` | `92`, `83.75`, `-12`, `1_000_000`, `NaN`, `Infinity` | **One** type for whole numbers and decimals |
| `boolean` | `true`, `false` | Only those two — `"true"` is a string |

```ts
const firstName: string = "Sara";
const greeting = `Hello, ${firstName}`;       // string

const score: number = 92;
const average = 83.75;                        // number — no separate int or float
const big = 1_000_000;                        // underscores are just for reading

const passed: boolean = score >= 60;
```

**`number` has some surprises** — all of them from JavaScript, none from TypeScript:

```ts
0.1 + 0.2;              // 0.30000000000000004 — decimals are stored in binary
10 / 0;                 // Infinity — not an error
Number("ninety");       // NaN — "Not a Number"… whose type is number
Number.isNaN(NaN);      // true — the only reliable way to check for NaN
average.toFixed(1);     // "83.8" — a string, for display
```

TypeScript won't stop `NaN` — it's a real `number`. Your code has to check for it wherever text becomes a number.

---

### 2.3 `bigint` and `symbol`

Two primitives you'll rarely write, but should recognise.

**`bigint`** — whole numbers of **any** size. A `number` stops being exact above 2⁵³ (about 9 quadrillion):

```ts
Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2;   // true 😬 — precision lost

const huge: bigint = 9007199254740993n;   // the n makes it a bigint
huge + 1n;                                 // 9007199254740994n ✅
huge + 1;                                  // ❌ Operator '+' cannot be applied to types 'bigint' and '1'.
```

You can't mix `bigint` and `number` in arithmetic — TypeScript catches it, and JavaScript would throw. You'll meet `bigint` with database ids, money in the smallest unit, and cryptography.

**`symbol`** — a value that is **guaranteed unique**. Two symbols with the same description are still different:

```ts
const id1: symbol = Symbol("id");
const id2: symbol = Symbol("id");
id1 === id2;              // false
```

Libraries use symbols as property keys that can never clash with yours. You'll recognise them in DevTools as `Symbol(something)`.

---

### 2.4 `null` and `undefined`

Two different ways to say "nothing":

| | Means | Where it comes from |
|---|---|---|
| `undefined` | "Not set yet" / "not there" | A variable with no value, a missing property, a function with no `return`, `.find()` finding nothing |
| `null` | "Deliberately empty" | You wrote it on purpose — an API field with no value, a cleared selection |

With `"strict": true`, **neither is allowed unless the type says so**:

```ts
const title: string = null;
//    ~~~~~ Type 'null' is not assignable to type 'string'.

let nickname: string | null = null;      // ✅ "a string, or deliberately nothing"
let middleName: string | undefined;      // ✅ "a string, or not set yet"
```

That `|` is a **union** (2.9). It's the most important thing strict mode does: in plain JavaScript, *any* value can secretly be `null`, and `Cannot read properties of null` is the most common crash on the web. In TypeScript, a value can only be `null` if its type says so — and then TypeScript makes you check (3.6).

---

### 2.5 Arrays

An array type is the element type followed by `[]`:

```ts
const scores: number[] = [92, 68, 79];
const names: Array<string> = ["Sara", "Omar"];    // the same thing, generic spelling (Part 5)
const empty: string[] = [];                        // an empty array needs a type — nothing to infer from
```

Every element must fit:

```ts
scores.push(95);          // ✅
scores.push("100");       // ❌ Argument of type 'string' is not assignable to parameter of type 'number'.
```

And the element type flows through every array method, so callbacks need no annotations:

```ts
scores.map((s) => s * 2);           // number[]
scores.map((s) => `${s}%`);         // string[]
scores.filter((s) => s >= 70);      // number[]
scores.reduce((sum, s) => sum + s, 0);   // number
```

**Mixed arrays** need a union — and the parentheses matter:

```ts
const mixed: (string | number)[] = ["Sara", 92];   // an array of strings-or-numbers ✅
const wrong: string | number[] = ["Sara", 92];     // "a string, OR an array of numbers" ❌
```

**Readonly arrays** can't be changed at all:

```ts
const GRADES: readonly string[] = ["A", "B", "C", "D", "F"];
GRADES.push("E");     // ❌ Property 'push' does not exist on type 'readonly string[]'.
```

**Reading by index** — with `noUncheckedIndexedAccess`, `scores[9]` is `number | undefined`, because there might be no element 9. Handle it with `?.` or `??`:

```ts
const tenth = scores[9];                    // number | undefined
tenth ?? "(nothing at 9)";
```

---

### 2.6 Tuples

A **tuple** is an array with a **fixed length** and a type **per position**:

```ts
const entry: [string, number] = ["Sara", 92];
const [who, mark] = entry;                // who: string, mark: number

const bad: [string, number] = [92, "Sara"];   // ❌ order matters
```

**Named** tuples document themselves, and elements can be **optional**:

```ts
type Point = [x: number, y: number, label?: string];
const home: Point = [3, 4];
const shop: Point = [10, 2, "shop"];
```

Their best use: returning **two things** from a function:

```ts
function minMax(values: number[]): [min: number, max: number] {
  return [Math.min(...values), Math.max(...values)];
}
const [low, high] = minMax([92, 68, 79]);
```

You'll see exactly this in React: `const [count, setCount] = useState(0)` returns a tuple.

---

### 2.7 Object Types

Describe an object by listing each property and its type:

```ts
const sara: { name: string; score: number; email?: string } = { name: "Sara", score: 92 };

sara.email = "sara@example.com";    // ✅ email is optional (?) — may be missing, may be set
sara.age = 20;                      // ❌ Property 'age' does not exist on type …
```

Objects nest — objects inside objects, arrays of objects:

```ts
const course: {
  title: string;
  teacher: { name: string; github?: string };
  students: { name: string; score: number }[];
} = { … };
```

Writing that type out every time would be painful. Part 4 gives it a name with `interface` and covers `readonly`, `extends` and more.

---

### 2.8 The Special Types — `any`, `unknown`, `void`, `never`

Four types that don't describe a *kind of data*, but a *situation*:

| Type | Means | Use it |
|---|---|---|
| `any` | "Don't check anything" | Never, in this course |
| `unknown` | "Could be anything — check before using" | For data from outside: `JSON.parse`, `fetch`, forms |
| `void` | "This function returns nothing useful" | Return type of functions used for their effect |
| `never` | "This can't happen" | Functions that always throw; exhaustive checks (3.7) |

**`void`** and **`never`**:

```ts
function logLine(message: string): void {     // returns nothing useful
  console.log(message);
}

function fail(message: string): never {       // never returns at all — it always throws
  throw new Error(message);
}
```

Both mean "any value could be here." They're opposites in how they treat you.

**`any` turns the checker off.** Anything goes — and nothing is caught:

```ts
const raw: any = JSON.parse('{"name":"Sara"}');
raw.nmae.toUpperCase();     // compiles ✅ … crashes at runtime ❌
```

`any` is contagious: anything you get *from* an `any` is `any` too, so one of them can quietly switch off checking across a whole file. With `strict`, TypeScript won't give you an implicit `any` either:

```ts
function f(x) { return x; }
//         ~ Parameter 'x' implicitly has an 'any' type.
```

**`unknown` is the safe version.** You can store anything in it, but you can't *use* it until you've checked what it is:

```ts
const raw: unknown = JSON.parse('{"name":"Sara"}');
raw.name;
// ~~~ 'raw' is of type 'unknown'.

if (typeof raw === "object" && raw !== null && "name" in raw) {
  console.log(raw.name);    // ✅ checked first
}
```

> **Rule:** data from outside your program — `JSON.parse`, `fetch`, a form, a file — is `unknown` until you check it. Never `any`. Section 3.8 shows the tidy way to check it (a type guard).

**`as` — a type assertion** — is a cousin of `any`: `raw as Student` tells TypeScript *"treat this as a Student."* It checks nothing at runtime:

```ts
const t = { name: "Omar" } as Student;
console.log(t.score);       // undefined — and TypeScript thinks it's a number
```

Use `as` rarely, and only when you've genuinely checked the value some other way.

---

### 2.9 Literal Types, Unions, Intersections, Aliases

**A literal type** is one exact value. **A union** (`|`) is "one of these". Put them together and you get a precise set of allowed values:

```ts
type LetterGrade = "A" | "B" | "C" | "D" | "F";   // exactly these five strings
type Dice = 1 | 2 | 3 | 4 | 5 | 6;                // exactly these six numbers
type Id = number | string;                         // either kind of value

const grade: LetterGrade = "B";
const typo: LetterGrade = "b";
//    ~~~~ Type '"b"' is not assignable to type 'LetterGrade'. Did you mean '"B"'?
```

Autocomplete now offers exactly those five letters, and a typo is an error instead of a silent bug.

**A type alias** (`type Name = …`) gives any type a name — a union, an object shape, a tuple, even a plain `number`:

```ts
type Score = number;
type Student = { name: string; score: Score; grade?: LetterGrade };
```

**An intersection** (`&`) means "all of these at once" — every property from both:

```ts
type WithId = { id: number };
type StoredStudent = Student & WithId;    // name, score, grade?, AND id
```

| Symbol | Name | Means | Example |
|---|---|---|---|
| `\|` | union | one **or** the other | `string \| null` |
| `&` | intersection | one **and** the other | `Student & WithId` |

---

### 2.10 Enums — and What We Use Instead

Many TypeScript codebases describe a fixed set of options with an **`enum`**:

```ts
enum Level {
  Beginner = "beginner",
  Intermediate = "intermediate",
  Advanced = "advanced",
}

const mine: Level = Level.Beginner;
```

You'll read enums in other people's code, so recognise them. But an enum is different from every other type today: it isn't just an annotation — it **generates JavaScript** (an object called `Level`). That means Node can't run it by simply deleting the types:

```
SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]: TypeScript enum is not supported in strip-only mode
```

…and today's `tsconfig` (with `erasableSyntaxOnly`) flags it in the editor first:

```
error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
```

The modern replacement does the same job with plain JavaScript — an `as const` object, plus a union type made from its values:

```ts
const Level = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Advanced: "advanced",
} as const;

type Level = (typeof Level)[keyof typeof Level];   // "beginner" | "intermediate" | "advanced"

function describeLevel(level: Level): string { … }

describeLevel(Level.Beginner);   // ✅ used like an enum
describeLevel("advanced");       // ✅ or with the plain string
describeLevel("expert");         // ❌ not one of the three
```

Read `(typeof Level)[keyof typeof Level]` as: *"the type of any value inside the `Level` object."* Section 5.6 explains each piece. For a simple list, a literal union is even shorter: `type Level = "beginner" | "intermediate" | "advanced"`.

---

### 2.11 Assertions, Conversions, and `typeof`

**Types never convert values.** Writing `: number` doesn't turn `"68"` into `68` — that takes a function, at runtime:

| To get | From | Use | Result |
|---|---|---|---|
| number | `"68"` | `Number("68")` | `68` |
| number | `"68.9px"` | `Number.parseInt("68.9px", 10)` | `68` |
| string | `92` | `String(92)` | `"92"` |
| boolean | `""` | `Boolean("")` | `false` — `""`, `0`, `null`, `undefined`, `NaN` are falsy |

**A type assertion** — `value as Type` — tells TypeScript *"trust me, it's this type."* It checks nothing and converts nothing:

```ts
const lina = JSON.parse('{"name":"Lina","score":79}') as Student;    // fine — it really is one
const ghost = JSON.parse('{"name":"Ghost"}') as Student;             // TypeScript believes you…
ghost.score;                                                          // …undefined, typed as number 😬
```

Use `as` rarely, and only when you've checked the value some other way. Section 3.8 shows the safe alternative: a type guard.

**`as const`** is different — it doesn't lie, it **freezes**: every property becomes `readonly` and every value keeps its literal type:

```ts
const settings = { theme: "dark", fontSize: 14 } as const;
// type: { readonly theme: "dark"; readonly fontSize: 14 }
settings.theme = "light";   // ❌ Cannot assign to 'theme' because it is a read-only property.
```

**`!`** — the non-null assertion — `x!` means *"trust me, it's not `null` or `undefined`."* Same problem as `as`: if you're wrong, it crashes. Section 3.6 shows how to avoid it.

**`typeof` has two jobs.** In **code**, it's JavaScript's runtime check — it returns a string:

| Value | `typeof value` |
|---|---|
| `"text"` | `"string"` |
| `42` | `"number"` |
| `true` | `"boolean"` |
| `10n` | `"bigint"` |
| `Symbol()` | `"symbol"` |
| `undefined` | `"undefined"` |
| `null` | `"object"` — a 30-year-old JavaScript bug; check `null` with `=== null` |

In a **type position** (after `:` or in `type X = …`), `typeof` means *"the TypeScript type of this variable"* — that's what `typeof Level` did in 2.10.

---

# Part 3 — Functions & Narrowing

## 3 — Concept (60 min)

### 3.1 Typing a Function

Put a type on every **parameter**, and on the **return** value:

```ts
function letterGrade(score: number): string {
  //                 ^^^^^^^^^^^^^  ^^^^^^
  //                 parameter type  return type
  if (score >= 90) return "A";
  // …
  return "F";
}

// Arrow functions: the same annotations, in the same places
const isPassing = (score: number): boolean => score >= 60;
```

TypeScript **can't** guess parameter types — nothing tells it what callers will pass. Leave one out, and under `strict` you get:

```ts
function f(x) { return x; }
//         ~ Parameter 'x' implicitly has an 'any' type.
```

The **return** type *can* be inferred. Write it anyway on functions other code calls — it documents the function, and TypeScript checks you really return what you promised on **every** path.

Calling with the wrong arguments is an error:

```ts
letterGrade("92");      // ❌ Argument of type 'string' is not assignable to parameter of type 'number'.
letterGrade();          // ❌ Expected 1 arguments, but got 0.
```

---

### 3.2 Optional, Default and Rest Parameters

```ts
function greet(name: string, greeting = "Hello", emoji?: string): string {
  return `${greeting}, ${name}${emoji ? ` ${emoji}` : "!"}`;
}

greet("Sara");                     // "Hello, Sara!"
greet("Omar", "Welcome", "👋");    // "Welcome, Omar 👋"
greet();                           // ❌ Expected 1-3 arguments, but got 0.
```

- **`greeting = "Hello"`** — a default. Its type (`string`) is inferred from the default value.
- **`emoji?: string`** — optional. Inside the function it's `string | undefined`, so you must handle the missing case.
- Optional and default parameters go **after** the required ones.

**Rest parameters** — any number of arguments, collected into one typed array (Day 04's `...`):

```ts
function average(...scores: number[]): number {
  return scores.length === 0 ? 0 : scores.reduce((sum, s) => sum + s, 0) / scores.length;
}
average(92, 68, 79);   // 79.7
average();             // 0
```

**Destructured parameters** — the type goes after the whole pattern, not inside it:

```ts
function card({ name, score }: { name: string; score: number }): string {
  return `${name} (${score})`;
}
```

---

### 3.3 Function Types and Callbacks

Functions are values (Day 03), so they have types too. A **function type** looks like an arrow function with types instead of code:

```ts
type Grader = (score: number) => string;

const strict: Grader = (score) => (score >= 75 ? "PASS" : "FAIL");
const lenient: Grader = (score) => (score >= 50 ? "PASS" : "FAIL");
```

Notice `(score) =>` has no annotation — TypeScript already knows it's a `number` from `Grader`. This is **contextual typing**, and it's why callbacks almost never need types written on them.

Now a function that takes a function is fully checked:

```ts
function gradeAll(scores: number[], grader: Grader): string[] {
  return scores.map(grader);
}

gradeAll([92, 68, 79], strict);          // ["PASS", "FAIL", "PASS"]
const wrong: Grader = (s: string) => s;  // ❌ Type '(s: string) => string' is not assignable to type 'Grader'.
```

A callback whose result you ignore returns **`void`**: `type Formatter = (name: string, score: number) => void;`

---

### 3.4 Async Functions and Overloads

An `async` function always returns a **`Promise<T>`** — "a Promise that will hold a `T`" (Day 05):

```ts
async function fetchScore(name: string): Promise<number> {
  await delay(50);
  return name.length * 15;
}

const score = await fetchScore("Sara");     // number — await unwraps the Promise
const oops: number = fetchScore("Sara");    // ❌ Type 'Promise<number>' is not assignable to type 'number'.
```

That last line is Day 05's most common mistake — a missing `await` — caught before it runs.

**Overloads** give one function several precise signatures, when the return type depends on what you pass:

```ts
function format(value: number): string;
function format(value: number[]): string[];
function format(value: number | number[]): string | string[] {
  return Array.isArray(value) ? value.map((v) => `${v}%`) : `${value}%`;
}

format(92);          // string
format([92, 68]);    // string[]
```

The first two lines are what callers see; the third is the one real implementation. You'll mostly *read* overloads in library types rather than write them.

---

### 3.5 Narrowing

With a union, TypeScript only lets you do what's safe for **every** member:

```ts
function describe(score: number | string) {
  score.toFixed(1);
  //    ~~~~~~~ Property 'toFixed' does not exist on type 'string | number'.
}
```

So you check — with ordinary JavaScript — and TypeScript **narrows** the type inside each branch:

```ts
function describe(score: number | string | null): string {
  if (score === null) {
    return "no score yet";                 // here: null
  }
  if (typeof score === "string") {
    return `text: ${score.toUpperCase()}`;  // here: string
  }
  return `number: ${score.toFixed(1)}`;    // here: only number is left
}
```

| Check | Narrows to |
|---|---|
| `typeof x === "string"` / `"number"` / `"boolean"` / `"object"` | that primitive (or object / `null`) |
| `x === null`, `x === undefined`, `x !== undefined` | with / without `null` / `undefined` |
| `if (x)` | removes `null`, `undefined` (and `""`, `0` — careful) |
| `Array.isArray(x)` | an array |
| `"score" in x` | objects that have a `score` property |
| `x instanceof Error` | `Error` |
| `x.status === "fulfilled"` | the union member with that `status` (3.7) |

> **Narrowing is the heart of TypeScript.** You don't write special TypeScript checks — you write the `if` you'd have written in JavaScript anyway, and TypeScript understands it.

---

### 3.6 `null` and `undefined` in Practice

With `"strict": true` (always on in this course), `null` and `undefined` are **not** allowed unless the type says so. That's what makes these errors possible:

```ts
const found = [90, 80].find((n) => n > 95);   // number | undefined
found.toFixed(1);
// ~~~~ 'found' is possibly 'undefined'.
```

`find` might find nothing. In JavaScript that's a crash waiting in production: `Cannot read properties of undefined (reading 'toFixed')`. TypeScript makes you handle it:

```ts
if (found !== undefined) found.toFixed(1);   // narrowed
found?.toFixed(1);                            // optional chaining — Day 04
(found ?? 0).toFixed(1);                      // a fallback
```

Array indexing too — with `noUncheckedIndexedAccess` (on in today's config), `scores[5]` is `number | undefined`, because there may be no element 5.

**The `!` operator** — `found!.toFixed(1)` — tells TypeScript *"trust me, it's not undefined."* It removes the error and changes nothing at runtime. If you're wrong, you crash exactly as JavaScript would. Avoid it; narrow instead.

---

### 3.7 Discriminated Unions — The `status` Pattern

You've already used one. `Promise.allSettled` gives you an array of these:

```ts
type PromiseSettledResult<T> =
  | { status: "fulfilled"; value: T }
  | { status: "rejected"; reason: any };
```

Two object shapes, and a shared property — `status` — whose **literal** value tells them apart. That property is called the **discriminant**. Check it, and TypeScript narrows to the right shape:

```ts
for (const r of results) {
  if (r.status === "fulfilled") {
    console.log(r.value);     // ✅ value only exists here
  } else {
    console.log(r.reason);    // ✅ reason only exists here
  }
}
```

This is the most useful pattern in TypeScript. Anything that's "one of several situations, each with its own data" fits it — a loading state, an API response, a form step:

```ts
type LoadState =
  | { status: "idle" }
  | { status: "loading"; progress: number }
  | { status: "loaded"; students: Student[] }
  | { status: "failed"; error: string };
```

Compare that to Day 05's browser loader, which juggled a `loading` boolean, an `error` string and a `students` array — where nothing stopped `loading` being `true` *and* `error` being set at the same time. With a union, impossible combinations can't even be written.

#### Exhaustive checks with `never`

```ts
function describe(state: LoadState): string {
  switch (state.status) {
    case "idle":    return "Press Load";
    case "loading": return `Loading… ${state.progress}%`;
    case "loaded":  return `${state.students.length} students`;
    case "failed":  return `✗ ${state.error}`;
    default: {
      const unreachable: never = state;   // every case handled → state is `never` here
      return unreachable;
    }
  }
}
```

Now add a fifth member — `{ status: "cancelled" }` — and forget to handle it. The `default` line turns red:

```
Type '{ status: "cancelled"; }' is not assignable to type 'never'.
```

TypeScript found every `switch` you need to update. In a large app, that's hours of searching, done in a second.

---

### 3.8 Type Guards — Making Untrusted Data Safe

Day 05's `report.js` did `JSON.parse(text)` and trusted whatever came out. In TypeScript, `JSON.parse` returns `any` — so give it `unknown` instead, and **check** it.

A **type guard** is a function that returns `value is Student` — a `boolean` that also teaches TypeScript what it proved:

```ts
function isStudent(value: unknown): value is Student {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "number" && typeof v.name === "string" && typeof v.score === "number";
}
```

Use it like any `if`:

```ts
const raw: unknown = JSON.parse(text);

if (isStudent(raw)) {
  raw.name;                       // ✅ Student here
}

if (Array.isArray(raw)) {
  const students = raw.filter(isStudent);   // Student[] — filter understands type guards
  const rejected = raw.length - students.length;
}
```

This replaces Day 04's `isValid` check — with the bonus that everything after it is fully typed.

> **Types describe; guards verify.** `const s = raw as Student` is a promise with nothing behind it. `isStudent(raw)` actually looks. At every boundary where data comes **into** your program — files, `fetch`, forms, `localStorage` — use a guard. Real projects often use a library like **Zod** for this (Track 2), which writes the guard *and* the type from one definition.

---

# Part 4 — Objects: Interfaces, Types & Classes

## 4 — Concept (50 min)

### 4.1 Interfaces and Type Aliases

Every object in your Day 05 project had a shape — `{ id, name, score, attendance }` — but only in your head. Now you write it down, once, and every file can use it.

**A type alias** gives any type a name:

```ts
type ID = number;
type LetterGrade = "A" | "B" | "C" | "D" | "F";
type Student = {
  id: ID;
  name: string;
  score: number;
};
```

**An interface** gives an object shape a name:

```ts
interface Student {
  id: number;
  name: string;
  score: number;
}
```

For an object shape, the two are almost interchangeable. Use them the same way:

```ts
const sara: Student = { id: 1, name: "Sara", score: 92 };

function formatRow(student: Student): string {
  return `${student.name.padEnd(6)} ${student.score}`;
}
```

And the errors you get are the bugs Day 04 and Day 05 let through silently:

```ts
const bad: Student = { id: 3, name: "Lina" };
//    ~~~ Property 'score' is missing in type '{ id: number; name: string; }' but required in type 'Student'.

const typo: Student = { id: 3, name: "Lina", scor: 79 };
//                                           ~~~~ Object literal may only specify known properties,
//                                                but 'scor' does not exist in type 'Student'. Did you mean to write 'score'?
```

---

### 4.2 Optional and `readonly` Properties

```ts
interface Student {
  readonly id: number;     // set once, never reassigned
  name: string;
  score: number;
  github?: string;         // optional — may be missing entirely
}

const sara: Student = { id: 1, name: "Sara", score: 92 };   // ✅ github left out

sara.id = 99;
//   ~~ Cannot assign to 'id' because it is a read-only property.

sara.github.toLowerCase();
//   ~~~~~~ 'sara.github' is possibly 'undefined'.
```

An optional property has the type `string | undefined` when you read it — so everything from 3.6 applies.

> **`readonly` is shallow, and compile-time only.** A `readonly tags: string[]` can't be *reassigned*, but `student.tags.push("x")` still works. For an array that can't change, use `readonly string[]`. And none of this exists at runtime — for that you'd still need Day 04's spread (never mutate) or `Object.freeze`.

---

### 4.3 `extends`, `&`, and Interface vs Type

**`extends`** — an interface built on another:

```ts
interface GradedStudent extends Student {
  grade: LetterGrade;
  passed: boolean;
}
// GradedStudent has id, name, score, github?, grade, passed
```

**`&`** (an *intersection*) — the same idea with `type`:

```ts
type GradedStudent = Student & { grade: LetterGrade; passed: boolean };
```

Which should you use? Teams argue about it; the difference is small. This course uses a simple rule:

| Use | For |
|---|---|
| `interface` | Object shapes — `Student`, `Course`, `Store<T>` |
| `type` | Everything else — unions, literal sets, function types, tuples, and anything built with utility types |

The one real difference: an interface can be **re-opened** — declare `interface Student` twice and the two merge. Libraries use that to let you extend their types. A `type` can't be re-declared.

---

### 4.4 Structural Typing — Shape, Not Name

TypeScript doesn't care what an object is *called*. It cares whether it has the right **shape**:

```ts
interface Student { id: number; name: string; score: number }

const fromForm = { id: 3, name: "Lina", score: 79, source: "form" };
const lina: Student = fromForm;    // ✅ it has id, name and score — that's enough
```

`fromForm` was never declared as a `Student`, and it has an extra property — it's still accepted, because it has everything a `Student` needs.

So why was `scor: 79` an error in 4.1? Because that was a **fresh object literal** written straight into a `Student` slot. An extra property there is almost always a typo, so TypeScript checks it strictly. An object that already exists in a variable is only checked for what's *required*.

> This is why TypeScript fits JavaScript so well: JavaScript has always been "if it has a `.name`, it's fine" — TypeScript just checks that it really has one.

#### Objects as dictionaries — `Record` and index signatures

When an object's keys aren't fixed — ids, grades, dates — describe the key and value types instead:

```ts
const latency: Record<number, number> = { 1: 300, 2: 100, 3: 200 };
const tally: { [grade: string]: number } = {};   // an index signature — same idea
```

With `noUncheckedIndexedAccess`, reading `latency[7]` gives `number | undefined` — the key might not be there. Day 05's `LATENCY[id] ?? 50` was already handling that correctly.

---

### 4.5 Classes With Types

A **class** is a blueprint for objects that have both **data** and **behaviour**. TypeScript adds types to every part of it:

```ts
class Student {
  readonly id: number;                 // declared with a type, before the constructor
  readonly name: string;
  #scores: number[] = [];              // # = private: invisible outside the class
  static count = 0;                    // belongs to the class, not to each object

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    Student.count++;
  }

  addScore(score: number): this {      // returning `this` lets calls chain
    this.#scores.push(score);
    return this;
  }

  get scoreCount(): number {           // a getter — read like a property
    return this.#scores.length;
  }

  average(): number { /* … */ }
}

const sara = new Student(1, "Sara").addScore(92).addScore(88);
sara.scoreCount;          // 2
sara.id = 99;             // ❌ Cannot assign to 'id' because it is a read-only property.
sara.#scores;             // ❌ Property '#scores' is not accessible outside class 'Student' …
```

| Keyword | Means |
|---|---|
| `readonly` | Set in the constructor, never changed after |
| `#field` | Truly private — enforced by JavaScript itself, at runtime too |
| `private field` | Private to TypeScript only — erased at runtime. Prefer `#` |
| `static` | One value shared by the class, not one per object |
| `get x()` | Computed on read, used like a property |
| `extends` | A child class that has everything the parent has, plus more |
| `super(…)` | Call the parent's constructor (or `super.method()` for its method) |
| `override` | "This replaces a parent method" — TypeScript checks the parent really has it |
| `implements` | "This class promises to match this interface" — TypeScript checks it |

**`implements`** connects classes to the interfaces from 4.1. The interface says *what* something can do; the class is one way to *build* it:

```ts
interface Gradable {
  readonly name: string;
  average(): number;
  letter(): string;
}

class Student implements Gradable { /* must have name, average() and letter() */ }
```

Now any code that works with a `Gradable` works with a `Student` — or any other class that implements it.

> **One shortcut you won't use:** TypeScript's "parameter properties" — `constructor(private name: string)` — declare and assign a field in one go. Like enums, they generate code, so `erasableSyntaxOnly` rejects them. Declare the field, then assign it in the constructor, as above.

---

### 4.6 Types Disappear, Classes Don't

Here's the difference that matters most:

| | Exists when the code **runs**? | Check it at runtime with |
|---|---|---|
| `interface`, `type` | ❌ Erased completely | a **type guard** you write (3.8) |
| `class` | ✅ It's real JavaScript | `instanceof` |

```ts
if (person instanceof Assistant) { … }   // ✅ works — Assistant is a real class
if (person instanceof Gradable) { … }    // ❌ 'Gradable' only refers to a type, but is being used as a value here.
```

So when do you use which?

- **Plain data** — anything that goes through `JSON.stringify` / `JSON.parse`, into a file, a database, or an API — use an **`interface`** and plain objects. JSON can't carry classes.
- **An object with behaviour and private state** — a store, a connection, a game character — a **class** is a good fit.

In this course, you'll mostly use interfaces and plain objects — that's also how React code is written. But you'll read classes everywhere: in Node, in libraries, and in Angular.

---

# Part 5 — Generics, Utility Types & a Real Project

## 5 — Concept (70 min)

### 5.1 The Problem Generics Solve

Write a function that returns the first item of a list. Without generics you have two bad choices:

```ts
// Choice 1: one function per type — copy-paste
function firstStudent(items: Student[]): Student | undefined { return items[0]; }
function firstCourse(items: Course[]): Course | undefined { return items[0]; }
function firstNumber(items: number[]): number | undefined { return items[0]; }

// Choice 2: any — one function, but the type is thrown away
function firstAny(items: any[]): any { return items[0]; }
const s = firstAny(students);    // any — s.nmae compiles, and crashes
```

**Generics** are the third option: one function that works for any type, **without losing which type it was**.

---

### 5.2 Generic Functions

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}
```

`<T>` is a **type parameter** — a placeholder, like a function parameter but for a type. Each call fills it in:

```ts
const s = first(students);        // T = Student  → Student | undefined
const c = first(courses);         // T = Course   → Course | undefined
const n = first([1, 2, 3]);       // T = number   → number | undefined
const e = first<string>([]);      // T given explicitly
```

You almost never write `<Student>` yourself — TypeScript **infers** `T` from the argument, the same way it infers a variable's type from its value.

Read `first<T>(items: T[]): T | undefined` as: *"for any type T, give me a list of T and I'll give you back a T (or undefined)."* The connection between the input and output type is the whole point — `any` can't express it.

> **`T` is just a name.** `T` for "type" is the convention; you'll also see `K` (key), `V` (value), `E` (element). For anything complicated, use a real name: `<TStudent>`, `<TResult>`.

---

### 5.3 Generics You've Been Using All Along

| Type | Means |
|---|---|
| `Array<T>` / `T[]` | A list of `T` |
| `Promise<T>` | A Promise that fulfils with a `T` — every `async` function returns one |
| `Map<K, V>` | A Map from `K` keys to `V` values |
| `Set<T>` | A Set of `T` |
| `Record<K, V>` | An object with `K` keys and `V` values |
| `PromiseSettledResult<T>` | Each entry `Promise.allSettled` gives you |
| `document.querySelector<T>()` | The element, typed as `T` (Step 16) |

```ts
const ids = new Map<number, Student>();
ids.set(1, sara);
ids.get(1);                 // Student | undefined — the Map might not have it

const tags = new Set<string>(["ts", "js"]);
tags.add(3);                // ❌ Argument of type 'number' is not assignable to parameter of type 'string'.
```

And Day 05's `Promise.all` — with a typed input, the result is typed too:

```ts
const [student, scores] = await Promise.all([getStudent(1), getScores(1)]);
//     Student  number[]    ← each position keeps its own type
```

---

### 5.4 Constraints — `extends` and `keyof`

A plain `T` could be anything, so you can't *do* much with it — not even read `.id`. A **constraint** says what `T` must at least have:

```ts
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id);    // ✅ every T has an id
}

findById(students, 2);      // ✅ Student has an id → returns Student | undefined
findById(courses, 10);      // ✅ Course has an id → returns Course | undefined
findById(["a", "b"], 1);    // ❌ Type 'string' is not assignable to type '{ id: number; }'.
```

Structural typing again: `T` doesn't need to be declared as anything — it only needs an `id: number`.

**`keyof T`** is the union of `T`'s property names. `keyof Student` is `"id" | "name" | "score"`. Combine it with a constraint and you can write functions that take a **property name** safely:

```ts
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

pluck(students, "name");     // string[]  — T[K] is Student["name"], which is string
pluck(students, "score");    // number[]
pluck(students, "email");    // ❌ Argument of type '"email"' is not assignable to parameter of type 'keyof Student'.
```

`T[K]` is an **indexed access type** — "the type of property K on T." The return type follows the key you pass. Autocomplete even offers the valid keys as you type the string.

---

### 5.5 Generic Types and Interfaces

Types can take parameters too. The most useful one you'll ever write:

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };
```

A discriminated union (3.7) that works for **any** value type. `Result<Student>`, `Result<number[]>`, `Result<string>` — one definition, every situation where something can succeed or fail:

```ts
function safeParse<T>(json: string, check: (value: unknown) => value is T): Result<T> {
  try {
    const value: unknown = JSON.parse(json);
    return check(value) ? { ok: true, value } : { ok: false, error: "wrong shape" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

const result = safeParse(text, isStudent);
if (result.ok) {
  result.value.name;      // ✅ Student
} else {
  result.error;           // ✅ string
}
```

Generic **interfaces** describe objects that hold a type — like a small in-memory store, built with a Day 03 closure:

```ts
interface Store<T extends { id: number }> {
  add(item: T): void;
  get(id: number): T | undefined;
  all(): readonly T[];
}

function createStore<T extends { id: number }>(): Store<T> {
  const items = new Map<number, T>();
  return {
    add: (item) => { items.set(item.id, item); },
    get: (id) => items.get(id),
    all: () => [...items.values()],
  };
}

const studentStore = createStore<Student>();   // here you DO write <Student> — no argument to infer from
studentStore.add({ id: 9, title: "Oops" });    // ❌ 'title' does not exist in type 'Student'.
```

---

### 5.6 Utility Types — New Types From Old Ones

TypeScript ships generic types that **transform** other types. They save you from writing the same shape three times with small differences.

```ts
interface Student {
  readonly id: number;
  name: string;
  score: number;
  github?: string;
}
```

| Utility | Result | Use it for |
|---|---|---|
| `Partial<Student>` | every property optional | an update: "change any of these" |
| `Required<Student>` | every property required | after defaults are filled in |
| `Readonly<Student>` | every property `readonly` | data nobody should change |
| `Pick<Student, "name" \| "score">` | only those properties | a public view / card |
| `Omit<Student, "id">` | everything **except** `id` | creating a new record — the database assigns the id |
| `Record<"A" \| "B", number>` | `{ A: number; B: number }` | dictionaries, tallies |
| `ReturnType<typeof fn>` | what `fn` returns | reusing a function's result type |
| `Awaited<Promise<T>>` | `T` | the value inside a Promise |

They combine:

```ts
type NewStudent = Omit<Student, "id">;                  // for addStudent
type StudentUpdate = Partial<Omit<Student, "id">>;      // for updateStudent — id can never change

function updateStudent(id: number, changes: StudentUpdate): Student { /* … */ }

updateStudent(2, { score: 68 });        // ✅
updateStudent(2, { id: 5 });            // ❌ 'id' does not exist in type 'Partial<Omit<Student, "id">>'
updateStudent(2, { score: "68" });      // ❌ Type 'string' is not assignable to type 'number'.
```

Change `Student` — add a field, rename one — and `NewStudent`, `StudentUpdate` and every function using them update themselves.

#### `as const` — values into types

```ts
const GRADES = ["A", "B", "C", "D", "F"] as const;
// readonly ["A", "B", "C", "D", "F"] — not string[]

type Grade = (typeof GRADES)[number];    // "A" | "B" | "C" | "D" | "F"
```

`as const` says "this value will never change — keep the exact literals." Then `typeof GRADES` turns the value into a type, and `[number]` takes the type of any element. One list, used both at runtime (to loop over) and as a type. It's also the idea behind the enum replacement in 2.10.

---

### 5.7 `tsconfig.json`, Line by Line

This is the config you'll use for the Day 06 project. `npx tsc --init` generates a longer one with most options commented out — you'll replace it with this:

```json
{
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",

    "target": "es2023",
    "module": "nodenext",
    "lib": ["es2023", "dom"],
    "types": ["node"],

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true,
    "rewriteRelativeImportExtensions": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

| Option | What it does |
|---|---|
| `rootDir` / `outDir` | Read `.ts` from `src/`, write `.js` to `dist/` with the same folder layout |
| `target` | Which JavaScript version to output. `es2023` keeps modern syntax as-is — every current browser and Node supports it. |
| `module: "nodenext"` | Follow Node's real module rules: `"type": "module"` in `package.json` means ESM, imports need extensions — exactly Day 05 Part 3 |
| `lib` | Which built-in APIs exist. `es2023` = the language. `dom` = `document`, `HTMLElement`, `fetch` — needed for the browser code. |
| `types: ["node"]` | Load `@types/node` — `node:fs/promises`, `process`, `import.meta.url` |
| `strict` | Turns on every safety check: no implicit `any`, `null` checks, `unknown` in `catch`… **Always on.** |
| `noUncheckedIndexedAccess` | `arr[i]` and `record[key]` include `undefined` — because they might be |
| `verbatimModuleSyntax` | Type-only imports must say `import type` (5.9) |
| `erasableSyntaxOnly` | Only allow TypeScript that can be deleted to get JavaScript — the exact rule Node uses (5.8) |
| `rewriteRelativeImportExtensions` | Write `./lib/grade-lib.ts` in your imports; `tsc` rewrites it to `.js` in `dist/` |
| `skipLibCheck` | Don't re-check the type files inside `node_modules` — faster, and not your bugs |
| `include` | Which files belong to this project |

> **Don't memorise this table.** Copy the config, and come back to the table when an error mentions one of these options.

---

### 5.8 Node Runs It, `tsc` Checks It, `tsc` Builds It

Your project now has three commands, which live in `package.json` as scripts:

```json
"scripts": {
  "report": "node src/report.ts",
  "check": "tsc --noEmit",
  "build": "tsc",
  "start": "node dist/report.js"
}
```

| Script | Does | When |
|---|---|---|
| `npm run report` | Runs `src/report.ts` directly — Node strips the types | While developing |
| `npm run check` | Type-checks everything, writes nothing (`--noEmit`) | Before every commit |
| `npm run build` | Type-checks **and** writes plain `.js` to `dist/` | For the browser, and for deploying |
| `npm start` | Runs the built JavaScript | Production-style |

#### What Node can strip — and what it can't

Node removes types by **deleting** them: `score: number` → `score`. That works for almost all TypeScript. A few older features aren't just annotations — they *generate* JavaScript, so deleting them would break the program:

```ts
enum Grade { A, B }
```

```
SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]: TypeScript enum is not supported in strip-only mode
```

`erasableSyntaxOnly` makes `tsc` flag these in the editor, before Node ever sees them:

```
error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
```

The main ones are `enum`, `namespace`, and class "parameter properties" (`constructor(private name: string)`). You won't miss them — use a literal union or `as const` instead of an `enum`:

```ts
// Instead of:  enum Grade { A = "A", B = "B", C = "C" }
const GRADES = ["A", "B", "C", "D", "F"] as const;
type Grade = (typeof GRADES)[number];
```

> **The workflow:** keep the editor open (it checks as you type), run with `npm run report`, and run `npm run check` before you commit. The build step is only for the browser — and later, for deploying.

---

### 5.9 Modules in TypeScript

Everything from Day 05 Part 3 still applies — `export`, `import`, named vs default, barrels. Three additions:

**1. Import `.ts` files with their `.ts` extension.**

```ts
import { letterGrade } from "./lib/grade-lib.ts";
```

Node runs `src/` directly, so the file really is called `.ts`. When `tsc` builds `dist/`, `rewriteRelativeImportExtensions` turns it into `./lib/grade-lib.js`. Leave the extension off and it's Day 05's `ERR_MODULE_NOT_FOUND` again.

**2. Types are exported and imported like anything else.**

```ts
// types.ts
export interface Student { id: number; name: string; score: number }
export type LetterGrade = "A" | "B" | "C" | "D" | "F";
```

**3. Import types with `import type`.**

```ts
import type { Student, LetterGrade } from "./types.ts";
```

`import type` is erased completely — it never reaches Node or the browser. Forget it, and Node tries to import a `Student` value that doesn't exist at runtime:

```
SyntaxError: The requested module './types.ts' does not provide an export named 'Student'
```

`verbatimModuleSyntax` catches this in the editor first:

```
error TS1484: 'Student' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.
```

You can mix both in one line: `import { letterGrade, type LetterGrade } from "./lib/grade-lib.ts";`

---

### 5.10 TypeScript in the Browser

The browser **can't** run `.ts` — only Node strips types. So for the browser you build first, then load the JavaScript:

```
src/main.ts ──tsc──▶ dist/main.js ◀── <script type="module" src="./dist/main.js">
```

With `"dom"` in `lib`, every DOM API is typed — and the types are honest about what can go wrong:

```ts
const button = document.getElementById("load");   // HTMLElement | null
button.disabled = true;
// ~~~~ 'button' is possibly 'null'.
```

`getElementById` returns `null` when the id doesn't exist — a typo in the HTML, or a script that runs too early. In JavaScript you'd find out with `Cannot set properties of null`. TypeScript makes you decide up front:

```ts
const button = document.getElementById("load");
if (!button) throw new Error("Missing #load in index.html");
```

And `HTMLElement` doesn't have `.disabled` or `.value` — only buttons and inputs do. The DOM uses **generics** for this:

```ts
const input = document.querySelector<HTMLInputElement>("#score");   // HTMLInputElement | null
input?.valueAsNumber;     // ✅ number — inputs have this, generic HTMLElements don't
```

Step 16 wraps both ideas in one small generic helper, `$<T>(id)`.

> **Types describe; they don't check.** `querySelector<HTMLInputElement>` *tells* TypeScript it's an input — it doesn't verify it. If `#score` is actually a `<div>`, you're back to runtime bugs. Keep your ids and your types honest.

---

### 5.11 Types From npm

Most npm packages ship their own type definitions today — install them and the types come along. For older packages that don't, the community publishes them separately under `@types/`:

```bash
npm install dayjs                  # ships its own types — nothing else needed
npm install --save-dev @types/node # types for Node's built-ins
```

If you import a package with no types at all, you get:

```
Could not find a declaration file for module 'x'. … implicitly has an 'any' type.
```

Try `npm install --save-dev @types/x`. If that doesn't exist either, it's a sign to pick a better-maintained package.

The type files end in **`.d.ts`** — "declaration" files: types only, no code. Open `node_modules/@types/node/fs/promises.d.ts` and search for `readFile` — that's where your editor's hover text comes from.

---

### 5.12 Moving From JavaScript to TypeScript

You're about to convert a real project. The approach that works:

1. **Rename** `.js` → `.ts`. Nothing else yet. Everything is valid TypeScript, so it runs.
2. Run **`npm run check`**. Read the first error only.
3. Fix it by **describing the real data** — add a parameter type, write an `interface`, handle the `undefined`. Never by adding `any`.
4. Repeat until it's clean. Commit.

Some errors will be real bugs your JavaScript always had. Step 14 finds two in Day 05's `retry`.

**When you're genuinely stuck** — and only then:

```ts
// @ts-expect-error — the library's types are wrong about this; see issue #123
thing.brokenMethod();
```

`@ts-expect-error` silences the error on the next line, *and* becomes an error itself once the problem is fixed — so it can't hide forever. Prefer it to `// @ts-ignore`, and always say why.

---

## Build — Follow Along

Create a folder `day-06` in your repo. Steps 1–2 are Part 1, Steps 3–5 are Part 2, Steps 6–8 are Part 3, Steps 9–10 are Part 4, Steps 11–17 are Part 5.

> **Do today's work on a branch.** Day 05 Step 11 showed how: `git switch -c feature/day-06` before your first file.

### Step 1 — Setup + `hello.ts`

```bash
mkdir day-06
cd day-06
npm init -y
npm install --save-dev typescript @types/node
```

Add `"type": "module"` to the `package.json` npm just created (Day 05 Part 3):

```json
{
  "name": "day-06",
  "type": "module",
  …
}
```

Create `tsconfig.json`. This is a smaller version of the Part 5 config — no `dist/`, because nothing in these lab files is built, only checked:

```json
{
  "compilerOptions": {
    "target": "es2023",
    "module": "nodenext",
    "types": ["node"],

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true,
    "skipLibCheck": true
  },
  "exclude": ["project"]
}
```

(`"exclude": ["project"]` because Step 13's project has its own config.)

Make sure `node_modules/` is in your `.gitignore` (Day 05 Task 9). Then write `hello.ts`:

```ts
// hello.ts — your first TypeScript file

function letterGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

const name: string = "Sara";
const score: number = 92;

console.log(`${name}: ${letterGrade(score)}`);
console.log(`Yusuf: ${letterGrade("ninety")}`);
```

Before you run anything, look at the last line in VS Code. It's already underlined. Hover over it.

Now run it:

```bash
node hello.ts
```

```
Sara: A
Yusuf: F
```

**It ran.** Node stripped the types and ran the JavaScript — including the bug. Yusuf scored 95, and got an F. Now check it:

```bash
npx tsc
```

```
hello.ts(15,35): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

File, line 15, column 35, an error code, and a sentence. Fix it — `letterGrade(95)` — and run `npx tsc` again. No output means **no errors**.

> **This is the whole day in one file.** Node runs whatever you give it. `tsc` tells you what's wrong with it. You need both — and when they disagree, `tsc` is right.

---

### Step 2 — `reading-errors.ts` — Five Bugs, Five Errors

This file has five bugs in it. Type it in exactly as it is:

```ts
// reading-errors.ts — five bugs. Node runs this file happily. tsc finds all five.

const student = { name: "Sara", score: 92, passed: true };

// 1. A typo in a property name
console.log(student.nmae);

// 2. A string where a number belongs
const bonus = "5";
const total: number = student.score + bonus;

// 3. Calling something that isn't a function
student.score();

// 4. Too few arguments
function percent(part: number, whole: number): number {
  return (part / whole) * 100;
}
console.log(percent(46));

// 5. A value that might not exist
const scores = [92, 68, 79];
const top = scores.find((s) => s > 95);
console.log(top.toFixed(1));

console.log("If you can read this, Node ran every line — bugs and all.", total);
```

Run it first:

```bash
node reading-errors.ts
```

```
undefined
file:///…/reading-errors.ts:13
student.score();
        ^

TypeError: student.score is not a function
```

Node printed `undefined` for bug 1 — silently wrong — then crashed on bug 3. Bugs 4 and 5 never even ran. You'd find them one crash at a time, in production.

Now check it:

```bash
npx tsc
```

```
reading-errors.ts(6,21): error TS2339: Property 'nmae' does not exist on type '{ name: string; score: number; passed: boolean; }'.
reading-errors.ts(10,7): error TS2322: Type 'string' is not assignable to type 'number'.
reading-errors.ts(13,9): error TS2349: This expression is not callable.
  Type 'Number' has no call signatures.
reading-errors.ts(19,13): error TS2554: Expected 2 arguments, but got 1.
reading-errors.ts(24,13): error TS18048: 'top' is possibly 'undefined'.
```

**All five, at once, without running anything.** For each one, find the file, line and column, match the code to the table in 1.4, and fix it:

1. `nmae` → `name`
2. `const bonus = 5;` — a number, not a string (or convert it: `Number(bonus)`)
3. Delete the line — a score isn't a function
4. `percent(46, 50)`
5. `console.log(top?.toFixed(1) ?? "no score above 95");`

Run `npx tsc` after each fix and watch the list shrink. When it prints nothing, run `node reading-errors.ts` — every line runs, and prints what you meant.

---

### Step 3 — `primitives.ts` — The Seven Primitives

```ts
// primitives.ts — the seven primitive types, one at a time

// ---------- string ----------
const firstName: string = "Sara";
const lastName = 'Ali';                         // inferred: string — ' and " are the same
const greeting = `Hello, ${firstName} ${lastName}`;  // template literal — still a string
console.log("string: ", greeting, "·", greeting.length, "chars ·", firstName.toUpperCase());

// ---------- number ----------
// One type for whole numbers AND decimals — there is no separate int or float
const score: number = 92;
const average = 83.75;
const negative = -12;
const big = 1_000_000;                          // underscores just help you read it
console.log("number: ", score, average, negative, big, "·", average.toFixed(1), "·", 0.1 + 0.2);
console.log("        ", 10 / 0, -10 / 0, Number("ninety"), Number.isNaN(Number("ninety")));   // Infinity, -Infinity, NaN — all type number

// ---------- boolean ----------
const passed: boolean = score >= 60;
const isAdmin = false;
console.log("boolean:", passed, isAdmin, "·", passed && !isAdmin);

// ---------- bigint ----------
// For whole numbers too big for number (above 2^53). Written with an n on the end.
const maxSafe = Number.MAX_SAFE_INTEGER;        // 9007199254740991
console.log("number is unsafe past 2^53:", maxSafe + 1 === maxSafe + 2);   // true — precision lost
const huge: bigint = 9007199254740993n;
console.log("bigint: ", huge + 1n, typeof huge);
// huge + 1;                                    // ❌ Operator '+' cannot be applied to types 'bigint' and '1'.

// ---------- symbol ----------
// A value that is guaranteed unique — even two symbols with the same description differ
const id1: symbol = Symbol("id");
const id2: symbol = Symbol("id");
console.log("symbol: ", id1 === id2, id1.description, typeof id1);

// ---------- null and undefined ----------
let nickname: string | null = null;             // null = "deliberately empty"
let middleName: string | undefined;             // undefined = "not set yet"
console.log("empty:  ", nickname, middleName);
nickname = "Sassy";
middleName = "M.";
console.log("filled: ", nickname, middleName);
// const title: string = null;                  // ❌ Type 'null' is not assignable to type 'string'.

// ---------- inference and "widening" ----------
let letGrade = "A";                             // string — a let can change, so TS widens it
const constGrade = "A";                         // "A"    — a const can't, so TS keeps the literal
letGrade = "B";                                 // ✅
// letGrade = 90;                               // ❌ Type 'number' is not assignable to type 'string'.
console.log("literal:", letGrade, constGrade);

// ---------- converting between types ----------
// Types don't convert values. Functions do.
const fromForm = "68";                          // everything from an <input> is a string
const asNumber = Number(fromForm);              // 68       — number
const asInt = Number.parseInt("68.9px", 10);    // 68       — reads digits until it can't
const asText = String(score);                   // "92"     — string
const asBool = Boolean("");                     // false    — "" 0 null undefined NaN are falsy
console.log("convert:", asNumber + 1, asInt, asText + 1, asBool);

// typeof — the RUNTIME check. It's how you ask what a value is while the program runs.
const samples: [label: string, value: unknown][] = [
  ['"text"', "text"], ["42", 42], ["true", true], ["10n", 10n], ["Symbol()", Symbol()], ["undefined", undefined], ["null", null],
];
for (const [label, value] of samples) {
  console.log(`  typeof ${label.padEnd(9)} → ${typeof value}`);
}
console.log("  (typeof null is \"object\" — a 30-year-old JavaScript bug. Check null with === null.)");
```

```bash
node primitives.ts
npx tsc
```

```
string:  Hello, Sara Ali · 15 chars · SARA
number:  92 83.75 -12 1000000 · 83.8 · 0.30000000000000004
         Infinity -Infinity NaN true
boolean: true false · true
number is unsafe past 2^53: true
bigint:  9007199254740994n bigint
symbol:  false id symbol
empty:   null undefined
filled:  Sassy M.
literal: B A
convert: 69 68 921 false
  typeof "text"    → string
  typeof 42        → number
  typeof true      → boolean
  typeof 10n       → bigint
  typeof Symbol()  → symbol
  typeof undefined → undefined
  typeof null      → object
  (typeof null is "object" — a 30-year-old JavaScript bug. Check null with === null.)
```

Then:

1. **Hover** over `lastName`, `average`, `letGrade` and `constGrade`. `letGrade` is `string`; `constGrade` is `"A"` — 2.1.
2. **Uncomment** each `❌` line, one at a time. Read the error, then comment it back.
3. Change `const fromForm = "68"` to `"sixty-eight"` and run it. `asNumber + 1` prints `NaN` — and TypeScript didn't complain, because `NaN` is a `number`. Types can't catch everything; that's why you still check user input.
4. Look at the last line of output. `typeof null` is `"object"`. Remember it — it's in Task 1.

---

### Step 4 — `collections.ts` — Arrays, Tuples, Objects

```ts
// collections.ts — arrays, tuples, and objects

// ---------- arrays: every element has the same type ----------
const scores: number[] = [92, 68, 79];
const names: Array<string> = ["Sara", "Omar"];   // the same thing, generic spelling (Part 5)
const empty: string[] = [];                      // an empty array NEEDS an annotation — nothing to infer from

scores.push(95);
// scores.push("100");                           // ❌ Argument of type 'string' is not assignable to parameter of type 'number'.
empty.push("first");

// Array methods keep the types flowing — no annotations needed inside
const doubled = scores.map((s) => s * 2);                 // number[]
const labels = scores.map((s) => `${s}%`);                // string[]
const passing = scores.filter((s) => s >= 70);            // number[]
const total = scores.reduce((sum, s) => sum + s, 0);      // number
console.log("arrays:  ", doubled, labels, passing, total);

// Mixed arrays need a union — parentheses matter
const mixed: (string | number)[] = ["Sara", 92, "Omar", 68];
// const wrong: string | number[] = ["Sara", 92];         // ❌ this means "a string, OR an array of numbers"
console.log("mixed:   ", mixed.length, typeof mixed[0], typeof mixed[1]);

// readonly arrays — the compiler blocks every change
const GRADES: readonly string[] = ["A", "B", "C", "D", "F"];
// GRADES.push("E");                             // ❌ Property 'push' does not exist on type 'readonly string[]'.
console.log("readonly:", GRADES.join(" "));

// Reading by index may find nothing — noUncheckedIndexedAccess says so
const third = scores[2];                          // number | undefined
const tenth = scores[9];                          // number | undefined — and it IS undefined
console.log("index:   ", third?.toFixed(0), tenth ?? "(nothing at 9)");

// ---------- tuples: a fixed length, a type per position ----------
const entry: [string, number] = ["Sara", 92];
const [who, mark] = entry;                        // who: string, mark: number
// const bad: [string, number] = [92, "Sara"];    // ❌ order matters

// Named tuples document themselves, and elements can be optional
type Point = [x: number, y: number, label?: string];
const home: Point = [3, 4];
const shop: Point = [10, 2, "shop"];

// A function returning two things at once — the useState pattern you'll meet in React
function minMax(values: number[]): [min: number, max: number] {
  return [Math.min(...values), Math.max(...values)];
}
const [low, high] = minMax(scores);
console.log("tuples:  ", who, mark, home, shop, low, high);

// ---------- objects: a type for each property ----------
const sara: { name: string; score: number; email?: string } = { name: "Sara", score: 92 };
// sara.age = 20;                                 // ❌ Property 'age' does not exist on type …
sara.email = "sara@example.com";                  // ✅ optional — allowed to be missing, allowed to be set

// Nested objects and arrays of objects
const course: {
  title: string;
  teacher: { name: string; github?: string };
  students: { name: string; score: number }[];
} = {
  title: "JS Everywhere",
  teacher: { name: "Mostafa" },
  students: [{ name: "Sara", score: 92 }, { name: "Omar", score: 68 }],
};

const best = course.students.reduce((a, b) => (b.score > a.score ? b : a));
console.log("objects: ", sara, `· ${course.title} by ${course.teacher.name} · best: ${best.name}`);
// That inline type is long — Part 4 gives it a name with `interface`.
```

```bash
node collections.ts
npx tsc
```

```
arrays:   [ 184, 136, 158, 190 ] [ '92%', '68%', '79%', '95%' ] [ 92, 79, 95 ] 334
mixed:    4 string number
readonly: A B C D F
index:    79 (nothing at 9)
tuples:   Sara 92 [ 3, 4 ] [ 10, 2, 'shop' ] 68 95
objects:  { name: 'Sara', score: 92, email: 'sara@example.com' } · JS Everywhere by Mostafa · best: Sara
```

Then:

1. **Hover** over `doubled`, `labels`, `total`, `third`, `low` and `high`. You wrote no annotation on any of them.
2. Uncomment the `❌` lines one at a time. The `wrong` one is the parentheses trap from 2.5 — read its error carefully.
3. Change `const empty: string[] = []` to `const empty = []`, then `empty.push("first")`. Hover over `empty` before and after — without an annotation, TypeScript has to guess.
4. In `course`, delete `title: "JS Everywhere",`. The error names exactly which property is missing, and where.

---

### Step 5 — `special-types.ts` — `any`, `unknown`, `never`, Unions, Enums

```ts
// special-types.ts — any, unknown, void, never, literals, unions, aliases, enums, assertions

// ---------- any: the off switch ----------
const loose: any = "text";
try {
  loose.toFixed(2);                               // compiles — nothing is checked on an any…
} catch (err) {
  console.log("any:      crashed at runtime →", err instanceof Error ? err.message : err);
}

// ---------- unknown: the safe "I don't know yet" ----------
const data: unknown = JSON.parse('{"score": 92}');
// data.score;                                    // ❌ 'data' is of type 'unknown'.
if (typeof data === "object" && data !== null && "score" in data) {
  console.log("unknown:  checked first, then used →", data.score);
}

// ---------- void: a function that returns nothing useful ----------
function logLine(message: string): void {
  console.log(`void:     ${message}`);
}
logLine("returned nothing");

// ---------- never: a value that can't exist ----------
function fail(message: string): never {
  throw new Error(message);                       // never returns — it always throws
}
try {
  fail("stopped here");
} catch (err) {
  console.log("never:   ", err instanceof Error ? err.message : err);
}

// ---------- literal types and unions ----------
type LetterGrade = "A" | "B" | "C" | "D" | "F";  // exactly these five strings
type Dice = 1 | 2 | 3 | 4 | 5 | 6;               // exactly these six numbers
type Id = number | string;                        // either kind of value

const grade: LetterGrade = "B";
// const typo: LetterGrade = "b";                 // ❌ Type '"b"' is not assignable to type 'LetterGrade'. Did you mean '"B"'?
const roll: Dice = 4;
const ids: Id[] = [7, "A-42"];
console.log("literals:", grade, roll, ids);

// ---------- type aliases: a name for any type ----------
type Score = number;
type Student = { name: string; score: Score; grade?: LetterGrade };
const omar: Student = { name: "Omar", score: 68, grade: "D" };

// ---------- intersections: all of these at once ----------
type WithId = { id: number };
type StoredStudent = Student & WithId;           // every property from both
const stored: StoredStudent = { id: 2, ...omar };
console.log("& :      ", stored);

// ---------- enums, and what we use instead ----------
// Many TypeScript codebases use:   enum Level { Beginner, Intermediate, Advanced }
// An enum GENERATES JavaScript, so Node can't simply strip it — see section 2.10.
// The modern replacement: an `as const` object, and a union of its values.
const Level = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Advanced: "advanced",
} as const;
type Level = (typeof Level)[keyof typeof Level]; // "beginner" | "intermediate" | "advanced"

function describeLevel(level: Level): string {
  return level === Level.Advanced ? "Ready for Track 2" : `Keep going (${level})`;
}
console.log("enum-ish:", describeLevel(Level.Beginner), "·", describeLevel("advanced"));
// describeLevel("expert");                       // ❌ not one of the three

// ---------- type assertions: telling TypeScript something it can't know ----------
const raw: unknown = JSON.parse('{"name":"Lina","score":79}');
const lina = raw as Student;                      // ⚠ no check happens — you're vouching for it
console.log("as:      ", lina.name, lina.score);

const ghost = JSON.parse('{"name":"Ghost"}') as Student;
console.log("as lies: ", ghost.name, ghost.score, "← TypeScript thinks this is a number");

// as const: freeze a value into its literal types
const settings = { theme: "dark", fontSize: 14 } as const;
// settings.theme = "light";                      // ❌ Cannot assign to 'theme' because it is a read-only property.
console.log("as const:", settings.theme, settings.fontSize);
```

```bash
node special-types.ts
npx tsc
```

```
any:      crashed at runtime → loose.toFixed is not a function
unknown:  checked first, then used → 92
void:     returned nothing
never:    stopped here
literals: B 4 [ 7, 'A-42' ]
& :       { id: 2, name: 'Omar', score: 68, grade: 'D' }
enum-ish: Keep going (beginner) · Ready for Track 2
as:       Lina 79
as lies:  Ghost undefined ← TypeScript thinks this is a number
as const: dark 14
```

Then:

1. Change `const loose: any` to `const loose: unknown`. The `toFixed` line turns red — `unknown` caught what `any` let through. Change it back.
2. Uncomment the `❌` lines one at a time. The `"b"` one even suggests the fix.
3. **Hover** over the `Level` **type** (the `type Level = …` line). It's `"beginner" | "intermediate" | "advanced"` — built from the object's values.
4. Write a real enum at the bottom: `enum Color { Red, Green }` and `console.log(Color.Red);`. Look at the red underline, then run `node special-types.ts` and read Node's error. Delete it.
5. Look at the `as lies:` line of output: `Ghost undefined`. `ghost.score` has type `number` and value `undefined`. That's what an assertion can do to you.

---

### Step 6 — `functions.ts` — Typed Functions

```ts
// functions.ts — typing functions: parameters, returns, callbacks, async

// 1. Parameters and the return type
function letterGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

// Arrow functions: the same annotations, in the same places
const isPassing = (score: number): boolean => score >= 60;

// 2. Optional (?), default (=) and rest (...) parameters
function greet(name: string, greeting = "Hello", emoji?: string): string {
  return `${greeting}, ${name}${emoji ? ` ${emoji}` : "!"}`;
}

function average(...scores: number[]): number {           // any number of arguments → one array
  return scores.length === 0 ? 0 : scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

// 3. void — used for its effect, not its result
function logRow(name: string, score: number): void {
  console.log(`  ${name.padEnd(5)} ${String(score).padStart(3)}  ${letterGrade(score)}  ${isPassing(score) ? "PASS" : "FAIL"}`);
}

// 4. Function TYPES — the shape of a function, given a name
type Grader = (score: number) => string;
type Formatter = (name: string, score: number) => void;

const strict: Grader = (score) => (score >= 75 ? "PASS" : "FAIL");    // score: number — contextual typing
const lenient: Grader = (score) => (score >= 50 ? "PASS" : "FAIL");

// 5. Callbacks — a function that takes a function (Day 03), fully typed
function report(students: [string, number][], format: Formatter): void {
  for (const [name, score] of students) format(name, score);
}

function gradeAll(scores: number[], grader: Grader): string[] {
  return scores.map(grader);
}

// 6. Destructured parameters — the type goes after the whole pattern
function card({ name, score }: { name: string; score: number }): string {
  return `${name} (${score})`;
}

// 7. async functions return Promise<T>
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchScore(name: string): Promise<number> {
  await delay(50);
  if (name === "Ghost") throw new Error(`No student called ${name}`);
  return name.length * 15;
}

// 8. Overloads — one function, different argument shapes, a precise return for each
function format(value: number): string;
function format(value: number[]): string[];
function format(value: number | number[]): string | string[] {
  return Array.isArray(value) ? value.map((v) => `${v}%`) : `${value}%`;
}

// ---------- run it ----------
const students: [string, number][] = [["Sara", 92], ["Omar", 68], ["Lina", 79]];

console.log(greet("Sara"), "·", greet("Omar", "Welcome", "👋"));
console.log("average of three:", average(92, 68, 79).toFixed(1), "· of none:", average());
report(students, logRow);
console.log("strict: ", gradeAll([92, 68, 79], strict).join(" "));
console.log("lenient:", gradeAll([92, 68, 79], lenient).join(" "));
console.log("card:   ", card({ name: "Lina", score: 79 }));
console.log("format: ", format(92), format([92, 68]));

const score = await fetchScore("Sara");            // number — await unwraps Promise<number>
console.log("async:  ", score);
try {
  await fetchScore("Ghost");
} catch (err) {
  console.log("async:  ", err instanceof Error ? err.message : err);
}

// ❌ Uncomment one at a time:
// letterGrade("92");                             // Argument of type 'string' is not assignable to parameter of type 'number'.
// greet();                                       // Expected 1-3 arguments, but got 0.
// const n: number = fetchScore("Sara");          // Type 'Promise<number>' is not assignable to type 'number'.
// const wrong: Grader = (s: string) => s;        // Type '(s: string) => string' is not assignable to type 'Grader'.
```

```bash
node functions.ts
npx tsc
```

```
Hello, Sara! · Welcome, Omar 👋
average of three: 79.7 · of none: 0
  Sara   92  A  PASS
  Omar   68  D  PASS
  Lina   79  C  PASS
strict:  PASS FAIL PASS
lenient: PASS PASS PASS
card:    Lina (79)
format:  92% [ '92%', '68%' ]
async:   60
async:   No student called Ghost
```

Then:

1. **Hover** over the `score` parameter inside `strict` and `lenient` — `number`, with no annotation. That's contextual typing (3.3).
2. Hover over `format(92)` and `format([92, 68])` — two different return types from one function (3.4).
3. Uncomment the four `❌` lines at the bottom, one at a time.
4. Delete the `: number` return type from `fetchScore`, and hover over it. TypeScript inferred `Promise<number>` by itself. Put it back.

---

### Step 7 — `narrowing.ts` — Unions and Narrowing

```ts
// narrowing.ts — unions, literal types, and how TypeScript narrows them

// A literal union: only these five strings are allowed
type LetterGrade = "A" | "B" | "C" | "D" | "F";

function letterGrade(score: number): LetterGrade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

// A score from a form might be a number, a string, or missing
function describe(score: number | string | null): string {
  if (score === null) {
    return "no score yet";                     // here: null
  }
  if (typeof score === "string") {
    const parsed = Number(score);              // here: string
    if (Number.isNaN(parsed)) return `"${score}" is not a number`;
    return describe(parsed);
  }
  return `${score} → ${letterGrade(score)}`;   // here: only number is left
}

console.log(describe(92));
console.log(describe("68"));
console.log(describe("ninety"));
console.log(describe(null));

// Optional values: ?. and ?? work exactly as in JavaScript — now TS checks you used them
type Profile = { name: string; github?: string };

function githubLink(profile: Profile): string {
  // profile.github.toLowerCase();            // ❌ 'profile.github' is possibly 'undefined'
  return profile.github?.toLowerCase() ?? "(no GitHub yet)";
}

console.log(githubLink({ name: "Sara", github: "SaraCodes" }));
console.log(githubLink({ name: "Omar" }));

// Narrowing arrays: find() may find nothing
const scores = [55, 68, 92];
const firstPass = scores.find((s) => s >= 60);   // number | undefined
if (firstPass !== undefined) {
  console.log(`first pass: ${firstPass.toFixed(0)}`);
}

// Exhaustive switch over a literal union
function message(grade: LetterGrade): string {
  switch (grade) {
    case "A": return "Excellent";
    case "B": return "Very good";
    case "C": return "Good";
    case "D": return "Pass";
    case "F": return "Try again";
  }
}
console.log((["A", "C", "F"] as const).map(message).join(" · "));
```

```bash
node narrowing.ts
npx tsc
```

```
92 → A
68 → D
"ninety" is not a number
no score yet
saracodes
(no GitHub yet)
first pass: 68
Excellent · Good · Try again
```

Now break it:

1. Inside `describe`, **hover** over `score` in each of the three `return` lines. Three different types for one variable — that's narrowing.
2. Delete the `if (score === null)` block. `letterGrade(score)` turns red: `null` isn't a `number`.
3. Delete the `case "F"` line from `message`. Its `: string` return type turns red — `Function lacks ending return statement and return type does not include 'undefined'.` TypeScript knows `"F"` is no longer handled, so the function could fall off the end.
4. Uncomment the `profile.github.toLowerCase()` line and read the error.

---

### Step 8 — `results.ts` — Discriminated Unions and Safe JSON

```ts
// results.ts — discriminated unions, exhaustive checks, and safe JSON

interface Student {
  id: number;
  name: string;
  score: number;
}

// 1. A discriminated union — every member has `status`, with a different literal value
type LoadState =
  | { status: "idle" }
  | { status: "loading"; progress: number }
  | { status: "loaded"; students: Student[] }
  | { status: "failed"; error: string };

function describe(state: LoadState): string {
  switch (state.status) {
    case "idle":
      return "Press Load";
    case "loading":
      return `Loading… ${state.progress}%`;          // progress only exists in this case
    case "loaded":
      return `${state.students.length} students`;
    case "failed":
      return `✗ ${state.error}`;
    default: {
      const unreachable: never = state;    // add a 5th status and this line turns red
      return unreachable;
    }
  }
}

const states: LoadState[] = [
  { status: "idle" },
  { status: "loading", progress: 40 },
  { status: "loaded", students: [{ id: 1, name: "Sara", score: 92 }] },
  { status: "failed", error: "Timed out after 2000ms" },
];
for (const s of states) console.log(describe(s));

// 2. You've used one already: Promise.allSettled returns a discriminated union
const settled = await Promise.allSettled([Promise.resolve(92), Promise.reject(new Error("down"))]);
for (const r of settled) {
  if (r.status === "fulfilled") console.log("value:", r.value);      // r.value exists only here
  else console.log("reason:", (r.reason as Error).message);          // r.reason exists only here
}

// 3. JSON is unknown until you check it — a type guard does the checking
function isStudent(value: unknown): value is Student {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "number" && typeof v.name === "string" && typeof v.score === "number";
}

const raw: unknown = JSON.parse(`[
  { "id": 1, "name": "Sara", "score": 92 },
  { "id": 2, "name": "Omar", "score": "68" },
  { "id": 3, "name": "Lina" }
]`);

if (Array.isArray(raw)) {
  const students = raw.filter(isStudent);                 // Student[]
  console.log(`valid: ${students.map((s) => s.name).join(", ")} · rejected: ${raw.length - students.length}`);
}
```

```bash
node results.ts
npx tsc
```

```
Press Load
Loading… 40%
1 students
✗ Timed out after 2000ms
value: 92
reason: down
valid: Sara · rejected: 2
```

Now:

1. Add `| { status: "cancelled" }` to `LoadState`. The `never` line turns red: `Type '{ status: "cancelled"; }' is not assignable to type 'never'.` Add a `case "cancelled"` and it goes away.
2. In the `"idle"` case, try to read `state.progress`. Error — `progress` only exists on the `"loading"` member.
3. Change `value is Student` to `boolean`. `students` becomes `any[]`, and `s.name` is no longer checked. Put it back — the return type *is* the type guard.
4. Omar's score is the string `"68"` — so the guard rejected him. That's Day 04's `isValid` doing its job, now typed.

---

### Step 9 — `shapes.ts` — Interfaces and Types

```ts
// shapes.ts — describing objects with type aliases and interfaces

// A type alias — a name for any type
type ID = number;

// An interface — a name for an object shape
interface Student {
  readonly id: ID;               // can't be reassigned after creation
  name: string;
  score: number;
  github?: string;               // optional — may be missing
}

interface Course {
  id: ID;
  title: string;
  students: Student[];
}

// extends — everything a Student has, plus more
interface GradedStudent extends Student {
  grade: "A" | "B" | "C" | "D" | "F";
  passed: boolean;
}

// The same thing with a type alias and & (an intersection)
type GradedStudent2 = Student & { grade: string; passed: boolean };

const sara: Student = { id: 1, name: "Sara", score: 92, github: "SaraCodes" };
const omar: Student = { id: 2, name: "Omar", score: 68 };

// sara.id = 99;                                // ❌ Cannot assign to 'id' because it is a read-only property
// const bad: Student = { id: 3, name: "Lina" };           // ❌ Property 'score' is missing
// const typo: Student = { id: 3, name: "Lina", scor: 79 };  // ❌ 'scor' does not exist in type 'Student'

function grade(student: Student): GradedStudent {
  const letter = student.score >= 90 ? "A" : student.score >= 80 ? "B" : student.score >= 70 ? "C" : student.score >= 60 ? "D" : "F";
  return { ...student, grade: letter, passed: student.score >= 60 };
}

const course: Course = { id: 10, title: "JS Everywhere", students: [sara, omar] };

for (const s of course.students.map(grade)) {
  console.log(`${s.name.padEnd(5)} ${s.score}  ${s.grade}  ${s.passed ? "PASS" : "FAIL"}  ${s.github ?? "—"}`);
}

// Structural typing: the shape matters, not the name
const fromForm = { id: 3, name: "Lina", score: 79, source: "form" };
const lina: Student = fromForm;                 // ✅ extra property is fine when it's not a fresh literal
console.log(`${lina.name} fits the Student shape`);

// Index signatures and Record — objects used as dictionaries
const latency: Record<number, number> = { 1: 300, 2: 100, 3: 200 };
const tally: { [grade: string]: number } = {};
for (const s of course.students.map(grade)) tally[s.grade] = (tally[s.grade] ?? 0) + 1;
console.log("latency for #2:", latency[2], "· tally:", tally);

// A mixed type check — GradedStudent2 is a valid alternative
const alt: GradedStudent2 = { ...omar, grade: "D", passed: true };
console.log(`${alt.name} via intersection: ${alt.grade}`);
```

```bash
node shapes.ts
npx tsc
```

```
Sara  92  A  PASS  SaraCodes
Omar  68  D  PASS  —
Lina fits the Student shape
latency for #2: 100 · tally: { A: 1, D: 1 }
Omar via intersection: D
```

Uncomment the three `❌` lines one at a time and read each error. The `scor` one even suggests the fix: `Did you mean to write 'score'?`

Then try two more:

1. In `grade`, return `{ ...student, passed: true }` without `grade`. The error names exactly what's missing.
2. In the `for` loop, type `s.` and look at the autocomplete list — every property of `GradedStudent`, including the ones it got from `Student` through `extends`.

---

### Step 10 — `classes.ts` — Classes With Types

```ts
// classes.ts — classes with types: fields, constructors, private, readonly, implements

// An interface describes WHAT something can do…
interface Gradable {
  readonly name: string;
  average(): number;
  letter(): string;
}

// …a class is one way to BUILD it. `implements` makes TypeScript check the promise.
class Student implements Gradable {
  // Every field is declared, with its type, before the constructor
  readonly id: number;                   // set once, in the constructor — never again
  readonly name: string;
  #scores: number[] = [];                // # = truly private: not even reachable at runtime
  static count = 0;                      // belongs to the class, not to each student

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    Student.count++;
  }

  addScore(score: number): this {        // returning `this` lets calls chain
    if (score < 0 || score > 100) throw new Error(`Score out of range: ${score}`);
    this.#scores.push(score);
    return this;
  }

  get scoreCount(): number {             // a getter — read like a property: sara.scoreCount
    return this.#scores.length;
  }

  average(): number {
    if (this.#scores.length === 0) return 0;
    return this.#scores.reduce((sum, s) => sum + s, 0) / this.#scores.length;
  }

  letter(): string {
    const avg = this.average();
    return avg >= 90 ? "A" : avg >= 80 ? "B" : avg >= 70 ? "C" : avg >= 60 ? "D" : "F";
  }
}

// extends — everything a Student has, plus more
class Assistant extends Student {
  readonly course: string;

  constructor(id: number, name: string, course: string) {
    super(id, name);                     // the parent's constructor runs first
    this.course = course;
  }

  override letter(): string {            // `override` — TypeScript checks the parent really has it
    return `${super.letter()} (TA for ${this.course})`;
  }
}

const sara = new Student(1, "Sara").addScore(92).addScore(88);
const omar = new Student(2, "Omar").addScore(68);
const lina = new Assistant(3, "Lina", "JS Everywhere").addScore(95).addScore(91);

// Anything that implements Gradable can go in this list — even different classes
const everyone: Gradable[] = [sara, omar, lina];
for (const s of everyone) {
  console.log(`${s.name.padEnd(5)} avg ${s.average().toFixed(1).padStart(5)}  ${s.letter()}`);
}
console.log(`students created: ${Student.count} · Sara has ${sara.scoreCount} scores`);

try {
  omar.addScore(140);
} catch (err) {
  console.log(err instanceof Error ? err.message : err);
}

// instanceof — a runtime check, because classes DO exist at runtime (types don't)
for (const s of everyone) {
  if (s instanceof Assistant) console.log(`${s.name} is an assistant for ${s.course}`);
}

// ❌ Uncomment one at a time:
// sara.id = 99;                          // Cannot assign to 'id' because it is a read-only property.
// sara.#scores;                          // Property '#scores' is not accessible outside class 'Student' because it has a private identifier.
// const x: Gradable = { name: "X" };     // Type '{ name: string; }' is missing the following properties from type 'Gradable': average, letter
```

```bash
node classes.ts
npx tsc
```

```
Sara  avg  90.0  A
Omar  avg  68.0  D
Lina  avg  93.0  A (TA for JS Everywhere)
students created: 3 · Sara has 2 scores
Score out of range: 140
Lina is an assistant for JS Everywhere
```

Then:

1. Uncomment the three `❌` lines at the bottom, one at a time.
2. Delete the `letter()` method from `Student`. The `implements Gradable` line turns red — the class broke its promise.
3. Remove `override` from `Assistant`'s `letter()`. Nothing breaks — it's optional — but now rename the parent's `letter` to `grade`. **With** `override`, TypeScript tells you the child is overriding something that no longer exists; without it, you'd silently have two unrelated methods. Put everything back.
4. Try `if (s instanceof Gradable)` in the loop. Error — `Gradable` is an interface, and interfaces don't exist at runtime (4.6).

---

### Step 11 — `generics.ts` — One Function, Every Type

```ts
// generics.ts — functions and types that work for ANY type, without losing it

interface Student { id: number; name: string; score: number }
interface Course { id: number; title: string }

const students: Student[] = [
  { id: 1, name: "Sara", score: 92 },
  { id: 2, name: "Omar", score: 68 },
  { id: 3, name: "Lina", score: 79 },
];
const courses: Course[] = [{ id: 10, title: "JS Everywhere" }];

// 1. The problem: without generics you pick between "any" and copy-paste
function firstAny(items: any[]): any { return items[0]; }
const lost = firstAny(students);          // any — the type is gone; lost.nmae compiles

// 2. A generic function: T is a type PARAMETER, filled in at each call
function first<T>(items: T[]): T | undefined {
  return items[0];
}
const s = first(students);                // Student | undefined — T inferred as Student
const c = first(courses);                 // Course | undefined
console.log(s?.name, c?.title, first<number>([]) ?? "(empty)");

// 3. Constraints: T must at least have an id
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}
console.log(findById(students, 2)?.name, findById(courses, 10)?.title);
// findById(["a", "b"], 1);               // ❌ Type 'string' is not assignable to type '{ id: number; }'

// 4. keyof: K must be one of T's keys — and the result has THAT key's type
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}
const names = pluck(students, "name");    // string[]
const scores = pluck(students, "score");  // number[]
// pluck(students, "email");              // ❌ Argument of type '"email"' is not assignable to parameter of type 'keyof Student'
console.log(names.join(", "), Math.max(...scores));

// 5. Generic types: one shape, many contents
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function safeParse<T>(json: string, check: (value: unknown) => value is T): Result<T> {
  try {
    const value: unknown = JSON.parse(json);
    return check(value) ? { ok: true, value } : { ok: false, error: "wrong shape" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

const isNumberArray = (v: unknown): v is number[] => Array.isArray(v) && v.every((n) => typeof n === "number");

for (const input of ["[92, 68, 79]", "[92, \"x\"]", "[92,"]) {
  const result = safeParse(input, isNumberArray);
  console.log(result.ok ? `✓ sum ${result.value.reduce((a, b) => a + b, 0)}` : `✗ ${result.error}`);
}

// 6. A generic store — one closure, typed for whatever you put in it
interface Store<T extends { id: number }> {
  add(item: T): void;
  get(id: number): T | undefined;
  all(): readonly T[];
}

function createStore<T extends { id: number }>(): Store<T> {
  const items = new Map<number, T>();     // Map<K, V> — a built-in generic
  return {
    add: (item) => { items.set(item.id, item); },
    get: (id) => items.get(id),
    all: () => [...items.values()],
  };
}

const studentStore = createStore<Student>();
students.forEach((st) => studentStore.add(st));
// studentStore.add({ id: 9, title: "Oops" });   // ❌ not a Student
console.log(`store has ${studentStore.all().length}; #3 is ${studentStore.get(3)?.name}`);

// Generics you've used all along
const tags = new Set<string>(["ts", "js"]);
const pending: Promise<Student[]> = Promise.resolve(students);
console.log([...tags], (await pending).length, typeof lost);
```

```bash
node generics.ts
npx tsc
```

```
Sara JS Everywhere (empty)
Omar JS Everywhere
Sara, Omar, Lina 92
✓ sum 239
✗ wrong shape
✗ Unexpected end of JSON input
store has 3; #3 is Lina
[ 'ts', 'js' ] 3 object
```

Hover over `s`, `c`, `names` and `scores` — each one has the right type, from **one** function. Then hover over `lost`: `any`. Type `lost.` and notice autocomplete has nothing to offer. That's the difference.

Uncomment the three `❌` lines one at a time. Then, in `safeParse`'s loop, try reading `result.value` **outside** the `result.ok ?` check — it's an error, because on the failure branch there is no `value`.

---

### Step 12 — `utility-types.ts` — Types From Types

```ts
// utility-types.ts — build new types from the ones you already have

interface Student {
  readonly id: number;
  name: string;
  score: number;
  github?: string;
}

// Omit — a new student has no id yet; the database assigns it
type NewStudent = Omit<Student, "id">;

// Partial — an update may change any field, or none
type StudentUpdate = Partial<Omit<Student, "id">>;

// Pick — a public view with only two fields
type StudentCard = Pick<Student, "name" | "score">;

// Readonly — a frozen view of the whole list
type Roster = Readonly<Record<number, Student>>;

let nextId = 1;
const db: Record<number, Student> = {};

function addStudent(input: NewStudent): Student {
  const student: Student = { id: nextId++, ...input };
  db[student.id] = student;
  return student;
}

function updateStudent(id: number, changes: StudentUpdate): Student {
  const current = db[id];
  if (!current) throw new Error(`No student with id ${id}`);
  const updated = { ...current, ...changes };    // spread — no mutation, like Day 04
  db[id] = updated;
  return updated;
}

function toCard({ name, score }: Student): StudentCard {
  return { name, score };
}

addStudent({ name: "Sara", score: 92 });
addStudent({ name: "Omar", score: 60, github: "omar-dev" });
// addStudent({ id: 5, name: "Lina", score: 79 });   // ❌ 'id' does not exist in type 'NewStudent'
updateStudent(2, { score: 68 });
// updateStudent(2, { score: "68" });                // ❌ Type 'string' is not assignable to type 'number'

const roster: Roster = db;
// roster[1] = { id: 1, name: "X", score: 0 };       // ❌ Index signature … only permits reading

console.log(Object.values(roster).map(toCard));

// ReturnType and Awaited — types taken from code that already exists
async function loadAttendance(id: number) {
  return { id, percent: 60 + id * 7 };
}
type Attendance = Awaited<ReturnType<typeof loadAttendance>>;   // { id: number; percent: number }
const a: Attendance = await loadAttendance(2);
console.log(`attendance #${a.id}: ${a.percent}%`);

// as const — turn a value into literal types, then derive a union from it
const GRADES = ["A", "B", "C", "D", "F"] as const;
type Grade = (typeof GRADES)[number];            // "A" | "B" | "C" | "D" | "F"
const best: Grade = GRADES[0];
console.log(`grades: ${GRADES.join(" ")} · best: ${best}`);
```

```bash
node utility-types.ts
npx tsc
```

```
[ { name: 'Sara', score: 92 }, { name: 'Omar', score: 68 } ]
attendance #2: 74%
grades: A B C D F · best: A
```

Hover over `NewStudent`, `StudentUpdate`, `StudentCard` and `Attendance` to see what each utility produced. Then add a `email: string` property to `Student` — and watch `addStudent({ name: "Sara", score: 92 })` turn red, because a `NewStudent` now needs an email too. One change to one interface, and TypeScript found every call that has to follow.

---

### Step 13 — `project/` — Day 05's Project, in TypeScript

The main build. Your Day 05 `esm/` project — `lib/`, `report.js`, the browser page — rewritten in TypeScript. Same data, same output, and every bug TypeScript can find, found.

```
day-06/project/
├── package.json
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

Everything that runs lives in `src/`. `dist/` appears when you build (Step 16) — add it to `.gitignore`, like `node_modules/`: it's generated, so it's never committed.

```bash
mkdir project
cd project
npm init -y
npm install --save-dev typescript @types/node
```

`package.json` — keep what npm generated, and set `type` and `scripts`:

```json
{
  "name": "day-06-project",
  "type": "module",
  "scripts": {
    "report": "node src/report.ts",
    "check": "tsc --noEmit",
    "build": "tsc",
    "start": "node dist/report.js"
  },
  …
}
```

`tsconfig.json` — the one from 5.7:

```json
{
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",

    "target": "es2023",
    "module": "nodenext",
    "lib": ["es2023", "dom"],
    "types": ["node"],

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true,
    "rewriteRelativeImportExtensions": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

`students.json` — Day 05's five, plus two broken records for the type guard to catch:

```json
[
  { "id": 1, "name": "Sara", "score": 92 },
  { "id": 2, "name": "Omar", "score": 68 },
  { "id": 3, "name": "Lina", "score": 79 },
  { "id": 4, "name": "Yusuf", "score": 95 },
  { "id": 5, "name": "Nour", "score": 55 },
  { "id": 6, "name": "Karim", "score": "eighty" },
  { "id": 7, "score": 70 }
]
```

`src/types.ts` — the shapes the whole project agrees on:

```ts
// types.ts — the shapes the whole project agrees on. No runtime code at all.

export type LetterGrade = "A" | "B" | "C" | "D" | "F";

export interface Student {
  readonly id: number;
  name: string;
  score: number;
  attendance?: number;          // filled in later — may never arrive
}

export interface GradedStudent extends Student {
  grade: LetterGrade;
  passed: boolean;
}
```

> **One file of types, imported everywhere.** In Day 05, the shape of a student lived in five places — `students.json`, `formatRow`'s destructuring, `report.js`, `main.js`, and your head. Now it lives in one, and the other four are checked against it.

---

### Step 14 — `src/lib/` — The Library, Typed

`src/lib/grade-lib.ts` — Day 05's functions, with types, plus the `isStudent` guard from Step 8 and a `grade` function that produces a `GradedStudent`:

```ts
// lib/grade-lib.ts — Day 05's grade-lib.js, now with types

import type { GradedStudent, LetterGrade, Student } from "../types.ts";

export const PASS_MARK = 60;

export function letterGrade(score: number): LetterGrade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function average(numbers: readonly number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

export function grade(student: Student): GradedStudent {
  return { ...student, grade: letterGrade(student.score), passed: student.score >= PASS_MARK };
}

export function formatRow({ name, score, attendance, grade, passed }: GradedStudent): string {
  const att = attendance === undefined ? "  —" : `${String(attendance).padStart(3)}%`;
  return `${name.padEnd(6)} ${String(score).padStart(3)}  ${grade}  ${att}  ${passed ? "PASS" : "FAIL"}`;
}

// A type guard: checks an unknown value at runtime, and tells TypeScript what it found
export function isStudent(value: unknown): value is Student {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "number" &&
    typeof v.name === "string" &&
    typeof v.score === "number" &&
    v.score >= 0 &&
    v.score <= 100
  );
}
```

`src/lib/list-utils.ts` — one generic helper, for the grade tally:

```ts
// lib/list-utils.ts — small generic helpers that work on a list of anything

export function countBy<T, K extends string>(items: readonly T[], keyOf: (item: T) => K): Partial<Record<K, number>> {
  const counts: Partial<Record<K, number>> = {};
  for (const item of items) {
    const key = keyOf(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}
```

Read the signature slowly: *for any item type `T` and any string key type `K`, give me a list of `T` and a function that turns a `T` into a `K`, and I'll give you back an object whose keys are `K`s and values are counts.* Call it with `({ grade }) => grade`, and `K` is inferred as `LetterGrade` — so the result is typed as `{ A?: number; B?: number; … }`.

`src/lib/async-utils.ts` — **type it yourself first.** Copy Day 05's `delay`, `withTimeout` and `retry` into a new `.ts` file, exactly as they were, and add only these annotations:

```ts
// lib/async-utils.ts — Day 05's helpers, first attempt

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

export async function retry<T>(fn: () => Promise<T>, times: number): Promise<T> {
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
```

Notice the generics: `withTimeout<T>` returns a `Promise<T>` — whatever the Promise you passed in held. `Promise<never>` is a Promise that can never fulfil, only reject — so racing it doesn't change the result type.

```bash
npm run check
```

```
src/lib/async-utils.ts(13,70): error TS2366: Function lacks ending return statement and return type does not include 'undefined'.
src/lib/async-utils.ts(18,51): error TS18046: 'err' is of type 'unknown'.
```

**Two real bugs in Day 05's code**, found in a second:

1. **`'err' is of type 'unknown'`.** In JavaScript, you can `throw` anything — a string, a number, `null`. So a caught value might not have a `.message`, and Day 05's `err.message` would print `undefined`. Under `strict`, `catch (err)` gives you `unknown`, and you must check it.
2. **`Function lacks ending return statement`.** If `times` is `0`, the loop never runs, and `retry` quietly returns `undefined` — while promising a `T`. TypeScript follows every path through the function and found the one Day 05 never tested.

The fixed version:

```ts
// lib/async-utils.ts — Day 05's helpers, made generic

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// A caught value is `unknown` — anything can be thrown. Narrow it before use.
export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

export async function retry<T>(fn: () => Promise<T>, times: number): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= times; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.log(`  attempt ${attempt} failed: ${errorMessage(err)}`);
      if (attempt < times) await delay(attempt * 100);
    }
  }
  throw lastError;
}
```

Now **every** path either returns a `T` or throws. `errorMessage` is the one place that knows how to turn an `unknown` into text — you'll use it in every `catch` from now on.

`src/lib/db.ts` — Day 05's slow attendance service:

```ts
// lib/db.ts — the slow attendance "service" from Day 05

import { delay } from "./async-utils.ts";

const LATENCY: Record<number, number> = { 1: 300, 2: 100, 3: 200 };

export default async function getAttendance(id: number): Promise<number> {
  await delay(LATENCY[id] ?? 50);
  if (id === 4) throw new Error(`Attendance service down for #${id}`);
  return 60 + id * 7;
}
```

`src/lib/index.ts` — the barrel:

```ts
// lib/index.ts — the barrel

export * from "./grade-lib.ts";
export * from "./async-utils.ts";
export * from "./list-utils.ts";
export { default as getAttendance } from "./db.ts";
```

```bash
npm run check          # no output = no errors
```

---

### Step 15 — `src/report.ts` — The Report, Typed End to End

```ts
// report.ts — the Day 05 report, typed end to end

import { readFile } from "node:fs/promises";
import {
  average, countBy, errorMessage, formatRow, getAttendance, grade, isStudent, letterGrade, retry, withTimeout,
} from "./lib/index.ts";
import type { Student } from "./types.ts";

const started = Date.now();
console.log("Loading…");

try {
  const path = new URL("../students.json", import.meta.url);
  const raw: unknown = JSON.parse(await withTimeout(readFile(path, "utf8"), 2000));
  if (!Array.isArray(raw)) throw new Error("students.json must contain an array");

  const students = raw.filter(isStudent);                 // Student[] — checked, not assumed
  const skipped = raw.length - students.length;

  const results = await Promise.allSettled(
    students.map(({ id }) => retry(() => getAttendance(id), 2))
  );

  const merged: Student[] = students.map((student, i) => {
    const result = results[i];
    return result?.status === "fulfilled" ? { ...student, attendance: result.value } : student;
  });

  const graded = merged.map(grade);
  console.log("\nName   Score Gr  Att  Result");
  for (const student of graded) console.log(formatRow(student));

  const avg = average(graded.map(({ score }) => score));
  console.log("-".repeat(30));
  console.log(`Average: ${avg.toFixed(1)} (${letterGrade(avg)})`);
  console.log(`Passed: ${graded.filter(({ passed }) => passed).length}/${graded.length}`);
  console.log(`Skipped invalid: ${skipped}`);
  console.log("Grades:", countBy(graded, ({ grade }) => grade));
} catch (err) {
  console.log(`✗ ${errorMessage(err)}`);
} finally {
  console.log(`Done in ${Date.now() - started}ms`);
}
```

```bash
npm run check
npm run report
```

```
Loading…
  attempt 1 failed: Attendance service down for #4
  attempt 2 failed: Attendance service down for #4

Name   Score Gr  Att  Result
Sara    92  A   67%  PASS
Omar    68  D   74%  PASS
Lina    79  C   81%  PASS
Yusuf   95  A    —  PASS
Nour    55  F   95%  FAIL
------------------------------
Average: 77.8 (C)
Passed: 4/5
Skipped invalid: 2
Grades: { A: 2, D: 1, C: 1, F: 1 }
Done in 316ms
```

Things to notice:

- **`"../students.json"`** — one folder up, because `report.ts` lives in `src/`. It works from `dist/` too, which is also one folder below `students.json`.
- **`raw: unknown`** — `JSON.parse` returns `any`. Annotating it as `unknown` switches the checker back on, so the next line *has* to check it's an array.
- **`raw.filter(isStudent)`** — Karim (`"eighty"`) and the student with no name are rejected, and everything after this line knows it has real `Student`s.
- **`results[i]`** — with `noUncheckedIndexedAccess` it might be `undefined`, so the `?.` is required. Hover over `result.value` inside the `?` — it's a `number`, because `allSettled` of `Promise<number>`s gives `PromiseSettledResult<number>`.
- **`import type { Student }`** — `Student` is only used as a type, so it's imported as one.

Break it on purpose, one at a time, and read the error:

1. Change `import type { Student }` to `import { Student }` — then run `npm run report` **without** fixing the red underline. Node throws `does not provide an export named 'Student'`.
2. In `formatRow`, rename `name` to `fullName` in `types.ts` (just the interface). `npm run check` lists every file that has to change.
3. Remove `?` from `result?.status`. `'result' is possibly 'undefined'.`
4. Change `countBy(graded, ({ grade }) => grade)` to `countBy(graded, ({ score }) => score)`. `Type 'number' is not assignable to type 'string'.` — the `K extends string` constraint at work.

---

### Step 16 — `src/main.ts` + `index.html` — The Browser, Typed

`src/main.ts` — Day 05's browser page, typed. It imports the **same** `lib/` as `report.ts`:

```ts
// main.ts — the browser side. Same lib/, now with the DOM typed too.

import { average, errorMessage, grade, isStudent, letterGrade } from "./lib/index.ts";
import type { GradedStudent } from "./types.ts";

// getElementById can return null — `$` makes that a loud error instead of a silent one
function $<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing #${id} in index.html`);
  return el as T;
}

const nameInput = $<HTMLInputElement>("name");
const scoreInput = $<HTMLInputElement>("score");
const addButton = $<HTMLButtonElement>("add");
const loadButton = $<HTMLButtonElement>("load");
const list = $<HTMLUListElement>("list");
const status = $<HTMLParagraphElement>("status");

let students: GradedStudent[] = [];
let nextId = 100;

function render(): void {
  list.innerHTML = "";
  for (const { name, score, grade, passed } of students) {
    const li = document.createElement("li");
    li.textContent = `${name} — ${score} (${grade}) ${passed ? "PASS" : "FAIL"}`;
    list.appendChild(li);
  }
  const avg = average(students.map(({ score }) => score));
  status.textContent = students.length
    ? `${students.length} students · average ${avg.toFixed(1)} (${letterGrade(avg)})`
    : "No students yet.";
}

async function handleLoad(): Promise<void> {
  loadButton.disabled = true;
  status.textContent = "Loading…";
  try {
    const res = await fetch("./students.json");
    const raw: unknown = await res.json();
    if (!Array.isArray(raw)) throw new Error("students.json must contain an array");
    const valid = raw.filter(isStudent);
    students = [...students, ...valid.map(grade)];
    render();
    status.textContent += ` · skipped ${raw.length - valid.length} invalid`;
  } catch (err) {
    status.textContent = `✗ ${errorMessage(err)}`;
  } finally {
    loadButton.disabled = false;
  }
}

function handleAdd(): void {
  const name = nameInput.value.trim();
  const score = scoreInput.valueAsNumber;           // number — NaN when empty
  if (!name || Number.isNaN(score) || score < 0 || score > 100) return;
  students = [...students, grade({ id: nextId++, name, score })];
  nameInput.value = "";
  scoreInput.value = "";
  render();
}

loadButton.addEventListener("click", handleLoad);
addButton.addEventListener("click", handleAdd);
render();
```

`index.html` — in `project/`, **not** in `src/`. It loads the **built** file:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JavaScript Everywhere — Day 06 TypeScript</title>
  </head>
  <body>
    <h1>Grade Checker — written in TypeScript</h1>
    <button id="load">Load students</button>
    <div>
      <input id="name" type="text" placeholder="Name" />
      <input id="score" type="number" placeholder="Score 0-100" />
      <button id="add">Add</button>
    </div>
    <ul id="list"></ul>
    <p id="status"></p>

    <!-- The browser can't run .ts — load the compiled file from dist/ -->
    <script type="module" src="./dist/main.js"></script>
  </body>
</html>
```

Build it:

```bash
npm run build
```

```
dist/
├── main.js
├── report.js
├── types.js
└── lib/
    ├── async-utils.js
    ├── db.js
    ├── grade-lib.js
    ├── index.js
    └── list-utils.js
```

Open `dist/lib/grade-lib.js`. It's your code with the types deleted — and the `import type` line gone completely. Open `dist/main.js` and look at the first `import`: `./lib/index.ts` has become `./lib/index.js`.

Now open `index.html` with **Live Server**, press **Load students**, and add one of your own. You should see:

```
Sara — 92 (A) PASS
Omar — 68 (D) PASS
Lina — 79 (C) PASS
Yusuf — 95 (A) PASS
Nour — 55 (F) FAIL

5 students · average 77.8 (C) · skipped 2 invalid
```

And run the built report in Node too:

```bash
npm start              # node dist/report.js — same output as npm run report
```

Then:

1. In `main.ts`, replace `$<HTMLInputElement>("name")` with `document.getElementById("name")`. Now `nameInput.value` is an error twice over: `possibly 'null'`, and `value` doesn't exist on `HTMLElement`. Put it back.
2. Change an id in `index.html` — `id="list"` → `id="lst"`. Rebuild, reload. The console says `Missing #list in index.html` — one clear message, instead of Day 05's `Cannot set properties of null` somewhere later.
3. Edit `main.ts` and reload **without** rebuilding. Nothing changes — the browser runs `dist/`, not `src/`. Run `npm run build` again. (For a watch mode, run `npx tsc --watch` in a second terminal — it rebuilds on every save.)

> **This is the Day 05 payoff, with types.** One `lib/` folder, running in Node and in the browser — and now `tsc` checks both sides against the same `Student`. Change the shape once, and every file that uses it, on both sides, is checked.

---

### Step 17 — Check Before You Commit, Then Ship It

From now on, `npm run check` is part of the commit loop:

```bash
git switch -c feature/day-06           # if you haven't already

npm run check                          # clean? then commit
git add day-06/package.json day-06/package-lock.json day-06/tsconfig.json day-06/hello.ts day-06/basics.ts day-06/narrowing.ts
git commit -m "Add TypeScript setup and basic types labs"
git add day-06/shapes.ts day-06/results.ts
git commit -m "Add interfaces and discriminated union labs"
git add day-06/generics.ts day-06/utility-types.ts
git commit -m "Add generics and utility types labs"
git add day-06/project
git commit -m "Port Day 05 grade report to TypeScript"

git status                             # dist/ and node_modules/ must NOT appear
git push -u origin feature/day-06
```

Open a pull request (Day 05 Step 12), with **What / Why / How to test** — and put `npm run check` under **How to test**. Merge it, delete the branch, `git pull` on `main`.

> **A red underline is a failing test you didn't have to write.** Never commit with `npm run check` failing. When a real team's pull request runs a check automatically and it fails, the PR can't merge — you'll set that up yourself in the bonus.

---

## The Cheat Sheet

### Part 2 — Data Types

| Type | Example value | Notes |
|---|---|---|
| `string` | `"Sara"`, `` `Hi ${name}` `` | all quote styles are the same type |
| `number` | `92`, `83.75`, `NaN` | whole numbers **and** decimals |
| `boolean` | `true`, `false` | |
| `bigint` | `10n` | huge whole numbers — can't mix with `number` |
| `symbol` | `Symbol("id")` | always unique |
| `null` / `undefined` | `null` | only allowed when the type says so: `string \| null` |
| `T[]` / `readonly T[]` | `[92, 68]` | every element the same type |
| `[string, number]` | `["Sara", 92]` | a tuple — fixed length, a type per position |
| `{ name: string; age?: number }` | `{ name: "Sara" }` | an object type — `?` means optional |
| `"A" \| "B"` | `"A"` | a literal union |
| `A & B` | — | every property of both |
| `any` | anything | ❌ checking switched off |
| `unknown` | anything | ✅ check before you use it |
| `void` | — | a function returns nothing useful |
| `never` | — | can't happen: always throws, or every case handled |
| `as const` | `{ a: 1 } as const` | frozen, literal types — the `enum` replacement |

### Parts 1–3 — Basics, Functions, Narrowing

| Idea | Write this | Not this |
|---|---|---|
| Run a `.ts` file | `node file.ts` | expecting it to check types |
| Check types | `npx tsc` / `npm run check` | trusting that it ran |
| Variable | `let score = 92` — inferred | `let score: number = 92` everywhere |
| Parameter | `(score: number)` | `(score)` — implicit `any` |
| Return type | `function f(): string` on exported functions | leaving public functions to inference |
| Array / tuple | `number[]` / `[string, number]` | `any[]` |
| Optional param | `(name?: string)` then `name ?? "…"` | `name.toUpperCase()` unchecked |
| Fixed set of values | `type Grade = "A" \| "B"` | `string` |
| Either type | `number \| string`, then narrow with `typeof` | `any` |
| Maybe missing | `x?.y ?? fallback` or `if (x !== undefined)` | `x!.y` |
| Outside data | `const raw: unknown = JSON.parse(…)` | `any` |
| Caught error | `err instanceof Error ? err.message : String(err)` | `err.message` |
| Async return | `Promise<number>` | `number` |

### Part 4 — Object Types

| Idea | Write this |
|---|---|
| Object shape | `interface Student { id: number; name: string }` |
| Union / alias | `type LetterGrade = "A" \| "B"` |
| Optional / fixed property | `github?: string` / `readonly id: number` |
| Build on a shape | `interface B extends A { … }` or `type B = A & { … }` |
| Dictionary | `Record<string, number>` |
| One of several situations | `{ status: "ok"; value: T } \| { status: "error"; error: string }` |
| All cases handled | `const x: never = value` in `default` |
| Check untrusted data | `function isStudent(v: unknown): v is Student` |

### Part 5 — Generics & Utilities

| Idea | Write this |
|---|---|
| Works for any type | `function first<T>(items: T[]): T \| undefined` |
| Must have a property | `<T extends { id: number }>` |
| A property name | `<T, K extends keyof T>(obj: T, key: K): T[K]` |
| Generic type | `type Result<T> = { ok: true; value: T } \| { ok: false; error: string }` |
| All optional / required / readonly | `Partial<T>` / `Required<T>` / `Readonly<T>` |
| Some / all-but-some properties | `Pick<T, "a" \| "b">` / `Omit<T, "id">` |
| A function's result | `ReturnType<typeof fn>`, `Awaited<…>` for async |
| Values → union | `const X = [...] as const; type U = (typeof X)[number]` |

### Part 5 — Project

| Idea | Write this |
|---|---|
| Import a type | `import type { Student } from "./types.ts"` |
| Import a file | `from "./lib/grade-lib.ts"` — with `.ts` |
| Instead of `enum` | `as const` array + `(typeof X)[number]` |
| Typed element | `document.querySelector<HTMLInputElement>("#id")` + a `null` check |
| Scripts | `report` (run), `check` (types), `build` (dist/), `start` (run dist/) |
| Rebuild on save | `npx tsc --watch` |
| Ignore | `node_modules/`, `dist/` |

#### Node vs `tsc`

```
node file.ts   → strips types, runs JavaScript. Never checks.   Fast feedback on BEHAVIOUR.
tsc --noEmit   → checks every file. Runs nothing.               Fast feedback on CORRECTNESS.
tsc            → checks, then writes .js to dist/.               For the browser and deploying.
```

---

## Common Mistakes

| Mistake | What happens | Fix |
|---|---|---|
| `typeof x === "null"` | Never true — `typeof null` is `"object"` | `x === null` |
| `const list = []`, then `push` | TypeScript has to guess the element type | `const list: string[] = []` |
| `string \| number[]` for a mixed array | Means "a string, OR an array of numbers" | `(string \| number)[]` |
| `big + 1` with a `bigint` | `Operator '+' cannot be applied to types 'bigint' and '1'` | `big + 1n` |
| Expecting `: number` to turn `"68"` into `68` | Types never convert values | `Number("68")` |
| Forgetting `NaN` is a `number` | `Number("abc")` passes every type check | `Number.isNaN(n)` after converting user input |
| `private` field for something secret | Erased at runtime — still readable in JavaScript | `#field` |
| `constructor(private name: string)` | `TS1294` with `erasableSyntaxOnly` | Declare the field, assign it in the constructor |
| `instanceof` on an interface | `'X' only refers to a type, but is being used as a value here` | A type guard function |
| Only running `node file.ts` | Type errors never reported; bugs ship | `npm run check` / `npx tsc` before every commit |
| Fixing an error with `any` | Error gone, bug still there, checking off downstream | Describe the real type, or use `unknown` and narrow |
| `JSON.parse(text)` used directly | `any` — nothing after it is checked | `const raw: unknown = JSON.parse(text)` + a type guard |
| `raw as Student` for outside data | TypeScript believes it; runtime doesn't | `isStudent(raw)` — actually check |
| `err.message` in `catch` | `'err' is of type 'unknown'` | `err instanceof Error ? err.message : String(err)` |
| `x!.y` to silence an error | Same crash as JavaScript, just later | Narrow with `if`, `?.`, or `??` |
| `const s: number = getScore()` | `Promise<number>` is not assignable to `number` | `await getScore()` |
| Annotating everything | Noise; types fall out of sync with values | Annotate params and exported returns; infer the rest |
| `import { Student }` for a type | `TS1484` in the editor, `does not provide an export named 'Student'` in Node | `import type { Student }` |
| Import without `.ts` | `ERR_MODULE_NOT_FOUND` | `./lib/grade-lib.ts` |
| Using `enum` | `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX` / `TS1294` | Literal union or `as const` |
| `<script src="src/main.ts">` | The browser can't run TypeScript | `npm run build`, load `dist/main.js` |
| Editing `src/`, reloading, nothing changes | The browser runs `dist/` | Rebuild — or `npx tsc --watch` |
| Committing `dist/` | Generated files in history, merge conflicts on build output | Add `dist/` to `.gitignore` |
| `document.getElementById("x").value` | `possibly 'null'` + `'value' does not exist on type 'HTMLElement'` | `querySelector<HTMLInputElement>` + a null check |
| `function f<T>(x: T) { x.id }` | `Property 'id' does not exist on type 'T'` | Constrain it: `<T extends { id: number }>` |
| Expecting `readonly` to freeze at runtime | It's compile-time only | Don't mutate (Day 04 spread), or `Object.freeze` |
| Expecting types to validate data at runtime | Types are erased — nothing checks | Type guards at every boundary |
| `// @ts-ignore` everywhere | Every hidden error is a hidden bug | Fix it; if truly stuck, `// @ts-expect-error — reason` |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `node file.ts` → `Unknown file extension ".ts"` | Your Node is too old. `node --version` must be 22.18+ — install the current LTS. |
| `npx tsc` prints nothing | That's success. No output = no errors. |
| `npx tsc` prints `Version …` and a help screen instead of checking | No `tsconfig.json` in this folder (or any folder above it). `cd` to the right one. |
| `tsc` checks files you didn't expect | Check `include` / `exclude` in `tsconfig.json`. |
| Red underline in VS Code but `tsc` says it's fine (or the reverse) | VS Code checks with its own bundled copy of TypeScript. Command Palette → **TypeScript: Restart TS Server** clears stale errors. If they still disagree, trust `npm run check`. |
| `Cannot find name 'process'` / `Cannot find module 'node:fs/promises'` | `npm install --save-dev @types/node` and `"types": ["node"]` in `tsconfig.json`. |
| `Cannot find name 'document'` | Add `"dom"` to `lib`. |
| `Parameter 'x' implicitly has an 'any' type` | Add a type to the parameter. |
| `'x' is possibly 'undefined'` / `'null'` | Narrow it: `if (x !== undefined)`, `x?.y`, `x ?? fallback`. |
| `'err' is of type 'unknown'` | `err instanceof Error ? err.message : String(err)`. |
| `Type 'string' is not assignable to type 'number'` | Read which line; the value really is the wrong type. Convert it (`Number(…)`) or fix the source. |
| `Object literal may only specify known properties` | Typo in a property name, or the interface is missing a field. |
| `Property 'x' is missing in type …` | You didn't provide a required property. Add it, or make it `?` if it's genuinely optional. |
| `Function lacks ending return statement` | Some path returns nothing. Return or `throw` at the end. |
| `does not provide an export named 'Student'` (Node) | Use `import type` for types. |
| `TS1294 … 'erasableSyntaxOnly'` | You used `enum`, `namespace` or a parameter property. Use a union / `as const`. |
| `ERR_MODULE_NOT_FOUND` | Missing `.ts` extension, or wrong relative path. |
| `An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled` | Your project `tsconfig.json` is missing `rewriteRelativeImportExtensions`. |
| Browser: blank page, `Failed to load module script` / 404 for `main.js` | You haven't run `npm run build`, or `index.html` points at `src/` instead of `dist/`. |
| Browser: CORS error | You opened `index.html` as `file://`. Use Live Server. |
| `ENOENT … students.json` | The path is relative to the **file** (`import.meta.url`), and `src/` is one level down: `"../students.json"`. |
| Errors in `node_modules/…d.ts` | Add `"skipLibCheck": true`. |

---

## Before the Next Session

The next session is **Day 07 — APIs, Web Basics + Project: Task Manager**, the last day of Track 1 — where your code finally talks to a real server, and you build a full app around it. Everything from today comes with you: `fetch` returns `unknown` data you have to guard, errors are `unknown` values you have to narrow, and a generic `Result<T>` is the cleanest way to say "this request worked, or here's why not."

Come having finished [ASSIGNMENT.md](ASSIGNMENT.md) — **merged through a pull request**, with `npm run check` clean. If `node src/report.ts` runs but `npm run check` shows errors you can't fix without `any`, ask **before** the next session.

### A Taste of the Next Session

Save this as `day-06/fetch-preview.ts` and run it with `node fetch-preview.ts`:

```ts
// fetch-preview.ts — a real API, a generic helper, and a type guard

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

interface Repo {
  name: string;
  stargazers_count: number;
}

function isRepo(value: unknown): value is Repo {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.name === "string" && typeof v.stargazers_count === "number";
}

async function fetchJson<T>(url: string, check: (v: unknown) => v is T): Promise<Result<T>> {
  try {
    const res = await fetch(url);
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const data: unknown = await res.json();
    return check(data) ? { ok: true, value: data } : { ok: false, error: "Unexpected response shape" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

const result = await fetchJson("https://api.github.com/repos/microsoft/typescript", isRepo);
console.log(result.ok ? `⭐ ${result.value.name}: ${result.value.stargazers_count}` : `✗ ${result.error}`);
```

`fetch`, `await`, `unknown`, a type guard, a generic `Result<T>` — every idea from Days 04, 05 and 06 in twenty lines. Change the URL to a repo that doesn't exist and you get `✗ HTTP 404` instead of a crash. Next session, that's how every request you make is built.

---

## Day 06 Files

- [README.md](README.md) — this guide
- [ASSIGNMENT.md](ASSIGNMENT.md) — Day 06 assignment

← Back to [Day 05 — Promises, Async/Await, Modules + Git](../Day-05-Promises-Modules-Git/README.md)

Next: [Day 07 — APIs, Web Basics + Project: Task Manager](../Day-07-APIs-Web-Basics-Task-Manager/README.md) →
