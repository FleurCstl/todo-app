import { z } from '@hono/zod-openapi';

export const TagSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().min(1).openapi({ example: 'Urgent' }),
  color: z.string().openapi({ example: '#ef4444' }),
}).openapi('Tag');

export const CreateTagSchema = z.object({
  name: z.string().min(1).openapi({ example: 'Urgent' }),
  color: z.string().openapi({ example: '#ef4444' }),
}).openapi('CreateTag');

export const UpdateTagSchema = z.object({
  name: z.string().min(1).optional().openapi({ example: 'High Priority' }),
  color: z.string().optional().openapi({ example: '#dc2626' }),
}).openapi('UpdateTag');

export const TodoTagSchema = z.object({
  todoId: z.number().openapi({ example: 1 }),
  tagId: z.number().openapi({ example: 1 }),
}).openapi('TodoTag');

export const ErrorSchema = z.object({
  error: z.string().openapi({ example: 'Not Found' }),
}).openapi('Error');
