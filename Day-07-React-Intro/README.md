# Day 07 — React Intro: Components, Props, State & JSX

**Track 2: Full-Stack Web Application · Day 7 · four parts · the first day of Track 2**

> **Versions this guide is written for:** React **19.3** · Vite **8** · TypeScript **6** (the versions `npm create vite@latest` installs today). Older tutorials show React 17/18 patterns — Section 1.8 lists what changed so you can recognise them.

> Day 06 ended with a `taskItem()` function and a `render()` that rebuilt the list from state — and a short peek at the same list written in React.
> Today that peek becomes the whole day: you learn **JSX**, **components**, **props** and **state** — then rebuild your Task Manager's screen as a React app.

**Why this day matters:** Track 1 taught you the language. Track 2 is where you ship products with it — and React is how most of the web's interfaces are built. Every React skill that follows (forms, routing, `useEffect`, Context, data fetching, React Native later in this series) stands on four ideas: *UI is a function of state*, *components take props*, *state lives in one place*, and *you never mutate it*. Get those four right today and the next six sessions are details.

| Part | Topic | Concept | Build |
|---|---|---|---|
| **1** | Why React, Setup & JSX | Sections 1.1–1.8 | Steps 1–2 |
| **2** | Components & Props | Sections 2.1–2.8 | Steps 3–5 |
| **3** | State & Events | Sections 3.1–3.9 | Steps 6–9 |
| **4** | **Project: Task Board in React** | Sections 4.1–4.4 | Steps 10–12 |

---

## What You'll Have by the End

**Part 1 — Why React, Setup & JSX**

- [ ] The problem React solves — and what you already wrote by hand in Day 06 that proves it
- [ ] A Vite + React + TypeScript project running in the browser with hot reload
- [ ] What each file in a fresh React project is for — and which ones you'll never touch
- [ ] JSX: HTML-like syntax that is really `createElement` calls — and where it differs from HTML
- [ ] `{ }` expressions inside JSX — and the five things you can't put there

**Part 2 — Components & Props**

- [ ] A component as a function that takes props and returns JSX
- [ ] Typed props with an `interface`, defaults, and `children`
- [ ] Composition — building a screen from small components instead of one big one
- [ ] Conditional rendering with `&&`, the ternary, and early `return`
- [ ] Rendering lists with `.map` — and why `key` exists and what breaks without it
- [ ] Pure components — same props in, same JSX out, no surprises

**Part 3 — State & Events**

- [ ] Event handlers: `onClick`, `onChange`, `onSubmit` — and `e.preventDefault()`
- [ ] `useState` — and why a plain `let` variable can't do its job
- [ ] The render cycle: state changes → React calls your function again → the screen updates
- [ ] Updating objects and arrays **without mutating them**
- [ ] The updater form `setX(prev => …)` — and when you need it
- [ ] Derived values — compute them, don't store them
- [ ] Lifting state up, and passing handlers down
- [ ] A controlled `<input>` — the preview of Day 08's forms

**Part 4 — Project: Task Board**

- [ ] A typed React app: add, toggle, remove, re-prioritise, filter and search tasks
- [ ] A component tree you drew **before** writing code, with every piece of state placed on purpose
- [ ] Empty states, counters and a "clear completed" — all computed from one `tasks` array
- [ ] An app you've broken on purpose in four ways and fixed

---

# Part 1 — Why React, Setup & JSX

## 1 — Concept (45 min)

### 1.1 The Problem React Solves

Open your Day 06 Task Manager code. The part that took the most thought wasn't the API — it was keeping the screen in sync with the data:

```ts
// Day 06 — vanilla TypeScript
function render(): void {
  list.replaceChildren(...visibleTasks().map(taskItem));
  counter.textContent = `${remaining()} left`;
  emptyMessage.hidden = visibleTasks().length > 0;
}

function toggle(id: number): void {
  const task = tasks.find((t) => t.id === id);
  if (task) task.done = !task.done;
  render();                       // ← you had to remember this line, everywhere
}
```

Every time the data changed, **you** had to call `render()`. Forget it once and the screen lies. And inside `render()` you built elements one by one, set `textContent`, juggled `dataset`, and re-attached listeners. It worked — and it's the code that gets harder with every feature.

React flips it. You describe **what the screen should look like for a given state**, and React works out how to get there:

```tsx
function TaskItem({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  return (
    <li className={task.done ? "task done" : "task"}>
      <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
      {task.title}
    </li>
  );
}
```

No `createElement`, no `replaceChildren`, no "did I call `render()`?". The one sentence to remember all day:

> **UI = f(state).** The screen is a function of your data. Change the data, and React redraws what changed.

That's called **declarative** UI — you declare the result. What you wrote in Day 06 is **imperative** — you gave step-by-step instructions. Both work; declarative scales.

#### What React is — and isn't

| React **is** | React **is not** |
|---|---|
| A library for building user interfaces out of components | A full framework — no router, no data layer, no forms library built in |
| JavaScript/TypeScript all the way down | A new language — it's functions, objects and arrays you already know |
| Run in the browser (and, later, React Native on phones) | Something that replaces HTML, CSS or the DOM — it drives them |

Routing, data fetching and global state come from other libraries — you add them in Sessions 12–14.

---

### 1.2 Setting Up — Vite, React, TypeScript

Day 06 gave you `tsc` and a hand-written `index.html`. For React you want a dev server with hot reload and a bundler — **Vite** gives you both in one command:

```bash
npm create vite@latest day-07-react -- --template react-ts
cd day-07-react
npm install
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173`). Open it — you'll see the starter page with a counter. Edit `src/App.tsx`, save, and the browser updates **without a reload**. That's hot module replacement (HMR), and it's why you don't use a hand-made `index.html` for React.

> **Node version:** Vite 8 needs a current Node LTS (Node 20.19+ or 22.12+). `node --version` from Day 01 is fine — if the command fails with a version error, update Node first.

Check what you actually got:

```bash
npm ls react react-dom vite typescript
```

You should see `react@19.x` and `react-dom@19.x` (19.3 at the time of writing). The template pins `^19`, so a fresh `npm install` always gives you the newest 19.x. The template also ships **oxlint** — run `npm run lint` any time to catch mistakes TypeScript doesn't.

If the CLI asks questions, choose **React** and **TypeScript** — the template flag above already answers them.

---

### 1.3 What's in the Project

```
day-07-react/
├── index.html          ← the one page — contains <div id="root">
├── package.json        ← scripts + dependencies (react, react-dom, vite, typescript)
├── tsconfig.json       ← (+ tsconfig.app.json, tsconfig.node.json — Vite splits them)
├── vite.config.ts      ← Vite settings — you won't touch this today
├── .oxlintrc.json      ← lint rules for `npm run lint`
├── public/             ← files served as-is (favicon)
└── src/
    ├── main.tsx        ← the entry point: mounts React into #root
    ├── App.tsx         ← your first component
    ├── App.css         ← styles for it
    └── index.css       ← global styles
```

Only two files matter to understand today. First, `index.html` is nearly empty:

```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

Second, `src/main.tsx` is the bridge between the DOM and React (the template writes single quotes and no semicolons — your code in this course may keep double quotes and semicolons; both are valid):

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Read it top to bottom: *find `#root`, make a React root there, render `<App />` into it.* Everything else you write lives **inside** `App`. You'll never edit `main.tsx` again except to add global providers (Session 13).

