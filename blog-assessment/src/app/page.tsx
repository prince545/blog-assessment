import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="container-page flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-16">
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <span>Open-source demo</span>
            <span className="h-1 w-1 rounded-full bg-primary" />
            <span>Type-safe tRPC + Drizzle</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Publish smarter. Discover faster.
          </h1>
          <p className="text-lg text-muted-foreground">
            A minimal, fast blog platform with a modern UI. Create posts, manage categories, and explore content.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Button asChild size="lg">
              <Link href="/blog">Explore Posts</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/create-post">Create Post</Link>
            </Button>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground justify-center md:justify-start">
            <div>
              <span className="block text-foreground font-semibold">Zero</span>
              Config
            </div>
            <div>
              <span className="block text-foreground font-semibold">Type-safe</span>
              End-to-end
            </div>
            <div>
              <span className="block text-foreground font-semibold">Modern</span>
              UI Kit
            </div>
          </div>
        </div>
        <div className="relative mx-auto md:mx-0 w-full aspect-[4/3] max-w-xl">
          <div className="absolute inset-0 rounded-xl border bg-gradient-to-br from-secondary to-background" />
          <div className="absolute inset-3 rounded-lg border bg-background grid place-items-center">
            <Image src="/window.svg" alt="Preview" width={512} height={384} className="opacity-80" />
          </div>
        </div>
      </section>

      <section className="border-t py-12">
        <div className="container-page text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Features</h2>
          <p className="text-muted-foreground mb-8">Everything you need to blog with style.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <Feature title="Editor">
              Write with a clean, accessible editor and preview instantly.
            </Feature>
            <Feature title="Categories">
              Organize your content with custom categories.
            </Feature>
            <Feature title="Dashboard">
              Manage posts at a glance with helpful tables and cards.
            </Feature>
          </div>
        </div>
      </section>

      <footer className="p-4 text-center text-sm text-muted-foreground">
        Built for the Full-Stack Assessment.
      </footer>
    </div>
  );
}

function Feature({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-6 bg-card">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-muted-foreground text-sm">{children}</p>
    </div>
  );
}