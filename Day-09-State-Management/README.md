# Day 09 — State Management: `useState`, `useEffect` & the Context API

**Track 2: Full-Stack Web Application · Day 9 · three parts**

> Day 08 ended with two problems: your tasks **vanish on refresh**, and every page reaches its data through `useOutletContext` — which only works one level below the layout.
> Today you fix both. You learn the hook that runs code **when a component appears** (`useEffect`), the hook that turns a pile of `setState` calls into **named actions** (`useReducer`), and the tool that hands data to **any** component without passing props through every layer (Context).

**Why this day matters:** almost every bug in a React app is a state bug — data in the wrong place, a copy that drifted from the original, an effect that runs too often or never stops. Day 07 taught you *what* state is. Today is about **where it lives, how long it lives, and who is allowed to change it.** That's what people mean by "state management".

**Versions this guide is written for:** React **19.3** · React Router **8** (package `react-router`) · Vite **8** · TypeScript **6** · **Node 22.22+**.

| Part | Topic | Concept | Build |
|---|---|---|---|
| **1** | `useState` in depth, `useEffect`, custom hooks | Sections 1.1–1.9 | Steps 1–4 |
| **2** | Context API and `useReducer` | Sections 2.1–2.7 | Steps 5–6 |
| **3** | **Project: Task Board v3** — a store, saved across refreshes | Sections 3.1–3.3 | Steps 7–9 |

---

## What You'll Have by the End

**Part 1 — `useState` and `useEffect`**

- [ ] The three questions for any piece of data: *state or derived? who owns it? how long does it live?*
- [ ] Functional updates, lazy initial state, batching, and why state is a **snapshot**
- [ ] What a **side effect** is, and why rendering must not have any
- [ ] `useEffect` — setup, cleanup, and the dependency array, in all three forms
- [ ] Why Strict Mode runs your effects **twice** in development, and why that's a gift
- [ ] Stale closures, and how functional updates remove dependencies
- [ ] Fetching in an effect without a **race condition**
- [ ] The effects you **shouldn't** write — and what to do instead
- [ ] Custom hooks: `useLocalStorage`, `useDocumentTitle`, `useDebouncedValue`

**Part 2 — Context and `useReducer`**

- [ ] Prop drilling — the problem Context solves
- [ ] `createContext`, a provider, `useContext`, and the "throw outside the provider" hook
- [ ] What re-renders when a context value changes
- [ ] `useReducer`: state changes as **named actions** handled by a **pure** function
- [ ] Context + reducer = a small store — and when you'd reach for a library instead

**Part 3 — Project: Task Board v3**

- [ ] `useOutletContext` replaced by a `BoardProvider` — and **no page has to change**
- [ ] Every state change goes through a tested, pure `boardReducer`
- [ ] Tasks that survive a refresh, loaded safely from `localStorage`
- [ ] The tab title shows how many tasks are open

---

# Part 1 — `useState` and `useEffect`

## 1 — Concept (75 min)

### 1.1 What "State Management" Means

Every value in your app answers three questions. Answer them **before** you write `useState`:

| Question | Options |
|---|---|
| **State or derived?** | If you can compute it from other state or props, it's **derived** — compute it during render, never store it (Day 07). |
| **Who owns it?** | The **lowest** component that is above everyone who needs it (Day 07: lifting state up). |
| **How long must it live?** | See the table below. |

The last question is the new one. Each answer has a home:

| It must survive… | Put it in | You've used it |
|---|---|---|
| one render | a plain variable | Day 07 |
| while the component is on screen | `useState` / `useReducer` | Day 07 |
| while the **app** is open, across pages | state in a component that never unmounts + **Context** | today |
| a **refresh**, a shared link | the **URL** | Day 08 |
| a refresh, on **this** browser only | **`localStorage`** | today |
| forever, on every device | a **server + database** | Sessions 15–18 |

A filter that should be shareable goes in the URL. A theme the user picked goes in `localStorage`. A half-typed form stays in `useState`. Choosing the right row is most of state management.

---

### 1.2 `useState` — The Parts You Skipped

#### State is a snapshot

Inside one render, `count` is a **constant**. Setting it doesn't change the variable — it asks React for a **new render** in which `count` has the new value:

```tsx
const [count, setCount] = useState(0);

function addThree() {
  setCount(count + 1);    // count is 0 → "make it 1"
  setCount(count + 1);    // count is STILL 0 → "make it 1"
  setCount(count + 1);    // "make it 1"
  console.log(count);     // 0 — this render's snapshot
}
// After the click: 1, not 3.
```

#### Functional updates

When the new value depends on the old one, pass a **function**. React queues them and feeds each one the result of the last:

```tsx
function addThree() {
  setCount((c) => c + 1);   // 0 → 1
  setCount((c) => c + 1);   // 1 → 2
  setCount((c) => c + 1);   // 2 → 3
}
```

Rule of thumb: **if the next value is computed from the previous one, use the function form.** It matters a lot more once timers and effects are involved (Section 1.6).

#### Batching

React **batches** every `setState` inside one event into a single re-render — in click handlers, in `setTimeout`, after an `await`, everywhere. Three `setX` calls → one render. You don't have to do anything; just don't be surprised that `console.log` after a setter shows the old value.

#### Lazy initial state

The argument to `useState` is evaluated on **every** render, even though React only uses it on the first:

```tsx
const [tasks, setTasks] = useState(loadTasks());     // ❌ reads localStorage on every render
const [tasks, setTasks] = useState(loadTasks);       // ✅ pass the function — called once
const [tasks, setTasks] = useState(() => loadTasks()); // ✅ same thing
```

That one detail is how you'll load from `localStorage` today **without** an effect.

#### Same value → no re-render

React compares the old and new value with `Object.is`. If they're the same, it skips the re-render. For objects and arrays that means **the same reference** — which is exactly why you never mutate:

```tsx
tasks.push(newTask);
setTasks(tasks);              // ❌ same array → React sees "no change" → nothing happens

setTasks([...tasks, newTask]); // ✅ new array → re-render
```

The flip side is useful: if nothing changed, **return the old object** and React does no work at all. Reducers rely on that (Section 2.5).

---

### 1.3 Side Effects — and Why Rendering Can't Have Them

Day 07 said a component is a function from props and state to JSX. For that to work, **rendering must be pure**: same inputs, same output, and nothing else happens. React may call your component twice, call it and throw the result away, or call it in a different order than you expect.

A **side effect** is anything that reaches outside that function:

| Side effect | Example |
|---|---|
| Talking to the network | `fetch("/api/tasks")` |
| Timers | `setInterval(tick, 1000)` |
| The browser outside React | `document.title = …`, `window.addEventListener("resize", …)` |
| Storage | `localStorage.setItem(…)` |
| Logging, analytics | `console.log`, `track("page_view")` |

