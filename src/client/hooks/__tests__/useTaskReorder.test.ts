import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTaskReorder } from '../useTaskReorder';
import { Task } from '../../types';

describe('useTaskReorder', () => {
  const mockTasks: Task[] = [
    { id: 1, title: 'T1', completed: false, order: 1, listId: 1, deadline: null },
    { id: 2, title: 'T2', completed: false, order: 2, listId: 1, deadline: null },
  ];

  it('initializes orderedTaskIds from rawActiveTasks', () => {
    const { result } = renderHook(() => useTaskReorder({ activeListId: 1, rawActiveTasks: mockTasks }));
    expect(result.current.orderedTaskIds).toEqual([1, 2]);
  });

  it('handles drag start and enter', () => {
    const { result } = renderHook(() => useTaskReorder({ activeListId: 1, rawActiveTasks: mockTasks }));
    
    act(() => {
      result.current.handleDragStart(1);
    });
    expect(result.current.isDraggingId).toBe(1);

    act(() => {
      result.current.handleDragEnter(2);
    });
    expect(result.current.dragOverId).toBe(2);
  });
});
