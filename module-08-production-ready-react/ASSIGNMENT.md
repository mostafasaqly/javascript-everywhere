# Module 08 Assignment: Final project: ship TaskFlow

**Starts from:** TaskFlow v1.0 (the Module 08 checkpoint)

Finish TaskFlow as a portfolio project you can share.

## Tasks

### Task 1: More tests

Write tests for `TaskFilters` (calls the right callbacks) and for `tasksReducer` (every action type).

**Acceptance criteria**

- [ ] At least 8 passing tests
- [ ] Reducer tests don't render any component

### Task 2: Accessibility audit

Run Lighthouse on the deployed site. Fix issues until Accessibility scores 90 or higher.

**Acceptance criteria**

- [ ] Screenshot of the final score
- [ ] List of what you fixed in the README

### Task 3: Deploy

Deploy the front end (Netlify or Vercel) and the API (any host that runs Node). Set `VITE_API_URL` for production.

**Acceptance criteria**

- [ ] Deep links like `/dashboard` work after refresh
- [ ] No `localhost` URLs in the production build

### Task 4: Project README

Write a README with a screenshot, live link, features, tech stack, how to run locally (app + API) and how to run tests.

**Acceptance criteria**

- [ ] Someone new can run it from the README alone
- [ ] Commands are in code blocks

## Challenge (bonus)

Add dark mode that follows the system setting, with a toggle saved in local storage. Check colour contrast in both themes.

## Reflection questions

Answer in 2–3 sentences each, in a file called `REFLECTION.md`:

1. Why shouldn't you put an API key in a `VITE_` variable?
2. Why do tests use roles and labels instead of class names?
3. What did you learn in this course that you'll use in your next project?

## Submission

1. Work on a new branch: `git checkout -b module-08-assignment`.
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
