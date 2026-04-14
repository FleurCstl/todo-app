import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '../db';
import { todos, tags, todoTags } from '../db/schema';
import { eq, max, and } from 'drizzle-orm';
import { TagSchema, ErrorSchema } from '../../shared/schemas';

const TodoSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  title: z.string().openapi({ example: 'Faire les courses' }),
  completed: z.boolean().openapi({ example: false }),
  deadline: z.string().nullable().optional().openapi({ example: '2024-03-20' }),
  createdAt: z.string().openapi({ example: '2024-03-20T10:00:00Z' }),
  listId: z.number().openapi({ example: 1 }),
  order: z.number().openapi({ example: 0 }),
  tags: z.array(TagSchema).optional().openapi({ example: [{ id: 1, name: 'Urgent', color: '#ff0000' }] }),
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

export const todoRoutes = new OpenAPIHono();

// GET / — retourne tous les todos triés par order avec leurs tags
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
    
    // Fetch all tags for all todos in one or two queries could be better, 
    // but for simplicity let's fetch them now. 
    // In a real app we'd join todoTags and tags.
    const todosWithTags = await Promise.all(allTodos.map(async (todo) => {
      const associatedTags = await db
        .select({
          id: tags.id,
          name: tags.name,
          color: tags.color,
        })
        .from(todoTags)
        .innerJoin(tags, eq(todoTags.tagId, tags.id))
        .where(eq(todoTags.todoId, todo.id));

      return {
        ...todo,
        completed: !!todo.completed,
        createdAt: todo.createdAt || new Date().toISOString(),
        tags: associatedTags,
      };
    }));

    return c.json(todosWithTags, 200);
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
      completed: !!insertedTodo.completed,
      tags: [],
    }, 201);
  }
);

// POST /:id/tags — ajoute un tag à un todo
todoRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/{id}/tags',
    description: 'Ajoute un tag à un todo',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({ tagId: z.number() }),
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
        description: 'Tag ajouté avec succès',
      },
      404: {
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
        description: 'Todo ou Tag non trouvé',
      },
    },
  }),
  async (c) => {
    const todoId = parseInt(c.req.param('id'));
    const { tagId } = await c.req.valid('json');

    try {
      await db.insert(todoTags).values({ todoId, tagId }).onConflictDoNothing();
      return c.json({ success: true }, 200);
    } catch (e) {
      return c.json({ error: 'Conflict or Not Found' }, 404);
    }
  }
);

// DELETE /:id/tags/:tagId — retire un tag d'un todo
todoRoutes.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}/tags/{tagId}',
    description: 'Retire un tag d\'un todo',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
        tagId: z.string().openapi({ example: '1' }),
      }),
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({ success: z.boolean() }),
          },
        },
        description: 'Tag retiré avec succès',
      },
    },
  }),
  async (c) => {
    const todoId = parseInt(c.req.param('id'));
    const tagId = parseInt(c.req.param('tagId'));

    await db.delete(todoTags).where(and(eq(todoTags.todoId, todoId), eq(todoTags.tagId, tagId)));
    return c.json({ success: true }, 200);
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

    // Fetch tags to return complete Todo object
    const associatedTags = await db
      .select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
      })
      .from(todoTags)
      .innerJoin(tags, eq(todoTags.tagId, tags.id))
      .where(eq(todoTags.todoId, id));

    return c.json({
      ...updatedTodo,
      completed: !!updatedTodo.completed,
      tags: associatedTags,
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
