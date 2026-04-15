import { useState, useRef, useCallback, useEffect } from 'react';
import { api } from '../api';
import { Task } from '../types';

interface UseTaskReorderProps {
  activeListId: number | null;
  rawActiveTasks: Task[];
}

/**
 * Hook for managing task reordering via drag and drop.
 */
export function useTaskReorder({ activeListId, rawActiveTasks }: UseTaskReorderProps) {
  const dragItemId = useRef<number | null>(null);
  const dragOverItemId = useRef<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [isDraggingId, setIsDraggingId] = useState<number | null>(null);
  const [orderedTaskIds, setOrderedTaskIds] = useState<number[]>([]);

  // Sync orderedTaskIds when active list changes or new tasks are added
  useEffect(() => {
    const rawIds = rawActiveTasks.map(t => t.id);
    setOrderedTaskIds(prev => {
      const prevFiltered = prev.filter(id => rawIds.includes(id));
      const newIds = rawIds.filter(id => !prevFiltered.includes(id));
      // New tasks go at the end (they have the highest order in DB already)
      return [...prevFiltered, ...newIds];
    });
  }, [activeListId, rawActiveTasks]);

  const handleDragStart = useCallback((taskId: number) => {
    dragItemId.current = taskId;
    setIsDraggingId(taskId);
  }, []);

  const handleDragEnter = useCallback((taskId: number) => {
    dragOverItemId.current = taskId;
    setDragOverId(taskId);
  }, []);

  const handleDragEnd = useCallback(() => {
    const fromId = dragItemId.current;
    const toId = dragOverItemId.current;

    if (fromId !== null && toId !== null && fromId !== toId) {
      setOrderedTaskIds(prev => {
        const items = [...prev];
        const fromIdx = items.indexOf(fromId);
        const toIdx = items.indexOf(toId);
        if (fromIdx === -1 || toIdx === -1) return prev;
        items.splice(fromIdx, 1);
        items.splice(toIdx, 0, fromId);

        // Persist to DB (fire and forget, optimistic update already applied)
        if (activeListId !== null) {
          api.todos.reorder.$patch({
            json: { listId: activeListId, orderedIds: items },
          }).catch((err: unknown) => console.error('Failed to persist order:', err));
        }

        return items;
      });
    }

    dragItemId.current = null;
    dragOverItemId.current = null;
    setIsDraggingId(null);
    setDragOverId(null);
  }, [activeListId]);

  return {
    orderedTaskIds,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    isDraggingId,
    dragOverId,
  };
}
