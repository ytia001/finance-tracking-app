import { pgEnum, pgTable, numeric, serial, timestamp, integer } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

// Categories for expense/income tracking
export const categoryEnum = pgEnum('category', [
  'food_and_beverage',
  'groceries',
  'income',
  'transport',
  'gifts',
  'electrical_appliances',
  'others'
]);

export const dataEntries = pgTable('data_entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('date', { mode: 'date' }).notNull(),
  category: categoryEnum('category').notNull()
});

export type DataEntryRow = typeof dataEntries.$inferSelect;
export type NewDataEntryRow = typeof dataEntries.$inferInsert;
