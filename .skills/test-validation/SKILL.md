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

### 1. Pre-Commit Verification
This skill MUST be executed before every commit. It acts as a mandatory gatekeeper.

### 2. Run Unit Tests
Execute the Vitest suite:
```bash
pnpm test
```

### 3. Handle Failures (MANDATORY)
If any test fails, the commit process **MUST be blocked**.
- **Self-Correction**: Proactively analyze the failure.
- **Fix**: Apply necessary fixes to the code or tests.
- **Re-verify**: Re-run `pnpm test` until all tests pass.
- **Do NOT bypass**: Never proceed with a commit if tests are failing.

### 4. Linting
Check for code style and potential errors:
```bash
pnpm lint
```
Fix all linting errors before committing. Do not ignore them with comments unless absolutely necessary.

### 5. Build Verification (Optional)
For significant changes, verify that the production build succeeds:
```bash
pnpm build
```

## Success Criteria
- [ ] Tests passed (`pnpm test`) before attempting a commit.
- [ ] Any failing tests were proactively fixed by the agent.
- [ ] Linting passed (`pnpm lint`) with zero errors.
- [ ] Typescript validation passes (if running build).
