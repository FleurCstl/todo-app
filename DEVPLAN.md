# DEVPLAN: Refactor Tests for AGENTS.md Compliance

This plan tracks the progress of refactoring existing tests to meet the project's coding standards.

## Progress Checklist

- [x] **Phase 1: File Relocation**
  - [x] Move server route tests to `src/server/routes/__tests__/`
  - [x] Move shared schema tests to `src/shared/__tests__/`
  - [x] Move client App test to `src/client/__tests__/`
  - [x] Move all client component tests to their respective `__tests__/` subdirectories
- [x] **Phase 2: Code Refactoring**
  - [x] Update relative imports in all moved test files
  - [x] Add JSDoc to `describe` blocks in all test files
  - [x] Replace `any` usage with strict typing (especially for database mocks)
- [x] **Phase 3: Validation**
  - [x] Run `pnpm test` to ensure everything remains functional
  - [x] Run `pnpm lint` to verify code style compliance

## Current Status
- **Relocation**: Completed
- **Refactoring**: Completed
- **Validation**: Completed
