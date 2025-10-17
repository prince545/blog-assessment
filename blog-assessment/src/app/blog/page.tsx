'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/trpc/react';

export default function BlogListPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const { data: categories } = api.category.list.useQuery();
  const { data: posts, isLoading, error } = api.post.list.useQuery({
    categoryId: selectedCategoryId ?? undefined,
  });

  return (
    <main className="container-page py-10">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">All Blog Posts</h1>
          <p className="text-muted-foreground">Browse posts and filter by category.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={selectedCategoryId === null ? 'default' : 'secondary'}
          onClick={() => setSelectedCategoryId(null)}
        >
          All
        </Button>
        {categories?.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategoryId === category.id ? 'default' : 'secondary'}
            onClick={() => setSelectedCategoryId(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {error && (
        <div className="rounded-md border bg-destructive/10 text-destructive px-4 py-3 mb-6">
          {error.message}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-36 rounded-lg border bg-muted" />
            </div>
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group">
              <Card className="flex flex-col justify-between h-full transition-colors group-hover:border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.content ?? 'This post has no content yet.'}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-wrap gap-2">
                    {post.postsToCategories.map(({ category }) => (
                      <Badge key={category.id} variant="outline">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border p-10 text-center">
          <p className="text-muted-foreground">No posts found{selectedCategoryId ? ' in this category' : ''}.</p>
        </div>
      )}
    </main>
  );
}
