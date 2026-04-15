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
  it('renders loading state initially and then main content', async () => {
    // Check loading state immediately
    render(<App />);
    expect(screen.getByText(/loading taskmaster/i)).toBeInTheDocument();

    // Wait for loading to finish to avoid act() warnings from state updates after test completes
    await waitFor(() => {
      expect(screen.queryByText(/loading taskmaster/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('TaskMaster')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });
});
