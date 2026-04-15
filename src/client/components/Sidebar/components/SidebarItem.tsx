import { MouseEvent } from 'react';
import { Pencil, List } from 'lucide-react';
import { TodoList } from '../../../types';
import { ICON_MAP } from '../constants/constants';

interface SidebarItemProps {
  list: TodoList;
  isActive: boolean;
  onSelect: (id: number) => void;
  onEdit: (e: MouseEvent, list: TodoList) => void;
  stats?: { total: number, completed: number, percentage: number };
  compact?: boolean;
}

/**
 * SidebarItem component represents a single list in the sidebar.
 */
export function SidebarItem({ list, isActive, onSelect, onEdit, stats, compact = false }: SidebarItemProps) {
  const IconComponent = ICON_MAP[list.icon || 'List'] || List;
  const hasStats = stats && stats.total > 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(list.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(list.id);
        }
      }}
      className={`w-full group/list flex flex-col gap-1.5 rounded-xl transition-all duration-200 text-sm font-medium cursor-pointer ${
        compact ? 'px-3 py-2' : 'px-3 py-2.5'
      } ${
        isActive
          ? 'bg-primary/10 text-primary shadow-sm border border-primary/10'
          : 'text-text-muted hover:bg-black/5 hover:text-text border border-transparent'
      }`}
    >
      <div className="w-full flex items-center gap-3">
        {compact ? (
          <div 
            className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary' : 'bg-text-muted/40'}`} 
            style={!isActive && list.color ? { backgroundColor: list.color } : {}}
          />
        ) : (
          <IconComponent 
            size={18} 
            className={isActive ? 'text-primary' : 'text-text-muted/70'} 
            style={!isActive && list.color ? { color: list.color } : {}}
          />
        )}
        
        <span className="truncate flex-1 text-left">{list.title}</span>
        
        {hasStats && (
          <span className="text-[10px] opacity-60 font-bold mr-1">{stats.percentage}%</span>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(e, list);
          }}
          className={`opacity-0 group-hover/list:opacity-60 hover:!opacity-100 p-1 text-text-muted hover:text-primary transition-all ${compact ? '' : ''}`}
          title="Modifier la liste"
        >
          <Pencil size={compact ? 12 : 14} />
        </button>
      </div>

      {hasStats && (
        <div className={`${compact ? 'pl-[18px]' : 'pl-[30px]'} w-full`}>
          <div className={`w-full bg-black/5 rounded-full overflow-hidden ${compact ? 'h-0.5' : 'h-1'}`}>
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
