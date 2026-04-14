import { OpenAPIHono } from '@hono/zod-openapi';
import { todoRoutes } from './routes/todo.routes';
import { folderRoutes } from './routes/folder.routes';
import { listRoutes } from './routes/list.routes';
import { tagRoutes } from './routes/tag.routes';
import { setupDocs } from './docs';

const app = new OpenAPIHono()
  .route('/api/todos', todoRoutes)
  .route('/api/folders', folderRoutes)
  .route('/api/lists', listRoutes)
  .route('/api/tags', tagRoutes);

// Configuration de la documentation
setupDocs(app);

// Export pour le serveur de développement Vite
export default app;

// Export du type pour le client RPC (E2E Type Safety)
export type AppType = typeof app;
