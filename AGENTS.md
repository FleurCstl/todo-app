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

Always follow the specialized workflows defined in the `.skills/` directory for task-specific instructions (UI, API, DB, logic organization, etc.).

## ⚠️ Critical Rules

1. **No Placeholders**: Never use TODOs or placeholders in code.
2. **Mandatory Tests**: Every new feature, UI component, or extracted logic MUST have a test.
3. **Pre-Commit Check**: Always run `test-validation` before committing.
4. **User Validation**: Explicit approval is required before any `git push`.
