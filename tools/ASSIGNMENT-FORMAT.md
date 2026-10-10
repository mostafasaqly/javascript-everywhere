# Assignment Format — Day 07 Onward

How every assignment from Day 07 on is written. Day 07 and Day 08 are the reference examples.

## Why

Student feedback after Day 06: the task count kept growing session after session, and the checklist style ("do X, then Y, then screenshot Z") meant writing code without having to *think* about the problem. With a deadline and a heavy load, people rushed to tick boxes, and real understanding fell through the gaps.

So we balance two things:

- **Studying the topic.** The README's follow-along build, done during the week.
- **Applying it.** A small number of problems, each one you have to break down and solve yourself.

The effort stays the same. The work just goes into thinking instead of ticking.

## The Shape

| Part | Count | What it is | ⏱ |
|---|---|---|---|
| Warm-up | 1 | ~6 "predict the output" snippets — predict, run, explain every miss | 30 min |
| Problems | **4** | LeetCode-style: statement, signature, examples, constraints, hints | 45 min – 2 h each |
| Ship it | 1 | Short `NOTES.md` (4 questions), one PR, one LinkedIn post | 45 min |
| Bonus | 3–4 | Optional "challenge problems" in the same format | — |

**Budget: about 7–8 hours over 6 days.** If a draft goes over that, cut a problem. Don't add one.

- **Difficulty ramps up:** 🟢 Easy → 🟡 Medium → 🟡 Medium → 🟠 Medium+.
- **The last problem extends the README's project.** The follow-along build is *not* homework. The assignment adds a specified feature on top of it, so the project grows across sessions without students building it twice.
- **Problems 1–3 live in one Vite project:** `day-NN-problems/`, one folder per problem.

## Anatomy of a Problem

```markdown
## Problem N — Name

🟡 **Medium** · topic, topic, topic

### Description
One short paragraph: what to build, not how.

### Signature            ← types / props / function signature (or "Given" data and code)

### Output / Behaviour / Rules
The exact output format, or the behaviour as rules. Precise enough to have one right answer.

### Examples
Input → expected output, character by character. Use a table, code blocks, or
a numbered sequence of actions for stateful UIs. Include edge cases and at least
one *trap* (an example a naive solution gets wrong).

### Constraints
The rules the solution must respect (no mutation, derived not stored,
pure function, no `useState` for X, …) — plus how to *prove* one of them.

<details><summary>💡 Hint 1</summary>…</details>   ← 2–3 hints, each revealing a little more
<details><summary>💡 Hint 2</summary>…</details>

**✅ Deliverable:** files + 1–2 screenshots.
```

### Rules for Writing Problems

- **Say what, not how.** A sentence like "Use `[...items].sort()`" belongs in a hint, not in the statement.
- **Every example must be verified.** Write a quick reference solution and run every example through it before publishing. A wrong expected output wastes hours of a student's time.
- **Plant a trap in every problem.** Examples: `NaN` in a rating, a price tie, `"a" < "B"`, a page past the end, a Friday that's also in the past. That's where the thinking happens.
- **Prefer pure functions with injected inputs** (pass `today` in, don't read the clock). They make the examples exact and testable with `node`.
- **Approach before code:** every problem requires 2–5 lines in `APPROACH.md` written *before* coding.

## Tracker (`app/dayNN-tracker.html`)

One tab per task, with **4–5 checks per problem**. Checks describe outcomes, never steps:

1. Approach written in `APPROACH.md` **before** coding
2. **All N examples** produce the expected output
3. The problem's key constraint, e.g. "doesn't mutate", "+3 adds exactly 3", or "errors derived"
4. The problem's quality rule, e.g. "keys from data", "no `any`", or "tsc/lint/build pass"

Aim for about **23 required checks** and **4 bonus checks**. Required inputs: the extended-project link, repo, PR, and LinkedIn post.

The check order is the submission-code wire format. Generate `tools/checks-dayNN.json` from the page's `TASKS` model in the same order: required checks first, then bonus, with labels written as `T<tab>.<sid> <label text>`. If you change a published day's checks, bump its salt (`-v2`, `-v3`, …) in both the page and `tools/codec-dayNN.js`.
