import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DeleteFolderModal } from '../components/modals/DeleteFolderModal';

/**
 * DeleteFolderModal component tests.
 */
describe('DeleteFolderModal', () => {
  const mockFolder = { id: 1, name: 'Work' };
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    folder: mockFolder,
  };

  it('renders correctly', () => {
    render(<DeleteFolderModal {...defaultProps} />);
    expect(screen.getByRole('heading', { name: /supprimer le dossier/i })).toBeInTheDocument();
    expect(screen.getByText(/"Work"/)).toBeInTheDocument();
  });

  it('calls onConfirm with "keep" strategy', () => {
    const onConfirm = vi.fn();
    render(<DeleteFolderModal {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText(/garder les listes associées/i));
    expect(onConfirm).toHaveBeenCalledWith('keep');
  });

  it('calls onConfirm with "delete" strategy', () => {
    const onConfirm = vi.fn();
    render(<DeleteFolderModal {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText(/supprimer le dossier et les listes/i));
    expect(onConfirm).toHaveBeenCalledWith('delete');
  });

  it('calls onClose when clicking Annuler', () => {
    const onClose = vi.fn();
    render(<DeleteFolderModal {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByText('Annuler'));
    expect(onClose).toHaveBeenCalled();
  });
});
