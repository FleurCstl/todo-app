import { hc } from 'hono/client';
import type { AppType } from '../server';

// On utilise l'URL relative car Vite proxy /api vers Hono
// @ts-ignore
export const api = hc<AppType>('/').api;
