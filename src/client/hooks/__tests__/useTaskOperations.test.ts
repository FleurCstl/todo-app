import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTaskOperations } from '../useTaskOperations';
import { api } from '../../api';
import { Task } from '../../types';

vi.mock('../../api', () => ({
  api: {
    todos: {
      $post: vi.fn(),
      ':id': {
        $patch: vi.fn(),
        $delete: vi.fn(),
      },
    },
  },
}));

describe('useTaskOperations', () => {
  it('adds a task successfully', async () => {
    const mockTask: Task = { id: 1, title: 'Test Task', completed: false, order: 1, listId: 1, deadline: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (api.todos.$post as any).mockResolvedValue({ ok: true, json: async () => mockTask });

    const setTasks = vi.fn();
    const { result } = renderHook(() => useTaskOperations({ tasks: [], setTasks }));

    await act(async () => {
      await result.current.handleAddTask('Test Task', 1);
    });

    expect(setTasks).toHaveBeenCalled();
    // Verify the updater function behavior
    const updater = setTasks.mock.calls[0][0];
    expect(updater([])).toEqual([mockTask]);
  });

  it('toggles a task successfully', async () => {
    const initialTask: Task = { id: 1, title: 'Test Task', completed: false, order: 1, listId: 1, deadline: null };
    const updatedTask = { ...initialTask, completed: true };
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (api.todos[':id'].$patch as any).mockResolvedValue({ ok: true, json: async () => updatedTask });

    const setTasks = vi.fn();
    const { result } = renderHook(() => useTaskOperations({ tasks: [initialTask], setTasks }));

    await act(async () => {
      await result.current.toggleTask(1);
    });

    expect(setTasks).toHaveBeenCalled();
    const updater = setTasks.mock.calls[0][0];
    expect(updater([initialTask])).toEqual([updatedTask]);
  });

  it('deletes a task successfully', async () => {
    const initialTask: Task = { id: 1, title: 'Test Task', completed: false, order: 1, listId: 1, deadline: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (api.todos[':id'].$delete as any).mockResolvedValue({ ok: true });

    const setTasks = vi.fn();
    const { result } = renderHook(() => useTaskOperations({ tasks: [initialTask], setTasks }));

    await act(async () => {
      await result.current.deleteTask(1);
    });

    expect(setTasks).toHaveBeenCalled();
    const updater = setTasks.mock.calls[0][0];
    expect(updater([initialTask])).toEqual([]);
  });
});
