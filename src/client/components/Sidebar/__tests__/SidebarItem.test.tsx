import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SidebarItem } from '../components/SidebarItem';

/**
 * SidebarItem component tests.
 */
describe('SidebarItem', () => {
  const mockList = { id: 1, title: 'Test List', folderId: null, icon: 'List', color: '#ff0000' };
  const mockStats = { total: 10, completed: 5, percentage: 50 };

  it('renders title and stats correctly', () => {
    render(
      <SidebarItem 
        list={mockList} 
        isActive={false} 
        onSelect={vi.fn()} 
        onEdit={vi.fn()} 
        stats={mockStats} 
      />
    );
    expect(screen.getByText('Test List')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<SidebarItem list={mockList} isActive={false} onSelect={onSelect} onEdit={vi.fn()} />);
    
    // Using getAllByRole because there are multiple buttons (the main one and the edit one)
    const buttons = screen.getAllByRole('button');
    const mainButton = buttons.find(b => b.textContent?.includes('Test List'));
    
    if (mainButton) fireEvent.click(mainButton);
    expect(onSelect).toHaveBeenCalledWith(mockList.id);
  });

  it('calls onEdit when the pencil icon is clicked', () => {
    const onEdit = vi.fn();
    render(<SidebarItem list={mockList} isActive={false} onSelect={vi.fn()} onEdit={onEdit} />);
    const editButton = screen.getByTitle(/modifier la liste/i);
    fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalled();
  });

  it('applies active styles when isActive is true', () => {
    render(<SidebarItem list={mockList} isActive={true} onSelect={vi.fn()} onEdit={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    const mainButton = buttons.find(b => b.textContent?.includes('Test List'));
    expect(mainButton).toHaveClass('bg-primary/10');
  });
});
