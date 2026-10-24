# Module 05 Assignment: Your own hooks

**Starts from:** TaskFlow v0.5 (the Module 05 checkpoint)

Write small, typed custom hooks and use them in TaskFlow.

## Tasks

### Task 1: useDocumentTitle

Create `useDocumentTitle(title: string)` and replace the title effect in `TaskList`.

**Acceptance criteria**

- [ ] One line in TaskList
- [ ] Works when the open count changes

### Task 2: Remember filters

Save the search text and status filter with `useLocalStorage` so they survive a refresh.

**Acceptance criteria**

- [ ] Two keys in local storage
- [ ] Typed with `useLocalStorage<StatusFilter>`

### Task 3: Search shortcut

Press `/` to focus the search box. Ignore the key while the user is typing in another field.

**Acceptance criteria**

- [ ] Uses a ref and an effect with cleanup
- [ ] No double listeners in StrictMode

### Task 4: countBy helper

Write `countBy<T>(items: T[], getKey: (item: T) => string): Record<string, number>` and use it to show counts per status.

**Acceptance criteria**

- [ ] Fully generic, no `any`
- [ ] Displayed under the title

## Challenge (bonus)

Write `useDebouncedValue<T>(value: T, delay: number): T` and use it so filtering runs 300 ms after the user stops typing.

## Reflection questions

Answer in 2–3 sentences each, in a file called `REFLECTION.md`:

1. What happens to an effect without a cleanup in StrictMode?
2. Why does `useState(readJson(...))` read storage on every render?
3. When is `useMemo` not worth it?

## Submission

1. Work on a new branch: `git checkout -b module-05-assignment`.
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
