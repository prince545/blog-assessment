import { CategoryManager } from "./_components/category-manager";

export default function CategoriesPage() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Manage Categories</h1>
      <CategoryManager />
    </main>
  );
}