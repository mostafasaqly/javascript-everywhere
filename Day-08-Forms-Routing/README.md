# Day 08 — Forms in React + Routing with React Router

**Track 2: Full-Stack Web Application · Day 8 · three parts**

> Day 07 ended with an `AddTaskForm` that had one input and a promise: *forms grow up next session, and the board gets more than one page.*
> Today the form becomes a real one — several fields, validation, a saving state, an error state — and the single screen becomes a **multi-page app** with its own URLs, a back button that works, and a filter you can send to a friend as a link.

**Why this day matters:** forms and URLs are the two things every real product has. Every sign-up, checkout, settings page and admin panel is a form; every shareable page, bookmark and "back" button is a URL. Day 07 gave you state. Today you learn the two most common places state *comes from*: what the user types, and what the address bar says.

**Versions this guide is written for:** React **19.3** · React Router **8** (package `react-router`) · Vite **8** · TypeScript **6**. React Router 8 needs **Node 22.22 or newer** — run `node --version` before you start, and update Node first if it's older.

| Part | Topic | Concept | Build |
|---|---|---|---|
| **1** | Forms — controlled inputs, validation, submit states | Sections 1.1–1.9 | Steps 1–4 |
| **2** | Routing — React Router, nested routes, params, search params | Sections 2.1–2.10 | Steps 5–8 |
| **3** | **Project: Task Board v2** — a multi-page app with a real form | Sections 3.1–3.3 | Steps 9–11 |

---

## What You'll Have by the End

**Part 1 — Forms**

- [ ] Every input type as a controlled component: text, number, textarea, select, checkbox, radio, date
- [ ] One `values` object and one `onChange` for the whole form, using each input's `name`
- [ ] Validation as a **pure function** — and when to show its errors (blur, submit, never on first keystroke)
- [ ] A submit flow with `idle → submitting → error | success`, a disabled button, and no double-submits
- [ ] Resetting a form — by hand, and with the `key` trick
- [ ] The uncontrolled alternative: `FormData`, and when it's the right tool
- [ ] Accessible forms: labels, `aria-invalid`, `aria-describedby`, `role="alert"`, focus the first error

**Part 2 — Routing**

- [ ] What client-side routing is, and why `<a href>` throws your state away but `<Link>` doesn't
- [ ] `BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink`
- [ ] Layout routes, index routes and `<Outlet />`
- [ ] Dynamic segments with `useParams` — and why `id` arrives as a **string**
- [ ] `useSearchParams`: state that lives in the URL (filters, search, pages)
- [ ] `useNavigate` and `<Navigate>` for redirects after a save
- [ ] A catch-all 404 route, and the "refresh gives a 404" deployment gotcha
- [ ] Sharing state between pages with a layout route and `useOutletContext`

**Part 3 — Project: Task Board v2**

- [ ] Five routes: list, new, detail, edit, 404
- [ ] One `TaskForm` used for **both** create and edit
- [ ] A filter and search that survive a refresh, because they live in the URL
- [ ] A form you've broken on purpose four ways and fixed

---

# Part 1 — Forms

## 1 — Concept (70 min)

### 1.1 The Form Element, Again

Everything from Day 06 still holds: a `<form>` with a submit button gives you Enter-key submission for free, and `e.preventDefault()` stops the page reload. In React, the form looks like this:

```tsx
import { useState } from "react";
import type { SubmitEvent } from "react";

function Login() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("submit", email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Sign in</button>
    </form>
  );
}
```

Two rules before anything else:

- Put the handler on the form's **`onSubmit`**, not on the button's `onClick`. Then Enter works, the browser's accessibility behaviour works, and screen readers announce a form.
- A `<button>` inside a form is `type="submit"` by default. Any button that is **not** supposed to submit (a "Cancel", a "Show password") needs `type="button"`.

---

### 1.2 Controlled Inputs — Every Kind

Day 07's rule: the input shows what **state** says, and `onChange` writes back to state. The attribute that carries the value differs by input type:

| Input | State holds | You set | Read from the event |
|---|---|---|---|
| `<input>` text, email, password, date, search | `string` | `value={x}` | `e.target.value` |
| `<textarea>` | `string` | `value={x}` (not children!) | `e.target.value` |
| `<select>` | `string` | `value={x}` on the `<select>`, not `selected` on options | `e.target.value` |
| `<input type="checkbox">` | `boolean` | `checked={x}` | `e.target.checked` |
| `<input type="radio">` | `string` (the chosen value) | `checked={x === "thisOne"}` on each radio | `e.target.value` |
| `<input type="number">` | `string` — **not** `number` | `value={x}` | `e.target.value` (a string; convert on submit) |

```tsx
<textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />

<select value={priority} onChange={(e) => setPriority(e.target.value)}>
  <option value="low">Low</option>
  <option value="high">High</option>
</select>

<input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />

{["low", "medium", "high"].map((p) => (
  <label key={p}>
    <input type="radio" name="priority" value={p}
           checked={priority === p} onChange={(e) => setPriority(e.target.value)} /> {p}
  </label>
))}
```

> **Why a number input holds a string:** while the user types `1.`, `-` or an empty box, there is no valid number yet. Keep the string in state, validate it, and convert with `Number(value)` only when you submit. An empty box is `""` — and `Number("")` is `0`, which is a classic bug.

Two bugs everyone meets once:

| Symptom | Cause |
|---|---|
| The input won't let you type — and React warns about `value` without `onChange` | You set `value` but no `onChange`. Add `onChange`, or use `defaultValue` for an uncontrolled input. |
| "A component is changing an uncontrolled input to be controlled" | The state started as `undefined` (`useState<string>()`) then became a string. **Always start with `""`.** |

---

### 1.3 One State Object, One Handler

A form with six fields shouldn't have six `useState`s and six handlers. Keep **one `values` object** and use each input's `name` to know which field changed:

```tsx
interface Values {
  name: string;
  email: string;
  role: string;
  agree: boolean;
}

const INITIAL: Values = { name: "", email: "", role: "student", agree: false };

function Signup() {
  const [values, setValues] = useState<Values>(INITIAL);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    const next =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : value;
    setValues((prev) => ({ ...prev, [name]: next }));
  }

  return (
    <form>
      <input name="name" value={values.name} onChange={handleChange} />
      <input name="email" value={values.email} onChange={handleChange} />
      <select name="role" value={values.role} onChange={handleChange}>…</select>
      <input type="checkbox" name="agree" checked={values.agree} onChange={handleChange} />
    </form>
  );
}
```

Two things worth reading slowly:

- **`[name]: next`** is a *computed property key* (ES6, Day 04): the key is whatever string `name` holds at that moment. So `{ ...prev, [name]: next }` is "copy everything, overwrite the one field that changed" — the immutable update from Day 07, made generic.
- **`e.target instanceof HTMLInputElement && e.target.type === "checkbox"`** narrows the type: only an `<input>` has `.checked`. This is the same narrowing you did in Day 06 — TypeScript just wants proof.

> The weak spot: `name` is a plain `string`, so TypeScript can't tell you that `"emial"` isn't a field. That's an accepted trade-off for a one-handler form; the interface still guards every **read** (`values.emial` is an error). Typos in `name=""` are caught by your tests — and by the break-it exercise.

---

### 1.4 Validation Is a Pure Function

Don't scatter `if (!email.includes("@"))` through event handlers. Write one function that takes the values and **returns the errors**:

```ts
type Errors = Partial<Record<"name" | "email", string>>;

function validate(values: Values): Errors {
  const errors: Errors = {};

  if (values.name.trim().length < 2) errors.name = "Enter your name.";

  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Enter a valid email address.";

  return errors;
}

const hasErrors = (e: Errors) => Object.keys(e).length > 0;
```

It's pure (Day 03): same values in, same errors out, no React, no DOM — so you can test it with `node` before any form exists. And in the component you **derive** the errors; you never store them:

```tsx
const errors = validate(values);        // recomputed on every render, always correct
```

