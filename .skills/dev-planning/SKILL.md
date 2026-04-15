---
name: dev-planning
description: Workflow for planning new features or significant changes using a DEVPLAN.md file. Use whenever starting a new feature.
---

## Context
A structured development plan helps ensure all steps (implementation, testing, documentation, cleanup) are completed correctly. The `DEVPLAN.md` serves as a temporary roadmap that must be fully executed before changes are committed.

## Core Workflow

### 1. Initialization
Whenever a new feature or significant change is requested:
- Create a `DEVPLAN.md` file in the root of the project.
- List all necessary steps, including:
  - Backend changes (models, routes, shared schemas).
  - Frontend changes (components, hooks, state).
  - Tests (unit, integration).
  - Documentation updates (`README.md`, `docs/`).
  - Final cleanup and linting.

### 2. Execution & Tracking
- As you complete each task, update `DEVPLAN.md` by checking the corresponding checkbox (`[x]`).
- Do not move to the next major block of work until the current one is validated (e.g., tests pass for that block).

### 3. Finalization & Commit
- Before running the `git-commit` skill, check the completion status of `DEVPLAN.md`.
- **Completed**: If ALL tasks are checked (`[x]`), the `DEVPLAN.md` file MUST be deleted before committing.
- **In Progress**: If some tasks are NOT checked, the `DEVPLAN.md` file MUST be included in the commit to track progress.

## Success Criteria
- [ ] `DEVPLAN.md` is created at the start of the task.
- [ ] `DEVPLAN.md` is updated regularly and committed if the work is still in progress.
- [ ] `DEVPLAN.md` is deleted from the filesystem only when all tasks are completed and ready for the final commit.
