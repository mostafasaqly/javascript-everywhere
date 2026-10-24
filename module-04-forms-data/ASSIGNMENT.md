# Module 04 Assignment: Better forms and filters

**Starts from:** TaskFlow v0.4 (the Module 04 checkpoint)

Strengthen the form and give users more control over the list.

## Tasks

### Task 1: More validation

The due date can't be in the past, and the description is limited to 200 characters with a live counter `120 / 200`.

**Acceptance criteria**

- [ ] Error messages use `role="alert"`
- [ ] The counter turns red over 180 characters

### Task 2: Sort select

Add a sort select to `TaskFilters`: *Default*, *Title A–Z*, *Due date*. Tasks without a due date go last.

**Acceptance criteria**

- [ ] Typed as `type SortOption = 'default' | 'title' | 'dueDate'`
- [ ] Sorting is computed from a copy

### Task 3: Results summary

Show `Showing 2 of 5` and a *Clear filters* button that appears only when a filter is active.

**Acceptance criteria**

- [ ] The button resets text, status and sort
- [ ] Hidden when nothing is filtered

### Task 4: Duplicate task

Add a *Duplicate* button to `TaskCard` that adds a copy titled `Copy of …` with a new id.

**Acceptance criteria**

- [ ] Reuses the existing add logic
- [ ] The copy starts as *To Do*

## Challenge (bonus)

Show a *Discard changes?* confirmation when the user clicks Cancel after editing a field.

## Reflection questions

Answer in 2–3 sentences each, in a file called `REFLECTION.md`:

1. Why does `useState(initialValues)` not update when `initialValues` changes?
2. When is `as StatusFilter` safe, and when is it risky?
3. Why do we turn an empty date into `undefined`?

## Submission

1. Work on a new branch: `git checkout -b module-04-assignment`.
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
