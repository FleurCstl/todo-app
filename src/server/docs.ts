import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

export function setupDocs(app: OpenAPIHono) {
  // Swagger UI
  app.get(
    '/api/docs',
    swaggerUI({
      url: '/api/openapi.json',
    })
  );

  // OpenAPI JSON
  app.doc('/api/openapi.json', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Todo API',
      description: 'API REST pour la gestion des todos avec Hono et SQLite',
    },
  });
}
