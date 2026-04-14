import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DropdownMenu, DropdownItem } from '../DropdownMenu';

/**
 * DropdownMenu component tests.
 */
describe('DropdownMenu', () => {
  it('is closed by default', () => {
    render(
      <DropdownMenu>
        <DropdownItem onClick={() => {}}>Option 1</DropdownItem>
      </DropdownMenu>
    );
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  it('opens when clicking the trigger', () => {
    render(
      <DropdownMenu>
        <DropdownItem onClick={() => {}}>Option 1</DropdownItem>
      </DropdownMenu>
    );
    
    fireEvent.click(screen.getByLabelText(/more options/i));
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('closes when clicking an item', () => {
    const handleItemClick = vi.fn();
    render(
      <DropdownMenu>
        <DropdownItem onClick={handleItemClick}>Option 1</DropdownItem>
      </DropdownMenu>
    );
    
    fireEvent.click(screen.getByLabelText(/more options/i));
    fireEvent.click(screen.getByText('Option 1'));
    
    expect(handleItemClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  it('closes when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <DropdownMenu>
          <DropdownItem onClick={() => {}}>Option 1</DropdownItem>
        </DropdownMenu>
      </div>
    );
    
    fireEvent.click(screen.getByLabelText(/more options/i));
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });
});
