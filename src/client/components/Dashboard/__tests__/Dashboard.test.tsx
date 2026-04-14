import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dashboard } from '../Dashboard';

const mockLists = [
  { id: 1, title: 'Work', color: '#ff0000', folderId: null, icon: 'List' },
];

const mockTasks = [
  { 
    id: 1, 
    title: 'Overdue Task', 
    completed: false, 
    deadline: '2020-01-01', 
    listId: 1, 
    order: 0,
    createdAt: '2020-01-01'
  },
  { 
    id: 2, 
    title: 'Upcoming Task', 
    completed: false, 
    deadline: '2099-01-01', 
    listId: 1, 
    order: 1,
    createdAt: '2024-01-01'
  },
];

/**
 * Dashboard component tests.
 */
describe('Dashboard', () => {
  it('renders overdue and upcoming tasks', () => {
    render(
      <Dashboard 
        lists={mockLists} 
        tasks={mockTasks} 
        onSelectList={() => {}} 
        onToggleTask={() => {}} 
      />
    );
    
    expect(screen.getByText('Overdue Task')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Task')).toBeInTheDocument();
  });

  it('calls onToggleTask when clicking check circle', () => {
    const handleToggle = vi.fn();
    render(
      <Dashboard 
        lists={mockLists} 
        tasks={mockTasks} 
        onSelectList={() => {}} 
        onToggleTask={handleToggle} 
      />
    );
    
    const toggleButtons = screen.getAllByRole('button').filter(b => b.className.includes('task-toggle'));
    fireEvent.click(toggleButtons[0]);
    expect(handleToggle).toHaveBeenCalledWith(1);
  });

  it('renders count badges correctly', () => {
    render(
      <Dashboard 
        lists={mockLists} 
        tasks={mockTasks} 
        onSelectList={() => {}} 
        onToggleTask={() => {}} 
      />
    );
    
    const countBadges = screen.getAllByText('1'); // One overdue, one upcoming
    expect(countBadges.length).toBeGreaterThanOrEqual(2);
  });
});
