import { relations } from 'drizzle-orm';
import { projects } from './project.js';
import { items } from './item.js';
import { maintenance } from './maintenance.js';

export const projectRelations = relations(projects, ({ many }) => ({
  items: many(items),
}));

export const itemRelations = relations(items, ({ one, many }) => ({
  project: one(projects, {
    fields: [items.projectId],
    references: [projects.id],
  }),
  maintenance: many(maintenance),
}));

export const maintenanceRelations = relations(maintenance, ({ one }) => ({
  item: one(items, {
    fields: [maintenance.itemId],
    references: [items.id],
  }),
}));