Side effects have exactly **two** legal homes:

1. **Event handlers** — when the effect happens *because the user did something* (clicked Save → `fetch` POST). This is the first choice, always.
2. **`useEffect`** — when the effect happens *because the component is on screen* (the page is showing → keep the title in sync, keep the clock ticking, load its data).

If you write `document.title = "…"` directly in the component body, it "works" — until it doesn't. Effects give React control over **when** the side effect runs and **how it's undone**.

---

### 1.4 `useEffect` — Setup, Cleanup, Dependencies

```tsx
import { useEffect } from "react";

useEffect(() => {
  // SETUP — runs after React has put this render on the screen
  const id = setInterval(tick, 1000);

  return () => {
    // CLEANUP — runs before the next setup, and when the component unmounts
    clearInterval(id);
  };
}, [/* DEPENDENCIES — the values from this render that setup uses */]);
```

Three parts:

- **Setup** — the function. React runs it **after** the render is committed to the screen, so it never slows down painting.
- **Cleanup** — the function setup **returns** (optional). It undoes whatever setup did.
- **Dependencies** — the array. React re-runs the effect only when one of these values has changed (compared with `Object.is`).

The array has three forms, and they mean very different things:

| Code | Runs setup… |
|---|---|
| `useEffect(fn)` | after **every** render |
| `useEffect(fn, [])` | after the **first** render only (and cleanup on unmount) |
| `useEffect(fn, [a, b])` | after the first render, and after any render where `a` or `b` changed |

The timeline for `useEffect(fn, [userId])`:

```
mount (userId = 1)      → render → setup(1)
re-render, userId = 1   → render → (nothing — no dependency changed)
re-render, userId = 2   → render → cleanup(1) → setup(2)
unmount                 →          cleanup(2)
```

Notice the cleanup always belongs to the **previous** setup — it closes over the old `userId`. That's what lets each run tidy up after itself.

> **Think "synchronise", not "lifecycle".** Don't ask *"what runs on mount?"* Ask *"what outside thing must stay in sync with this state, and how do I stop syncing?"* An effect is: *start syncing with `userId` → stop syncing with `userId`.* React decides how often that happens.

---

### 1.5 Cleanup, and Why Strict Mode Runs Effects Twice

Forget cleanup and things leak:

```tsx
useEffect(() => {
  window.addEventListener("resize", onResize);
  // no cleanup → every time this re-runs, ANOTHER listener is added
}, [onResize]);
```

Every setup that **starts** something needs a cleanup that **stops** it:

| Setup | Cleanup |
|---|---|
| `setInterval` / `setTimeout` | `clearInterval` / `clearTimeout` |
| `addEventListener` | `removeEventListener` (the **same** function) |
| `fetch` | `controller.abort()` |
| `document.title = x` | put the old title back |
| open a WebSocket | `socket.close()` |

#### Strict Mode

Your Vite project's `main.tsx` wraps the app in `<StrictMode>`. In **development only**, Strict Mode mounts every component, **unmounts it, and mounts it again** straight away. So you see:

```
start interval
clear interval
start interval
```

That isn't a bug — it's a **test**. If your effect is correct, mount → cleanup → mount is invisible to the user. If you forgot cleanup, you get **two** intervals and the clock runs double speed — in development, where you can see it, instead of in production after the user navigates away and back.

> Don't remove `<StrictMode>` to "fix" a double log. Fix the missing cleanup. In a production build the effect runs once.

---

### 1.6 Dependencies Aren't a Choice — Stale Closures

The dependency array isn't where you *decide* when the effect runs. It's a list of **every value from the component that setup reads** — props, state, and anything computed from them. The lint rule `react/exhaustive-deps` checks it for you — Step 1 switches it on (Vite’s template lints with **oxlint**, which only enables `rules-of-hooks` by default). Treat its warnings as errors.

What happens if you lie:

```tsx
function Stopwatch() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(seconds + 1);          // reads `seconds`…
    }, 1000);
    return () => clearInterval(id);
  }, []);                               // …but claims to read nothing

  return <p>{seconds}</p>;
}
```

The interval was created in the **first** render, so its callback captured that render's `seconds` — `0` — forever. Every tick says "set it to 0 + 1". The display goes to **1 and stops**. That's a **stale closure**: a function holding on to values from an old render.

Two honest fixes:

```tsx
// Fix A — tell the truth: re-create the interval whenever seconds changes
useEffect(() => {
  const id = setInterval(() => setSeconds(seconds + 1), 1000);
  return () => clearInterval(id);
}, [seconds]);                  // works, but tears down and rebuilds the interval every second

// Fix B — stop reading it: the functional update gets the latest value from React
useEffect(() => {
  const id = setInterval(() => setSeconds((s) => s + 1), 1000);
  return () => clearInterval(id);
}, []);                         // ✅ setup reads nothing from the render — [] is the truth
```

Fix B is better. **The way to remove a dependency is to make the code not need it — not to delete it from the array.**

#### Objects and functions in dependencies

```tsx
function Search({ q }: { q: string }) {
  const options = { q, limit: 10 };            // a NEW object every render

  useEffect(() => {
    fetchResults(options);
  }, [options]);                               // "changed" on every render → runs every render
}
```

`Object.is({…}, {…})` is `false` for two different objects, even with the same contents. Fixes, best first:

1. **Move it inside the effect**, and depend on the primitives: `useEffect(() => { fetchResults({ q, limit: 10 }); }, [q]);`
2. If it doesn't use props or state, **move it outside the component** entirely.
3. As a last resort, memoise it with `useMemo` / `useCallback` (Section 2.4).

Note that the **setter** from `useState` and `dispatch` from `useReducer` are stable — React guarantees the same function every render, so they never need to be dependencies.

---

### 1.7 Fetching Data in an Effect

When a component's whole job is to show some remote data, loading it is an effect: it must happen *because the component is on screen*, and again when its input changes.

The naive version has a bug:

```tsx
useEffect(() => {
  fetch(`https://api.github.com/users/${login}`)
    .then((res) => res.json())
    .then((user) => setUser(user));
}, [login]);
```

Type `a`, then `ab`, quickly. Two requests leave. If the `a` response arrives **last** (networks do that), the card shows user `a` while the box says `ab`. That's a **race condition**.

The fix is the cleanup: when `login` changes, the old request is **cancelled** before the new one starts.

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`https://api.github.com/users/${login}`, { signal: controller.signal })
    .then((res) => res.json())
    .then((user) => setUser(user))
    .catch((err: unknown) => {
      if (err instanceof DOMException && err.name === "AbortError") return;  // we cancelled it — not an error
      setError(String(err));
    });

  return () => controller.abort();         // login changed or unmounted → cancel the old one
}, [login]);
```

`AbortController` is Day 06's timeout tool, used the other way round: instead of "give up after 5 seconds", it's "give up because nobody needs this answer any more".

#### Loading without a synchronous `setState`

The obvious next line is `setLoading(true)` at the top of the effect. The React docs discourage it (and the ESLint React plugin has a rule for it, `set-state-in-effect`): setting state **synchronously** inside an effect causes an extra render every time. The cleaner pattern is to **remember which input a result belongs to**, and derive "loading":

```tsx
type Result =
  | { login: string; user: GitHubUser }
  | { login: string; error: string };

