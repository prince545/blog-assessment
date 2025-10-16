import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

// POSTS TABLE
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  content: text('content'),
  slug: varchar('slug', { length: 256 }).notNull().unique(),
  published: boolean('published').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// CATEGORIES TABLE
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  description: text('description'),
  slug: varchar('slug', { length: 256 }).notNull().unique(),
});

// JOIN TABLE FOR MANY-TO-MANY RELATIONSHIP
export const postsToCategories = pgTable('posts_to_categories', {
    postId: integer('post_id').notNull().references(() => posts.id),
    categoryId: integer('category_id').notNull().references(() => categories.id),
  }, (t) => ({
    pk: primaryKey({ columns: [t.postId, t.categoryId] }),
  })
);

// DRIZZLE RELATIONS (for type-safe queries)
export const postsRelations = relations(posts, ({ many }) => ({
    postsToCategories: many(postsToCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
    postsToCategories: many(postsToCategories),
}));

export const postsToCategoriesRelations = relations(postsToCategories, ({ one }) => ({
    post: one(posts, { fields: [postsToCategories.postId], references: [posts.id] }),
    category: one(categories, { fields: [postsToCategories.categoryId], references: [categories.id] }),
}));