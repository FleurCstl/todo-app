import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskView } from '../TaskView';
import { List } from 'lucide-react';

describe('TaskView', () => {
  const defaultProps = {
    activeList: { id: 1, title: 'Project', folderId: null },
    activeTasks: [],
    availableTags: [],
    iconMap: { List },
    stats: { percentage: 0, completed: 0, total: 0 },
    isDraggingId: null,
    dragOverId: null,
    onAddTask: vi.fn(),
    onToggleTask: vi.fn(),
    onDeleteTask: vi.fn(),
    onUpdateDeadline: vi.fn(),
    onAddTagToTask: vi.fn(),
    onRemoveTagFromTask: vi.fn(),
    onQuickCreateTag: vi.fn(),
    onDragStart: vi.fn(),
    onDragEnter: vi.fn(),
    onDragEnd: vi.fn(),
  };

  it('renders progress and list title', () => {
    render(<TaskView {...defaultProps} />);
    expect(screen.getByText('Project')).toBeInTheDocument();
  });

  it('shows empty state when no tasks', () => {
    render(<TaskView {...defaultProps} />);
    expect(screen.getByText(/no tasks in this list yet/i)).toBeInTheDocument();
  });

  it('renders tasks when provided', () => {
    const tasks = [
      { id: 1, title: 'Task 1', completed: false, order: 1, listId: 1, deadline: null },
      { id: 2, title: 'Task 2', completed: true, order: 2, listId: 1, deadline: null },
    ];
    render(<TaskView {...defaultProps} activeTasks={tasks} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('shows prompt to select a list when activeList is undefined', () => {
    render(<TaskView {...defaultProps} activeList={undefined} />);
    expect(screen.getByText(/select a list to start adding tasks/i)).toBeInTheDocument();
  });
});
