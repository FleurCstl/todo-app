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

### 3. Pre-Commit Cleanup
- Before running the `git-commit` skill, check if all items in `DEVPLAN.md` are completed.
- **MANDATORY**: The `DEVPLAN.md` file MUST be deleted before committing.
- **BLOCKER**: If any task is not checked, do not delete the file and do not proceed with the commit. Fix the missing items first.

## Success Criteria
- [ ] `DEVPLAN.md` is created at the start of the task.
- [ ] All checkboxes in `DEVPLAN.md` are checked before completion.
- [ ] `DEVPLAN.md` is deleted from the filesystem before the final commit.
