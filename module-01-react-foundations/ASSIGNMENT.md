# Module 01 Assignment: Finish the static layout

**Starts from:** TaskFlow v0.1 (the Module 01 checkpoint)

Practise components, JSX and CSS by adding three small pieces to TaskFlow v0.1. Everything stays static: no state yet.

## Tasks

### Task 1: Footer component

Create `src/components/Footer.tsx` that shows `© 2026 TaskFlow`. Use it at the bottom of `App`.

**Acceptance criteria**

- [ ] The footer is its own file with `export default`
- [ ] It appears under the main area on every screen size
- [ ] It uses a `<footer>` element and a class name styled in `App.css`

### Task 2: TaskStats component

Create `TaskStats` that shows a line like `3 tasks · 1 done` above the task list. The numbers are written by hand for now.

**Acceptance criteria**

- [ ] `TaskStats` is placed inside `main`, before `TaskList`
- [ ] Text is readable and spaced from the cards

### Task 3: More data

Add a fourth project in the sidebar (`Design System`) and a fourth task card with status *In Progress*.

**Acceptance criteria**

- [ ] The new project looks like the others
- [ ] The new card uses the existing CSS classes

### Task 4: Responsive check

Test the page at 375px, 768px and 1280px wide using the browser device toolbar. Fix anything that overflows.

**Acceptance criteria**

- [ ] No horizontal scrolling at 375px
- [ ] Take one screenshot per width

## Challenge (bonus)

Add a small avatar circle to the right of the header that shows the first letter of a name stored in a variable inside `Header`. Use only JSX and CSS.

## Reflection questions

Answer in 2–3 sentences each, in a file called `REFLECTION.md`:

1. Why is the task card a good candidate for a component?
2. What happens if a component name starts with a lowercase letter?
3. Why do we wrap two sibling elements in `<> </>`?

## Submission

1. Work on a new branch: `git checkout -b module-01-assignment`.
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
