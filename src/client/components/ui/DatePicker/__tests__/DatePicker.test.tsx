import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DatePicker } from '../DatePicker';

// Mock Popover to simplify testing
vi.mock('@radix-ui/react-popover', () => ({
  Root: ({ children, open, onOpenChange }: { children: React.ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) => (
    <div data-testid="popover-root" onClick={() => onOpenChange?.(!open)}>
      {children}
    </div>
  ),
  Trigger: ({ children }: { children: React.ReactNode }) => <div data-testid="popover-trigger">{children}</div>,
  Portal: ({ children }: { children: React.ReactNode }) => <div data-testid="popover-portal">{children}</div>,
  Content: ({ children }: { children: React.ReactNode }) => <div data-testid="popover-content">{children}</div>,
}));

// Mock DayPicker
vi.mock('react-day-picker', () => ({
  DayPicker: ({ onSelect }: { onSelect: (date: Date) => void }) => (
    <button data-testid="day-button" onClick={() => onSelect(new Date('2026-05-20'))}>
      Select Date
    </button>
  ),
}));

/**
 * DatePicker component tests.
 */
describe('DatePicker', () => {
  it('renders correctly with placeholder when no date is provided', () => {
    render(<DatePicker onSelect={() => {}} />);
    expect(screen.getByText(/set deadline/i)).toBeInTheDocument();
  });

  it('renders the formatted date when a date is provided', () => {
    render(<DatePicker date="2026-04-14" onSelect={() => {}} />);
    // "14 Apr" is expected based on "d MMM" format
    expect(screen.getByText(/14 Apr/i)).toBeInTheDocument();
  });

  it('calls onSelect with null when clicking the clear button', () => {
    const handleSelect = vi.fn();
    render(<DatePicker date="2026-04-14" onSelect={handleSelect} />);
    
    // The clear button is only visible on group-hover, but fireEvent should work
    const clearButton = screen.getByLabelText(/clear deadline/i);
    fireEvent.click(clearButton);
    
    expect(handleSelect).toHaveBeenCalledWith(null);
  });

  it('calls onSelect with ISO date when a date is picked in the calendar', () => {
    const handleSelect = vi.fn();
    render(<DatePicker onSelect={handleSelect} />);
    
    // Open popover
    fireEvent.click(screen.getByTestId('popover-root'));
    
    // Click date button (from mock)
    fireEvent.click(screen.getByTestId('day-button'));
    
    expect(handleSelect).toHaveBeenCalledWith('2026-05-20');
  });
});
