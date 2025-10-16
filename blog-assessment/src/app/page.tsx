import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="flex-grow flex items-center justify-center text-center p-8">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            Welcome to the Blogging Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Create, share, and discover amazing content.
          </p>
          <Button asChild size="lg">
            <Link href="/blog">Explore Posts</Link>
          </Button>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button asChild variant="secondary">
              <Link href="/create-post">Create Post</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/dashboard/categories">Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-secondary p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Features</h2>
      </section>

      <footer className="p-4 text-center text-sm text-muted-foreground">
        Built for the Full-Stack Assessment.
      </footer>
    </div>
  );
}