const [result, setResult] = useState<Result | null>(null);
// … the effect calls setResult({ login, user }) or setResult({ login, error }) …

const loading = result === null || result.login !== login;   // derived — no extra state
```

If the result is for an older `login`, we're loading the new one. No flag to forget to reset.

> **Session 14 is all about API integration** — loading, errors, retries, writing data, and libraries that do this for you. Today you just need the shape: an effect, a cleanup that aborts, a result tagged with its input.

---

### 1.8 You Might Not Need an Effect

Effects are an escape hatch to the world **outside** React. Most of the effects beginners write are trying to do something React already does. Before you type `useEffect`, check this table:

| You want to… | ❌ Effect | ✅ Instead |
|---|---|---|
| Compute a value from state or props | `useEffect(() => setFullName(first + " " + last), [first, last])` | `const fullName = first + " " + last;` — derived, during render |
| React to a click / submit | `useEffect(() => { if (submitted) post(…) }, [submitted])` | call `post(…)` **in the handler** |
| Reset state when a prop changes | `useEffect(() => setDraft(""), [taskId])` | `<Editor key={taskId} />` — a new key is a new component (Day 08, 1.6) |
| Load the initial value from `localStorage` | `useEffect(() => setTasks(load()), [])` | `useState(load)` — lazy initial state |
| Tell the parent something changed | `useEffect(() => onChange(value), [value])` | call `onChange` in the same handler that changes `value` |

Every ❌ row causes an **extra render** with stale data first, and most of them are bugs waiting for the right timing. Keep effects for synchronising with **external systems**: timers, the DOM outside React, the network, storage, subscriptions.

---

### 1.9 Custom Hooks — Name the Pattern

You'll write the same effect more than once: "keep `document.title` in sync", "save this state in `localStorage`". A **custom hook** is just a function whose name starts with `use` and that calls other hooks:

```ts
// hooks/useDocumentTitle.ts
import { useEffect } from "react";

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;          // leave the tab the way we found it
    };
  }, [title]);
}
```

```tsx
function InboxPage({ unread }: { unread: number }) {
  useDocumentTitle(unread > 0 ? `(${unread}) Inbox` : "Inbox");
  // …
}
```

Each component that calls a custom hook gets its **own** state and effects — a hook shares *logic*, not *data*. (Sharing data is what Context is for, Part 2.)

#### The Rules of Hooks

Hooks rely on being called **in the same order every render**. So:

1. Call hooks only at the **top level** of a component or a custom hook — never inside `if`, loops, or after an early `return`.
2. Call them only from **components** or **custom hooks** — not from plain functions or event handlers.

```tsx
function TaskDetail({ task }: { task: Task | undefined }) {
  if (!task) return <p>Not found</p>;
  useDocumentTitle(task.title);            // ❌ called on some renders, not others
}

function TaskDetail({ task }: { task: Task | undefined }) {
  useDocumentTitle(task ? task.title : "Not found");   // ✅ always called
  if (!task) return <p>Not found</p>;
}
```

The linter (`react/rules-of-hooks`, on by default) catches these. The `use` prefix is how it knows a function is a hook.

---

## Build — Follow Along: Part 1

### Step 1 — Setup

```bash
node --version                     # v22.22 or newer
npm create vite@latest day-09-labs -- --template react-ts
cd day-09-labs
npm install
npm run dev
```

Turn on the dependency check. Open `.oxlintrc.json` and add one rule:

```json
"rules": {
  "react/rules-of-hooks": "error",
  "react/exhaustive-deps": "warn",
  "react/only-export-components": ["warn", { "allowConstantExport": true }]
}
```

Do the same in `task-board-v3/` in Step 7. From now on, `npm run lint` must show **zero** warnings.

Replace `src/App.tsx` with a simple lab switcher so each step gets its own screen:

```tsx
import { useState } from "react";
import { Clock } from "./effects/Clock";
import { Stopwatch } from "./effects/Stopwatch";
import { NotesPad } from "./effects/NotesPad";
import { UserLookup } from "./effects/UserLookup";
import { ThemeLab } from "./context/ThemeLab";
import { PollLab } from "./context/PollLab";

const LABS = {
  clock: { label: "Clock", el: <Clock /> },
  stopwatch: { label: "Stopwatch", el: <Stopwatch /> },
  notes: { label: "Notes pad", el: <NotesPad /> },
  user: { label: "User lookup", el: <UserLookup /> },
  theme: { label: "Theme", el: <ThemeLab /> },
  poll: { label: "Poll", el: <PollLab /> },
};
type LabId = keyof typeof LABS;

export default function App() {
  const [lab, setLab] = useState<LabId>("clock");
  return (
    <div className="app">
      <nav>
        {(Object.keys(LABS) as LabId[]).map((id) => (
          <button key={id} aria-pressed={lab === id} onClick={() => setLab(id)}>
            {LABS[id].label}
          </button>
        ))}
      </nav>
      <main>{LABS[lab].el}</main>
    </div>
  );
}
```

Switching labs **unmounts** the old one — which is exactly what you need to see cleanups run. Comment out the imports for steps you haven't written yet.

---

### Step 2 — `src/effects/Clock.tsx` and `Stopwatch.tsx` — Timers and Cleanup

```tsx
// src/effects/Clock.tsx
import { useEffect, useState } from "react";

export function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    console.log("start interval");
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => {
      console.log("clear interval");
      clearInterval(id);
    };
  }, []);

  return <p className="big">{now.toLocaleTimeString()}</p>;
}
```

Open the console and watch:

1. On load: `start interval`, `clear interval`, `start interval` — Strict Mode's mount → unmount → mount.
2. Switch to another lab: `clear interval`. The clock is gone, and so is its timer.
3. **Break it:** delete the `return () => …` line. Reload, switch labs back and forth five times, then open the Clock and add `console.log("tick")` inside the interval. Count how many ticks per second. Put the cleanup back.

Now a timer you can start and stop — the dependency is `running`, and the functional update means the effect never reads `seconds`:

```tsx
// src/effects/Stopwatch.tsx
import { useEffect, useState } from "react";

