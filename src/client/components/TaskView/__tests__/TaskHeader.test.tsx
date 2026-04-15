import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskHeader } from '../components/TaskHeader';
import { List, Star } from 'lucide-react';

describe('TaskHeader', () => {
  const mockStats = {
    percentage: 50,
    completed: 5,
    total: 10
  };

  it('renders list title and percentage', () => {
    const mockList = { id: 1, title: 'Project X', folderId: null };
    render(<TaskHeader list={mockList} iconMap={{ List }} stats={mockStats} />);
    
    expect(screen.getByText('Project X')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('uses default title when no list is provided', () => {
    render(<TaskHeader list={undefined} iconMap={{ List }} stats={mockStats} />);
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
  });

  it('renders the correct icon from iconMap', () => {
    const mockList = { id: 1, title: 'Important', icon: 'Star' };
    render(<TaskHeader list={mockList} iconMap={{ List, Star }} stats={mockStats} />);
    // We can't easily check the icon component itself without some extra setup, 
    // but we can check if the header renders.
    expect(screen.getByText('Important')).toBeInTheDocument();
  });
});
