# Module 07 Assignment: Projects from the API

**Starts from:** TaskFlow v0.7 (the Module 07 checkpoint)

Move more data to the API and polish the user experience around network requests.

## Tasks

### Task 1: Projects endpoint

Add a `projects` array to `db.json`, write `getProjects()` and load the sidebar and pages from it.

**Acceptance criteria**

- [ ] `projects.ts` is no longer imported by components
- [ ] The sidebar shows a loading state

### Task 2: Saving indicator

Track pending requests in the reducer and show *Saving…* in the header while any request runs.

**Acceptance criteria**

- [ ] New actions are part of the `TasksAction` union
- [ ] The indicator disappears after errors too

### Task 3: Due this week

Add a *Due this week* stat card on the dashboard.

**Acceptance criteria**

- [ ] Computed from tasks
- [ ] Done tasks are not counted

### Task 4: Profile page

Add a protected `/profile` page with the user's name and email and a Log out button.

**Acceptance criteria**

- [ ] Linked from the header
- [ ] Logging out returns to `/login`

## Challenge (bonus)

Make *Mark done* optimistic: update the screen first, call the API, and roll back with an error message if the request fails.

## Reflection questions

Answer in 2–3 sentences each, in a file called `REFLECTION.md`:

1. Why do we keep `json-server` at 0.17.4?
2. What problem does Context solve that outlet context didn't?
3. Why does `useTasksContext` throw when there is no provider?

## Submission

1. Work on a new branch: `git checkout -b module-07-assignment`.
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
