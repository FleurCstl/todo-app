import { useState, useMemo } from 'react';
import { List, Star, Briefcase, Heart, Book, LayoutList } from 'lucide-react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TagManager } from './components/TagManager/TagManager';
import { TaskView } from './components/TaskView/TaskView';
import { useAppData } from './hooks/useAppData';
import { useTaskOperations } from './hooks/useTaskOperations';
import { useTagOperations } from './hooks/useTagOperations';
import { useTaskReorder } from './hooks/useTaskReorder';
import { calculateStats, calculateListStats } from './utils/stats';

const ICON_MAP: Record<string, React.ElementType> = {
  List,
  Star,
  Briefcase,
  Heart,
  Book,
  LayoutList,
};

/**
 * Main application component.
 * Orchestrates high-level state, layout, and component integration.
 */
export default function App() {
  const [activeListId, setActiveListId] = useState<number | null>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // Core Data & State
  const {
    folders,
    lists,
    tasks,
    setTasks,
    tags,
    setTags,
    isLoading,
    handleCreateFolder,
    handleCreateList,
    handleUpdateList,
    handleDeleteFolder,
  } = useAppData();

  // Task Operations
  const {
    handleAddTask,
    toggleTask,
    updateTaskDeadline,
    deleteTask,
  } = useTaskOperations({ tasks, setTasks });

  // Tag Operations
  const {
    handleCreateTag,
    handleUpdateTag,
    handleDeleteTag,
    handleAddTagToTask,
    handleRemoveTagFromTask,
    handleQuickCreateTag,
  } = useTagOperations({ tags, setTags, setTasks });

  // Derived State
  const activeList = useMemo(() => lists.find(l => l.id === activeListId), [lists, activeListId]);
  
  const rawActiveTasks = useMemo(
    () => tasks.filter(t => t.listId === activeListId).sort((a, b) => a.order - b.order),
    [tasks, activeListId]
  );

  // Drag & Drop
  const {
    orderedTaskIds,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    isDraggingId,
    dragOverId,
  } = useTaskReorder({ activeListId, rawActiveTasks });

  const activeTasks = useMemo(() => {
    if (orderedTaskIds.length === 0) return rawActiveTasks;
    const taskMap = new Map(rawActiveTasks.map(t => [t.id, t]));
    return orderedTaskIds.map(id => taskMap.get(id)).filter(Boolean) as typeof rawActiveTasks;
  }, [rawActiveTasks, orderedTaskIds]);

  // Statistics
  const stats = useMemo(() => calculateStats(activeTasks), [activeTasks]);
  const listStats = useMemo(() => calculateListStats(lists, tasks), [lists, tasks]);

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
      <Sidebar 
        folders={folders} 
        lists={lists} 
        activeListId={activeListId} 
        onSelectList={(id) => setActiveListId(id === -1 ? null : id)} 
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        onCreateList={handleCreateList}
        onUpdateList={handleUpdateList}
        listStats={listStats}
        onManageTags={() => setIsTagModalOpen(true)}
      />

      <main className="flex-1 overflow-y-auto flex flex-col pt-8">
        <div className="flex-1 flex justify-center py-12 px-6">
          {activeListId === null ? (
            <div className="w-full max-w-4xl">
              <Dashboard 
                lists={lists} 
                tasks={tasks} 
                onSelectList={setActiveListId} 
                onToggleTask={async (id) => { await toggleTask(id); }}
              />
            </div>
          ) : (
            <div className="w-full max-w-2xl h-fit">
              <TaskView 
                activeList={activeList}
                activeTasks={activeTasks}
                availableTags={tags}
                iconMap={ICON_MAP}
                stats={stats}
                isDraggingId={isDraggingId}
                dragOverId={dragOverId}
                onAddTask={(title) => handleAddTask(title, activeListId)}
                onToggleTask={async (id) => { await toggleTask(id); }}
                onDeleteTask={async (id) => { await deleteTask(id); }}
                onUpdateDeadline={async (id, deadline) => { await updateTaskDeadline(id, deadline); }}
                onAddTagToTask={async (taskId, tagId) => { await handleAddTagToTask(taskId, tagId); }}
                onRemoveTagFromTask={async (taskId, tagId) => { await handleRemoveTagFromTask(taskId, tagId); }}
                onQuickCreateTag={async (taskId, name) => { await handleQuickCreateTag(taskId, name); }}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
              />
            </div>
          )}
        </div>
      </main>

      <TagManager 
        isOpen={isTagModalOpen} 
        onClose={() => setIsTagModalOpen(false)} 
        tags={tags}
        onCreateTag={handleCreateTag}
        onUpdateTag={async (id, data) => { await handleUpdateTag(id, data); }}
        onDeleteTag={async (id) => { await handleDeleteTag(id); }}
      />
    </div>
  );
}
