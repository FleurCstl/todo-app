import { Folder, TodoList } from '../../types';
import { ChevronRight, Folder as FolderIcon, Plus, FolderPlus, Star, Briefcase, Heart, Book, List, Trash2, AlertTriangle, LayoutDashboard } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/Button/Button';
import { Input } from '../ui/Input/Input';
import { Modal } from '../ui/Modal/Modal';

interface SidebarProps {
  folders: Folder[];
  lists: TodoList[];
  activeListId: number | null;
  onSelectList: (id: number) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (id: number, strategy: 'keep' | 'delete') => void;
  onCreateList: (data: { title: string; folderId?: number | null; icon?: string; color?: string }) => void;
  listStats: Record<number, { total: number, completed: number, percentage: number }>;
}

export function Sidebar({ folders, lists, activeListId, onSelectList, onCreateFolder, onDeleteFolder, onCreateList, listStats }: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    folders.forEach(f => {
      initial[f.id] = true; // Expand all by default
    });
    return initial;
  });

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListFolder, setNewListFolder] = useState<number | null>(null);
  const [newListIcon, setNewListIcon] = useState<string>('List');
  const [newListColor, setNewListColor] = useState<string>('#E27D60');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);

  const ICONS = [
    { name: 'List', component: List },
    { name: 'Star', component: Star },
    { name: 'Briefcase', component: Briefcase },
    { name: 'Heart', component: Heart },
    { name: 'Book', component: Book },
  ];

  const ICON_MAP: Record<string, any> = {
    List: List,
    Star: Star,
    Briefcase: Briefcase,
    Heart: Heart,
    Book: Book,
  };

  const COLORS = ['#E27D60', '#85D2B0', '#E8A87C', '#C38D9E', '#41B3A3', '#7FB3D5', '#A569BD', '#F7DC6F'];

  const toggleFolder = (folderId: number) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim());
    setNewFolderName('');
    setIsFolderModalOpen(false);
  };

  const handleCreateListSubmit = (e: React.FormEvent) => {
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

  const handleDeleteClick = (e: React.MouseEvent, folder: Folder) => {
    e.stopPropagation();
    setFolderToDelete(folder);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = (strategy: 'keep' | 'delete') => {
    if (folderToDelete) {
      onDeleteFolder(folderToDelete.id, strategy);
      setIsDeleteModalOpen(false);
      setFolderToDelete(null);
    }
  };

  const uncategorizedLists = lists.filter(list => !list.folderId);

  return (
    <aside className="w-72 h-full bg-surface border-r border-border-subtle flex flex-col flex-shrink-0">
      <div className="p-6 pb-4">
        <h2 className="text-xl font-extrabold text-primary tracking-tight">TaskMaster</h2>
        <p className="text-xs font-medium text-text-muted mt-1 uppercase tracking-wider">Your personal workspace</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        {/* Dashboard Link */}
        <div className="space-y-1">
          <button
            onClick={() => onSelectList(-1)} // Using -1 or null for Dashboard
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
              <button
                key={list.id}
                onClick={() => onSelectList(list.id)}
                className={`w-full flex flex-col gap-1.5 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                  activeListId === list.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:bg-black/5 hover:text-text'
                }`}
              >
                <div className="w-full flex items-center gap-3">
                  {(() => {
                    const IconComponent = ICON_MAP[list.icon || 'List'] || List;
                    return <IconComponent 
                      size={18} 
                      className={activeListId === list.id ? 'text-primary' : 'text-text-muted/70'} 
                      style={activeListId !== list.id && list.color ? { color: list.color } : {}}
                    />;
                  })()}
                  <span className="truncate flex-1 text-left">{list.title}</span>
                  {listStats[list.id]?.total > 0 && (
                    <span className="text-[10px] opacity-60 font-bold">{listStats[list.id].percentage}%</span>
                  )}
                </div>
                {listStats[list.id]?.total > 0 && (
                  <div className="pl-[30px] w-full">
                    <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden group-hover:bg-black/10 transition-colors">
                      <div 
                        className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${listStats[list.id].percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Folders */}
        <div className="space-y-4">
          {folders.map(folder => {
            const folderLists = lists.filter(list => list.folderId === folder.id);
            const isExpanded = expandedFolders[folder.id];

            return (
              <div key={folder.id} className="space-y-1">
                <div className="group/folder flex items-center pr-2">
                  <button
                    onClick={() => toggleFolder(folder.id)}
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
                    onClick={(e) => handleDeleteClick(e, folder)}
                    className="opacity-0 group-hover/folder:opacity-60 hover:!opacity-100 p-1 text-text-muted hover:text-error transition-all"
                    title="Supprimer le dossier"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Folder Lists */}
                <div 
                  className={`grid grid-rows-[0fr] transition-all duration-300 ease-in-out ${
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pl-6 pr-2 space-y-1 pt-1">
                      {folderLists.map(list => (
                        <button
                          key={list.id}
                          onClick={() => onSelectList(list.id)}
                          className={`w-full flex flex-col gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                            activeListId === list.id
                              ? 'bg-primary/10 text-primary shadow-sm border border-primary/10'
                              : 'text-text-muted hover:bg-black/5 hover:text-text border border-transparent'
                          }`}
                        >
                          <div className="w-full flex items-center gap-3">
                            <div 
                              className={`w-2 h-2 rounded-full ${activeListId === list.id ? 'bg-primary' : 'bg-text-muted/40'}`} 
                              style={activeListId !== list.id && list.color ? { backgroundColor: list.color } : {}}
                            />
                            <span className="truncate flex-1 text-left">{list.title}</span>
                            {listStats[list.id]?.total > 0 && (
                              <span className="text-[10px] opacity-60 font-bold">{listStats[list.id].percentage}%</span>
                            )}
                          </div>
                          {listStats[list.id]?.total > 0 && (
                            <div className="pl-[18px] w-full">
                              <div className="h-0.5 w-full bg-black/5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                                  style={{ width: `${listStats[list.id].percentage}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                      {folderLists.length === 0 && (
                        <p className="px-3 py-2 text-xs text-text-muted/60 italic font-medium">Empty folder</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border-subtle flex gap-2">
        <Button 
          onClick={() => setIsListModalOpen(true)} 
          className="flex-1 text-xs bg-bg text-text hover:bg-black/5 hover:text-text border border-border-subtle shadow-none h-9 px-0"
        >
          <Plus size={14} className="mr-1.5" /> List
        </Button>
        <Button 
          onClick={() => setIsFolderModalOpen(true)} 
          className="flex-1 text-xs bg-bg text-text hover:bg-black/5 hover:text-text border border-border-subtle shadow-none h-9 px-0"
        >
          <FolderPlus size={14} className="mr-1.5" /> Folder
        </Button>
      </div>

      {/* Modals */}
      <Modal isOpen={isFolderModalOpen} onClose={() => setIsFolderModalOpen(false)} title="Create New Folder">
        <form onSubmit={handleCreateFolderSubmit} className="flex flex-col gap-4">
          <Input 
            autoFocus
            placeholder="Folder name" 
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" onClick={() => setIsFolderModalOpen(false)} className="bg-transparent text-text hover:bg-black/5 shadow-none hover:shadow-none">Cancel</Button>
            <Button type="submit" disabled={!newFolderName.trim()}>Create Folder</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isListModalOpen} onClose={() => setIsListModalOpen(false)} title="Create New List">
        <form onSubmit={handleCreateListSubmit} className="flex flex-col gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text">List Name</label>
            <Input 
              autoFocus
              placeholder="E.g., Groceries, Project Alpha" 
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text">Folder (Optional)</label>
            <select 
              value={newListFolder || ''}
              onChange={(e) => setNewListFolder(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full h-10 px-3 rounded-xl bg-bg border border-border-subtle text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none transition-all"
            >
              <option value="">None (Lists)</option>
              {folders.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text">Icon</label>
            <div className="flex gap-2">
              {ICONS.map(({ name, component: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setNewListIcon(name)}
                  className={`p-2 rounded-xl border transition-all ${
                    newListIcon === name 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border-subtle text-text-muted hover:bg-bg hover:border-gray-300'
                  }`}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text">Color</label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewListColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    newListColor === color 
                      ? 'border-text scale-110 shadow-sm' 
                      : 'border-transparent hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" onClick={() => setIsListModalOpen(false)} className="bg-transparent text-text hover:bg-black/5 shadow-none hover:shadow-none">Cancel</Button>
            <Button type="submit" disabled={!newListTitle.trim()}>Create List</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Folder Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Supprimer le dossier"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-error/5 border border-error/10">
            <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error flex-shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-text mb-1">Attention</p>
              <p className="text-xs text-text-muted leading-relaxed">
                Vous êtes sur le point de supprimer le dossier <span className="font-bold text-text">"{folderToDelete?.name}"</span>. 
                Que souhaitez-vous faire des listes qu'il contient ?
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <button
              onClick={() => confirmDelete('keep')}
              className="w-full flex flex-col items-start gap-1 p-4 rounded-2xl border border-border-subtle bg-bg hover:border-primary hover:bg-primary/5 group transition-all"
            >
              <span className="text-sm font-bold text-text group-hover:text-primary transition-colors">Garder les listes associées</span>
              <span className="text-[11px] text-text-muted text-left">Elles seront déplacées dans la section générale.</span>
            </button>

            <button
              onClick={() => confirmDelete('delete')}
              className="w-full flex flex-col items-start gap-1 p-4 rounded-2xl border border-border-subtle bg-bg hover:border-error hover:bg-error/5 group transition-all"
            >
              <span className="text-sm font-bold text-text group-hover:text-error transition-colors">Supprimer le dossier et les listes</span>
              <span className="text-[11px] text-text-muted text-left">Le dossier et tout son contenu seront définitivement perdus.</span>
            </button>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-xs font-semibold text-text-muted hover:text-text px-4 py-2 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>
    </aside>
  );
}