export function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;                                   // no interval → nothing to clean up
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <>
      <p className="big">{seconds}s</p>
      <button onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Start"}</button>
      <button
        onClick={() => {
          setRunning(false);
          setSeconds(0);
        }}
      >
        Reset
      </button>
    </>
  );
}
```

**Break it:** change `setSeconds((s) => s + 1)` to `setSeconds(seconds + 1)`. The linter complains — read the message. Start it: it goes to 1 and stops. That's Section 1.6's stale closure, live. Put it back.

Notice what `Reset` does **not** need: an effect. Resetting is a reaction to a click, so it lives in the click handler (Section 1.8).

---

### Step 3 — `src/hooks/` and `NotesPad.tsx` — Persisting State

First, the two custom hooks:

```ts
// src/hooks/useDocumentTitle.ts — Section 1.9's code
```

```ts
// src/hooks/useLocalStorage.ts
import { useEffect, useState } from "react";

// Reads the saved value once (lazy initial state), then saves on every change.
// `parse` turns the stored text back into a T — or null if it can't be trusted.
export function useLocalStorage<T>(
  key: string,
  fallback: T,
  parse: (raw: string) => T | null,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : (parse(raw) ?? fallback);
    } catch {
      return fallback;                      // storage blocked (private mode, browser settings)
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // full or blocked — the app still works, it just won't remember
    }
  }, [key, value]);

  return [value, setValue] as const;
}
```

Why `parse`? Because `localStorage` is **untrusted text**, just like the URL on Day 08. The user can edit it in DevTools, an older version of your app might have saved a different shape, or another app on the same origin might have used the same key. `JSON.parse` can throw, and even when it doesn't, `unknown` must be narrowed before you use it (Day 06).

```tsx
// src/effects/NotesPad.tsx
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function parseText(raw: string): string | null {
  try {
    const data: unknown = JSON.parse(raw);
    return typeof data === "string" ? data : null;
  } catch {
    return null;
  }
}

export function NotesPad() {
  const [text, setText] = useLocalStorage("notes-pad", "", parseText);
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;   // derived

  useDocumentTitle(`${words} words · Notes`);

  return (
    <>
      <label htmlFor="notes">Notes</label>
      <textarea id="notes" rows={8} value={text} onChange={(e) => setText(e.target.value)} />
      <p className="hint">{words} words — saved in this browser</p>
    </>
  );
}
```

Try it:

1. Type something, **refresh**. It's still there.
2. Watch the tab title change as you type. Switch to another lab — the title goes back.
3. DevTools → **Application** → Local Storage. Find `notes-pad`. Change its value to `{oops` and refresh: the pad is empty, not crashed. Change it to `42`: same. That's `parse` earning its keep.

---

### Step 4 — `src/effects/UserLookup.tsx` — Fetch, Debounce, Abort

One more hook — wait until the user stops typing before using the value:

```ts
// src/hooks/useDebouncedValue.ts
import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);           // typed again before `ms` passed → cancel, start over
  }, [value, ms]);

  return debounced;
}
```

Read the cleanup carefully — it **is** the debounce. Each keystroke changes `value`, which cleans up the previous timer before starting a new one. Only a pause longer than `ms` lets a timer finish.

```tsx
// src/effects/UserLookup.tsx
import { useEffect, useState } from "react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

interface GitHubUser {
  login: string;
  name: string | null;
  public_repos: number;
  avatar_url: string;
}

type Result =
  | { login: string; user: GitHubUser }
  | { login: string; error: string };

function UserCard({ login }: { login: string }) {
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    console.log("fetch", login);

    fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, { signal: controller.signal })
      .then((res) => {
        if (res.status === 404) throw new Error(`No user called “${login}”.`);
        if (!res.ok) throw new Error(`GitHub answered ${res.status}.`);
        return res.json() as Promise<GitHubUser>;
      })
      .then((user) => setResult({ login, user }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("aborted", login);
          return;
        }
        setResult({ login, error: err instanceof Error ? err.message : "Something went wrong." });
      });

    return () => controller.abort();
  }, [login]);

  if (result === null || result.login !== login) return <p>Loading…</p>;   // derived loading
  if ("error" in result) return <p role="alert">{result.error}</p>;

  const { user } = result;
  return (
    <article className="card">
      <img src={user.avatar_url} alt="" width={64} height={64} />
      <h3>{user.name ?? user.login}</h3>
      <p>{user.public_repos} public repos</p>
    </article>
  );
}

export function UserLookup() {
  const [text, setText] = useState("");
  const login = useDebouncedValue(text.trim(), 400);

  return (
    <>
      <label htmlFor="login">GitHub username</label>
      <input id="login" value={text} onChange={(e) => setText(e.target.value)} placeholder="octocat" />
      {login !== "" && <UserCard login={login} />}
    </>
  );
}
```

> `res.json() as Promise<GitHubUser>` trusts GitHub's shape. Day 06 taught the strict way (`unknown` + a type guard); here the API is well known and the lab is about the effect. Session 14 does it properly.

Try it, with the **Network** tab open:

1. Type `octocat` at normal speed. One request — the debounce swallowed the others.
2. DevTools → Network → throttling **Slow 4G**. Type `gaearon`, wait for "Loading…", then quickly change it to `octocat`. The console shows `aborted gaearon`, and the Network tab shows that request as **(canceled)**. The card can never show the wrong user.
3. Type `this-user-should-not-exist-123`. The 404 becomes a readable message.
4. **Break it:** remove `return () => controller.abort();`. With throttling on, type `a`, pause, then `ab` quickly. Sometimes the card flickers to the wrong person. Put it back.

> GitHub allows **60 unauthenticated requests per hour** per IP. If you get `GitHub answered 403.`, that's the limit — wait, or use your phone's hotspot. The debounce is also how real apps stay under limits like this.

---

# Part 2 — Context and `useReducer`

## 2 — Concept (60 min)

### 2.1 Prop Drilling

Here's an app where the user picks a theme in the header and a button deep in the page must use it:

```
App                       ← owns `theme`
└── Page                  ← doesn't care, passes theme down
    └── Sidebar           ← doesn't care, passes theme down
        └── Panel         ← doesn't care, passes theme down
            └── Button    ← finally uses it
