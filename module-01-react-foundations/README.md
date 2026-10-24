# Module 01: React Foundations

**Day 1** · TaskFlow **v0.1** · Slides start at **slide 3** in `react-typescript-taskflow.pptx`

## What you build

A static TaskFlow layout: a header, a sidebar with projects and a list of three task cards. Nothing is interactive yet.

## Lessons

| # | Lesson | By the end you can |
|---|---|---|
| 01 | What is React? | Explain the problem React solves and the difference between imperative and declarative UI. |
| 02 | SPA & components | Split the TaskFlow screen into a component tree with a name and one job for each component. |
| 03 | Create the project with Vite | Create and run a React + TypeScript project called taskflow. |
| 04 | Project files & cleanup | Follow the start-up path index.html → main.tsx → App.tsx and clean the project. |
| 05 | JSX & TSX | Show values from variables with { } and fix the four most common JSX errors. |
| 06 | Your first component: Header | Create a component in its own file, export it, import it and use it. |
| 07 | Build the TaskFlow layout | Combine Header, Sidebar and TaskList and arrange them with Flexbox and Grid. |

## Setup

Requirements: Node.js 20.19+ or 22.12+ (check with `node -v`) and VS Code.

```bash
npm create vite@latest taskflow -- --template react-ts
cd taskflow
npm install
npm run dev
```

Open http://localhost:5173. Keep this terminal open while you work.

## Files added or changed

- `index.html`: page title is TaskFlow
- `src/App.tsx`: puts Header, Sidebar and TaskList together
- `src/App.css`: layout, header, sidebar and card styles
- `src/index.css`: page reset
- `src/components/Header.tsx`
- `src/components/Sidebar.tsx`
- `src/components/TaskList.tsx`: three task cards (repeated on purpose)

## Key ideas

- React is a library for building user interfaces, not a new language.
- A component is a function with a capital name that returns JSX.
- JSX rules: one parent element (or `<> </>`), `className`, close every tag, camelCase attributes.
- `{ }` shows the result of any JavaScript expression.
- `export default` shares a component; `import` uses it in another file.

## Checkpoint v0.1

Before the next module, check every item:

- [ ] `npm run dev` runs with no errors
- [ ] `src/components` has Header, Sidebar and TaskList
- [ ] Header on top, sidebar on the side, three task cards
- [ ] Under 700px wide the sidebar moves above the list
- [ ] No errors in the browser console

## Where to find the code

- **Course app:** Module 01 → Checkpoint v0.1 has the complete code for comparison.
- **Code page:** *Module 01* tab, grouped by slide number.

## Assignment

See [ASSIGNMENT.md](./ASSIGNMENT.md).
