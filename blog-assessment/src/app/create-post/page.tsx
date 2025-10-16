import { PostForm } from "@/components/post-form";

export default function CreatePostPage() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Create New Post</h1>
      <PostForm />
    </main>
  );
}