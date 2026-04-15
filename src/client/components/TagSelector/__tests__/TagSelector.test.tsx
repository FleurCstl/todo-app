import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TagSelector } from '../TagSelector';

const mockAvailableTags = [
  { id: 1, name: 'Work', color: '#ff0000' },
  { id: 2, name: 'Urgent', color: '#00ff00' },
  { id: 3, name: 'Home', color: '#0000ff' },
];

const mockTaskTags = [
  { id: 1, name: 'Work', color: '#ff0000' },
];

/**
 * TagSelector component tests.
 */
describe('TagSelector', () => {
  it('is closed by default', () => {
    render(
      <TagSelector 
        availableTags={mockAvailableTags} 
        taskTags={mockTaskTags} 
        onAddTag={async () => {}} 
        onRemoveTag={async () => {}} 
      />
    );
    expect(screen.queryByPlaceholderText(/search tags/i)).not.toBeInTheDocument();
  });

  it('opens when clicking the trigger', () => {
    render(
      <TagSelector 
        availableTags={mockAvailableTags} 
        taskTags={mockTaskTags} 
        onAddTag={async () => {}} 
        onRemoveTag={async () => {}} 
      />
    );
    
    fireEvent.click(screen.getByTitle(/manage tags for this task/i));
    expect(screen.getByPlaceholderText(/search tags/i)).toBeInTheDocument();
  });

  it('filters tags based on search', () => {
    render(
      <TagSelector 
        availableTags={mockAvailableTags} 
        taskTags={mockTaskTags} 
        onAddTag={async () => {}} 
        onRemoveTag={async () => {}} 
      />
    );
    
    fireEvent.click(screen.getByTitle(/manage tags for this task/i));
    fireEvent.change(screen.getByPlaceholderText(/search tags/i), { target: { value: 'Work' } });
    
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('calls onAddTag when an unselected tag is clicked', async () => {
    const onAddTag = vi.fn().mockResolvedValue(undefined);
    render(
      <TagSelector 
        availableTags={mockAvailableTags} 
        taskTags={mockTaskTags} 
        onAddTag={onAddTag} 
        onRemoveTag={async () => {}} 
      />
    );
    
    fireEvent.click(screen.getByTitle(/manage tags for this task/i));
    fireEvent.click(screen.getByText('Urgent'));
    
    expect(onAddTag).toHaveBeenCalledWith(2);
  });

  it('calls onRemoveTag when a selected tag is clicked', async () => {
    const onRemoveTag = vi.fn().mockResolvedValue(undefined);
    render(
      <TagSelector 
        availableTags={mockAvailableTags} 
        taskTags={mockTaskTags} 
        onAddTag={async () => {}} 
        onRemoveTag={onRemoveTag} 
      />
    );
    
    fireEvent.click(screen.getByTitle(/manage tags for this task/i));
    fireEvent.click(screen.getByText('Work'));
    
    expect(onRemoveTag).toHaveBeenCalledWith(1);
  });

  it('closes when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <TagSelector 
          availableTags={mockAvailableTags} 
          taskTags={mockTaskTags} 
          onAddTag={async () => {}} 
          onRemoveTag={async () => {}} 
        />
      </div>
    );
    
    fireEvent.click(screen.getByTitle(/manage tags for this task/i));
    expect(screen.getByPlaceholderText(/search tags/i)).toBeInTheDocument();
    
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByPlaceholderText(/search tags/i)).not.toBeInTheDocument();
  });

  it('calls onCreateTag when pressing Enter on a new tag name', async () => {
    const onCreateTag = vi.fn().mockResolvedValue(undefined);
    render(
      <TagSelector 
        availableTags={mockAvailableTags} 
        taskTags={mockTaskTags} 
        onAddTag={async () => {}} 
        onRemoveTag={async () => {}} 
        onCreateTag={onCreateTag}
      />
    );
    
    fireEvent.click(screen.getByTitle(/manage tags for this task/i));
    const input = screen.getByPlaceholderText(/search tags/i);
    fireEvent.change(input, { target: { value: 'NewTag' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(onCreateTag).toHaveBeenCalledWith('NewTag');
  });

  it('shows create button when no exact match is found', async () => {
    const onCreateTag = vi.fn().mockResolvedValue(undefined);
    render(
      <TagSelector 
        availableTags={mockAvailableTags} 
        taskTags={mockTaskTags} 
        onAddTag={async () => {}} 
        onRemoveTag={async () => {}} 
        onCreateTag={onCreateTag}
      />
    );
    
    fireEvent.click(screen.getByTitle(/manage tags for this task/i));
    fireEvent.change(screen.getByPlaceholderText(/search tags/i), { target: { value: 'NewTag' } });
    
    const createButton = screen.getByText(/create "NewTag"/i);
    expect(createButton).toBeInTheDocument();
    
    fireEvent.click(createButton);
    expect(onCreateTag).toHaveBeenCalledWith('NewTag');
  });

  it('toggles existing tag when pressing Enter on an exact match', async () => {
    const onAddTag = vi.fn().mockResolvedValue(undefined);
    render(
      <TagSelector 
        availableTags={mockAvailableTags} 
        taskTags={mockTaskTags} 
        onAddTag={onAddTag} 
        onRemoveTag={async () => {}} 
      />
    );
    
    fireEvent.click(screen.getByTitle(/manage tags for this task/i));
    const input = screen.getByPlaceholderText(/search tags/i);
    fireEvent.change(input, { target: { value: 'Urgent' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(onAddTag).toHaveBeenCalledWith(2);
  });
});