#### `StrictMode`

`<StrictMode>` is a development helper: it runs some of your code **twice** and warns about unsafe patterns. If a `console.log` in a component prints twice while you're developing — that's `StrictMode` checking your component is pure (Section 2.8). It does nothing in the production build. Leave it on. (It's also what makes the React Compiler and future features safe to adopt.)

---

### 1.4 JSX — HTML-Looking Syntax That's Really JavaScript

Look at what's inside a component:

```tsx
function Greeting() {
  return <h1 className="title">Hello, React</h1>;
}
```

That `<h1>` isn't a string and isn't HTML. It's **JSX** — a syntax extension that your build tool (Vite) compiles into plain function calls. The line above becomes, roughly:

```js
function Greeting() {
  return jsx("h1", { className: "title", children: "Hello, React" });
}
```

The result is a plain JavaScript object describing an `<h1>` — not a real DOM node. React takes those objects, compares them to the previous ones, and updates the real DOM with the **smallest change**. Nothing magic: JSX is shorthand for building those objects, the way a template literal is shorthand for string concatenation.

Two consequences you'll feel immediately:

1. JSX is an **expression** — it produces a value. You can store it in a variable, return it, pass it to a function.
2. Because it compiles to JavaScript, its rules are JavaScript's rules, not HTML's.

---

### 1.5 JSX Rules — Where It Differs From HTML

| Rule | HTML | JSX |
|---|---|---|
| One root | any number of siblings | **one** parent, or a Fragment `<>…</>` |
| Close every tag | `<br>`, `<img src="…">`, `<input>` | `<br />`, `<img src="…" />`, `<input />` |
| `class` | `class="card"` | `className="card"` — `class` is a reserved word in JavaScript |
| `for` on a label | `<label for="name">` | `<label htmlFor="name">` |
| Attribute names | `onclick`, `tabindex`, `maxlength` | camelCase: `onClick`, `tabIndex`, `maxLength` |
| `style` | `style="color: red"` | `style={{ color: "red" }}` — an **object**, camelCase keys |
| Comments | `<!-- -->` | `{/* comment */}` |

**One root:**

```tsx
// ❌ Two siblings, no parent — a syntax error
return (
  <h1>Title</h1>
  <p>Subtitle</p>
);

// ✅ A Fragment — groups them without adding a <div> to the page
return (
  <>
    <h1>Title</h1>
    <p>Subtitle</p>
  </>
);
```

**Parentheses after `return`:** a multi-line JSX block goes in `( )`. Without them, `return` followed by a newline returns `undefined` — automatic semicolon insertion, the same trap you met in Day 02.

```tsx
// ❌ returns undefined — the JSX is never reached
return
  <div>…</div>;

// ✅
return (
  <div>…</div>
);
```

**Component names start with a capital letter.** `<task />` is the HTML-style tag lookup `"task"`; `<Task />` calls your `Task` function. This is how React tells a built-in element from your component.

---

### 1.6 `{ }` — JavaScript Inside JSX

Curly braces are the door back into JavaScript:

```tsx
function Profile() {
  const name = "Sara";
  const score = 92;
  const isPass = score >= 70;

  return (
    <section>
      <h2>{name}</h2>
      <p>Score: {score} ({isPass ? "pass" : "fail"})</p>
      <p>Doubled: {score * 2}</p>
      <p>Today: {new Date().toLocaleDateString()}</p>
    </section>
  );
}
```

Inside `{ }` you can put **any expression** — anything that produces a value: a variable, arithmetic, a function call, a ternary, a template literal. Use `{ }` in two places:

```tsx
<h2>{name}</h2>                      {/* as content between tags */}
<img src={avatarUrl} alt={name} />   {/* as an attribute value — no quotes around the braces */}
```

> Quotes make it a literal string: `<img alt="name" />` shows the word *name*. Braces make it a value: `<img alt={name} />` shows Sara.

#### What you can't put inside `{ }`

| ❌ Don't | Why | Do this instead |
|---|---|---|
| `{ if (x) … }` | `if` is a **statement**, not an expression | a ternary `{x ? a : b}`, `&&`, or an `if` before the `return` |
| `{ for (…) … }` | statement | `.map()` (Section 2.6) |
| `{ { name: "x" } }` as content | **objects aren't valid React children** — "Objects are not valid as a React child" | render a field: `{user.name}` |
| `{ true }`, `{ null }`, `{ undefined }` | render **nothing** (not an error) | this is on purpose — Section 2.5 uses it |
| `{ 0 }` | renders the digit `0` | careful with `count && <X />` — Section 2.5 |

The object rule is the single most common first-day error. If you see **"Objects are not valid as a React child"**, you wrote `{someObject}` where you meant `{someObject.someField}`.

#### Styling in JSX

`className` takes a normal CSS class string. Inline `style` takes an object:

```tsx
<div className="card" style={{ backgroundColor: "teal", padding: 8 }}>
```

The **double braces** aren't special syntax: the outer `{ }` is "JavaScript here", the inner `{ }` is an object literal. Numbers get `px` added automatically. Prefer `className` and a CSS file for anything beyond a one-off — your Day 06 CSS from Grid, Flexbox and custom properties works unchanged.

---

### 1.7 A Component Is a Function

The whole mental model, in one example:

```tsx
function Welcome() {
  return <h1>Welcome to the Task Board</h1>;
}

export default function App() {
  return (
    <main>
      <Welcome />
      <Welcome />
    </main>
  );
}
```

- A **component** is a function that returns JSX.
- Its name starts with a **capital letter**.
- You **use** it like an HTML tag: `<Welcome />`. Each use is an independent copy.
- It can use other components — and that's how a whole app is built: `App` uses `Header`, `Header` uses `Logo`…

`export default` makes `App` the thing `main.tsx` imports as `App`. In your own files, **prefer one component per file and a named export** (`export function TaskItem …`) — it makes imports explicit and survives a rename. Both are fine; be consistent.

> **Check yourself:** what does `<welcome />` (lowercase) do? React looks for an HTML element called `welcome`, finds none, and renders an empty unknown tag — your component never runs. If your component "does nothing", check the capital letter first.

---

### 1.8 React 19 — What's Current

You'll meet older React code constantly (tutorials, Stack Overflow, other people's repos). This is how it differs from what you're learning:

| Older code (React 16–18) | Today (React 19) |
|---|---|
| `ReactDOM.render(<App />, root)` or `class App extends Component` | `createRoot(root).render(<App />)` and **function components only** — you never write a class |
| `forwardRef(function Input(props, ref) {…})` | `ref` is just a **prop** on a function component |
| `<ThemeContext.Provider value={…}>` | `<ThemeContext value={…}>` (Session 13) |
| `React.FC<Props>` | a plain function with a typed props parameter — what you write today |
| `useMemo` / `useCallback` / `React.memo` everywhere "for speed" | the **React Compiler** (stable since late 2025) can do this automatically; write plain code first |
| `React.FormEvent` | `SubmitEvent` — the old name is deprecated |
| fetching in `useEffect` by hand | still valid, but React 19 adds `use()`, Actions and `useActionState` — Sessions 12–14 |

Three newer features you'll **not** need today but should know exist: `<form action={fn}>` (a function as a form's action), `useOptimistic`, and `useEffectEvent` (added in 19.2). Today's whole app uses only `useState` — and that hook hasn't changed since 2019.

