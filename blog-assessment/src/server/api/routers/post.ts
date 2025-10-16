// src/server/api/routers/post.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { posts, postsToCategories } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  // ... your create procedure remains the same ...
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        content: z.string().optional(),
        categoryIds: z.array(z.number()).optional(),
        published: z.boolean().default(false).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const [newPost] = await tx
          .insert(posts)
          .values({
            title: input.title,
            content: input.content,
            published: input.published ?? false,
            slug: `${input.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
          })
          .returning({ id: posts.id });
        if (input.categoryIds && input.categoryIds.length > 0) {
          await tx.insert(postsToCategories).values(
            input.categoryIds.map((categoryId) => ({
              postId: newPost.id,
              categoryId: categoryId,
            }))
          );
        }
      });
    }),

  // ✨ UPDATED LIST PROCEDURE ✨
  list: publicProcedure
    .input(
      z.object({
        categoryId: z.number().optional(), // Add optional categoryId input
      })
    )
    .query(({ ctx, input }) => {
      // If no category is selected, return all posts
      if (!input.categoryId) {
        return ctx.db.query.posts.findMany({
          with: {
            postsToCategories: {
              with: { category: true },
            },
          },
          orderBy: (posts, { desc }) => [desc(posts.createdAt)],
        });
      }

      // If a category is selected, filter using a subquery on the join table
      return ctx.db.query.posts.findMany({
        where: inArray(
          posts.id,
          ctx.db
            .select({ postId: postsToCategories.postId })
            .from(postsToCategories)
            .where(eq(postsToCategories.categoryId, input.categoryId))
        ),
        with: {
          postsToCategories: {
            with: { category: true },
          },
        },
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      });
    }),

  // ✨ ADD DELETE PROCEDURE ✨
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx.delete(postsToCategories).where(eq(postsToCategories.postId, input.id));
        await tx.delete(posts).where(eq(posts.id, input.id));
      });
    }),

  // Get a single post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.posts.findFirst({
        where: eq(posts.slug, input.slug),
        with: {
          postsToCategories: {
            with: { category: true },
          },
        },
      });
    }),

  // Get a single post by id
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
        with: {
          postsToCategories: true,
        },
      });
    }),

  // Update a post and its categories
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        content: z.string().optional(),
        categoryIds: z.array(z.number()).optional(),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx
          .update(posts)
          .set({ title: input.title, content: input.content, published: input.published })
          .where(eq(posts.id, input.id));

        await tx
          .delete(postsToCategories)
          .where(eq(postsToCategories.postId, input.id));

        if (input.categoryIds && input.categoryIds.length > 0) {
          await tx.insert(postsToCategories).values(
            input.categoryIds.map((categoryId) => ({
              postId: input.id,
              categoryId,
            }))
          );
        }
      });
    }),
});