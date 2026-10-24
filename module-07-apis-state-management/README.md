# Module 07: APIs & State Management

**Day 7** · TaskFlow **v0.7** · Slides start at **slide 173** in `react-typescript-taskflow.pptx`

## What you build

Tasks come from a REST API through a typed client, shared app-wide with Context and useReducer, with loading and error screens, a dashboard and a demo sign-in.

## Lessons

| # | Lesson | By the end you can |
|---|---|---|
| 01 | HTTP, REST & a test server | Map GET, POST, PUT and DELETE to TaskFlow and run json-server. |
| 02 | Typed API client | Write `request<T>()` and typed task functions with `fetch` and `async/await`. |
| 03 | Context API | Share tasks with `TasksProvider` and `useTasksContext`. |
| 04 | useReducer & the API | Move task updates into a typed reducer and call the API. |
| 05 | Loading & error states | Show a skeleton while loading and an error with *Try again*. |
| 06 | Dashboard statistics | Build `/dashboard` with stat cards. |
| 07 | Authentication concepts | Add a demo login, protected routes and logout. |

## Setup

```bash
npm install -D json-server@0.17.4
```

Add a script in `package.json`:

```json
"api": "json-server --watch db.json --port 3001"
```

Run the API and the app in **two terminals**:

```bash
npm run api   # http://localhost:3001/tasks
npm run dev   # http://localhost:5173
```

Keep version 0.17.4: newer versions use text ids.

## Files added or changed

- `db.json`: the API data
- `src/api/tasks.ts`: typed client
- `src/state/tasksReducer.ts`, `tasksContext.ts`, `TasksProvider.tsx`
- `src/state/authContext.ts`, `AuthProvider.tsx`, `src/types/auth.ts`
- `src/components/LoadingState.tsx`, `StatCard.tsx`, `ProtectedRoute.tsx`
- `src/pages/DashboardPage.tsx`, `LoginPage.tsx`
- `src/hooks/useTasks.ts`: deleted

## Key ideas

- REST: the URL is the noun, the HTTP method is the verb.
- `fetch` doesn't throw on 404 or 500; check `response.ok`.
- Generics type the response: `request<Task[]>('/tasks')`.
- Context shares data without passing props through every level.
- A reducer with a discriminated union describes every possible change.
- Real authentication needs a server; never store passwords in the browser.

## Checkpoint v0.7

Before the next module, check every item:

- [ ] Tasks load from `http://localhost:3001/tasks`
- [ ] Stopping the API shows an error with *Try again*
- [ ] Add, edit, toggle and delete update `db.json`
- [ ] `/dashboard` shows totals, completed and overdue
- [ ] Signed-out users are sent to `/login`

## Where to find the code

- **Course app:** Module 07 → Checkpoint v0.7 has the complete code for comparison.
- **Code page:** *Module 07* tab, grouped by slide number.

## Assignment

See [ASSIGNMENT.md](./ASSIGNMENT.md).
