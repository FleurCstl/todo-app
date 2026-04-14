import { MouseEvent } from 'react';
import { ChevronRight, Folder as FolderIcon, Trash2 } from 'lucide-react';
import { Folder, TodoList } from '../../../types';
import { SidebarItem } from './SidebarItem';

interface SidebarFolderProps {
  folder: Folder;
  lists: TodoList[];
  activeListId: number | null;
  isExpanded: boolean;
  onToggle: (id: number) => void;
  onDelete: (e: MouseEvent, folder: Folder) => void;
  onSelectList: (id: number) => void;
  onEditList: (e: MouseEvent, list: TodoList) => void;
  listStats: Record<number, { total: number, completed: number, percentage: number }>;
}

/**
 * SidebarFolder component displays a folder and its nested lists.
 */
export function SidebarFolder({ 
  folder, 
  lists, 
  activeListId, 
  isExpanded, 
  onToggle, 
  onDelete, 
  onSelectList, 
  onEditList, 
  listStats 
}: SidebarFolderProps) {
  const folderLists = lists.filter(list => list.folderId === folder.id);

  return (
    <div className="space-y-1">
      <div className="group/folder flex items-center pr-2">
        <button
          onClick={() => onToggle(folder.id)}
          className="flex-1 flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-text-muted hover:text-text uppercase tracking-wider transition-colors"
        >
          <ChevronRight 
            size={16} 
            className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
          />
          <FolderIcon size={14} className="opacity-70" />
          <span className="truncate">{folder.name}</span>
        </button>
        <button
          onClick={(e) => onDelete(e, folder)}
          className="opacity-0 group-hover/folder:opacity-60 hover:!opacity-100 p-1 text-text-muted hover:text-error transition-all"
          title="Supprimer le dossier"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div 
        className={`grid grid-rows-[0fr] transition-all duration-300 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pl-6 pr-2 space-y-1 pt-1">
            {folderLists.map(list => (
              <SidebarItem
                key={list.id}
                list={list}
                isActive={activeListId === list.id}
                onSelect={onSelectList}
                onEdit={onEditList}
                stats={listStats[list.id]}
                compact={true}
              />
            ))}
            {folderLists.length === 0 && (
              <p className="px-3 py-2 text-xs text-text-muted/60 italic font-medium">Empty folder</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
