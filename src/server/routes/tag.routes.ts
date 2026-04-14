import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '../db';
import { tags } from '../db/schema';
import { eq } from 'drizzle-orm';
import { TagSchema, CreateTagSchema, UpdateTagSchema, ErrorSchema } from '../../shared/schemas';

export const tagRoutes = new OpenAPIHono();

// GET / — Liste tous les tags
tagRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    description: 'Liste tous les tags',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(TagSchema),
          },
        },
        description: 'Liste des tags récupérée avec succès',
      },
    },
  }),
  async (c) => {
    const allTags = await db.select().from(tags);
    return c.json(allTags, 200);
  }
);

// POST / — Crée un nouveau tag
tagRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    description: 'Crée un nouveau tag',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateTagSchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: TagSchema,
          },
        },
        description: 'Tag créé avec succès',
      },
    },
  }),
  async (c) => {
    const body = await c.req.valid('json');
    const [insertedTag] = await db.insert(tags).values(body).returning();
    return c.json(insertedTag, 201);
  }
);

// PATCH /:id — Met à jour un tag
tagRoutes.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    description: 'Met à jour un tag',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: UpdateTagSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: TagSchema,
          },
        },
        description: 'Tag mis à jour avec succès',
      },
      404: {
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
        description: 'Tag non trouvé',
      },
    },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.valid('json');
    
    const [updatedTag] = await db
      .update(tags)
      .set(body)
      .where(eq(tags.id, id))
      .returning();

    if (!updatedTag) {
      return c.json({ error: 'Not Found' }, 404);
    }

    return c.json(updatedTag, 200);
  }
);

// DELETE /:id — Supprime un tag
tagRoutes.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    description: 'Supprime un tag',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
      }),
    },
    responses: {
      204: {
        description: 'Tag supprimé avec succès',
      },
      404: {
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
        description: 'Tag non trouvé',
      },
    },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    const [deletedTag] = await db.delete(tags).where(eq(tags.id, id)).returning();

    if (!deletedTag) {
      return c.json({ error: 'Not Found' }, 404);
    }

    return c.body(null, 204);
  }
);
