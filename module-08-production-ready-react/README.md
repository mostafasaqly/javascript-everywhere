# Module 08: Production-Ready React

**Day 8** · TaskFlow **v1.0** · Slides start at **slide 194** in `react-typescript-taskflow.pptx`

## What you build

A fast, accessible, tested TaskFlow with environment variables, a production build and a live deployment.

## Lessons

| # | Lesson | By the end you can |
|---|---|---|
| 01 | Performance basics | Measure with the Profiler and lazy-load the dashboard. |
| 02 | Accessibility | Add a skip link, clear focus styles and descriptive button labels. |
| 03 | Component testing | Set up Vitest and Testing Library and test TaskCard. |
| 04 | Form testing | Test validation and submission in TaskForm. |
| 05 | Environment variables | Move the API URL to `VITE_API_URL`. |
| 06 | Production build & deploy | Test, build, preview and deploy with SPA redirects. |
| 07 | Final project review | Review TaskFlow against a quality checklist and plan your next project. |

## Setup

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event
```

Add `"test": "vitest"` to `scripts`, then:

```bash
npm run test -- --run   # run tests once
npm run build           # type-check and build
npm run preview         # try the production build
```

Create `.env.development` with `VITE_API_URL=http://localhost:3001`. The deployed site needs a hosted API URL.

## Files added or changed

- `src/App.tsx`: lazy `DashboardPage`
- `src/layouts/AppLayout.tsx`: skip link
- `src/components/TaskCard.tsx`: aria-labels
- `vite.config.ts`: test settings
- `src/test/setup.ts`
- `src/components/TaskCard.test.tsx`, `TaskForm.test.tsx`
- `src/vite-env.d.ts`, `.env.development`, `src/api/tasks.ts`
- `public/_redirects` (Netlify)

## Key ideas

- Measure before optimising; lazy-load what isn't needed on first load.
- Every control needs an accessible name; focus must always be visible.
- Test what the user sees: roles, labels and text.
- Only variables starting with `VITE_` reach the browser. Never put secrets there.
- A single-page app needs a redirect so deep links load `index.html`.

## Checkpoint v1.0

Before the next module, check every item:

- [ ] All tests pass
- [ ] `npm run build` passes and the dashboard is a separate file
- [ ] The skip link and aria-labels work with the keyboard
- [ ] The API URL comes from `VITE_API_URL`
- [ ] TaskFlow is deployed and the link works on a phone

## Where to find the code

- **Course app:** Module 08 → Checkpoint v1.0 has the complete code for comparison.
- **Code page:** *Module 08* tab, grouped by slide number.

## Assignment

See [ASSIGNMENT.md](./ASSIGNMENT.md).
