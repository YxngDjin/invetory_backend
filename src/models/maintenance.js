import {
  pgTable,
  serial,
  integer,
  date,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { items } from './item.js';

export const maintenance = pgTable('maintenance', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),

  itemId: integer('item_id')
    .notNull()
    .references(() => items.id, { onDelete: 'cascade' }),

  date: date('date').notNull(),
  nextDue: date('next_due'),

  notes: text('notes'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