```

```tsx
function App() {
  const [theme, setTheme] = useState<Theme>("light");
  return <Page theme={theme} />;
}
function Page({ theme }: { theme: Theme }) { return <Sidebar theme={theme} />; }
function Sidebar({ theme }: { theme: Theme }) { return <Panel theme={theme} />; }
function Panel({ theme }: { theme: Theme }) { return <Button theme={theme} />; }
```

That's **prop drilling**. Three components accept a prop only to hand it on. Add `language`, `user`, and `cart`, and every middle component grows a list of props it never reads — and renaming one means editing all of them.

Lifting state up (Day 07) put the data in the right **owner**. Context fixes the **delivery**: the owner provides it once, and any component below can read it directly.

> Prop drilling through **one or two** levels is fine — it's explicit and easy to follow. Reach for Context when the same data is needed by many components at different depths.

---

### 2.2 `createContext`, the Provider, `useContext`

Three steps.

**1. Create** the context — once, in its own module:

```ts
// theme-context.ts
import { createContext } from "react";

export type Theme = "light" | "dark";
export const ThemeContext = createContext<Theme>("light");   // "light" = the default
```

**2. Provide** a value — high in the tree. In React 19 the context object itself is the provider:

```tsx
function App() {
  const [theme, setTheme] = useState<Theme>("light");
  return (
    <ThemeContext value={theme}>
      <Page />                                {/* no theme prop any more */}
    </ThemeContext>
  );
}
```

> Older code (and React 18) writes `<ThemeContext.Provider value={theme}>`. It means the same thing and still works.

**3. Read** it — anywhere below:

```tsx
import { useContext } from "react";

function Button() {
  const theme = useContext(ThemeContext);       // "light" or "dark" — from the nearest provider above
  return <button className={`btn btn-${theme}`}>Save</button>;
}
```

Three rules that answer most Context questions:

- `useContext` reads the value from the **nearest** provider **above** the component. A provider nested inside another one overrides it for its subtree.
- With **no** provider above, you get the **default** passed to `createContext`.
- When the provider's `value` changes, **every component that reads that context re-renders** — even if a component in between is memoised.

---

### 2.3 The Pattern: `null` Default + a Hook That Throws

For a theme, a default (`"light"`) makes sense. For something like "the current board" there's no sensible default — reading it outside a provider is always a **bug**. So the standard pattern is:

```ts
// board-context.ts
import { createContext, useContext } from "react";

export interface Board { /* … */ }

export const BoardContext = createContext<Board | null>(null);

export function useBoard(): Board {
  const board = useContext(BoardContext);
  if (board === null) {
    throw new Error("useBoard must be used inside <BoardProvider>");
  }
  return board;
}
```

Why it's worth five lines:

- Components call `useBoard()` and get a `Board` — never `Board | null`. No `?.` everywhere.
- Forget the provider, and you get a **clear error naming the problem** instead of `Cannot read properties of null (reading 'tasks')` three files away.
- Components don't import `useContext` or the context object at all — if you later swap the implementation, they don't change.

> **Vite's lint rule `react/only-export-components`** warns when one file exports both a component and something else (like a hook), because hot reload can't handle it. So the convention is: the context object and its hook in `board-context.ts`, the provider **component** in `BoardProvider.tsx`.

---

### 2.4 What Re-Renders — and How to Keep It Cheap

Here's a provider that passes an object:

```tsx
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const value = { theme, toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")) };
  return <ThemeContext value={value}>{children}</ThemeContext>;
}
```

`value` is a **new object on every render** of `ThemeProvider`. Every consumer compares old and new value with `Object.is` → "changed" → re-renders, even when `theme` didn't change.

For most apps this doesn't matter — re-renders are fast, and this provider only re-renders when its own state changes (the `children` were created by the parent, so they don't re-render just because the provider did). When it **does** matter — a big tree, a provider whose parent re-renders often — memoise the value:

```tsx
const toggle = useCallback(() => setTheme((t) => (t === "light" ? "dark" : "light")), []);
const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
```

- `useMemo(fn, deps)` returns the **same** value until a dependency changes.
- `useCallback(fn, deps)` is `useMemo` for a function.

Two more tools:

- **Split contexts** by how often they change. A rarely-changing `UserContext` and a fast-changing `CartContext` shouldn't be one object.
- **Pass `dispatch` on its own.** It never changes, so components that only *send* actions don't re-render when the state does.

> Measure before optimising: React DevTools → Profiler → "Highlight updates when components render". If nothing is slow, don't add `useMemo`. (React Compiler, if your project enables it, does this memoisation for you.)

---

### 2.5 `useReducer` — State Changes as Named Actions

Look at Day 08's `Layout`: four handlers, each with its own `setTasks(prev => …)`. The rules for *how tasks change* are spread through a component, mixed with `await pretendToSave` and navigation. You can't test them without rendering.

`useReducer` pulls those rules out into one **pure function**:

```ts
type CounterAction =
  | { type: "incremented" }
  | { type: "decremented" }
  | { type: "set"; value: number };

function counterReducer(count: number, action: CounterAction): number {
  switch (action.type) {
    case "incremented": return count + 1;
    case "decremented": return Math.max(0, count - 1);
    case "set": return action.value;
  }
}
```

```tsx
const [count, dispatch] = useReducer(counterReducer, 0);

<button onClick={() => dispatch({ type: "incremented" })}>+</button>
<button onClick={() => dispatch({ type: "set", value: 0 })}>Reset</button>
```

- A **reducer** takes the current state and an **action** (a plain object describing *what happened*) and returns the **next** state.
- `dispatch(action)` sends an action. React calls the reducer and re-renders with the result.
- The action type is a **discriminated union** (Day 06) — inside `case "set":` TypeScript knows `action.value` exists. A typo like `"incremnted"` is a compile error.

Reducer rules — the same as Day 07's state rules, made strict:

1. **Pure.** No `fetch`, no `localStorage`, no `Date.now()`, no `Math.random()`. Same state + same action → same result. That's what makes it testable with plain `node`.
2. **Never mutate.** Return a new object/array when something changes.
3. **Nothing changed → return the same state.** React then skips the re-render (Section 1.2).

Name actions as **events** (`"added"`, `"toggled"`) rather than commands (`"setTasks"`). An action says what happened; the reducer decides what that means.

| Use `useState` when… | Use `useReducer` when… |
|---|---|
| the state is one or two independent values | several values change together |
| updates are simple (`setOpen(true)`) | the next state depends on rules worth testing |
| one component touches it | many places trigger the same kinds of change |

Neither is "better". A reducer is `useState` with the update logic moved into one named, testable place.

---

### 2.6 Context + Reducer = A Small Store

Put the two together and you get a pattern that runs a lot of real apps:

```
BoardProvider
  ├── useReducer(boardReducer, …)   → tasks, dispatch    (the rules — pure, tested)
  ├── useEffect(save to storage)    → keeps localStorage in sync
  ├── async addTask, updateTask…    → side effects (server), THEN dispatch
  └── <BoardContext value={…}>      → hands it all to any component below
