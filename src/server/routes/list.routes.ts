import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '../db';
import { lists } from '../db/schema';
import { eq } from 'drizzle-orm';

const ListSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  title: z.string().openapi({ example: 'Inbox' }),
  folderId: z.number().nullable().openapi({ example: 1 }),
  icon: z.string().nullable().openapi({ example: 'List' }),
  color: z.string().nullable().openapi({ example: '#E27D60' }),
}).openapi('List');

const CreateListSchema = z.object({
  title: z.string().min(1).openapi({ example: 'Inbox' }),
  folderId: z.number().nullable().optional().openapi({ example: 1 }),
  icon: z.string().optional().openapi({ example: 'List' }),
  color: z.string().optional().openapi({ example: '#E27D60' }),
}).openapi('CreateList');

const UpdateListSchema = z.object({
  title: z.string().min(1).optional().openapi({ example: 'Inbox' }),
  folderId: z.number().nullable().optional().openapi({ example: 1 }),
  icon: z.string().optional().openapi({ example: 'List' }),
  color: z.string().optional().openapi({ example: '#E27D60' }),
}).openapi('UpdateList');

export const listRoutes = new OpenAPIHono();

listRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    description: 'Liste toutes les listes',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(ListSchema),
          },
        },
        description: 'Liste des listes récupérée avec succès',
      },
    },
  }),
  async (c) => {
    const allLists = await db.select().from(lists);
    return c.json(allLists, 200);
  }
);

listRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    description: 'Crée une nouvelle liste',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateListSchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: ListSchema,
          },
        },
        description: 'Liste créée avec succès',
      },
    },
  }),
  async (c) => {
    const body = await c.req.valid('json');
    const [newList] = await db.insert(lists).values(body).returning();
    return c.json(newList, 201);
  }
);

listRoutes.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    description: 'Met à jour une liste',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: UpdateListSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: ListSchema,
          },
        },
        description: 'Liste mise à jour avec succès',
      },
      404: {
        description: 'Liste non trouvée',
      },
    },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.valid('json');
    const [updatedList] = await db.update(lists).set(body).where(eq(lists.id, id)).returning();

    if (!updatedList) {
      return c.body(null, 404);
    }

    return c.json(updatedList, 200);
  }
);

listRoutes.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    description: 'Supprime une liste',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
      }),
    },
    responses: {
      204: {
        description: 'Liste supprimée avec succès',
      },
      404: {
        description: 'Liste non trouvée',
      },
    },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    const [deletedList] = await db.delete(lists).where(eq(lists.id, id)).returning();

    if (!deletedList) {
      return c.body(null, 404);
    }

    return c.body(null, 204);
  }
);
