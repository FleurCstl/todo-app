import { useState, useMemo, useEffect } from 'react';
import { Button } from './components/ui/Button/Button';
import { Input } from './components/ui/Input/Input';
import { CheckCircle2, Circle, Plus, Trash2, List, Star, Briefcase, Heart, Book, LayoutList, Clock } from 'lucide-react';
import { DatePicker } from './components/ui/DatePicker/DatePicker';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Folder, TodoList, Task } from './types';
import { ProgressBar } from './components/ui/ProgressBar/ProgressBar';
import { api } from './api';
import { Dashboard } from './components/Dashboard/Dashboard';

const ICON_MAP: Record<string, any> = {
  List: List,
  Star: Star,
  Briefcase: Briefcase,
  Heart: Heart,
  Book: Book,
  LayoutList: LayoutList,
};

export default function App() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [lists, setLists] = useState<TodoList[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [activeListId, setActiveListId] = useState<number | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foldersRes, listsRes, tasksRes] = await Promise.all([
          api.folders.$get(),
          api.lists.$get(),
          api.todos.$get(),
        ]);

        if (foldersRes.ok && listsRes.ok && tasksRes.ok) {
          const foldersData = await foldersRes.json();
          const listsData = await listsRes.json();
          const tasksData = await tasksRes.json();

          setFolders(foldersData);
          setLists(listsData);
          setTasks(tasksData);

          // By default, show Dashboard (activeListId is null)
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
        setFolders([...folders, newFolder]);
      }
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleCreateList = async (data: { title: string; folderId?: number | null; icon?: string; color?: string }) => {
    try {
      const res = await api.lists.$post({ 
        json: { 
          title: data.title, 
          folderId: data.folderId, 
          icon: data.icon, 
          color: data.color 
        } 
      });
      if (res.ok) {
        const newList = await res.json();
        setLists([...lists, newList]);
        setActiveListId(newList.id);
      }
    } catch (error) {
      console.error('Failed to create list:', error);
    }
  };

  const activeList = useMemo(() => lists.find(l => l.id === activeListId), [lists, activeListId]);
  const activeTasks = useMemo(() => tasks.filter(t => t.listId === activeListId), [tasks, activeListId]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || activeListId === null) return;
    
    try {
      const res = await api.todos.$post({ 
        json: { 
          title: newTaskTitle.trim(), 
          listId: activeListId,
          deadline: null
        } 
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
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
        setTasks(tasks.map(t => t.id === id ? updatedTask : t));
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
        setTasks(tasks.map(t => t.id === id ? updatedTask : t));
      }
    } catch (error) {
      console.error('Failed to update task deadline:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const res = await api.todos[':id'].$delete({ param: { id: id.toString() } });
      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleDeleteFolder = async (folderId: number, strategy: 'keep' | 'delete') => {
    try {
      const res = await api.folders[':id'].$delete({ 
        param: { id: folderId.toString() },
        query: { strategy }
      });
      if (res.ok) {
        setFolders(folders.filter(f => f.id !== folderId));
        if (strategy === 'keep') {
          setLists(lists.map(l => l.folderId === folderId ? { ...l, folderId: null } : l));
        } else {
          setLists(lists.filter(l => l.folderId !== folderId));
          // If active list was in the deleted folder, select another one
          if (activeList?.folderId === folderId) {
            const remainingLists = lists.filter(l => l.folderId !== folderId);
            setActiveListId(remainingLists.length > 0 ? remainingLists[0].id : null);
          }
        }
      }
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  const stats = useMemo(() => {
    const completed = activeTasks.filter(t => t.completed).length;
    return { 
      completed, 
      total: activeTasks.length, 
      percentage: activeTasks.length === 0 ? 0 : Math.round((completed / activeTasks.length) * 100) 
    };
  }, [activeTasks]);

  const listStats = useMemo(() => {
    const statsMap: Record<number, { total: number, completed: number, percentage: number }> = {};
    lists.forEach(list => {
      const listTasks = tasks.filter(t => t.listId === list.id);
      const total = listTasks.length;
      const completed = listTasks.filter(t => t.completed).length;
      statsMap[list.id] = {
        total,
        completed,
        percentage: total === 0 ? 0 : Math.round((completed / total) * 100)
      };
    });
    return statsMap;
  }, [lists, tasks]);

  const themeStyle = useMemo(() => {
    if (!activeList?.color) return {};
    return {
      '--color-primary': activeList.color,
      '--color-primary-hover': `color-mix(in srgb, ${activeList.color}, black 15%)`,
    } as React.CSSProperties;
  }, [activeList]);

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-bg flex items-center justify-center">
        <div className="text-primary text-xl font-bold animate-pulse">Loading TaskMaster...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-bg flex overflow-hidden" style={themeStyle}>
      {/* Sidebar Area */}
      <Sidebar 
        folders={folders} 
        lists={lists} 
        activeListId={activeListId} 
        onSelectList={(id) => setActiveListId(id === -1 ? null : id)} 
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        onCreateList={handleCreateList}
        listStats={listStats}
      />

      {/* Main Content Area */}
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col pt-8">
        <div className="flex-1 flex justify-center py-12 px-6">
          {activeListId === null ? (
            <div className="w-full max-w-4xl">
              <Dashboard 
                lists={lists} 
                tasks={tasks} 
                onSelectList={setActiveListId} 
                onToggleTask={toggleTask}
              />
            </div>
          ) : (
            <div className="w-full max-w-2xl h-fit">
              <div className="bg-surface rounded-3xl shadow-[0_4px_20px_rgba(110,95,80,0.08)] overflow-hidden border border-border-subtle transition-all duration-300">
                <div className="p-8">
                  {/* Header Section */}
                  <div className="mb-8">
                    <div className="flex justify-between items-end mb-4">
                      <div className="flex items-center gap-4">
                        {activeList && (
                          <div 
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20"
                            style={{ backgroundColor: 'var(--color-primary-10, color-mix(in srgb, var(--color-primary), transparent 90%))' }}
                          >
                            {(() => {
                              const IconComponent = ICON_MAP[activeList.icon || 'List'] || List;
                              return <IconComponent size={24} />;
                            })()}
                          </div>
                        )}
                        <div>
                          <h1 className="text-3xl font-extrabold tracking-tight text-text mb-1">
                            {activeList?.title || 'My Tasks'}
                          </h1>
                          <p className="text-text-muted font-medium text-sm">Have a great day, complete your goals!</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-primary/10 text-primary w-16 h-16 rounded-2xl shadow-sm border border-primary/20 transition-all duration-300">
                        <span className="text-xl font-bold leading-none">{stats.percentage}%</span>
                      </div>
                    </div>
                    <ProgressBar progress={stats.percentage} />
                  </div>

                  {/* Input Section */}
                  <form onSubmit={handleAddTask} className="flex gap-3 mt-4 mb-8">
                    <Input
                      placeholder={activeList ? `Add task to "${activeList.title}"...` : "Select a list first"}
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      disabled={!activeList}
                      className="flex-1 shadow-sm border-border-subtle"
                    />
                    <Button type="submit" disabled={!activeList || !newTaskTitle.trim()} className="shadow-md shadow-primary/20">
                      <Plus size={20} className="mr-1" />
                      Add
                    </Button>
                  </form>

                  {/* List Section */}
                  <div className="space-y-3">
                    {!activeList ? (
                      <div className="text-center py-10">
                        <p className="text-text-muted italic">Psst! Create or select a list to start adding tasks. ✨</p>
                      </div>
                    ) : activeTasks.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-text-muted">No tasks in this list yet! 🎉</p>
                      </div>
                    ) : (
                      activeTasks.map((task) => (
                        <div 
                          key={task.id}
                          className="group flex items-center gap-4 p-4 rounded-2xl border border-border-subtle/50 bg-bg hover:border-border-subtle hover:shadow-sm transition-all duration-200"
                        >
                          <button 
                            onClick={() => toggleTask(task.id)}
                            className={`flex-shrink-0 transition-colors duration-200 ${task.completed ? 'text-primary' : 'text-border-subtle hover:text-primary/70'}`}
                          >
                            {task.completed ? <CheckCircle2 size={24} className="fill-primary/20 border-primary" /> : <Circle size={24} />}
                          </button>
                          <div className="flex-1 flex flex-col gap-0.5">
                            <span className={`text-[15px] font-medium transition-all duration-200 ${task.completed ? 'text-text-muted line-through opacity-70' : 'text-text'}`}>
                              {task.title}
                            </span>
                            {task.deadline && (
                              <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                                task.completed 
                                  ? 'text-text-muted/50' 
                                  : new Date(task.deadline) < new Date(new Date().setHours(0,0,0,0))
                                    ? 'text-error animate-pulse' 
                                    : 'text-primary/70'
                              }`}>
                                <Clock size={12} />
                                <span>{new Date(task.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                                {new Date(task.deadline) < new Date(new Date().setHours(0,0,0,0)) && !task.completed && (
                                  <span className="ml-1 uppercase tracking-wider">[Overdue]</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <DatePicker 
                              date={task.deadline} 
                              onSelect={(newDate) => updateTaskDeadline(task.id, newDate)} 
                            />
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-text-muted/40 opacity-0 group-hover:opacity-100 hover:text-error transition-all duration-200"
                              aria-label="Delete task"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
