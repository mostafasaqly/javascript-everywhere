# Day 01 — Dev Environment Setup

**Track 1: JS/TS Foundations + Web Basics · Session 1 of 52 · 3 hours**

> Before we write a single line of JavaScript, we build the workshop.
> By the end of this session your machine can run JS, version it with Git, and publish it to GitHub.

**Why this session matters:** Session 2 is **JS Fundamentals** — variables, data types, conditionals, loops. It assumes everything above already works.

---

## What You'll Have by the End

- [ ] Node.js + npm installed and verified from the terminal
- [ ] VS Code installed with the extension set we'll use all 26 weeks
- [ ] Git installed and configured with your name and email
- [ ] A GitHub account connected to your machine
- [ ] Your first repo — created, committed, and pushed
- [ ] Your first JavaScript file, running in two places: Node and the browser

---

## Part 1 — Concept (45 min)

### 1.1 What Actually Runs JavaScript

JavaScript doesn't run by itself. It needs an **engine**.

| Where | Engine | What it's for |
|---|---|---|
| Chrome / Edge | V8 | Web pages — the DOM, clicks, forms |
| Firefox | SpiderMonkey | Same, different browser |
| Your terminal | V8, wrapped in **Node.js** | Files, servers, scripts, tooling |

**The key idea of this whole series:** it's the *same language* in both places. What changes is what the environment hands you. The browser gives you `document` and `window`. Node gives you the file system and the network. Learn the language once — use it in seven directions.

### 1.2 What Node.js and npm Really Are

- **Node.js** — Chrome's V8 engine pulled out of the browser and given access to your computer.
- **npm** — the package manager that ships with Node. It downloads code other people wrote so you don't rewrite it.

### 1.3 Why Git Exists

Git answers three questions every developer asks daily:

1. What did I change?
2. How do I go back to when it worked?
3. How do two people edit the same file without destroying each other's work?

**Git** is the tool on your machine. **GitHub** is the website that hosts a copy online. They're not the same thing.

---

## Part 2 — Build (Follow Along, ~90 min)

### Step 1 — Install Node.js

