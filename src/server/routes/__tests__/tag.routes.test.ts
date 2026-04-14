import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { tagRoutes } from '../tag.routes';
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
 * Tests for the Tag API routes.
 */
describe('Tag Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET / returns all tags', async () => {
    const mockTags = [{ id: 1, name: 'Work', color: '#ff0000' }];
    (db.select as Mock).mockReturnValue({
      from: vi.fn().mockResolvedValue(mockTags),
    });

    const res = await tagRoutes.request('/');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(mockTags);
  });

  it('POST / creates a new tag', async () => {
    const newTag = { name: 'Urgent', color: '#00ff00' };
    const insertedTag = { id: 2, ...newTag };
    
    (db.insert as Mock).mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([insertedTag]),
      }),
    });

    const res = await tagRoutes.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTag),
    });

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(insertedTag);
  });

  it('PATCH /:id updates a tag', async () => {
    const updateData = { name: 'Very Urgent' };
    const updatedTag = { id: 1, name: 'Very Urgent', color: '#ff0000' };

    (db.update as Mock).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([updatedTag]),
        }),
      }),
    });

    const res = await tagRoutes.request('/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(updatedTag);
  });

  it('DELETE /:id deletes a tag', async () => {
    (db.delete as Mock).mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 1 }]),
      }),
    });

    const res = await tagRoutes.request('/1', {
      method: 'DELETE',
    });

    expect(res.status).toBe(204);
  });

  it('PATCH /:id returns 404 if tag not found', async () => {
    (db.update as Mock).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    const res = await tagRoutes.request('/999', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Fail' }),
    });

    expect(res.status).toBe(404);
  });
});