```

The split of responsibilities is the important part:

| Piece | Does | Never does |
|---|---|---|
| **Reducer** | decides the next state | side effects |
| **Provider** | owns the state, runs effects, talks to the "server", dispatches | render UI of its own |
| **Pages / components** | call `useBoard()` and render | know how state is stored |

This is the shape of every state library you'll meet — Redux is reducer + actions + context, with tooling on top.

---

### 2.7 When *Not* to Use Context

Context is a **delivery** mechanism, not a place to put everything:

| Data | Better home |
|---|---|
| Used by one component, or a parent and its child | `useState` + props |
| Should be in a shareable link (filters, page, search) | the URL (Day 08) |
| Comes from a server and needs caching, refetching, loading states | a data library such as TanStack Query (Session 14) |
| App-wide, changes often, many independent pieces, needs devtools | a store library — Zustand, Redux Toolkit |
| App-wide, changes rarely: theme, language, current user, a small domain store | ✅ **Context** |

A common mistake is one giant `AppContext` with everything in it — every change re-renders every consumer, and every component depends on everything. Prefer small contexts, each with a clear job.

---

## Build — Follow Along: Part 2

### Step 5 — `src/context/` — A Theme Context

Four files. The context and its hook:

```ts
// src/context/theme-context.ts
import { createContext, useContext } from "react";

export type Theme = "light" | "dark";

export interface ThemeValue {
  theme: Theme;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeValue | null>(null);

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext);
  if (value === null) throw new Error("useTheme must be used inside <ThemeProvider>");
  return value;
}
```

The provider — it owns the state, saves it, and syncs it to `<html>`:

```tsx
// src/context/ThemeProvider.tsx
import { useCallback, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ThemeContext } from "./theme-context";
import type { Theme } from "./theme-context";

function parseTheme(raw: string): Theme | null {
  return raw === '"light"' || raw === '"dark"' ? (JSON.parse(raw) as Theme) : null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "light", parseTheme);

  // <html> lives outside React's tree → syncing it is an effect
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "light" ? "dark" : "light")), [setTheme]);
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
```

Consumers at different depths — with **no props** passing the theme:

```tsx
// src/context/ThemeLab.tsx
import { ThemeProvider } from "./ThemeProvider";
import { useTheme } from "./theme-context";

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-pressed={theme === "dark"}>
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

function Panel() {
  return (
    <section className="panel">
      <h3>A panel that doesn't know about themes</h3>
      <Badge />
    </section>
  );
}

function Badge() {
  const { theme } = useTheme();
  return <span className="badge">Current theme: {theme}</span>;
}

export function ThemeLab() {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <Panel />
    </ThemeProvider>
  );
}
```

And the CSS that reacts to it, in `src/index.css`:

```css
:root { --bg: #ffffff; --ink: #1d1d1b; }
:root[data-theme="dark"] { --bg: #1d1d1b; --ink: #f2f2ee; }
body { background: var(--bg); color: var(--ink); }
```

Try it:

1. Toggle — the whole page changes, and `Badge` (two levels down, inside a component that knows nothing) updates.
2. Refresh — the theme is remembered.
3. **Break it:** move `<Badge />` *outside* `<ThemeProvider>` in `ThemeLab`. Read the error message — it tells you exactly what's wrong. Put it back.
4. With React DevTools → Components, select `Badge`. Its "rendered by" chain and the context value are right there.

---

### Step 6 — `src/context/PollLab.tsx` — `useReducer`

A tiny poll: vote once, see the results, start again.

```ts
// src/context/poll-reducer.ts
export const OPTIONS = ["React", "Vue", "Angular"] as const;
export type Option = (typeof OPTIONS)[number];

export interface PollState {
  votes: Record<Option, number>;
  myVote: Option | null;
}

export type PollAction =
  | { type: "voted"; option: Option }
  | { type: "reset" };

export const INITIAL_POLL: PollState = {
  votes: { React: 0, Vue: 0, Angular: 0 },
  myVote: null,
};

export function pollReducer(state: PollState, action: PollAction): PollState {
  switch (action.type) {
    case "voted":
      if (state.myVote !== null) return state;           // already voted → no change, same object
      return {
        votes: { ...state.votes, [action.option]: state.votes[action.option] + 1 },
        myVote: action.option,
      };
    case "reset":
      return INITIAL_POLL;
  }
}
```

Prove it before any component exists — reducers are plain functions:

```ts
// src/context/poll-reducer.test-run.ts   —   node src/context/poll-reducer.test-run.ts
import { INITIAL_POLL, pollReducer } from "./poll-reducer.ts";

const s1 = pollReducer(INITIAL_POLL, { type: "voted", option: "React" });
console.log(s1.votes.React, s1.myVote);                                   // 1 React
const s2 = pollReducer(s1, { type: "voted", option: "Vue" });
console.log(s2 === s1);                                                   // true — second vote ignored
console.log(INITIAL_POLL.votes.React);                                    // 0 — nothing was mutated
console.log(pollReducer(s2, { type: "reset" }) === INITIAL_POLL);         // true
```

> Running `.ts` with `node` works on Node 22.18+ — it strips the types. That's also why the import says `./poll-reducer.ts` with the extension. Your Vite tsconfig already allows it (`allowImportingTsExtensions`).

The component only renders and dispatches:

```tsx
// src/context/PollLab.tsx
import { useReducer } from "react";
import { INITIAL_POLL, OPTIONS, pollReducer } from "./poll-reducer";

export function PollLab() {
  const [poll, dispatch] = useReducer(pollReducer, INITIAL_POLL);
  const total = OPTIONS.reduce((sum, o) => sum + poll.votes[o], 0);   // derived

  return (
    <>
      <h3>Which framework is this course using?</h3>
      {OPTIONS.map((o) => (
        <button
          key={o}
          disabled={poll.myVote !== null}
          aria-pressed={poll.myVote === o}
          onClick={() => dispatch({ type: "voted", option: o })}
        >
          {o} — {poll.votes[o]}
        </button>
      ))}
      <p>{total} vote{total === 1 ? "" : "s"}</p>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </>
  );
}
```

**Break it:** in the reducer, replace the `"voted"` case with `state.votes[action.option]++; return state;`. Click — nothing updates. You mutated the state and returned the same object, so React saw "no change". Put it back.

---

# Part 3 — Project: Task Board v3

## 3 — Concept (30 min)

### 3.1 Plan Before You Type

Task Board v2 works, but it has two problems: tasks live in `Layout`'s memory (gone on refresh), and they reach the pages through `useOutletContext` (only one level deep). v3 moves the state into a **store** — a provider, a reducer, and a storage module — and changes almost nothing else.

**1. What changes**

| | v2 (Day 08) | v3 (today) |
|---|---|---|
| Who owns `tasks` | `Layout` with `useState` | `BoardProvider` with `useReducer` |
| How state changes | four `setTasks(prev => …)` | `dispatch` → `boardReducer` (pure, tested) |
| How pages get it | `useOutletContext` | `useContext` — any depth |
| After a refresh | back to `INITIAL` | loaded from `localStorage` |
| Tab title | `Vite + React + TS` | `(2) Task Board` — open tasks |
| The pages | — | **unchanged** — they still call `useBoard()` |

That last row is the payoff of Day 08's `useBoard()` wrapper: pages never knew *how* they got the board, so swapping the mechanism doesn't touch them.

**2. The tree**

```
StrictMode
└── BrowserRouter
    └── BoardProvider             ← owns tasks (useReducer), saves them (useEffect)
        └── Routes (App.tsx)
            └── Layout            ← header + nav + <Outlet /> — no state any more
                ├── TaskListPage        ┐
                ├── NewTaskPage         │
                ├── TaskDetailPage      ├── useBoard() → useContext(BoardContext)
                ├── EditTaskPage        │
                └── NotFoundPage        ┘
```

**3. The state table**

| Data | State or derived? | Lives in | Survives a refresh? |
|---|---|---|---|
| `tasks` | **state** | `BoardProvider` (`useReducer`) | ✅ `localStorage` |
| `filter`, `q` (and `sort`) | **state — in the URL** | `useSearchParams` | ✅ the URL |
| the form's `values`, `touched`, submit state | **state** | `TaskForm` | ❌ — on purpose |
| visible tasks, errors, the current task | **derived** | computed in render | — |
| the open-task count in the tab title | **derived** | `TaskListPage` → `useDocumentTitle` | — |

---

### 3.2 The Pure Parts — Reducer and Storage

Two modules with **no React in them**, both testable with `node`.

```ts
// board-reducer.ts
import type { Task, TaskFormValues } from "./types";

export type BoardAction =
  | { type: "added"; task: Task }
  | { type: "updated"; id: number; values: TaskFormValues }
  | { type: "toggled"; id: number }
  | { type: "removed"; id: number };

export function boardReducer(tasks: Task[], action: BoardAction): Task[] {
  switch (action.type) {
    case "added":
      return [...tasks, action.task];
    case "updated":
      return tasks.map((t) => (t.id === action.id ? { ...action.values, id: action.id } : t));
    case "toggled":
      return tasks.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case "removed":
      return tasks.filter((t) => t.id !== action.id);
  }
}

export function nextId(tasks: Task[]): number {
  return tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}
```

Storage is the boundary with the outside world, so it **parses** — the same rule as Day 08's URL params:

```ts
// storage.ts
import type { Task } from "./types";

export const STORAGE_KEY = "task-board";
const PRIORITIES: readonly unknown[] = ["low", "medium", "high"];

function isTask(x: unknown): x is Task {
  if (typeof x !== "object" || x === null) return false;
  const t = x as Record<string, unknown>;
  return (
    typeof t.id === "number" &&
    typeof t.title === "string" &&
    typeof t.done === "boolean" &&
    typeof t.dueDate === "string" &&
    typeof t.notes === "string" &&
    PRIORITIES.includes(t.priority)
  );
}

// null = "nothing usable stored" — the caller decides what to fall back to
export function parseTasks(raw: string | null): Task[] | null {
  if (raw === null) return null;
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isTask) : null;
  } catch {
    return null;
  }
}

