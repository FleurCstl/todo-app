import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAppData } from '../useAppData';
import { api } from '../../api';

vi.mock('../../api', () => ({
  api: {
    folders: { 
      $get: vi.fn(),
      $post: vi.fn(),
      ':id': { $delete: vi.fn() }
    },
    lists: { 
      $get: vi.fn(),
      $post: vi.fn(),
      ':id': { $patch: vi.fn() }
    },
    todos: { $get: vi.fn() },
    tags: { $get: vi.fn() },
  },
}));

describe('useAppData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches data on mount', async () => {
    const mockFolders = [{ id: 1, name: 'Work' }];
    const mockLists = [{ id: 1, title: 'Tasks', order: 1, color: null, folderId: null, icon: null }];
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(api.folders.$get).mockResolvedValue({ ok: true, json: async () => mockFolders } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(api.lists.$get).mockResolvedValue({ ok: true, json: async () => mockLists } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(api.todos.$get).mockResolvedValue({ ok: true, json: async () => [] } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(api.tags.$get).mockResolvedValue({ ok: true, json: async () => [] } as any);

    const { result } = renderHook(() => useAppData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.folders).toEqual(mockFolders);
    expect(result.current.lists).toEqual(mockLists);
  });

  it('handles folder creation', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(api.folders.$get).mockResolvedValue({ ok: true, json: async () => [] } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(api.lists.$get).mockResolvedValue({ ok: true, json: async () => [] } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(api.todos.$get).mockResolvedValue({ ok: true, json: async () => [] } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(api.tags.$get).mockResolvedValue({ ok: true, json: async () => [] } as any);

    const newFolder = { id: 2, name: 'Personal' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(api.folders.$post).mockResolvedValue({ ok: true, json: async () => newFolder } as any);

    const { result } = renderHook(() => useAppData());
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.handleCreateFolder('Personal');
    });

    expect(result.current.folders).toContainEqual(newFolder);
  });
});
