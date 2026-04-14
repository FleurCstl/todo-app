---
name: db-schema
description: Procedures for updating the SQLite database schema using Drizzle ORM. Use when adding new tables, columns, or changing relationships.
---

## Context
Use this skill whenever you need to persist new types of data or modify the database structure. It ensures the local development database remains in sync with the TypeScript schema.

## Prerequisites
- Drizzle Kit installed and configured in `drizzle.config.ts`.
- `sqlite.db` file available in the root.

## Core Workflow

### 1. Update Schema Definition
Modify `src/server/db/schema.ts` with the desired changes.
- Use Drizzle-specific column types (e.g., `integer`, `text`, `timestamp`).
- Define relationships using `relations` from `drizzle-orm`.

### 2. Push Changes (Local Development)
Run the following command to sync the schema with your local database:
```bash
npx drizzle-kit push
```
*Note: In this project, we prefer 'push' for fast local iteration over 'generate' if possible, as specified in AGENTS.md.*

### 3. Verify Changes
Launch Drizzle Studio to inspect the database:
```bash
npx drizzle-kit studio
```
Verify that the new tables/columns are correctly created and have the expected types.

## Success Criteria
- [ ] `npx drizzle-kit push` completes without errors.
- [ ] Schema changes reflected in `src/server/db/schema.ts` match the database state.
- [ ] Data can be inserted and queried using the new schema.
