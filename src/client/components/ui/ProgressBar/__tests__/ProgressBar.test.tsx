import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from '../ProgressBar';

/**
 * ProgressBar component tests.
 */
describe('ProgressBar', () => {
  it('renders correctly with given progress', () => {
    const { container } = render(<ProgressBar progress={50} />);
    const bar = container.querySelector('.bg-primary');
    expect(bar).toHaveStyle({ width: '50%' });
  });

  it('clamps progress between 0 and 100', () => {
    const { container, rerender } = render(<ProgressBar progress={-10} />);
    let bar = container.querySelector('.bg-primary');
    expect(bar).toHaveStyle({ width: '0%' });

    rerender(<ProgressBar progress={150} />);
    bar = container.querySelector('.bg-primary');
    expect(bar).toHaveStyle({ width: '100%' });
  });

  it('shows text when showText is true', () => {
    render(<ProgressBar progress={75} showText={true} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText(/complétion/i)).toBeInTheDocument();
  });

  it('does not show text when showText is false', () => {
    render(<ProgressBar progress={75} showText={false} />);
    expect(screen.queryByText('75%')).not.toBeInTheDocument();
  });
});
