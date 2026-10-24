# Module 03 Assignment: Make the list smarter

**Starts from:** TaskFlow v0.3 (the Module 03 checkpoint)

Practise state updates and derived values without adding new state where it isn't needed.

## Tasks

### Task 1: Three-step status

Change Mark done so it moves *To Do → In Progress → Done → To Do*. Write a typed helper `nextStatus(status: TaskStatus): TaskStatus`.

**Acceptance criteria**

- [ ] The button text matches the next step
- [ ] Uses `map` and object spread, no mutation

### Task 2: Progress line

Under the title, show `1 of 3 done (33%)`. Handle an empty list without dividing by zero.

**Acceptance criteria**

- [ ] Computed, not stored in state
- [ ] Updates after every add, toggle and delete

### Task 3: Undo delete

After deleting, show *Task deleted · Undo* for the last deleted task. Undo puts it back in the list.

**Acceptance criteria**

- [ ] Uses one extra state: the last deleted task or `null`
- [ ] Undo restores the task with the same id

### Task 4: Sort button

Add a button that switches between *Sort: default* and *Sort: title*. Sort a copy of the array.

**Acceptance criteria**

- [ ] Uses `[...tasks].sort(...)`, never `tasks.sort(...)`
- [ ] The sort mode is the only new state

## Challenge (bonus)

Add a *Select next* button that moves the selection to the next task in the list and wraps around at the end.

## Reflection questions

Answer in 2–3 sentences each, in a file called `REFLECTION.md`:

1. Why does `tasks.push(task)` followed by `setTasks(tasks)` not update the screen?
2. Why is the index a bad key for this list?
3. Which values in your TaskList are state, and which are derived?

## Submission

1. Work on a new branch: `git checkout -b module-03-assignment`.
2. Commit after each task with a clear message, for example `feat: add Footer component`.
3. Run `npm run build` before you submit. It must finish with no errors.
4. Push the branch and share the repository link.
5. Add 1–3 screenshots (or a short screen recording) to your pull request or message.

## Grading

| Criteria | Points |
|---|---|
| Features work as described (acceptance criteria) | 40 |
| TypeScript quality: clear types, no `any`, no red lines in VS Code | 20 |
| Code organisation: small components, good names, no copy-paste | 20 |
| UI and accessibility: readable, works on mobile, labels on inputs | 10 |
| Git and submission: clean commits, README updated, screenshots | 10 |
| **Total** | **100** |

Challenge tasks are a bonus (up to +10).