> **If you see `import React from "react"` at the top of a file:** that's pre-2021 style. With the automatic JSX transform (`"jsx": "react-jsx"` in your `tsconfig.app.json`) you never import `React` just to write JSX.

---

## Build — Follow Along: Part 1

### Step 1 — Create the Project and Read It

```bash
npm create vite@latest day-07-react -- --template react-ts
cd day-07-react
npm install
npm run dev
```

Open the URL Vite prints. Now **delete the starter** so you start from a clean slate:

1. Delete `src/App.css` and `src/assets/`.
2. Replace `src/App.tsx` with:

```tsx
export default function App() {
  return <h1>Hello, React</h1>;
}
```

3. Replace `src/index.css` with a tiny reset:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  line-height: 1.5;
}
```

Save. The page now says **Hello, React** — without a manual reload.

Break it: delete the final `}` of `App`. Vite shows a full-screen error overlay with the file and line. Put it back. That overlay is your new red underline.

Then break it differently: rename `App` to `app` in the file (keep `export default`). It still renders — `main.tsx` imports whatever the default export is — but write `<app />` somewhere and it won't. Capital letters matter where you **use** the component.

---

### Step 2 — `src/Jsx.tsx` — JSX by Hand

Create `src/Jsx.tsx`:

```tsx
export function Jsx() {
  const learner = "Sara";
  const scores = [92, 68, 85];
  const average = scores.reduce((sum, n) => sum + n, 0) / scores.length;

  return (
    <section style={{ padding: 16 }}>
      <h2 className="title">{learner}'s scores</h2>
      <p>Average: {average.toFixed(1)}</p>
      <p>Passed: {average >= 70 ? "yes" : "not yet"}</p>
      <p>Highest: {Math.max(...scores)}</p>
      <label htmlFor="note">Note</label>
      <input id="note" type="text" />
      <br />
      {/* a JSX comment */}
    </section>
  );
}
```

Show it from `App.tsx`:

```tsx
import { Jsx } from "./Jsx";

export default function App() {
  return (
    <>
      <h1>Hello, React</h1>
      <Jsx />
    </>
  );
}
```

Now break each rule once and read the error: change `className` to `class`, remove the `/` from `<br />`, put `{ scores }` (an array of numbers is fine) and then `{ { a: 1 } }` (an object — **error**), and wrap `App`'s two elements without the Fragment.

> **Why `{scores}` works but `{{ a: 1 }}` doesn't:** React can render strings, numbers and arrays of renderable things. A plain object has no obvious way to appear on screen, so React refuses.

---

# Part 2 — Components & Props

## 2 — Concept (60 min)

### 2.1 Props — Arguments for Components

A component that always renders the same thing isn't much use. **Props** are how a parent passes data in:

```tsx
function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}</p>;
}

<Greeting name="Sara" />
<Greeting name="Omar" />
```

Props are just **one object argument**, and you already know how to take one apart — the destructuring from Day 04:

```tsx
// These two are identical
function Greeting(props: { name: string }) {
  return <p>Hello, {props.name}</p>;
}
function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}</p>;
}
```

At the call site, an attribute becomes a property: `<Greeting name="Sara" />` calls `Greeting({ name: "Sara" })`. Any value works — pass non-strings with braces:

```tsx
<Badge label="High" count={3} urgent={true} tags={["a", "b"]} onClick={handleClick} />
```

> **Props flow one way: down.** A parent gives props to a child; a child never reaches up and changes them. **Props are read-only** — treat them as frozen. (If a child needs to *cause* a change, the parent passes it a **function** — Section 3.7.)

---

### 2.2 Typing Props

In TypeScript you describe a component's props with an `interface` — exactly the object types from Day 06:

```tsx
interface TaskItemProps {
  title: string;
  done: boolean;
  priority: "low" | "medium" | "high";
  note?: string;                       // optional
}

function TaskItem({ title, done, priority, note }: TaskItemProps) {
  return (
    <li className={done ? "task done" : "task"} data-priority={priority}>
      <strong>{title}</strong>
      {note && <small> — {note}</small>}
    </li>
  );
}
```

Now the editor works for you:

```tsx
<TaskItem title="Read the README" done={false} priority="high" />   // ✅
<TaskItem title="Read the README" done="no" priority="high" />      // ❌ string isn't boolean
<TaskItem title="Read the README" done={false} priority="urgent" /> // ❌ not a valid priority
<TaskItem title="Read the README" priority="high" />                // ❌ missing prop: done
```

Typed props catch the "I forgot to pass it" and "I passed the wrong thing" bugs **before** the page loads — the same safety you got from types on functions, applied to UI. When the data is a whole object you've already typed, **reuse that type** instead of listing each field:

```tsx
interface TaskItemProps {
  task: Task;                          // the Day 06 shape, reused
}
```

#### Default values

Use destructuring defaults — the Day 04 syntax:

```tsx
function Badge({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "good" | "bad" }) {
  return <span className={`badge badge-${tone}`}>{label}</span>;
}
```

---

### 2.3 `children` — Components That Wrap Things

A prop named `children` holds whatever you put **between** the opening and closing tags:

```tsx
import type { ReactNode } from "react";

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

<Card title="Today">
  <p>3 tasks left</p>
  <button>Add one</button>