export function readStoredTasks(): Task[] | null {
  try {
    return parseTasks(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;                                   // storage blocked
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // full or blocked — keep working in memory
  }
}
```

Why does `parseTasks` return `null` instead of `[]`? Because "the user deleted every task" (`[]`) and "nothing usable was stored" are different situations. The first should stay empty after a refresh; the second should show the starter tasks. Collapsing them into one value would be a bug.

---

### 3.3 The Provider's Shape

```ts
// board-context.ts
export interface Board {
  tasks: Task[];
  addTask: (values: TaskFormValues) => Promise<Task>;
  updateTask: (id: number, values: TaskFormValues) => Promise<void>;
  toggleTask: (id: number) => void;
  removeTask: (id: number) => void;
}
```

It's Day 08's `BoardContext` interface, renamed to `Board` (the name `BoardContext` now belongs to the context object). Same five members — that's why the pages don't change.

---

## Build — Follow Along: Part 3

### Step 7 — Copy v2, Add the Pure Parts, Prove Them

```bash
cp -r task-board-v2 task-board-v3          # Windows PowerShell: Copy-Item -Recurse task-board-v2 task-board-v3
cd task-board-v3
rm -rf node_modules && npm install
```

Your Problem 4 additions from Day 08 (sort, duplicate) come along — keep them.

Move `INITIAL` out of `Layout.tsx` into its own file, so the provider can use it:

```ts
// src/initial-tasks.ts
import type { Task } from "./types";

export const INITIAL: Task[] = [
  { id: 1, title: "Read the Day 09 README", done: true, priority: "high", dueDate: "", notes: "" },
  { id: 2, title: "Write the board reducer", done: false, priority: "high", dueDate: "2027-01-15", notes: "Pure — test it with node first." },
  { id: 3, title: "Save tasks to localStorage", done: false, priority: "medium", dueDate: "", notes: "" },
];
```

Add `src/board-reducer.ts` and `src/storage.ts` from Section 3.2, then prove them **before** any component uses them:

```ts
// src/board.test-run.ts   —   node src/board.test-run.ts
import { boardReducer, nextId } from "./board-reducer.ts";
import { parseTasks } from "./storage.ts";
import { INITIAL } from "./initial-tasks.ts";

const added = boardReducer(INITIAL, {
  type: "added",
  task: { id: nextId(INITIAL), title: "New", done: false, priority: "low", dueDate: "", notes: "" },
});
console.log(added.length, INITIAL.length);                                  // 4 3 — new array, INITIAL untouched
console.log(boardReducer(INITIAL, { type: "toggled", id: 2 })[1].done);     // true
console.log(INITIAL[1].done);                                               // false — not mutated
console.log(boardReducer(INITIAL, { type: "removed", id: 1 }).map((t) => t.id).join(","));  // 2,3
console.log(nextId([]));                                                    // 1

console.log(parseTasks(null));                                              // null
console.log(parseTasks("{oops"));                                           // null
console.log(parseTasks('{"id":1}'));                                        // null — not an array
console.log(parseTasks("[]"));                                              // []
console.log(parseTasks(JSON.stringify([INITIAL[0], { id: "2" }, null]))?.length); // 1 — bad entries dropped
```

Every line should match its comment. If one doesn't, fix it now — it's much harder to find once it's behind a component.

---

### Step 8 — The Context, the Provider, and a Thinner Layout

Replace `src/board-context.ts` — the `useOutletContext` version — with the Context version:

```ts
// src/board-context.ts
import { createContext, useContext } from "react";
import type { Task, TaskFormValues } from "./types";

export interface Board {
  tasks: Task[];
  addTask: (values: TaskFormValues) => Promise<Task>;
  updateTask: (id: number, values: TaskFormValues) => Promise<void>;
  toggleTask: (id: number) => void;
  removeTask: (id: number) => void;
}

export const BoardContext = createContext<Board | null>(null);

export function useBoard(): Board {
  const board = useContext(BoardContext);
  if (board === null) throw new Error("useBoard must be used inside <BoardProvider>");
  return board;
}
```

The provider — read it as the table from Section 2.6:

```tsx
// src/BoardProvider.tsx
import { useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import { BoardContext } from "./board-context";
import type { Board } from "./board-context";
import { boardReducer, nextId } from "./board-reducer";
import { pretendToSave } from "./fakeApi";
import { INITIAL } from "./initial-tasks";
import { readStoredTasks, saveTasks } from "./storage";
import type { Task, TaskFormValues } from "./types";

function loadTasks(): Task[] {
  return readStoredTasks() ?? INITIAL;
}

export function BoardProvider({ children }: { children: ReactNode }) {
  // The third argument is an initializer: called ONCE, like useState(fn)
  const [tasks, dispatch] = useReducer(boardReducer, undefined, loadTasks);

  // Keep localStorage in sync with the state — an external system
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  async function addTask(values: TaskFormValues): Promise<Task> {
    await pretendToSave(values.title);                      // may throw — the form catches it
    const task: Task = { ...values, id: nextId(tasks) };
    dispatch({ type: "added", task });
    return task;
  }

  async function updateTask(id: number, values: TaskFormValues): Promise<void> {
    await pretendToSave(values.title);
    dispatch({ type: "updated", id, values });
  }

  const value: Board = {
    tasks,
    addTask,
    updateTask,
    toggleTask: (id) => dispatch({ type: "toggled", id }),
    removeTask: (id) => dispatch({ type: "removed", id }),
  };

  return <BoardContext value={value}>{children}</BoardContext>;
}
```

Three things to notice:

- **The side effects are in the provider, not the reducer.** `pretendToSave` runs first; only if it succeeds does the provider `dispatch`. The reducer just records what happened.
- **Saving is an effect, loading isn't.** Loading happens once, before the first render — that's the initializer. Saving must follow every change, whoever made it — that's an effect on `[tasks]`.
- `addTask` computes the id from **this render's** `tasks`, the same honest wrinkle as Day 08 — fine while the button can't be double-clicked.

> `value` is a new object every render. Here the provider only re-renders when `tasks` changes, and then every consumer needs the new tasks anyway — so `useMemo` would buy nothing. Section 2.4 is for when it does.

Wrap the app in `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { BoardProvider } from "./BoardProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <BoardProvider>
        <App />
      </BoardProvider>
    </BrowserRouter>
  </StrictMode>,
);
```

`BoardProvider` is **inside** `BrowserRouter`, so later it could use router hooks if it needed to. It's **outside** `App`'s `<Routes>`, so it never unmounts when the page changes.

Now `Layout` loses all its state — it's just the frame:

```tsx
// src/Layout.tsx
import { NavLink, Outlet } from "react-router";

export function Layout() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Board</h1>
        <nav aria-label="Main">
          <NavLink to="/" end>Tasks</NavLink>
          <NavLink to="/tasks/new">New task</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

Run `npm run dev`. Open every page. **You didn't edit a single page** — and they all still work, because `useBoard()` kept its name and its return type.

---

### Step 9 — The Tab Title, Then Run, Break, Ship

Copy `src/hooks/useDocumentTitle.ts` from the labs, then add two lines to `TaskListPage`:

```tsx
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function TaskListPage() {
  const { tasks, toggleTask, removeTask } = useBoard();
  // …

  const open = tasks.filter((t) => !t.done).length;              // derived
  useDocumentTitle(open === 0 ? "Task Board" : `(${open}) Task Board`);

  // …
}
```

Tick a task — the tab title changes. Open a task's detail page — the title goes back (the list page unmounted, and its cleanup restored it).

#### Check it

```bash
node src/board.test-run.ts                    # every line matches its comment
npx tsc --noEmit -p tsconfig.app.json         # zero type errors
npm run lint                                  # zero warnings
npm run build                                 # production build succeeds
npm run dev
```

Then use it like a user would:

1. Add a task, tick another, delete a third. **Refresh.** Everything is exactly as you left it.
2. DevTools → Application → Local Storage → `task-board`. Watch the JSON change as you click.
3. Delete **every** task, refresh — the list stays empty (not the starter tasks). That's `null` vs `[]` from Section 3.2.
4. Set `task-board` to `{oops` in DevTools, refresh — the starter tasks, no crash. Set it to `[{"id":1}]` — an empty list, no crash.
5. Filter to **open**, search, refresh — the URL state *and* the tasks both survive.
6. Watch the tab title as you tick tasks.

#### Break it on purpose

Break each, read the symptom, fix it. You'll explain one of them in the assignment.

1. **No provider** — in `main.tsx`, move `<BoardProvider>` so it only wraps nothing (or remove it). Read the error: it names the problem exactly.
2. **Mutating in the reducer** — change `"toggled"` to `const t = tasks.find(…)!; t.done = !t.done; return tasks;`. Clicking a checkbox does nothing visible — until something *else* re-renders. Fix it.
3. **Loading in an effect** — replace the initializer with `useReducer(boardReducer, INITIAL)` plus `useEffect(() => { dispatch(… load …) }, [])` (you'd need a `"loaded"` action). Refresh with the Network tab's screenshot filmstrip, or just watch closely — and also watch what the **save** effect does on the very first render. Why does the initializer avoid both problems?
4. **Missing dependency** — change the save effect's array to `[]`. Add a task, refresh. Gone. The linter warned you.

#### Ship it

On a branch (`feature/day-09`): commit the labs and the board separately, push, open a PR, merge it.

---

## What's Next

Your board now remembers — but only in **this** browser. The "server" is still a function that sleeps, and the data a real app shows comes from somewhere else. Session 14 connects React to a real API: loading lists and details, sending creates and updates, loading and error states everywhere — and the first project of the track, the **Course Management Dashboard**.

---

## Day 09 Files

- [README.md](README.md) — this guide
- [ASSIGNMENT.md](ASSIGNMENT.md) — Day 09 assignment

← Back to [Day 08 — Forms in React + Routing with React Router](../Day-08-Forms-Routing/README.md)

Next: [Day 10 — API Integration in React + Project: Course Management Dashboard](../Day-10-API-Integration-Dashboard/README.md) →
