# 🤖 AI Agent Guidelines (AGENTS.md)

This project is optimized for AI assistance. These guidelines and workflows ensure consistency, quality, and maintainability.

## 🚀 Project Overview

- **Frontend**: React + Vite + Tailwind CSS 4.0
- **Backend**: Hono (running on Vite dev server)
- **Database**: SQLite with Drizzle ORM
- **API**: OpenAPI-compliant via `@hono/zod-openapi`
- **Architecture**: Monorepo inside `src/`:
  - `src/client/`: Frontend application code.
  - `src/server/`: Backend API and database logic.
  - `src/shared/`: Single source of truth (schemas, types).

## 🛠 Quick Reference & Commands

- **Dev**: `pnpm dev`
- **Tests**: `pnpm test`
- **Lint**: `pnpm lint`
- **DB**: `npx drizzle-kit push` (Sync schema to DB)

## 🎨 Core Principles

- **TypeScript**: Strict typing required. **Never use `any`**.
- **Documentation**: JSDoc for all functions; inline comments for complex logic.
- **Naming**: camelCase for variables/functions, PascalCase for components/types.
- **Absolute Imports**: Prefer absolute-like paths or clear relative paths.

## 🧩 Specialized Workflows (Skills)

For detailed instructions on specific tasks, use the corresponding skill in `.skills/`:

| Skill | Use When... |
| :--- | :--- |
| [`ui-component`](.skills/ui-component/SKILL.md) | Creating/refactoring UI with Tailwind & Lucide. |
| [`logic-organization`](.skills/logic-organization/SKILL.md) | Decomposing components & extracting hooks/helpers. |
| [`api-route`](.skills/api-route/SKILL.md) | Adding new OpenAPI routes or integration. |
| [`db-schema`](.skills/db-schema/SKILL.md) | Updating the Drizzle database schema. |
| [`test-validation`](.skills/test-validation/SKILL.md) | Running tests and ensuring quality (Mandatory). |
| [`git-commit`](.skills/git-commit/SKILL.md) | Finalizing a task and committing (Conventional Commits). |
| [`dev-planning`](.skills/dev-planning/SKILL.md) | Starting a new feature with a `DEVPLAN.md`. |
| [`documentation-maintenance`](.skills/documentation-maintenance/SKILL.md) | Updating README or docs. |
| [`dead-code-fixer`](.skills/dead-code-fixer/SKILL.md) | Cleaning up unused code. |

## ⚠️ Critical Rules

1. **No Placeholders**: Never use TODOs or placeholders in code.
2. **Mandatory Tests**: Every new feature or extracted logic MUST have a test.
3. **Pre-Commit Check**: Always run `test-validation` before committing.
4. **User Validation**: Explicit approval is required before any `git push`.
