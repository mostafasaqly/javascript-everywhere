# Module 04: Forms & Data

**Day 4** · TaskFlow **v0.4** · Slides start at **slide 109** in `react-typescript-taskflow.pptx`

## What you build

A real form to add and edit tasks with validation, plus search and a status filter.

## Lessons

| # | Lesson | By the end you can |
|---|---|---|
| 01 | Controlled inputs | Connect an input to state so React owns its value. |
| 02 | Forms & onSubmit | Add a task with Enter and `preventDefault`. |
| 03 | Many fields, one state | Manage four fields with one `TaskFormValues` state and one change handler. |
| 04 | Form validation | Block short titles and show an accessible error. |
| 05 | Search & filters | Filter by text and status by computing `visibleTasks`. |
| 06 | Edit a task | Reuse `TaskForm` for editing with `initialValues` and `submitLabel`. |

## Setup

No new packages.

## Files added or changed

- `src/components/TaskForm.tsx`
- `src/components/TaskFilters.tsx`
- `src/utils/taskForm.ts`: `fromFormValues`, `toFormValues`
- `src/types/task.ts`: `TaskFormValues`
- `src/components/TaskCard.tsx`: Edit button
- `src/components/TaskList.tsx`: form, filters, editing

## Key ideas

- Controlled input = `value` from state + `onChange` that updates it.
- `event.preventDefault()` stops the page from reloading on submit.
- One handler for many fields: `setValues({ ...values, [name]: value })`.
- Store filter conditions in state; compute the filtered list.
- `Omit<Task, 'id'>` removes properties from a type.

## Checkpoint v0.4

Before the next module, check every item:

- [ ] The form adds a task with all fields using Enter
- [ ] A title shorter than 3 characters shows an error
- [ ] Search and status filter work together
- [ ] Edit opens the form with current values; Save and Cancel work
- [ ] No state holds the filtered list

## Where to find the code

- **Course app:** Module 04 → Checkpoint v0.4 has the complete code for comparison.
- **Code page:** *Module 04* tab, grouped by slide number.

## Assignment

See [ASSIGNMENT.md](./ASSIGNMENT.md).
