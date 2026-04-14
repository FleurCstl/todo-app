import { LayoutDashboard } from 'lucide-react';
import { Folder, TodoList } from '../../types';
import { SidebarHeader } from './components/SidebarHeader';
import { SidebarItem } from './components/SidebarItem';
import { SidebarFolder } from './components/SidebarFolder';
import { SidebarFooter } from './components/SidebarFooter';
import { FolderModal } from './components/modals/FolderModal';
import { ListModal } from './components/modals/ListModal';
import { DeleteFolderModal } from './components/modals/DeleteFolderModal';
import { useSidebar } from './hooks/useSidebar';

interface SidebarProps {
  folders: Folder[];
  lists: TodoList[];
  activeListId: number | null;
  onSelectList: (id: number) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (id: number, strategy: 'keep' | 'delete') => void;
  onCreateList: (data: { title: string; folderId?: number | null; icon?: string; color?: string }) => void;
  onUpdateList: (id: number, data: { title?: string; folderId?: number | null; icon?: string; color?: string }) => void;
  listStats: Record<number, { total: number, completed: number, percentage: number }>;
  onManageTags: () => void;
}

/**
 * Sidebar component handles application-wide navigation and organization of lists and folders.
 */
export function Sidebar({ 
  folders, 
  lists, 
  activeListId, 
  onSelectList, 
  onCreateFolder, 
  onDeleteFolder, 
  onCreateList, 
  onUpdateList, 
  listStats, 
  onManageTags 
}: SidebarProps) {
  const {
    // State
    expandedFolders,
    isFolderModalOpen,
    setIsFolderModalOpen,
    newFolderName,
    setNewFolderName,
    isListModalOpen,
    setIsListModalOpen,
    newListTitle,
    setNewListTitle,
    newListFolder,
    setNewListFolder,
    newListIcon,
    setNewListIcon,
    newListColor,
    setNewListColor,
    isEditListModalOpen,
    setIsEditListModalOpen,
    editListTitle,
    setEditListTitle,
    editListFolder,
    setEditListFolder,
    editListIcon,
    setEditListIcon,
    editListColor,
    setEditListColor,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    folderToDelete,

    // Actions
    toggleFolder,
    handleCreateFolderSubmit,
    handleCreateListSubmit,
    handleEditListClick,
    handleEditListSubmit,
    handleDeleteFolderClick,
    confirmDeleteFolder
  } = useSidebar({
    folders,
    onCreateFolder,
    onDeleteFolder,
    onCreateList,
    onUpdateList
  });

  const uncategorizedLists = lists.filter(list => !list.folderId);

  return (
    <aside className="w-72 h-full bg-surface border-r border-border-subtle flex flex-col flex-shrink-0">
      <SidebarHeader />

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        {/* Dashboard Link */}
        <div className="space-y-1">
          <button
            onClick={() => onSelectList(-1)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-bold ${
              activeListId === null || activeListId === -1
                ? 'bg-primary/10 text-primary'
                : 'text-text-muted hover:bg-black/5 hover:text-text'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Uncategorized Lists */}
        {uncategorizedLists.length > 0 && (
          <div className="space-y-1">
            {uncategorizedLists.map(list => (
              <SidebarItem
                key={list.id}
                list={list}
                isActive={activeListId === list.id}
                onSelect={onSelectList}
                onEdit={handleEditListClick}
                stats={listStats[list.id]}
              />
            ))}
          </div>
        )}

        {/* Folders */}
        <div className="space-y-4">
          {folders.map(folder => (
            <SidebarFolder
              key={folder.id}
              folder={folder}
              lists={lists}
              activeListId={activeListId}
              isExpanded={expandedFolders[folder.id]}
              onToggle={toggleFolder}
              onDelete={handleDeleteFolderClick}
              onSelectList={onSelectList}
              onEditList={handleEditListClick}
              listStats={listStats}
            />
          ))}
        </div>
      </div>

      <SidebarFooter 
        onCreateList={() => setIsListModalOpen(true)}
        onCreateFolder={() => setIsFolderModalOpen(true)}
        onManageTags={onManageTags}
      />

      {/* Modals */}
      <FolderModal 
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onSubmit={handleCreateFolderSubmit}
        name={newFolderName}
        onChange={setNewFolderName}
      />

      <ListModal 
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onSubmit={handleCreateListSubmit}
        modalTitle="Create New List"
        submitLabel="Create List"
        title={newListTitle}
        onTitleChange={setNewListTitle}
        folderId={newListFolder}
        onFolderIdChange={setNewListFolder}
        icon={newListIcon}
        onIconChange={setNewListIcon}
        color={newListColor}
        onColorChange={setNewListColor}
        folders={folders}
      />

      <ListModal 
        isOpen={isEditListModalOpen}
        onClose={() => setIsEditListModalOpen(false)}
        onSubmit={handleEditListSubmit}
        modalTitle="Modifier la liste"
        submitLabel="Enregistrer"
        title={editListTitle}
        onTitleChange={setEditListTitle}
        folderId={editListFolder}
        onFolderIdChange={setEditListFolder}
        icon={editListIcon}
        onIconChange={setEditListIcon}
        color={editListColor}
        onColorChange={setEditListColor}
        folders={folders}
      />

      <DeleteFolderModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteFolder}
        folder={folderToDelete}
      />
    </aside>
  );
}
