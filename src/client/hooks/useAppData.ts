import { useState, useEffect } from 'react';
import { api } from '../api';
import { Folder, TodoList, Task, Tag } from '../types';

/**
 * Hook for managing the core application data (folders, lists, tasks, tags).
 */
export function useAppData() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [lists, setLists] = useState<TodoList[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foldersRes, listsRes, tasksRes, tagsRes] = await Promise.all([
          api.folders.$get(),
          api.lists.$get(),
          api.todos.$get(),
          api.tags.$get(),
        ]);

        if (foldersRes.ok && listsRes.ok && tasksRes.ok && tagsRes.ok) {
          const [foldersData, listsData, tasksData, tagsData] = await Promise.all([
            foldersRes.json(),
            listsRes.json(),
            tasksRes.json(),
            tagsRes.json(),
          ]);

          setFolders(foldersData);
          setLists(listsData);
          setTasks(tasksData);
          setTags(tagsData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateFolder = async (name: string) => {
    try {
      const res = await api.folders.$post({ json: { name } });
      if (res.ok) {
        const newFolder = await res.json();
        setFolders(prev => [...prev, newFolder]);
        return newFolder;
      }
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleCreateList = async (data: { title: string; folderId?: number | null; icon?: string; color?: string }) => {
    try {
      const res = await api.lists.$post({ json: data });
      if (res.ok) {
        const newList = await res.json();
        setLists(prev => [...prev, newList]);
        return newList;
      }
    } catch (error) {
      console.error('Failed to create list:', error);
    }
  };

  const handleUpdateList = async (id: number, data: { title?: string; folderId?: number | null; icon?: string; color?: string }) => {
    try {
      const res = await api.lists[':id'].$patch({
        param: { id: id.toString() },
        json: data
      });
      if (res.ok) {
        const updatedList = await res.json();
        setLists(prev => prev.map(l => l.id === id ? updatedList : l));
        return updatedList;
      }
    } catch (error) {
      console.error('Failed to update list:', error);
    }
  };

  const handleDeleteFolder = async (folderId: number, strategy: 'keep' | 'delete') => {
    try {
      const res = await api.folders[':id'].$delete({ 
        param: { id: folderId.toString() },
        query: { strategy }
      });
      if (res.ok) {
        setFolders(prev => prev.filter(f => f.id !== folderId));
        if (strategy === 'keep') {
          setLists(prev => prev.map(l => l.folderId === folderId ? { ...l, folderId: null } : l));
        } else {
          setLists(prev => prev.filter(l => l.folderId !== folderId));
        }
        return true;
      }
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
    return false;
  };

  return {
    folders,
    setFolders,
    lists,
    setLists,
    tasks,
    setTasks,
    tags,
    setTags,
    isLoading,
    handleCreateFolder,
    handleCreateList,
    handleUpdateList,
    handleDeleteFolder,
  };
}
