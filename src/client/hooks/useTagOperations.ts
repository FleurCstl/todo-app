import { api } from '../api';
import { Tag, Task } from '../types';

interface UseTagOperationsProps {
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

/**
 * Hook for managing tag-related operations.
 */
export function useTagOperations({ tags, setTags, setTasks }: UseTagOperationsProps) {
  const handleCreateTag = async (name: string, color: string) => {
    try {
      const res = await api.tags.$post({ json: { name, color } });
      if (res.ok) {
        const newTag = await res.json();
        setTags(prev => [...prev, newTag]);
        return newTag;
      }
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  const handleUpdateTag = async (id: number, data: { name?: string, color?: string }) => {
    try {
      const res = await api.tags[':id'].$patch({
        param: { id: id.toString() },
        json: data
      });
      if (res.ok) {
        const updatedTag = await res.json();
        setTags(prev => prev.map(t => t.id === id ? updatedTag : t));
        // Also update tags in the tasks state
        setTasks(prev => prev.map(task => ({
          ...task,
          tags: task.tags?.map(tag => tag.id === id ? updatedTag : tag)
        })));
        return updatedTag;
      }
    } catch (error) {
      console.error('Failed to update tag:', error);
    }
  };

  const handleDeleteTag = async (id: number) => {
    try {
      const res = await api.tags[':id'].$delete({ param: { id: id.toString() } });
      if (res.ok) {
        setTags(prev => prev.filter(t => t.id !== id));
        // Update local tasks state to remove this tag from any tasks that had it
        setTasks(prev => prev.map(task => ({
          ...task,
          tags: task.tags?.filter(tag => tag.id !== id)
        })));
        return true;
      }
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
    return false;
  };

  const handleAddTagToTask = async (taskId: number, tagId: number) => {
    try {
      const res = await api.todos[':id'].tags.$post({ 
        param: { id: taskId.toString() }, 
        json: { tagId } 
      });
      if (res.ok) {
        const tag = tags.find(t => t.id === tagId);
        if (tag) {
          setTasks(prev => prev.map(t => t.id === taskId ? { 
            ...t, 
            tags: [...(t.tags || []), tag] 
          } : t));
        }
        return true;
      }
    } catch (error) {
      console.error('Failed to add tag to task:', error);
    }
    return false;
  };

  const handleRemoveTagFromTask = async (taskId: number, tagId: number) => {
    try {
      const res = await api.todos[':id'].tags[':tagId'].$delete({ 
        param: { id: taskId.toString(), tagId: tagId.toString() } 
      });
      if (res.ok) {
        setTasks(prev => prev.map(t => t.id === taskId ? { 
          ...t, 
          tags: t.tags?.filter(tag => tag.id !== tagId) 
        } : t));
        return true;
      }
    } catch (error) {
      console.error('Failed to remove tag from task:', error);
    }
    return false;
  };

  const handleQuickCreateTag = async (taskId: number, name: string) => {
    const newTag = await handleCreateTag(name, '#6b7280');
    if (newTag) {
      await handleAddTagToTask(taskId, newTag.id);
    }
    return newTag;
  };

  return {
    handleCreateTag,
    handleUpdateTag,
    handleDeleteTag,
    handleAddTagToTask,
    handleRemoveTagFromTask,
    handleQuickCreateTag,
  };
}
