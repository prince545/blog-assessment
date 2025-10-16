'use client';

import { useParams } from 'next/navigation';
import { api } from '@/trpc/react';
import { PostForm } from '@/components/post-form';

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);

  const { data: post, isLoading } = api.post.getById.useQuery({ id: postId });

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Edit Post</h1>
      <PostForm existingPost={post} />
    </main>
  );
}
