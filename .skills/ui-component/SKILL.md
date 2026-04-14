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

### 1. Component Creation
Place components in `src/client/components/` or a feature-specific subdirectory.
- Use functional components with hooks.
- Prefix UI-agnostic components with `ui/` (e.g., `src/client/components/ui/Button.tsx`).

### 2. Styling with Tailwind 4.0
- Avoid standard colors like `red-500`. Use curated palettes if available or HSL/OKLCH values for premium feel.
- Implement hover states and subtle micro-animations.
- Use `cn` (classnames merge) utility if available for dynamic styles.

### 3. Icons
- Use `lucide-react` for all icons.
- Ensure consistent sizing (e.g., `size={20}` or via CSS classes).

Example:
```tsx
import { Pencil } from 'lucide-react';

export const EditButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="p-2 transition-all duration-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 hover:text-indigo-600 active:scale-95"
  >
    <Pencil size={18} />
  </button>
);
```

## Success Criteria
- [ ] Component is responsive and looks premium.
- [ ] Accessibility: Interactive elements have descriptive IDs and aria-labels.
- [ ] No inline styles unless strictly necessary for dynamic values.