</Card>
```

`ReactNode` is the type for "anything React can render": strings, numbers, elements, arrays, `null`. Use `children` whenever a component is a **frame** — a card, a panel, a layout — and doesn't need to know what goes inside.

---

### 2.4 Composition — Small Components, Wired Together

A single 300-line component is the same problem as a single 300-line function. Split by **what each piece is responsible for**:

```tsx
export default function App() {
  return (
    <main className="board">
      <Header />
      <TaskList />
      <Footer />
    </main>
  );
}
```

How to decide where to cut:

| Cut it out when… | Example |
|---|---|
| it's **repeated** | each row of a list → `TaskItem` |
| it has **one clear job** and a name | `FilterBar`, `AddTaskForm` |
| the parent is getting hard to read | a 40-line `return` that scrolls |
| it will want **its own state** later | a collapsible section |

Don't cut in the other direction: ten components with one line each, all passing six props through, is harder to follow than the long version. A component earns its place by being **reused** or by **hiding complexity**.

> **Props are the contract between components.** `<TaskItem task={task} onToggle={toggle} />` tells you everything `TaskItem` needs, without reading its code.

---

### 2.5 Conditional Rendering

Because JSX is a JavaScript expression, "show this only sometimes" is ordinary JavaScript. Three tools:

**1. The ternary — either / or:**

```tsx
<p>{task.done ? "✓ done" : "to do"}</p>
{isLoggedIn ? <Dashboard /> : <LoginPrompt />}
```

**2. `&&` — show or nothing:**

```tsx
{task.note && <small>{task.note}</small>}
{hasErrors && <ErrorList errors={errors} />}
```

`a && b` evaluates to `b` when `a` is truthy, otherwise to `a` — and React renders `false`, `null` and `undefined` as **nothing**.

> **⚠️ The `0` trap.** `0` is falsy, but React **does** render the number `0`:
>
> ```tsx
> {tasks.length && <TaskList tasks={tasks} />}      // ❌ shows the digit 0 when empty
> {tasks.length > 0 && <TaskList tasks={tasks} />}  // ✅ a real boolean
> ```
>
> Make the left side an actual boolean — `> 0`, `!!x`, `Boolean(x)`.

**3. Early `return` — a whole different output:**

```tsx
function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks yet — add your first one.</p>;
  }
  return (
    <ul>…</ul>
  );
}
```

Use the ternary for small differences inside a layout, `&&` for optional pieces, and an early return when the **entire** output changes (empty, loading, error — the states from Day 06).

A component can return `null` to render nothing at all.

---

### 2.6 Lists and `key`

To turn an array into UI, `.map` it to elements:

```tsx
function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
```

The `{ }` holds an array of JSX elements and React renders them in order. That's all `.map` is here — the same method from Day 02, returning elements instead of numbers.

#### `key` — React's way to recognise "the same item"

When a list changes, React must work out which item is which: *did the second one move, or was the first one removed and a new one added?* `key` is the identity it uses:

```tsx
<TaskItem key={task.id} task={task} />    // ✅ a stable, unique id from your data
```

Rules:

| Rule | Why |
|---|---|
| `key` goes on the **outermost element returned from `.map`** | that's the thing React tracks |
| It must be **unique among siblings** (not globally) | two lists can reuse ids |
| It must be **stable** — the same item always has the same key | not `Math.random()`, not generated during render |
| Use your data's **id** | `task.id` — that's what ids are for |
| **Not the array index** if the list can be re-ordered, filtered or have items removed | the index points at a *position*, not an *item* |

What goes wrong with `key={index}`? Imagine rows with a checkbox the user ticked. Delete the first row, and every later row shifts up one index — React sees "index 0 still exists" and **keeps the old row's state for the new item.** The wrong checkbox appears ticked. You'll reproduce this on purpose in Assignment Task 6.

> `key` isn't a prop your component can read — it's consumed by React. If a child needs the id, pass it as a separate prop.

Missing keys produce a console warning: **"Each child in a list should have a unique key prop."** Never ignore it.

---

### 2.7 Events

React events look like HTML's, with three differences:

```tsx
<button onClick={handleClick}>Save</button>
```

1. **camelCase** — `onClick`, `onChange`, `onSubmit`, `onKeyDown`.
2. You pass **a function**, not a string: `onClick={handleClick}` ✅ — not `onClick="handleClick()"`.
3. You pass the function **itself**, you don't call it:

```tsx
<button onClick={handleClick}>  </button>     // ✅ React calls it when clicked
<button onClick={handleClick()}> </button>    // ❌ calls it NOW, during render, passes the result
<button onClick={() => remove(task.id)}> </button>   // ✅ a wrapper — to pass an argument
```

The third line is the one you'll write most: when a handler needs an argument, wrap it in an arrow function.

Handlers can be defined inline or as a named function in the component:

```tsx
function SaveButton() {
  function handleClick() {
    console.log("saved");
  }
  return <button onClick={handleClick}>Save</button>;
}
```

The **event object** is typed — import the types you need from `react` and hover over `e` in VS Code to see what's on it:

```tsx
import type { ChangeEvent, SubmitEvent } from "react";

function Search() {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
  }
  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();                       // stop the page reloading — same as Day 06
    console.log("submitted");
  }
  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
    </form>
  );
}
```

> **Older tutorials** type a submit handler as `React.FormEvent<HTMLFormElement>`. In current `@types/react` that type is **deprecated** — VS Code draws a strikethrough through it. Use `SubmitEvent<HTMLFormElement>` for forms and `ChangeEvent<HTMLInputElement>` for inputs.

Your Day 06 DOM habits transfer: `preventDefault()` still stops a form from reloading the page, `e.target` is still the element. What changes is that you **never call `addEventListener`** — you hand React a function and it attaches (and removes) the listener for you.

---

### 2.8 Pure Components

A component should behave like a pure function (Day 03): **same props in → same JSX out**, and **no side effects while rendering.**

```tsx
// ❌ Impure — mutates something outside, and the result depends on it
let count = 0;
function Counter() {
  count = count + 1;          // changes a variable that lives outside the component
  return <p>Rendered {count} times</p>;
}

// ❌ Impure — mutates its own props
function Sorted({ items }: { items: number[] }) {
  items.sort();               // sort() mutates the array the PARENT owns
  return <p>{items.join(", ")}</p>;
}

