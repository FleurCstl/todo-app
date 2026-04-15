---
name: documentation-maintenance
description: Workflow for maintaining and updating project documentation (README.md, docs/, etc.). Use whenever a new feature is added, the technical stack changes, or at the end of a major task to ensure documentation reflects the current state of the product.
---

## Context
High-quality documentation is crucial for onboarding new developers and maintaining a clear product vision. The documentation should provide a comprehensive overview of the product, detailed feature descriptions, and the rationale behind technical decisions.

## Prerequisites
- Feature implementation is stable and tested.
- All technical choices have been finalized.

## Core Workflow

### 1. Document Product Vision & Features
- Explain what the product does from a user perspective.
- Detail the core features and user journeys.
- Keep the feature list up-to-date with recent additions.

### 2. Document Technical Architecture
- Describe the stack: Frontend (React/Vite/Tailwind), Backend (Hono), Database (Drizzle/SQLite).
- Explain the monorepo-style structure in `src/`.
- Detail the communication between parts (OpenAPI via zod-openapi).

### 3. Document Technical Rationales
- Don't just list technologies; explain *why* they were chosen.
  - e.g., "Hono was chosen for its lightweight nature and native support for OpenAPI/Zod, enabling a single source of truth for schemas."
  - e.g., "Drizzle ORM provides maximum type safety with minimal runtime overhead compared to heavier ORMs."

### 4. Update Strategy
- Every time a new feature is added, update the "Features" section in `README.md`.
- If a new architecture pattern is introduced (e.g., a new service, a state management change), document it in a dedicated file in `docs/` and link it from `README.md`.
- Ensure all setup instructions (`pnpm install`, `pnpm dev`, etc.) are accurate.

## SUCCESS CRITERIA
- [ ] `README.md` is current and accurately describes the latest features.
- [ ] Technical choices are explained with their specific benefits for this project.
- [ ] New developers can understand the "What", "How", and "Why" of the project by reading the documentation.
- [ ] All links within documentation are functional.
