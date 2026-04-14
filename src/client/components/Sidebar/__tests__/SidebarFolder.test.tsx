import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SidebarFolder } from '../components/SidebarFolder';

/**
 * SidebarFolder component tests.
 */
describe('SidebarFolder', () => {
  const mockFolder = { id: 1, name: 'Work' };
  const mockLists = [
    { id: 1, title: 'Project A', folderId: 1, icon: 'List', color: '#000' },
  ];
  const mockListStats = {
    1: { total: 10, completed: 5, percentage: 50 },
  };

  const defaultProps = {
    folder: mockFolder,
    lists: mockLists,
    activeListId: null,
    isExpanded: true,
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onSelectList: vi.fn(),
    onEditList: vi.fn(),
    listStats: mockListStats,
  };

  it('renders folder name and nested lists when expanded', () => {
    render(<SidebarFolder {...defaultProps} />);
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Project A')).toBeInTheDocument();
  });

  it('calls onToggle when folder name is clicked', () => {
    const onToggle = vi.fn();
    render(<SidebarFolder {...defaultProps} onToggle={onToggle} />);
    fireEvent.click(screen.getByText('Work'));
    expect(onToggle).toHaveBeenCalledWith(mockFolder.id);
  });

  it('calls onDelete when trash icon is clicked', () => {
    const onDelete = vi.fn();
    render(<SidebarFolder {...defaultProps} onDelete={onDelete} />);
    const deleteButton = screen.getByTitle(/supprimer le dossier/i);
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalled();
  });

  it('shows "Empty folder" when there are no lists', () => {
    render(<SidebarFolder {...defaultProps} lists={[]} />);
    expect(screen.getByText(/empty folder/i)).toBeInTheDocument();
  });
});
