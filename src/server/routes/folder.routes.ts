import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '../db';
import { folders } from '../db/schema';
import { eq } from 'drizzle-orm';

const FolderSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Work' }),
}).openapi('Folder');

const CreateFolderSchema = z.object({
  name: z.string().min(1).openapi({ example: 'Personal' }),
}).openapi('CreateFolder');

export const folderRoutes = new OpenAPIHono();

folderRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    description: 'Liste tous les dossiers',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(FolderSchema),
          },
        },
        description: 'Liste des dossiers récupérée avec succès',
      },
    },
  }),
  async (c) => {
    const allFolders = await db.select().from(folders);
    return c.json(allFolders, 200);
  }
);

folderRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    description: 'Crée un nouveau dossier',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateFolderSchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: FolderSchema,
          },
        },
        description: 'Dossier créé avec succès',
      },
    },
  }),
  async (c) => {
    const { name } = await c.req.valid('json');
    const [newFolder] = await db.insert(folders).values({ name }).returning();
    return c.json(newFolder, 201);
  }
);

folderRoutes.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    description: 'Supprime un dossier',
    request: {
      params: z.object({
        id: z.string().openapi({ example: '1' }),
      }),
    },
    responses: {
      204: {
        description: 'Dossier supprimé avec succès',
      },
      404: {
        description: 'Dossier non trouvé',
      },
    },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    const [deletedFolder] = await db.delete(folders).where(eq(folders.id, id)).returning();

    if (!deletedFolder) {
      return c.body(null, 404);
    }

    return c.body(null, 204);
  }
);
