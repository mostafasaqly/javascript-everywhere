# Module 06 Assignment: Task detail pages

**Starts from:** TaskFlow v0.6 (the Module 06 checkpoint)

Add deeper navigation and make URLs shareable.

## Tasks

### Task 1: Task details route

Add `/projects/:projectId/tasks/:taskId` showing the task title, description, status and due date. The Details button navigates there with `useNavigate`.

**Acceptance criteria**

- [ ] Unknown task ids show `EmptyState`
- [ ] A *Back to project* link works

### Task 2: Project header

On each project page, show the number of tasks and a progress line (`2 of 5 done`).

**Acceptance criteria**

- [ ] Computed from tasks, no new state
- [ ] Uses `Section` or `EmptyState` where it fits

### Task 3: Fourth project

Add `Design System` to `projects.ts`. Check that the sidebar, routes and forms all work without other changes.

**Acceptance criteria**

- [ ] Only `projects.ts` changes
- [ ] The new project page starts empty with a helpful message

### Task 4: Folder review

Write a short `ARCHITECTURE.md` explaining what goes in each folder of `src`.

**Acceptance criteria**

- [ ] One line per folder
- [ ] Mentions where a new page and a new hook would go

## Challenge (bonus)

Store the search text and status filter in the URL with `useSearchParams`, so `/projects/website?status=done` opens with the filter applied.

## Reflection questions

Answer in 2–3 sentences each, in a file called `REFLECTION.md`:

1. Why can't TaskList call `useTasks()` directly on every page?
2. What does the `end` prop on `NavLink` fix?
3. Why does `ProjectPage` give `TaskList` a `key`?

## Submission

1. Work on a new branch: `git checkout -b module-06-assignment`.
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
