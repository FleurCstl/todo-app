import { CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';
import { TagBadge } from '../../ui/TagBadge/TagBadge';
import { TagSelector } from '../../TagSelector/TagSelector';
import { DatePicker } from '../../ui/DatePicker/DatePicker';
import { Tooltip } from '../../ui/Tooltip/Tooltip';
import { Task, Tag } from '../../../types';

interface TaskItemProps {
  task: Task;
  isDragging: boolean;
  isDragOver: boolean;
  availableTags: Tag[];
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdateDeadline: (id: number, deadline: string | null) => Promise<void>;
  onAddTag: (taskId: number, tagId: number) => Promise<void>;
  onRemoveTag: (taskId: number, tagId: number) => Promise<void>;
  onCreateTag: (name: string) => Promise<void>;
  onDragStart: (id: number) => void;
  onDragEnter: (id: number) => void;
  onDragEnd: () => void;
}

/**
 * Individual task item component with support for completion, tagging, deadline, and drag-and-drop.
 */
export function TaskItem({
  task,
  isDragging,
  isDragOver,
  availableTags,
  onToggle,
  onDelete,
  onUpdateDeadline,
  onAddTag,
  onRemoveTag,
  onCreateTag,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: TaskItemProps) {
  const isOverdue = task.deadline && new Date(task.deadline) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div
      id={`task-item-${task.id}`}
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragEnter={() => onDragEnter(task.id)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={onDragEnd}
      style={{
        opacity: isDragging ? 0.4 : 1,
        transition: 'opacity 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      className={[
        'group flex items-center gap-4 p-4 rounded-2xl border bg-bg transition-all duration-200',
        isDragging
          ? 'border-primary/30 shadow-lg shadow-primary/10 scale-[0.99]'
          : isDragOver
            ? 'border-primary border-t-[3px] shadow-md'
            : 'border-border-subtle/50 hover:border-border-subtle hover:shadow-sm',
      ].join(' ')}
    >
      {/* Drag handle */}
      <div
        className="flex-shrink-0 text-text-muted/30 group-hover:text-text-muted/60 transition-colors duration-200 select-none"
        title="Drag to reorder"
      >
        <svg width="14" height="20" viewBox="0 0 14 20" fill="currentColor">
          <circle cx="4" cy="4" r="1.8" /><circle cx="10" cy="4" r="1.8" />
          <circle cx="4" cy="10" r="1.8" /><circle cx="10" cy="10" r="1.8" />
          <circle cx="4" cy="16" r="1.8" /><circle cx="10" cy="16" r="1.8" />
        </svg>
      </div>

      <Tooltip content={task.completed ? 'Mark as incomplete' : 'Mark as complete'}>
        <button
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
          className={`flex-shrink-0 transition-colors duration-200 ${task.completed ? 'text-primary' : 'text-border-subtle hover:text-primary/70'}`}
        >
          {task.completed ? <CheckCircle2 size={24} className="fill-primary/20 border-primary" /> : <Circle size={24} />}
        </button>
      </Tooltip>

      <div className="flex-1 flex flex-col gap-1">
        <span className={`text-[15px] font-medium transition-all duration-200 ${task.completed ? 'text-text-muted line-through opacity-70' : 'text-text'}`}>
          {task.title}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {task.tags?.map(tag => (
            <TagBadge
              key={tag.id}
              name={tag.name}
              color={tag.color}
              onRemove={() => onRemoveTag(task.id, tag.id)}
            />
          ))}
        </div>
        {task.deadline && (
          <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${
            task.completed
              ? 'text-text-muted/50'
              : isOverdue
                ? 'text-error animate-pulse'
                : 'text-primary/70'
          }`}>
            <Clock size={12} />
            <span>{new Date(task.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
            {isOverdue && !task.completed && (
              <span className="ml-1 uppercase tracking-wider">[Overdue]</span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Tooltip content="Manage Tags">
          <TagSelector
            availableTags={availableTags}
            taskTags={task.tags || []}
            onAddTag={(tagId) => onAddTag(task.id, tagId)}
            onRemoveTag={(tagId) => onRemoveTag(task.id, tagId)}
            onCreateTag={onCreateTag}
          />
        </Tooltip>
        
        <Tooltip content="Set Deadline">
          <DatePicker
            date={task.deadline}
            onSelect={(newDate) => onUpdateDeadline(task.id, newDate)}
          />
        </Tooltip>

        <Tooltip content="Delete Task">
          <button
            onClick={() => onDelete(task.id)}
            className="text-text-muted/40 opacity-0 group-hover:opacity-100 hover:text-error transition-all duration-200"
            aria-label="Delete task"
          >
            <Trash2 size={18} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
