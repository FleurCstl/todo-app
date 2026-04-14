# Dev Plan - Sidebar Refactoring

Refactor the `Sidebar` component to improve modularity, maintainability, and testability according to the standards defined in `AGENTS.md`.

## 📋 Objectives
- [x] Decompose the monolithic `Sidebar.tsx` into smaller, focused sub-components.
- [x] Extract state and business logic into a custom hook `useSidebar`.
- [x] Centralize constants (icons, colors) into a dedicated file.
- [x] Ensure full test coverage for the main component AND all new sub-components/hooks.
- [x] Improve readability and JSDoc documentation.

## 🏗 Proposed Architecture

```text
Sidebar/
├── components/          # Sub-components
│   ├── SidebarHeader.tsx
│   ├── SidebarItem.tsx
│   ├── SidebarFolder.tsx
│   ├── SidebarFooter.tsx
│   └── modals/
│       ├── FolderModal.tsx
│       ├── ListModal.tsx
│       └── DeleteFolderModal.tsx
├── hooks/              # Component-specific logic
│   └── useSidebar.ts
├── constants/          # Shared constants
│   └── constants.ts
├── Sidebar.tsx         # Main entry point (orchestrator)
└── __tests__/          # Unified test directory
    ├── Sidebar.test.tsx
    ├── useSidebar.test.tsx
    └── ... (sub-component tests)
```

## 🛠 Step-by-Step Execution

### Phase 1: Preparation & Setup
- [x] Create directory structure (`components`, `hooks`, `constants`).
- [x] Initialize `DEVPLAN.md` (Self-reference: Done).

### Phase 2: Constants & Logic Extraction
- [x] Move `ICONS`, `ICON_MAP`, and `COLORS` to `constants/constants.ts`.
- [x] Extract state management and handlers into `hooks/useSidebar.ts`.
- [x] Write tests for `useSidebar.ts`.

### Phase 3: Sub-component Creation
- [x] **SidebarHeader**: Extract "TaskMaster" header.
- [x] **SidebarItem**: Create a reusable list item component.
- [x] **SidebarFolder**: Extract folder rendering logic.
- [x] **SidebarFooter**: Extract footer buttons.
- [x] **Modals**:
    - [x] `FolderModal`: For creating/naming folders.
    - [x] `ListModal`: For creating and editing lists.
    - [x] `DeleteFolderModal`: For the deletion confirmation workflow.
- [x] **Mandatory Testing**: Generated dedicated test files for every sub-component and hook:
    - [x] `SidebarHeader.test.tsx`
    - [x] `SidebarItem.test.tsx`
    - [x] `SidebarFolder.test.tsx`
    - [x] `SidebarFooter.test.tsx`
    - [x] `FolderModal.test.tsx`
    - [x] `ListModal.test.tsx`
    - [x] `DeleteFolderModal.test.tsx`
    - [x] `useSidebar.test.ts`

### Phase 4: Main Component Assembly
- [x] Update `Sidebar.tsx` to use `useSidebar` hook and sub-components.
- [x] Refactor styles to ensure consistency.

### Phase 5: Validation
- [x] Run `pnpm test` to ensure no regressions.
- [x] Run `pnpm lint` and fix any issues.
- [x] Final UI check.

## 🧪 Testing Strategy
- **Unit Tests**: Test each sub-component in isolation.
- **Hook Tests**: Test `useSidebar` for state transitions and handler calls.
- **Integration Tests**: Test the full `Sidebar` component to ensure coordination between hook and components.
- **Standards**: All tests must use `render`, `screen`, and `user-event` from Vitest/RTL.
