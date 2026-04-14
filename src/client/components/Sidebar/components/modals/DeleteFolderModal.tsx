import { AlertTriangle } from 'lucide-react';
import { Modal } from '../../../ui/Modal/Modal';
import { Button } from '../../../ui/Button/Button';
import { Folder } from '../../../../types';

interface DeleteFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (strategy: 'keep' | 'delete') => void;
  folder: Folder | null;
}

/**
 * DeleteFolderModal component for confirming folder deletion and choosing a strategy for nested lists.
 */
export function DeleteFolderModal({ isOpen, onClose, onConfirm, folder }: DeleteFolderModalProps) {
  if (!folder) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
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
              Vous êtes sur le point de supprimer le dossier <span className="font-bold text-text">"{folder.name}"</span>. 
              Que souhaitez-vous faire des listes qu'il contient ?
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          <button
            onClick={() => onConfirm('keep')}
            className="w-full flex flex-col items-start gap-1 p-4 rounded-2xl border border-border-subtle bg-bg hover:border-primary hover:bg-primary/5 group transition-all"
          >
            <span className="text-sm font-bold text-text group-hover:text-primary transition-colors">Garder les listes associées</span>
            <span className="text-[11px] text-text-muted text-left">Elles seront déplacées dans la section générale.</span>
          </button>

          <button
            onClick={() => onConfirm('delete')}
            className="w-full flex flex-col items-start gap-1 p-4 rounded-2xl border border-border-subtle bg-bg hover:border-error hover:bg-error/5 group transition-all"
          >
            <span className="text-sm font-bold text-text group-hover:text-error transition-colors">Supprimer le dossier et les listes</span>
            <span className="text-[11px] text-text-muted text-left">Le dossier et tout son contenu seront définitivement perdus.</span>
          </button>
        </div>

        <div className="flex justify-center">
          <Button 
            variant="ghost"
            onClick={onClose}
          >
            Annuler
          </Button>
        </div>
      </div>
    </Modal>
  );
}
