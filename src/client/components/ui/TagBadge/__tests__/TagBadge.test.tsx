import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TagBadge } from '../TagBadge';

/**
 * TagBadge component tests.
 */
describe('TagBadge', () => {
  it('renders correctly with name and color', () => {
    render(<TagBadge name="Urgent" color="#ef4444" />);
    expect(screen.getByText('Urgent')).toBeInTheDocument();
  });

  it('calls onRemove when clicking the remove button', () => {
    const handleRemove = vi.fn();
    render(<TagBadge name="Urgent" color="#ef4444" onRemove={handleRemove} />);
    
    const removeButton = screen.getByLabelText(/remove tag urgent/i);
    fireEvent.click(removeButton);
    
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('renders correctly in different sizes', () => {
    const { rerender } = render(<TagBadge name="Test" color="#000" size="sm" />);
    expect(screen.getByText('Test')).toHaveClass('text-[10px]');

    rerender(<TagBadge name="Test" color="#000" size="md" />);
    expect(screen.getByText('Test')).toHaveClass('text-xs');
  });

  it('stops event propagation when clicking remove', () => {
    const handleRemove = vi.fn();
    const handleParentClick = vi.fn();
    
    render(
      <div onClick={handleParentClick}>
        <TagBadge name="Urgent" color="#ef4444" onRemove={handleRemove} />
      </div>
    );
    
    const removeButton = screen.getByLabelText(/remove tag urgent/i);
    fireEvent.click(removeButton);
    
    expect(handleRemove).toHaveBeenCalledTimes(1);
    expect(handleParentClick).not.toHaveBeenCalled();
  });
});
