import { TodoList, Task, Tag } from '../../types';
import { TaskHeader } from './components/TaskHeader';
import { TaskInput } from './components/TaskInput';
import { TaskItem } from './components/TaskItem';

interface TaskViewProps {
  activeList: TodoList | undefined;
  activeTasks: Task[];
  availableTags: Tag[];
  iconMap: Record<string, React.ElementType>;
  stats: {
    percentage: number;
    completed: number;
    total: number;
  };
  isDraggingId: number | null;
  dragOverId: number | null;
  onAddTask: (title: string) => Promise<void>;
  onToggleTask: (id: number) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
  onUpdateDeadline: (id: number, deadline: string | null) => Promise<void>;
  onAddTagToTask: (taskId: number, tagId: number) => Promise<void>;
  onRemoveTagFromTask: (taskId: number, tagId: number) => Promise<void>;
  onQuickCreateTag: (taskId: number, name: string) => Promise<void>;
  onDragStart: (id: number) => void;
  onDragEnter: (id: number) => void;
  onDragEnd: () => void;
}

/**
 * Main view for displaying and managing tasks within a list.
 */
export function TaskView({
  activeList,
  activeTasks,
  availableTags,
  iconMap,
  stats,
  isDraggingId,
  dragOverId,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateDeadline,
  onAddTagToTask,
  onRemoveTagFromTask,
  onQuickCreateTag,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: TaskViewProps) {
  return (
    <div className="bg-surface rounded-3xl shadow-[0_4px_20px_rgba(110,95,80,0.08)] overflow-hidden border border-border-subtle transition-all duration-300">
      <div className="p-8">
        <TaskHeader list={activeList} iconMap={iconMap} stats={stats} />
        
        <TaskInput 
          placeholder={activeList ? `Add task to "${activeList.title}"...` : "Select a list first"}
          disabled={!activeList}
          onAddTask={onAddTask}
        />

        <div className="space-y-1">
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
              <TaskItem
                key={task.id}
                task={task}
                isDragging={isDraggingId === task.id}
                isDragOver={dragOverId === task.id && isDraggingId !== null}
                availableTags={availableTags}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
                onUpdateDeadline={onUpdateDeadline}
                onAddTag={onAddTagToTask}
                onRemoveTag={onRemoveTagFromTask}
                onCreateTag={(name) => onQuickCreateTag(task.id, name)}
                onDragStart={onDragStart}
                onDragEnter={onDragEnter}
                onDragEnd={onDragEnd}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
