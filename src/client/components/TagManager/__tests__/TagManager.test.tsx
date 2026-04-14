import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TagManager } from '../TagManager';

const mockTags = [
  { id: 1, name: 'Work', color: '#ff0000' },
  { id: 2, name: 'Urgent', color: '#00ff00' },
];

/**
 * TagManager component tests.
 */
describe('TagManager', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <TagManager 
        isOpen={false} 
        onClose={() => {}} 
        tags={mockTags} 
        onCreateTag={async () => {}} 
        onDeleteTag={async () => {}} 
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders tags when open', () => {
    render(
      <TagManager 
        isOpen={true} 
        onClose={() => {}} 
        tags={mockTags} 
        onCreateTag={async () => {}} 
        onDeleteTag={async () => {}} 
      />
    );
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Urgent')).toBeInTheDocument();
  });

  it('calls onCreateTag with name and color', async () => {
    const onCreateTag = vi.fn().mockResolvedValue(undefined);
    render(
      <TagManager 
        isOpen={true} 
        onClose={() => {}} 
        tags={mockTags} 
        onCreateTag={onCreateTag} 
        onDeleteTag={async () => {}} 
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/tag name/i), { target: { value: 'New Tag' } });
    
    // Select the second preset color (Orange - #f97316)
    const colorButtons = screen.getAllByRole('button').filter(b => b.style.backgroundColor !== '');
    fireEvent.click(colorButtons[1]);
    
    fireEvent.click(screen.getByText(/create tag/i));

    await waitFor(() => {
      expect(onCreateTag).toHaveBeenCalledWith('New Tag', expect.any(String));
    });
  });

  it('calls onDeleteTag when trash icon is clicked', async () => {
    const onDeleteTag = vi.fn().mockResolvedValue(undefined);
    render(
      <TagManager 
        isOpen={true} 
        onClose={() => {}} 
        tags={mockTags} 
        onCreateTag={async () => {}} 
        onDeleteTag={onDeleteTag} 
      />
    );

    fireEvent.click(screen.getByLabelText(/delete tag work/i));
    expect(onDeleteTag).toHaveBeenCalledWith(1);
  });
});
