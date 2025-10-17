import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { categories } from "@/db/schema";
import { TRPCError } from "@trpc/server";

export const categoryRouter = createTRPCRouter({
  // Procedure to create a new category
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Generate a slug from the name and ensure it fits DB constraints (<= 256)
      const baseSlug = input.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const suffix = `-${Date.now()}`; // timestamp for uniqueness
      const maxLen = 256;
      const fullSlug = (baseSlug + suffix).slice(0, maxLen);

      try {
        const inserted = await ctx.db
          .insert(categories)
          .values({
            name: input.name,
            description: input.description,
            slug: fullSlug,
          })
          .returning();

        return inserted[0];
      } catch (err: unknown) {
        // Postgres unique violation
        if (
          typeof err === "object" &&
          err !== null &&
          "code" in err &&
          (err as { code?: string }).code === "23505"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Category name or slug already exists.",
          });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create category." });
      }
    }),

  // Procedure to list all categories
  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
  }),
});