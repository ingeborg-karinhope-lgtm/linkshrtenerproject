import { pgTable, serial, varchar, text, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const shortLinks = pgTable('short_links', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 128 }).notNull(),
  originalUrl: text('original_url').notNull(),
  title: text('title'),
  clicks: integer('clicks').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, ({ userId, slug }) => ({
  userSlug: uniqueIndex('short_links_user_id_slug_key').on(userId, slug),
}));
