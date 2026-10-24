# Module 02: Components & TypeScript

**Day 2** · TaskFlow **v0.2** · Slides start at **slide 41** in `react-typescript-taskflow.pptx`

## What you build

One reusable `TaskCard` that receives typed task data through props. Task data lives in its own file with a `Task` interface.

## Lessons

| # | Lesson | By the end you can |
|---|---|---|
| 01 | Import & export | Tell default exports from named exports and move shared values to `constants.ts`. |
| 02 | TypeScript basics | Type variables, arrays and functions, and write the `TaskStatus` union. |
| 03 | Type aliases & interfaces | Describe a task with an interface and create three typed tasks. |
| 04 | What are props? | Send `userName` from App to Header with a typed prop. |
| 05 | Typed props for TaskCard | Replace the repeated cards with one TaskCard that takes a `Task`. |
| 06 | Optional props & defaults | Add an optional `dueDate`, an optional `variant` and a fallback with `??`. |
| 07 | Typed event handlers | Add a Details button and pass an `onSelect` function from parent to child. |
| 08 | children & composition | Build a `Section` component that wraps any content. |

## Setup

No new packages. Start from your v0.1 project and keep `npm run dev` running.

## Files added or changed

- `src/constants.ts`: `APP_NAME`, `APP_TAGLINE`
- `src/types/task.ts`: `TaskStatus`, `Task`
- `src/data/tasks.ts`: three typed tasks
- `src/components/TaskCard.tsx`
- `src/components/Section.tsx`
- `src/components/Header.tsx`: `userName` prop
- `src/components/TaskList.tsx`: three `TaskCard`s inside `Section`

## Key ideas

- Named exports need braces and the exact name; default exports take any name.
- Use `interface` for object shapes and `type` for unions in this project.
- Import types with `import type`.
- Props are read-only. Strings go in quotes, other values in `{ }`.
- Pass the function itself: `onClick={handleClick}`, not `handleClick()`.
- `children` is whatever you put between the opening and closing tags.

## Checkpoint v0.2

Before the next module, check every item:

- [ ] `constants.ts`, `types/task.ts` and `data/tasks.ts` exist
- [ ] Header says *Hi Mona!* with the name coming from App
- [ ] The first card is urgent and every card has a *Due* line
- [ ] Details logs the right task id in the console
- [ ] No `any` and no red lines in VS Code

## Where to find the code

- **Course app:** Module 02 → Checkpoint v0.2 has the complete code for comparison.
- **Code page:** *Module 02* tab, grouped by slide number.

## Assignment

See [ASSIGNMENT.md](./ASSIGNMENT.md).
