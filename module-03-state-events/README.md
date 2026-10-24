# Module 03: State & Events

**Day 3** · TaskFlow **v0.3** · Slides start at **slide 77** in `react-typescript-taskflow.pptx`

## What you build

An interactive task list: add, complete and delete tasks, highlight the selected task and show live counts.

## Lessons

| # | Lesson | By the end you can |
|---|---|---|
| 01 | Rendering lists with map | Turn the tasks array into cards with `map`. |
| 02 | Keys | Give every card a stable, unique `key` from `task.id`. |
| 03 | useState | Remember the selected task with typed state. |
| 04 | Conditional rendering | Use `&&` and the ternary for the selected card, urgent cards and the empty list. |
| 05 | Tasks in state: add a task | Move tasks into `useState<Task[]>` and add without mutating. |
| 06 | Complete a task | Update one item with `map` and object spread. |
| 07 | Delete a task | Remove an item with `filter` and clean related state. |
| 08 | Derived values | Compute open and done counts instead of storing them. |

## Setup

No new packages.

## Files added or changed

- `src/components/TaskList.tsx`: `tasks` and `selectedId` state, add / toggle / delete / clear done
- `src/components/TaskCard.tsx`: `isSelected`, `onToggle`, `onDelete`
- `src/App.css`: selected card, empty state, toolbar and button styles

## Key ideas

- State is the component's memory; calling the setter re-renders.
- Never mutate state: create a new array or object.
- The four list operations: `map` (read), spread (create), `map` + spread (update), `filter` (delete).
- Keep the smallest thing in state and compute the rest.
- Watch for `0 &&` rendering a zero on screen.

## Checkpoint v0.3

Before the next module, check every item:

- [ ] No key warning in the console
- [ ] Only two states in TaskList: `tasks` and `selectedId`
- [ ] Add, Mark done / Undo and Delete work
- [ ] The title shows the open count and *Clear done* disables itself
- [ ] An empty list shows a message

## Where to find the code

- **Course app:** Module 03 → Checkpoint v0.3 has the complete code for comparison.
- **Code page:** *Module 03* tab, grouped by slide number.

## Assignment

See [ASSIGNMENT.md](./ASSIGNMENT.md).
