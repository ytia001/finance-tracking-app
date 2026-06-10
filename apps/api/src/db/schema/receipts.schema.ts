import { pgEnum, pgTable, uuid, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

const receiptStatusEnum = pgEnum('receipt_status', ['PROCESSING', 'PENDING', 'COMPLETED', 'FAILED']);

export const receiptJobs = pgTable('receipt_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  tabscannerToken: varchar('tabscanner_token', { length: 255 }).notNull(),
  tabscannerJobId: varchar('tabscanner_job_id', { length: 255 }),
  status: receiptStatusEnum('status').notNull().default('PROCESSING'),
  parsedData: jsonb('parsed_data'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});