That's Day 07's rule — *if you can compute it, don't store it* — applied to forms. Errors that you stored would go stale the moment you forgot to update them.

#### When to *show* an error

Computing errors every render is free. **Showing** them instantly is rude: nobody wants "Enter a valid email" after typing one character. The pattern users like best:

| Moment | Show errors for… |
|---|---|
| Before the user has touched a field | nothing |
| After the user **leaves** a field (`onBlur`) | that field |
| After the user presses **Submit** | **every** field, and focus the first bad one |
| After that, while typing | the errors update live as they fix it |

So you need one more piece of state: *which fields has the user touched?*

```tsx
const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});

function handleBlur(e: FocusEvent<HTMLInputElement>) {
  const name = e.target.name as keyof Values;
  setTouched((prev) => ({ ...prev, [name]: true }));
}

// when rendering the field:
const showEmailError = touched.email && errors.email;
```

`touched` is real state (it's something the user *did*); `errors` and `showEmailError` are derived.

#### Native validation vs your own

HTML has built-in validation — `required`, `type="email"`, `minLength`, `min`, `max`, `pattern` — and the browser shows its own bubbles. It's fine for simple forms, but the messages and styling aren't yours. When you write your own messages, add **`noValidate`** to the `<form>` so the browser doesn't intercept the submit first. You can (and should) still keep `type="email"` and `required` on inputs — they give mobile users the right keyboard and screen readers the right hint.

> **Client-side validation is for the user's convenience, not for security.** Anyone can skip your React code and send a request straight to your API. The server must validate again — you'll do exactly that in Session 18 (Zod).

---

### 1.5 Submit — A Form Has More Than Two States

A submit isn't instant. Between "clicked" and "done" the form is *saving*, and the save can *fail*. Model it explicitly, like Day 06's `Result`:

| State | What the user sees |
|---|---|
| **idle** | the form, an enabled button |
| **submitting** | a disabled button saying "Saving…", fields untouched |
| **error** | the form **with their input still there**, and an error message |
| **success** | a redirect, or a confirmation |

```tsx
const [submitting, setSubmitting] = useState(false);
const [submitError, setSubmitError] = useState("");

async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
  e.preventDefault();
  if (submitting) return;                       // guard against a double-click

  setTouched({ name: true, email: true });       // reveal every error
  setSubmitError("");
  if (hasErrors(errors)) return;

  setSubmitting(true);
  try {
    await save(values);                          // the Promise from Day 05
    // success: navigate away, or show a message
  } catch (err) {
    setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    setSubmitting(false);                        // let them try again
  }
}

<button type="submit" disabled={submitting}>
  {submitting ? "Saving…" : "Create account"}
</button>
{submitError && <p role="alert">{submitError}</p>}
```

Four details that separate a real form from a demo:

1. **Disable the button *and* guard in the handler.** Disabling covers the mouse; the guard covers pressing Enter twice quickly.
2. **Never clear the fields on error.** Making someone retype a form because the server hiccupped is the fastest way to lose a user.
3. **On success, either leave the page (`navigate`) or reset** — don't leave a "saving" button spinning.
4. **`catch (err)` gives you `unknown`** (TypeScript 4.4+ default): narrow with `err instanceof Error`, exactly as in Day 06.

> This is `async`/`await` inside an event handler — Day 05 — and it needs **no** `useEffect`. A handler runs *because the user did something*, so it's the right place for the work. Effects are for work that must happen because the component *appeared* (Session 13).

---

### 1.6 Resetting a Form

Two ways:

**By hand** — put the values back:

```tsx
function handleReset() {
  setValues(INITIAL);
  setTouched({});
  setSubmitError("");
}
```

**With `key`** — tell React "this is a different form" and it throws the old one away, state and all:

```tsx
<TaskForm key={task.id} initial={task} … />
```

When `key` changes, React unmounts the old component and mounts a fresh one, so `useState(initial)` runs again with the new `initial`. This is the right fix whenever a form's **initial values depend on something that can change** — for example, an edit page that stays mounted while the route changes from `/tasks/1/edit` to `/tasks/2/edit`. Without a `key`, `useState(initial)` ignores the new `initial` (it only reads it on the first render) and the form keeps showing task 1's data.

> `useState(initial)` uses its argument **once**. If you ever find a form showing stale initial values, that's why — and `key` is the answer.

---

### 1.7 The Uncontrolled Alternative — `FormData`

Not every form needs state on every keystroke. If you only need the values **at submit time**, let the browser hold them and read them once:

```tsx
function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
  e.preventDefault();
  const data = new FormData(e.currentTarget);

  const title = data.get("title");                 // FormDataEntryValue | null  (string | File | null)
  const priority = data.get("priority");

  if (typeof title !== "string" || title.trim() === "") return;
  console.log({ title, priority });

  // or all at once:
  console.log(Object.fromEntries(data));           // { title: "…", priority: "high" }
}

<form onSubmit={handleSubmit}>
  <input name="title" defaultValue="" />
  <select name="priority" defaultValue="medium">…</select>
  <button type="submit">Add</button>
</form>
```

- Inputs use **`defaultValue`** (and `defaultChecked`), not `value` — React doesn't track them.
- `data.get()` returns `string | File | null`, so you **narrow** with `typeof` before using it.
- Only inputs with a **`name`** are included.

| Use controlled when… | Use `FormData` when… |
|---|---|
| you validate or format as the user types | you only need the values on submit |
| one field changes another (show/hide, live counter) | the form is short and static |
| you need to disable the button until valid | the form includes file inputs |
| you want to reset or pre-fill programmatically | |

Most forms in this course are controlled, because validation and pre-filling (an edit page) both need the values in state.

---

### 1.8 Accessible Forms — The Checklist

Forms are where accessibility mistakes hurt the most. Build every field like this:

| Rule | How |
|---|---|
| Every input has a **visible label** | `<label htmlFor={id}>` + `id` on the input. A `placeholder` is not a label — it vanishes on typing. |
| Unique ids that don't collide | `const id = useId();` then `` `${id}-title` `` — React 19 gives each component instance its own stable prefix. Never hard-code ids in a component you render twice. |
| Group related inputs | `<fieldset>` + `<legend>` for radio groups. |
| Mark invalid fields | `aria-invalid="true"` on the input |
| Connect the message to the field | `aria-describedby={errorId}` pointing at the error `<p id={errorId}>` |
| Announce submit-level errors | `role="alert"` on the message |
| Move focus to the problem | on a failed submit, `.focus()` the first `[aria-invalid="true"]` |
| Don't rely on colour alone | red text **and** words ("Enter a valid email"). |
| Say what's required | `required` attribute, plus words or an asterisk with a legend |

`aria-invalid={cond ? true : undefined}` — pass `undefined`, not `false`, to omit the attribute entirely when the field is fine.

```tsx
<label htmlFor={`${id}-email`}>Email</label>
<input
  id={`${id}-email`}
  name="email"
  value={values.email}
  onChange={handleChange}
  onBlur={handleBlur}
  aria-invalid={showEmailError ? true : undefined}
  aria-describedby={showEmailError ? `${id}-email-error` : undefined}
/>
{showEmailError && <p id={`${id}-email-error`} className="error">{errors.email}</p>}
```

---

### 1.9 Don't Reach for a Library Yet

React Hook Form, Formik, TanStack Form and Zod resolvers exist because big forms are tedious. Today you write the pieces by hand so you know what those libraries are doing for you: **values**, **touched**, **errors**, **submitting**. Everything they offer is a tidier way to manage those four things. In Session 18 you'll add a schema library (Zod) for *server*-side validation — and then it makes sense to share the same schema with the form.

---

## Build — Follow Along: Part 1

### Step 1 — Setup: Project and Node Check

```bash
node --version                      # must be 22.22 or newer for React Router 8
npm create vite@latest day-08-forms -- --template react-ts
cd day-08-forms
npm install
npm install react-router
npm run dev
```

Delete the starter exactly as in Day 07 (remove `App.css` and `src/assets/`, replace `App.tsx` with a one-line component, shrink `index.css` to a reset). Then add the Part 1 styles to `src/index.css`:

```css
body { font-family: system-ui, sans-serif; line-height: 1.5; margin: 0; padding: 1.5rem; }
form { display: grid; gap: 1rem; max-width: 420px; }
.field { display: grid; gap: 0.25rem; }
input:not([type="checkbox"]):not([type="radio"]), textarea, select { padding: 0.5rem; font: inherit; }
input[aria-invalid="true"], textarea[aria-invalid="true"] { border-color: #b3261e; outline-color: #b3261e; }
.error { color: #b3261e; margin: 0; font-size: 0.875rem; }
.hint { color: #666; margin: 0; font-size: 0.8rem; }
fieldset { border: 1px solid #ccc; border-radius: 6px; }
button { padding: 0.5rem 1rem; font: inherit; cursor: pointer; }
button:disabled { opacity: 0.6; cursor: wait; }
```

`react-router` is installed now but unused until Part 2 — check `npm ls react-router` shows `8.x`.

---

### Step 2 — `src/forms/Controls.tsx` — Every Input, Controlled

```tsx
import { useState } from "react";

export function Controls() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState("");
  const [color, setColor] = useState("teal");
  const [subscribed, setSubscribed] = useState(false);
  const [size, setSize] = useState("m");
  const [age, setAge] = useState("");            // a number input holds a STRING
  const [date, setDate] = useState("");

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label>
        Text <input value={text} onChange={(e) => setText(e.target.value)} />
      </label>

      <label>
        Notes <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
      </label>

      <label>
        Colour
        <select value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="teal">Teal</option>
          <option value="amber">Amber</option>
          <option value="rose">Rose</option>
        </select>
      </label>

      <label>
        <input type="checkbox" checked={subscribed} onChange={(e) => setSubscribed(e.target.checked)} />
        Subscribe
      </label>

      <fieldset>
        <legend>Size</legend>
        {["s", "m", "l"].map((s) => (
          <label key={s}>
            <input type="radio" name="size" value={s} checked={size === s} onChange={(e) => setSize(e.target.value)} />{" "}
            {s}
          </label>
        ))}
      </fieldset>

      <label>
        Age <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
      </label>

      <label>
        Date <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>

      <pre>{JSON.stringify({ text, notes, color, subscribed, size, age, date }, null, 2)}</pre>
    </form>
  );
}
```

Render it from `App` and use every control. The `<pre>` at the bottom is your debugging view: you'll watch every keystroke land in state. Wrapping an input **inside** its `<label>` is also a valid way to connect them — no `htmlFor` needed.

Break it, one at a time:

1. Delete `onChange` from the text input — it freezes, and React warns.
2. Change `useState("")` for `text` to `useState<string>()` — type, and read the "uncontrolled to controlled" warning.
3. Type `abc` into the number input — what does the browser allow, and what does `age` hold? Then type nothing and look at `age`: `""`. Run `Number("")` in the console.
4. Select **Rose**, then change the `value` on the select to `"purple"` — what does the select show?

---

### Step 3 — `src/forms/Signup.tsx` — One Handler, Validation, Touched

First the pure validation. `src/forms/validate.ts`:

```ts
export interface Values {
  name: string;
  email: string;
  password: string;
  role: string;
  agree: boolean;
}

export type Errors = Partial<Record<"name" | "email" | "password" | "agree", string>>;

export const INITIAL: Values = { name: "", email: "", password: "", role: "student", agree: false };

export function validate(values: Values): Errors {
  const errors: Errors = {};

  if (values.name.trim().length < 2) errors.name = "Enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Enter a valid email address.";

  if (values.password.length < 8) errors.password = "Use at least 8 characters.";
  else if (!/\d/.test(values.password)) errors.password = "Include at least one number.";

  if (!values.agree) errors.agree = "You need to accept the terms.";

  return errors;
}

export function hasErrors(errors: Errors): boolean {
  return Object.keys(errors).length > 0;
}
```

Prove it **before** a component exists, with a throwaway script (`node src/forms/validate.test-run.ts`):

```ts
import { INITIAL, hasErrors, validate } from "./validate.ts";

console.log(Object.keys(validate(INITIAL)).join(","));                       // name,email,password,agree
console.log(validate({ ...INITIAL, name: "Sara", email: "a@b.co", password: "abcdefg1", agree: true })); // {}
console.log(validate({ ...INITIAL, password: "abcdefgh" }).password);        // Include at least one number.
console.log(hasErrors({}));                                                  // false
```

Now `src/forms/Signup.tsx`:

```tsx
import { useId, useState } from "react";
import type { ChangeEvent, FocusEvent, SubmitEvent } from "react";
import { INITIAL, hasErrors, validate } from "./validate";
import type { Values } from "./validate";

type FieldName = keyof Values;

export function Signup() {
  const [values, setValues] = useState<Values>(INITIAL);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const id = useId();

  const errors = validate(values);                              // derived
  const show = (name: "name" | "email" | "password" | "agree") =>
    touched[name] ? errors[name] : undefined;

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    const next =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : value;
    setValues((prev) => ({ ...prev, [name]: next }));
  }

  function handleBlur(e: FocusEvent<HTMLInputElement>) {
    const name = e.target.name as FieldName;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, agree: true });
    if (hasErrors(errors)) {
      e.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    console.log("valid:", values);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor={`${id}-name`}>Name</label>
        <input
          id={`${id}-name`} name="name" value={values.name}
          onChange={handleChange} onBlur={handleBlur}
          aria-invalid={show("name") ? true : undefined}
          aria-describedby={show("name") ? `${id}-name-error` : undefined}
        />
        {show("name") && <p id={`${id}-name-error`} className="error">{show("name")}</p>}
      </div>

      <div className="field">
        <label htmlFor={`${id}-email`}>Email</label>
        <input
          id={`${id}-email`} name="email" type="email" value={values.email}
          onChange={handleChange} onBlur={handleBlur}
          aria-invalid={show("email") ? true : undefined}
          aria-describedby={show("email") ? `${id}-email-error` : undefined}
        />
        {show("email") && <p id={`${id}-email-error`} className="error">{show("email")}</p>}
      </div>

      <div className="field">
        <label htmlFor={`${id}-password`}>Password</label>
        <input
          id={`${id}-password`} name="password" type="password" value={values.password}
          onChange={handleChange} onBlur={handleBlur}
          aria-invalid={show("password") ? true : undefined}
          aria-describedby={show("password") ? `${id}-password-error` : undefined}
        />
        {show("password") && <p id={`${id}-password-error`} className="error">{show("password")}</p>}
      </div>

      <div className="field">
        <label htmlFor={`${id}-role`}>I am a…</label>
        <select id={`${id}-role`} name="role" value={values.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>

      <div className="field">
        <label>
          <input
            type="checkbox" name="agree" checked={values.agree}
            onChange={handleChange} onBlur={handleBlur}
            aria-invalid={show("agree") ? true : undefined}
          />{" "}
          I accept the terms
        </label>
        {show("agree") && <p className="error">{show("agree")}</p>}
      </div>

      <button type="submit">Create account</button>
    </form>
  );
}
```

> Read the three tiny repeated blocks: *label, input, error*. In Part 3 you'll see them again in `TaskForm`. In a bigger app that's a `TextField` component taking `label`, `name`, `error` — a natural refactor (bonus), but only after you've written it by hand three times.

Test it as a user:

1. Click into **Name**, then click away without typing — the error appears. Type one letter — it stays; type two — it vanishes.
2. Press **Create account** on the empty form — **every** error appears and focus jumps to **Name**.
3. Fill everything validly — the console prints the values.

Break it:

1. Remove `noValidate` — the browser's own bubble steals the submit for an invalid email.
2. Change `name="email"` on the email input to `name="emial"` — typing changes nothing visible, and `values` gains a stray `emial` key. (That's the weak spot from Section 1.3.)
3. Remove `e.preventDefault()` — the page reloads on submit.
4. Store the errors in `useState` instead of computing them, and update them only in `handleSubmit`. Fix a field and watch the old error stay.

---

### Step 4 — `src/forms/Saving.tsx` — Submitting, Error, Success

Add a fake server. `src/forms/fakeApi.ts`:

```ts
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Pretends to be a server: it's slow, and it rejects one specific title.
export async function pretendToSave(title: string): Promise<void> {
  await sleep(600);
  if (title.trim().toLowerCase() === "fail") {
    throw new Error("The server rejected this task. Try a different title.");
  }
}
```

Then a minimal form that models every state. `src/forms/Saving.tsx`:

```tsx
import { useState } from "react";
import type { SubmitEvent } from "react";
import { pretendToSave } from "./fakeApi";

export function Saving() {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<string[]>([]);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    if (title.trim() === "") return;

    setError("");
    setSubmitting(true);
    try {
      await pretendToSave(title);
      setSaved((prev) => [...prev, title.trim()]);
      setTitle("");                                  // success: clear the field
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);                          // runs on success AND failure
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title (type “fail” to see an error)</label>
      <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={submitting} />
      {error && <p role="alert" className="error">{error}</p>}
      <button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save"}</button>
      <ul>{saved.map((s, i) => <li key={i}>{s}</li>)}</ul>
    </form>
  );
}
```

`finally` is the Day 05 lesson: the button is re-enabled in **one** place, whichever way the save ended. Notice the error path **keeps the text** — only success clears it.

(`key={i}` here is the one place the index is fine: the list only ever grows and never reorders — you proved why that matters in Day 07.)

Do these four experiments and write one sentence about each in a comment:

1. Click **Save** twice quickly. How many items are saved? Remove `if (submitting) return;` **and** `disabled={submitting}` and try again.
2. Type `fail`. Does the text stay? Does the button come back?
3. Replace `finally` with `setSubmitting(false)` after the `try`/`catch` is gone — then throw inside `try` and watch the button stay disabled forever. (Restore `finally`.)
4. Rewrite the handler using `FormData` (Section 1.7) with an uncontrolled input. What did you gain? What can you no longer do (hint: clear the input on success — what changes?).

---

# Part 2 — Routing

## 2 — Concept (70 min)

### 2.1 What Routing Is — and Why It Isn't a Page Load

So far your app is one screen. Real apps have many: a list, a detail page, a form, a settings page. Each should have its **own URL** so that:

- the **back button** works,
- you can **bookmark or share** a link to exactly that screen,
- **refreshing** doesn't dump you back to the start.

The classic way is one HTML file per page: clicking a link makes the browser fetch a new page, and everything in memory — **including your React state** — is thrown away. A React app is a **single-page application (SPA)**: one HTML file, one JavaScript bundle, and the app changes the address bar and swaps the screen **without reloading**. The browser feature that makes it possible is the **History API** (`history.pushState`), and a **router** is the library that uses it for you:

```
click <Link to="/tasks/2">  →  router updates the URL (no reload)
                            →  router finds the matching <Route>
                            →  React renders that component
                            →  your state is still alive
```

The router's whole job is a table: **URL pattern → component**.

---

### 2.2 React Router — Setup

```bash
npm install react-router
```

The package is called **`react-router`** and everything imports from it. (Older tutorials install `react-router-dom` — that's the previous package name; v7 and later put the same things in `react-router`.)

Wrap your app **once**, in `main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

`BrowserRouter` watches the address bar and makes the current URL available to everything inside it.

> **Three ways to use React Router.** *Declarative* mode (what you're learning: `<BrowserRouter>`, `<Routes>`, `<Route>`), *Data* mode (`createBrowserRouter` — routes in a config object, with `loader`/`action` functions), and *Framework* mode (a Vite plugin that makes it a full-stack framework). They're additive. Declarative covers everything on this page; you'll use Data mode's loaders only if a later project needs them. Docs: reactrouter.com.

---

### 2.3 `Routes` and `Route`

```tsx
import { Route, Routes } from "react-router";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="tasks/new" element={<NewTask />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

- `<Routes>` looks at the URL and renders **the one best-matching** `<Route>` — most specific wins, so order doesn't matter.
- `path` is a pattern. `"about"` matches `/about`.
- `element` is **JSX** (`<About />`), not the component function.
- **`path="*"`** is a catch-all: it matches anything nothing else matched. That's your 404 page.

---

### 2.4 `Link` and `NavLink` — Never `<a href>` for Internal Pages

```tsx
import { Link, NavLink } from "react-router";

<Link to="/tasks/new">New task</Link>

<NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
  Tasks
</NavLink>
```

`<Link>` renders a real `<a>`, so it's keyboard-accessible, middle-clickable and right-clickable — but it **intercepts the click** and tells the router instead of reloading the page.

> **Try it on purpose:** change one `<Link to="/">` into `<a href="/">`. Click it. The page flashes and **all your state resets** — a full reload, because the browser did the navigation. You'll do this deliberately in the assignment. `<a href>` is for **external** sites only.

`NavLink` is `Link` that knows whether it points at the current page. It adds the class **`active`** automatically (style it with `a.active { … }`), or you can use the function form above. It also sets `aria-current="page"` for screen readers.

**Why `end`?** `NavLink to="/"` matches *every* URL that **starts with** `/` — so without `end`, the "Tasks" link is highlighted on *every page*. `end` means "only when the URL is exactly this." Use it on the home link (and on any link whose route has children).

---

### 2.5 Nested Routes, Layouts and `<Outlet />`

Most pages share chrome: a header, a nav, a footer. Don't repeat it in every page — make a **layout route**, a `<Route>` with **no `path`** that wraps its children:

```tsx
<Routes>
  <Route element={<Layout />}>
    <Route index element={<TaskListPage />} />
    <Route path="tasks/new" element={<NewTaskPage />} />
    <Route path="tasks/:id" element={<TaskDetailPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
</Routes>
```

And `Layout` marks where the page goes with `<Outlet />`:

```tsx
import { NavLink, Outlet } from "react-router";

export function Layout() {
  return (
    <div className="app">
      <header>
        <h1>Task Board</h1>
        <nav aria-label="Main">
          <NavLink to="/" end>Tasks</NavLink>
          <NavLink to="/tasks/new">New task</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />          {/* the matched child route renders here */}
      </main>
    </div>
  );
}
```

- A route with **no `path`** adds no segment to the URL — it only adds layout. (Give it a `path` and its children get that prefix: `<Route path="tasks">` then `path="new"` → `/tasks/new`.)
- **`index`** is the child that renders at the parent's own URL — "the default page".
- The layout **stays mounted** while the `<Outlet />` swaps pages. That has a big consequence — Section 2.9.

---

### 2.6 Dynamic Segments — `useParams`

A segment starting with `:` is a variable:

```tsx
<Route path="tasks/:id" element={<TaskDetailPage />} />
```

`/tasks/2` and `/tasks/99` both match. Read the value with `useParams`:

```tsx
import { useParams } from "react-router";

function TaskDetailPage() {
  const { id } = useParams();            // id: string | undefined
  const task = tasks.find((t) => t.id === Number(id));
  …
}
```

> **⚠️ `id` is a string — always.** The URL is text. And `useParams` types it `string | undefined`. So `t.id === id` (number vs string) is **never true** and your "task not found" shows for every task. Convert once: `Number(id)`. `Number("abc")` is `NaN`, and `tasks.find(… === NaN)` finds nothing — which is exactly what you want: **a URL you don't recognise must render a "not found" page, not crash.**

```tsx
if (!task) {
  return (
    <>
      <h2>Task not found</h2>
      <Link to="/">Back to the list</Link>
    </>
  );
}
```

A URL is **user input** — anyone can type `/tasks/banana`. Treat `useParams` like `JSON.parse` in Day 06: untrusted until checked.

---

### 2.7 Search Params — State That Lives in the URL

The part after `?` is the **query string**: `/?filter=open&q=read`. React Router wraps it in `useSearchParams`, which works like `useState`:

```tsx
import { useSearchParams } from "react-router";

const [searchParams, setSearchParams] = useSearchParams();

const raw = searchParams.get("filter");      // string | null  (null if absent)
```

Your Day 07 `filter` and `search` were `useState` — gone on refresh, impossible to share. Moving them into the URL fixes all three: **refresh keeps them, back/forward walk through them, and a link carries them.**

Because the URL is untrusted text, **narrow** what you read (the Day 06 type-guard idea):

```ts
const FILTERS: Filter[] = ["all", "open", "done"];

function parseFilter(raw: string | null): Filter {
  return FILTERS.find((f) => f === raw) ?? "all";   // "banana" → "all"
}
```

Updating uses the **function form**, which hands you the current params so you don't clobber the others:

```tsx
function update(name: "filter" | "q", value: string) {
  setSearchParams(
    (prev) => {
      const next = new URLSearchParams(prev);       // a copy — never mutate `prev`
      if (value === "" || value === "all") next.delete(name);   // keep the URL clean
      else next.set(name, value);
      return next;
    },
    { replace: true },
  );
}
```

`URLSearchParams` is the Day 06 class again. **`{ replace: true }`** replaces the current history entry instead of adding a new one — essential for *typing* in a search box, or the back button would step through every keystroke. For a filter *button* either is reasonable; for typing, always `replace`.

| Put it in the **URL** when… | Keep it in **state** when… |
|---|---|
| it changes **what the page shows** (filter, sort, page number, search) | it's momentary UI (a dropdown is open, a draft you haven't submitted) |
| someone might want to **link** to it | nobody would ever want to bookmark it |
| refresh should **keep** it | losing it on refresh is fine |

---

### 2.8 Navigating From Code — `useNavigate` and `<Navigate>`

Links are for the user to click. Sometimes **your code** decides to go somewhere — after a save, after a delete:

```tsx
import { useNavigate } from "react-router";

const navigate = useNavigate();

async function handleSubmit(values: TaskFormValues) {
  const task = await addTask(values);
  navigate(`/tasks/${task.id}`);          // go to the new task's page
}
```

- `navigate(path)` **pushes** a new history entry (Back returns to the form).
- `navigate(path, { replace: true })` **replaces** it (Back skips it). Use `replace` after a successful submit, so Back doesn't land on a form that has already done its job.
- `navigate(-1)` is the browser's Back button.

Call `navigate` from **handlers**, never straight in the component body.

For a redirect that is simply "this URL shouldn't exist, go there instead", render **`<Navigate>`**:

```tsx
<Route path="home" element={<Navigate to="/" replace />} />
```

> Prefer `<Link>` for anything the user clicks. `useNavigate` skips the real `<a>` — no right-click, no new tab, no accessibility benefit.

---

### 2.9 State Across Pages — The Layout Owns It

Here's the question the router creates. Your tasks live in `useState`. On the list page, `TaskListPage` shows them; on the detail page, `TaskDetailPage` shows one. **Where does `tasks` live?**

- In `TaskListPage`? Then navigating to `/tasks/2` **unmounts** the list page — and its state is destroyed. The detail page has nothing to show.
- In each page separately? Then they're different lists.

Route components **mount when their route matches and unmount when it doesn't.** So state that several pages share must live in a component that **stays mounted across all of them** — the layout route's component, which sits above the `<Outlet />`:

```tsx
export function Layout() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL);
  // … addTask, updateTask, toggleTask, removeTask …

  const context: BoardContext = { tasks, addTask, updateTask, toggleTask, removeTask };

  return (
    <div className="app">
      …
      <Outlet context={context} />        {/* hand the shared data to whichever page renders */}
    </div>
  );
}
```

Pages read it with `useOutletContext`. Wrap it once so every page doesn't repeat the generic:

```ts
// board-context.ts
import { useOutletContext } from "react-router";

export interface BoardContext {
  tasks: Task[];
  addTask: (values: TaskFormValues) => Promise<Task>;
  updateTask: (id: number, values: TaskFormValues) => Promise<void>;
  toggleTask: (id: number) => void;
  removeTask: (id: number) => void;
}

export function useBoard(): BoardContext {
  return useOutletContext<BoardContext>();
}
```

```tsx
const { tasks, toggleTask } = useBoard();     // any page
```

This is **lifting state up** (Day 07) with the router in the middle: the common parent of all pages is the layout. It works for one level of nesting and gets awkward beyond that — which is exactly what the **Context API** (Session 13) solves. For today, `useOutletContext` is the right tool.

> Note what **doesn't** survive a full page reload: the tasks. The list is in memory. Saving them across reloads needs `localStorage` or a server — Sessions 13–14. The **URL**, though, does survive — which is why `filter` and `q` moved there.

---

### 2.10 404s, and the "Refresh Gives a 404" Gotcha

**In-app 404:** the `path="*"` route renders for any URL nothing else matched. Make it helpful — say what happened and link home. Also handle the **data** 404: `/tasks/999` *matches* `tasks/:id` but no such task exists — that page must say "Task not found" itself (Section 2.6).

**Deployment 404:** the router runs *in the browser*. Open `https://yourapp.com/tasks/2` directly, or press refresh on it, and the **server** is asked for a file called `/tasks/2`. A plain static host doesn't have one and answers **404** — your app never even loads. Vite's dev server (`npm run dev`) and `npm run preview` fall back to `index.html` for you, which is why you won't see this locally. Production hosts need the same rule:

| Host | Fix |
|---|---|
| Netlify | a `public/_redirects` file containing `/*  /index.html  200` |
| Vercel | a `vercel.json` rewrite of all paths to `/index.html` |
| GitHub Pages | no rewrite support — copy `index.html` to `404.html`, or use `HashRouter` |
| Your own Express server (Session 15) | a catch-all route that sends `index.html` |

If the app is served from a **sub-path** (GitHub Pages project sites live at `/repo-name/`), tell the router: `<BrowserRouter basename="/repo-name">` and set `base: "/repo-name/"` in `vite.config.ts`. You'll deal with all of this properly in Session 23 (deployment) — today, just know it exists so it doesn't surprise you.

---

## Build — Follow Along: Part 2

### Step 5 — `src/routing/` — Three Pages and a Nav

Create a small routing lab inside the `day-08-forms` project. `src/routing/pages.tsx`:

```tsx
import { Link, NavLink, Outlet, useParams } from "react-router";

export function Shell() {
  return (
    <div>
      <nav aria-label="Lab">
        <NavLink to="/" end>Home</NavLink>{" "}
        <NavLink to="/about">About</NavLink>{" "}
        <NavLink to="/lessons">Lessons</NavLink>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

export const Home = () => <h2>Home</h2>;
export const About = () => <h2>About</h2>;

export function Lessons() {
  return (
    <>
      <h2>Lessons</h2>
      <ul>
        {[1, 2, 3].map((n) => (
          <li key={n}><Link to={`/lessons/${n}`}>Lesson {n}</Link></li>
        ))}
      </ul>
    </>
  );
}

export function Lesson() {
  const { n } = useParams();
  return (
    <>
      <h2>Lesson {n}</h2>
      <p>typeof n → {typeof n}</p>
      <Link to="/lessons">Back</Link>
    </>
  );
}

export const NotFound = () => <h2>404 — nothing here</h2>;
```

`src/App.tsx`:

```tsx
import { Navigate, Route, Routes } from "react-router";
import { About, Home, Lesson, Lessons, NotFound, Shell } from "./routing/pages";

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="lessons" element={<Lessons />} />
        <Route path="lessons/:n" element={<Lesson />} />
        <Route path="old-about" element={<Navigate to="/about" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
```

Make sure `main.tsx` wraps `<App />` in `<BrowserRouter>` (Section 2.2). Then test it as a user:

1. Click through every link. Watch the address bar change **without a page flash**. Use Back and Forward.
2. Type `/lessons/2` in the address bar and press Enter — it loads directly (dev server fallback).
3. Visit `/nope` → the 404. Visit `/old-about` → it lands on `/about`, and **Back doesn't return to `/old-about`** (that's `replace`).
4. Look at the `typeof n` line — it says `string`.

Break it:

1. Remove `end` from the Home `NavLink` — Home is highlighted on every page.
2. Replace one `<Link to="/about">` with `<a href="/about">` — the page reloads (watch the Network tab).
3. Move `path="*"` to be the **first** route. It still works only for unmatched URLs — React Router ranks by specificity, not order. (Contrast with Express in Session 15, where order **does** matter.)
4. Visit `/lessons/abc`. It renders "Lesson abc" — **a bad URL still matched.** What would you have to add to treat it as "not found"? (You'll need the answer for the assignment's Country Explorer — `/countries/XX`.)

---

### Step 6 — Search Params: A Filter in the URL

Add to the routing lab: `src/routing/Fruit.tsx`:

```tsx
import { useSearchParams } from "react-router";

const FRUIT = ["apple", "apricot", "banana", "blueberry", "cherry", "date"];
const SORTS = ["asc", "desc"] as const;
type Sort = (typeof SORTS)[number];

function parseSort(raw: string | null): Sort {
  return SORTS.find((s) => s === raw) ?? "asc";
}

export function Fruit() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const sort = parseSort(params.get("sort"));

  function update(name: string, value: string, replace: boolean) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === "") next.delete(name);
        else next.set(name, value);
        return next;
      },
      { replace },
    );
  }

  const shown = FRUIT.filter((f) => f.includes(q.toLowerCase())).sort((a, b) =>
    sort === "asc" ? a.localeCompare(b) : b.localeCompare(a),
  );

  return (
    <>
      <input value={q} onChange={(e) => update("q", e.target.value, true)} aria-label="Search" />
      <button onClick={() => update("sort", sort === "asc" ? "desc" : "asc", false)}>
        Sort: {sort}
      </button>
      <ul>{shown.map((f) => <li key={f}>{f}</li>)}</ul>
    </>
  );
}
```

Add `<Route path="fruit" element={<Fruit />} />` and a nav link. Notice `FRUIT.filter(…).sort(…)` — `filter` returns a **new** array, so `.sort` mutating it is safe here (the Day 07 rule is about not mutating *state*; this array is brand-new and local).

Test it:

1. Type `a` in the search box — look at the URL. Refresh — the box and the list keep their values.
2. Click **Sort** twice, then press Back — the sort steps back. Type three letters, then press Back — it goes to the **previous page**, not the previous letter (that's `replace: true`).
3. Copy the URL, paste it into a private window. Same view.
4. Edit the URL to `?sort=banana` — it falls back to `asc`.

Break it: change `{ replace }` for the search box to `{ replace: false }` and type "apple", then press Back five times.

---

### Step 7 — A Layout With Shared State

Prove Section 2.9 with the smallest possible app. `src/routing/Shared.tsx`:

```tsx
import { useState } from "react";
import { Link, Outlet, useOutletContext } from "react-router";

interface Shared {
  count: number;
  increment: () => void;
}

export function SharedLayout() {
  const [count, setCount] = useState(0);
  const context: Shared = { count, increment: () => setCount((c) => c + 1) };

  return (
    <>
      <nav>
        <Link to="/shared">Page A</Link> <Link to="/shared/b">Page B</Link>
      </nav>
      <p>Layout says: {count}</p>
      <Outlet context={context} />
    </>
  );
}

export function PageA() {
  const { count, increment } = useOutletContext<Shared>();
  return <button onClick={increment}>A: {count}</button>;
}

export function PageB() {
  const { count } = useOutletContext<Shared>();
  const [local, setLocal] = useState(0);
  return (
    <>
      <p>B sees: {count}</p>
      <button onClick={() => setLocal((n) => n + 1)}>local: {local}</button>
    </>
  );
}
```

Routes:

```tsx
<Route path="shared" element={<SharedLayout />}>
  <Route index element={<PageA />} />
  <Route path="b" element={<PageB />} />
</Route>
```

Click **A** a few times, go to **B** — it sees the same count. Increase B's **local** counter, go to A, come back — **local is back to 0**: `PageB` unmounted, so its state died. The layout's count survived. That one experiment is the whole of Section 2.9.

---

### Step 8 — Redirect After a Save

Combine Part 1 and Part 2 in one tiny flow. Add to the lab a `/saving` route that renders your `Saving` form from Step 4, but whose handler, after a successful save, calls `navigate("/lessons", { replace: true })`. Test:

1. Save "hello" → you land on `/lessons`.
2. Press Back → you do **not** return to the form with a stale "saving" state (that's `replace`).
3. Change `replace: true` to `false`, repeat — now Back returns to the form.

This is the exact shape of Task Board v2's "add a task, then show it".

---

# Part 3 — Project: Task Board v2

## 3 — Concept (30 min)

### 3.1 Plan Before You Type

Day 07 taught *state table first*. A routed app adds one more table — **which URL shows what**:

**1. The route table**

| URL | Page | Notes |
|---|---|---|
| `/` | `TaskListPage` | filter and search live in `?filter=&q=` |
| `/tasks/new` | `NewTaskPage` | the form, empty |
| `/tasks/:id` | `TaskDetailPage` | read-only view, Edit and Delete |
| `/tasks/:id/edit` | `EditTaskPage` | the same form, pre-filled |
| anything else | `NotFoundPage` | |

**2. The tree**

```
BrowserRouter (main.tsx)
└── Routes (App.tsx)
    └── Layout                    ← owns `tasks`, renders header + nav + <Outlet context>
        ├── TaskListPage
        ├── NewTaskPage     ┐
        ├── EditTaskPage    ┴──→ TaskForm  (one form, two jobs)
        ├── TaskDetailPage
        └── NotFoundPage
```

**3. The state table**

| Data | State or derived? | Lives in |
|---|---|---|
| `tasks` | **state** | `Layout` — it must outlive every page |
| `filter`, `q` | **state — in the URL** | `useSearchParams` in `TaskListPage` |
| the form's `values` | **state** | `TaskForm` |
| which fields were `touched` | **state** | `TaskForm` |
| `submitting`, `submitError` | **state** | `TaskForm` |
| `errors` | **derived** | `validateTask(values)` every render |
| visible tasks | **derived** | `tasks` + `filter` + `q` |
| the current task on a detail/edit page | **derived** | `tasks.find(… === Number(id))` |

Fill this in **before** Step 9.

---

### 3.2 One Form, Two Jobs

Creating and editing a task use the same fields, the same validation, the same messages. Write **one** `TaskForm` and give it everything that differs as props:

```tsx
interface TaskFormProps {
  initial: TaskFormValues;                       // empty for create, the task for edit
  submitLabel: string;                           // "Add task" / "Save changes"
  checkPast: boolean;                            // a new task can't be due yesterday; an old one can stay overdue
  onSubmit: (values: TaskFormValues) => Promise<void>;
}
```

The **form** owns values, touched and submit state. The **page** owns what happens next (`addTask` then `navigate`). That split is why the form is reusable.

For the edit page, give the form a `key` so switching between tasks never shows the wrong data (Section 1.6) — or make sure the page re-mounts the form when `id` changes:

```tsx
<TaskForm key={task.id} initial={task} … />
```

---

### 3.3 The Types and the Pure Parts

```ts
// types.ts
export type Priority = "low" | "medium" | "high";
export type Filter = "all" | "open" | "done";

export interface TaskFormValues {
  title: string;
  priority: Priority;
  dueDate: string;        // "YYYY-MM-DD", or "" for none
  notes: string;
  done: boolean;
}

export interface Task extends TaskFormValues {
  readonly id: number;
}
```

`Task extends TaskFormValues` — a `Task` is "what the form edits, plus an id the server assigns" (Day 06 interfaces). Validation stays pure and testable:

```ts
// validate.ts
import type { TaskFormValues } from "./types";

export type TaskErrors = Partial<Record<"title" | "dueDate" | "notes", string>>;

export const EMPTY_VALUES: TaskFormValues = {
  title: "", priority: "medium", dueDate: "", notes: "", done: false,
};

// Today as "YYYY-MM-DD" in the user's own time zone (the "en-CA" locale prints it that way)
export function todayISO(): string {
  return new Date().toLocaleDateString("en-CA");
}

export function validateTask(values: TaskFormValues, checkPast: boolean): TaskErrors {
  const errors: TaskErrors = {};
  const title = values.title.trim();

  if (title === "") errors.title = "Give the task a title.";
  else if (title.length < 3) errors.title = "Use at least 3 characters.";
  else if (title.length > 80) errors.title = "Keep it under 80 characters.";

  // "YYYY-MM-DD" strings sort the same way dates do, so < works
  if (checkPast && values.dueDate !== "" && values.dueDate < todayISO()) {
    errors.dueDate = "The due date can't be in the past.";
  }

  if (values.notes.length > 200) errors.notes = "Notes are limited to 200 characters.";

  return errors;
}

export function hasErrors(errors: TaskErrors): boolean {
  return Object.keys(errors).length > 0;
}
```

Why `"en-CA"`? It's the one common locale that prints dates as `YYYY-MM-DD`, in **local** time. (`toISOString()` is UTC — near midnight it can be *yesterday* in Cairo.) And why compare strings with `<`? Because `"2027-01-15" < "2027-02-01"` is true — ISO dates sort alphabetically like they do chronologically. Both are the kind of small knowledge that saves an afternoon.

---

## Build — Follow Along: Part 3

### Step 9 — Project, Types, Validation, Fake API

Start from your Day 07 `task-board/` (copy it to `task-board-v2/`) **or** a fresh Vite project, then:

```bash
npm install react-router
```

Create the structure:

```
src/
├── main.tsx            ← <BrowserRouter>
├── App.tsx             ← <Routes>
├── Layout.tsx          ← owns tasks; <Outlet context>
├── board-context.ts    ← BoardContext + useBoard()
├── types.ts
├── validate.ts
├── fakeApi.ts          ← sleep, pretendToSave (Step 4)
├── components/
│   └── TaskForm.tsx
└── pages/
    ├── TaskListPage.tsx
    ├── NewTaskPage.tsx
    ├── TaskDetailPage.tsx
    ├── EditTaskPage.tsx
    └── NotFoundPage.tsx
```

Write `types.ts`, `validate.ts` and `fakeApi.ts` first, then prove `validateTask` with a throwaway script before any component exists:

```ts
// src/validate.test-run.ts   —   node src/validate.test-run.ts
import { EMPTY_VALUES, hasErrors, validateTask } from "./validate.ts";

console.log(validateTask(EMPTY_VALUES, true).title);                                    // Give the task a title.
console.log(validateTask({ ...EMPTY_VALUES, title: "ab" }, true).title);                // Use at least 3 characters.
console.log(hasErrors(validateTask({ ...EMPTY_VALUES, title: "Read" }, true)));         // false
console.log(validateTask({ ...EMPTY_VALUES, title: "Read", dueDate: "2001-01-01" }, true).dueDate); // The due date can't be in the past.
console.log(validateTask({ ...EMPTY_VALUES, title: "Read", dueDate: "2001-01-01" }, false).dueDate); // undefined
console.log(validateTask({ ...EMPTY_VALUES, title: "Read", notes: "x".repeat(201) }, true).notes);   // Notes are limited to 200 characters.
```

---

### Step 10 — `Layout`, the Context, and the Pages

`board-context.ts` is the code from Section 2.9. `Layout.tsx` owns the tasks and the five handlers:

```tsx
import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { pretendToSave } from "./fakeApi";
import type { BoardContext } from "./board-context";
import type { Task, TaskFormValues } from "./types";

const INITIAL: Task[] = [
  { id: 1, title: "Read the Day 08 README", done: true, priority: "high", dueDate: "", notes: "" },
  { id: 2, title: "Build the task form", done: false, priority: "high", dueDate: "2027-01-15", notes: "Validation on blur and on submit." },
  { id: 3, title: "Add the routes", done: false, priority: "medium", dueDate: "", notes: "" },
];

export function Layout() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL);

  async function addTask(values: TaskFormValues): Promise<Task> {
    await pretendToSave(values.title);            // may throw — the form catches it
    const task: Task = { ...values, id: tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1 };
    setTasks((prev) => [...prev, task]);
    return task;
  }

  async function updateTask(id: number, values: TaskFormValues): Promise<void> {
    await pretendToSave(values.title);
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...values, id } : t)));
  }

  function toggleTask(id: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const context: BoardContext = { tasks, addTask, updateTask, toggleTask, removeTask };

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
        <Outlet context={context} />
      </main>
    </div>
  );
}
```

> One honest wrinkle: `addTask` computes the new id from the `tasks` of **this render** (`tasks.reduce(…)`), because it needs the id **before** `setTasks` runs so it can return the task. That's safe here — the user can't click "Add" twice (the button is disabled while saving). If two adds could race you'd move the id to the server, which is what a real API does in Session 16.

The pages — read each and notice how little they do:

```tsx
// pages/NewTaskPage.tsx
import { useNavigate } from "react-router";
import { TaskForm } from "../components/TaskForm";
import { useBoard } from "../board-context";
import { EMPTY_VALUES } from "../validate";

export function NewTaskPage() {
  const { addTask } = useBoard();
  const navigate = useNavigate();

  return (
    <>
      <h2>New task</h2>
      <TaskForm
        initial={EMPTY_VALUES}
        submitLabel="Add task"
        checkPast
        onSubmit={async (values) => {
          const task = await addTask(values);
          navigate(`/tasks/${task.id}`, { replace: true });
        }}
      />
    </>
  );
}
```

```tsx
// pages/EditTaskPage.tsx
import { Link, useNavigate, useParams } from "react-router";
import { TaskForm } from "../components/TaskForm";
import { useBoard } from "../board-context";

export function EditTaskPage() {
  const { id } = useParams();
  const { tasks, updateTask } = useBoard();
  const navigate = useNavigate();

  const task = tasks.find((t) => t.id === Number(id));
  if (!task) return <p>Task not found. <Link to="/">Back to the list</Link></p>;

  return (
    <>
      <h2>Edit task</h2>
      <TaskForm
        key={task.id}
        initial={task}
        submitLabel="Save changes"
        checkPast={false}
        onSubmit={async (values) => {
          await updateTask(task.id, values);
          navigate(`/tasks/${task.id}`, { replace: true });
        }}
      />
    </>
  );
}
```

```tsx
// pages/TaskDetailPage.tsx
import { Link, useNavigate, useParams } from "react-router";
import { useBoard } from "../board-context";

export function TaskDetailPage() {
  const { id } = useParams();
  const { tasks, removeTask } = useBoard();
  const navigate = useNavigate();

  const task = tasks.find((t) => t.id === Number(id));

  if (!task) {
    return (
      <>
        <h2>Task not found</h2>
        <p>There's no task with id “{id}”.</p>
        <Link to="/">Back to the list</Link>
      </>
    );
  }

  return (
    <article>
      <h2>{task.title}</h2>
      <p>Priority: {task.priority} · {task.done ? "done" : "open"}</p>
      {task.dueDate && <p>Due: {task.dueDate}</p>}
      {task.notes && <p>{task.notes}</p>}
      <Link to={`/tasks/${task.id}/edit`}>Edit</Link>{" "}
      <button
        onClick={() => {
          removeTask(task.id);
          navigate("/");
        }}
      >
        Delete
      </button>
    </article>
  );
}
```

```tsx
// pages/NotFoundPage.tsx
import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <>
      <h2>404 — page not found</h2>
      <Link to="/">Go to the task list</Link>
    </>
  );
}
```

And `TaskListPage` — the filter and search live in the URL (Section 2.7):

```tsx
import { Link, useSearchParams } from "react-router";
import { useBoard } from "../board-context";
import type { Filter, Task } from "../types";

const FILTERS: Filter[] = ["all", "open", "done"];

// Anything in the URL is untrusted text — narrow it to a real Filter
function parseFilter(raw: string | null): Filter {
  return FILTERS.find((f) => f === raw) ?? "all";
}

function matches(task: Task, filter: Filter, q: string): boolean {
  const okFilter = filter === "all" || (filter === "done" ? task.done : !task.done);
  const okSearch = q === "" || task.title.toLowerCase().includes(q.toLowerCase());
  return okFilter && okSearch;
}

export function TaskListPage() {
  const { tasks, toggleTask, removeTask } = useBoard();
  const [searchParams, setSearchParams] = useSearchParams();

  const filter = parseFilter(searchParams.get("filter"));
  const q = searchParams.get("q") ?? "";
  const visible = tasks.filter((t) => matches(t, filter, q));

  function update(name: "filter" | "q", value: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === "" || value === "all") next.delete(name);
        else next.set(name, value);
        return next;
      },
      { replace: true },
    );
  }

  return (
    <>
      <div className="filter-bar">
        <div role="group" aria-label="Filter tasks">
          {FILTERS.map((f) => (
            <button key={f} aria-pressed={filter === f} onClick={() => update("filter", f)}>
              {f}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => update("q", e.target.value)}
          placeholder="Search…"
          aria-label="Search tasks"
        />
      </div>

      {visible.length === 0 ? (
        <p className="empty">{tasks.length === 0 ? "No tasks yet." : "No tasks match."}</p>
      ) : (
        <ul className="task-list">
          {visible.map((task) => (
            <li key={task.id} className={task.done ? "task done" : "task"}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                aria-label={`Mark "${task.title}" as done`}
              />{" "}
              <Link to={`/tasks/${task.id}`}>{task.title}</Link>
              <button onClick={() => removeTask(task.id)} aria-label={`Remove "${task.title}"`}>×</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
```

Finally `App.tsx` is the whole route table (Section 2.5), and `main.tsx` is Section 2.2's.

---

### Step 11 — `TaskForm`, Then Run, Break, Ship

The form is Part 1 in one component. Read it as four stacked ideas — values, touched, derived errors, submit state:

```tsx
import { useId, useState } from "react";
import type { ChangeEvent, FocusEvent, SubmitEvent } from "react";
import type { Priority, TaskFormValues } from "../types";
import { hasErrors, validateTask } from "../validate";

type FieldName = keyof TaskFormValues;
type ErrorField = "title" | "dueDate" | "notes";

interface TaskFormProps {
  initial: TaskFormValues;
  submitLabel: string;
  checkPast: boolean;
  onSubmit: (values: TaskFormValues) => Promise<void>;
}

const PRIORITIES: Priority[] = ["low", "medium", "high"];

export function TaskForm({ initial, submitLabel, checkPast, onSubmit }: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(initial);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const id = useId();

  // Derived, never stored: recomputed on every render
  const errors = validateTask(values, checkPast);
  const shown = (name: ErrorField) => (touched[name] ? errors[name] : undefined);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    const next = e.target instanceof HTMLInputElement && e.target.type === "checkbox"
      ? e.target.checked
      : value;
    setValues((prev) => ({ ...prev, [name]: next }));
  }

  function handleBlur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = e.target.name as FieldName;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setTouched({ title: true, dueDate: true, notes: true });
    setSubmitError("");

    if (hasErrors(errors)) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ ...values, title: values.title.trim() });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={submitting}>
      <div className="field">
        <label htmlFor={`${id}-title`}>Title</label>
        <input
          id={`${id}-title`}
          name="title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={shown("title") ? true : undefined}
          aria-describedby={shown("title") ? `${id}-title-error` : undefined}
        />
        {shown("title") && (
          <p id={`${id}-title-error`} className="error">{shown("title")}</p>
        )}
      </div>

      <fieldset>
        <legend>Priority</legend>
        {PRIORITIES.map((p) => (
          <label key={p}>
            <input
              type="radio"
              name="priority"
              value={p}
              checked={values.priority === p}
              onChange={handleChange}
            />{" "}
            {p}
          </label>
        ))}
      </fieldset>

      <div className="field">
        <label htmlFor={`${id}-due`}>Due date (optional)</label>
        <input
          id={`${id}-due`}
          type="date"
          name="dueDate"
          value={values.dueDate}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={shown("dueDate") ? true : undefined}
          aria-describedby={shown("dueDate") ? `${id}-due-error` : undefined}
        />
        {shown("dueDate") && (
          <p id={`${id}-due-error`} className="error">{shown("dueDate")}</p>
        )}
      </div>

      <div className="field">
        <label htmlFor={`${id}-notes`}>Notes</label>
        <textarea
          id={`${id}-notes`}
          name="notes"
          rows={4}
          value={values.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={shown("notes") ? true : undefined}
          aria-describedby={`${id}-notes-count`}
        />
        <p id={`${id}-notes-count`} className="hint">{values.notes.length} / 200</p>
        {shown("notes") && <p className="error">{shown("notes")}</p>}
      </div>

      <label>
        <input type="checkbox" name="done" checked={values.done} onChange={handleChange} /> Already done
      </label>

      {submitError && <p role="alert" className="error">{submitError}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
```

Three details worth stopping at:

- **On success the form never calls `setSubmitting(false)`.** The page navigates away and the form unmounts, so there's nothing to re-enable. Only the **error** path resets it.
- `onSubmit` is `async` and **throws** to signal failure — the page's `addTask` throws, and the form's `catch` turns that into `submitError`. The form doesn't know *why* it failed; it only knows *that* it did.
- **`useId`** keeps the ids unique even if two `TaskForm`s were ever on screen at once.

#### Check it

```bash
node src/validate.test-run.ts                 # the six lines from Step 9
npx tsc --noEmit -p tsconfig.app.json         # zero type errors
npm run lint                                  # zero warnings
npm run build                                 # production build succeeds
npm run dev
```

Then use it like a user would:

1. Add a task with an empty title — errors appear, focus jumps to Title.
2. Add one called `fail` — the server error shows, the typed text is still there, the button comes back.
3. Add a valid one — you land on its detail page; Back does **not** return to the form.
4. Edit it, change the priority, save. Edit again with a title of `fail`.
5. On the list page: filter to **open**, type a search, **refresh** the page — both survive. Copy the URL into a private window.
6. Visit `/tasks/999` and `/nope`.

#### Break it on purpose

Break each, read the symptom, fix it. Document them in the assignment.

1. **`<a href>` instead of `<Link>`** — change the "New task" link in the nav. Add a task, then click it: the page reloads and **every task you added is gone**.
2. **Comparing the param without converting** — `tasks.find((t) => t.id === id)` in `TaskDetailPage`. Every task is "not found". Fix with `Number(id)`.
3. **No double-submit guard** — remove `disabled={submitting}`, double-click **Add task**. Two copies (or a duplicate id) appear. Fix it.
4. **`NavLink` without `end`** on the Tasks link — it's highlighted on every page. Fix with `end`.

#### Ship it

On a branch (`feature/day-08`): commit the labs and the board separately, push, open a PR, merge it — the Day 05 workflow.

---

## What's Next

Right now your tasks vanish on refresh, and the "server" is a function that sleeps. Both need code that runs **when a component appears** — loading from the Day 06 API, saving to `localStorage`, setting a timer. That is **`useEffect`**, plus **Context** so you stop threading `useOutletContext` through everything. Session 13: **State management — `useState`/`useEffect` and the Context API.**

---

## Day 08 Files

- [README.md](README.md) — this guide
- [ASSIGNMENT.md](ASSIGNMENT.md) — Day 08 assignment

← Back to [Day 07 — React Intro: Components, Props, State & JSX](../Day-07-React-Intro/README.md)
