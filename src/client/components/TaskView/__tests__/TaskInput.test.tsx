import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskInput } from '../components/TaskInput';

describe('TaskInput', () => {
  it('renders input and button', () => {
    render(<TaskInput placeholder="Add task" disabled={false} onAddTask={vi.fn()} />);
    expect(screen.getByPlaceholderText('Add task')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('calls onAddTask and clears input on submit', async () => {
    const onAddTask = vi.fn().mockResolvedValue(undefined);
    render(<TaskInput placeholder="Add task" disabled={false} onAddTask={onAddTask} />);
    
    const input = screen.getByPlaceholderText('Add task');
    const button = screen.getByRole('button', { name: /add/i });
    
    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(button);
    
    expect(onAddTask).toHaveBeenCalledWith('New Task');
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('is disabled when the disabled prop is true', () => {
    render(<TaskInput placeholder="Add task" disabled={true} onAddTask={vi.fn()} />);
    expect(screen.getByPlaceholderText('Add task')).toBeDisabled();
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
  });
});
