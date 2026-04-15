import { Task, TodoList } from '../types';

/**
 * Calculates progress statistics for a set of tasks.
 */
export function calculateStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  return {
    total,
    completed,
    percentage
  };
}

/**
 * Calculates progress statistics for each list.
 */
export function calculateListStats(lists: TodoList[], tasks: Task[]) {
  const statsMap: Record<number, { total: number, completed: number, percentage: number }> = {};
  
  lists.forEach(list => {
    const listTasks = tasks.filter(t => t.listId === list.id);
    statsMap[list.id] = calculateStats(listTasks);
  });
  
  return statsMap;
}
