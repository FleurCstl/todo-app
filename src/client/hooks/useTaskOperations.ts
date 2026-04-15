import { api } from '../api';
import { Task } from '../types';

interface UseTaskOperationsProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

/**
 * Hook for managing task-related operations (add, toggle, delete, update).
 */
export function useTaskOperations({ tasks, setTasks }: UseTaskOperationsProps) {
  const handleAddTask = async (title: string, listId: number) => {
    if (!title.trim()) return;

    try {
      const res = await api.todos.$post({ 
        json: { 
          title: title.trim(), 
          listId,
          deadline: null
        } 
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks(prev => [...prev, newTask]);
        return newTask;
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const toggleTask = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const res = await api.todos[':id'].$patch({ 
        param: { id: id.toString() }, 
        json: { completed: !task.completed } 
      });
      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
        return updatedTask;
      }
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const updateTaskDeadline = async (id: number, deadline: string | null) => {
    try {
      const res = await api.todos[':id'].$patch({ 
        param: { id: id.toString() }, 
        json: { deadline } 
      });
      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
        return updatedTask;
      }
    } catch (error) {
      console.error('Failed to update task deadline:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const res = await api.todos[':id'].$delete({ param: { id: id.toString() } });
      if (res.ok) {
        setTasks(prev => prev.filter(t => t.id !== id));
        return true;
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
    return false;
  };

  return {
    handleAddTask,
    toggleTask,
    updateTaskDeadline,
    deleteTask,
  };
}
