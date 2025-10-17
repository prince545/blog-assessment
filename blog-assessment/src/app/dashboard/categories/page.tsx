import { CategoryManager } from "./_components/category-manager";

export default function CategoriesPage() {
  return (
    <main className="container-page py-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Manage Categories</h1>
      <CategoryManager />
    </main>
  );
}