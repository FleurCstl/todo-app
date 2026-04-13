import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '../db';
import { todos } from '../db/schema';
import { eq, max } from 'drizzle-orm';

const TodoSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  title: z.string().openapi({ example: 'Faire les courses' }),
  completed: z.boolean().openapi({ example: false }),
  deadline: z.string().nullable().optional().openapi({ example: '2024-03-20' }),
  createdAt: z.string().openapi({ example: '2024-03-20T10:00:00Z' }),
  listId: z.number().openapi({ example: 1 }),
  order: z.number().openapi({ example: 0 }),
}).openapi('Todo');

const CreateTodoSchema = z.object({
  title: z.string().min(1).openapi({ example: 'Apprendre Hono' }),
  listId: z.number().openapi({ example: 1 }),
  deadline: z.string().nullable().optional().openapi({ example: '2024-03-20' }),
}).openapi('CreateTodo');

const UpdateTodoSchema = z.object({
  title: z.string().min(1).optional().openapi({ example: 'Apprendre Hono (complété)' }),
  completed: z.boolean().optional().openapi({ example: true }),
  deadline: z.string().nullable().optional().openapi({ example: '2024-03-20' }),
}).openapi('UpdateTodo');

const ReorderSchema = z.object({
  listId: z.number().openapi({ example: 1 }),
  orderedIds: z.array(z.number()).openapi({ example: [3, 1, 2] }),
}).openapi('Reorder');

const ErrorSchema = z.object({
  error: z.string().openapi({ example: 'Not Found' }),
}).openapi('Error');

export const todoRoutes = new OpenAPIHono();

// GET / — retourne tous les todos triés par order
todoRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    description: 'Liste tous les todos triés par order',
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
    const allTodos = await db.select().from(todos).orderBy(todos.order);
    return c.json(allTodos.map(t => ({
      ...t,
      completed: !!t.completed,
      createdAt: t.createdAt || new Date().toISOString()
    })), 200);
  }
);

// POST / — crée un todo avec order = max + 1 pour la liste
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

    // Calcul de l'order max pour cette liste
    const [result] = await db
      .select({ maxOrder: max(todos.order) })
      .from(todos)
      .where(eq(todos.listId, body.listId));
    const nextOrder = (result?.maxOrder ?? -1) + 1;

    const [insertedTodo] = await db
      .insert(todos)
      .values({ ...body, order: nextOrder })
      .returning();

    return c.json({
      ...insertedTodo,
      completed: !!insertedTodo.completed
    }, 201);
  }
);

// PATCH /reorder — met à jour l'ordre de tous les todos d'une liste
todoRoutes.openapi(
  createRoute({
    method: 'patch',
    path: '/reorder',
    description: 'Met à jour l\'ordre des todos d\'une liste',
    request: {
      body: {
        content: {
          'application/json': {
            schema: ReorderSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({ success: z.boolean() }),
          },
        },
        description: 'Ordre mis à jour avec succès',
      },
    },
  }),
  async (c) => {
    const { orderedIds } = await c.req.valid('json');

    await Promise.all(
      orderedIds.map((id, index) =>
        db.update(todos).set({ order: index }).where(eq(todos.id, id))
      )
    );

    return c.json({ success: true }, 200);
  }
);

// PATCH /:id — met à jour un todo
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

// DELETE /:id — supprime un todo
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
