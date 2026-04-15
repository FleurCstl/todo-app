# AGENTS.md

This project contains specific instructions and constraints for AI coding assistants. All AI agents MUST read and follow these guidelines to ensure consistency and quality.

## 🚀 Project Overview

This is a modern full-stack todo application designed with performance and developer experience in mind.

- **Frontend**: React + Vite + Tailwind CSS 4.0
- **Backend**: Hono (running on Vite dev server)
- **Database**: SQLite with Drizzle ORM
- **API**: OpenAPI-compliant via `@hono/zod-openapi`
- **Architecture**: Monorepo-style structure inside `src/`:
  - `src/client/`: Frontend application code.
  - `src/server/`: Backend API and database logic.
  - `src/shared/`: Shared types and Zod schemas.

## 🛠 Setup & Commands

- **Install dependencies**: `pnpm install`
- **Start development server**: `pnpm dev` (Starts both client and server)
- **Build for production**: `pnpm build`
- **Run tests**: `pnpm test` (Uses Vitest)
- **Lint code**: `pnpm lint`

### Database Management (Drizzle)

- **Push schema changes**: `npx drizzle-kit push` (Syncs `src/server/db/schema.ts` with `sqlite.db`)
- **Generate migrations**: `npx drizzle-kit generate`
- **Studio (GUI)**: `npx drizzle-kit studio`

## 🎨 Coding Standards

### General Rules

- **TypeScript**: Always use strict typing. Never use `any`.
- **Naming**: Use camelCase for variables/functions, PascalCase for components/types.
- **Imports**: Prefer absolute-like paths or clear relative paths. Organize imports (built-ins, external, internal).
- **Documentation**: Use JSDoc for all functions and explain complex logic with inline comments.

### Backend (Hono)

- Use `@hono/zod-openapi` for defining routes and schemas to maintain a single source of truth.
- Controllers should be modular and kept in `src/server/`.

### Frontend (React)

- **Components**: Functional components with Hooks.
- **Modularity & Logic**: Follow the **Logic Organization** skill for component decomposition and logic extraction into `helpers/`, `hooks/`, or `utils/`. Every extracted piece of logic MUST have its own test file.
- **Styling**: Tailwind CSS 4.0. Avoid inline styles unless dynamic.
- **Icons**: Use `lucide-react`.
- **State Management**: Keep it simple (React State/Context) unless specified otherwise.

### Database (Drizzle)

- Schema definitions are in `src/server/db/schema.ts`.
- Prefer typesafe queries using the Drizzle instance.

## 🧪 Testing Instructions

- Tests are located alongside the code in specific `__tests__` directories.
- **Mandatory Generation**: Every new frontend component and backend logic/route MUST include a corresponding test file.
- Always run `pnpm test` before submitting changes.
- For UI tests, use React Testing Library (configured with Vitest).

## 📝 PR Guidelines

- **Conventional Commits**: All commits must follow the `commitlint` convention: `<type>(<scope>): <description>`.
- **Granularity**: Prefer multiple small, logical commits over one giant commit.
- **Verification**: Ensure `pnpm lint` and `pnpm test` pass before committing.
- **Documentation**: Document any new API endpoints or significant architectural changes here or in relevant docstrings.

## 🤖 Instructions for AI Agents

You are an expert developer working on this codebase. You MUST adhere to the following rules:

1. **Rule Enforcement**: Always check this file before starting a task to ensure compliance with the tech stack and coding standards.
2. **Context Awareness**: Use `src/shared/` schemas as the single source of truth for both frontend and backend.
3. **Execution**: When asked to run tests or migrations, use the `pnpm` commands defined in the [Setup & Commands](#-setup--commands) section.
4. **Consistency**: Follow the existing patterns for Hono routes and React components. Do not introduce new libraries without asking.
5. **Code Hygiene**: Proactively check for dead code, unused imports, or obsolete components. If you find any, REMOVE them immediately without being asked.
6. **No Placeholders**: Never use placeholders or "TODO" comments in code changes unless explicitly requested. Provide complete, working implementations.
7. **Clean Diffs**: Produce focused changes. Run `pnpm lint` after your modifications to ensure no linting errors were introduced.
8. **Documentation**: Every function MUST have a descriptive JSDoc comment. Complicated logic MUST be explained with inline comments to aid maintainability.
9. **Test-Driven Development**: Always generate test files for any new frontend component or backend feature. Ensure all tests pass before completing the task.
10. **Logic & Modularity**: Adhere strictly to the **Logic Organization** skill. Decompose "mega-components", extract logic into dedicated sub-folders, and generate mandatory tests for all extracted units.
11. **Git Commit Hygiene**: 
    - Follow the `git-commit` skill strictly.
    - Use granular commits.
    - Every commit MUST include a `Co-authored-by` trailer using the current agent's identity (e.g., `Antigravity <antigravity@googlemind.com>`).
    - **NEVER** push to GitHub without explicit USER validation.
