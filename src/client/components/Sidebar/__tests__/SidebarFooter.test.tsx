import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SidebarFooter } from '../components/SidebarFooter';

/**
 * SidebarFooter component tests.
 */
describe('SidebarFooter', () => {
  it('calls respective handlers when buttons are clicked', () => {
    const onCreateList = vi.fn();
    const onCreateFolder = vi.fn();
    const onManageTags = vi.fn();

    render(
      <SidebarFooter 
        onCreateList={onCreateList} 
        onCreateFolder={onCreateFolder} 
        onManageTags={onManageTags} 
      />
    );

    fireEvent.click(screen.getByText('List'));
    expect(onCreateList).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Folder'));
    expect(onCreateFolder).toHaveBeenCalled();

    fireEvent.click(screen.getByText(/manage tags/i));
    expect(onManageTags).toHaveBeenCalled();
  });
});
