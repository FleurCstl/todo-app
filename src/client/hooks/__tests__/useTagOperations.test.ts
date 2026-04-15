import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTagOperations } from '../useTagOperations';
import { api } from '../../api';
import { Tag } from '../../types';

vi.mock('../../api', () => ({
  api: {
    tags: {
      $post: vi.fn(),
      ':id': {
        $patch: vi.fn(),
        $delete: vi.fn(),
      },
    },
    todos: {
      ':id': {
        tags: {
          $post: vi.fn(),
          ':tagId': { $delete: vi.fn() }
        }
      }
    }
  },
}));

describe('useTagOperations', () => {
  const mockTags: Tag[] = [{ id: 1, name: 'Work', color: '#ff0000' }];

  it('creates a tag successfully', async () => {
    const newTag = { id: 2, name: 'Home', color: '#00ff00' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (api.tags.$post as any).mockResolvedValue({ ok: true, json: async () => newTag });

    const setTags = vi.fn();
    const setTasks = vi.fn();
    const { result } = renderHook(() => useTagOperations({ tags: mockTags, setTags, setTasks }));

    await act(async () => {
      await result.current.handleCreateTag('Home', '#00ff00');
    });

    expect(setTags).toHaveBeenCalled();
    const updater = setTags.mock.calls[0][0];
    expect(updater(mockTags)).toContainEqual(newTag);
  });

  it('adds a tag to a task successfully', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (api.todos[':id'].tags.$post as any).mockResolvedValue({ ok: true });

    const setTags = vi.fn();
    const setTasks = vi.fn();
    const { result } = renderHook(() => useTagOperations({ tags: mockTags, setTags, setTasks }));

    await act(async () => {
      await result.current.handleAddTagToTask(1, 1);
    });

    expect(setTasks).toHaveBeenCalled();
  });
});
