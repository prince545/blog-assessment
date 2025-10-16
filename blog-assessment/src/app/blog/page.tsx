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
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">All Blog Posts</h1>

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

      {isLoading && <div>Loading posts...</div>}
      {error && <div>Error: {error.message}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id}>
            <Card className="flex flex-col justify-between h-full hover:border-primary">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">
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
    </main>
  );
}
