import { pgTable, serial, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'user',
  'guest',
]);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),

  firstname: varchar('firstname', { length: 100 }).notNull(),
  lastname: varchar('lastname', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),

  role: userRoleEnum('role').notNull().default('user'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().defaultNow().notNull(),
});