import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskItem } from '../components/TaskItem';
import { Task } from '../../../types';

describe('TaskItem', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    completed: false,
    order: 1,
    listId: 1,
    deadline: null,
    tags: []
  };

  const defaultProps = {
    task: mockTask,
    isDragging: false,
    isDragOver: false,
    availableTags: [],
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onUpdateDeadline: vi.fn(),
    onAddTag: vi.fn(),
    onRemoveTag: vi.fn(),
    onCreateTag: vi.fn(),
    onDragStart: vi.fn(),
    onDragEnter: vi.fn(),
    onDragEnd: vi.fn(),
  };

  it('renders task title', () => {
    render(<TaskItem {...defaultProps} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', () => {
    render(<TaskItem {...defaultProps} />);
    const button = screen.getByLabelText(/mark task as complete/i);
    fireEvent.click(button);
    expect(defaultProps.onToggle).toHaveBeenCalledWith(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<TaskItem {...defaultProps} />);
    const button = screen.getByLabelText(/delete task/i);
    fireEvent.click(button);
    expect(defaultProps.onDelete).toHaveBeenCalledWith(1);
  });

  it('renders overdue badge if task is overdue', () => {
    const overdueTask = { 
      ...mockTask, 
      deadline: new Date(Date.now() - 86400000).toISOString() 
    };
    render(<TaskItem {...defaultProps} task={overdueTask} />);
    expect(screen.getByText(/overdue/i)).toBeInTheDocument();
  });

  it('renders tags if present', () => {
    const taggedTask = { 
      ...mockTask, 
      tags: [{ id: 1, name: 'Urgent', color: '#ff0000' }] 
    };
    render(<TaskItem {...defaultProps} task={taggedTask} />);
    expect(screen.getByText('Urgent')).toBeInTheDocument();
  });
});
