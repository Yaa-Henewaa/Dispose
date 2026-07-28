import { prisma } from "@/lib/prisma";
import CategoryManager from "./CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    include: { children: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800">Categories</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
