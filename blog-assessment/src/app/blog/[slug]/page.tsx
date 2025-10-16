'use client';

import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import ReactMarkdown from "react-markdown";

export default function PostPage() {
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading } = api.post.getBySlug.useQuery({
    slug: params.slug,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <main className="container max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        {post.title}
      </h1>
      <div className="flex flex-wrap gap-2 mb-8">
        {post.postsToCategories.map(({ category }) => (
          <Badge key={category.id} variant="secondary">
            {category.name}
          </Badge>
        ))}
      </div>
      <article className="prose dark:prose-invert">
        <ReactMarkdown>{post.content ?? ""}</ReactMarkdown>
      </article>
    </main>
  );
}
