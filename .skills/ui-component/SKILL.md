---
name: ui-component
description: Standards for creating high-quality, premium React components using Tailwind CSS 4.0 and Lucide icons. Use when building new UI elements or refactoring existing ones.
---

## Context

Use this skill to ensure that all UI components follow the project's premium aesthetic: vibrant colors, smooth transitions, and modern typography.

## Prerequisites

- Tailwind CSS 4.0 configured.
- `lucide-react` available for iconography.

## Core Workflow

### 1. Component Modularity & Factorization

- **Single Responsibility**: Each component must have a clear, single responsibility.
- **Component Splitting**: If a component grows beyond ~150 lines or contains too much UI logic, split it into smaller sub-components.
- **Directory-Based Architecture (Local Modules)**: If a component includes other components, hooks, or styles that are **only used by that parent**, follow the `Sidebar` pattern:
  - Create a directory named after the component (e.g., `src/client/components/Sidebar/`).
  - `ComponentName.tsx`: The main entry point.
  - `components/`: Sub-components used exclusively by the main component.
  - `hooks/`: Custom hooks used exclusively by the main component.
  - `helpers/`: Custom helpers used exclusively by the main component.
  - `utils/`: Custom utils used exclusively by the main component.
  - `__tests__/`: All tests for the main component and its sub-parts.
- **Why?**: This prevents the root `src/client/components/` directory from becoming a "junk drawer" of context-specific files and keeps related logic together.
- **Logic Extraction**: Extract complex state management or data fetching into custom hooks or utility functions. Use the `hooks/`, `helpers/`, or `utils/` subdirectories within the component's folder if it's local logic.
- **Avoid Prop Drilling**: Use context or composition where it makes sense to avoid deep prop drilling in complex component trees.

### 2. Component Creation

Place components in `src/client/components/` or a feature-specific subdirectory.

- Use functional components with hooks.
- Prefix UI-agnostic components with `ui/` (e.g., `src/client/components/ui/Button.tsx`).

### 3. Styling with Tailwind 4.0

- Avoid standard colors like `red-500`. Use curated palettes if available or HSL/OKLCH values for premium feel.
- Implement hover states and subtle micro-animations.
- Use `cn` (classnames merge) utility if available for dynamic styles.

### 4. Icons

- Use `lucide-react` for all icons.
- Ensure consistent sizing (e.g., `size={20}` or via CSS classes).

Example:

```tsx
import { Pencil } from "lucide-react";
import { Tooltip } from "./ui/Tooltip"; // Example path

export const EditButton = ({ onClick }: { onClick: () => void }) => (
  <Tooltip content="Edit Task">
    <button
      onClick={onClick}
      aria-label="Edit task"
      className="p-3 m-1 transition-all duration-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 hover:text-indigo-600 active:scale-95 flex items-center justify-center"
    >
      <Pencil size={20} />
    </button>
  </Tooltip>
);
```

### 5. Accessibility & Tooltips

- Every interactive element without a visible text label (e.g., an icon-only button) **MUST** have a Tooltip component wrapping it to provide context.
- Use `aria-label` or `aria-labelledby` for all interactive elements to ensure screen reader Compatibility.
- Ensure keyboard navigability (focus states, `tabIndex`).

### 6. Mobile-Friendly Design

- Ensure touch targets are at least `44x44px` for mobile devices.
- Use responsive Tailwind classes (`sm:`, `md:`, `lg:`) to adapt layouts for different screen sizes.
- Prioritize ease of use on touch screens (e.g., avoiding hover-only critical actions without mobile alternatives).

### 7. Mandatory Component Testing

Every UI component **MUST** have a corresponding test file to ensure visual and functional correctness.

- **Location**: Place tests in a `__tests__/` directory adjacent to the component.
- **Tools**: Use `vitest` and `@testing-library/react`.
- **Coverage**: Test default rendering, interactivity (clicks, inputs), and accessibility (ARIA roles).

Example: `EditButton/__tests__/EditButton.test.tsx`

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EditButton } from "../EditButton";

describe("EditButton", () => {
  it("renders with correct icon and tooltip", () => {
    render(<EditButton onClick={() => {}} />);
    expect(screen.getByLabelText(/edit task/i)).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<EditButton onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Success Criteria

- [ ] **Modularity**: Component follows the directory-based architecture if it has local sub-components or hooks. Main file is split if it exceeds logic thresholds. No monolithic files.
- [ ] Component is fully responsive and mobile-friendly (large touch targets, adaptive layout).
- [ ] Accessibility: Interactive elements have descriptive IDs, `aria-label`, and are keyboard-navigable.
- [ ] Tooltips: Icon-only buttons or label-less elements are wrapped in a Tooltip.
- [ ] Premium Aesthetics: Vibrant colors, smooth transitions, and modern typography are used.
- [ ] **Automated Testing**: Comprehensive tests exist in a `__tests__/` directory. Tests cover rendering and critical user interactions.
- [ ] No inline styles unless strictly necessary for dynamic values.
