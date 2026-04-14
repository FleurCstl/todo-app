import { Plus, FolderPlus, Tag as TagIcon } from 'lucide-react';
import { Button } from '../../ui/Button/Button';

interface SidebarFooterProps {
  onCreateList: () => void;
  onCreateFolder: () => void;
  onManageTags: () => void;
}

/**
 * SidebarFooter component contains the action buttons at the bottom of the sidebar.
 */
export function SidebarFooter({ onCreateList, onCreateFolder, onManageTags }: SidebarFooterProps) {
  return (
    <>
      <div className="p-4 border-t border-border-subtle flex gap-2">
        <Button 
          onClick={onCreateList} 
          className="flex-1 text-xs bg-bg text-text hover:bg-black/5 hover:text-text border border-border-subtle shadow-none h-9 px-0"
        >
          <Plus size={14} className="mr-1.5" /> List
        </Button>
        <Button 
          onClick={onCreateFolder} 
          className="flex-1 text-xs bg-bg text-text hover:bg-black/5 hover:text-text border border-border-subtle shadow-none h-9 px-0"
        >
          <FolderPlus size={14} className="mr-1.5" /> Folder
        </Button>
      </div>

      <div className="px-4 pb-4">
        <Button 
          onClick={onManageTags}
          className="w-full text-xs bg-primary/5 text-primary hover:bg-primary/10 border border-primary/20 shadow-none h-9"
        >
          <TagIcon size={14} className="mr-1.5" /> Manage Tags
        </Button>
      </div>
    </>
  );
}
