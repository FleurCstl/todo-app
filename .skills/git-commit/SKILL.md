---
name: git-commit
description: Workflow for finalizing tasks and committing changes following conventional commit standards. Use when a task is complete and ready for submission.
---

## Context
Standardized commit messages and clean code submissions are essential for maintainability and clear project history.

## Prerequisites
- Successful completion of `test-validation` skill.
- No placeholder code or TODOs remaining.

## Core Workflow

### 1. Code Review & Cleanup
- Check for "TODO" or placeholder comments.
- Ensure all debug logs (`console.log`) are removed.
- Verify compliance with `AGENTS.md`.

### 2. Stage Changes
Stage only the relevant files:
```bash
git add [files]
```

### 3. Commit with Conventional Format
Use the following prefixes:
- `feat:` for new features.
- `fix:` for bug fixes.
- `docs:` for documentation changes.
- `style:` for formatting/styling.
- `refactor:` for code changes that neither fix a bug nor add a feature.
- `test:` for adding or updating tests.

Example:
```bash
git commit -m "feat: add list editing functionality with pencil icon"
```

## Success Criteria
- [ ] Commit message follows the conventional format.
- [ ] Only relevant files are staged and committed.
- [ ] `AGENTS.md` guidelines are fully respected.
