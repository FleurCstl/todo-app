import React, { useState } from 'react';
import { Tag } from '../../types';
import { Modal } from '../ui/Modal/Modal';
import { Input } from '../ui/Input/Input';
import { Button } from '../ui/Button/Button';
import { TagBadge } from '../ui/TagBadge/TagBadge';
import { Trash2, Plus, Check, Pencil, X } from 'lucide-react';

interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Tag[];
  onCreateTag: (name: string, color: string) => Promise<void>;
  onUpdateTag: (id: number, data: { name?: string, color?: string }) => Promise<void>;
  onDeleteTag: (id: number) => Promise<void>;
}

const PRESET_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#d946ef', // Fuchsia
  '#64748b', // Slate
];

export function TagManager({ isOpen, onClose, tags, onCreateTag, onUpdateTag, onDeleteTag }: TagManagerProps) {
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTagId, setEditingTagId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onCreateTag(newName.trim(), selectedColor);
      setNewName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateColor = async (id: number, color: string) => {
    await onUpdateTag(id, { color });
    setEditingTagId(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Tags">
      <div className="space-y-8">
        {/* Create New Tag */}
        <section className="space-y-4">
          <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Create New Tag</h4>
          <form onSubmit={handleSubmit} className="space-y-4 bg-bg/40 p-5 rounded-2xl border border-border-subtle shadow-sm">
            <Input
              placeholder="Tag name (e.g. Work, Urgent...)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full"
            />
            
            <div className="space-y-2">
              <span className="text-xs font-medium text-text-muted">Select Color</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                      selectedColor === color ? 'border-text scale-110 shadow-md' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && <Check size={14} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={!newName.trim() || isSubmitting} 
              className="w-full shadow-md shadow-primary/10"
            >
              <Plus size={18} className="mr-2" />
              Create Tag
            </Button>
          </form>
        </section>

        {/* Existing Tags */}
        <section className="space-y-4">
          <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Your Tags</h4>
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {tags.length === 0 ? (
              <p className="text-text-muted italic text-center py-4 bg-bg/20 rounded-xl border border-dashed border-border-subtle">No tags created yet.</p>
            ) : (
              tags.map(tag => (
                <div 
                  key={tag.id} 
                  className={`flex flex-col gap-3 p-3 rounded-xl border transition-all duration-200 group ${
                    editingTagId === tag.id ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'border-border-subtle bg-surface hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <TagBadge name={tag.name} color={tag.color} size="md" />
                    <div className="flex items-center gap-1">
                      {editingTagId === tag.id ? (
                        <button
                          onClick={() => setEditingTagId(null)}
                          className="p-1.5 text-text-muted hover:text-text hover:bg-bg rounded-lg transition-all duration-200"
                          title="Cancel editing"
                        >
                          <X size={16} />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingTagId(tag.id)}
                            className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            title="Changer la couleur"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => onDeleteTag(tag.id)}
                            className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            aria-label={`Delete tag ${tag.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {editingTagId === tag.id && (
                    <div className="pt-2 border-t border-border-subtle/50 animate-in fade-in slide-in-from-top-1 duration-200">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 px-1">Choisir une nouvelle couleur</p>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_COLORS.map(color => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => handleUpdateColor(tag.id, color)}
                            className={`w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                              tag.color === color ? 'border-text scale-110' : 'border-transparent hover:scale-110'
                            }`}
                            style={{ backgroundColor: color }}
                          >
                            {tag.color === color && <Check size={10} className="text-white" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </Modal>
  );
}
