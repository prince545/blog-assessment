'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";

// Define the form schema for creating a category
const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required."),
});

export function CategoryManager() {
  const router = useRouter();

  // Fetch all existing categories
  const { data: categories, isLoading } = api.category.list.useQuery();

  // tRPC mutation to create a new category
  const createCategory = api.category.create.useMutation({
    onSuccess: () => {
      router.refresh(); // Refresh the page to show the new category in the list
      form.reset(); // Clear the form input
    },
    onError: (error) => {
      const msg = error?.message ?? "Failed to create category.";
      if (error?.data?.code === "CONFLICT") {
        form.setError("name", { type: "server", message: msg });
      } else {
        form.setError("name", { type: "server", message: msg });
      }
    },
  });

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "" },
  });

  function onSubmit(values: z.infer<typeof categoryFormSchema>) {
    createCategory.mutate(values);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Form for creating a new category */}
      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Create New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Technology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={createCategory.isPending}>
                  {createCategory.isPending ? "Creating..." : "Create"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* List of existing categories */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Existing Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 rounded bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {categories?.length ? (
                  categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                      <p className="font-medium">{category.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No categories yet. Create your first category.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}