# Module 02 Assignment: Add priorities with typed props

**Starts from:** TaskFlow v0.2 (the Module 02 checkpoint)

Extend the `Task` type and the components while keeping everything fully typed.

## Tasks

### Task 1: Priority type

Add `export type Priority = 'low' | 'medium' | 'high'` and an optional `priority?: Priority` to `Task`. Give two of the three tasks a priority.

**Acceptance criteria**

- [ ] A wrong value like `'urgent'` shows a TypeScript error
- [ ] Tasks without a priority still compile

### Task 2: Badge component

Create `Badge` that takes `children` and an optional `tone?: 'neutral' | 'warning' | 'danger'` (default `'neutral'`). Show the task priority in `TaskCard` with it; show `medium` when the priority is missing.

**Acceptance criteria**

- [ ] `BadgeProps` uses `ReactNode` for children
- [ ] High priority uses the `danger` tone

### Task 3: Typed Sidebar

Make `Sidebar` receive `title: string` and `projects: string[]` from `App`.

**Acceptance criteria**

- [ ] `SidebarProps` interface exists
- [ ] Changing the array in App updates the sidebar

### Task 4: Section action

Give `Section` an optional `action?: ReactNode` shown on the right of the title. Use it to show a `Badge` with the number of tasks.

**Acceptance criteria**

- [ ] Section still works without `action`
- [ ] Layout stays aligned on mobile

## Challenge (bonus)

Add an `onDelete: (id: number) => void` prop to `TaskCard` with a Delete button that logs the id in `TaskList`. Name the handler `handleDelete`.

## Reflection questions

Answer in 2–3 sentences each, in a file called `REFLECTION.md`:

1. When would you choose `type` over `interface`?
2. Why do we pass the whole `task` as one prop?
3. What does `??` do differently from `||`?

## Submission

1. Work on a new branch: `git checkout -b module-02-assignment`.
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
