import { useState, FormEvent, MouseEvent } from 'react';
import { Folder, TodoList } from '../../../types';

interface UseSidebarProps {
  folders: Folder[];
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (id: number, strategy: 'keep' | 'delete') => void;
  onCreateList: (data: { title: string; folderId?: number | null; icon?: string; color?: string }) => void;
  onUpdateList: (id: number, data: { title?: string; folderId?: number | null; icon?: string; color?: string }) => void;
}

/**
 * Custom hook to manage the state and business logic of the Sidebar component.
 */
export function useSidebar({ folders, onCreateFolder, onDeleteFolder, onCreateList, onUpdateList }: UseSidebarProps) {
  // Folder expansion state
  const [expandedFolders, setExpandedFolders] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    folders.forEach(f => {
      initial[f.id] = true; // Expand all by default
    });
    return initial;
  });

  // Modal states: Folder Creation
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Modal states: List Creation
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListFolder, setNewListFolder] = useState<number | null>(null);
  const [newListIcon, setNewListIcon] = useState<string>('List');
  const [newListColor, setNewListColor] = useState<string>('#E27D60');

  // Modal states: List Editing
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState<TodoList | null>(null);
  const [editListTitle, setEditListTitle] = useState('');
  const [editListFolder, setEditListFolder] = useState<number | null>(null);
  const [editListIcon, setEditListIcon] = useState<string>('List');
  const [editListColor, setEditListColor] = useState<string>('#E27D60');

  // Modal states: Folder Deletion
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);

  /**
   * Toggles the expansion state of a folder.
   */
  const toggleFolder = (folderId: number) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  /**
   * Handles the submission of the folder creation form.
   */
  const handleCreateFolderSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim());
    setNewFolderName('');
    setIsFolderModalOpen(false);
  };

  /**
   * Handles the submission of the list creation form.
   */
  const handleCreateListSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    onCreateList({
      title: newListTitle.trim(),
      folderId: newListFolder,
      icon: newListIcon,
      color: newListColor,
    });
    setNewListTitle('');
    setNewListFolder(null);
    setNewListIcon('List');
    setNewListColor('#E27D60');
    setIsListModalOpen(false);
  };

  /**
   * Opens the edit list modal and populates it with the list data.
   */
  const handleEditListClick = (e: MouseEvent, list: TodoList) => {
    e.stopPropagation();
    setListToEdit(list);
    setEditListTitle(list.title);
    setEditListFolder(list.folderId || null);
    setEditListIcon(list.icon || 'List');
    setEditListColor(list.color || '#E27D60');
    setIsEditListModalOpen(true);
  };

  /**
   * Handles the submission of the list editing form.
   */
  const handleEditListSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!listToEdit || !editListTitle.trim()) return;
    onUpdateList(listToEdit.id, {
      title: editListTitle.trim(),
      folderId: editListFolder,
      icon: editListIcon,
      color: editListColor,
    });
    setIsEditListModalOpen(false);
    setListToEdit(null);
  };

  /**
   * Opens the folder deletion confirmation modal.
   */
  const handleDeleteFolderClick = (e: MouseEvent, folder: Folder) => {
    e.stopPropagation();
    setFolderToDelete(folder);
    setIsDeleteModalOpen(true);
  };

  /**
   * Confirms the deletion of a folder with the specified strategy.
   */
  const confirmDeleteFolder = (strategy: 'keep' | 'delete') => {
    if (folderToDelete) {
      onDeleteFolder(folderToDelete.id, strategy);
      setIsDeleteModalOpen(false);
      setFolderToDelete(null);
    }
  };

  return {
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
  };
}
