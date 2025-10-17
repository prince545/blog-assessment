## Full-Stack Blogging Platform (Assessment)

Modern multi-user blogging app built with Next.js 15 App Router, tRPC, Drizzle ORM, and PostgreSQL.

### Tech Stack
- Next.js 15 (App Router)
- TypeScript
- tRPC 11 + React Query
- Drizzle ORM + PostgreSQL
- Tailwind CSS v4
- Zod for validation

### Features
- Blog post CRUD with category assignment
- Category CRUD
- Blog listing with category filtering
- Individual post view (Markdown rendering)
- Dashboard for managing posts (draft/published)
- Loading/error/empty states
- Responsive layout, dark mode toggle

### Setup
1) Clone and install
```bash
git clone <your-repo>
cd blog-assessment
npm install
```

2) Environment variables (`.env.local`)
```bash
DATABASE_URL=postgres://user:password@host:port/db
```

3) Database and Drizzle
```bash
# Generate migrations (after editing schema if needed)
npx drizzle-kit generate

# Push to database
npx drizzle-kit push
```

4) Run
```bash
npm run dev
# open http://localhost:3000
```

### tRPC Router Overview
- `src/server/api/routers/post.ts`
  - `create`, `list({ categoryId? })`, `getBySlug`, `getById`, `update`, `delete`
- `src/server/api/routers/category.ts`
  - `create`, `list`

Inputs validated with Zod; DB writes use transactions; slugs generated from titles/names.

### Project Structure
```text
src/app
  ├─ page.tsx                 # Landing
  ├─ blog/page.tsx            # Listing + filters
  ├─ blog/[slug]/page.tsx     # Single post
  ├─ dashboard/page.tsx       # Manage posts
  ├─ dashboard/categories     # Category manager
  └─ create-post              # Create post form
src/server/api/routers        # tRPC routers
src/db/schema.ts              # Drizzle schema
```

### Feature Checklist
Must Have
- [x] Post CRUD (create, read, update, delete)
- [x] Category CRUD
- [x] Assign categories to posts
- [x] Blog listing page
- [x] Individual post page
- [x] Category filtering
- [x] Responsive navigation
- [x] Clean, professional UI

Should Have
- [x] Landing page (Header/Hero, Features, Footer)
- [x] Dashboard for posts
- [x] Draft vs Published
- [x] Loading and error states
- [x] Mobile responsive
- [x] Markdown editor (textarea + renderer)

Nice to Have
- [x] Dark mode
- [ ] Search
- [ ] Reading time / word count
- [ ] Image upload
- [ ] Preview mode
- [ ] SEO meta tags
- [ ] Pagination

### Deployment
Deploy with Vercel:
1) Set `DATABASE_URL` in project settings
2) Run migrations during build or via Drizzle Studio
3) `npm run build && npm run start`

### Assumptions & Decisions
- No auth per spec; all actions public
- Markdown chosen over rich text for speed
- Slugs use name/title + timestamp for uniqueness

### Time Spent
- UI polish and core features: ~12–16 hrs window
