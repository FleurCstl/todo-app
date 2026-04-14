import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ListModal } from '../components/modals/ListModal';

/**
 * ListModal component tests.
 */
describe('ListModal', () => {
  const mockFolders = [{ id: 1, name: 'Work' }];
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    title: 'New List',
    onTitleChange: vi.fn(),
    folderId: null,
    onFolderIdChange: vi.fn(),
    icon: 'List',
    onIconChange: vi.fn(),
    color: '#E27D60',
    onColorChange: vi.fn(),
    folders: mockFolders,
    modalTitle: 'Create New List',
    submitLabel: 'Create List',
  };

  it('renders correctly', () => {
    render(<ListModal {...defaultProps} />);
    expect(screen.getByText('Create New List')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g., groceries/i)).toHaveValue('New List');
  });

  it('calls onTitleChange when typing name', () => {
    const onTitleChange = vi.fn();
    render(<ListModal {...defaultProps} onTitleChange={onTitleChange} />);
    fireEvent.change(screen.getByPlaceholderText(/e.g., groceries/i), { target: { value: 'Shopping' } });
    expect(onTitleChange).toHaveBeenCalledWith('Shopping');
  });

  it('calls onFolderIdChange when selecting a folder', () => {
    const onFolderIdChange = vi.fn();
    render(<ListModal {...defaultProps} onFolderIdChange={onFolderIdChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    expect(onFolderIdChange).toHaveBeenCalledWith(1);
  });

  it('calls onIconChange when clicking an icon', () => {
    const onIconChange = vi.fn();
    render(<ListModal {...defaultProps} onIconChange={onIconChange} />);
    // There are several icon buttons. Let's pick one (e.g., Star)
    // We can use the fact that they are buttons.
    const starButton = screen.getAllByRole('button').find(b => b.querySelector('svg')?.classList.contains('lucide-star'));
    if (starButton) fireEvent.click(starButton);
    // Actually icons are lucide icons, so they have classes.
    // Or just pick by index if we know the order.
    // Let's just test that one of them is clickable.
    const iconButtons = screen.getAllByRole('button').filter(b => b.querySelector('svg'));
    if (iconButtons[1]) fireEvent.click(iconButtons[1]); // Index 1 is likely Star
    expect(onIconChange).toHaveBeenCalled();
  });
});
