'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";

type PostWithCategories = {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  postsToCategories: { postId: number; categoryId: number }[];
};

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  content: z.string().optional(),
  categoryIds: z.array(z.number()).optional(),
  published: z.boolean().default(false).optional(),
});

export function PostForm({ existingPost }: { existingPost?: PostWithCategories | null }) {
  const router = useRouter();
  const { data: categories, isLoading: isLoadingCategories } = api.category.list.useQuery();

  const updatePost = api.post.update.useMutation({
    onSuccess: () => {
      router.refresh();
      router.push("/dashboard");
    },
  });

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      router.push("/dashboard");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: existingPost?.title ?? "",
      content: existingPost?.content ?? "",
      categoryIds: existingPost?.postsToCategories?.map((pc) => pc.categoryId) ?? [],
      published: existingPost?.published ?? false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (existingPost) {
      updatePost.mutate({ id: existingPost.id, ...values });
    } else {
      createPost.mutate(values);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your content..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Categories</FormLabel>
                <FormDescription>Select the categories for this post.</FormDescription>
              </div>
              {isLoadingCategories ? (
                <p>Loading categories...</p>
              ) : (
                categories?.map((category) => (
                  <FormField
                    key={category.id}
                    control={form.control}
                    name="categoryIds"
                    render={({ field }) => (
                      <FormItem key={category.id} className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(category.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value ?? []), category.id])
                                : field.onChange(field.value?.filter((value: number) => value !== category.id));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{category.name}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3">
              <FormControl>
                <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Published</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createPost.isPending || updatePost.isPending}>
          {createPost.isPending || updatePost.isPending ? "Submitting..." : existingPost ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