// ✅ Pure — copies first
function Sorted({ items }: { items: number[] }) {
  const sorted = [...items].sort((a, b) => a - b);
  return <p>{sorted.join(", ")}</p>;
}
```

Why it matters: React may call your component **more than once** (that's what `StrictMode` simulates by running it twice), skip calls, or call it in a different order. If a render has side effects, behaviour becomes unpredictable. The rule:

- **While rendering:** only calculate and return JSX.
- **In event handlers:** do the real work — log, call an API, change state.
- **Things that must happen *because* a component appeared** (fetch on mount, set a timer) use `useEffect` — Session 13. Not today.

---

## Build — Follow Along: Part 2

### Step 3 — `src/Badge.tsx` and `src/Card.tsx` — Typed Props and `children`

Create `src/Badge.tsx`:

```tsx
interface BadgeProps {
  label: string;
  tone?: "neutral" | "good" | "bad";
}

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{label}</span>;
}
```

Create `src/Card.tsx`:

```tsx
import type { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
```

Add styles at the bottom of `src/index.css`:

```css
.card {
  max-width: 420px;
  margin: 1rem auto;
  padding: 1rem 1.25rem;
  border: 1px solid #d0d0d0;
  border-radius: 10px;
}
.badge {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.8rem;
  background: #e6e6e6;
}
.badge-good { background: #d4f0dc; }
.badge-bad  { background: #f6d6d6; }
```

Use them in `App.tsx`:

```tsx
import { Badge } from "./Badge";
import { Card } from "./Card";

export default function App() {
  return (
    <>
      <Card title="Today">
        <p>
          Status: <Badge label="On track" tone="good" />
        </p>
      </Card>
      <Card title="Backlog">
        <p>
          Status: <Badge label="Behind" tone="bad" /> <Badge label="3 tasks" />
        </p>
      </Card>
    </>
  );
}
```

Break it: pass `tone="angry"` — the editor rejects it before you save. Remove `title` from one `<Card>` — a missing-prop error. Then give `Badge` an extra prop `size="large"` — TypeScript tells you it doesn't exist. Each error is a bug you didn't have to find by clicking. Also notice the template's strict options: declare a variable and never use it and `tsc` fails with `noUnusedLocals` — that's deliberate, and it keeps your files tidy.

---

### Step 4 — `src/TaskList.tsx` — Lists, Keys and Conditionals

First, the shared types. Create `src/types.ts`:

```ts
export type Priority = "low" | "medium" | "high";

export interface Task {
  readonly id: number;
  title: string;
  done: boolean;
  priority: Priority;
}
```

Create `src/TaskItem.tsx`:

```tsx
import type { Task } from "./types";
import { Badge } from "./Badge";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  return (
    <li className={task.done ? "task done" : "task"}>
      <span className="task-title">{task.title}</span>{" "}
      <Badge label={task.priority} tone={task.priority === "high" ? "bad" : "neutral"} />
      {task.done && <span aria-label="completed"> ✓</span>}
    </li>
  );
}
```

Create `src/TaskList.tsx`:

```tsx
import type { Task } from "./types";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks yet — add your first one.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
```

Add a little CSS:

```css
.task-list { list-style: none; padding: 0; margin: 0; }
.task { padding: 0.5rem 0; border-bottom: 1px solid #eee; }
.task.done .task-title { text-decoration: line-through; color: #888; }
.empty { color: #777; font-style: italic; }
```

And in `App.tsx`, give it some data:

```tsx
import { Card } from "./Card";
import { TaskList } from "./TaskList";
import type { Task } from "./types";

const TASKS: Task[] = [
  { id: 1, title: "Read the Day 07 README", done: true, priority: "high" },
  { id: 2, title: "Build the Badge component", done: true, priority: "medium" },
  { id: 3, title: "Render a list with keys", done: false, priority: "high" },
  { id: 4, title: "Style it", done: false, priority: "low" },
];

export default function App() {
  return (
    <Card title="Task Board">
      <TaskList tasks={TASKS} />
    </Card>
  );
}
```

Break it three ways:

1. Delete `key={task.id}` — open the console and read the warning word for word.
2. Pass `tasks={[]}` — the early return shows the empty state.
3. In `TaskItem`, change `{task.done && …}` to `{task.title.length && …}` — nothing visible breaks, but ask yourself what you'd see if `title` were `""`. (That's the `0` trap, wearing a disguise.)

---

### Step 5 — Props Down, Events Up (Without State Yet)

A child can't change its props, so how does a click in `TaskItem` reach the data? The parent hands the child a **function**. Today's smallest version just logs:

```tsx
// TaskItem.tsx
interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  return (
    <li className={task.done ? "task done" : "task"}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.title}" as done`}
      />{" "}
      <span className="task-title">{task.title}</span>
    </li>
  );
}
```

Thread `onToggle` through `TaskList` to `TaskItem`, and in `App`:

```tsx
<TaskList tasks={TASKS} onToggle={(id) => console.log("toggle", id)} />
```

Click a checkbox. The console prints the id — but the box **doesn't stay ticked**. React controls `checked` from `task.done`, and `task.done` never changed. That's correct and it's the point of Part 3: the checkbox shows what the **data** says, so to make it tick you must change the **data**. And data that changes over time and re-draws the screen is called **state**.

---

# Part 3 — State & Events

## 3 — Concept (65 min)

### 3.1 Why a Variable Isn't Enough

Try the obvious thing — a counter with a plain variable:

```tsx
function Counter() {
  let count = 0;

  function handleClick() {
    count = count + 1;
    console.log(count);        // 1, 2, 3, 4 … it IS changing
  }

  return <button onClick={handleClick}>Clicked {count} times</button>;
}
```

The console counts up, but the button always says **0**. Two separate reasons:

1. **A local variable doesn't survive.** Each time React calls `Counter()`, `let count = 0` runs again from scratch. Anything you set last time is gone.
2. **Changing a variable doesn't tell React to redraw.** React has no idea `count` changed; it only calls your function again when told to.

You need something that **remembers between calls** *and* **asks React to call you again.** That's `useState`.

---

### 3.2 `useState`

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

`useState(0)` returns a pair — **array destructuring**, Day 04:

| Part | What it is |
|---|---|
| `count` | the **current value** of the state (starts as the argument, `0`) |
| `setCount` | a **function** that sets a new value *and* asks React to re-render |

The naming convention is `[thing, setThing]`. The initial value is only used on the **first** render; after that React remembers the current one.

State can hold **any** type — and TypeScript infers it from the initial value:

```tsx
const [name, setName] = useState("");                  // string
const [open, setOpen] = useState(false);               // boolean
const [tasks, setTasks] = useState<Task[]>([]);        // empty array needs a type
const [selected, setSelected] = useState<Task | null>(null);   // starts empty
```

> **When the initial value doesn't tell TypeScript the whole story** — `[]`, `null`, a union — give the type explicitly with `useState<Type>(…)`. `useState([])` alone infers `never[]` and you can't add anything.

#### Hooks have two rules

`useState` is a **hook** — a function whose name starts with `use` that plugs a component into a React feature. Rules:

1. **Call hooks at the top level** of a component — not inside `if`, loops or nested functions.
2. **Call them only from components** (or from your own `useSomething` functions) — not from plain functions or event handlers.

React tracks hooks **by call order**, so the order must be identical every render. A conditional `useState` is the same bug as a conditional `key`: it confuses what belongs to what. You'll see an error if you break it.

---

### 3.3 What Happens When You Click

This sequence is the most important thing in the day. Trace it once, carefully:

1. First render: React calls `Counter()`. `useState(0)` returns `[0, setCount]`. You return JSX with `0` in it. React puts it on the screen.
2. The user clicks. Your handler calls `setCount(1)`.
3. React **schedules a re-render**. It stores `1` as the new state.
4. React calls `Counter()` **again**. This time `useState(0)` ignores its argument and returns `[1, setCount]`. You return JSX with `1`.
5. React compares the new JSX to the old, sees only the number changed, and updates that one text node in the real DOM.

```
state changes ──▶ React calls your component again ──▶ new JSX ──▶ React updates only what's different
```

Two things to burn in:

- **Rendering means "React calls your function" — it doesn't mean "the DOM changes."** Most renders change nothing on screen.
- **A re-render re-runs the whole function**, so every `const` inside is brand new each time. Only state survives.

---

### 3.4 State Is a Snapshot

Here's the surprise that trips up everyone once:

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log(count);          // still 0!
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

Click once: it goes to **1**, not 3, and the `console.log` prints `0`.

Why: **each render has its own `count`** — a constant, a snapshot of the state *at that render.* Inside this render's `handleClick`, `count` is `0`, always. `setCount(count + 1)` three times is `setCount(0 + 1)` three times. `setCount` doesn't change the variable you're holding; it tells React *what the next render's value should be.*

Two habits follow:

- **Don't read state right after setting it** and expect the new value — you'll get the old snapshot.
- **When the new value depends on the old one**, use the **updater form** (next section).

---

### 3.5 The Updater Form — `setX(prev => …)`

Pass a function instead of a value and React calls it with the **latest queued** state:

```tsx
function handleClick() {
  setCount((c) => c + 1);
  setCount((c) => c + 1);
  setCount((c) => c + 1);
}
// one click → 3
```

Each `(c) => c + 1` receives the result of the previous one: `0 → 1 → 2 → 3`.

| Use… | When |
|---|---|
| `setCount(5)` | the new value **doesn't depend on** the old one |
| `setCount((c) => c + 1)` | the new value is **calculated from** the old one |

For a single click handler either works, but the updater is correct in every situation — rapid clicks, several updates in a row, state set from a timer. When in doubt, use it. For arrays and objects (next section) you'll write it by habit.

React also **batches** updates: several `set…` calls in one event handler produce **one** re-render, not three.

---

### 3.6 Never Mutate State — Replace It

State is only "changed" when you call the setter with a **new value**. React compares the new value to the old with `===`. If you mutate the existing object or array and pass the **same reference** back, React sees "same thing" and skips the update:

```tsx
const [tasks, setTasks] = useState<Task[]>(INITIAL);

function addTask(title: string) {
  tasks.push({ id: 99, title, done: false, priority: "low" });   // ❌ mutates the array
  setTasks(tasks);                                               // same reference → no re-render
}
```

Nothing happens on screen (or it half-happens later, which is worse). The fix is the **immutable update** — build a **new** array or object. You know every tool for it from Day 04: spread, `map`, `filter`.

| Goal | ❌ Mutates | ✅ Returns a new value |
|---|---|---|
| Add to an array | `push`, `unshift`, `splice` | `[...tasks, newTask]` |
| Remove from an array | `splice`, `pop`, `delete` | `tasks.filter((t) => t.id !== id)` |
| Change one item | `tasks[i].done = true` | `tasks.map((t) => t.id === id ? { ...t, done: true } : t)` |
| Change an object's field | `user.name = "Omar"` | `{ ...user, name: "Omar" }` |
| Sort | `tasks.sort(…)` | `[...tasks].sort(…)` or `toSorted(…)` |
| Replace everything | — | `[]` |

The four patterns, in a state-updater shape:

```tsx
// Add
setTasks((prev) => [...prev, newTask]);

// Remove
setTasks((prev) => prev.filter((t) => t.id !== id));

// Update one field of one item
setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

// Update an object in state
setForm((prev) => ({ ...prev, title: "New title" }));
```

**Read the `map` one slowly.** For every task: if it's the one we want, return a **copy** with one field changed (`{ ...t, done: !t.done }`); otherwise return the **same** task untouched. The result is a new array, a new object for the one that changed, and the same objects for the rest — that sharing is also how React skips work for unchanged rows.

> **Why "immutable" is worth the extra characters:** the same rule makes React's change detection cheap and predictable, makes undo trivial (keep the old array), and rules out the bug where two parts of the app edit the same object. It'll feel clumsy for a day and natural by Session 12.

This is the same `{ ...obj }` and `[...arr]` from Day 04 — nothing new to learn, only a new place to apply it.

---

### 3.7 Lifting State Up

Sometimes two components need the **same** data — a list that shows tasks and a header that counts them. State can't be shared sideways, but it can be **moved up** to their closest common parent, and passed down as props:

```
App                      ← owns `tasks`
├── Header               ← receives `remaining` (a number)
├── AddTaskForm          ← receives `onAdd` (a function)
└── TaskList             ← receives `tasks` + `onToggle` + `onRemove`
    └── TaskItem × N
```

```tsx
export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL);

  function toggleTask(id: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  return (
    <>
      <Header remaining={tasks.filter((t) => !t.done).length} />
      <TaskList tasks={tasks} onToggle={toggleTask} />
    </>
  );
}
```

The pattern, always the same:

1. **Find** every component that needs the data.
2. **Move** the state to their nearest common parent.
3. **Pass the data down** as props and **pass the functions that change it down** as props too.

The child calls `onToggle(id)`; the parent changes the state; React re-renders the parent and everything below it with the new props. **Data flows down, events flow up.** That loop is the whole architecture of a React app.

#### Where should state live?

| Question | Answer |
|---|---|
| Does only one component use it? | Keep it **in that component**. |
| Do two or more siblings need it? | **Lift** it to their common parent. |
| Do many distant components need it? | Still lift — and in Session 13 you'll learn Context so you don't have to thread props through every level. |

Keep state **as low as it can be** and **as high as it must be.**

---

### 3.8 Derived State — Compute It, Don't Store It

If a value can be worked out from other state or props, **don't give it its own state**:

```tsx
// ❌ Two sources of truth that can disagree
const [tasks, setTasks] = useState<Task[]>(INITIAL);
const [remaining, setRemaining] = useState(2);      // must be updated every time tasks changes

// ✅ One source of truth — remaining is just math
const [tasks, setTasks] = useState<Task[]>(INITIAL);
const remaining = tasks.filter((t) => !t.done).length;
```

Computed variables inside the component re-run on every render, so they're always correct. Apply the same rule to filtered lists:

```tsx
const [tasks, setTasks] = useState<Task[]>(INITIAL);
const [filter, setFilter] = useState<Filter>("all");

const visible = tasks.filter((t) =>
  filter === "all" ? true : filter === "done" ? t.done : !t.done,
);
```

State is for what the user **changed**: the list and which filter is chosen. Everything else — the visible list, the counters, the "empty" flag — is derived. If you ever write a `set…` just to keep something in sync with other state, stop: it should be a variable.

---

### 3.9 Controlled Inputs — A Preview of Day 08

For an input whose value your code needs, make **state the single source of truth**:

```tsx
import { useState } from "react";
import type { SubmitEvent } from "react";

function AddTask({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState("");

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (trimmed === "") return;
    onAdd(trimmed);
    setTitle("");                        // clear the box — by changing state
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task…"
      />
      <button type="submit">Add</button>
    </form>
  );
}
```

`value={title}` makes the input display state; `onChange` writes every keystroke **back** to state. The input never holds its own value — React does. Typing is: key press → `onChange` → `setTitle` → re-render → input shows the new value.

Two bugs everyone makes once:

- **`value` without `onChange`** — the field becomes read-only and React warns you. (`defaultValue` is the uncontrolled alternative, not for today.)
- **Forgetting `e.preventDefault()`** — the form submits and the page reloads, wiping all your state. Same bug as Day 06, same fix.

Validation, multiple fields, `FormData` and React Router come in Session 12. Today you only need one field and `trim()`.

---

## Build — Follow Along: Part 3

### Step 6 — `src/Counter.tsx` — State From Zero

Create `src/Counter.tsx`:

```tsx
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <button onClick={() => setCount(count - 1)}>−</button>
      <output>{count}</output>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

Render it in `App`. Use it. Then break it three ways, **one at a time**, and describe each result in a comment:

1. Replace `useState` with `let count = 0` and mutate it — the button never updates (Section 3.1).
2. Add `console.log("render", count)` at the top of `Counter` — click once and see **two** logs per render in development: that's `StrictMode`.
3. Make a button that does `setCount(count + 1)` three times, click it, and observe **+1**. Change it to `setCount((c) => c + 1)` three times and observe **+3**.

---

### Step 7 — `src/Stateful.tsx` — Objects and Arrays in State

Create `src/Stateful.tsx`:

```tsx
import { useState } from "react";

interface Profile {
  name: string;
  city: string;
}

export function Stateful() {
  const [profile, setProfile] = useState<Profile>({ name: "Sara", city: "Cairo" });
  const [numbers, setNumbers] = useState<number[]>([1, 2, 3]);

  return (
    <section>
      <h2>
        {profile.name} lives in {profile.city}
      </h2>
      <button onClick={() => setProfile((p) => ({ ...p, city: "Alexandria" }))}>Move</button>
      <button onClick={() => setProfile((p) => ({ ...p, name: p.name.toUpperCase() }))}>Shout</button>

      <p>{numbers.join(", ")}</p>
      <button onClick={() => setNumbers((n) => [...n, n.length + 1])}>Add</button>
      <button onClick={() => setNumbers((n) => n.slice(0, -1))}>Remove last</button>
      <button onClick={() => setNumbers((n) => [...n].reverse())}>Reverse</button>
    </section>
  );
}
```

Click each. Now break the rule on purpose:

```tsx
<button onClick={() => { profile.city = "Giza"; setProfile(profile); }}>Mutate</button>
```

Click it — **nothing changes** (same reference). Click **Shout** afterwards and watch `Giza` suddenly appear: the mutated data was there all along; only the re-render was missing. That "works later, by accident" behaviour is why mutation bugs are so slippery.

Then replace `[...n].reverse()` with `n.reverse()` and click **Reverse**. The array is reversed *in place* and the **same reference** goes back to React, so React sees nothing new and skips the re-render — the screen doesn't change. Click **Add** and the reversed order suddenly appears. Same lesson as above, different method: `reverse`, `sort`, `push` and `splice` all mutate. Put the spread back.

---

### Step 8 — `src/AddTask.tsx` — A Controlled Input

Create `src/AddTask.tsx` using the code from Section 3.9, with an `onAdd(title: string)` prop. Then wire it into `App` temporarily:

```tsx
export default function App() {
  const [added, setAdded] = useState<string[]>([]);
  return (
    <Card title="Add task">
      <AddTask onAdd={(title) => setAdded((prev) => [...prev, title])} />
      <ul>
        {added.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </Card>
  );
}
```

Verify: type, press Enter (submit works from the keyboard because you used a real `<form>`), the box clears, the title appears. Try submitting an empty or whitespace-only title — nothing is added. Remove `e.preventDefault()` and watch the page reload and the list vanish; put it back.

---

### Step 9 — Lift the State: Toggle and Remove

Combine Part 2 and Part 3: make the list from Step 4 interactive. In `App.tsx`:

```tsx
import { useState } from "react";
import { Card } from "./Card";
import { TaskList } from "./TaskList";
import type { Task } from "./types";

const INITIAL: Task[] = [
  { id: 1, title: "Read the Day 07 README", done: true, priority: "high" },
  { id: 2, title: "Build the Badge component", done: true, priority: "medium" },
  { id: 3, title: "Render a list with keys", done: false, priority: "high" },
  { id: 4, title: "Style it", done: false, priority: "low" },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL);

  function toggleTask(id: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <Card title={`Task Board — ${remaining} left`}>
      <TaskList tasks={tasks} onToggle={toggleTask} onRemove={removeTask} />
    </Card>
  );
}
```

Thread `onRemove` through `TaskList` and `TaskItem` (a `×` button calling `onRemove(task.id)`). Now **tick a box** — it stays ticked, the line gets struck through, and the title's counter drops. Nothing redraws "by hand": you changed the **data**, and the screen followed.

Break it: in `TaskList`, change `key={task.id}` to `key={index}` (use `.map((task, index) => …)`). Tick the first task, then delete it — watch the tick appear on a **different** row. That's Section 2.6 happening live. Put the key back.

> **Checkpoint:** you now have, in about 60 lines, the whole shape of a React app — state in one place, components that only render, handlers that update by replacing. Part 4 is that same shape, bigger.

---

# Part 4 — Project: Task Board

## 4 — Concept (30 min)

### 4.1 Plan Before You Type

The most common reason a React app turns into spaghetti is typing components before deciding **where the state goes.** So the first step of a React project is on paper, not in VS Code. Today's three questions:

**1. What does the screen look like? Draw the boxes.**

```
┌─────────────────────────────────────────┐
│ Task Board                   2 left     │  ← Header
├─────────────────────────────────────────┤
│ [ New task…            ] [priority▾] Add│  ← AddTaskForm
├─────────────────────────────────────────┤
│ [All] [Open] [Done]    [ search…      ] │  ← FilterBar
├─────────────────────────────────────────┤
│ ☐ Read the README   high   ×            │
│ ☑ Set up Vite       low    ×            │  ← TaskList → TaskItem × N
├─────────────────────────────────────────┤
│ 1 of 2 done            Clear completed  │  ← Footer
└─────────────────────────────────────────┘
```

**2. What's the component tree?** Every box that has a job becomes a component:

```
App
├── Header
├── AddTaskForm
├── FilterBar
├── TaskList
│   └── TaskItem × N
└── Footer
```

**3. What is state — and where does it live?**

| Data | State or derived? | Lives in |
|---|---|---|
| The list of tasks | **state** | `App` (several components need it) |
| Which filter is selected | **state** | `App` (`FilterBar` writes it, the list reads it) |
| The search text | **state** | `App` |
| The text in the "new task" box | **state** | `AddTaskForm` (only it cares until submit) |
| The chosen priority in the form | **state** | `AddTaskForm` |
| The visible tasks | **derived** | computed in `App` from tasks + filter + search |
| "N left" and "X of Y done" | **derived** | computed from `tasks` |
| Whether the list is empty | **derived** | `visible.length === 0` |

Write this table down before Step 10. **Five** pieces of state; everything else is arithmetic.

---

### 4.2 Types and Pure Helpers

Put logic that doesn't need React into plain functions — easier to read, and testable with Day 06's tools:

```ts
// src/types.ts
export type Priority = "low" | "medium" | "high";
export type Filter = "all" | "open" | "done";

export interface Task {
  readonly id: number;
  title: string;
  done: boolean;
  priority: Priority;
}

// src/tasks.ts
import type { Filter, Task } from "./types";

export function visibleTasks(tasks: Task[], filter: Filter, search: string): Task[] {
  const q = search.trim().toLowerCase();
  return tasks.filter((t) => {
    const matchesFilter = filter === "all" || (filter === "done" ? t.done : !t.done);
    const matchesSearch = q === "" || t.title.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });
}

export function nextId(tasks: Task[]): number {
  return tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}
```

`visibleTasks` is the Day 06 `visibleTasks()` with its dependency on globals removed — everything it needs is a parameter. `nextId` uses `reduce` (Day 02) and never reuses an id after a delete.

---

### 4.3 Handlers Live With the State

Every function that **changes** the tasks sits next to the `useState` that owns them, in `App`:

```tsx
function addTask(title: string, priority: Priority) {
  setTasks((prev) => [...prev, { id: nextId(prev), title, done: false, priority }]);
}
function toggleTask(id: number) { … }
function removeTask(id: number) { … }
function setPriority(id: number, priority: Priority) { … }
function clearCompleted() {
  setTasks((prev) => prev.filter((t) => !t.done));
}
```

Children receive only the functions they need — `TaskItem` gets `onToggle`, `onRemove` and `onPriorityChange`, never `setTasks`. That keeps **one** place that can change the list, so when something goes wrong, you know which file to open.

Note `nextId(prev)` is computed **inside** the updater: it uses the freshest list, not the snapshot from this render.

---

### 4.4 What You're Not Building Today

On purpose, so you can focus:

| Not today | Why | Comes in |
|---|---|---|
| Saving tasks to `localStorage` or the Day 06 API | needs `useEffect` | Session 13–14 |
| Several pages / routes | needs React Router | Session 12 |
| Form validation libraries, `FormData` | one field is enough for now | Session 12 |
| Sharing state without prop passing | Context API | Session 13 |

Your tasks vanish on refresh. That's expected — and a good reason to look forward to `useEffect`.

---

## Build — Follow Along: Part 4

### Step 10 — Structure, Types and Helpers

In the same Vite project (or a fresh `task-board/` one), create:

```
src/
├── main.tsx
├── App.tsx
├── index.css
├── types.ts            ← Priority, Filter, Task
├── tasks.ts            ← visibleTasks, nextId
└── components/
    ├── Header.tsx
    ├── AddTaskForm.tsx
    ├── FilterBar.tsx
    ├── TaskList.tsx
    ├── TaskItem.tsx
    └── Footer.tsx
```

Write `types.ts` and `tasks.ts` from Section 4.2. Then add `src/tasks.test-run.ts` — a throwaway script you run with Node (Day 06's type stripping) to prove the helpers **before** any component exists:

```ts
import { nextId, visibleTasks } from "./tasks.ts";
import type { Task } from "./types.ts";

const tasks: Task[] = [
  { id: 1, title: "Read the README", done: true, priority: "high" },
  { id: 2, title: "Set up Vite", done: false, priority: "low" },
];

console.log(visibleTasks(tasks, "all", "").length);      // 2
console.log(visibleTasks(tasks, "open", "").length);     // 1
console.log(visibleTasks(tasks, "done", "vite").length); // 0
console.log(visibleTasks(tasks, "all", "READ").length);  // 1 — case-insensitive
console.log(nextId([]));                                 // 1
console.log(nextId(tasks));                              // 3
```

```bash
node src/tasks.test-run.ts
```

Seeing `2 1 0 1 1 3` before you've written a single component is the point: the logic is solid, so any later bug is in the wiring. Delete this file or keep it out of the commit — it isn't part of the app.

---

### Step 11 — The Components

Build them in this order, checking the browser after each:

**`Header.tsx`** — props: `remaining: number`.

```tsx
interface HeaderProps {
  remaining: number;
}

export function Header({ remaining }: HeaderProps) {
  return (
    <header className="board-header">
      <h1>Task Board</h1>
      <p>{remaining === 0 ? "All done 🎉" : `${remaining} left`}</p>
    </header>
  );
}
```

**`AddTaskForm.tsx`** — owns its own `title` and `priority` state; calls `onAdd(title, priority)` on submit, then clears the title.

```tsx
import { useState } from "react";
import type { SubmitEvent } from "react";
import type { Priority } from "../types";

interface AddTaskFormProps {
  onAdd: (title: string, priority: Priority) => void;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (trimmed === "") return;
    onAdd(trimmed, priority);
    setTitle("");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <label htmlFor="new-title" className="visually-hidden">New task</label>
      <input
        id="new-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task…"
      />
      <label htmlFor="new-priority" className="visually-hidden">Priority</label>
      <select
        id="new-priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit">Add</button>
    </form>
  );
}
```

> `e.target.value` is typed `string`; the `as Priority` assertion is safe here only because the `<option>` values are exactly the three priorities. That's a Day 06 type assertion — you're promising TypeScript something it can't check.

**`FilterBar.tsx`** — props: `filter`, `onFilterChange`, `search`, `onSearchChange`. Three buttons that mark the active one with `aria-pressed`, plus a search input.

```tsx
import type { Filter } from "../types";

const FILTERS: Filter[] = ["all", "open", "done"];

interface FilterBarProps {
  filter: Filter;
  onFilterChange: (f: Filter) => void;
  search: string;
  onSearchChange: (s: string) => void;
}

export function FilterBar({ filter, onFilterChange, search, onSearchChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div role="group" aria-label="Filter tasks">
        {FILTERS.map((f) => (
          <button key={f} aria-pressed={filter === f} onClick={() => onFilterChange(f)}>
            {f}
          </button>
        ))}
      </div>
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search…"
        aria-label="Search tasks"
      />
    </div>
  );
}
```

**`TaskItem.tsx`** and **`TaskList.tsx`** — Part 2's, plus `onRemove` and `onPriorityChange`. The list shows **different empty messages** for "no tasks at all" and "no matches" — pass `hasTasks: boolean` as a prop.

**`Footer.tsx`** — props: `total`, `completed`, `onClearCompleted`. Hide the "Clear completed" button (`&&`) when `completed === 0`, and disable nothing else.

---

### Step 12 — `App.tsx` — Wire It, Break It, Ship It

```tsx
import { useState } from "react";
import { Header } from "./components/Header";
import { AddTaskForm } from "./components/AddTaskForm";
import { FilterBar } from "./components/FilterBar";
import { TaskList } from "./components/TaskList";
import { Footer } from "./components/Footer";
import { nextId, visibleTasks } from "./tasks";
import type { Filter, Priority, Task } from "./types";

const INITIAL: Task[] = [
  { id: 1, title: "Read the Day 07 README", done: true, priority: "high" },
  { id: 2, title: "Set up Vite", done: true, priority: "low" },
  { id: 3, title: "Build the Task Board", done: false, priority: "high" },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  function addTask(title: string, priority: Priority) {
    setTasks((prev) => [...prev, { id: nextId(prev), title, done: false, priority }]);
  }
  function toggleTask(id: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }
  function removeTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }
  function changePriority(id: number, priority: Priority) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, priority } : t)));
  }
  function clearCompleted() {
    setTasks((prev) => prev.filter((t) => !t.done));
  }

  const visible = visibleTasks(tasks, filter, search);
  const completed = tasks.filter((t) => t.done).length;

  return (
    <main className="board">
      <Header remaining={tasks.length - completed} />
      <AddTaskForm onAdd={addTask} />
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={setSearch}
      />
      <TaskList
        tasks={visible}
        hasTasks={tasks.length > 0}
        onToggle={toggleTask}
        onRemove={removeTask}
        onPriorityChange={changePriority}
      />
      <Footer total={tasks.length} completed={completed} onClearCompleted={clearCompleted} />
    </main>
  );
}
```

Read it as a table of contents: three pieces of state, five functions that replace the list, three derived values, and a `return` that is mostly **wiring**. `App` never builds an element by hand — each component owns its own markup.

#### Check it

```bash
npx tsc --noEmit -p tsconfig.app.json     # zero type errors
npm run lint                               # oxlint — zero warnings
npm run build                              # production build succeeds
npm run dev                                # run it and click everything
```

The commands before `dev` matter: Vite's dev server **doesn't type-check** — it strips types and runs. `tsc` is what tells you about the prop you forgot to pass.

#### Break it on purpose

Break each one, read the error or symptom, then fix it. Document them in the assignment.

1. **Mutate state** — change `toggleTask` to `tasks.find(...).done = true; setTasks(tasks)`. Screen doesn't update. Fix with `map` + spread.
2. **Index as key** — switch `TaskList` to `key={index}`, tick a task, delete the one above it. Wrong row ticked. Fix with `task.id`.
3. **Stale snapshot** — write `addTask` as `setTasks([...tasks, newTask])`, call it twice in a row from a button. One task appears, not two. Fix with the updater form.
4. **Stored derived state** — add `const [remaining, setRemaining] = useState(2)`, update it in `addTask` but forget `removeTask`. The counter lies. Fix: delete the state, compute it.

#### Ship it

Add `.gitignore` (the Vite template includes one — check that `node_modules` and `dist` are in it), commit on a branch and open a PR — the Day 05 workflow. Your repo should now hold `day-06/` and `day-07/` side by side.

---

## What's Next

Right now your tasks vanish when you refresh, and the filter forgets where it was. Fixing that means running code **after** a component renders — fetching from your Day 06 API, saving to `localStorage`, setting a timer. That's `useEffect`, and it's Session 13.

First, though, Session 12: **forms done properly** (controlled components with several fields, validation, submit states) and **React Router** (multiple pages without reloading). Your `AddTaskForm` is the warm-up.

---

## Day 07 Files

- [README.md](README.md) — this guide
- [ASSIGNMENT.md](ASSIGNMENT.md) — Day 07 assignment

← Back to [Day 06 — TypeScript, APIs, Web Basics + Project: Task Manager](../Day-06-TypeScript-APIs-Task-Manager/README.md)

Next: [Day 08 — Forms in React + Routing with React Router](../Day-08-Forms-Routing/README.md) →
