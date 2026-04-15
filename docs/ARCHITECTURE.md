# 🏛 Technical Architecture & Choices

This document outlines the architectural patterns and technical decisions made in this project.

## 🎯 Design Principles

1. **Single Source of Truth**: Data schemas are defined once in `src/shared/` and used across both frontend and backend.
2. **Strict Type Safety**: End-to-end type safety from the database to the UI.
3. **Modularity**: Components and logic are decomposed into small, testable units.
4. **Performance**: Minimal abstractions and fast runtimes (Hono + SQLite).

## 🛠 Technology Rationale

### Hono & `@hono/zod-openapi`
**Choice**: Hono instead of Express or Fastify.
**Why**:
- **Speed**: Hono is one of the fastest frameworks for the JS ecosystem.
- **Contract-First API**: By using `zod-openapi`, we generate OpenAPI documentation directly from our Zod schemas. This ensures the documentation is *never* out of sync with the actual implementation.
- **Type Safety**: Provides excellent TypeScript integration for request/response bodies.

### Drizzle ORM
**Choice**: Drizzle instead of Prisma or TypeORM.
**Why**:
- **TypeScript-First**: Drizzle feels like writing SQL but with full type safety.
- **No Heavy Generator**: Unlike Prisma, Drizzle doesn't require a heavy binary or complex generation step to work.
- **Relationship Performance**: It manages relationships efficiently without the "N+1" query problems often found in heavier ORMs.

### Tailwind CSS 4.0
**Choice**: Tailwind CSS 4.0.
**Why**:
- **Zero-Runtime CSS**: All styling is resolved at build time.
- **Modern Features**: version 4.0 brings significant performance improvements and a simplified engine.
- **Consistency**: Utility classes ensure a consistent design system across the entire application without writing custom CSS files for every component.

### Monorepo-style Structure
**Choice**: `src/{client,server,shared}` inside a single repository.
**Why**:
- **Simplicity**: No need for complex workspace management tools (like Lerna) for a small-to-medium project.
- **Easy Sharing**: Sharing Zod schemas between client and server is as simple as a local import.
- **Deployment**: Both client and server can be served from the same process in production (Vite dev server handles this during development).

## 🔄 Data Flow

1. **Database**: SQLite stores the relational data.
2. **Backend**: Hono routes handle business logic and query the DB via Drizzle.
3. **API Layer**: Zod-OpenAPI validates inputs and formats outputs.
4. **Shared Layer**: Zod schemas define the structure of resources (e.g., `Todo`, `Tag`).
5. **Frontend**: React components consume the API, using the same shared types to ensure data consistency.

## 🧪 Testing Strategy

We follow a strict "Test-Driven Development" approach for core logic:
- **Unit Tests**: For isolated functions in `helpers/` and `utils/`.
- **Component Tests**: Using React Testing Library to verify UI behavior.
- **Integration Tests**: For backend routes to ensure the API responds correctly to valid and invalid inputs.
