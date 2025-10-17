'use client';

import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export default function PostPage() {
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading } = api.post.getBySlug.useQuery({
    slug: params.slug,
  });

  if (isLoading) {
    return (
      <main className="container-page py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-2/3 rounded bg-muted" />
          <div className="h-6 w-1/3 rounded bg-muted" />
          <div className="h-64 rounded bg-muted" />
        </div>
      </main>
    );
  }
  if (!post) {
    return (
      <main className="container-page py-16 text-center">
        <div className="mx-auto max-w-lg">
          <h1 className="text-2xl font-bold mb-2">Post not found</h1>
          <p className="text-muted-foreground mb-6">The article you are looking for does not exist.</p>
          <Link href="/blog" className="text-primary underline-offset-4 hover:underline">Back to blog</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-page py-10">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap gap-2 mb-8">
          {post.postsToCategories.map((ptc: { category: { id: number; name: string } }) => (
            <Badge key={ptc.category.id} variant="secondary">
              {ptc.category.name}
            </Badge>
          ))}
        </div>
        <div className="rounded-xl border p-6">
          <div className="prose dark:prose-invert">
            <ReactMarkdown>{post.content ?? ""}</ReactMarkdown>
          </div>
        </div>
      </article>
    </main>
  );
}
