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
import { Tooltip } from './ui/Tooltip'; // Example path

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

### 4. Accessibility & Tooltips
- Every interactive element without a visible text label (e.g., an icon-only button) **MUST** have a Tooltip component wrapping it to provide context.
- Use `aria-label` or `aria-labelledby` for all interactive elements to ensure screen reader Compatibility.
- Ensure keyboard navigability (focus states, `tabIndex`).

### 5. Mobile-Friendly Design
- Ensure touch targets are at least `44x44px` for mobile devices.
- Use responsive Tailwind classes (`sm:`, `md:`, `lg:`) to adapt layouts for different screen sizes.
- Prioritize ease of use on touch screens (e.g., avoiding hover-only critical actions without mobile alternatives).

## Success Criteria
- [ ] Component is fully responsive and mobile-friendly (large touch targets, adaptive layout).
- [ ] Accessibility: Interactive elements have descriptive IDs, `aria-label`, and are keyboard-navigable.
- [ ] Tooltips: Icon-only buttons or label-less elements are wrapped in a Tooltip.
- [ ] Premium Aesthetics: Vibrant colors, smooth transitions, and modern typography are used.
- [ ] No inline styles unless strictly necessary for dynamic values.
