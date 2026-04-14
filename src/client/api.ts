import { hc } from 'hono/client';
import type { AppType } from '../server';

// On utilise l'URL relative car Vite proxy /api vers Hono
// @ts-expect-error - Hono client types sometimes struggle with complex schemas in dev
export const api = hc<AppType>('/').api;