1. Go to **[nodejs.org](https://nodejs.org)**.
2. Download the **LTS** version (Long Term Support — the stable one, not "Current").
3. Run the installer. Accept every default.
4. **Close and reopen your terminal** — this matters, the installer only updates the PATH for new terminals.

Verify:

```bash
node --version
npm --version
```

You should see two version numbers. `node` should be **v20** or higher.

> **If you get "command not found":** you skipped step 4. Close every terminal window and open a fresh one.

---

### Step 2 — Install VS Code

1. Go to **[code.visualstudio.com](https://code.visualstudio.com)** and download it.
2. On Windows, during install, **check "Add to PATH"** and both "Open with Code" context-menu options.
3. Verify from a new terminal:

```bash
code --version
```

---

### Step 3 — Install the Extensions

Open VS Code → Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X`) → search each by name and install:

| Extension | Why we need it |
|---|---|
| **Prettier — Code formatter** | Formats your code automatically, ends all style arguments |
| **ESLint** | Catches bugs and bad patterns while you type |
| **Live Server** | Right-click an HTML file → opens it in the browser with auto-reload |
| **Error Lens** | Shows the error *on the line*, instead of hidden in a panel |
| **GitLens** | Shows who changed each line and when |
| **Path Intellisense** | Autocompletes file paths in imports |

**Turn on format-on-save** — do this now, once, and never think about formatting again:

1. `Ctrl+,` / `Cmd+,` to open Settings
2. Search `format on save` → tick the checkbox
3. Search `default formatter` → choose **Prettier**

---

### Step 4 — Install and Configure Git

**Windows:** download from **[git-scm.com](https://git-scm.com)**, run the installer, accept defaults.
**Mac:** run `git --version` — macOS offers to install it for you. Or use `brew install git`.
**Linux:** `sudo apt install git`

Verify, then tell Git who you are — this name and email get stamped on every commit you ever make:

```bash
git --version

git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
```

Check it took:

```bash
git config --global --list
```

> Use the **same email** as your GitHub account, or your commits won't link to your profile.

---

### Step 5 — Create Your GitHub Account

1. Sign up at **[github.com/signup](https://github.com/signup)**.
2. Pick a username you'd put on a CV — this becomes your professional identity.
3. Verify your email address.
4. Add a real profile photo and your full name.

---

### Step 6 — Your First Project Folder

```bash
mkdir javascript-everywhere
cd javascript-everywhere
code .
```

That last command opens the folder in VS Code. Now create a file — in VS Code, click **New File** and name it `hello.js`:

```js
// hello.js
const name = "JavaScript Everywhere";

function greet(who) {
  return `Hello from ${who}!`;
}

console.log(greet(name));
console.log("Node version:", process.version);
```

Run it in the terminal (open VS Code's built-in terminal with **Ctrl + `** — the backtick key, top-left of your keyboard):

```bash
node hello.js
```

**You just ran JavaScript outside a browser.** That's Track 1 through 7 in one command.

---

### Step 7 — The Same Language, in the Browser

Create `index.html` in the same folder:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JavaScript Everywhere — Day 01</title>
  </head>
  <body>
    <h1 id="title">Loading...</h1>
    <button id="btn">Click me</button>

    <script src="app.js"></script>
  </body>
</html>
```

And `app.js`:

```js
// app.js
const title = document.getElementById("title");
const btn = document.getElementById("btn");

title.textContent = "Hello from the browser!";

let count = 0;
btn.addEventListener("click", () => {
  count = count + 1;
  title.textContent = `You clicked ${count} time(s)`;
});
```

Right-click `index.html` → **Open with Live Server**.

Now open the browser DevTools (`F12`) → **Console** tab. That console is the same idea as your terminal — it's just V8 in a different room.

> **Notice:** `app.js` uses `document`. `hello.js` uses `process`. Same language, different environment. That distinction is the entire premise of this series.

---

### Step 8 — Initialize Git and Make Your First Commit

Back in the terminal, inside your project folder:

```bash
git init
git status
```

`git status` shows untracked files — Git sees them but isn't watching them yet.

```bash
git add .
git commit -m "Day 01: dev environment setup"
```

See your history:

```bash
git log --oneline
```

---

### Step 9 — Push It to GitHub

1. On GitHub, click **+** (top right) → **New repository**.
2. Name it `javascript-everywhere`.
3. Set it **Public**.
4. **Do not** tick "Add a README" — your folder already has files.
5. Click **Create repository**.

GitHub shows you commands. Use these:

```bash
git remote add origin https://github.com/YOUR-USERNAME/javascript-everywhere.git
git branch -M main
git push -u origin main
```

Refresh the GitHub page. **Your code is online.**

> **On the password prompt:** GitHub does not accept your account password. Generate a **Personal Access Token** at Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → tick the `repo` scope. Paste the token as the password.

---

## Part 3 — The Commands You'll Use Every Session

Keep this table open until it's muscle memory.

| Command | What it does |
|---|---|
| `node file.js` | Run a JavaScript file |
| `npm init -y` | Create a `package.json` |
| `npm install <pkg>` | Install a package |
| `git status` | What has changed? |
| `git add .` | Stage everything for the next commit |
| `git commit -m "msg"` | Save a snapshot |
| `git push` | Send it to GitHub |
| `git pull` | Get the latest from GitHub |
| `git log --oneline` | See the history |

### Terminal Basics

| Command | What it does |
|---|---|
| `pwd` | Where am I? |
| `ls` (`dir` on Windows CMD) | What's in here? |
| `cd folder-name` | Go into a folder |
| `cd ..` | Go back up one level |
| `mkdir name` | Make a folder |
| `clear` (`cls` on Windows) | Clean the screen |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `node` / `git` / `code`: command not found | Close **every** terminal and open a new one. Still failing? Reinstall and confirm "Add to PATH" was checked. |
| `git push` rejects your password | Use a Personal Access Token, not your password (see Step 9). |
| Live Server doesn't open | Make sure you opened the **folder** in VS Code, not just the single file. |
| Prettier isn't formatting | Settings → Default Formatter → Prettier, and Format On Save is ticked. |
| `permission denied` on Mac/Linux install | Prefix with `sudo`, or install Node via [nvm](https://github.com/nvm-sh/nvm). |

---

## Before the Next Session

Session 2 is **JS Fundamentals** — variables, data types, conditionals, loops. It assumes everything above already works.

Do not show up to Session 2 with a broken environment. If something here fails, ask **before** then.

### A Taste of Session 2

You don't need to understand all of this yet — we cover every line next session. But your environment is ready **now**, so put it to work: create `preview.js`, type these out yourself, and run each one with `node preview.js`.

> Type them, don't copy-paste. The muscle memory is the point.

---

#### 1. Variables — three ways to name a value

```js
// const — the default. A name you will never reassign.
const courseName = "JavaScript Everywhere";

// let — use it only when the value genuinely changes.
let sessionNumber = 1;
sessionNumber = 2; // allowed

// var — the old way. You will see it in old code. Do not write it.
var oldStyle = "avoid this";

console.log(courseName, sessionNumber);
```

**Rule of thumb:** reach for `const` first. Switch to `let` only when the value has to change.

Try it: add a line that reassigns `courseName`. Run it. Read the error — that error is the whole point of `const`.

---

#### 2. Data Types — what kinds of values exist

```js
// --- Primitives: single values ---
const name = "Mostafa";        // string
const age = 25;                // number  (no separate int/float in JS)
const isLearning = true;       // boolean
const notSet = null;           // null    — intentionally empty
let notAssigned;               // undefined — declared, never given a value

// --- Objects: a value with named parts ---
const student = {
  name: "Mostafa",
  track: "JS/TS Foundations",
  isActive: true,
};

// --- Arrays: an ordered list ---
const tracks = ["Web", "Full-Stack", "Mobile", "Desktop"];

console.log(typeof name);      // "string"
console.log(typeof age);       // "number"
console.log(typeof student);   // "object"
console.log(typeof tracks);    // "object"  ← arrays are objects in JS

console.log(student.track);    // "JS/TS Foundations"
console.log(tracks[0]);        // "Web"     ← counting starts at 0
console.log(tracks.length);    // 4
```

Try it: add your own `favoriteLanguage` key to `student`, then print it.

---

#### 3. Conditionals — making decisions

```js
const score = 85;

if (score >= 90) {
  console.log("Excellent");
} else if (score >= 70) {
  console.log("Good");
} else {
  console.log("Keep going");
}

// === compares value AND type. Always use it.
console.log(5 === 5);    // true
console.log(5 === "5");  // false  ← different types

// == converts types behind your back. This is a bug factory.
console.log(5 == "5");   // true   ← avoid

// Ternary — a compact if/else that produces a value
const status = score >= 70 ? "pass" : "fail";
console.log(status);     // "pass"
```

**Rule of thumb:** always `===`, never `==`.

Try it: change `score` to `95`, then `50`, and run it each time.

---

#### 4. Loops — repeating work

```js
const tracks = ["Web", "Full-Stack", "Mobile", "Desktop"];

// for — when you need the index
for (let i = 0; i < tracks.length; i++) {
  console.log(`Track ${i + 1}: ${tracks[i]}`);
}

// for...of — when you just need each item (cleaner, prefer this)
for (const track of tracks) {
  console.log(track);
}

// while — when you don't know how many times up front
let countdown = 3;
while (countdown > 0) {
  console.log(countdown);
  countdown--;
}
console.log("Go!");

// forEach — the array's own loop
tracks.forEach((track, index) => {
  console.log(`${index + 1}. ${track}`);
});
```

Try it: write a loop that prints only the tracks whose name is longer than 6 characters.

---

#### Putting It Together

One small program using all four ideas at once:

```js
// preview.js — variables + data types + conditionals + loops
const students = [
  { name: "Sara", score: 92 },
  { name: "Omar", score: 68 },
  { name: "Lina", score: 79 },
];

let passed = 0;

for (const student of students) {
  const result = student.score >= 70 ? "PASS" : "FAIL";

  if (result === "PASS") {
    passed++;
  }

  console.log(`${student.name}: ${student.score} → ${result}`);
}

console.log(`\n${passed} of ${students.length} students passed.`);
```

Run it:

```bash
node preview.js
```

Expected output:

```
Sara: 92 → PASS
Omar: 68 → FAIL
Lina: 79 → PASS

2 of 3 students passed.
```

If you got that output, your environment works **and** you've already touched every Session 2 topic. Come with questions.

---

## Day 01 Files

- [README.md](README.md) — this guide
- [ASSIGNMENT.md](ASSIGNMENT.md) — Day 01 assignment

← Back to [Day 00 — Introduction](../Day-00-Introduction/README.md)
