import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FolderModal } from '../components/modals/FolderModal';

/**
 * FolderModal component tests.
 */
describe('FolderModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    name: 'New Folder',
    onChange: vi.fn(),
  };

  it('renders correctly when open', () => {
    render(<FolderModal {...defaultProps} />);
    expect(screen.getByText('Create New Folder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/folder name/i)).toHaveValue('New Folder');
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<FolderModal {...defaultProps} onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText(/folder name/i), { target: { value: 'Work' } });
    expect(onChange).toHaveBeenCalledWith('Work');
  });

  it('calls onSubmit when clicking create', () => {
    const onSubmit = vi.fn();
    render(<FolderModal {...defaultProps} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText('Create Folder'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('disables create button when name is empty', () => {
    render(<FolderModal {...defaultProps} name="" />);
    expect(screen.getByText('Create Folder')).toBeDisabled();
  });
});
