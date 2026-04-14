import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SidebarHeader } from '../components/SidebarHeader';

/**
 * SidebarHeader component tests.
 */
describe('SidebarHeader', () => {
  it('renders the branding and subtitle correctly', () => {
    render(<SidebarHeader />);
    expect(screen.getByText('TaskMaster')).toBeInTheDocument();
    expect(screen.getByText(/your personal workspace/i)).toBeInTheDocument();
  });
});
