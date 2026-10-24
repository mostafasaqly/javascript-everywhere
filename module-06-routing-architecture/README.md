# Module 06: Routing & Architecture

**Day 6** · TaskFlow **v0.6** · Slides start at **slide 154** in `react-typescript-taskflow.pptx`

## What you build

Multiple projects, real URLs with React Router, a shared layout, a page per project and reusable UI components.

## Lessons

| # | Lesson | By the end you can |
|---|---|---|
| 01 | Multiple projects | Add a `Project` type, project data and `projectId` on every task. |
| 02 | React Router setup | Install React Router and add the first routes. |
| 03 | Layout & Outlet | Share the header and sidebar in one layout and pass data with outlet context. |
| 04 | NavLink navigation | Highlight the current page in the sidebar. |
| 05 | Dynamic routes | Build `/projects/:projectId` with `useParams`. |
| 06 | Reusable UI & folders | Build `Button` and `EmptyState` and organise folders by role. |

## Setup

```bash
npm install react-router
```

Tasks are now saved under a new key (`taskflow.tasks.v2`) because every task needs a `projectId`.

## Files added or changed

- `src/types/project.ts`, `src/data/projects.ts`
- `src/main.tsx`: `BrowserRouter`
- `src/App.tsx`: routes
- `src/layouts/AppLayout.tsx`
- `src/pages/TasksPage.tsx`, `ProjectPage.tsx`, `NotFoundPage.tsx`
- `src/components/ui/Button.tsx`, `ui/EmptyState.tsx`
- `src/components/Sidebar.tsx`: `NavLink`s

## Key ideas

- Routes map URLs to page components; `*` catches unknown URLs.
- A layout route renders shared UI and an `<Outlet />` for the page.
- `NavLink` knows when it's active; use `end` for `/`.
- `useParams()` reads `:projectId` from the URL.
- A `key` on a page resets its state when the URL changes.
- Organise folders by role: components, pages, layouts, hooks, utils, data, types.

## Checkpoint v0.6

Before the next module, check every item:

- [ ] `/` shows all tasks
- [ ] `/projects/mobile` shows only its tasks
- [ ] The sidebar highlights the current page
- [ ] Unknown URLs show a clear message
- [ ] Tasks added inside a project belong to it

## Where to find the code

- **Course app:** Module 06 → Checkpoint v0.6 has the complete code for comparison.
- **Code page:** *Module 06* tab, grouped by slide number.

## Assignment

See [ASSIGNMENT.md](./ASSIGNMENT.md).
