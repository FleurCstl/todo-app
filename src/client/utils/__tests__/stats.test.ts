import { describe, it, expect } from 'vitest';
import { calculateStats, calculateListStats } from '../stats';
import { Task, TodoList } from '../../types';

describe('stats utilities', () => {
  const mockTasks: Task[] = [
    { id: 1, title: 'Task 1', completed: true, order: 1, listId: 1, deadline: null },
    { id: 2, title: 'Task 2', completed: false, order: 2, listId: 1, deadline: null },
    { id: 3, title: 'Task 3', completed: true, order: 3, listId: 2, deadline: null },
  ];

  describe('calculateStats', () => {
    it('should correctly calculate percentage for mixed tasks', () => {
      const stats = calculateStats(mockTasks.slice(0, 2));
      expect(stats).toEqual({
        total: 2,
        completed: 1,
        percentage: 50,
      });
    });

    it('should return 0 percentage for empty tasks', () => {
      const stats = calculateStats([]);
      expect(stats).toEqual({
        total: 0,
        completed: 0,
        percentage: 0,
      });
    });

    it('should correctly calculate 100% completion', () => {
      const stats = calculateStats([mockTasks[0], mockTasks[2]]);
      expect(stats.percentage).toBe(100);
    });
  });

  describe('calculateListStats', () => {
    it('should correctly group stats by listId', () => {
      const mockLists: TodoList[] = [
        { id: 1, title: 'List 1', folderId: null, color: undefined, icon: undefined },
        { id: 2, title: 'List 2', folderId: null, color: undefined, icon: undefined },
      ];

      const statsMap = calculateListStats(mockLists, mockTasks);
      
      expect(statsMap[1]).toEqual({
        total: 2,
        completed: 1,
        percentage: 50,
      });
      
      expect(statsMap[2]).toEqual({
        total: 1,
        completed: 1,
        percentage: 100,
      });
    });

    it('should handle lists with no tasks', () => {
      const mockLists: TodoList[] = [
        { id: 3, title: 'Empty List', folderId: null, color: undefined, icon: undefined },
      ];

      const statsMap = calculateListStats(mockLists, mockTasks);
      expect(statsMap[3]).toEqual({
        total: 0,
        completed: 0,
        percentage: 0,
      });
    });
  });
});
