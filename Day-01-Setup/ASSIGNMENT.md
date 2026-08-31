# Day 01 — Assignment

**Track 1 · Session 1 · Dev Environment Setup**

> Session 1 was setup. This assignment proves the setup actually works — on *your* machine, not on mine —
> and gets your hands on the JavaScript we cover in Session 2.
> Everything in Session 2 assumes these tasks are done.

**⏱ Budget:** 5–6 hours · **📅 Duration:** 3 days · **🚩 Deadline:** before Session 2

| # | Task | Deliverable |
|---|---|---|
| 1 | Prove your environment works | 3 screenshots |
| 2 | Run JavaScript in both worlds | 2 files + 2 screenshots |
| 3 | Practice the Session 2 preview | 2 files + 2 screenshots + 4 answers |
| 4 | Your journey repository | Repo link + `git log` screenshot |
| 5 | Share it | LinkedIn post link |

---

## Task 1 — Prove Your Environment Works

A screenshot of an installer finishing proves nothing. Prove it from the terminal.

### 1.1 — Version Check

- [ ] Open a **fresh** terminal and run all four commands:

```bash
node --version
npm --version
git --version
code --version
```

- [ ] Take **one screenshot** showing all four outputs in the same terminal window.

> If any of them says "command not found", that's the assignment — fix it first. Check the Troubleshooting table in the [README](README.md).

### 1.2 — Git Identity

- [ ] Run:

```bash
git config --global --list
```

- [ ] Confirm `user.name` and `user.email` are set, and the email **matches your GitHub account**.
- [ ] Screenshot it.

### 1.3 — VS Code Extensions

- [ ] Confirm all six extensions from Step 3 are installed: Prettier, ESLint, Live Server, Error Lens, GitLens, Path Intellisense.
- [ ] Confirm **Format On Save** is on with Prettier as the default formatter.
- [ ] Screenshot your Extensions panel.

**✅ Deliverable:** 3 screenshots.

---

## Task 2 — Run JavaScript in Both Worlds

The whole premise of this series is one language, many environments. Show me you've seen both.

### 2.1 — Node Side (`profile.js`)

Create a new file `profile.js` and write a script that:

- [ ] Stores your name, your city, and why you joined this journey in variables
- [ ] Has a function that takes those values and returns one formatted sentence
- [ ] Prints that sentence with `console.log`
- [ ] Also prints the Node version using `process.version`

Run it:

```bash
node profile.js
```

- [ ] Screenshot the terminal output.

### 2.2 — Browser Side (`index.html` + `app.js`)

Build a small page that:

- [ ] Shows your name in an `<h1>`
- [ ] Has a button that, when clicked, changes the text on the page
- [ ] Has a **second** button that logs something to the browser console
- [ ] Runs through **Live Server** (not by double-clicking the file)

- [ ] Screenshot the page with DevTools console open.

> **The point of this task:** notice that `profile.js` cannot use `document`, and `app.js` cannot use `process`. Same language. Different environment. Be ready to explain that difference in one sentence.

**✅ Deliverable:** both files pushed + 2 screenshots.

---

## Task 3 — Practice the Session 2 Preview

