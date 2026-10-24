# Module 05: React Hooks

**Day 5** · TaskFlow **v0.5** · Slides start at **slide 132** in `react-typescript-taskflow.pptx`

## What you build

Tasks survive a refresh, the tab title shows the open count, Escape closes editing, and the task logic lives in custom hooks.

## Lessons

| # | Lesson | By the end you can |
|---|---|---|
| 01 | useEffect | Sync the tab title with the open count. |
| 02 | Effect cleanup | Add an Escape key listener and remove it on cleanup. |
| 03 | Saving to local storage | Load once with lazy initial state and save on every change. |
| 04 | useRef | Focus the title field automatically. |
| 05 | useMemo | Memoise the filtered list and know when it's worth it. |
| 06 | useCallback & updaters | Keep handlers stable with `useCallback`, `memo` and updater functions. |
| 07 | Generics | Write `readJson<T>` and `writeJson<T>` for any type. |
| 08 | Custom hooks | Build `useLocalStorage<T>` and `useTasks()`. |

## Setup

No new packages. Open DevTools → Application → Local Storage to watch your saved tasks.

## Files added or changed

- `src/utils/storage.ts`: `readJson<T>`, `writeJson<T>`
- `src/hooks/useLocalStorage.ts`
- `src/hooks/useTasks.ts`
- `src/components/TaskForm.tsx`: focus with `useRef`
- `src/components/TaskCard.tsx`: wrapped in `memo`
- `src/components/TaskList.tsx`: UI state only

## Key ideas

- Effects run after render; list every value you use in the dependencies.
- Every subscription (listener, timer) needs a cleanup.
- Lazy initial state: `useState(() => readJson(...))`.
- Refs keep values without re-rendering; use them for DOM access.
- Updater functions `setX((current) => ...)` avoid stale values.
- Custom hooks share logic, not state.

## Checkpoint v0.5

Before the next module, check every item:

- [ ] Tasks stay after a refresh
- [ ] The tab shows `(2) TaskFlow`
- [ ] Escape closes the edit form
- [ ] The cursor starts in the title field
- [ ] `useLocalStorage` and `useTasks` exist; TaskList has no `setTasks`

## Where to find the code

- **Course app:** Module 05 → Checkpoint v0.5 has the complete code for comparison.
- **Code page:** *Module 05* tab, grouped by slide number.

## Assignment

See [ASSIGNMENT.md](./ASSIGNMENT.md).
