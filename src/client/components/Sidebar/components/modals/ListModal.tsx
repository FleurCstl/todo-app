import { FormEvent } from 'react';
import { Modal } from '../../../ui/Modal/Modal';
import { Input } from '../../../ui/Input/Input';
import { Button } from '../../../ui/Button/Button';
import { Folder } from '../../../../types';
import { ICONS, COLORS } from '../../constants/constants';

interface ListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  title: string;
  onTitleChange: (value: string) => void;
  folderId: number | null;
  onFolderIdChange: (value: number | null) => void;
  icon: string;
  onIconChange: (value: string) => void;
  color: string;
  onColorChange: (value: string) => void;
  folders: Folder[];
  modalTitle: string;
  submitLabel: string;
}

/**
 * ListModal component for creating and editing lists.
 */
export function ListModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  onTitleChange,
  folderId,
  onFolderIdChange,
  icon,
  onIconChange,
  color,
  onColorChange,
  folders,
  modalTitle,
  submitLabel
}: ListModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text">List Name</label>
          <Input 
            autoFocus
            placeholder="E.g., Groceries, Project Alpha" 
            value={title}
            onChange={(e) => onTitleChange((e.target as HTMLInputElement).value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text">Folder (Optional)</label>
          <select 
            value={folderId || ''}
            onChange={(e) => onFolderIdChange((e.target as HTMLSelectElement).value ? parseInt(e.target.value) : null)}
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
                onClick={() => onIconChange(name)}
                className={`p-2 rounded-xl border transition-all ${
                  icon === name 
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
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onColorChange(c)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  color === c 
                    ? 'border-text scale-110 shadow-sm' 
                    : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={!title.trim()}>{submitLabel}</Button>
        </div>
      </form>
    </Modal>
  );
}