Work through **[A Taste of Session 2](README.md#a-taste-of-session-2)** in the README. Your environment is ready — use it before Session 2 instead of arriving cold.

> **Type every example by hand. Do not copy-paste.** The muscle memory is the point, and you will not build it with `Ctrl+V`.

### 3.1 — Type Out the Four Topics (`preview.js`)

- [ ] Create `preview.js` and type out all four example blocks: variables, data types, conditionals, loops
- [ ] Run it after each block with `node preview.js` — do not wait until the end
- [ ] Complete the **Try it** challenge under each of the four blocks:
  - **Variables** — reassign a `const` on purpose, run it, and read the error
  - **Data types** — add your own `favoriteLanguage` key to `student` and print it
  - **Conditionals** — set `score` to `95`, then `50`, and run it each time
  - **Loops** — print only the tracks whose name is longer than 6 characters

### 3.2 — Run the Combined Program

- [ ] Type out the final `students` program from the README and run it
- [ ] Confirm your output matches exactly:

```
Sara: 92 → PASS
Omar: 68 → FAIL
Lina: 79 → PASS

2 of 3 students passed.
```

- [ ] Screenshot the terminal output.

### 3.3 — Make It Yours (`grades.js`)

Now write your own version from scratch — same ideas, different data. Create `grades.js` that:

- [ ] Holds an array of **at least 5** objects, each with a `name` and a `score`
- [ ] Uses `const` and `let` correctly — `let` only where the value actually changes
- [ ] Loops over the array with `for...of`
- [ ] Uses a conditional to label each score across **three** bands, not two:
  - `90+` → Excellent
  - `70–89` → Good
  - below `70` → Needs work
- [ ] Counts how many students landed in each band
- [ ] Prints a summary line at the end
- [ ] Uses `===` everywhere — no `==` anywhere in the file

- [ ] Screenshot the output.

### 3.4 — Answer These in Your Notes

Short answers, one or two sentences each. In your own words:

- [ ] When do you use `let` instead of `const`?
- [ ] What does `typeof []` return, and why is that surprising?
- [ ] What is the difference between `===` and `==`, and why do we only use `===`?
- [ ] When would you use `while` instead of `for`?

**✅ Deliverable:** `preview.js` + `grades.js` pushed, 2 screenshots, 4 answers in your notes.

---

## Task 4 — Your Journey Repository

This repo is where all 26 weeks of your work will live. Set it up properly today.

### 4.1 — Create and Push

- [ ] Create a **public** GitHub repo named `javascript-everywhere`
- [ ] Connect your local folder and push it:

```bash
git init
git add .
git commit -m "Day 01: dev environment setup"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/javascript-everywhere.git
git push -u origin main
```

### 4.2 — Repo Structure

- [ ] Organize your files like this:

```
javascript-everywhere/
├── README.md
└── day-01/
    ├── NOTES.md
    ├── profile.js
    ├── preview.js
    ├── grades.js
    ├── index.html
    └── app.js
```

### 4.3 — Root README

- [ ] Write a `README.md` at the root containing:
  - Your name and what this repo is
  - The 7 tracks of the journey
  - A table of contents you'll add a row to each session

### 4.4 — Your Day 01 Notes

- [ ] Write `day-01/NOTES.md` **in your own words** covering:
  - What Node.js is, and how it's different from a browser
  - What npm is for
  - The difference between Git and GitHub
  - Every command you learned, with one line explaining each
  - One thing that broke during setup, and how you fixed it
  - Your four answers from **Task 3.4**

> The "what broke" section is not optional. If nothing broke, say that — but be specific about what you checked.

### 4.5 — Four Separate Commits

Do **not** dump everything in one commit. Practice the workflow:

- [ ] Commit 1 — the README
- [ ] Commit 2 — the Node script (`profile.js`)
- [ ] Commit 3 — the browser files (`index.html`, `app.js`)
- [ ] Commit 4 — the fundamentals practice (`preview.js`, `grades.js`)

Write real commit messages. `update` and `changes` are not messages.

- [ ] Then run `git log --oneline` and screenshot the four commits.

**✅ Deliverable:** the repository link + the `git log` screenshot.

---

## Task 5 — Share It

Point #1 of the 10% Commitment: share your progress publicly.

- [ ] Post on **LinkedIn** about completing Session 1
- [ ] Include the screenshot of your four version checks
- [ ] Include the link to your `javascript-everywhere` repo
- [ ] Say one concrete thing you learned — not "excited to start my journey"

**✅ Deliverable:** the link to your post.

---

## Bonus (Optional)

For anyone who wants to go further:

- [ ] Add a `.gitignore` with `node_modules/` in it — and explain in your notes why that folder never goes on GitHub
- [ ] Run `npm init -y` in a test folder, open the generated `package.json`, and describe each field in your notes
- [ ] Configure Git to use SSH keys instead of a Personal Access Token
- [ ] Make your `profile.js` read a value from the command line using `process.argv`
- [ ] In `grades.js`, replace the `for...of` loop with `forEach` and keep the output identical
- [ ] Add a second array to `grades.js` and find the highest score across both — without using `Math.max`

---

## Submission Checklist

- [ ] **Task 1** — 3 screenshots (versions, git config, extensions)
- [ ] **Task 2** — `profile.js` + browser page, 2 screenshots
- [ ] **Task 3** — `preview.js` + `grades.js`, 2 screenshots, 4 answers in notes
- [ ] **Task 4** — repo link, correct structure, README, NOTES.md, 4 commits, `git log` screenshot
- [ ] **Task 5** — LinkedIn post link

Submit all links together before Session 2.

---

## How This Is Graded

| Level | What it looks like |
|---|---|
| ❌ **Incomplete** | Screenshots only, no repo, one giant commit, or copy-pasted code you can't explain |
| ✅ **Done** | All five tasks, working code, notes in your own words |
| 🔥 **10%** | Done + the bonus + `grades.js` doing something beyond the spec + notes someone else could actually learn from |

---

## A Reminder

> **90%** study only — free, self-paced, no assignments turned in.
> **10%** study + assignments + more — I personally help this group get there.
>
> **If you show up for the 10%, I show up for you.**

Session 2 is **JS Fundamentals** — variables, data types, conditionals, loops. Come with a working environment.

---

← Back to [Day 01 README](README.md)
