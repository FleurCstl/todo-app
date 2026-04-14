---
name: api-route
description: Guide for adding new OpenAPI endpoints to the Hono backend and integrating them with the React frontend. Use when a feature requires a new API path or method.
---

## Context
Use this skill when you need to add a new functionality that requires server communication. It ensures that the API follows the OpenAPI specification and that the frontend remains in sync with the backend.

## Prerequisites
- Knowledge of the data structure (Database schema).
- Hono and @hono/zod-openapi installed.

## Core Workflow

### 1. Define Shared Schemas (Optional but Recommended)
If the schema is used by both frontend and backend, define it in `src/shared/schemas/`.
- Use `z.object().openapi('Name')` to ensure it appears in the OpenAPI docs.

### 2. Implement Server Route
In `src/server/routes/[feature].routes.ts`:
- Use `createRoute` from `@hono/zod-openapi`.
- Define `method`, `path`, `request` (body, params, query), and `responses`.
- Implement the handler using `db` from `../db`.

Example:
```typescript
todoRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: {
        content: { 'application/json': { schema: z.array(TodoSchema) } },
        description: 'Success',
      },
    },
  }),
  async (c) => {
    const results = await db.select().from(todos);
    return c.json(results, 200);
  }
);
```

### 3. Register Route
Ensure the routes are exported and registered in `src/server/index.ts`.

### 4. Create Frontend Service/Hook
In `src/client/hooks/use[Feature].ts` or a dedicated service file:
- Create a function or hook to fetch the data.
- User standard `fetch` or a client library if configured.

## Success Criteria
- [ ] Run `pnpm dev` and check `http://localhost:5173/api/docs` (if configured) to see the new endpoint.
- [ ] Ensure the frontend can successfully call the endpoint and handle the response.
- [ ] No linting errors in the new files.
