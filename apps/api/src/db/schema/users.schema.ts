import { pgTable, serial, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { dataEntries } from './entries.schema';

// Users table - stores all registered users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

// Roles table - defines available roles (admin, user, etc.)
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique()
});

// User-Roles junction table - many-to-many link between users and roles
export const userRoles = pgTable('user_roles', {
  userId: integer('user_id').references(() => users.id),
  roleId: integer('role_id').references(() => roles.id)
});

// A user has many user_roles entries
export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles)
}));

// A role has many user_roles entries
export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles)
}));

// Each user_roles entry belongs to one user and one role
export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id]
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id]
  })
}));

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
export type RoleRow = typeof roles.$inferSelect;
export type UserRoleRow = typeof userRoles.$inferSelect;
