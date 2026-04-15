# 📝 Modern Todo App

A high-performance, full-stack todo application built with a focus on developer experience, type safety, and modern web standards.

## 🚀 Product Overview

This application allows users to manage their daily tasks with an organized hierarchy and powerful tagging system.

### Core Features
- **Organized Hierarchy**: Group your task lists into Folders for better categorization.
- **Smart Lists**: Create multiple lists within folders to keep related tasks together.
- **Task Management**:
  - Track completion status.
  - Set deadlines for time-sensitive tasks.
  - Custom ordering support.
- **Tagging System**: Create reusable tags with custom colors and assign multiple tags to any task.
- **Responsive Design**: Fast and fluid UI built with Tailwind CSS 4.0.

## 🛠 Technical Stack

### Frontend
- **React + Vite**: For a lightning-fast development experience and optimized production bundles.
- **Tailwind CSS 4.0**: Modern utility-first styling with high performance.
- **Lucide React**: For consistent and beautiful iconography.

### Backend
- **Hono**: A small, simple, and ultra-fast web framework for the Edges.
- **OpenAPI / Swagger**: Fully documented API using `@hono/zod-openapi`.
- **Drizzle ORM**: The next-generation TypeScript ORM for maximum type safety.

### Database
- **SQLite**: Local, file-based database for simplicity and speed.

## 📂 Project Structure

```text
src/
├── client/     # React frontend application
├── server/     # Hono API and database logic
│   └── db/     # Drizzle schema and migrations
└── shared/     # Shared Zod schemas and TypeScript types
```

## 📘 Documentation & Rationale

For a deep dive into our technical choices and architectural patterns, see:
- [Technical Architecture & Choices](./docs/ARCHITECTURE.md)
- [Agent Guidelines (for AI assistants)](./AGENTS.md)

## ⚡️ Quick Start

1. **Install dependencies**:
   ```bash
   pnpm install
   ```
2. **Setup database**:
   ```bash
   npx drizzle-kit push
   ```
3. **Start development server**:
   ```bash
   pnpm dev
   ```

## 🧪 Testing

We value reliability. All features are covered by tests using **Vitest** and **React Testing Library**.
```bash
pnpm test
```
