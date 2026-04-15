import { useState, useRef, useEffect } from 'react';
import { Tag } from '../../types';
import { TagBadge } from '../ui/TagBadge/TagBadge';
import { Tag as TagIcon, Search, Check, Plus } from 'lucide-react';

interface TagSelectorProps {
  availableTags: Tag[];
  taskTags: Tag[];
  onAddTag: (tagId: number) => Promise<void>;
  onRemoveTag: (tagId: number) => Promise<void>;
  onCreateTag?: (name: string) => Promise<void>;
}

export function TagSelector({ availableTags, taskTags, onAddTag, onRemoveTag, onCreateTag }: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTags = availableTags.filter(tag => 
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  const isTagSelected = (tagId: number) => taskTags.some(t => t.id === tagId);

  const handleToggle = async (tag: Tag) => {
    if (isTagSelected(tag.id)) {
      await onRemoveTag(tag.id);
    } else {
      await onAddTag(tag.id);
    }
  };

  const handleCreate = async () => {
    if (onCreateTag && search.trim()) {
      await onCreateTag(search.trim());
      setSearch('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedSearch = search.trim().toLowerCase();
      const exactMatch = availableTags.find(tag => tag.name.toLowerCase() === trimmedSearch);
      
      if (exactMatch) {
        handleToggle(exactMatch);
        setSearch('');
      } else if (search.trim()) {
        handleCreate();
      }
    }
  };

  const exactMatch = search.trim() ? availableTags.find(tag => 
    tag.name.toLowerCase() === search.trim().toLowerCase()
  ) : null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded-lg transition-all duration-200 ${
          isOpen ? 'bg-primary/20 text-primary' : 'text-text-muted/40 hover:text-primary hover:bg-primary/10'
        }`}
        title="Manage tags for this task"
      >
        <TagIcon size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-64 bg-surface rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-border-subtle z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="p-3 border-b border-border-subtle bg-bg/50">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                autoFocus
                type="text"
                placeholder="Search tags..."
                className="w-full bg-surface border border-border-subtle rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto p-1 custom-scrollbar">
            {filteredTags.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-xs text-text-muted">No tags found.</p>
              </div>
            ) : (
              filteredTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => handleToggle(tag)}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-bg transition-colors group"
                >
                  <TagBadge name={tag.name} color={tag.color} />
                  {isTagSelected(tag.id) && (
                    <Check size={14} className="text-primary" />
                  )}
                </button>
              ))
            )}

            {search.trim() && !exactMatch && (
              <button
                onClick={handleCreate}
                className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-bg transition-colors group text-primary font-medium"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plus size={14} />
                  </div>
                  <span className="text-[11px]">Create "{search.trim()}"</span>
                </div>
              </button>
            )}
          </div>
          
          {availableTags.length === 0 && (
            <div className="p-4 text-center border-t border-border-subtle bg-bg/20">
              <p className="text-[10px] text-text-muted italic">Create tags in the sidebar first!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
