---
name: git-commit
description: Workflow for finalizing tasks and committing changes following conventional commit standards. Use when a task is complete and ready for submission.
---

## Context
Standardized commit messages and clean code submissions are essential for maintainability and clear project history. Every commit must follow strict conventional formats and include co-author attribution.

## Prerequisites
- Successful completion of `test-validation` skill.
- No placeholder code or TODOs remaining.
- All linting and tests pass (`pnpm lint`, `pnpm test`).

## Core Workflow

### 1. Code Review & Cleanup
- Check for "TODO" or placeholder comments.
- Ensure all debug logs (`console.log`) are removed.
- Verify compliance with `AGENTS.md`.

### 2. Strategic Committing
- **Granular Commits**: Do not hesitate to make multiple commits. Separate different types of changes (e.g., `feat`, `fix`, `refactor`) into distinct commits to keep the history clear.
- **Atomic Changes**: Each commit should represent a single logical change.

### 3. Stage & Format
Stage relevant files for each logical unit:
```bash
git add [files]
```

### 4. Commit Message (Conventional Commits)
Respect the `commitlint` conventions:
- **Format**: `<type>(<scope>): <description>`
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Scope**: (Optional but recommended) The section of the codebase (e.g., `client`, `server`, `shared`, `db`).
- **Description**: Short, imperative, lowercase, no period at the end.

### 5. Co-Authoring
Every commit made by an AI agent must include a `Co-authored-by` trailer in the commit message body for proper attribution.
- **Format**: `Co-authored-by: NAME <EMAIL>`
- **Agent Attribution**: Use the identity provided in your system instructions (e.g., `Antigravity <antigravity@googlemind.com>`).

### 6. Validation Before Push
- **Ask for Approval**: You MUST explicitly ask the USER for validation before pushing any commits to GitHub.
- **Do NOT push automatically**.

## Success Criteria
- [ ] Commit message follows `<type>(<scope>): <description>` format.
- [ ] Changes are split into logical, granular commits where applicable.
- [ ] Each commit includes a `Co-authored-by` footer.
- [ ] USER validation is obtained before `git push`.
