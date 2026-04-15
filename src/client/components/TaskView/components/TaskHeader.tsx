import { List } from 'lucide-react';
import { ProgressBar } from '../../ui/ProgressBar/ProgressBar';
import { TodoList } from '../../../types';

interface TaskHeaderProps {
  list: TodoList | undefined;
  iconMap: Record<string, React.ElementType>;
  stats: {
    percentage: number;
    completed: number;
    total: number;
  };
}

/**
 * Header section for the task view showing list title, icon, and progress.
 */
export function TaskHeader({ list, iconMap, stats }: TaskHeaderProps) {
  const IconComponent = (list?.icon && iconMap[list.icon]) || List;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-4">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20"
            style={{ backgroundColor: 'var(--color-primary-10, color-mix(in srgb, var(--color-primary), transparent 90%))' }}
          >
            <IconComponent size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text mb-1">
               {list?.title || 'My Tasks'}
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
  );
}
