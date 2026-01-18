import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { projects } from './project.js';

export const items = pgTable('items', {
  id: serial('id').primaryKey(),

  name: varchar('name', { length: 255 }).notNull(),
  manufacturer: varchar('manufacturer', { length: 255 }).notNull(),
  inventoryNumber: varchar('inventory_number', { length: 255 }).notNull(),
  itemNumber: varchar('item_number', { length: 255 }).notNull(),

  notes: varchar('notes'),

  qrCode: text('qr_code').notNull(),

  projectId: integer('project_id').references(() => projects.id, {
    onDelete: 'set null',
  }),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
