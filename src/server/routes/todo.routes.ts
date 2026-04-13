import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '../db';
import { todos } from '../db/schema';
import { eq } from 'drizzle-orm';

const TodoSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  title: z.string().openapi({ example: 'Faire les courses' }),
  completed: z.boolean().openapi({ example: false }),
  createdAt: z.string().openapi({ example: '2024-03-20T10:00:00Z' }),
  listId: z.number().openapi({ example: 1 }),
}).openapi('Todo');

const CreateTodoSchema = z.object({
  title: z.string().min(1).openapi({ example: 'Apprendre Hono' }),
  listId: z.number().openapi({ example: 1 }),
}).openapi('CreateTodo');

const UpdateTodoSchema = z.object({
  title: z.string().min(1).optional().openapi({ example: 'Apprendre Hono (complété)' }),
  completed: z.boolean().optional().openapi({ example: true }),
}).openapi('UpdateTodo');

const ErrorSchema = z.object({
  error: z.string().openapi({ example: 'Not Found' }),
}).openapi('Error');

export const todoRoutes = new OpenAPIHono();

todoRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    description: 'Liste tous les todos',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(TodoSchema),
          },
        },
        description: 'Liste des todos récupérée avec succès',
      },
    },
  }),
  async (c) => {
    const allTodos = await db.select().from(todos);
    return c.json(allTodos.map(t => ({
      ...t,
      completed: !!t.completed,
      createdAt: t.createdAt || new Date().toISOString()
    })), 200);
  }
);

todoRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    description: 'Crée un nouveau todo',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateTodoSchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: TodoSchema,
          },
        },
        description: 'Todo créé avec succès',
      },
    },
  }),
  async (c) => {
    const body = await c.req.valid('json');
    const [insertedTodo] = await db.insert(todos).values(body).returning();
    const newTodo = {
      ...insertedTodo,
      completed: !!insertedTodo.completed
    };
    return c.json(newTodo, 201);
  }
);

todoRoutes.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    description: 'Met à jour un todo',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: UpdateTodoSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: TodoSchema,
          },
        },
        description: 'Todo mis à jour avec succès',
      },
      404: {
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
        description: 'Todo non trouvé',
      },
    },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.valid('json');
    
    const [updatedTodo] = await db
      .update(todos)
      .set(body)
      .where(eq(todos.id, id))
      .returning();

    if (!updatedTodo) {
      return c.json({ error: 'Not Found' }, 404);
    }

    return c.json({
      ...updatedTodo,
      completed: !!updatedTodo.completed
    }, 200);
  }
);

todoRoutes.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    description: 'Supprime un todo',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
      }),
    },
    responses: {
      204: {
        description: 'Todo supprimé avec succès',
      },
      404: {
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
        description: 'Todo non trouvé',
      },
    },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    const [deletedTodo] = await db.delete(todos).where(eq(todos.id, id)).returning();

    if (!deletedTodo) {
      return c.json({ error: 'Not Found' }, 404);
    }

    return c.body(null, 204);
  }
);
