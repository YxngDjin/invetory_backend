import {
  pgTable,
  serial,
  varchar,
  boolean,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),

  name: varchar('name', { length: 255 }).notNull(),
  vgNumber: varchar('vg_number', { length: 255 }).notNull(),
  description: text('description'),

  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
