import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { listRoutes } from '../list.routes';
import { db } from '../../db';

vi.mock('../../db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

/**
 * Tests for the List API routes.
 */
describe('List Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET / returns all lists', async () => {
    const mockLists = [{ id: 1, title: 'Inbox', folderId: null }];
    (db.select as Mock).mockReturnValue({
      from: vi.fn().mockResolvedValue(mockLists),
    });

    const res = await listRoutes.request('/');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(mockLists);
  });

  it('POST / creates a new list', async () => {
    const newList = { title: 'Shopping', folderId: 1 };
    const insertedList = { id: 2, ...newList, icon: 'List', color: '#E27D60' };
    
    (db.insert as Mock).mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([insertedList]),
      }),
    });

    const res = await listRoutes.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newList),
    });

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(insertedList);
  });

  it('DELETE /:id deletes a list', async () => {
    (db.delete as Mock).mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 1 }]),
      }),
    });

    const res = await listRoutes.request('/1', {
      method: 'DELETE',
    });

    expect(res.status).toBe(204);
  });
});
