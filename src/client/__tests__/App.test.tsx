import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mock the API client
vi.mock('../api', () => ({
  api: {
    folders: { $get: vi.fn().mockResolvedValue({ ok: true, json: async () => [] }) },
    lists: { $get: vi.fn().mockResolvedValue({ ok: true, json: async () => [] }) },
    todos: { $get: vi.fn().mockResolvedValue({ ok: true, json: async () => [] }) },
    tags: { $get: vi.fn().mockResolvedValue({ ok: true, json: async () => [] }) },
  },
}));

/**
 * Main App component tests.
 */
describe('App', () => {
  it('renders loading state initially', () => {
    // We intentionally don't await anything here to see the loading state
    render(<App />);
    expect(screen.getByText(/loading taskmaster/i)).toBeInTheDocument();
  });

  it('renders main content after loading', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByText(/loading taskmaster/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('TaskMaster')).toBeInTheDocument();
    // Use role and name to be specific about which Dashboard text we want (the heading)
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });
});
