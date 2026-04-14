import { FormEvent } from 'react';
import { Modal } from '../../../ui/Modal/Modal';
import { Input } from '../../../ui/Input/Input';
import { Button } from '../../../ui/Button/Button';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  name: string;
  onChange: (value: string) => void;
  title?: string;
}

/**
 * FolderModal component for creating or potentially renaming folders.
 */
export function FolderModal({ isOpen, onClose, onSubmit, name, onChange, title = "Create New Folder" }: FolderModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input 
          autoFocus
          placeholder="Folder name" 
          value={name}
          onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={!name.trim()}>Create Folder</Button>
        </div>
      </form>
    </Modal>
  );
}
