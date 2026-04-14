import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { todoRoutes } from '../todo.routes';
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
 * Tests for the Todo API routes.
 */
describe('Todo Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET / returns all todos with tags', async () => {
    const mockTodos = [{ id: 1, title: 'Test Todo', completed: 0, order: 0, listId: 1 }];
    const mockTags = [{ id: 1, name: 'Urgent', color: '#ff0000' }];

    // Mock select().from().orderBy()
    (db.select as Mock).mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue(mockTodos)
      })
    });

    // Mock the innerJoin for tags
    // The component calls db.select(...).from(todoTags).innerJoin(tags, ...).where(...)
    
    // We need to handle the fact that select() is called twice (once for todos, once for tags per todo)
    (db.select as Mock)
      .mockReturnValueOnce({ // for todos
        from: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue(mockTodos)
        })
      })
      .mockReturnValue({ // for tags
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue(mockTags)
          })
        })
      });

    const res = await todoRoutes.request('/');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data[0].title).toBe('Test Todo');
    expect(data[0].tags).toEqual(mockTags);
  });

  it('POST / creates a todo with correct order', async () => {
    // Mocking max(order)
    (db.select as Mock).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ maxOrder: 5 }])
      })
    });

    const newTodo = { id: 10, title: 'New', order: 6, listId: 1, completed: false };
    (db.insert as Mock).mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([newTodo])
      })
    });

    const res = await todoRoutes.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New', listId: 1 }),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.order).toBe(6);
  });

  it('DELETE /:id deletes a todo', async () => {
    (db.delete as Mock).mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 1 }])
      })
    });

    const res = await todoRoutes.request('/1', {
      method: 'DELETE',
    });

    expect(res.status).toBe(204);
  });
});
