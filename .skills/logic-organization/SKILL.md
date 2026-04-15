# 🧩 Logic Organization & Component Decomposition

This skill guides the process of breaking down complex React components and organizing their logic into a modular, testable structure.

## 🎯 Objectives

- Maintain highly readable and maintainable UI code.
- Ensure business logic is decoupled from presentation.
- Guarantee 100% test coverage for all extracted logic.
- Prevent the creation of "mega-components".

## 🛠 Workflow

### 1. Analysis & Decomposition
- **Identify complexity**: If a component has multiple responsibilities (e.g., fetching data + complex form handling + complex UI rendering), it must be split.
- **Extract Sub-components**: Move logical UI chunks into smaller functional components.
- **Rule of Thumb**: Aim for components under 150 lines. If it exceeds this, look for extraction opportunities.

### 2. Logic Extraction
Extract functions and hooks into dedicated sub-directories within the component's folder:

- **`hooks/`**: For component-specific `useQuery`, `useForm`, or complex `useEffect`/`useState` logic.
- **`helpers/`**: For data transformation, formatting, or pure functions that support the component.
- **`utils/`**: For general-purpose utilities used within the component context.

### 3. Shared vs. Local
- **Local**: If it's only used by one component, keep it in the component's sub-folders.
- **Shared**: If shared across the app, move to `src/client/hooks/` or `src/client/utils/`.

### 4. Mandatory Testing
- Every file created in `hooks/`, `helpers/`, or `utils/` **MUST** have a corresponding test file in a `__tests__` directory within that folder.
- Example: `hooks/useTodoFilters.ts` -> `hooks/__tests__/useTodoFilters.test.ts`.

## 🤖 AI Instructions

1. **Detection**: Upon receiving a task involving a frontend component, analyze its size and complexity.
2. **Proactive Refactoring**: Do not wait for instructions to refactor. If you see logic that can be extracted, do it.
3. **Structure Creation**: Create the `helpers/`, `hooks/`, or `utils/` folders as needed.
4. **Test Generation**: Automatically generate comprehensive Vitest tests for all extracted logic.
