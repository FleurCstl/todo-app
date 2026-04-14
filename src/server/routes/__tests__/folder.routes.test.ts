import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { folderRoutes } from '../folder.routes';
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
 * Tests for the Folder API routes.
 */
describe('Folder Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET / returns all folders', async () => {
    const mockFolders = [{ id: 1, name: 'Work' }];
    (db.select as Mock).mockReturnValue({
      from: vi.fn().mockResolvedValue(mockFolders),
    });

    const res = await folderRoutes.request('/');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(mockFolders);
  });

  it('POST / creates a new folder', async () => {
    const newFolder = { name: 'Personal' };
    const insertedFolder = { id: 2, name: 'Personal' };
    
    (db.insert as Mock).mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([insertedFolder]),
      }),
    });

    const res = await folderRoutes.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFolder),
    });

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(insertedFolder);
  });

  it('DELETE /:id deletes a folder with strategy=delete', async () => {
    (db.delete as Mock).mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 1 }]),
      }),
    });

    const res = await folderRoutes.request('/1?strategy=delete', {
      method: 'DELETE',
    });

    expect(res.status).toBe(204);
  });

  it('DELETE /:id updates lists and deletes folder with strategy=keep', async () => {
    (db.update as Mock).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    });
    
    (db.delete as Mock).mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 1 }]),
      }),
    });

    const res = await folderRoutes.request('/1?strategy=keep', {
      method: 'DELETE',
    });

    expect(db.update).toHaveBeenCalled();
    expect(res.status).toBe(204);
  });
});
