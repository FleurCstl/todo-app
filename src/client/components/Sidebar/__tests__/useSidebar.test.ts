import { renderHook, act } from '@testing-library/react';
import { FormEvent, MouseEvent } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { useSidebar } from '../hooks/useSidebar';

const mockFolders = [
  { id: 1, name: 'Work' },
];

/**
 * useSidebar hook tests.
 */
describe('useSidebar', () => {
  const defaultProps = {
    folders: mockFolders,
    onCreateFolder: vi.fn(),
    onDeleteFolder: vi.fn(),
    onCreateList: vi.fn(),
    onUpdateList: vi.fn(),
  };

  it('initializes folder expansion state', () => {
    const { result } = renderHook(() => useSidebar(defaultProps));
    expect(result.current.expandedFolders[1]).toBe(true);
  });

  it('toggles folder expansion', () => {
    const { result } = renderHook(() => useSidebar(defaultProps));
    
    act(() => {
      result.current.toggleFolder(1);
    });
    expect(result.current.expandedFolders[1]).toBe(false);

    act(() => {
      result.current.toggleFolder(1);
    });
    expect(result.current.expandedFolders[1]).toBe(true);
  });

  it('manages folder modal state', () => {
    const { result } = renderHook(() => useSidebar(defaultProps));
    
    act(() => {
      result.current.setIsFolderModalOpen(true);
    });
    expect(result.current.isFolderModalOpen).toBe(true);
    
    act(() => {
      result.current.setNewFolderName('New Folder');
    });
    expect(result.current.newFolderName).toBe('New Folder');
  });

  it('handles folder creation submit', () => {
    const { result } = renderHook(() => useSidebar(defaultProps));
    
    act(() => {
      result.current.setNewFolderName('New Folder');
    });

    const mockEvent = { 
      preventDefault: vi.fn() 
    } as unknown as FormEvent;
    
    act(() => {
      result.current.handleCreateFolderSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(defaultProps.onCreateFolder).toHaveBeenCalledWith('New Folder');
    expect(result.current.newFolderName).toBe('');
    expect(result.current.isFolderModalOpen).toBe(false);
  });

  it('handles list creation submit', () => {
    const { result } = renderHook(() => useSidebar(defaultProps));
    
    act(() => {
      result.current.setNewListTitle('New List');
      result.current.setNewListColor('#ff0000');
    });

    const mockEvent = { 
      preventDefault: vi.fn() 
    } as unknown as FormEvent;
    
    act(() => {
      result.current.handleCreateListSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(defaultProps.onCreateList).toHaveBeenCalledWith({
      title: 'New List',
      folderId: null,
      icon: 'List',
      color: '#ff0000',
    });
    expect(result.current.newListTitle).toBe('');
    expect(result.current.isListModalOpen).toBe(false);
  });

  it('handles edit list click', () => {
    const { result } = renderHook(() => useSidebar(defaultProps));
    const mockList = { id: 1, title: 'Test List', folderId: null, icon: 'Star', color: '#fff' };
    const mockEvent = { 
      stopPropagation: vi.fn() 
    } as unknown as MouseEvent;

    act(() => {
      result.current.handleEditListClick(mockEvent, mockList);
    });

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(result.current.isEditListModalOpen).toBe(true);
    expect(result.current.editListTitle).toBe('Test List');
    expect(result.current.editListIcon).toBe('Star');
  });

  it('handles delete folder click', () => {
    const { result } = renderHook(() => useSidebar(defaultProps));
    const mockFolder = { id: 1, name: 'Work' };
    const mockEvent = { 
      stopPropagation: vi.fn()
    } as unknown as MouseEvent;

    act(() => {
      result.current.handleDeleteFolderClick(mockEvent, mockFolder);
    });

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(result.current.isDeleteModalOpen).toBe(true);
    expect(result.current.folderToDelete).toEqual(mockFolder);
  });

  it('confirms folder deletion', () => {
    const { result } = renderHook(() => useSidebar(defaultProps));
    const mockFolder = { id: 1, name: 'Work' };
    
    act(() => {
      result.current.handleDeleteFolderClick({ 
        stopPropagation: vi.fn() 
      } as unknown as MouseEvent, mockFolder);
    });

    act(() => {
      result.current.confirmDeleteFolder('keep');
    });

    expect(defaultProps.onDeleteFolder).toHaveBeenCalledWith(1, 'keep');
    expect(result.current.isDeleteModalOpen).toBe(false);
    expect(result.current.folderToDelete).toBeNull();
  });
});
