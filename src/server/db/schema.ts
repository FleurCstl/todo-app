import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const folders = sqliteTable('folders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

export const lists = sqliteTable('lists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  folderId: integer('folder_id').references(() => folders.id, { onDelete: 'cascade' }),
  icon: text('icon'),
  color: text('color'),
});

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  deadline: text('deadline'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  listId: integer('list_id').notNull().references(() => lists.id, { onDelete: 'cascade' }),
  order: integer('order').notNull().default(0),
});

export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;

export type TodoList = typeof lists.$inferSelect;
export type NewTodoList = typeof lists.$inferInsert;

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
