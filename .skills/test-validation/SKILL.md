---
name: test-validation
description: Procedures for running tests and verifying code quality. Use before submitting any changes or when debugging.
---

## Context
Quality assurance is critical. This skill ensures that new changes do not break existing functionality and that the codebase remains clean and maintainable.

## Prerequisites
- `pnpm` installed.
- Vitest configured.

## Core Workflow

### 1. Run Unit Tests
Execute the Vitest suite:
```bash
pnpm test
```
Ensure all tests pass. If failures occur, debug before proceeding.

### 2. Linting
Check for code style and potential errors:
```bash
pnpm lint
```
Fix all linting errors. Do not ignore them with comments unless absolutely necessary.

### 3. Build Verification (Optional)
For significant changes, verify that the production build succeeds:
```bash
pnpm build
```

## Success Criteria
- [ ] `pnpm test` returns 0 exit code.
- [ ] `pnpm lint` returns no errors.
- [ ] Typescript validation passes (if running build).
